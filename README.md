# Flappy Tabs Portal

Website giải trí đa năng tích hợp nhiều tựa game hấp dẫn giúp rèn luyện phản xạ, với phong cách thiết kế hiện đại Neo-Brutalism.

## Tính năng

- Giao diện người dùng Neo-Brutalism chuẩn Responsive
- Hệ thống quản lý tài khoản (Đăng ký/Đăng nhập)
- Phân quyền người dùng rõ ràng (Người chơi / Quản trị viên)
- Tích hợp Mini-games:
  - **Flappy Bird:** Điều khiển chú chim vượt chướng ngại vật
  - **Aim Trainer:** Game luyện phản xạ và tốc độ chuột
- Bảng xếp hạng (Leaderboard) theo thời gian thực cho từng game
- Hệ thống Bình luận & Đánh giá (Rating 5 sao) cho từng tựa game
- Tích hợp quảng cáo thông minh (Sử dụng Cookie, tự động bật popup sau 1 phút)
- Trang thông tin & Form Gửi liên hệ
- Trang Quản trị (Admin Dashboard) hiển thị biểu đồ thống kê view, quản lý mô tả trang chủ, xóa bình luận rác

## Yêu cầu hệ thống

- Node.js (Phiên bản v14.0.0 trở lên)
- MySQL (Phiên bản 5.7 hoặc 8.0)
- Trình duyệt Web hiện đại (Chrome, Edge, Safari...)

## Cài đặt

1. Truy cập thư mục dự án:
```bash
cd flappy-tabs-app
```

2. Cài đặt các thư viện (dependencies) cần thiết:
```bash
npm install
```

3. Cấu hình môi trường:
- Copy template cấu hình môi trường `.env.example` thành file `.env`:
```bash
cp .env.example .env
```
- Mở file `.env` và tùy chỉnh các thông số để phù hợp với database MySQL của bạn:
  ```env
  PORT=8080
  DB_HOST=127.0.0.1
  DB_PORT=3307
  DB_USER=root
  DB_PASSWORD=your_password
  ```

4. Cấu hình Database:
- Không cần cấu hình thủ công. Dự án đã được thiết lập để tự động tạo Database (`flappy_tabs`) và toàn bộ bảng ngay lần chạy server đầu tiên nhờ việc import dữ liệu từ file `database.sql`.

5. Khởi động server:
```bash
npm start
```
*Giao diện trang web sẽ khởi chạy tại: `http://localhost:8080`*

## Cấu trúc thư mục

Dự án được tổ chức chặt chẽ theo chuẩn mô hình kiến trúc MVC (Model - View - Controller):

```
flappy-tabs-app/
├── frontend/           # Frontend View (Giao diện người dùng)
│   ├── src/            # Chứa các file HTML
│   ├── css/            # Các file style định dạng giao diện
│   └── js/             # Các file logic client-side (Game engine, API call)
├── backend/            # Backend Logic & Database interactions
│   ├── controllers/    # Route controllers (Xử lý logic từng chức năng)
│   ├── models/         # Database models (Nếu cần mở rộng sau này)
│   └── routes/         # Khai báo các đường dẫn API
├── config/             # Cấu hình hệ thống (Kết nối DB, Pooling)
├── middlewares/        # Custom middlewares (Kiểm tra quyền Auth, Parser)
├── .env.example        # Mẫu thiết lập môi trường
├── database.sql        # Database schema (Cấu trúc DB ban đầu)
├── server.js           # Entry point của ứng dụng Node.js
└── package.json        # Định nghĩa dependencies
```

## Biến môi trường

| Biến | Mô tả | Giá trị mặc định |
|------|-------|-----------------|
| PORT | Cổng chạy server web | 8080 |
| DB_HOST | Địa chỉ Host của database MySQL | 127.0.0.1 |
| DB_PORT | Cổng kết nối vào MySQL | 3307 |
| DB_USER | Tên đăng nhập database MySQL | root |
| DB_PASSWORD | Mật khẩu database MySQL | *(trống)* |

## API Endpoints

### Xác thực tài khoản (Authentication)
- POST `/api/register` - Đăng ký tài khoản mới
- POST `/api/login` - Đăng nhập vào hệ thống (Trả về Token đăng nhập)

### Quản lý Game & Tương tác
- GET `/api/leaderboard?game_id={id}` - Lấy bảng xếp hạng Top 50 theo game
- POST `/api/scores` - Gửi điểm số kỷ lục sau khi chơi xong (Yêu cầu Token)
- GET `/api/comments?game_id={id}` - Lấy danh sách bình luận đánh giá của game
- POST `/api/comments` - Gửi bình luận đánh giá (Người dùng chưa đăng nhập vẫn có thể sử dụng)
- POST `/api/contact` - Gửi tin nhắn liên hệ

### Quản trị viên (Admin)
- POST `/api/track_view` - Ghi nhận thêm lượt truy cập vào web
- GET `/api/admin/stats` - Lấy dữ liệu thống kê tổng quan
- GET `/api/settings` - Lấy thông tin mô tả nội dung web
- POST `/api/settings` - Cập nhật nội dung tùy biến trên web (Yêu cầu Admin Token)
- DELETE `/api/comments/{id}` - Xóa các bình luận không phù hợp (Yêu cầu Admin Token)

---
*Tài khoản Admin mặc định sau khi khởi chạy dự án: `admin` / `admin123`*
