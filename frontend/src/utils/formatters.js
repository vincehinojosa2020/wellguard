/**
 * Shared formatting utilities across the application.
 */

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function formatMoney(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export function formatNumber(n) {
  if (n == null) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString?.() || String(n);
}

export function getScanStatusClass(status) {
  if (status === 'completed') return 'bg-green-50 text-green-700 border-green-200';
  if (status === 'scanning' || status === 'queued') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'error') return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-green-50 text-green-700 border-green-200';
}

export function getSeverityColor(severity) {
  const map = { CRITICAL: '#EF4444', HIGH: '#F97316', MEDIUM: '#EAB308', LOW: '#3B82F6' };
  return map[severity] || map[severity?.toUpperCase()] || '#9CA3AF';
}

export function getRiskColor(score) {
  if (score >= 9) return '#EF4444';
  if (score >= 7) return '#F97316';
  if (score >= 4) return '#EAB308';
  return '#22C55E';
}
