import type { FilterState, Platform, PlanType } from '../types';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function Filters({ filters, onFilterChange }: FiltersProps) {
  const handleChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Period</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
          <span className="text-slate-400">-</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Platform</label>
          <div className="flex rounded-lg overflow-hidden border border-slate-300">
            {(['all', 'ios', 'android'] as Platform[]).map((platform) => (
              <button
                key={platform}
                onClick={() => handleChange('platform', platform)}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  filters.platform === platform
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {platform === 'all' ? 'All' : platform === 'ios' ? 'iOS' : 'Android'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Plan</label>
          <div className="flex rounded-lg overflow-hidden border border-slate-300">
            {(['all', 'monthly', 'yearly'] as PlanType[]).map((plan) => (
              <button
                key={plan}
                onClick={() => handleChange('planType', plan)}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  filters.planType === plan
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {plan === 'all' ? 'All' : plan === 'monthly' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
