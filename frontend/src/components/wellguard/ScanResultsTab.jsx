import React, { useState, useMemo } from 'react';

function formatTs(ts) {
  if (!ts) return '-';
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function ScanResultsTab({
  apps, vulns, selectedScan, setSelectedScan,
  realVulns, scanInput, setScanInput, scanType, setScanType,
  scanning, scanResult, scanError, onScan,
}) {
  const [sevFilter, setSevFilter] = useState('');

  // Determine which vulns to show based on selected scan
  const displayVulns = useMemo(() => {
    if (!selectedScan) return [];
    // If it's a real Trivy scan (has scan_type property from backend)
    if (selectedScan.scan_type) {
      return realVulns.filter(v => v.scan_id === selectedScan.id);
    }
    // Mock data — filter vulns by app name
    return vulns.filter(v => v.apps.includes(selectedScan.name));
  }, [selectedScan, vulns, realVulns]);

  const filteredVulns = useMemo(() => {
    if (!sevFilter) return displayVulns;
    return displayVulns.filter(v => v.severity === sevFilter);
  }, [displayVulns, sevFilter]);

  return (
    <div data-testid="scan-results-tab">
      {/* Breadcrumbs */}
      <div className="wg-breadcrumbs">
        <a href="#home" onClick={e => { e.preventDefault(); setSelectedScan(null); }}>Home</a>
        <span>&gt;</span>
        {selectedScan ? (
          <>
            <a href="#apps" onClick={e => { e.preventDefault(); setSelectedScan(null); }}>Applications</a>
            <span>&gt;</span>
            <span style={{ color: '#333' }}>{selectedScan.name || selectedScan.target}</span>
          </>
        ) : (
          <span style={{ color: '#333' }}>Scan Results</span>
        )}
      </div>

      {/* Run Scan Section */}
      <div className="wg-panel wg-mb-16">
        <div className="wg-panel-header">Run New Scan (Live Trivy Engine)</div>
        <div style={{ padding: 16 }}>
          <div className="wg-flex wg-gap-8 wg-items-center" style={{ flexWrap: 'wrap' }}>
            <input
              className="wg-search"
              style={{ width: 400 }}
              placeholder="Enter target (e.g., alpine:latest, nginx:1.25)"
              value={scanInput}
              onChange={e => setScanInput(e.target.value)}
              data-testid="scan-input"
            />
            <select className="wg-select" value={scanType} onChange={e => setScanType(e.target.value)} data-testid="scan-type-select">
              <option value="image">Docker Image</option>
              <option value="repo">Git Repository</option>
              <option value="fs">Filesystem</option>
            </select>
            <button className="wg-btn wg-btn-primary" onClick={onScan} disabled={scanning || !scanInput.trim()} data-testid="run-scan-btn">
              {scanning && <span className="wg-spinner" />}
              {scanning ? 'Scanning...' : 'Run Scan'}
            </button>
          </div>
          {scanError && <div style={{ color: '#cc0000', marginTop: 8, fontSize: 13 }}>Error: {scanError}</div>}
          {scanResult && (
            <div style={{ marginTop: 12, padding: 12, backgroundColor: '#f0fff0', border: '1px solid #28a745', borderRadius: 4 }}>
              <strong style={{ color: '#28a745' }}>Scan Complete</strong> — {scanResult.target}: {scanResult.results?.summary?.total_vulnerabilities ?? 0} vulnerabilities found in {scanResult.results?.summary?.total_components ?? 0} components ({scanResult.duration})
            </div>
          )}
        </div>
      </div>

      {/* Scan Detail View */}
      {selectedScan ? (
        <div>
          <div className="wg-detail-overlay wg-mb-16">
            <div className="wg-detail-header">
              <div>
                <strong style={{ fontSize: 16 }}>{selectedScan.name || selectedScan.target}</strong>
                <span className="wg-text-muted" style={{ marginLeft: 12, fontSize: 12 }}>
                  {selectedScan.framework || selectedScan.scan_type || ''} | {selectedScan.repo || ''} | {selectedScan.branch || ''}
                </span>
              </div>
              <button className="wg-btn wg-btn-sm" onClick={() => setSelectedScan(null)}>Close</button>
            </div>
            <div style={{ padding: 16 }}>
              <div className="wg-flex wg-gap-16" style={{ marginBottom: 12 }}>
                <div><span className="wg-text-muted">Status: </span>{selectedScan.status === 'completed' ? '✅ Completed' : selectedScan.status}</div>
                <div><span className="wg-text-muted">Duration: </span>{selectedScan.scanDuration || selectedScan.duration || '-'}</div>
                <div><span className="wg-text-muted">Components: </span>{selectedScan.components || selectedScan.results?.summary?.total_components || '-'}</div>
                <div><span className="wg-text-muted">Triggered: </span>{selectedScan.triggeredBy || 'Manual'}</div>
                <div><span className="wg-text-muted">Time: </span>{formatTs(selectedScan.timestamp || selectedScan.created_at)}</div>
              </div>
              {/* Severity summary */}
              <div className="wg-flex wg-gap-16" style={{ marginBottom: 12 }}>
                <div><span className="wg-sev wg-sev-critical">CRITICAL</span> <strong style={{ marginLeft: 4 }}>{selectedScan.critical ?? '—'}</strong></div>
                <div><span className="wg-sev wg-sev-high">HIGH</span> <strong style={{ marginLeft: 4 }}>{selectedScan.high ?? '—'}</strong></div>
                <div><span className="wg-sev wg-sev-medium">MEDIUM</span> <strong style={{ marginLeft: 4 }}>{selectedScan.medium ?? '—'}</strong></div>
                <div><span className="wg-sev wg-sev-low">LOW</span> <strong style={{ marginLeft: 4 }}>{selectedScan.low ?? '—'}</strong></div>
              </div>
            </div>
          </div>

          {/* Vulnerability table */}
          <div className="wg-panel">
            <div className="wg-panel-header">
              <span>Vulnerabilities ({filteredVulns.length})</span>
              <div className="wg-flex wg-gap-8 wg-items-center">
                <select className="wg-select" value={sevFilter} onChange={e => setSevFilter(e.target.value)} data-testid="sev-filter">
                  <option value="">All Severities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
                <button className="wg-btn wg-btn-sm">Export CSV</button>
              </div>
            </div>
            <div className="wg-panel-body">
              <table className="wg-table" data-testid="vuln-detail-table">
                <thead>
                  <tr>
                    <th>CVE ID</th>
                    <th>Package</th>
                    <th>Installed</th>
                    <th>Fixed</th>
                    <th style={{ textAlign: 'right' }}>CVSS</th>
                    <th>Severity</th>
                    <th>Description</th>
                    <th>NVD</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVulns.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 20, color: '#999' }}>No vulnerabilities found for this scan.</td></tr>
                  ) : filteredVulns.map(v => (
                    <tr key={v.id || v.cveId || v.vuln_id}>
                      <td className="wg-font-mono" style={{ fontSize: 12, fontWeight: 600 }}>{v.cveId || v.vuln_id}</td>
                      <td className="wg-font-mono" style={{ fontSize: 12 }}>{v.pkg || v.pkg_name}</td>
                      <td className="wg-font-mono" style={{ fontSize: 12 }}>{v.installedVersion || v.installed_version}</td>
                      <td className="wg-font-mono" style={{ fontSize: 12, color: '#28a745' }}>{v.fixedVersion || v.fixed_version || '-'}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{v.cvss}</td>
                      <td>
                        <span className={`wg-sev wg-sev-${(v.severity || '').toLowerCase()}`}>{v.severity}</span>
                      </td>
                      <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.description || v.title}</td>
                      <td>
                        <a
                          href={`https://nvd.nist.gov/vuln/detail/${v.cveId || v.vuln_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#0066cc', fontSize: 12 }}
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* No scan selected — show all apps as clickable list */
        <div className="wg-panel">
          <div className="wg-panel-header">
            <span>All Application Scans — Click to view vulnerabilities</span>
          </div>
          <div className="wg-panel-body">
            <table className="wg-table">
              <thead>
                <tr>
                  <th>Application</th>
                  <th>Ecosystem</th>
                  <th>Framework</th>
                  <th style={{ textAlign: 'right' }}>Critical</th>
                  <th style={{ textAlign: 'right' }}>High</th>
                  <th style={{ textAlign: 'right' }}>Medium</th>
                  <th style={{ textAlign: 'right' }}>Low</th>
                  <th>Last Scan</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app.id} onClick={() => setSelectedScan(app)}>
                    <td style={{ fontWeight: 600 }}>{app.name}</td>
                    <td>{app.ecosystem}</td>
                    <td className="wg-text-muted" style={{ fontSize: 12 }}>{app.framework}</td>
                    <td style={{ textAlign: 'right', color: app.critical > 0 ? '#cc0000' : '#999', fontWeight: app.critical > 0 ? 700 : 400 }}>{app.critical}</td>
                    <td style={{ textAlign: 'right', color: app.high > 0 ? '#e68a00' : '#999', fontWeight: app.high > 0 ? 700 : 400 }}>{app.high}</td>
                    <td style={{ textAlign: 'right' }}>{app.medium}</td>
                    <td style={{ textAlign: 'right', color: '#999' }}>{app.low}</td>
                    <td className="wg-text-muted" style={{ fontSize: 12 }}>{formatTs(app.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
