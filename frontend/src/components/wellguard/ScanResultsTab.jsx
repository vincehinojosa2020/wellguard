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
    // If it's a real Trivy scan with embedded vulnerabilities
    if (selectedScan.vulnerabilities && selectedScan.vulnerabilities.length > 0) {
      return selectedScan.vulnerabilities;
    }
    // If it's a real Trivy scan (has scan_type property from backend)
    if (selectedScan.scan_type) {
      return realVulns.filter(v => v.scan_id === selectedScan.id);
    }
    // Mock data — filter vulns by app name
    return vulns.filter(v => v.apps.includes(selectedScan.name));
  }, [selectedScan, vulns, realVulns]);

  const filteredVulns = useMemo(() => {
    if (!sevFilter) return displayVulns;
    return displayVulns.filter(v => (v.severity || '').toUpperCase() === sevFilter);
  }, [displayVulns, sevFilter]);

  // Count severities from scan result
  const sevCounts = useMemo(() => {
    if (selectedScan?.summary?.severity_counts) return selectedScan.summary.severity_counts;
    if (selectedScan?.results?.summary?.severity_counts) return selectedScan.results.summary.severity_counts;
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    displayVulns.forEach(v => {
      const s = (v.severity || '').toUpperCase();
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [selectedScan, displayVulns]);

  const totalVulns = useMemo(() => {
    if (selectedScan?.summary?.total_vulnerabilities != null) return selectedScan.summary.total_vulnerabilities;
    if (selectedScan?.results?.summary?.total_vulnerabilities != null) return selectedScan.results.summary.total_vulnerabilities;
    return selectedScan?.critical != null
      ? (selectedScan.critical + selectedScan.high + selectedScan.medium + selectedScan.low)
      : displayVulns.length;
  }, [selectedScan, displayVulns]);

  const totalComps = selectedScan?.summary?.total_components
    || selectedScan?.results?.summary?.total_components
    || selectedScan?.raw_component_count
    || selectedScan?.components
    || '-';

  return (
    <div data-testid="scan-results-tab">
      {/* Breadcrumbs */}
      <div className="wg-breadcrumbs">
        <a href="#home" onClick={e => { e.preventDefault(); setSelectedScan(null); }}>Home</a>
        <span>&gt;</span>
        {selectedScan ? (
          <>
            <a href="#apps" onClick={e => { e.preventDefault(); setSelectedScan(null); }}>Scan Results</a>
            <span>&gt;</span>
            <span style={{ color: '#333' }}>{selectedScan.name || selectedScan.target}</span>
          </>
        ) : (
          <span style={{ color: '#333' }}>Scan Results</span>
        )}
      </div>

      {/* ==================== NEW SCAN PANEL ==================== */}
      <div className="wg-panel wg-mb-16">
        <div className="wg-panel-header" style={{ backgroundColor: '#eef4fb' }}>
          Run Dependency Scan
        </div>
        <div style={{ padding: 16 }}>
          {/* Step-by-step instructions */}
          <div style={{ marginBottom: 16, padding: '12px 16px', backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: 4, fontSize: 13, lineHeight: 1.8, color: '#555' }}>
            <strong style={{ color: '#333', display: 'block', marginBottom: 4 }}>How to scan a public repository:</strong>
            <table style={{ fontSize: 13, borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '2px 12px 2px 0', fontWeight: 700, color: '#0066cc', verticalAlign: 'top', whiteSpace: 'nowrap' }}>Step 1.</td>
                  <td style={{ padding: '2px 0' }}>Go to the GitHub repository you want to scan. Copy the URL from your browser's address bar.<br/>
                    <span style={{ color: '#999', fontSize: 12 }}>Example: <code style={{ backgroundColor: '#f0f0f0', padding: '1px 4px', borderRadius: 2 }}>https://github.com/expressjs/express</code></span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 12px 2px 0', fontWeight: 700, color: '#0066cc', verticalAlign: 'top', whiteSpace: 'nowrap' }}>Step 2.</td>
                  <td style={{ padding: '2px 0' }}>Paste the URL into the <strong>Target</strong> field below. Select <strong>"Git Repository"</strong> from the scan type dropdown.</td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 12px 2px 0', fontWeight: 700, color: '#0066cc', verticalAlign: 'top', whiteSpace: 'nowrap' }}>Step 3.</td>
                  <td style={{ padding: '2px 0' }}>Click <strong>"Run Scan"</strong>. The Trivy engine will clone the repository and analyze all dependencies for known vulnerabilities. This typically takes 30-120 seconds depending on repository size.</td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 12px 2px 0', fontWeight: 700, color: '#0066cc', verticalAlign: 'top', whiteSpace: 'nowrap' }}>Step 4.</td>
                  <td style={{ padding: '2px 0' }}>Results will appear below once complete. Click the result row to view the full vulnerability report.</td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: 8, fontSize: 11, color: '#999', borderTop: '1px solid #eee', paddingTop: 6 }}>
              <strong>Supported scan types:</strong> Public GitHub/GitLab repositories, Docker images (e.g. <code style={{ backgroundColor: '#f0f0f0', padding: '1px 3px', borderRadius: 2 }}>nginx:latest</code>), local filesystem paths. Private repositories require authentication — see Settings &gt; CI/CD Integration for pipeline setup.
            </div>
          </div>

          {/* Scan form */}
          <div className="wg-flex wg-gap-8 wg-items-center" style={{ flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 300 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Target</label>
              <input
                className="wg-search"
                style={{ width: '100%' }}
                placeholder="https://github.com/owner/repository"
                value={scanInput}
                onChange={e => setScanInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !scanning) onScan(); }}
                data-testid="scan-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Scan Type</label>
              <select className="wg-select" value={scanType} onChange={e => setScanType(e.target.value)} data-testid="scan-type-select">
                <option value="repo">Git Repository</option>
                <option value="image">Docker Image</option>
                <option value="fs">Filesystem Path</option>
              </select>
            </div>
            <div style={{ paddingTop: 18 }}>
              <button className="wg-btn wg-btn-primary" onClick={onScan} disabled={scanning || !scanInput.trim()} data-testid="run-scan-btn" style={{ height: 34 }}>
                {scanning && <span className="wg-spinner" />}
                {scanning ? 'Scanning...' : 'Run Scan'}
              </button>
            </div>
          </div>

          {/* Scan progress */}
          {scanning && (
            <div style={{ marginTop: 12, padding: 12, backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}>
              <span className="wg-spinner" style={{ marginRight: 8 }} />
              <strong>Scan in progress</strong> — Trivy is analyzing <code style={{ backgroundColor: '#f0f0f0', padding: '1px 4px', borderRadius: 2 }}>{scanInput}</code>. This may take 30-120 seconds. Do not close this page.
            </div>
          )}

          {/* Error */}
          {scanError && (
            <div style={{ marginTop: 12, padding: 12, backgroundColor: '#fff0f0', border: '1px solid #cc0000', borderRadius: 4, fontSize: 13 }}>
              <strong style={{ color: '#cc0000' }}>Scan Failed:</strong> {scanError}
              <div style={{ marginTop: 4, fontSize: 11, color: '#999' }}>
                Common issues: Repository is private (authentication required), target URL is malformed, or scan timed out. Contact appsec@energycorp.internal if this persists.
              </div>
            </div>
          )}

          {/* Success result */}
          {scanResult && (
            <div style={{ marginTop: 12, padding: 12, backgroundColor: '#f0fff0', border: '1px solid #28a745', borderRadius: 4, fontSize: 13 }}>
              <strong style={{ color: '#28a745' }}>Scan Complete</strong> — {scanResult.target}
              <div style={{ marginTop: 6 }}>
                {(() => {
                  const s = scanResult.summary || scanResult.results?.summary || {};
                  const sc = s.severity_counts || {};
                  return (
                    <span>
                      {s.total_vulnerabilities || 0} vulnerabilities found in {s.total_components || scanResult.raw_component_count || 0} components.
                      {' '}Duration: {scanResult.duration || '-'}.
                      {(sc.CRITICAL || 0) > 0 && <span style={{ marginLeft: 8 }}><span className="wg-sev wg-sev-critical">CRITICAL: {sc.CRITICAL}</span></span>}
                      {(sc.HIGH || 0) > 0 && <span style={{ marginLeft: 4 }}><span className="wg-sev wg-sev-high">HIGH: {sc.HIGH}</span></span>}
                      {(sc.MEDIUM || 0) > 0 && <span style={{ marginLeft: 4 }}><span className="wg-sev wg-sev-medium">MEDIUM: {sc.MEDIUM}</span></span>}
                    </span>
                  );
                })()}
              </div>
              <div style={{ marginTop: 8 }}>
                <button className="wg-btn wg-btn-sm wg-btn-primary" onClick={() => setSelectedScan(scanResult)} data-testid="view-scan-results-btn">
                  View Full Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== SCAN DETAIL VIEW ==================== */}
      {selectedScan ? (
        <div>
          <div className="wg-detail-overlay wg-mb-16">
            <div className="wg-detail-header">
              <div>
                <strong style={{ fontSize: 16 }}>{selectedScan.name || selectedScan.target}</strong>
                <span className="wg-text-muted" style={{ marginLeft: 12, fontSize: 12 }}>
                  {selectedScan.framework || selectedScan.scan_type || ''} | {selectedScan.repo || ''} {selectedScan.branch || ''}
                </span>
              </div>
              <button className="wg-btn wg-btn-sm" onClick={() => setSelectedScan(null)} data-testid="close-detail-btn">Close</button>
            </div>
            <div style={{ padding: 16 }}>
              <div className="wg-flex wg-gap-16" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
                <div><span className="wg-text-muted">Status: </span>{selectedScan.status === 'completed' ? '✅ Completed' : selectedScan.status}</div>
                <div><span className="wg-text-muted">Duration: </span>{selectedScan.scanDuration || selectedScan.duration || '-'}</div>
                <div><span className="wg-text-muted">Components: </span>{totalComps}</div>
                <div><span className="wg-text-muted">Triggered: </span>{selectedScan.triggeredBy || 'Manual'}</div>
                <div><span className="wg-text-muted">Time: </span>{formatTs(selectedScan.timestamp || selectedScan.created_at)}</div>
              </div>
              <div className="wg-flex wg-gap-16" style={{ marginBottom: 8 }}>
                <div><span className="wg-sev wg-sev-critical">CRITICAL</span> <strong style={{ marginLeft: 4 }}>{sevCounts.CRITICAL || 0}</strong></div>
                <div><span className="wg-sev wg-sev-high">HIGH</span> <strong style={{ marginLeft: 4 }}>{sevCounts.HIGH || 0}</strong></div>
                <div><span className="wg-sev wg-sev-medium">MEDIUM</span> <strong style={{ marginLeft: 4 }}>{sevCounts.MEDIUM || 0}</strong></div>
                <div><span className="wg-sev wg-sev-low">LOW</span> <strong style={{ marginLeft: 4 }}>{sevCounts.LOW || 0}</strong></div>
                <div style={{ color: '#666', fontWeight: 600 }}>Total: {totalVulns}</div>
              </div>
            </div>
          </div>

          {/* Vulnerability table */}
          <div className="wg-panel">
            <div className="wg-panel-header">
              <span>Vulnerability Report ({filteredVulns.length})</span>
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
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: 24, color: '#999' }}>
                        {totalVulns === 0
                          ? 'No known vulnerabilities detected. All dependencies are up to date.'
                          : 'No vulnerabilities match the selected filter.'}
                      </td>
                    </tr>
                  ) : filteredVulns.map(v => (
                    <tr key={v.id || v.cveId || v.vuln_id}>
                      <td className="wg-font-mono" style={{ fontSize: 12, fontWeight: 600 }}>{v.cveId || v.vuln_id}</td>
                      <td className="wg-font-mono" style={{ fontSize: 12 }}>{v.pkg || v.pkg_name}</td>
                      <td className="wg-font-mono" style={{ fontSize: 12 }}>{v.installedVersion || v.installed_version}</td>
                      <td className="wg-font-mono" style={{ fontSize: 12, color: v.fixedVersion || v.fixed_version ? '#28a745' : '#999' }}>{v.fixedVersion || v.fixed_version || 'No fix available'}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{v.cvss}</td>
                      <td><span className={`wg-sev wg-sev-${(v.severity || '').toLowerCase()}`}>{v.severity}</span></td>
                      <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.description || v.title}</td>
                      <td>
                        <a href={`https://nvd.nist.gov/vuln/detail/${v.cveId || v.vuln_id}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', fontSize: 12 }}>View</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* No scan selected — show all apps */
        <div className="wg-panel">
          <div className="wg-panel-header">
            <span>Registered Applications — Select to view vulnerability report</span>
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
