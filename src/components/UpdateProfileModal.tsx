import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  Mail, 
  MapPin, 
  Sparkles, 
  X, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface UpdateProfileModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { 
    currentUser, 
    updateUserProfile, 
    isMarathi, 
    showToast,
    isUpdateProfileModalOpen,
    closeUpdateProfileModal
  } = useApp();

  const showModal = isOpen !== undefined ? isOpen : isUpdateProfileModalOpen;
  const handleClose = onClose || closeUpdateProfileModal;

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // If current name is placeholder like "Customer (6863)" or empty, start with clean field
      const currentName = currentUser.name || '';
      const isPlaceholder = 
        !currentName || 
        currentName.toLowerCase().startsWith('customer') || 
        currentName.toLowerCase().startsWith('user') ||
        currentName.toLowerCase() === 'proprint customer' ||
        currentName.toLowerCase() === 'new customer';

      setName(isPlaceholder ? '' : currentName);
      setCompanyName(currentUser.companyName || '');
      // If email is dummy phone email like 9322126863@proprint.in, leave blank for real email
      const isDummyEmail = currentUser.email?.endsWith('@proprint.in') && /^\d+@proprint\.in$/.test(currentUser.email);
      setEmail(isDummyEmail ? '' : (currentUser.email || ''));
      setCity(currentUser.city || 'Chhatrapati Sambhajinagar');
    }
  }, [currentUser, showModal]);

  if (!showModal || !currentUser) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError(
        isMarathi 
          ? 'कृपया आपले पूर्ण नाव टाका (किमान २ अक्षरे).'
          : 'Please enter your full name (at least 2 characters).'
      );
      return;
    }

    // Check placeholder names
    if (trimmedName.toLowerCase().startsWith('customer') || trimmedName.toLowerCase() === 'user') {
      setError(
        isMarathi
          ? 'कृपया आपले खरे नाव किंवा व्यवसायाचे नाव टाका.'
          : 'Please provide your real name or business name.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const updatePayload: any = {
        name: trimmedName,
        companyName: companyName.trim() || 'Commercial Firm',
        city: city.trim() || 'Chhatrapati Sambhajinagar',
        nameUpdated: true,
        isProfileComplete: true,
      };

      if (email.trim()) {
        updatePayload.email = email.trim();
      }

      await updateUserProfile(updatePayload);

      showToast(
        isMarathi 
          ? `स्वागत आहे, ${trimmedName}! आपले प्रोफाईल यशस्वीरित्या अपडेट झाले.` 
          : `Welcome, ${trimmedName}! Your profile has been updated.`,
        'success'
      );

      setIsSubmitting(false);
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(isMarathi ? 'माहिती सेव्ह करण्यात अडचण आली.' : 'Failed to save profile details.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-marathi animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-auto text-slate-900 transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white px-6 py-6 sm:px-8 sm:py-7 relative overflow-hidden">
          {/* Subtle Glow Effect */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-rose-600/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-32 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-[10px] font-black text-rose-300 uppercase tracking-wider">
                {isMarathi ? 'प्रोफाईल पूर्ण करा' : 'Profile Update Required'}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {isMarathi ? 'कृपया आपले नाव अपडेट करा' : 'Please Update Your Name'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                {isMarathi
                  ? 'आपले खरे नाव आणि माहिती टाका जेणेकरून प्रिंट बिल, डिझाईन आणि डिलिव्हरी वेळेवर व अचूक होईल.'
                  : 'Enter your name and details to personalize print invoices, design proofs, and order tracking.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 sm:space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name (Mandatory) */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>{isMarathi ? 'आपले संपूर्ण नाव *' : 'Your Full Name *'}</span>
              <span className="text-[10px] font-bold text-rose-600">
                {isMarathi ? 'आवश्यक' : 'Required'}
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4 text-rose-500" />
              </div>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder={isMarathi ? 'उदा. राजेश शर्मा किंवा अमोल पाटील' : 'e.g., Rajesh Sharma or Priya Deshmukh'}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none"
              />
            </div>
          </div>

          {/* Company / Shop / Firm Name */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>{isMarathi ? 'व्यवसाय / कंपनीचे नाव (ऐच्छिक)' : 'Business / Firm Name (Optional)'}</span>
              <span className="text-[10px] font-semibold text-slate-400">
                {isMarathi ? 'बिलिंगसाठी' : 'For Invoices'}
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={isMarathi ? 'उदा. शर्मा ऑटोमेशन्स किंवा श्री ग्राफिक्स' : 'e.g., Prime Advertising or Royal Graphics'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none"
              />
            </div>
          </div>

          {/* Grid: Email & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                {isMarathi ? 'ईमेल आयडी' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                {isMarathi ? 'शहर / ठिकाण' : 'City / Location'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Chh. Sambhajinagar"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Trust Highlights */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center gap-3 text-slate-600 text-[11px]">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="leading-snug">
              {isMarathi
                ? 'तुमची माहिती सुरक्षित राहील आणि फक्त अधिकृत प्रिंट बिल व ऑर्डर डिलिव्हरीसाठी वापरली जाईल.'
                : 'Your info is protected and used strictly for commercial billing and accurate delivery.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              {isSubmitting ? (
                <span>{isMarathi ? 'सेव्ह होत आहे...' : 'Saving profile...'}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isMarathi ? 'माहिती सेव्ह करा व पुढे जा' : 'Save & Update Profile'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer text-center"
            >
              {isMarathi ? 'नंतर अपडेट करा (Skip for now)' : "I'll do this later"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
