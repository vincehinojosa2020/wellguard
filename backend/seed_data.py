"""
Admin/Support Engineering seed data generator for Type-A Platform.
Generates 1,000 realistic customer accounts with scan history, vulnerabilities, and usage metrics.
"""
import random
import uuid
from datetime import datetime, timedelta

# Company name components
PREFIXES = [
    "Apex", "Nova", "Stellar", "Quantum", "Zenith", "Vertex", "Cipher", "Nexus", "Pulse", "Forge",
    "Atlas", "Helix", "Prism", "Echo", "Vortex", "Spark", "Onyx", "Cobalt", "Titan", "Drift",
    "Aero", "Bolt", "Core", "Delta", "Edge", "Flux", "Grid", "Hive", "Ion", "Jade",
    "Krypton", "Lunar", "Metro", "Neon", "Orbit", "Phoenix", "Quasar", "Rune", "Sigma", "Terra",
    "Ultra", "Vector", "Wave", "Xeno", "Yield", "Zeta", "Alpha", "Bravo", "Carbon", "Data",
]

SUFFIXES = [
    "Systems", "Tech", "Labs", "Solutions", "Digital", "Cloud", "AI", "Software", "Networks", "Security",
    "Dynamics", "Corp", "Technologies", "Platform", "Analytics", "Robotics", "Health", "Financial",
    "Logistics", "Media", "Energy", "Bio", "Genomics", "Auto", "Defense", "Consulting", "Group",
    "Payments", "Insurance", "Capital", "Ventures", "Partners", "Industries", "Services", "Global",
]

REAL_COMPANIES = [
    "Stripe Engineering", "Cloudflare Inc", "Datadog Security", "HashiCorp", "Confluent",
    "Snowflake Computing", "Palantir Technologies", "CrowdStrike", "Zscaler", "Okta",
    "MongoDB Inc", "Elastic NV", "Twilio", "Fastly", "PagerDuty",
    "GitLab", "JFrog", "Sumo Logic", "New Relic", "Dynatrace",
    "Splunk", "ServiceNow", "Workday", "Salesforce Platform", "Adobe Systems",
    "Autodesk", "Intuit", "VMware", "Nutanix", "Rubrik",
    "Lacework", "Snyk", "Aqua Security", "Palo Alto Networks", "Fortinet",
    "SentinelOne", "Tanium", "Carbon Black", "Rapid7", "Qualys",
    "Veracode", "Checkmarx", "WhiteSource", "Black Duck", "Synopsys",
    "Contrast Security", "StackHawk", "Invicti", "Tenable", "Imperva",
]

INDUSTRIES = [
    "Technology", "Financial Services", "Healthcare", "E-Commerce", "SaaS",
    "Cybersecurity", "Government", "Education", "Manufacturing", "Telecommunications",
    "Media & Entertainment", "Energy", "Automotive", "Logistics", "Insurance",
    "Retail", "Pharma & Biotech", "Defense & Aerospace", "Real Estate Tech", "Legal Tech",
]

TIERS = ["Free", "Pro", "Enterprise", "Enterprise Plus"]
TIER_WEIGHTS = [15, 35, 35, 15]  # percentage distribution

REGIONS = ["US-East", "US-West", "EU-West", "EU-Central", "APAC-Tokyo", "APAC-Sydney", "SA-East", "CA-Central"]

STATUSES = ["healthy", "warning", "critical", "maintenance"]
STATUS_WEIGHTS = [70, 18, 7, 5]

DOCKER_IMAGES = [
    "nginx:latest", "nginx:1.25-alpine", "python:3.11-slim", "python:3.12-bookworm",
    "node:20-alpine", "node:18-slim", "golang:1.22-alpine", "rust:1.77-slim",
    "openjdk:21-slim", "openjdk:17-alpine", "ruby:3.3-slim", "php:8.3-fpm",
    "postgres:16-alpine", "mysql:8.0", "redis:7-alpine", "mongo:7",
    "ubuntu:22.04", "debian:bookworm-slim", "alpine:3.19", "centos:stream9",
    "wordpress:latest", "grafana/grafana:latest", "prom/prometheus:latest",
    "elasticsearch:8.12.0", "kibana:8.12.0", "logstash:8.12.0",
    "jenkins/jenkins:lts", "gitlab/gitlab-ce:latest", "sonarqube:latest",
    "hashicorp/vault:latest", "hashicorp/consul:latest", "traefik:v3.0",
    "envoyproxy/envoy:v1.29", "istio/pilot:1.20", "linkerd/controller:stable",
    "apache/kafka:3.7", "rabbitmq:3-management", "nats:latest",
    "minio/minio:latest", "localstack/localstack:latest", "wiremock/wiremock:latest",
]

