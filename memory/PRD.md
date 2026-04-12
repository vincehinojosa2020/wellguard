# Type-A Platform — Product Requirements Document

## Overview
Type-A is an AI-Native DevSecOps platform — a Sonatype clone built for a senior sales engineering interview. Named after Adam Carbajal, the executive VP. Powered by real Trivy SCA scanning.

## Pages
1. **Landing Page** (`/`) — Sonatype-style marketing page with hero, platform overview, features, stats, CTA, footer
2. **Scanner Console** (`/dashboard`) — Real SCA scanning via Trivy. Dashboard, scan, vulnerabilities, components, scan history tabs
3. **Admin Console** (`/admin`) — Support engineering/platform admin view with 1,000 customer instances

## Key Features
- Real Trivy v0.69 SCA scanning (Docker images, Git repos, filesystem)
- 1,000 seeded customer accounts with realistic data ($9.5M MRR)
- Customer remote-into detail view with scans, vulns, integrations, tickets
- Live vulnerability data with real CVE IDs and CVSS scores
- Platform-wide metrics, alerts, support ticket management

## Tech Stack
- Frontend: React 19 + Tailwind CSS + shadcn/ui + Recharts + Framer Motion
- Backend: FastAPI + Motor (MongoDB async) + Trivy CLI
- Database: MongoDB

## Architecture
- Modular React components: pages delegate to focused sub-components
- `AdminDashboard.jsx` (252 lines) → AdminOverview, CustomerList, CustomerDetail, TicketsView, AlertsView
- `LandingPage.jsx` (20 lines) → HeroSection, PlatformOverview, FeaturesSection, StatsSection, CTASection, FooterSection
- `DashboardPage.jsx` (268 lines) → OverviewTab, ScanTab, VulnsTab, ComponentsTab, HistoryTab
- Shared utilities in `/src/utils/formatters.js`

## Completed Work
- [x] Landing page with all 6 sections (Feb 2026)
- [x] Scanner console with real Trivy integration (Feb 2026)
- [x] Admin console with 1,000 seeded customers (Feb 2026)
- [x] Code quality refactor: AdminDashboard 885→252 lines (Feb 2026)
- [x] Code quality refactor: LandingPage 335→20 lines (Feb 2026)
- [x] Security fix: exec() replaced with create_subprocess_exec (Feb 2026)
- [x] use-toast.js hook dependency fix (Feb 2026)
- [x] Index-as-key anti-patterns replaced with unique keys (Feb 2026)
- [x] Console.log/error replaced with silenced logger (Feb 2026)
- [x] All tests passing: 15/15 backend, 100% frontend (Feb 2026)

## Design Constraints
- NO Emergent branding anywhere
- Frank Luntz copywriting style
- Charlotte Software Engineering Universal Build Standards
- Sonatype color palette: #1B1F3B, #C8FF00, #E8553A

## Backlog
- P2: Charlotte UI/UX polish (spacing, typography hierarchy validation)
- P2: Performance optimization for 1,000 customer list (virtual scrolling)
- P3: Additional scan types or reporting features
- P3: Dark mode support
