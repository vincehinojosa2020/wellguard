// WellGuard SCA — Mock Data
// Internal Software Composition Analysis tool, Upstream Technology Division
// Built 2019, maintained through 2026

export const applications = [
  { id: 'APP-0001', name: 'wellhead-telemetry-svc', repo: 'upstream/wellhead-telemetry', branch: 'main', ecosystem: '.NET', framework: '.NET Framework 4.8', critical: 3, high: 8, medium: 14, low: 22, scanDuration: '1m 47s', triggeredBy: 'CI/CD', timestamp: '2026-03-14T08:12:00Z', status: 'completed', components: 187 },
  { id: 'APP-0002', name: 'pipeline-pressure-monitor', repo: 'midstream/pressure-monitor', branch: 'release/2.4', ecosystem: 'C/C++', framework: 'C++17 / CMake', critical: 5, high: 11, medium: 9, low: 15, scanDuration: '3m 22s', triggeredBy: 'Manual', timestamp: '2026-03-14T07:45:00Z', status: 'completed', components: 94 },
  { id: 'APP-0003', name: 'refinery-ops-dashboard', repo: 'downstream/refinery-ops', branch: 'develop', ecosystem: '.NET', framework: 'ASP.NET MVC 5', critical: 1, high: 5, medium: 19, low: 34, scanDuration: '2m 03s', triggeredBy: 'CI/CD', timestamp: '2026-03-14T06:30:00Z', status: 'completed', components: 223 },
  { id: 'APP-0004', name: 'seismic-data-processor', repo: 'exploration/seismic-proc', branch: 'main', ecosystem: 'Python', framework: 'Python 3.8', critical: 2, high: 6, medium: 11, low: 28, scanDuration: '0m 58s', triggeredBy: 'Scheduled', timestamp: '2026-03-14T04:00:00Z', status: 'completed', components: 156 },
  { id: 'APP-0005', name: 'drilling-permit-portal', repo: 'upstream/drilling-permits', branch: 'main', ecosystem: 'Java', framework: 'Java 8 / Spring 4.3', critical: 4, high: 14, medium: 22, low: 41, scanDuration: '2m 51s', triggeredBy: 'CI/CD', timestamp: '2026-03-13T22:15:00Z', status: 'completed', components: 312 },
  { id: 'APP-0006', name: 'tank-level-ingestion', repo: 'midstream/tank-level', branch: 'master', ecosystem: 'C/C++', framework: 'C11 / Makefile', critical: 2, high: 4, medium: 6, low: 8, scanDuration: '1m 12s', triggeredBy: 'Manual', timestamp: '2026-03-13T19:00:00Z', status: 'completed', components: 47 },
  { id: 'APP-0007', name: 'hse-incident-tracker', repo: 'corporate/hse-tracker', branch: 'main', ecosystem: '.NET', framework: 'ASP.NET Core 3.1', critical: 0, high: 3, medium: 12, low: 19, scanDuration: '1m 34s', triggeredBy: 'CI/CD', timestamp: '2026-03-14T09:00:00Z', status: 'completed', components: 198 },
  { id: 'APP-0008', name: 'procurement-portal-v2', repo: 'corporate/procurement-v2', branch: 'release/3.1', ecosystem: '.NET', framework: '.NET Framework 4.6.2', critical: 6, high: 9, medium: 17, low: 29, scanDuration: '2m 18s', triggeredBy: 'Scheduled', timestamp: '2026-03-14T04:00:00Z', status: 'completed', components: 241 },
  { id: 'APP-0009', name: 'scada-config-manager', repo: 'ics/scada-config', branch: 'stable', ecosystem: 'C/C++', framework: 'C++14 / CMake', critical: 7, high: 12, medium: 8, low: 11, scanDuration: '4m 05s', triggeredBy: 'Manual', timestamp: '2026-03-12T14:30:00Z', status: 'completed', components: 78 },
  { id: 'APP-0010', name: 'field-ops-mobile-api', repo: 'upstream/field-ops-api', branch: 'main', ecosystem: '.NET', framework: 'ASP.NET Core 2.1', critical: 1, high: 7, medium: 15, low: 26, scanDuration: '1m 55s', triggeredBy: 'CI/CD', timestamp: '2026-03-14T10:30:00Z', status: 'completed', components: 176 },
  { id: 'APP-0011', name: 'production-allocation-engine', repo: 'upstream/prod-alloc', branch: 'main', ecosystem: '.NET', framework: 'C# / .NET 6', critical: 0, high: 2, medium: 8, low: 14, scanDuration: '1m 22s', triggeredBy: 'CI/CD', timestamp: '2026-03-14T11:15:00Z', status: 'completed', components: 134 },
  { id: 'APP-0012', name: 'reservoir-modeling-tools', repo: 'exploration/reservoir-tools', branch: 'develop', ecosystem: 'C/C++', framework: 'C++17 / Python 3.9', critical: 3, high: 9, medium: 13, low: 20, scanDuration: '5m 11s', triggeredBy: 'Manual', timestamp: '2026-03-13T16:45:00Z', status: 'completed', components: 267 },
  { id: 'APP-0013', name: 'environmental-compliance-rpt', repo: 'corporate/env-compliance', branch: 'main', ecosystem: 'Java', framework: 'Java 11 / Struts 2.5', critical: 2, high: 10, medium: 18, low: 33, scanDuration: '2m 44s', triggeredBy: 'Scheduled', timestamp: '2026-03-14T04:00:00Z', status: 'completed', components: 289 },
  { id: 'APP-0014', name: 'logistics-tracking-system', repo: 'midstream/logistics', branch: 'release/1.8', ecosystem: '.NET', framework: '.NET Framework 4.7', critical: 1, high: 4, medium: 11, low: 18, scanDuration: '1m 48s', triggeredBy: 'CI/CD', timestamp: '2026-03-14T07:00:00Z', status: 'completed', components: 163 },
  { id: 'APP-0015', name: 'midstream-scheduling-app', repo: 'midstream/scheduling', branch: 'main', ecosystem: '.NET', framework: 'ASP.NET / .NET Framework 4.8', critical: 2, high: 6, medium: 13, low: 25, scanDuration: '2m 09s', triggeredBy: 'CI/CD', timestamp: '2026-03-14T05:30:00Z', status: 'completed', components: 209 },
  { id: 'APP-0016', name: 'well-integrity-monitor', repo: 'upstream/well-integrity', branch: 'main', ecosystem: 'Python', framework: 'Python 3.10 / Flask', critical: 1, high: 3, medium: 7, low: 16, scanDuration: '0m 42s', triggeredBy: 'CI/CD', timestamp: '2026-03-14T12:00:00Z', status: 'completed', components: 89 },
  { id: 'APP-0017', name: 'gas-composition-analyzer', repo: 'midstream/gas-analyzer', branch: 'master', ecosystem: 'C/C++', framework: 'C99 / Makefile', critical: 4, high: 7, medium: 5, low: 9, scanDuration: '2m 33s', triggeredBy: 'Manual', timestamp: '2026-03-11T10:00:00Z', status: 'completed', components: 52 },
  { id: 'APP-0018', name: 'hr-onboarding-portal', repo: 'corporate/hr-onboarding', branch: 'main', ecosystem: 'Java', framework: 'Java 8 / Spring Boot 2.3', critical: 1, high: 8, medium: 15, low: 27, scanDuration: '2m 16s', triggeredBy: 'CI/CD', timestamp: '2026-03-14T06:00:00Z', status: 'completed', components: 234 },
  { id: 'APP-0019', name: 'pipeline-leak-detection', repo: 'midstream/leak-detect', branch: 'release/4.0', ecosystem: 'C/C++', framework: 'C++11 / CMake', critical: 3, high: 5, medium: 7, low: 12, scanDuration: '3m 47s', triggeredBy: 'Scheduled', timestamp: '2026-03-14T04:00:00Z', status: 'completed', components: 63 },
  { id: 'APP-0020', name: 'vendor-risk-assessment', repo: 'corporate/vendor-risk', branch: 'main', ecosystem: '.NET', framework: 'ASP.NET Core 6', critical: 0, high: 1, medium: 5, low: 11, scanDuration: '1m 08s', triggeredBy: 'CI/CD', timestamp: '2026-03-14T13:00:00Z', status: 'completed', components: 112 },
];

