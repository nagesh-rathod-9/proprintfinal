import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, Category } from '../types';

interface ProductState {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  searchQuery: string;
  selectedProduct: Product | null;
  loading: boolean;
}

const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem('proprint_products');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const initialState: ProductState = {
  products: getStoredProducts(),
  categories: [],
  selectedCategory: 'all',
  searchQuery: '',
  selectedProduct: null,
  loading: false,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      localStorage.setItem('proprint_products', JSON.stringify(action.payload));
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload);
      localStorage.setItem('proprint_products', JSON.stringify(state.products));
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const idx = state.products.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) {
        state.products[idx] = action.payload;
        localStorage.setItem('proprint_products', JSON.stringify(state.products));
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      localStorage.setItem('proprint_products', JSON.stringify(state.products));
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setSelectedCategory,
  setSearchQuery,
  setSelectedProduct,
} = productSlice.actions;
export default productSlice.reducer;
