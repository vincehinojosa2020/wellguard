from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import json
import asyncio
import subprocess
import tempfile
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
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

class ScanRequest(BaseModel):
    target: str
    scan_type: str = "image"  # image, repo, fs, sbom

class ScanResponse(BaseModel):
    id: str
    target: str
    scan_type: str
    status: str
    created_at: str
    completed_at: Optional[str] = None
    duration: Optional[str] = None
    summary: Optional[Dict[str, Any]] = None

class ApplicationCreate(BaseModel):
    name: str
    organization: str = "Default"

class VulnerabilityQuery(BaseModel):
    severity: Optional[str] = None
    component: Optional[str] = None

# ==================== HELPER FUNCTIONS ====================

def parse_trivy_output(trivy_json: dict) -> dict:
    """Parse Trivy JSON output into our vulnerability format."""
    vulnerabilities = []
    components = set()
    severity_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0, "UNKNOWN": 0}
    
    results = trivy_json.get("Results", [])
    
    for result in results:
        target = result.get("Target", "unknown")
        result_type = result.get("Type", "unknown")
        
        for vuln in result.get("Vulnerabilities", []):
            severity = vuln.get("Severity", "UNKNOWN").upper()
            severity_counts[severity] = severity_counts.get(severity, 0) + 1
            
            pkg_name = vuln.get("PkgName", "unknown")
            components.add(f"{pkg_name}@{vuln.get('InstalledVersion', 'unknown')}")
            
            vuln_entry = {
                "id": str(uuid.uuid4()),
                "vuln_id": vuln.get("VulnerabilityID", "unknown"),
                "title": vuln.get("Title", vuln.get("VulnerabilityID", "Unknown vulnerability")),
                "severity": severity,
                "cvss": 0,
                "component": pkg_name,
                "version": vuln.get("InstalledVersion", "unknown"),
                "fixed_version": vuln.get("FixedVersion", "No fix available"),
                "description": vuln.get("Description", "No description available"),
                "published": vuln.get("PublishedDate", ""),
                "source": "Trivy",
                "target": target,
                "target_type": result_type,
                "references": vuln.get("References", [])[:5],
            }
            
            # Extract CVSS score
            cvss_data = vuln.get("CVSS", {})
            if cvss_data:
                for source_data in cvss_data.values():
                    if "V3Score" in source_data:
                        vuln_entry["cvss"] = source_data["V3Score"]
                        break
                    elif "V2Score" in source_data:
                        vuln_entry["cvss"] = source_data["V2Score"]
                        break
            
            # Fallback CVSS from severity
            if vuln_entry["cvss"] == 0:
                fallback = {"CRITICAL": 9.5, "HIGH": 7.5, "MEDIUM": 5.0, "LOW": 2.5, "UNKNOWN": 0}
                vuln_entry["cvss"] = fallback.get(severity, 0)
            
            vulnerabilities.append(vuln_entry)
    
    return {
        "vulnerabilities": vulnerabilities,
        "components": list(components),
        "severity_counts": severity_counts,
        "total_vulns": len(vulnerabilities),
        "total_components": len(components),
    }