// Aggregate stats
export const summaryStats = {
  totalApplications: 847,
  last24hScans: 2341,
  critical: 23,
  high: 187,
  mediumTotal: 412,
  lowTotal: 1893,
  dependenciesTracked: 142893,
  engineVersion: 'Trivy 0.18.3 (forked)',
};

export const vulnerabilities = [
  // .NET vulnerabilities
  { id: 'vuln-001', cveId: 'CVE-2024-21319', pkg: 'Microsoft.IdentityModel.Tokens', installedVersion: '6.27.0', fixedVersion: '6.34.0', cvss: 7.5, severity: 'HIGH', description: 'Denial of Service in Microsoft.IdentityModel', apps: ['wellhead-telemetry-svc', 'hse-incident-tracker', 'field-ops-mobile-api'] },
  { id: 'vuln-002', cveId: 'CVE-2023-44487', pkg: 'Microsoft.AspNetCore.Server.Kestrel', installedVersion: '2.1.0', fixedVersion: '2.1.35', cvss: 7.5, severity: 'HIGH', description: 'HTTP/2 Rapid Reset Attack (Kestrel)', apps: ['field-ops-mobile-api', 'hse-incident-tracker'] },
  { id: 'vuln-003', cveId: 'CVE-2024-30105', pkg: 'System.Text.Json', installedVersion: '6.0.0', fixedVersion: '6.0.10', cvss: 7.5, severity: 'HIGH', description: 'Denial of Service when deserializing untrusted input', apps: ['production-allocation-engine', 'vendor-risk-assessment'] },
  { id: 'vuln-004', cveId: 'CVE-2022-29117', pkg: 'System.Net.Http', installedVersion: '4.3.0', fixedVersion: '4.3.4', cvss: 7.5, severity: 'HIGH', description: 'Denial of Service in .NET HTTP handler', apps: ['procurement-portal-v2', 'logistics-tracking-system', 'midstream-scheduling-app'] },
  { id: 'vuln-005', cveId: 'CVE-2024-0057', pkg: 'System.Security.Cryptography.X509Certificates', installedVersion: '4.3.0', fixedVersion: '4.3.3', cvss: 9.8, severity: 'CRITICAL', description: 'X.509 Chain Building on Linux allows remote code exec', apps: ['wellhead-telemetry-svc', 'procurement-portal-v2'] },
  { id: 'vuln-006', cveId: 'CVE-2023-36799', pkg: 'System.Security.Cryptography.Pkcs', installedVersion: '6.0.1', fixedVersion: '6.0.4', cvss: 6.5, severity: 'MEDIUM', description: 'Denial of Service via crafted X.509 certificates', apps: ['refinery-ops-dashboard'] },
  { id: 'vuln-007', cveId: 'CVE-2018-8292', pkg: 'Newtonsoft.Json', installedVersion: '11.0.2', fixedVersion: '13.0.1', cvss: 8.1, severity: 'HIGH', description: 'Insecure deserialization allows arbitrary code execution', apps: ['procurement-portal-v2', 'refinery-ops-dashboard', 'logistics-tracking-system'] },

  // C/C++ vulnerabilities
  { id: 'vuln-008', cveId: 'CVE-2024-5535', pkg: 'openssl', installedVersion: '1.1.1t', fixedVersion: '1.1.1w', cvss: 9.1, severity: 'CRITICAL', description: 'Buffer overread in SSL_select_next_proto', apps: ['pipeline-pressure-monitor', 'scada-config-manager', 'tank-level-ingestion'] },
  { id: 'vuln-009', cveId: 'CVE-2023-38545', pkg: 'libcurl', installedVersion: '7.88.1', fixedVersion: '8.4.0', cvss: 9.8, severity: 'CRITICAL', description: 'SOCKS5 heap buffer overflow in curl', apps: ['pipeline-pressure-monitor', 'reservoir-modeling-tools'] },
  { id: 'vuln-010', cveId: 'CVE-2023-45853', pkg: 'zlib', installedVersion: '1.2.13', fixedVersion: '1.3.0', cvss: 9.8, severity: 'CRITICAL', description: 'Integer overflow in MiniZip leads to heap overflow', apps: ['scada-config-manager', 'gas-composition-analyzer', 'pipeline-leak-detection'] },
  { id: 'vuln-011', cveId: 'CVE-2023-7104', pkg: 'sqlite3', installedVersion: '3.41.2', fixedVersion: '3.43.2', cvss: 7.3, severity: 'HIGH', description: 'Heap buffer overflow in sessionReadRecord', apps: ['tank-level-ingestion', 'pipeline-pressure-monitor'] },
  { id: 'vuln-012', cveId: 'CVE-2024-2511', pkg: 'openssl', installedVersion: '3.0.8', fixedVersion: '3.0.14', cvss: 5.9, severity: 'MEDIUM', description: 'Unbounded memory growth with TLSv1.3 session handling', apps: ['gas-composition-analyzer'] },
  { id: 'vuln-013', cveId: 'CVE-2023-52425', pkg: 'libexpat', installedVersion: '2.5.0', fixedVersion: '2.6.0', cvss: 7.5, severity: 'HIGH', description: 'XML parsing stack exhaustion via large tokens', apps: ['scada-config-manager', 'pipeline-leak-detection'] },

  // Java vulnerabilities
  { id: 'vuln-014', cveId: 'CVE-2021-44228', pkg: 'org.apache.logging.log4j:log4j-core', installedVersion: '2.14.1', fixedVersion: '2.17.1', cvss: 10.0, severity: 'CRITICAL', description: 'Log4Shell — Remote code execution via JNDI lookups', apps: ['drilling-permit-portal', 'environmental-compliance-rpt'] },
  { id: 'vuln-015', cveId: 'CVE-2022-42003', pkg: 'com.fasterxml.jackson.core:jackson-databind', installedVersion: '2.13.4', fixedVersion: '2.13.5', cvss: 7.5, severity: 'HIGH', description: 'Uncontrolled Resource Consumption via deep wrapper arrays', apps: ['drilling-permit-portal', 'hr-onboarding-portal'] },
  { id: 'vuln-016', cveId: 'CVE-2023-20863', pkg: 'org.springframework:spring-expression', installedVersion: '5.3.20', fixedVersion: '5.3.27', cvss: 6.5, severity: 'MEDIUM', description: 'Denial of Service with specially crafted SpEL expression', apps: ['drilling-permit-portal'] },
  { id: 'vuln-017', cveId: 'CVE-2023-34035', pkg: 'org.springframework.security:spring-security-config', installedVersion: '5.7.3', fixedVersion: '5.7.10', cvss: 8.1, severity: 'HIGH', description: 'Authorization rules can be misconfigured', apps: ['hr-onboarding-portal'] },
  { id: 'vuln-018', cveId: 'CVE-2022-22965', pkg: 'org.springframework:spring-beans', installedVersion: '5.3.17', fixedVersion: '5.3.18', cvss: 9.8, severity: 'CRITICAL', description: 'Spring4Shell — RCE via data binding on JDK 9+', apps: ['environmental-compliance-rpt'] },
  { id: 'vuln-019', cveId: 'CVE-2024-22262', pkg: 'org.apache.struts:struts2-core', installedVersion: '2.5.30', fixedVersion: '2.5.33', cvss: 9.8, severity: 'CRITICAL', description: 'Remote code execution via OGNL evaluation', apps: ['environmental-compliance-rpt'] },

  // Python vulnerabilities
  { id: 'vuln-020', cveId: 'CVE-2024-35195', pkg: 'requests', installedVersion: '2.28.2', fixedVersion: '2.32.0', cvss: 5.6, severity: 'MEDIUM', description: 'Certificate verification bypass when Verify=False in session', apps: ['seismic-data-processor', 'well-integrity-monitor'] },
  { id: 'vuln-021', cveId: 'CVE-2023-37920', pkg: 'certifi', installedVersion: '2023.5.7', fixedVersion: '2023.7.22', cvss: 7.5, severity: 'HIGH', description: 'Removal of e-Tugra root certificate due to security concerns', apps: ['seismic-data-processor'] },
  { id: 'vuln-022', cveId: 'CVE-2024-3651', pkg: 'idna', installedVersion: '3.4', fixedVersion: '3.7', cvss: 7.5, severity: 'HIGH', description: 'Denial of Service via resource consumption for inputs to idna.encode()', apps: ['well-integrity-monitor', 'reservoir-modeling-tools'] },
  { id: 'vuln-023', cveId: 'CVE-2023-43804', pkg: 'urllib3', installedVersion: '1.26.15', fixedVersion: '1.26.18', cvss: 5.9, severity: 'MEDIUM', description: 'Cookie header leakage on cross-origin redirect', apps: ['seismic-data-processor'] },
  { id: 'vuln-024', cveId: 'CVE-2024-6345', pkg: 'setuptools', installedVersion: '67.8.0', fixedVersion: '70.0.0', cvss: 8.8, severity: 'HIGH', description: 'Remote code execution via crafted URL in package_index', apps: ['seismic-data-processor', 'well-integrity-monitor', 'reservoir-modeling-tools'] },
];

