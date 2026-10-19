// Tạo một trang cho mỗi người trong data.js (me.html, chi.html).
// Mỗi trang có thẻ Open Graph riêng để khi dán link hiện "💌 Gửi Mẹ".
// Chạy: node tao-trang.js
const fs = require("fs");
const path = require("path");
const THIEP = require("./data.js");

const phienBan = Date.now().toString(36); // chống trình duyệt trong app chat giữ bản cũ
// Font riêng cho từng giao diện (đều có dấu tiếng Việt)
const FONT = {
  holo: "",
  cherry: "&family=Baloo+2:wght@500;700;800&family=Pacifico",
  kitty: "&family=Baloo+2:wght@500;600;700;800&family=Mali:wght@500;600;700"
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function trang(khoa, nguoi) {
  const tieuDe = `💌 Gửi ${nguoi.goi}`;
  const moTa = `Có một bất ngờ nhỏ ngày 20/10 dành cho ${nguoi.goi}. Mở ra xem nhé!`;
  const url = THIEP.diaChi + `${khoa}.html`;
  const anh = THIEP.diaChi + "cover.png";
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(tieuDe)}</title>
<meta name="description" content="${esc(moTa)}">
<meta name="theme-color" content="#fff5f9">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(tieuDe)}">
<meta property="og:description" content="${esc(moTa)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(anh)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💐</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Quicksand:wght@500;600;700&family=Dancing+Script:wght@700&family=Playfair+Display:ital,wght@0,600;0,700;1,600${FONT[nguoi.phongCach] || ""}&display=swap">
<link rel="stylesheet" href="style.css?v=${phienBan}">
</head>
<body class="khoa${nguoi.phongCach ? " kieu-" + nguoi.phongCach : ""}">
<div class="sao" id="sao"></div>
<canvas id="troi" aria-hidden="true"></canvas>
<div class="man-chop" id="man-chop" aria-hidden="true"></div>
<div class="canh-hoa" id="canh-hoa" aria-hidden="true"></div>
<button class="nut-nhac" id="nut-nhac" type="button" aria-label="Bật hoặc tắt nhạc" hidden>♪</button>

<main>
  <section id="mo-dau">
    <div class="mo-dau-chu" id="mo-dau-chu">
      <div class="nho">20 · 10 · ${new Date().getFullYear()}</div>
      <div class="cham"><span class="vong"><span></span></span>Chạm để gọi đom đóm ✨</div>
    </div>
    <div class="keo-xuong" id="keo-xuong"><a href="#thu"><span id="keo-chu"></span><b>↓</b></a></div>
  </section>

  <section id="thu">
    <div class="khung">
      <div class="phong-bi" id="phong-bi">
        <div class="pb-vo">
          <div class="pb-sau"></div>
          <div class="pb-truoc"><span class="pb-gui">Gửi <b id="pb-ten"></b></span></div>
          <div class="pb-nap"></div>
          <button class="pb-dau" id="pb-dau" type="button" aria-label="Mở thư">♥</button>
        </div>
        <article class="thu" id="la-thu"></article>
      </div>
      <p class="pb-goi-y" id="pb-goi-y">Chạm vào con dấu để mở thư</p>
    </div>
  </section>

  <section id="ket">
    <div class="khung">
      <div class="nho" id="ket-tu"></div>
      <h2><em>Chúc mừng</em>20 · 10</h2>
      <p id="ket-loi"></p>
      <img id="anh-ket" class="anh-chung" alt="" hidden>
      <button class="nut" id="ban-lai" type="button">🎆 Bắn pháo hoa lần nữa</button>
    </div>
  </section>
</main>

<script src="data.js?v=${phienBan}"></script>
<script>window.NGUOI_NHAN = ${JSON.stringify(khoa)};</script>
<script src="app.js?v=${phienBan}"></script>
</body>
</html>
`;
}

for (const [khoa, nguoi] of Object.entries(THIEP.nguoi)) {
  fs.writeFileSync(path.join(__dirname, `${khoa}.html`), trang(khoa, nguoi));
  console.log(`${khoa}.html`.padEnd(10), "→", THIEP.diaChi + khoa + ".html", ` (${nguoi.goi})`);
}
