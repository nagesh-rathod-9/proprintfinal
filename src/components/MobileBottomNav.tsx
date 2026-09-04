import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, ShoppingBag, ClipboardList, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MobileBottomNavProps {
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
  onOpenAccount?: () => void;
  onOpenWhatsApp?: () => void;
  onOpenTrackOrder?: () => void;
  cartCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenCart,
  onOpenWhatsApp,
  onOpenTrackOrder,
  onOpenAccount
}) => {
  const { cart, currentUser, isMarathi, setIsWhatsAppModalOpen } = useApp();
  const navigate = useNavigate();
  const cartCount = Array.isArray(cart) ? cart.length : 0;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenWhatsApp) {
      onOpenWhatsApp();
    } else {
      setIsWhatsAppModalOpen(true);
    }
  };

  const handleOrdersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenTrackOrder) {
      onOpenTrackOrder();
    } else {
      navigate('/cart');
    }
  };

  return (
    <div 
      id="mobile-bottom-navbar" 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] py-1.5 px-2 pb-[max(env(safe-area-inset-bottom,0px),6px)] font-marathi"
    >
      <div className="grid grid-cols-5 items-center text-center">
        
        {/* 1. Home (Red active state matching screenshot) */}
        <NavLink
          to="/"
          id="mobile-nav-home"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors ${
              isActive 
                ? 'text-rose-600 font-bold' 
                : 'text-slate-500 hover:text-rose-600 font-medium'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight font-marathi">
            {isMarathi ? 'होम' : 'Home'}
          </span>
        </NavLink>

        {/* 2. WhatsApp (Green WhatsApp icon) */}
        <button
          id="mobile-nav-whatsapp"
          type="button"
          onClick={handleWhatsAppClick}
          className="flex flex-col items-center justify-center py-1 text-[#25D366] hover:text-[#128C7E] font-medium transition-colors cursor-pointer"
        >
          <MessageSquare className="w-5 h-5 mb-0.5 fill-current" />
          <span className="text-[10px] leading-tight font-marathi">WhatsApp</span>
        </button>

        {/* 3. Cart with Red Badge (1) */}
        <NavLink
          to="/cart"
          id="mobile-nav-cart"
          onClick={(e) => {
            if (onOpenCart) {
              e.preventDefault();
              onOpenCart();
            }
          }}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors relative ${
              isActive 
                ? 'text-rose-600 font-bold' 
                : 'text-slate-600 hover:text-rose-600 font-medium'
            }`
          }
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-rose-600 text-white font-black text-[9px] min-w-[15px] h-[15px] px-0.5 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-tight font-marathi">
            {isMarathi ? 'कार्ट' : 'Cart'}
          </span>
        </NavLink>

        {/* 4. Orders */}
        <NavLink
          to="/orders"
          id="mobile-nav-orders"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors ${
              isActive 
                ? 'text-rose-600 font-bold' 
                : 'text-slate-500 hover:text-rose-600 font-medium'
            }`
          }
        >
          <ClipboardList className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight font-marathi">
            {isMarathi ? 'ऑर्डर्स' : 'Orders'}
          </span>
        </NavLink>

        {/* 5. Account / Profile / Login */}
        <NavLink
          to={currentUser ? (currentUser.role === 'admin' ? '/admin' : '/profile') : '/login'}
          id="mobile-nav-account"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors ${
              isActive 
                ? (currentUser?.role === 'admin' ? 'text-amber-500 font-bold' : 'text-rose-600 font-bold')
                : 'text-slate-500 hover:text-rose-600 font-medium'
            }`
          }
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight font-marathi truncate max-w-[50px]">
            {currentUser 
              ? (currentUser.role === 'admin' ? 'Admin' : (isMarathi ? 'प्रोफाइल' : 'Profile')) 
              : (isMarathi ? 'खाते' : 'Account')}
          </span>
        </NavLink>

      </div>
    </div>
  );
};
