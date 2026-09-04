import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Check,
  Smartphone,
  User as UserIcon,
  LogOut,
  Package,
  ChevronRight,
  LayoutDashboard,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowLeft,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const {
    currentUser,
    loginWithPhone,
    loginDirectAdmin,
    logout,
    orders,
    isMarathi,
    showToast,
    openUpdateProfileModal,
    isUserNameNotUpdated,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect target from query parameter
  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || '';

  // Phone & OTP state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [showLoginFormAnyway, setShowLoginFormAnyway] = useState(false);

  // OTP input references
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanPhone = phoneNumber.replace(/\D/g, '');

    if (cleanPhone.length < 10) {
      setErrorMessage(
        isMarathi
          ? 'कृपया वैध १० अंकी मोबाईल नंबर टाका'
          : 'Please enter a valid 10-digit mobile number'
      );
      return;
    }

    setIsLoading(true);

    // Generate random 4-digit OTP
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();

    setGeneratedOtp(randomOtp);
    setOtpDigits(['', '', '', '']);
    setTimer(30);
    setCanResend(false);

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');

      showToast(
        isMarathi ? `ओटीपी पाठवला: ${randomOtp}` : `OTP sent: ${randomOtp}`,
        'info'
      );

      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }, 400);
  };

  // Handle OTP digit changes
  const handleOtpDigitChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (cleanValue.length > 1) {
      const pasted = cleanValue.slice(0, 4).split('');

      pasted.forEach((char, idx) => {
        if (idx < 4) {
          newDigits[idx] = char;
        }
      });

      setOtpDigits(newDigits);

      const nextIdx = Math.min(pasted.length, 3);
      otpInputRefs.current[nextIdx]?.focus();

      return;
    }

    newDigits[index] = cleanValue;
    setOtpDigits(newDigits);

    if (cleanValue && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === 'Backspace' &&
      !otpDigits[index] &&
      index > 0
    ) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Auto fill OTP
  const handleAutoFillOtp = () => {
    if (!generatedOtp) return;

    const digits = generatedOtp.split('');
    setOtpDigits(digits);

    otpInputRefs.current[3]?.focus();

    showToast(
      isMarathi ? 'ओटीपी भरला गेला!' : 'OTP auto-filled!',
      'success'
    );
  };

  // Copy OTP
  const handleCopyOtp = () => {
    if (!generatedOtp) return;

    navigator.clipboard.writeText(generatedOtp);
    setCopiedOtp(true);

    showToast('OTP copied to clipboard', 'info');

    setTimeout(() => setCopiedOtp(false), 2000);
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (!canResend) return;

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();

    setGeneratedOtp(newOtp);
    setTimer(30);
    setCanResend(false);
    setOtpDigits(['', '', '', '']);

    showToast(
      isMarathi
        ? `नवीन ओटीपी पाठवला: ${newOtp}`
        : `New OTP sent: ${newOtp}`,
      'info'
    );

    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 100);
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length < 4) {
      setErrorMessage(
        isMarathi
          ? 'कृपया संपूर्ण ४ अंकी ओटीपी टाका'
          : 'Please enter the complete 4-digit OTP'
      );
      return;
    }

    if (enteredOtp !== generatedOtp) {
      setErrorMessage(
        isMarathi
          ? 'अवैध ओटीपी. कृपया योग्य ओटीपी टाका.'
          : 'Invalid OTP. Please check the code shown above.'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);

      const res = loginWithPhone(cleanPhone);

      setIsLoading(false);

      if (res && res.success) {
        showToast(
          isMarathi
            ? 'लॉगिन यशस्वी!'
            : 'Signed in successfully!',
          'success'
        );

        // If user hasn't updated their name yet, trigger update modal
        if (res.user && isUserNameNotUpdated(res.user)) {
          openUpdateProfileModal();
        }

        if (redirectTarget) {
          navigate(redirectTarget);
        } else if (res.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      } else {
        setErrorMessage(
          (res as any)?.message || 'Login failed'
        );
      }
    }, 400);
  };

  // Direct Admin Login
  const handleDirectAdminLogin = () => {
    setIsLoading(true);

    setTimeout(() => {
      const res = loginDirectAdmin();

      setIsLoading(false);

      if (res.success) {
        showToast('Admin access granted', 'success');
        navigate(redirectTarget || '/admin');
      }
    }, 300);
  };

  // User orders
  const userOrders = orders.filter(
    (o) =>
      (currentUser?.id && o.userId === currentUser.id) ||
      (currentUser?.phone &&
        o.customerPhone === currentUser.phone) ||
      (currentUser?.email &&
        o.customerEmail?.toLowerCase() ===
          currentUser.email?.toLowerCase())
  );

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#f7f8fb] text-slate-900 font-marathi">

      {/* ================================================================
          ALREADY LOGGED IN
      ================================================================= */}
      {currentUser && !showLoginFormAnyway ? (
        <div className="h-full w-full flex items-center justify-center p-4 sm:p-6">

          <div className="w-full max-w-xl bg-white rounded-[28px] shadow-[0_20px_60px_rgba(15,23,42,0.10)] border border-slate-200 overflow-hidden">

            {/* Header */}
            <div className="px-5 sm:px-8 pt-5 sm:pt-7 pb-5 border-b border-slate-100">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center shadow-md shrink-0">
                  <UserIcon className="w-7 h-7 sm:w-8 sm:h-8 text-slate-200" />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate">
                      {currentUser.name}
                    </h2>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        currentUser.role === 'admin'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {currentUser.role === 'admin'
                        ? 'Admin'
                        : 'Customer'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1">
                    +91 {currentUser.phone}
                  </p>

                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="p-5 sm:p-8 space-y-3">

              {currentUser && isUserNameNotUpdated(currentUser) && (
                <button
                  type="button"
                  id="login-prompt-update-name-btn"
                  onClick={openUpdateProfileModal}
                  className="w-full p-4 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-between text-left hover:bg-amber-100/70 transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-amber-950 uppercase tracking-wider">
                        {isMarathi ? 'नाव अपडेट केलेले नाही' : 'Name Not Updated'}
                      </p>
                      <p className="text-xs text-amber-800 font-medium">
                        {isMarathi ? 'कृपया तुमचे पूर्ण नाव अपडेट करण्यासाठी येथे क्लिक करा' : 'Click here to set your actual name'}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 bg-amber-600 text-white text-xs font-black rounded-xl shadow-xs group-hover:bg-amber-700 transition-colors">
                    {isMarathi ? 'अपडेट करा' : 'Update Now'}
                  </span>
                </button>
              )}

              <Link
                to="/profile"
                id="login-view-profile-btn"
                className="group w-full min-h-[52px] px-4 sm:px-5 bg-[#ff0038] hover:bg-[#e80034] text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-rose-500/15 transition-all"
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4" />

                  <span>
                    {isMarathi
                      ? 'माझी प्रोफाइल व पत्ते व्यवस्थापित करा'
                      : 'My Profile & Saved Addresses'}
                  </span>
                </div>

                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/orders"
                id="login-view-orders-btn"
                className="group w-full min-h-[52px] px-4 sm:px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-amber-400" />

                  <span>
                    {isMarathi
                      ? 'माझ्या ऑर्डर्स पहा'
                      : 'View My Orders'}{' '}
                    ({userOrders.length})
                  </span>
                </div>

                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {currentUser.role === 'admin' && (
                <Link
                  to="/admin"
                  id="login-admin-portal-btn"
                  className="group w-full min-h-[52px] px-4 sm:px-5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />

                    <span>Admin Management Portal</span>
                  </div>

                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}

            </div>

            {/* Bottom */}
            <div className="px-5 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">

              <button
                type="button"
                onClick={() => setShowLoginFormAnyway(true)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 underline underline-offset-2"
              >
                {isMarathi
                  ? 'दुसऱ्या खात्याने लॉगिन करा'
                  : 'Switch Account'}
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  setShowLoginFormAnyway(true);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>

            </div>

          </div>
        </div>
      ) : (

        /* ================================================================
           LOGIN
        ================================================================= */
        <div className="h-full w-full flex flex-col lg:flex-row">

          {/* ============================================================
              LEFT BRAND PANEL - DESKTOP
          ============================================================= */}
          <div className="hidden lg:flex lg:w-[46%] xl:w-[48%] relative overflow-hidden bg-[#08111f] text-white">

            {/* Decorative glow */}
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#ff0038]/10 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-3xl" />

            {/* Dots */}
            <div className="absolute top-0 left-0 opacity-40">
              <div
                className="w-64 h-64"
                style={{
                  backgroundImage:
                    'radial-gradient(#ff0038 1.5px, transparent 1.5px)',
                  backgroundSize: '14px 14px',
                }}
              />
            </div>

            <div className="relative z-10 w-full h-full flex flex-col justify-between p-10 xl:p-14">

              {/* Logo */}
              <div>

                <div className="flex flex-col items-start">
                  <div className="h-1 w-32 bg-[#ff0038] rounded-full mb-2" />

                  <div className="text-5xl xl:text-6xl font-black tracking-[-3px] leading-none">
                    <span className="text-white">pro</span>
                    <span className="text-[#ff0038]">print</span>
                  </div>

                  <p className="mt-2 text-sm tracking-[4px] text-slate-300">
                    for all printing solutions
                  </p>
                </div>

              </div>

              {/* Main Brand Content */}
              <div className="max-w-xl -mt-10">

                <p className="text-sm font-bold uppercase tracking-[3px] text-[#ff4770] mb-4">
                  Your printing partner
                </p>

                <h1 className="text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight">
                  Great Prints.
                  <br />
                  <span className="text-[#ff0038]">
                    Made Simple.
                  </span>
                </h1>

                <p className="mt-6 text-base xl:text-lg leading-relaxed text-slate-300 max-w-md">
                  Professional printing quality with a simple,
                  fast and hassle-free ordering experience.
                </p>

                {/* Benefits */}
                <div className="mt-8 space-y-5">

                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#ff0038]/10 border border-[#ff0038]/20 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-[#ff4770]" />
                    </div>

                    <div>
                      <p className="font-bold text-white">
                        Fast & Easy Ordering
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Login with OTP — no password required
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#ff0038]/10 border border-[#ff0038]/20 flex items-center justify-center">
                      <Package className="w-5 h-5 text-[#ff4770]" />
                    </div>

                    <div>
                      <p className="font-bold text-white">
                        Track Your Orders
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Easily manage your printing orders
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#ff0038]/10 border border-[#ff0038]/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-[#ff4770]" />
                    </div>

                    <div>
                      <p className="font-bold text-white">
                        Secure & Hassle Free
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Your account and orders stay protected
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>© 2026 Proprint</span>

                <span className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  100% Secure
                </span>
              </div>

            </div>
          </div>

          {/* ============================================================
              RIGHT LOGIN PANEL
          ============================================================= */}
          <div className="flex-1 h-full overflow-hidden flex items-center justify-center p-3 sm:p-5 lg:p-8 xl:p-12 bg-[#f8f9fc]">

            <div className="w-full max-w-[560px] max-h-full flex flex-col">

              {/* Mobile Header */}
              <div className="lg:hidden flex items-center justify-between mb-3 px-1 shrink-0">

                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>
                    {isMarathi ? 'मुख्यपृष्ठ' : 'Store'}
                  </span>
                </Link>

                <span className="text-[9px] sm:text-[10px] font-black text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-1.5 rounded-full border border-rose-200">
                  Secure Login
                </span>

              </div>

              {/* Login Card */}
              <div className="bg-white rounded-[24px] sm:rounded-[30px] border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.09)] overflow-hidden">

                {/* Card Header */}
                <div className="px-5 sm:px-8 lg:px-10 pt-5 sm:pt-7 lg:pt-9">

                  {/* Desktop Back */}
                  <div className="hidden lg:flex items-center justify-between mb-6">

                    <Link
                      to="/"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Store
                    </Link>

                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
                      PROPRINT SECURE LOGIN
                    </span>

                  </div>

                  {/* Mobile Logo */}
                  <div className="lg:hidden text-center mb-2">

                    <div className="inline-flex flex-col items-center">
                      <div className="h-1 w-20 bg-[#ff0038] rounded-full mb-1.5" />

                      <div className="text-3xl sm:text-4xl font-black tracking-[-2px] leading-none">
                        <span className="text-slate-900">pro</span>
                        <span className="text-[#ff0038]">print</span>
                      </div>

                      <p className="text-[7px] sm:text-[8px] tracking-[2.5px] text-slate-400 mt-1">
                        for all printing solutions
                      </p>
                    </div>

                  </div>

                  {/* OTP Icon */}
                  <div className="flex justify-center mb-3 sm:mb-4">

                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 sm:w-7 sm:h-7 text-[#ff0038]" />
                    </div>

                  </div>

                  <div className="text-center">

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                      {step === 'phone'
                        ? 'Welcome to Proprint!'
                        : 'Verify Your Number'}
                    </h2>

                    <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {step === 'phone'
                        ? 'Enter your mobile number to continue.'
                        : `Enter the OTP sent to +91 ${phoneNumber}`}
                    </p>

                    {step === 'phone' && (
                      <p className="text-xs sm:text-sm text-slate-500">
                        No password required.
                      </p>
                    )}

                  </div>

                </div>

                {/* Card Body */}
                <div className="px-5 sm:px-8 lg:px-10 pb-5 sm:pb-7 lg:pb-9 mt-5 sm:mt-6">

                  {/* Error */}
                  {errorMessage && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* ======================================================
                      PHONE STEP
                  ====================================================== */}
                  {step === 'phone' ? (

                    <form
                      onSubmit={handleSendOtp}
                      className="space-y-4"
                    >

                      <div>

                        <label
                          htmlFor="login-phone-input"
                          className="block text-xs sm:text-sm font-bold text-slate-700 mb-2"
                        >
                          {isMarathi
                            ? 'मोबाईल नंबर टाका'
                            : 'Enter Mobile Number'}
                        </label>

                        <div className="flex h-12 sm:h-14 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:bg-white focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/10 transition-all">

                          <div className="w-[70px] sm:w-[82px] shrink-0 flex items-center justify-center border-r border-slate-200 text-xs sm:text-sm font-black text-slate-600">
                            +91
                          </div>

                          <input
                            type="tel"
                            id="login-phone-input"
                            maxLength={10}
                            autoFocus
                            required
                            value={phoneNumber}
                            onChange={(e) =>
                              setPhoneNumber(
                                e.target.value.replace(/\D/g, '')
                              )
                            }
                            placeholder="Enter 10-digit number"
                            className="flex-1 min-w-0 px-3 sm:px-4 bg-transparent text-sm sm:text-base font-bold text-slate-900 outline-none placeholder:text-slate-400 font-mono"
                          />

                        </div>

                        <div className="flex items-center gap-1.5 mt-2 text-[10px] sm:text-xs text-slate-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />

                          <span>
                            {isMarathi
                              ? 'आम्ही ४ अंकी OTP पाठवू.'
                              : "We'll send a 4-digit OTP to verify."}
                          </span>
                        </div>

                      </div>

                      <button
                        type="submit"
                        id="send-otp-btn"
                        disabled={
                          isLoading ||
                          phoneNumber.replace(/\D/g, '').length < 10
                        }
                        className="group w-full h-12 sm:h-14 bg-[#ff0038] hover:bg-[#e80034] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all active:scale-[0.99]"
                      >
                        <Smartphone className="w-4 h-4" />

                        <span>
                          {isLoading
                            ? 'Sending OTP...'
                            : isMarathi
                              ? 'ओटीपी पाठवा'
                              : 'Send OTP'}
                        </span>

                        {!isLoading && (
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        )}
                      </button>

                      {/* Benefits */}
                      <div className="pt-2">

                        <div className="grid grid-cols-3 gap-2 sm:gap-3">

                          <div className="text-center">
                            <div className="mx-auto w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                              <Lock className="w-3.5 h-3.5 text-[#ff0038]" />
                            </div>

                            <p className="text-[9px] sm:text-[10px] font-bold text-slate-600 mt-1.5">
                              Secure
                            </p>
                          </div>

                          <div className="text-center">
                            <div className="mx-auto w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                              <Package className="w-3.5 h-3.5 text-[#ff0038]" />
                            </div>

                            <p className="text-[9px] sm:text-[10px] font-bold text-slate-600 mt-1.5">
                              Track Orders
                            </p>
                          </div>

                          <div className="text-center">
                            <div className="mx-auto w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-[#ff0038]" />
                            </div>

                            <p className="text-[9px] sm:text-[10px] font-bold text-slate-600 mt-1.5">
                              Easy Login
                            </p>
                          </div>

                        </div>

                      </div>

                      {/* Privacy */}
                      <div className="rounded-2xl bg-rose-50/70 border border-rose-100 p-3 sm:p-3.5 flex items-center gap-3">

                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4.5 h-4.5 text-[#ff0038]" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-xs font-black text-slate-800">
                            Your privacy is our priority
                          </p>

                          <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">
                            Your mobile number is safe with us.
                          </p>
                        </div>

                      </div>

                    </form>

                  ) : (

                    /* ====================================================
                       OTP STEP
                    ==================================================== */

                    <form
                      onSubmit={handleVerifyOtp}
                      className="space-y-4"
                    >

                      {/* Demo OTP */}
                      <div className="rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100 p-3">

                        <div className="flex items-center justify-between gap-2">

                          <span className="text-[10px] sm:text-xs font-bold text-slate-600 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#ff0038]" />
                            Demo OTP
                          </span>

                          <button
                            type="button"
                            onClick={handleAutoFillOtp}
                            id="auto-fill-otp-btn"
                            className="px-2.5 py-1.5 bg-[#ff0038] hover:bg-[#e80034] text-white rounded-lg text-[9px] font-black uppercase tracking-wide"
                          >
                            Auto Fill
                          </button>

                        </div>

                        <div className="mt-2 flex items-center justify-between bg-white rounded-xl border border-rose-100 px-3 py-2">

                          <span className="font-mono text-lg font-black tracking-[5px] text-[#ff0038]">
                            {generatedOtp}
                          </span>

                          <button
                            type="button"
                            onClick={handleCopyOtp}
                            className="text-[10px] font-bold text-slate-500 flex items-center gap-1"
                          >
                            {copiedOtp ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}

                            {copiedOtp ? 'Copied' : 'Copy'}
                          </button>

                        </div>

                      </div>

                      {/* OTP Input */}
                      <div>

                        <div className="flex items-center justify-between mb-2">

                          <label className="text-xs sm:text-sm font-bold text-slate-700">
                            {isMarathi
                              ? '४ अंकी ओटीपी टाका'
                              : 'Enter 4-Digit OTP'}
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              setStep('phone');
                              setErrorMessage('');
                            }}
                            className="text-[10px] sm:text-xs font-bold text-[#ff0038] hover:underline"
                          >
                            Change number
                          </button>

                        </div>

                        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">

                          {otpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              ref={(el) => {
                                otpInputRefs.current[idx] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) =>
                                handleOtpDigitChange(
                                  idx,
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) =>
                                handleKeyDown(idx, e)
                              }
                              className="w-full h-12 sm:h-14 text-center text-xl sm:text-2xl font-black font-mono bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all text-slate-900"
                            />
                          ))}

                        </div>

                      </div>

                      {/* Timer */}
                      <div className="flex items-center justify-between">

                        <span className="text-[10px] sm:text-xs text-slate-400">
                          {timer > 0
                            ? `Resend in ${timer}s`
                            : 'Code expired'}
                        </span>

                        {canResend && (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            className="font-bold text-[#ff0038] text-[10px] sm:text-xs flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Resend OTP
                          </button>
                        )}

                      </div>

                      {/* Verify */}
                      <button
                        type="submit"
                        id="verify-otp-btn"
                        disabled={
                          isLoading ||
                          otpDigits.join('').length < 4
                        }
                        className="group w-full h-12 sm:h-14 bg-[#ff0038] hover:bg-[#e80034] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all active:scale-[0.99]"
                      >
                        <CheckCircle2 className="w-4 h-4" />

                        <span>
                          {isLoading
                            ? 'Verifying...'
                            : isMarathi
                              ? 'पडताळणी करा'
                              : 'Verify & Continue'}
                        </span>

                        {!isLoading && (
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        )}
                      </button>

                    </form>
                  )}

                </div>

                {/* Admin access - intentionally secondary */}
                {step === 'phone' && (
                  <div className="px-5 sm:px-8 lg:px-10 pb-4 sm:pb-5">

                    <div className="relative flex items-center justify-center mb-3">
                      <div className="absolute inset-x-0 border-t border-slate-100" />

                      <span className="relative bg-white px-3 text-[9px] font-bold uppercase tracking-wider text-slate-300">
                        Admin access
                      </span>
                    </div>

                    <button
                      type="button"
                      id="direct-admin-login-btn"
                      onClick={handleDirectAdminLogin}
                      disabled={isLoading}
                      className="w-full h-9 sm:h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      1-Click Admin Login
                    </button>

                  </div>
                )}

              </div>

              {/* Bottom Security Text */}
              <div className="shrink-0 flex items-center justify-center gap-1.5 mt-3 sm:mt-4 text-[9px] sm:text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Secure & Hassle Free</span>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};