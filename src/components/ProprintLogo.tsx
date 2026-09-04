import React from 'react';

interface ProprintLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark'; // 'light' is for dark backgrounds (default white+red text), 'dark' is for light backgrounds
  showTagline?: boolean;
  className?: string;
}

export const ProprintLogo: React.FC<ProprintLogoProps> = ({
  size = 'md',
  variant = 'light',
  showTagline = true,
  className = '',
}) => {
  // Pro text color based on background
  const proTextColor = variant === 'dark' ? 'text-slate-900' : 'text-white';
  const taglineColor = variant === 'dark' ? 'text-slate-600' : 'text-neutral-300';
  const iDotColor = variant === 'dark' ? 'bg-slate-900' : 'bg-white';

  const sizeConfigs = {
    sm: {
      text: 'text-xl tracking-tight',
      bar: 'h-[2.5px] mb-[2px]',
      dot: 'w-[4px] h-[4px] -top-[3px] left-[3px]',
      tagline: 'text-[7.5px] tracking-[0.18em]',
    },
    md: {
      text: 'text-2xl sm:text-[28px] tracking-tight',
      bar: 'h-[3px] mb-[2.5px]',
      dot: 'w-[5px] h-[5px] -top-[4px] left-[3.5px]',
      tagline: 'text-[9px] sm:text-[10px] tracking-[0.19em]',
    },
    lg: {
      text: 'text-3xl sm:text-4xl tracking-tight',
      bar: 'h-[3.5px] mb-[3px]',
      dot: 'w-[6.5px] h-[6.5px] -top-[5px] left-[4.5px]',
      tagline: 'text-xs tracking-[0.2em]',
    },
    xl: {
      text: 'text-4xl sm:text-5xl tracking-tight',
      bar: 'h-[4px] mb-[4px]',
      dot: 'w-[8px] h-[8px] -top-[6px] left-[6px]',
      tagline: 'text-sm tracking-[0.22em]',
    },
  };

  const config = sizeConfigs[size];

  return (
    <div className={`inline-flex flex-col items-start select-none font-sans ${className}`}>
      {/* Top red horizontal accent bar above 'pro' */}
      <div className="flex w-full">
        <div className={`w-[48%] ${config.bar} bg-rose-600 rounded-full`} />
      </div>

      {/* Main Logo Text: 'pro' + 'print' with custom dotted 'i' */}
      <div className={`flex items-baseline font-black leading-none ${config.text}`}>
        <span className={`${proTextColor} font-extrabold`}>pro</span>
        
        <span className="text-rose-500 font-extrabold flex items-baseline">
          pr
          {/* Custom 'i' with distinct white circular dot matching official logo */}
          <span className="relative inline-block">
            <span className="opacity-0">i</span>
            <span className="absolute inset-0 flex flex-col items-center justify-end">
              {/* Top circular dot */}
              <span className={`absolute rounded-full ${iDotColor} ${config.dot} shadow-sm`} />
              {/* Lower stem of 'i' */}
              <span className="w-[3px] sm:w-[3.5px] h-[62%] bg-rose-500 rounded-xs mb-0.5" />
            </span>
          </span>
          nt
        </span>
      </div>

      {/* Tagline: 'for all printing solutions' */}
      {showTagline && (
        <span className={`block font-normal lowercase ${config.tagline} ${taglineColor} mt-0.5 whitespace-nowrap`}>
          for all printing solutions
        </span>
      )}
    </div>
  );
};