GIT_REPOS = [
    "https://github.com/spring-projects/spring-boot",
    "https://github.com/facebook/react",
    "https://github.com/tensorflow/tensorflow",
    "https://github.com/kubernetes/kubernetes",
    "https://github.com/apache/kafka",
    "https://github.com/elastic/elasticsearch",
    "https://github.com/grafana/grafana",
    "https://github.com/prometheus/prometheus",
]

CVES = [
    ("CVE-2024-58251", "BusyBox netstat ANSI escape sequence injection", "MEDIUM", 5.0),
    ("CVE-2024-47176", "CUPS Remote Code Execution", "CRITICAL", 9.8),
    ("CVE-2024-38428", "GNU Wget mishandling of semicolons in URI userinfo", "HIGH", 7.5),
    ("CVE-2024-6345", "setuptools URL processing vulnerability", "HIGH", 8.1),
    ("CVE-2024-45490", "libexpat XML parsing integer overflow", "CRITICAL", 9.1),
    ("CVE-2024-45491", "libexpat XML parsing integer overflow (2)", "CRITICAL", 9.1),
    ("CVE-2024-45492", "libexpat XML parsing unsigned integer overflow", "CRITICAL", 9.1),
    ("CVE-2024-41110", "Docker Engine AuthZ bypass", "CRITICAL", 9.9),
    ("CVE-2024-29510", "Ghostscript format string vulnerability", "HIGH", 8.8),
    ("CVE-2024-28849", "follow-redirects proxy-authorization header leak", "MEDIUM", 6.5),
    ("CVE-2024-24790", "Go net/netip ParsePrefix panic", "MEDIUM", 5.3),
    ("CVE-2024-24789", "Go archive/zip mishandling of directory headers", "MEDIUM", 5.3),
    ("CVE-2024-22365", "Linux-PAM namespace bypass", "LOW", 3.3),
    ("CVE-2024-21626", "runc container breakout via /proc/self/fd leak", "CRITICAL", 8.6),
    ("CVE-2024-3596", "RADIUS protocol vulnerability (BlastRADIUS)", "HIGH", 7.5),
    ("CVE-2024-6387", "OpenSSH regreSSHion RCE", "HIGH", 8.1),
    ("CVE-2024-4577", "PHP CGI argument injection", "CRITICAL", 9.8),
    ("CVE-2024-3094", "XZ Utils backdoor", "CRITICAL", 10.0),
    ("CVE-2023-44487", "HTTP/2 Rapid Reset DDoS", "HIGH", 7.5),
    ("CVE-2023-38545", "curl SOCKS5 heap buffer overflow", "CRITICAL", 9.8),
    ("CVE-2023-32681", "Python Requests unintended credential leak", "MEDIUM", 6.1),
    ("CVE-2023-29491", "ncurses memory corruption", "HIGH", 7.8),
    ("CVE-2023-4911", "glibc Looney Tunables LPE", "HIGH", 7.8),
    ("CVE-2023-2650", "OpenSSL AES-SIV unlimited processing", "MEDIUM", 6.5),
    ("CVE-2023-0286", "OpenSSL X.400 type confusion", "HIGH", 7.4),
]

SUPPORT_ISSUE_TYPES = [
    "Scan timeout", "False positive report", "Integration issue", "License question",
    "Performance degradation", "API rate limiting", "SSO configuration", "Webhook failure",
    "SBOM export error", "Policy configuration", "Dashboard loading slow", "Missing CVE data",
    "Component version mismatch", "Scan queue stuck", "Email notification failure",
]

SUPPORT_PRIORITIES = ["low", "medium", "high", "critical"]
SUPPORT_STATUSES = ["open", "in_progress", "waiting_on_customer", "resolved", "closed"]


def generate_company_name(idx):
    if idx < len(REAL_COMPANIES):
        return REAL_COMPANIES[idx]
    prefix = random.choice(PREFIXES)
    suffix = random.choice(SUFFIXES)
    return f"{prefix} {suffix}"


