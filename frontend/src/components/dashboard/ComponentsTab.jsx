import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

function getRiskColor(score) {
  if (score >= 9) return '#EF4444';
  if (score >= 7) return '#F97316';
  if (score >= 4) return '#EAB308';
  return '#22C55E';
}

const ComponentsTab = ({ components, hasLiveData }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1F3B]">Components</h1>
          <p className="text-gray-500 text-sm mt-1">
            {hasLiveData ? `${components.length} components from live scans` : 'Showing sample data — run a scan to see real results'}
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
                {components.map((comp) => {
                  const compKey = comp.id || `${comp.name}-${comp.version}`;
                  const vulnCount = comp.vulnerabilities || 0;
                  const riskScore = comp.risk_score || comp.riskScore || 0;
                  return (
                    <tr key={compKey} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-5 font-medium text-[#1B1F3B]">{comp.name}</td>
                      <td className="py-3 px-5 font-mono text-xs text-gray-600">{comp.version}</td>
                      <td className="py-3 px-5"><Badge variant="outline" className="text-xs">{comp.ecosystem}</Badge></td>
                      <td className="py-3 px-5">
                        {vulnCount > 0
                          ? <span className="text-red-600 font-bold">{vulnCount}</span>
                          : <span className="text-green-600">0</span>
                        }
                      </td>
                      <td className="py-3 px-5">
                        <span className="font-bold" style={{ color: getRiskColor(riskScore) }}>
                          {typeof riskScore === 'number' ? riskScore.toFixed(1) : riskScore}
                        </span>
                      </td>
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

export default ComponentsTab;
