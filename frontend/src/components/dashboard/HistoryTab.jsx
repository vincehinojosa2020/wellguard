import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { formatDate, getScanStatusClass } from '../../utils/formatters';

const HistoryTab = ({ scans, onNewScan }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B1F3B]">Scan History</h1>
          <p className="text-gray-500 text-sm mt-1">All scans performed on this platform</p>
        </div>
        <Button className="bg-[#E8553A] hover:bg-[#d44a32] text-white text-sm" onClick={onNewScan}>New Scan</Button>
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
                {scans.map((scan) => {
                  const scanKey = scan.id || scan.app || scan.target;
                  return (
                    <tr key={scanKey} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-5 font-medium text-[#1B1F3B]">{scan.target || scan.app}</td>
                      <td className="py-3 px-5 text-gray-500">{scan.scan_type || 'image'}</td>
                      <td className="py-3 px-5 text-gray-500">{formatDate(scan.created_at || scan.date)}</td>
                      <td className="py-3 px-5 text-gray-500">{scan.duration || '-'}</td>
                      <td className="py-3 px-5 font-medium">{scan.summary?.total_vulnerabilities ?? scan.vulns ?? '-'}</td>
                      <td className="py-3 px-5 text-gray-500">{scan.summary?.total_components ?? scan.components ?? '-'}</td>
                      <td className="py-3 px-5">
                        <Badge className={`text-xs ${getScanStatusClass(scan.status)}`}>{scan.status}</Badge>
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

export default HistoryTab;
