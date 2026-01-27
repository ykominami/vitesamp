import { useState } from 'react';
import type { DailyMetrics } from '../types';

interface RawDataModalProps {
  data: DailyMetrics[];
  onClose: () => void;
}

export function RawDataModal({ data, onClose }: RawDataModalProps) {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 50;

  const filteredData = data.filter(item =>
    item.date.includes(searchTerm) ||
    item.platform.includes(searchTerm.toLowerCase()) ||
    item.planType.includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(page * pageSize, (page + 1) * pageSize);

  const handleExportCSV = () => {
    const headers = ['date', 'platform', 'planType', 'activeSubscriptions', 'newSubscriptions', 'churned', 'mrr', 'trialStarts', 'trialConversions'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row =>
        headers.map(h => row[h as keyof DailyMetrics]).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscription_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscription_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Raw Data Viewer</h2>
            <p className="text-sm text-slate-500">{filteredData.length.toLocaleString()} records</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Platform</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Plan</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600">Active</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600">New</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600">Churned</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600">MRR</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600">Trial Starts</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600">Conversions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.map((row, index) => (
                <tr key={`${row.date}-${row.platform}-${row.planType}-${index}`} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900">{row.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      row.platform === 'ios' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {row.platform === 'ios' ? 'iOS' : 'Android'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      row.planType === 'monthly' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {row.planType === 'monthly' ? 'Monthly' : 'Yearly'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-900">{row.activeSubscriptions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-emerald-600">{row.newSubscriptions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-rose-600">{row.churned.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-900">${row.mrr.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{row.trialStarts.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{row.trialConversions.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, filteredData.length)} of {filteredData.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
