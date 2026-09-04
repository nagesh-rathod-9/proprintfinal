import React from 'react';
import { Cpu, Sparkles, Gauge, Flame, ShieldCheck } from 'lucide-react';

interface MachineItem {
  name: string;
  category: string;
  specs: string;
  dpi: string;
  capacity: string;
  bestFor: string;
  image: string;
}

const MACHINERY: MachineItem[] = [
  {
    name: 'Heidelberg Speedmaster 4-Color',
    category: 'Industrial Offset Press',
    specs: 'Direct plate imaging, automated ink fountain control & auto-plate loading',
    dpi: '2400 x 2400 DPI Offset Precision',
    capacity: '15,000 Sheets / Hour',
    bestFor: 'High-Volume Visiting Cards, Flyers & Catalogs',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'HP Indigo 12000 Digital Press',
    category: 'Commercial Digital Color',
    specs: 'ElectroInk liquid toner with 7-color station including white & spot ink',
    dpi: '812 DPI at 8-bit color depth (equivalent to 2438 DPI)',
    capacity: '4,600 Full-Color B2 Sheets / Hour',
    bestFor: 'Short Run Books, Menus & Customized Packaging',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Roland TrueVIS UV-LED Flatbed',
    category: 'Large Format & Direct UV',
    specs: 'Direct-to-substrate UV curing on acrylic, sunboard, foam and canvas',
    dpi: '1200 x 1200 DPI Micro-Piezo',
    capacity: 'High-Speed Multi-Layer UV Gloss',
    bestFor: 'Flex Banners, Roll-up Standees & Signage',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Autobond High-Speed Lamination & Foil',
    category: 'Luxe Post-Press Finisher',
    specs: 'Thermal velvet, matte, gloss lamination & digital gold/silver foil',
    dpi: 'Micron-Accurate Registration',
    capacity: '60 Meters / Minute',
    bestFor: 'Luxury Gold Foil Cards & Velvet Soft-Touch Covers',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80'
  }
];

export const PrintMachineryShowcase: React.FC = () => {
  return (
    <section className="w-full bg-slate-900 text-white py-12 sm:py-16">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Industrial Printing Infrastructure</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Powered by World-Class Offset & Digital Press Technology
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Our modern workshop in Chh. Sambhajinagar houses heavy-duty German & Japanese printing machinery to ensure razor-sharp registration and true CMYK color matching.
          </p>
        </div>

        {/* 4 Machinery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {MACHINERY.map((mach, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-rose-500/60 transition-all group hover:-translate-y-1 shadow-lg"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={mach.image}
                    alt={mach.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-[10px] font-bold text-rose-400 px-2 py-0.5 rounded-md border border-rose-500/30">
                    {mach.category}
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                    {mach.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {mach.specs}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 font-medium">Resolution:</span>
                      <span className="font-mono font-bold text-rose-400">{mach.dpi}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 font-medium">Capacity:</span>
                      <span className="font-mono font-bold text-white">{mach.capacity}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate"><strong>Best For:</strong> {mach.bestFor}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Badges */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-around gap-4 text-xs font-bold text-slate-200">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-rose-400" />
            <span>Pantone Matching System (PMS) Calibrated</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Instant UV Curing for Smudge-Proof Output</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Automated Pre-Press Plate Verification</span>
          </div>
        </div>

      </div>
    </section>
  );
};
