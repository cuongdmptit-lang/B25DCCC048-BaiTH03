import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearCart, selectCartItems, selectTotalPrice, selectTotalQuantity } from '../features/cart/cartSlice';
import { formatPrice } from '../utils/format';

export default function CheckoutPage() {
  const { user } = useAuth();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectTotalPrice);
  const quantity = useAppSelector(selectTotalQuantity);
  const dispatch = useAppDispatch();
  const [ordered, setOrdered] = useState(false);
  function placeOrder() {
    if (!items.length || ordered) return;
    dispatch(clearCart());
    setOrdered(true);
  }
  if (ordered) return <section className="empty panel" role="status"><div className="success-icon">✓</div><h1>Đặt hàng thành công!</h1><p>Cảm ơn {user?.username}. Giỏ hàng của bạn đã được xóa.</p><p className="muted">Đây là đơn hàng mô phỏng, không phát sinh thanh toán thật.</p><Link className="button" to="/">Tiếp tục mua sắm</Link></section>;
  if (!items.length) return <section className="empty"><h1>Chưa có sản phẩm để thanh toán</h1><Link className="button" to="/">Mua sắm ngay</Link></section>;
  return <section className="checkout panel"><p className="eyebrow">BƯỚC CUỐI CÙNG</p><h1>Xác nhận thanh toán</h1><p>Khách hàng: <strong>{user?.username}</strong></p><ul className="order-list">{items.map((item) => <li key={item.id}><span>{item.title} <strong>× {item.quantity}</strong></span><strong>{formatPrice(Math.round(item.price * 100) * item.quantity / 100)}</strong></li>)}</ul><p>Tổng số lượng: {quantity}</p><p className="total">Tổng thanh toán <strong>{formatPrice(total)}</strong></p><button className="full" onClick={placeOrder}>Đặt hàng</button><Link className="back" to="/cart">← Chỉnh sửa giỏ hàng</Link></section>;
}
