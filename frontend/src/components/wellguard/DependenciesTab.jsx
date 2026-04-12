import React, { useState, useMemo } from 'react';

export default function DependenciesTab({ deps }) {
  const [search, setSearch] = useState('');
  const [ecoFilter, setEcoFilter] = useState('');
  const [sortCol, setSortCol] = useState('knownVulns');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const handleSort = (col) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const filtered = useMemo(() => {
    let result = deps;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => d.pkg.toLowerCase().includes(q) || d.ecosystem.toLowerCase().includes(q));
    }
    if (ecoFilter) result = result.filter(d => d.ecosystem === ecoFilter);
    result = [...result].sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
    return result;
  }, [deps, search, ecoFilter, sortCol, sortAsc]);

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const ecosystems = [...new Set(deps.map(d => d.ecosystem))];
  const sortArrow = (col) => sortCol === col ? (sortAsc ? ' ▲' : ' ▼') : '';

  return (
    <div data-testid="dependencies-tab">
      <div className="wg-breadcrumbs">
        <span style={{ color: '#333' }}>Home</span>
        <span>&gt;</span>
        <span style={{ color: '#333' }}>Dependencies</span>
      </div>

      <div className="wg-panel">
        <div className="wg-panel-header">
          <span>Dependency Inventory ({filtered.length})</span>
          <div className="wg-flex wg-gap-8 wg-items-center">
            <input
              className="wg-search"
              placeholder="Search applications, CVEs, packages..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              data-testid="dep-search"
            />
            <select className="wg-select" value={ecoFilter} onChange={e => { setEcoFilter(e.target.value); setPage(0); }} data-testid="dep-eco-filter">
              <option value="">All Ecosystems</option>
              {ecosystems.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <button className="wg-btn wg-btn-sm">Export CSV</button>
          </div>
        </div>
        <div className="wg-panel-body">
          <table className="wg-table" data-testid="dep-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('pkg')}>Package{sortArrow('pkg')}</th>
                <th onClick={() => handleSort('version')}>Version{sortArrow('version')}</th>
                <th onClick={() => handleSort('ecosystem')}>Ecosystem{sortArrow('ecosystem')}</th>
                <th onClick={() => handleSort('license')}>License{sortArrow('license')}</th>
                <th onClick={() => handleSort('appsUsing')} style={{ textAlign: 'right' }}>Apps Using{sortArrow('appsUsing')}</th>
                <th onClick={() => handleSort('knownVulns')} style={{ textAlign: 'right' }}>Known Vulns{sortArrow('knownVulns')}</th>
                <th onClick={() => handleSort('lastUpdated')}>Last Updated{sortArrow('lastUpdated')}</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(d => (
                <tr key={d.id}>
                  <td className="wg-font-mono" style={{ fontSize: 12, fontWeight: 600 }}>{d.pkg}</td>
                  <td className="wg-font-mono" style={{ fontSize: 12 }}>{d.version}</td>
                  <td>{d.ecosystem}</td>
                  <td style={{ fontSize: 12 }}>{d.license}</td>
                  <td style={{ textAlign: 'right' }}>{d.appsUsing}</td>
                  <td style={{ textAlign: 'right', color: d.knownVulns > 0 ? '#cc0000' : '#28a745', fontWeight: d.knownVulns > 0 ? 700 : 400 }}>
                    {d.knownVulns}
                  </td>
                  <td className="wg-text-muted" style={{ fontSize: 12 }}>{d.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="wg-pagination">
          <span>Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}</span>
          <div className="wg-flex wg-gap-8">
            <button className="wg-btn wg-btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
            <button className="wg-btn wg-btn-sm" disabled={(page + 1) * pageSize >= filtered.length} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
