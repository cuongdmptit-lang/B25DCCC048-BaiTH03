import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAppSelector } from '../app/hooks';
import { selectTotalQuantity } from '../features/cart/cartSlice';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const quantity = useAppSelector(selectTotalQuantity);
  return <header className="header"><div className="container header-inner">
    <Link className="brand" to="/">Shop<span>Mini</span><small>EVERYDAY ESSENTIALS</small></Link>
    <nav aria-label="Điều hướng chính">
      <NavLink to="/" end>Sản phẩm</NavLink>
      <NavLink to="/cart">Giỏ hàng <span className="badge">{quantity}</span></NavLink>
    </nav>
    <div className="header-actions">
      <button className="secondary" onClick={toggleTheme} aria-label="Đổi theme sáng/tối">{theme === 'light' ? '☾ Tối' : '☀ Sáng'}</button>
      {user ? <><span className="username">Xin chào, <strong>{user.username}</strong></span><button className="secondary" onClick={logout}>Đăng xuất</button></> : <Link className="button" to="/login">Đăng nhập</Link>}
    </div>
  </div></header>;
}
