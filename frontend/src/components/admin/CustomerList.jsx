import React from 'react';
import {
  Search, Download, ChevronLeft, ChevronRight, ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { formatDate, formatNumber, formatMoney } from '../../utils/formatters';

const statusColors = {
  healthy: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  warning: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
  maintenance: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500' },
};

const tierColors = {
  'Free': 'bg-gray-100 text-gray-700',
  'Pro': 'bg-blue-50 text-blue-700',
  'Enterprise': 'bg-purple-50 text-purple-700',
  'Enterprise Plus': 'bg-amber-50 text-amber-800',
};

const CustomerList = ({
  customers, total, searchQuery, setSearchQuery,
  filterTier, setFilterTier, filterStatus, setFilterStatus,
  sortBy, setSortBy, sortOrder, setSortOrder,
  currentPage, setCurrentPage, pageSize,
  onOpenCustomer,
}) => {
  const resetPageAndSet = (setter) => (value) => {
    setter(value);
    setCurrentPage(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1F3B]">Customer Instances</h1>
          <p className="text-gray-500 text-sm mt-1">{total} accounts · Click to remote into any instance</p>
        </div>
        <Button variant="outline" className="text-sm gap-2"><Download className="w-4 h-4" /> Export</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => resetPageAndSet(setSearchQuery)(e.target.value)}
            placeholder="Search by name, ID, or email..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B1F3B]/20" />
        </div>
        <select value={filterTier} onChange={e => resetPageAndSet(setFilterTier)(e.target.value)}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm">
          <option value="">All Tiers</option>
          <option value="Free">Free</option>
          <option value="Pro">Pro</option>
          <option value="Enterprise">Enterprise</option>
          <option value="Enterprise Plus">Enterprise Plus</option>
        </select>
        <select value={filterStatus} onChange={e => resetPageAndSet(setFilterStatus)(e.target.value)}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm">
          <option value="">All Status</option>
          <option value="healthy">Healthy</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm">
          <option value="health_score">Sort: Health Score</option>
          <option value="risk_score">Sort: Risk Score</option>
          <option value="scan_count">Sort: Scan Count</option>
          <option value="mrr">Sort: Revenue</option>
          <option value="last_active">Sort: Last Active</option>
        </select>
        <button onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
          className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Table */}
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Tier</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Health</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Apps</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Scans</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Vulns</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">MRR</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Last Active</th>
                  <th className="text-left py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => {
                  const sc = statusColors[c.status] || statusColors.healthy;
                  const healthColor = c.health_score >= 85 ? '#22C55E' : c.health_score >= 60 ? '#EAB308' : '#EF4444';
                  return (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                      onClick={() => onOpenCustomer(c)}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${sc.dot}`} />
                          <div>
                            <p className="font-medium text-[#1B1F3B]">{c.name}</p>
                            <p className="text-[11px] text-gray-400">{c.customer_number} · {c.industry}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4"><Badge className={`${tierColors[c.tier] || 'bg-gray-100 text-gray-700'} text-[10px] font-medium`}>{c.tier}</Badge></td>
                      <td className="py-3 px-4"><Badge className={`${sc.bg} ${sc.text} ${sc.border} text-[10px]`}>{c.status}</Badge></td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${c.health_score}%`, backgroundColor: healthColor }} />
                          </div>
                          <span className="text-xs font-medium">{c.health_score}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{c.application_count}</td>
                      <td className="py-3 px-4 text-gray-600">{formatNumber(c.scan_count)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {c.vulnerabilities?.critical > 0 && <span className="text-[10px] font-bold text-red-600">{c.vulnerabilities.critical}C</span>}
                          {c.vulnerabilities?.high > 0 && <span className="text-[10px] font-bold text-orange-600">{c.vulnerabilities.high}H</span>}
                          <span className="text-[10px] text-gray-400">{formatNumber(c.vulnerabilities?.total)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">{c.mrr > 0 ? formatMoney(c.mrr) : '-'}</td>
                      <td className="py-3 px-4 text-[11px] text-gray-400">{formatDate(c.last_active)}</td>
                      <td className="py-3 px-4"><ExternalLink className="w-4 h-4 text-gray-300 hover:text-[#1B1F3B]" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, total)} of {total}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={(currentPage + 1) * pageSize >= total}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
