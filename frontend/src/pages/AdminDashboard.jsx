import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Hexagon, LayoutDashboard, Users, ScanSearch, Shield, BarChart3,
  ChevronRight, ChevronLeft, Bell, User, LogOut, Search,
  AlertTriangle, ArrowUpRight, ArrowDownRight, ArrowRight,
  Download, RefreshCw, Filter, Loader2, X, ExternalLink,
  Activity, DollarSign, Globe, Server, Ticket, Eye,
  CheckCircle2, XCircle, Clock, AlertCircle, ChevronDown,
  Package, Terminal, Zap, TrendingUp, Building2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const severityColors = {
  critical: '#EF4444', high: '#F97316', medium: '#EAB308', low: '#3B82F6',
  CRITICAL: '#EF4444', HIGH: '#F97316', MEDIUM: '#EAB308', LOW: '#3B82F6',
};

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

const CHART_COLORS = ['#EF4444', '#F97316', '#EAB308', '#3B82F6', '#8B5CF6', '#10B981', '#EC4899', '#06B6D4'];

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customerTotal, setCustomerTotal] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState('health_score');
  const [sortOrder, setSortOrder] = useState('asc');
  const pageSize = 25;

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/stats`);
      setStats(res.data);
    } catch (e) { console.error(e); }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterTier) params.append('tier', filterTier);
      if (filterStatus) params.append('status', filterStatus);
      if (filterIndustry) params.append('industry', filterIndustry);
      params.append('sort_by', sortBy);
      params.append('sort_order', sortOrder);
      params.append('limit', pageSize);
      params.append('skip', currentPage * pageSize);

      const res = await axios.get(`${API}/admin/customers?${params.toString()}`);
      setCustomers(res.data.customers || []);
      setCustomerTotal(res.data.total || 0);
    } catch (e) { console.error(e); }
  }, [searchQuery, filterTier, filterStatus, filterIndustry, sortBy, sortOrder, currentPage]);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/alerts`);
      setAlerts(res.data);
    } catch (e) { console.error(e); }
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/tickets?limit=20`);
      setTickets(res.data.tickets || []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchAlerts(), fetchTickets()]);
      setLoading(false);
    };
    init();
  }, [fetchStats, fetchAlerts, fetchTickets]);

  useEffect(() => {
    if (activeView === 'customers') fetchCustomers();
  }, [activeView, fetchCustomers]);

  const openCustomerDetail = async (customer) => {
    setSelectedCustomer(customer);
    setDetailLoading(true);
    setActiveView('customer-detail');
    try {
      const res = await axios.get(`${API}/admin/customers/${customer.id}`);
      setCustomerDetail(res.data);
    } catch (e) { console.error(e); }
    setDetailLoading(false);
  };

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatMoney = (n) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n}`;
  };

  const formatNumber = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n?.toLocaleString?.() || n;
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1B1F3B] mx-auto mb-4" />
          <p className="text-gray-500">Loading platform data...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Platform Overview', view: 'overview' },
    { icon: Users, label: 'Customers', view: 'customers', badge: stats.total_customers },
    { icon: Ticket, label: 'Support Tickets', view: 'tickets', badge: stats.support?.open_tickets },
    { icon: AlertTriangle, label: 'Alerts', view: 'alerts', badge: stats.critical_customers },
  ];

  const tierData = stats.tiers ? Object.entries(stats.tiers).map(([name, data]) => ({ name, count: data.count, mrr: data.mrr })) : [];
  const statusData = stats.statuses ? Object.entries(stats.statuses).map(([name, count]) => ({ name, value: count })) : [];
  const industryData = stats.top_industries || [];
  const regionData = stats.regions ? Object.entries(stats.regions).map(([name, count]) => ({ name, count })) : [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-[72px]' : 'w-[280px]'} bg-[#0F1225] text-white flex flex-col transition-all duration-300 fixed top-0 left-0 h-full z-40`}>
        <div className="px-4 py-5 flex items-center gap-2.5 border-b border-white/10">
          <div className="relative flex-shrink-0">
            <Hexagon className="w-8 h-8 text-[#C8FF00] fill-[#C8FF00]" strokeWidth={1.5} />
            <span className="absolute inset-0 flex items-center justify-center text-[#0F1225] font-bold text-xs">A</span>
          </div>
          {!sidebarCollapsed && (
            <div>
              <span className="text-lg font-bold">Type-A</span>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Admin Console</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.view}
              onClick={() => { setActiveView(item.view); setSelectedCustomer(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                activeView === item.view ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-white/10 text-[11px] px-2 py-0.5 rounded-full">{formatNumber(item.badge)}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-[14px]">
            <ChevronRight className={`w-5 h-5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
          <Link to="/dashboard" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-[14px] mt-1">
            <Terminal className="w-5 h-5" />
            {!sidebarCollapsed && <span>Scanner Console</span>}
          </Link>
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-[14px] mt-1">
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 ${sidebarCollapsed ? 'ml-[72px]' : 'ml-[280px]'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {selectedCustomer && (
              <button onClick={() => { setActiveView('customers'); setSelectedCustomer(null); }} className="p-1.5 rounded-lg hover:bg-gray-100">
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
            )}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search customers, tickets, CVEs..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-96 focus:outline-none focus:ring-2 focus:ring-[#1B1F3B]/20" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-50 text-green-700 border-green-200 text-xs gap-1">
              <Activity className="w-3 h-3" /> Platform Healthy
            </Badge>
            <button className="relative p-2 rounded-lg hover:bg-gray-50">
              <Bell className="w-5 h-5 text-gray-500" />
              {stats.support?.critical_tickets > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#1B1F3B] flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Support Admin</p>
                <p className="text-[10px] text-gray-400">Platform Engineering</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* ========== OVERVIEW ========== */}
          {activeView === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1B1F3B]">Platform Overview</h1>
                <p className="text-gray-500 text-sm mt-1">Real-time view of all {formatNumber(stats.total_customers)} customer instances</p>
              </div>

              {/* Top Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Total Customers', value: formatNumber(stats.total_customers), icon: Users, color: 'text-[#1B1F3B]' },
                  { label: 'Monthly Revenue', value: formatMoney(stats.total_mrr), icon: DollarSign, color: 'text-green-600' },
                  { label: 'Total Scans', value: formatNumber(stats.total_scans), icon: ScanSearch, color: 'text-blue-600' },
                  { label: 'Vulnerabilities', value: formatNumber(stats.vulnerabilities?.total), icon: Shield, color: 'text-orange-600' },
                  { label: 'Open Tickets', value: stats.support?.open_tickets, icon: Ticket, color: 'text-purple-600' },
                  { label: 'Critical Accounts', value: stats.critical_customers, icon: AlertTriangle, color: 'text-red-600' },
                ].map((m, i) => (
                  <Card key={i} className="border border-gray-200 hover:shadow-md transition-shadow">
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

              {/* Charts Row */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Tier Distribution */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Customer Tiers</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={tierData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="count" paddingAngle={3}>
                          {tierData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {tierData.map((t, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                          <span className="text-gray-600">{t.name}: {t.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Instance Health */}
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
                          {statusData.map((entry, i) => (
                            <Cell key={i} fill={entry.name === 'healthy' ? '#22C55E' : entry.name === 'warning' ? '#EAB308' : entry.name === 'critical' ? '#EF4444' : '#9CA3AF'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Top Industries */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Top Industries</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {industryData.slice(0, 8).map((ind, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs text-gray-600 w-32 truncate">{ind.name}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(ind.count / industryData[0].count) * 100}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                          </div>
                          <span className="text-xs font-medium text-gray-700 w-8 text-right">{ind.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Alerts & Critical Accounts */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Critical Customers */}
                <Card className="border border-red-200 bg-red-50/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <CardTitle className="text-sm font-semibold text-red-800">Critical Accounts ({alerts?.critical_customers?.length || 0})</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {alerts?.critical_customers?.slice(0, 8).map((c, i) => (
                        <div key={i} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100 cursor-pointer hover:shadow-sm transition-shadow"
                          onClick={() => openCustomerDetail(c)}>
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

                {/* Critical Tickets */}
                <Card className="border border-orange-200 bg-orange-50/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-orange-600" />
                      <CardTitle className="text-sm font-semibold text-orange-800">Priority Tickets ({alerts?.critical_tickets?.length || 0})</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {alerts?.critical_tickets?.slice(0, 8).map((t, i) => (
                        <div key={i} className="flex items-center justify-between bg-white rounded-lg p-3 border border-orange-100">
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
          )}

          {/* ========== CUSTOMERS LIST ========== */}
          {activeView === 'customers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#1B1F3B]">Customer Instances</h1>
                  <p className="text-gray-500 text-sm mt-1">{customerTotal} accounts · Click to remote into any instance</p>
                </div>
                <Button variant="outline" className="text-sm gap-2"><Download className="w-4 h-4" /> Export</Button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(0); }}
                    placeholder="Search by name, ID, or email..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B1F3B]/20"
                  />
                </div>
                <select value={filterTier} onChange={e => { setFilterTier(e.target.value); setCurrentPage(0); }}
                  className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none">
                  <option value="">All Tiers</option>
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Enterprise Plus">Enterprise Plus</option>
                </select>
                <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(0); }}
                  className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none">
                  <option value="">All Status</option>
                  <option value="healthy">Healthy</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none">
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

              {/* Customer Table */}
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
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((c, idx) => {
                          const sc = statusColors[c.status] || statusColors.healthy;
                          return (
                            <tr key={c.id || idx} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                              onClick={() => openCustomerDetail(c)}>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${sc.dot}`} />
                                  <div>
                                    <p className="font-medium text-[#1B1F3B]">{c.name}</p>
                                    <p className="text-[11px] text-gray-400">{c.customer_number} · {c.industry}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={`${tierColors[c.tier]} text-[10px] font-medium`}>{c.tier}</Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={`${sc.bg} ${sc.text} ${sc.border} text-[10px]`}>{c.status}</Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{
                                      width: `${c.health_score}%`,
                                      backgroundColor: c.health_score >= 85 ? '#22C55E' : c.health_score >= 60 ? '#EAB308' : '#EF4444'
                                    }} />
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
                              <td className="py-3 px-4">
                                <ExternalLink className="w-4 h-4 text-gray-300 hover:text-[#1B1F3B]" />
                              </td>
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
                  Showing {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, customerTotal)} of {customerTotal}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={(currentPage + 1) * pageSize >= customerTotal}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ========== CUSTOMER DETAIL ========== */}
          {activeView === 'customer-detail' && selectedCustomer && (
            <div className="space-y-6">
              {detailLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1B1F3B] mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Connecting to {selectedCustomer.name}'s instance...</p>
                  </div>
                </div>
              ) : customerDetail ? (
                <>
                  {/* Customer Header */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedCustomer.status === 'healthy' ? 'bg-green-50' :
                          selectedCustomer.status === 'warning' ? 'bg-yellow-50' :
                          selectedCustomer.status === 'critical' ? 'bg-red-50' : 'bg-gray-50'
                        }`}>
                          <Building2 className={`w-6 h-6 ${
                            selectedCustomer.status === 'healthy' ? 'text-green-600' :
                            selectedCustomer.status === 'warning' ? 'text-yellow-600' :
                            selectedCustomer.status === 'critical' ? 'text-red-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-[#1B1F3B]">{customerDetail.customer.name}</h1>
                            <Badge className={`${tierColors[customerDetail.customer.tier]} text-xs`}>{customerDetail.customer.tier}</Badge>
                            <Badge className={`${statusColors[customerDetail.customer.status]?.bg} ${statusColors[customerDetail.customer.status]?.text} text-xs`}>
                              {customerDetail.customer.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {customerDetail.customer.customer_number} · {customerDetail.customer.industry} · {customerDetail.customer.region}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="text-sm gap-2"><Terminal className="w-4 h-4" /> Open Console</Button>
                        <Button className="bg-[#1B1F3B] hover:bg-[#2A2F5B] text-white text-sm gap-2"><Eye className="w-4 h-4" /> View as Customer</Button>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t border-gray-100">
                      {[
                        { label: 'Health Score', value: `${customerDetail.customer.health_score}%`, color: customerDetail.customer.health_score >= 85 ? 'text-green-600' : customerDetail.customer.health_score >= 60 ? 'text-yellow-600' : 'text-red-600' },
                        { label: 'Applications', value: customerDetail.customer.application_count },
                        { label: 'Total Scans', value: formatNumber(customerDetail.customer.scan_count) },
                        { label: 'Developers', value: formatNumber(customerDetail.customer.developer_count) },
                        { label: 'Components', value: formatNumber(customerDetail.customer.component_count) },
                        { label: 'MRR', value: customerDetail.customer.mrr > 0 ? formatMoney(customerDetail.customer.mrr) : 'Free', color: 'text-green-600' },
                      ].map((s, i) => (
                        <div key={i}>
                          <p className="text-xs text-gray-500">{s.label}</p>
                          <p className={`text-lg font-bold ${s.color || 'text-[#1B1F3B]'}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vulnerability Summary */}
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'Critical', value: customerDetail.customer.vulnerabilities.critical, color: '#EF4444' },
                      { label: 'High', value: customerDetail.customer.vulnerabilities.high, color: '#F97316' },
                      { label: 'Medium', value: customerDetail.customer.vulnerabilities.medium, color: '#EAB308' },
                      { label: 'Low', value: customerDetail.customer.vulnerabilities.low, color: '#3B82F6' },
                    ].map((s, i) => (
                      <Card key={i} className="border border-gray-200">
                        <CardContent className="p-4 text-center">
                          <p className="text-3xl font-bold" style={{ color: s.color }}>{formatNumber(s.value)}</p>
                          <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Customer Details: Scans, Vulns, Meta */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Scans */}
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">Recent Scans</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {customerDetail.scans?.slice(0, 12).map((scan, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#1B1F3B] truncate">{scan.target}</p>
                                <p className="text-[11px] text-gray-400">{formatDate(scan.created_at)} · {scan.duration || '-'}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-3">
                                {scan.summary && <span className="text-xs font-medium">{scan.summary.total_vulnerabilities} vulns</span>}
                                <Badge className={`text-[10px] ${
                                  scan.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>{scan.status}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Top Vulnerabilities */}
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">Top Vulnerabilities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {customerDetail.vulnerabilities?.slice(0, 12).map((v, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <Badge style={{ backgroundColor: `${severityColors[v.severity]}15`, color: severityColors[v.severity] }} className="text-[10px] font-bold">{v.severity}</Badge>
                                  <span className="text-[11px] font-mono text-gray-500">{v.vuln_id}</span>
                                </div>
                                <p className="text-sm text-gray-700 truncate">{v.title}</p>
                                <p className="text-[11px] text-gray-400">{v.component} · Fix: {v.fixed_version}</p>
                              </div>
                              <span className="text-lg font-bold ml-3" style={{ color: severityColors[v.severity] }}>{v.cvss}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Account Metadata */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Account Info</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { label: 'Contact', value: customerDetail.customer.contact_email },
                          { label: 'CSM', value: customerDetail.customer.csm },
                          { label: 'Region', value: customerDetail.customer.region },
                          { label: 'Created', value: formatDate(customerDetail.customer.created_at) },
                          { label: 'Last Scan', value: formatDate(customerDetail.customer.last_scan) },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
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
                          {customerDetail.customer.integrations?.map((int_name, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{int_name}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Features Enabled</CardTitle></CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {customerDetail.customer.features_enabled?.map((feat, i) => (
                            <Badge key={i} className="bg-[#1B1F3B]/5 text-[#1B1F3B] text-xs">{feat}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Support Tickets */}
                  {customerDetail.support_tickets?.length > 0 && (
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">Support Tickets ({customerDetail.support_tickets.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {customerDetail.support_tickets.map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="text-sm font-medium text-gray-800">{t.issue_type}</p>
                                <p className="text-[11px] text-gray-400">{t.ticket_number} · {formatDate(t.created_at)}</p>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={`text-[10px] ${
                                  t.priority === 'critical' ? 'bg-red-50 text-red-700' :
                                  t.priority === 'high' ? 'bg-orange-50 text-orange-700' :
                                  t.priority === 'medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-700'
                                }`}>{t.priority}</Badge>
                                <Badge variant="outline" className="text-[10px]">{t.status}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : null}
            </div>
          )}

          {/* ========== TICKETS ========== */}
          {activeView === 'tickets' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1B1F3B]">Support Tickets</h1>
                <p className="text-gray-500 text-sm mt-1">All open and recent tickets across customers</p>
              </div>
              <Card className="border border-gray-200">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Ticket</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Customer</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Issue</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Priority</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Status</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Assigned</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((t, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-3 px-4 font-mono text-xs text-gray-500">{t.ticket_number}</td>
                            <td className="py-3 px-4 font-medium text-[#1B1F3B]">{t.customer_name}</td>
                            <td className="py-3 px-4 text-gray-600">{t.issue_type}</td>
                            <td className="py-3 px-4">
                              <Badge className={`text-[10px] ${
                                t.priority === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                                t.priority === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                t.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                'bg-gray-50 text-gray-700 border-gray-200'
                              }`}>{t.priority}</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="text-[10px]">{t.status}</Badge>
                            </td>
                            <td className="py-3 px-4 text-gray-500 text-xs">{t.assigned_to}</td>
                            <td className="py-3 px-4 text-gray-400 text-xs">{formatDate(t.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ========== ALERTS ========== */}
          {activeView === 'alerts' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1B1F3B]">Platform Alerts</h1>
                <p className="text-gray-500 text-sm mt-1">Accounts requiring immediate attention</p>
              </div>

              {/* High Risk Customers */}
              <Card className="border border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-red-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> High-Risk Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {alerts?.high_risk_customers?.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-100 hover:shadow-sm cursor-pointer"
                        onClick={() => openCustomerDetail(c)}>
                        <div>
                          <p className="font-medium text-gray-800">{c.name}</p>
                          <p className="text-xs text-gray-500">Risk: {c.risk_score} · {c.tier} · Vulns: {formatNumber(c.vulnerabilities?.total)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-red-600">{c.risk_score}</span>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Critical Customers */}
              <Card className="border border-orange-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-orange-800 flex items-center gap-2">
                    <Server className="w-4 h-4" /> Critical Instance Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {alerts?.critical_customers?.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-100 hover:shadow-sm cursor-pointer"
                        onClick={() => openCustomerDetail(c)}>
                        <div>
                          <p className="font-medium text-gray-800">{c.name}</p>
                          <p className="text-xs text-gray-500">Health: {c.health_score}% · {c.tier}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={c.health_score} className="w-20 h-2" />
                          <span className="text-sm font-bold text-red-600">{c.health_score}%</span>
                        </div>
                      </div>
                    ))}
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

export default AdminDashboard;
