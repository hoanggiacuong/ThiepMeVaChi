// Nội dung thiệp. Sửa file này rồi chạy: node tao-trang.js
// Mỗi người một mục trong "nguoi"; khoá (me, chi) là tên file link: .../me.html, .../chi.html
//   goi:     tên trên phong thư và trong ô xem trước khi gửi link ("Gửi Mẹ")
//   tenNgan: chữ đom đóm tụ lại ở màn đầu (ngắn thôi cho rõ, "\n" để xuống dòng)
//   ban:     cách gọi trong các câu chung ("Kéo xuống, có thư cho mẹ")
//   chao:    dòng mở đầu lá thư
//   loiChuc: các đoạn trong lá thư, mỗi chuỗi là một đoạn
//   loiKy, ky: lời cuối thư và chữ ký ("Thương mẹ nhiều," / "Con trai của mẹ")
//   anh:     ảnh trong lá thư, ví dụ "anh/me.jpg" (để trống "" nếu không có)
//   tu, loiKet, anhKet: màn cuối — dòng nhỏ trên cùng, câu chúc dưới chữ "Chúc mừng 20·10", ảnh (để trống nếu không có)
//   phongCach: giao diện: "" (hồng - vàng, chữ viết tay), "holo" (tím ánh kim), "cherry" (đỏ cherry), "kitty" (hồng dễ thương)
// Dùng được cả trên trình duyệt (window.THIEP) lẫn trong node (module.exports).
var THIEP = {
  // Địa chỉ trang trên GitHub Pages, dùng cho ảnh xem trước khi gửi link
  diaChi: "https://hoanggiacuong.github.io/ThiepMeVaChi/",

  nguoi: {
    me: {
      goi: "Mẹ Bé",
      tenNgan: "Mẹ Bé",
      ban: "mẹ",
      chao: "Mẹ ơi,",
      loiChuc: [
        "Hôm nay 20/10, con muốn gửi mẹ một lá thư nhỏ, vì có những điều ngày thường con chưa nói thành lời.",
        "Cảm ơn mẹ vì cả đời đã lo cho con, từ bữa cơm, giấc ngủ, đến những lần con đi xa mẹ vẫn gọi hỏi con ăn gì chưa.",
        "Con chúc mẹ luôn khoẻ mạnh, vui vẻ, bớt lo nghĩ đi một chút. Con thương mẹ nhiều lắm ❤️"
      ],
      loiKy: "Thương mẹ nhiều,",
      ky: "Con trai của mẹ",
      anh: "",
      tu: "Con gửi mẹ",
      loiKet: "Chúc mẹ một ngày 20/10 thật trọn vẹn, và cả những ngày sau nữa.",
      anhKet: "",
      phongCach: ""
    },
    chi: {
      goi: "Chị Phương",
      tenNgan: "Chị\nPhương", // hai dòng cho chữ to hơn trên điện thoại
      ban: "chị",
      chao: "Chị Phương ơi,",
      loiChuc: [
        "20/10 năm nay em gửi chị một tấm thiệp nhỏ do chính tay em làm.",
        "Cảm ơn chị vì luôn là người em có thể tin cậy, lúc thì như bạn, lúc lại lo cho em như mẹ.",
        "Chúc chị luôn xinh đẹp, khoẻ mạnh, công việc suôn sẻ và lúc nào cũng được yêu thương thật nhiều nhé 💐"
      ],
      loiKy: "Thương chị,",
      ky: "Em trai của chị",
      anh: "",
      tu: "Em gửi chị",
      loiKet: "Chúc chị một ngày 20/10 thật trọn vẹn, và cả những ngày sau nữa.",
      anhKet: "",
      phongCach: "holo"
    }
  }
};

if (typeof module !== "undefined") module.exports = THIEP;
else window.THIEP = THIEP;
