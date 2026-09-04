import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  Sparkles, 
  Heart, 
  ShoppingCart, 
  Eye, 
  Check, 
  SlidersHorizontal,
  Clock,
  Layers,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

interface AllProductsViewProps {
  onSelectProduct?: (product: Product) => void;
  onOpenQuickView?: (product: Product) => void;
  onOpenQuoteModal?: (productName?: string) => void;
}

export const AllProductsView: React.FC<AllProductsViewProps> = ({
  onSelectProduct,
  onOpenQuickView,
  onOpenQuoteModal
}) => {
  const navigate = useNavigate();
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    isMarathi, 
    toggleWishlist, 
    isInWishlist,
    products = [],
    categories = []
  } = useApp();
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'turnaround'>('popular');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(5000);

  const handleProductSelect = (product: Product) => {
    if (onSelectProduct && typeof onSelectProduct === 'function') {
      onSelectProduct(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  // Filter products by search query, selected category, and max price
  const filteredProducts = products.filter((item) => {
    // Category match
    if (selectedCategory && item.categoryId !== selectedCategory) {
      return false;
    }
    // Sub-category match
    if (selectedSubCategory !== 'all' && item.category !== selectedSubCategory) {
      return false;
    }
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchNameMr = item.nameMr?.toLowerCase().includes(q);
      const matchCategory = item.category?.toLowerCase().includes(q);
      const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchNameMr && !matchCategory && !matchTags) return false;
    }
    // Price filter
    if (item.basePrice > maxPriceFilter) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return (a.basePrice || 0) - (b.basePrice || 0);
    if (sortBy === 'price-high') return (b.basePrice || 0) - (a.basePrice || 0);
    if (sortBy === 'turnaround') return (Number(a.turnaroundDays) || 0) - (Number(b.turnaroundDays) || 0);
    return (b.rating || 0) - (a.rating || 0); // default popular
  });

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8 py-6 space-y-6 font-marathi">
      
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{isMarathi ? 'मुख्यपृष्ठ' : 'Home'}</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">{isMarathi ? 'सर्व उत्पादने' : 'All Products'}</span>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-rose-600 font-bold">
                  {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {selectedCategory 
              ? (categories.find((c) => c.id === selectedCategory)?.name || 'Products')
              : (isMarathi ? 'सर्व कमर्शियल प्रिंटिंग उत्पादने' : 'All Commercial Print Products')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {isMarathi 
              ? `${sortedProducts.length} उच्च दर्जाची उत्पादने उपलब्ध - थेट फॅक्टरी दरात`
              : `Showing ${sortedProducts.length} customizable products at factory-direct pricing`}
          </p>
        </div>

        {/* Category & Sort Controls Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs border border-slate-200/80 shadow-2xs">
            <span className="text-slate-600 font-bold px-1.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-rose-600" />
              <span>{isMarathi ? 'कॅटेगरी:' : 'Category:'}</span>
            </span>
            <select
              value={selectedCategory || 'all'}
              onChange={(e) => setSelectedCategory(e.target.value === 'all' ? null : e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer max-w-[200px] sm:max-w-none truncate"
            >
              <option value="all">
                {isMarathi ? `सर्व उत्पादने (${products.length})` : `All Categories (${products.length})`}
              </option>
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <option key={cat.id} value={cat.id}>
                    {isMarathi && cat.nameMr ? cat.nameMr : cat.name} {count > 0 ? `(${count})` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs border border-slate-200/80 shadow-2xs">
            <span className="text-slate-600 font-bold px-1.5 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-600" />
              <span>{isMarathi ? 'क्रमवारी:' : 'Sort:'}</span>
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="popular">{isMarathi ? 'सर्वाधिक लोकप्रिय' : 'Most Popular'}</option>
              <option value="price-low">{isMarathi ? 'किंमत: कमी ते जास्त' : 'Price: Low to High'}</option>
              <option value="price-high">{isMarathi ? 'किंमत: जास्त ते कमी' : 'Price: High to Low'}</option>
              <option value="turnaround">{isMarathi ? 'जलद डिलिव्हरी' : 'Fastest Dispatch'}</option>
            </select>
          </div>

          {/* Clear Filter Button */}
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-rose-200"
            >
              <span>✕</span>
              <span>{isMarathi ? 'फिल्टर हटवा' : 'Clear'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Desktop Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar: Categories & Filters (Visible only on Desktop LG+ screens so it never pushes products down on mobile) */}
        <div className="hidden lg:block lg:col-span-1 space-y-5 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 text-xs">
          
          {/* Categories List */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span>{isMarathi ? 'कॅटेगरीज' : 'Categories'}</span>
              <span className="text-slate-400 font-normal">{categories.length}</span>
            </h3>
            
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold transition-colors flex items-center justify-between cursor-pointer ${
                  selectedCategory === null
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <span>{isMarathi ? 'सर्व उत्पादने' : 'All Products'}</span>
                <span className="text-[10px] opacity-80">{products.length}</span>
              </button>

              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl font-bold transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200/70'
                    }`}
                  >
                    <span className="truncate">{isMarathi && cat.nameMr ? cat.nameMr : cat.name}</span>
                    <span className="text-[10px] opacity-80">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider Filter */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>{isMarathi ? 'कमाल किंमत' : 'Max Base Price'}</span>
              <span className="text-rose-600 font-mono">₹{maxPriceFilter}</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹100</span>
              <span>₹5,000+</span>
            </div>
          </div>

          {/* Special Service Callout Banner */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isMarathi ? 'मोफत डिझाईन प्रुफ' : 'Free Pre-Press Proof'}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isMarathi 
                ? 'आमचे डिझायनर तुमच्या आर्टवर्कची प्री-प्रेस तपासणी मोफत करतात.' 
                : 'Send your CDR or PDF. Our expert operators check bleed and CMYK calibration free of charge.'}
            </p>
          </div>

        </div>

        {/* Right Area: Product Grid */}
        <div className="w-full lg:col-span-3">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-3">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl">
                🔍
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {isMarathi ? 'कोणतेही उत्पादन आढळले नाही' : 'No products found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isMarathi 
                  ? 'कृपया शोध शब्द किंवा निवडलेले फिल्टर्स बदलून पुन्हा प्रयत्न करा.' 
                  : 'Try changing your search terms or clearing the selected category filters.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                  setMaxPriceFilter(5000);
                }}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-500 cursor-pointer"
              >
                {isMarathi ? 'सर्व फिल्टर्स रीसेट करा' : 'Reset All Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {sortedProducts.map((product) => {
                const isWishlisted = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:border-rose-400 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
                  >
                    {/* Badge on Image */}
                    {product.badge && (
                      <div className="absolute top-3 left-3 z-20">
                        <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                          {isMarathi && product.badgeMr ? product.badgeMr : product.badge}
                        </span>
                      </div>
                    )}

                    {/* Wishlist Icon Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 shadow-md backdrop-blur-xs transition-transform active:scale-90 cursor-pointer"
                      title="Save to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                    </button>

                    {/* Image Area */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                          {product.category}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                          {isMarathi && product.nameMr ? product.nameMr : product.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {isMarathi && product.descriptionMr ? product.descriptionMr : product.description}
                        </p>
                      </div>

                      {/* Turnaround & Minimum Quantity */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{product.turnaroundDays} {isMarathi ? 'दिवस डिस्पॅच' : 'Day Dispatch'}</span>
                        </span>
                        <span>{isMarathi ? 'किमान:' : 'Min:'} {product.minQuantity} {product.unit}</span>
                      </div>

                      {/* Price & Action Button */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block">{isMarathi ? 'सुरुवाती दर' : 'Starting from'}</span>
                          <span className="text-base sm:text-lg font-black text-slate-900">
                            ₹{product.basePrice}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductSelect(product);
                          }}
                          className="bg-slate-900 hover:bg-[#FF0038] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <span>{isMarathi ? 'कस्टमायझ' : 'Customize'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
