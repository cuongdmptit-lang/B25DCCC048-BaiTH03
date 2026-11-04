import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import { formatPrice } from '../utils/format';

interface Props { product: Product; onAdded: (title: string) => void }
export default function ProductCard({ product, onAdded }: Props) {
  const dispatch = useAppDispatch();
  return <article className="product-card">
    <Link to={`/products/${product.id}`} className="product-image"><img src={product.image} alt={product.title} loading="lazy" /></Link>
    <div className="product-body"><p className="category">{product.category}</p>
      <h2><Link to={`/products/${product.id}`}>{product.title}</Link></h2>
      <div className="product-bottom"><strong className="price">{formatPrice(product.price)}</strong>
        <button onClick={() => { dispatch(addToCart(product)); onAdded(product.title); }} aria-label={`Thêm ${product.title} vào giỏ`}>+ Thêm</button>
      </div>
    </div>
  </article>;
}
