import React, { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Truck, 
  MessageSquare, 
  ArrowRight, 
  Phone, 
  Printer, 
  UserCheck, 
  Package, 
  Download, 
  FileText,
  Clock,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WhatsAppModal } from '../components/WhatsAppModal';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id') || 'PRO-88219';
  const { orders, isMarathi, showToast } = useApp();
  const navigate = useNavigate();
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  // Retrieve matching order from store
  const currentOrder = useMemo(() => {
    return (
      orders.find(
        (o) =>
          o.orderNumber.toLowerCase() === orderId.toLowerCase() ||
          o.id.toLowerCase() === orderId.toLowerCase()
      ) || orders[0]
    );
  }, [orders, orderId]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10 sm:py-14 text-center space-y-6 font-marathi">
      
      {/* Success Icon */}
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-95 duration-200">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
          {isMarathi ? 'ऑर्डर निश्चित झाली' : 'Order Placed & Sent to Press'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {isMarathi ? 'तुमची ऑर्डर यशस्वीरीत्या नोंदवली गेली आहे!' : 'Your Print Order Has Been Received!'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          {isMarathi 
            ? 'पेमेंट आणि डिझाईन प्रुफ कन्फर्मेशनसाठी आमचे एक्झिक्युटिव्ह लवकरच तुमच्याशी व्हॉट्सॲप / फोनद्वारे संपर्क साधतील.' 
            : 'Your order has been queued in our press schedule. Our print executive will review artwork and connect via WhatsApp shortly.'}
        </p>
      </div>

      {/* Next Steps Banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 text-left flex items-start gap-3.5 shadow-2xs">
        <div className="p-2 rounded-xl bg-amber-500 text-white flex-shrink-0 mt-0.5">
          <UserCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">
            {isMarathi ? 'पुढील स्टेप्स (Next Steps):' : 'Production & Payment Process:'}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {isMarathi 
              ? '१. आमचे प्रिंट एक्झिक्युटिव्ह तुमच्या ऑर्डर फाइल्स व साईज तपासून घेतील.\n२. तुमच्या व्हॉट्सॲपवर फायनल डिजिटल प्रुफ व पेमेंट UPI/QR पाठवले जाईल.\n३. प्रुफ मंजूर झाल्यानंतर प्रिंटिंग लगेच सुरू होईल.' 
              : '1. Our prepress team verifies DPI, bleed margins, and color profiles.\n2. We will share a final digital soft-proof and invoice on your WhatsApp.\n3. Offset & digital run commences immediately upon proof confirmation.'}
          </p>
        </div>
      </div>

      {/* Itemized Order Summary Box */}
      {currentOrder && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 text-left space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                {isMarathi ? 'ऑर्डर क्रमांक' : 'Order Reference'}
              </span>
              <p className="font-mono font-black text-slate-900 text-base">#{currentOrder.orderNumber}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                {currentOrder.status || 'Order Placed'}
              </span>
              <button
                type="button"
                onClick={() => {
                  showToast('Generating official tax invoice...', 'info');
                  window.print();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                title="Print Slip"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ordered Products Breakdown */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              {isMarathi ? 'ऑर्डरमधील उत्पादने' : 'Print Jobs In This Order:'}
            </h4>
            <div className="divide-y divide-slate-100">
              {(currentOrder.items || []).map((it, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <div className="min-w-0 pr-3">
                    <span className="font-bold text-slate-900 block truncate">
                      {it.product?.name || 'Custom Print Job'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Qty: {it.customization?.quantity || 500} {it.product?.unit || 'Units'} • {it.customization?.finishId || 'Matte 350 GSM'}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    ₹{it.customization?.calculatedPrice || it.subtotal || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Delivery Address */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate">
                {currentOrder.shippingAddress || currentOrder.customerAddress || 'Client Delivery Address'}
              </span>
            </div>

            <div className="text-right self-end sm:self-auto">
              <span className="text-[11px] text-slate-400 block">{isMarathi ? 'एकूण रक्कम' : 'Total Amount'}</span>
              <span className="font-black text-rose-600 text-lg">₹{currentOrder.total || currentOrder.totalAmount}</span>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-1.5 pt-2 text-xs text-slate-600 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{isMarathi ? 'उत्पादन: प्रोप्रिंट हायडलबर्ग ४-कलर ऑफसेट व डिजिटल प्रेस' : 'Production: Proprint In-House Offset & Digital Press Facility'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isMarathi ? 'अपेक्षित डिस्पॅच: २४ ते ४८ तासांत संपूर्ण महाराष्ट्रात' : 'Estimated Dispatch: 24 - 48 Hours Express Across India'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
        >
          <Package className="w-4 h-4" />
          <span>{isMarathi ? 'माझ्या सर्व ऑर्डर्स पहा' : 'View All My Orders'}</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsWhatsAppOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>{isMarathi ? 'व्हॉट्सॲपवर माहिती पहा' : 'WhatsApp Press Desk'}</span>
        </button>

        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all"
        >
          <span>{isMarathi ? 'मुख्यपृष्ठावर जा' : 'Continue Shopping'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* In-app WhatsApp Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        defaultMessage={`Hello Proprint! I have placed Order #${orderId}. Please review my job requirements and connect for digital proof.`}
      />

    </div>
  );
};
