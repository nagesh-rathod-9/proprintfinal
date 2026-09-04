import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingCart, ShieldCheck, Truck, FileText, CheckCircle2, ArrowLeft, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WhatsAppModal } from '../components/WhatsAppModal';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, cartSubtotal, cartTax, cartTotal, isMarathi, currentUser } = useApp();
  const navigate = useNavigate();
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  const handleProceedToCheckout = () => {
    if (!currentUser) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center space-y-4 font-marathi">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto text-2xl">
          🛒
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          {isMarathi ? 'तुमचे प्रिंटिंग कार्ट रिकामे आहे' : 'Your Print Cart is Empty'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          {isMarathi 
            ? 'उत्पादने निवडा आणि आपल्या आवडीनुसार आकार, फिनिश आणि संख्या ठरवा.' 
            : 'Explore our commercial printing products and configure your custom requirements.'}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md"
        >
          <span>{isMarathi ? 'उत्पादने पहा' : 'Browse Products'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 md:px-8 py-8 space-y-6 font-marathi">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {isMarathi ? 'प्रिंटिंग कार्ट' : 'Commercial Print Cart'}
          </h1>
          <p className="text-xs text-slate-500">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your active job batch
          </p>
        </div>
        <Link
          to="/products"
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isMarathi ? 'आणखी उत्पादने जोडा' : 'Add More Products'}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const product = item?.product;
            const productName = isMarathi && product?.nameMr ? product.nameMr : (product?.name || 'Custom Print Order');
            const productImage = product?.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80';
            const unit = product?.unit || 'units';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {productName}
                    </h3>
                    
                    <div className="text-xs text-slate-500 space-y-0.5">
                      <p>
                        <span className="font-medium text-slate-700">Quantity:</span> {item?.customization?.quantity || 1} {unit}
                      </p>
                      {item?.customization?.finishId && (
                        <p>
                          <span className="font-medium text-slate-700">Stock/Finish:</span> {item.customization.finishId}
                        </p>
                      )}
                      {item?.customization?.sizeId && (
                        <p>
                          <span className="font-medium text-slate-700">Size:</span> {item.customization.sizeId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Subtotal</span>
                    <span className="text-base font-black text-slate-900">
                      ₹{(item?.subtotal || item?.customization?.calculatedPrice || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove from cart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs h-fit space-y-5">
          <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
            {isMarathi ? 'ऑर्डर सारांश' : 'Order Summary'}
          </h3>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>{isMarathi ? 'एकूण उप-रक्कम' : 'Subtotal'}</span>
              <span className="font-bold text-slate-800">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>{isMarathi ? 'जीएसटी (१८% कर)' : 'GST (18% Invoiced)'}</span>
              <span className="font-bold text-slate-800">₹{cartTax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>{isMarathi ? 'कूरियर डिलिव्हरी' : 'Standard Shipping'}</span>
              <span>FREE</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900">{isMarathi ? 'एकूण देय रक्कम' : 'Estimated Total'}</span>
              <span className="text-xl font-black text-rose-600">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{isMarathi ? 'चेकआऊट सुरू करा' : 'Proceed to Checkout'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setIsWhatsAppOpen(true)}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer inline-flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isMarathi ? 'किंवा थेट व्हॉट्सॲप चौकशी पॉप-अप' : 'Or quick inquiry via in-app pop-up'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* WhatsApp Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        defaultMessage={`Hello Proprint! I have ${cart.length} items in my active print cart (Total: ₹${cartTotal}). Please provide custom turnaround estimate.`}
      />

    </div>
  );
};
