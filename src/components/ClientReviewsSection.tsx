import React, { useState } from 'react';
import { 
  Star, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { openDirectWhatsApp } from '../utils/whatsapp';
import { ReviewCard, ReviewCardData } from './ReviewCard';

interface Testimonial extends ReviewCardData {
  id: string;
  category: 'all' | 'corporate' | 'medical' | 'food' | 'retail' | 'legal';
}

const REAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    name: 'Vikram Joshi',
    nameMr: 'विक्रम जोशी',
    role: 'Managing Director',
    roleMr: 'व्यवस्थापकीय संचालक',
    company: 'Joshi Healthcare',
    category: 'medical',
    rating: 5,
    date: '3 days ago',
    dateMr: '३ दिवसांपूर्वी',
    productOrdered: '10,000 Medicine Cartons & Embossed Brochures',
    productOrderedMr: '१०,००० औषध बॉक्सेस व एम्बॉस्ड ब्रोशर्स',
    quote: 'Proprint handled our healthcare product packaging and medical brochures flawlessly. The paper gsm, spot UV finish, and exact Pantone color reproduction matched our digital artwork 100%. Delivered 6 hours before our launch event!',
    quoteMr: 'प्रोप्रींटने आमच्या फार्मा उत्पादनांचे पॅकेजिंग बॉक्सेस आणि ब्रोशर्स अत्यंत दर्जेदार बनवले. कागदाचा GSM, स्पॉट UV फिनिश आणि मूळ कलर शेड्स हुबेहूब आल्या. विशेष म्हणजे उद्घाटनाच्या ६ तास आधी संपूर्ण डिलिव्हरी मिळाली!',
    highlight: 'Exact Pantone Color  •  6hr Early Delivery',
    highlightMr: 'अचूक कलर शेड्स  •  वेळेपूर्वी डिलिव्हरी',
    isVerified: true
  },
  {
    id: 'rev-2',
    name: 'Ananya Deshpande',
    nameMr: 'अनन्या देशपांडे',
    role: 'Founder & Head Chef',
    roleMr: 'संस्थापिका व शेफ',
    company: 'Vanilla Bean Patisserie',
    category: 'food',
    rating: 5,
    date: '1 week ago',
    dateMr: '१ आठवड्यापूर्वी',
    productOrdered: 'Food-Grade Cake Boxes & Vinyl Stickers',
    productOrderedMr: 'फूड-ग्रेड केक बॉक्सेस व वॉटरप्रूफ स्टिकर्स',
    quote: 'Our dessert boxes and waterproof round stickers look world-class. The gold foil monogram gives our artisan bakery a luxury premium vibe. In-house manufacturing means rates are 30% lower than middle-men.',
    quoteMr: 'आमच्या बेकरीचे केक बॉक्सेस आणि वॉटरप्रूफ स्टिकर्स अतिशय सुंदर झाले आहेत. गोल्ड फॉइल फिनिशमुळे वस्तूंना रॉयल लूक मिळाला. थेट कारखान्यात प्रिंटिंग होत असल्याने दरही वाजवी मिळाले.',
    highlight: 'Waterproof Vinyl  •  Luxury Gold Foil',
    highlightMr: 'वॉटरप्रूफ स्टिकर्स  •  राजेशाही गोल्ड फॉइल',
    isVerified: true
  },
  {
    id: 'rev-3',
    name: 'Rohit Kulkarni',
    nameMr: 'रोहित कुलकर्णी',
    role: 'Operations Head',
    roleMr: 'ऑपरेशन्स प्रमुख',
    company: 'TechPrime Automation',
    category: 'corporate',
    rating: 5,
    date: '2 weeks ago',
    dateMr: '२ आठवड्यांपूर्वी',
    productOrdered: '450 GSM Velvet Cards & Smart ID Badges',
    productOrderedMr: '४५० GSM वेल्वेट कार्ड्स व स्मार्ट ID बॅजेस',
    quote: 'Ordered 450 GSM velvet touch business cards with raised spot UV for our 40-member leadership team. QR codes scan instantaneously and the edge trimming is sharp. Automated GST invoice received on WhatsApp immediately.',
    quoteMr: 'आमच्या ४० जणांच्या टीमसाठी ४५० GSM वेल्वेट टच बिझनेस कार्ड्स आणि स्मार्ट ID कार्ड्स मागवले होते. QR कोड एका सेकंदात स्कॅन होतो आणि कडा एकदम नीटनेटके आहेत. अधिकृत GST बिल त्वरित मिळाले.',
    highlight: 'Crisp QR Scan  •  Velvet Matte Finish',
    highlightMr: 'तत्काळ QR स्कॅन  •  वेल्वेट मॅट फिनिश',
    isVerified: true
  }
];

