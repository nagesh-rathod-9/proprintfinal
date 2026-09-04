import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product, SelectedProductCustomization } from '../types';

interface CartState {
  items: CartItem[];
  appliedCoupon: string | null;
  discountPercentage: number;
}

const getStoredCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem('proprint_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const initialState: CartState = {
  items: getStoredCart(),
  appliedCoupon: localStorage.getItem('proprint_coupon') || null,
  discountPercentage: localStorage.getItem('proprint_coupon') === 'NEWUSER' ? 50 : 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; customization: SelectedProductCustomization }>
    ) => {
      const { product, customization } = action.payload;
      const id = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const newItem: CartItem = {
        id,
        cartItemId: id,
        product,
        customization,
        subtotal: customization.calculatedPrice,
      };
      state.items.unshift(newItem);
      localStorage.setItem('proprint_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload && item.cartItemId !== action.payload
      );
      localStorage.setItem('proprint_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('proprint_cart');
    },
    applyCoupon: (state, action: PayloadAction<string>) => {
      const code = action.payload.trim().toUpperCase();
      state.appliedCoupon = code;
      if (code === 'NEWUSER' || code === 'FIRST50' || code === 'SAMBHAJI50') {
        state.discountPercentage = 50;
      } else if (code === 'PRO20' || code === 'OFFSET20') {
        state.discountPercentage = 20;
      } else {
        state.discountPercentage = 10;
      }
      localStorage.setItem('proprint_coupon', code);
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.discountPercentage = 0;
      localStorage.removeItem('proprint_coupon');
    },
  },
});

export const { addToCart, removeFromCart, clearCart, applyCoupon, removeCoupon } =
  cartSlice.actions;
export default cartSlice.reducer;
