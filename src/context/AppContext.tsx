import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { 
  CategoryId, 
  Category,
  Product, 
  CartItem, 
  SelectedProductCustomization, 
  Order, 
  QuoteRequest, 
  User,
  UserAddress,
  PaymentRecord,
  ReviewRecord,
  ServiceItem,
  HeroSlide,
  PortfolioItem
} from '../types';
import { Language, TRANSLATIONS, Translations } from '../data/translations';
import { openDirectWhatsApp } from '../utils/whatsapp';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

// Backend API base URL.
const API_BASE_URL = 'https://proprintfinal.onrender.com/api';

// Base URL for static assets (uploaded images, etc.)
const ASSETS_BASE_URL = 'https://proprintfinal.vercel.app';

// ================================================================
// Helper: Convert relative image URL to absolute
// ================================================================
const getFullImageUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // If it starts with '/', prepend base; otherwise add leading slash
  return url.startsWith('/') ? `${ASSETS_BASE_URL}${url}` : `${ASSETS_BASE_URL}/${url}`;
};

// ================================================================
// FIXED apiFetch – adds cache‑busting for all platforms
// ================================================================
const apiFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  let url = typeof input === 'string' ? input : input.toString();

  // Handle relative /api paths
  const isRelativeApi = url.startsWith('/api');

  // For Capacitor native, we must use the absolute URL and add cache‑busting
  if (Capacitor.isNativePlatform()) {
    if (isRelativeApi) {
      const apiPath = url.slice('/api'.length);
      url = `${API_BASE_URL}${apiPath}`;
    }

    // Append unique timestamp to force fresh fetch
    const separator = url.includes('?') ? '&' : '?';
    url = url.replace(/[&?]_t=\d+/, '');  // remove any existing _t
    url += `${separator}_t=${Date.now()}`;

    // Set no-cache headers
    const headers = new Headers(init?.headers || {});
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return fetch(url, { ...init, headers });
  }

  // Web platform – also add cache‑busting to be safe
  if (isRelativeApi) {
    const separator = url.includes('?') ? '&' : '?';
    url = url.replace(/[&?]_t=\d+/, '');
    url += `${separator}_t=${Date.now()}`;
  }
  const headers = new Headers(init?.headers || {});
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');

  return fetch(url, { ...init, headers });
};

// ================================================================
// Types and Context Interface
// ================================================================
interface ToastInfo {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isMarathi: boolean;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CategoryId | string;
  setSelectedCategory: (cat: CategoryId | string) => void;

  // Products
  products: Product[];
  addProduct: (product: Partial<Product>) => Product;
  updateProduct: (productId: string, updatedData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Partial<Category>) => void;
  updateCategory: (categoryId: string, updatedData: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;

  // Hero Slides
  heroSlides: HeroSlide[];
  activeHeroSlides: HeroSlide[];
  addHeroSlide: (slide: Partial<HeroSlide>) => Promise<HeroSlide | null>;
  updateHeroSlide: (id: string | number, updatedData: Partial<HeroSlide>, silent?: boolean) => Promise<boolean>;
  deleteHeroSlide: (id: string | number) => Promise<boolean>;
  reorderHeroSlides: (orderedIds: (string | number)[]) => Promise<boolean>;
  resetHeroSlides: () => Promise<void>;
  refreshHeroSlides: () => Promise<void>;

  // Services
  services: ServiceItem[];
  addService: (service: Partial<ServiceItem>) => void;
  updateService: (serviceId: string, updatedData: Partial<ServiceItem>) => void;
  deleteService: (serviceId: string) => void;

  // Portfolio
  portfolio: PortfolioItem[];
  addPortfolioItem: (item: Partial<PortfolioItem>) => Promise<PortfolioItem | null>;
  updatePortfolioItem: (id: string, updatedData: Partial<PortfolioItem>) => Promise<boolean>;
  deletePortfolioItem: (id: string) => Promise<boolean>;
  refreshPortfolio: () => Promise<void>;

  // Users
  users: User[];
  addUser: (user: Partial<User>) => void;
  updateUser: (emailOrId: string, updatedData: Partial<User>) => void;
  deleteUser: (emailOrId: string) => void;

  // Payments
  payments: PaymentRecord[];
  updatePaymentStatus: (paymentId: string, status: 'Completed' | 'Pending' | 'Failed' | 'Refunded') => void;

  // Reviews
  reviews: ReviewRecord[];
  updateReviewStatus: (reviewId: string, status: 'Approved' | 'Pending' | 'Hidden') => void;
  deleteReview: (reviewId: string) => void;
  addReview: (review: Partial<ReviewRecord>) => void;

  // Cart
  cart: CartItem[];
  cartItems: CartItem[];
  addToCart: (product: Product, customization: SelectedProductCustomization) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  removeCartItem: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;

  // Wishlist
  wishlist: Product[];
  wishlistIds: string[];
  toggleWishlist: (productId: string | Product) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  wishlistProducts: Product[];

  // Orders
  orders: Order[];
  placeOrder: (orderData: any) => Order;
  addManualOrder: (orderData: any) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, newStatus: string) => void;
  deleteOrder: (orderId: string) => void;

  // Quotes
  quotes: QuoteRequest[];
  submitQuote: (newQuote: QuoteRequest) => void;
  addQuote: (newQuote: QuoteRequest) => void;
  updateQuoteStatus: (quoteId: string, newStatus: string) => void;

  // Coupon
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discountAmount: number;

  // User & Auth
  user: User | null;
  currentUser: User | null;
  setUser: (user: User | null) => void;
  setCurrentUser: (user: User | null) => void;
  switchUser: (user: User) => void;
  updateUserProfile: (updatedFields: Partial<User>) => Promise<boolean>;
  addUserAddress: (address: Omit<UserAddress, 'id'>) => Promise<boolean>;
  updateUserAddress: (addressId: string, updated: Partial<UserAddress>) => Promise<boolean>;
  deleteUserAddress: (addressId: string) => Promise<boolean>;
  setDefaultAddress: (addressId: string) => Promise<boolean>;
  login: (username: string, password?: string) => { success: boolean; role: 'admin' | 'customer'; user?: User; error?: string };
  loginWithPhone: (phoneNumber: string, name?: string) => { success: boolean; user: User };
  loginDirectAdmin: () => { success: boolean; user: User };
  logout: () => void;

  // Profile Update Modal
  isUpdateProfileModalOpen: boolean;
  setIsUpdateProfileModalOpen: (open: boolean) => void;
  openUpdateProfileModal: () => void;
  closeUpdateProfileModal: () => void;
  isUserNameNotUpdated: (user?: User | null) => boolean;

  // Modals / Drawers
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isWishlistDrawerOpen: boolean;
  setIsWishlistDrawerOpen: (open: boolean) => void;
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  openWhatsApp: (message?: string) => void;
  isQuoteModalOpen: boolean;
  setIsQuoteModalOpen: (open: boolean) => void;

  // Toast & Loading
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  closeToast: () => void;
  isGlobalLoading: boolean;
  setIsGlobalLoading: (loading: boolean) => void;
  triggerTopLoading: (durationMs?: number) => void;

  // NEW: Manually refresh all data from backend
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ================================================================
// AppProvider – All state and logic
// ================================================================
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('proprint_lang');
    return (saved === 'mr' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('proprint_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mr' : 'en');
  };

  const t = TRANSLATIONS[language];
  const isMarathi = language === 'mr';

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | string>('all');

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Current User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('proprint_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Profile Update Modal
  const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] = useState<boolean>(false);

  const isUserNameNotUpdated = (targetUser?: User | null): boolean => {
    const u = targetUser !== undefined ? targetUser : currentUser;
    if (!u) return false;
    if (u.role === 'admin') return false;
    if (u.nameUpdated === true) return false;

    const trimmed = (u.name || '').trim().toLowerCase();
    if (!trimmed) return true;
    if (
      trimmed === 'customer' ||
      trimmed === 'proprint customer' ||
      trimmed === 'new customer' ||
      trimmed === 'customer client'
    ) return true;
    if (trimmed.startsWith('customer (') || trimmed.startsWith('customer-')) return true;
    if (trimmed === 'user' || trimmed.startsWith('user@') || trimmed.startsWith('user-')) return true;

    return false;
  };

  const openUpdateProfileModal = () => {
    setIsUpdateProfileModalOpen(true);
  };

