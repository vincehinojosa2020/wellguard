import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import '../wellguard.css';
import { applications, summaryStats, vulnerabilities, dependencies, licenses, sbomHistory } from '../data/wellguardData';
import DashboardTab from '../components/wellguard/DashboardTab';
import ScanResultsTab from '../components/wellguard/ScanResultsTab';
import DependenciesTab from '../components/wellguard/DependenciesTab';
import LicensesTab from '../components/wellguard/LicensesTab';
import SBOMTab from '../components/wellguard/SBOMTab';
import SettingsTab from '../components/wellguard/SettingsTab';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'scan-results', label: 'Scan Results' },
  { id: 'dependencies', label: 'Dependencies' },
  { id: 'licenses', label: 'Licenses' },
  { id: 'sbom', label: 'SBOM' },
  { id: 'settings', label: 'Settings' },
];

export default function WellGuardApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedScan, setSelectedScan] = useState(null);

  // Real scan state
  const [scanInput, setScanInput] = useState('');
  const [scanType, setScanType] = useState('repo');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [realScans, setRealScans] = useState([]);
  const [realVulns, setRealVulns] = useState([]);
  const pollRef = useRef(null);

  // Fetch real scans on mount
  useEffect(() => {
    axios.get(`${API}/scans?limit=20`).then(r => setRealScans(r.data.scans || [])).catch(() => {});
    axios.get(`${API}/vulnerabilities?limit=200`).then(r => setRealVulns(r.data.vulnerabilities || [])).catch(() => {});
  }, []);

  // Poll for scan completion
  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(async () => {
      const scanId = pollRef.current;
      if (!scanId) return; // scan ID not yet available, wait for next tick
      try {
        const res = await axios.get(`${API}/scans/${scanId}`);
        if (res.data.status === 'completed') {
          setScanResult(res.data);
          setScanning(false);
          pollRef.current = null;
          axios.get(`${API}/scans?limit=20`).then(r => setRealScans(r.data.scans || [])).catch(() => {});
          axios.get(`${API}/vulnerabilities?limit=200`).then(r => setRealVulns(r.data.vulnerabilities || [])).catch(() => {});
        } else if (res.data.status === 'error' || res.data.status === 'timeout') {
          setScanError(res.data.error || 'Scan failed');
          setScanning(false);
          pollRef.current = null;
        }
      } catch (_) {}
    }, 2000);
    return () => clearInterval(interval);
  }, [scanning]);

  const handleScan = useCallback(async () => {
    if (!scanInput.trim()) return;
    setScanning(true);
    setScanResult(null);
    setScanError(null);
    try {
      const res = await axios.post(`${API}/scans`, { target: scanInput.trim(), scan_type: scanType });
      pollRef.current = res.data.id;
    } catch (e) {
      setScanError(e.response?.data?.detail || 'Failed to start scan');
      setScanning(false);
    }
  }, [scanInput, scanType]);

  const openScanDetail = async (scan) => {
    // If it's a real backend scan, fetch full detail with vulnerabilities
    if (scan.scan_type || scan.id?.includes('-')) {
      try {
        const res = await axios.get(`${API}/scans/${scan.id}`);
        setSelectedScan(res.data);
      } catch (_) {
        setSelectedScan(scan);
      }
    } else {
      setSelectedScan(scan);
    }
    setActiveTab('scan-results');
  };

  return (
    <div className="wg-app" data-testid="wellguard-app">
      {/* Header */}
      <header className="wg-header" data-testid="wg-header">
        <div className="wg-header-left">
          <span style={{ fontSize: 20, marginRight: 4 }}>&#128737;</span>
          <div>
            <div className="wg-header-logo">WELLGUARD SCA</div>
            <div className="wg-header-subtitle">Internal Software Composition Analysis — Upstream Technology Division</div>
          </div>
        </div>
        <div className="wg-header-right">
          <span style={{ color: '#66aadd' }}>Last scan: 14 Mar 2026, 13:00 UTC</span>
          <div className="wg-notif" data-testid="wg-notifications">
            <span style={{ fontSize: 16 }}>&#128276;</span>
            <span className="wg-notif-badge">3</span>
          </div>
          <span style={{ color: '#ccddee' }}>jmorales@energycorp.com</span>
        </div>
      </header>

      {/* Warning Banner */}
      <div className="wg-banner" data-testid="wg-banner">
        <span>&#9888;&#65039;</span>
        <span>
          <strong>NOTICE:</strong> Trivy engine v0.18.3 — upstream scanner compromised (CVE-2026-3452). Patching scheduled for Sprint 47. Contact AppSec team with questions.
        </span>
        <a href="#details" onClick={e => { e.preventDefault(); setActiveTab('settings'); }}>[Details]</a>
      </div>

      {/* Tab Navigation */}
      <nav className="wg-tabs" data-testid="wg-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`wg-tab${activeTab === t.id ? ' active' : ''}`}
            onClick={() => { setActiveTab(t.id); if (t.id !== 'scan-results') setSelectedScan(null); }}
            data-testid={`wg-tab-${t.id}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="wg-content">
        {activeTab === 'dashboard' && (
          <DashboardTab
            apps={applications}
            stats={summaryStats}
            onSelectScan={openScanDetail}
            realScans={realScans}
          />
        )}
        {activeTab === 'scan-results' && (
          <ScanResultsTab
            apps={applications}
            vulns={vulnerabilities}
            selectedScan={selectedScan}
            setSelectedScan={setSelectedScan}
            realVulns={realVulns}
            scanInput={scanInput}
            setScanInput={setScanInput}
            scanType={scanType}
            setScanType={setScanType}
            scanning={scanning}
            scanResult={scanResult}
            scanError={scanError}
            onScan={handleScan}
          />
        )}
        {activeTab === 'dependencies' && (
          <DependenciesTab deps={dependencies} />
        )}
        {activeTab === 'licenses' && (
          <LicensesTab licenses={licenses} />
        )}
        {activeTab === 'sbom' && (
          <SBOMTab history={sbomHistory} apps={applications} />
        )}
        {activeTab === 'settings' && (
          <SettingsTab />
        )}
      </main>

      {/* Footer */}
      <footer className="wg-footer" data-testid="wg-footer">
        WellGuard SCA v2.4.1 | Build 2024.03.15 | Trivy Engine 0.18.3 (internal fork) | Report issues to <a href="mailto:appsec@energycorp.internal">appsec@energycorp.internal</a> | &copy; 2019-2026 Upstream Technology Division
      </footer>
    </div>
  );
}
