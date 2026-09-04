import React from 'react';

export const GlobalLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-rose-600/20 border-t-rose-600 animate-spin"></div>
        <div className="absolute w-8 h-8 rounded-full bg-rose-600/10 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></div>
        </div>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-1 text-xl font-black tracking-tight text-white">
          <span>pro</span>
          <span className="text-rose-500">print</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Calibrating print engine & press assets...</p>
      </div>
    </div>
  );
};
