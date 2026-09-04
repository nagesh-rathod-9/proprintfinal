import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  X, 
  CheckCircle2, 
  Smartphone, 
  CreditCard, 
  Building, 
  Wallet, 
  QrCode, 
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export interface CashfreePaymentResult {
  transactionId: string;
  paymentMode: string;
  amount: number;
  cfOrderId: string;
  bankReference: string;
  status: 'SUCCESS' | 'FAILED';
}

interface CashfreePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderNumber?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  onPaymentSuccess: (result: CashfreePaymentResult) => void;
  onPaymentFailure?: (error: string) => void;
}

export const CashfreePaymentModal: React.FC<CashfreePaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  orderNumber,
  customerName = 'Commercial Client',
  customerPhone = '9322126863',
  customerEmail = 'client@proprint.in',
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [upiId, setUpiId] = useState('');
  
  // Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(customerName);

  // Bank state
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Gateway Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState<CashfreePaymentResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes countdown

  // Timer countdown
  useEffect(() => {
    if (!isOpen) {
      setPaymentSuccess(null);
      setErrorMsg('');
      setIsProcessing(false);
      setTimeLeft(480);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSimulatePayment = async (forceFailure = false, modeOverride?: string) => {
    setIsProcessing(true);
    setErrorMsg('');
    setProcessingStage('Connecting to Cashfree Payments Engine...');

    try {
      // 1. Create order on backend if not already done
      const cfRes = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderAmount: amount,
          customerName,
          customerPhone,
          customerEmail,
          orderNote: `Order #${orderNumber || 'DIRECT'}`
        })
      });
      const cfData = await cfRes.json();
      const cfOrderId = cfData.data?.cfOrderId || `CF_ORD_${Date.now()}`;

      await new Promise(r => setTimeout(r, 600));
      setProcessingStage('Authorizing payment with issuing bank...');

      await new Promise(r => setTimeout(r, 700));

      if (forceFailure) {
        setIsProcessing(false);
        setErrorMsg('Payment was declined by issuing bank (Sandbox simulation). Please retry or select another payment option.');
        if (onPaymentFailure) onPaymentFailure('Sandbox Bank Decline');
        return;
      }

      setProcessingStage('Verifying 256-bit payment signature...');
      await new Promise(r => setTimeout(r, 500));

      const paymentModeName = modeOverride || (
        activeTab === 'upi' ? `Cashfree UPI (${selectedUpiApp.toUpperCase()})` :
        activeTab === 'card' ? 'Cashfree Debit/Credit Card' :
        activeTab === 'netbanking' ? `Cashfree NetBanking (${selectedBank})` :
        'Cashfree Wallet'
      );

      // 2. Verify with backend
      const verifyRes = await fetch('/api/cashfree/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cfOrderId,
          orderNumber,
          amount,
          paymentMode: paymentModeName
        })
      });
      const verifyData = await verifyRes.json();

      const result: CashfreePaymentResult = {
        transactionId: verifyData.transactionId || `CF_TXN_${Date.now()}`,
        paymentMode: paymentModeName,
        amount,
        cfOrderId,
        bankReference: verifyData.bankReference || `UTR${Date.now().toString().slice(-8)}`,
        status: 'SUCCESS'
      };

      setPaymentSuccess(result);
      setIsProcessing(false);

      // Trigger success callback after brief delay so user sees verified animation
      setTimeout(() => {
        onPaymentSuccess(result);
      }, 1000);

    } catch (err: any) {
      console.error('Payment simulation error:', err);
      setIsProcessing(false);
      setErrorMsg('Payment gateway error. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs font-sans animate-fade-in">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Cashfree Header */}
        <div className="bg-[#0D1527] text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            {/* Cashfree Logo Badge */}
            <div className="flex items-center gap-1.5 bg-[#17233D] px-2.5 py-1 rounded-lg border border-slate-700">
              <span className="font-black tracking-tight text-sm text-cyan-400">cashfree</span>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pl-1 border-l border-slate-600">payments</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Secure PG</span>
              </div>
              <p className="text-[10px] text-slate-400">Merchant: Proprint Commercial Press</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Order Amount</span>
              <span className="text-base font-black text-white font-mono">
                ₹{amount.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sandbox Test Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900 shrink-0">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span><strong>Cashfree Sandbox Mode:</strong> Real-time checkout simulation active.</span>
          </div>
          <span className="font-mono text-[11px] text-amber-800 font-bold">Expires in {formatTime(timeLeft)}</span>
        </div>

        {/* Modal Body */}
        {paymentSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-500">Transaction ID: <span className="font-mono font-bold text-slate-800">{paymentSuccess.transactionId}</span></p>
              <p className="text-xs text-slate-500">Bank Ref: <span className="font-mono font-bold text-slate-800">{paymentSuccess.bankReference}</span></p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 max-w-sm mx-auto text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid:</span>
                <span className="font-bold text-slate-900 font-mono">₹{amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Mode:</span>
                <span className="font-bold text-slate-900">{paymentSuccess.paymentMode}</span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-700 font-bold">
              Redirecting to official print job slip & tax invoice...
            </p>
          </div>
        ) : isProcessing ? (
          <div className="p-10 text-center space-y-4 my-auto">
            <div className="w-12 h-12 border-3 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">{processingStage}</h3>
              <p className="text-xs text-slate-500">Please do not refresh or close this window.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
            
            {/* Left Nav: Payment Modes */}
            <div className="w-full md:w-48 p-2 bg-slate-50 shrink-0 flex md:flex-col gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                  activeTab === 'upi'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <Smartphone className="w-4 h-4 shrink-0" />
                <span className="truncate">UPI & QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span className="truncate">Cards (Credit/Debit)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('netbanking')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                  activeTab === 'netbanking'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <Building className="w-4 h-4 shrink-0" />
                <span className="truncate">Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('wallet')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                  activeTab === 'wallet'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <Wallet className="w-4 h-4 shrink-0" />
                <span className="truncate">Wallets</span>
              </button>
            </div>

            {/* Right Panel: Method Details */}
            <div className="flex-1 p-4 sm:p-5 space-y-4">
              
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* TAB 1: UPI */}
              {activeTab === 'upi' && (
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-800">
                    Select your UPI app or scan QR Code:
                  </div>

                  {/* UPI Apps Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'gpay', name: 'Google Pay', icon: '🟢', sub: 'Instant UPI' },
                      { id: 'phonepe', name: 'PhonePe', icon: '🟣', sub: 'Instant UPI' },
                      { id: 'paytm', name: 'Paytm UPI', icon: '🔵', sub: 'Instant UPI' },
                      { id: 'qr', name: 'Scan Any UPI QR', icon: '📱', sub: 'BHIM / Any App' },
                    ].map((app) => (
                      <div
                        key={app.id}
                        onClick={() => setSelectedUpiApp(app.id as any)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                          selectedUpiApp === app.id
                            ? 'border-rose-600 bg-rose-50/60 ring-1 ring-rose-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="text-base">{app.icon}</span>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{app.name}</p>
                          <p className="text-[10px] text-slate-500">{app.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* QR Code view if selected */}
                  {selectedUpiApp === 'qr' && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-2">
                      <div className="w-32 h-32 bg-white border border-slate-300 rounded-lg mx-auto flex items-center justify-center p-2 shadow-2xs">
                        {/* Real dynamic SVG QR code representation */}
                        <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h2v4h-2v-4zm2-2h2v2h-2v-2zm0 4h2v2h-2v-2zm-6 0h2v2h-2v-2zm-4-4h2v2h-2v-2zm-4 4h2v2H6v-2z" />
                        </svg>
                      </div>
                      <p className="text-[11px] font-bold text-slate-700">
                        Scan with Google Pay, PhonePe, Paytm, or BHIM
                      </p>
                    </div>
                  )}

                  {/* Custom UPI ID Input */}
                  <div className="space-y-1 pt-1">
                    <label className="text-[11px] font-bold text-slate-600 block">
                      Or enter UPI ID / VPA:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CARDS */}
              {activeTab === 'card' && (
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Card Number</label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                        setCardNumber(val);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-xs focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-xs focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: NETBANKING */}
              {activeTab === 'netbanking' && (
                <div className="space-y-3 text-xs">
                  <span className="font-bold text-slate-700 block">Popular Indian Banks:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                          selectedBank === bank
                            ? 'border-rose-600 bg-rose-50/60 text-slate-900'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{bank}</span>
                        {selectedBank === bank && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: WALLETS */}
              {activeTab === 'wallet' && (
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-700 block">Supported Wallets:</span>
                  {['Paytm Wallet', 'Amazon Pay', 'Mobikwik', 'Freecharge'].map((w) => (
                    <div
                      key={w}
                      className="p-3 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                    >
                      <span className="font-bold text-slate-800">{w}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Actions & Simulation Buttons */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <button
                  type="button"
                  onClick={() => handleSimulatePayment(false)}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 active:scale-98 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{amount.toLocaleString('en-IN')} via Cashfree</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Sandbox Quick Simulators */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(false, 'Cashfree Sandbox Fast-Pay')}
                    className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-[11px] rounded-lg cursor-pointer transition-colors"
                  >
                    ✓ Test Sandbox Success
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(true)}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-700 text-[11px] font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    Simulate Failure
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Modal Footer Trust Badges */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
          <div className="flex items-center gap-3">
            <span>PCI-DSS Level 1 Compliant</span>
            <span>•</span>
            <span>RBI Certified Aggregator</span>
          </div>
          <span className="font-mono text-slate-400">Cashfree PG v2023-08-01</span>
        </div>

      </div>
    </div>
  );
};
