import React from 'react';

interface ProductMockupGraphicProps {
  type: string;
  className?: string;
  badgeText?: string;
  interactive?: boolean;
}

export const ProductMockupGraphic: React.FC<ProductMockupGraphicProps> = ({
  type,
  className = 'w-full h-full',
}) => {
  switch (type) {
    case 'business-cards':
    case 'prod-standard-biz-card':
      return (
        <div className={`relative flex items-center justify-center p-3 overflow-hidden bg-slate-100 ${className}`}>
          {/* Background Card */}
          <div className="absolute w-44 h-28 bg-white rounded-md shadow-md transform -rotate-12 translate-x-3 -translate-y-2 border border-slate-200/80 p-3 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-[12px] tracking-tight text-slate-900">pro</span>
                <span className="font-extrabold text-[12px] tracking-tight text-rose-600">print</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-16 bg-slate-200 rounded"></div>
              <div className="h-1.5 w-24 bg-slate-100 rounded"></div>
            </div>
            <div className="flex items-center justify-between text-[7px] text-slate-400 border-t border-slate-100 pt-1">
              <span>9322126863</span>
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            </div>
          </div>

          {/* Foreground Card */}
          <div className="relative w-44 h-28 bg-neutral-900 rounded-md shadow-2xl transform rotate-6 translate-y-2 border border-neutral-800 p-3 flex flex-col justify-between text-white overflow-hidden transition-transform duration-300 group-hover:scale-105">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="flex items-center gap-0.5">
                  <span className="font-extrabold text-[13px] tracking-tight text-white">pro</span>
                  <span className="font-extrabold text-[13px] tracking-tight text-rose-500">print</span>
                </div>
                <p className="text-[6.5px] text-neutral-400 uppercase tracking-wider mt-0.5">Printing Solutions</p>
              </div>
            </div>

            <div className="space-y-1 relative z-10">
              <p className="text-[9px] font-semibold text-white tracking-wide">Ashish Kothale</p>
              <p className="text-[7px] text-rose-400 font-medium">Managing Director</p>
            </div>

            <div className="flex items-center justify-between text-[7px] text-neutral-400 border-t border-neutral-800/80 pt-1 relative z-10">
              <span className="truncate">askothale@gmail.com</span>
              <span className="text-[7px] text-neutral-500 font-mono">350 GSM</span>
            </div>
          </div>
        </div>
      );

    case 'flyers':
    case 'prod-glossy-flyers':
      return (
        <div className={`relative flex items-center justify-center p-3 overflow-hidden bg-slate-100 ${className}`}>
          <div className="relative w-36 h-48 bg-neutral-900 rounded-sm shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300 border border-neutral-800 p-2.5 flex flex-col justify-between text-white overflow-hidden">
            <div className="border-b border-neutral-800 pb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                <span className="font-extrabold text-[11px] text-white">pro</span>
                <span className="font-extrabold text-[11px] text-rose-500">print</span>
              </div>
              <span className="text-[6px] bg-rose-600 px-1 py-0.5 rounded font-bold uppercase">50% Off</span>
            </div>

            <div className="my-1.5 bg-neutral-800 p-2 rounded border border-neutral-700">
              <div className="text-[10px] font-extrabold text-white leading-tight">BIG SALE</div>
              <div className="text-[7px] text-rose-400 font-semibold">EXCLUSIVE PRINT SERVICES</div>
              <div className="mt-1 h-1 w-12 bg-rose-500 rounded"></div>
            </div>

            <div className="space-y-1 text-[6.5px] text-neutral-300">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-rose-500"></div>
                <span>Glossy Lamination 250 GSM</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-rose-500"></div>
                <span>Instant 24-Hour Dispatch</span>
              </div>
            </div>

            <div className="mt-1 pt-1 border-t border-neutral-800 flex justify-between items-center text-[6px] text-neutral-400">
              <span>9322126863</span>
              <span className="text-rose-400 font-bold">Starting ₹499</span>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={`relative flex items-center justify-center p-3 overflow-hidden bg-slate-100 ${className}`}>
          <div className="w-32 h-44 bg-neutral-900 rounded-r-md rounded-l-xs shadow-2xl border-l-4 border-l-rose-600 border-y border-r border-neutral-800 p-2.5 flex flex-col justify-between text-white transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-0.5">
                <span className="font-extrabold text-[11px] text-white">pro</span>
                <span className="font-extrabold text-[11px] text-rose-500">print</span>
              </div>
              <div className="w-1.5 h-6 bg-rose-600 rounded-b shadow-sm -mt-2.5"></div>
            </div>

            <div className="text-center my-auto">
              <div className="w-10 h-10 rounded-full border border-rose-500/40 flex items-center justify-center mx-auto mb-1">
                <span className="text-[14px]">🖋️</span>
              </div>
              <div className="text-[7.5px] font-bold text-neutral-300 uppercase tracking-widest">EXECUTIVE PRINT</div>
              <div className="text-[6px] text-rose-400">Embossed Custom Branding</div>
            </div>

            <div className="text-[6px] text-neutral-400 flex justify-between items-center border-t border-neutral-800 pt-1">
              <span>High Resolution</span>
              <span className="text-rose-500 font-bold">Proprint</span>
            </div>
          </div>
        </div>
      );
  }
};
