# Flappy Tabs Web Portal

Hệ thống Website Cổng Game giải trí đa năng, mang đến trải nghiệm chơi game trực tiếp trên trình duyệt web với phong cách thiết kế hiện đại Neo-Brutalism.

## Tính năng chính

- **Trải nghiệm Game Trực quan:** Tích hợp trực tiếp các tựa game tương tác (Flappy Bird, Aim Trainer) chạy mượt mà ngay trên nền tảng Web Canvas.
- **Hệ thống Xếp hạng (Leaderboard):** Bảng vinh danh điểm số hiển thị theo thời gian thực (Real-time) cho từng chuyên mục trò chơi.
- **Quản lý Tài khoản (Auth System):** Chức năng Đăng nhập, Đăng ký và phân quyền người dùng an toàn.
- **Tương tác Cộng đồng:** Cho phép người dùng đánh giá sao (Rating) và thảo luận, bình luận công khai ở mỗi tựa game.
- **Bảng điều khiển Quản trị viên (Admin Dashboard):**
  - Thống kê dữ liệu tổng quan (Tổng số lượt truy cập, Người dùng, Bình luận).
  - Tùy biến và cấu hình nội dung hiển thị trên trang chủ.
  - Quản lý và kiểm duyệt các nội dung bình luận.
- **Tích hợp tính năng Monetization:** Hỗ trợ hệ thống Banner hiển thị nội dung thông minh.
- **Thiết kế Chuẩn Responsive:** Giao diện tự động tối ưu hóa và tương thích tốt trên các kích thước màn hình khác nhau (Desktop, Tablet, Mobile).

## Yêu cầu hệ thống

- Node.js (Phiên bản v18.0.0 trở lên)
- MySQL (Phiên bản 5.7 hoặc 8.0)
- Trình duyệt Web hiện đại (Chrome, Edge, Safari...)

## Hướng dẫn cài đặt và Triển khai

### 1. Cài đặt mã nguồn
Mở terminal tại thư mục gốc của dự án Web (`flappy-tabs-app`) và chạy lệnh:
```bash
npm install
```

### 2. Cấu hình môi trường (Environment Variables)
- Tạo một file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
```
- Mở file `.env` và thiết lập các thông số kết nối Database:
  ```env
  PORT=8080
  DB_HOST=127.0.0.1
  DB_PORT=3307
  DB_USER=root
  DB_PASSWORD=your_password
  ```

### 3. Khởi tạo Cơ sở dữ liệu (Tự động)
Hệ thống được thiết kế để tự động nạp lược đồ dữ liệu (Database Schema). Bạn chỉ cần đảm bảo MySQL đang chạy, ứng dụng sẽ tự động đọc file `database.sql` và khởi tạo toàn bộ bảng dữ liệu trong lần chạy đầu tiên.

### 4. Khởi động Máy chủ (Server)
```bash
npm start
```
*Giao diện trang web sẽ khởi chạy tại: `http://localhost:8080`*

## Công nghệ sử dụng

- **Mô hình kiến trúc:** MVC (Model - View - Controller).
- **Backend:** Node.js kết hợp framework Express.js để quản lý Routing và API.
- **Cơ sở dữ liệu:** MySQL (sử dụng thư viện `mysql2`).
- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript thuần (thao tác DOM và Canvas API).

## Cấu trúc thư mục

```
flappy-tabs-app/
├── backend/            # Mã nguồn Backend (Logic & Database interactions)
│   ├── controllers/    # Xử lý logic API cho từng chức năng (auth, game, admin)
│   └── routes/         # Khai báo và định tuyến các API Endpoints
├── config/             # Tệp tin cấu hình hệ thống (Kết nối DB Pool)
├── frontend/           # Mã nguồn Giao diện (Client-side)
│   ├── src/            # Các trang giao diện HTML
│   ├── css/            # Tệp định dạng phong cách hiển thị
│   └── js/             # Kịch bản tương tác người dùng và Game Engine
├── middlewares/        # Bộ lọc xử lý yêu cầu (Xác thực Auth Token)
├── .env.example        # Tệp mẫu lưu trữ biến môi trường
├── database.sql        # Lược đồ cơ sở dữ liệu (Database schema)
├── server.js           # Điểm khởi chạy (Entry point) của ứng dụng
└── package.json        # Định nghĩa dự án và các thư viện phụ thuộc
```

## Thông tin liên hệ

Nếu gặp sự cố trong quá trình cấu hình và cài đặt, vui lòng gửi phản hồi thông qua chức năng **Liên hệ** trực tiếp trên Website hoặc kiểm tra lại thông tin log của máy chủ Node.js.
