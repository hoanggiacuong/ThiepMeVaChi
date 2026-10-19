(function () {
  "use strict";
  var D = window.THIEP;
  var P = D.nguoi[window.NGUOI_NHAN];
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  };
  var ngauNhien = function (a, b) { return a + Math.random() * (b - a); };
  var nhe = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rung = function (ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} };

  /* Tải lại trang luôn về màn đầu: trình duyệt hay nhớ chỗ đang xem (hoặc #thu trên link) mà màn đầu lại đang khoá cuộn -> kẹt giữa trang */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  window.scrollTo(0, 0);

  /* ---------- Giao diện riêng từng người: màu pháo hoa, font chữ đom đóm, màu đom đóm ---------- */
  // Thứ tự màu giữ nguyên ý nghĩa: [chính, nhấn (đuôi pháo, pháo liễu), sáng, kem, đậm, phụ, trắng, lạnh]
  var GIAO_DIEN = {
    holo: {
      mau: ["#c7a6ff", "#9ff3ff", "#ffc4f0", "#f0eaff", "#ff8ad8", "#a78bfa", "#ffffff", "#7ef0ff"],
      chuTen: ["700", '"Quicksand", sans-serif'], dom: ["#7c4dff", "#d63fb0", "#2bb3d6"]
    },
    cherry: {
      mau: ["#ff4d6d", "#ffc98a", "#ffb3c0", "#fff1e0", "#e01e47", "#ff8fa3", "#ffffff", "#ffd27a"],
      chuTen: ["400", '"Pacifico", cursive'], dom: ["#d0123c", "#ff4d6d", "#c9733a"]
    },
    kitty: {
      mau: ["#ff2f7b", "#ffd93d", "#ff8fc4", "#fff0f6", "#e6005c", "#ff6fa5", "#ffffff", "#8fd9ff"],
      chuTen: ["700", '"Mali", cursive'], dom: ["#ff2f7b", "#e6005c", "#c2187a"]
    }
  };
  var GD = GIAO_DIEN[P.phongCach] || {
    mau: ["#ff7aa2", "#ffd27a", "#ffb3c7", "#fff1c1", "#ff5d8f", "#c9a7ff", "#ffffff", "#8fe3ff"],
    chuTen: ["700", '"Dancing Script", cursive']
  };

  /* ---------- Nội dung ---------- */
  $("#keo-chu").textContent = "Kéo xuống, có thư cho " + P.ban;
  $("#pb-ten").textContent = P.goi;

  var thu = '<p class="chao hien-dan">' + esc(P.chao) + "</p>";
  if (P.anh) thu += '<img class="anh-rieng hien-dan" src="' + esc(P.anh) + '" alt="">';
  P.loiChuc.forEach(function (d) { thu += '<p class="hien-dan">' + esc(d) + "</p>"; });
  thu += '<div class="ky hien-dan">' + esc(P.loiKy) + "<b>" + esc(P.ky) + "</b></div>";
  $("#la-thu").innerHTML = thu;

  $("#ket-tu").textContent = P.tu;
  $("#ket-loi").textContent = P.loiKet;
  if (P.anhKet) { var ak = $("#anh-ket"); ak.src = P.anhKet; ak.hidden = false; }

  /* ---------- Bầu trời sao, sao băng, cánh hoa rơi ---------- */
  var sao = $("#sao"), html = "";
  for (var i = 0; i < 90; i++) {
    var s = ngauNhien(1, 2.6).toFixed(1);
    html += '<i style="left:' + ngauNhien(0, 100).toFixed(2) + "%;top:" + ngauNhien(0, 100).toFixed(2) +
      "%;width:" + s + "px;height:" + s + "px;animation-delay:-" + ngauNhien(0, 3).toFixed(2) +
      "s;animation-duration:" + ngauNhien(2, 5).toFixed(2) + 's"></i>';
  }
  sao.innerHTML = html;

  function saoBang() {
    if (!document.hidden && !nhe) {
      var b = document.createElement("b");
      b.className = "sao-bang";
      b.style.left = ngauNhien(30, 105) + "%"; b.style.top = ngauNhien(-5, 35) + "%";
      b.addEventListener("animationend", function () { b.remove(); });
      sao.appendChild(b);
    }
    setTimeout(saoBang, ngauNhien(3500, 8000));
  }
  setTimeout(saoBang, 2000);

  function raiCanhHoa() {
    if (nhe) return;
    var lop = $("#canh-hoa"), n = window.innerWidth < 500 ? 11 : 18, h = "";
    for (var k = 0; k < n; k++) {
      h += '<i style="left:' + ngauNhien(-5, 100).toFixed(1) + "%;--s:" + ngauNhien(9, 17).toFixed(1) + "px;--t:" + ngauNhien(11, 20).toFixed(1) +
        "s;--d:-" + ngauNhien(0, 20).toFixed(1) + "s;--dx:" + ngauNhien(-25, 25).toFixed(0) + "vw;--x:" + ngauNhien(2.5, 5).toFixed(1) + 's"></i>';
    }
    lop.innerHTML = h;
    lop.classList.add("hien");
  }

  /* ---------- Âm thanh: hộp nhạc tự tổng hợp, không cần file ---------- */
  var am = null, tong, nhacBat = false, nhipKe = 0, gioKe = 0, henNhac = null, nhieu = null;
  var GIAI = [76, 79, 84, 83, 79, 76, 77, 81, 84, 81, 0, 79, 76, 79, 81, 79, 76, 72, 74, 77, 76, 72, 0, 0];
  var BASS = [48, 43, 41, 43, 45, 48, 43, 48];
  var HOP_AM = [[60, 64, 67], [59, 62, 67], [60, 65, 69], [59, 62, 65], [60, 64, 69], [60, 64, 67], [59, 62, 65], [60, 64, 67]];
  var hz = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };

  function khoiAm() {
    if (am) { if (am.state === "suspended") am.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    am = new AC();
    tong = am.createGain(); tong.gain.value = 0.55;
    var tre = am.createDelay(), hoi = am.createGain(), vang = am.createGain();
    tre.delayTime.value = 0.33; hoi.gain.value = 0.32; vang.gain.value = 0.35;
    tong.connect(am.destination); tong.connect(tre); tre.connect(hoi); hoi.connect(tre); tre.connect(vang); vang.connect(am.destination);
    var buf = am.createBuffer(1, am.sampleRate * 0.6, am.sampleRate), d = buf.getChannelData(0);
    for (var k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1;
    nhieu = buf;
  }
  function not(m, t, dai, to) {
    var o = am.createOscillator(), o2 = am.createOscillator(), g = am.createGain(), g2 = am.createGain();
    o.type = "sine"; o.frequency.value = hz(m);
    o2.type = "sine"; o2.frequency.value = hz(m) * 2; g2.gain.value = 0.22;
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(tong);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(to, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dai);
    o.start(t); o2.start(t); o.stop(t + dai + 0.05); o2.stop(t + dai + 0.05);
  }
  function keNhac() {
    var NHIP = 0.38;
    while (gioKe < am.currentTime + 0.5) {
      var b = nhipKe % GIAI.length, o = Math.floor(b / 3) % BASS.length, phach = b % 3;
      if (GIAI[b]) not(GIAI[b], gioKe, 1.8, 0.16);
      if (phach === 0) not(BASS[o], gioKe, 2.2, 0.13);
      else HOP_AM[o].forEach(function (m) { not(m, gioKe, 0.9, 0.035); });
      nhipKe++; gioKe += NHIP;
    }
  }
  function batNhac() {
    khoiAm(); if (!am) return;
    nhacBat = true;
    tong.gain.cancelScheduledValues(am.currentTime);
    tong.gain.setTargetAtTime(0.55, am.currentTime, 0.1);
    gioKe = am.currentTime + 0.1;
    clearInterval(henNhac); henNhac = setInterval(keNhac, 120); keNhac();
    $("#nut-nhac").classList.remove("tat");
  }
  function tatNhac() {
    nhacBat = false; clearInterval(henNhac);
    if (am) tong.gain.setTargetAtTime(0, am.currentTime, 0.1);
    $("#nut-nhac").classList.add("tat");
  }
  function tiengNo(to) {
    if (!am || !nhacBat) return;
    var src = am.createBufferSource(), loc = am.createBiquadFilter(), g = am.createGain(), t = am.currentTime;
    src.buffer = nhieu; loc.type = "lowpass"; loc.frequency.value = ngauNhien(500, 1100);
    g.gain.setValueAtTime(to || 0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    src.connect(loc); loc.connect(g); g.connect(am.destination); src.start(t); src.stop(t + 0.6);
  }
  var lanLach = 0;
  function tiengLach() { // tiếng lách tách: vài tiếng nổ nhỏ cao, rải trong 0.4s
    if (!am || !nhacBat || am.currentTime - lanLach < 0.25) return;
    lanLach = am.currentTime;
    for (var k = 0; k < 7; k++) {
      var src = am.createBufferSource(), loc = am.createBiquadFilter(), g = am.createGain(), t = am.currentTime + ngauNhien(0, 0.4);
      src.buffer = nhieu; loc.type = "highpass"; loc.frequency.value = ngauNhien(2500, 5000);
      g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      src.connect(loc); loc.connect(g); g.connect(am.destination); src.start(t, ngauNhien(0, 0.5)); src.stop(t + 0.05);
    }
  }
  function tiengChuong() {
    if (!am || !nhacBat) return;
    [84, 88, 91, 96].forEach(function (m, k) { not(m, am.currentTime + k * 0.09, 1.4, 0.12); });
  }
  function tiengXoet() { // tiếng mở phong thư
    if (!am || !nhacBat) return;
    var src = am.createBufferSource(), loc = am.createBiquadFilter(), g = am.createGain(), t = am.currentTime;
    src.buffer = nhieu; loc.type = "bandpass"; loc.Q.value = 0.8;
    loc.frequency.setValueAtTime(900, t); loc.frequency.exponentialRampToValueAtTime(3500, t + 0.35);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.18, t + 0.05); g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    src.connect(loc); loc.connect(g); g.connect(am.destination); src.start(t); src.stop(t + 0.45);
  }
  $("#nut-nhac").addEventListener("click", function () { nhacBat ? tatNhac() : batNhac(); });
  document.addEventListener("visibilitychange", function () {
    if (!am) return;
    if (document.hidden) am.suspend(); else if (nhacBat) am.resume();
  });

  /* ---------- Pháo hoa ---------- */
  var cv = $("#troi"), cx = cv.getContext("2d"), W = 0, H = 0;
  var cvGiay = document.createElement("canvas"), cg = cvGiay.getContext("2d"); // giấy màu: canvas riêng, xoá sạch mỗi khung
  cvGiay.className = "giay-mau"; cvGiay.setAttribute("aria-hidden", "true"); cv.parentNode.insertBefore(cvGiay, cv.nextSibling);
  function doKichThuoc() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cvGiay.width = cv.width; cvGiay.height = cv.height; cg.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  doKichThuoc();
  window.addEventListener("resize", doKichThuoc);

  var MAU = GD.mau;
  var MAU_GIAY = [MAU[0], MAU[1], MAU[5], MAU[7], "#ffffff", MAU[4], MAU[2]];
  var DOM = MAU.map(function (c) {
    var s = document.createElement("canvas"); s.width = s.height = 32;
    var g = s.getContext("2d"), r = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    r.addColorStop(0, "#fff"); r.addColorStop(0.22, c); r.addColorStop(0.5, c + "55"); r.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = r; g.fillRect(0, 0, 32, 32); return s;
  });
  var LOE = MAU.map(function (c) { // quầng sáng lớn khi nổ, soi sáng cả bầu trời
    var s = document.createElement("canvas"); s.width = s.height = 128;
    var g = s.getContext("2d"), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, c + "cc"); r.addColorStop(0.3, c + "44"); r.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = r; g.fillRect(0, 0, 128, 128); return s;
  });
  var hat = [], phao = [], giay = [], loe = [], vong = [], tiLe = function () { return Math.min(W, H) / 400; };
  var chiSo = function () { return Math.floor(Math.random() * MAU.length); };
  var trongKhoang = function (k, mac) { return k ? ngauNhien(k[0], k[1]) : mac; };

  /* Nổ một quả. tuyChon.hinh: "cuc" (mặc định, toả tròn đặc), "vong" (vòng tròn nghiêng), "tim" (trái tim) */
  function no(x, y, n, tuyChon) {
    tuyChon = tuyChon || {};
    var mau = tuyChon.mau || [chiSo(), chiSo()];
    var tocDo = (tuyChon.tocDo || 5) * Math.max(0.8, tiLe()), ra = [], hinh = tuyChon.hinh || "cuc";
    var nghieng = ngauNhien(0.3, 1), xoay = Math.random() * Math.PI * 2;
    for (var k = 0; k < n; k++) {
      var vx, vy;
      if (hinh === "vong") {
        var gv = k / n * Math.PI * 2, vv = tocDo * ngauNhien(0.95, 1), a0 = Math.cos(gv) * vv, b0 = Math.sin(gv) * vv * nghieng;
        vx = a0 * Math.cos(xoay) - b0 * Math.sin(xoay); vy = a0 * Math.sin(xoay) + b0 * Math.cos(xoay);
      } else if (hinh === "tim") {
        var t = k / n * Math.PI * 2, vt = tocDo / 16 * ngauNhien(0.94, 1.03);
        vx = 16 * Math.pow(Math.sin(t), 3) * vt;
        vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * vt;
      } else {
        var goc = Math.random() * Math.PI * 2, v = tocDo * Math.pow(Math.random(), 0.45);
        vx = Math.cos(goc) * v; vy = Math.sin(goc) * v;
      }
      var p = {
        x: x, y: y, vx: vx, vy: vy + (tuyChon.len || 0),
        song: trongKhoang(tuyChon.song, ngauNhien(55, 100)), toiDa: 100, co: trongKhoang(tuyChon.co, ngauNhien(7, 13)),
        dom: DOM[mau[k % mau.length]], can: tuyChon.can || 0.975, duoi: tuyChon.duoi, lach: tuyChon.lach,
        kieu: tuyChon.giu ? "giu" : "roi", trongLuc: tuyChon.trongLuc == null ? 0.06 : tuyChon.trongLuc,
        pha: Math.random() * 6.28, ke: ngauNhien(0.012, 0.022), tx: x, ty: y
      };
      p.toiDa = p.song; hat.push(p); ra.push(p);
    }
    if (!tuyChon.imLang) {
      tiengNo();
      loe.push({ x: x, y: y, a: 0.9, dom: LOE[mau[0]], r: Math.max(W, H) * 0.55 });
    }
    return ra;
  }
  function ban(x, dichY, khiNo) {
    phao.push({ x: x, y: H + 10, x0: x, y0: H + 10, dichY: dichY, t: 0, dai: ngauNhien(55, 70), khiNo: khiNo });
  }
  /* Vòng sóng xung kích: thêm lực nổ cho những khoảnh khắc quan trọng của cảnh mở đầu */
  function taoVong(x, y, mau, to) {
    vong.push({ x: x, y: y, r: Math.max(W, H) * 0.015, dich: Math.max(W, H) * 0.46 * (to || 1), mau: mau, a: 0.85 });
  }

  /* Các kiểu pháo hoa */
  function noKieu(x, y, kieu, to) {
    var s = Math.max(1, tiLe()), c1 = chiSo(), c2 = chiSo();
    if (kieu === "vong") no(x, y, Math.round(72 * s), { hinh: "vong", mau: [c1], tocDo: 5, trongLuc: 0.03 });
    else if (kieu === "hai") {
      no(x, y, Math.round(64 * s), { hinh: "vong", mau: [c1], tocDo: 6, trongLuc: 0.03 });
      no(x, y, Math.round(55 * s), { mau: [c2, 6], tocDo: 2.6, imLang: true });
    } else if (kieu === "lieu") no(x, y, Math.round(70 * s), { mau: [1, 3], tocDo: 4.6, can: 0.962, trongLuc: 0.035, song: [140, 200], co: [5, 8], duoi: true });
    else if (kieu === "lach") no(x, y, Math.round(80 * s), { mau: [c1, 6], tocDo: 5, lach: true, song: [45, 70] });
    else if (kieu === "tim") no(x, y, Math.round(96 * s), { hinh: "tim", mau: [0, 4, 2], tocDo: 4.6 * (to || 1), trongLuc: 0.022, song: [85, 110] });
    else no(x, y, Math.round(ngauNhien(70, 120) * s));
  }
  function banKieu(kieu, x, y, to) {
    x = x == null ? ngauNhien(W * 0.15, W * 0.85) : x;
    y = y == null ? ngauNhien(H * 0.15, H * 0.45) : y;
    ban(x, y, function () { noKieu(x, y, kieu, to); });
  }

  function lachTach(x, y) {
    for (var k = 0; k < 4; k++) {
      hat.push({ x: x, y: y, vx: ngauNhien(-1.8, 1.8), vy: ngauNhien(-1.8, 1.8), song: ngauNhien(8, 16), toiDa: 16, co: 5, dom: DOM[6], kieu: "roi", trongLuc: 0.02, can: 0.9 });
    }
    tiengLach();
  }

  /* Giấy màu */
  function phaoGiay(x, y, n, huong) {
    for (var k = 0; k < n; k++) {
      var goc = (huong == null ? -Math.PI / 2 : huong) + ngauNhien(-0.6, 0.6), v = ngauNhien(6, 15) * Math.max(0.8, tiLe() * 0.9);
      giay.push({
        x: x, y: y, vx: Math.cos(goc) * v, vy: Math.sin(goc) * v, goc: Math.random() * 6.28, vg: ngauNhien(-0.25, 0.25),
        w: ngauNhien(5, 9), h: ngauNhien(9, 15), mau: MAU_GIAY[k % MAU_GIAY.length], song: ngauNhien(140, 220), lac: Math.random() * 6.28
      });
    }
  }
  function giayHaiBen() {
    phaoGiay(0, H, 70, -Math.PI / 3);
    phaoGiay(W, H, 70, -Math.PI * 2 / 3);
  }

  var truoc = performance.now(), t0 = 0, daSach = false;
  function khung(bayGio) {
    var f = Math.min((bayGio - truoc) / 16.67, 3); truoc = bayGio; t0 += f;
    if (!hat.length && !phao.length && !giay.length && !loe.length && !vong.length) { // trời trống: xoá một lần rồi thôi
      if (!daSach) { cx.clearRect(0, 0, W, H); cg.clearRect(0, 0, W, H); daSach = true; }
      requestAnimationFrame(khung); return;
    }
    daSach = false;
    cx.globalCompositeOperation = "destination-out";
    cx.fillStyle = "rgba(0,0,0,0.24)"; cx.fillRect(0, 0, W, H);
    cx.globalCompositeOperation = "source-over"; // nền sáng: vẽ chồng bình thường cho màu đậm, không cộng sáng thành trắng

    for (var q = loe.length - 1; q >= 0; q--) {
      var L = loe[q]; L.a *= Math.pow(0.86, f);
      if (L.a < 0.02) { loe.splice(q, 1); continue; }
      cx.globalAlpha = L.a * 0.32;
      cx.drawImage(L.dom, L.x - L.r, L.y - L.r, L.r * 2, L.r * 2);
    }
    for (var z = vong.length - 1; z >= 0; z--) {
      var V = vong[z]; V.r += (V.dich - V.r) * 0.1 * f; V.a *= Math.pow(0.9, f);
      if (V.a < 0.02 || V.dich - V.r < 1) { vong.splice(z, 1); continue; }
      cx.globalAlpha = V.a; cx.lineWidth = Math.max(1.5, V.r * 0.03); cx.strokeStyle = V.mau;
      cx.beginPath(); cx.arc(V.x, V.y, V.r, 0, Math.PI * 2); cx.stroke();
    }
    for (var k = phao.length - 1; k >= 0; k--) {
      var r = phao[k]; r.t += f;
      var u = Math.min(r.t / r.dai, 1), e = 1 - Math.pow(1 - u, 3);
      r.x = r.x0 + Math.sin(u * 9) * 2; r.y = r.y0 + (r.dichY - r.y0) * e;
      hat.push({ x: r.x, y: r.y, vx: ngauNhien(-0.4, 0.4), vy: ngauNhien(0.5, 1.5), song: 22, toiDa: 22, co: 6, dom: DOM[1], kieu: "roi", trongLuc: 0.02 });
      if (u >= 1) { phao.splice(k, 1); r.khiNo(); }
    }
    for (var j = hat.length - 1; j >= 0; j--) {
      var p = hat[j], a;
      if (p.kieu === "roi") {
        var can = Math.pow(p.can || 0.975, f);
        p.vx *= can; p.vy = p.vy * can + p.trongLuc * f;
        p.x += p.vx * f; p.y += p.vy * f; p.song -= f;
        if (p.song <= 0 || p.y > H + 20) {
          if (p.lach && p.song <= 0) lachTach(p.x, p.y);
          hat.splice(j, 1); continue;
        }
        if (p.duoi && Math.random() < 0.45 * f) {
          hat.push({ x: p.x, y: p.y, vx: 0, vy: 0.25, song: 26, toiDa: 26, co: 4, dom: p.dom, kieu: "roi", trongLuc: 0.012 });
        }
        a = Math.min(1, p.song / p.toiDa * 1.6) * (0.7 + 0.3 * Math.sin(t0 * 0.6 + j));
      } else if (p.kieu === "giu") {
        p.vx *= Math.pow(0.93, f); p.vy *= Math.pow(0.93, f);
        p.x += p.vx * f; p.y += p.vy * f; a = 0.55;
      } else if (p.kieu === "dom") { // đom đóm: lượn lờ, nhấp nháy, bay lại gần ngón tay
        p.pha += 0.02 * f;
        p.vx += Math.cos(p.pha + p.hx) * 0.04 * f; p.vy += Math.sin(p.pha * 1.3 + p.hx) * 0.04 * f;
        if (tay && bayGio - tay.luc < 1200) {
          var kx = tay.x - p.x, ky = tay.y - p.y;
          if (kx * kx + ky * ky < 40000) { p.vx += kx * 0.0009 * f; p.vy += ky * 0.0009 * f; }
        }
        var hd = Math.pow(0.96, f); p.vx *= hd; p.vy *= hd;
        p.x += p.vx * f; p.y += p.vy * f;
        if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
        if (p.song != null) { p.song -= f; if (p.song <= 0) { hat.splice(j, 1); continue; } }
        p.vao = Math.min(1, p.vao + 0.015 * f);
        a = p.vao * (0.25 + 0.6 * Math.pow(0.5 + 0.5 * Math.sin(t0 * 0.07 + p.hx * 5), 2)) * (p.song != null ? Math.min(1, p.song / 60) : 1);
      } else { // "hut": lò xo kéo về điểm đích, lấp lánh nhẹ
        var dx = p.tx + Math.sin(t0 * 0.05 + p.pha) * 0.8 - p.x, dy = p.ty + Math.cos(t0 * 0.05 + p.pha) * 0.8 - p.y;
        var tat = Math.pow(0.86, f);
        p.vx = (p.vx + dx * p.ke * f) * tat; p.vy = (p.vy + dy * p.ke * f) * tat;
        p.x += p.vx * f; p.y += p.vy * f;
        a = 0.6 + 0.25 * Math.sin(t0 * 0.15 + p.pha);
      }
      cx.globalAlpha = a;
      var co = p.kieu === "roi" ? p.co : p.co * 0.75;
      cx.drawImage(p.dom, p.x - co / 2, p.y - co / 2, co, co);
    }

    cg.clearRect(0, 0, W, H);
    for (var m = giay.length - 1; m >= 0; m--) {
      var g = giay[m], hamGiay = Math.pow(0.965, f);
      g.vx *= hamGiay; g.vy = g.vy * hamGiay + 0.22 * f; g.goc += g.vg * f; g.song -= f;
      g.x += (g.vx + Math.sin(t0 * 0.08 + g.lac) * 0.9) * f; g.y += g.vy * f;
      if (g.song <= 0 || g.y > H + 30) { giay.splice(m, 1); continue; }
      cg.globalAlpha = Math.min(1, g.song / 40);
      cg.save(); cg.translate(g.x, g.y); cg.rotate(g.goc); cg.scale(1, Math.cos(t0 * 0.15 + g.lac));
      cg.fillStyle = g.mau; cg.fillRect(-g.w / 2, -g.h / 2, g.w, g.h);
      cg.restore();
    }
    cx.globalAlpha = 1;
    requestAnimationFrame(khung);
  }
  requestAnimationFrame(khung);

  /* Vệt lấp lánh theo ngón tay / chuột */
  var lanVet = 0, daBatDau = false;
  window.addEventListener("pointermove", function (e) {
    if (!daBatDau || nhe) return;
    var bay = performance.now(); if (bay - lanVet < 28) return; lanVet = bay;
    hat.push({ x: e.clientX, y: e.clientY, vx: ngauNhien(-0.6, 0.6), vy: ngauNhien(-0.3, 0.9), song: 34, toiDa: 34, co: ngauNhien(5, 9), dom: DOM[chiSo()], kieu: "roi", trongLuc: 0.03, can: 0.95 });
  }, { passive: true });

  /* ---------- Hiệu ứng "hoành tráng" cho cảnh mở đầu: chớp sáng, rung máy ---------- */
  var manChop = $("#man-chop");
  function chopSang(doManh) {
    if (nhe || !manChop) return;
    manChop.style.setProperty("--do", String(doManh == null ? 0.55 : doManh));
    manChop.classList.remove("chop"); void manChop.offsetWidth; manChop.classList.add("chop");
  }
  function giatManHinh() {
    if (nhe) return;
    [cv, cvGiay].forEach(function (c) {
      c.classList.remove("giat-may"); void c.offsetWidth; c.classList.add("giat-may");
    });
  }

  /* ---------- Màn mở đầu: đom đóm bay theo tay, tụ thành "Chúc mừng 20-10" rồi thành tên người nhận ---------- */
  var tay = null; // vị trí ngón tay/chuột gần nhất, đom đóm bay lại gần
  window.addEventListener("pointermove", function (e) { tay = { x: e.clientX, y: e.clientY, luc: performance.now() }; }, { passive: true });
  var DOM_DOM = (GD.dom || ["#e0457b", "#a855f7", "#f59e0b"]).map(function (c) { // đom đóm: màu đậm để nổi trên nền sáng
    var s = document.createElement("canvas"); s.width = s.height = 32;
    var g = s.getContext("2d"), r = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    r.addColorStop(0, "#fff"); r.addColorStop(0.18, c); r.addColorStop(0.55, c + "66"); r.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = r; g.fillRect(0, 0, 32, 32); return s;
  });
  function domDom(x, y, song) {
    return {
      x: x, y: y, vx: ngauNhien(-0.5, 0.5), vy: ngauNhien(-0.5, 0.5), co: ngauNhien(6, 11), dom: DOM_DOM[Math.floor(Math.random() * DOM_DOM.length)],
      kieu: "dom", pha: Math.random() * 6.28, hx: Math.random() * 6.28, vao: 0, song: song == null ? null : song, toiDa: song || 1,
      ke: ngauNhien(0.012, 0.022), tx: x, ty: y
    };
  }

  /* Lấy điểm từ chữ vẽ lên canvas ẩn để đom đóm tụ vào */
  function layDiem(ve) {
    var w = Math.max(1, Math.floor(W)), h = Math.max(1, Math.floor(H));
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    var g = c.getContext("2d"); g.fillStyle = "#fff"; ve(g, w, h);
    var d = g.getImageData(0, 0, w, h).data, buoc = Math.max(3, Math.round(Math.min(w, h) / 140)), ra = [];
    for (var y = 0; y < h; y += buoc) for (var x = 0; x < w; x += buoc) if (d[(y * w + x) * 4 + 3] > 128) ra.push({ x: x, y: y });
    return ra;
  }
  function diemChu(chu, kieuChu) { // kieuChu: [độ đậm, họ font]; "\n" để xuống dòng
    var dong = chu.split("\n");
    return layDiem(function (g, w, h) {
      var co = Math.min(h * (dong.length > 1 ? 0.15 : 0.2), 180), font = function (s) { return kieuChu[0] + " " + s + "px " + kieuChu[1]; };
      g.font = font(co);
      var rong = Math.max.apply(null, dong.map(function (d) { return g.measureText(d).width; }));
      if (rong > w * 0.86) { co *= w * 0.86 / rong; g.font = font(co); }
      g.textAlign = "center"; g.textBaseline = "middle";
      dong.forEach(function (d, k) { g.fillText(d, w / 2, h * 0.42 + (k - (dong.length - 1) / 2) * co * 1.15); });
    });
  }
  function tuVao(ds, diem) {
    if (!diem.length) return;
    for (var k = diem.length - 1; k > 0; k--) { var m = Math.floor(Math.random() * (k + 1)), tg = diem[k]; diem[k] = diem[m]; diem[m] = tg; }
    ds.forEach(function (p, k) {
      var d = diem[k % diem.length];
      p.tx = d.x + ngauNhien(-1.5, 1.5); p.ty = d.y + ngauNhien(-1.5, 1.5); p.kieu = "hut";
    });
  }
  var fontSan = Promise.race([
    document.fonts ? document.fonts.load(GD.chuTen[0] + " 80px " + GD.chuTen[1], P.tenNgan + "Chúc mừng 20-10") : Promise.resolve(),
    new Promise(function (r) { setTimeout(r, 2500); })
  ]).catch(function () {});

  var xongMoDau = false, bayDom = [];
  function goiDomDom() {
    var n = W < 500 ? 650 : 1000;
    for (var k = 0; k < n; k++) { var p = domDom(ngauNhien(0, W), ngauNhien(0, H)); bayDom.push(p); hat.push(p); }
    tiengChuong();
    fontSan.then(function () {
      setTimeout(function () { tuVao(bayDom, diemChu("Chúc mừng\n20-10", GD.chuTen)); notVui(1); rung(20); }, nhe ? 200 : 2200);
      setTimeout(function () {
        tuVao(bayDom, diemChu(P.tenNgan, GD.chuTen));
        chopSang(0.35); taoVong(W / 2, H * 0.42, GD.mau[1], 0.8); tiengChuong(); rung([20, 60, 20]);
      }, nhe ? 1200 : 5800);
      setTimeout(function () { tanRa(); ketThucMoDau(); }, nhe ? 2500 : 9400);
    });
  }
  function tanRa() { // đom đóm bay tản ra; giữ lại một ít lượn lờ suốt trang
    bayDom.forEach(function (p, k) {
      p.kieu = "dom"; p.vx = ngauNhien(-2.5, 2.5); p.vy = ngauNhien(-2.5, 2.5); p.vao = 1;
      if (k % 12) p.song = p.toiDa = ngauNhien(90, 220); else p.song = null;
    });
    bayDom = [];
  }
  function ketThucMoDau() {
    xongMoDau = true;
    document.body.classList.remove("khoa");
    $("#keo-xuong").classList.add("hien");
    raiCanhHoa();
  }
  $("#mo-dau").addEventListener("click", function (e) {
    if (!daBatDau) {
      daBatDau = true;
      batNhac();
      $("#nut-nhac").hidden = false;
      $("#mo-dau-chu").classList.add("an");
      goiDomDom();
      return;
    }
    if (e.target.closest(".keo-xuong a")) { // cuộn xuống thư mà không gắn #thu vào link
      e.preventDefault();
      $("#thu").scrollIntoView({ behavior: nhe ? "auto" : "smooth" });
      return;
    }
    if (!xongMoDau || e.target.closest(".keo-xuong")) return;
    for (var k = 0; k < 24; k++) { // chạm: thả thêm một đàn đom đóm nhỏ
      var p = domDom(e.clientX, e.clientY, ngauNhien(100, 180));
      p.vx = ngauNhien(-3, 3); p.vy = ngauNhien(-3, 3); p.vao = 1; hat.push(p);
    }
    rung(10);
  });

  function notVui(bac) { // ba nốt hợp âm ngắn khi đom đóm tụ thành chữ
    if (!am || !nhacBat) return;
    var t = am.currentTime;
    [0, 4, 7].forEach(function (b, k) { not(60 + bac * 5 + b, t + k * 0.06, 1.1, 0.1); });
  }

  /* ---------- Phong thư ---------- */
  var phongBi = $("#phong-bi"), laThu = $("#la-thu"), daMoThu = false;
  var tachKyTu = (function () {
    if (window.Intl && Intl.Segmenter) {
      var seg = new Intl.Segmenter("vi", { granularity: "grapheme" });
      return function (s) { return Array.from(seg.segment(s), function (x) { return x.segment; }); };
    }
    return function (s) { return Array.from(s); };
  })();

  /* Chữ hiện dần như đang viết: tách thành từng ký tự, mỗi ký tự trễ hơn một chút */
  function vietThu() {
    var tre = 0;
    laThu.querySelectorAll(".hien-dan").forEach(function (el) {
      if (el.tagName === "P") {
        var toc = el.classList.contains("chao") ? 55 : 22;
        el.innerHTML = tachKyTu(el.textContent).map(function (c) { return '<span class="ch">' + esc(c) + "</span>"; }).join("");
        el.classList.add("ro");
        el.querySelectorAll(".ch").forEach(function (c, k) { c.style.transitionDelay = (tre + k * toc) + "ms"; });
        tre += el.textContent.length * toc + 350;
      } else {
        el.style.transitionDelay = tre + "ms"; tre += 500;
      }
    });
    requestAnimationFrame(function () { requestAnimationFrame(function () { laThu.classList.add("viet"); }); });
    setTimeout(function () { laThu.classList.add("viet-xong"); }, tre + 800);
  }
  function hienHetThu() { // chạm vào thư để hiện hết ngay, khỏi chờ
    if (laThu.classList.contains("viet")) laThu.classList.add("hien-het");
  }

  function moThu() {
    if (daMoThu) return;
    daMoThu = true;
    if (!am) batNhac();
    tiengXoet(); rung(20);
    phongBi.classList.add("mo");
    var r = $("#pb-dau").getBoundingClientRect();
    no(r.left + r.width / 2, r.top + r.height / 2, 46, { tocDo: 3.2, mau: [0, 4, 1], imLang: true, trongLuc: 0.08 });
    $("#pb-goi-y").classList.add("an");
    setTimeout(function () { phongBi.classList.add("lat"); }, 420);
    setTimeout(function () { phongBi.classList.add("rut"); }, 850);
    setTimeout(function () {
      // FLIP: lá thư đang thò ra khỏi phong bì -> nở thành lá thư đầy đủ
      var vo = $(".pb-vo"), dau = laThu.getBoundingClientRect();
      vo.style.height = vo.offsetHeight + "px";
      phongBi.classList.add("xong");
      var cuoi = laThu.getBoundingClientRect();
      if (laThu.animate && !nhe) {
        laThu.animate([
          { transform: "translate(" + (dau.left - cuoi.left) + "px," + (dau.top - cuoi.top) + "px)", width: dau.width + "px", height: dau.height + "px", overflow: "hidden" },
          { transform: "none", width: cuoi.width + "px", height: cuoi.height + "px", overflow: "hidden" }
        ], { duration: 750, easing: "cubic-bezier(.3,.9,.3,1)" });
      }
      setTimeout(function () {
        tiengChuong();
        if (nhe) { laThu.querySelectorAll(".hien-dan").forEach(function (el) { el.classList.add("ro"); }); laThu.classList.add("viet", "viet-xong"); }
        else vietThu();
      }, nhe ? 0 : 650);
    }, 1900);
  }
  phongBi.addEventListener("click", function (e) {
    if (!daMoThu) moThu();
    else if (e.target.closest(".thu")) hienHetThu();
  });

  /* ---------- Hiện dần khi kéo tới ---------- */
  var quanSat = new IntersectionObserver(function (muc) {
    muc.forEach(function (m) {
      var id = m.target.id;
      if (!m.isIntersecting) return;
      if (id === "thu") {
        phongBi.classList.add("hien");
      } else if (id === "ket" && !m.target.dataset.daBan) {
        m.target.dataset.daBan = "1"; phaoKetThuc();
      }
      quanSat.unobserve(m.target);
    });
  }, { threshold: 0.3 });
  ["#thu", "#ket"].forEach(function (s) { quanSat.observe($(s)); });

  /* Màn pháo hoa cuối: dồn dập rồi kết bằng ba trái tim */
  var dangDien = false;
  function phaoKetThuc() {
    if (dangDien) return;
    dangDien = true;
    var lich = [[0, "cuc"], [280, "vong"], [560, "lieu"], [900, "lach"], [1200, "hai"], [1450, "lieu"], [1750, "vong"],
      [2050, "lach"], [2300, "cuc"], [2550, "hai"], [2800, "lieu"], [3050, "lach"]];
    lich.forEach(function (l) { setTimeout(function () { banKieu(l[1]); }, l[0]); });
    setTimeout(function () {
      var to = Math.min(1, W / 900) * 0.9 + 0.1, hang = W < 600 ? [[0.5, 0.2], [0.27, 0.46], [0.73, 0.46]] : [[0.22, 0.32], [0.5, 0.24], [0.78, 0.32]];
      hang.forEach(function (v, k) { setTimeout(function () { banKieu("tim", W * v[0], H * v[1], W < 600 ? 0.5 : to); }, k * 160); });
    }, 3700);
    setTimeout(function () { giayHaiBen(); tiengChuong(); rung([20, 60, 20, 60, 40]); dangDien = false; }, 4900);
  }
  $("#ban-lai").addEventListener("click", function () { if (!nhacBat && !am) batNhac(); phaoKetThuc(); });
})();

