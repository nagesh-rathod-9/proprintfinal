import React, { useState, useRef } from 'react';
import { 
  X, 
  Star, 
  Check, 
  Upload, 
  ShoppingCart, 
  MessageSquare, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Layers, 
  Heart,
  ChevronDown,
  Sparkles,
  HelpCircle,
  FileCheck,
  Eye
} from 'lucide-react';
import { Product, SelectedProductCustomization } from '../types';
import { useApp } from '../context/AppContext';
import { LiveProductMockup } from './LiveProductMockup';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenQuoteModal?: (productName?: string) => void;
  onOpenWhatsApp?: (message?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenQuoteModal,
  onOpenWhatsApp
}) => {
  const { addToCart, toggleWishlist, isInWishlist, isMarathi, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!product) return null;

  const firstSize = typeof product.sizes?.[0] === 'object' ? (product.sizes[0] as any).name : (product.sizes?.[0] || 'Standard');
  const firstFinish = typeof product.finishes?.[0] === 'object' ? (product.finishes[0] as any).name : (product.finishes?.[0] || 'Standard');
  const unitLabel = product.unit || 'Units';

  // Selected Customizations State
  const [selectedQuantity, setSelectedQuantity] = useState<number>(product.minQuantity || 100);
  const [selectedSize, setSelectedSize] = useState<string>(firstSize);
  const [selectedFinish, setSelectedFinish] = useState<string>(firstFinish);
  const [selectedPaperType, setSelectedPaperType] = useState<string>((product.paperTypes && product.paperTypes[0]) || '350 GSM Art Card');
  const [selectedCorners, setSelectedCorners] = useState<'Standard Square' | 'Rounded (6mm)'>('Standard Square');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  
  // Custom Artwork Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<number | undefined>(undefined);
  const [uploadedIsImage, setUploadedIsImage] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Live 3D Mockup Controls
  const [mockupFinish, setMockupFinish] = useState<'standard' | 'matte' | 'gloss' | 'gold-foil'>('standard');
  const [mockupScale, setMockupScale] = useState<number>(1.0);

  const isWishlisted = isInWishlist(product.id);

  // Dynamic Price Calculation
  // Tier discounts based on quantity
  const volumeDiscount = selectedQuantity >= 2000 ? 0.70 : selectedQuantity >= 1000 ? 0.78 : selectedQuantity >= 500 ? 0.85 : 1.0;
  const finishExtra = selectedFinish.toLowerCase().includes('foil') ? 350 : selectedFinish.toLowerCase().includes('uv') ? 200 : selectedFinish.toLowerCase().includes('velvet') ? 150 : 0;
  const cornersExtra = selectedCorners.includes('Rounded') ? 50 : 0;
  
  const unitCalculated = (product.basePrice + (finishExtra / 100)) * volumeDiscount;
  const isBulkPerHundred = unitLabel.includes('Cards') || unitLabel.includes('Pack') || unitLabel.includes('Flyers');
  const calculatedTotal = Math.round((unitCalculated * (selectedQuantity / (isBulkPerHundred ? 100 : 1))) + cornersExtra);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadedFileName(file.name);
      setUploadedFileSize(file.size);
      const isImg = file.type.startsWith('image/');
      setUploadedIsImage(isImg);

      if (isImg) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setUploadedPreviewUrl(ev.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }

      // Real upload to Express backend
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.file) {
          setUploadedFileUrl(data.file.url);
          setUploadedIsImage(data.file.isImage);
          showToast(`File "${file.name}" uploaded to press server!`, 'success');
        }
      } catch (err) {
        console.warn('File upload fallback:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddToCart = () => {
    const customization: SelectedProductCustomization = {
      quantity: selectedQuantity,
      sizeId: selectedSize,
      finishId: selectedFinish,
      paperType: selectedPaperType,
      corners: selectedCorners,
      uploadedFileName: uploadedFileName || 'Direct Order Proof Request',
      uploadedFilePreview: uploadedPreviewUrl || undefined,
      uploadedFileUrl: uploadedFileUrl || undefined,
      uploadedFileSize: uploadedFileSize,
      uploadedIsImage: uploadedIsImage,
      specialInstructions: specialNotes,
      calculatedPrice: calculatedTotal,
      turnaroundDays: product.turnaroundDays || '1-2'
    };

    addToCart(product, customization);
    onClose();
  };

  const handleWhatsAppOrder = () => {
    const perUnit = (calculatedTotal / selectedQuantity).toFixed(2);
    const msg = 
`*PROPRINT - DIRECT ORDER ON WHATSAPP*
----------------------------------------
📦 *Product:* ${isMarathi && product.nameMr ? product.nameMr : product.name}
🔢 *Quantity:* ${selectedQuantity} ${unitLabel}
📐 *Size / Dimension:* ${selectedSize}
📄 *Paper Stock & Finish:* ${selectedFinish} (${selectedPaperType})
✂️ *Corners:* ${selectedCorners}
💰 *Estimated Total:* ₹${calculatedTotal.toLocaleString('en-IN')} (₹${perUnit}/unit)
📁 *Artwork File:* ${uploadedFileName ? `Attached: ${uploadedFileName}` : 'Will share PDF/CDR file on WhatsApp'}
${specialNotes ? `📝 *Notes:* ${specialNotes}\n` : ''}📍 *Location:* Chhatrapati Sambhajinagar / Maharashtra Delivery
----------------------------------------
Hello Proprint Team, please confirm this order, share the digital proof, and provide payment details.`;

    const phone = '919322126863';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    showToast(isMarathi ? 'व्हॉट्सॲपवर ऑर्डर तपशील उघडत आहे...' : 'Opening WhatsApp with your order details...', 'success');
    if (onOpenWhatsApp) {
      onOpenWhatsApp(msg);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-marathi"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-slate-200 my-auto text-slate-900 relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-rose-600 border border-slate-200 flex items-center justify-center shadow-md cursor-pointer transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Grid: Left Preview & Mockup, Right Configurator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Live Mockup & Media Gallery (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 p-5 sm:p-6 text-white flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              {/* Product Badge & Category */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2.5 py-0.5 rounded-full">
                  {product.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>{product.turnaroundDays} {isMarathi ? 'दिवस डिस्पॅच' : 'Day Dispatch'}</span>
                </span>
              </div>

              {/* Title & Ratings */}
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight font-marathi">
                  {isMarathi && product.nameMr ? product.nameMr : product.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-300 font-bold">{product.rating}</span>
                  <span className="text-xs text-slate-400">({product.reviewsCount} {isMarathi ? 'रिव्ह्यूज' : 'reviews'})</span>
                </div>
              </div>

              {/* LIVE 3D REALISTIC MOCKUP CONTAINER */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black/40">
                <LiveProductMockup
                  category={product.categoryId}
                  productName={product.name}
                  customImage={uploadedPreviewUrl}
                  scale={mockupScale}
                  finish={mockupFinish}
                />
              </div>

              {/* Mockup Quick Texture Toggles */}
              <div className="flex items-center justify-between text-[11px] bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-semibold">{isMarathi ? 'फिनिश प्रिव्ह्यू:' : 'Texture Effect:'}</span>
                <div className="flex gap-1">
                  {(['standard', 'matte', 'gloss', 'gold-foil'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setMockupFinish(f)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                        mockupFinish === f ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* In-House Quality Assurance Trust Strip */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-300 font-marathi">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{isMarathi ? '१००% अचूक CMYK कलर खात्री' : 'True CMYK Calibration Guarantee'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{isMarathi ? 'मोफत प्री-प्रेस आर्टवर्क व्हेरिफिकेशन' : 'Free Manual File Verification'}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Customization Form & Checkout (7 cols) */}
          <div className="lg:col-span-7 p-5 sm:p-7 space-y-5 bg-white">
            
            {/* Description */}
            <div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-marathi">
                {isMarathi && product.descriptionMr ? product.descriptionMr : product.description}
              </p>
            </div>

            {/* 1. QUANTITY SELECTOR */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>{isMarathi ? '१. संख्या निवडा (Quantity)' : '1. Select Order Quantity'}</span>
                <span className="text-rose-600 font-bold">{selectedQuantity} {product.unit}</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                {(product.quantityOptions || [100, 250, 500, 1000, 2000]).map((qty) => (
                  <button
                    key={qty}
                    onClick={() => setSelectedQuantity(qty)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      selectedQuantity === qty
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {qty} {unitLabel.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. FINISH & PAPER TYPE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Paper / Material */}
              {product.paperTypes && product.paperTypes.length > 0 && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    {isMarathi ? 'पेपर / मटेरियल प्रकार' : 'Paper / Board GSM'}
                  </label>
                  <select
                    value={selectedPaperType}
                    onChange={(e) => setSelectedPaperType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    {product.paperTypes.map((pt) => {
                      const val = typeof pt === 'string' ? pt : (pt as any).name || String(pt);
                      return <option key={val} value={val}>{val}</option>;
                    })}
                  </select>
                </div>
              )}

              {/* Lamination Finish */}
              {product.finishes && product.finishes.length > 0 && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    {isMarathi ? 'लेमिनेशन व कोटिंग फिनिश' : 'Surface Finish'}
                  </label>
                  <select
                    value={selectedFinish}
                    onChange={(e) => {
                      setSelectedFinish(e.target.value);
                      if (e.target.value.toLowerCase().includes('foil')) setMockupFinish('gold-foil');
                      else if (e.target.value.toLowerCase().includes('gloss')) setMockupFinish('gloss');
                      else if (e.target.value.toLowerCase().includes('matte')) setMockupFinish('matte');
                      else setMockupFinish('standard');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    {product.finishes.map((fn) => {
                      const val = typeof fn === 'string' ? fn : (fn.name || fn.id);
                      return <option key={typeof fn === 'string' ? fn : fn.id} value={val}>{val}</option>;
                    })}
                  </select>
                </div>
              )}

              {/* Size Option */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    {isMarathi ? 'आकार (Dimensions)' : 'Standard Dimensions'}
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    {product.sizes.map((sz) => {
                      const val = typeof sz === 'string' ? sz : (sz.name || sz.dimension || sz.id);
                      return <option key={typeof sz === 'string' ? sz : sz.id} value={val}>{val}</option>;
                    })}
                  </select>
                </div>
              )}

              {/* Corner Cut */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  {isMarathi ? 'कडा (Corners)' : 'Corner Finish'}
                </label>
                <select
                  value={selectedCorners}
                  onChange={(e: any) => setSelectedCorners(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="Standard Square">{isMarathi ? 'स्टँडर्ड ९०° चौकोनी' : 'Standard Square 90°'}</option>
                  <option value="Rounded (6mm)">{isMarathi ? 'गोल कोपरे (Rounded 6mm)' : 'Rounded Corners (6mm)'}</option>
                </select>
              </div>

            </div>

            {/* 3. ARTWORK UPLOAD OR DESIGN SERVICE */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  {isMarathi ? 'डिझाईन किंवा इमेज / ZIP फाईल अपलोड करा' : 'Upload Design Artwork (IMG, ZIP, PDF, CDR, AI)'}
                </label>
                {uploadedFileName && (
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Uploaded to Server</span>
                  </span>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".jpg,.jpeg,.png,.webp,.svg,.zip,.rar,.7z,.pdf,.cdr,.ai,.psd"
                className="hidden"
              />

              <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`p-3.5 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                  uploadedFileName 
                    ? 'border-emerald-300 bg-emerald-50/50' 
                    : 'border-rose-200 hover:border-rose-500 bg-rose-50/40 hover:bg-rose-50'
                }`}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-rose-700 py-1">
                    <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                    <span>Uploading file to /uploads directory...</span>
                  </div>
                ) : uploadedFileName ? (
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {uploadedPreviewUrl ? (
                        <img 
                          src={uploadedPreviewUrl} 
                          alt="Uploaded artwork" 
                          className="w-10 h-10 rounded-lg object-cover border border-emerald-300 shrink-0" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                          {uploadedFileName.split('.').pop()?.toUpperCase() || 'FILE'}
                        </div>
                      )}
                      <div className="min-w-0 text-left">
                        <span className="font-bold text-slate-900 block truncate">{uploadedFileName}</span>
                        <span className="text-[10px] text-emerald-700 block">
                          {uploadedFileSize ? `${Math.round(uploadedFileSize / 1024)} KB` : 'Ready'} • Saved in /uploads
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-rose-600 font-semibold hover:underline shrink-0">
                      Change File
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 text-center py-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                      <Upload className="w-4 h-4" />
                      <span>{isMarathi ? 'येथे क्लिक करून इमेज / ZIP / PDF फाईल अपलोड करा' : 'Click or Drag & Drop File (IMG, ZIP, PDF, CDR)'}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Supports JPG, PNG, ZIP, RAR, PDF, CDR, AI up to 100MB
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 4. SPECIAL INSTRUCTIONS / NOTES */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                {isMarathi ? 'विशेष सूचना किंवा कस्टमायझेशन (पर्यायी)' : 'Special Print Instructions (Optional)'}
              </label>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder={isMarathi ? 'उदा. ' : 'e.g. Please send digital PDF proof before printing, need double-sided spot UV...'}
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* 5. PRICING & ACTION CHECKOUT BAR */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">
                  {isMarathi ? 'एकूण अंदाजित किंमत' : 'Estimated Total (Direct Factory)'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-rose-600">
                    ₹{calculatedTotal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    (₹{(calculatedTotal / selectedQuantity).toFixed(2)} / unit)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 sm:flex-initial bg-rose-600 hover:bg-rose-500 text-white font-semibold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isMarathi ? 'कार्टमध्ये जोडा' : 'Add to Cart'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="Order on WhatsApp / Send Custom Specs"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>{isMarathi ? 'व्हॉट्सॲप ऑर्डर' : 'WhatsApp Order'}</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center font-normal">
              {isMarathi 
                ? '💡 मोठी ब्रोशर फाईल किंवा विशेष कस्टमायझेशनसाठी थेट व्हॉट्सॲपवर संपर्क साधा.' 
                : '💡 Have large files or custom booklet specifications? Use WhatsApp Order for instant executive review.'}
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};
