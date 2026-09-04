import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Phone, 
  Mail, 
  Building2, 
  MapPin, 
  Calendar, 
  Package, 
  FileText, 
  ExternalLink, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Download, 
  Printer, 
  Edit3, 
  Trash2, 
  Plus, 
  Save, 
  Check, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { User, Order, UserAddress } from '../types';

interface AdminUserDetailsModalProps {
  user: User | null;
  orders: Order[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser?: (updated: Partial<User>) => Promise<boolean> | void;
  onDeleteUser?: (userId: string) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminUserDetailsModal: React.FC<AdminUserDetailsModalProps> = ({
  user,
  orders,
  isOpen,
  onClose,
  onUpdateUser,
  onDeleteUser,
  showToast
}) => {
  if (!isOpen || !user) return null;

  // Filter all orders placed by this specific user
  const userOrders = orders.filter((o) => {
    const matchesId = user.id && o.userId === user.id;
    const matchesPhone = user.phone && o.customerPhone && (
      o.customerPhone.replace(/\D/g, '').slice(-10) === user.phone.replace(/\D/g, '').slice(-10)
    );
    const matchesEmail = user.email && o.customerEmail && (
      o.customerEmail.trim().toLowerCase() === user.email.trim().toLowerCase()
    );
    return matchesId || matchesPhone || matchesEmail;
  });

  // Calculate user metrics
  const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.total || o.totalAmount) || 0), 0);
  const totalOrdersCount = userOrders.length;
  const lastOrder = userOrders[0];

  // Tab State
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');

  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name || '');
  const [editEmail, setEditEmail] = useState(user.email || '');
  const [editPhone, setEditPhone] = useState(user.phone || '');
  const [editCompany, setEditCompany] = useState(user.companyName || '');
  const [editGst, setEditGst] = useState(user.gstNumber || user.gstin || '');
  const [editAddress, setEditAddress] = useState(user.shippingAddress || user.address || '');
  const [editCity, setEditCity] = useState(user.city || '');
  const [editPincode, setEditPincode] = useState(user.pincode || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      showToast('Client name cannot be empty', 'error');
      return;
    }
    setIsSaving(true);
    try {
      if (onUpdateUser) {
        await onUpdateUser({
          id: user.id,
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          companyName: editCompany.trim(),
          gstNumber: editGst.trim(),
          shippingAddress: editAddress.trim(),
          city: editCity.trim(),
          pincode: editPincode.trim()
        });
      }
      setIsEditing(false);
      showToast('Client profile updated successfully', 'success');
    } catch (e) {
      showToast('Failed to update client profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Printing in Progress':
      case 'In Production':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Dispatched':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Cancelled':
        return 'bg-rose-50 text-[#FF0038] border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const openWhatsApp = (phoneNum: string, text: string) => {
    const clean = phoneNum.replace(/\D/g, '').slice(-10);
    const url = `https://wa.me/91${clean}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Card */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-rose-600/30">
              {(user.name || 'U').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-black text-white tracking-tight">{user.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  user.role === 'admin' 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}>
                  {user.role || 'Customer'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                <span>{user.email || 'No email registered'}</span>
                <span>•</span>
                <span>{user.phone ? `+91 ${user.phone}` : 'No phone'}</span>
                {user.companyName && (
                  <>
                    <span>•</span>
                    <span className="text-slate-300 font-semibold">{user.companyName}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user.phone && (
              <button
                onClick={() => openWhatsApp(user.phone, `Hello ${user.name}, this is Proprint Press support regarding your account and orders.`)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="Message on WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Summary Metric Ribbons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-4 sm:px-6 bg-slate-50 border-b border-slate-200 text-xs shrink-0">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Orders</span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">{totalOrdersCount} Jobs</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Lifetime Spend</span>
            <span className="text-base font-black text-rose-600 mt-0.5 block">₹{totalSpent.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Saved Addresses</span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">{(user.addresses?.length || 0)} Locations</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Last Purchase</span>
            <span className="text-xs font-bold text-slate-700 mt-1 block truncate">
              {lastOrder?.createdAt || 'No orders yet'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-[#FF0038] text-[#FF0038]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Complete Profile & Business Details</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'border-[#FF0038] text-[#FF0038]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Delivery Addresses ({user.addresses?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#FF0038] text-[#FF0038]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Purchase History & Delivery Locations ({userOrders.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: Profile & Business Details */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">Personal & Commercial Credentials</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF0038] hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Details</h4>
                    
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Full Name</span>
                        <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Mobile Phone</span>
                        <span className="font-bold text-slate-900">{user.phone ? `+91 ${user.phone}` : 'Not provided'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Email Address</span>
                        <span className="font-bold text-slate-900">{user.email || 'Not provided'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">User ID</span>
                        <span className="font-mono text-slate-600 text-[11px]">{user.id || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business & Billing Info</h4>
                    
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Company / Firm Name</span>
                        <span className="font-bold text-slate-900">{user.companyName || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">GSTIN Number</span>
                        <span className="font-mono font-bold text-slate-900">{user.gstNumber || user.gstin || 'Unregistered (Consumer)'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Primary Shipping Address</span>
                        <span className="font-medium text-slate-700">{user.shippingAddress || user.address || 'Not provided'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">City & Pincode</span>
                        <span className="font-bold text-slate-900">{user.city || 'Chhatrapati Sambhajinagar'} - {user.pincode || '431001'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Mobile Number (10 Digits)</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Company / Enterprise Name</label>
                      <input
                        type="text"
                        value={editCompany}
                        onChange={(e) => setEditCompany(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">GSTIN Number</label>
                      <input
                        type="text"
                        value={editGst}
                        onChange={(e) => setEditGst(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Street Address</label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">City</label>
                        <input
                          type="text"
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">PIN Code</label>
                        <input
                          type="text"
                          value={editPincode}
                          onChange={(e) => setEditPincode(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Saved Delivery Addresses</h3>
                  <p className="text-xs text-slate-500">Commercial plants, offices, retail branches, and home addresses.</p>
                </div>
              </div>

              {(!user.addresses || user.addresses.length === 0) ? (
                <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-500">No structured delivery addresses saved in profile.</p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    Primary address from account: {user.shippingAddress || user.address || 'None provided'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((addr, idx) => (
                    <div 
                      key={addr.id || idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        addr.isDefault 
                          ? 'bg-rose-50/40 border-rose-200 ring-1 ring-rose-200' 
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-bold text-[10px]">
                          {addr.label || 'Delivery Location'}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-[#FF0038] font-bold text-[10px]">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-xs text-slate-700">
                        <div className="font-bold text-slate-900">{addr.name}</div>
                        {addr.companyName && <div className="text-slate-500 text-[11px]">{addr.companyName}</div>}
                        <div className="text-slate-600 leading-relaxed">{addr.addressLine}</div>
                        <div className="font-medium text-slate-900">{addr.city}, {addr.state || 'Maharashtra'} - {addr.pincode}</div>
                        <div className="text-slate-500 text-[11px] pt-1 flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>+91 {addr.phone}</span>
                        </div>
                        {addr.gstNumber && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            GST: {addr.gstNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Purchase History ("When, Where, In which address") */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Complete Purchase & Job History</h3>
                  <p className="text-xs text-slate-500">All print orders, exact order timestamps, delivery locations, and print specs.</p>
                </div>
              </div>

              {userOrders.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <Package className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">No purchase records found for this user.</p>
                  <p className="text-[11px] text-slate-400">When the client places an order, it will automatically link here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((ord) => (
                    <div 
                      key={ord.id || ord.orderNumber} 
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-shadow space-y-4"
                    >
                      {/* Order Top Ribbon */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm">#{ord.orderNumber}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(ord.status)}`}>
                              {ord.status}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {ord.paymentMethod || 'UPI Payment'} ({ord.paymentStatus || 'Paid'})
                            </span>
                          </div>
                          
                          {/* Exact Date & Time */}
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-medium">
                              <strong>When:</strong> {ord.createdAt || 'Recent'}
                            </span>
                            {ord.trackingNumber && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="font-mono text-[11px] text-slate-600">Tracking: {ord.trackingNumber}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Amount</span>
                          <span className="text-base font-black text-[#FF0038]">₹{(ord.total || ord.totalAmount || 0).toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Where & In Which Address */}
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>Where & Delivery Address:</span>
                        </div>
                        <p className="text-slate-800 font-medium pl-5 leading-relaxed">
                          {ord.customerName && <strong className="text-slate-900">{ord.customerName}</strong>}
                          {ord.customerPhone && <span className="text-slate-500"> ({ord.customerPhone})</span>}
                          <br />
                          {ord.shippingAddress || user.shippingAddress || 'Chhatrapati Sambhajinagar'}, {ord.city || user.city || 'Chhatrapati Sambhajinagar'} - {ord.pincode || user.pincode || '431001'}
                        </p>
                      </div>

                      {/* Items Breakdown */}
                      <div className="space-y-2">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Ordered Items & Finishes</span>
                        <div className="divide-y divide-slate-100">
                          {ord.items?.map((item, i) => (
                            <div key={item.cartItemId || i} className="py-2.5 flex items-start justify-between gap-4 text-xs">
                              <div className="flex items-start gap-3">
                                <img
                                  src={item.product?.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=120'}
                                  alt={item.product?.name || 'Product'}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-slate-900">{item.product?.name || item.productName || 'Print Product'}</div>
                                  <div className="text-slate-500 text-[11px] mt-0.5">
                                    Qty: <strong className="text-slate-800">{item.customization?.quantity || 500}</strong> • {item.customization?.paperFinish || 'Matte Lamination'} • {item.customization?.paperType || '350 GSM Art Card'}
                                  </div>
                                  {item.customization?.specialInstructions && (
                                    <div className="text-[10px] text-amber-700 mt-0.5">
                                      Note: {item.customization.specialInstructions}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="font-black text-slate-900 text-xs shrink-0">
                                ₹{(item.subtotal || item.customization?.calculatedPrice || 0).toLocaleString('en-IN')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Artwork Upload File */}
                      {ord.uploadedFileUrl && (
                        <div className="pt-2 flex items-center justify-between bg-rose-50/50 p-2.5 rounded-xl border border-rose-100 text-xs">
                          <div className="flex items-center gap-2 text-slate-700">
                            <FileText className="w-4 h-4 text-[#FF0038]" />
                            <span className="font-medium truncate max-w-xs">{ord.uploadedFileName || 'Production Artwork File'}</span>
                          </div>
                          <a
                            href={ord.uploadedFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#FF0038] hover:text-rose-700 font-bold text-xs"
                          >
                            <span>Download Artwork</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Registered: <span className="font-semibold text-slate-700">{user.createdAt || 'Active User'}</span>
          </div>

          <div className="flex items-center gap-2">
            {onDeleteUser && user.role !== 'admin' && (
              <button
                type="button"
                onClick={() => {
                  onDeleteUser(user.id || '');
                  onClose();
                }}
                className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                Delete User
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
