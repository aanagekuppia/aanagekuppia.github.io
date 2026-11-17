/* ============================================================
   loader.js  -  plays ONE full rotation of both logos
   (appear -> play -> disappear), preloads the heavy assets in the
   background, then opens the site. A Skip button appears after 2.5 s.
   ============================================================ */
(function () {
  "use strict";
  var DEST = "index.html";
  var MAX_MS = 34000;          // never wait longer than this
  var SKIP_AFTER = 2500;       // show the Skip button after this long
  var EST_MS = 21000;          // rough length of a full rotation, for the progress bar
  var NO_LOGO_MS = 5000;       // if the logo scripts never start, don't hang

  var PRELOAD_ASSETS = [
    "assets/admin/admin.webp", "assets/admin/cat01.webp", "assets/admin/cat02.webp", "assets/admin/cat.gif",
    "assets/carousal/img01.webp", "assets/carousal/img02.webp", "assets/carousal/img03.webp",
    "assets/troll/01.webp", "assets/troll/02.webp", "assets/troll/03.webp", "assets/troll/04.webp", "assets/troll/05.webp", "assets/troll/06.webp",
    "assets/aud/flush.mp3", "assets/aud/01.mp3", "assets/aud/02.mp3", "assets/aud/03.mp3", "assets/aud/04.mp3", "assets/aud/05.mp3", "assets/aud/06.mp3",
    "assets/aud/07.mp3", "assets/aud/08.mp3", "assets/aud/09.mp3", "assets/aud/10.mp3", "assets/aud/11.mp3",
    "assets/aud/a.mp3", "assets/aud/b.mp3", "assets/aud/c.mp3", "assets/aud/d.mp3", "assets/aud/e.mp3", "assets/aud/f.mp3"
  ];

  var loader = document.getElementById("loader"), bar = document.getElementById("progressBar"),
      barWrap = document.getElementById("progressWrap"), tag = document.getElementById("taglineWrap"),
      skip = document.getElementById("skipBtn"), zone = document.getElementById("preload-zone"),
      aq = document.getElementById("aqLogo"), ds = document.getElementById("dsLogo");
  if (!loader || !bar) { location.replace(DEST); return; }

  var finished = false, t0 = Date.now(), aqDone = false, dsDone = false;

  // the loader counts as "seen" for this browser session (same idea as the old PHP session)
  function markSeen() {
    try { document.cookie = "aana_loaded=1; path=/; SameSite=Lax"; } catch (e) {}
  }
  markSeen();

  function finish() {
    if (finished) return; finished = true;
    markSeen();
    // tell the home-page logos the intro already played, so they show instantly
    try { sessionStorage.setItem("aq-once:home", "1"); sessionStorage.setItem("dsvb-once:home-dsvb", "1"); } catch (e) {}
    bar.style.transition = "width .45s ease"; bar.style.width = "100%";
    setTimeout(function () {
      loader.classList.add("fade-out");
      setTimeout(function () { location.replace(DEST); }, 700);
    }, 300);
  }
  function check() { if (aqDone && dsDone) finish(); }

  // a logo has done "one full rotation" once it went through disappearing ("rev") and reached "wait"/"play" again
  function watch(el, onDone) {
    if (!el) { onDone(); return; }
    var sawRev = false, fired = false;
    function look() {
      if (fired) return;
      var st = el.getAttribute("data-stage");
      if (st === "rev") sawRev = true;
      else if (sawRev && (st === "wait" || st === "play")) { fired = true; onDone(); }
    }
    try { new MutationObserver(look).observe(el, { attributes: true, attributeFilter: ["data-stage"] }); } catch (e) {}
    look();
  }
  watch(aq, function () { aqDone = true; check(); });
  watch(ds, function () { dsDone = true; check(); });

  // visuals
  barWrap.classList.add("show");
  requestAnimationFrame(function () { requestAnimationFrame(function () {
    bar.style.transition = "width " + EST_MS + "ms linear"; bar.style.width = "92%";
  }); });
  setTimeout(function () { if (tag) tag.classList.add("show"); }, 1500);
  setTimeout(function () { if (skip) skip.classList.add("show"); }, SKIP_AFTER);
  if (skip) skip.addEventListener("click", finish);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" || e.key === "Enter") finish(); });

  // safety nets
  setTimeout(function () {
    var ok = window.customElements && customElements.get("aquinas-logo-loop") && customElements.get("dsvb-logo-loop");
    if (!ok) finish();                     // logo scripts blocked or too old a browser: don't hang
  }, NO_LOGO_MS);
  setTimeout(finish, MAX_MS);

  // preload the heavy media quietly while the logos play
  var AUDIO = { mp3: 1, ogg: 1, wav: 1, m4a: 1 };
  setTimeout(function () {
    PRELOAD_ASSETS.forEach(function (src) {
      try {
        var ext = src.split(".").pop().toLowerCase(), n;
        if (AUDIO[ext]) { n = document.createElement("audio"); n.preload = "auto"; n.src = src; }
        else { n = new Image(); n.src = src; }
        zone && zone.appendChild(n);
      } catch (e) {}
    });
  }, 800);
})();
