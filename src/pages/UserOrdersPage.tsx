import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Printer, 
  FileText, 
  ExternalLink, 
  ArrowRight, 
  MessageSquare, 
  AlertCircle,
  FileArchive,
  Image as ImageIcon,
  Download,
  SlidersHorizontal,
  Calendar,
  ClipboardList,
  Layers,
  Box,
  Check,
  X,
  Bell,
  Sparkles,
  MapPin,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { WhatsAppModal } from '../components/WhatsAppModal';

export const UserOrdersPage: React.FC = () => {
  const { orders, currentUser, isMarathi, showToast } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  // Show ONLY 3 statuses as requested: 'All' | 'Completed' | 'Cancelled'
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Cancelled'>('All');
  const [selectedOrderForWhatsApp, setSelectedOrderForWhatsApp] = useState<Order | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Filter user-specific orders
  const userOrders = useMemo(() => {
    let list = orders;
    if (currentUser) {
      list = orders.filter(
        (o) =>
          o.userId === currentUser.id ||
          o.customerPhone === currentUser.phone ||
          o.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase()
      );
      // Fallback: if user just registered and placed orders without matching ID, include recent stored orders
      if (list.length === 0 && orders.length > 0) {
        list = orders;
      }
    }

    return list.filter((ord) => {
      const matchesSearch =
        ord.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.items?.some((it) => it.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesStatus = true;
      if (statusFilter === 'Completed') {
        matchesStatus = ord.status === 'Delivered' || ord.status === 'Completed';
      } else if (statusFilter === 'Cancelled') {
        matchesStatus = ord.status === 'Cancelled';
      }

      return matchesSearch && matchesStatus;
    });
  }, [orders, currentUser, searchQuery, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return { 
          label: isMarathi ? 'निश्चित झाली' : 'Confirmed', 
          style: 'bg-emerald-50 text-emerald-700 border-emerald-200' 
        };
      case 'Processing':
      case 'In Production':
        return { 
          label: isMarathi ? 'प्रिंटिंग सुरू' : 'In Production', 
          style: 'bg-blue-50 text-blue-700 border-blue-200' 
        };
      case 'Order Placed':
      case 'Pending':
        return { 
          label: isMarathi ? 'ऑर्डर नोंदवली' : 'Order Placed', 
          style: 'bg-amber-50 text-amber-700 border-amber-200' 
        };
      case 'Picked':
        return { 
          label: isMarathi ? 'पॅकिंग पूर्ण' : 'Packed', 
          style: 'bg-purple-50 text-purple-700 border-purple-200' 
        };
      case 'Shipped':
      case 'Dispatched':
        return { 
          label: isMarathi ? 'डिस्पॅच झाली' : 'Dispatched', 
          style: 'bg-indigo-50 text-indigo-700 border-indigo-200' 
        };
      case 'Delivered':
      case 'Completed':
        return { 
          label: isMarathi ? 'डिलिव्हरी पूर्ण' : 'Delivered', 
          style: 'bg-slate-100 text-slate-800 border-slate-300' 
        };
      case 'Cancelled':
        return { 
          label: isMarathi ? 'रद्द' : 'Cancelled', 
          style: 'bg-rose-50 text-rose-700 border-rose-200' 
        };
      default:
        return { 
          label: status, 
          style: 'bg-slate-100 text-slate-800 border-slate-200' 
        };
    }
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-6 font-marathi">
      
      {/* 1. TOP BREADCRUMB & NOTIFICATION HEADER (Matches screenshot) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-[#FF0038] transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#FF0038] font-bold">{isMarathi ? 'माझ्या ऑर्डर्स' : 'My Orders'}</span>
        </div>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF0038] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
              1
            </span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 font-bold text-slate-900">
                <span>{isMarathi ? 'सूचना' : 'Notifications'}</span>
                <span className="text-[10px] text-[#FF0038]">{isMarathi ? '१ नवीन' : '1 New'}</span>
              </div>
              <div className="p-2 bg-rose-50 rounded-xl text-slate-800 space-y-1">
                <p className="font-bold text-[#FF0038]">🎉 Order In Production</p>
                <p className="text-[11px] text-slate-600">Your latest print job has been approved and moved to offset printing.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. TITLE, SUBTITLE & PLACE NEW ORDER CTA (Matches screenshot) */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#0F172A]">
            {isMarathi ? 'माझ्या सर्व प्रिंटिंग ऑर्डर्स' : 'My Print Orders & History'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl font-normal leading-relaxed">
            {isMarathi 
              ? 'सक्रिय प्रिंटिंग कामे ट्रॅक करा, आर्टवर्क मंजुरी नोट्स पहा आणि टॅक्स इनव्हॉइस डाउनलोड करा.'
              : 'Track active print jobs, view artwork verification notes, and access tax invoices.'}
          </p>
        </div>

        <div>
          <Link
            to="/products"
            id="orders-place-new-order-btn"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#FF0038] hover:bg-[#e00032] active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-600/25 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>{isMarathi ? 'नवीन ऑर्डर नोंदवा' : 'Place New Order'}</span>
          </Link>
        </div>
      </div>

      {/* 3. SEARCH & 3 STATUS FILTER TABS CARD (Matches screenshot) */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Search Input with Filter Icon */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isMarathi ? 'ऑर्डर # किंवा उत्पादन शोधा...' : 'Search by Order # (e.g. PRO-88219) or Product...'}
            className="w-full pl-10 pr-10 py-3 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#FF0038] focus:ring-1 focus:ring-[#FF0038]/20 transition-all font-medium"
          />
          <button 
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
            title="Filter Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Status Filter Pills: All Orders | Completed | Cancelled */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-none pb-1">
          
          {/* 1. All Orders */}
          <button
            type="button"
            onClick={() => setStatusFilter('All')}
            className={`px-4 sm:px-5 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap text-xs font-extrabold shadow-2xs ${
              statusFilter === 'All'
                ? 'bg-[#FF0038] text-white shadow-rose-600/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isMarathi ? 'सर्व ऑर्डर्स' : 'All Orders'}
          </button>

          {/* 2. Completed */}
          <button
            type="button"
            onClick={() => setStatusFilter('Completed')}
            className={`px-4 sm:px-5 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap text-xs font-extrabold shadow-2xs ${
              statusFilter === 'Completed'
                ? 'bg-[#FF0038] text-white shadow-rose-600/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isMarathi ? 'पूर्ण झालेल्या' : 'Completed'}
          </button>

          {/* 3. Cancelled */}
          <button
            type="button"
            onClick={() => setStatusFilter('Cancelled')}
            className={`px-4 sm:px-5 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap text-xs font-extrabold shadow-2xs ${
              statusFilter === 'Cancelled'
                ? 'bg-[#FF0038] text-white shadow-rose-600/30'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isMarathi ? 'रद्द झालेल्या' : 'Cancelled'}
          </button>

        </div>
      </div>

      {/* 4. ORDERS LIST (Matches screenshot cards) */}
      {userOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-100 text-[#FF0038] flex items-center justify-center mx-auto shadow-inner">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-base font-extrabold text-slate-900">
              {isMarathi ? 'कोणतीही ऑर्डर आढळली नाही' : 'No Orders Found'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isMarathi
                ? 'निवडलेल्या फिल्टरनुसार ऑर्डर्स उपलब्ध नाहीत.'
                : 'No orders match your current filter or search query.'}
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF0038] hover:bg-[#e00032] text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
          >
            <span>{isMarathi ? 'सर्व उत्पादने एक्सप्लोर करा' : 'Explore Products'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((ord) => {
            const badge = getStatusBadge(ord.status);
            const firstItem = ord.items?.[0];
            const prodImage = firstItem?.product?.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';
            const prodName = firstItem?.product?.name || (isMarathi ? 'कस्टम ऑफसेट प्रिंटिंग जॉब' : 'Custom Offset Print Job');
            const qty = firstItem?.customization?.quantity || 500;
            const finishName = firstItem?.customization?.finishId || firstItem?.customization?.lamination || 'Velvet Matte';
            const totalVal = ord.total || ord.totalAmount || 800;
            const orderDateStr = ord.createdAt || '28 May 2024';

            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 space-y-3 p-4 sm:p-5"
              >
                {/* A. Top Header: ORDER ID on left | Status Badge on right */}
                <div className="flex items-center justify-between pb-1">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      ORDER ID
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      #{ord.orderNumber}
                    </h3>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${badge.style}`}>
                    {badge.label}
                  </span>
                </div>

                {/* B. Middle Row: Thumbnail Image + Details + Price Block (Exact match) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <img 
                      src={prodImage} 
                      alt={prodName}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-100 shrink-0 bg-slate-50 shadow-2xs"
                    />

                    <div className="space-y-1.5 min-w-0">
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1">
                        {prodName}
                      </h4>

                      {/* Specs Row with Red Icons */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Box className="w-3.5 h-3.5 text-[#FF0038]" />
                          <span>Qty: <strong className="text-slate-900 font-bold">{qty} cards</strong></span>
                        </div>
                        <span className="text-slate-300">|</span>
                        <div className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-[#FF0038]" />
                          <span>Finish: <strong className="text-slate-900 font-bold">{finishName}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Total Amount */}
                  <div className="text-left sm:text-right shrink-0 pl-1 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="text-base sm:text-xl font-black text-slate-900">
                      ₹{totalVal}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400 font-medium">
                      Total Amount
                    </div>
                  </div>

                </div>

                {/* C. Divider */}
                <div className="border-t border-slate-100 pt-3"></div>

                {/* D. Card Footer: Order Date | Estimated Delivery | View Details Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  
                  {/* Dates & Timeline */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#FF0038] shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Order Date</span>
                        <span className="font-bold text-slate-800 text-[11px] sm:text-xs">{orderDateStr}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-l border-slate-100 pl-4 sm:pl-6">
                      <ClipboardList className="w-4 h-4 text-[#FF0038] shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Estimated Delivery</span>
                        <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
                          {ord.estimatedDelivery || '24-48 Hours Express'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View Details Pill Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedOrderDetails(ord)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 hover:border-rose-400 bg-white hover:bg-rose-50 text-[#FF0038] font-bold text-xs shadow-2xs transition-all cursor-pointer active:scale-95 ml-auto"
                  >
                    <span>{isMarathi ? 'तपशील पहा' : 'View Details'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 5. ORDER DETAILS MODAL (Opens on View Details) */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col font-marathi animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Order Summary</span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  #{selectedOrderDetails.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto">
              
              {/* Order Status Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Status</span>
                  <span className="text-xs font-black text-slate-900">{selectedOrderDetails.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                  <span className="text-sm font-black text-[#FF0038]">
                    ₹{selectedOrderDetails.total || selectedOrderDetails.totalAmount}
                  </span>
                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Order Items</h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-3 bg-white">
                  {(selectedOrderDetails.items || []).map((item, i) => (
                    <div key={i} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item.product?.name || 'Custom Print Job'}</p>
                        <p className="text-[11px] text-slate-500">
                          Qty: {item.customization?.quantity || 500} • {item.customization?.finishId || 'Velvet Matte'}
                        </p>
                      </div>
                      <span className="font-black text-slate-900 shrink-0">
                        ₹{item.customization?.calculatedPrice || item.subtotal || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <MapPin className="w-4 h-4 text-[#FF0038]" />
                  <span>Delivery Destination</span>
                </div>
                <p className="text-slate-700 pl-6">
                  {selectedOrderDetails.shippingAddress || selectedOrderDetails.customerAddress || 'Client Address'}, {selectedOrderDetails.city || 'Chh. Sambhajinagar'}
                </p>
                <p className="text-slate-500 pl-6 text-[11px]">
                  Recipient Phone: <strong className="text-slate-800">{selectedOrderDetails.customerPhone}</strong>
                </p>
              </div>

              {/* Attached Artwork / File */}
              {selectedOrderDetails.uploadedFileName && (
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-900 truncate">
                      {selectedOrderDetails.uploadedFileName}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 shrink-0">✓ Pre-Press Verified</span>
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedOrderForWhatsApp(selectedOrderDetails);
                  setSelectedOrderDetails(null);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>{isMarathi ? 'व्हॉट्सॲप सपोर्ट' : 'WhatsApp Support'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  showToast(`Preparing Tax Invoice for #${selectedOrderDetails.orderNumber}...`, 'info');
                  window.print();
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isMarathi ? 'इनव्हॉइस डाउनलोड' : 'Tax Invoice'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* WhatsApp In-App Modal */}
      {selectedOrderForWhatsApp && (
        <WhatsAppModal
          isOpen={!!selectedOrderForWhatsApp}
          onClose={() => setSelectedOrderForWhatsApp(null)}
          defaultMessage={`Hello Proprint! I need an update regarding my Order #${selectedOrderForWhatsApp.orderNumber} placed for ${selectedOrderForWhatsApp.customerName || 'Customer'}.`}
        />
      )}

    </div>
  );
};

