import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearCart, removeFromCart, selectCartItems, selectTotalPrice, selectTotalQuantity, updateQuantity } from '../features/cart/cartSlice';
import { formatPrice } from '../utils/format';

export default function CartPage() {
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectTotalPrice);
  const quantity = useAppSelector(selectTotalQuantity);
  const dispatch = useAppDispatch();
  return <><h1>Giỏ hàng của bạn</h1>{!items.length ? <div className="empty"><h2>Giỏ hàng đang trống</h2><p>Chọn một món đồ bạn yêu thích để bắt đầu.</p><Link className="button" to="/">Khám phá sản phẩm</Link></div> : <div className="cart-layout"><section className="cart-list" aria-label="Sản phẩm trong giỏ">{items.map((item) => <article className="cart-item panel" key={item.id}>
    <Link to={`/products/${item.id}`}><img src={item.image} alt={item.title} /></Link>
    <div className="cart-info"><h2><Link to={`/products/${item.id}`}>{item.title}</Link></h2><p>{formatPrice(item.price)} / sản phẩm</p><label>Số lượng <input className="quantity" type="number" min="1" step="1" value={item.quantity} aria-label={`Số lượng ${item.title}`} onChange={(event) => dispatch(updateQuantity({ id: item.id, quantity: Number(event.target.value) }))} /></label></div>
    <div className="cart-line-total"><strong>{formatPrice(Math.round(item.price * 100) * item.quantity / 100)}</strong><button className="danger" onClick={() => dispatch(removeFromCart(item.id))}>Xóa</button></div>
  </article>)}<button className="secondary" onClick={() => dispatch(clearCart())}>Xóa toàn bộ giỏ</button></section>
    <aside className="panel summary"><h2>Tóm tắt đơn hàng</h2><p>Tổng số lượng <strong>{quantity}</strong></p><p className="total">Tổng tiền <strong>{formatPrice(total)}</strong></p><Link className="button full" to="/checkout">Tiến hành thanh toán →</Link><Link className="back" to="/">Tiếp tục mua sắm</Link></aside>
  </div>}</>;
}
