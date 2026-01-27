import { useState, useMemo } from 'react';
import type { FilterState } from './types';
import { filterData, aggregateMetrics, getChartData, getDefaultFilters } from './data/generateData';
import { Filters } from './components/Filters';
import { KPICards } from './components/KPICards';
import { Charts } from './components/Charts';

function App() {
  const [filters, setFilters] = useState<FilterState>(getDefaultFilters());

  const filteredData = useMemo(() => filterData(filters), [filters]);
  const metrics = useMemo(() => aggregateMetrics(filteredData, filters), [filteredData, filters]);
  const chartData = useMemo(() => getChartData(filteredData), [filteredData]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Subscription Analytics</h1>
                <p className="text-sm text-slate-500">Mobile App Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Live Data
              </span>
              <span>Last updated: Just now</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Filters filters={filters} onFilterChange={setFilters} />
        <KPICards metrics={metrics} />
        <Charts data={chartData} />
      </main>

      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-slate-500 text-center">
            Subscription Analytics Dashboard - Demo Data
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
