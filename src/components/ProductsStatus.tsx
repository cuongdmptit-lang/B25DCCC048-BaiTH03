interface Props { status: string; error: string | null; retry: () => void }
export default function ProductsStatus({ status, error, retry }: Props) {
  if (status === 'idle' || status === 'loading') return <div className="empty" role="status">Đang tải sản phẩm…</div>;
  if (status === 'failed') return <div className="empty" role="alert"><h2>Chưa tải được sản phẩm</h2><p>{error}</p><p>Kiểm tra kết nối mạng rồi thử lại.</p><button onClick={retry}>Thử lại</button></div>;
  return null;
}
