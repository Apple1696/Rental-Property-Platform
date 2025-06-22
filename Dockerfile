# ------------------------------
# Sử dụng node 20 để build ứng dụng Vite
# ------------------------------
FROM node:20 AS builder

WORKDIR /app

# Sao chép tất cả (bao gồm .env) ngay từ đầu
COPY . .

# Cài đặt dependencies
RUN npm install

# Build ứng dụng Vite (đọc biến từ .env lúc này)
RUN npm run build

# ------------------------------
# Sử dụng Nginx để phục vụ ứng dụng đã build
# ------------------------------
FROM nginx:latest

# Xóa cấu hình mặc định và copy cấu hình Nginx mới
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy các file build được từ stage builder vào thư mục của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Mở port 80
EXPOSE 80

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
