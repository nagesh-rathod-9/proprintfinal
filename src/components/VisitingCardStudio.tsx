import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SelectedProductCustomization, Product } from '../types';
import { WhatsAppModal } from './WhatsAppModal';
import { 
  Sparkles, 
  Upload, 
  RotateCw, 
  Check, 
  ShoppingBag, 
  MessageSquare, 
  QrCode, 
  Eye, 
  CreditCard,
  Layers,
  Phone,
  Mail,
  MapPin,
  Globe,
  Sliders,
  Palette,
  Trash2,
  Tag,
  Scissors,
  Circle,
  Square,
  Hexagon,
  Star,
  Gift,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

// ==========================================
// 1. VISITING CARD TYPES
// ==========================================
export interface VisitingCardTypeOption {
  id: string;
  name: string;
  nameMr: string;
  badge: string;
  badgeMr: string;
  baseRatePer100: number;
  description: string;
  descriptionMr: string;
  textureClass: string;
  accentColor: string;
  foilColor?: string;
  isTransparent?: boolean;
}

export const VISITING_CARD_TYPES: VisitingCardTypeOption[] = [
  {
    id: 'matte-350',
    name: '350 GSM Royal Matte',
    nameMr: '३५० GSM रॉयल मॅट कार्ड',
    badge: 'Most Popular',
    badgeMr: 'सर्वाधिक पसंती',
    baseRatePer100: 250,
    description: 'High-density European art card with non-glare velvet matte finish.',
    descriptionMr: 'युरोपियन आर्ट बोर्डवर नॉन-रिफ्लेक्टीव्ह स्मूथ मॅट फिनिश.',
    textureClass: 'bg-slate-900 text-white',
    accentColor: 'rose'
  },
  {
    id: 'velvet-touch',
    name: 'Velvet Soft-Touch Laminated',
    nameMr: 'मखमली वेल्वेट सॉफ्ट-टच लेमिनेशन',
    badge: 'Ultra Luxe Feel',
    badgeMr: 'रेशमी मऊ स्पर्श',
    baseRatePer100: 380,
    description: 'Sensory peach-fuzz velvet lamination for premium corporate presence.',
    descriptionMr: 'अल्ट्रा-स्मूथ रेशमी स्पर्श देणारे हाय-एंड लक्झरी लेमिनेशन.',
    textureClass: 'bg-neutral-900 text-amber-100',
    accentColor: 'amber'
  },
  {
    id: 'gold-foil',
    name: 'Raised Gold / Copper Foil',
    nameMr: 'रॉयल मेटॅलिक गोल्ड फॉइल',
    badge: 'Metallic Mirror',
    badgeMr: 'चमकदार सोनेरी फॉइल',
    baseRatePer100: 550,
    description: 'Reflective mirror-finish metallic hot foil stamping on name & logo.',
    descriptionMr: 'लोगो व नावावर अस्सल सोनेरी चमक देणारे मेटॅलिक फॉइल.',
    textureClass: 'bg-black text-amber-300',
    accentColor: 'amber',
    foilColor: '#e5a93c'
  },
  {
    id: 'spot-uv',
    name: 'Spot UV Gloss Selective Coating',
    nameMr: 'स्पॉट UV ग्लॉस चकचकीत कोटिंग',
    badge: '3D High Gloss',
    badgeMr: '३D उठावदार ग्लॉस',
    baseRatePer100: 420,
    description: 'Raised glass-like gloss layer over matte card background for 3D contrast.',
    descriptionMr: 'मॅट पार्श्वभूमीवर लोगो व टेक्स्टसाठी उठावदार हाय-ग्लॉस चमक.',
    textureClass: 'bg-slate-950 text-white',
    accentColor: 'cyan'
  },
  {
    id: 'frosted-pvc',
    name: 'Translucent Frosted PVC Plastic',
    nameMr: 'पारदर्शक वॉटरप्रूफ PVC कार्ड',
    badge: 'Water & Tearproof',
    badgeMr: '१००% वॉटरप्रूफ',
    baseRatePer100: 600,
    description: '500-micron waterproof, untearable frosted see-through plastic.',
    descriptionMr: 'फाटणार नाही असे टिकाऊ, वॉटरप्रूफ सेमी-ट्रान्सपरंट प्लास्टिक कार्ड.',
    textureClass: 'bg-slate-100/80 backdrop-blur-md text-slate-900 border-2 border-white/60',
    accentColor: 'indigo',
    isTransparent: true
  },
  {
    id: 'eco-kraft',
    name: 'Rustic Organic Kraft (400 GSM)',
    nameMr: 'ऑरगॅनिक क्राफ्ट विंटेज बोर्ड (४०० GSM)',
    badge: '100% Eco-Friendly',
    badgeMr: 'पर्यावरणपूरक विंटेज',
    baseRatePer100: 320,
    description: 'Unbleached natural textured earth board with rich organic aesthetic.',
    descriptionMr: 'नॅचरल विंटेज टेक्सचर असलेले पर्यावरणपूरक मजबूत क्राफ्ट बोर्ड.',
    textureClass: 'bg-[#c5a072] text-[#332211] shadow-inner',
    accentColor: 'amber'
  },
  {
    id: 'embossed',
    name: 'Letterpress Deboss / Embossed',
    nameMr: 'उठावदार एम्बॉस्ड / लेटरप्रेस',
    badge: 'Deep Texture',
    badgeMr: 'खोल उठावदार अक्षरे',
    baseRatePer100: 490,
    description: 'Deep 3D sculpted impression on premium 450 GSM cotton paper.',
    descriptionMr: 'हस्तनिर्मित कॉटन पेपरवर खोल उठावदार अक्षरे व अक्षरांचा स्पर्श.',
    textureClass: 'bg-[#faf7f2] text-slate-900 shadow-md',
    accentColor: 'rose'
  },
  {
    id: 'magnetic',
    name: 'Magnetic Executive Card',
    nameMr: 'मॅग्नेटिक एक्झिक्युटिव्ह कार्ड',
    badge: 'Sticks to Metal',
    badgeMr: 'चुंबकीय बॅकिंग',
    baseRatePer100: 650,
    description: 'Flexible magnetic back sheet ideal for service brands & clinic reminders.',
    descriptionMr: 'धातूवर/फ्रिजवर चिकटणारे लवचिक चुंबकीय बॅकिंग कार्ड.',
    textureClass: 'bg-slate-950 text-white border-2 border-rose-500',
    accentColor: 'rose'
  }
];

// ==========================================
// 2. DIE-CUT STICKER TYPES & SHAPES
// ==========================================
export interface StickerTypeOption {
  id: string;
  name: string;
  nameMr: string;
  badge: string;
  badgeMr: string;
  baseRatePer100: number;
  description: string;
  descriptionMr: string;
  finishStyle: string;
  previewBg: string;
}

export const STICKER_TYPES: StickerTypeOption[] = [
  {
    id: 'holographic',
    name: 'Holographic Rainbow Prism Vinyl',
    nameMr: 'होलोग्राफिक रेनबो प्रिझम स्टिकर',
    badge: 'Ultra Shimmer',
    badgeMr: 'इंद्रधनुषी चमक',
    baseRatePer100: 349,
    description: 'Eye-catching dynamic rainbow color-shifting metallic vinyl sticker.',
    descriptionMr: 'प्रकाशात रंग बदलणारे आकर्षक इंद्रधनुषी होलोग्राफिक स्टिकर.',
    finishStyle: 'bg-cyan-500/20 backdrop-blur-xs',
    previewBg: 'bg-cyan-500'
  },
  {
    id: 'waterproof-gloss',
    name: '100% Waterproof Glossy Vinyl',
    nameMr: 'वॉटरप्रूफ हाय-ग्लॉस विनाइल',
    badge: 'Outdoor Ready',
    badgeMr: '१००% वॉटरप्रूफ',
    baseRatePer100: 249,
    description: 'Heavy duty laminated vinyl resistant to water, sun, scratches & dishwashers.',
    descriptionMr: 'पाणी, ऊन आणि ओरखड्यांना न जुमानणारे मजबूत चकचकीत विनाइल.',
    finishStyle: 'bg-white shadow-xl',
    previewBg: 'bg-white'
  },
  {
    id: 'matte-velvet-sticker',
    name: 'Matte Soft-Touch Vinyl',
    nameMr: 'मॅट सॉफ्ट-टच विनाइल स्टिकर',
    badge: 'Anti-Glare Smooth',
    badgeMr: 'स्मूथ मॅट फिनिश',
    baseRatePer100: 279,
    description: 'Silky non-reflective matte finish for modern minimalist brand stickers.',
    descriptionMr: 'अत्यंत आकर्षक व सौम्य स्पर्श देणारे नॉन-रिफ्लेक्टीव्ह मॅट स्टिकर.',
    finishStyle: 'bg-slate-900 text-white',
    previewBg: 'bg-slate-900'
  },
  {
    id: 'clear-transparent',
    name: 'Ultra-Clear Transparent Vinyl',
    nameMr: 'पारदर्शक क्लिअर विनाइल स्टिकर',
    badge: 'See-Through Glass',
    badgeMr: 'पारदर्शक बॅकग्राउंड',
    baseRatePer100: 299,
    description: 'Crystal clear see-through background with opaque white base layer printing.',
    descriptionMr: 'काच व बाटल्यांसाठी पारदर्शक पार्श्वभूमी असलेले क्लिअर स्टिकर.',
    finishStyle: 'bg-white/40 backdrop-blur-md border border-white/60',
    previewBg: 'bg-white/30'
  },
  {
    id: 'kraft-sticker',
    name: 'Rustic Organic Kraft Label',
    nameMr: 'ऑरगॅनिक क्राफ्ट पेपर लेबल',
    badge: 'Eco Handmade',
    badgeMr: 'पर्यावरणपूरक विंटेज',
    baseRatePer100: 229,
    description: 'Natural brown unbleached kraft paper sticker for artisanal jars & packaging.',
    descriptionMr: 'हस्तनिर्मित उत्पादने व बरण्यांसाठी नैसर्गिक तपकिरी क्राफ्ट स्टिकर.',
    finishStyle: 'bg-[#d0a775] text-[#2c1a0e]',
    previewBg: 'bg-[#c89e6c]'
  },
  {
    id: 'gold-foil-sticker',
    name: 'Luxury Gold Foil Embellished',
    nameMr: 'लक्झरी गोल्ड फॉइल स्टिकर',
    badge: 'Mirror Gold Edge',
    badgeMr: 'सोनेरी फॉइल बॉर्डर',
    baseRatePer100: 399,
    description: 'Reflective gold metallic hot stamp on deep black or white vinyl.',
    descriptionMr: 'रॉयल सोनेरी फॉइल स्टॅम्प असलेले हाय-क्लास प्रीमियम स्टिकर.',
    finishStyle: 'bg-slate-950 text-amber-300 border-2 border-amber-400',
    previewBg: 'bg-slate-950'
  }
];

export interface StickerShapeOption {
  id: 'die-cut' | 'circle' | 'square-round' | 'hexagon' | 'star-badge' | 'arch';
  name: string;
  nameMr: string;
  icon: any;
  containerClass: string;
}

export const STICKER_SHAPES: StickerShapeOption[] = [
  {
    id: 'die-cut',
    name: 'Custom Die-Cut Contour',
    nameMr: 'कस्टम डाय-कट (लोगो आकार)',
    icon: Scissors,
    containerClass: 'rounded-[32px] p-6 border-4 border-dashed border-rose-400/80 shadow-2xl'
  },
  {
    id: 'circle',
    name: 'Circle / Round (2" / 3")',
    nameMr: 'गोलाकार (२" किंवा ३")',
    icon: Circle,
    containerClass: 'rounded-full aspect-square p-6 shadow-2xl border-4 border-white/80'
  },
  {
    id: 'square-round',
    name: 'Rounded Rectangle',
    nameMr: 'गोल कोपरे चौकोनी',
    icon: Square,
    containerClass: 'rounded-3xl p-6 shadow-2xl border-4 border-white/80'
  },
  {
    id: 'hexagon',
    name: 'Hexagon Modern Emblem',
    nameMr: 'षटकोनी मॉडर्न बॅज',
    icon: Hexagon,
    containerClass: 'rounded-2xl p-6 shadow-2xl border-4 border-white/80'
  },
  {
    id: 'star-badge',
    name: 'Starburst Seal Badge',
    nameMr: 'स्टारबस्ट सील स्टिकर',
    icon: Star,
    containerClass: 'rounded-[28px] p-6 shadow-2xl border-4 border-amber-400/90'
  }
];

export const VisitingCardStudio: React.FC = () => {
  const { addToCart, isMarathi, products: appProducts = [] } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Main Studio Mode: 'visiting-card' | 'die-cut-sticker' | 'match-combo'
  const [studioMode, setStudioMode] = useState<'visiting-card' | 'die-cut-sticker' | 'match-combo'>('visiting-card');

  // Mobile active customization accordion step (1: Material/Shape, 2: Design, 3: Quantity)
  const [activeStep, setActiveStep] = useState<number>(1);

  // -------------------------------------------------------------
  // VISITING CARD STATE
  // -------------------------------------------------------------
  const [selectedCardType, setSelectedCardType] = useState<VisitingCardTypeOption>(VISITING_CARD_TYPES[0]);
  const [cardOrientation, setCardOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [cardCorners, setCardCorners] = useState<'Square' | 'Rounded (6mm)'>('Square');
  const [cardActiveSide, setCardActiveSide] = useState<'front' | 'back'>('front');

  // Card Content Fields
  const [fullName, setFullName] = useState('Ashish Kothale');
  const [jobTitle, setJobTitle] = useState('Managing Director');
  const [companyName, setCompanyName] = useState('Proprint Media Tech');
  const [phone1, setPhone1] = useState('9322126863');
  const [phone2, setPhone2] = useState('9623458919');
  const [email, setEmail] = useState('askothale@gmail.com');
  const [address, setAddress] = useState('Motikaranja, Chh. Sambhajinagar');
  const [website, setWebsite] = useState('www.proprint.in');
  const [tagline, setTagline] = useState('All Commercial Printing Solutions');
  const [qrType, setQrType] = useState<'whatsapp' | 'vcard' | 'maps' | 'website'>('whatsapp');
  const [cardQuantity, setCardQuantity] = useState<number>(500);

  // -------------------------------------------------------------
  // DIE-CUT STICKER STATE
  // -------------------------------------------------------------
  const [selectedStickerType, setSelectedStickerType] = useState<StickerTypeOption>(STICKER_TYPES[0]);
  const [selectedStickerShape, setSelectedStickerShape] = useState<StickerShapeOption>(STICKER_SHAPES[0]);
  const [stickerBrandName, setStickerBrandName] = useState('PROPRINT');
  const [stickerSubtitle, setStickerSubtitle] = useState('PREMIUM LABELS');
  const [stickerBgColor, setStickerBgColor] = useState<string>('#ffffff');
  const [stickerQuantity, setStickerQuantity] = useState<number>(500);
  const [stickerSize, setStickerSize] = useState<'2x2 inch' | '3x3 inch' | 'Custom Contour'>('2x2 inch');

  // -------------------------------------------------------------
  // SHARED ARTWORK & DIALOG STATE
  // -------------------------------------------------------------
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState('');
  const [logoScale, setLogoScale] = useState(1.0);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  // -------------------------------------------------------------
  // PRICING CALCULATIONS
  // -------------------------------------------------------------
  // Card Price calculation
  const cardQtyDiscount = cardQuantity >= 2000 ? 0.62 : cardQuantity >= 1000 ? 0.70 : cardQuantity >= 500 ? 0.80 : cardQuantity >= 250 ? 0.90 : 1.0;
  const cardCornerAddon = cardCorners.includes('Rounded') ? 50 : 0;
  const cardUnitRate = (selectedCardType.baseRatePer100 / 100) * cardQtyDiscount;
  const cardTotalPrice = Math.round((cardUnitRate * cardQuantity) + cardCornerAddon);

  // Sticker Price calculation
  const stickerQtyDiscount = stickerQuantity >= 5000 ? 0.55 : stickerQuantity >= 2500 ? 0.65 : stickerQuantity >= 1000 ? 0.75 : stickerQuantity >= 500 ? 0.85 : 1.0;
  const stickerUnitRate = (selectedStickerType.baseRatePer100 / 100) * stickerQtyDiscount;
  const stickerTotalPrice = Math.round(stickerUnitRate * stickerQuantity);

  // Match Combo Calculation (500 Cards + 250 Stickers with 15% bundle discount)
  const comboRawPrice = (cardTotalPrice * (500 / cardQuantity)) + (stickerTotalPrice * (250 / stickerQuantity));
  const comboDiscountedPrice = Math.round(comboRawPrice * 0.85);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setUploadedLogo(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Fallback product helper
  const getCatalogProduct = (categoryId: string) => {
    return appProducts.find((p) => p.categoryId === categoryId || p.category === categoryId) || appProducts[0] || ({
      id: `prod-${categoryId}`,
      name: categoryId === 'stickers' ? 'Die-Cut Stickers' : 'Premium Visiting Cards',
      categoryId,
      basePrice: 299,
      image: 'https://i.pinimg.com/736x/cb/dc/0a/cbdc0ad9bf150a0f0ae8bc7373fefc66.jpg',
      rating: 4.9,
      reviewsCount: 15,
      minQuantity: 100,
      defaultQuantity: 500,
      sizes: [],
      finishes: [],
      features: [],
      tags: ['Popular'],
      turnaroundDays: 1,
      isPopular: true,
      isBestSeller: true
    } as Product);
  };

  // Add To Cart Handler
  const handleAddToCart = () => {
    if (studioMode === 'visiting-card') {
      const defaultProduct = getCatalogProduct('visiting-cards');
      const customization: SelectedProductCustomization = {
        quantity: cardQuantity,
        sizeId: cardOrientation === 'landscape' ? '89x51mm' : '51x89mm',
        finishId: selectedCardType.name,
        corners: cardCorners === 'Rounded (6mm)' ? 'Rounded (6mm)' : 'Standard Square',
        uploadedFileName: logoFileName || 'Custom-Card-3D-Artwork.pdf',
        specialInstructions: `3D Visiting Card: Type=${selectedCardType.name}, Name=${fullName}, Role=${jobTitle}, Company=${companyName}, Phone=${phone1}/${phone2}, QR=${qrType}`,
        calculatedPrice: cardTotalPrice,
        turnaroundDays: 1
      };
      addToCart(defaultProduct, customization);
    } else if (studioMode === 'die-cut-sticker') {
      const stickerProduct = getCatalogProduct('stickers');
      const customization: SelectedProductCustomization = {
        quantity: stickerQuantity,
        sizeId: stickerSize,
        finishId: `${selectedStickerType.name} (${selectedStickerShape.name})`,
        corners: 'Rounded (6mm)',
        uploadedFileName: logoFileName || 'Custom-DieCut-Sticker.pdf',
        specialInstructions: `3D Die-Cut Sticker: Material=${selectedStickerType.name}, Shape=${selectedStickerShape.name}, Text=${stickerBrandName} / ${stickerSubtitle}`,
        calculatedPrice: stickerTotalPrice,
        turnaroundDays: 1
      };
      addToCart(stickerProduct, customization);
    } else {
      // Match Combo
      const comboProduct = getCatalogProduct('visiting-cards');
      const customization: SelectedProductCustomization = {
        quantity: 1,
        sizeId: 'Brand Matching Set',
        finishId: `500x ${selectedCardType.name} + 250x ${selectedStickerType.name}`,
        corners: 'Standard Square',
        uploadedFileName: logoFileName || 'Brand-Match-Set.pdf',
        specialInstructions: `Match Combo Pack: 500 Cards (${fullName}, ${companyName}) + 250 Die-Cut Stickers (${stickerBrandName})`,
        calculatedPrice: comboDiscountedPrice,
        turnaroundDays: 2
      };
      addToCart(comboProduct, customization);
    }

    navigate('/cart');
  };

  const handleWhatsAppOrder = () => {
    setIsWhatsAppOpen(true);
  };

  return (
    <div id="3d-customizer-studio" className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8 py-4 sm:py-6 space-y-6 font-marathi">
      
      {/* 1. TOP STUDIO HERO & MODE SWITCHER */}
      <div className="bg-slate-900 text-white p-5 sm:p-8 rounded-3xl shadow-2xl border border-neutral-800 space-y-5">
        
        {/* Header Title & Badges */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{isMarathi ? 'थेट ३D डिझाईन व कस्टमायझर' : 'Live 3D Customizer Studio'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {isMarathi ? 'व्हिजिटिंग कार्ड्स व डाय-कट स्टिकर्स ३D स्टुडिओ' : 'Visiting Cards & Die-Cut Stickers 3D Studio'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl font-normal">
              {isMarathi 
                ? '३५० GSM रॉयल मॅट, वेल्वेट, गोल्ड फॉइल कार्ड्स व वॉटरप्रूफ होलोग्राफिक डाय-कट स्टिकर्स रिअल-टाइम ३D मध्ये कस्टमाइझ करा.'
                : 'Interactive 3D real-time proofing for luxury business cards, waterproof die-cut vinyl stickers, and matched corporate branding sets.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={handleWhatsAppOrder}
              className="px-4 py-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>{isMarathi ? 'व्हॉट्सॲपवर प्रुफ मागा' : 'Get WhatsApp Proof'}</span>
            </button>
          </div>
        </div>

        {/* 2. DEDICATED 3-WAY PRODUCT SELECTOR TABS (Cards | Stickers | Match Combo) */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-black/50 backdrop-blur-md rounded-2xl border border-neutral-700/80">
          
          {/* Tab 1: Visiting Cards */}
          <button
            onClick={() => {
              setStudioMode('visiting-card');
              setActiveStep(1);
            }}
            className={`py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              studioMode === 'visiting-card'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 ring-1 ring-white/30 scale-[1.01]'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-300" />
            <span className="truncate">{isMarathi ? 'व्हिजिटिंग कार्ड्स' : 'Visiting Cards'}</span>
          </button>

          {/* Tab 2: Die-Cut Stickers */}
          <button
            onClick={() => {
              setStudioMode('die-cut-sticker');
              setActiveStep(1);
            }}
            className={`py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              studioMode === 'die-cut-sticker'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 ring-1 ring-white/30 scale-[1.01]'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Tag className="w-4 h-4 text-cyan-300" />
            <span className="truncate">{isMarathi ? 'डाय-कट स्टिकर्स' : 'Die-Cut Stickers'}</span>
          </button>

          {/* Tab 3: Match Combo Pack */}
          <button
            onClick={() => {
              setStudioMode('match-combo');
              setActiveStep(1);
            }}
            className={`py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              studioMode === 'match-combo'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 scale-[1.01]'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Gift className="w-4 h-4 text-amber-200" />
            <div className="flex items-center gap-1.5 truncate">
              <span>{isMarathi ? 'मॅच कॉम्बो सेट' : 'Match Combo Set'}</span>
              <span className="hidden sm:inline text-[9px] bg-black/60 text-amber-300 px-1.5 py-0.5 rounded-full font-black">
                -15%
              </span>
            </div>
          </button>

        </div>

      </div>

      {/* 3. STEP PROGRESSION INDICATOR ON MOBILE */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs text-xs font-bold">
        <button
          onClick={() => setActiveStep(1)}
          className={`flex-1 py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
            activeStep === 1 ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {isMarathi ? '१. प्रकार व मटेरियल' : '1. Material & Finish'}
        </button>
        <div className="w-4 text-center text-slate-300">›</div>
        <button
          onClick={() => setActiveStep(2)}
          className={`flex-1 py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
            activeStep === 2 ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {isMarathi ? '२. माहिती व डिझाईन' : '2. Details & Logo'}
        </button>
        <div className="w-4 text-center text-slate-300">›</div>
        <button
          onClick={() => setActiveStep(3)}
          className={`flex-1 py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
            activeStep === 3 ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {isMarathi ? '३. संख्या व ऑर्डर' : '3. Quantity & Buy'}
        </button>
      </div>

      {/* 4. MAIN WORKSPACE: 3D REAL-TIME CANVAS + CUSTOMIZER PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: LIVE 3D INTERACTIVE VISUAL DISPLAY */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            
            {/* Viewport Control Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 font-extrabold text-slate-900">
                <Eye className="w-4 h-4 text-rose-600" />
                <span>
                  {studioMode === 'visiting-card' 
                    ? (isMarathi ? 'थेट व्हिजिटिंग कार्ड प्रिव्ह्यू' : 'Live 3D Card Preview')
                    : studioMode === 'die-cut-sticker'
                    ? (isMarathi ? 'थेट डाय-कट स्टिकर प्रिव्ह्यू' : 'Live 3D Sticker Peel Preview')
                    : (isMarathi ? 'मॅचिंग ब्रँड कॉम्बो प्रिव्ह्यू' : 'Matching Set 3D Duo Proof')}
                </span>
              </div>

              {studioMode === 'visiting-card' && (
                <button
                  onClick={() => setCardActiveSide(cardActiveSide === 'front' ? 'back' : 'front')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{cardActiveSide === 'front' ? (isMarathi ? 'मागची बाजू पहा' : 'View Back') : (isMarathi ? 'पुढची बाजू पहा' : 'View Front')}</span>
                </button>
              )}
            </div>

            {/* CANVAS WRAPPER */}
            <div className="w-full flex items-center justify-center p-3 sm:p-8 bg-slate-100 rounded-2xl border border-slate-200/90 min-h-[320px] sm:min-h-[380px] overflow-hidden relative">
              
              {/* ---------------------------------------------------- */}
              {/* SCENARIO A: VISITING CARD 3D CANVAS */}
              {/* ---------------------------------------------------- */}
              {studioMode === 'visiting-card' && (
                <div
                  className={`relative transition-all duration-500 shadow-2xl max-w-full ${
                    cardOrientation === 'landscape' 
                      ? 'w-[290px] xs:w-[330px] sm:w-[400px] h-[175px] xs:h-[195px] sm:h-[235px]' 
                      : 'w-[180px] xs:w-[200px] sm:w-[235px] h-[300px] xs:h-[340px] sm:h-[400px]'
                  } ${
                    cardCorners === 'Rounded (6mm)' ? 'rounded-[20px]' : 'rounded-sm'
                  } ${selectedCardType.textureClass} p-3.5 sm:p-5 flex flex-col justify-between overflow-hidden border border-slate-700/40`}
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Foil / UV overlay effects */}
                  {selectedCardType.id === 'gold-foil' && (
                    <div className="absolute inset-0 bg-amber-400/10 pointer-events-none"></div>
                  )}
                  {selectedCardType.id === 'spot-uv' && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none"></div>
                  )}

                  {cardActiveSide === 'front' ? (
                    <>
                      {/* Top Row: Brand & Logo */}
                      <div className="flex items-start justify-between gap-3 relative z-10">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-md bg-rose-600 flex items-center justify-center text-white font-black text-[10px] shadow-xs">
                              {companyName ? companyName.charAt(0).toUpperCase() : 'P'}
                            </div>
                            <h4 className="text-xs sm:text-sm font-black tracking-wider uppercase text-white drop-shadow-xs truncate max-w-[170px] sm:max-w-[220px]">
                              {companyName || 'PROPRINT MEDIA'}
                            </h4>
                          </div>
                          <p className="text-[9px] sm:text-[10px] text-slate-300 font-medium truncate max-w-[180px]">
                            {tagline || 'Commercial Printing Solutions'}
                          </p>
                        </div>

                        {uploadedLogo ? (
                          <img 
                            src={uploadedLogo} 
                            alt="Uploaded Logo" 
                            className="w-10 h-10 object-contain rounded bg-white/10 p-1 border border-white/20"
                            style={{ transform: `scale(${logoScale})` }}
                          />
                        ) : (
                          <div className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/10 border border-white/20 text-slate-200 uppercase tracking-wider">
                            HD OFFSET
                          </div>
                        )}
                      </div>

                      {/* Middle: Name & Title */}
                      <div className="space-y-0.5 my-auto relative z-10">
                        <h3 className={`text-base sm:text-xl font-extrabold tracking-tight truncate ${
                          selectedCardType.id === 'gold-foil' 
                            ? 'text-amber-300 font-serif' 
                            : 'text-white'
                        }`}>
                          {fullName || 'Ashish Kothale'}
                        </h3>
                        <p className="text-[10px] sm:text-xs font-semibold text-rose-400 uppercase tracking-wider truncate">
                          {jobTitle || 'Managing Director'}
                        </p>
                      </div>

                      {/* Bottom Row: Contact info + QR code */}
                      <div className="flex items-end justify-between gap-2 relative z-10 pt-2 border-t border-white/10 text-[9px] sm:text-[10px]">
                        <div className="space-y-1 text-slate-200 max-w-[70%]">
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone className="w-3 h-3 text-rose-400 flex-shrink-0" />
                            <span className="font-mono">{phone1} {phone2 ? `/ ${phone2}` : ''}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3 h-3 text-rose-400 flex-shrink-0" />
                            <span className="truncate">{email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                            <span className="truncate">{address}</span>
                          </div>
                        </div>

                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg p-1 flex items-center justify-center flex-shrink-0 shadow-md">
                          <QrCode className="w-full h-full text-slate-900" />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* CARD BACK VIEW */
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-3 relative z-10 p-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white font-black text-xl shadow-xl">
                        {companyName ? companyName.charAt(0).toUpperCase() : 'P'}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-sm sm:text-base font-black tracking-wider uppercase text-white">
                          {companyName || 'PROPRINT MEDIA'}
                        </h3>
                        <p className="text-xs text-rose-300 font-mono">
                          {website || 'www.proprint.in'}
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-white rounded-xl p-1 shadow-lg">
                        <QrCode className="w-full h-full text-slate-900" />
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Scan to Save Contact
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SCENARIO B: DIE-CUT STICKER 3D CANVAS WITH PEEL EFFECT */}
              {/* ---------------------------------------------------- */}
              {studioMode === 'die-cut-sticker' && (
                <div className="relative flex items-center justify-center">
                  
                  {/* Realistic Peel Depth Shadow */}
                  <div className="absolute -bottom-4 -right-4 w-44 h-44 bg-black/20 rounded-full blur-xl pointer-events-none"></div>

                  {/* Dynamic Die Cut Sticker Object */}
                  <div
                    className={`relative transition-all duration-300 ${selectedStickerShape.containerClass} ${selectedStickerType.finishStyle} w-[240px] sm:w-[280px] h-[240px] sm:h-[280px] flex flex-col items-center justify-center text-center`}
                    style={{
                      backgroundColor: selectedStickerType.id === 'clear-transparent' ? 'transparent' : stickerBgColor
                    }}
                  >
                    {/* Realistic 3D Peeled Corner Edge */}
                    <div className="absolute -top-1 -right-1 w-10 h-10 bg-slate-200 rounded-tr-3xl shadow-md transform rotate-12 opacity-80 pointer-events-none"></div>

                    {/* Center Brand / Artwork */}
                    <div className="space-y-2 z-10 max-w-[200px]">
                      {uploadedLogo ? (
                        <img 
                          src={uploadedLogo} 
                          alt="Sticker Logo" 
                          className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-auto drop-shadow-md"
                          style={{ transform: `scale(${logoScale})` }}
                        />
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg">
                          {stickerBrandName.charAt(0)}
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <h3 className={`text-base sm:text-lg font-black tracking-wider uppercase ${
                          selectedStickerType.id === 'matte-velvet-sticker' || selectedStickerType.id === 'gold-foil-sticker'
                            ? 'text-white' 
                            : 'text-slate-900'
                        }`}>
                          {stickerBrandName || 'PROPRINT'}
                        </h3>
                        <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${
                          selectedStickerType.id === 'matte-velvet-sticker' || selectedStickerType.id === 'gold-foil-sticker'
                            ? 'text-rose-400' 
                            : 'text-rose-600'
                        }`}>
                          {stickerSubtitle || 'PREMIUM LABELS'}
                        </p>
                      </div>

                      <div className="pt-1">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900/10 text-slate-700 tracking-wider">
                          100% Waterproof Vinyl
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SCENARIO C: MATCH COMBO SET (Cards + Stickers Duo) */}
              {/* ---------------------------------------------------- */}
              {studioMode === 'match-combo' && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-4">
                  {/* Micro Visiting Card */}
                  <div className="w-[200px] h-[120px] rounded-xl bg-slate-950 text-white p-3 flex flex-col justify-between shadow-2xl border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-rose-400 uppercase">{companyName || 'PROPRINT'}</span>
                      <span className="text-[8px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">500 Cards</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{fullName || 'Ashish Kothale'}</p>
                      <p className="text-[9px] text-slate-400">{jobTitle || 'Director'}</p>
                    </div>
                    <div className="flex items-center justify-between text-[8px] text-slate-400">
                      <span>{phone1}</span>
                      <QrCode className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Micro Die-Cut Sticker */}
                  <div className="w-[120px] h-[120px] rounded-full bg-white text-slate-900 p-2 flex flex-col items-center justify-center text-center shadow-2xl border-2 border-rose-500 relative">
                    <span className="text-[8px] bg-purple-600 text-white px-1.5 py-0.2 rounded-full font-bold absolute -top-2">250 Stickers</span>
                    <p className="text-xs font-black text-slate-950">{stickerBrandName || 'PROPRINT'}</p>
                    <p className="text-[8px] font-bold text-rose-600">WATERPROOF</p>
                  </div>
                </div>
              )}

            </div>

            {/* Quick Helper Banner */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">
                  {isMarathi ? 'मोफत डिजिटल प्रुफ व WhatsApp मंजुरी' : 'Free Digital PDF Proof via WhatsApp Before Printing'}
                </span>
              </div>
              <span className="font-extrabold text-rose-600 hidden sm:inline">100% Quality Guaranteed</span>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: STEP-BY-STEP CUSTOMIZER CONTROLS */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            
            {/* STEP 1: MATERIAL & FINISH SELECTOR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">1</span>
                  <span>
                    {studioMode === 'visiting-card' 
                      ? (isMarathi ? 'कार्ड मटेरियल व फिनिश निवडा' : 'Select Card Material & Finish')
                      : (isMarathi ? 'स्टिकर मटेरियल व आकार निवडा' : 'Select Sticker Material & Shape')}
                  </span>
                </h3>
              </div>

              {/* A. Visiting Card Material Grid */}
              {studioMode === 'visiting-card' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {VISITING_CARD_TYPES.map((type) => {
                    const isSelected = selectedCardType.id === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedCardType(type)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 relative ${
                          isSelected 
                            ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-500/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                          isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isMarathi ? type.badgeMr : type.badge}
                        </span>
                        <p className="text-xs font-black text-slate-900 leading-tight">
                          {isMarathi ? type.nameMr : type.name}
                        </p>
                        <span className="text-[11px] font-extrabold text-rose-600">₹{type.baseRatePer100}/100</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* B. Die-Cut Sticker Material & Shape Selection */}
              {studioMode === 'die-cut-sticker' && (
                <div className="space-y-3">
                  {/* Sticker Finishes */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STICKER_TYPES.map((type) => {
                      const isSelected = selectedStickerType.id === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedStickerType(type)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 relative ${
                            isSelected 
                              ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-500/20 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                            isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {isMarathi ? type.badgeMr : type.badge}
                          </span>
                          <p className="text-xs font-black text-slate-900 leading-tight">
                            {isMarathi ? type.nameMr : type.name}
                          </p>
                          <span className="text-[11px] font-extrabold text-purple-600">₹{type.baseRatePer100}/100</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Sticker Shapes */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      {isMarathi ? 'स्टिकरचा आकार (Die-Cut Shape)' : 'Select Die-Cut Shape'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {STICKER_SHAPES.map((shp) => {
                        const Icon = shp.icon;
                        const isSelected = selectedStickerShape.id === shp.id;
                        return (
                          <button
                            key={shp.id}
                            type="button"
                            onClick={() => setSelectedStickerShape(shp)}
                            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5 text-amber-400" />
                            <span className="truncate">{isMarathi ? shp.nameMr : shp.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* C. Match Combo Selection */}
              {studioMode === 'match-combo' && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-2">
                  <p className="font-extrabold text-slate-900">
                    🎁 {isMarathi ? '५०० व्हिजिटिंग कार्ड्स + २५० वॉटरप्रूफ स्टिकर्स कॉम्बो' : '500 Visiting Cards + 250 Matching Die-Cut Stickers'}
                  </p>
                  <p className="text-slate-600">
                    {isMarathi 
                      ? 'दोन्ही उत्पादनांवर एकसमान लोगो, फॉन्ट व रंगसंगती जुळवून दिली जाईल. १५% थेट सूट समाविष्ट.' 
                      : 'Uniform brand identity package. Unified color matching and vector logo placement included with 15% combo savings.'}
                  </p>
                </div>
              )}
            </div>

            {/* STEP 2: DETAILS & LOGO ARTWORK */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">2</span>
                <span>{isMarathi ? 'माहिती व लोगो भरा' : 'Customize Branding & Details'}</span>
              </h3>

              {studioMode === 'visiting-card' || studioMode === 'match-combo' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">{isMarathi ? 'पूर्ण नाव' : 'Full Name'}</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ashish Kothale"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">{isMarathi ? 'पदनाम' : 'Designation'}</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Managing Director"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">{isMarathi ? 'कंपनीचे नाव' : 'Company Name'}</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Proprint Media Tech"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">{isMarathi ? 'मोबाईल नंबर' : 'Phone Number'}</label>
                    <input
                      type="tel"
                      value={phone1}
                      onChange={(e) => setPhone1(e.target.value)}
                      placeholder="e.g. 9322126863"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">{isMarathi ? 'ईमेल' : 'Email'}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. askothale@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">{isMarathi ? 'पत्ता' : 'City / Address'}</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Motikaranja, Sambhajinagar"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              ) : (
                /* Sticker Details */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">{isMarathi ? 'स्टिकर मुख्य नाव' : 'Sticker Brand Name'}</label>
                    <input
                      type="text"
                      value={stickerBrandName}
                      onChange={(e) => setStickerBrandName(e.target.value)}
                      placeholder="e.g. PROPRINT"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">{isMarathi ? 'उपनाम / टॅगलाईन' : 'Sticker Subtitle'}</label>
                    <input
                      type="text"
                      value={stickerSubtitle}
                      onChange={(e) => setStickerSubtitle(e.target.value)}
                      placeholder="e.g. PREMIUM LABELS"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* Upload Logo Area */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800">
                    {isMarathi ? 'लोगो किंवा आर्टवर्क अपलोड करा' : 'Upload Vector Logo / File (PNG, JPG, PDF)'}
                  </label>
                  {uploadedLogo && (
                    <button
                      onClick={() => {
                        setUploadedLogo(null);
                        setLogoFileName('');
                      }}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{isMarathi ? 'हटवा' : 'Remove'}</span>
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.cdr,.ai,.psd"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 rounded-2xl border-2 border-dashed border-rose-200 hover:border-rose-500 bg-rose-50/40 hover:bg-rose-50 text-center cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-rose-700">
                    <Upload className="w-4 h-4" />
                    <span>{logoFileName ? `Loaded: ${logoFileName}` : (isMarathi ? 'लोगो फाईल निवडा (PNG / JPG / PDF)' : 'Click to Upload Logo File')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: QUANTITY TIERS & DIRECT ORDER BAR */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">3</span>
                <span>{isMarathi ? 'संख्या निवडा व ऑर्डर करा' : 'Select Quantity & Place Order'}</span>
              </h3>

              {studioMode === 'visiting-card' && (
                <div className="grid grid-cols-5 gap-1.5">
                  {[100, 250, 500, 1000, 2000].map((qty) => (
                    <button
                      key={qty}
                      onClick={() => setCardQuantity(qty)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        cardQuantity === qty
                          ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <div>{qty}</div>
                      <div className="text-[9px] opacity-80">{isMarathi ? 'कार्ड्स' : 'cards'}</div>
                    </button>
                  ))}
                </div>
              )}

              {studioMode === 'die-cut-sticker' && (
                <div className="grid grid-cols-5 gap-1.5">
                  {[100, 250, 500, 1000, 2500].map((qty) => (
                    <button
                      key={qty}
                      onClick={() => setStickerQuantity(qty)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        stickerQuantity === qty
                          ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <div>{qty}</div>
                      <div className="text-[9px] opacity-80">{isMarathi ? 'स्टिकर्स' : 'stickers'}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* ACTION ORDER BOX */}
              <div className="bg-slate-950 text-white p-4 sm:p-5 rounded-2xl space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                      {isMarathi ? 'एकूण रक्कम (सर्व करांसह)' : 'Total All-Inclusive Rate'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-rose-400">
                        ₹{(studioMode === 'visiting-card' 
                          ? cardTotalPrice 
                          : studioMode === 'die-cut-sticker' 
                          ? stickerTotalPrice 
                          : comboDiscountedPrice).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400">
                        {studioMode === 'visiting-card' 
                          ? `(₹${(cardTotalPrice / cardQuantity).toFixed(2)}/card)`
                          : studioMode === 'die-cut-sticker'
                          ? `(₹${(stickerTotalPrice / stickerQuantity).toFixed(2)}/pc)`
                          : '(15% Combo Saved)'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-slate-400">
                    <span className="block text-emerald-400 font-bold">⚡ {isMarathi ? '२४-४८ तासांत डिस्पॅच' : '24h Dispatch'}</span>
                    <span>{isMarathi ? 'थेट कारखाना दर' : 'Factory Direct'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#FF0038] hover:bg-rose-500 text-white font-black py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isMarathi ? 'बॅगमध्ये जोडा' : 'Add to Bag'}</span>
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-extrabold py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>{isMarathi ? 'व्हॉट्सॲप ऑर्डर' : 'WhatsApp Order'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* WHATSAPP INSTANT PROOF MODAL */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        defaultMessage={`Hello Proprint! I customized a 3D Studio item: Mode=${studioMode}, Card=${selectedCardType.name}, Sticker=${selectedStickerType.name}, Name=${fullName || stickerBrandName}, Company=${companyName}, Quantity=${studioMode === 'visiting-card' ? cardQuantity : stickerQuantity}. Please confirm proof.`}
      />

    </div>
  );
};
