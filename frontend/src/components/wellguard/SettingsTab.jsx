import React from 'react';

const ciYaml = `name: WellGuard SCA Scan
on:
  push:
    branches: [main, develop, release/*]
  pull_request:
    branches: [main]

jobs:
  sca-scan:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v3

      - name: Run WellGuard SCA
        run: |
          curl -sSL https://wellguard.energycorp.internal/api/scan \\
            --header "Authorization: Bearer \${{ secrets.WELLGUARD_TOKEN }}" \\
            --header "Content-Type: application/json" \\
            --data '{
              "repository": "\${{ github.repository }}",
              "branch": "\${{ github.ref_name }}",
              "commit": "\${{ github.sha }}"
            }' \\
            -o scan-results.json

      - name: Check Policy
        run: |
          python3 scripts/check_policy.py scan-results.json \\
            --fail-on critical,high \\
            --license-policy SEC-LIC-004

      - name: Upload Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: wellguard-scan-results
          path: scan-results.json`;

export default function SettingsTab() {
  return (
    <div data-testid="settings-tab">
      <div className="wg-breadcrumbs">
        <span style={{ color: '#333' }}>Home</span>
        <span>&gt;</span>
        <span style={{ color: '#333' }}>Settings</span>
      </div>

      {/* Trivy Compromise Details */}
      <div className="wg-panel wg-mb-16">
        <div className="wg-panel-header" style={{ backgroundColor: '#fff3cd' }}>
          &#9888;&#65039; Trivy Supply Chain Compromise — CVE-2026-3452
        </div>
        <div style={{ padding: 16, fontSize: 13, lineHeight: 1.8 }}>
          <p style={{ marginBottom: 12 }}>
            <strong>Summary:</strong> On March 5, 2026, a supply chain compromise was discovered in the upstream Trivy scanner project.
            A malicious commit was introduced via a compromised maintainer account that modified the vulnerability database update mechanism.
          </p>
          <p style={{ marginBottom: 12 }}>
            <strong>Impact to WellGuard:</strong> Our internal fork (v0.18.3) is based on a pre-compromise version and does NOT
            contain the malicious code. However, we have frozen all upstream pulls as a precaution. The vulnerability database
            is being updated from our verified mirror only.
          </p>
          <p style={{ marginBottom: 12 }}>
            <strong>Action Items:</strong>
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
            <li>Sprint 47: Apply verified patches from Trivy project post-mortem (Assigned: M. Chen)</li>
            <li>Sprint 47: Audit all DB updates from Jan-Mar 2026 against verified checksums (Assigned: J. Morales)</li>
            <li>Sprint 48: Evaluate migration to alternative engine (Grype, OSV-Scanner) as backup</li>
            <li>Q2 2026: Present cost-benefit analysis of commercial SCA tool (Snyk, Sonatype) to leadership</li>
          </ul>
          <p style={{ color: '#999', fontSize: 11 }}>
            For questions, contact the AppSec team: appsec@energycorp.internal | Slack: #appsec-wellguard
          </p>
        </div>
      </div>

      {/* CI/CD Integration */}
      <div className="wg-panel wg-mb-16">
        <div className="wg-panel-header">CI/CD Integration — GitHub Actions</div>
        <div style={{ padding: 16 }}>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
            Copy this workflow into your repository's <code style={{ backgroundColor: '#f0f0f0', padding: '1px 4px', borderRadius: 2 }}>.github/workflows/</code> directory to enable automated SCA scanning on push and pull requests.
          </p>
          <div className="wg-code">
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{ciYaml}</pre>
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="wg-btn wg-btn-sm" onClick={() => navigator.clipboard?.writeText(ciYaml)} data-testid="copy-yaml-btn">
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>

      {/* Scanner Configuration */}
      <div className="wg-panel wg-mb-16">
        <div className="wg-panel-header">Scanner Configuration</div>
        <div style={{ padding: 16 }}>
          <table className="wg-table" data-testid="config-table">
            <thead>
              <tr>
                <th>Setting</th>
                <th>Value</th>
                <th>Last Changed</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ fontWeight: 600 }}>Engine Version</td><td className="wg-font-mono">Trivy 0.18.3 (internal fork)</td><td className="wg-text-muted">2024-03-15</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Vulnerability DB</td><td className="wg-font-mono">trivy-db-mirror.energycorp.internal</td><td className="wg-text-muted">2026-03-14 (auto-sync daily)</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Scan Timeout</td><td className="wg-font-mono">300 seconds</td><td className="wg-text-muted">2023-08-10</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Policy Engine</td><td className="wg-font-mono">SEC-LIC-004, SEC-VULN-002</td><td className="wg-text-muted">2025-01-20</td></tr>
              <tr><td style={{ fontWeight: 600 }}>SBOM Format</td><td className="wg-font-mono">CycloneDX 1.4</td><td className="wg-text-muted">2024-06-01</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Scan Schedule</td><td className="wg-font-mono">Daily 04:00 UTC (all registered apps)</td><td className="wg-text-muted">2022-11-15</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Retention</td><td className="wg-font-mono">180 days (scan results), indefinite (SBOMs)</td><td className="wg-text-muted">2023-01-05</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Known Limitations */}
      <div className="wg-panel">
        <div className="wg-panel-header">Known Limitations</div>
        <div style={{ padding: 16 }}>
          <ul className="wg-limitations" style={{ listStyle: 'none', padding: 0, margin: 0 }} data-testid="known-limitations">
            <li>&#8226; Binary scanning for C/C++ relies on header matching — may miss statically linked libraries</li>
            <li>&#8226; Transitive dependency resolution limited for .NET Framework (pre-SDK style projects)</li>
            <li>&#8226; .NET Framework 4.5 and earlier: manual NuGet.config required for accurate scanning</li>
            <li>&#8226; SCADA/ICS applications require offline scan mode — see runbook RB-4401</li>
            <li>&#8226; Java WAR files with embedded JARs may report incomplete dependency trees</li>
            <li>&#8226; Python scanning does not detect vendored dependencies (packages copied into source)</li>
            <li>&#8226; License detection accuracy ~92% for NuGet, ~88% for C/C++ (manual review recommended)</li>
            <li>&#8226; Concurrent scan limit: 8 (queued scans may take up to 15 minutes during peak CI/CD runs)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
