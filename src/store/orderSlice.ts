import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderStatus } from '../types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem('proprint_orders');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const initialState: OrderState = {
  orders: getStoredOrders(),
  currentOrder: null,
  loading: false,
  error: null,
};

export const fetchOrdersThunk = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.error || 'Failed to fetch orders');
      }
      return data.orders as Order[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const createOrderThunk = createAsyncThunk(
  'orders/createOrder',
  async (orderPayload: any, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.error || 'Failed to create order');
      }
      return data.order as Order;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }: { orderId: string; status: OrderStatus | string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.error || 'Failed to update order status');
      }
      return { orderId, status };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      localStorage.setItem('proprint_orders', JSON.stringify(action.payload));
    },
    addLocalOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.currentOrder = action.payload;
      localStorage.setItem('proprint_orders', JSON.stringify(state.orders));
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(
        (o) => o.id !== action.payload && o.orderNumber !== action.payload
      );
      localStorage.setItem('proprint_orders', JSON.stringify(state.orders));
      // Call backend asynchronously
      fetch(`/api/orders/${action.payload}`, { method: 'DELETE' }).catch(() => {});
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.length > 0) {
          state.orders = action.payload;
          localStorage.setItem('proprint_orders', JSON.stringify(action.payload));
        }
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
        localStorage.setItem('proprint_orders', JSON.stringify(state.orders));
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const target = state.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
        if (target) {
          target.status = status;
          localStorage.setItem('proprint_orders', JSON.stringify(state.orders));
        }
      });
  },
});

export const { setOrders, addLocalOrder, setCurrentOrder, deleteOrder } = orderSlice.actions;
export default orderSlice.reducer;
