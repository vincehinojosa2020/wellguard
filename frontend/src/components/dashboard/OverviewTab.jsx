import React from 'react';
import {
  ScanSearch, AlertTriangle, Package, Shield,
  Download, RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { vulnerabilityTrend as mockTrend } from '../../data/mockData';
import { formatDate } from '../../utils/formatters';

const COLORS = ['#EF4444', '#F97316', '#EAB308', '#3B82F6'];

const OverviewTab = ({ stats, scans, onRefresh, onNavigate }) => {
  const pieData = [
    { name: 'Critical', value: stats.severity?.critical || 0 },
    { name: 'High', value: stats.severity?.high || 0 },
    { name: 'Medium', value: stats.severity?.medium || 0 },
    { name: 'Low', value: stats.severity?.low || 0 },
  ];

  const statCards = [
    { label: 'Total Scans', value: stats.total_scans || 0, icon: ScanSearch, danger: false },
    { label: 'Vulnerabilities Found', value: stats.total_vulnerabilities || 0, icon: AlertTriangle, danger: true },
    { label: 'Components Tracked', value: stats.total_components || 0, icon: Package, danger: false },
    { label: 'Critical Issues', value: stats.severity?.critical || 0, icon: Shield, danger: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1F3B]">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Your software supply chain at a glance</p>
        </div>
        <Button variant="outline" className="text-sm gap-2" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.danger ? 'bg-red-50' : 'bg-gray-50'}`}>
                  <stat.icon className={`w-5 h-5 ${stat.danger ? 'text-red-500' : 'text-[#1B1F3B]'}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1B1F3B]">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-gray-200">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Vulnerability Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={mockTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip />
                <Area type="monotone" dataKey="critical" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                <Area type="monotone" dataKey="high" stackId="1" stroke="#F97316" fill="#F97316" fillOpacity={0.6} />
                <Area type="monotone" dataKey="medium" stackId="1" stroke="#EAB308" fill="#EAB308" fillOpacity={0.4} />
                <Area type="monotone" dataKey="low" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Severity Breakdown</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry) => <Cell key={entry.name} fill={COLORS[pieData.indexOf(entry)]} />)}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[pieData.indexOf(item)] }} />
                  <span className="text-gray-600">{item.name}: <span className="font-semibold">{item.value}</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Recent Scans</CardTitle>
            <Button variant="ghost" className="text-sm text-[#E8553A]" onClick={() => onNavigate('scan')}>Run New Scan</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Target</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Type</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Duration</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Findings</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {scans.slice(0, 5).map((scan) => {
                  const scanKey = scan.id || scan.app || scan.target;
                  const statusClass = scan.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200'
                    : (scan.status === 'scanning' || scan.status === 'queued') ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : scan.status === 'error' ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-green-50 text-green-700 border-green-200';
                  return (
                    <tr key={scanKey} className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onNavigate('vulnerabilities')}>
                      <td className="py-3 px-4 font-medium text-[#1B1F3B]">{scan.target || scan.app}</td>
                      <td className="py-3 px-4 text-gray-500">{scan.scan_type || 'image'}</td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(scan.created_at || scan.date)}</td>
                      <td className="py-3 px-4 text-gray-500">{scan.duration || '-'}</td>
                      <td className="py-3 px-4 font-medium">{scan.summary?.total_vulnerabilities ?? scan.vulns ?? '-'}</td>
                      <td className="py-3 px-4"><Badge className={`text-xs ${statusClass}`}>{scan.status}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
