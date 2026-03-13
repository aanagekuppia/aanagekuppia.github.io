/* ════════════════════════════════════════════════════════════
   js/loader.js  —  loader animation & redirect
════════════════════════════════════════════════════════════ */

/* ── CONFIG ─────────────────────────────────────────────── */
const REDIRECT_TO   = 'index.php';
const TOTAL_MS      = 4000;   // total loader duration after GIF is ready (ms)
const LETTER_START  = 800;    // first letter starts at 0.8 s
const LETTER_GAP    = 600;    // gap between each letter (ms)
const SHIMMER_AFTER = 500;    // delay before shimmer after last letter
const TAGLINE_AT    = 2700;   // when tagline fades in (ms)
const GIF_TIMEOUT   = 3000;   // max wait for GIF before starting anyway (ms)

const GIF_SRC = 'assets/admin/loader.gif';

/* ── PRELOAD ASSETS ─────────────────────────────────────── */
const PRELOAD_ASSETS = [
  'assets/admin/loader.gif',
  'assets/admin/admin.webp',
  'assets/admin/aquinas.png',
  'assets/admin/cat01.webp',
  'assets/admin/cat02.webp',
  'assets/admin/cat.gif',
  'assets/carousal/img01.webp',
  'assets/carousal/img02.webp',
  'assets/carousal/img03.webp',
  'assets/aud/flush.mp3',
  'assets/aud/01.mp3',
  'assets/troll/01.webp',
  'assets/aud/a.mp3',
  'assets/aud/02.mp3',
  'assets/troll/02.webp',
  'assets/aud/b.mp3',
  'assets/aud/03.mp3',
  'assets/troll/03.webp',
  'assets/aud/c.mp3',
  'assets/aud/04.mp3',
  'assets/troll/04.webp',
  'assets/aud/d.mp3',
  'assets/aud/05.mp3',
  'assets/troll/05.webp',
  'assets/aud/e.mp3',
  'assets/aud/06.mp3',
  'assets/troll/06.webp',
  'assets/aud/f.mp3',
  'assets/aud/07.mp3',
  'assets/aud/08.mp3',
  'assets/aud/09.mp3',
  'assets/aud/10.mp3',
  'assets/aud/11.mp3',
  'assets/aud/11.mp3',
  'music/song01.mp3',
  'music/vid01.mp4'
];

/* ── ELEMENT REFS ───────────────────────────────────────── */
const letters     = document.querySelectorAll('.dsvb-letter');
const taglineWrap = document.getElementById('taglineWrap');
const bar         = document.getElementById('progressBar');
const barWrap     = document.getElementById('progressWrap');
const loader      = document.getElementById('loader');
const gifEl       = document.getElementById('loaderGif');
const preloadZ    = document.getElementById('preload-zone');

if (!loader || !bar || !barWrap) {
  window.location.replace(REDIRECT_TO);
  throw new Error('Loader elements missing.');
}

/* ════════════════════════════════════════════════════════════
   CORE: wait for the GIF to fully load before starting the
   animation sequence, so frame 1 is always shown first.
   Falls back after GIF_TIMEOUT ms in case the asset is slow.
════════════════════════════════════════════════════════════ */
function startSequence() {
  /* Show GIF */
  if (gifEl) gifEl.classList.add('ready');

  /* Progress bar */
  barWrap.classList.add('show');
  bar.style.transition = `width ${TOTAL_MS}ms linear`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bar.style.width = '100%';
    });
  });

  /* Letter stagger */
  letters.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('show');
      if (i === letters.length - 1) {
        setTimeout(() => {
          letters.forEach(l => l.classList.add('shimmer'));
        }, SHIMMER_AFTER);
      }
    }, LETTER_START + i * LETTER_GAP);
  });

  /* Tagline */
  setTimeout(() => {
    if (taglineWrap) taglineWrap.classList.add('show');
  }, TAGLINE_AT);

  /* Redirect */
  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => window.location.replace(REDIRECT_TO), 700);
  }, TOTAL_MS);
}

/* ── LOAD THE GIF ───────────────────────────────────────── */
if (gifEl) {
  let started = false;

  const fallbackTimer = setTimeout(() => {
    /* GIF took too long — start anyway */
    if (!started) { started = true; startSequence(); }
  }, GIF_TIMEOUT);

  const preloadImg = new Image();

  preloadImg.onload = function () {
    if (started) return;
    started = true;
    clearTimeout(fallbackTimer);
    /* Set src on the visible <img> only after the data is ready */
    gifEl.src = GIF_SRC;
    /* One rAF so the browser commits the new src before we reveal */
    requestAnimationFrame(() => startSequence());
  };

  preloadImg.onerror = function () {
    if (started) return;
    started = true;
    clearTimeout(fallbackTimer);
    /* GIF failed to load — just run without it */
    startSequence();
  };

  /* Setting src last triggers the fetch (preload link in <head> warms the cache) */
  preloadImg.src = GIF_SRC;
} else {
  startSequence();
}

/* ── SILENT ASSET PRELOAD ───────────────────────────────── */
const AUDIO_EXTS = new Set(['mp3', 'ogg', 'wav', 'm4a']);

PRELOAD_ASSETS.forEach(src => {
  try {
    const ext = src.split('.').pop().toLowerCase();
    if (AUDIO_EXTS.has(ext)) {
      const a = document.createElement('audio');
      a.preload = 'auto';
      a.src = src;
      if (preloadZ) preloadZ.appendChild(a);
    } else {
      const img = new Image();
      img.src = src;
      if (preloadZ) preloadZ.appendChild(img);
    }
  } catch(e) { /* silently ignore */ }
});
