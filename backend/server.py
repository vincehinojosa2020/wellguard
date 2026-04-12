import re
from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import json
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import uuid
import random
from datetime import datetime, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'typea')]

# Create the main app
app = FastAPI(title="Type-A Platform API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

ALLOWED_SCAN_TYPES = {"image", "repo", "fs", "sbom"}
# Regex: allow alphanumeric, colons, slashes, dots, hyphens, underscores, @ for image tags/repo URLs
TARGET_PATTERN = re.compile(r'^[a-zA-Z0-9_./:@\-]+$')


class ScanRequest(BaseModel):
    target: str
    scan_type: str = "image"


class CustomerFilterParams(BaseModel):
    """Grouped filter parameters for customer list endpoint."""
    search: Optional[str] = None
    tier: Optional[str] = None
    status: Optional[str] = None
    industry: Optional[str] = None
    region: Optional[str] = None
    sort_by: str = "health_score"
    sort_order: str = "asc"
    limit: int = 50
    skip: int = 0


# ==================== INPUT VALIDATION ====================

def sanitize_scan_target(target: str) -> str:
    """Sanitize scan target to prevent command injection."""
    target = target.strip()
    if not target:
        raise ValueError("Target cannot be empty")
    if len(target) > 500:
        raise ValueError("Target too long")
    # Allow repo URLs (https://...) by checking separately
    if target.startswith("https://") or target.startswith("http://"):
        # URL pattern - allow letters, digits, and URL-safe characters
        if not re.match(r'^https?://[a-zA-Z0-9_./:@\-]+$', target):
            raise ValueError("Invalid repository URL format")
    elif not TARGET_PATTERN.match(target):
        raise ValueError("Target contains invalid characters")
    return target


# ==================== TRIVY PARSING HELPERS ====================

def _extract_cvss_score(vuln_data: dict) -> float:
    """Extract the highest available CVSS score from vulnerability data."""
    cvss_data = vuln_data.get("CVSS", {})
    if cvss_data:
        for source_data in cvss_data.values():
            if "V3Score" in source_data:
                return source_data["V3Score"]
            if "V2Score" in source_data:
                return source_data["V2Score"]
    # Fallback based on severity
    severity = vuln_data.get("Severity", "UNKNOWN").upper()
    fallback_scores = {"CRITICAL": 9.5, "HIGH": 7.5, "MEDIUM": 5.0, "LOW": 2.5, "UNKNOWN": 0}
    return fallback_scores.get(severity, 0)


def _parse_single_vulnerability(vuln: dict, target: str, result_type: str) -> dict:
    """Parse a single vulnerability entry from Trivy output."""
    severity = vuln.get("Severity", "UNKNOWN").upper()
    return {
        "id": str(uuid.uuid4()),
        "vuln_id": vuln.get("VulnerabilityID", "unknown"),
        "title": vuln.get("Title", vuln.get("VulnerabilityID", "Unknown vulnerability")),
        "severity": severity,
        "cvss": _extract_cvss_score(vuln),
        "component": vuln.get("PkgName", "unknown"),
        "version": vuln.get("InstalledVersion", "unknown"),
        "fixed_version": vuln.get("FixedVersion", "No fix available"),
        "description": vuln.get("Description", "No description available"),
        "published": vuln.get("PublishedDate", ""),
        "source": "Trivy",
        "target": target,
        "target_type": result_type,
        "references": vuln.get("References", [])[:5],
    }


def parse_trivy_output(trivy_json: dict) -> dict:
    """Parse Trivy JSON output into our vulnerability format."""
    vulnerabilities = []
    components = set()
    severity_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0, "UNKNOWN": 0}

    for result in trivy_json.get("Results", []):
        target = result.get("Target", "unknown")
        result_type = result.get("Type", "unknown")

        for vuln in result.get("Vulnerabilities", []):
            severity = vuln.get("Severity", "UNKNOWN").upper()
            severity_counts[severity] = severity_counts.get(severity, 0) + 1

            pkg_name = vuln.get("PkgName", "unknown")
            components.add(f"{pkg_name}@{vuln.get('InstalledVersion', 'unknown')}")

            vuln_entry = _parse_single_vulnerability(vuln, target, result_type)
            vulnerabilities.append(vuln_entry)

    return {
        "vulnerabilities": vulnerabilities,
        "components": list(components),
        "severity_counts": severity_counts,
        "total_vulns": len(vulnerabilities),
        "total_components": len(components),
    }