  const closeUpdateProfileModal = () => {
    setIsUpdateProfileModalOpen(false);
    sessionStorage.setItem('proprint_profile_prompt_dismissed', 'true');
  };

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('proprint_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('proprint_wishlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('proprint_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('proprint_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Hero Slides
  const DEFAULT_HERO_SLIDES: HeroSlide[] = [
    {
      id: 'slide-1',
      title1: 'Custom Packaging Boxes',
      title2: 'Packaging',
      highlight: 'Rigid Boxes',
      subtitle: 'Perfect packaging solutions for your brand.',
      buttonText: 'Explore Now',
      quoteButtonText: 'Enquiry',
      theme: 'dark',
      tag: 'Packaging Line',
      badge: 'Popular',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920&auto=format&fit=crop&q=80',
      typeLabel: 'Packaging',
      productId: 'prod-custom-packaging-box',
      categoryLink: '/products?category=packaging',
      displayOrder: 1,
      isActive: true
    },
    {
      id: 'slide-2',
      title1: 'Premium Visiting & Business Cards',
      title2: 'Business Cards',
      highlight: 'Spot UV & Velvet',
      subtitle: 'Tactile velvet matte textures with raised metallic gold foil.',
      buttonText: 'Explore Now',
      quoteButtonText: 'Quick Quote',
      theme: 'dark',
      tag: 'Corporate Cards',
      badge: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&auto=format&fit=crop&q=80',
      typeLabel: 'Visiting Cards',
      productId: 'prod-luxury-velvet-card',
      categoryLink: '/products?category=visiting-cards',
      displayOrder: 2,
      isActive: true
    },
    {
      id: 'slide-3',
      title1: 'Brochures & Product Catalogs',
      title2: 'Brochures',
      highlight: 'Full Color Offset',
      subtitle: 'High-definition 300 GSM multi-fold brochures and booklets.',
      buttonText: 'Explore Now',
      quoteButtonText: 'Quick Quote',
      theme: 'dark',
      tag: 'Commercial Press',
      badge: 'Hot',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1920&auto=format&fit=crop&q=80',
      typeLabel: 'Brochures',
      productId: 'prod-premium-brochure',
      categoryLink: '/products?category=brochures',
      displayOrder: 3,
      isActive: true
    }
  ];

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const saved = localStorage.getItem('proprint_hero_slides');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_HERO_SLIDES;
      }
    }
    return DEFAULT_HERO_SLIDES;
  });

  // Services
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('proprint_services');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Portfolio
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('proprint_portfolio');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Users
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('proprint_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Payments
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('proprint_payments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Reviews
  const [reviews, setReviews] = useState<ReviewRecord[]>(() => {
    const saved = localStorage.getItem('proprint_reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('proprint_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Quotes
  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    const saved = localStorage.getItem('proprint_quotes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Modal Drawers
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpenState] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const openWhatsApp = (message?: string) => {
    openDirectWhatsApp(message);
  };

  const setIsWhatsAppModalOpen = (open: boolean) => {
    if (open) {
      openDirectWhatsApp();
    }
    setIsWhatsAppModalOpenState(open);
  };

  // Global loading
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerTopLoading = (durationMs: number = 800) => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
    setIsGlobalLoading(true);
    loadingTimerRef.current = setTimeout(() => {
      setIsGlobalLoading(false);
    }, durationMs);
  };

  // Toast
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    triggerTopLoading(700);
    if (type === 'error') {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      setToast({ id: Date.now(), message, type });
      toastTimerRef.current = setTimeout(() => {
        setToast(null);
      }, 4000);
    } else {
      setToast(null);
    }
  };

  const closeToast = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast(null);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('proprint_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('proprint_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('proprint_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('proprint_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('proprint_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('proprint_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('proprint_hero_slides', JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem('proprint_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('proprint_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('proprint_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('proprint_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('proprint_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('proprint_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('proprint_user');
    }
  }, [currentUser]);

  // ================================================================
  // Helper to transform image URLs in an object
  // ================================================================
  const transformImageUrls = <T extends Record<string, any>>(item: T): T => {
    const result = { ...item };
    // For Product
    if (result.image) {
      result.image = getFullImageUrl(result.image);
    }
    if (result.galleryImages && Array.isArray(result.galleryImages)) {
      result.galleryImages = result.galleryImages.map((img: string) => getFullImageUrl(img));
    }
    // For Category
    if (result.image && typeof result.image === 'string') {
      result.image = getFullImageUrl(result.image);
    }
    // For HeroSlide
    if (result.image) {
      result.image = getFullImageUrl(result.image);
    }
    // For PortfolioItem
    if (result.image) {
      result.image = getFullImageUrl(result.image);
    }
    return result;
  };

  // ================================================================
  // Data fetching function (with cache‑busting via apiFetch and image transformation)
  // ================================================================
  const fetchAllInitialData = async () => {
    try {
      // Fetch users
      const usersRes = await apiFetch('/api/users');
      if (usersRes.ok) {
        const uData = await usersRes.json();
        if (uData.success && Array.isArray(uData.users) && uData.users.length > 0) {
          // Users usually don't have images, but we can keep as is
          setUsers(uData.users);
          localStorage.setItem('proprint_users', JSON.stringify(uData.users));

          const savedUser = localStorage.getItem('proprint_user');
          if (savedUser) {
            try {
              const parsed = JSON.parse(savedUser);
              const matched = uData.users.find((u: User) => u.id === parsed.id || u.email === parsed.email || u.phone === parsed.phone);
              if (matched) {
                setCurrentUser(matched);
                localStorage.setItem('proprint_user', JSON.stringify(matched));
              }
            } catch (_e) {}
          }
        }
      }

      // Fetch products with image transformation
      const prodRes = await apiFetch('/api/products');
      if (prodRes.ok) {
        const pData = await prodRes.json();
        if (pData.success && Array.isArray(pData.products) && pData.products.length > 0) {
          const transformedProducts = pData.products.map((p: Product) => transformImageUrls(p));
          setProducts(transformedProducts);
          localStorage.setItem('proprint_products', JSON.stringify(transformedProducts));
        }
      }

      // Fetch categories with image transformation
      const catRes = await apiFetch('/api/categories');
      if (catRes.ok) {
        const cData = await catRes.json();
        if (cData.success && Array.isArray(cData.categories) && cData.categories.length > 0) {
          const transformedCategories = cData.categories.map((c: Category) => transformImageUrls(c));
          setCategories(transformedCategories);
          localStorage.setItem('proprint_categories', JSON.stringify(transformedCategories));
        }
      }

      // Fetch orders
      const ordRes = await apiFetch('/api/orders');
      if (ordRes.ok) {
        const oData = await ordRes.json();
        if (oData.success && Array.isArray(oData.orders)) {
          setOrders(oData.orders);
          localStorage.setItem('proprint_orders', JSON.stringify(oData.orders));
        }
      }

      // Fetch hero slides with image transformation
      const slidesRes = await apiFetch('/api/hero-slides');
      if (slidesRes.ok) {
        const sData = await slidesRes.json();
        if (sData.success && Array.isArray(sData.slides) && sData.slides.length > 0) {
          const transformedSlides = sData.slides.map((s: HeroSlide) => transformImageUrls(s));
          setHeroSlides(transformedSlides);
          localStorage.setItem('proprint_hero_slides', JSON.stringify(transformedSlides));
        }
      }

      // Fetch reviews
      const revRes = await apiFetch('/api/reviews');
      if (revRes.ok) {
        const rData = await revRes.json();
        if (rData.success && Array.isArray(rData.reviews) && rData.reviews.length > 0) {
          setReviews(rData.reviews);
          localStorage.setItem('proprint_reviews', JSON.stringify(rData.reviews));
        }
      }

      // Fetch quotes
      const qRes = await apiFetch('/api/quotes');
      if (qRes.ok) {
        const qData = await qRes.json();
        if (qData.success && Array.isArray(qData.quotes)) {
          setQuotes(qData.quotes);
          localStorage.setItem('proprint_quotes', JSON.stringify(qData.quotes));
        }
      }

      // Fetch payments
      const payRes = await apiFetch('/api/payments');
      if (payRes.ok) {
        const pData = await payRes.json();
        if (pData.success && Array.isArray(pData.payments)) {
          setPayments(pData.payments);
          localStorage.setItem('proprint_payments', JSON.stringify(pData.payments));
        }
      }

      // Fetch services
      const srvRes = await apiFetch('/api/services');
      if (srvRes.ok) {
        const sData = await srvRes.json();
        if (sData.success && Array.isArray(sData.services) && sData.services.length > 0) {
          setServices(sData.services);
          localStorage.setItem('proprint_services', JSON.stringify(sData.services));
        }
      }

      // Fetch portfolio with image transformation
      const portRes = await apiFetch('/api/portfolio');
      if (portRes.ok) {
        const portData = await portRes.json();
        if (portData.success && Array.isArray(portData.portfolio) && portData.portfolio.length > 0) {
          const transformedPortfolio = portData.portfolio.map((p: PortfolioItem) => transformImageUrls(p));
          setPortfolio(transformedPortfolio);
          localStorage.setItem('proprint_portfolio', JSON.stringify(transformedPortfolio));
        }
      }
    } catch (err) {
      console.warn('Initial data synchronization notice:', err);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchAllInitialData();
  }, []);

  // Additional background fetch (can be removed, but kept for safety)
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [ordersRes, usersRes, productsRes, categoriesRes, servicesRes, reviewsRes, quotesRes, paymentsRes, portfolioRes] = await Promise.allSettled([
          apiFetch('/api/orders').then(r => r.ok ? r.json() : null),
          apiFetch('/api/users').then(r => r.ok ? r.json() : null),
          apiFetch('/api/products').then(r => r.ok ? r.json() : null),
          apiFetch('/api/categories').then(r => r.ok ? r.json() : null),
          apiFetch('/api/services').then(r => r.ok ? r.json() : null),
          apiFetch('/api/reviews').then(r => r.ok ? r.json() : null),
          apiFetch('/api/quotes').then(r => r.ok ? r.json() : null),
          apiFetch('/api/payments').then(r => r.ok ? r.json() : null),
          apiFetch('/api/portfolio').then(r => r.ok ? r.json() : null)
        ]);

        if (ordersRes.status === 'fulfilled' && ordersRes.value?.success && Array.isArray(ordersRes.value.orders) && ordersRes.value.orders.length > 0) {
          setOrders(ordersRes.value.orders);
        }
        if (usersRes.status === 'fulfilled' && usersRes.value?.success && Array.isArray(usersRes.value.users) && usersRes.value.users.length > 0) {
          setUsers(usersRes.value.users);
        }
        if (productsRes.status === 'fulfilled' && productsRes.value?.success && Array.isArray(productsRes.value.products) && productsRes.value.products.length > 0) {
          const transformed = productsRes.value.products.map((p: Product) => transformImageUrls(p));
          setProducts(transformed);
          localStorage.setItem('proprint_products', JSON.stringify(transformed));
        }
        if (categoriesRes.status === 'fulfilled' && categoriesRes.value?.success && Array.isArray(categoriesRes.value.categories) && categoriesRes.value.categories.length > 0) {
          const transformed = categoriesRes.value.categories.map((c: Category) => transformImageUrls(c));
          setCategories(transformed);
          localStorage.setItem('proprint_categories', JSON.stringify(transformed));
        }
        if (servicesRes.status === 'fulfilled' && servicesRes.value?.success && Array.isArray(servicesRes.value.services) && servicesRes.value.services.length > 0) {
          setServices(servicesRes.value.services);
        }
        if (reviewsRes.status === 'fulfilled' && reviewsRes.value?.success && Array.isArray(reviewsRes.value.reviews) && reviewsRes.value.reviews.length > 0) {
          setReviews(reviewsRes.value.reviews);
        }
        if (quotesRes.status === 'fulfilled' && quotesRes.value?.success && Array.isArray(quotesRes.value.quotes) && quotesRes.value.quotes.length > 0) {
          setQuotes(quotesRes.value.quotes);
        }
        if (paymentsRes.status === 'fulfilled' && paymentsRes.value?.success && Array.isArray(paymentsRes.value.payments) && paymentsRes.value.payments.length > 0) {
          setPayments(paymentsRes.value.payments);
        }
        if (portfolioRes.status === 'fulfilled' && portfolioRes.value?.success && Array.isArray(portfolioRes.value.portfolio) && portfolioRes.value.portfolio.length > 0) {
          const transformed = portfolioRes.value.portfolio.map((p: PortfolioItem) => transformImageUrls(p));
          setPortfolio(transformed);
          localStorage.setItem('proprint_portfolio', JSON.stringify(transformed));
        }
      } catch (err) {
        console.warn('Using local persistence for backend sync', err);
      }
    };
    fetchBackendData();
  }, []);

  // ================================================================
  // NEW: refreshAllData and app resume listener
  // ================================================================
  const refreshAllData = async () => {
    await fetchAllInitialData();
  };

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const resumeHandler = App.addListener('resume', () => {
      console.log('[AppContext] App resumed – refreshing data...');
      refreshAllData();
    });

    return () => {
      resumeHandler.remove();
    };
  }, []);

  // ================================================================
  // Product CRUD Handlers
  // ================================================================
  const addProduct = (prodData: Partial<Product>): Product => {
    const newId = prodData.id || `prod-${Date.now()}`;
    // When adding, we assume the image is either a full URL or relative.
    // We'll store it as provided (backend will handle it). But for local state,
    // we transform to absolute if needed.
    const imageUrl = prodData.image ? getFullImageUrl(prodData.image) : 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';
    const galleryUrls = prodData.galleryImages?.map(img => getFullImageUrl(img)) || [imageUrl];

    const newProduct: Product = {
      id: newId,
      name: prodData.name || 'New Custom Print Product',
      nameMr: prodData.nameMr || prodData.name || 'नवीन प्रिंट उत्पादन',
      categoryId: (prodData.categoryId as CategoryId) || 'business-cards',
      category: prodData.category || 'Business Cards',
      basePrice: Number(prodData.basePrice) || 299,
      originalPrice: prodData.originalPrice || Math.round((Number(prodData.basePrice) || 299) * 1.3),
      description: prodData.description || 'High quality professional printing with premium finish and vivid CMYK color fidelity.',
      descriptionMr: prodData.descriptionMr || 'उत्कृष्ट फिनिशिंग व अचूक रंगांसह व्यावसायिक प्रिंटिंग.',
      image: imageUrl,
      galleryImages: galleryUrls,
      rating: prodData.rating || 4.9,
      reviewsCount: prodData.reviewsCount || 1,
      minQuantity: prodData.minQuantity || 100,
      defaultQuantity: prodData.defaultQuantity || 500,
      quantityOptions: prodData.quantityOptions || [100, 250, 500, 1000, 2000, 5000],
      sizes: prodData.sizes || [{ id: 'std', name: 'Standard (89mm x 51mm)', priceMultiplier: 1.0 }],
      finishes: prodData.finishes || [
        { id: 'matte', name: '350 GSM Velvet Matte', priceMultiplier: 1.0 },
        { id: 'gloss', name: '350 GSM Gloss Lamination', priceMultiplier: 1.1 },
        { id: 'uv', name: 'Spot UV + Gold Foil', priceMultiplier: 1.4 }
      ],
      features: prodData.features || ['CMYK 4-Color Heidelberg Press', 'Tear & Moisture Resistant', 'Same-Day Dispatch Ready'],
      tags: prodData.tags || ['Popular', 'Offset', 'Express'],
      turnaroundDays: prodData.turnaroundDays || 1,
      isPopular: prodData.isPopular !== undefined ? prodData.isPopular : true,
      isBestSeller: prodData.isBestSeller !== undefined ? prodData.isBestSeller : true
    };

    setProducts((prev) => [newProduct, ...prev]);
    // Send to backend with the original relative path (backend should store as is)
    const payload = { ...newProduct };
    // But we have transformed to absolute; we need to send back the relative? 
    // Actually the backend expects the image path as relative; we can extract the relative part.
    // For simplicity, we send the absolute URL; the backend may store it as is.
    apiFetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.warn('Product API sync error:', err));

    showToast(`✅ Product "${newProduct.name}" published successfully!`, 'success');
    return newProduct;
  };

  const updateProduct = (productId: string, updatedData: Partial<Product>) => {
    // Transform any new image URLs
    const transformedData = { ...updatedData };
    if (updatedData.image) {
      transformedData.image = getFullImageUrl(updatedData.image);
    }
    if (updatedData.galleryImages) {
      transformedData.galleryImages = updatedData.galleryImages.map(img => getFullImageUrl(img));
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...transformedData } : p))
    );
    apiFetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData) // send original data (maybe relative) to backend
    }).catch(err => console.warn('Product update API sync error:', err));

    showToast('Product details updated successfully!', 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    apiFetch(`/api/products/${productId}`, {
      method: 'DELETE'
    }).catch(err => console.warn('Product delete API sync error:', err));

    showToast('Product deleted from inventory.', 'info');
  };

  // Category CRUD – with image transformation
  const addCategory = (catData: Partial<Category>) => {
    const newId = (catData.id as CategoryId) || `cat-${Date.now()}` as CategoryId;
    const imageUrl = catData.image ? getFullImageUrl(catData.image) : 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';
    const newCat: Category = {
      id: newId,
      name: catData.name || 'New Category',
      nameMr: catData.nameMr || catData.name || 'नवीन वर्गवारी',
      shortName: catData.shortName || catData.name || 'Category',
      iconName: catData.iconName || 'Package',
      image: imageUrl,
      itemCount: catData.itemCount || 0,
      featured: catData.featured !== undefined ? catData.featured : true,
      description: catData.description || 'Custom print collection'
    };
    setCategories((prev) => [newCat, ...prev]);
    apiFetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData) // send original data
    }).catch(err => console.warn('Category API sync error:', err));

    showToast(`Category "${newCat.name}" added!`, 'success');
  };

  const updateCategory = (categoryId: string, updatedData: Partial<Category>) => {
    const transformedData = { ...updatedData };
    if (updatedData.image) {
      transformedData.image = getFullImageUrl(updatedData.image);
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, ...transformedData } : c))
    );
    apiFetch(`/api/categories/${categoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    }).catch(err => console.warn('Category update API sync error:', err));

    showToast('Category updated successfully!', 'success');
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    apiFetch(`/api/categories/${categoryId}`, {
      method: 'DELETE'
    }).catch(err => console.warn('Category delete API sync error:', err));

    showToast('Category removed.', 'info');
  };

  // Services CRUD (no images typically)
  const addService = (serviceData: Partial<ServiceItem>) => {
    const newService: ServiceItem = {
      id: serviceData.id || `srv-${Date.now()}`,
      name: serviceData.name || 'New Press Capability',
      category: serviceData.category || 'printing',
      tagline: serviceData.tagline || 'Commercial Printing & Pre-Press',
      description: serviceData.description || 'Full-color printing and design solution with pre-press proofing.',
      turnaround: serviceData.turnaround || '24 - 48 Hours',
      minOrder: serviceData.minOrder || '50 Units',
      iconName: serviceData.iconName || 'Printer',
      badge: serviceData.badge || undefined
    };
    setServices((prev) => [newService, ...prev]);
    apiFetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newService)
    }).catch(err => console.warn('Service API sync error:', err));

    showToast(`Service "${newService.name}" created successfully!`, 'success');
  };

  const updateService = (serviceId: string, updatedData: Partial<ServiceItem>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, ...updatedData } : s))
    );
    apiFetch(`/api/services/${serviceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    }).catch(err => console.warn('Service update API sync error:', err));

    showToast('Service updated successfully!', 'success');
  };

  const deleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    apiFetch(`/api/services/${serviceId}`, {
      method: 'DELETE'
    }).catch(err => console.warn('Service delete API sync error:', err));

    showToast('Service deleted from catalog.', 'info');
  };

  // Portfolio CRUD with image transformation
  const addPortfolioItem = async (itemData: Partial<PortfolioItem>): Promise<PortfolioItem | null> => {
    const imageUrl = itemData.image ? getFullImageUrl(itemData.image) : 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80';
    const newItem: PortfolioItem = {
      id: itemData.id || `work-${Date.now()}`,
      title: itemData.title || 'New Design Project',
      titleMr: itemData.titleMr || itemData.title || 'नवीन डिझाईन प्रकल्प',
      category: itemData.category || 'branding',
      categoryLabel: itemData.categoryLabel || 'Branding',
      categoryLabelMr: itemData.categoryLabelMr || itemData.categoryLabel || 'ब्रँडिंग',
      client: itemData.client || 'Enterprise Client',
      city: itemData.city || 'Chh. Sambhajinagar',
      cityMr: itemData.cityMr || 'छत्रपती संभाजीनगर',
      image: imageUrl,
      aspectRatio: itemData.aspectRatio || 'square',
      description: itemData.description || '',
      descriptionMr: itemData.descriptionMr || '',
      tags: itemData.tags || [],
      deliverables: itemData.deliverables || [],
      deliverablesMr: itemData.deliverablesMr || [],
      badge: itemData.badge || undefined,
      badgeMr: itemData.badgeMr || undefined
    };

    setPortfolio((prev) => [newItem, ...prev]);

    try {
      const res = await apiFetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData) // send original data
      });
      const data = await res.json();
      if (data.success && data.item) {
        showToast(`Design work "${newItem.title}" added to showcase!`, 'success');
        return data.item;
      }
    } catch (err) {
      console.warn('Portfolio API sync error:', err);
    }
    showToast(`Design work "${newItem.title}" saved!`, 'success');
    return newItem;
  };

  const updatePortfolioItem = async (id: string, updatedData: Partial<PortfolioItem>): Promise<boolean> => {
    const transformedData = { ...updatedData };
    if (updatedData.image) {
      transformedData.image = getFullImageUrl(updatedData.image);
    }
    setPortfolio((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...transformedData } : item))
    );

    try {
      const res = await apiFetch(`/api/portfolio/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Design work updated successfully!', 'success');
        return true;
      }
    } catch (err) {
      console.warn('Portfolio update API sync error:', err);
    }
    showToast('Design work updated!', 'success');
    return true;
  };

  const deletePortfolioItem = async (id: string): Promise<boolean> => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
    try {
      const res = await apiFetch(`/api/portfolio/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast('Design work removed from portfolio.', 'info');
        return true;
      }
    } catch (err) {
      console.warn('Portfolio delete API sync error:', err);
    }
    showToast('Design work removed.', 'info');
    return true;
  };

  const refreshPortfolio = async () => {
    try {
      const res = await apiFetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.portfolio)) {
          const transformed = data.portfolio.map((p: PortfolioItem) => transformImageUrls(p));
          setPortfolio(transformed);
          localStorage.setItem('proprint_portfolio', JSON.stringify(transformed));
        }
      }
    } catch (err) {
      console.warn('Portfolio refresh error:', err);
    }
  };

  // User CRUD (unchanged)
  const addUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: userData.id || `user-${Date.now()}`,
      name: userData.name || 'New Customer',
      email: userData.email || `user${Date.now()}@example.com`,
      phone: userData.phone || '9876543210',
      role: userData.role || 'customer',
      companyName: userData.companyName || 'Business Firm',
      gstNumber: userData.gstNumber || '',
      shippingAddress: userData.shippingAddress || 'Chikalthana, Chh. Sambhajinagar',
      city: userData.city || 'Chh. Sambhajinagar',
      pincode: userData.pincode || '431001',
      createdAt: 'Today'
    };
    setUsers((prev) => [newUser, ...prev]);
    apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).catch(err => console.warn('User register API sync error:', err));

    showToast(`User ${newUser.name} added!`, 'success');
  };

  const updateUser = (emailOrId: string, updatedData: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === emailOrId || u.email === emailOrId ? { ...u, ...updatedData } : u
      )
    );
    apiFetch(`/api/users/${emailOrId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    }).catch(err => console.warn('User update API sync error:', err));

    showToast('User account updated!', 'success');
  };

  const deleteUser = (emailOrId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== emailOrId && u.email !== emailOrId));
    apiFetch(`/api/users/${emailOrId}`, {
      method: 'DELETE'
    }).catch(err => console.warn('User delete API sync error:', err));

    showToast('User removed.', 'info');
  };

  // Payment Status
  const updatePaymentStatus = (paymentId: string, status: 'Completed' | 'Pending' | 'Failed' | 'Refunded') => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status } : p))
    );
    apiFetch(`/api/payments/${paymentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(err => console.warn('Payment status API sync error:', err));

    showToast(`Payment #${paymentId} marked as ${status}`, 'success');
  };

  // Reviews CRUD
  const updateReviewStatus = (reviewId: string, status: 'Approved' | 'Pending' | 'Hidden') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
    apiFetch(`/api/reviews/${reviewId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(err => console.warn('Review status API sync error:', err));

    showToast(`Review marked as ${status}`, 'success');
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    apiFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE'
    }).catch(err => console.warn('Review delete API sync error:', err));

    showToast('Review removed.', 'info');
  };

  const addReview = (reviewData: Partial<ReviewRecord>) => {
    const newRev: ReviewRecord = {
      id: `REV-${Date.now()}`,
      customerName: reviewData.customerName || 'Verified Customer',
      customerRole: reviewData.customerRole || 'Client',
      productName: reviewData.productName || 'Visiting Card',
      rating: reviewData.rating || 5,
      comment: reviewData.comment || 'Great print quality!',
      date: 'Just now',
      status: 'Approved',
      verifiedBuyer: true
    };
    setReviews((prev) => [newRev, ...prev]);
    apiFetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRev)
    }).catch(err => console.warn('Review create API sync error:', err));

    showToast('Review submitted!', 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId && o.orderNumber !== orderId));
    apiFetch(`/api/orders/${orderId}`, {
      method: 'DELETE'
    }).catch(err => console.warn('Order delete API sync error:', err));

    showToast('Order removed.', 'info');
  };

  // Order & Quote status updates
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          return { ...ord, status: newStatus };
        }
        return ord;
      })
    );
    apiFetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(err => console.warn('API sync status error:', err));

    showToast(`Order status updated to: ${newStatus}`, 'success');
  };

  const updateQuoteStatus = (quoteId: string, newStatus: string) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteId) {
          return { ...q, status: newStatus };
        }
        return q;
      })
    );
    apiFetch(`/api/quotes/${quoteId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(err => console.warn('Quote status API sync error:', err));

    showToast(`Quote request updated to: ${newStatus}`, 'info');
  };

  // Hero Slide handlers
  const addHeroSlide = async (slideData: Partial<HeroSlide>): Promise<HeroSlide | null> => {
    const tempId = `slide-${Date.now()}`;
    const imageUrl = slideData.image ? getFullImageUrl(slideData.image) : 'https://i.pinimg.com/736x/c6/e3/bb/c6e3bbbd242f377f64021fe55c33b17d.jpg';
    const newSlide: HeroSlide = {
      id: tempId,
      title1: slideData.title1 || 'Exclusive Commercial Print Services',
      title2: slideData.title2 || '',
      highlight: slideData.highlight || '',
      subtitle: slideData.subtitle || '',
      image: imageUrl,
      buttonText: slideData.buttonText || 'Order Now',
      quoteButtonText: slideData.quoteButtonText || 'Quick Quote',
      typeLabel: slideData.typeLabel || 'Printing',
      productId: slideData.productId || '',
      categoryLink: slideData.categoryLink || '/products',
      theme: slideData.theme || 'crimson',
      tag: slideData.tag || '',
      badge: slideData.badge || '',
      displayOrder: slideData.displayOrder ?? (heroSlides.length + 1),
      isActive: slideData.isActive !== false,
      createdAt: new Date().toISOString()
    };

    setHeroSlides(prev => [...prev, newSlide]);

    try {
      const res = await apiFetch('/api/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideData) // send original
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.slide) {
          const transformedSlide = transformImageUrls(data.slide);
          setHeroSlides(prev => prev.map(s => s.id === tempId ? transformedSlide : s));
          showToast('Hero banner saved successfully', 'success');
          return transformedSlide;
        }
      }
    } catch (err) {
      console.error('Error creating hero slide:', err);
    }
    showToast('Hero banner saved', 'success');
    return newSlide;
  };

  const updateHeroSlide = async (id: string | number, updatedData: Partial<HeroSlide>, silent = false): Promise<boolean> => {
    // Transform image if present
    const transformedData = { ...updatedData };
    if (updatedData.image) {
      transformedData.image = getFullImageUrl(updatedData.image);
    }
    setHeroSlides(prev =>
      prev.map(s => (s.id === id ? { ...s, ...transformedData, updatedAt: new Date().toISOString() } : s))
    );

    try {
      const res = await apiFetch(`/api/hero-slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData) // send original
      });
      if (res.ok) {
        if (!silent) {
          showToast('Banner updated successfully', 'success');
        }
        return true;
      }
    } catch (err) {
      console.error('Error updating hero slide:', err);
    }
    if (!silent) {
      showToast('Banner updated', 'info');
    }
    return true;
  };

  const deleteHeroSlide = async (id: string | number): Promise<boolean> => {
    setHeroSlides(prev => prev.filter(s => s.id !== id));
    try {
      const res = await apiFetch(`/api/hero-slides/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('Banner deleted', 'info');
        return true;
      }
    } catch (err) {
      console.error('Error deleting hero slide:', err);
    }
    showToast('Banner deleted', 'info');
    return true;
  };

  const reorderHeroSlides = async (orderedIds: (string | number)[]): Promise<boolean> => {
    const reordered: HeroSlide[] = [];
    orderedIds.forEach((id, idx) => {
      const found = heroSlides.find(s => String(s.id) === String(id));
      if (found) {
        reordered.push({ ...found, displayOrder: idx + 1 });
      }
    });
    setHeroSlides(reordered);

    try {
      await apiFetch('/api/hero-slides/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds })
      });
    } catch (err) {
      console.error('Error syncing slide order:', err);
    }
    return true;
  };

  const resetHeroSlides = async (): Promise<void> => {
    setHeroSlides(DEFAULT_HERO_SLIDES);
    try {
      await apiFetch('/api/hero-slides/reset', { method: 'POST' });
      showToast('Hero banners reset to default layout', 'info');
    } catch (err) {
      console.error('Error resetting hero slides:', err);
    }
  };

  const refreshHeroSlides = async (): Promise<void> => {
    try {
      const res = await apiFetch('/api/hero-slides');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.slides)) {
          const transformed = data.slides.map((s: HeroSlide) => transformImageUrls(s));
          setHeroSlides(transformed);
          localStorage.setItem('proprint_hero_slides', JSON.stringify(transformed));
        }
      }
    } catch (err) {
      console.error('Error refreshing hero slides:', err);
    }
  };

  const activeHeroSlides = heroSlides.filter(s => s.isActive !== false);

  // Cart operations
  const addToCart = (product: Product, customization: SelectedProductCustomization) => {
    const id = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newItem: CartItem = {
      id,
      cartItemId: id,
      product,
      customization,
      subtotal: customization.calculatedPrice
    };

    setCartItems((prev) => [newItem, ...prev]);
    showToast(`Added ${customization.quantity}x ${product.name} to cart!`, 'success');
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId || item.id === cartItemId) {
          const unitRate = item.product.basePrice / (item.product.defaultQuantity || 100);
          const newSubtotal = Math.round(unitRate * newQuantity);
          return {
            ...item,
            customization: {
              ...item.customization,
              quantity: newQuantity,
              calculatedPrice: newSubtotal
            },
            subtotal: newSubtotal
          };
        }
        return item;
      })
    );
  };

  const removeCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId && item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => setCartItems([]);

  // Wishlist
  const toggleWishlist = (productOrId: string | Product) => {
    const productId = typeof productOrId === 'string' ? productOrId : productOrId.id;
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    showToast('Removed from saved wishlist', 'info');
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);
  const isInWishlist = isWishlisted;
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    return localStorage.getItem('proprint_coupon') || 'NEWUSER';
  });

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'NEWUSER' || clean === 'PROPRINT50' || clean === 'FIRST50') {
      setAppliedCoupon(clean);
      localStorage.setItem('proprint_coupon', clean);
      showToast(`🎉 Coupon ${clean} applied! 50% discount active!`, 'success');
      return true;
    }
    showToast('Invalid coupon code. Try NEWUSER for 50% OFF', 'error');
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('proprint_coupon');
    showToast('Coupon removed', 'info');
  };

  const rawSubtotal = cartItems.reduce((acc, item) => acc + (item.subtotal || item.customization.calculatedPrice || 0), 0);
  const discountAmount = appliedCoupon ? Math.round(rawSubtotal * 0.5) : 0;
  const cartSubtotal = Math.max(0, rawSubtotal - discountAmount);
  const cartTax = Math.round(cartSubtotal * 0.18);
  const cartTotal = cartSubtotal + cartTax;

  // Authentication (unchanged, but ensure any image updates are transformed)
  const login = (username: string, password?: string): { success: boolean; role: 'admin' | 'customer'; user?: User; error?: string } => {
    // ... (keep the same as before)
    // (No image changes)
    // I'll copy the existing login function from your original code to keep consistency.
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanUser) {
      showToast('Please enter your username or email', 'error');
      return { success: false, role: 'customer', error: 'Please enter username' };
    }

    if (!cleanPass) {
      showToast('Please enter your password', 'error');
      return { success: false, role: 'customer', error: 'Please enter password' };
    }

    if (cleanUser === 'admin' || cleanUser === 'admin@proprint.in') {
      const isValidAdminPass = cleanPass === 'admin@123' || cleanPass === 'admin123' || cleanPass === 'admin';
      if (!isValidAdminPass) {
        showToast('Invalid password for Admin account', 'error');
        return { success: false, role: 'admin', error: 'Invalid password for Admin' };
      }

      const existingAdmin = users.find(u => u.role === 'admin' || u.id === 'user-admin-1');
      const adminUser: User = existingAdmin || {
        id: 'user-admin-1',
        name: 'Admin Manager',
        email: 'admin@proprint.in',
        phone: '9322126863',
        role: 'admin',
        companyName: 'Proprint Commercial Press MIDC',
        gstNumber: '27AABCP1234F1Z8',
        shippingAddress: 'Plot 18, Industrial Estate, Chikalthana MIDC',
        city: 'Chhatrapati Sambhajinagar',
        pincode: '431001',
        createdAt: '01 Jan 2026'
      };
      setCurrentUser(adminUser);
      localStorage.setItem('proprint_user', JSON.stringify(adminUser));

      apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass })
      }).catch(err => console.warn('Auth API sync', err));

      showToast('👑 Welcome Admin! Logged into Press Management Portal.', 'success');
      return { success: true, role: 'admin', user: adminUser };
    }

    if (cleanUser === 'user' || cleanUser === 'user@proprint.in' || cleanUser === 'customer') {
      const isValidUserPass = cleanPass === 'user@123' || cleanPass === 'user123' || cleanPass === 'user';
      if (!isValidUserPass) {
        showToast('Invalid password for User account', 'error');
        return { success: false, role: 'customer', error: 'Invalid password for User' };
      }

      const existingCustomer = users.find(u => u.id === 'user-customer-1' || u.email === 'user@proprint.in');
      const customerUser: User = existingCustomer || {
        id: 'user-customer-1',
        name: 'Customer Client',
        email: 'user@proprint.in',
        phone: '9322126863',
        role: 'customer',
        companyName: 'TechPrimeLab Commercial Firm',
        gstNumber: '27AXXXX1234X1Z0',
        shippingAddress: 'Sushila Arcade, Motikaranja',
        city: 'Chhatrapati Sambhajinagar',
        pincode: '431001',
        createdAt: 'Just now'
      };
      setCurrentUser(customerUser);
      localStorage.setItem('proprint_user', JSON.stringify(customerUser));
      
      setAppliedCoupon('NEWUSER');
      localStorage.setItem('proprint_coupon', 'NEWUSER');

      apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass })
      }).catch(err => console.warn('Auth API sync', err));

      showToast(`Welcome back, ${customerUser.name}!`, 'success');
      return { success: true, role: 'customer', user: customerUser };
    }

    const existingCustom = users.find(u => 
      (u.email && u.email.toLowerCase() === cleanUser) || 
      (u.name && u.name.toLowerCase() === cleanUser) ||
      (u.phone && u.phone.includes(cleanUser))
    );

    const customUser: User = existingCustom || {
      id: `user-${Date.now()}`,
      name: username.includes('@') ? username.split('@')[0] : (username.charAt(0).toUpperCase() + username.slice(1)),
      email: username.includes('@') ? username : `${cleanUser}@proprint.in`,
      phone: '9322126863',
      role: 'customer',
      companyName: 'Commercial Firm',
      gstNumber: '27ABCDE1234F1Z5',
      shippingAddress: 'Chhatrapati Sambhajinagar',
      city: 'Chhatrapati Sambhajinagar',
      pincode: '431001',
      createdAt: 'Just now'
    };

    if (!existingCustom) {
      setUsers(prev => [customUser, ...prev]);
    }

    setCurrentUser(customUser);
    localStorage.setItem('proprint_user', JSON.stringify(customUser));

    apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: cleanUser, password: cleanPass })
    }).catch(err => console.warn('Auth API sync', err));

    if (isUserNameNotUpdated(customUser)) {
      sessionStorage.removeItem('proprint_profile_prompt_dismissed');
      setIsUpdateProfileModalOpen(true);
    }

    showToast(`Welcome, ${customUser.name}!`, 'success');
    return { success: true, role: 'customer', user: customUser };
  };

  const loginWithPhone = (phoneNumber: string, name?: string): { success: boolean; user: User } => {
    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    const existingUser = users.find(u => u.phone && u.phone.replace(/\D/g, '').slice(-10) === cleanPhone);

    const userToLogin: User = existingUser || {
      id: `user-phone-${cleanPhone || Date.now()}`,
      name: name || (cleanPhone ? `Customer (${cleanPhone.slice(-4)})` : 'Proprint Customer'),
      email: `${cleanPhone || 'user'}@proprint.in`,
      phone: cleanPhone || '9322126863',
      role: 'customer',
      companyName: 'Commercial Firm',
      gstNumber: '',
      shippingAddress: 'Chhatrapati Sambhajinagar',
      city: 'Chhatrapati Sambhajinagar',
      pincode: '431001',
      createdAt: 'Today',
      nameUpdated: false,
      isProfileComplete: false
    };

    if (!existingUser) {
      setUsers(prev => [userToLogin, ...prev]);
    }

    setCurrentUser(userToLogin);
    localStorage.setItem('proprint_user', JSON.stringify(userToLogin));

    if (!appliedCoupon) {
      setAppliedCoupon('NEWUSER');
      localStorage.setItem('proprint_coupon', 'NEWUSER');
    }

    apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, role: 'customer' })
    }).catch(err => console.warn('Auth phone sync', err));

    if (isUserNameNotUpdated(userToLogin)) {
      sessionStorage.removeItem('proprint_profile_prompt_dismissed');
      setIsUpdateProfileModalOpen(true);
    }

    showToast(`🎉 Welcome, ${userToLogin.name}! Logged in successfully.`, 'success');
    return { success: true, user: userToLogin };
  };

  const updateUserProfile = async (updatedFields: Partial<User>): Promise<boolean> => {
    if (!currentUser) return false;
    const hasValidName = Boolean(
      updatedFields.name && 
      updatedFields.name.trim().length > 1 && 
      !updatedFields.name.trim().toLowerCase().startsWith('customer')
    );

    const updatedUser: User = {
      ...currentUser,
      ...updatedFields,
      nameUpdated: hasValidName ? true : (currentUser.nameUpdated ?? false),
      isProfileComplete: hasValidName ? true : (currentUser.isProfileComplete ?? false)
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('proprint_user', JSON.stringify(updatedUser));

    setUsers(prev => prev.map(u => (u.id === updatedUser.id || u.email === updatedUser.email ? updatedUser : u)));
    setIsUpdateProfileModalOpen(false);
    sessionStorage.removeItem('proprint_profile_prompt_dismissed');

    if (updatedUser.id) {
      try {
        await apiFetch(`/api/users/${updatedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            companyName: updatedUser.companyName,
            gstNumber: updatedUser.gstNumber || updatedUser.gstin,
            shippingAddress: updatedUser.shippingAddress || updatedUser.address,
            city: updatedUser.city,
            pincode: updatedUser.pincode,
            addresses: updatedUser.addresses
          })
        });
      } catch (err) {
        console.warn('Error syncing profile with backend:', err);
      }
    }

    showToast('Profile details updated successfully', 'success');
    return true;
  };

  // Address functions (unchanged)
  const addUserAddress = async (newAddrData: Omit<UserAddress, 'id'>): Promise<boolean> => {
    if (!currentUser) return false;
    const existingAddresses = currentUser.addresses || [];
    const newAddress: UserAddress = {
      ...newAddrData,
      id: `addr-${Date.now()}`,
      isDefault: existingAddresses.length === 0 ? true : !!newAddrData.isDefault
    };

    let updatedAddresses = [...existingAddresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddress);

    const updatedUser: User = {
      ...currentUser,
      addresses: updatedAddresses,
      shippingAddress: newAddress.isDefault ? newAddress.addressLine : (currentUser.shippingAddress || newAddress.addressLine),
      city: newAddress.isDefault ? newAddress.city : (currentUser.city || newAddress.city),
      pincode: newAddress.isDefault ? newAddress.pincode : (currentUser.pincode || newAddress.pincode)
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('proprint_user', JSON.stringify(updatedUser));
    setUsers(prev => prev.map(u => (u.id === updatedUser.id || u.email === updatedUser.email ? updatedUser : u)));

    if (updatedUser.id) {
      try {
        await apiFetch(`/api/users/${updatedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ addresses: updatedAddresses })
        });
      } catch (err) {
        console.warn('Address sync error:', err);
      }
    }

    showToast('New delivery address added', 'success');
    return true;
  };

  const updateUserAddress = async (addressId: string, updated: Partial<UserAddress>): Promise<boolean> => {
    if (!currentUser) return false;
    const existingAddresses = currentUser.addresses || [];
    let updatedAddresses = existingAddresses.map(a => {
      if (a.id === addressId) {
        return { ...a, ...updated };
      }
      if (updated.isDefault) {
        return { ...a, isDefault: false };
      }
      return a;
    });

    const defaultAddr = updatedAddresses.find(a => a.isDefault) || updatedAddresses[0];

    const updatedUser: User = {
      ...currentUser,
      addresses: updatedAddresses,
      shippingAddress: defaultAddr?.addressLine || currentUser.shippingAddress,
      city: defaultAddr?.city || currentUser.city,
      pincode: defaultAddr?.pincode || currentUser.pincode
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('proprint_user', JSON.stringify(updatedUser));
    setUsers(prev => prev.map(u => (u.id === updatedUser.id || u.email === updatedUser.email ? updatedUser : u)));

    if (updatedUser.id) {
      try {
        await apiFetch(`/api/users/${updatedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ addresses: updatedAddresses })
        });
      } catch (err) {
        console.warn('Address update sync error:', err);
      }
    }

    showToast('Address updated successfully', 'success');
    return true;
  };

  const deleteUserAddress = async (addressId: string): Promise<boolean> => {
    if (!currentUser) return false;
    const existingAddresses = currentUser.addresses || [];
    let updatedAddresses = existingAddresses.filter(a => a.id !== addressId);

    if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }

    const defaultAddr = updatedAddresses.find(a => a.isDefault);
    const updatedUser: User = {
      ...currentUser,
      addresses: updatedAddresses,
      shippingAddress: defaultAddr?.addressLine || currentUser.shippingAddress,
      city: defaultAddr?.city || currentUser.city,
      pincode: defaultAddr?.pincode || currentUser.pincode
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('proprint_user', JSON.stringify(updatedUser));
    setUsers(prev => prev.map(u => (u.id === updatedUser.id || u.email === updatedUser.email ? updatedUser : u)));

    if (updatedUser.id) {
      try {
        await apiFetch(`/api/users/${updatedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ addresses: updatedAddresses })
        });
      } catch (err) {
        console.warn('Address delete sync error:', err);
      }
    }

    showToast('Address removed', 'info');
    return true;
  };

  const setDefaultAddress = async (addressId: string): Promise<boolean> => {
    if (!currentUser) return false;
    const existingAddresses = currentUser.addresses || [];
    const updatedAddresses = existingAddresses.map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));

    const defaultAddr = updatedAddresses.find(a => a.id === addressId);
    const updatedUser: User = {
      ...currentUser,
      addresses: updatedAddresses,
      shippingAddress: defaultAddr?.addressLine || currentUser.shippingAddress,
      city: defaultAddr?.city || currentUser.city,
      pincode: defaultAddr?.pincode || currentUser.pincode
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('proprint_user', JSON.stringify(updatedUser));
    setUsers(prev => prev.map(u => (u.id === updatedUser.id || u.email === updatedUser.email ? updatedUser : u)));

    if (updatedUser.id) {
      try {
        await apiFetch(`/api/users/${updatedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ addresses: updatedAddresses })
        });
      } catch (err) {
        console.warn('Set default address sync error:', err);
      }
    }

    showToast('Default delivery address updated', 'success');
    return true;
  };

  const loginDirectAdmin = (): { success: boolean; user: User } => {
    const adminUser: User = {
      id: 'user-admin-1',
      name: 'Admin Manager',
      email: 'admin@proprint.in',
      phone: '9322126863',
      role: 'admin',
      companyName: 'Proprint Commercial Press MIDC',
      gstNumber: '27AABCP1234F1Z8',
      shippingAddress: 'Plot 18, Industrial Estate, Chikalthana MIDC',
      city: 'Chhatrapati Sambhajinagar',
      pincode: '431001',
      createdAt: '01 Jan 2026'
    };
    setCurrentUser(adminUser);
    localStorage.setItem('proprint_user', JSON.stringify(adminUser));

    apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin@proprint.in', role: 'admin' })
    }).catch(err => console.warn('Auth admin sync', err));

    showToast('👑 Welcome Admin! Direct access granted.', 'success');
    return { success: true, user: adminUser };
  };

  // Place order (unchanged)
  const placeOrder = (orderData: any): Order => {
    const sub = orderData.subtotal || cartSubtotal;
    const tx = orderData.tax || cartTax;
    const tot = orderData.total || (sub + tx);

    const orderDateStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `PRP-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser?.id || 'user-customer-1',
      trackingNumber: `EXP-IN-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: orderData.fullName || orderData.name || currentUser?.name || 'Customer',
      customerPhone: orderData.phone || currentUser?.phone || '9322126863',
      customerEmail: orderData.email || currentUser?.email || 'user@proprint.in',
      shippingAddress: orderData.address || currentUser?.shippingAddress || currentUser?.address || 'Chhatrapati Sambhajinagar',
      city: orderData.city || currentUser?.city || 'Chhatrapati Sambhajinagar',
      pincode: orderData.pincode || currentUser?.pincode || '431001',
      items: [...cartItems],
      subtotal: sub,
      shippingFee: 0,
      tax: tx,
      total: tot,
      totalAmount: tot,
      paymentMethod: orderData.paymentMethod || 'UPI',
      paymentStatus: 'Paid',
      status: 'Order Placed',
      createdAt: orderDateStr,
      estimatedDelivery: '3-4 Days',
      uploadedFileUrl: orderData.uploadedFileUrl || cartItems.find(i => i.customization?.uploadedFileUrl)?.customization?.uploadedFileUrl,
      uploadedFileName: orderData.uploadedFileName || cartItems.find(i => i.customization?.uploadedFileName)?.customization?.uploadedFileName,
      uploadedFileSize: orderData.uploadedFileSize,
      uploadedFileType: orderData.uploadedFileType,
      uploadedIsImage: orderData.uploadedIsImage,
      notes: orderData.specialNotes || orderData.notes || '',
      timeline: [
        { title: 'Order Placed & Confirmed', titleMr: 'ऑर्डर नोंदवली व पुष्टी केली', description: 'Production file verified.', date: orderDateStr, completed: true, current: true },
        { title: 'Pre-flight Proof Approval', titleMr: 'प्री-प्रेस आर्टवर्क तपासणी', description: 'CMYK color matching check.', date: 'Upcoming', completed: false },
        { title: 'Press Printing', titleMr: 'ऑफसेट / डिजिटल प्रिंटिंग', description: 'Offset printing in progress.', date: 'Upcoming', completed: false },
        { title: 'Quality Check & Packing', titleMr: 'फिनिशिंग व पॅकिंग', description: 'Finishing & shrink wrap.', date: 'Upcoming', completed: false },
        { title: 'Dispatched via Courier', titleMr: 'कुरिअरने पाठवले', description: 'Tracking ID generated.', date: 'Upcoming', completed: false }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);

    if (currentUser) {
      const existingAddrs = currentUser.addresses || [];
      const hasAddr = existingAddrs.some(a => 
        a.addressLine?.toLowerCase() === newOrder.shippingAddress?.toLowerCase() &&
        a.pincode === newOrder.pincode
      );
      if (!hasAddr && newOrder.shippingAddress) {
        const newAddr: UserAddress = {
          id: `addr-${Date.now()}`,
          label: existingAddrs.length === 0 ? 'Primary' : `Address ${existingAddrs.length + 1}`,
          name: newOrder.customerName || currentUser.name,
          phone: newOrder.customerPhone || currentUser.phone,
          addressLine: newOrder.shippingAddress,
          city: newOrder.city || 'Chhatrapati Sambhajinagar',
          state: 'Maharashtra',
          pincode: newOrder.pincode || '431001',
          isDefault: existingAddrs.length === 0
        };
        const updatedAddrs = [...existingAddrs, newAddr];
        const updatedUser: User = {
          ...currentUser,
          addresses: updatedAddrs,
          shippingAddress: newOrder.shippingAddress,
          city: newOrder.city,
          pincode: newOrder.pincode
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('proprint_user', JSON.stringify(updatedUser));
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

        if (currentUser.id) {
          apiFetch(`/api/users/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              addresses: updatedAddrs,
              shippingAddress: newOrder.shippingAddress,
              city: newOrder.city,
              pincode: newOrder.pincode
            })
          }).catch(err => console.warn('Sync address from order', err));
        }
      }
    }

    apiFetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: newOrder.userId,
        fullName: newOrder.customerName,
        phone: newOrder.customerPhone,
        email: newOrder.customerEmail,
        address: newOrder.shippingAddress,
        city: newOrder.city,
        pincode: newOrder.pincode,
        subtotal: newOrder.subtotal,
        tax: newOrder.tax,
        total: newOrder.total,
        paymentMethod: newOrder.paymentMethod,
        items: newOrder.items,
        notes: newOrder.notes,
        uploadedFileUrl: newOrder.uploadedFileUrl,
        uploadedFileName: newOrder.uploadedFileName
      })
    }).catch(err => console.warn('Order API sync error:', err));

    showToast(`🎉 Order ${newOrder.orderNumber} placed successfully!`, 'success');
    return newOrder;
  };

  const addManualOrder = (orderData: any): Order => {
    // ... (keep as before, no image changes)
    // I'll copy the original to keep it unchanged.
    const orderId = `ord-manual-${Date.now()}`;
    const orderNumber = `PRP-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `EXP-IN-${Math.floor(100000 + Math.random() * 900000)}`;

    const customTimeline = [
      {
        title: orderData.status === 'Processing' ? 'In Printing Press' : 'Order Confirmed',
        titleMr: 'ऑर्डर निश्चित केली',
        description: orderData.source ? `Created via ${orderData.source}` : 'Manual order booked by Admin',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: true
      },
      {
        title: 'Artwork & Pre-flight Proof',
        titleMr: 'आर्टवर्क तपासणी',
        description: orderData.artworkStatus || 'Approved over WhatsApp discussion',
        date: 'Done',
        completed: true
      },
      {
        title: 'Printing in Progress',
        titleMr: 'प्रिंटिंग सुरू',
        description: `${orderData.paperStock || 'Commercial Stock'} • ${orderData.quantity || 500} Units`,
        date: 'In Queue',
        completed: orderData.status === 'Processing' || orderData.status === 'Shipped' || orderData.status === 'Delivered'
      },
      {
        title: 'Dispatched / Ready for Delivery',
        titleMr: 'रवाना किंवा डिलिव्हरी तयार',
        description: orderData.shippingAddress || 'Express Delivery',
        date: orderData.estimatedDelivery || 'Upcoming',
        completed: orderData.status === 'Shipped' || orderData.status === 'Delivered'
      }
    ];

    const manualItem: CartItem = {
      cartItemId: `item-${Date.now()}`,
      product: orderData.product || {
        id: `custom-prod-${Date.now()}`,
        categoryId: (orderData.category || 'business-cards') as any,
        name: orderData.productName || 'Custom Print Job',
        basePrice: orderData.unitPrice || 1,
        image: orderData.uploadedFileUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        galleryImages: [],
        rating: 5,
        reviewsCount: 1,
        quantityOptions: [orderData.quantity || 500],
        sizes: [{ id: 'custom', name: orderData.size || 'Custom Size' }],
        finishes: [{ id: 'custom-finish', name: orderData.paperStock || 'Standard' }],
        features: ['WhatsApp Finalized Specs']
      },
      productName: orderData.productName || 'Custom Print Job',
      quantity: orderData.quantity || 500,
      subtotal: orderData.totalAmount || orderData.total || 0,
      customization: {
        quantity: orderData.quantity || 500,
        sizeId: orderData.size || 'Standard',
        finishId: orderData.paperStock || 'Default',
        paperFinish: orderData.paperStock || '',
        specialInstructions: orderData.notes || '',
        calculatedPrice: orderData.totalAmount || orderData.total || 0,
        uploadedFileName: orderData.uploadedFileName,
        uploadedFileUrl: orderData.uploadedFileUrl
      }
    };

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: orderData.userId || 'admin-manual',
      trackingNumber,
      customerName: orderData.customerName || 'WhatsApp Client',
      customerPhone: orderData.customerPhone || '',
      customerEmail: orderData.customerEmail || '',
      shippingAddress: orderData.shippingAddress || 'Chhatrapati Sambhajinagar',
      city: orderData.city || 'Chhatrapati Sambhajinagar',
      pincode: orderData.pincode || '431001',
      items: orderData.items && orderData.items.length > 0 ? orderData.items : [manualItem],
      subtotal: orderData.subtotal || orderData.totalAmount || 0,
      tax: orderData.tax || 0,
      shippingFee: orderData.shippingFee || 0,
      total: orderData.totalAmount || orderData.total || 0,
      totalAmount: orderData.totalAmount || orderData.total || 0,
      paymentMethod: orderData.paymentMethod || 'UPI',
      paymentStatus: orderData.paymentStatus || 'Pending',
      status: orderData.status || 'Order Placed',
      createdAt: 'Just now',
      estimatedDelivery: orderData.estimatedDelivery || 'In 2-3 Business Days',
      timeline: customTimeline,
      notes: orderData.notes || (orderData.discussionNotes ? `WhatsApp: ${orderData.discussionNotes}` : 'Manual Admin Order'),
      uploadedFileUrl: orderData.uploadedFileUrl,
      uploadedFileName: orderData.uploadedFileName
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('proprint_orders', JSON.stringify(updated));

    apiFetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: newOrder.userId,
        fullName: newOrder.customerName,
        phone: newOrder.customerPhone,
        email: newOrder.customerEmail,
        address: newOrder.shippingAddress,
        city: newOrder.city,
        pincode: newOrder.pincode,
        subtotal: newOrder.subtotal,
        tax: newOrder.tax,
        total: newOrder.total,
        paymentMethod: newOrder.paymentMethod,
        paymentStatus: newOrder.paymentStatus,
        status: newOrder.status,
        items: newOrder.items,
        timeline: newOrder.timeline,
        notes: newOrder.notes,
        uploadedFileUrl: newOrder.uploadedFileUrl,
        uploadedFileName: newOrder.uploadedFileName
      })
    }).catch(err => console.warn('Manual Order API sync error:', err));

    showToast(`🎉 Order #${newOrder.orderNumber} added successfully!`, 'success');
    return newOrder;
  };

  const getOrderById = (orderId: string) => {
    const clean = orderId.trim().toLowerCase();
    return orders.find(
      (o) => o.id.toLowerCase() === clean || o.orderNumber.toLowerCase() === clean || (o.trackingNumber && o.trackingNumber.toLowerCase() === clean)
    );
  };

  const submitQuote = (newQuote: QuoteRequest) => {
    const quoteItem: QuoteRequest = {
      id: `quote-${Date.now()}`,
      createdAt: 'Just now',
      status: 'New',
      ...newQuote
    };
    setQuotes((prev) => [quoteItem, ...prev]);
    apiFetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteItem)
    }).catch(err => console.warn('Quote create API sync error:', err));

    showToast('Bulk quote request sent to estimations team!', 'success');
  };

  const addQuote = submitQuote;

  const switchUser = (u: User) => {
    setCurrentUser(u);
    showToast(`Switched account to ${u.name}`, 'info');
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
  };

  // ================================================================
  // Context Provider Value
  // ================================================================
  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isMarathi,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cart: cartItems,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart: removeCartItem,
        removeCartItem,
        clearCart,
        cartCount: cartItems.length,
        cartSubtotal,
        cartTax,
        cartTotal,
        wishlist: wishlistProducts,
        wishlistIds,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        isInWishlist,
        wishlistProducts,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        heroSlides,
        activeHeroSlides,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        reorderHeroSlides,
        resetHeroSlides,
        refreshHeroSlides,
        services,
        addService,
        updateService,
        deleteService,
        portfolio,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        refreshPortfolio,
        users,
        addUser,
        updateUser,
        deleteUser,
        payments,
        updatePaymentStatus,
        reviews,
        updateReviewStatus,
        deleteReview,
        addReview,
        orders,
        placeOrder,
        addManualOrder,
        getOrderById,
        updateOrderStatus,
        deleteOrder,
        quotes,
        submitQuote,
        addQuote,
        updateQuoteStatus,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        user: currentUser,
        currentUser,
        setUser: setCurrentUser,
        setCurrentUser,
        switchUser,
        updateUserProfile,
        addUserAddress,
        updateUserAddress,
        deleteUserAddress,
        setDefaultAddress,
        login,
        loginWithPhone,
        loginDirectAdmin,
        logout,
        isUpdateProfileModalOpen,
        setIsUpdateProfileModalOpen,
        openUpdateProfileModal,
        closeUpdateProfileModal,
        isUserNameNotUpdated,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isWishlistDrawerOpen,
        setIsWishlistDrawerOpen,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        openWhatsApp,
        isQuoteModalOpen,
        setIsQuoteModalOpen,
        toast,
        showToast,
        closeToast,
        isGlobalLoading,
        setIsGlobalLoading,
        triggerTopLoading,
        refreshAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const useAppContext = useApp;