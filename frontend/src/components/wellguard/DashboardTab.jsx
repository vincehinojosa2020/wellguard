import React, { useState, useMemo } from 'react';

function formatTs(ts) {
  if (!ts) return '-';
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function DashboardTab({ apps, stats, onSelectScan, realScans }) {
  const [sortCol, setSortCol] = useState('timestamp');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const handleSort = (col) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const sorted = useMemo(() => {
    const copy = [...apps];
    copy.sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
    return copy;
  }, [apps, sortCol, sortAsc]);

  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(sorted.length / pageSize);

  const sortArrow = (col) => sortCol === col ? (sortAsc ? ' ▲' : ' ▼') : '';

  return (
    <div data-testid="dashboard-tab">
      {/* Summary Bar */}
      <div className="wg-summary-bar" data-testid="wg-summary-bar">
        <div className="wg-summary-item">
          <span className="wg-summary-label">Applications:</span>
          <span className="wg-summary-value">{stats.totalApplications.toLocaleString()}</span>
        </div>
        <div className="wg-summary-item">
          <span className="wg-summary-label">Last 24h Scans:</span>
          <span className="wg-summary-value">{stats.last24hScans.toLocaleString()}</span>
        </div>
        <div className="wg-summary-item">
          <span className="wg-summary-label">Critical:</span>
          <span className="wg-summary-value" style={{ color: '#cc0000' }}>{stats.critical}</span>
        </div>
        <div className="wg-summary-item">
          <span className="wg-summary-label">High:</span>
          <span className="wg-summary-value" style={{ color: '#e68a00' }}>{stats.high}</span>
        </div>
        <div className="wg-summary-item">
          <span className="wg-summary-label">Dependencies Tracked:</span>
          <span className="wg-summary-value">{stats.dependenciesTracked.toLocaleString()}</span>
        </div>
        <div className="wg-summary-item">
          <span className="wg-summary-label">Engine:</span>
          <span className="wg-summary-value wg-font-mono" style={{ fontSize: 12 }}>{stats.engineVersion}</span>
        </div>
      </div>

      {/* Real Trivy Scans (if any) */}
      {realScans.length > 0 && (
        <div className="wg-panel wg-mb-16">
          <div className="wg-panel-header">
            Live Trivy Scan Results ({realScans.length})
          </div>
          <div className="wg-panel-body">
            <table className="wg-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Target</th>
                  <th>Type</th>
                  <th>Vulns</th>
                  <th>Components</th>
                  <th>Duration</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {realScans.map(s => (
                  <tr key={s.id} onClick={() => onSelectScan(s)}>
                    <td>{s.status === 'completed' ? '✅' : s.status === 'error' ? '❌' : '⏳'}</td>
                    <td className="wg-font-mono" style={{ fontSize: 12 }}>{s.target}</td>
                    <td>{s.scan_type}</td>
                    <td>{s.results?.summary?.total_vulnerabilities ?? '-'}</td>
                    <td>{s.results?.summary?.total_components ?? '-'}</td>
                    <td>{s.duration || '-'}</td>
                    <td className="wg-text-muted">{formatTs(s.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Scan Results */}
      <div className="wg-panel">
        <div className="wg-panel-header">
          <span>Recent Scan Results</span>
          <button className="wg-btn wg-btn-sm" data-testid="dashboard-export-btn">Export CSV</button>
        </div>
        <div className="wg-panel-body">
          <table className="wg-table" data-testid="dashboard-scans-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('status')}>Status{sortArrow('status')}</th>
                <th onClick={() => handleSort('name')}>Application{sortArrow('name')}</th>
                <th onClick={() => handleSort('repo')}>Repository{sortArrow('repo')}</th>
                <th onClick={() => handleSort('branch')}>Branch{sortArrow('branch')}</th>
                <th onClick={() => handleSort('ecosystem')}>Ecosystem{sortArrow('ecosystem')}</th>
                <th onClick={() => handleSort('critical')} style={{ textAlign: 'right' }}>Crit{sortArrow('critical')}</th>
                <th onClick={() => handleSort('high')} style={{ textAlign: 'right' }}>High{sortArrow('high')}</th>
                <th onClick={() => handleSort('medium')} style={{ textAlign: 'right' }}>Med{sortArrow('medium')}</th>
                <th onClick={() => handleSort('low')} style={{ textAlign: 'right' }}>Low{sortArrow('low')}</th>
                <th onClick={() => handleSort('scanDuration')}>Duration{sortArrow('scanDuration')}</th>
                <th onClick={() => handleSort('triggeredBy')}>Triggered{sortArrow('triggeredBy')}</th>
                <th onClick={() => handleSort('timestamp')}>Timestamp{sortArrow('timestamp')}</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(app => (
                <tr key={app.id} onClick={() => onSelectScan(app)} data-testid={`scan-row-${app.id}`}>
                  <td>{app.status === 'completed' ? '✅' : '❌'}</td>
                  <td style={{ fontWeight: 600 }}>{app.name}</td>
                  <td className="wg-font-mono wg-text-muted" style={{ fontSize: 12 }}>{app.repo}</td>
                  <td className="wg-font-mono" style={{ fontSize: 12 }}>{app.branch}</td>
                  <td>{app.ecosystem}</td>
                  <td style={{ textAlign: 'right', color: app.critical > 0 ? '#cc0000' : '#999', fontWeight: app.critical > 0 ? 700 : 400 }}>{app.critical}</td>
                  <td style={{ textAlign: 'right', color: app.high > 0 ? '#e68a00' : '#999', fontWeight: app.high > 0 ? 700 : 400 }}>{app.high}</td>
                  <td style={{ textAlign: 'right', color: app.medium > 0 ? '#997a00' : '#999' }}>{app.medium}</td>
                  <td style={{ textAlign: 'right', color: '#999' }}>{app.low}</td>
                  <td className="wg-text-muted">{app.scanDuration}</td>
                  <td className="wg-text-muted">{app.triggeredBy}</td>
                  <td className="wg-text-muted" style={{ fontSize: 12 }}>{formatTs(app.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="wg-pagination" data-testid="dashboard-pagination">
          <span>Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length} applications</span>
          <div className="wg-flex wg-gap-8">
            <button className="wg-btn wg-btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
            <button className="wg-btn wg-btn-sm" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
