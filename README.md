# ShopMini — Bài thực hành 03

Môn: RIPT1306-20261-05. Ứng dụng cửa hàng mini sử dụng React, TypeScript, Vite, Context API và Redux Toolkit.

- Họ tên: Đồng Mạnh Cường
- Mã sinh viên: B25DCCC048
- Lớp: D25CQCC06-B  

## Chạy dự án

Cài Node.js 22.12 trở lên (khuyến nghị Node.js 24 LTS). Mở terminal trong thư mục chứa `package.json`:

```bash
npm ci
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal (mặc định http://localhost:5173).

```bash
npm run build
npm run preview
npm test
```

- `build`: kiểm tra TypeScript strict rồi tạo bản production vào `dist`.
- `preview`: xem bản production vừa build.
- `test`: chạy kiểm thử reducer giỏ hàng, selector tổng tiền/số lượng và trạng thái sản phẩm.

## Chức năng và đường dẫn

| Trang | Đường dẫn | Chức năng |
| --- | --- | --- |
| Trang chủ | `/` | Tải sản phẩm từ API; tìm theo tên không phân biệt hoa/thường; loading, lỗi và thử lại |
| Chi tiết | `/products/:id` | Hình, tên, danh mục, mô tả, giá, thêm giỏ; xử lý ID không tồn tại |
| Giỏ hàng | `/cart` | Thêm, xóa, đổi số lượng nguyên dương, xóa tất cả; tổng số lượng và tiền |
| Đăng nhập | `/login` | Tên bất kỳ không rỗng; mật khẩu đúng `123456`; hiển thị lỗi khi sai |
| Thanh toán | `/checkout` | Bắt buộc đăng nhập; xác nhận đơn, xóa giỏ và hiện thông báo thành công |
| 404 | Đường dẫn khác | Thông báo không tồn tại, liên kết về trang chủ |

Header chung có số lượng sản phẩm (tổng quantity, không phải số loại), tên người dùng, đăng xuất và đổi theme sáng/tối.

Responsive: dưới 640px = 1 cột; từ 640px = 2 cột; từ 1024px = 4 cột.

## Phân chia state và lý do

| Nơi quản lý | Dữ liệu | Lý do |
| --- | --- | --- |
| `useState` tại HomePage | `search`, `message` | Từ khóa và thông báo chỉ phục vụ giao diện trang chủ |
| `useState` tại ProductDetailPage | `message` | Phản hồi sau khi thêm giỏ, không cần chia sẻ toàn ứng dụng |
| `useState` tại LoginPage | `username`, `password`, `error` | Trạng thái form chỉ dùng trong trang đăng nhập |
| `useState` tại CheckoutPage | `ordered` | Điều khiển màn hình thành công sau đặt hàng |
| `ThemeContext` | `theme`, `toggleTheme` | Theme được dùng xuyên suốt ứng dụng; logic đơn giản, phù hợp Context |
| `AuthContext` | `user`, `login`, `logout` | Header, Login và ProtectedRoute đều cần thông tin đăng nhập |
| Redux `productsSlice` | `items`, `status`, `error` | Danh sách dùng ở trang chủ và chi tiết; createAsyncThunk quản lý tải bất đồng bộ |
| Redux `cartSlice` | `items` gồm sản phẩm và `quantity` | Header, chi tiết, danh sách, giỏ và thanh toán cùng đọc/cập nhật |

Context provider dùng `useState` bên trong để lưu dữ liệu và cung cấp qua custom hook `useTheme()` / `useAuth()`.
Tổng số lượng và tổng tiền là dữ liệu dẫn xuất qua selector `selectTotalQuantity` / `selectTotalPrice`, không lưu thêm state gây lệch dữ liệu. Danh sách sau tìm kiếm cũng được tính từ sản phẩm và từ khóa.

Redux store xuất `RootState`, `AppDispatch`; hooks `useAppSelector`, `useAppDispatch` được định kiểu đầy đủ. Source không dùng kiểu `any`.

## Luồng đăng nhập và thanh toán

1. Khi chưa đăng nhập mà mở `/checkout`, ProtectedRoute lưu đường dẫn hiện tại vào `location.state.from` và chuyển `/login`.
2. Nhập tên bất kỳ (ví dụ `cuong`), mật khẩu `123456`.
3. Đăng nhập thành công quay lại đường dẫn được lưu; truy cập đăng nhập thông thường thì về `/`.
4. Bấm **Đặt hàng**: dispatch `clearCart()`, số lượng trên header về 0, hiện thông báo thành công.
5. Giỏ rỗng không hiển thị nút đặt hàng. Đăng xuất tại trang thanh toán sẽ được đưa về trang đăng nhập.

Đăng nhập và đơn hàng là mô phỏng theo đề, không tạo tài khoản hay thanh toán thật. State nằm trong bộ nhớ: tải lại trang sẽ reset user, giỏ hàng và theme. Đề không yêu cầu localStorage.

## API và xử lý dữ liệu

API thực tế: https://fakestoreapi.com/products

`Product` gồm `id`, `title`, `price`, `description`, `category`, `image`. Giá được hiển thị theo USD, không coi giá API là VNĐ. Tổng tiền tính theo cent để giảm sai số số thực.

`fetchProducts` dùng `createAsyncThunk`; trạng thái `idle`, `loading`, `succeeded`, `failed`. Có kiểm tra HTTP và dữ liệu JSON bằng type guard từ `unknown`; có nút thử lại nếu lỗi. Custom hook `useProducts` dùng chung ở trang chủ/chi tiết; chặn yêu cầu trùng khi đang loading.

Cần Internet để tải API, ảnh và font. Nếu API bị chặn hoặc gián đoạn, trang báo lỗi; không thay dữ liệu API bằng sản phẩm giả. Font không tải được sẽ dùng Arial.

## Cấu trúc

```text
src/
├── app/                 # store.ts, hooks.ts
├── features/
│   ├── products/        # productsSlice.ts
│   └── cart/            # cartSlice.ts, cartSlice.test.ts
├── contexts/            # ThemeContext.tsx, AuthContext.tsx
├── components/          # Header, ProductCard, ProtectedRoute, ProductsStatus
├── layouts/             # MainLayout.tsx
├── pages/               # 6 trang theo đề
├── hooks/               # useProducts.ts
├── types/               # Product, CartItem, User
├── utils/               # format.ts
├── App.tsx              # Routes
├── main.tsx             # Redux Provider, ThemeProvider, AuthProvider, BrowserRouter
└── style.css
```

## Checklist kiểm tra thủ công

- Trang chủ: tìm một phần tên, tìm chữ hoa/thường, tìm tên không tồn tại.
- Mở trực tiếp `/products/1` và thử `/products/999999`.
- Thêm một sản phẩm hai lần: chỉ có một dòng giỏ, số lượng 2.
- Sửa số lượng, xóa một sản phẩm, xóa tất cả; đối chiếu tổng tiền/header.
- Chưa đăng nhập → thanh toán → sai mật khẩu → đúng mật khẩu → trở lại thanh toán.
- Đặt hàng: thông báo thành công, giỏ/header về 0.
- Đổi theme và chuyển trang; đăng xuất; kiểm tra đường dẫn không tồn tại.
- Kiểm tra lưới tại 390px, 768px, 1280px: lần lượt 1, 2, 4 cột.
- Ngắt mạng khi chưa tải sản phẩm: có thông báo lỗi; bật lại và bấm Thử lại.



## Tài liệu tham khảo

- https://redux-toolkit.js.org/usage/usage-with-typescript
- https://react.dev/reference/react/createContext
- https://fakestoreapi.com/

## Kết quả kiểm tra source

- `npm run build`: đạt (TypeScript strict và Vite production build).
- `npm test`: 5/5 kiểm thử đạt.
- Rà soát source: không dùng `any` hoặc `@ts-ignore`.
- Chưa xác nhận kiểm thử giao diện tự động trong trình duyệt vì môi trường kiểm tra không cài được Chromium. Checklist thủ công ở trên được cung cấp để kiểm tra trên máy chạy bài.
- API trực tiếp trả HTTP 403 khi được truy cập từ môi trường kiểm tra; cần kiểm tra kết nối API trên máy người chạy. Source vẫn dùng đúng endpoint đề bài, không sử dụng dữ liệu giả làm dữ liệu chính.
