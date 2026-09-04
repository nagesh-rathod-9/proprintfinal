import React from 'react';
import { ProprintLogo } from './ProprintLogo';

interface LiveProductMockupProps {
  category?: string;
  productName?: string;
  customImage?: string | null;
  finish?: string;
  scale?: number;
  position?: 'center' | 'top' | 'bottom' | 'cover';
  className?: string;
}

export const LiveProductMockup: React.FC<LiveProductMockupProps> = ({
  category = 'cards',
  productName = 'Visiting Cards',
  customImage = null,
  finish = 'matte',
  scale = 1,
  position = 'center',
  className = '',
}) => {
  const cat = (category || '').toLowerCase();
  const name = (productName || '').toLowerCase();

  const isMug = cat.includes('mug') || name.includes('mug') || name.includes('cup') || cat.includes('gift');
  const isBrochure = cat.includes('brochure') || name.includes('brochure') || name.includes('catalog') || cat.includes('pamphlet') || name.includes('pamphlet');
  const isBusinessCard = cat.includes('card') || name.includes('card') || name.includes('visiting');
  const isPackaging = cat.includes('box') || cat.includes('packaging') || name.includes('box') || name.includes('carton') || name.includes('corrugated');
  const isFlyer = cat.includes('flyer') || name.includes('flyer') || name.includes('poster') || name.includes('leaflet');
  const isSticker = cat.includes('sticker') || cat.includes('label') || name.includes('sticker') || name.includes('label') || name.includes('vinyl');
  const isBanner = cat.includes('banner') || cat.includes('flex') || cat.includes('standee') || name.includes('standee') || name.includes('canopy');
  const isApparel = cat.includes('tshirt') || cat.includes('apparel') || cat.includes('cloth') || name.includes('t-shirt') || name.includes('cap');

  // Surface texture / finish reflection overlay styling (without tacky gradients)
  const getFinishEffect = () => {
    switch (finish) {
      case 'gloss':
        return 'brightness-110 contrast-105';
      case 'gold-foil':
        return 'border border-amber-400 shadow-md shadow-amber-500/20';
      case 'spot-uv':
        return 'contrast-125 brightness-105';
      case 'velvet':
        return 'saturate-90 brightness-95';
      case 'holographic':
        return 'border border-cyan-400';
      default:
        return 'brightness-100';
    }
  };

  const getObjectPosition = () => {
    switch (position) {
      case 'top': return 'object-top';
      case 'bottom': return 'object-bottom';
      case 'cover': return 'object-cover';
      default: return 'object-contain';
    }
  };

  return (
    <div className={`relative flex items-center justify-center p-4 sm:p-6 select-none bg-slate-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl ${className}`}>
      
      {/* Gold Foil Shimmer Animation Effect */}
      {finish === 'gold-foil' && (
        <div className="absolute inset-0 bg-amber-300/10 pointer-events-none z-30" />
      )}

      {/* ========================================================
          1. COFFEE MUG MOCKUP (Curved cylindrical wrap + handle)
         ======================================================== */}
      {isMug && (
        <div className="relative flex items-center justify-center py-6">
          {/* Ceramic Mug Body */}
          <div className="relative w-56 sm:w-64 h-64 sm:h-72 bg-white rounded-b-3xl rounded-t-xl shadow-2xl border border-neutral-300 flex flex-col justify-center items-center overflow-hidden">
            
            {/* Top Rim Oval */}
            <div className="absolute top-0 w-full h-8 bg-neutral-200 rounded-[50%] border-t border-neutral-300 shadow-inner flex items-center justify-center">
              <div className="w-[85%] h-5 bg-neutral-800 rounded-[50%] opacity-20 shadow-inner" />
            </div>

            {/* User Custom Artwork Wrap on Mug Front */}
            <div className="relative w-40 sm:w-44 h-40 sm:h-44 flex items-center justify-center p-3 z-10">
              {customImage ? (
                <div 
                  className={`w-full h-full flex items-center justify-center overflow-hidden ${getFinishEffect()}`}
                  style={{ transform: `scale(${scale})` }}
                >
                  <img
                    src={customImage}
                    alt="Custom Mug Artwork"
                    className={`max-w-full max-h-full ${getObjectPosition()} rounded drop-shadow-md`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                /* Default Proprint Ceramic Design */
                <div 
                  className="text-center p-4 bg-slate-900/90 text-white rounded-2xl shadow-lg border border-slate-700 w-full"
                  style={{ transform: `scale(${scale})` }}
                >
                  <ProprintLogo size="sm" variant="light" showTagline={true} />
                  <p className="text-[9px] text-rose-400 font-bold mt-2 uppercase tracking-wider">Premium Ceramic Mug</p>
                  <p className="text-[7.5px] text-slate-300 mt-0.5">350ml Dishwasher & Microwave Safe</p>
                </div>
              )}
            </div>

            {/* Bottom Base Curved Shadow */}
            <div className="absolute bottom-0 w-full h-4 bg-black/10 pointer-events-none" />
          </div>

          {/* Right Ceramic Handle */}
          <div className="w-14 sm:w-16 h-40 sm:h-44 rounded-r-3xl border-8 sm:border-[10px] border-l-0 border-neutral-300 -ml-2 shadow-xl bg-transparent" />
        </div>
      )}

      {/* ========================================================
          2. TRI-FOLD BROCHURE / CATALOG MOCKUP (3 Panels with Folds)
         ======================================================== */}
      {isBrochure && (
        <div className="relative flex items-center justify-center py-4 scale-95 sm:scale-100">
          <div className="flex shadow-2xl rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900">
            
            {/* Panel 1 (Left Inside Fold) */}
            <div className="w-24 sm:w-32 h-52 sm:h-64 bg-neutral-800 border-r border-black/40 p-3 flex flex-col justify-between text-white relative">
              <div className="space-y-1 relative z-10">
                <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wider">About Us</span>
                <div className="h-1.5 w-14 bg-rose-500 rounded" />
                <div className="space-y-1 pt-2">
                  <div className="h-1 w-full bg-neutral-700 rounded" />
                  <div className="h-1 w-4/5 bg-neutral-700 rounded" />
                  <div className="h-1 w-3/4 bg-neutral-700 rounded" />
                </div>
              </div>
              <div className="text-[7px] text-neutral-400 border-t border-neutral-800 pt-1 relative z-10">
                <span>Commercial Printing</span>
              </div>
            </div>

            {/* Panel 2 (Center Panel with User's Uploaded Custom Design) */}
            <div className="w-28 sm:w-40 h-52 sm:h-64 bg-neutral-950 p-3 flex flex-col justify-between items-center text-white relative shadow-inner">
              <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
                {customImage ? (
                  <div 
                    className={`w-full h-full flex items-center justify-center ${getFinishEffect()}`}
                    style={{ transform: `scale(${scale})` }}
                  >
                    <img
                      src={customImage}
                      alt="Brochure Center Artwork"
                      className={`max-w-full max-h-full ${getObjectPosition()} rounded`}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div 
                    className="text-center p-2"
                    style={{ transform: `scale(${scale})` }}
                  >
                    <ProprintLogo size="sm" variant="light" showTagline={true} />
                    <div className="mt-3 p-2 rounded-lg bg-rose-950/50 border border-rose-800/40 text-center">
                      <p className="text-[9px] font-bold text-white">Tri-Fold Brochure</p>
                      <p className="text-[7px] text-rose-300">300 GSM Matte Art</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-[6.5px] text-neutral-500 font-mono">Panel 2 • Proprint</div>
            </div>

            {/* Panel 3 (Right Outside Cover) */}
            <div className="w-24 sm:w-32 h-52 sm:h-64 bg-neutral-800 border-l border-black/40 p-3 flex flex-col justify-between text-white relative">
              <div className="space-y-2 relative z-10">
                <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wider">Contact</span>
                <div className="text-[7px] text-neutral-300 space-y-0.5">
                  <p>📞 9322126863</p>
                  <p>✉ askothale@gmail.com</p>
                  <p>📍 Motikaranja, Chh. Sambhajinagar</p>
                </div>
              </div>
              <div className="text-right text-[7px] text-rose-400 font-bold relative z-10">
                <span>Free Proofing</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          3. BUSINESS CARD 3D STACK MOCKUP
         ======================================================== */}
      {isBusinessCard && (
        <div className="relative flex items-center justify-center py-6">
          {/* Background tilted card */}
          <div className="absolute w-56 sm:w-64 h-32 sm:h-36 bg-neutral-800 rounded-xl shadow-xl transform -rotate-12 translate-x-4 -translate-y-2 border border-neutral-700 p-4 opacity-70 flex flex-col justify-between text-neutral-400">
            <span className="text-[8px] uppercase tracking-widest text-neutral-500">Back Side</span>
            <div className="text-[7.5px] text-neutral-400">askothale@gmail.com • 9322126863</div>
          </div>

          {/* Foreground Main Card with Live Upload Preview */}
          <div className="relative w-56 sm:w-64 h-32 sm:h-36 bg-black rounded-xl shadow-2xl transform rotate-3 border border-neutral-800 p-4 flex flex-col justify-between text-white overflow-hidden transition-all duration-300">
            
            <div className="flex-1 flex items-center justify-center relative z-10 overflow-hidden">
              {customImage ? (
                <div 
                  className={`w-full h-full flex items-center justify-center ${getFinishEffect()}`}
                  style={{ transform: `scale(${scale})` }}
                >
                  <img
                    src={customImage}
                    alt="Business Card Live Mockup"
                    className={`max-w-full max-h-full ${getObjectPosition()} rounded shadow`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div 
                  className="w-full flex flex-col justify-between h-full"
                  style={{ transform: `scale(${scale})` }}
                >
                  <div className="flex items-center justify-between">
                    <ProprintLogo size="sm" variant="light" showTagline={false} />
                    <span className="text-[8px] bg-rose-600/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded font-bold">
                      350 GSM
                    </span>
                  </div>

                  <div className="space-y-0.5 my-auto">
                    <p className="text-xs font-bold text-white tracking-wide">Ashish Kothale</p>
                    <p className="text-[8px] text-rose-400 font-semibold">Managing Director</p>
                  </div>

                  <div className="flex items-center justify-between text-[7px] text-neutral-400 border-t border-neutral-800 pt-1">
                    <span>9322126863</span>
                    <span>Chh. Sambhajinagar</span>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-1 right-2 text-[6.5px] text-neutral-500 font-mono">
              Proprint 350 GSM
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. BOX PACKAGING 3D CARTON MOCKUP
         ======================================================== */}
      {isPackaging && (
        <div className="relative flex items-center justify-center py-6">
          <div className="relative w-48 sm:w-56 h-48 sm:h-56 bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-700 p-4 flex flex-col justify-between text-white overflow-hidden transform rotate-2">
            
            {/* Top box fold rim */}
            <div className="border-b border-neutral-700 pb-2 flex items-center justify-between">
              <span className="text-[8px] font-bold uppercase tracking-wider text-rose-400">Custom Rigid Box</span>
              <span className="text-[7px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">Mono-Carton</span>
            </div>

            {/* Center Artwork Placement */}
            <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
              {customImage ? (
                <div 
                  className={`w-full h-full flex items-center justify-center ${getFinishEffect()}`}
                  style={{ transform: `scale(${scale})` }}
                >
                  <img
                    src={customImage}
                    alt="Packaging Box Design"
                    className={`max-w-full max-h-full ${getObjectPosition()} rounded drop-shadow-md`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div 
                  className="text-center p-3 border border-dashed border-rose-500/40 rounded-xl bg-neutral-900/80"
                  style={{ transform: `scale(${scale})` }}
                >
                  <ProprintLogo size="sm" variant="light" showTagline={true} />
                  <p className="text-[8px] text-slate-300 mt-2 font-medium">Custom Product Packaging & Sleeves</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[7px] text-neutral-400 border-t border-neutral-800 pt-1.5">
              <span>Die-Cut Locking Tabs</span>
              <span className="text-rose-400 font-bold">Proprint Packaging</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. FLYERS / POSTER MOCKUP
         ======================================================== */}
      {isFlyer && (
        <div className="relative flex items-center justify-center py-4">
          <div className="relative w-44 sm:w-52 h-60 sm:h-72 bg-neutral-950 rounded-lg shadow-2xl border border-neutral-800 p-3.5 flex flex-col justify-between text-white overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform">
            
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              {customImage ? (
                <div 
                  className={`w-full h-full flex items-center justify-center ${getFinishEffect()}`}
                  style={{ transform: `scale(${scale})` }}
                >
                  <img
                    src={customImage}
                    alt="Flyer Artwork Preview"
                    className={`max-w-full max-h-full ${getObjectPosition()} rounded`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div 
                  className="w-full h-full flex flex-col justify-between p-2"
                  style={{ transform: `scale(${scale})` }}
                >
                  <div className="border-b border-neutral-800 pb-1.5 flex justify-between items-center">
                    <ProprintLogo size="sm" variant="light" showTagline={false} />
                    <span className="text-[7px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold">250 GSM</span>
                  </div>

                  <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-center my-auto">
                    <p className="text-xs font-black text-white">PROMOTIONAL FLYER</p>
                    <p className="text-[8px] text-rose-300 mt-0.5">High-Gloss UV Double Sided</p>
                  </div>

                  <div className="text-[7px] text-neutral-400 flex justify-between items-center border-t border-neutral-800 pt-1">
                    <span>9322126863</span>
                    <span className="text-rose-400 font-bold">Fast Dispatch</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          6. DIE-CUT STICKER MOCKUP (Peel corner)
         ======================================================== */}
      {isSticker && (
        <div className="relative flex items-center justify-center py-6">
          <div className="relative w-48 sm:w-56 h-48 sm:h-56 bg-neutral-900 rounded-3xl p-4 shadow-2xl border-2 border-rose-500/40 flex items-center justify-center overflow-hidden">
            
            {/* Peel corner effect */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-neutral-800 border-b border-l border-neutral-600 rounded-bl-xl shadow-md" />

            <div className="w-full h-full flex items-center justify-center">
              {customImage ? (
                <div 
                  className={`w-full h-full flex items-center justify-center ${getFinishEffect()}`}
                  style={{ transform: `scale(${scale})` }}
                >
                  <img
                    src={customImage}
                    alt="Die-Cut Sticker Artwork"
                    className={`max-w-full max-h-full ${getObjectPosition()} drop-shadow-xl`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div 
                  className="text-center p-3"
                  style={{ transform: `scale(${scale})` }}
                >
                  <ProprintLogo size="sm" variant="light" showTagline={true} />
                  <span className="inline-block mt-3 px-2 py-0.5 bg-rose-600/30 text-rose-300 text-[8px] font-bold rounded-full border border-rose-500/40">
                    Waterproof Vinyl Sticker
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          7. FLEX BANNER / STANDEE MOCKUP
         ======================================================== */}
      {isBanner && (
        <div className="relative flex flex-col items-center justify-center py-4">
          {/* Roll-up graphic canvas */}
          <div className="w-36 sm:w-44 h-64 sm:h-76 bg-neutral-950 border-2 border-neutral-700 shadow-2xl flex flex-col justify-between p-3 text-white overflow-hidden">
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              {customImage ? (
                <div 
                  className={`w-full h-full flex items-center justify-center ${getFinishEffect()}`}
                  style={{ transform: `scale(${scale})` }}
                >
                  <img
                    src={customImage}
                    alt="Standee Banner Artwork"
                    className={`max-w-full max-h-full ${getObjectPosition()}`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div 
                  className="text-center space-y-3"
                  style={{ transform: `scale(${scale})` }}
                >
                  <ProprintLogo size="sm" variant="light" showTagline={true} />
                  <div className="bg-rose-900/40 border border-rose-700/50 p-2 rounded">
                    <p className="text-[9px] font-extrabold text-white">ROLL-UP STANDEE</p>
                    <p className="text-[7px] text-rose-300">6ft x 3ft Aluminum Base</p>
                  </div>
                  <p className="text-[8px] text-neutral-300">Exhibitions & Stage Displays</p>
                </div>
              )}
            </div>
          </div>

          {/* Aluminum Standee Base */}
          <div className="w-44 sm:w-52 h-4 bg-neutral-300 rounded-b shadow-lg border-t border-neutral-500" />
        </div>
      )}

      {/* ========================================================
          8. APPAREL / T-SHIRT / POLO MOCKUP
         ======================================================== */}
      {isApparel && (
        <div className="relative flex items-center justify-center py-4">
          <div className="relative w-52 sm:w-60 h-56 sm:h-64 bg-neutral-900 rounded-t-3xl rounded-b-xl shadow-2xl border border-neutral-700 p-4 flex flex-col items-center justify-center text-white overflow-hidden">
            
            {/* T-Shirt Collar */}
            <div className="absolute top-0 w-20 h-6 bg-neutral-950 rounded-b-full border-b-2 border-neutral-700" />

            {/* Chest Printed Artwork */}
            <div className="w-28 sm:w-32 h-28 sm:h-32 flex items-center justify-center z-10 mt-3">
              {customImage ? (
                <div 
                  className={`w-full h-full flex items-center justify-center ${getFinishEffect()}`}
                  style={{ transform: `scale(${scale})` }}
                >
                  <img
                    src={customImage}
                    alt="Custom T-Shirt Print"
                    className={`max-w-full max-h-full ${getObjectPosition()} drop-shadow`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div 
                  className="text-center p-2 bg-neutral-950 rounded-xl border border-neutral-800"
                  style={{ transform: `scale(${scale})` }}
                >
                  <ProprintLogo size="sm" variant="light" showTagline={false} />
                  <p className="text-[7.5px] text-rose-400 mt-1 font-semibold">100% Bio-Washed Cotton</p>
                </div>
              )}
            </div>

            <div className="absolute bottom-2 text-[7px] text-neutral-400 font-mono">
              DTF Textile Printing
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          9. DEFAULT / OTHER MERCHANDISE MOCKUP
         ======================================================== */}
      {!isMug && !isBrochure && !isBusinessCard && !isPackaging && !isFlyer && !isSticker && !isBanner && !isApparel && (
        <div className="relative flex items-center justify-center py-6">
          <div className="relative w-52 sm:w-60 h-52 sm:h-60 bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 p-4 flex flex-col justify-between text-white overflow-hidden">
            
            <div className="flex-1 flex items-center justify-center">
              {customImage ? (
                <div 
                  className={`w-full h-full flex items-center justify-center ${getFinishEffect()}`}
                  style={{ transform: `scale(${scale})` }}
                >
                  <img
                    src={customImage}
                    alt="Product Artwork Mockup"
                    className={`max-w-full max-h-full ${getObjectPosition()} rounded`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div 
                  className="text-center space-y-2"
                  style={{ transform: `scale(${scale})` }}
                >
                  <ProprintLogo size="sm" variant="light" showTagline={true} />
                  <p className="text-xs font-bold text-rose-400">{productName}</p>
                </div>
              )}
            </div>

            <div className="text-[7px] text-neutral-400 flex justify-between items-center border-t border-neutral-800 pt-1.5">
              <span>Proprint Pre-Press</span>
              <span className="text-rose-400 font-bold">True CMYK Proof</span>
            </div>
          </div>
        </div>
      )}

      {/* Live Badge overlay */}
      <div className="absolute top-3 left-3 z-30">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 border border-neutral-700 text-[10px] font-bold text-rose-300 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live 3D Realistic Preview</span>
        </span>
      </div>

    </div>
  );
};
