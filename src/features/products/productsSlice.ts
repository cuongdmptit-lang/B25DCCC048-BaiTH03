import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Product } from '../../types';
import type { RootState } from '../../app/store';

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = { items: [], status: 'idle', error: null };

function isProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) return false;
  return 'id' in value && typeof value.id === 'number'
    && 'title' in value && typeof value.title === 'string'
    && 'price' in value && typeof value.price === 'number' && Number.isFinite(value.price) && value.price >= 0
    && 'description' in value && typeof value.description === 'string'
    && 'category' in value && typeof value.category === 'string'
    && 'image' in value && typeof value.image === 'string';
}

export const fetchProducts = createAsyncThunk<Product[], void, { state: RootState; rejectValue: string }>(
  'products/fetchProducts',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await fetch('https://fakestoreapi.com/products', { signal });
      if (!response.ok) throw new Error(`Không tải được sản phẩm (HTTP ${response.status}).`);
      const data: unknown = await response.json();
      if (!Array.isArray(data) || !data.every(isProduct)) {
        throw new Error('Dữ liệu sản phẩm không hợp lệ.');
      }
      return data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Không thể kết nối API.');
    }
  },
  { condition: (_, { getState }) => getState().products.status !== 'loading' },
);

const productsSlice = createSlice({
  name: 'products', initialState, reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'; state.error = action.payload ?? 'Tải sản phẩm thất bại.';
      });
  },
});

export default productsSlice.reducer;
