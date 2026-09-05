import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ScrollToTop } from './components/ScrollToTop';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AccountModal } from './components/AccountModal';
import { GetQuoteModal } from './components/GetQuoteModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { DesignStudioModal } from './components/DesignStudioModal';
import { UpdateProfileModal } from './components/UpdateProfileModal';
import { openDirectWhatsApp } from './utils/whatsapp';
import { CommonSnackbar } from './components/CommonSnackbar';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { VisitingCardPage } from './pages/VisitingCardPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { DesignStudioPage } from './pages/DesignStudioPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { UserOrdersPage } from './pages/UserOrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage';
import { AdminCreateOrderPage } from './pages/admin/AdminCreateOrderPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminUserFormPage } from './pages/admin/AdminUserFormPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminCategoryFormPage } from './pages/admin/AdminCategoryFormPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminServiceFormPage } from './pages/admin/AdminServiceFormPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminHeroBannersPage } from './pages/admin/AdminHeroBannersPage';
import { AdminBestSellersPage } from './pages/admin/AdminBestSellersPage';
import { AdminDesignWorksPage } from './pages/admin/AdminDesignWorksPage';
import { AdminDesignWorkFormPage } from './pages/admin/AdminDesignWorkFormPage';
import { Product } from './types';

// ========== PULL-TO-REFRESH COMPONENT ==========
const PullToRefresh: React.FC<{ children: React.ReactNode; onRefresh: () => Promise<void> }> = ({
  children,
  onRefresh,
}) => {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    // Only enable pull-to-refresh if at the top of the scrollable area
    const scrollable = containerRef.current?.querySelector('.pull-to-refresh-scroll');
    if (scrollable && scrollable.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (startY === 0) return;
    const delta = e.touches[0].clientY - startY;
    if (delta > 0 && delta < 120) {
      setPullDistance(delta);
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60 && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setStartY(0);
    setPullDistance(0);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scrollable = el.querySelector('.pull-to-refresh-scroll') as HTMLElement;
    if (!scrollable) return;

    scrollable.addEventListener('touchstart', handleTouchStart);
    scrollable.addEventListener('touchmove', handleTouchMove);
    scrollable.addEventListener('touchend', handleTouchEnd);

    return () => {
      scrollable.removeEventListener('touchstart', handleTouchStart);
      scrollable.removeEventListener('touchmove', handleTouchMove);
      scrollable.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startY, pullDistance, isRefreshing]);

  return (
    <div ref={containerRef} className="h-full flex flex-col">
      <div
        className="pull-to-refresh-indicator"
        style={{
          height: isRefreshing ? 50 : pullDistance * 0.6,
          transition: isRefreshing ? 'height 0.2s ease' : 'none',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          color: '#64748b',
        }}
      >
        {isRefreshing ? 'Refreshing...' : pullDistance > 30 ? 'Release to refresh' : 'Pull down to refresh'}
      </div>
      <div className="pull-to-refresh-scroll flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

// ========== MAIN APP CONTENT ==========
const MainAppContent: React.FC = () => {
  const navigate = useNavigate();
  const { refreshAllData } = useApp();

  // Global Modals State
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteInitialService, setQuoteInitialService] = useState('');
  const [trackOrderModalOpen, setTrackOrderModalOpen] = useState(false);
  const [designStudioModalOpen, setDesignStudioModalOpen] = useState(false);

  const handleOpenQuoteModal = (serviceName?: string) => {
    setQuoteInitialService(serviceName || '');
    setQuoteModalOpen(true);
  };

  const handleOpenWhatsAppModal = (message?: string) => {
    openDirectWhatsApp(message);
  };

  const handleSelectProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const location = useLocation();
  const isAuthPage = location.pathname === '/login';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isMinimalLayout = isAuthPage || isAdminPage;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-rose-600 selection:text-white">
      <ScrollToTop />

      {!isMinimalLayout && (
        <Header
          onOpenCart={() => setCartDrawerOpen(true)}
          onOpenWishlist={() => setWishlistDrawerOpen(true)}
          onOpenAccount={() => setAccountModalOpen(true)}
          onOpenQuote={() => handleOpenQuoteModal()}
          onOpenWhatsApp={() => handleOpenWhatsAppModal()}
          onOpenTrackOrder={() => setTrackOrderModalOpen(true)}
        />
      )}

      {/* Main content wrapped with PullToRefresh (only on non‑admin, non‑login pages) */}
      <main className={`flex-1 ${!isMinimalLayout ? 'pb-16 lg:pb-0' : ''}`}>
        {isMinimalLayout ? (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/*" element={<AdminLayout />}>
              {/* Admin routes remain unchanged */}
              <Route index element={<AdminDashboardPage />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/add" element={<AdminProductFormPage />} />
              <Route path="products/edit/:id" element={<AdminProductFormPage />} />
              <Route path="best-sellers" element={<AdminBestSellersPage />} />
              <Route path="design-works" element={<AdminDesignWorksPage />} />
              <Route path="design-works/add" element={<AdminDesignWorkFormPage />} />
              <Route path="design-works/edit/:id" element={<AdminDesignWorkFormPage />} />
              <Route path="hero-banners" element={<AdminHeroBannersPage />} />
              <Route path="hero" element={<AdminHeroBannersPage />} />
              <Route path="banners" element={<AdminHeroBannersPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="services/add" element={<AdminServiceFormPage />} />
              <Route path="services/edit/:id" element={<AdminServiceFormPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="orders/new" element={<AdminCreateOrderPage />} />
              <Route path="orders/add" element={<AdminCreateOrderPage />} />
              <Route path="orders/:id" element={<AdminOrderDetailPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="users/add" element={<AdminUserFormPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="categories/add" element={<AdminCategoryFormPage />} />
              <Route path="categories/edit/:id" element={<AdminCategoryFormPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <PullToRefresh onRefresh={refreshAllData}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage 
                    onSelectProduct={handleSelectProduct}
                    onOpenQuoteModal={handleOpenQuoteModal}
                    onOpenWhatsApp={handleOpenWhatsAppModal}
                  />
                } 
              />
              <Route 
                path="/products" 
                element={
                  <ProductsPage 
                    onSelectProduct={handleSelectProduct}
                    onOpenQuoteModal={handleOpenQuoteModal}
                  />
                } 
              />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/visiting-cards" element={<VisitingCardPage />} />
              <Route 
                path="/portfolio" 
                element={
                  <PortfolioPage 
                    onOpenQuoteModal={handleOpenQuoteModal}
                    onOpenWhatsApp={handleOpenWhatsAppModal}
                  />
                } 
              />
              <Route path="/design-studio" element={<DesignStudioPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/orders" element={<UserOrdersPage />} />
              <Route path="/my-orders" element={<UserOrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/account" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PullToRefresh>
        )}
      </main>

      {!isMinimalLayout && <Footer />}
      {!isMinimalLayout && (
        <MobileBottomNav
          onOpenCart={() => setCartDrawerOpen(true)}
          onOpenWishlist={() => setWishlistDrawerOpen(true)}
          onOpenAccount={() => setAccountModalOpen(true)}
          onOpenWhatsApp={() => handleOpenWhatsAppModal()}
          onOpenTrackOrder={() => setTrackOrderModalOpen(true)}
          onOpenDesignStudio={() => setDesignStudioModalOpen(true)}
        />
      )}

      {/* WhatsApp floating button */}
      {!isMinimalLayout && (
        <button
          id="floating-whatsapp-btn"
          onClick={() => handleOpenWhatsAppModal()}
          aria-label="Direct WhatsApp Contact"
          className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-30 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-2 border-white/40 ring-4 ring-[#25D366]/20 group"
        >
          <svg 
            className="w-6 h-6 sm:w-7 sm:h-7 fill-current" 
            viewBox="0 0 24 24"
          >
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.546 1.764.82 2.796.82 3.18 0 5.767-2.586 5.767-5.766.001-3.182-2.585-5.768-5.767-5.768zm0 10.455c-.908 0-1.748-.255-2.51-.707l-.18-.107-1.574.413.42-.1.534-.14-1.536.403.42-1.535-.118-.188c-.496-.79-.758-1.545-.758-2.33 0-2.583 2.102-4.685 4.686-4.685 2.583 0 4.685 2.102 4.685 4.685 0 2.584-2.102 4.685 4.685 4.685zm3.327-3.513c-.182-.091-1.077-.532-1.244-.593-.167-.061-.288-.091-.41.091-.121.182-.471.593-.577.714-.107.121-.213.137-.395.046-.182-.091-.77-.284-1.467-.905-.542-.483-.908-1.08-1.015-1.262-.106-.182-.011-.281.08-.371.082-.082.182-.213.274-.319.091-.107.122-.182.182-.304.061-.122.03-.228-.015-.319-.046-.091-.41-1-.562-1.37-.152-.37-.306-.319-.41-.324h-.35c-.121 0-.319.046-.486.228-.167.182-.639.624-.639 1.521 0 .897.654 1.764.745 1.885.091.122 1.287 1.965 3.118 2.755 1.831.79 1.831.527 2.165.496.334-.03 1.077-.44 1.229-.865.152-.426.152-.791.106-.866-.046-.076-.167-.122-.349-.213z"/>
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.986l-1.413 5.163 5.302-1.391c1.455.795 3.097 1.218 4.771 1.218 5.507 0 9.99-4.478 9.99-9.984 0-5.506-4.483-9.976-9.99-9.976zm0 18.293c-1.554 0-3.076-.418-4.402-1.209l-.316-.188-3.146.825.84-3.067-.206-.328c-.868-1.381-1.326-2.986-1.326-4.642 0-4.577 3.724-8.301 8.301-8.301 4.576 0 8.3 3.724 8.3 8.301 0 4.577-3.724 8.309-8.301 8.309z"/>
          </svg>
          <span className="hidden group-hover:inline-block ml-2 text-xs font-bold whitespace-nowrap pr-1">
            WhatsApp Press Desk
          </span>
        </button>
      )}

      {/* Drawers & Modals */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <WishlistDrawer isOpen={wishlistDrawerOpen} onClose={() => setWishlistDrawerOpen(false)} onSelectProduct={handleSelectProduct} />
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onOpenTrackOrder={() => {
          setAccountModalOpen(false);
          setTrackOrderModalOpen(true);
        }}
      />
      <GetQuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} initialServiceOrProduct={quoteInitialService} />
      <TrackOrderModal isOpen={trackOrderModalOpen} onClose={() => setTrackOrderModalOpen(false)} />
      <DesignStudioModal isOpen={designStudioModalOpen} onClose={() => setDesignStudioModalOpen(false)} />
      <UpdateProfileModal />
      <CommonSnackbar />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </BrowserRouter>
  );
}