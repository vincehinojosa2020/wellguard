# Type-A Platform - API Contracts & Integration Guide

## API Endpoints

### Dashboard
- `GET /api/dashboard/stats` → Dashboard metrics (total apps, vulns, components, malware blocked, trends)

### Applications
- `GET /api/applications` → List all applications with risk scores
- `POST /api/applications` → Add new application
- `GET /api/applications/{id}` → Get application details

### Scans (Trivy-powered)
- `POST /api/scans` → Initiate SCA scan (body: { target, type: "repo"|"image"|"fs" })
- `GET /api/scans` → List scan history
- `GET /api/scans/{id}` → Get scan result details

### Vulnerabilities
- `GET /api/vulnerabilities` → List all vulnerabilities (query: severity, component, app)
- `GET /api/vulnerabilities/{id}` → Get vulnerability details

### Components
- `GET /api/components` → List tracked components (query: ecosystem, license)

### Policy
- `GET /api/policies` → List policy violations

## Mock Data to Replace
- `dashboardStats` → `/api/dashboard/stats`
- `applications` → `/api/applications`
- `vulnerabilities` → `/api/vulnerabilities`
- `components` → `/api/components`
- `scanHistory` → `/api/scans`
- `policyViolations` → `/api/policies`
- `vulnerabilityTrend` → part of `/api/dashboard/stats`

## Backend Implementation
1. Install Trivy CLI on server
2. MongoDB collections: applications, scans, vulnerabilities, components, policies
3. Scan flow: POST /api/scans → run `trivy` CLI → parse JSON output → store in MongoDB → return results
4. Seed initial data from mock on first run

## Frontend Integration
- Replace mock imports with axios API calls using `REACT_APP_BACKEND_URL`
- Add loading states with skeleton components
- Add error handling with toast notifications
- Keep mock data as fallback
