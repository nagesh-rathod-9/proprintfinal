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

// Backend API base URL.
// Using the absolute Render URL makes API calls work from both the web app
// and the Capacitor Android app.
const API_BASE_URL = 'https://proprintfinal.onrender.com/api';

const apiFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  if (typeof input === 'string' && input.startsWith('/api')) {
    // Web: keep using the existing /api rewrite.
    // Capacitor: call the Render backend directly because the app has no
    // hosting-layer rewrite for relative /api URLs.
    if (Capacitor.isNativePlatform()) {
      const apiPath = input.slice('/api'.length);
      return fetch(`${API_BASE_URL}${apiPath}`, init);
    }
  }

  return fetch(input, init);
};

interface ToastInfo {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Language (English / Marathi)
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isMarathi: boolean;

  // Search & Filter Global State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CategoryId | string;
  setSelectedCategory: (cat: CategoryId | string) => void;

  // Products CRUD
  products: Product[];
  addProduct: (product: Partial<Product>) => Product;
  updateProduct: (productId: string, updatedData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Categories CRUD
  categories: Category[];
  addCategory: (category: Partial<Category>) => void;
  updateCategory: (categoryId: string, updatedData: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;

  // Hero Section Slides CRUD & Real-time
  heroSlides: HeroSlide[];
  activeHeroSlides: HeroSlide[];
  addHeroSlide: (slide: Partial<HeroSlide>) => Promise<HeroSlide | null>;
  updateHeroSlide: (id: string | number, updatedData: Partial<HeroSlide>, silent?: boolean) => Promise<boolean>;
  deleteHeroSlide: (id: string | number) => Promise<boolean>;
  reorderHeroSlides: (orderedIds: (string | number)[]) => Promise<boolean>;
  resetHeroSlides: () => Promise<void>;
  refreshHeroSlides: () => Promise<void>;

  // Services CRUD
  services: ServiceItem[];
  addService: (service: Partial<ServiceItem>) => void;
  updateService: (serviceId: string, updatedData: Partial<ServiceItem>) => void;
  deleteService: (serviceId: string) => void;

  // Portfolio / Design Works CRUD
  portfolio: PortfolioItem[];
  addPortfolioItem: (item: Partial<PortfolioItem>) => Promise<PortfolioItem | null>;
  updatePortfolioItem: (id: string, updatedData: Partial<PortfolioItem>) => Promise<boolean>;
  deletePortfolioItem: (id: string) => Promise<boolean>;
  refreshPortfolio: () => Promise<void>;

  // Users CRUD
  users: User[];
  addUser: (user: Partial<User>) => void;
  updateUser: (emailOrId: string, updatedData: Partial<User>) => void;
  deleteUser: (emailOrId: string) => void;

  // Payments
  payments: PaymentRecord[];
  updatePaymentStatus: (paymentId: string, status: 'Completed' | 'Pending' | 'Failed' | 'Refunded') => void;

  // Reviews CRUD
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

  // Quotes
  quotes: QuoteRequest[];
  submitQuote: (newQuote: QuoteRequest) => void;
  addQuote: (newQuote: QuoteRequest) => void;
  updateOrderStatus: (orderId: string, newStatus: string) => void;
  updateQuoteStatus: (quoteId: string, newStatus: string) => void;
  deleteOrder: (orderId: string) => void;

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

  // Profile Update Prompt Modal
  isUpdateProfileModalOpen: boolean;
  setIsUpdateProfileModalOpen: (open: boolean) => void;
  openUpdateProfileModal: () => void;
  closeUpdateProfileModal: () => void;
  isUserNameNotUpdated: (user?: User | null) => boolean;

  // Modals / Drawers (quick access)
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isWishlistDrawerOpen: boolean;
  setIsWishlistDrawerOpen: (open: boolean) => void;
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  openWhatsApp: (message?: string) => void;
  isQuoteModalOpen: boolean;
  setIsQuoteModalOpen: (open: boolean) => void;

  // Toast & Loading Liner
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  closeToast: () => void;
  isGlobalLoading: boolean;
  setIsGlobalLoading: (loading: boolean) => void;
  triggerTopLoading: (durationMs?: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Language state (en / mr)
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

  // Profile Update Modal State & Detection
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

  // Cart State
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

  // Wishlist State
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

  // Products Dynamic State
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

  // Categories Dynamic State
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

  // Hero Banner Slides Dynamic State
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

  // Services Dynamic State
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

  // Portfolio / Design Works Dynamic State
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

  // Users Dynamic State
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

  // Payments Dynamic State
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

  // Reviews Dynamic State
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

  // Orders State
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

  // Quotes State
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

  // Global loading state (thin liner under navbar)
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
    // Show top progress liner after navbar for loading / actions
    triggerTopLoading(700);

    // Only popup snackbar if it is an ERROR
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

  // Sync to LocalStorage
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

  // Synchronized Initial Data Fetching from Backend Database
  const fetchAllInitialData = async () => {
    try {
      // 1. Fetch Users
      const usersRes = await apiFetch('/api/users');
      if (usersRes.ok) {
        const uData = await usersRes.json();
        if (uData.success && Array.isArray(uData.users) && uData.users.length > 0) {
          setUsers(uData.users);
          localStorage.setItem('proprint_users', JSON.stringify(uData.users));

          // If current user is logged in, refresh their profile from backend
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

      // 2. Fetch Products
      const prodRes = await apiFetch('/api/products');
      if (prodRes.ok) {
        const pData = await prodRes.json();
        if (pData.success && Array.isArray(pData.products) && pData.products.length > 0) {
          setProducts(pData.products);
          localStorage.setItem('proprint_products', JSON.stringify(pData.products));
        }
      }

      // 3. Fetch Categories
      const catRes = await apiFetch('/api/categories');
      if (catRes.ok) {
        const cData = await catRes.json();
        if (cData.success && Array.isArray(cData.categories) && cData.categories.length > 0) {
          setCategories(cData.categories);
          localStorage.setItem('proprint_categories', JSON.stringify(cData.categories));
        }
      }

      // 4. Fetch Orders
      const ordRes = await apiFetch('/api/orders');
      if (ordRes.ok) {
        const oData = await ordRes.json();
        if (oData.success && Array.isArray(oData.orders)) {
          setOrders(oData.orders);
          localStorage.setItem('proprint_orders', JSON.stringify(oData.orders));
        }
      }

      // 5. Fetch Hero Slides
      const slidesRes = await apiFetch('/api/hero-slides');
      if (slidesRes.ok) {
        const sData = await slidesRes.json();
        if (sData.success && Array.isArray(sData.slides) && sData.slides.length > 0) {
          setHeroSlides(sData.slides);
          localStorage.setItem('proprint_hero_slides', JSON.stringify(sData.slides));
        }
      }

      // 6. Fetch Reviews
      const revRes = await apiFetch('/api/reviews');
      if (revRes.ok) {
        const rData = await revRes.json();
        if (rData.success && Array.isArray(rData.reviews) && rData.reviews.length > 0) {
          setReviews(rData.reviews);
          localStorage.setItem('proprint_reviews', JSON.stringify(rData.reviews));
        }
      }

      // 7. Fetch Quotes
      const qRes = await apiFetch('/api/quotes');
      if (qRes.ok) {
        const qData = await qRes.json();
        if (qData.success && Array.isArray(qData.quotes)) {
          setQuotes(qData.quotes);
          localStorage.setItem('proprint_quotes', JSON.stringify(qData.quotes));
        }
      }

      // 8. Fetch Payments
      const payRes = await apiFetch('/api/payments');
      if (payRes.ok) {
        const pData = await payRes.json();
        if (pData.success && Array.isArray(pData.payments)) {
          setPayments(pData.payments);
          localStorage.setItem('proprint_payments', JSON.stringify(pData.payments));
        }
      }

      // 9. Fetch Services
      const srvRes = await apiFetch('/api/services');
      if (srvRes.ok) {
        const sData = await srvRes.json();
        if (sData.success && Array.isArray(sData.services) && sData.services.length > 0) {
          setServices(sData.services);
          localStorage.setItem('proprint_services', JSON.stringify(sData.services));
        }
      }

      // 10. Fetch Portfolio / Design Works
      const portRes = await apiFetch('/api/portfolio');
      if (portRes.ok) {
        const portData = await portRes.json();
        if (portData.success && Array.isArray(portData.portfolio) && portData.portfolio.length > 0) {
          setPortfolio(portData.portfolio);
          localStorage.setItem('proprint_portfolio', JSON.stringify(portData.portfolio));
        }
      }
    } catch (err) {
      console.warn('Initial data synchronization notice:', err);
    }
  };

  useEffect(() => {
    fetchAllInitialData();
  }, []);

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

  // Product CRUD Handlers
  const addProduct = (prodData: Partial<Product>): Product => {
    const newId = prodData.id || `prod-${Date.now()}`;
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
      image: prodData.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      galleryImages: prodData.galleryImages?.length ? prodData.galleryImages : [prodData.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'],
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
    apiFetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    }).catch(err => console.warn('Product API sync error:', err));

    showToast(`✅ Product "${newProduct.name}" published successfully!`, 'success');
    return newProduct;
  };

  const updateProduct = (productId: string, updatedData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updatedData } : p))
    );
    apiFetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
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

  // Category CRUD Handlers
  const addCategory = (catData: Partial<Category>) => {
    const newId = (catData.id as CategoryId) || `cat-${Date.now()}` as CategoryId;
    const newCat: Category = {
      id: newId,
      name: catData.name || 'New Category',
      nameMr: catData.nameMr || catData.name || 'नवीन वर्गवारी',
      shortName: catData.shortName || catData.name || 'Category',
      iconName: catData.iconName || 'Package',
      image: catData.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      itemCount: catData.itemCount || 0,
      featured: catData.featured !== undefined ? catData.featured : true,
      description: catData.description || 'Custom print collection'
    };
    setCategories((prev) => [newCat, ...prev]);
    apiFetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat)
    }).catch(err => console.warn('Category API sync error:', err));

    showToast(`Category "${newCat.name}" added!`, 'success');
  };

  const updateCategory = (categoryId: string, updatedData: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, ...updatedData } : c))
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

  // Services CRUD Handlers
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

  // Portfolio / Design Works CRUD Handlers
  const addPortfolioItem = async (itemData: Partial<PortfolioItem>): Promise<PortfolioItem | null> => {
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
      image: itemData.image || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
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
        body: JSON.stringify(newItem)
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
    setPortfolio((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
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
          setPortfolio(data.portfolio);
          localStorage.setItem('proprint_portfolio', JSON.stringify(data.portfolio));
        }
      }
    } catch (err) {
      console.warn('Portfolio refresh error:', err);
    }
  };

  // User CRUD Handlers
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

  // Payment Status Handler
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

  // Review CRUD Handlers
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

  // Fetch full data suite from Express SQL Backend on mount
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
          setProducts(productsRes.value.products);
        }
        if (categoriesRes.status === 'fulfilled' && categoriesRes.value?.success && Array.isArray(categoriesRes.value.categories) && categoriesRes.value.categories.length > 0) {
          setCategories(categoriesRes.value.categories);
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
          setPortfolio(portfolioRes.value.portfolio);
        }
      } catch (err) {
        console.warn('Using local persistence for backend sync', err);
      }
    };
    fetchBackendData();
  }, []);

  // Handlers
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

  // Coupon State
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

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          return {
            ...ord,
            status: newStatus
          };
        }
        return ord;
      })
    );

    // Sync to Express SQL database
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
          return {
            ...q,
            status: newStatus
          };
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

  // Hero Section Slide Management Handlers
  const addHeroSlide = async (slideData: Partial<HeroSlide>): Promise<HeroSlide | null> => {
    const tempId = `slide-${Date.now()}`;
    const newSlide: HeroSlide = {
      id: tempId,
      title1: slideData.title1 || 'Exclusive Commercial Print Services',
      title2: slideData.title2 || '',
      highlight: slideData.highlight || '',
      subtitle: slideData.subtitle || '',
      image: slideData.image || 'https://i.pinimg.com/736x/c6/e3/bb/c6e3bbbd242f377f64021fe55c33b17d.jpg',
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

    // Optimistic local update
    setHeroSlides(prev => [...prev, newSlide]);

    try {
      const res = await apiFetch('/api/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSlide)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.slide) {
          setHeroSlides(prev => prev.map(s => s.id === tempId ? data.slide : s));
          showToast('Hero banner saved successfully', 'success');
          return data.slide;
        }
      }
    } catch (err) {
      console.error('Error creating hero slide:', err);
    }
    showToast('Hero banner saved', 'success');
    return newSlide;
  };

  const updateHeroSlide = async (id: string | number, updatedData: Partial<HeroSlide>, silent = false): Promise<boolean> => {
    // Optimistic update
    setHeroSlides(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updatedData, updatedAt: new Date().toISOString() } : s))
    );

    try {
      const res = await apiFetch(`/api/hero-slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
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
    // Optimistic update
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
    // Reorder locally
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
          setHeroSlides(data.slides);
          localStorage.setItem('proprint_hero_slides', JSON.stringify(data.slides));
        }
      }
    } catch (err) {
      console.error('Error refreshing hero slides:', err);
    }
  };

  const activeHeroSlides = heroSlides.filter(s => s.isActive !== false);

  const login = (username: string, password?: string): { success: boolean; role: 'admin' | 'customer'; user?: User; error?: string } => {
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

    // 1. Check Admin login credentials
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

      // Async backend record
      apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass })
      }).catch(err => console.warn('Auth API sync', err));

      showToast('👑 Welcome Admin! Logged into Press Management Portal.', 'success');
      return { success: true, role: 'admin', user: adminUser };
    }

    // 2. Check Standard User credentials
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
      
      // Auto-apply 50% discount coupon
      setAppliedCoupon('NEWUSER');
      localStorage.setItem('proprint_coupon', 'NEWUSER');

      // Async backend record
      apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass })
      }).catch(err => console.warn('Auth API sync', err));

      showToast(`Welcome back, ${customerUser.name}!`, 'success');
      return { success: true, role: 'customer', user: customerUser };
    }

    // 3. Any other registered email or user
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

    // Async backend record
    apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: cleanUser, password: cleanPass })
    }).catch(err => console.warn('Auth API sync', err));

    // Check if name needs to be updated
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

    // Auto-apply new user coupon if not applied
    if (!appliedCoupon) {
      setAppliedCoupon('NEWUSER');
      localStorage.setItem('proprint_coupon', 'NEWUSER');
    }

    // Record login to backend
    apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, role: 'customer' })
    }).catch(err => console.warn('Auth phone sync', err));

    // Check if user has not updated their name yet
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

    // Backend sync
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

    // If default was deleted, make first remaining default
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

    // If user has no saved address matching this, add to their address book automatically
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

    // Persist to backend SQLite & Express server
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

    // Persist to backend SQLite
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
        // Products CRUD
        products,
        addProduct,
        updateProduct,
        deleteProduct,

        // Categories CRUD
        categories,
        addCategory,
        updateCategory,
        deleteCategory,

        // Hero Section Slides CRUD & Real-time
        heroSlides,
        activeHeroSlides,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        reorderHeroSlides,
        resetHeroSlides,
        refreshHeroSlides,

        // Services CRUD
        services,
        addService,
        updateService,
        deleteService,

        // Portfolio / Design Works CRUD
        portfolio,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        refreshPortfolio,

        // Users CRUD
        users,
        addUser,
        updateUser,
        deleteUser,

        // Payments
        payments,
        updatePaymentStatus,

        // Reviews CRUD
        reviews,
        updateReviewStatus,
        deleteReview,
        addReview,

        // Orders
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
        triggerTopLoading
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
