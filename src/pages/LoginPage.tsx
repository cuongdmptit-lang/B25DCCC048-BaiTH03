import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function getReturnPath(state: unknown): string {
  if (typeof state === 'object' && state !== null && 'from' in state && typeof state.from === 'string'
    && state.from.startsWith('/') && !state.from.startsWith('//') && !state.from.startsWith('/login')) return state.from;
  return '/';
}

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const returnPath = getReturnPath(location.state);
  if (user) return <Navigate to={returnPath} replace />;
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!login(username, password)) { setError('Nhập tên đăng nhập và mật khẩu chính xác là 123456.'); return; }
    navigate(returnPath, { replace: true });
  }
  return <section className="login panel"><p className="eyebrow">CHÀO MỪNG TRỞ LẠI</p><h1>Đăng nhập ShopMini</h1><p className="muted">Đăng nhập để hoàn tất đơn hàng của bạn.</p>
    <form onSubmit={handleSubmit}><label>Tên đăng nhập<input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} /></label><label>Mật khẩu<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
    {error && <p className="error" role="alert">{error}</p>}<button className="full" type="submit">Đăng nhập</button></form>
    <p className="hint">Tài khoản mô phỏng: tên bất kỳ, mật khẩu <strong>123456</strong>.</p><Link to="/">← Tiếp tục xem sản phẩm</Link>
  </section>;
}
