import React from 'react';
import { Ticket } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { formatDate } from '../../utils/formatters';

function getPriorityClass(priority) {
  if (priority === 'critical') return 'bg-red-50 text-red-700 border-red-200';
  if (priority === 'high') return 'bg-orange-50 text-orange-700 border-orange-200';
  if (priority === 'medium') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  return 'bg-gray-50 text-gray-700 border-gray-200';
}

const TicketsView = ({ tickets }) => (
  <div className="space-y-6" data-testid="tickets-view">
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
              {tickets.map((t) => (
                <tr key={t.id || t.ticket_number} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{t.ticket_number}</td>
                  <td className="py-3 px-4 font-medium text-[#1B1F3B]">{t.customer_name}</td>
                  <td className="py-3 px-4 text-gray-600">{t.issue_type}</td>
                  <td className="py-3 px-4">
                    <Badge className={`text-[10px] ${getPriorityClass(t.priority)}`}>{t.priority}</Badge>
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
);

export default TicketsView;
