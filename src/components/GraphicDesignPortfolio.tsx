import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Eye, 
  MessageSquare, 
  CheckCircle2, 
  X, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { PortfolioItem } from '../types';
import { useApp } from '../context/AppContext';

interface GraphicDesignPortfolioProps {
  onOpenWhatsApp?: (message?: string) => void;
  onOpenQuoteModal?: (serviceName?: string) => void;
}

export const GraphicDesignPortfolio: React.FC<GraphicDesignPortfolioProps> = ({
  onOpenWhatsApp,
  onOpenQuoteModal
}) => {
  const { isMarathi, showToast, portfolio = [] } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  const works = portfolio;

  const categories = [
    { id: 'all', label: 'All Works', labelMr: 'सर्व कामे' },
    { id: 'logo', label: 'Logos', labelMr: 'लोगो' },
    { id: 'packaging', label: 'Packaging', labelMr: 'पॅकेजिंग' },
    { id: 'social', label: 'Social Media', labelMr: 'सोशल मीडिया' },
    { id: 'outdoor', label: 'Hoardings', labelMr: 'होर्डिंग्स' },
    { id: 'brochure', label: 'Brochures', labelMr: 'ब्रोशर्स' },
    { id: 'stationery', label: 'Luxury Cards', labelMr: 'व्हिजिटिंग कार्ड्स' },
  ];

  const filteredWorks = works.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleOrderSimilarOnWhatsApp = (item: PortfolioItem) => {
    const text = `Hello Proprint! I liked your design work "${item.title}" (${item.categoryLabel}). I want similar design for my business. Please share process and rates.`;
    if (onOpenWhatsApp) {
      onOpenWhatsApp(text);
    } else {
      showToast(`Inquiry sent for "${item.title}" design! Our team will connect with you.`, 'success');
    }
  };

  return (
    <div className="space-y-6 pt-2 font-marathi">
      {/* Minimalist Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight font-marathi">
            {isMarathi ? 'निवडक ग्राफिक डिझाईन कामे' : 'Featured Graphic Design Works'}
          </h3>
          <p className="text-xs text-slate-500 font-marathi mt-0.5">
            {isMarathi 
              ? 'आमच्या स्टुडिओमध्ये तयार केलेले लोगो, पॅकेजिंग व ब्रँडिंग डिझाईन्स.'
              : 'Original logo identities, packaging, and commercial artwork crafted in our studio.'}
          </p>
        </div>

        {/* Compact WhatsApp Button */}
        <button
          onClick={() => {
            const msg = "Hello Proprint! I need custom Graphic Design services for my brand.";
            if (onOpenWhatsApp) onOpenWhatsApp(msg);
            else showToast('Inquiry sent to Graphic Design Desk! We will reach out shortly.', 'success');
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap self-start sm:self-auto font-marathi"
        >
          <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
          <span>{isMarathi ? 'डिझाईनसाठी संपर्क' : 'Hire Designer'}</span>
        </button>
      </div>

      {/* Minimalist Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer font-marathi ${
              selectedCategory === cat.id
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {isMarathi ? cat.labelMr : cat.label}
          </button>
        ))}
      </div>

      {/* Minimalist Portfolio Grid (2 cols on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredWorks.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md hover:border-rose-300 transition-all duration-200 flex flex-col justify-between cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              
              {/* Subtle Category Pill on Image */}
              <div className="absolute top-2 left-2">
                <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md font-marathi">
                  {isMarathi ? item.categoryLabelMr : item.categoryLabel}
                </span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1 font-marathi">
                  {isMarathi ? item.titleMr : item.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-marathi line-clamp-1 mt-0.5">
                  {isMarathi ? item.cityMr : item.city} • {item.client}
                </p>
              </div>

              {/* Action link */}
              <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-rose-600 font-marathi">
                <span>{isMarathi ? 'तपशील पहा' : 'View Work'}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Minimalist Detail Modal */}
      {activeItem && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setActiveItem(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-auto text-slate-900 font-marathi"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-marathi">
                  {isMarathi ? activeItem.categoryLabelMr : activeItem.categoryLabel}
                </span>
                <span className="text-xs text-slate-600 font-semibold">
                  {activeItem.client} ({isMarathi ? activeItem.cityMr : activeItem.city})
                </span>
              </div>

              <button
                onClick={() => setActiveItem(null)}
                className="w-7 h-7 rounded-full bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Image */}
              <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[300px] object-cover"
                />
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-marathi">
                  {isMarathi ? activeItem.titleMr : activeItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-marathi">
                  {isMarathi ? activeItem.descriptionMr : activeItem.description}
                </p>
              </div>

              {/* Deliverables List */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-marathi">
                  {isMarathi ? 'समाविष्ट फाइल्स व फॉरमॅट्स:' : 'Included Deliverables:'}
                </h4>
                <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-700 font-marathi">
                  {((isMarathi && activeItem.deliverablesMr ? activeItem.deliverablesMr : activeItem.deliverables) || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="text-[11px] font-semibold truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
              <div className="text-[11px] text-slate-500 flex items-center gap-1 font-marathi hidden sm:flex">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isMarathi ? '१००% मूळ व्हेक्टर डिझाईन' : '100% Original Vector Artwork'}</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleOrderSimilarOnWhatsApp(activeItem)}
                  className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#20ba59] text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer font-marathi"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>{isMarathi ? 'व्हॉट्सॲपवर डिझाईन विचारा' : 'Order on WhatsApp'}</span>
                </button>

                {onOpenQuoteModal && (
                  <button
                    onClick={() => {
                      setActiveItem(null);
                      onOpenQuoteModal(`Graphic Design - ${activeItem.categoryLabel}`);
                    }}
                    className="bg-slate-900 hover:bg-rose-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer font-marathi"
                  >
                    <span>{isMarathi ? 'कोटेशन' : 'Get Quote'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
