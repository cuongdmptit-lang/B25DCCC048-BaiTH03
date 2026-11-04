import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import cart, { addToCart, removeFromCart, updateQuantity, clearCart, selectTotalPrice, selectTotalQuantity } from './cartSlice';
import products, { fetchProducts } from '../products/productsSlice';
import type { Product } from '../../types';

const product: Product = { id: 1, title: 'Áo', price: 10.15, description: 'Áo đẹp', category: 'Clothing', image: 'test.png' };
function createStore() { return configureStore({ reducer: { cart, products } }); }

describe('Giỏ hàng', () => {
  it('gộp sản phẩm trùng và tính tổng theo số lượng', () => {
    const store = createStore();
    store.dispatch(addToCart(product));
    store.dispatch(addToCart(product));
    store.dispatch(addToCart({ ...product, id: 2, price: 0.1 }));
    expect(store.getState().cart.items).toHaveLength(2);
    expect(selectTotalQuantity(store.getState())).toBe(3);
    expect(selectTotalPrice(store.getState())).toBe(20.4);
  });
  it('cập nhật số lượng và từ chối số không hợp lệ', () => {
    const store = createStore();
    store.dispatch(addToCart(product));
    store.dispatch(updateQuantity({ id: 1, quantity: 5 }));
    for (const quantity of [0, -1, 1.5, NaN, Infinity]) store.dispatch(updateQuantity({ id: 1, quantity }));
    expect(selectTotalQuantity(store.getState())).toBe(5);
    expect(selectTotalPrice(store.getState())).toBe(50.75);
  });
  it('xóa từng sản phẩm và xóa toàn bộ đơn hàng', () => {
    const store = createStore();
    store.dispatch(addToCart(product));
    store.dispatch(addToCart({ ...product, id: 2 }));
    store.dispatch(removeFromCart(1));
    expect(store.getState().cart.items.map((item) => item.id)).toEqual([2]);
    store.dispatch(clearCart());
    expect(selectTotalQuantity(store.getState())).toBe(0);
    expect(selectTotalPrice(store.getState())).toBe(0);
  });
});

describe('Trạng thái sản phẩm', () => {
  it('loading → succeeded', () => {
    const store = createStore();
    store.dispatch(fetchProducts.pending('request', undefined));
    expect(store.getState().products.status).toBe('loading');
    store.dispatch(fetchProducts.fulfilled([product], 'request', undefined));
    expect(store.getState().products.status).toBe('succeeded');
    expect(store.getState().products.items).toEqual([product]);
  });
  it('failed → thử lại xóa lỗi', () => {
    const store = createStore();
    store.dispatch(fetchProducts.rejected(null, 'request', undefined, 'Lỗi kết nối'));
    expect(store.getState().products.status).toBe('failed');
    expect(store.getState().products.error).toBe('Lỗi kết nối');
    store.dispatch(fetchProducts.pending('retry', undefined));
    expect(store.getState().products.error).toBeNull();
  });
});
