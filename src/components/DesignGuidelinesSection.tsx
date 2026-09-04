import React from 'react';
import { FileCheck, Scissors, Eye, Palette, CheckCircle2, Layers } from 'lucide-react';

interface GuidelineStep {
  icon: any;
  title: string;
  desc: string;
  tip: string;
}

const GUIDELINES: GuidelineStep[] = [
  {
    icon: Palette,
    title: '1. CMYK Color Profile',
    desc: 'Always design your artwork in CMYK color mode (not RGB). RGB colors are for screens and will shift slightly when printed with offset ink.',
    tip: 'Tip: Use Coated FOGRA39 or US Web Coated (SWOP) v2 profile.'
  },
  {
    icon: Scissors,
    title: '2. 2mm Bleed & Safe Margin',
    desc: 'Add 2mm bleed on all sides beyond the final trim size. Keep all critical logos, text and contact numbers at least 3mm inside the cut line.',
    tip: 'Standard card design canvas: 93mm x 55mm (Trim: 89mm x 51mm).'
  },
  {
    icon: Eye,
    title: '3. 300+ DPI High Resolution',
    desc: 'Ensure all raster images, photos, and backgrounds are at least 300 DPI at 100% scale. Lower resolutions appear pixelated on offset press.',
    tip: 'Export vector logos in PDF or AI format for crisp typography.'
  },
  {
    icon: Layers,
    title: '4. Convert Fonts to Outlines / Curves',
    desc: 'Convert all text layers to outlines (Ctrl+Shift+O in Illustrator / Ctrl+Q in CorelDRAW) before exporting to avoid missing font issues.',
    tip: 'Embed all linked images when saving final PDF or EPS.'
  }
];

export const DesignGuidelinesSection: React.FC = () => {
  return (
    <section className="w-full bg-slate-50 py-12 sm:py-16 border-t border-slate-200">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Free Artwork Pre-Flight Assistance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Print-Ready Artwork Preparation Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Follow these simple steps before submitting your artwork to guarantee zero errors and pin-sharp printing.
            </p>
          </div>

          <a
            href="tel:9623458919"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors self-start md:self-auto"
          >
            <span>Need Help Designing? Call 9623458919</span>
          </a>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {GUIDELINES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-rose-400 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 font-medium">
                  {item.tip}
                </div>
              </div>
            );
          })}
        </div>

        {/* Supported File Formats */}
        <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Supported Formats:</span>
            {['PDF (Print Ready)', 'CDR (CorelDRAW)', 'AI (Illustrator)', 'PSD (Photoshop)', 'High-Res TIFF / JPG', 'PNG'].map((fmt) => (
              <span key={fmt} className="bg-slate-100 border border-slate-200 font-mono text-[10px] font-bold text-slate-700 px-2 py-0.5 rounded-md">
                {fmt}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Free Manual Pre-press Inspection with Every Order</span>
          </div>
        </div>

      </div>
    </section>
  );
};
