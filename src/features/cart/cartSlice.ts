import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '../../types';
import type { RootState } from '../../app/store';

interface CartState { items: CartItem[] }
const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart', initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const item = state.items.find((product) => product.id === action.payload.id);
      if (item) item.quantity += 1;
      else state.items.push({ ...action.payload, quantity: 1 });
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      if (!Number.isSafeInteger(quantity) || quantity < 1) return;
      const item = state.items.find((product) => product.id === id);
      if (item) item.quantity = quantity;
    },
    clearCart: (state) => { state.items = []; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectTotalQuantity = (state: RootState) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectTotalPrice = (state: RootState) => state.cart.items.reduce(
  (sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0,
) / 100;
export default cartSlice.reducer;