# ==================== TRIVY SCAN HELPERS ====================

def _build_trivy_command(target: str, scan_type: str) -> list:
    """Build the Trivy CLI command based on scan type."""
    base_flags = ["--format", "json", "--severity", "CRITICAL,HIGH,MEDIUM,LOW"]

    type_map = {
        "image": ["image"] + base_flags + [target],
        "repo": ["repo"] + base_flags + [target],
        "fs": ["fs"] + base_flags + [target],
        "sbom": ["sbom", "--format", "json", target],
    }
    sub_cmd = type_map.get(scan_type, type_map["image"])
    return ["trivy"] + sub_cmd


def _format_duration(seconds: float) -> str:
    """Format duration in seconds to human-readable string."""
    if seconds >= 60:
        return f"{int(seconds // 60)}m {int(seconds % 60)}s"
    return f"{int(seconds)}s"


async def _execute_trivy_process(cmd: list) -> tuple:
    """Execute Trivy CLI and return stdout, stderr. Raises on timeout."""
    process = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await asyncio.wait_for(process.communicate(), timeout=300)
    return stdout, stderr


async def _store_scan_vulnerabilities(parsed: dict, scan_id: str):
    """Store parsed vulnerabilities in MongoDB."""
    if not parsed["vulnerabilities"]:
        return
    now_iso = datetime.utcnow().isoformat()
    for v in parsed["vulnerabilities"]:
        v["scan_id"] = scan_id
        v["created_at"] = now_iso
    await db.vulnerabilities.insert_many(parsed["vulnerabilities"])


async def _store_scan_components(parsed: dict, scan_id: str):
    """Store parsed components in MongoDB."""
    for comp_str in parsed["components"]:
        parts = comp_str.split("@")
        comp_name = parts[0]
        comp_version = parts[1] if len(parts) > 1 else "unknown"

        comp_vulns = [v for v in parsed["vulnerabilities"] if v["component"] == comp_name]
        max_cvss = max((v["cvss"] for v in comp_vulns), default=0)

        await db.components.update_one(
            {"name": comp_name, "version": comp_version},
            {"$set": {
                "name": comp_name,
                "version": comp_version,
                "ecosystem": "auto-detected",
                "vulnerabilities": len(comp_vulns),
                "risk_score": max_cvss,
                "scan_id": scan_id,
                "updated_at": datetime.utcnow().isoformat(),
            }},
            upsert=True,
        )


async def _update_scan_status(scan_id: str, updates: dict):
    """Update scan document in MongoDB."""
    await db.scans.update_one({"id": scan_id}, {"$set": updates})


