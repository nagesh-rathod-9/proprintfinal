import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  Phone, 
  MessageSquare,
  FileCheck,
  Printer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderItem } from '../types';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose
}) => {
  const { orders, isMarathi } = useApp();
  const [searchCode, setSearchCode] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<OrderItem | null>(orders[0] || null);
  const [notFound, setNotFound] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    const clean = searchCode.trim().toLowerCase().replace('#', '');
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase().includes(clean) ||
        o.id.toLowerCase().includes(clean) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(clean))
    );

    if (found) {
      setSearchedOrder(found);
      setNotFound(false);
    } else {
      setSearchedOrder(null);
      setNotFound(true);
    }
  };

  const steps = [
    { title: 'Order Placed & Artwork Verified', titleMr: 'ऑर्डर नोंदवली व आर्टवर्क तपासले', desc: 'Pre-press team checked bleed & CMYK' },
    { title: 'In-House Offset / Digital Press', titleMr: 'कारखान्यात प्रिंटिंग सुरू', desc: 'CPlate imaging & 4-color run' },
    { title: 'Post-Press Lamination & Die-Cut', titleMr: 'लेमिनेशन व कटिंग', desc: 'Matte/Gloss coating & hydraulic trimming' },
    { title: 'Quality Check & Dispatched', titleMr: 'गुणवत्ता तपासणी व डिस्पॅच', desc: 'Courier / Local Express handed over' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-marathi"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-auto text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-600/30 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full">
              <Truck className="w-3 h-3" />
              <span>{isMarathi ? 'लाइव्ह ट्रॅकिंग' : 'Real-Time Dispatch Status'}</span>
            </div>
            <h2 className="text-base sm:text-xl font-extrabold text-white">
              {isMarathi ? 'तुमची प्रिंटिंग ऑर्डर ट्रॅक करा' : 'Track Your Print Job Status'}
            </h2>
            <p className="text-xs text-slate-400">
              {isMarathi ? 'ऑर्डर नंबर (उदा. PRO-88219) किंवा मोबाईल नंबर टाका.' : 'Enter your Order # or Docket tracking number.'}
            </p>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="e.g. PRO-88219 or 9322126863"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-rose-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              {isMarathi ? 'शोधा' : 'Track'}
            </button>
          </form>

          {notFound && (
            <p className="text-xs text-rose-600 font-bold mt-2">
              {isMarathi ? 'कोणतीही ऑर्डर आढळली नाही. कृपया योग्य ऑर्डर नंबर टाका.' : 'No order found with this tracking ID. Please verify.'}
            </p>
          )}
        </div>

        {/* Order Details Display */}
        {searchedOrder && (
          <div className="p-5 sm:p-6 space-y-5 text-xs">
            
            {/* Status Summary Pill */}
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">
                  {isMarathi ? 'सध्याची स्थिती' : 'Current Production Stage'}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {searchedOrder.status}
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                #{searchedOrder.orderNumber}
              </span>
            </div>

            {/* Timeline Progress */}
            <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {steps.map((st, idx) => {
                const isPassed = idx <= 2; // demo active state
                return (
                  <div key={idx} className="relative space-y-0.5">
                    <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] ${
                      isPassed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-slate-400'
                    }`}>
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <h4 className="font-bold text-slate-900">
                      {isMarathi ? st.titleMr : st.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">{st.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Order Items List */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                {isMarathi ? 'ऑर्डरमधील उत्पादने:' : 'Ordered Items:'}
              </h4>
              {(searchedOrder.items || []).map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-700">
                  <span>• {it.product?.name || 'Custom Print Job'} ({it.customization?.quantity || 100} {it.product?.unit || 'Units'})</span>
                  <span className="font-bold text-slate-900">₹{it.customization?.calculatedPrice || 0}</span>
                </div>
              ))}
            </div>

            {/* Support CTA */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Need urgent dispatch update?</span>
              <button
                type="button"
                onClick={() => {
                  alert(`Helpline for Order #${searchedOrder.orderNumber}: Call or WhatsApp +91 93221 26863 for instant dispatch confirmation.`);
                }}
                className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Helpline: +91 93221 26863</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
