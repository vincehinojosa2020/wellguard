import React from 'react';
import {
  Users, ScanSearch, Shield, Ticket, AlertTriangle,
  DollarSign, ExternalLink, Activity
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { formatNumber, formatMoney, formatDate } from '../../utils/formatters';

const CHART_COLORS = ['#EF4444', '#F97316', '#EAB308', '#3B82F6', '#8B5CF6', '#10B981', '#EC4899', '#06B6D4'];

const AdminOverview = ({ stats, alerts, onOpenCustomer }) => {
  const tierData = stats.tiers ? Object.entries(stats.tiers).map(([name, data]) => ({ name, count: data.count, mrr: data.mrr })) : [];
  const statusData = stats.statuses ? Object.entries(stats.statuses).map(([name, count]) => ({ name, value: count })) : [];
  const industryData = stats.top_industries || [];

  const metricCards = [
    { label: 'Total Customers', value: formatNumber(stats.total_customers), icon: Users, color: 'text-[#1B1F3B]' },
    { label: 'Monthly Revenue', value: formatMoney(stats.total_mrr), icon: DollarSign, color: 'text-green-600' },
    { label: 'Total Scans', value: formatNumber(stats.total_scans), icon: ScanSearch, color: 'text-blue-600' },
    { label: 'Vulnerabilities', value: formatNumber(stats.vulnerabilities?.total), icon: Shield, color: 'text-orange-600' },
    { label: 'Open Tickets', value: stats.support?.open_tickets, icon: Ticket, color: 'text-purple-600' },
    { label: 'Critical Accounts', value: stats.critical_customers, icon: AlertTriangle, color: 'text-red-600' },
  ];

  function getBarColor(name) {
    if (name === 'healthy') return '#22C55E';
    if (name === 'warning') return '#EAB308';
    if (name === 'critical') return '#EF4444';
    return '#9CA3AF';
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B1F3B]">Platform Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time view of all {formatNumber(stats.total_customers)} customer instances</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {metricCards.map((m) => (
          <Card key={m.label} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <m.icon className={`w-4 h-4 ${m.color}`} />
                <span className="text-xs text-gray-500">{m.label}</span>
              </div>
              <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border border-gray-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Customer Tiers</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={tierData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="count" paddingAngle={3}>
                  {tierData.map((entry) => <Cell key={entry.name} fill={CHART_COLORS[tierData.indexOf(entry) % CHART_COLORS.length]} />)}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {tierData.map((t) => (
                <div key={t.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[tierData.indexOf(t) % CHART_COLORS.length] }} />
                  <span className="text-gray-600">{t.name}: {t.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Instance Health</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RechartsTooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry) => <Cell key={entry.name} fill={getBarColor(entry.name)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Industries</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {industryData.slice(0, 8).map((ind) => (
                <div key={ind.name} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-32 truncate">{ind.name}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(ind.count / industryData[0].count) * 100}%`, backgroundColor: CHART_COLORS[industryData.indexOf(ind) % CHART_COLORS.length] }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-8 text-right">{ind.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border border-red-200 bg-red-50/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <CardTitle className="text-sm font-semibold text-red-800">Critical Accounts ({alerts?.critical_customers?.length || 0})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {alerts?.critical_customers?.slice(0, 8).map((c) => (
                <div key={c.id || c.name} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100 cursor-pointer hover:shadow-sm transition-shadow"
                  onClick={() => onOpenCustomer(c)}>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-500">Health: {c.health_score}% · {c.tier}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-700 text-[10px]">Critical</Badge>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-orange-200 bg-orange-50/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-orange-600" />
              <CardTitle className="text-sm font-semibold text-orange-800">Priority Tickets ({alerts?.critical_tickets?.length || 0})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {alerts?.critical_tickets?.slice(0, 8).map((t) => (
                <div key={t.id || t.ticket_number} className="flex items-center justify-between bg-white rounded-lg p-3 border border-orange-100">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t.subject}</p>
                    <p className="text-xs text-gray-500">{t.ticket_number} · {formatDate(t.created_at)}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-700 text-[10px]">{t.priority}</Badge>
                </div>
              ))}
              {(!alerts?.critical_tickets || alerts.critical_tickets.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No critical tickets — nice work!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
