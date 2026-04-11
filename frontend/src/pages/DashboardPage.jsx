import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Hexagon, LayoutDashboard, AppWindow, ScanSearch, Shield, Package, FileText,
  ChevronRight, Bell, User, LogOut, Search,
  AlertTriangle, ArrowUpRight,
  Download, RefreshCw, Filter, Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  dashboardStats as mockDashboardStats, vulnerabilityTrend as mockTrend,
  applications as mockApps, vulnerabilities as mockVulns,
  components as mockComponents, scanHistory as mockScanHistory,
  policyViolations as mockPolicies
} from '../data/mockData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', tab: 'overview' },
  { icon: ScanSearch, label: 'Scan', tab: 'scan' },
  { icon: Shield, label: 'Vulnerabilities', tab: 'vulnerabilities' },
  { icon: Package, label: 'Components', tab: 'components' },
  { icon: FileText, label: 'Scan History', tab: 'history' },
];

const severityColors = {
  critical: '#EF4444', high: '#F97316', medium: '#EAB308', low: '#3B82F6',
  CRITICAL: '#EF4444', HIGH: '#F97316', MEDIUM: '#EAB308', LOW: '#3B82F6',
};
const COLORS = ['#EF4444', '#F97316', '#EAB308', '#3B82F6'];

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data states
  const [stats, setStats] = useState(null);
  const [scans, setScans] = useState([]);
  const [vulns, setVulns] = useState([]);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Scan states
  const [scanInput, setScanInput] = useState('');
  const [scanType, setScanType] = useState('image');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [pollingScanId, setPollingScanId] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/dashboard/stats`);
      setStats(res.data);
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  }, []);

  const fetchScans = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/scans?limit=20`);
      setScans(res.data.scans || []);
    } catch (e) {
      console.error('Failed to fetch scans:', e);
    }
  }, []);

  const fetchVulns = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/vulnerabilities?limit=50`);
      setVulns(res.data.vulnerabilities || []);
    } catch (e) {
      console.error('Failed to fetch vulnerabilities:', e);
    }
  }, []);

  const fetchComponents = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/components?limit=100`);
      setComponents(res.data.components || []);
    } catch (e) {
      console.error('Failed to fetch components:', e);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchScans();
  }, [fetchStats, fetchScans]);

  useEffect(() => {
    if (activeTab === 'vulnerabilities') fetchVulns();
    if (activeTab === 'components') fetchComponents();
  }, [activeTab, fetchVulns, fetchComponents]);

  // Poll for scan completion
  useEffect(() => {
    if (!pollingScanId) return;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API}/scans/${pollingScanId}`);
        const scan = res.data;
        if (scan.status === 'completed') {
          setScanResult(scan);
          setScanning(false);
          setScanProgress(100);
          setPollingScanId(null);
          fetchStats();
          fetchScans();
          fetchVulns();
          fetchComponents();
        } else if (scan.status === 'error' || scan.status === 'timeout') {
          setScanError(scan.error || 'Scan failed');
          setScanning(false);
          setPollingScanId(null);
        } else {
          setScanProgress(prev => Math.min(prev + 3, 90));
        }
      } catch (e) {
        console.error('Poll error:', e);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [pollingScanId, fetchStats, fetchScans, fetchVulns, fetchComponents]);

  const handleScan = async () => {
    if (!scanInput.trim()) return;
    setScanning(true);
    setScanProgress(5);
    setScanResult(null);
    setScanError(null);

    try {
      const res = await axios.post(`${API}/scans`, {
        target: scanInput.trim(),
        scan_type: scanType,
      });
      setPollingScanId(res.data.id);
      setScanProgress(10);
    } catch (e) {
      setScanError(e.response?.data?.detail || 'Failed to start scan');
      setScanning(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // Use API data or fallback to mock
  const dashStats = stats || {
    total_scans: mockDashboardStats.totalScans,
    total_vulnerabilities: mockDashboardStats.criticalVulns + mockDashboardStats.highVulns + mockDashboardStats.mediumVulns + mockDashboardStats.lowVulns,
    total_components: mockDashboardStats.totalComponents,
    severity: { critical: mockDashboardStats.criticalVulns, high: mockDashboardStats.highVulns, medium: mockDashboardStats.mediumVulns, low: mockDashboardStats.lowVulns },
  };

  const pieData = [
    { name: 'Critical', value: dashStats.severity?.critical || 0 },
    { name: 'High', value: dashStats.severity?.high || 0 },
    { name: 'Medium', value: dashStats.severity?.medium || 0 },
    { name: 'Low', value: dashStats.severity?.low || 0 },
  ];

  const displayScans = scans.length > 0 ? scans : mockScanHistory;
  const displayVulns = vulns.length > 0 ? vulns : mockVulns;
  const displayComponents = components.length > 0 ? components : mockComponents;

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
                activeTab === link.tab ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{link.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-[14px] transition-all">
            <ChevronRight className={`w-5 h-5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-[14px] transition-all mt-1">
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
              <input type="text" placeholder="Search components, CVEs..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-80 focus:outline-none focus:ring-2 focus:ring-[#1B1F3B]/20 focus:border-[#1B1F3B]/30" />
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
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#1B1F3B]">Dashboard Overview</h1>
                  <p className="text-gray-500 text-sm mt-1">Your software supply chain at a glance</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-sm gap-2" onClick={() => { fetchStats(); fetchScans(); }}>
                    <RefreshCw className="w-4 h-4" /> Refresh
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Scans', value: dashStats.total_scans || 0, icon: ScanSearch },
                  { label: 'Vulnerabilities Found', value: dashStats.total_vulnerabilities || 0, icon: AlertTriangle, danger: true },
                  { label: 'Components Tracked', value: dashStats.total_components || 0, icon: Package },
                  { label: 'Critical Issues', value: dashStats.severity?.critical || 0, icon: Shield, danger: true },
                ].map((stat, idx) => (
                  <Card key={idx} className="border border-gray-200 hover:shadow-md transition-shadow">
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

              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Vulnerability Trend</CardTitle>
                  </CardHeader>
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
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Severity Breakdown</CardTitle>
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
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Recent Scans</CardTitle>
                    <Button variant="ghost" className="text-sm text-[#E8553A]" onClick={() => setActiveTab('scan')}>Run New Scan</Button>
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
                        {displayScans.slice(0, 5).map((scan, idx) => (
                          <tr key={scan.id || idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => { if (scan.id && scans.length > 0) { setActiveTab('vulnerabilities'); } }}>
                            <td className="py-3 px-4 font-medium text-[#1B1F3B]">{scan.target || scan.app}</td>
                            <td className="py-3 px-4 text-gray-500">{scan.scan_type || 'image'}</td>
                            <td className="py-3 px-4 text-gray-500">{formatDate(scan.created_at || scan.date)}</td>
                            <td className="py-3 px-4 text-gray-500">{scan.duration || '-'}</td>
                            <td className="py-3 px-4 font-medium">{scan.summary?.total_vulnerabilities ?? scan.vulns ?? '-'}</td>
                            <td className="py-3 px-4">
                              <Badge className={`text-xs ${
                                scan.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                scan.status === 'scanning' || scan.status === 'queued' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                scan.status === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-green-50 text-green-700 border-green-200'
                              }`}>{scan.status}</Badge>
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

          {/* SCAN TAB */}
          {activeTab === 'scan' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1B1F3B]">SCA Scanner</h1>
                <p className="text-gray-500 text-sm mt-1">Powered by Trivy v0.69 — Real vulnerability scanning</p>
              </div>

              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <div className="max-w-2xl mx-auto text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#1B1F3B] flex items-center justify-center mx-auto mb-6">
                      <ScanSearch className="w-8 h-8 text-[#C8FF00]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1B1F3B] mb-2">Scan Your Target</h2>
                    <p className="text-gray-500 text-sm mb-6">Enter a Docker image, Git repository URL, or filesystem path</p>

                    {/* Scan Type Selector */}
                    <div className="flex justify-center gap-2 mb-4">
                      {[
                        { value: 'image', label: 'Docker Image' },
                        { value: 'repo', label: 'Git Repo' },
                        { value: 'fs', label: 'Filesystem' },
                      ].map(t => (
                        <button
                          key={t.value}
                          onClick={() => setScanType(t.value)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            scanType === t.value
                              ? 'bg-[#1B1F3B] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3 mb-6">
                      <input
                        type="text"
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        placeholder={
                          scanType === 'image' ? 'e.g., nginx:latest, python:3.11-slim, node:20-alpine' :
                          scanType === 'repo' ? 'e.g., https://github.com/org/repo' :
                          'e.g., /path/to/project'
                        }
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B1F3B]/20 focus:border-[#1B1F3B]/30"
                        disabled={scanning}
                        onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                      />
                      <Button
                        onClick={handleScan}
                        disabled={scanning || !scanInput.trim()}
                        className="bg-[#E8553A] hover:bg-[#d44a32] text-white px-8 h-[48px]"
                      >
                        {scanning ? (
                          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Scanning...</>
                        ) : (
                          'Scan Now'
                        )}
                      </Button>
                    </div>

                    {scanning && (
                      <div className="space-y-3">
                        <Progress value={Math.min(scanProgress, 100)} className="h-2" />
                        <p className="text-sm text-gray-500">
                          {scanProgress < 20 ? 'Initializing Trivy scanner...' :
                           scanProgress < 50 ? 'Downloading vulnerability database...' :
                           scanProgress < 80 ? 'Analyzing dependencies and components...' :
                           'Finalizing results...'}
                          {' '}{Math.min(Math.round(scanProgress), 100)}%
                        </p>
                      </div>
                    )}

                    {scanError && (
                      <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6 text-left">
                        <p className="font-semibold text-red-800 mb-2">Scan Failed</p>
                        <p className="text-sm text-red-600">{scanError}</p>
                        <p className="text-xs text-gray-500 mt-2">Tip: For Docker images, ensure the image name is valid (e.g., nginx:latest). For repos, use a full URL.</p>
                      </div>
                    )}

                    {scanResult && (
                      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6 text-left">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="font-semibold text-green-800">Scan Complete — {scanResult.duration}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          {[
                            { label: 'Critical', value: scanResult.summary?.severity_counts?.CRITICAL || 0, color: 'text-red-600' },
                            { label: 'High', value: scanResult.summary?.severity_counts?.HIGH || 0, color: 'text-orange-600' },
                            { label: 'Medium', value: scanResult.summary?.severity_counts?.MEDIUM || 0, color: 'text-yellow-600' },
                            { label: 'Low', value: scanResult.summary?.severity_counts?.LOW || 0, color: 'text-blue-600' },
                          ].map((s, i) => (
                            <div key={i} className="text-center">
                              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                              <p className="text-xs text-gray-600">{s.label}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          Found {scanResult.summary?.total_components || 0} components with{' '}
                          {scanResult.summary?.total_vulnerabilities || 0} vulnerabilities.{' '}
                          <button className="text-[#E8553A] font-medium hover:underline" onClick={() => setActiveTab('vulnerabilities')}>
                            View full report →
                          </button>
                        </p>
                      </div>
                    )}

                    {/* Quick scan suggestions */}
                    <div className="mt-8 text-left">
                      <p className="text-xs text-gray-400 uppercase font-semibold mb-3">Popular targets to try:</p>
                      <div className="flex flex-wrap gap-2">
                        {['nginx:latest', 'python:3.11-slim', 'node:20-alpine', 'alpine:3.19', 'ubuntu:22.04', 'redis:7-alpine'].map(img => (
                          <button
                            key={img}
                            onClick={() => { setScanInput(img); setScanType('image'); }}
                            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors font-mono"
                          >
                            {img}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* VULNERABILITIES TAB */}
          {activeTab === 'vulnerabilities' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#1B1F3B]">Vulnerabilities</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {vulns.length > 0 ? `${vulns.length} vulnerabilities from live scans` : 'Showing sample data — run a scan to see real results'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-sm gap-2" onClick={fetchVulns}><RefreshCw className="w-4 h-4" /> Refresh</Button>
                  <Button variant="outline" className="text-sm gap-2"><Download className="w-4 h-4" /> Export CSV</Button>
                </div>
              </div>

              <div className="space-y-3">
                {displayVulns.map((vuln, idx) => {
                  const severity = vuln.severity || 'MEDIUM';
                  const cvss = vuln.cvss || 0;
                  return (
                    <Card key={vuln.id || vuln.vuln_id || idx} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <Badge style={{ backgroundColor: `${severityColors[severity]}15`, color: severityColors[severity], borderColor: `${severityColors[severity]}30` }} className="text-xs font-bold">
                                {severity}
                              </Badge>
                              <span className="text-sm font-mono text-gray-500">{vuln.vuln_id || vuln.id}</span>
                              {vuln.kev && <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">KEV</Badge>}
                              {vuln.malware && <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs">MALWARE</Badge>}
                            </div>
                            <h3 className="font-semibold text-[#1B1F3B] mb-1">{vuln.title}</h3>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{vuln.description}</p>
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                              <span>Component: <span className="font-medium text-gray-700">{vuln.component}</span></span>
                              <span>Version: <span className="font-medium text-gray-700">{vuln.version || vuln.installed_version}</span></span>
                              <span>Fix: <span className="font-medium text-green-600">{vuln.fixed_version || vuln.fixedVersion || 'N/A'}</span></span>
                              {vuln.source && <span>Source: <span className="font-medium text-gray-700">{vuln.source}</span></span>}
                            </div>
                          </div>
                          <div className="text-right ml-6">
                            <p className="text-3xl font-bold" style={{ color: severityColors[severity] }}>{cvss.toFixed ? cvss.toFixed(1) : cvss}</p>
                            <p className="text-xs text-gray-500">CVSS</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {displayVulns.length === 0 && (
                  <div className="text-center py-16">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No vulnerabilities found yet</p>
                    <p className="text-gray-400 text-sm mt-1">Run a scan to discover vulnerabilities in your targets</p>
                    <Button className="mt-4 bg-[#E8553A] hover:bg-[#d44a32] text-white" onClick={() => setActiveTab('scan')}>
                      Run Your First Scan
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* COMPONENTS TAB */}
          {activeTab === 'components' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#1B1F3B]">Components</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {components.length > 0 ? `${components.length} components from live scans` : 'Showing sample data — run a scan to see real results'}
                  </p>
                </div>
                <Button variant="outline" className="text-sm gap-2"><Download className="w-4 h-4" /> Export SBOM</Button>
              </div>

              <Card className="border border-gray-200">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Component</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Version</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Ecosystem</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Vulns</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Risk Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayComponents.map((comp, idx) => (
                          <tr key={comp.id || idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-5 font-medium text-[#1B1F3B]">{comp.name}</td>
                            <td className="py-3 px-5 font-mono text-xs text-gray-600">{comp.version}</td>
                            <td className="py-3 px-5">
                              <Badge variant="outline" className="text-xs">{comp.ecosystem}</Badge>
                            </td>
                            <td className="py-3 px-5">
                              {(comp.vulnerabilities || 0) > 0 ? (
                                <span className="text-red-600 font-bold">{comp.vulnerabilities}</span>
                              ) : (
                                <span className="text-green-600">0</span>
                              )}
                            </td>
                            <td className="py-3 px-5">
                              <span className="font-bold" style={{
                                color: (comp.risk_score || comp.riskScore || 0) >= 9 ? '#EF4444' :
                                       (comp.risk_score || comp.riskScore || 0) >= 7 ? '#F97316' :
                                       (comp.risk_score || comp.riskScore || 0) >= 4 ? '#EAB308' : '#22C55E'
                              }}>
                                {(comp.risk_score || comp.riskScore || 0).toFixed ? (comp.risk_score || comp.riskScore || 0).toFixed(1) : (comp.risk_score || comp.riskScore || 0)}
                              </span>
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

          {/* SCAN HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#1B1F3B]">Scan History</h1>
                  <p className="text-gray-500 text-sm mt-1">All scans performed on this platform</p>
                </div>
                <Button className="bg-[#E8553A] hover:bg-[#d44a32] text-white text-sm" onClick={() => setActiveTab('scan')}>
                  New Scan
                </Button>
              </div>

              <Card className="border border-gray-200">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Target</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Type</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Date</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Duration</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Vulnerabilities</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Components</th>
                          <th className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayScans.map((scan, idx) => (
                          <tr key={scan.id || idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-5 font-medium text-[#1B1F3B]">{scan.target || scan.app}</td>
                            <td className="py-3 px-5 text-gray-500">{scan.scan_type || 'image'}</td>
                            <td className="py-3 px-5 text-gray-500">{formatDate(scan.created_at || scan.date)}</td>
                            <td className="py-3 px-5 text-gray-500">{scan.duration || '-'}</td>
                            <td className="py-3 px-5 font-medium">{scan.summary?.total_vulnerabilities ?? scan.vulns ?? '-'}</td>
                            <td className="py-3 px-5 text-gray-500">{scan.summary?.total_components ?? scan.components ?? '-'}</td>
                            <td className="py-3 px-5">
                              <Badge className={`text-xs ${
                                scan.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                scan.status === 'scanning' || scan.status === 'queued' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                scan.status === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-green-50 text-green-700 border-green-200'
                              }`}>{scan.status}</Badge>
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
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
