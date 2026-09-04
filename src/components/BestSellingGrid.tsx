import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Star, Sparkles, SlidersHorizontal, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface BestSellingGridProps {
  products?: Product[];
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  onSelectProduct?: (product: Product) => void;
  onCustomizeProduct?: (product: Product) => void;
  onOpenDesignStudio?: (product: Product) => void;
  onOpenQuoteModal?: (serviceName?: string) => void;
  onViewAll?: () => void;
}

export const BestSellingGrid: React.FC<BestSellingGridProps> = ({
  products,
  wishlistIds: propWishlistIds,
  onToggleWishlist: propToggleWishlist,
  onSelectProduct,
  onCustomizeProduct,
  onOpenDesignStudio,
  onOpenQuoteModal,
  onViewAll: propViewAll,
}) => {
  const { isMarathi, wishlistIds: contextWishlistIds, toggleWishlist: contextToggleWishlist, products: contextProducts } = useApp();
  const navigate = useNavigate();

  const handleProductClick = (product: Product) => {
    if (onSelectProduct && typeof onSelectProduct === 'function') {
      onSelectProduct(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const pool = (products && products.length > 0) ? products : (contextProducts || []);
  const displayProducts = pool.filter((p) => p.isBestSeller || p.isPopular).slice(0, 6);

  const activeWishlistIds = propWishlistIds || contextWishlistIds || [];
  const handleToggleWishlist = propToggleWishlist || contextToggleWishlist;
  const handleViewAll = propViewAll || (() => navigate('/products'));

  return (
    <section className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8 py-6 sm:py-8 font-marathi">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isMarathi ? 'ग्राहकांची पहिली पसंती' : 'High Demand Favorites'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            {isMarathi ? 'सर्वाधिक विकली जाणारी' : 'Best Selling'}{' '}
            <span className="relative inline-block text-slate-900">
              {isMarathi ? 'उत्पादने' : 'Products'}
              <span className="absolute left-0 bottom-[-3px] w-full h-[3px] bg-rose-600 rounded-full"></span>
            </span>
          </h2>
        </div>

        <button
          onClick={handleViewAll}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors group cursor-pointer"
        >
          <span>{isMarathi ? 'सर्व पहा' : 'View All'}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Grid: 2-cols mobile, 3-cols tablet, 4-cols or 6-cols desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
        {displayProducts.map((product) => {
          const isWishlisted = activeWishlistIds.includes(product.id);
          const isVisitingCard = product.categoryId === 'business-cards' || product.id.includes('card');

          return (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-rose-400/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 relative"
            >
              {/* Top Bar: Best Seller Badge + Wishlist Heart Button */}
              <div 
                onClick={() => handleProductClick(product)}
                className="relative w-full aspect-square bg-slate-100 overflow-hidden cursor-pointer"
              >
                {/* Wishlist Heart Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleWishlist(product.id);
                  }}
                  className={`absolute top-2 right-2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-50 text-rose-600 shadow-md ring-1 ring-rose-200'
                      : 'bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white shadow-xs'
                  }`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                      isWishlisted ? 'fill-rose-600 stroke-rose-600' : 'stroke-current'
                    }`}
                  />
                </button>

                {/* Popularity badge */}
                {product.isBestSeller && (
                  <div className="absolute top-2 left-2 z-20 bg-rose-600 text-white text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> {isMarathi ? 'पॉप्युलर' : 'Popular'}
                  </div>
                )}

                {/* Real crisp photographic image */}
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Product Info */}
              <div className="p-2.5 sm:p-4 flex flex-col justify-between flex-1">
                
                <div 
                  className="cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Rating snippet */}
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-500 mb-0.5 sm:mb-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-700">{product.rating}</span>
                    <span className="text-slate-400 text-[9px] sm:text-[10px]">({product.reviewsCount})</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                    {isMarathi && product.nameMr ? product.nameMr : product.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-1 sm:mt-2">
                    <div className="flex items-baseline gap-1 sm:gap-1.5">
                      <span className="text-sm sm:text-lg font-black text-slate-900">
                        ₹{product.basePrice.toFixed(0)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                          ₹{product.originalPrice.toFixed(0)}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 block -mt-0.5">
                      {isMarathi ? 'किमान दर' : 'Starting price'}
                    </span>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="mt-2.5 sm:mt-3 pt-2 border-t border-slate-100 flex flex-row items-center gap-1 sm:gap-1.5">
                  {isVisitingCard ? (
                    <>
                      <button
                        onClick={() => {
                          if (onOpenDesignStudio) {
                            onOpenDesignStudio(product);
                          } else {
                            navigate('/visiting-cards');
                          }
                        }}
                        className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] sm:text-xs font-bold py-1.5 sm:py-2 px-1 rounded-lg sm:rounded-xl transition-colors text-center cursor-pointer whitespace-nowrap truncate flex items-center justify-center gap-1"
                      >
                        <SlidersHorizontal className="w-3 h-3 text-rose-600" />
                        <span className="truncate">{isMarathi ? 'कस्टमायझ' : 'Customize'}</span>
                      </button>
                      <button
                        onClick={() => handleProductClick(product)}
                        className="flex-1 bg-slate-900 hover:bg-[#FF0038] text-white text-[10px] sm:text-xs font-bold py-1.5 sm:py-2 px-1 rounded-lg sm:rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap truncate"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span className="truncate">{isMarathi ? 'ऑर्डर' : 'Order'}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleProductClick(product)}
                      className="w-full bg-slate-900 hover:bg-[#FF0038] text-white text-[10px] sm:text-xs font-bold py-1.5 sm:py-2 px-2 rounded-lg sm:rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>{isMarathi ? 'तपशील / ऑर्डर करा' : 'View Details & Order'}</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
