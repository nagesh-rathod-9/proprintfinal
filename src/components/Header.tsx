import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Phone, 
  Menu, 
  X, 
  MessageSquare, 
  Sparkles, 
  Truck, 
  Heart,
  LogIn, 
  LogOut, 
  LayoutDashboard,
  ChevronDown,
  Palette,
  CreditCard,
  Package,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProprintLogo } from './ProprintLogo';
import { Product } from '../types';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  onOpenAccount?: () => void;
  onOpenQuote: () => void;
  onOpenWhatsApp: () => void;
  onOpenTrackOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onOpenQuote,
  onOpenWhatsApp,
  onOpenTrackOrder
}) => {
  const { 
    cart, 
    wishlist,
    searchQuery, 
    setSearchQuery, 
    currentUser, 
    logout, 
    language,
    setLanguage,
    isMarathi,
    isGlobalLoading,
    products: appProducts = [],
    categories: appCategories = []
  } = useApp();
  
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [allProductsDropdownOpen, setAllProductsDropdownOpen] = useState(false);
  const [filteredSearchResults, setFilteredSearchResults] = useState<Product[]>([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const allProductsRef = useRef<HTMLDivElement>(null);

  const cartItemsCount = Array.isArray(cart) ? cart.length : 0;
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

  // Search auto-complete logic
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const query = searchQuery.toLowerCase();
      const results = (appProducts || []).filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.nameMr?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          p.tags?.some((t) => t.toLowerCase().includes(query))
      ).slice(0, 6);
      setFilteredSearchResults(results);
      setSearchDropdownOpen(true);
    } else {
      setFilteredSearchResults([]);
      setSearchDropdownOpen(false);
    }
  }, [searchQuery]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (allProductsRef.current && !allProductsRef.current.contains(event.target as Node)) {
        setAllProductsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchDropdownOpen(false);
    setMobileSearchOpen(false);
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleProductSelect = (prod: Product) => {
    setSearchDropdownOpen(false);
    setMobileSearchOpen(false);
    setSearchQuery('');
    navigate(`/product/${prod.id}`);
  };

  const isHome = location.pathname === '/';

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full font-marathi shadow-md">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#111624] text-neutral-300 text-[11px] py-1.5 px-3 sm:px-6 font-normal border-b border-neutral-800">
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left Announcement Message */}
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="text-amber-400 flex-shrink-0 text-xs">⚡</span>
            <span className="truncate text-[11px] sm:text-xs">
              {isMarathi 
                ? '२४ तासांत जलद डिस्पॅच संपूर्ण महाराष्ट्रात | GST इनव्हॉइसिंग उपलब्ध' 
                : '24h Express Dispatch Across Maharashtra • In-House Heidelberg Offset Press'}
            </span>
          </div>

          {/* Right Controls (Language Switcher Pill & Helpline) */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            
            {/* Language Switcher Capsule: [ EN | मराठी ] */}
            <div 
              id="header-lang-capsule"
              className="flex items-center bg-black/40 border border-neutral-700 rounded-full p-0.5"
            >
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-rose-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('mr')}
                className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium transition-all cursor-pointer ${
                  language === 'mr'
                    ? 'bg-rose-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                मराठी
              </button>
            </div>

            {/* Direct Dial (desktop only) */}
            <a
              href="tel:9322126863"
              className="hidden sm:flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors text-xs"
            >
              <Phone className="w-3 h-3 text-rose-400" />
              <span className="font-mono text-[11px]">9322126863</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER NAVBAR */}
      <div className="w-full bg-[#0B0F19] border-b border-neutral-800/90 text-white">
        <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 lg:gap-6">
          
          {/* Left: Mobile Hamburger & Brand Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 -ml-1 text-white hover:text-rose-500 rounded-lg lg:hidden cursor-pointer transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo for Desktop and Mobile */}
            <Link to="/" className="flex items-center group">
              <ProprintLogo size="sm" variant="light" showTagline={true} />
            </Link>
          </div>

          {/* Center Navigation Links - Clean, simple, professional */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs font-medium text-neutral-300">
            
            {/* All Products with Dropdown */}
            <div ref={allProductsRef} className="relative">
              <button
                onClick={() => setAllProductsDropdownOpen(!allProductsDropdownOpen)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-1 font-medium"
              >
                <span>{isMarathi ? 'सर्व उत्पादने' : 'Products'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${allProductsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {allProductsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-60 bg-[#111624] border border-neutral-700/80 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-neutral-800/80 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-rose-400">
                    {isMarathi ? 'प्रिंटिंग कॅटेगरीज' : 'Commercial Categories'}
                  </div>
                  <div className="py-1">
                    <Link
                      to="/products"
                      onClick={() => setAllProductsDropdownOpen(false)}
                      className="block px-3.5 py-2 text-xs text-white hover:bg-rose-600/20 hover:text-rose-400 font-semibold"
                    >
                      {isMarathi ? 'सर्व उत्पादने पहा' : 'View All Products (30+ Items)'}
                    </Link>
                    {appCategories.slice(0, 8).map((c) => (
                      <Link
                        key={c.id}
                        to={`/products?category=${c.id}`}
                        onClick={() => setAllProductsDropdownOpen(false)}
                        className="block px-3.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Business Cards */}
            <Link
              to="/products?category=business-cards"
              className="hover:text-white transition-colors"
            >
              {isMarathi ? 'व्हिजिटिंग कार्ड्स' : 'Business Cards'}
            </Link>

            {/* Brochures & Catalogs */}
            <Link
              to="/products?category=brochures"
              className="hover:text-white transition-colors"
            >
              {isMarathi ? 'ब्रोशर्स व कॅटलॉग' : 'Brochures & Catalogs'}
            </Link>

            {/* Packaging & Boxes */}
            <Link
              to="/products?category=packaging"
              className="hover:text-white transition-colors"
            >
              {isMarathi ? 'पॅकेजिंग बॉक्सेस' : 'Packaging & Boxes'}
            </Link>

            {/* Graphic Design Portfolio */}
            <Link
              to="/portfolio"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>{isMarathi ? 'डिझाईन कामे' : 'Design Portfolio'}</span>
            </Link>

            {/* 3D Studio: Cards & Stickers */}
            <Link
              to="/design-studio"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:border-rose-500 text-slate-200 hover:text-white transition-all text-xs font-semibold shadow-xs group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>{isMarathi ? '३D स्टुडिओ (कार्ड्स व स्टिकर्स)' : '3D Studio (Cards & Stickers)'}</span>
            </Link>

          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Desktop: Track Order */}
            <button
              onClick={onOpenTrackOrder}
              className="hidden xl:flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer py-1 font-medium hover:bg-neutral-800/60 px-2.5 rounded-lg"
            >
              <Truck className="w-3.5 h-3.5 text-rose-400" />
              <span>{isMarathi ? 'ऑर्डर ट्रॅक' : 'Track Order'}</span>
            </button>

            {/* Search Toggle Icon */}
            <button
              id="header-search-toggle"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 text-neutral-300 hover:text-white rounded-xl transition-all cursor-pointer hover:bg-neutral-800/80 active:scale-95"
              title="Search Products"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Shopping Bag Icon with Red Circle Badge (Matches User Reference) */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 text-neutral-300 hover:text-white rounded-xl transition-all cursor-pointer hover:bg-neutral-800/80 active:scale-95"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] bg-[#FF0038] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Account */}
            <div ref={userMenuRef} className="relative">
              {currentUser ? (
                <div>
                  <button
                    id="header-user-status-btn"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    aria-label="User Account"
                    className="p-2 text-neutral-300 hover:text-white rounded-xl transition-all cursor-pointer hover:bg-neutral-800/80 active:scale-95"
                    title={currentUser.name || 'Account'}
                  >
                    <User className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu - ONLY Profile, Orders, and Sign Out */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#111624] rounded-2xl shadow-2xl border border-neutral-800 py-1.5 z-50 text-xs text-white divide-y divide-neutral-800/80 animate-in fade-in zoom-in-95 duration-100">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          id="header-menu-profile-link"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-slate-200 hover:text-white hover:bg-neutral-800/80 font-medium transition-colors"
                        >
                          <User className="w-4 h-4 text-rose-400" />
                          <span>{isMarathi ? 'प्रोफाइल' : 'Profile'}</span>
                        </Link>

                        <Link
                          to="/orders"
                          id="header-menu-orders-link"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-slate-200 hover:text-white hover:bg-neutral-800/80 font-medium transition-colors"
                        >
                          <Package className="w-4 h-4 text-amber-400" />
                          <span>{isMarathi ? 'ऑर्डर्स' : 'Orders'}</span>
                        </Link>

                        {currentUser.role === 'admin' && (
                          <Link
                            to="/admin"
                            id="header-menu-admin-link"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-amber-300 hover:bg-neutral-800/80 font-medium transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-400" />
                            <span>Admin Portal</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          id="header-menu-signout-btn"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 font-medium transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span>{isMarathi ? 'साइन आउट' : 'Sign Out'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  id="header-login-link-btn"
                  to="/login"
                  aria-label="Login"
                  className="p-2 text-neutral-300 hover:text-white rounded-xl transition-all cursor-pointer hover:bg-neutral-800/80 active:scale-95 block"
                  title={isMarathi ? 'लॉगिन' : 'Login'}
                >
                  <User className="w-4 h-4" />
                </Link>
              )}
            </div>

          </div>

        </div>

        {/* 3. EXPANDABLE SEARCH BAR (Desktop & Mobile) */}
        {mobileSearchOpen && (
          <div ref={searchContainerRef} className="px-3.5 sm:px-8 pb-3 pt-1 border-t border-neutral-800 bg-[#0C101A] animate-in fade-in slide-in-from-top-2 duration-150 relative">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder={isMarathi ? 'व्हिजिटिंग कार्ड्स, बॉक्सेस, स्टिकर्स, ब्रोशर्स शोधा...' : 'Search visiting cards, boxes, stickers, brochures...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-white placeholder:text-neutral-400 font-marathi focus:outline-none focus:border-rose-500 shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-[#FF0038] hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-md shadow-rose-600/30"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isMarathi ? 'शोधा' : 'Search'}</span>
              </button>
            </form>

            {/* Search Dropdown in Expandable bar */}
            {searchDropdownOpen && filteredSearchResults.length > 0 && (
              <div className="max-w-2xl mx-auto mt-2 bg-[#111624] border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-neutral-800 text-white">
                <div className="p-2 bg-neutral-950 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                  <span>{isMarathi ? 'जुळणारी उत्पादने' : 'Matching Products'}</span>
                  <span>{filteredSearchResults.length} found</span>
                </div>
                {filteredSearchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleProductSelect(item)}
                    className="p-3 hover:bg-neutral-800/80 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded-lg border border-neutral-700"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-neutral-400">{item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-rose-400">₹{item.basePrice}</span>
                      <span className="text-[9px] text-neutral-400 block">Min: {item.minQuantity} {item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* 4. MOBILE DRAWER NAVIGATION MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[88px] z-50 bg-black/75 backdrop-blur-xs lg:hidden">
          <div className="w-4/5 max-w-sm h-full bg-[#0C101A] text-white shadow-2xl p-5 flex flex-col justify-between overflow-y-auto font-marathi border-r border-neutral-800">
            <div className="space-y-4">
              
              {/* User Account / Login Banner */}
              <div className="p-3.5 bg-neutral-900/90 rounded-2xl border border-neutral-800 space-y-2.5">
                {currentUser ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF0038] to-rose-400 text-white font-black flex items-center justify-center text-xs shadow-md">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-white">{currentUser.name}</p>
                          <span className={`text-[10px] font-bold uppercase ${
                            currentUser.role === 'admin' ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {currentUser.role === 'admin' ? '👑 Admin Mode' : '👤 Customer'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logout();
                        }}
                        className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                        title="Sign Out"
                      >
                        Logout
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 border border-neutral-700"
                      >
                        <Package className="w-3.5 h-3.5 text-rose-400" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 px-3 bg-[#FF0038] hover:bg-rose-500 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Profile Hub</span>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">50% OFF For New User</p>
                      <p className="text-[10px] text-rose-400 font-mono">Coupon: NEWUSER</p>
                    </div>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2 bg-[#FF0038] hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md"
                    >
                      Login / Sign In
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1 pt-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600/20 text-rose-400 border border-rose-500/30"
                >
                  <span>🏠 {isMarathi ? 'मुख्यपृष्ठ' : 'Home'}</span>
                </Link>

                <Link
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-bold text-neutral-200 hover:bg-neutral-800/80 hover:text-rose-400 transition-colors"
                >
                  📦 {isMarathi ? 'सर्व उत्पादने' : 'All Products'}
                </Link>

                <Link
                  to="/products?category=business-cards"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-neutral-200 hover:bg-neutral-800/80"
                >
                  💳 {isMarathi ? 'व्हिजिटिंग कार्ड्स' : 'Business Cards'}
                </Link>

                <Link
                  to="/products?category=flyers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-neutral-200 hover:bg-neutral-800/80"
                >
                  📄 {isMarathi ? 'पॅम्प्लेट्स व फ्लायर्स' : 'Flyers'}
                </Link>

                <Link
                  to="/products?category=brochures"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-neutral-200 hover:bg-neutral-800/80"
                >
                  📗 {isMarathi ? 'ब्रोशर्स' : 'Brochures'}
                </Link>

                <Link
                  to="/products?category=stickers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-neutral-200 hover:bg-neutral-800/80"
                >
                  🏷️ {isMarathi ? 'स्टिकर्स (₹79)' : 'Stickers (₹79)'}
                </Link>

                <Link
                  to="/portfolio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-neutral-200 hover:bg-neutral-800/80"
                >
                  <Palette className="w-4 h-4 text-rose-400" />
                  <span>{isMarathi ? 'ग्राफिक डिझाईन व कामे' : 'Graphic Design & Works'}</span>
                </Link>

                <Link
                  to="/design-studio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-800 border border-slate-700 text-rose-300 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>{isMarathi ? '✨ ३D स्टुडिओ (कार्ड्स व स्टिकर्स)' : '✨ 3D Studio (Cards & Stickers)'}</span>
                </Link>

                {currentUser?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-black bg-amber-500 text-slate-950 transition-colors"
                  >
                    👑 Admin Dashboard Portal
                  </Link>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3 border-t border-neutral-800">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTrackOrder();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold flex items-center justify-center gap-2 border border-neutral-800 cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-rose-500" />
                  <span>{isMarathi ? 'ऑर्डर ट्रॅक करा' : 'Track Order'}</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuote();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#FF0038] hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isMarathi ? 'त्वरित कोटेशन मिळवा' : 'Get Instant Quote'}</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenWhatsApp();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>{isMarathi ? 'व्हॉट्सॲपवर संपर्क' : 'WhatsApp Support'}</span>
                </button>
              </div>

            </div>

            {/* Mobile Footer Contact */}
            <div className="pt-4 border-t border-neutral-800 text-center text-[11px] text-neutral-400 space-y-1">
              <p className="font-bold text-white">Proprint Commercial Press</p>
              <p>Motikaranja, Chh. Sambhajinagar</p>
              <p className="text-rose-400 font-bold font-mono">9322126863 / 9623458919</p>
            </div>

          </div>
        </div>
      )}

      {/* Slim Dynamic Loading Liner After Navbar */}
      {isGlobalLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-neutral-900 overflow-hidden z-50">
          <div className="h-full bg-gradient-to-r from-rose-600 via-[#FF0038] to-rose-400 shadow-[0_0_8px_#FF0038] animate-top-bar" />
        </div>
      )}

    </header>
  );
};
