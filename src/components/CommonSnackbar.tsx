import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const CommonSnackbar: React.FC = () => {
  const { toast, closeToast } = useApp();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const duration = 3500;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toast]);

  if (!toast || toast.type !== 'error') return null;

  const type = 'error';

  const typeConfig = {
    error: {
      bg: 'bg-slate-950 border-rose-500/60 text-white',
      iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
      barBg: 'bg-rose-500',
      badge: 'Error',
      badgeClass: 'bg-rose-500/20 text-rose-300'
    }
  }[type];

  return (
    <div 
      role="alert" 
      aria-live="assertive"
      className="fixed bottom-5 right-5 z-50 max-w-md w-[calc(100vw-2.5rem)] sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-300 font-sans"
    >
      <div className={`rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-md ${typeConfig.bg}`}>
        <div className="p-4 flex items-start gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${typeConfig.iconBg}`}>
            {typeConfig.icon}
          </div>

          <div className="flex-1 min-w-0 pr-2 pt-0.5">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider ${typeConfig.badgeClass}`}>
                {typeConfig.badge}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-snug text-slate-100 break-words">
              {toast.message}
            </p>
          </div>

          <button
            onClick={closeToast}
            aria-label="Close notification"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar Timer */}
        <div className="w-full bg-white/10 h-1 overflow-hidden">
          <div 
            className={`h-full transition-all ease-linear ${typeConfig.barBg}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
