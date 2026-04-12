import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Hexagon, LayoutDashboard, Users, ChevronRight, ChevronLeft,
  Bell, User, LogOut, Search, AlertTriangle, Activity,
  Loader2, Ticket, Terminal
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { formatNumber } from '../utils/formatters';

import AdminOverview from '../components/admin/AdminOverview';
import CustomerList from '../components/admin/CustomerList';
import CustomerDetail from '../components/admin/CustomerDetail';
import TicketsView from '../components/admin/TicketsView';
import AlertsView from '../components/admin/AlertsView';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState('health_score');
  const [sortOrder, setSortOrder] = useState('asc');
  const pageSize = 25;

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/stats`);
      setStats(res.data);
    } catch (_) { /* silenced */ }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterTier) params.append('tier', filterTier);
      if (filterStatus) params.append('status', filterStatus);
      params.append('sort_by', sortBy);
      params.append('sort_order', sortOrder);
      params.append('limit', pageSize);
      params.append('skip', currentPage * pageSize);
      const res = await axios.get(`${API}/admin/customers?${params.toString()}`);
      setCustomers(res.data.customers || []);
      setCustomerTotal(res.data.total || 0);
    } catch (_) { /* silenced */ }
  }, [searchQuery, filterTier, filterStatus, sortBy, sortOrder, currentPage]);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/alerts`);
      setAlerts(res.data);
    } catch (_) { /* silenced */ }
  }, []);

  const fetchTickets = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/tickets?limit=20`);
      setTickets(res.data.tickets || []);
    } catch (_) { /* silenced */ }
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
    } catch (_) { /* silenced */ }
    setDetailLoading(false);
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="admin-loading">
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

  return (
    <div className="min-h-screen bg-gray-50 flex" data-testid="admin-dashboard">
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
              data-testid={`admin-nav-${item.view}`}
              onClick={() => { setActiveView(item.view); setSelectedCustomer(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                activeView === item.view ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge != null && (
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
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {selectedCustomer && (
              <button onClick={() => { setActiveView('customers'); setSelectedCustomer(null); }} className="p-1.5 rounded-lg hover:bg-gray-100" data-testid="admin-back-btn">
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
            )}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search customers, tickets, CVEs..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-96 focus:outline-none focus:ring-2 focus:ring-[#1B1F3B]/20" data-testid="admin-search-input" />
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
          {activeView === 'overview' && (
            <AdminOverview stats={stats} alerts={alerts} onOpenCustomer={openCustomerDetail} />
          )}

          {activeView === 'customers' && (
            <CustomerList
              customers={customers}
              total={customerTotal}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              filterTier={filterTier} setFilterTier={setFilterTier}
              filterStatus={filterStatus} setFilterStatus={setFilterStatus}
              sortBy={sortBy} setSortBy={setSortBy}
              sortOrder={sortOrder} setSortOrder={setSortOrder}
              currentPage={currentPage} setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              onOpenCustomer={openCustomerDetail}
            />
          )}

          {activeView === 'customer-detail' && selectedCustomer && (
            <CustomerDetail
              customer={selectedCustomer}
              detail={customerDetail}
              loading={detailLoading}
            />
          )}

          {activeView === 'tickets' && (
            <TicketsView tickets={tickets} />
          )}

          {activeView === 'alerts' && (
            <AlertsView alerts={alerts} onOpenCustomer={openCustomerDetail} />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
