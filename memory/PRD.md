# WellGuard SCA — Product Requirements Document

## Overview
WellGuard SCA is an internal Software Composition Analysis tool built by the AppSec team at a major oil & gas company. Originally built in 2019 on top of the Trivy open-source scanner, it scans legacy .NET, C/C++, Java, and Python applications for vulnerable open source dependencies.

## Design Direction
"2019 Enterprise Internal Tool" — Segoe UI, Bootstrap 4 aesthetic, #f5f5f5 background, #1a2332 header, #0066cc corporate blue. Tables for everything. No animations, no dark mode.

## Pages / Tabs
1. **Dashboard** — Summary stats bar + recent scan results table (20 oil & gas apps)
2. **Scan Results** — Step-by-step scan instructions + Run Scan form + clickable CVE vulnerability report
3. **Dependencies** — Searchable inventory of 26 tracked packages (NuGet, C/C++, Maven, PyPI)
4. **Licenses** — Compliance table with GPL violation alerts, SEC-LIC-004 policy reference
5. **SBOM** — CycloneDX/SPDX generation panel with DOE compliance notice
6. **Settings** — Trivy compromise details, CI/CD YAML, scanner config, known limitations

## Tech Stack
- Frontend: React 19 + Tailwind CSS + custom wellguard.css
- Backend: FastAPI + Motor (MongoDB async) + Trivy CLI v0.69.3
- Database: MongoDB

## Completed Work
- [x] Complete frontend rebrand from Type-A to WellGuard SCA (Feb 2026)
- [x] 2019 enterprise aesthetic (Feb 2026)
- [x] 6-tab single-page application (Feb 2026)
- [x] Oil & gas mock data: 20 apps, 24 CVEs, 26 dependencies (Feb 2026)
- [x] Real Trivy scanning with step-by-step instructions (Feb 2026)
- [x] Scan results display with full CVE vulnerability table (Feb 2026)
- [x] Polling fix for scan completion detection (Feb 2026)
- [x] Backend vulnerability parsing with pkg_name/installed_version aliases (Feb 2026)
- [x] License compliance with GPL violation alerts (Feb 2026)
- [x] SBOM generation panel (Feb 2026)
- [x] CI/CD YAML snippet and known limitations (Feb 2026)
- [x] Browser tab title: "WellGuard SCA" (Feb 2026)
- [x] All tests passing (Feb 2026)

## Backlog
- P2: Clean up unused Type-A files
- P3: Export CSV functionality
- P3: SBOM download functionality
- P3: Vulnerability trend charts
