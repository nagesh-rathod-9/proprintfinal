import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Printer, 
  ChevronRight, 
  Sparkles,
  Award,
  CheckCircle2,
  Box,
  Layers,
  FileText
} from 'lucide-react';
import { ProprintLogo } from './ProprintLogo';
import { useApp } from '../context/AppContext';
import { openDirectWhatsApp, getWhatsAppUrl } from '../utils/whatsapp';

export const Footer: React.FC = () => {
  const { isMarathi } = useApp();

  return (
    <footer className="w-full bg-[#090D16] text-slate-300 font-marathi border-t border-slate-800/80">
      
      {/* 1. TOP ASSURANCE & TRUST STRIP */}
      <div className="border-b border-slate-800/80 bg-[#0B1120] py-6 sm:py-8 px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-[1320px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
          
          {/* Feature 1 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-[#FF0038] flex items-center justify-center shrink-0 border border-rose-500/20 shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                {isMarathi ? '१००% इन-हाऊस ऑफसेट' : '100% In-House Press'}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium leading-snug mt-0.5">
                {isMarathi ? 'मध्यस्थांशिवाय थेट कारखाना' : 'Direct Factory Rates'}
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                {isMarathi ? '२४-४८ तासांत डिस्पॅच' : '24-48h Fast Dispatch'}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium leading-snug mt-0.5">
                {isMarathi ? 'महाराष्ट्रभर एक्स्प्रेस डिलिव्हरी' : 'Express Delivery across MH'}
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                {isMarathi ? 'कलर मॅचिंग गॅरंटी' : 'Color Matching Guarantee'}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium leading-snug mt-0.5">
                {isMarathi ? 'अचूक CMYK व पॅन्टोन' : 'CMYK & Pantone Precision'}
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                {isMarathi ? 'लाईव्ह व्हॉट्सॲप सपोर्ट' : 'Instant WhatsApp Desk'}
              </h4>
              <p className="text-[11px] text-slate-400 font-medium leading-snug mt-0.5">
                {isMarathi ? 'थेट प्री-प्रेस डिझायनर सहाय्य' : 'Live Pre-Press Proofing'}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* Brand & Address Column (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-5">
          <ProprintLogo size="lg" variant="light" showTagline={true} />
          
          <p className="text-xs text-slate-400 leading-relaxed max-w-md font-normal">
            {isMarathi 
              ? 'प्रोप्रींट - छत्रपती संभाजीनगर (औरंगाबाद) येथील अग्रगण्य कमर्शियल प्रिंटिंग प्रेस. व्हिजिटिंग कार्ड्स, पॅकेजिंग बॉक्सेस, स्टिकर्स, ब्रोशर्स आणि कस्टम प्रिंटिंगचे खात्रीशीर उत्पादक.'
              : 'Proprint Media Tech is a premier commercial offset & digital print studio based in Chhatrapati Sambhajinagar (Aurangabad). Specializing in luxury business cards, custom packaging boxes, waterproof stickers, and outdoor branding.'}
          </p>

          {/* Direct Contacts List */}
          <div className="space-y-2.5 text-xs text-slate-300 font-medium pt-1">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#FF0038] shrink-0 mt-0.5" />
              <span className="text-slate-300">
                Sushila Arcade, Motikaranja, Chhatrapati Sambhajinagar (Aurangabad), Maharashtra 431001
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#FF0038] shrink-0" />
              <span className="font-mono text-slate-200">
                Ashish Kothale: <strong>9322126863</strong> / <strong>9623458919</strong>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#FF0038] shrink-0" />
              <span className="font-mono text-slate-300">askothale@gmail.com</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#FF0038] shrink-0" />
              <span className="text-slate-300">Monday – Saturday: 9:30 AM – 8:30 PM (Sunday Closed)</span>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-3.5">
          <h4 className="text-xs font-black uppercase tracking-wider text-white">
            {isMarathi ? 'जलद दुवे' : 'Studio Links'}
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li>
              <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-[#FF0038]" />
                <span>{isMarathi ? 'मुख्यपृष्ठ' : 'Home'}</span>
              </Link>
            </li>
            <li>
              <Link to="/visiting-cards" className="hover:text-white transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-[#FF0038]" />
                <span>{isMarathi ? '३D व्हिजिटिंग कार्ड स्टुडिओ' : '3D Visiting Cards'}</span>
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-[#FF0038]" />
                <span>{isMarathi ? 'सर्व उत्पादने' : 'All Products'}</span>
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-white transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-[#FF0038]" />
                <span>{isMarathi ? 'माझ्या ऑर्डर्स' : 'My Orders'}</span>
              </Link>
            </li>
            <li>
              <Link to="/portfolio" className="hover:text-white transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-[#FF0038]" />
                <span>{isMarathi ? 'डिझाईन पोर्टफोलिओ' : 'Design Portfolio'}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Print Specialties (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-3.5">
          <h4 className="text-xs font-black uppercase tracking-wider text-white">
            {isMarathi ? 'मुख्य उत्पादने' : 'Print Specialties'}
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li>
              <Link to="/products?cat=business-cards" className="hover:text-white transition-colors block">
                • Velvet Matte Cards
              </Link>
            </li>
            <li>
              <Link to="/products?cat=packaging" className="hover:text-white transition-colors block">
                • Rigid Packaging Boxes
              </Link>
            </li>
            <li>
              <Link to="/products?cat=stickers" className="hover:text-white transition-colors block">
                • Die-Cut Vinyl Stickers
              </Link>
            </li>
            <li>
              <Link to="/products?cat=brochures" className="hover:text-white transition-colors block">
                • Glossy Multi-Fold Brochures
              </Link>
            </li>
            <li>
              <Link to="/products?cat=banners" className="hover:text-white transition-colors block">
                • Roll-Up Standees & Banners
              </Link>
            </li>
            <li>
              <Link to="/products?cat=calendar" className="hover:text-white transition-colors block">
                • Table & Wall Calendars
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: WhatsApp Direct Connect Card (3 cols on lg) */}
        <div className="lg:col-span-3 space-y-3.5">
          <h4 className="text-xs font-black uppercase tracking-wider text-white">
            {isMarathi ? 'थेट व्हॉट्सॲप डेस्क' : 'Instant WhatsApp Desk'}
          </h4>
          
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {isMarathi 
                ? 'तुमचे डिझाईन किंवा आकार पाठवून थेट ५ मिनिटांत दरपत्रक व प्री-प्रेस मंजुरी मिळवा.' 
                : 'Send your design CDR/PDF or size requirements for an instant customized estimate.'}
            </p>

            <a
              href={getWhatsAppUrl("Hello Proprint! I would like to inquire about printing rates, bulk quantities, and paper stock availability.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-slate-950 font-black text-xs px-4 py-3 rounded-xl transition-all shadow-md shadow-[#25D366]/20 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Chat: 9322126863</span>
            </a>

            <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2.5 flex items-center justify-between">
              <span className="font-mono text-slate-400">GSTIN Registered</span>
              <span className="text-emerald-400 font-bold">✓ Tax Invoice</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. PAYMENT & LOGISTICS BADGES */}
      <div className="border-t border-slate-900 bg-[#070A12] py-4 px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <span>Accepted Payments: UPI (GPay/PhonePe), NetBanking, Debit/Credit Cards & NEFT</span>
          </div>

          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-slate-400" />
            <span>Logistics Partners: DTDC, Blue Dart, Professional Couriers & Express Cargo</span>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM COPYRIGHT STRIP */}
      <div className="border-t border-slate-950 bg-black py-4 px-4 sm:px-6 md:px-8 text-center text-xs text-slate-500 font-marathi">
        <div className="w-full max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Proprint Media Tech. All Rights Reserved.</p>
          <p className="text-slate-400">
            Crafted for Commercial Offset & Digital Printing Excellence • Chhatrapati Sambhajinagar, Maharashtra
          </p>
        </div>
      </div>

    </footer>
  );
};

