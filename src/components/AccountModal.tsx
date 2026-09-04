import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  FileText, 
  Package, 
  Clock, 
  CheckCircle2, 
  LogOut,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTrackOrder: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onOpenTrackOrder
}) => {
  const { currentUser, setCurrentUser, orders, quotes, isMarathi, logout } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'quotes'>('profile');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setCompany(currentUser.companyName || '');
      setAddress(currentUser.shippingAddress || '');
      setGstin(currentUser.gstNumber || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      const updated = {
        ...currentUser,
        name,
        email,
        phone,
        companyName: company,
        shippingAddress: address,
        gstNumber: gstin
      };
      setCurrentUser(updated);
      localStorage.setItem('proprint_user', JSON.stringify(updated));
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  if (!currentUser) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-marathi"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 my-auto text-slate-900 p-6 sm:p-8 text-center space-y-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900">
              {isMarathi ? 'कृपया लॉगिन करा' : 'Sign In Required'}
            </h2>
            <p className="text-xs text-slate-500">
              {isMarathi 
                ? 'तुमच्या ऑर्डर्स, जीएसटी प्रोफाइल आणि कोटेशन्स पाहण्यासाठी साइन इन करा.'
                : 'Sign in to access your profile, track active orders, and view quotations.'}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href="/login"
              onClick={() => onClose()}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>{isMarathi ? 'साइन इन करा' : 'Sign In / Register'}</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
            >
              {isMarathi ? 'बंद करा' : 'Continue as Guest'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-marathi"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-auto text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5 text-slate-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {name}
              </h2>
              <p className="text-xs text-rose-300 font-semibold">{company || 'Business Account'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center border-b border-slate-100 bg-slate-50 px-5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {isMarathi ? 'माझे प्रोफाइल' : 'Business Profile'}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{isMarathi ? 'माझ्या ऑर्डर्स' : 'Order History'}</span>
            <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded-full">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quotes'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{isMarathi ? 'कोटेशन्स' : 'Quotes'}</span>
            <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded-full">{quotes.length}</span>
          </button>
        </div>

        {/* Tab 1: Profile Form */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">{isMarathi ? 'नाव' : 'Full Name'}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">{isMarathi ? 'कंपनी / फर्मचे नाव' : 'Company Name'}</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">{isMarathi ? 'मोबाईल नंबर' : 'Phone Number'}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">{isMarathi ? 'ईमेल' : 'Email Address'}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700 block">{isMarathi ? 'डिलिव्हरी पत्ता' : 'Delivery Address'}</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700 block">{isMarathi ? 'GSTIN (कर बिलासाठी)' : 'GSTIN (For Tax Invoicing)'}</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="27AXXXX1234X1Z0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isMarathi ? 'माहिती सेव्ह झाली!' : 'Profile updated successfully!'}</span>
                </span>
              ) : <div />}

              <button
                type="submit"
                className="bg-slate-900 hover:bg-rose-600 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
              >
                {isMarathi ? 'बदल सेव्ह करा' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Orders List */}
        {activeTab === 'orders' && (
          <div className="p-5 sm:p-6 space-y-3 max-h-[60vh] overflow-y-auto text-xs">
            {(!orders || orders.length === 0) ? (
              <div className="text-center py-12 space-y-2">
                <Package className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-bold">{isMarathi ? 'कोणतीही ऑर्डर नाही' : 'No orders yet'}</p>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-xs">#{ord.orderNumber}</span>
                      <span className="text-[11px] text-slate-500 block">{ord.createdAt}</span>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      {ord.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-700">
                    {(ord.items || []).map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{it.product?.name || 'Item'} (x{it.customization?.quantity || 1})</span>
                        <span className="font-bold">₹{it.customization?.calculatedPrice || 0}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-900 font-bold">
                    <span>{isMarathi ? 'एकूण रक्कम:' : 'Total Amount:'}</span>
                    <span className="text-rose-600 font-black">₹{ord.totalAmount}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Quotes List */}
        {activeTab === 'quotes' && (
          <div className="p-5 sm:p-6 space-y-3 max-h-[60vh] overflow-y-auto text-xs">
            {(!quotes || quotes.length === 0) ? (
              <div className="text-center py-12 space-y-2">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-bold">{isMarathi ? 'कोणतीही कोटेशन मागणी नाही' : 'No quotes requested yet'}</p>
              </div>
            ) : (
              quotes.map((q) => (
                <div key={q.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{q.serviceRequired}</span>
                    <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">{q.status}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{q.projectDescription || 'Custom job requirement'}</p>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                    <span>Qty: {q.estimatedQuantity}</span>
                    <span>{q.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
