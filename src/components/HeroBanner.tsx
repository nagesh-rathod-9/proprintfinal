import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingBag } from 'lucide-react';
import { HeroSlide } from '../types';
import { useAppContext } from '../context/AppContext';

// High-impact 16:9 professional printing banners
const DEFAULT_POSTER_SLIDES: HeroSlide[] = [
  {
    id: 'slide-packaging',
    title1: 'Custom Packaging Boxes',
    title2: 'Packaging',
    highlight: 'Rigid Boxes',
    subtitle: 'Perfect packaging solutions for your brand.',
    buttonText: 'Order Now',
    quoteButtonText: 'Enquiry',
    theme: 'dark',
    tag: 'Packaging Line',
    stats: 'Custom Dimensions',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920&auto=format&fit=crop&q=80',
    typeLabel: 'Packaging',
    productId: 'prod-custom-packaging-box',
    categoryLink: '/products?category=packaging'
  },
  {
    id: 'slide-visiting-cards',
    title1: 'Premium Visiting & Business Cards',
    title2: 'Visiting Cards',
    highlight: 'Spot UV & Velvet',
    subtitle: 'Tactile velvet matte textures with raised metallic gold foil.',
    buttonText: 'Order Now',
    quoteButtonText: 'Quick Quote',
    theme: 'dark',
    tag: 'Corporate Cards',
    stats: '450 GSM Art Board',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&auto=format&fit=crop&q=80',
    typeLabel: 'Visiting Cards',
    productId: 'prod-luxury-velvet-card',
    categoryLink: '/products?category=visiting-cards'
  },
  {
    id: 'slide-brochures',
    title1: 'Brochure & Catalog Printing',
    title2: 'Brochures',
    highlight: 'Full Color Offset',
    subtitle: 'High-definition 300 GSM multi-fold brochures and booklets.',
    buttonText: 'Order Now',
    quoteButtonText: 'Quick Quote',
    theme: 'dark',
    tag: 'Commercial Press',
    stats: 'Same Day Dispatch',
    badge: 'Hot',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1920&auto=format&fit=crop&q=80',
    typeLabel: 'Brochures',
    productId: 'prod-premium-brochure',
    categoryLink: '/products?category=brochures'
  }
];

interface HeroBannerProps {
  slides?: HeroSlide[];
  onShopNow?: () => void;
  onGetQuote?: () => void;
  onOpenQuote?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ slides }) => {
  const { activeHeroSlides } = useAppContext();
  const rawSlides = slides || activeHeroSlides;
  const posterSlides = rawSlides && rawSlides.length > 0 ? rawSlides : DEFAULT_POSTER_SLIDES;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const SLIDE_DURATION = 5000; // 5 seconds per slide

  // Reset current index if out of bounds
  useEffect(() => {
    if (currentIndex >= posterSlides.length) {
      setCurrentIndex(0);
    }
  }, [posterSlides.length, currentIndex]);

  // Handle slide navigation
  const handleSlideClick = (slide: HeroSlide) => {
    if (slide.productId) {
      navigate(`/product/${slide.productId}`);
    } else if (slide.categoryLink) {
      navigate(slide.categoryLink);
    } else if (slide.id === 'slide-packaging' || slide.title1?.toLowerCase().includes('packaging')) {
      navigate('/product/prod-custom-packaging-box');
    } else if (slide.id === 'slide-visiting-cards' || slide.title1?.toLowerCase().includes('card')) {
      navigate('/product/prod-luxury-velvet-card');
    } else if (slide.id === 'slide-brochures' || slide.title1?.toLowerCase().includes('brochure')) {
      navigate('/product/prod-premium-brochure');
    } else {
      navigate('/products');
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posterSlides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + posterSlides.length) % posterSlides.length);
  };

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || posterSlides.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, posterSlides.length]);

  const currentSlide = posterSlides[currentIndex] || posterSlides[0];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8 pt-1 lg:pt-1.5 pb-1 lg:pb-2 select-none">
      
      {/* Aspect Ratio Banner Container (16:9 on mobile, 680px on laptop) */}
      <div 
        className="relative w-full aspect-[16/9] lg:aspect-auto lg:h-[680px] rounded-2xl sm:rounded-3xl md:rounded-[28px] overflow-hidden bg-slate-950 shadow-2xl border border-slate-800/80 group cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={() => handleSlideClick(currentSlide)}
        title="Click to explore and order"
      >

        {/* Dynamic Slide Image (Clean Display of Poster Design) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSlide?.id || currentIndex}-${currentSlide?.image}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.title1 || 'Proprint Banner'}
              className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920&auto=format&fit=crop&q=80';
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Small Order Now Button on Side (Bottom-Left) */}
        <div className="absolute bottom-2.5 sm:bottom-4 md:bottom-5 left-2.5 sm:left-4 md:left-6 z-30 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSlideClick(currentSlide);
            }}
            id="hero-order-small-btn"
            className="group/btn inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-[#FF0038] hover:bg-[#e00032] active:scale-95 text-white rounded-full font-bold text-[11px] sm:text-xs transition-all duration-200 shadow-lg shadow-rose-600/30 border border-white/20 cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
            <span>{currentSlide.buttonText || 'Order Now'}</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>

        {/* Signature Bottom-Right Control Capsule */}
        {posterSlides.length > 1 && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2.5 sm:bottom-4 md:bottom-5 right-2.5 sm:right-4 md:right-6 z-30 flex items-center gap-2 sm:gap-3 bg-black/85 backdrop-blur-xl px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/10 shadow-xl"
          >
            
            {/* Slide Index (e.g. 03 / 03) */}
            <div className="flex items-center font-mono font-bold text-[9px] sm:text-[11px] md:text-xs tracking-wider">
              <span className="text-white">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="text-slate-500 mx-0.5 sm:mx-1">/</span>
              <span className="text-slate-400">{String(posterSlides.length).padStart(2, '0')}</span>
            </div>

            {/* Circular Dots */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {posterSlides.map((_, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#FF0038] scale-110 shadow-[0_0_6px_#FF0038]' 
                        : 'w-1 sm:w-1.5 h-1 sm:h-1.5 bg-neutral-600 hover:bg-neutral-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                );
              })}
            </div>

            {/* Arrow Chevrons (< and >) */}
            <div className="flex items-center gap-0.5 pl-1 sm:pl-2 border-l border-white/15">
              <button
                type="button"
                onClick={handlePrev}
                className="p-0.5 sm:p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="p-0.5 sm:p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>

    </section>
  );
};
