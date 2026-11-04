import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return <section className="empty"><p className="error-code">404</p><h1>Không tìm thấy trang</h1><p>Đường dẫn bạn truy cập không tồn tại.</p><Link className="button" to="/">Về trang chủ</Link></section>;
}
