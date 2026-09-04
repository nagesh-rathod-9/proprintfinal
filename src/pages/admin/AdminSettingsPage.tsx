import React, { useState } from 'react';
import { Settings, Save, Printer, MapPin, Phone, Mail, Percent, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useApp();

  const [shopName, setShopName] = useState('Proprint Commercial Offset & Digital Press');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('press@proprint.com');
  const [address, setAddress] = useState('Plot 42, Chikalthana Industrial Area, MIDC, Chh. Sambhajinagar, MH 431001');
  const [gstNumber, setGstNumber] = useState('27AAACP1234F1Z8');
  const [promoCode, setPromoCode] = useState('PROPRINT10');
  const [promoDiscount, setPromoDiscount] = useState('10');
  const [autoDispatchWhatsapp, setAutoDispatchWhatsapp] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Press configuration and store settings saved successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Print Press Shop & System Settings</h2>
        <p className="text-xs text-slate-500">Configure business information, GST invoicing details, and auto-dispatch channels.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs">
        
        {/* Press Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm border-b border-slate-100 pb-2">
            Business & Facility Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Commercial Press Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">GSTIN / Tax ID</label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Support Hotline / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Billing Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700">Factory / Offset Plant Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF0038] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Coupons & Promotions */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm border-b border-slate-100 pb-2">
            Discount Coupons & Marketing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Active Promo Code</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Discount Percentage (%)</label>
              <input
                type="number"
                value={promoDiscount}
                onChange={(e) => setPromoDiscount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#FF0038] hover:bg-rose-500 active:scale-98 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-rose-600/30 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Press Configuration</span>
          </button>
        </div>

      </form>
    </div>
  );
};
