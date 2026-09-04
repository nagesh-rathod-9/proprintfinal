import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Check, 
  Truck, 
  ShieldCheck, 
  Share2, 
  Heart, 
  ChevronUp, 
  ChevronDown, 
  Minus, 
  Plus, 
  Sparkles, 
  FileText, 
  Printer, 
  Layers, 
  Clock, 
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
  Info,
  UploadCloud,
  CheckCircle2,
  Package,
  SlidersHorizontal,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { WhatsAppModal } from '../components/WhatsAppModal';
import { ReviewCard } from '../components/ReviewCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isWishlisted, showToast, isMarathi, currentUser } = useApp();

  const product = products.find((p) => p.id === id) || products[0];

  // Gallery image selection
  const gallery = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [
        product.image,
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80'
      ];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Finishes options with reliable metadata
  const finishOptions = product.finishes && product.finishes.length > 0
    ? product.finishes
    : [
        { id: 'art-matt-270', name: 'Art Card Matt 270 gsm', gsm: '270 GSM', priceMultiplier: 1.0, description: 'Standard quality smooth matte coated card stock' },
        { id: 'art-matt-350', name: 'Art Card Matt 350 gsm', gsm: '350 GSM', priceMultiplier: 1.1, description: 'Heavy premium smooth matte coated card stock' },
        { id: 'eco-ivory-410', name: 'Economical Ivory 410 gsm', gsm: '410 GSM', priceMultiplier: 1.15, description: 'Extra stiff off-white ivory uncoated paper board' },
        { id: 'ivory-370', name: 'Ivory 370 gsm', gsm: '370 GSM', priceMultiplier: 1.2, description: 'Luxury rich warm ivory smooth finish card' },
        { id: 'thick-card-450', name: 'Thick Card 450 gsm', gsm: '450 GSM', priceMultiplier: 1.35, description: 'Ultra heavy duty rigid premium card board' },
        { id: 'gloss-lam-350', name: '350 GSM Gloss Lamination', gsm: '350 GSM', priceMultiplier: 1.15, description: 'High-gloss protective shiny laminated surface' },
        { id: 'velvet-matte-350', name: '350 GSM Velvet Touch Matte', gsm: '350 GSM', priceMultiplier: 1.25, description: 'Soft-touch velvet luxury non-reflective texture' }
      ];

  const [selectedFinish, setSelectedFinish] = useState(finishOptions[0]);

  // Size / Specs Pills
  const sizeOptions = product.sizes && product.sizes.length > 0
    ? product.sizes
    : [
        { id: 'std-size', name: '93 x 54 mm (Standard Visiting Card)', dimension: '93 x 54 mm', priceMultiplier: 1.0 },
        { id: 'euro-size', name: '85 x 55 mm (European Size)', dimension: '85 x 55 mm', priceMultiplier: 1.05 },
        { id: 'square-size', name: '65 x 65 mm (Square Card)', dimension: '65 x 65 mm', priceMultiplier: 1.15 },
        { id: 'custom-size', name: 'Custom Die-Cut Shape', dimension: 'Contour Cut', priceMultiplier: 1.3 }
      ];

  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);

  // Quantity selection - automatically include Single (1) or Bulk (100, 500, 1000) if configured
  const quantityTiers = useMemo(() => {
    let baseTiers = product.quantityOptions && product.quantityOptions.length > 0
      ? [...product.quantityOptions]
      : [100, 250, 500, 1000, 2000, 5000];

    if (product.singlePrice && !baseTiers.includes(1)) {
      baseTiers = [1, ...baseTiers];
    }
    if (product.bulkPrice100 && !baseTiers.includes(100)) {
      baseTiers.push(100);
    }
    if (product.bulkPrice500 && !baseTiers.includes(500)) {
      baseTiers.push(500);
    }
    if (product.bulkPrice1000 && !baseTiers.includes(1000)) {
      baseTiers.push(1000);
    }

    return Array.from(new Set(baseTiers)).sort((a, b) => a - b);
  }, [product]);

  const [selectedQuantity, setSelectedQuantity] = useState(
    product.defaultQuantity || (quantityTiers.includes(500) ? 500 : quantityTiers[0]) || 100
  );

  // File Upload State
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<number | undefined>(undefined);
  const [uploadedIsImage, setUploadedIsImage] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'delivery' | 'reviews'>('features');
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  // Price Calculation with Single and Bulk Price Tiers
  const finishMultiplier = selectedFinish.priceMultiplier || 1.0;
  const sizeMultiplier = selectedSize.priceMultiplier || 1.0;

  // Determine base total for selectedQuantity based on configured single/bulk rates
  let rawBaseTotal = 0;
  let isBulkRateActive = false;
  let bulkDiscountLabel = '';

  if (selectedQuantity === 1 && product.singlePrice) {
    rawBaseTotal = product.singlePrice;
    bulkDiscountLabel = 'Single Piece Rate';
  } else if (selectedQuantity === 100 && product.bulkPrice100) {
    rawBaseTotal = product.bulkPrice100;
    isBulkRateActive = true;
    bulkDiscountLabel = '100 Qty Bulk Rate Applied';
  } else if (selectedQuantity === 500 && product.bulkPrice500) {
    rawBaseTotal = product.bulkPrice500;
    isBulkRateActive = true;
    bulkDiscountLabel = '500 Qty Bulk Rate Applied';
  } else if (selectedQuantity === 1000 && product.bulkPrice1000) {
    rawBaseTotal = product.bulkPrice1000;
    isBulkRateActive = true;
    bulkDiscountLabel = '1,000 Qty Bulk Rate Applied';
  } else if (selectedQuantity >= 1000 && product.bulkPrice1000) {
    rawBaseTotal = (product.bulkPrice1000 / 1000) * selectedQuantity;
    isBulkRateActive = true;
    bulkDiscountLabel = '1,000+ Volume Tier Applied';
  } else if (selectedQuantity >= 500 && product.bulkPrice500) {
    rawBaseTotal = (product.bulkPrice500 / 500) * selectedQuantity;
    isBulkRateActive = true;
    bulkDiscountLabel = '500+ Volume Tier Applied';
  } else if (selectedQuantity >= 100 && product.bulkPrice100) {
    rawBaseTotal = (product.bulkPrice100 / 100) * selectedQuantity;
    isBulkRateActive = true;
    bulkDiscountLabel = '100+ Volume Tier Applied';
  } else if (selectedQuantity < 100 && product.singlePrice) {
    rawBaseTotal = product.singlePrice * selectedQuantity;
  } else {
    const unitBase = product.basePrice / (product.defaultQuantity || 500);
    rawBaseTotal = unitBase * selectedQuantity;
  }

  const calculatedPrice = Math.max(1, Math.round(rawBaseTotal * finishMultiplier * sizeMultiplier));
  const originalPrice = Math.round(calculatedPrice * 1.25);
  const perUnitPrice = (calculatedPrice / selectedQuantity).toFixed(2);
  const discountPercent = 20;

  // Scroll gallery handlers
  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1));
  };
  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0));
  };

  const handlePutOrderOnWhatsApp = () => {
    const message = 
`*PROPRINT - DIRECT ORDER ON WHATSAPP*
----------------------------------------
📦 *Product:* ${isMarathi && product.nameMr ? product.nameMr : product.name}
🔢 *Quantity:* ${selectedQuantity} ${product.unit || 'units'}
📐 *Size / Dimensions:* ${selectedSize.name} (${selectedSize.dimension || 'Standard'})
📄 *Paper Stock & Finish:* ${selectedFinish.name} (${selectedFinish.gsm || 'Premium Stock'})
💰 *Estimated Total:* ₹${calculatedPrice.toLocaleString('en-IN')} (₹${perUnitPrice}/unit)
⚡ *Turnaround:* ${product.turnaroundDays || 1} Day Dispatch
📁 *Artwork File:* ${uploadedFileName ? `Attached File: ${uploadedFileName} (Uploaded to server)` : 'Will send artwork file on WhatsApp'}
📍 *Location:* Chhatrapati Sambhajinagar / Maharashtra
----------------------------------------
Hello Proprint Team, please confirm this order, share the digital proof, and provide payment details.`;

    const phone = '919322126863';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp directly
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    showToast(isMarathi ? 'व्हॉट्सॲपवर ऑर्डर तपशील उघडत आहे...' : 'Opening WhatsApp with your order details...', 'success');
  };

  const handleAddToCart = () => {
    addToCart(product, {
      quantity: selectedQuantity,
      sizeId: selectedSize.id,
      finishId: selectedFinish.id,
      corners: 'Standard Square',
      calculatedPrice,
      turnaroundDays: product.turnaroundDays || 1,
      uploadedFileName: uploadedFileName || undefined,
      uploadedFileUrl: uploadedFileUrl || undefined,
      uploadedFileSize,
      uploadedIsImage,
      specialInstructions: `${selectedFinish.name} • ${selectedSize.name}${uploadedFileName ? ` • Artwork: ${uploadedFileName}` : ''}`
    });
    showToast(`Added ${selectedQuantity}x ${product.name} to your cart!`, 'success');
  };

  const handleInstantBuy = () => {
    handleAddToCart();
    if (!currentUser) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setUploadedFileSize(file.size);
      const isImg = file.type.startsWith('image/');
      setUploadedIsImage(isImg);

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
          showToast(`File "${file.name}" saved to /uploads on press server!`, 'success');
        }
      } catch (err) {
        console.warn('Upload fallback:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Similar Products in the same category or best sellers
  const similarProducts = products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .concat(products.filter((p) => p.id !== product.id && p.categoryId !== product.categoryId))
    .slice(0, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product.finishes && product.finishes.length > 0) {
      setSelectedFinish(product.finishes[0]);
    }
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    if (product.defaultQuantity) {
      setSelectedQuantity(product.defaultQuantity);
    }
  }, [id, product]);

  return (
    <div className="bg-[#FAFBFD] min-h-screen text-slate-900 font-sans pb-28 sm:pb-20">
      
      {/* Top Breadcrumb Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 border-b border-slate-200/80 bg-white sm:bg-transparent">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <Link to="/" className="hover:text-slate-900 transition-colors font-semibold">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-slate-900 transition-colors font-semibold">Shop</Link>
            <span>/</span>
            <span className="text-[#FF0038] font-bold uppercase tracking-wider text-[11px]">
              {product.category || 'Offset Printing'}
            </span>
            <span className="hidden sm:inline">/</span>
            <span className="text-slate-900 font-bold truncate max-w-xs hidden sm:inline">{product.name}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => toggleWishlist(product)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-rose-300 text-slate-700 hover:text-[#FF0038] transition-colors cursor-pointer shadow-2xs text-xs font-bold"
            >
              <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? 'fill-[#FF0038] text-[#FF0038]' : ''}`} />
              <span className="hidden sm:inline">Wishlist</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Product link copied to clipboard!', 'info');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:text-slate-900 text-slate-600 transition-colors cursor-pointer shadow-2xs text-xs font-bold"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ========================================================= */}
          {/* LEFT SIDE: Thumbnails & Main Showcase Display (7 cols)    */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 sm:gap-6">
            
            {/* Thumbnails Column (Horizontal scroll on mobile, Vertical on desktop) */}
            <div className="flex sm:flex-col items-center gap-2.5 sm:gap-3 shrink-0 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-none no-scrollbar">
              <button
                onClick={handlePrevImage}
                className="hidden sm:flex w-8 h-8 rounded-xl border border-slate-200 bg-white items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
              >
                <ChevronUp className="w-4 h-4" />
              </button>

              {gallery.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 bg-white transition-all cursor-pointer shrink-0 p-1 ${
                    selectedImageIndex === index
                      ? 'border-[#FF0038] shadow-md ring-2 ring-rose-200'
                      : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </button>
              ))}

              <button
                onClick={handleNextImage}
                className="hidden sm:flex w-8 h-8 rounded-xl border border-slate-200 bg-white items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Main High-Res Mockup Showcase */}
            <div className="flex-1 relative rounded-3xl bg-white border border-slate-200/90 overflow-hidden flex items-center justify-center min-h-[320px] sm:min-h-[480px] p-6 shadow-sm group">
              
              {/* Badge (Best Seller / 24h Express) */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {product.badge || 'PRO PRINT BESTSELLER'}
                </span>
                <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-[#FF0038] rounded-lg text-[10px] font-bold">
                  ⚡ 24 Hr Dispatch
                </span>
              </div>

              {/* Offset Spec pill */}
              <div className="absolute top-4 right-4 z-10 hidden sm:block">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold font-mono">
                  Heidelberg CMYK • 300 DPI
                </span>
              </div>

              {/* Product Hero Image */}
              <img
                src={gallery[selectedImageIndex] || product.image}
                alt={product.name}
                className="w-full max-h-[380px] sm:max-h-[440px] object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
              />

              {/* Proof Verified Bar */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-2">
                <span>Job Code: PRP-{product.id.replace(/[^a-zA-Z0-9]/g, '').slice(-5).toUpperCase()}</span>
                <span className="flex items-center gap-1 text-emerald-600 font-sans font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Pre-Flight Checked
                </span>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: Product Configuration & Instant Ordering     */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Title & Category - Clean typography with no clipping */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-black tracking-widest text-[#FF0038] uppercase block">
                {product.category || 'COMMERCIAL OFFSET & PACKAGING'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {isMarathi && product.nameMr ? product.nameMr : product.name}
              </h1>
              {product.tagline && (
                <p className="text-xs text-slate-500 font-medium">
                  {product.tagline}
                </p>
              )}
            </div>

            {/* Ratings & Guarantee */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1.5 font-black text-slate-800">{product.rating || '4.95'}</span>
              </div>
              <span className="text-slate-400 font-medium">({product.reviewsCount || 290} verified reviews)</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> 100% Press Guarantee
              </span>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  ₹{calculatedPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-base sm:text-lg text-slate-400 line-through font-medium">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-rose-100 text-[#FF0038] text-xs font-black">
                  {discountPercent}% OFF
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Estimated Unit Rate: <strong className="text-slate-900 font-black">₹{perUnitPrice}</strong> / {product.unit || 'unit'}</span>
                <span className="text-emerald-600 font-bold">Includes GST Invoicing</span>
              </div>
            </div>

            {/* Clean, Fast Dropdown Configuration Section */}
            <div className="space-y-4 pt-1">
              {/* 1. Paper Stock Dropdown */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="paper-select" className="text-xs font-black tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#FF0038]" />
                    PAPER STOCK & FINISH
                  </label>
                  {selectedFinish.gsm && (
                    <span className="text-[11px] font-bold text-[#FF0038] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                      {selectedFinish.gsm}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <select
                    id="paper-select"
                    value={selectedFinish.id}
                    onChange={(e) => {
                      const found = finishOptions.find((f) => f.id === e.target.value);
                      if (found) setSelectedFinish(found);
                    }}
                    className="w-full bg-white hover:bg-slate-50/80 text-slate-900 font-bold text-sm rounded-xl border border-slate-300 hover:border-slate-400 focus:border-[#FF0038] focus:ring-3 focus:ring-rose-500/15 py-3 pl-3.5 pr-10 shadow-xs appearance-none transition-all cursor-pointer outline-none"
                  >
                    {finishOptions.map((f) => (
                      <option key={f.id} value={f.id} className="text-slate-900 font-medium py-1">
                        {f.name} {f.gsm ? `(${f.gsm})` : ''} {f.priceMultiplier && f.priceMultiplier > 1 ? `• +${Math.round((f.priceMultiplier - 1) * 100)}%` : ''}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {selectedFinish.description && (
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pl-1 pt-0.5">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{selectedFinish.description}</span>
                  </p>
                )}
              </div>

              {/* 2. Dimensions & Size Dropdown */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="size-select" className="text-xs font-black tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF0038]" />
                    DIMENSIONS & SIZE
                  </label>
                  {selectedSize.dimension && (
                    <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {selectedSize.dimension}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <select
                    id="size-select"
                    value={selectedSize.id}
                    onChange={(e) => {
                      const found = sizeOptions.find((s) => s.id === e.target.value);
                      if (found) setSelectedSize(found);
                    }}
                    className="w-full bg-white hover:bg-slate-50/80 text-slate-900 font-bold text-sm rounded-xl border border-slate-300 hover:border-slate-400 focus:border-[#FF0038] focus:ring-3 focus:ring-rose-500/15 py-3 pl-3.5 pr-10 shadow-xs appearance-none transition-all cursor-pointer outline-none"
                  >
                    {sizeOptions.map((s) => (
                      <option key={s.id} value={s.id} className="text-slate-900 font-medium py-1">
                        {s.name} {s.dimension && !s.name.includes(s.dimension) ? `(${s.dimension})` : ''} {s.priceMultiplier && s.priceMultiplier > 1 ? `• +${Math.round((s.priceMultiplier - 1) * 100)}%` : ''}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Batch Quantity Selector & Stepper */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900">
                  Select Quantity (Units):
                </label>
                <span className="text-[11px] text-emerald-600 font-bold">
                  Higher volume = lower per-unit cost
                </span>
              </div>

              {/* Quantity Tiers */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
                {quantityTiers.map((q) => {
                  const isSelected = selectedQuantity === q;
                  let customBadge = '';
                  if (q === 1 && product.singlePrice) {
                    customBadge = `₹${product.singlePrice}`;
                  } else if (q === 100 && product.bulkPrice100) {
                    customBadge = `₹${product.bulkPrice100}`;
                  } else if (q === 500 && product.bulkPrice500) {
                    customBadge = `₹${product.bulkPrice500}`;
                  } else if (q === 1000 && product.bulkPrice1000) {
                    customBadge = `₹${product.bulkPrice1000}`;
                  }

                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setSelectedQuantity(q)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 flex flex-col items-center gap-0.5 ${
                        isSelected
                          ? 'bg-[#0B0F19] text-white border-[#0B0F19] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <span>{q} {q === 1 ? 'sample' : (product.unit || 'pcs')}</span>
                      {customBadge && (
                        <span className={`text-[9px] font-black px-1 rounded ${
                          isSelected ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {customBadge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bulk Rate Applied Alert */}
              {isBulkRateActive && (
                <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs">
                  <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    {bulkDiscountLabel}
                  </span>
                  <span className="text-emerald-700 font-mono text-[11px] font-bold">
                    Special Batch Rate Applied
                  </span>
                </div>
              )}

              {/* Stepper + Custom Value */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-white px-2 py-1.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setSelectedQuantity((prev) => Math.max(product.minQuantity || 50, prev - (product.minQuantity || 50)))}
                    className="p-1.5 text-slate-400 hover:text-slate-900 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-black text-slate-900 min-w-16 text-center">
                    {selectedQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedQuantity((prev) => prev + (product.minQuantity || 50))}
                    className="p-1.5 text-slate-400 hover:text-slate-900 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs text-slate-500">
                  <span>Min order: <strong className="text-slate-800 font-bold">{product.minQuantity || 50} {product.unit || 'units'}</strong></span>
                </div>
              </div>
            </div>

            {/* Direct Artwork File Upload Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-dashed border-slate-300 hover:border-[#FF0038] transition-colors">
              <label className="cursor-pointer flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#FF0038] shrink-0">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {uploadedFileName ? uploadedFileName : 'Attach Ready Print Artwork (Optional)'}
                    </span>
                    <span className="text-[10px] text-slate-400">PDF, AI, CDR, PSD or ZIP up to 100MB</span>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-700 shrink-0">
                  {uploadedFileName ? 'Change' : 'Browse'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.ai,.cdr,.psd,.zip,.png,.jpg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* WhatsApp Put Order Button - Primary & Direct */}
              <button
                type="button"
                onClick={handlePutOrderOnWhatsApp}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all cursor-pointer text-center flex items-center justify-center gap-2 border border-emerald-500/30"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>{isMarathi ? 'व्हॉट्सॲपवर थेट ऑर्डर द्या (Put Order on WhatsApp)' : 'Put Order on WhatsApp (Direct Specs & Proof)'}</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-semibold text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isMarathi ? 'कार्टमध्ये जोडा' : 'Add to Cart'} • ₹{calculatedPrice.toLocaleString('en-IN')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleInstantBuy}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-semibold text-xs transition-all cursor-pointer text-center"
                >
                  {isMarathi ? 'आत्ताच खरेदी करा' : 'Buy Online'}
                </button>
              </div>

              {/* Secondary Options */}
              <div className="flex items-center gap-2 pt-0.5">
                <Link
                  to="/design-studio"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-medium transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600" />
                  <span>{isMarathi ? '३डी स्टुडिओमध्ये कस्टमाइझ करा' : 'Customize in 3D Studio'}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsWhatsAppOpen(true)}
                  className="py-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="In-App Desk Helper"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">{isMarathi ? 'इतर चौकशी' : 'Help Desk'}</span>
                </button>
              </div>
            </div>

            {/* In stock & Dispatch details */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-800">In Press Batch Production:</span>
                <span>Ready for same-day offset printing run</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span>Free express courier shipping across Maharashtra on orders above ₹999</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* PRODUCT SPECIFICATIONS & REVIEWS TABS                     */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'features'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Key Features & Benefits
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'specs'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Technical Specifications
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'delivery'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Turnaround & Shipping
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'reviews'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Client Reviews ({product.reviewsCount || 290})
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-6">
            {activeTab === 'features' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
                  {product.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {(product.features || [
                    'Heavy-duty commercial grade offset printing',
                    'Direct-to-plate Heidelberg laser dot precision',
                    'Custom die-cutting and crease folding included',
                    'Grease and moisture resistant coating available'
                  ]).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="p-1 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-700 w-1/3">Print Method</td>
                      <td className="py-3 px-4 text-slate-900 font-medium">Heidelberg Speedmaster 4-Color Offset / HP Indigo Digital</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-700">Substrate / Board</td>
                      <td className="py-3 px-4 text-slate-900 font-medium">{selectedFinish.name} ({selectedFinish.gsm || '350 GSM'})</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-700">Color Spectrum</td>
                      <td className="py-3 px-4 text-slate-900 font-medium">CMYK + Pantone Spot Color matching available</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-700">Cutting Tolerance</td>
                      <td className="py-3 px-4 text-slate-900 font-medium">±0.5 mm high-precision computerized die-cutter</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-700">Pre-Flight Artwork Check</td>
                      <td className="py-3 px-4 text-slate-900 font-medium">Complimentary 300 DPI resolution, bleed margin, and color space audit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-4 text-xs text-slate-700 leading-relaxed max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <Clock className="w-5 h-5 text-[#FF0038] mb-2" />
                    <h4 className="font-black text-slate-900 text-sm mb-1">24-48 Hr Dispatch</h4>
                    <p className="text-slate-500">Standard offset orders are printed, cut, packed, and dispatched within 1-2 business days.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <Truck className="w-5 h-5 text-emerald-600 mb-2" />
                    <h4 className="font-black text-slate-900 text-sm mb-1">Express Courier</h4>
                    <p className="text-slate-500">Fast delivery via Bluedart, DTDC, and local transport networks with live SMS tracking.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <Package className="w-5 h-5 text-purple-600 mb-2" />
                    <h4 className="font-black text-slate-900 text-sm mb-1">Heavy-Duty Packaging</h4>
                    <p className="text-slate-500">Shrink-wrapped in waterproof corrugated cartons to prevent corner bending during transit.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-slate-900">4.95</span>
                    <div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">Based on verified press client orders</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'p-rev-1',
                      name: 'Dr. Anand Joshi',
                      role: 'Head of Laboratory',
                      company: 'Joshi Diagnostics',
                      date: '2 days ago',
                      rating: 5,
                      highlight: 'Exact Pantone Color  •  Precision Spot UV',
                      quote: 'Outstanding paper thickness and rich CMYK saturation. Exactly matches our brand hex codes and delivered ahead of schedule.',
                      productOrdered: product.name,
                      isVerified: true
                    },
                    {
                      id: 'p-rev-2',
                      name: 'Pooja Deshmukh',
                      role: 'Creative Director',
                      company: 'Saffron Bakery & Cafe',
                      date: '1 week ago',
                      rating: 5,
                      highlight: 'Food-Grade Certified  •  Zero Leakage',
                      quote: 'The food grade kraft board holds weight perfectly without leaking oil. Fast dispatch to Chh. Sambhajinagar with crisp die-cuts.',
                      productOrdered: product.name,
                      isVerified: true
                    }
                  ].map((rev) => (
                    <ReviewCard key={rev.id} review={rev} isMarathi={isMarathi} />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* SIMILAR PRODUCTS / RECOMMENDATIONS SECTION               */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF0038] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Solutions</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Similar Commercial Printing Products
            </h2>
          </div>

          <Link
            to="/products"
            className="text-xs font-bold text-[#FF0038] hover:text-rose-700 flex items-center gap-1 transition-colors"
          >
            <span>View All Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {similarProducts.map((sim) => (
            <div
              key={sim.id}
              onClick={() => navigate(`/product/${sim.id}`)}
              className="group bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 hover:shadow-xl hover:border-[#FF0038] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative rounded-2xl bg-slate-50 overflow-hidden p-3 mb-3 flex items-center justify-center aspect-square">
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900 text-white rounded-md text-[9px] font-bold">
                  {sim.category || 'Printing'}
                </span>
                <img
                  src={sim.image}
                  alt={sim.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover:text-[#FF0038] transition-colors">
                  {isMarathi && sim.nameMr ? sim.nameMr : sim.name}
                </h3>
                <div className="flex items-center justify-between pt-1.5">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Starting at</span>
                    <span className="font-black text-slate-900 text-sm sm:text-base">
                      ₹{sim.basePrice}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#FF0038] font-bold">
                    Configure →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE STICKY BOTTOM ACTION BAR                          */}
      {/* ========================================================= */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-xl flex items-center justify-between gap-2">
        <div className="min-w-0 pr-1">
          <span className="text-[10px] text-slate-500 block truncate">{selectedQuantity} {product.unit || 'units'}</span>
          <span className="text-base font-bold text-slate-900">₹{calculatedPrice.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handlePutOrderOnWhatsApp}
            className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="py-2.5 px-3.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isMarathi ? 'कार्ट' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

      {/* WhatsApp / Instant Inquiry In-App Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        defaultMessage={`Hi Proprint! I want to inquire about custom bulk rate and specs for: ${product.name}`}
      />

    </div>
  );
};
