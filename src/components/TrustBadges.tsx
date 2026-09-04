import React from 'react';
import { ShieldCheck, Truck, Headphones, Lock } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      id: 'quality',
      icon: ShieldCheck,
      title: 'Premium Quality',
      description: 'Top quality materials',
    },
    {
      id: 'delivery',
      icon: Truck,
      title: 'Fast Delivery',
      description: 'On-time, every time',
    },
    {
      id: 'support',
      icon: Headphones,
      title: 'Customer Support',
      description: "We're here to help",
    },
    {
      id: 'payments',
      icon: Lock,
      title: 'Secure Payments',
      description: '100% secure checkout',
    },
  ];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8 py-3 sm:py-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`flex items-center gap-3 sm:gap-4 ${
                  idx !== 0 ? 'pt-3 sm:pt-0 sm:pl-4 md:pl-6' : ''
                }`}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0 text-rose-600 transition-transform hover:scale-105">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
