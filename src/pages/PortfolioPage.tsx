import React from 'react';
import { GraphicDesignPortfolio } from '../components/GraphicDesignPortfolio';
import { DigitalVisitingCard } from '../components/DigitalVisitingCard';
import { useApp } from '../context/AppContext';

interface PortfolioPageProps {
  onOpenQuoteModal?: (serviceName?: string) => void;
  onOpenWhatsApp?: (message?: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onOpenQuoteModal,
  onOpenWhatsApp
}) => {
  const { isMarathi } = useApp();

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8 py-8 space-y-12 font-marathi">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isMarathi ? 'आमचे ग्राफिक डिझाईन व ब्रँडिंग कामे' : 'Commercial Graphic Design Portfolio'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {isMarathi 
            ? 'लोगो, पॅकेजिंग, सोशल मीडिया आणि आऊटडोअर होर्डिंग्सचे स्टुडिओ कामे खाली पहा.'
            : 'Original bespoke logo designs, pharmaceutical packaging, menu cards, and multi-fold catalogs.'}
        </p>
      </div>

      {/* Portfolio Grid */}
      <GraphicDesignPortfolio
        onOpenQuoteModal={onOpenQuoteModal}
        onOpenWhatsApp={onOpenWhatsApp}
      />

      {/* Interactive Identity Card */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-bold text-white">
            {isMarathi ? 'आमच्या डिझाईन स्टुडिओशी थेट संपर्क करा' : 'Consult Directly with Our Lead Creative'}
          </h3>
          <p className="text-xs text-slate-400">
            {isMarathi ? 'आशिष कोथाळे व प्रोप्रींट टीम आपल्या व्यवसायाला एक वेगळी ओळख मिळवून देईल.' : 'We provide full source vector files (AI, CDR, PDF) with complete brand guidelines.'}
          </p>
        </div>

        <div className="flex-shrink-0">
          <DigitalVisitingCard
            onOpenWhatsApp={() => onOpenWhatsApp && onOpenWhatsApp('Hello Proprint! I want to hire you for Graphic Design.')}
            onOpenQuote={() => onOpenQuoteModal && onOpenQuoteModal('Graphic Design')}
          />
        </div>
      </div>

    </div>
  );
};