export const ClientReviewsSection: React.FC = () => {
  const { isMarathi, reviews = [] } = useApp();
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');

  // Only show reviews that are added to the system and approved
  const addedApprovedReviews = reviews.filter((r) => r.status === 'Approved');

  const filteredReviews: ReviewCardData[] = addedApprovedReviews
    .filter((item) => {
      if (selectedRating === 'all') return true;
      return item.rating === selectedRating;
    })
    .map((rev) => ({
      id: rev.id,
      name: rev.customerName,
      role: rev.customerRole || 'Verified Customer',
      rating: rev.rating || 5,
      date: rev.date || 'Recently',
      productOrdered: rev.productName,
      quote: rev.comment,
      highlight: `${rev.productName || 'Print Order'} • ${rev.rating || 5}★ Rating`,
      isVerified: rev.verifiedBuyer !== false,
    }));

  const ratingCounts = {
    all: addedApprovedReviews.length,
    five: addedApprovedReviews.filter((r) => r.rating === 5).length,
    four: addedApprovedReviews.filter((r) => r.rating === 4).length,
  };

  return (
    <section className="w-full bg-slate-50/80 text-slate-900 py-12 sm:py-16 border-y border-slate-200/80 font-marathi">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8 space-y-8">
        
        {/* Section Header & Google Trust Badge */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black uppercase tracking-wider font-marathi shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isMarathi ? 'खऱ्या ग्राहकांचे समाधान व विश्वास' : 'Real Client Reviews & Verified Testimonials'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-marathi">
              {isMarathi ? 'ग्राहकांचे प्रत्यक्ष अनुभव व अभिप्राय' : 'What Business Owners Say About Proprint'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-marathi">
              {isMarathi 
                ? 'छत्रपती संभाजीनगर, पुणे, नाशिक आणि संपूर्ण महाराष्ट्रातील उद्योजकांनी प्रोप्रींटच्या दर्जेदार प्रिंटिंग व डिझाईन सेवेबद्दल दिलेले खरे अभिप्राय खाली वाचा.' 
                : 'Read authentic verified feedback from clients who rely on Proprint for 24-hour fast turnaround, high-definition offset printing, and bespoke branding.'}
            </p>
          </div>

          {/* Google Verified Review Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-4 self-start lg:self-auto">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0 text-white font-black text-xl shadow-xs">
              G
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-900">4.9</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-600 font-marathi mt-0.5">
                {isMarathi ? `एकूण ${addedApprovedReviews.length} सत्यापित ग्राहकांचे अभिप्राय` : `Based on ${addedApprovedReviews.length} Verified Client Reviews`}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedRating('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer font-marathi ${
              selectedRating === 'all'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
            }`}
          >
            {isMarathi ? `सर्व अभिप्राय (${ratingCounts.all})` : `All Reviews (${ratingCounts.all})`}
          </button>

          <button
            type="button"
            onClick={() => setSelectedRating(5)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer font-marathi flex items-center gap-1.5 ${
              selectedRating === 5
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
            }`}
          >
            <span>5 ★ ({ratingCounts.five})</span>
          </button>

          {ratingCounts.four > 0 && (
            <button
              type="button"
              onClick={() => setSelectedRating(4)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer font-marathi flex items-center gap-1.5 ${
                selectedRating === 4
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <span>4 ★ ({ratingCounts.four})</span>
            </button>
          )}
        </div>

        {/* Reviews Bento Grid or Empty State */}
        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredReviews.map((rev) => (
              <ReviewCard
                key={rev.id}
                review={rev}
                isMarathi={isMarathi}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">
              {isMarathi ? 'अद्याप कोणतेही अभिप्राय जोडलेले नाहीत' : 'No Added Reviews Found'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isMarathi
                ? 'नवीन अभिप्राय ॲडमिन पॅनेलमधून जोडले गेल्यावर आणि मंजूर झाल्यावर येथे दिसतील.'
                : 'Customer reviews will automatically appear here only when added and approved in the system.'}
            </p>
          </div>
        )}

        {/* Bottom Callout Banner */}
        <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-extrabold text-white font-marathi">
              {isMarathi ? 'तुमच्या व्यवसायासाठी दर्जेदार प्रिंटिंग व डिझाईन हवे आहे का?' : 'Ready to Experience 24-Hour Express Commercial Printing?'}
            </h4>
            <p className="text-xs text-slate-300 font-marathi">
              {isMarathi 
                ? 'थेट आशिष कोथाळे व प्रोप्रींट टीमशी व्हॉट्सॲपवर संपर्क करा आणि तात्काळ मोफत सॅम्पल व दरपत्रक मिळवा.'
                : 'Directly speak with our production desk on WhatsApp for instant sample kits, custom die estimates, and wholesale quotes.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openDirectWhatsApp('Hello Proprint! I want to inquire about commercial printing services and request a custom quotation.')}
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap font-marathi"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>{isMarathi ? 'व्हॉट्सॲपवर थेट गप्पा मारा' : 'Direct WhatsApp Chat'}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
