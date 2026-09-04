import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Check, 
  Upload, 
  FileText, 
  Trash2, 
  ShoppingCart, 
  CreditCard, 
  MessageSquare, 
  Sparkles, 
  Percent, 
  ShieldCheck, 
  Layers,
  Clock,
  Sparkle
} from 'lucide-react';
import { SelectedProductCustomization } from '../types';

interface PaperRowRate {
  id: string;
  name: string;
  gsm: number;
  base1000Rate1Day: number;
  base1000Rate2Day: number;
  popular?: boolean;
}

const PAPER_CATALOG: PaperRowRate[] = [
  { id: 'art-270', name: 'Art Card Matt 270 gsm', gsm: 270, base1000Rate1Day: 490, base1000Rate2Day: 490 },
  { id: 'art-350', name: 'Art Card Matt 350 gsm', gsm: 350, base1000Rate1Day: 568, base1000Rate2Day: 568, popular: true },
  { id: 'ivory-410', name: 'Economical Ivory 410 gsm', gsm: 410, base1000Rate1Day: 668, base1000Rate2Day: 668 },
  { id: 'ivory-370', name: 'Ivory 370 gsm', gsm: 370, base1000Rate1Day: 773, base1000Rate2Day: 773 },
  { id: 'thick-450', name: 'Thick Card 450 gsm', gsm: 450, base1000Rate1Day: 890, base1000Rate2Day: 890 }
];

const QUANTITIES = [100, 200, 300, 400, 500, 1000];
const SIZES = ['93x56', '89x54', '90x50', '85x55'];

