# React JWT Authentication Demo (Axios Interceptors + React Query)

Dự án Demo triển khai quy trình xác thực bảo mật sử dụng **JWT (Access Token & Refresh Token)**.
Dự án bao gồm một **Mock Backend** chạy trực tiếp trên trình duyệt và hệ thống **Live Logs** để trực quan hóa quá trình tự động làm mới token (Silent Refresh) mà không cần Backend thực tế.

## 🌟 Tính năng nổi bật
- **Cơ chế xác thực:** Access Token (lưu bộ nhớ) & Refresh Token (lưu LocalStorage).
- **Axios Interceptors:** Tự động bắt lỗi 401, gọi API refresh token và thực hiện lại request ban đầu.
- **Mock Server:** Giả lập các API Login, Profile, Refresh ngay trong Client (không cần chạy server riêng).
- **Live Log Terminal:** Giao diện xem log thời gian thực giúp theo dõi luồng chạy của Interceptor.
- **Test Mode:** Chức năng cố tình làm sai Token để kiểm thử tính năng tự động Refresh.

## 🛠 Công nghệ sử dụng
- **React** (Vite)
- **TanStack Query** (React Query) - Quản lý Server State.
- **Axios** - Networking & Interceptors.
- **React Hook Form** - Quản lý form đăng nhập.
- **Tailwind CSS** - Styling.

## 🚀 Cài đặt và Chạy dự án

Yêu cầu: Node.js đã được cài đặt.

### 1. Cài đặt thư viện:
```bash
npm install
```

### 2. Chạy dự án (Development):
```bash
npm run dev
```

### 3. Truy cập:
Mở trình duyệt tại: `http://localhost:5173`

---

## 🔐 Tài khoản Demo
Sử dụng thông tin sau để đăng nhập vào hệ thống:
- **Email:** user@example.com
- **Password:** password123

---

## 🧪 Hướng dẫn Test (Kịch bản Refresh Token)
Để chứng minh cơ chế Refresh Token hoạt động mà không cần đợi Token hết hạn thật, thực hiện các bước sau trên **Dashboard**:

1. Đăng nhập thành công.
2. Quan sát bảng **System Logs**.
3. Nhấn nút màu vàng **Corrupt Access Token**.
   - Hành động: Hệ thống gán Token sai vào bộ nhớ (giả lập Token hết hạn).
4. Nhấn nút **Refetch Data**.
5. Quan sát Log:
   - 🔴 *401 Unauthorized*: Interceptor bắt lỗi.
   - 🟡 *Refreshing*: Gọi `/refresh`.
   - 🟢 *Success*: Nhận Access Token mới.
   - 🔵 *Retry*: Request được gửi lại thành công.

---

## 📂 Cấu trúc thư mục chính
```
src/
├── api/
│   ├── axios.js        # Cấu hình Interceptor & Logic Refresh Token (Core)
│   ├── mockBackend.js  # Giả lập Server response
│   └── client.js       # Các hàm gọi API
├── context/
│   └── AuthContext.jsx # Quản lý trạng thái đăng nhập toàn cục
├── components/
│   └── LogPanel.jsx    # Màn hình hiển thị Log thời gian thực
├── pages/
│   ├── Login.jsx       # Form đăng nhập (React Hook Form)
│   └── Dashboard.jsx   # Trang được bảo vệ & Khu vực Test
└── utils/
    └── logger.js       # Event Bus dùng để bắn log ra UI
```

---
