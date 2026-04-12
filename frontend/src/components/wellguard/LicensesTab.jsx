import React from 'react';

export default function LicensesTab({ licenses }) {
  const totalComponents = licenses.reduce((sum, l) => sum + l.count, 0);
  const violations = licenses.filter(l => l.policy === 'VIOLATION');
  const violationCount = violations.reduce((sum, l) => sum + l.count, 0);

  return (
    <div data-testid="licenses-tab">
      <div className="wg-breadcrumbs">
        <span style={{ color: '#333' }}>Home</span>
        <span>&gt;</span>
        <span style={{ color: '#333' }}>License Compliance</span>
      </div>

      {/* Policy violation alert */}
      {violationCount > 0 && (
        <div style={{ backgroundColor: '#fff0f0', border: '1px solid #cc0000', borderRadius: 4, padding: '10px 16px', marginBottom: 16, fontSize: 13 }}>
          <strong style={{ color: '#cc0000' }}>&#9888; POLICY VIOLATION:</strong>{' '}
          {violationCount} components use GPL/AGPL-licensed code in production applications. Per corporate policy (SEC-LIC-004), copyleft licenses are prohibited in proprietary production software. Contact Legal for remediation guidance.
        </div>
      )}

      <div className="wg-panel">
        <div className="wg-panel-header">
          <span>License Distribution ({totalComponents} components)</span>
          <button className="wg-btn wg-btn-sm">Export CSV</button>
        </div>
        <div className="wg-panel-body">
          <table className="wg-table" data-testid="license-table">
            <thead>
              <tr>
                <th>License</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Components</th>
                <th style={{ textAlign: 'right' }}>% of Total</th>
                <th>Policy Status</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map(l => (
                <tr key={l.license}>
                  <td style={{ fontWeight: 600 }}>{l.license}</td>
                  <td>{l.type}</td>
                  <td style={{ textAlign: 'right' }}>{l.count}</td>
                  <td style={{ textAlign: 'right', color: '#666' }}>{((l.count / totalComponents) * 100).toFixed(1)}%</td>
                  <td>
                    {l.policy === 'Approved' && <span className="wg-status-ok">&#9989; Approved</span>}
                    {l.policy === 'Review Required' && <span className="wg-status-warn">&#9888; Review Required</span>}
                    {l.policy === 'VIOLATION' && <span style={{ color: '#cc0000', fontWeight: 700 }}>&#10060; VIOLATION</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="wg-panel" style={{ marginTop: 16 }}>
        <div className="wg-panel-header">Policy Reference</div>
        <div style={{ padding: 16, fontSize: 13, color: '#666' }}>
          <p style={{ marginBottom: 8 }}><strong>SEC-LIC-004 — Open Source License Policy</strong></p>
          <ul style={{ paddingLeft: 20, lineHeight: 1.8 }}>
            <li><strong>Permissive (MIT, Apache-2.0, BSD, ISC):</strong> Approved for all use</li>
            <li><strong>Weak Copyleft (LGPL, MPL):</strong> Approved with review — must not modify source, dynamic linking only</li>
            <li><strong>Strong Copyleft (GPL, AGPL):</strong> Prohibited in proprietary production code. Requires legal waiver or replacement.</li>
            <li><strong>Unknown:</strong> Must be manually reviewed before deployment</li>
          </ul>
          <p style={{ marginTop: 12, color: '#999', fontSize: 11 }}>Last policy update: January 2025 | Owner: Legal & Compliance — appsec@energycorp.internal</p>
        </div>
      </div>
    </div>
  );
}