export const OffsetRateCalculator: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, showToast, isMarathi, products } = useApp();

  // Configuration States matching the Commercial Rate Matrix
  const [side, setSide] = useState<'single' | 'both'>('single');
  const [lamination, setLamination] = useState<'none' | 'gloss' | 'matt' | 'velvet'>('matt');
  
  // Checkbox finishes
  const [features, setFeatures] = useState<{
    frontUv: boolean;
    backUv: boolean;
    frontFoil: boolean;
    backFoil: boolean;
    folding: boolean;
    dieCut: boolean;
    texture: boolean;
  }>({
    frontUv: false,
    backUv: false,
    frontFoil: false,
    backFoil: false,
    folding: false,
    dieCut: false,
    texture: false
  });

  const [selectedSize, setSelectedSize] = useState('93x56');
  const [paperFilter, setPaperFilter] = useState('All');
  const [quantity, setQuantity] = useState<number>(1000);
  const [rateMode, setRateMode] = useState<'basic' | 'gst'>('basic');
  const [selectedPaperId, setSelectedPaperId] = useState('art-350');
  const [selectedDay, setSelectedDay] = useState<'1' | '2'>('1');

  // Artwork Upload state
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Dynamic pricing calculation based on quantity and features
  const selectedPaper = PAPER_CATALOG.find((p) => p.id === selectedPaperId) || PAPER_CATALOG[1];

  const calculateRateForPaper = (paper: PaperRowRate, day: '1' | '2') => {
    let base1000 = day === '1' ? paper.base1000Rate1Day : paper.base1000Rate2Day;

    // Side multiplier
    if (side === 'both') {
      base1000 += 160;
    }

    // Lamination additions
    if (lamination === 'gloss') base1000 += 50;
    else if (lamination === 'matt') base1000 += 70;
    else if (lamination === 'velvet') base1000 += 180;

    // Feature additions
    if (features.frontUv) base1000 += 180;
    if (features.backUv) base1000 += 180;
    if (features.frontFoil) base1000 += 220;
    if (features.backFoil) base1000 += 220;
    if (features.folding) base1000 += 80;
    if (features.dieCut) base1000 += 150;
    if (features.texture) base1000 += 120;

    // Bulk tiered discount formula
    let factor = 1.0;
    if (quantity === 100) factor = 0.22; // higher unit cost for short runs
    else if (quantity === 200) factor = 0.35;
    else if (quantity === 300) factor = 0.48;
    else if (quantity === 400) factor = 0.60;
    else if (quantity === 500) factor = 0.70; // 30% bulk discount
    else if (quantity === 1000) factor = 1.0; // Standard wholesale rate

    let calculated = Math.round(base1000 * factor);

    if (rateMode === 'gst') {
      calculated = Math.round(calculated * 1.18);
    }

    return calculated;
  };

  const currentFinalRate = useMemo(() => {
    return calculateRateForPaper(selectedPaper, selectedDay);
  }, [selectedPaper, selectedDay, side, lamination, features, quantity, rateMode]);

  const singleUnitCost = (currentFinalRate / quantity).toFixed(2);

  // Bulk savings estimate compared to 100 pcs unit rate
  const savingsPercent = useMemo(() => {
    if (quantity === 1000) return 38;
    if (quantity === 500) return 25;
    if (quantity === 400) return 18;
    if (quantity === 300) return 12;
    if (quantity === 200) return 8;
    return 0;
  }, [quantity]);

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((f: File) => ({
        name: f.name,
        size: (f.size / 1024).toFixed(0) + ' KB'
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      showToast(`Uploaded ${newFiles.length} file(s) for pre-flight check`, 'success');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((f: File) => ({
        name: f.name,
        size: (f.size / 1024).toFixed(0) + ' KB'
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      showToast(`Uploaded ${newFiles.length} artwork file(s)`, 'success');
    }
  };

  const targetProduct = useMemo(() => {
    return products.find(p => p.id === 'prod-standard-biz-card' || p.categoryId === 'visiting-cards' || p.categoryId === 'business-cards') || products[0];
  }, [products]);

  const buildCustomization = (): SelectedProductCustomization => {
    const activeFeatures = Object.entries(features)
      .filter(([_, v]) => v)
      .map(([k]) => k.toUpperCase())
      .join(', ') || 'Standard Press';

    return {
      quantity,
      sizeId: selectedSize,
      finishId: selectedPaper.id,
      corners: features.dieCut ? 'Rounded (6mm)' : 'Standard Square',
      paperType: selectedPaper.name,
      paperFinish: `${lamination.toUpperCase()} • ${side.toUpperCase()} SIDE`,
      specialInstructions: `Features: ${activeFeatures} | Size: ${selectedSize} mm | Dispatch: ${selectedDay} Day | Rate Mode: ${rateMode.toUpperCase()}`,
      calculatedPrice: currentFinalRate,
      uploadedFileName: uploadedFiles[0]?.name,
      uploadedFileUrl: uploadedFiles[0]?.name
    };
  };

  const handleProceedToCheckout = () => {
    if (targetProduct) {
      addToCart(targetProduct, buildCustomization());
    }
    showToast('Visiting Card configuration saved! Proceeding to Checkout...', 'success');
    navigate('/checkout');
  };

  const handleAddToCartOnly = () => {
    if (targetProduct) {
      addToCart(targetProduct, buildCustomization());
    }
    showToast(`Added ${quantity} Visiting Cards to Cart! (₹${currentFinalRate})`, 'success');
  };

  const handleWhatsAppInquiry = () => {
    const activeFeatures = Object.entries(features)
      .filter(([_, active]) => active)
      .map(([k]) => k.toUpperCase())
      .join(', ') || 'None';

    const msg = `*PROPRINT VISITING CARD ORDER / INQUIRY*\n` +
      `• Paper: ${selectedPaper.name}\n` +
      `• Size: ${selectedSize} mm\n` +
      `• Sides: ${side.toUpperCase()}\n` +
      `• Lamination: ${lamination.toUpperCase()}\n` +
      `• Addon Features: ${activeFeatures}\n` +
      `• Quantity: ${quantity} pcs\n` +
      `• Rate: ₹${currentFinalRate} (${rateMode.toUpperCase()})\n` +
      `• Dispatch: ${selectedDay} Day\n` +
      `Please confirm artwork and bank details for payment.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/919422292419?text=${encoded}`, '_blank');
  };

  const filteredPapers = paperFilter === 'All' 
    ? PAPER_CATALOG 
    : PAPER_CATALOG.filter((p) => p.name.toLowerCase().includes(paperFilter.toLowerCase()));

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 font-sans text-slate-900">
      
      {/* Top Header matching Images 1 & 3: < BACK | VISITING CARDS | PROPRINT Cards badge */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-2xs mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isMarathi ? 'मागे' : 'Back'}</span>
          </button>
          
          <div className="h-5 w-px bg-slate-200" />

          <h1 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <span>{isMarathi ? 'व्हिजिटिंग कार्ड्स दर तक्ता' : 'Visiting Cards'}</span>
            <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md hidden sm:inline-block">
              Offset Press Fidelity
            </span>
          </h1>
        </div>

        {/* Brand logo / badge */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-black text-slate-400 block uppercase">Commercial Line</span>
            <span className="text-xs font-extrabold text-[#FF0038]">PROPRINT CARDS</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#FF0038] text-white flex items-center justify-center font-black text-xs shadow-md shadow-rose-600/30">
            P
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (7 Cols): Specifications & Rate Matrix Table */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* SELECT FEATURES BAR */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
            <div className="text-center">
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest bg-slate-100 px-4 py-1 rounded-full inline-block border border-slate-200">
                • SELECT FEATURES •
              </span>
            </div>

            {/* 1. SIDE SELECTION: Single Side vs Both Side */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-800 border-b border-slate-100 pb-3">
              <span className="text-slate-400 uppercase text-[11px] font-extrabold w-16">Side:</span>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="side"
                  checked={side === 'single'}
                  onChange={() => setSide('single')}
                  className="w-4 h-4 text-[#FF0038] focus:ring-rose-500 cursor-pointer"
                />
                <span className={side === 'single' ? 'text-[#FF0038] font-black' : 'text-slate-700'}>
                  SINGLE SIDE
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="side"
                  checked={side === 'both'}
                  onChange={() => setSide('both')}
                  className="w-4 h-4 text-[#FF0038] focus:ring-rose-500 cursor-pointer"
                />
                <span className={side === 'both' ? 'text-[#FF0038] font-black' : 'text-slate-700'}>
                  BOTH SIDE
                </span>
              </label>
            </div>

            {/* 2. LAMINATION SELECTION */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-bold text-slate-800 border-b border-slate-100 pb-3">
              <span className="text-slate-400 uppercase text-[11px] font-extrabold w-16">Lami:</span>
              
              {(['none', 'gloss', 'matt', 'velvet'] as const).map((lam) => {
                const label = lam === 'none' ? 'NO LAMINATION' : lam.toUpperCase();
                const isSelected = lamination === lam;
                return (
                  <label key={lam} className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="lamination"
                      checked={isSelected}
                      onChange={() => setLamination(lam)}
                      className="w-4 h-4 text-[#FF0038] focus:ring-rose-500 cursor-pointer"
                    />
                    <span className={isSelected ? 'text-[#FF0038] font-black' : 'text-slate-700'}>
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* 3. SPOT FINISHING CHECKBOXES (Front UV, Back UV, Front Foil, etc.) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={features.frontUv}
                  onChange={() => toggleFeature('frontUv')}
                  className="w-4 h-4 rounded text-[#FF0038] focus:ring-rose-500 cursor-pointer"
                />
                <span className={features.frontUv ? 'text-[#FF0038]' : ''}>FRONT UV</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={features.backUv}
                  onChange={() => toggleFeature('backUv')}
                  className="w-4 h-4 rounded text-[#FF0038] focus:ring-rose-500 cursor-pointer"
                />
                <span className={features.backUv ? 'text-[#FF0038]' : ''}>BACK UV</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={features.frontFoil}
                  onChange={() => toggleFeature('frontFoil')}
                  className="w-4 h-4 rounded text-[#FF0038] focus:ring-rose-500 cursor-pointer"
                />
                <span className={features.frontFoil ? 'text-[#FF0038]' : ''}>FRONT FOIL</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={features.backFoil}
                  onChange={() => toggleFeature('backFoil')}
                  className="w-4 h-4 rounded text-[#FF0038] focus:ring-rose-500 cursor-pointer"
                />
                <span className={features.backFoil ? 'text-[#FF0038]' : ''}>BACK FOIL</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={features.folding}
                  onChange={() => toggleFeature('folding')}
                  className="w-4 h-4 rounded text-[#FF0038] focus:ring-rose-500 cursor-pointer"
                />
                <span className={features.folding ? 'text-[#FF0038]' : ''}>FOLDING</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={features.dieCut}
                  onChange={() => toggleFeature('dieCut')}
                  className="w-4 h-4 rounded text-[#FF0038] focus:ring-rose-500 cursor-pointer"
                />
                <span className={features.dieCut ? 'text-[#FF0038]' : ''}>DIE CUT</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 col-span-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={features.texture}
                  onChange={() => toggleFeature('texture')}
                  className="w-4 h-4 rounded text-[#FF0038] focus:ring-rose-500 cursor-pointer"
                />
                <span className={features.texture ? 'text-[#FF0038]' : ''}>TEXTURE (METALLIC EMBOSS)</span>
              </label>
            </div>

            {/* 4. SIZE & PAPER DROPDOWNS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                  Size (in mm)
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 cursor-pointer"
                >
                  {SIZES.map((sz) => (
                    <option key={sz} value={sz}>{sz} mm (Standard Offset)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                  Paper Stock Filter
                </label>
                <select
                  value={paperFilter}
                  onChange={(e) => setPaperFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 cursor-pointer"
                >
                  <option value="All">All Paper Types</option>
                  {PAPER_CATALOG.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5. QUANTITY SELECTOR (100, 200, 300, 400, 500, 1000) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase text-slate-500">
                  Select Quantity (Pcs)
                </span>
                {quantity >= 500 && (
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Bulk Discount Applied: Save {savingsPercent}%
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {QUANTITIES.map((qty) => {
                  const isSelected = quantity === qty;
                  return (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setQuantity(qty)}
                      className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-[#FF0038] text-white border-[#FF0038] shadow-md shadow-rose-600/30 scale-102'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{qty}</span>
                      {qty === 1000 && (
                        <span className={`text-[8px] uppercase tracking-wider font-black ${isSelected ? 'text-rose-100' : 'text-rose-600'}`}>
                          Best Rate
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. RATE TOGGLE BUTTONS (BASIC RATES vs WITH GST RATES) */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setRateMode('basic')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  rateMode === 'basic'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {rateMode === 'basic' && <Check className="w-4 h-4 text-emerald-400" />}
                <span>Basic Rates</span>
              </button>

              <button
                type="button"
                onClick={() => setRateMode('gst')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  rateMode === 'gst'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {rateMode === 'gst' && <Check className="w-4 h-4 text-emerald-400" />}
                <span>With GST (18%)</span>
              </button>
            </div>

          </div>

          {/* DYNAMIC RATE MATRIX TABLE matching Images 1 & 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            
            {/* Table Subtitle Header */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black tracking-wider text-rose-400 uppercase">
                  ({selectedSize}) {side.toUpperCase()} SIDE + {lamination.toUpperCase()}
                </span>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-100 uppercase tracking-tight">
                  Rate in Rupees ({quantity} Pcs)
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">
                  {rateMode === 'gst' ? '18% GST Incl.' : 'Net Excl. GST'}
                </span>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 font-extrabold border-b border-slate-200">
                    <th className="py-2.5 px-4 font-black uppercase tracking-wider">
                      Paper Type
                    </th>
                    <th className="py-2.5 px-3 text-center font-black uppercase tracking-wider w-24">
                      1 Day
                    </th>
                    <th className="py-2.5 px-3 text-center font-black uppercase tracking-wider w-24">
                      2 Day
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPapers.map((paper) => {
                    const isRowSelected = selectedPaperId === paper.id;
                    const rate1Day = calculateRateForPaper(paper, '1');
                    const rate2Day = calculateRateForPaper(paper, '2');

                    return (
                      <tr
                        key={paper.id}
                        onClick={() => setSelectedPaperId(paper.id)}
                        className={`transition-colors cursor-pointer ${
                          isRowSelected 
                            ? 'bg-rose-50/80 font-bold' 
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="py-3 px-4 flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                            isRowSelected ? 'border-[#FF0038] bg-[#FF0038]' : 'border-slate-300'
                          }`}>
                            {isRowSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <span className={isRowSelected ? 'text-slate-900 font-black' : 'text-slate-700 font-medium'}>
                              {paper.name}
                            </span>
                            {paper.popular && (
                              <span className="ml-2 text-[9px] font-black bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                Most Popular
                              </span>
                            )}
                          </div>
                        </td>

                        <td 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPaperId(paper.id);
                            setSelectedDay('1');
                          }}
                          className={`py-3 px-3 text-center font-black text-sm cursor-pointer ${
                            isRowSelected && selectedDay === '1'
                              ? 'text-[#FF0038] bg-rose-100/80 rounded-lg'
                              : 'text-slate-800'
                          }`}
                        >
                          ₹{rate1Day}
                        </td>

                        <td 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPaperId(paper.id);
                            setSelectedDay('2');
                          }}
                          className={`py-3 px-3 text-center font-black text-sm cursor-pointer ${
                            isRowSelected && selectedDay === '2'
                              ? 'text-[#FF0038] bg-rose-100/80 rounded-lg'
                              : 'text-slate-800'
                          }`}
                        >
                          ₹{rate2Day}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>⚡ Rates update in real-time as features & bulk volume change</span>
              <span className="font-bold text-slate-700">Click any row or day cell to choose</span>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (5 Cols): Selected Spec Summary, Artwork Upload & Direct Actions */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* ORDER CALCULATION SUMMARY CARD */}
          <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#FF0038] text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
              Offset Press Spec
            </div>

            <div className="mb-4">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
                Selected Job Summary
              </span>
              <h2 className="text-lg font-black text-slate-900 leading-tight mt-0.5">
                {selectedPaper.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {selectedSize} mm • {side.toUpperCase()} SIDE • {lamination.toUpperCase()}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-[#FF0038] tracking-tight">
                    ₹{currentFinalRate}
                  </span>
                  <span className="text-xs font-bold text-slate-500 ml-1">
                    / {quantity} cards
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    ₹{singleUnitCost} / card
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {selectedDay} Day Dispatch
                  </span>
                </div>
              </div>

              {savingsPercent > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-emerald-600" />
                    Wholesale Bulk Tier:
                  </span>
                  <span className="font-extrabold text-emerald-700">
                    Saved ~{savingsPercent}% vs base
                  </span>
                </div>
              )}
            </div>

            {/* ARTWORK UPLOAD ZONE */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Attach Artwork File (Optional)</span>
                <span className="text-[10px] text-slate-400">PDF, CDR, AI, PSD, ZIP</span>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer relative ${
                  isDragging
                    ? 'border-[#FF0038] bg-rose-50'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-[#FF0038] flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    Drag artwork here, or <span className="text-[#FF0038] underline">browse</span>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    2mm bleed required • 300 DPI CMYK
                  </p>
                </div>
              </div>

              {/* Uploaded files list */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-1.5 mt-2 max-h-32 overflow-y-auto">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-800">
                      <span className="truncate max-w-[200px] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-rose-600" />
                        {file.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">{file.size}</span>
                        <button
                          type="button"
                          onClick={() => setUploadedFiles(uploadedFiles.filter((_, idx) => idx !== i))}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACTION BUTTONS: PROCEED TO ORDER / ADD TO CART / WHATSAPP */}
            <div className="space-y-2.5">
              {/* PRIMARY PROCEED BUTTON */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-[#FF0038] hover:bg-rose-500 active:scale-98 text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>PROCEED TO ORDER (₹{currentFinalRate})</span>
              </button>

              {/* SECONDARY ADD TO CART */}
              <button
                type="button"
                onClick={handleAddToCartOnly}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>ADD TO CART</span>
              </button>

              {/* WHATSAPP INSTANT ORDER */}
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="w-full py-2 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Send Spec & Files via WhatsApp</span>
              </button>
            </div>

            {/* Quality badge */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Heidelberg Offset Press
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-600" />
                Same/Next Day Dispatch
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
