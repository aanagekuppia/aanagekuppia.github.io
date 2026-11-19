/* ============================================================
   layout.js  -  replaces includes.php. Put it as the FIRST thing
   inside <body>. It writes the header now; each page then calls
   DSVBLayout.bottom() for the footer + pop-ups. Editable bits (WhatsApp number, footer
   text, extra footer links) come from the admin panel via Supabase.
   ============================================================ */
(function () {
  "use strict";
  var TOP = "<header><button onclick=\"openAdminModal()\"class=\"hdr-avatar-btn\"title=\"About ආනා\"><picture><source srcset=\"assets/admin/admin.webp\"type=\"image/webp\"><img alt=\"ආනා\"src=\"assets/admin/admin.jpg\"class=\"hdr-avatar\"height=\"38\"onerror=\"this.outerHTML='<div class=&#34;hdr-avatar-fb&#34;>🎓</div>'\"width=\"38\"></picture></button><div class=\"hdr-center\"><div class=\"hdr-titles\"><div class=\"hdr-title\"><a class=\"hdr-title-link\"href=\"loader\"id=\"hdrTitleLink\"><span class=\"hdr-sinhala\">ආනාගේ</span> <span class=\"hdr-kuppia\">Kuppia</span></a><div class=\"bulb-toggle\"onclick=\"toggleTheme()\"title=\"Toggle dark/light\"><div class=\"bulb-cord\"></div><svg class=\"bulb-icon\"fill=\"none\"style=\"transform:rotate(180deg)\"viewBox=\"0 0 40 52\"xmlns=\"http://www.w3.org/2000/svg\"><ellipse cx=\"20\"cy=\"20\"fill=\"#fffde0\"rx=\"14\"ry=\"14\"opacity=\".92\"/><ellipse cx=\"20\"cy=\"20\"fill=\"#fff176\"rx=\"10\"ry=\"10\"/><rect fill=\"#c8b97a\"height=\"3\"rx=\"1.5\"width=\"12\"x=\"14\"y=\"33\"/><rect fill=\"#b0a060\"height=\"2.5\"rx=\"1.25\"width=\"11\"x=\"14.5\"y=\"36.5\"/><rect fill=\"#9a8a50\"height=\"2.5\"rx=\"1.25\"width=\"10\"x=\"15\"y=\"39.5\"/><path d=\"M17 26 Q20 22 23 26\"fill=\"none\"stroke=\"#ff9800\"stroke-width=\"1.3\"/><ellipse cx=\"15\"cy=\"15\"fill=\"white\"rx=\"3\"ry=\"4\"opacity=\".3\"transform=\"rotate(-20 15 15)\"/></svg></div></div><div class=\"hdr-stretch\"id=\"hdrStretch\"><span class=\"hdr-stretch-txt\"id=\"hdrStretchTxt\"></span></div><span class=\"hdr-sub\">Himan Thathuwa Kethala Hiruwa</span></div></div><a class=\"home-btn\"href=\"./\"><i class=\"fa-solid fa-house\"></i> <span>Home</span></a></header>";
  var BTM = "<footer><div class=\"ftr-copy\">©<span id=\"ftrYear\"></span> <span id=\"ftrCopy\">All Rights Reserved</span><span class=\"ftr-links\" id=\"ftrLinks\"></span></div><div class=\"ftr-dev\"><span class=\"ftr-heart\" aria-hidden=\"true\">❤️</span><span id=\"ftrDevLabel\">Developed by</span><a class=\"ftr-name\" id=\"ftrLink\" href=\"https://venurakabojithananda.github.io/\" rel=\"noopener\" target=\"_blank\" aria-label=\"DSVB\"><dsvb-logo-footer-loop size=\"88\" fps=\"30\" disappear-at=\"12\" cooldown=\"1\" align=\"center\"></dsvb-logo-footer-loop></a></div></footer><div class=\"modal-overlay\"id=\"adminModal\"onclick=\"maybeCloseAdmin(event)\"><div class=\"modal-box\"><button onclick=\"closeAdmin()\"class=\"modal-close\"><i class=\"fa-solid fa-xmark\"></i></button><div class=\"modal-avatar-link\"onclick=\"openAdminLb()\"><div class=\"modal-avatar-wrap\"><picture><source srcset=\"assets/admin/admin.webp\"type=\"image/webp\"><img alt=\"ආනා\"src=\"assets/admin/admin.jpg\"class=\"modal-avatar\"height=\"140\"onerror='this.style.opacity=\"0\"'width=\"140\"></picture></div></div><div class=\"modal-name\" id=\"admName\">ආනා</div><div class=\"modal-role\" id=\"admRole\">B.Ed Hons English | Dip. English Lang & Lit.</div><a class=\"wa-btn\"id=\"waBtn\"href=\"https://wa.me/94724600493\"rel=\"noopener\"target=\"_blank\"><i class=\"fa-brands fa-whatsapp\"></i> Contact ආනා</a></div></div><div class=\"lightbox\"id=\"lightbox\"onclick=\"maybeCloseLb(event)\"><button onclick=\"closeLb()\"class=\"lb-close\"><i class=\"fa-solid fa-xmark\"></i></button> <button onclick=\"lbNav(-1)\"class=\"lb-arrow lb-hidden lb-prev\"id=\"lbPrev\"><i class=\"fa-solid fa-chevron-left\"></i></button> <button onclick=\"lbNav(1)\"class=\"lb-arrow lb-hidden lb-next\"id=\"lbNext\"><i class=\"fa-solid fa-chevron-right\"></i></button><div class=\"lb-media-wrap\"id=\"lbMediaWrap\"><div id=\"lbMedia\"></div><div class=\"lb-actions\"id=\"lbActions\"><a class=\"lb-dl\"id=\"lbDl\"download><i class=\"fa-solid fa-download\"></i> Download </a><span class=\"lb-cap\"id=\"lbCap\"></span></div></div></div><div class=\"troll-ovl\"id=\"trollOvl\"onclick=\"closeTroll()\"></div><div class=\"troll-box\"id=\"trollBox\"><div class=\"t-img-wrap\"id=\"tImgWrap\"><img alt=\"\"src=\"\"class=\"t-img\"id=\"tImg\"></div><div class=\"t-txt\"id=\"tTxt\"></div><button onclick=\"closeTroll()\"class=\"t-close\">OK OK I get it 😭</button></div><button onclick='window.scrollTo({top:0,behavior:\"smooth\"})'id=\"scrollTop\"title=\"Back to top\"><i class=\"fa-solid fa-chevron-up\"></i></button><div id=\"cat-wrap\"><div class=\"cat-speech\"id=\"catSpeech\"></div><div class=\"cat-btn-outer\"><div class=\"cat-zzz-wrap\"id=\"catZzzWrap\"><span class=\"z\">z</span><span class=\"z\">z</span><span class=\"z\">Z</span></div><button onclick=\"catClick()\"id=\"cat-btn\"title=\"Pspsps...\"><div class=\"cat-img-wrap\"><img alt=\"🐱\"src=\"assets/admin/cat01.webp\"id=\"catImg\"onerror='this.onerror=null;this.src=\"assets/admin/cat01.jpg\"'> <img alt=\"\"src=\"assets/admin/cat.gif\"id=\"catGif\"></div></button></div><a class=\"ai-btn\" id=\"ai-btn\" href=\"ai/\" title=\"Study with AI\" aria-label=\"Study with AI\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9z\" fill=\"currentColor\"/><path d=\"M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z\" fill=\"currentColor\" opacity=\".85\"/></svg><b>AI</b><span class=\"ai-fx\" aria-hidden=\"true\"><i>✦</i><i>?</i><i>A+</i><i>π</i><i>✧</i></span></a></div>";
  var DEFAULTS = {
    whatsapp_number: "94724600493",
    whatsapp_message: "\u0d86\u0db1\u0dcf \u0d85\u0dba\u0dd2\u0dba\u0dda.. \u0db4\u0ddc\u0da9\u0dd2 \u0dc3\u0dd3\u0db1\u0dca \u0d91\u0d9a\u0d9a\u0dca \u0db6\u0d82 support \u0d91\u0d9a\u0d9a\u0dca \u0daf\u0dd9\u0db1\u0dca\u0db1\u0d9a\u0ddd..",
    admin_name: "\u0d86\u0db1\u0dcf", admin_role: "B.Ed Hons English | Dip. English Lang & Lit.",
    footer_copy: "All Rights Reserved", footer_dev_label: "Developed by", footer_url: "https://venurakabojithananda.github.io/",
    footer_links: []
  };

  // Pages inside a sub-folder (the admin) set window.DSVB_BASE = "../" so shared paths still resolve.
  var BASE = window.DSVB_BASE || "";
  function fix(h) {
    if (!BASE) return h;
    return h.replace(/(["'])assets\//g, "$1" + BASE + "assets/").replace(/href="ai\/"/g, 'href="' + BASE + 'ai/"')
            .replace(/href="loader"/g, 'href="' + BASE + 'loader"').replace(/href="\.\/"/g, 'href="' + BASE + '"');
  }
  TOP = fix(TOP); BTM = fix(BTM);
  if (window.DSVB_SUB) TOP = TOP.replace("Himan Thathuwa Kethala Hiruwa", String(window.DSVB_SUB).replace(/</g, "&lt;"));

  // ---- the footer logo script is loaded only when the footer is added to the page
  function footerLogo() {
    if (document.querySelector('script[data-dsvb-footer-logo]')) return;
    var s = document.createElement("script"); s.src = BASE + "assets/logos/dsvb-logo-footer-loop.js"; s.defer = true;
    s.setAttribute("data-dsvb-footer-logo", ""); document.head.appendChild(s);
  }

  // ---- header (now). The admin sets window.DSVB_MANUAL and calls DSVBLayout.top() after login.
  function top() { if (!document.querySelector("body > header")) document.body.insertAdjacentHTML("afterbegin", TOP); }
  if (!window.DSVB_MANUAL) top();

  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function safeUrl(u) { u = String(u || "").trim(); return /^(https?:|mailto:|tel:)/i.test(u) ? u : "#"; }
  function $(id) { return document.getElementById(id); }

  function apply(st) {
    st = Object.assign({}, DEFAULTS, st || {});
    var num = String(st.whatsapp_number || "").replace(/[^0-9]/g, "");
    var wa = $("waBtn"); if (wa && num) wa.href = "https://wa.me/" + num + "?text=" + encodeURIComponent(st.whatsapp_message || "");
    if ($("admName")) $("admName").textContent = st.admin_name;
    if ($("admRole")) $("admRole").textContent = st.admin_role;
    if ($("ftrYear")) $("ftrYear").textContent = new Date().getFullYear();
    if ($("ftrCopy")) $("ftrCopy").textContent = st.footer_copy;
    if ($("ftrDevLabel")) $("ftrDevLabel").textContent = st.footer_dev_label;
    if ($("ftrLink")) $("ftrLink").href = safeUrl(st.footer_url);
    var box = $("ftrLinks");
    if (box) {
      var links = Array.isArray(st.footer_links) ? st.footer_links : [];
      box.innerHTML = links.filter(function (l) { return l && l.label && l.url; }).map(function (l) {
        return '<a href="' + esc(safeUrl(l.url)) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
      }).join('<span class="ftr-dot">\u00b7</span>');
      box.style.display = box.innerHTML ? "" : "none";
    }
  }

  // ---- footer + pop-ups (after the page body exists)
  function bottom() {
    if (document.getElementById("adminModal")) return;
    document.body.insertAdjacentHTML("beforeend", BTM);
    footerLogo();
    apply(window.DSVB && DSVB.cached("settings"));                       // instant, from last visit
    if (window.DSVB && DSVB.ready) {
      DSVB.load("settings").then(function (st) { DSVB.store("settings", st); apply(st); }).catch(function () {});
    }
  }
  // Pages call DSVBLayout.bottom() exactly where the old PHP include used to be (after </main>).
  window.DSVBLayout = { top: top, bottom: bottom };
})();