async def run_trivy_scan(scan_id: str, target: str, scan_type: str):
    """Run Trivy scan in background and store results."""
    try:
        await db.scans.update_one(
            {"id": scan_id},
            {"$set": {"status": "scanning"}}
        )
        
        start_time = datetime.utcnow()
        
        # Build trivy command
        cmd = ["trivy"]
        
        if scan_type == "image":
            cmd.extend(["image", "--format", "json", "--severity", "CRITICAL,HIGH,MEDIUM,LOW", target])
        elif scan_type == "repo":
            cmd.extend(["repo", "--format", "json", "--severity", "CRITICAL,HIGH,MEDIUM,LOW", target])
        elif scan_type == "fs":
            cmd.extend(["fs", "--format", "json", "--severity", "CRITICAL,HIGH,MEDIUM,LOW", target])
        elif scan_type == "sbom":
            cmd.extend(["sbom", "--format", "json", target])
        else:
            cmd.extend(["image", "--format", "json", "--severity", "CRITICAL,HIGH,MEDIUM,LOW", target])
        
        logger.info(f"Running Trivy command: {' '.join(cmd)}")
        
        # Run trivy with timeout
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        
        try:
            stdout, stderr = await asyncio.wait_for(
                process.communicate(), timeout=300
            )
        except asyncio.TimeoutError:
            process.kill()
            await db.scans.update_one(
                {"id": scan_id},
                {"$set": {"status": "timeout", "error": "Scan timed out after 5 minutes"}}
            )
            return
        
        end_time = datetime.utcnow()
        duration_secs = (end_time - start_time).total_seconds()
        
        if duration_secs >= 60:
            duration_str = f"{int(duration_secs // 60)}m {int(duration_secs % 60)}s"
        else:
            duration_str = f"{int(duration_secs)}s"
        
        # Parse output
        if stdout:
            try:
                trivy_output = json.loads(stdout.decode('utf-8'))
                parsed = parse_trivy_output(trivy_output)
                
                # Store vulnerabilities
                if parsed["vulnerabilities"]:
                    for v in parsed["vulnerabilities"]:
                        v["scan_id"] = scan_id
                        v["created_at"] = datetime.utcnow().isoformat()
                    await db.vulnerabilities.insert_many(parsed["vulnerabilities"])
                
                # Update scan with results
                await db.scans.update_one(
                    {"id": scan_id},
                    {"$set": {
                        "status": "completed",
                        "completed_at": end_time.isoformat(),
                        "duration": duration_str,
                        "summary": {
                            "total_vulnerabilities": parsed["total_vulns"],
                            "total_components": parsed["total_components"],
                            "severity_counts": parsed["severity_counts"],
                        },
                        "raw_component_count": parsed["total_components"],
                    }}
                )
                
                # Store components
                for comp_str in parsed["components"]:
                    parts = comp_str.split("@")
                    comp_name = parts[0]
                    comp_version = parts[1] if len(parts) > 1 else "unknown"
                    
                    # Count vulns for this component
                    comp_vulns = [v for v in parsed["vulnerabilities"] if v["component"] == comp_name]
                    max_cvss = max([v["cvss"] for v in comp_vulns], default=0)
                    
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
                        upsert=True
                    )
                
                logger.info(f"Scan {scan_id} completed: {parsed['total_vulns']} vulns, {parsed['total_components']} components")
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse Trivy output: {e}")
                stderr_text = stderr.decode('utf-8') if stderr else ""
                await db.scans.update_one(
                    {"id": scan_id},
                    {"$set": {
                        "status": "error",
                        "completed_at": end_time.isoformat(),
                        "duration": duration_str,
                        "error": f"Failed to parse scan output. {stderr_text[:500]}",
                    }}
                )
        else:
            stderr_text = stderr.decode('utf-8') if stderr else "No output"
            logger.error(f"Trivy returned no output: {stderr_text}")
            await db.scans.update_one(
                {"id": scan_id},
                {"$set": {
                    "status": "error",
                    "completed_at": end_time.isoformat(),
                    "duration": duration_str,
                    "error": stderr_text[:500],
                }}
            )
            
    except Exception as e:
        logger.error(f"Scan error: {str(e)}")
        await db.scans.update_one(
            {"id": scan_id},
            {"$set": {"status": "error", "error": str(e)[:500]}}
        )


# ==================== API ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Type-A Platform API", "version": "1.0.0"}

# --- Dashboard ---
@api_router.get("/dashboard/stats")
async def get_dashboard_stats():
    total_scans = await db.scans.count_documents({})
    completed_scans = await db.scans.count_documents({"status": "completed"})
    total_vulns = await db.vulnerabilities.count_documents({})
    total_components = await db.components.count_documents({})
    
    # Severity breakdown
    critical = await db.vulnerabilities.count_documents({"severity": "CRITICAL"})
    high = await db.vulnerabilities.count_documents({"severity": "HIGH"})
    medium = await db.vulnerabilities.count_documents({"severity": "MEDIUM"})
    low = await db.vulnerabilities.count_documents({"severity": "LOW"})
    
    # Get recent scans for trend
    recent_scans = await db.scans.find(
        {"status": "completed"},
        {"summary": 1, "completed_at": 1, "target": 1, "_id": 0}
    ).sort("completed_at", -1).limit(20).to_list(20)
    
    return {
        "total_scans": total_scans,
        "completed_scans": completed_scans,
        "total_vulnerabilities": total_vulns,
        "total_components": total_components,
        "severity": {
            "critical": critical,
            "high": high,
            "medium": medium,
            "low": low,
        },
        "recent_scans": recent_scans,
    }

