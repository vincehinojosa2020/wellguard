import React, { useState } from 'react';

function formatTs(ts) {
  if (!ts) return '-';
  return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function SBOMTab({ history, apps }) {
  const [selectedApp, setSelectedApp] = useState('');
  const [format, setFormat] = useState('cyclonedx');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    // Simulate generation
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2000);
  };

  return (
    <div data-testid="sbom-tab">
      <div className="wg-breadcrumbs">
        <span style={{ color: '#333' }}>Home</span>
        <span>&gt;</span>
        <span style={{ color: '#333' }}>SBOM</span>
      </div>

      {/* DOE compliance note */}
      <div style={{ backgroundColor: '#e8f4fd', border: '1px solid #0066cc', borderRadius: 4, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#004080' }}>
        <strong>DOE Compliance:</strong> SBOM generation required for DOE compliance review — Q3 2025 deadline met. Next review: Q1 2027. Ensure all critical infrastructure applications have current SBOMs.
      </div>

      {/* Generate SBOM */}
      <div className="wg-panel wg-mb-16">
        <div className="wg-panel-header">Generate SBOM</div>
        <div style={{ padding: 16 }}>
          <div className="wg-flex wg-gap-8 wg-items-center" style={{ flexWrap: 'wrap' }}>
            <select className="wg-select" value={selectedApp} onChange={e => setSelectedApp(e.target.value)} data-testid="sbom-app-select">
              <option value="">All Applications (Full Platform)</option>
              {apps.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <select className="wg-select" value={format} onChange={e => setFormat(e.target.value)} data-testid="sbom-format-select">
              <option value="cyclonedx">CycloneDX 1.4 (JSON)</option>
              <option value="spdx">SPDX 2.3</option>
              <option value="cyclonedx-xml">CycloneDX 1.4 (XML)</option>
            </select>
            <button className="wg-btn wg-btn-primary" onClick={handleGenerate} disabled={generating} data-testid="sbom-generate-btn">
              {generating && <span className="wg-spinner" />}
              {generating ? 'Generating...' : 'Generate SBOM'}
            </button>
          </div>
          {generated && (
            <div style={{ marginTop: 12, padding: 12, backgroundColor: '#f0fff0', border: '1px solid #28a745', borderRadius: 4, fontSize: 13 }}>
              <strong style={{ color: '#28a745' }}>&#10003; SBOM generated successfully.</strong>{' '}
              <a href="#download" onClick={e => e.preventDefault()} style={{ color: '#0066cc' }}>Download {format === 'spdx' ? 'SPDX 2.3' : 'CycloneDX 1.4'} file</a>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="wg-panel">
        <div className="wg-panel-header">
          <span>Generation History</span>
          <button className="wg-btn wg-btn-sm">Export CSV</button>
        </div>
        <div className="wg-panel-body">
          <table className="wg-table" data-testid="sbom-history-table">
            <thead>
              <tr>
                <th>Application</th>
                <th>Format</th>
                <th>Generated</th>
                <th>Size</th>
                <th style={{ textAlign: 'right' }}>Components</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.app}</td>
                  <td className="wg-font-mono" style={{ fontSize: 12 }}>{s.format}</td>
                  <td className="wg-text-muted" style={{ fontSize: 12 }}>{formatTs(s.generatedAt)}</td>
                  <td>{s.size}</td>
                  <td style={{ textAlign: 'right' }}>{s.components.toLocaleString()}</td>
                  <td>
                    <a href="#dl" onClick={e => e.preventDefault()} style={{ color: '#0066cc', fontSize: 12, marginRight: 12 }}>Download</a>
                    <a href="#view" onClick={e => e.preventDefault()} style={{ color: '#0066cc', fontSize: 12 }}>View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
