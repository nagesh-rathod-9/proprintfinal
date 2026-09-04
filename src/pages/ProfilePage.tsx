import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  Phone, 
  Mail, 
  Building2, 
  FileText, 
  MapPin, 
  Edit3, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  CheckCircle2, 
  LogOut, 
  Package, 
  ArrowLeft, 
  Home, 
  Briefcase, 
  Factory, 
  Store, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Save,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAddress } from '../types';

export const ProfilePage: React.FC = () => {
  const { 
    currentUser, 
    updateUserProfile, 
    addUserAddress, 
    updateUserAddress, 
    deleteUserAddress, 
    setDefaultAddress,
    logout, 
    orders, 
    isMarathi, 
    showToast,
    openUpdateProfileModal,
    isUserNameNotUpdated
  } = useApp();

  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login?redirect=/profile');
    }
  }, [currentUser, navigate]);

  // Personal Detail Inline Edit States
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState('');
  const [isSavingField, setIsSavingField] = useState(false);

  // Address Modal / Form States
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressLabel, setAddressLabel] = useState('Office');
  const [addressCustomLabel, setAddressCustomLabel] = useState('');
  const [addressName, setAddressName] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addressCompany, setAddressCompany] = useState('');
  const [addressGst, setAddressGst] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('Maharashtra');
  const [addressPincode, setAddressPincode] = useState('');
  const [addressIsDefault, setAddressIsDefault] = useState(false);
  const [addressFormError, setAddressFormError] = useState('');
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  if (!currentUser) {
    return null;
  }

  const userOrders = orders.filter(
    (o) =>
      (currentUser.id && o.userId === currentUser.id) ||
      (currentUser.phone && o.customerPhone === currentUser.phone) ||
      (currentUser.email && o.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase())
  );

  const addresses = currentUser.addresses || [];

  // Start editing a specific personal detail
  const handleStartEditField = (fieldName: string, currentValue: string) => {
    setEditingField(fieldName);
    setFieldValue(currentValue || '');
  };

  // Save the single personal detail
  const handleSaveField = async (fieldName: string) => {
    setIsSavingField(true);
    let updatePayload: any = {};

    if (fieldName === 'name') updatePayload.name = fieldValue.trim() || currentUser.name;
    else if (fieldName === 'phone') {
      const cleanPhone = fieldValue.replace(/\D/g, '').slice(-10);
      if (cleanPhone.length < 10) {
        showToast('Please enter a valid 10-digit mobile number', 'error');
        setIsSavingField(false);
        return;
      }
      updatePayload.phone = cleanPhone;
    } else if (fieldName === 'email') {
      if (!fieldValue.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        setIsSavingField(false);
        return;
      }
      updatePayload.email = fieldValue.trim();
    } else if (fieldName === 'companyName') {
      updatePayload.companyName = fieldValue.trim();
    } else if (fieldName === 'gstNumber') {
      updatePayload.gstNumber = fieldValue.trim().toUpperCase();
      updatePayload.gstin = fieldValue.trim().toUpperCase();
    }

    await updateUserProfile(updatePayload);
    setIsSavingField(false);
    setEditingField(null);
  };

  // Open Address Modal for Adding
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressLabel('Office');
    setAddressCustomLabel('');
    setAddressName(currentUser.name || '');
    setAddressPhone(currentUser.phone || '');
    setAddressCompany(currentUser.companyName || '');
    setAddressGst(currentUser.gstNumber || '');
    setAddressLine('');
    setAddressCity(currentUser.city || 'Chhatrapati Sambhajinagar');
    setAddressState('Maharashtra');
    setAddressPincode(currentUser.pincode || '431001');
    setAddressIsDefault(addresses.length === 0);
    setAddressFormError('');
    setIsAddressModalOpen(true);
  };

  // Open Address Modal for Editing
  const handleOpenEditAddress = (addr: UserAddress) => {
    setEditingAddressId(addr.id);
    const standardLabels = ['Office', 'Home', 'Factory', 'Shop', 'Warehouse'];
    if (standardLabels.includes(addr.label)) {
      setAddressLabel(addr.label);
      setAddressCustomLabel('');
    } else {
      setAddressLabel('Other');
      setAddressCustomLabel(addr.label);
    }
    setAddressName(addr.name || currentUser.name);
    setAddressPhone(addr.phone || currentUser.phone);
    setAddressCompany(addr.companyName || '');
    setAddressGst(addr.gstNumber || '');
    setAddressLine(addr.addressLine || '');
    setAddressCity(addr.city || 'Chhatrapati Sambhajinagar');
    setAddressState(addr.state || 'Maharashtra');
    setAddressPincode(addr.pincode || '');
    setAddressIsDefault(!!addr.isDefault);
    setAddressFormError('');
    setIsAddressModalOpen(true);
  };

  // Save Address (Create or Update)
  const handleSaveAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressFormError('');

    if (!addressName.trim()) {
      setAddressFormError('Please enter recipient name');
      return;
    }
    if (!addressPhone.trim() || addressPhone.replace(/\D/g, '').length < 10) {
      setAddressFormError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!addressLine.trim()) {
      setAddressFormError('Please enter street address / premises details');
      return;
    }
    if (!addressCity.trim()) {
      setAddressFormError('Please enter city');
      return;
    }
    if (!addressPincode.trim() || addressPincode.replace(/\D/g, '').length < 6) {
      setAddressFormError('Please enter a valid 6-digit PIN code');
      return;
    }

    const finalLabel = addressLabel === 'Other' ? (addressCustomLabel.trim() || 'Other') : addressLabel;

    setIsSavingAddress(true);
    const addrData = {
      label: finalLabel,
      name: addressName.trim(),
      phone: addressPhone.replace(/\D/g, '').slice(-10),
      companyName: addressCompany.trim(),
      gstNumber: addressGst.trim().toUpperCase(),
      addressLine: addressLine.trim(),
      city: addressCity.trim(),
      state: addressState.trim() || 'Maharashtra',
      pincode: addressPincode.replace(/\D/g, '').slice(0, 6),
      isDefault: addressIsDefault
    };

    if (editingAddressId) {
      await updateUserAddress(editingAddressId, addrData);
    } else {
      await addUserAddress(addrData);
    }

    setIsSavingAddress(false);
    setIsAddressModalOpen(false);
  };

  // Address Icon Helper
  const getAddressIcon = (label: string) => {
    const l = (label || '').toLowerCase();
    if (l.includes('home')) return <Home className="w-4 h-4 text-emerald-600" />;
    if (l.includes('factory') || l.includes('workshop')) return <Factory className="w-4 h-4 text-amber-600" />;
    if (l.includes('shop') || l.includes('store')) return <Store className="w-4 h-4 text-purple-600" />;
    return <Briefcase className="w-4 h-4 text-rose-600" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-6 sm:py-10 font-marathi">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            id="profile-back-btn"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isMarathi ? 'मागे जा' : 'Back'}</span>
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/90 mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-neutral-900 border border-neutral-700/80 text-white flex items-center justify-center shadow-md shrink-0">
                <UserIcon className="w-7 h-7 sm:w-8 sm:h-8 text-slate-200" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {currentUser.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  {currentUser.email || 'customer@proprint.in'}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-700 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Phone className="w-3.5 h-3.5 text-rose-600" />
                    +91 {currentUser.phone}
                  </span>
                  {currentUser.companyName && (
                    <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {currentUser.companyName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Link to Orders */}
            <Link
              to="/orders"
              id="profile-view-orders-btn"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FF0038] hover:bg-[#e00032] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 transition-all"
            >
              <Package className="w-4 h-4" />
              <span>{isMarathi ? 'माझ्या ऑर्डर्स पहा' : 'View My Orders'} ({userOrders.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Action Prompt: If user name has not been updated */}
        {currentUser && isUserNameNotUpdated(currentUser) && (
          <div className="mb-8 p-5 sm:p-6 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border-2 border-amber-400/60 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {isMarathi ? 'कृपया तुमचे नाव अपडेट करा' : 'Please Update Your Name'}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  {isMarathi 
                    ? 'आपले खरे नाव टाकल्याने डिझाईन, इनव्हॉईस व डिलिव्हरी अचूक होते.' 
                    : 'Provide your real name for official tax invoices, customized proofs, and dispatch labels.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              id="profile-banner-update-name-btn"
              onClick={openUpdateProfileModal}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              {isMarathi ? 'आता अपडेट करा' : 'Update Profile Now'}
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 1: PERSONAL & BASIC DETAILS (EACH WITH DEDICATED EDIT ICON ✏️)     */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/90 mb-8">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {isMarathi ? 'वैयक्तिक माहिती (Personal Details)' : 'Personal & Basic Details'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isMarathi ? 'माहिती बदलण्यासाठी समोरील पेन्सिल आयकॉनवर क्लिक करा' : 'Click the edit icon next to any detail to update'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* 1. Full Name */}
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 transition-all hover:bg-slate-50">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isMarathi ? 'पूर्ण नाव' : 'Full Name'}
                  </span>
                  {editingField === 'name' ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                        placeholder="Enter full name"
                        className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-white border border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-900"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveField('name')}
                        disabled={isSavingField}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm font-black text-slate-800">
                      {currentUser.name || 'Not provided'}
                    </p>
                  )}
                </div>
                {editingField !== 'name' && (
                  <button
                    onClick={() => handleStartEditField('name', currentUser.name)}
                    id="edit-field-name-btn"
                    className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                    title="Edit Name"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Mobile Phone Number */}
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 transition-all hover:bg-slate-50">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isMarathi ? 'मोबाईल नंबर' : 'Mobile Number'}
                  </span>
                  {editingField === 'phone' ? (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={fieldValue}
                          onChange={(e) => setFieldValue(e.target.value.replace(/\D/g, ''))}
                          placeholder="10-digit number"
                          className="w-full pl-11 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-900"
                          autoFocus
                        />
                      </div>
                      <button
                        onClick={() => handleSaveField('phone')}
                        disabled={isSavingField}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-rose-500" />
                      <span>+91 {currentUser.phone}</span>
                    </p>
                  )}
                </div>
                {editingField !== 'phone' && (
                  <button
                    onClick={() => handleStartEditField('phone', currentUser.phone)}
                    id="edit-field-phone-btn"
                    className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                    title="Edit Phone Number"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 3. Email Address */}
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 transition-all hover:bg-slate-50">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isMarathi ? 'ईमेल पत्ता' : 'Email Address'}
                  </span>
                  {editingField === 'email' ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="email"
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                        placeholder="client@proprint.in"
                        className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-white border border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-900"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveField('email')}
                        disabled={isSavingField}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{currentUser.email || 'Not set'}</span>
                    </p>
                  )}
                </div>
                {editingField !== 'email' && (
                  <button
                    onClick={() => handleStartEditField('email', currentUser.email)}
                    id="edit-field-email-btn"
                    className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                    title="Edit Email Address"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 4. Company / Business Firm Name */}
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 transition-all hover:bg-slate-50">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isMarathi ? 'कंपनी / फर्मचे नाव' : 'Business / Company Name'}
                  </span>
                  {editingField === 'companyName' ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                        placeholder="e.g. Acme Tech Solutions"
                        className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-white border border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-slate-900"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveField('companyName')}
                        disabled={isSavingField}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{currentUser.companyName || 'Not specified'}</span>
                    </p>
                  )}
                </div>
                {editingField !== 'companyName' && (
                  <button
                    onClick={() => handleStartEditField('companyName', currentUser.companyName || '')}
                    id="edit-field-company-btn"
                    className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                    title="Edit Company Name"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 5. GSTIN / Tax ID */}
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 transition-all hover:bg-slate-50">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isMarathi ? 'जीएसटी नंबर (GSTIN)' : 'GSTIN / Tax ID'}
                  </span>
                  {editingField === 'gstNumber' ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        maxLength={15}
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value.toUpperCase())}
                        placeholder="27AXXXX1234X1Z0"
                        className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-white border border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-mono font-bold text-slate-900"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveField('gstNumber')}
                        disabled={isSavingField}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm font-mono font-black text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>{currentUser.gstNumber || currentUser.gstin || 'No GST Registered'}</span>
                    </p>
                  )}
                </div>
                {editingField !== 'gstNumber' && (
                  <button
                    onClick={() => handleStartEditField('gstNumber', currentUser.gstNumber || currentUser.gstin || '')}
                    id="edit-field-gstin-btn"
                    className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                    title="Edit GSTIN"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: SAVED DELIVERY ADDRESSES (MULTIPLE ADDRESSES MANAGEMENT)        */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/90 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {isMarathi ? 'डिलिव्हरी पत्ते (Saved Delivery Addresses)' : 'Saved Delivery Addresses'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isMarathi ? 'तुम्ही अनेक पत्ते जोडू शकता व ऑर्डरच्या वेळी निवडू शकता' : 'Add multiple addresses and select easily during checkout'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenAddAddress}
              id="profile-add-address-btn"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-rose-400" />
              <span>{isMarathi ? '+ नवीन पत्ता जोडा' : '+ Add New Address'}</span>
            </button>
          </div>

          {/* List of Addresses */}
          {addresses.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-200/80 text-slate-500 flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">
                  {isMarathi ? 'कोणताही पत्ता जतन केलेला नाही' : 'No Saved Delivery Addresses Yet'}
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isMarathi 
                    ? 'जलद डिलिव्हरी व ऑर्डर बुकिंगसाठी तुमचा मुख्य पत्ता जोडा.' 
                    : 'Add your office, factory, or home delivery address for 1-click checkout.'}
                </p>
              </div>
              <button
                onClick={handleOpenAddAddress}
                className="px-4 py-2 bg-[#FF0038] hover:bg-[#e00032] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                + Add First Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  id={`address-card-${addr.id}`}
                  className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    addr.isDefault
                      ? 'bg-rose-50/30 border-rose-300/80 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Top Row: Label & Default Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-white shadow-2xs border border-slate-100">
                          {getAddressIcon(addr.label)}
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                          {addr.label}
                        </span>
                      </div>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                          <Check className="w-3 h-3" />
                          Default Delivery
                        </span>
                      )}
                    </div>

                    {/* Recipient info */}
                    <div>
                      <p className="text-xs font-bold text-slate-900">{addr.name}</p>
                      {addr.companyName && (
                        <p className="text-[11px] font-medium text-slate-600">{addr.companyName}</p>
                      )}
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">+91 {addr.phone}</p>
                    </div>

                    {/* Full Address details */}
                    <p className="text-xs text-slate-700 leading-relaxed pt-1">
                      {addr.addressLine}, {addr.city}, {addr.state || 'Maharashtra'} - <span className="font-bold font-mono">{addr.pincode}</span>
                    </p>

                    {addr.gstNumber && (
                      <p className="text-[11px] font-mono text-slate-500">GST: {addr.gstNumber}</p>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-200/60 text-xs">
                    {!addr.isDefault ? (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[11px] font-bold text-slate-600 hover:text-rose-600 underline cursor-pointer"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-[11px] text-rose-600 font-bold">Primary Address</span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditAddress(addr)}
                        id={`edit-address-btn-${addr.id}`}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="Edit this address"
                      >
                        <Edit3 className="w-3 h-3 text-slate-500" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteUserAddress(addr.id)}
                        id={`delete-address-btn-${addr.id}`}
                        className="p-1 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT ADDRESS MODAL                                           */}
      {/* ========================================================================= */}
      {isAddressModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsAddressModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 my-auto animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {editingAddressId 
                    ? (isMarathi ? 'पत्ता अपडेट करा' : 'Edit Delivery Address')
                    : (isMarathi ? 'नवीन पत्ता जोडा' : 'Add New Delivery Address')}
                </h3>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addressFormError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addressFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAddressSubmit} className="space-y-4 mt-4 text-xs font-medium">
              
              {/* Address Label Pills */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Address Type / Label
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {['Office', 'Home', 'Factory', 'Shop', 'Other'].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setAddressLabel(lbl)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        addressLabel === lbl
                          ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
                {addressLabel === 'Other' && (
                  <input
                    type="text"
                    value={addressCustomLabel}
                    onChange={(e) => setAddressCustomLabel(e.target.value)}
                    placeholder="e.g. Warehouse MIDC"
                    className="mt-2 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                )}
              </div>

              {/* Recipient Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressName}
                    onChange={(e) => setAddressName(e.target.value)}
                    placeholder="e.g. Nagesh Rathod"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={addressPhone}
                    onChange={(e) => setAddressPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit number"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-mono"
                  />
                </div>
              </div>

              {/* Company & GST (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Company / Firm Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressCompany}
                    onChange={(e) => setAddressCompany(e.target.value)}
                    placeholder="e.g. TechPrimeLab Software"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    GSTIN Number (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={addressGst}
                    onChange={(e) => setAddressGst(e.target.value.toUpperCase())}
                    placeholder="27ABCDE1234F1Z5"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-mono"
                  />
                </div>
              </div>

              {/* Address Line */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Street Address / Plot / Floor / Building *
                </label>
                <textarea
                  required
                  rows={2}
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Flat 402, Cyber Heights, Sector 5, CIDCO"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none"
                />
              </div>

              {/* City, State & PIN Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    placeholder="Chhatrapati Sambhajinagar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={addressState}
                    onChange={(e) => setAddressState(e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addressPincode}
                    onChange={(e) => setAddressPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="431001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-mono"
                  />
                </div>
              </div>

              {/* Default Checkbox */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addressIsDefault}
                  onChange={(e) => setAddressIsDefault(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700">
                  Set as default delivery address for future orders
                </span>
              </label>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="px-5 py-2.5 bg-[#FF0038] hover:bg-[#e00032] text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingAddress ? 'Saving...' : 'Save Address'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
