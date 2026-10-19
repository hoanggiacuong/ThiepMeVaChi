# Thiệp 20/10 cho mẹ và chị

Mở đầu chạm để gọi đom đóm, đom đóm tụ thành "Chúc mừng 20-10" rồi thành tên. Kéo xuống là phong thư dấu sáp, mở ra lá thư chữ hiện dần. Cuối trang là màn pháo hoa trái tim.

Link (GitHub Pages):
- Mẹ: https://hoanggiacuong.github.io/ThiepMeVaChi/me.html
- Chị: https://hoanggiacuong.github.io/ThiepMeVaChi/chi.html

## Sửa nội dung
1. Sửa `data.js`: lời thư, chữ ký, câu chúc cuối, ảnh, giao diện (`phongCach`)
2. Chạy `node tao-trang.js` để tạo lại `me.html` và `chi.html`
3. Commit và push lên `main`, khoảng 1 phút sau GitHub Pages cập nhật

Ảnh: bỏ vào thư mục `anh/` rồi ghi đường dẫn vào `data.js` (ví dụ `anh: "anh/me.jpg"`). Nên thu nhỏ ảnh còn chiều rộng khoảng 1000px.

## Ảnh bìa xem trước
`cover.png` được chụp từ `cover.html` bằng Edge:
```
msedge --headless=new --hide-scrollbars --virtual-time-budget=6000 --window-size=1200,630 --screenshot=cover.png cover.html
```

## Lưu ý
- Repo public thì ai mở mã nguồn cũng đọc được lời thư trong `data.js`. Đừng để thông tin riêng tư
- Messenger/Zalo/Telegram lưu ô xem trước của link sau lần dán đầu tiên. Thử thì dán vào chat với chính mình trước
