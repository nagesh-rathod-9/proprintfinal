import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Star, 
  FolderTree, 
  Settings, 
  LogOut, 
  Bell, 
  ExternalLink,
  Plus,
  Sparkles,
  Store,
  Image as ImageIcon,
  Menu,
  X,
  Flame,
  Palette
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLayout: React.FC = () => {
  const { currentUser, logout, orders, products, users, services, heroSlides, portfolio = [], showToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Strict Role Guard: Redirect non-admin or unauthenticated users to login page
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login?redirect=' + encodeURIComponent(location.pathname));
    } else if (currentUser.role !== 'admin') {
      showToast('Admin clearance required to access management portal', 'error');
      navigate('/');
    }
  }, [currentUser, navigate, location.pathname, showToast]);

  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/admin' && (currentPath === '/admin' || currentPath === '/admin/dashboard')) {
      return true;
    }
    return currentPath.startsWith(path) && path !== '/admin';
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Orders Docket', path: '/admin/orders', icon: ShoppingCart, count: orders.length, badgeColor: 'bg-red-500' },
    { label: 'Products Catalog', path: '/admin/products', icon: Package, count: products.length },
    { label: 'Best Selling', path: '/admin/best-sellers', icon: Flame, count: products.filter(p => p.isBestSeller).length, badgeColor: 'bg-amber-500' },
    { label: 'Design Works', path: '/admin/design-works', icon: Palette, count: portfolio?.length || 0, badgeColor: 'bg-rose-500' },
    { label: 'Hero Banners', path: '/admin/hero-banners', icon: ImageIcon, count: heroSlides?.length || 0, badgeColor: 'bg-cyan-500' },
    { label: 'Services & Press', path: '/admin/services', icon: Sparkles, count: services.length },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Users / Clients', path: '/admin/users', icon: Users, count: users.length },
    { label: 'Payments & GST', path: '/admin/payments', icon: CreditCard },
    { label: 'Customer Reviews', path: '/admin/reviews', icon: Star },
    { label: 'Press Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 font-sans overflow-hidden">
      
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* ========================================================= */}
      {/* SIDEBAR (Clean, Minimalist Dark Slate Neutral Layout)     */}
      {/* ========================================================= */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 shadow-xl select-none border-r border-slate-800
          transform transition-transform duration-200 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        
        <div className="p-4 sm:p-5 space-y-5 overflow-y-auto">
          
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between">
            <Link 
              to="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-1 py-1 group"
            >
              <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                P
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-base tracking-tight block">
                    Proprint
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                    ADMIN
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium block">
                  Management Console
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-2">
            {navItems.map((item) => {
              const active = item.exact 
                ? (currentPath === '/admin' || currentPath === '/admin/dashboard')
                : isActive(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-slate-800 text-white font-bold border-l-2 border-red-500 pl-2.5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-red-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                      item.badgeColor 
                        ? `${item.badgeColor} text-white` 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Bottom Store Switcher & Log Out Section */}
        <div className="p-3 sm:p-4 border-t border-slate-800 space-y-2 bg-slate-900/90">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors border border-slate-700/60"
          >
            <Store className="w-3.5 h-3.5 text-red-400" />
            <span>View Live Store</span>
            <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/40 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Log Out</span>
          </button>
        </div>

      </aside>

      {/* ========================================================= */}
      {/* MAIN WORKSPACE AREA                                       */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP BAR */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-xs">
          
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Open Sidebar Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate flex items-center gap-2">
              <span className="text-slate-400 font-normal hidden sm:inline">Admin /</span>
              <span className="text-slate-900 truncate">
                {currentPath.includes('/orders/new') || currentPath.includes('/orders/add') ? 'Create WhatsApp / Manual Order' :
                 currentPath.includes('/orders/') && currentPath !== '/admin/orders' ? 'Order Docket' :
                 currentPath.includes('/orders') ? 'Orders Docket' :
                 currentPath.includes('/hero') ? 'Hero Poster Banners' :
                 currentPath.includes('/products/add') ? 'Add New Product' :
                 currentPath.includes('/products/edit') ? 'Edit Product' :
                 currentPath.includes('/products') ? 'Products Catalog' :
                 currentPath.includes('/services/add') ? 'Add New Service' :
                 currentPath.includes('/services/edit') ? 'Edit Service Capability' :
                 currentPath.includes('/services') ? 'Services & Press' :
                 currentPath.includes('/users/add') ? 'Register Client' :
                 currentPath.includes('/users') ? 'User Accounts' :
                 currentPath.includes('/categories/add') ? 'Add Category' :
                 currentPath.includes('/categories') ? 'Categories' :
                 currentPath.includes('/payments') ? 'Payments & Settlement' :
                 currentPath.includes('/reviews') ? 'Customer Reviews' :
                 currentPath.includes('/settings') ? 'Press Settings' : 'Dashboard Overview'}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Quick Action Button */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/admin/products/add"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </Link>
            </div>

            {/* Quick Notification Bell */}
            <button 
              onClick={() => showToast('Heidelberg 4-Color Press batch active for 1,200 visiting cards', 'info')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center relative cursor-pointer transition-colors border border-slate-200"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Admin Avatar & Role */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {currentUser?.name?.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[120px]">
                  {currentUser?.name || 'Admin'}
                </span>
                <span className="text-[10px] text-red-600 font-semibold uppercase tracking-wider block">
                  Master Admin
                </span>
              </div>
            </div>

          </div>

        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-slate-100">
          <Outlet />
        </main>

      </div>

    </div>
  );
};
