import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Building, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminUserFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { addUser, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Name and email are required', 'error');
      return;
    }

    addUser({
      name,
      email,
      phone,
      companyName,
      role
    });

    navigate('/admin/users');
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Add New Client / Staff</h2>
            <p className="text-xs text-slate-500 font-medium">Register a commercial customer profile or administrative staff access.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-[#FF0038] hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs shadow-md shadow-rose-600/25 cursor-pointer transition-all active:scale-95"
          >
            Save Account
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          
          {/* Left Column: Identity & Access */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-[#FF0038]" />
              <span>Identity & Security Clearance</span>
            </h3>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name <span className="text-[#FF0038]">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kulkarni"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Email Address <span className="text-[#FF0038]">*</span></label>
              <input
                type="email"
                required
                placeholder="ramesh@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Access Role & Permission</label>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    role === 'customer'
                      ? 'border-[#FF0038] bg-rose-50/70 text-slate-950 ring-2 ring-rose-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4 mt-0.5 text-[#FF0038]" />
                  <div>
                    <div className="font-bold text-xs">Customer</div>
                    <div className="text-[10px] text-slate-500 leading-tight">Order track, invoice download, quotes</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    role === 'admin'
                      ? 'border-[#FF0038] bg-rose-50/70 text-slate-950 ring-2 ring-rose-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 mt-0.5 text-[#FF0038]" />
                  <div>
                    <div className="font-bold text-xs">Administrator</div>
                    <div className="text-[10px] text-slate-500 leading-tight">Full ledger, catalog, press control</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Commercial Enterprise */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Building className="w-4 h-4 text-[#FF0038]" />
              <span>Commercial Organization & Phone</span>
            </h3>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Phone Number (WhatsApp Direct)</label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Company / Business Enterprise Name</label>
              <input
                type="text"
                placeholder="e.g. Kulkarni Pharma Solutions Pvt Ltd"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 block">Automatic Client Sync</span>
              <p className="text-[11px] leading-relaxed">
                When created, this account is instantly linked to customer orders, quote inquiries, and billing ledgers.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
