import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const { wishlist, removeFromWishlist, isMarathi } = useApp();
  const navigate = useNavigate();

  const handleProductSelect = (product: Product) => {
    if (onSelectProduct && typeof onSelectProduct === 'function') {
      onSelectProduct(product);
    } else {
      navigate(`/product/${product.id}`);
    }
    onClose();
  };

  if (!isOpen) return null;

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
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
              <h2 className="text-base font-extrabold text-slate-900">
                {isMarathi ? 'माझी आवडती उत्पादने (Wishlist)' : 'Saved Favorites'}
              </h2>
              <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto text-xl">
                  ❤️
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  {isMarathi ? 'तुमची आवडती यादी रिकामी आहे' : 'Your wishlist is empty'}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {isMarathi ? 'उत्पादने सेव्ह करण्यासाठी हार्ट आयकॉनवर क्लिक करा.' : 'Save products you like to customize or order later.'}
                </p>
              </div>
            ) : (
              wishlist.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-rose-300 transition-all flex items-center justify-between gap-3 group"
                >
                  <div 
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => handleProductSelect(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-rose-600 line-clamp-1">
                        {isMarathi && item.nameMr ? item.nameMr : item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{item.category}</p>
                      <p className="text-xs font-black text-rose-600 mt-1">₹{item.basePrice}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleProductSelect(item)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-[#FF0038] text-white text-xs font-bold transition-colors cursor-pointer"
                      title="Customize Product"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer text-center"
              >
                {isMarathi ? 'खरेदी सुरू ठेवा' : 'Continue Browsing'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
