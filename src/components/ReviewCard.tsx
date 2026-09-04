import React from 'react';
import { Star, Check, CheckCircle2, ShieldCheck, Package } from 'lucide-react';

export interface ReviewCardData {
  id?: string;
  name: string;
  nameMr?: string;
  role?: string;
  roleMr?: string;
  company?: string;
  companyMr?: string;
  rating?: number;
  date?: string;
  dateMr?: string;
  highlight?: string;
  highlightMr?: string;
  quote: string;
  quoteMr?: string;
  productOrdered?: string;
  productOrderedMr?: string;
  jobLabel?: string;
  jobLabelMr?: string;
  isVerified?: boolean;
  verifiedLabel?: string;
  verifiedLabelMr?: string;
  verifiedSubLabel?: string;
  verifiedSubLabelMr?: string;
}

interface ReviewCardProps {
  review: ReviewCardData;
  isMarathi?: boolean;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  isMarathi = false,
  className = ''
}) => {
  const rating = review.rating || 5;
  const name = isMarathi && review.nameMr ? review.nameMr : review.name;
  const role = isMarathi && review.roleMr ? review.roleMr : review.role;
  const company = review.company;
  const date = isMarathi && review.dateMr ? review.dateMr : (review.date || '3 days ago');
  const highlight = isMarathi && review.highlightMr ? review.highlightMr : review.highlight;
  const quote = isMarathi && review.quoteMr ? review.quoteMr : review.quote;
  const productOrdered = isMarathi && review.productOrderedMr ? review.productOrderedMr : (review.productOrdered || '10,000 Medicine Cartons & Embossed Brochures');
  const isVerified = review.isVerified !== false;

  const roleCompanySubtitle = [role, company].filter(Boolean).join(', ');

  return (
    <div
      id={`review-card-${review.id || 'item'}`}
      className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between font-marathi group ${className}`}
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4">
          {/* User Name & Role/Company */}
          <div className="space-y-0.5 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight truncate font-marathi">
              {name}
            </h3>
            {roleCompanySubtitle && (
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed truncate font-marathi">
                {roleCompanySubtitle}
              </p>
            )}
          </div>

          {/* Rating Stars & Time Ago */}
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${
                    i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] sm:text-xs text-slate-400 font-normal mt-1 text-right font-marathi">
              {date}
            </span>
          </div>
        </div>

        {/* Feature / Highlight Pill Badge */}
        {highlight && (
          <div className="mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eefaf2] text-[#0f8b44] text-xs sm:text-sm font-semibold border border-emerald-100/80 font-marathi">
              <div className="w-4 h-4 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="leading-none">{highlight}</span>
            </div>
          </div>
        )}

        {/* Subtle Horizontal Divider */}
        <div className="border-t border-slate-100 my-4 sm:my-5" />

        {/* Review Quote Body */}
        <div className="relative">
          <p className="text-xs sm:text-sm md:text-[14.5px] text-slate-800 leading-relaxed font-normal font-marathi">
            <span className="text-[#FF0038] font-bold text-xl sm:text-2xl leading-none mr-1.5 select-none font-serif align-middle inline-block">
              “
            </span>
            <span className="align-middle">“{quote.replace(/^["“]|["”]$/g, '')}”</span>
          </p>
        </div>
      </div>

      {/* Bottom Metadata Footer */}
      <div className="pt-4 sm:pt-5 mt-5 sm:mt-6 border-t border-slate-100 grid grid-cols-[1fr_auto] items-center gap-3 sm:gap-4">
        {/* Left Section: Job Details */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 border border-rose-100/90 flex items-center justify-center shrink-0 text-rose-500 shadow-2xs">
            <Package className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] sm:text-[11px] text-slate-400 font-normal leading-none mb-1 font-marathi">
              {isMarathi ? (review.jobLabelMr || 'जॉब तपशील') : (review.jobLabel || 'Job')}
            </span>
            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight truncate font-marathi">
              {productOrdered}
            </h4>
          </div>
        </div>

        {/* Right Section: Verified Badge */}
        {isVerified && (
          <div className="flex items-center gap-2 sm:gap-2.5 pl-3 sm:pl-4 border-l border-slate-100 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-emerald-500/80 bg-emerald-50/60 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-600 stroke-[2.2]" />
            </div>
            <div className="text-left">
              <span className="block text-xs sm:text-sm font-bold text-[#0f8b44] leading-tight font-marathi">
                {isMarathi ? (review.verifiedLabelMr || 'व्हेरिफाईड') : (review.verifiedLabel || 'Verified')}
              </span>
              <span className="block text-[10px] sm:text-[11px] text-slate-400 font-normal leading-tight mt-0.5 font-marathi">
                {isMarathi ? (review.verifiedSubLabelMr || 'अधिकृत अभिप्राय') : (review.verifiedSubLabel || 'Authentic Review')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
