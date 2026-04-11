# Type-A Platform — Product Requirements Document

## Overview
Type-A is an AI-Native DevSecOps platform — a Sonatype clone built for a senior sales engineering interview. Named after Adam Carbajal, the executive VP. Powered by real Trivy SCA scanning.

## Pages
1. **Landing Page** (`/`) — Sonatype-style marketing page with hero, platform overview, features, stats, CTA
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
