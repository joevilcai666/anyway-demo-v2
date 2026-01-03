import React from 'react';
import { Download, CreditCard, PieChart, TrendingUp, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import { MOCK_INVOICES, MOCK_DAILY_USAGE, formatDate } from '../constants';

const FinancePage: React.FC = () => {
  // Calculate totals
  const currentUsage = MOCK_DAILY_USAGE.reduce((acc, curr) => acc + curr.cost, 0);
  const projected = currentUsage * 1.5; // Mock projection

  return (
    <div className="flex-1 bg-[#FAFAFA] min-h-screen p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">Finance</h1>
            <p className="text-neutral-500 max-w-2xl">
              Monitor your infrastructure costs, download invoices, and manage payment methods.
            </p>
          </div>
          <Button icon={<CreditCard size={18} />}>
            Manage Cards
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Card 1 */}
           <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
             <div className="flex items-center gap-2 text-neutral-500 mb-2">
               <PieChart size={18} />
               <span className="text-sm font-medium">Current Usage</span>
             </div>
             <div className="text-3xl font-bold text-neutral-900 mb-1">
               ${currentUsage.toFixed(2)}
             </div>
             <div className="text-xs text-neutral-500">
               Oct 1 - Oct 14
             </div>
           </div>

           {/* Card 2 */}
           <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
             <div className="flex items-center gap-2 text-neutral-500 mb-2">
               <TrendingUp size={18} />
               <span className="text-sm font-medium">Projected (Oct)</span>
             </div>
             <div className="text-3xl font-bold text-neutral-900 mb-1">
               ${projected.toFixed(2)}
             </div>
             <div className="text-xs text-neutral-500">
               Based on current run rate
             </div>
           </div>

           {/* Card 3 */}
           <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
             <div className="flex items-center gap-2 text-neutral-500 mb-2">
               <AlertCircle size={18} />
               <span className="text-sm font-medium">Unpaid Balance</span>
             </div>
             <div className="text-3xl font-bold text-neutral-900 mb-1">
               $0.00
             </div>
             <div className="text-xs text-green-600 font-medium">
               All paid up
             </div>
           </div>
        </div>

        {/* Usage Chart (Mock) */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6">Daily Cost (Last 14 Days)</h2>
          <div className="h-48 flex items-end justify-between gap-2">
            {MOCK_DAILY_USAGE.map((day, i) => {
               const heightPct = (day.cost / 20) * 100; // Assume max 20 for scaling
               return (
                 <div key={i} className="flex-1 flex flex-col justify-end group relative">
                    <div 
                      className="w-full bg-brand-yellow rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                      style={{ height: `${heightPct}%`, minHeight: '4px' }}
                    ></div>
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                      ${day.cost.toFixed(2)} <br/>
                      <span className="text-neutral-400">{formatDate(day.date)}</span>
                    </div>
                 </div>
               );
            })}
          </div>
          <div className="border-t border-neutral-200 mt-2"></div>
           <div className="flex justify-between mt-2 text-xs text-neutral-400">
             <span>{formatDate(MOCK_DAILY_USAGE[0].date)}</span>
             <span>{formatDate(MOCK_DAILY_USAGE[MOCK_DAILY_USAGE.length - 1].date)}</span>
           </div>
        </div>

        {/* Invoices Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Invoices</h2>
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {MOCK_INVOICES.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-neutral-600">{inv.id}</td>
                    <td className="px-6 py-4 text-sm text-neutral-900">{formatDate(inv.date)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-900">${inv.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100 capitalize">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-neutral-400 hover:text-neutral-900 transition-colors p-2">
                         <Download size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FinancePage;