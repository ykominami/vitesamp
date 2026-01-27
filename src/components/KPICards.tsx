import type { AggregatedMetrics } from '../types';

interface KPICardsProps {
  metrics: AggregatedMetrics;
}

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  invertChange?: boolean;
}

function KPICard({ title, value, change, icon, color, invertChange }: KPICardProps) {
  const isPositive = invertChange ? change < 0 : change > 0;
  const changeColor = isPositive ? 'text-emerald-600' : 'text-rose-600';
  const changeBg = isPositive ? 'bg-emerald-50' : 'bg-rose-50';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${changeBg} ${changeColor}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </span>
        <span className="text-xs text-slate-500">vs previous period</span>
      </div>
    </div>
  );
}

export function KPICards({ metrics }: KPICardsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000000) return '$' + (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return '$' + (num / 1000).toFixed(1) + 'K';
    return '$' + num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <KPICard
        title="Active Subscriptions"
        value={formatNumber(metrics.totalActiveSubscriptions)}
        change={metrics.activeChange}
        color="bg-indigo-100"
        icon={
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />
      <KPICard
        title="New Subscriptions"
        value={formatNumber(metrics.totalNewSubscriptions)}
        change={metrics.newChange}
        color="bg-emerald-100"
        icon={
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        }
      />
      <KPICard
        title="Churned"
        value={formatNumber(metrics.totalChurned)}
        change={metrics.churnedChange}
        invertChange={true}
        color="bg-rose-100"
        icon={
          <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
          </svg>
        }
      />
      <KPICard
        title="MRR"
        value={formatCurrency(metrics.totalMRR)}
        change={metrics.mrrChange}
        color="bg-amber-100"
        icon={
          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <KPICard
        title="Trial Conversion"
        value={metrics.trialConversionRate.toFixed(1) + '%'}
        change={metrics.conversionChange}
        color="bg-violet-100"
        icon={
          <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  );
}
