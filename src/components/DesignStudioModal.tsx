import React, { useState } from 'react';
import { X, Sparkles, Layers, Sliders, Palette, CreditCard } from 'lucide-react';
import { VisitingCardStudio } from './VisitingCardStudio';

interface DesignStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignStudioModal: React.FC<DesignStudioModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 my-auto text-slate-900 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-slate-900 hover:bg-rose-600 text-white flex items-center justify-center shadow-md cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <VisitingCardStudio />
      </div>
    </div>
  );
};
