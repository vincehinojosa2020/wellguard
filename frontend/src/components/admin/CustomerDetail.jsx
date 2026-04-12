import React from 'react';
import { Building2, Terminal, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Loader2 } from 'lucide-react';
import { formatDate, formatNumber, formatMoney, getSeverityColor } from '../../utils/formatters';

const statusColors = {
  healthy: 'bg-green-50 text-green-600',
  warning: 'bg-yellow-50 text-yellow-600',
  critical: 'bg-red-50 text-red-600',
  maintenance: 'bg-gray-50 text-gray-600',
};

const statusBadgeColors = {
  healthy: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  critical: 'bg-red-50 text-red-700',
  maintenance: 'bg-gray-50 text-gray-700',
};

const tierColors = {
  'Free': 'bg-gray-100 text-gray-700',
  'Pro': 'bg-blue-50 text-blue-700',
  'Enterprise': 'bg-purple-50 text-purple-700',
  'Enterprise Plus': 'bg-amber-50 text-amber-800',
};

function getPriorityClass(priority) {
  if (priority === 'critical') return 'bg-red-50 text-red-700';
  if (priority === 'high') return 'bg-orange-50 text-orange-700';
  if (priority === 'medium') return 'bg-yellow-50 text-yellow-700';
  return 'bg-gray-50 text-gray-700';
}

const CustomerDetail = ({ customer, detail, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1B1F3B] mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Connecting to {customer.name}'s instance...</p>
        </div>
      </div>
    );
  }

  if (!detail) return null;

  const cust = detail.customer;
  const healthColor = cust.health_score >= 85 ? 'text-green-600' : cust.health_score >= 60 ? 'text-yellow-600' : 'text-red-600';
  const iconBg = statusColors[cust.status] || 'bg-gray-50 text-gray-600';
  const iconParts = iconBg.split(' ');

  const vulnSeverities = [
    { label: 'Critical', value: cust.vulnerabilities.critical, color: '#EF4444' },
    { label: 'High', value: cust.vulnerabilities.high, color: '#F97316' },
    { label: 'Medium', value: cust.vulnerabilities.medium, color: '#EAB308' },
    { label: 'Low', value: cust.vulnerabilities.low, color: '#3B82F6' },
  ];

  const quickStats = [
    { label: 'Health Score', value: `${cust.health_score}%`, color: healthColor },
    { label: 'Applications', value: cust.application_count },
    { label: 'Total Scans', value: formatNumber(cust.scan_count) },
    { label: 'Developers', value: formatNumber(cust.developer_count) },
    { label: 'Components', value: formatNumber(cust.component_count) },
    { label: 'MRR', value: cust.mrr > 0 ? formatMoney(cust.mrr) : 'Free', color: 'text-green-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconParts[0]}`}>
              <Building2 className={`w-6 h-6 ${iconParts[1]}`} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-[#1B1F3B]">{cust.name}</h1>
                <Badge className={`${tierColors[cust.tier] || ''} text-xs`}>{cust.tier}</Badge>
                <Badge className={`${statusBadgeColors[cust.status] || ''} text-xs`}>{cust.status}</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">{cust.customer_number} · {cust.industry} · {cust.region}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-sm gap-2"><Terminal className="w-4 h-4" /> Open Console</Button>
            <Button className="bg-[#1B1F3B] hover:bg-[#2A2F5B] text-white text-sm gap-2"><Eye className="w-4 h-4" /> View as Customer</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t border-gray-100">
          {quickStats.map((s) => (
            <div key={s.label}>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`text-lg font-bold ${s.color || 'text-[#1B1F3B]'}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vuln Summary */}
      <div className="grid grid-cols-4 gap-4">
        {vulnSeverities.map((s) => (
          <Card key={s.label} className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold" style={{ color: s.color }}>{formatNumber(s.value)}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scans + Vulns */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Recent Scans</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {detail.scans?.slice(0, 12).map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1B1F3B] truncate">{scan.target}</p>
                    <p className="text-[11px] text-gray-400">{formatDate(scan.created_at)} · {scan.duration || '-'}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    {scan.summary && <span className="text-xs font-medium">{scan.summary.total_vulnerabilities} vulns</span>}
                    <Badge className={`text-[10px] ${scan.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{scan.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Vulnerabilities</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {detail.vulnerabilities?.slice(0, 12).map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge style={{ backgroundColor: `${getSeverityColor(v.severity)}15`, color: getSeverityColor(v.severity) }} className="text-[10px] font-bold">{v.severity}</Badge>
                      <span className="text-[11px] font-mono text-gray-500">{v.vuln_id}</span>
                    </div>
                    <p className="text-sm text-gray-700 truncate">{v.title}</p>
                    <p className="text-[11px] text-gray-400">{v.component} · Fix: {v.fixed_version}</p>
                  </div>
                  <span className="text-lg font-bold ml-3" style={{ color: getSeverityColor(v.severity) }}>{v.cvss}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metadata */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border border-gray-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Account Info</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Contact', value: cust.contact_email },
              { label: 'CSM', value: cust.csm },
              { label: 'Region', value: cust.region },
              { label: 'Created', value: formatDate(cust.created_at) },
              { label: 'Last Scan', value: formatDate(cust.last_scan) },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-medium text-gray-700 text-right max-w-[60%] truncate">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Integrations</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {cust.integrations?.map((name) => <Badge key={name} variant="outline" className="text-xs">{name}</Badge>)}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Features Enabled</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {cust.features_enabled?.map((feat) => <Badge key={feat} className="bg-[#1B1F3B]/5 text-[#1B1F3B] text-xs">{feat}</Badge>)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Tickets */}
      {detail.support_tickets?.length > 0 && (
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Support Tickets ({detail.support_tickets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {detail.support_tickets.map((t) => (
                <div key={t.id || t.ticket_number} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t.issue_type}</p>
                    <p className="text-[11px] text-gray-400">{t.ticket_number} · {formatDate(t.created_at)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`text-[10px] ${getPriorityClass(t.priority)}`}>{t.priority}</Badge>
                    <Badge variant="outline" className="text-[10px]">{t.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerDetail;
