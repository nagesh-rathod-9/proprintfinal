import React from 'react';
import { CreditCard, ArrowRight, UploadCloud, Sparkles, Sliders, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CustomDesignBannerProps {
  onOpenDesignStudio: () => void;
  onOpenQuoteModal: () => void;
}

export const CustomDesignBanner: React.FC<CustomDesignBannerProps> = ({
  onOpenDesignStudio,
  onOpenQuoteModal,
}) => {
  const { isMarathi } = useApp();

  return (
    <section className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8 py-6 sm:py-8 font-marathi">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50/40 text-slate-900 shadow-sm border border-rose-200/80">
        
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
          
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 flex items-start gap-4 sm:gap-6">
            
            {/* Glowing Icon Circle */}
            <div className="hidden sm:flex w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-600 text-white items-center justify-center flex-shrink-0 shadow-lg shadow-rose-600/20">
              <CreditCard className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-300/80 text-rose-700 text-xs font-extrabold font-marathi">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isMarathi ? 'अस्सल व्हिजिटिंग कार्ड स्टुडिओ' : 'Dedicated Business Card Studio'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-slate-900 tracking-tight leading-tight">
                {isMarathi ? (
                  <>
                    आपले व्हिजिटिंग कार्ड{' '}
                    <span className="text-rose-600">३D मध्ये कस्टमायझ करा</span>
                  </>
                ) : (
                  <>
                    Customize Your Visiting Card{' '}
                    <span className="text-rose-600">Live in 3D</span>
                  </>
                )}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed font-marathi">
                {isMarathi
                  ? 'रॉयल मॅट, वेल्वेट सॉफ्ट-टच, मेटॅलिक गोल्ड फॉइल, स्पॉट UV किंवा पारदर्शक PVC कार्ड्स - आपले नाव, पदनाम, लोगो आणि QR कोड भरून थेट ३D मध्ये पहा व त्वरित ऑर्डर करा.'
                  : 'Configure Royal Matte, Velvet Touch, Metallic Gold Foil, Spot UV Gloss, or Translucent PVC cards with real-time typography, QR code sync, and instant proofing.'}
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-1 font-marathi">
                {[
                  isMarathi ? '८ लक्झरी फिनिशेस' : '8 Luxe Finishes',
                  isMarathi ? 'थेट ३D प्रिव्ह्यू' : 'Real-Time 3D Proof',
                  isMarathi ? 'मोफत QR कोड' : 'Instant QR Code',
                  isMarathi ? '२४ तासांत डिस्पॅच' : '24h Fast Dispatch'
                ].map((pill, idx) => (
                  <span key={idx} className="text-[11px] font-bold bg-white text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-2xs font-marathi">
                    <Check className="w-3 h-3 text-rose-600 stroke-[3]" />
                    {pill}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2 w-full sm:w-auto">
                <button
                  id="start-customizing-btn"
                  onClick={onOpenDesignStudio}
                  className="group inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-extrabold py-3 px-5 sm:px-6 rounded-xl shadow-lg shadow-rose-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap font-marathi"
                >
                  <Sliders className="w-4 h-4 flex-shrink-0" />
                  <span>{isMarathi ? 'कार्ड कस्टमायझ करा' : 'Customize Visiting Card'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={onOpenQuoteModal}
                  className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-bold py-3 px-4 sm:px-5 rounded-xl border border-slate-300 transition-all cursor-pointer whitespace-nowrap shadow-2xs font-marathi"
                >
                  <UploadCloud className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{isMarathi ? 'तयार फाईल अपलोड करा' : 'Upload Ready Artwork'}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Visual Visiting Card Mockup Presentation */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div 
              onClick={onOpenDesignStudio}
              className="relative w-full max-w-sm h-52 sm:h-56 bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between overflow-hidden group cursor-pointer hover:border-rose-500 transition-all duration-300 hover:shadow-2xl"
            >
              {/* Gold foil header tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-md bg-rose-600 flex items-center justify-center text-white font-black text-xs">
                    P
                  </div>
                  <span className="font-extrabold text-xs tracking-wider">PROPRINT</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {isMarathi ? 'गोल्ड फॉइल फिनिश' : 'Gold Foil Proof'}
                </span>
              </div>

              {/* Center simulated card */}
              <div className="space-y-1 my-auto">
                <h3 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200">
                  Ashish Kothale
                </h3>
                <p className="text-[11px] text-rose-400 font-semibold">
                  Commercial Printing Specialist
                </p>
                <p className="text-[10px] text-slate-300 font-mono">
                  +91 9322126863 • Sambhajinagar
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                <span>{isMarathi ? '३५० GSM रॉयल मॅट' : '350 GSM European Board'}</span>
                <span className="text-rose-400 font-bold group-hover:underline flex items-center gap-1">
                  {isMarathi ? 'स्टुडिओ उघडा →' : 'Open 3D Studio →'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
