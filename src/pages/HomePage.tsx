import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductsStatus from '../components/ProductsStatus';
import { useProducts } from '../hooks/useProducts';

export default function HomePage() {
  const { items, status, error, retry } = useProducts();
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const filtered = items.filter((item) => item.title.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
  return <>
    <section className="hero"><p className="eyebrow"> </p><h1>Shop online<br />CHẤT !</h1><p>Khám phá thời trang, phụ kiện và công nghệ tại ShopMini.</p></section>
    <section aria-labelledby="products-heading"><div className="section-heading"><div><h2 id="products-heading">Khám phá sản phẩm</h2><p className="muted">{status === 'succeeded' ? `${filtered.length} sản phẩm phù hợp` : 'Bộ sưu tập dành cho bạn'}</p></div>
      <label className="search">Tìm theo tên<input type="search" placeholder="Bạn đang tìm gì?" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
    </div>
    <p className="notice" role="status">{message}</p>
    <ProductsStatus status={status} error={error} retry={retry} />
    {status === 'succeeded' && (filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} onAdded={(title) => setMessage(`Đã thêm “${title}” vào giỏ hàng.`)} />)}</div> : <div className="empty">Không tìm thấy sản phẩm phù hợp.</div>)}
    </section>
  </>;
}
