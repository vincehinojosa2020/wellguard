# WellGuard SCA — Product Requirements Document

## Overview
WellGuard SCA is an internal Software Composition Analysis tool built by the AppSec team at a major oil & gas company. Originally built in 2019 on top of the Trivy open-source scanner, it scans legacy .NET, C/C++, Java, and Python applications for vulnerable dependencies.

## Story
A small internal security team forked Trivy in mid-2019 and built a custom web dashboard. The tool has been running for 7 years, scanning 847 applications. The March 2026 Trivy supply chain compromise (CVE-2026-3452) has leadership asking about migrating to a commercial solution.

## Design Direction
"2019 Enterprise Internal Tool" — built by backend engineers who are good at security but not designers:
- Segoe UI font, Bootstrap 4 aesthetic
- #f5f5f5 background, #1a2332 header, #0066cc corporate blue
- Tables for everything, high data density
- No animations, no dark mode, no sidebar navigation
- Tab-based navigation: Dashboard, Scan Results, Dependencies, Licenses, SBOM, Settings

## Pages / Tabs
1. **Dashboard** — Summary stats bar + recent scan results table (sortable, 20 oil & gas apps)
2. **Scan Results** — Run real Trivy scans + clickable app detail with CVE vulnerability table
3. **Dependencies** — Searchable inventory of 26 tracked packages (NuGet, C/C++, Maven, PyPI)
4. **Licenses** — Compliance table with GPL violation alerts, policy reference
5. **SBOM** — CycloneDX/SPDX generation panel with DOE compliance notice
6. **Settings** — Trivy compromise details, CI/CD YAML, scanner config, known limitations

## Tech Stack
- Frontend: React 19 + Tailwind CSS + custom CSS (no shadcn for main UI)
- Backend: FastAPI + Motor (MongoDB async) + Trivy CLI v0.69.3
- Database: MongoDB

## Key Features
- Real Trivy SCA scanning (Docker images, Git repos, filesystem)
- 20 mock oil & gas applications with realistic names and vulnerability data
- 24 CVEs across .NET, C/C++, Java, Python ecosystems
- License compliance with SEC-LIC-004 policy violations
- SBOM generation (CycloneDX 1.4, SPDX 2.3)
- Trivy compromise warning banner (CVE-2026-3452)

## Completed Work
- [x] Complete frontend rebrand from Type-A to WellGuard SCA (Feb 2026)
- [x] 2019 enterprise aesthetic implemented (Feb 2026)
- [x] 6-tab single-page application (Feb 2026)
- [x] Oil & gas mock data: 20 apps, 24 CVEs, 26 dependencies (Feb 2026)
- [x] Real Trivy scanning integrated via "Run Scan" (Feb 2026)
- [x] License compliance with GPL violation alerts (Feb 2026)
- [x] SBOM generation panel (Feb 2026)
- [x] CI/CD YAML snippet and known limitations (Feb 2026)
- [x] Backend API rebranded to WellGuard SCA API v2.4.1 (Feb 2026)
- [x] Trivy CLI v0.69.3 installed (Feb 2026)
- [x] All tests passing: 13/13 backend, 100% frontend (Feb 2026)

## Backlog
- P2: Clean up unused Type-A files (old pages, landing components, admin components)
- P3: Add real vulnerability trend charts
- P3: Export CSV functionality (currently UI-only buttons)
- P3: SBOM download functionality
