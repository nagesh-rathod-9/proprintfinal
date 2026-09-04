import React, { useState } from 'react';
import { VisitingCardStudio } from '../components/VisitingCardStudio';
import { OffsetRateCalculator } from '../components/OffsetRateCalculator';
import { Table, Sparkles, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VisitingCardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'studio'>('matrix');
  const { isMarathi } = useApp();

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Mode Switcher Bar */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4">
        <div className="flex items-center justify-between bg-white border border-slate-200 p-1.5 rounded-2xl shadow-2xs mb-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Table className="w-4 h-4 text-rose-500" />
              <span>{isMarathi ? 'ऑफसेट रेट मॅट्रिक्स (पत्री दर)' : 'Commercial Rate Matrix'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isMarathi ? '३D डिझाईन स्टुडिओ' : '3D Live Designer'}</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 pr-3 text-[11px] font-bold text-slate-500">
            <Layers className="w-3.5 h-3.5 text-rose-600" />
            <span>Heidelberg 4-Color CTP Printing</span>
          </div>
        </div>
      </div>

      {/* Active Tab View */}
      {activeTab === 'matrix' ? (
        <OffsetRateCalculator />
      ) : (
        <div className="py-2">
          <VisitingCardStudio />
        </div>
      )}
    </div>
  );
};

