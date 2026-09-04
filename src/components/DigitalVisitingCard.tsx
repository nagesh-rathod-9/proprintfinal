import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  RotateCw, 
  MessageSquare, 
  Sparkles,
  Mail,
  Building
} from 'lucide-react';
import { ProprintLogo } from './ProprintLogo';
import { WhatsAppModal } from './WhatsAppModal';

interface DigitalVisitingCardProps {
  onOpenWhatsApp?: () => void;
  onOpenQuote?: () => void;
  className?: string;
}

export const DigitalVisitingCard: React.FC<DigitalVisitingCardProps> = ({
  onOpenWhatsApp,
  className = ''
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [localWhatsAppOpen, setLocalWhatsAppOpen] = useState(false);

  return (
    <div className={`w-full max-w-[520px] flex flex-col items-center select-none ${className}`}>
      {/* 3D Flip Card Container with robust perspective & rounded card physics */}
      <div 
        className="w-full h-[290px] sm:h-[310px] perspective-1000 cursor-pointer group relative"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className="relative w-full h-full transform-style-3d transition-transform duration-700 ease-in-out shadow-2xl rounded-2xl"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* ================= CARD FRONT (OFFICIAL BLACK LUXURY FINISH) ================= */}
          <div 
            className="absolute inset-0 w-full h-full bg-[#0e1015] text-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between backface-hidden border border-neutral-700/90 shadow-2xl overflow-hidden"
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}
          >
            {/* Ambient Background Accents */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top row: Badge & Flip Hint */}
            <div className="flex items-center justify-between relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-700 text-[11px] font-semibold text-rose-400">
                <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Commercial Printing Press</span>
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-200 hover:text-white bg-rose-950/80 hover:bg-rose-900 px-3 py-1 rounded-full border border-rose-500/50 shadow-sm transition-all"
                title="Click to flip card"
              >
                <RotateCw className="w-3.5 h-3.5 text-rose-400" />
                <span>Flip Services</span>
              </button>
            </div>

            {/* Middle: Brand Logo */}
            <div className="my-auto py-2 relative z-10 flex flex-col items-center sm:items-start">
              <ProprintLogo size="lg" variant="light" showTagline={true} />
            </div>

            {/* Bottom: Contact Bar */}
            <div className="pt-3 border-t border-neutral-800 flex items-end justify-between relative z-10 text-xs">
              <div className="space-y-1 text-neutral-300">
                <div className="flex items-center gap-2 font-mono font-bold text-white text-xs sm:text-sm">
                  <Phone className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  <span>+91 93221 26863</span>
                  <span className="text-neutral-500">/</span>
                  <span>9623458919</span>
                </div>
                <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  <span className="truncate">Sushila Arcade, Motikaranja, Chh. Sambhajinagar</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">Est. 2010</span>
                <span className="text-[11px] text-neutral-400 font-mono">askothale@gmail.com</span>
              </div>
            </div>
          </div>

          {/* ================= CARD BACK (MATCHING OFFICIAL VISITING CARD) ================= */}
          <div 
            className="absolute inset-0 w-full h-full bg-[#fafafa] text-slate-900 rounded-2xl p-4 sm:p-5 flex flex-col justify-between backface-hidden border border-slate-300 shadow-2xl overflow-hidden"
            style={{ 
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden' 
            }}
          >
            {/* Top Red Pill: "Our Services" */}
            <div className="flex items-center justify-between relative pb-1">
              <div className="mx-auto bg-[#e11d48] text-white px-6 py-0.5 rounded-full text-xs font-black tracking-wider shadow-xs uppercase">
                Our Services
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="absolute right-0 top-0 text-[11px] text-slate-700 hover:text-slate-950 font-bold flex items-center gap-1 bg-slate-200/80 hover:bg-slate-300 px-2.5 py-0.5 rounded-full border border-slate-300 transition-colors"
              >
                <RotateCw className="w-3 h-3 text-rose-600" />
                <span>Front</span>
              </button>
            </div>

            {/* Top Group: Design & Media (6 services in 2 columns) */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10.5px] sm:text-[11px] font-bold text-slate-800 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">graphic design</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">media-radio-hoarding</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">onsite branding</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">corporate events</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">wedding branding</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">brand activations</span>
              </div>
            </div>

            {/* Red Dividing Line */}
            <div className="border-t border-[#e11d48] my-1" />

            {/* Bottom Grid: Printing Services (12 services in 3 columns for balanced fit) */}
            <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9.5px] sm:text-[10px] font-semibold text-slate-800 px-1">
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">digital printing</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">labels/stickers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">gold/silver foil</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">offset printing</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">calendar/poster</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">vinyl printing</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">screen printing</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">box packaging</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">flex printing</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">office stationery</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">die cut stickers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#e11d48] flex-shrink-0" />
                <span className="truncate">fabric printing</span>
              </div>
            </div>

            {/* Red Bottom Pill: Office Contact & Address */}
            <div className="mt-1 bg-[#e11d48] text-white py-1.5 px-3 rounded-xl text-center space-y-0.5 shadow-sm">
              <div className="font-black text-[9.5px] sm:text-[10px] flex items-center justify-center gap-2">
                <span>office 📱 +91 9322126863</span>
                <span>/</span>
                <span>9623458919</span>
              </div>
              <div className="text-[8.5px] sm:text-[9px] text-rose-100 font-mono truncate">
                ✉ askothale@gmail.com | proprintask@gmail.com
              </div>
              <div className="text-[8px] sm:text-[8.5px] text-rose-200 leading-tight truncate">
                Shop No. 1, Sushila Arcade, Motikaranja, Chh. Sambhajinagar - 431001
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exactly TWO primary action buttons beneath card */}
      <div className="grid grid-cols-2 gap-3 w-full mt-4">
        <button
          onClick={() => {
            if (onOpenWhatsApp) {
              onOpenWhatsApp();
            } else {
              setLocalWhatsAppOpen(true);
            }
          }}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>Quick Inquiry Pop-up</span>
        </button>

        <a
          href="tel:9322126863"
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer"
        >
          <Phone className="w-4 h-4" />
          <span>Call 9322126863</span>
        </a>
      </div>

      {/* In-App WhatsApp Modal */}
      <WhatsAppModal
        isOpen={localWhatsAppOpen}
        onClose={() => setLocalWhatsAppOpen(false)}
        defaultMessage="Hello Proprint! I am viewing your digital card and would like to inquire about printing services."
      />
    </div>
  );
};