async def run_trivy_scan(scan_id: str, target: str, scan_type: str):
    """Run Trivy scan in background and store results."""
    try:
        await _update_scan_status(scan_id, {"status": "scanning"})
        start_time = datetime.utcnow()

        cmd = _build_trivy_command(target, scan_type)
        logger.info(f"Running Trivy: {' '.join(cmd)}")

        try:
            stdout, stderr = await _execute_trivy_process(cmd)
        except asyncio.TimeoutError:
            await _update_scan_status(scan_id, {"status": "timeout", "error": "Scan timed out after 5 minutes"})
            return

        end_time = datetime.utcnow()
        duration_str = _format_duration((end_time - start_time).total_seconds())

        if not stdout:
            stderr_text = stderr.decode('utf-8') if stderr else "No output"
            logger.error(f"Trivy returned no output: {stderr_text}")
            await _update_scan_status(scan_id, {
                "status": "error", "completed_at": end_time.isoformat(),
                "duration": duration_str, "error": stderr_text[:500],
            })
            return

        try:
            trivy_output = json.loads(stdout.decode('utf-8'))
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Trivy output: {e}")
            stderr_text = stderr.decode('utf-8') if stderr else ""
            await _update_scan_status(scan_id, {
                "status": "error", "completed_at": end_time.isoformat(),
                "duration": duration_str, "error": f"Parse error. {stderr_text[:500]}",
            })
            return

        parsed = parse_trivy_output(trivy_output)
        await _store_scan_vulnerabilities(parsed, scan_id)
        await _store_scan_components(parsed, scan_id)
        await _update_scan_status(scan_id, {
            "status": "completed",
            "completed_at": end_time.isoformat(),
            "duration": duration_str,
            "summary": {
                "total_vulnerabilities": parsed["total_vulns"],
                "total_components": parsed["total_components"],
                "severity_counts": parsed["severity_counts"],
            },
            "raw_component_count": parsed["total_components"],
        })
        logger.info(f"Scan {scan_id} completed: {parsed['total_vulns']} vulns, {parsed['total_components']} components")

    except Exception as e:
        logger.error(f"Scan error: {e}")
        await _update_scan_status(scan_id, {"status": "error", "error": str(e)[:500]})


# ==================== API ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Type-A Platform API", "version": "1.0.0"}


# --- Dashboard ---
@api_router.get("/dashboard/stats")
async def get_dashboard_stats():
    total_scans = await db.scans.count_documents({})
    total_vulns = await db.vulnerabilities.count_documents({})
    total_components = await db.components.count_documents({})

    critical = await db.vulnerabilities.count_documents({"severity": "CRITICAL"})
    high = await db.vulnerabilities.count_documents({"severity": "HIGH"})
    medium = await db.vulnerabilities.count_documents({"severity": "MEDIUM"})
    low = await db.vulnerabilities.count_documents({"severity": "LOW"})

    recent_scans = await db.scans.find(
        {"status": "completed"}, {"summary": 1, "completed_at": 1, "target": 1, "_id": 0}
    ).sort("completed_at", -1).limit(20).to_list(20)

    return {
        "total_scans": total_scans,
        "completed_scans": await db.scans.count_documents({"status": "completed"}),
        "total_vulnerabilities": total_vulns,
        "total_components": total_components,
        "severity": {"critical": critical, "high": high, "medium": medium, "low": low},
        "recent_scans": recent_scans,
    }


# --- Scans ---
@api_router.post("/scans")
async def create_scan(request: ScanRequest, background_tasks: BackgroundTasks):
    # Validate scan type
    scan_type = request.scan_type if request.scan_type in ALLOWED_SCAN_TYPES else "image"

    # Sanitize target input to prevent command injection
    try:
        clean_target = sanitize_scan_target(request.target)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    scan_id = str(uuid.uuid4())
    scan_doc = {
        "id": scan_id,
        "target": clean_target,
        "scan_type": scan_type,
        "status": "queued",
        "created_at": datetime.utcnow().isoformat(),
        "completed_at": None, "duration": None, "summary": None, "error": None,
    }
    await db.scans.insert_one(scan_doc)
    background_tasks.add_task(run_trivy_scan, scan_id, clean_target, scan_type)
    return {"id": scan_id, "status": "queued", "message": f"Scan initiated for {clean_target}"}