def generate_customers(count=1000):
    customers = []
    now = datetime.utcnow()

    for i in range(count):
        tier = random.choices(TIERS, weights=TIER_WEIGHTS, k=1)[0]
        status = random.choices(STATUSES, weights=STATUS_WEIGHTS, k=1)[0]
        industry = random.choice(INDUSTRIES)
        region = random.choice(REGIONS)

        # Usage varies by tier
        if tier == "Free":
            app_count = random.randint(1, 5)
            scan_count = random.randint(1, 50)
            dev_count = random.randint(1, 10)
        elif tier == "Pro":
            app_count = random.randint(3, 25)
            scan_count = random.randint(20, 500)
            dev_count = random.randint(5, 50)
        elif tier == "Enterprise":
            app_count = random.randint(10, 100)
            scan_count = random.randint(100, 5000)
            dev_count = random.randint(20, 500)
        else:  # Enterprise Plus
            app_count = random.randint(50, 300)
            scan_count = random.randint(500, 20000)
            dev_count = random.randint(100, 2000)

        # Vulnerability counts based on scan volume
        vuln_mult = scan_count / 100
        critical = max(0, int(random.gauss(3 * vuln_mult, 2 * vuln_mult)))
        high = max(0, int(random.gauss(12 * vuln_mult, 5 * vuln_mult)))
        medium = max(0, int(random.gauss(30 * vuln_mult, 10 * vuln_mult)))
        low = max(0, int(random.gauss(50 * vuln_mult, 15 * vuln_mult)))

        # Component count
        component_count = int(app_count * random.randint(40, 200))

        # Dates
        created_days_ago = random.randint(30, 730)
        created_at = now - timedelta(days=created_days_ago)
        last_active_hours = random.randint(0, 72) if status != "maintenance" else random.randint(24, 168)
        last_active = now - timedelta(hours=last_active_hours)
        last_scan_hours = random.randint(0, 48) if scan_count > 10 else random.randint(24, 720)
        last_scan = now - timedelta(hours=last_scan_hours)

        # MRR based on tier
        mrr_map = {"Free": 0, "Pro": random.randint(299, 999), "Enterprise": random.randint(2000, 15000), "Enterprise Plus": random.randint(15000, 75000)}
        mrr = mrr_map[tier]

        # Health score
        if status == "healthy":
            health_score = random.randint(85, 100)
        elif status == "warning":
            health_score = random.randint(60, 84)
        elif status == "critical":
            health_score = random.randint(20, 59)
        else:
            health_score = random.randint(40, 70)

        # Risk score
        risk_score = min(10, round((critical * 3 + high * 1.5 + medium * 0.5) / max(1, app_count), 1))

        customer = {
            "id": str(uuid.uuid4()),
            "customer_number": f"TA-{10000 + i}",
            "name": generate_company_name(i),
            "industry": industry,
            "tier": tier,
            "region": region,
            "status": status,
            "health_score": health_score,
            "risk_score": risk_score,
            "mrr": mrr,
            "developer_count": dev_count,
            "application_count": app_count,
            "scan_count": scan_count,
            "component_count": component_count,
            "vulnerabilities": {
                "critical": critical,
                "high": high,
                "medium": medium,
                "low": low,
                "total": critical + high + medium + low,
            },
            "created_at": created_at.isoformat(),
            "last_active": last_active.isoformat(),
            "last_scan": last_scan.isoformat(),
            "contact_email": f"security@{generate_company_name(i).lower().replace(' ', '').replace('&', '')[:20]}.com",
            "csm": random.choice(["Sarah Chen", "Marcus Rodriguez", "Emily Watson", "James Kim", "Priya Patel", "David O'Brien", "Lisa Chang", "Alex Novak"]),
            "integrations": random.sample(["GitHub", "GitLab", "Bitbucket", "Jenkins", "CircleCI", "GitHub Actions", "Azure DevOps", "AWS CodePipeline", "Jira", "Slack", "Teams", "PagerDuty"], k=random.randint(1, 6)),
            "features_enabled": random.sample(["SCA", "Malware Defense", "SBOM", "License Compliance", "AI Governance", "Container Scanning", "Repository Firewall", "Policy Engine"], k=random.randint(2, 8)),
        }
        customers.append(customer)

    return customers


