import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Hexagon, LayoutDashboard, AppWindow, ScanSearch, Shield, Package, FileText,
  Settings, ChevronRight, Bell, User, LogOut, Search, ChevronDown,
  AlertTriangle, AlertCircle, Info, ArrowUpRight, ArrowDownRight,
  BarChart3, Activity, Clock, Filter, Download, RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  dashboardStats, vulnerabilityTrend, applications, vulnerabilities,
  components as componentData, scanHistory, policyViolations
} from '../data/mockData';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', tab: 'overview' },
  { icon: AppWindow, label: 'Applications', tab: 'applications' },
  { icon: ScanSearch, label: 'Scan', tab: 'scan' },
  { icon: Shield, label: 'Vulnerabilities', tab: 'vulnerabilities' },
  { icon: Package, label: 'Components', tab: 'components' },
  { icon: FileText, label: 'Policy', tab: 'policy' },
];

const severityColors = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#EAB308',
  low: '#3B82F6',
  CRITICAL: '#EF4444',
  HIGH: '#F97316',
  MEDIUM: '#EAB308',
  LOW: '#3B82F6',
};

const COLORS = ['#EF4444', '#F97316', '#EAB308', '#3B82F6'];

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [scanInput, setScanInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  const pieData = [
    { name: 'Critical', value: dashboardStats.criticalVulns },
    { name: 'High', value: dashboardStats.highVulns },
    { name: 'Medium', value: dashboardStats.mediumVulns },
    { name: 'Low', value: dashboardStats.lowVulns },
  ];

  const handleScan = () => {
    if (!scanInput.trim()) return;
    setScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setScanComplete(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'} bg-[#1B1F3B] text-white flex flex-col transition-all duration-300 fixed top-0 left-0 h-full z-40`}>
        <div className="px-4 py-5 flex items-center gap-2.5 border-b border-white/10">
          <div className="relative flex-shrink-0">
            <Hexagon className="w-8 h-8 text-[#C8FF00] fill-[#C8FF00]" strokeWidth={1.5} />
            <span className="absolute inset-0 flex items-center justify-center text-[#1B1F3B] font-bold text-xs">A</span>
          </div>
          {!sidebarCollapsed && <span className="text-lg font-bold">Type-A</span>}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => (
            <button
              key={link.tab}
              onClick={() => setActiveTab(link.tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                activeTab === link.tab
                  ? 'bg-white/15 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{link.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-[14px] transition-all"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-[14px] transition-all mt-1"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications, components, CVEs..."
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-80 focus:outline-none focus:ring-2 focus:ring-[#1B1F3B]/20 focus:border-[#1B1F3B]/30"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#E8553A] rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#1B1F3B] flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#1B1F3B]">Dashboard Overview</h1>
                  <p className="text-gray-500 text-sm mt-1">Software supply chain security at a glance</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-sm gap-2"><Download className="w-4 h-4" /> Export</Button>
                  <Button variant="outline" className="text-sm gap-2"><RefreshCw className="w-4 h-4" /> Refresh</Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Applications', value: dashboardStats.totalApplications, icon: AppWindow, change: '+3', up: true },
                  { label: 'Critical Vulnerabilities', value: dashboardStats.criticalVulns, icon: AlertTriangle, change: '+5', up: true, danger: true },
                  { label: 'Total Components', value: dashboardStats.totalComponents.toLocaleString(), icon: Package, change: '+142', up: true },
                  { label: 'Malware Blocked', value: dashboardStats.malwareBlocked, icon: Shield, change: '+2', up: true },
                ].map((stat, idx) => (
                  <Card key={idx} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.danger ? 'bg-red-50' : 'bg-gray-50'}`}>
                          <stat.icon className={`w-5 h-5 ${stat.danger ? 'text-red-500' : 'text-[#1B1F3B]'}`} />
                        </div>
                        <span className={`text-xs font-medium flex items-center gap-0.5 ${stat.up ? (stat.danger ? 'text-red-500' : 'text-green-500') : 'text-red-500'}`}>
                          {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-[#1B1F3B]">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Vulnerability Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={vulnerabilityTrend}>
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
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Severity Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2">
                      {pieData.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
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
                  <CardTitle className="text-base font-semibold">Recent Scans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Application</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Date</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Duration</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Vulnerabilities</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Components</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scanHistory.map(scan => (
                          <tr key={scan.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 font-medium text-[#1B1F3B]">{scan.app}</td>
                            <td className="py-3 px-4 text-gray-500">{formatDate(scan.date)}</td>
                            <td className="py-3 px-4 text-gray-500">{scan.duration}</td>
                            <td className="py-3 px-4">
                              <span className="text-[#1B1F3B] font-medium">{scan.vulns}</span>
                            </td>
                            <td className="py-3 px-4 text-gray-500">{scan.components}</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">{scan.status}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#1B1F3B]">Applications</h1>
                  <p className="text-gray-500 text-sm mt-1">{applications.length} applications monitored</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-sm gap-2"><Filter className="w-4 h-4" /> Filter</Button>
                  <Button className="bg-[#1B1F3B] hover:bg-[#2A2F5B] text-white text-sm">Add Application</Button>
                </div>
              </div>

              <div className="grid gap-3">
                {applications.map(app => (
                  <Card key={app.id} className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelectedApp(app); setActiveTab('vulnerabilities'); }}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: severityColors[app.status] }} />
                          <div>
                            <h3 className="font-semibold text-[#1B1F3B]">{app.name}</h3>
                            <p className="text-xs text-gray-500">{app.organization} · {app.components} components</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex gap-3">
                            {app.critical > 0 && <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">C: {app.critical}</Badge>}
                            {app.high > 0 && <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs">H: {app.high}</Badge>}
                            <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">M: {app.medium}</Badge>
                            <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">L: {app.low}</Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Risk Score</p>
                            <p className="text-lg font-bold" style={{ color: severityColors[app.status] }}>{app.riskScore}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Last Scan</p>
                            <p className="text-xs text-gray-600">{formatDate(app.lastScan)}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Scan Tab */}
          {activeTab === 'scan' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1B1F3B]">SCA Scanner</h1>
                <p className="text-gray-500 text-sm mt-1">Powered by Trivy Open Source Scanner</p>
              </div>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <div className="max-w-2xl mx-auto text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#1B1F3B] flex items-center justify-center mx-auto mb-6">
                      <ScanSearch className="w-8 h-8 text-[#C8FF00]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1B1F3B] mb-2">Scan Your Project</h2>
                    <p className="text-gray-500 text-sm mb-6">Enter a repository URL, Docker image, or filesystem path to scan for vulnerabilities</p>
                    
                    <div className="flex gap-3 mb-6">
                      <input
                        type="text"
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        placeholder="e.g., github.com/org/repo, nginx:latest, ./project"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B1F3B]/20 focus:border-[#1B1F3B]/30"
                        disabled={scanning}
                      />
                      <Button
                        onClick={handleScan}
                        disabled={scanning || !scanInput.trim()}
                        className="bg-[#E8553A] hover:bg-[#d44a32] text-white px-8"
                      >
                        {scanning ? 'Scanning...' : 'Scan Now'}
                      </Button>
                    </div>

                    {scanning && (
                      <div className="space-y-3">
                        <Progress value={Math.min(scanProgress, 100)} className="h-2" />
                        <p className="text-sm text-gray-500">Analyzing dependencies... {Math.min(Math.round(scanProgress), 100)}%</p>
                      </div>
                    )}

                    {scanComplete && (
                      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6 text-left">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="font-semibold text-green-800">Scan Complete</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-red-600">5</p>
                            <p className="text-xs text-gray-600">Critical</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-orange-600">12</p>
                            <p className="text-xs text-gray-600">High</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">23</p>
                            <p className="text-xs text-gray-600">Medium</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">45</p>
                            <p className="text-xs text-gray-600">Low</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Found 234 components across 8 ecosystems. <button className="text-[#E8553A] font-medium hover:underline" onClick={() => setActiveTab('vulnerabilities')}>View full report →</button></p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Scan History */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Scan History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Application</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Date</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Duration</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Findings</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scanHistory.map(scan => (
                          <tr key={scan.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-[#1B1F3B]">{scan.app}</td>
                            <td className="py-3 px-4 text-gray-500">{formatDate(scan.date)}</td>
                            <td className="py-3 px-4 text-gray-500">{scan.duration}</td>
                            <td className="py-3 px-4 font-medium">{scan.vulns}</td>
                            <td className="py-3 px-4"><Badge className="bg-green-50 text-green-700 border-green-200 text-xs">{scan.status}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Vulnerabilities Tab */}
          {activeTab === 'vulnerabilities' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#1B1F3B]">Vulnerabilities</h1>
                  <p className="text-gray-500 text-sm mt-1">{vulnerabilities.length} vulnerabilities identified</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-sm gap-2"><Filter className="w-4 h-4" /> Filter</Button>
                  <Button variant="outline" className="text-sm gap-2"><Download className="w-4 h-4" /> Export CSV</Button>
                </div>
              </div>

              <div className="space-y-3">
                {vulnerabilities.map(vuln => (
                  <Card key={vuln.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge style={{ backgroundColor: `${severityColors[vuln.severity]}15`, color: severityColors[vuln.severity], borderColor: `${severityColors[vuln.severity]}30` }} className="text-xs font-bold">
                              {vuln.severity}
                            </Badge>
                            <span className="text-sm font-mono text-gray-500">{vuln.id}</span>
                            {vuln.kev && <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">KEV</Badge>}
                            {vuln.malware && <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs">MALWARE</Badge>}
                          </div>
                          <h3 className="font-semibold text-[#1B1F3B] mb-1">{vuln.title}</h3>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{vuln.description}</p>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <span>Component: <span className="font-medium text-gray-700">{vuln.component}</span></span>
                            <span>Version: <span className="font-medium text-gray-700">{vuln.version}</span></span>
                            <span>Fix: <span className="font-medium text-green-600">{vuln.fixedVersion}</span></span>
                            <span>EPSS: <span className="font-medium text-gray-700">{(vuln.epss * 100).toFixed(0)}%</span></span>
                            <span>Source: <span className="font-medium text-gray-700">{vuln.source}</span></span>
                          </div>
                        </div>
                        <div className="text-right ml-6">
                          <p className="text-3xl font-bold" style={{ color: severityColors[vuln.severity] }}>{vuln.cvss}</p>
                          <p className="text-xs text-gray-500">CVSS</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Components Tab */}
          {activeTab === 'components' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#1B1F3B]">Components</h1>
                  <p className="text-gray-500 text-sm mt-1">{componentData.length} tracked components</p>
                </div>
                <Button variant="outline" className="text-sm gap-2"><Download className="w-4 h-4" /> Export SBOM</Button>
              </div>

              <div className="overflow-x-auto">
                <Card className="border border-gray-200">
                  <CardContent className="p-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Component</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Version</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Latest</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Ecosystem</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">License</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Vulns</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Risk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {componentData.map(comp => (
                          <tr key={comp.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-5">
                              <span className="font-medium text-[#1B1F3B]">{comp.name}</span>
                              {comp.directDependency && <Badge className="ml-2 bg-blue-50 text-blue-700 border-blue-200 text-[10px]">direct</Badge>}
                            </td>
                            <td className="py-3 px-5 font-mono text-xs text-gray-600">{comp.version}</td>
                            <td className="py-3 px-5 font-mono text-xs text-green-600">{comp.latestVersion}</td>
                            <td className="py-3 px-5">
                              <Badge variant="outline" className="text-xs">{comp.ecosystem}</Badge>
                            </td>
                            <td className="py-3 px-5 text-xs text-gray-600">{comp.license}</td>
                            <td className="py-3 px-5">
                              {comp.vulnerabilities > 0 ? (
                                <span className="text-red-600 font-bold">{comp.vulnerabilities}</span>
                              ) : (
                                <span className="text-green-600">0</span>
                              )}
                            </td>
                            <td className="py-3 px-5">
                              <span className="font-bold" style={{ color: comp.riskScore >= 9 ? '#EF4444' : comp.riskScore >= 7 ? '#F97316' : comp.riskScore >= 4 ? '#EAB308' : '#22C55E' }}>
                                {comp.riskScore}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Policy Tab */}
          {activeTab === 'policy' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#1B1F3B]">Policy Violations</h1>
                  <p className="text-gray-500 text-sm mt-1">{policyViolations.length} active violations</p>
                </div>
                <Button className="bg-[#1B1F3B] hover:bg-[#2A2F5B] text-white text-sm">Create Policy</Button>
              </div>

              <div className="space-y-3">
                {policyViolations.map(pv => (
                  <Card key={pv.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: severityColors[pv.severity] }} />
                          <div>
                            <h3 className="font-semibold text-[#1B1F3B]">{pv.policy}</h3>
                            <p className="text-sm text-gray-500">{pv.component} · {pv.app}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge style={{ backgroundColor: `${severityColors[pv.severity]}15`, color: severityColors[pv.severity] }} className="text-xs">{pv.severity}</Badge>
                          <Badge variant="outline" className="text-xs">{pv.action}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
