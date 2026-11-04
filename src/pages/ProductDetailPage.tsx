import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import { formatPrice } from '../utils/format';
import ProductsStatus from '../components/ProductsStatus';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { items, status, error, retry } = useProducts();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  if (status !== 'succeeded') return <ProductsStatus status={status} error={error} retry={retry} />;
  const product = items.find((item) => String(item.id) === id);
  if (!product) return <div className="empty"><h1>Không tìm thấy sản phẩm</h1><Link to="/">Về trang chủ</Link></div>;
  return <><Link className="back" to="/">← Tất cả sản phẩm</Link><article className="detail panel">
    <div className="detail-image"><img src={product.image} alt={product.title} /></div>
    <div><p className="category">{product.category}</p><h1>{product.title}</h1><p className="detail-price">{formatPrice(product.price)}</p><p className="description">{product.description}</p>
      <button onClick={() => { dispatch(addToCart(product)); setMessage('Đã thêm sản phẩm vào giỏ hàng.'); }}>Thêm vào giỏ hàng</button> <Link className="button secondary" to="/cart">Xem giỏ hàng</Link>
      <p className="notice" role="status">{message}</p>
    </div>
  </article></>;
}