def generate_customer_scans(customer, count=None):
    """Generate realistic scan history for a customer."""
    if count is None:
        count = min(customer["scan_count"], 50)  # Cap at 50 for detail view

    scans = []
    now = datetime.utcnow()

    for i in range(count):
        hours_ago = random.randint(0, 720)
        created = now - timedelta(hours=hours_ago)
        target = random.choice(DOCKER_IMAGES + GIT_REPOS[:3])
        scan_type = "image" if ":" in target and "github" not in target else "repo"
        duration_secs = random.randint(15, 300)

        if duration_secs >= 60:
            duration_str = f"{duration_secs // 60}m {duration_secs % 60}s"
        else:
            duration_str = f"{duration_secs}s"

        vuln_count = random.randint(0, 150)
        comp_count = random.randint(20, 600)
        crit = random.randint(0, min(5, vuln_count))
        high = random.randint(0, min(20, vuln_count - crit))
        med = random.randint(0, min(50, vuln_count - crit - high))
        low = vuln_count - crit - high - med

        status = random.choices(["completed", "completed", "completed", "error", "completed"], k=1)[0]

        scan = {
            "id": str(uuid.uuid4()),
            "customer_id": customer["id"],
            "target": target,
            "scan_type": scan_type,
            "status": status,
            "created_at": created.isoformat(),
            "completed_at": (created + timedelta(seconds=duration_secs)).isoformat() if status == "completed" else None,
            "duration": duration_str if status == "completed" else None,
            "summary": {
                "total_vulnerabilities": vuln_count,
                "total_components": comp_count,
                "severity_counts": {"CRITICAL": crit, "HIGH": high, "MEDIUM": med, "LOW": low},
            } if status == "completed" else None,
            "error": "Connection timeout to registry" if status == "error" else None,
        }
        scans.append(scan)

    return sorted(scans, key=lambda x: x["created_at"], reverse=True)


def generate_customer_vulns(customer, count=None):
    """Generate vulnerabilities for a customer detail view."""
    if count is None:
        total = customer["vulnerabilities"]["total"]
        count = min(total, 30)

    vulns = []
    for i in range(count):
        cve = random.choice(CVES)
        component_base = random.choice([
            "busybox", "openssl", "libcurl", "zlib", "glibc", "python3", "nodejs",
            "nginx", "postgresql", "redis", "libxml2", "sqlite", "expat", "ncurses",
            "libssh2", "libtiff", "freetype", "fontconfig", "harfbuzz", "icu",
        ])
        version = f"{random.randint(1, 10)}.{random.randint(0, 50)}.{random.randint(0, 20)}"

        vuln = {
            "id": str(uuid.uuid4()),
            "customer_id": customer["id"],
            "vuln_id": cve[0],
            "title": cve[1],
            "severity": cve[2],
            "cvss": cve[3],
            "component": component_base,
            "version": version,
            "fixed_version": f"{random.randint(int(version.split('.')[0]), int(version.split('.')[0])+2)}.{random.randint(0, 50)}.{random.randint(0, 20)}",
            "description": f"{cve[1]}. Affects {component_base} versions prior to the fixed version.",
            "source": random.choice(["Trivy", "NVD", "GHSA", "Type-A Research"]),
            "published": (datetime.utcnow() - timedelta(days=random.randint(1, 365))).strftime("%Y-%m-%d"),
        }
        vulns.append(vuln)

    return sorted(vulns, key=lambda x: x["cvss"], reverse=True)


def generate_support_tickets(customer, count=None):
    """Generate support tickets for a customer."""
    if count is None:
        count = random.randint(0, 8)

    tickets = []
    now = datetime.utcnow()

    for i in range(count):
        days_ago = random.randint(0, 90)
        created = now - timedelta(days=days_ago)
        issue = random.choice(SUPPORT_ISSUE_TYPES)
        priority = random.choices(SUPPORT_PRIORITIES, weights=[30, 40, 20, 10], k=1)[0]
        status = random.choices(SUPPORT_STATUSES, weights=[20, 25, 15, 25, 15], k=1)[0]

        ticket = {
            "id": str(uuid.uuid4()),
            "ticket_number": f"TKT-{random.randint(100000, 999999)}",
            "customer_id": customer["id"],
            "customer_name": customer["name"],
            "subject": f"{issue} — {customer['name']}",
            "issue_type": issue,
            "priority": priority,
            "status": status,
            "created_at": created.isoformat(),
            "updated_at": (created + timedelta(hours=random.randint(1, 72))).isoformat(),
            "assigned_to": random.choice(["Unassigned", "Sarah Chen", "Marcus Rodriguez", "Emily Watson", "James Kim"]),
        }
        tickets.append(ticket)

    return sorted(tickets, key=lambda x: x["created_at"], reverse=True)
