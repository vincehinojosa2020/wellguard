import React from 'react';
import { Shield, Download, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

const severityColors = {
  CRITICAL: '#EF4444', HIGH: '#F97316', MEDIUM: '#EAB308', LOW: '#3B82F6',
};

function getSeverityColor(severity) {
  return severityColors[severity] || '#9CA3AF';
}

const VulnsTab = ({ vulns, hasLiveData, onRefresh, onNavigateToScan }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1F3B]">Vulnerabilities</h1>
          <p className="text-gray-500 text-sm mt-1">
            {hasLiveData ? `${vulns.length} vulnerabilities from live scans` : 'Showing sample data — run a scan to see real results'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-sm gap-2" onClick={onRefresh}><RefreshCw className="w-4 h-4" /> Refresh</Button>
          <Button variant="outline" className="text-sm gap-2"><Download className="w-4 h-4" /> Export CSV</Button>
        </div>
      </div>

      <div className="space-y-3">
        {vulns.map((vuln) => {
          const severity = vuln.severity || 'MEDIUM';
          const cvss = vuln.cvss || 0;
          const vulnKey = vuln.vuln_id || vuln.id;
          const color = getSeverityColor(severity);
          return (
            <Card key={vulnKey} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <Badge style={{ backgroundColor: `${color}15`, color, borderColor: `${color}30` }} className="text-xs font-bold">{severity}</Badge>
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
                    <p className="text-3xl font-bold" style={{ color }}>{typeof cvss === 'number' ? cvss.toFixed(1) : cvss}</p>
                    <p className="text-xs text-gray-500">CVSS</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {vulns.length === 0 && (
          <div className="text-center py-16">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No vulnerabilities found yet</p>
            <p className="text-gray-400 text-sm mt-1">Run a scan to discover vulnerabilities</p>
            <Button className="mt-4 bg-[#E8553A] hover:bg-[#d44a32] text-white" onClick={onNavigateToScan}>Run Your First Scan</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VulnsTab;