@api_router.get("/scans")
async def list_scans(limit: int = 20, skip: int = 0):
    scans = await db.scans.find({}, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    total = await db.scans.count_documents({})
    return {"scans": scans, "total": total}


@api_router.get("/scans/{scan_id}")
async def get_scan(scan_id: str):
    scan = await db.scans.find_one({"id": scan_id}, {"_id": 0})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    vulns = await db.vulnerabilities.find({"scan_id": scan_id}, {"_id": 0}).sort("cvss", -1).to_list(1000)
    scan["vulnerabilities"] = vulns
    return scan


# --- Vulnerabilities ---
@api_router.get("/vulnerabilities")
async def list_vulnerabilities(
    severity: Optional[str] = None,
    component: Optional[str] = None,
    scan_id: Optional[str] = None,
    limit: int = 50,
    skip: int = 0,
):
    query = {}
    if severity:
        query["severity"] = severity.upper()
    if component:
        query["component"] = {"$regex": component, "$options": "i"}
    if scan_id:
        query["scan_id"] = scan_id

    vulns = await db.vulnerabilities.find(query, {"_id": 0}).sort("cvss", -1).skip(skip).limit(limit).to_list(limit)
    total = await db.vulnerabilities.count_documents(query)
    return {"vulnerabilities": vulns, "total": total}


# --- Components ---
@api_router.get("/components")
async def list_components(ecosystem: Optional[str] = None, limit: int = 100, skip: int = 0):
    query = {}
    if ecosystem:
        query["ecosystem"] = ecosystem
    components = await db.components.find(query, {"_id": 0}).sort("risk_score", -1).skip(skip).limit(limit).to_list(limit)
    total = await db.components.count_documents(query)
    return {"components": components, "total": total}


# --- Seed Data ---
@api_router.post("/seed")
async def seed_data():
    """Seed initial demo data for showcase."""
    existing = await db.scans.count_documents({})
    if existing > 0:
        return {"message": "Data already exists", "scans": existing}

    demo_scans = [
        {
            "id": str(uuid.uuid4()), "target": "nginx:latest", "scan_type": "image", "status": "completed",
            "created_at": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
            "completed_at": (datetime.utcnow() - timedelta(hours=2, minutes=-3)).isoformat(),
            "duration": "2m 34s",
            "summary": {"total_vulnerabilities": 85, "total_components": 234, "severity_counts": {"CRITICAL": 5, "HIGH": 12, "MEDIUM": 23, "LOW": 45}},
        },
        {
            "id": str(uuid.uuid4()), "target": "python:3.11-slim", "scan_type": "image", "status": "completed",
            "created_at": (datetime.utcnow() - timedelta(hours=5)).isoformat(),
            "completed_at": (datetime.utcnow() - timedelta(hours=5, minutes=-4)).isoformat(),
            "duration": "4m 12s",
            "summary": {"total_vulnerabilities": 125, "total_components": 387, "severity_counts": {"CRITICAL": 8, "HIGH": 22, "MEDIUM": 35, "LOW": 60}},
        },
        {
            "id": str(uuid.uuid4()), "target": "node:20-alpine", "scan_type": "image", "status": "completed",
            "created_at": (datetime.utcnow() - timedelta(hours=8)).isoformat(),
            "completed_at": (datetime.utcnow() - timedelta(hours=8, minutes=-1)).isoformat(),
            "duration": "1m 45s",
            "summary": {"total_vulnerabilities": 42, "total_components": 156, "severity_counts": {"CRITICAL": 1, "HIGH": 6, "MEDIUM": 15, "LOW": 20}},
        },
    ]
    await db.scans.insert_many(demo_scans)
    return {"message": "Seeded demo data", "scans": len(demo_scans)}


# Include router
app.include_router(api_router)


# ==================== ADMIN / SUPPORT ENGINEERING ROUTES ====================

from seed_data import (
    generate_customers, generate_customer_scans, generate_customer_vulns,
    generate_support_tickets,
)

admin_router = APIRouter(prefix="/api/admin")


async def _create_admin_indexes():
    """Create MongoDB indexes for admin collections."""
    for field in ["name", "tier", "status", "industry", "region", "health_score"]:
        await db.customers.create_index(field)
    await db.support_tickets.create_index("customer_id")
    await db.support_tickets.create_index("status")


async def _aggregate_customer_totals() -> dict:
    """Aggregate total counts from all customers."""
    pipeline = [{"$group": {
        "_id": None,
        "total_apps": {"$sum": "$application_count"},
        "total_scans": {"$sum": "$scan_count"},
        "total_components": {"$sum": "$component_count"},
        "total_developers": {"$sum": "$developer_count"},
        "total_mrr": {"$sum": "$mrr"},
        "avg_health": {"$avg": "$health_score"},
        "total_critical": {"$sum": "$vulnerabilities.critical"},
        "total_high": {"$sum": "$vulnerabilities.high"},
        "total_medium": {"$sum": "$vulnerabilities.medium"},
        "total_low": {"$sum": "$vulnerabilities.low"},
        "total_vulns": {"$sum": "$vulnerabilities.total"},
    }}]
    result = await db.customers.aggregate(pipeline).to_list(1)
    return result[0] if result else {}


async def _aggregate_customer_breakdowns() -> dict:
    """Get tier, status, industry, and region breakdowns."""
    tiers = await db.customers.aggregate([
        {"$group": {"_id": "$tier", "count": {"$sum": 1}, "mrr": {"$sum": "$mrr"}}}
    ]).to_list(10)

    statuses = await db.customers.aggregate([
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]).to_list(10)

    industries = await db.customers.aggregate([
        {"$group": {"_id": "$industry", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}, {"$limit": 10}
    ]).to_list(10)

    regions = await db.customers.aggregate([
        {"$group": {"_id": "$region", "count": {"$sum": 1}}}
    ]).to_list(10)

    return {
        "tiers": {t["_id"]: {"count": t["count"], "mrr": t["mrr"]} for t in tiers},
        "statuses": {s["_id"]: s["count"] for s in statuses},
        "top_industries": [{"name": i["_id"], "count": i["count"]} for i in industries],
        "regions": {r["_id"]: r["count"] for r in regions},
    }


async def _get_support_counts() -> dict:
    """Get support ticket counts."""
    active_filter = {"status": {"$in": ["open", "in_progress"]}}
    return {
        "open_tickets": await db.support_tickets.count_documents(active_filter),
        "critical_tickets": await db.support_tickets.count_documents({**active_filter, "priority": "critical"}),
    }


@admin_router.post("/seed")
async def seed_admin_data():
    """Seed 1,000 customer accounts with realistic data."""
    existing = await db.customers.count_documents({})
    if existing > 0:
        return {"message": f"Admin data already seeded ({existing} customers)", "count": existing}

    logger.info("Generating 1,000 customer accounts...")
    customers = generate_customers(1000)
    await db.customers.insert_many(customers)

    all_tickets = []
    for c in random.sample(customers, min(300, len(customers))):
        all_tickets.extend(generate_support_tickets(c))
    if all_tickets:
        await db.support_tickets.insert_many(all_tickets)

    await _create_admin_indexes()

    logger.info(f"Seeded {len(customers)} customers, {len(all_tickets)} support tickets")
    return {"message": "Seeded admin data successfully", "customers": len(customers), "support_tickets": len(all_tickets)}


@admin_router.get("/stats")
async def admin_platform_stats():
    """Platform-wide statistics for admin dashboard."""
    total_customers = await db.customers.count_documents({})
    if total_customers == 0:
        return {"seeded": False, "message": "No data. Call POST /api/admin/seed first."}

    stats = await _aggregate_customer_totals()
    breakdowns = await _aggregate_customer_breakdowns()
    support = await _get_support_counts()

    return {
        "seeded": True,
        "total_customers": total_customers,
        "total_applications": stats.get("total_apps", 0),
        "total_scans": stats.get("total_scans", 0),
        "total_components": stats.get("total_components", 0),
        "total_developers": stats.get("total_developers", 0),
        "total_mrr": stats.get("total_mrr", 0),
        "avg_health_score": round(stats.get("avg_health", 0), 1),
        "vulnerabilities": {
            "critical": stats.get("total_critical", 0),
            "high": stats.get("total_high", 0),
            "medium": stats.get("total_medium", 0),
            "low": stats.get("total_low", 0),
            "total": stats.get("total_vulns", 0),
        },
        **breakdowns,
        "support": support,
        "critical_customers": await db.customers.count_documents({"status": "critical"}),
        "warning_customers": await db.customers.count_documents({"status": "warning"}),
    }


def _build_customer_query(params: CustomerFilterParams) -> dict:
    """Build MongoDB query from filter params."""
    query = {}
    if params.search:
        query["$or"] = [
            {"name": {"$regex": params.search, "$options": "i"}},
            {"customer_number": {"$regex": params.search, "$options": "i"}},
            {"contact_email": {"$regex": params.search, "$options": "i"}},
        ]
    if params.tier:
        query["tier"] = params.tier
    if params.status:
        query["status"] = params.status
    if params.industry:
        query["industry"] = params.industry
    if params.region:
        query["region"] = params.region
    return query


@admin_router.get("/customers")
async def list_customers(
    search: Optional[str] = None,
    tier: Optional[str] = None,
    status: Optional[str] = None,
    industry: Optional[str] = None,
    region: Optional[str] = None,
    sort_by: str = "health_score",
    sort_order: str = "asc",
    limit: int = 50,
    skip: int = 0,
):
    """List customers with search, filter, sort, and pagination."""
    params = CustomerFilterParams(
        search=search, tier=tier, status=status, industry=industry,
        region=region, sort_by=sort_by, sort_order=sort_order, limit=limit, skip=skip,
    )
    query = _build_customer_query(params)
    sort_dir = 1 if params.sort_order == "asc" else -1

    customers = await db.customers.find(query, {"_id": 0}).sort(params.sort_by, sort_dir).skip(params.skip).limit(params.limit).to_list(params.limit)
    total = await db.customers.count_documents(query)
    return {"customers": customers, "total": total, "limit": params.limit, "skip": params.skip}


@admin_router.get("/customers/{customer_id}")
async def get_customer_detail(customer_id: str):
    """Get detailed view of a customer — like remoting into their instance."""
    customer = await db.customers.find_one({"id": customer_id}, {"_id": 0})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    scans = generate_customer_scans(customer, count=20)
    vulns = generate_customer_vulns(customer, count=25)
    tickets = await db.support_tickets.find(
        {"customer_id": customer_id}, {"_id": 0}
    ).sort("created_at", -1).to_list(20)

    return {"customer": customer, "scans": scans, "vulnerabilities": vulns, "support_tickets": tickets}


@admin_router.get("/tickets")
async def list_support_tickets(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    limit: int = 50,
    skip: int = 0,
):
    """List support tickets across all customers."""
    query = {}
    if status:
        query["status"] = status
    if priority:
        query["priority"] = priority

    tickets = await db.support_tickets.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    total = await db.support_tickets.count_documents(query)
    return {"tickets": tickets, "total": total}


@admin_router.get("/alerts")
async def get_platform_alerts():
    """Get platform-wide alerts for support engineering."""
    critical_customers = await db.customers.find(
        {"status": "critical"}, {"_id": 0, "id": 1, "name": 1, "health_score": 1, "tier": 1, "last_active": 1}
    ).sort("health_score", 1).limit(20).to_list(20)

    critical_tickets = await db.support_tickets.find(
        {"priority": "critical", "status": {"$in": ["open", "in_progress"]}}, {"_id": 0}
    ).sort("created_at", -1).limit(10).to_list(10)

    high_risk = await db.customers.find(
        {"risk_score": {"$gt": 7}}, {"_id": 0, "id": 1, "name": 1, "risk_score": 1, "tier": 1, "vulnerabilities": 1}
    ).sort("risk_score", -1).limit(10).to_list(10)

    return {"critical_customers": critical_customers, "critical_tickets": critical_tickets, "high_risk_customers": high_risk}


app.include_router(admin_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
