import React, { useState } from 'react';
import { CreditCard, Search, Download, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminPaymentsPage: React.FC = () => {
  const { payments, showToast } = useApp();
  const [search, setSearch] = useState('');

  const filtered = payments.filter(
    (p) =>
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Payments & Settlement Ledger</h2>
          <p className="text-xs text-slate-500">Razorpay / Cashfree UPI transactions and commercial GST invoices.</p>
        </div>

        <button
          onClick={() => showToast('Exporting GST Compliant B2B Invoices...', 'info')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export GST Report</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by Payment ID, Order #, Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px] bg-slate-50/50">
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{pay.id}</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-600 font-bold">{pay.orderId}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{pay.customerName}</td>
                  <td className="py-3.5 px-4 text-slate-600">{pay.method}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">₹{pay.amount}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        pay.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : pay.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {pay.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{pay.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
