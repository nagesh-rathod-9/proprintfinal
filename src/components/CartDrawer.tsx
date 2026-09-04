import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingCart, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const { cart, removeFromCart, cartSubtotal, cartTax, cartTotal, isMarathi } = useApp();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleProceedToCheckout = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-marathi">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-extrabold text-slate-900">
                {isMarathi ? 'माझे प्रिंटिंग कार्ट' : 'Your Print Cart'}
              </h2>
              <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto text-xl">
                  🛒
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  {isMarathi ? 'तुमचे कार्ट रिकामे आहे' : 'Your cart is empty'}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {isMarathi ? 'व्हिजिटिंग कार्ड्स, बॉक्सेस किंवा स्टिकर्स निवडून कस्टमायझ करा.' : 'Select products and configure custom size, finish, and quantities.'}
                </p>
              </div>
            ) : (
              cart.map((item) => {
                const product = item?.product;
                const productName = isMarathi && product?.nameMr ? product.nameMr : (product?.name || 'Custom Print Order');
                const productImage = product?.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80';
                const unit = product?.unit || 'units';
                const price = item?.subtotal || item?.customization?.calculatedPrice || 0;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={productImage}
                          alt={productName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                            {productName}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {item?.customization?.quantity || 1} {unit} {item?.customization?.finishId ? `• ${item.customization.finishId}` : ''}
                          </p>
                          {item?.customization?.uploadedFileName && (
                            <p className="text-[10px] text-emerald-600 font-bold truncate max-w-[180px]">
                              ✓ {item.customization.uploadedFileName}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">{isMarathi ? 'एकूण दर:' : 'Total:'}</span>
                      <span className="font-extrabold text-rose-600">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 space-y-3 text-xs">
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>{isMarathi ? 'उपएकूण (Subtotal):' : 'Subtotal:'}</span>
                  <span className="font-mono font-bold text-slate-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isMarathi ? 'GST (१८%):' : 'GST (18%):'}</span>
                  <span className="font-mono font-bold text-slate-900">₹{cartTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                  <span>{isMarathi ? 'एकूण देय रक्कम:' : 'Total Payable:'}</span>
                  <span className="text-rose-600">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                <span>{isMarathi ? 'चेकआऊट व ऑर्डर पूर्ण करा' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