# --- Scans ---
@api_router.post("/scans")
async def create_scan(request: ScanRequest, background_tasks: BackgroundTasks):
    scan_id = str(uuid.uuid4())
    scan_doc = {
        "id": scan_id,
        "target": request.target,
        "scan_type": request.scan_type,
        "status": "queued",
        "created_at": datetime.utcnow().isoformat(),
        "completed_at": None,
        "duration": None,
        "summary": None,
        "error": None,
    }
    
    await db.scans.insert_one(scan_doc)
    
    # Start scan in background
    background_tasks.add_task(run_trivy_scan, scan_id, request.target, request.scan_type)
    
    return {"id": scan_id, "status": "queued", "message": f"Scan initiated for {request.target}"}

@api_router.get("/scans")
async def list_scans(limit: int = 20, skip: int = 0):
    scans = await db.scans.find(
        {}, {"_id": 0}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    total = await db.scans.count_documents({})
    return {"scans": scans, "total": total}

@api_router.get("/scans/{scan_id}")
async def get_scan(scan_id: str):
    scan = await db.scans.find_one({"id": scan_id}, {"_id": 0})
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    # Get vulnerabilities for this scan
    vulns = await db.vulnerabilities.find(
        {"scan_id": scan_id}, {"_id": 0}
    ).sort("cvss", -1).to_list(1000)
    
    scan["vulnerabilities"] = vulns
    return scan

# --- Vulnerabilities ---
@api_router.get("/vulnerabilities")
async def list_vulnerabilities(
    severity: Optional[str] = None,
    component: Optional[str] = None,
    scan_id: Optional[str] = None,
    limit: int = 50,
    skip: int = 0
):
    query = {}
    if severity:
        query["severity"] = severity.upper()
    if component:
        query["component"] = {"$regex": component, "$options": "i"}
    if scan_id:
        query["scan_id"] = scan_id
    
    vulns = await db.vulnerabilities.find(
        query, {"_id": 0}
    ).sort("cvss", -1).skip(skip).limit(limit).to_list(limit)
    
    total = await db.vulnerabilities.count_documents(query)
    return {"vulnerabilities": vulns, "total": total}

# --- Components ---
@api_router.get("/components")
async def list_components(
    ecosystem: Optional[str] = None,
    limit: int = 100,
    skip: int = 0
):
    query = {}
    if ecosystem:
        query["ecosystem"] = ecosystem
    
    components = await db.components.find(
        query, {"_id": 0}
    ).sort("risk_score", -1).skip(skip).limit(limit).to_list(limit)
    
    total = await db.components.count_documents(query)
    return {"components": components, "total": total}

# --- Seed Data ---
@api_router.post("/seed")
async def seed_data():
    """Seed initial demo data for showcase."""
    # Check if already seeded
    existing = await db.scans.count_documents({})
    if existing > 0:
        return {"message": "Data already exists", "scans": existing}
    
    # Create demo scan entries
    demo_scans = [
        {
            "id": str(uuid.uuid4()),
            "target": "nginx:latest",
            "scan_type": "image",
            "status": "completed",
            "created_at": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
            "completed_at": (datetime.utcnow() - timedelta(hours=2, minutes=-3)).isoformat(),
            "duration": "2m 34s",
            "summary": {"total_vulnerabilities": 85, "total_components": 234, "severity_counts": {"CRITICAL": 5, "HIGH": 12, "MEDIUM": 23, "LOW": 45}},
        },
        {
            "id": str(uuid.uuid4()),
            "target": "python:3.11-slim",
            "scan_type": "image",
            "status": "completed",
            "created_at": (datetime.utcnow() - timedelta(hours=5)).isoformat(),
            "completed_at": (datetime.utcnow() - timedelta(hours=5, minutes=-4)).isoformat(),
            "duration": "4m 12s",
            "summary": {"total_vulnerabilities": 125, "total_components": 387, "severity_counts": {"CRITICAL": 8, "HIGH": 22, "MEDIUM": 35, "LOW": 60}},
        },
        {
            "id": str(uuid.uuid4()),
            "target": "node:20-alpine",
            "scan_type": "image",
            "status": "completed",
            "created_at": (datetime.utcnow() - timedelta(hours=8)).isoformat(),
            "completed_at": (datetime.utcnow() - timedelta(hours=8, minutes=-1)).isoformat(),
            "duration": "1m 45s",
            "summary": {"total_vulnerabilities": 42, "total_components": 156, "severity_counts": {"CRITICAL": 1, "HIGH": 6, "MEDIUM": 15, "LOW": 20}},
        },
    ]
    
    await db.scans.insert_many(demo_scans)
    return {"message": "Seeded demo data", "scans": len(demo_scans)}

# Include router and middleware
app.include_router(api_router)

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