export const dependencies = [
  // .NET / NuGet
  { id: 'dep-001', pkg: 'Newtonsoft.Json', version: '11.0.2', ecosystem: 'NuGet', license: 'MIT', appsUsing: 14, knownVulns: 1, lastUpdated: '2018-03-08' },
  { id: 'dep-002', pkg: 'Microsoft.AspNetCore.Mvc', version: '2.1.3', ecosystem: 'NuGet', license: 'Apache-2.0', appsUsing: 8, knownVulns: 3, lastUpdated: '2018-11-02' },
  { id: 'dep-003', pkg: 'System.Net.Http', version: '4.3.0', ecosystem: 'NuGet', license: 'MIT', appsUsing: 12, knownVulns: 2, lastUpdated: '2016-11-15' },
  { id: 'dep-004', pkg: 'Microsoft.EntityFrameworkCore', version: '3.1.32', ecosystem: 'NuGet', license: 'Apache-2.0', appsUsing: 9, knownVulns: 0, lastUpdated: '2022-12-13' },
  { id: 'dep-005', pkg: 'System.Text.Json', version: '6.0.0', ecosystem: 'NuGet', license: 'MIT', appsUsing: 6, knownVulns: 1, lastUpdated: '2021-11-08' },
  { id: 'dep-006', pkg: 'Microsoft.IdentityModel.Tokens', version: '6.27.0', ecosystem: 'NuGet', license: 'MIT', appsUsing: 7, knownVulns: 1, lastUpdated: '2023-01-10' },
  { id: 'dep-007', pkg: 'Serilog', version: '2.12.0', ecosystem: 'NuGet', license: 'Apache-2.0', appsUsing: 11, knownVulns: 0, lastUpdated: '2022-11-25' },
  { id: 'dep-008', pkg: 'Dapper', version: '2.0.123', ecosystem: 'NuGet', license: 'Apache-2.0', appsUsing: 5, knownVulns: 0, lastUpdated: '2023-03-15' },
  { id: 'dep-009', pkg: 'System.Security.Cryptography.X509Certificates', version: '4.3.0', ecosystem: 'NuGet', license: 'MIT', appsUsing: 8, knownVulns: 1, lastUpdated: '2016-11-15' },
  { id: 'dep-010', pkg: 'AutoMapper', version: '12.0.1', ecosystem: 'NuGet', license: 'MIT', appsUsing: 7, knownVulns: 0, lastUpdated: '2023-01-14' },

  // C/C++
  { id: 'dep-011', pkg: 'openssl', version: '1.1.1t', ecosystem: 'C/C++', license: 'Apache-2.0', appsUsing: 6, knownVulns: 3, lastUpdated: '2023-02-07' },
  { id: 'dep-012', pkg: 'libcurl', version: '7.88.1', ecosystem: 'C/C++', license: 'MIT', appsUsing: 4, knownVulns: 2, lastUpdated: '2023-02-20' },
  { id: 'dep-013', pkg: 'zlib', version: '1.2.13', ecosystem: 'C/C++', license: 'Zlib', appsUsing: 8, knownVulns: 1, lastUpdated: '2022-10-13' },
  { id: 'dep-014', pkg: 'sqlite3', version: '3.41.2', ecosystem: 'C/C++', license: 'Public Domain', appsUsing: 3, knownVulns: 1, lastUpdated: '2023-03-22' },
  { id: 'dep-015', pkg: 'libexpat', version: '2.5.0', ecosystem: 'C/C++', license: 'MIT', appsUsing: 4, knownVulns: 1, lastUpdated: '2022-10-25' },
  { id: 'dep-016', pkg: 'boost', version: '1.81.0', ecosystem: 'C/C++', license: 'BSL-1.0', appsUsing: 5, knownVulns: 0, lastUpdated: '2022-12-14' },

  // Java / Maven
  { id: 'dep-017', pkg: 'org.apache.logging.log4j:log4j-core', version: '2.14.1', ecosystem: 'Maven', license: 'Apache-2.0', appsUsing: 3, knownVulns: 4, lastUpdated: '2021-03-06' },
  { id: 'dep-018', pkg: 'com.fasterxml.jackson.core:jackson-databind', version: '2.13.4', ecosystem: 'Maven', license: 'Apache-2.0', appsUsing: 5, knownVulns: 2, lastUpdated: '2022-09-01' },
  { id: 'dep-019', pkg: 'org.springframework:spring-core', version: '5.3.20', ecosystem: 'Maven', license: 'Apache-2.0', appsUsing: 4, knownVulns: 1, lastUpdated: '2022-06-15' },
  { id: 'dep-020', pkg: 'org.apache.struts:struts2-core', version: '2.5.30', ecosystem: 'Maven', license: 'Apache-2.0', appsUsing: 2, knownVulns: 3, lastUpdated: '2022-04-12' },
  { id: 'dep-021', pkg: 'org.hibernate:hibernate-core', version: '5.6.15', ecosystem: 'Maven', license: 'LGPL-2.1', appsUsing: 3, knownVulns: 0, lastUpdated: '2023-06-15' },

  // Python / PyPI
  { id: 'dep-022', pkg: 'requests', version: '2.28.2', ecosystem: 'PyPI', license: 'Apache-2.0', appsUsing: 4, knownVulns: 1, lastUpdated: '2023-01-12' },
  { id: 'dep-023', pkg: 'numpy', version: '1.24.3', ecosystem: 'PyPI', license: 'BSD-3-Clause', appsUsing: 3, knownVulns: 0, lastUpdated: '2023-04-22' },
  { id: 'dep-024', pkg: 'urllib3', version: '1.26.15', ecosystem: 'PyPI', license: 'MIT', appsUsing: 4, knownVulns: 1, lastUpdated: '2023-03-10' },
  { id: 'dep-025', pkg: 'setuptools', version: '67.8.0', ecosystem: 'PyPI', license: 'MIT', appsUsing: 4, knownVulns: 1, lastUpdated: '2023-05-30' },
  { id: 'dep-026', pkg: 'Flask', version: '2.2.5', ecosystem: 'PyPI', license: 'BSD-3-Clause', appsUsing: 2, knownVulns: 0, lastUpdated: '2023-05-02' },
];

