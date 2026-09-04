import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  MessageSquare, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  MapPin, 
  Package, 
  Layers, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Sparkles,
  Search,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminCreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, addManualOrder, showToast } = useApp();

  // Mode: Existing or New Customer
  const [customerMode, setCustomerMode] = useState<'new' | 'existing'>('new');
  const [existingSearch, setExistingSearch] = useState('');
  const [existingUsersList, setExistingUsersList] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Chhatrapati Sambhajinagar');
  const [pincode, setPincode] = useState('431001');

  // Job / Product Details
  const [source, setSource] = useState<'WhatsApp' | 'Walk-in' | 'Phone' | 'Manual'>('WhatsApp');
  const [productType, setProductType] = useState<'catalog' | 'custom'>('catalog');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [customProductName, setCustomProductName] = useState('Luxury Velvet Visiting Cards (WhatsApp Deal)');
  const [customCategory, setCustomCategory] = useState('business-cards');

  // Specs
  const [quantity, setQuantity] = useState<number>(500);
  const [paperStock, setPaperStock] = useState('350 GSM Velvet Matte');
  const [customPaperStock, setCustomPaperStock] = useState('');
  const [size, setSize] = useState('Standard (89mm x 51mm)');
  const [customSize, setCustomSize] = useState('');
  const [sides, setSides] = useState<'Front Only (Single Side)' | 'Front & Back (Both Sides)'>('Front & Back (Both Sides)');
  const [finishing, setFinishing] = useState('Velvet Matte Lamination');
  const [customFinishing, setCustomFinishing] = useState('');

  // Artwork file & Status
  const [artworkStatus, setArtworkStatus] = useState<'uploaded' | 'whatsapp_received' | 'pending_customer'>('whatsapp_received');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Commercials & Payment
  const [totalAmount, setTotalAmount] = useState<number>(650);
  const [advancePaid, setAdvancePaid] = useState<number>(650);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Partial' | 'Pending' | 'COD'>('Paid');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Bank Transfer' | 'Cheque' | 'Card'>('UPI');
  const [orderStatus, setOrderStatus] = useState<'Confirmed' | 'Order Placed' | 'Processing' | 'Shipped'>('Confirmed');
  const [estimatedDelivery, setEstimatedDelivery] = useState('Tomorrow Evening (Express Press)');
  const [discussionNotes, setDiscussionNotes] = useState('Order confirmed after WhatsApp discussion. Customer approved digital proof. Pack with moisture barrier.');
  const [openWhatsAppOnSubmit, setOpenWhatsAppOnSubmit] = useState(true);

  // Load existing users if toggled
  const fetchUsers = async () => {
    if (existingUsersList.length > 0) return;
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setExistingUsersList(data.users);
      }
    } catch (_e) {
      // Fallback
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSelectExistingUser = (u: any) => {
    setCustomerName(u.name || '');
    setCustomerPhone(u.phone || '');
    setCustomerEmail(u.email || '');
    setCompanyName(u.companyName || '');
    setGstNumber(u.gstNumber || '');
    setShippingAddress(u.shippingAddress || (u.addresses?.[0]?.street) || '');
    setCity(u.city || (u.addresses?.[0]?.city) || 'Chhatrapati Sambhajinagar');
    setPincode(u.pincode || (u.addresses?.[0]?.pincode) || '431001');
    setCustomerMode('new'); // switch back to populated view
    showToast(`Loaded details for ${u.name}`, 'info');
  };

  // When catalog product changes
  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    const p = products.find(x => x.id === prodId);
    if (p) {
      if (p.finishes?.[0]?.name) setPaperStock(p.finishes[0].name);
      if (p.sizes?.[0]?.name) setSize(p.sizes[0].name);
      // approximate suggested total
      const estPrice = (p.basePrice || 299) * (quantity >= 500 ? (quantity / 500) * 1.8 : 1);
      setTotalAmount(Math.round(estPrice));
      if (paymentStatus === 'Paid') setAdvancePaid(Math.round(estPrice));
    }
  };

  // File upload handler
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setUploadedFileUrl(data.url);
        setUploadedFileName(file.name);
        setArtworkStatus('uploaded');
        showToast('Artwork file attached successfully!', 'success');
      } else {
        setUploadedFileName(file.name);
        setArtworkStatus('uploaded');
      }
    } catch (err) {
      setUploadedFileName(file.name);
      setArtworkStatus('uploaded');
      showToast('File selected locally', 'info');
    } finally {
      setIsUploading(false);
    }
  };

  // Auto balance calculation
  const balancePending = Math.max(0, totalAmount - (advancePaid || 0));

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      showToast('Please enter customer name', 'error');
      return;
    }

    if (!customerPhone.trim()) {
      showToast('Please enter customer WhatsApp / contact number', 'error');
      return;
    }

    if (!shippingAddress.trim()) {
      showToast('Please enter delivery address', 'error');
      return;
    }

    if (totalAmount <= 0) {
      showToast('Total order amount must be greater than 0', 'error');
      return;
    }

    // Determine product
    let activeProduct = products.find(p => p.id === selectedProductId);
    const prodName = productType === 'catalog' && activeProduct ? activeProduct.name : customProductName;

    const finalPaperStock = paperStock === 'Custom' ? customPaperStock : paperStock;
    const finalSize = size === 'Custom' ? customSize : size;
    const finalFinishing = finishing === 'Custom' ? customFinishing : finishing;

    const created = addManualOrder({
      source: `${source} Order`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      companyName: companyName.trim(),
      shippingAddress: shippingAddress.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      product: activeProduct,
      productName: prodName,
      category: customCategory,
      quantity,
      paperStock: finalPaperStock,
      size: finalSize,
      sides,
      finishing: finalFinishing,
      artworkStatus: artworkStatus === 'whatsapp_received' 
        ? 'Artwork finalized on WhatsApp' 
        : artworkStatus === 'pending_customer' 
          ? 'Customer will provide artwork' 
          : 'Artwork uploaded by Admin',
      uploadedFileUrl,
      uploadedFileName,
      totalAmount,
      total: totalAmount,
      advancePaid,
      subtotal: totalAmount,
      tax: 0,
      shippingFee: 0,
      paymentMethod,
      paymentStatus,
      status: orderStatus,
      estimatedDelivery,
      notes: `${discussionNotes} | Balance Due: ₹${balancePending} | Sides: ${sides} | Finish: ${finalFinishing}`,
      discussionNotes
    });

    // If user requested WhatsApp message confirmation
    if (openWhatsAppOnSubmit && customerPhone) {
      const cleanPhone = customerPhone.replace(/\D/g, '');
      const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      const msg = encodeURIComponent(
        `Namaskar ${customerName}! 🙏\n\nYour print order *#${created.orderNumber}* has been confirmed at *Proprint Press*:\n\n` +
        `📦 *Item:* ${prodName}\n` +
        `🔢 *Quantity:* ${quantity} Units\n` +
        `📄 *Stock:* ${finalPaperStock}\n` +
        `📐 *Size:* ${finalSize}\n` +
        `💰 *Total Amount:* ₹${totalAmount}\n` +
        `💵 *Amount Received:* ₹${advancePaid} (${paymentStatus})\n` +
        (balancePending > 0 ? `⚠️ *Balance Due on Delivery:* ₹${balancePending}\n` : `✅ *Fully Paid*\n`) +
        `🚚 *Expected Dispatch:* ${estimatedDelivery}\n` +
        `📍 *Delivery Address:* ${shippingAddress}, ${city} - ${pincode}\n\n` +
        `We are starting pre-press setup now. Thank you for choosing Proprint!`
      );
      window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
    }

    navigate('/admin/orders');
  };

  const filteredExistingUsers = existingUsersList.filter(u => {
    const q = existingSearch.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.companyName && u.companyName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Back to Orders Docket"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-emerald-600" />
                WhatsApp & Walk-in Desk
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-bold text-slate-500">Order Booking Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Create Manual / WhatsApp Order
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1faa50] text-white font-black text-xs shadow-md shadow-emerald-500/20 cursor-pointer transition-all transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save & Place Order</span>
          </button>
        </div>
      </div>

      {/* Main Full-Screen Form */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================= */}
          {/* COLUMN 1: Customer Details & Delivery (4 Cols on desktop) */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5 text-xs">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Customer & Delivery</h3>
                    <p className="text-[10px] text-slate-400">Client contact & shipping address</p>
                  </div>
                </div>

                {/* Customer Mode Switch */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setCustomerMode('new')}
                    className={`px-2 py-1 rounded-lg font-bold text-[10px] cursor-pointer transition-all ${
                      customerMode === 'new' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    New
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerMode('existing');
                      fetchUsers();
                    }}
                    className={`px-2 py-1 rounded-lg font-bold text-[10px] cursor-pointer transition-all ${
                      customerMode === 'existing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Existing
                  </button>
                </div>
              </div>

              {/* If Existing User Selection */}
              {customerMode === 'existing' && (
                <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search registered client by name, phone..."
                      value={existingSearch}
                      onChange={(e) => setExistingSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {isLoadingUsers ? (
                    <div className="text-center py-4 text-slate-400 text-xs">Loading database users...</div>
                  ) : filteredExistingUsers.length === 0 ? (
                    <div className="text-center py-3 text-slate-400 text-xs">No client found. Switch to "New" mode to enter details.</div>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                      {filteredExistingUsers.slice(0, 8).map((u, i) => (
                        <div
                          key={u.id || i}
                          onClick={() => handleSelectExistingUser(u)}
                          className="p-2.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 cursor-pointer transition-all text-left"
                        >
                          <div className="font-black text-slate-900 text-xs flex items-center justify-between">
                            <span>{u.name}</span>
                            <span className="text-[10px] text-blue-600 font-bold">Select</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>📞 {u.phone || 'No phone'}</span>
                            {u.companyName && <span>🏢 {u.companyName}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Customer Inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Full Customer Name <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-slate-400 font-normal">e.g. Ramesh Patil</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter customer or contact person name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">WhatsApp / Phone <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. 9876543210"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        placeholder="client@gmail.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Company / Shop Name</label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Apex Enterprises"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">GST Number</label>
                    <input
                      type="text"
                      placeholder="27AXXXX1234X1Z0"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Street Delivery Address <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-slate-400 font-normal">Shop / Office / Residence</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <textarea
                      required
                      rows={2}
                      placeholder="Shop No, Building Name, Road, Landmark..."
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">City / District</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">PIN Code</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

              </div>

              {/* Order Channel Source */}
              <div className="pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-700 block mb-2">Order Origination Channel</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'WhatsApp', label: 'WhatsApp', color: 'bg-emerald-50 border-emerald-300 text-emerald-800' },
                    { id: 'Walk-in', label: 'Walk-in Desk', color: 'bg-blue-50 border-blue-300 text-blue-800' },
                    { id: 'Phone', label: 'Phone Call', color: 'bg-amber-50 border-amber-300 text-amber-800' },
                    { id: 'Manual', label: 'Direct Entry', color: 'bg-slate-100 border-slate-300 text-slate-800' }
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setSource(ch.id as any)}
                      className={`py-2 px-2 rounded-xl border text-center font-bold text-[11px] cursor-pointer transition-all ${
                        source === ch.id ? `${ch.color} ring-2 ring-emerald-500/20 shadow-xs` : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 2: Product & Print Specifications (4 Cols on desktop) */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5 text-xs">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Product & Press Specs</h3>
                    <p className="text-[10px] text-slate-400">Paper, finishing, dimensions & quantity</p>
                  </div>
                </div>

                {/* Catalog vs Custom Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setProductType('catalog')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] cursor-pointer transition-all ${
                      productType === 'catalog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Catalog
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductType('custom')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] cursor-pointer transition-all ${
                      productType === 'custom' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Custom Job
                  </button>
                </div>
              </div>

              {/* Product Selection */}
              {productType === 'catalog' ? (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Choose Catalog Product</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — Base ₹{p.basePrice}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Custom Job Title / Description <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. 8-Page Tri-fold Brochure with Spot UV"
                      value={customProductName}
                      onChange={(e) => setCustomProductName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Category Tag</label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="business-cards">Visiting Cards & Stationery</option>
                      <option value="marketing-materials">Marketing Flyers & Brochures</option>
                      <option value="stickers-labels">Stickers, Decals & Labels</option>
                      <option value="packaging">Packaging Boxes & Rigid Boxes</option>
                      <option value="promotional-gifts">Promotional & Corporate Gifts</option>
                      <option value="large-format">Flex Banners & Standees</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Quantity Preset Pills */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Order Quantity <span className="text-rose-500">*</span></label>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {quantity.toLocaleString()} Units
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[100, 250, 500, 1000, 2000, 5000].map(qty => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => {
                        setQuantity(qty);
                        if (productType === 'catalog') {
                          const p = products.find(x => x.id === selectedProductId);
                          if (p) {
                            const est = (p.basePrice || 299) * (qty >= 500 ? (qty / 500) * 1.8 : 1);
                            setTotalAmount(Math.round(est));
                            if (paymentStatus === 'Paid') setAdvancePaid(Math.round(est));
                          }
                        }
                      }}
                      className={`px-2.5 py-1.5 rounded-lg border font-bold text-xs cursor-pointer transition-all ${
                        quantity === qty 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 font-mono text-xs text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Custom Qty"
                  />
                </div>
              </div>

              {/* Paper Stock & Material */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Paper Stock / Substrate</label>
                <select
                  value={paperStock}
                  onChange={(e) => setPaperStock(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="350 GSM Velvet Matte">350 GSM Velvet Matte Art Card</option>
                  <option value="400 GSM Ultra Thick Gloss">400 GSM Ultra Thick Card (Gloss Laminate)</option>
                  <option value="300 GSM Premium Matte">300 GSM Royal Matte Board</option>
                  <option value="250 GSM Uncoated Natural">250 GSM Uncoated Natural Off-White</option>
                  <option value="Non-Tearable Synthetic Paper">Non-Tearable Waterproof Synthetic</option>
                  <option value="Kraft Textured Eco Paper">Eco-Friendly Kraft Natural Board</option>
                  <option value="Self-Adhesive Vinyl 120 Micron">Self-Adhesive Vinyl (Die-Cut)</option>
                  <option value="Custom">Custom Substrate (Enter below)</option>
                </select>
                {paperStock === 'Custom' && (
                  <input
                    type="text"
                    placeholder="Specify exact GSM or material..."
                    value={customPaperStock}
                    onChange={(e) => setCustomPaperStock(e.target.value)}
                    className="w-full mt-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                )}
              </div>

              {/* Size / Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Dimensions / Size</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Standard (89mm x 51mm)">Standard 89 x 51 mm</option>
                    <option value="Square (65mm x 65mm)">Square 65 x 65 mm</option>
                    <option value="A4 (8.27 x 11.69 in)">A4 (8.27 x 11.69 in)</option>
                    <option value="A3 (11.69 x 16.54 in)">A3 (11.69 x 16.54 in)</option>
                    <option value="12 x 18 inch Poster">12 x 18 inch Sheet</option>
                    <option value="Custom">Custom Dimensions</option>
                  </select>
                  {size === 'Custom' && (
                    <input
                      type="text"
                      placeholder="e.g. 10 x 15 cm"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Print Sides</label>
                  <select
                    value={sides}
                    onChange={(e) => setSides(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Front Only (Single Side)">Front Only (Single Side)</option>
                    <option value="Front & Back (Both Sides)">Front & Back (Both Sides)</option>
                  </select>
                </div>
              </div>

              {/* Finishing & Enhancements */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Finishing / Surface Effect</label>
                <select
                  value={finishing}
                  onChange={(e) => setFinishing(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Velvet Matte Lamination">Velvet Matte Lamination</option>
                  <option value="Gloss Lamination">Gloss Lamination</option>
                  <option value="Raised Spot UV + Matte">Raised Spot UV + Velvet Matte</option>
                  <option value="Metallic Gold Foil Stamping">Metallic Gold Foil Stamping</option>
                  <option value="Silver Foil Stamping">Silver Foil Stamping</option>
                  <option value="Die-Cut Rounded Corners (6mm)">Die-Cut Rounded Corners (6mm)</option>
                  <option value="Creasing & Folding">Creasing & Folding</option>
                  <option value="None / Raw Uncoated">None / Raw Uncoated</option>
                  <option value="Custom">Custom Finishing</option>
                </select>
                {finishing === 'Custom' && (
                  <input
                    type="text"
                    placeholder="Describe custom finishing..."
                    value={customFinishing}
                    onChange={(e) => setCustomFinishing(e.target.value)}
                    className="w-full mt-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                )}
              </div>

              {/* Artwork / File Attachment Status */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-700 block">Artwork Proof File</label>
                
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => setArtworkStatus('whatsapp_received')}
                    className={`p-2 rounded-xl border text-center font-bold text-[10px] cursor-pointer transition-all ${
                      artworkStatus === 'whatsapp_received' 
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    💬 On WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setArtworkStatus('uploaded')}
                    className={`p-2 rounded-xl border text-center font-bold text-[10px] cursor-pointer transition-all ${
                      artworkStatus === 'uploaded' 
                        ? 'bg-blue-50 border-blue-400 text-blue-800' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    📎 Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setArtworkStatus('pending_customer')}
                    className={`p-2 rounded-xl border text-center font-bold text-[10px] cursor-pointer transition-all ${
                      artworkStatus === 'pending_customer' 
                        ? 'bg-amber-50 border-amber-400 text-amber-800' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ⏳ Send Later
                  </button>
                </div>

                {artworkStatus === 'uploaded' && (
                  <div>
                    {uploadedFileName ? (
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="font-bold text-slate-800 text-xs truncate">{uploadedFileName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFileName('');
                            setUploadedFileUrl('');
                          }}
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer bg-slate-50 hover:bg-emerald-50/20 transition-all text-center"
                      >
                        <Upload className="w-5 h-5 text-emerald-600" />
                        <span className="font-bold text-slate-700 text-xs">Attach Artwork / PDF Proof</span>
                        <span className="text-[10px] text-slate-400">PDF, CDR, AI, PSD, JPG, PNG</span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                  </div>
                )}

              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 3: Commercials, Payment Status, Timeline (4 Cols) */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5 text-xs">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Commercials & Payment</h3>
                    <p className="text-[10px] text-slate-400">Agreed WhatsApp deal & status</p>
                  </div>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-3.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Agreed Total Order Amount <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-slate-400 font-normal">Negotiated price</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-slate-500 text-sm">₹</span>
                    <input
                      type="number"
                      required
                      min={1}
                      value={totalAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setTotalAmount(val);
                        if (paymentStatus === 'Paid') setAdvancePaid(val);
                      }}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 font-black text-base text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Advance / Paid (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={advancePaid}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setAdvancePaid(val);
                        if (val >= totalAmount && totalAmount > 0) {
                          setPaymentStatus('Paid');
                        } else if (val > 0) {
                          setPaymentStatus('Partial');
                        } else {
                          setPaymentStatus('Pending');
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Remaining Balance</label>
                    <div className={`px-3 py-2 rounded-xl border font-black text-xs flex items-center justify-between ${
                      balancePending > 0 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}>
                      <span>₹{balancePending.toLocaleString()}</span>
                      <span className="text-[10px] font-bold uppercase">{balancePending > 0 ? 'Due' : 'Cleared'}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Status Preset Buttons */}
                <div className="space-y-1.5 pt-1">
                  <label className="font-bold text-slate-700">Payment Status</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'Paid', label: 'Full Received', color: 'bg-emerald-600 text-white border-emerald-600' },
                      { id: 'Partial', label: 'Advance Paid', color: 'bg-amber-500 text-white border-amber-500' },
                      { id: 'Pending', label: 'Pending / Later', color: 'bg-rose-500 text-white border-rose-500' },
                      { id: 'COD', label: 'Pay on Delivery', color: 'bg-blue-600 text-white border-blue-600' }
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          setPaymentStatus(st.id as any);
                          if (st.id === 'Paid') setAdvancePaid(totalAmount);
                          if (st.id === 'Pending' || st.id === 'COD') setAdvancePaid(0);
                        }}
                        className={`py-1.5 px-2 rounded-xl border font-black text-[11px] cursor-pointer transition-all ${
                          paymentStatus === st.id 
                            ? `${st.color} shadow-xs` 
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Payment Mode</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="UPI">UPI / Google Pay / PhonePe</option>
                    <option value="Cash">Cash (Physical Register)</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT / RTGS / IMPS)</option>
                    <option value="Cheque">Cheque Clearing</option>
                    <option value="Card">Debit / Credit Card POS</option>
                  </select>
                </div>

              </div>

              {/* Order Status & Expected Dispatch */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Initial Job Status</label>
                    <select
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing / In Press</option>
                      <option value="Order Placed">Order Placed</option>
                      <option value="Shipped">Ready / Dispatched</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Estimated Delivery</label>
                    <input
                      type="text"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                      placeholder="e.g. Tomorrow 5 PM"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* WhatsApp Discussion & Production Notes */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>WhatsApp Discussion & Job Notes</span>
                    <span className="text-[10px] text-slate-400 font-normal">Internal & Customer Memo</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter special customer instructions, color profile requirements, packing instructions..."
                    value={discussionNotes}
                    onChange={(e) => setDiscussionNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>

                {/* Auto WhatsApp Confirmation Toggle */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-black text-slate-900 text-xs">WhatsApp Confirmation</div>
                      <div className="text-[10px] text-slate-500">Open WhatsApp with formatted invoice docket</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={openWhatsAppOnSubmit}
                      onChange={(e) => setOpenWhatsAppOnSubmit(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#1faa50] text-white font-black text-xs shadow-lg shadow-emerald-500/25 cursor-pointer transition-all transform active:scale-98"
                >
                  <Save className="w-4 h-4" />
                  <span>Confirm & Save WhatsApp Order</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </form>
    </div>
  );
};
export default AdminCreateOrderPage;
