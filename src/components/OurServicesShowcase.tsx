import React, { useState } from 'react';
import { 
  Palette, 
  Store, 
  Heart, 
  Radio, 
  Briefcase, 
  Sparkles, 
  Printer, 
  Layers, 
  Stamp, 
  FileCheck, 
  Tag, 
  Calendar, 
  Package, 
  Scissors, 
  Award, 
  Image as ImageIcon, 
  Maximize, 
  Shirt,
  MessageSquare,
  ArrowRight,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  CreditCard,
  Building2,
  Cpu,
  ShieldCheck,
  FolderKanban
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceItem } from '../types';
import { GraphicDesignPortfolio } from './GraphicDesignPortfolio';
import { useApp } from '../context/AppContext';

interface OurServicesShowcaseProps {
  onSelectService?: (service: ServiceItem) => void;
  onOpenQuoteModal?: (serviceName?: string) => void;
  onOpenWhatsApp?: (message?: string) => void;
}

export const OurServicesShowcase: React.FC<OurServicesShowcaseProps> = ({
  onSelectService,
  onOpenQuoteModal,
  onOpenWhatsApp
}) => {
  const { isMarathi, services = [], portfolio = [], showToast } = useApp();
  const navigate = useNavigate();
  // Exactly two tabs as requested: 'portfolio' (Design Works) and 'services' (Services)
  const [activeSectionView, setActiveSectionView] = useState<'portfolio' | 'services'>('portfolio');
  const [activeServiceCategory, setActiveServiceCategory] = useState<'all' | 'branding' | 'printing'>('all');

  const filteredServices = services.filter((s) => {
    if (activeServiceCategory === 'all') return true;
    return s.category === activeServiceCategory;
  });

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette': return <Palette className="w-5 h-5" />;
      case 'Store': return <Store className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Radio': return <Radio className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Printer': return <Printer className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Stamp': return <Stamp className="w-5 h-5" />;
      case 'FileCheck': return <FileCheck className="w-5 h-5" />;
      case 'Tag': return <Tag className="w-5 h-5" />;
      case 'Calendar': return <Calendar className="w-5 h-5" />;
      case 'Package': return <Package className="w-5 h-5" />;
      case 'Scissors': return <Scissors className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'Image': return <ImageIcon className="w-5 h-5" />;
      case 'Maximize': return <Maximize className="w-5 h-5" />;
      case 'Shirt': return <Shirt className="w-5 h-5" />;
      default: return <Printer className="w-5 h-5" />;
    }
  };

  const handleWhatsAppInquiry = (service: ServiceItem) => {
    const text = `Hello Proprint! I am interested in your "${service.name}" service (${service.tagline}). Please share pricing and production schedule.`;
    if (onOpenWhatsApp) {
      onOpenWhatsApp(text);
    } else {
      showToast(`Inquiry sent for ${service.name}! Our design desk will contact you.`, 'success');
    }
  };

  return (
    <section id="graphic-design-services" className="py-12 md:py-16 bg-white border-y border-slate-200/80 font-marathi">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8 space-y-12">
        
        {/* Section Master Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black uppercase tracking-wider border border-rose-200 shadow-2xs font-marathi">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>{isMarathi ? 'व्यावसायिक ग्राफिक डिझाईन, ब्रँडिंग व प्रिंटिंग सेवा' : 'Commercial Graphic Design, Branding & Printing Capabilities'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            {isMarathi ? 'आमचे सर्व ग्राफिक डिझाईन कामे व प्रिंटिंग सेवा' : 'Graphic Design Portfolio & Industrial Print Services'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-marathi">
            {isMarathi 
              ? 'लोगो, ब्रोशर, सोशल मीडिया पोस्ट्स आणि फूड पॅकेजिंगपासून ते हाय-स्पीड डिजिटल प्रिंटिंग, ऑफसेट प्रॉडक्शन आणि आऊटडोअर होर्डिंग्सपर्यंत सर्व सेवा आमच्या स्वतःच्या कारखान्यात तयार होतात.'
              : 'From bespoke brand logos, food packaging, and social media campaigns to high-speed commercial offset press runs and outdoor transit billboards.'}
          </p>
        </div>

        {/* Primary View Selector Bar - Exactly Two Tabs as Requested */}
        <div className="flex items-center justify-center p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveSectionView('portfolio')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer font-marathi flex items-center justify-center gap-2 ${
              activeSectionView === 'portfolio'
                ? 'bg-white text-rose-600 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4 text-rose-600" />
            <span>{isMarathi ? `डिझाईन कामे (${portfolio.length})` : `Design Works (${portfolio.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSectionView('services')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer font-marathi flex items-center justify-center gap-2 ${
              activeSectionView === 'services'
                ? 'bg-white text-rose-600 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-4 h-4 text-rose-600" />
            <span>{isMarathi ? `प्रिंट व मीडिया सेवा (${services.length})` : `Services (${services.length})`}</span>
          </button>
        </div>

        {/* TAB 1: Graphic Design Works (Reflects added/uploaded designs from admin) */}
        {activeSectionView === 'portfolio' && (
          <div className="pb-4">
            <GraphicDesignPortfolio
              onOpenWhatsApp={onOpenWhatsApp}
              onOpenQuoteModal={onOpenQuoteModal}
            />
          </div>
        )}

        {/* TAB 2: Detailed Printing & Branding Services Catalog */}
        {activeSectionView === 'services' && (
          <div className="space-y-6">
            {/* Sub-Header & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-marathi">
                  {isMarathi ? `सर्व ${services.length} इन-हाऊस प्रिंटिंग व मीडिया सेवा` : `Complete In-House Print & Media Catalog (${services.length})`}
                </h3>
                <p className="text-xs text-slate-500 font-marathi mt-0.5">
                  {isMarathi ? 'थेट आमच्या कारखान्यातून उत्पादित होणाऱ्या सेवांची संपूर्ण यादी.' : 'Categorized by brand design, packaging, and commercial offset runs.'}
                </p>
              </div>

              {/* Service Sub-Filters */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveServiceCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-marathi ${
                    activeServiceCategory === 'all'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isMarathi ? `सर्व (${services.length})` : `All (${services.length})`}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveServiceCategory('branding')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-marathi ${
                    activeServiceCategory === 'branding'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isMarathi ? 'ब्रँडिंग व डिझाईन' : 'Branding & Design'}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveServiceCategory('printing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-marathi ${
                    activeServiceCategory === 'printing'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isMarathi ? 'प्रिंट व पॅकेजिंग' : 'Print & Packaging'}
                </button>
              </div>
            </div>

            {/* Services Grid (Clean, high-contrast, modern card structure) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredServices.map((service) => {
                const isVisitingCardService = service.id === 'srv-visiting-cards' || service.name.toLowerCase().includes('visiting card');

                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-rose-400 hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      {/* Header with Icon & Category Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                          {getServiceIcon(service.iconName)}
                        </div>

                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-marathi ${
                          service.category === 'branding'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {service.category === 'branding' ? (isMarathi ? 'डिझाईन व मीडिया' : 'Design & Media') : (isMarathi ? 'प्रिंट व पॅक' : 'Print & Pack')}
                        </span>
                      </div>

                      {/* Service Name & Tagline */}
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors font-marathi">
                          {service.name}
                        </h4>
                        <p className="text-xs font-semibold text-rose-600 mt-0.5 font-marathi">
                          {service.tagline}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed font-marathi">
                        {service.description}
                      </p>
                    </div>

                    {/* Bottom Specs & Action Buttons */}
                    <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium font-marathi">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{service.turnaround}</span>
                        </span>
                        <span className="text-slate-400 font-semibold">{isMarathi ? `किमान: ${service.minOrder}` : `Min: ${service.minOrder}`}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        {isVisitingCardService ? (
                          <>
                            <button
                              onClick={() => navigate('/design-studio')}
                              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer font-marathi"
                            >
                              <CreditCard className="w-3.5 h-3.5 text-rose-600" />
                              <span>{isMarathi ? 'कस्टमायझ' : 'Customize'}</span>
                            </button>

                            <button
                              onClick={() => handleWhatsAppInquiry(service)}
                              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-slate-950 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs font-marathi"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-current" />
                              <span>WhatsApp</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleWhatsAppInquiry(service)}
                              className="w-full bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer font-marathi"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-current" />
                              <span>WhatsApp</span>
                            </button>

                            <button
                              onClick={() => onOpenQuoteModal && onOpenQuoteModal(service.name)}
                              className="w-full bg-slate-900 hover:bg-rose-600 text-white py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer font-marathi"
                            >
                              <span>{isMarathi ? 'कोटेशन घ्या' : 'Get Quote'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