export const licenses = [
  { license: 'MIT', type: 'Permissive', count: 487, policy: 'Approved' },
  { license: 'Apache-2.0', type: 'Permissive', count: 312, policy: 'Approved' },
  { license: 'BSD-3-Clause', type: 'Permissive', count: 89, policy: 'Approved' },
  { license: 'BSD-2-Clause', type: 'Permissive', count: 43, policy: 'Approved' },
  { license: 'ISC', type: 'Permissive', count: 67, policy: 'Approved' },
  { license: 'Zlib', type: 'Permissive', count: 12, policy: 'Approved' },
  { license: 'Public Domain', type: 'Permissive', count: 8, policy: 'Approved' },
  { license: 'BSL-1.0', type: 'Permissive', count: 15, policy: 'Approved' },
  { license: 'LGPL-2.1', type: 'Weak Copyleft', count: 23, policy: 'Review Required' },
  { license: 'LGPL-3.0', type: 'Weak Copyleft', count: 11, policy: 'Review Required' },
  { license: 'MPL-2.0', type: 'Weak Copyleft', count: 18, policy: 'Review Required' },
  { license: 'GPL-2.0', type: 'Strong Copyleft', count: 7, policy: 'VIOLATION' },
  { license: 'GPL-3.0', type: 'Strong Copyleft', count: 4, policy: 'VIOLATION' },
  { license: 'AGPL-3.0', type: 'Strong Copyleft', count: 2, policy: 'VIOLATION' },
  { license: 'Unknown', type: 'Unknown', count: 9, policy: 'Review Required' },
];

export const sbomHistory = [
  { id: 'sbom-001', app: 'All Applications (Full)', format: 'CycloneDX 1.4 JSON', generatedAt: '2026-02-28T16:00:00Z', size: '24.7 MB', components: 142893 },
  { id: 'sbom-002', app: 'wellhead-telemetry-svc', format: 'CycloneDX 1.4 JSON', generatedAt: '2026-03-01T09:15:00Z', size: '412 KB', components: 187 },
  { id: 'sbom-003', app: 'drilling-permit-portal', format: 'SPDX 2.3', generatedAt: '2026-02-15T14:00:00Z', size: '890 KB', components: 312 },
  { id: 'sbom-004', app: 'scada-config-manager', format: 'CycloneDX 1.4 JSON', generatedAt: '2026-01-20T11:30:00Z', size: '198 KB', components: 78 },
];
