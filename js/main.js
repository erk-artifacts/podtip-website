// ============================================================
// ページの動きを書いたファイル（この中を書き換える必要は通常ありません）
//
// やっていることは 3 つ:
//   (1) js/config.js に書かれた URL を、ページのボタンに組み込む
//       （URL がまだ未設定なら、ボタンを「準備中」にして安全に保つ）
//   (2) スクリーンショット画像がまだ無いとき、「準備中」の枠を表示する
//   (3) ヒーローの再生画面デモ（シークバーが進み、♡ で応援のピンが刺さる）
// ============================================================

(function () {
  "use strict";

  // ---------- (1) URL の組み込み ----------

  // data-url="feedback" などの属性が付いたリンクを全部探す
  var linkMap = {
    feedback: (typeof SITE_URLS !== "undefined" && SITE_URLS.feedbackFormUrl) || "",
    contact: (typeof SITE_URLS !== "undefined" && SITE_URLS.contactEmail) || "",
  };

  var links = document.querySelectorAll("[data-url]");
  links.forEach(function (a) {
    var kind = a.getAttribute("data-url");
    var url = linkMap[kind] || "";

    // お問い合わせ先はメールアドレスなので、リンクは mailto: にする
    if (kind === "contact" && url && url.indexOf("PASTE_") !== 0) {
      url = "mailto:" + url;
    }

    // 「PASTE_」で始まる = まだ未設定。リンクとして踏めない状態にする
    if (!url || url.indexOf("PASTE_") === 0) {
      a.classList.add("is-pending");
      a.setAttribute("aria-disabled", "true");
      a.tabIndex = -1;
      a.textContent = a.textContent + "（準備中）";
      // 念のためクリックしても何も起きないようにしておく
      a.addEventListener("click", function (e) { e.preventDefault(); });
      console.warn("[PodTip] このボタンの URL が未設定です。js/config.js を確認してください:", a);
      return;
    }

    a.href = url;
  });

  // ---------- (2) スクリーンショットの「準備中」表示 ----------

  // 画像の読み込みに失敗したら、親の figure に印を付ける
  // （CSS がその印を見て「準備中」の枠を表示する）
  var shots = document.querySelectorAll("img.screenshot");
  shots.forEach(function (img) {
    img.addEventListener("error", function () {
      var fig = img.closest("figure");
      if (fig) fig.classList.add("is-missing");
    });
  });

  // ---------- (3) 再生画面のデモ ----------

  var fill = document.getElementById("seekFill");
  var bar = document.getElementById("seekBar");
  var timeNow = document.getElementById("timeNow");
  var tipButton = document.getElementById("tipDemo");
  var toast = document.getElementById("playerToast");

  if (!fill || !bar || !timeNow || !tipButton || !toast) return;

  // 架空の回: 32 分（1,920 秒）のエピソードを、12:34（754 秒）から聴いている設定
  var TOTAL = 1920;
  var elapsed = 754;
  var toastTimer = null;
  var pinCount = 0;

  // 「12:34」のような表示に整える
  function format(sec) {
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  // 「設定＞アクセシビリティ」等で動きを減らす設定の人には、バーを動かさない
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function render() {
    var pct = Math.min(100, (elapsed / TOTAL) * 100);
    fill.style.width = pct + "%";
    timeNow.textContent = format(elapsed);
  }

  if (!reduceMotion) {
    // 0.25 秒ごとに、再生時間が 0.5 秒ぶん進む（ほどよい速さのデモ）
    window.setInterval(function () {
      elapsed += 0.5;
      if (elapsed >= TOTAL) elapsed = 0; // 回が終わったら最初に戻る
      render();
    }, 250);
  }
  render();

  // ♡ ボタンを押したとき: いまの位置にピンを刺して「届きました」を表示
  tipButton.addEventListener("click", function () {
    var pct = Math.min(100, (elapsed / TOTAL) * 100);

    // ピン（応援が届いた位置の目印）を作る
    var pin = document.createElement("span");
    pin.className = "seek-pin";
    pin.style.left = pct + "%";
    pin.title = format(elapsed) + " の応援";
    bar.appendChild(pin);
    pinCount += 1;

    // ピンが多くなりすぎたら、古いものから消す（見た目を保つため）
    var pins = bar.querySelectorAll(".seek-pin");
    if (pins.length > 8) bar.removeChild(pins[0]);

    // ボタンを少し弾ませる
    tipButton.classList.remove("bounce");
    void tipButton.offsetWidth; // アニメーションを最初からやり直す古典的な方法
    tipButton.classList.add("bounce");

    // 「届きました」の表示（2.5 秒で消える）
    clearTimeout(toastTimer);
    toast.textContent = "「ありがとう」が " + format(elapsed) + " の瞬間に届きました（デモです）";
    toast.classList.add("is-shown");
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-shown");
    }, 2500);
  });

  // 初期状態でも、過去に応援が届いた様子のピンを 2 本刺しておく
  [0.08, 0.39].forEach(function (p) {
    var pin = document.createElement("span");
    pin.className = "seek-pin";
    pin.style.left = (p * 100) + "%";
    pin.title = format(TOTAL * p) + " の応援";
    bar.appendChild(pin);
    pinCount += 1;
  });
})();
