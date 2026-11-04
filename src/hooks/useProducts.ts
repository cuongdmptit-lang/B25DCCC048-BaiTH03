import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts } from '../features/products/productsSlice';

export function useProducts() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products);
  useEffect(() => {
    if (products.status === 'idle') void dispatch(fetchProducts());
  }, [dispatch, products.status]);
  return { ...products, retry: () => { void dispatch(fetchProducts()); } };
}
