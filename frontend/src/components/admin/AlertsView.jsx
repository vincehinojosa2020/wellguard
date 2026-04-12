import React from 'react';
import { AlertTriangle, Server, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { formatNumber } from '../../utils/formatters';

const AlertsView = ({ alerts, onOpenCustomer }) => (
  <div className="space-y-6" data-testid="alerts-view">
    <div>
      <h1 className="text-2xl font-bold text-[#1B1F3B]">Platform Alerts</h1>
      <p className="text-gray-500 text-sm mt-1">Accounts requiring immediate attention</p>
    </div>

    <Card className="border border-red-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-red-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> High-Risk Accounts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {alerts?.high_risk_customers?.map((c) => (
            <div key={c.id || c.name} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-100 hover:shadow-sm cursor-pointer"
              onClick={() => onOpenCustomer(c)}>
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

    <Card className="border border-orange-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-orange-800 flex items-center gap-2">
          <Server className="w-4 h-4" /> Critical Instance Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {alerts?.critical_customers?.map((c) => (
            <div key={c.id || c.name} className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-100 hover:shadow-sm cursor-pointer"
              onClick={() => onOpenCustomer(c)}>
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
);

export default AlertsView;
