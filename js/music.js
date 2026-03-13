/* ══════════════════════════════════════════════════════════════════
   music.js  —  ආනාගේ Kuppia  |  js/music.js

   ╔════════════════════════════════════════════════════════════╗
   ║                  ★  SONG MANAGEMENT  ★                    ║
   ║  All songs + lyrics live in the SONGS object below.        ║
   ║  Files go in /music/  e.g.  music/song03.mp3               ║
   ║                                                            ║
   ║  ADD A SONG:                                               ║
   ║   {                                                        ║
   ║     file:   'music/song03.mp3',                            ║
   ║     name:   'Song Title',                                  ║
   ║     desc:   'Mood or note 🎵',                             ║
   ║     lyrics: [                                              ║
   ║       { time: 0,    text: 'First line'  },                 ║
   ║       { time: 4.5,  text: 'Next line'   },                 ║
   ║       { time: 9.2,  text: 'ගීත පේළිය'  },                 ║
   ║     ]                                                      ║
   ║   },                                                       ║
   ║  time = seconds from start. Use VLC to find timestamps.    ║
   ║  No lyrics? Omit the lyrics key entirely.                  ║
   ╚════════════════════════════════════════════════════════════╝
══════════════════════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════
   ★ SONGS — edit here
════════════════════════════════ */
const SONGS = {
  sinhala: [
    {
      file: 'music/song01.mp3',
      name: 'කිරුළ මුතු ලිහී..',
      desc: 'Janaka Wickramasinghe',
      lyrics: [
        { time: 57.5,  text: 'කිරුළ මුතු ලිහී සර සර හඬින් වැගිරෙනා..' },
        { time: 62.5,  text: 'සුළු මැදුම් දෙතිත පැටලී ගිගිරි වැලපෙනා..' },
        { time: 68.0,  text: 'නටනවා නොවෙයි වැහැරුණු දෙපා වෙව්ලනා..' },
        { time: 72.0,  text: 'තන තන තාන තම් දෙනා..' },
        { time: 75.0,  text: 'තන තන තාන තම් දෙනා..' },
        { time: 108.5, text: 'දිලිසෙනා සේම කරලිය දිලෙන්නේ නැති..' },
        { time: 114.0, text: 'වන්නමක් සේම සුමිහිරි තානමක් නැති..' },
        { time: 118.2, text: 'සකියනි ගිරෙන් ගිරට පැන යන්නට ජීවිතෙන් බැරි..' },
        { time: 122.8, text: 'සකියනි ගිරෙන් ගිරට පැන යන්නට ජීවිතෙන් බැරි..' },
        { time: 130.0, text: 'කිරුළ මුතු ලිහී සර සර හඬින් වැගිරෙනා..' },
        { time: 134.5, text: 'සුළු මැදුම් දෙතිත පැටලී ගිගිරි වැලපෙනා..' },
        { time: 139.5, text: 'නටනවා නොවෙයි වැහැරුණු දෙපා වෙව්ලනා..' },
        { time: 144.5, text: 'තන තන තාන තම් දෙනා..' },
        { time: 147.0, text: 'තන තන තාන තම් දෙනා..' },
        { time: 181.0, text: 'රඟ බිමෙන් බහින විට ගෙයි සන්තකව ඇති..' },
        { time: 186.0, text: 'නළල් පට මාල හත් පට සින්න වී ඇති..' },
        { time: 189.8, text: 'සකියණි රිදී කාසි සොලවන්නට බෙර පදය මදි..' },
        { time: 195.2, text: 'සකියණි රිදී කාසි සොලවන්නට බෙර පදය මදි..' },
        { time: 201.2, text: 'කිරුළ මුතු ලිහී සර සර හඬින් වැගිරෙනා..' },
        { time: 206.0, text: 'සුළු මැදුම් දෙතිත පැටලී ගිගිරි වැලපෙනා..' },
        { time: 211.2, text: 'නටනවා නොවෙයි වැහැරුණු දෙපා වෙව්ලනා..' },
        { time: 223.1, text: 'තන තන තාන තම් දෙනා..' },
      ]
    },
    {
      file:  'music/song02.mp3',
      name:  'කෝටු කෑලි සොයාලා..',
      desc:  'Mohideen Beg',
      lyrics: [
        { time: 3,  text: 'Lyrics තාම දාලා නෑ' },
      ]
    },
    {
      file:  'music/song03.mp3',
      name:  'යමු සෙල්ල කතරගම්..',
      desc:  'Karunarathna Divulgane',
      lyrics: [
        { time: 3,  text: 'Lyrics තාම දාලා නෑ' },
      ]
    },
    {
      file:  'music/song04.mp3',
      name:  'ආලවන්ත නෙත් විදා..',
      desc:  'Dayasiri Jayasekara',
      lyrics: [
        { time: 3,  text: 'Lyrics තාම දාලා නෑ' },
      ]
    },
    {
      file:  'music/song05.mp3',
      name:  'බාලිකාවියන්..',
      desc:  'Janaka Wickramasingha',
      lyrics: [
        { time: 3,  text: 'Lyrics තාම දාලා නෑ' },
      ]
    },
    {
      file:  'music/song06.mp3',
      name:  'දීපාවලී දාට..',
      desc:  'Asanga Priyamantha Peiris',
      lyrics: [
        { time: 3,  text: 'Lyrics තාම දාලා නෑ' },
      ]
    },
    {
      file:  'music/song07.mp3',
      name:  'මුව මදහාසේ..',
      desc:  'Sarath Dassanayake',
      lyrics: [
        { time: 3,  text: 'Lyrics තාම දාලා නෑ' },
      ]
    },
    {
      file:  'music/song08.mp3',
      name:  'ගලන ගලන දොළ පාරේ..',
      desc:  'Nirmala Ranatunga',
      lyrics: [
        { time: 3,  text: 'Lyrics තාම දාලා නෑ' },
      ]
    }
    /* ── ADD SINHALA SONGS HERE ──────────────
    {
      file:  'music/song_sl01.mp3',
      name:  'ගීතයේ නම',
      desc:  'කෙටි විස්තරය 🎶',
      lyrics: [ { time: 0, text: 'ගීත පේළිය' } ]
    },
    ─────────────────────────────────────────── */
  ],
  foreign: [
    /* ── ADD FOREIGN SONGS HERE ───────────────
    {
      file:  'music/song03.mp3',
      name:  'Title',
      desc:  'Mood 🎵',
      lyrics: [ { time: 0, text: 'Line' } ]
    },
    ─────────────────────────────────────────── */
    {
      file:  'music/en-song01.mp3',
      name:  'Woods',
      desc:  'Jupp Hauff',
      lyrics: [
        { time: 3,  text: 'Lyrics තාම දාලා නෑ' },
      ]
    },
    {
      file:  'music/en-song02.mp3',
      name:  'Премьера',
      desc:  'Adam Zhurek',
      lyrics: [
        { time: 3,  text: 'Lyrics තාම දාලා නෑ' },
      ]
    }
  ]
};

/* ════════════════════════════════
   CONSTANTS
════════════════════════════════ */
const IS_MOB = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
            || window.matchMedia('(max-width:768px)').matches;

const OUT_DUR  = 1400;   /* lyric fade-out ms */
const MAX_STAY = 2000;   /* lyric max visible ms */
const MIN_STAY = 380;    /* lyric min visible ms */

/* ════════════════════════════════
   LOCK SCROLL
════════════════════════════════ */
document.documentElement.classList.add('music-html');

/* ════════════════════════════════
   DOM REFS
════════════════════════════════ */
const bgVideo      = document.getElementById('bg-video');
const canvas       = document.getElementById('visualizer');
const ctx          = canvas.getContext('2d');
const audioEl      = document.getElementById('audio-player');
const lyricA       = document.getElementById('lyrics-a');
const lyricB       = document.getElementById('lyrics-b');
const playBtn      = document.getElementById('play-btn');
const playIcon     = document.getElementById('play-icon');
const playAurora   = document.getElementById('play-aurora');
const prevBtn      = document.getElementById('prev-btn');
const nextBtn      = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const progressWrap = document.getElementById('progress-wrap');
const timeCurrent  = document.getElementById('time-current');
const timeTotal    = document.getElementById('time-total');
const songNameEl   = document.getElementById('song-name');
const songDescEl   = document.getElementById('song-desc');
const songInfoEl   = document.getElementById('song-info');
const songDots     = document.getElementById('song-dots');
const playHint     = document.getElementById('play-hint');
const audioToast   = document.getElementById('audio-toast');

/* ══════════════════════════════════════════════════════════════
   VIDEO BACKGROUND
   ════════════════════════════════════════════════════════════
   Single-element, src-swap on ended. No crossfade complexity.

   KEY MOBILE OPTIMIZATIONS:
   1. Never call bgVideo.load() — setting .src is enough; calling
      load() explicitly flushes the decode pipeline which causes
      a brief stall on low-end hardware.
   2. On mobile, vid2 is only preloaded AFTER vid1 ends (not on
      first play) — avoids bandwidth contention with audio stream.
   3. The hidden preload element is removed from DOM as soon as
      canplaythrough fires — frees memory.
   4. play() errors are silently caught (autoplay policy, etc.)
      with a single retry on next user gesture.
══════════════════════════════════════════════════════════════ */
const VID1 = IS_MOB ? 'music/vid01m.mp4' : 'music/vid01.mp4';
const VID2 = IS_MOB ? 'music/vid02m.mp4' : 'music/vid02.mp4';

let vidCount  = 0;
let vid2Ready = false;

/* vid01 → vid01 → vid02 → vid01 → vid02 → … */
const getVidSrc = n => n < 2 ? VID1 : (n - 2) % 2 === 0 ? VID2 : VID1;

function bgPlay(src) {
  /* Do NOT call .load() — just set src and play.
     The browser starts buffering automatically when src changes. */
  bgVideo.src = src;
  bgVideo.play().catch(() => {});
}

function preloadVid2() {
  if (vid2Ready) return;
  vid2Ready = true;
  const t = document.createElement('video');
  t.muted   = true;
  t.preload = 'auto';
  t.src     = VID2;
  t.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;top:-9999px';
  document.body.appendChild(t);
  t.load();
  t.addEventListener('canplaythrough', () => {
    try { t.remove(); } catch (_) {}
  }, { once: true });
}

bgVideo.addEventListener('ended', () => {
  vidCount++;
  bgPlay(getVidSrc(vidCount));
  /* On mobile: preload vid2 only after vid1 finishes (vid1 ends at
     vidCount===1), not during audio loading. Avoids competing for
     the same mobile network connection as the audio stream. */
  if (IS_MOB && vidCount === 1) preloadVid2();
});

/* Desktop: kick off vid2 preload after first play event,
   before we need it, so the swap is seamless. */
if (!IS_MOB) {
  bgVideo.addEventListener('play', () => {
    if (vidCount === 1) preloadVid2();
  }, { once: true });
}

/* Tab return: resume video if stalled */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && bgVideo.paused) bgVideo.play().catch(() => {});
}, false);

/* Boot video — no .load() call needed here either */
bgVideo.src = VID1;
bgVideo.play().catch(() => {});

/* ════════════════════════════════
   CANVAS  —  pixel-perfect sync
════════════════════════════════ */
function syncCanvas() {
  const W = window.innerWidth, H = window.innerHeight;
  canvas.width  = W; canvas.height  = H;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
}
syncCanvas();

let _resizeRaf = null;
window.addEventListener('resize', () => {
  if (_resizeRaf) return;
  _resizeRaf = requestAnimationFrame(() => {
    _resizeRaf = null;
    syncCanvas();
    recomputeZones();
  });
}, { passive: true });
window.addEventListener('orientationchange',
  () => setTimeout(() => { syncCanvas(); recomputeZones(); }, 250), { passive: true });

/* roundRect polyfill — Safari < 15.4 */
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    const rd = Array.isArray(r) ? r[0] : (r || 0);
    this.beginPath();
    this.moveTo(x + rd, y);         this.lineTo(x + w - rd, y);
    this.arcTo(x + w, y,     x + w, y + rd,     rd);
    this.lineTo(x + w, y + h - rd);
    this.arcTo(x + w, y + h, x + w - rd, y + h, rd);
    this.lineTo(x + rd, y + h);
    this.arcTo(x, y + h,     x, y + h - rd,     rd);
    this.lineTo(x, y + rd);
    this.arcTo(x, y,         x + rd, y,          rd);
    this.closePath();
    return this;
  };
}

/* ══════════════════════════════════════════════════════════════
   VISUALIZER  —  three-zone bars (left / center / right)

   OPTIMIZATIONS:
   1. rAF loop is GATED — when not playing AND canvas is clear,
      the loop calls cancelAnimationFrame on itself and stops
      completely. It restarts only when playback begins.
      This eliminates ~60 wasted rAF callbacks/sec when idle.
   2. Mobile throttled to ~30fps (every 2nd frame).
   3. Zone geometry cached and only recomputed on resize.
   4. ctx.clearRect is guarded — only clears if canvas was drawn.
══════════════════════════════════════════════════════════════ */
let analyser, freqData, freqLen;
let isPlaying   = false;
let hueOffset   = 0;
let vizRafId    = null;   /* rAF handle — null means loop is stopped */
let vizDirty    = false;  /* true if canvas has pixels that need clearing */

const BAR_PX   = IS_MOB ?  7 :  10;
const SIDE_CAP = IS_MOB ? 130 : 240;
const MIN_CENT = IS_MOB ?   4 :   8;
let _W = 0, _sN = 0, _sBW = 0, _cN = 0, _cBW = 0;

function recomputeZones() {
  const W = canvas.width || window.innerWidth;
  let sideW = Math.min(SIDE_CAP, W * 0.40);
  if (W / 2 - sideW < MIN_CENT * BAR_PX) sideW = Math.max(0, W / 2 - MIN_CENT * BAR_PX);
  _sN  = Math.max(1, Math.floor(sideW / BAR_PX));
  _sBW = sideW / _sN;
  const centHW = W / 2 - _sN * _sBW;
  _cN  = Math.max(MIN_CENT, Math.floor(centHW / BAR_PX));
  _cBW = centHW / _cN;
  _W   = W;
}
recomputeZones();

function drawBar(x, y, w, h, h1, h2, baseY) {
  const g = ctx.createLinearGradient(x, y, x, baseY);
  g.addColorStop(0,    `hsla(${h1},92%,72%,.90)`);
  g.addColorStop(0.44, `hsla(${h2},80%,57%,.68)`);
  g.addColorStop(1,    `hsla(${(h1 + 55) % 360},55%,28%,.08)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, [Math.min(3.5, w * 0.42), Math.min(3.5, w * 0.42), 0, 0]);
  ctx.fill();
}

const VIZ_SKIP = IS_MOB ? 2 : 1;
let   vizFrame = 0;

function vizTick() {
  vizRafId = requestAnimationFrame(vizTick);
  if (++vizFrame % VIZ_SKIP !== 0) return;

  if (!analyser || !isPlaying) {
    /* Only clear if we actually drew something last iteration */
    if (vizDirty) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      vizDirty = false;
    }
    /* Stop the loop entirely when idle — no wasted GPU/CPU work */
    cancelAnimationFrame(vizRafId);
    vizRafId = null;
    return;
  }

  analyser.getByteFrequencyData(freqData);
  hueOffset = (hueOffset + 0.46) % 360;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  vizDirty = true;

  const W = canvas.width, H = canvas.height;
  const gap   = IS_MOB ? 1.5 : 2.0;
  const maxH  = H * (IS_MOB ? 0.60 : 0.72);
  const baseY = H;

  if (W !== _W) recomputeZones();
  const sN = _sN, sBW = _sBW, cN = _cN, cBW = _cBW;

  /* LEFT */
  for (let i = 0; i < sN; i++) {
    const val = freqData[Math.min(Math.floor(i * freqLen * 0.65 / sN), freqLen - 1)];
    if (val < 5) continue;
    const bh = val / 255 * maxH;
    drawBar(i * sBW + gap * 0.5, baseY - bh, sBW - gap, bh,
      (hueOffset + i / sN * 160) % 360,
      (hueOffset + i / sN * 160 + 55) % 360, baseY);
  }

  /* RIGHT */
  for (let i = 0; i < sN; i++) {
    const val = freqData[Math.min(Math.floor(i * freqLen * 0.65 / sN), freqLen - 1)];
    if (val < 5) continue;
    const bh = val / 255 * maxH;
    drawBar(W - (i + 1) * sBW + gap * 0.5, baseY - bh, sBW - gap, bh,
      (hueOffset + i / sN * 160) % 360,
      (hueOffset + i / sN * 160 + 55) % 360, baseY);
  }

  /* CENTER */
  for (let i = 0; i < cN; i++) {
    const val = freqData[Math.min(Math.floor(freqLen * 0.15 + i * freqLen * 0.55 / cN), freqLen - 1)];
    if (val < 5) continue;
    const bh = val / 255 * maxH;
    const h1 = (hueOffset + 80 + i / cN * 150) % 360;
    const h2 = (hueOffset + 80 + i / cN * 150 + 55) % 360;
    drawBar(W * 0.5 + i * cBW + gap * 0.5,       baseY - bh, cBW - gap, bh, h1, h2, baseY);
    drawBar(W * 0.5 - (i + 1) * cBW + gap * 0.5, baseY - bh, cBW - gap, bh, h1, h2, baseY);
  }
}

/* Start the viz loop — called only when playback begins */
function startViz() {
  if (vizRafId !== null) return; /* already running */
  vizFrame = 0;
  vizRafId = requestAnimationFrame(vizTick);
}

/* ════════════════════════════════
   WEB AUDIO  —  lazy init on first gesture
   createMediaElementSource bound permanently to <audio> —
   survives all src changes. Created only once.
════════════════════════════════ */
let audioCtx, srcNode, ctxReady = false;

function initAudioCtx() {
  if (ctxReady) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser  = audioCtx.createAnalyser();
    analyser.fftSize               = 256;
    analyser.smoothingTimeConstant = 0.80;
    freqLen  = analyser.frequencyBinCount;
    freqData = new Uint8Array(freqLen);
    srcNode  = audioCtx.createMediaElementSource(audioEl);
    srcNode.connect(analyser);
    analyser.connect(audioCtx.destination);
    ctxReady = true;
  } catch (e) { console.warn('AudioContext:', e); }
}

function resumeCtx() {
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
}

/* ════════════════════════════════
   AUDIO STALL WATCHDOG
   1500ms interval. Never calls pause().
   audioLastT fed by timeupdate listener — avoids drift.
════════════════════════════════ */
const STALL_S = 4;
const HARD_S  = 8;
let audioWatchId = null, audioLastT = -1, audioFreezeMs = 0;

audioEl.addEventListener('timeupdate', () => {
  if (isPlaying && !audioEl.paused) audioLastT = audioEl.currentTime;
}, { passive: true });

function startAudioWatchdog() {
  clearInterval(audioWatchId);
  audioFreezeMs = 0;
  audioLastT    = audioEl.currentTime;
  audioWatchId  = setInterval(() => {
    if (!isPlaying || !audioEl.duration || audioEl.ended) return;
    if (audioEl.paused) {
      resumeCtx(); audioEl.play().catch(() => {});
      audioLastT = -1; audioFreezeMs = 0; return;
    }
    const t = audioEl.currentTime;
    if (audioLastT >= 0 && t === audioLastT) {
      audioFreezeMs += 1500;
      if (audioFreezeMs >= STALL_S * 1000 && audioFreezeMs < HARD_S * 1000) {
        const nudge = Math.min(t + 0.15, audioEl.duration - 0.05);
        if (nudge > t) try { audioEl.currentTime = nudge; } catch (_) {}
      } else if (audioFreezeMs >= HARD_S * 1000) {
        audioFreezeMs = 0;
        resumeCtx(); audioEl.play().catch(() => {});
        showToast('⏳ Recovering…', 2000);
      }
    } else {
      audioFreezeMs = 0;
    }
  }, 1500);
}

function stopAudioWatchdog() {
  clearInterval(audioWatchId);
  audioWatchId = null; audioLastT = -1; audioFreezeMs = 0;
}

audioEl.setAttribute('x-webkit-airplay', 'allow');

/* ════════════════════════════════
   PAGE VISIBILITY  —  recover on tab return
   Also pauses/restarts viz loop to save battery when hidden.
════════════════════════════════ */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    /* Pause viz loop while tab is hidden — zero GPU/CPU waste */
    if (vizRafId !== null) {
      cancelAnimationFrame(vizRafId);
      vizRafId = null;
    }
  } else {
    resumeCtx();
    if (isPlaying && audioEl.paused && !audioEl.ended) audioEl.play().catch(() => {});
    if (!bgVideo.paused && bgVideo.src) bgVideo.play().catch(() => {});
    /* Restart viz if playing */
    if (isPlaying) startViz();
    /* Reset watchdog baseline — hidden gap must not count as stall */
    audioLastT = audioEl.currentTime; audioFreezeMs = 0;
  }
}, false);

/* ════════════════════════════════
   LYRICS ENGINE  —  A/B double-buffer
   lBuf XOR-flips between 0/1.
   OUT_DUR drives the CSS fade-out animation duration.
════════════════════════════════ */
const lyricEls = [lyricA, lyricB];
let lBuf = 0, lyricIdx = -1, lyricExit = null;

function clearLyricTimers() {
  if (lyricExit) { clearTimeout(lyricExit); lyricExit = null; }
}

function hideLyricEl(i) {
  const el = lyricEls[i];
  el.classList.remove('entering');
  el.style.setProperty('--out-dur', `${OUT_DUR}ms`);
  el.classList.add('leaving');
  el._lc = setTimeout(() => {
    el.classList.remove('leaving');
    el.textContent = '';
    el.style.opacity = '0';
  }, OUT_DUR + 40);
}

function showLyric(text, stayMs) {
  hideLyricEl(lBuf);
  lBuf ^= 1;
  const el = lyricEls[lBuf];
  if (el._lc) { clearTimeout(el._lc); el._lc = null; }
  el.classList.remove('leaving', 'entering');
  el.textContent   = text;
  el.style.opacity = '';
  void el.offsetWidth; /* force reflow — restarts CSS animation cleanly */
  el.classList.add('entering');
  clearLyricTimers();
  lyricExit = setTimeout(() => hideLyricEl(lBuf), stayMs);
}

function clearAllLyrics() {
  clearLyricTimers();
  lyricEls.forEach(el => {
    if (el._lc) { clearTimeout(el._lc); el._lc = null; }
    el.classList.remove('entering', 'leaving');
    el.textContent = ''; el.style.opacity = '0';
  });
  lyricIdx = -1;
}

function tickLyrics() {
  const lyrics = getSong()?.lyrics;
  if (!lyrics?.length) return;
  const t = audioEl.currentTime;
  let cur = -1;
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (t >= lyrics[i].time) { cur = i; break; }
  }
  if (cur === lyricIdx) return;
  lyricIdx = cur;
  if (cur < 0) { clearAllLyrics(); return; }
  const gapMs = cur < lyrics.length - 1
    ? (lyrics[cur + 1].time - lyrics[cur].time) * 1000 - 120
    : MAX_STAY;
  showLyric(lyrics[cur].text, Math.min(MAX_STAY, Math.max(MIN_STAY, gapMs)));
}

audioEl.addEventListener('timeupdate', tickLyrics, { passive: true });
audioEl.addEventListener('seeked',     () => { clearAllLyrics(); tickLyrics(); });
audioEl.addEventListener('ended',      clearAllLyrics);
audioEl.addEventListener('pause',      () => { if (!isPlaying) clearAllLyrics(); });

/* ════════════════════════════════
   PROGRESS BAR
════════════════════════════════ */
const fmt = s => (!isFinite(s) || isNaN(s)) ? '0:00'
  : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

audioEl.addEventListener('timeupdate', () => {
  if (!audioEl.duration) return;
  const pct = audioEl.currentTime / audioEl.duration * 100;
  progressFill.style.width = pct + '%';
  timeCurrent.textContent  = fmt(audioEl.currentTime);
  progressWrap.setAttribute('aria-valuenow', Math.round(pct));
}, { passive: true });

audioEl.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = fmt(audioEl.duration);
});

const seekFrom = e => {
  if (!audioEl.duration) return;
  const r   = progressWrap.getBoundingClientRect();
  const clX = (e.touches ? e.touches[0] : e).clientX;
  audioEl.currentTime =
    Math.max(0, Math.min(1, (clX - r.left) / r.width)) * audioEl.duration;
};
progressWrap.addEventListener('click',      seekFrom);
progressWrap.addEventListener('touchstart', seekFrom, { passive: true });

/* ════════════════════════════════
   PLAYER CORE
════════════════════════════════ */
let currentCat = 'sinhala';
let currentIdx = 0;

const getSongs = () => SONGS[currentCat] || [];
const getSong  = () => getSongs()[currentIdx] || null;

/* Preload next song into a detached Audio (doesn't touch WebAudio graph).
   Fired 4s after playback starts — avoids competing for bandwidth. */
let nextCache = null;
function preloadNext() {
  const songs = getSongs();
  if (songs.length < 2) return;
  const nf = songs[(currentIdx + 1) % songs.length].file;
  if (nextCache?._src === nf) return;
  const a = new Audio();
  a.preload = 'auto'; a._src = nf; a.src = nf; a.load();
  if (nextCache) { nextCache.src = ''; nextCache = null; }
  nextCache = a;
}

/* loadSong:
   isPlaying cleared before audioEl.load() to suppress the
   synchronous 'pause' DOM event that load() fires on some
   browsers (would otherwise clear lyrics / corrupt UI).
   Restored synchronously immediately after — load() is spec-sync. */
function loadSong(idx, autoPlay) {
  const songs = getSongs();
  if (!songs.length) {
    songNameEl.textContent = 'No songs yet — check back soon!';
    songDescEl.textContent = '';
    clearAllLyrics(); renderDots(); return;
  }
  currentIdx = ((idx % songs.length) + songs.length) % songs.length;

  clearAllLyrics();
  stopAudioWatchdog();

  progressFill.style.width = '0%';
  timeCurrent.textContent  = '0:00';
  timeTotal.textContent    = '0:00';

  const song       = songs[currentIdx];
  const wasPlaying = isPlaying;

  isPlaying   = false;
  audioEl.src = song.file;
  audioEl.load();
  isPlaying = wasPlaying;

  songInfoEl.classList.remove('flash');
  void songInfoEl.offsetWidth;
  songInfoEl.classList.add('flash');
  songNameEl.textContent = song.name;
  songDescEl.textContent = song.desc || '';
  renderDots();

  if (autoPlay) {
    requestAnimationFrame(() => {
      tryPlay();
      setTimeout(preloadNext, 4000);
    });
  }
}

function tryPlay() {
  initAudioCtx();
  resumeCtx();
  const p = audioEl.play();
  if (p && typeof p.then === 'function') {
    p.then(() => {
      setPlayState(true);
      startAudioWatchdog();
      startViz(); /* kick off viz loop only when actually playing */
    }).catch(err => {
      if (err.name === 'AbortError') return;
      setPlayState(false);
      if      (err.name === 'NotAllowedError')   showToast('👆 Tap play to start music');
      else if (err.name === 'NotSupportedError') showToast('⚠️ Audio format not supported');
      else console.warn('play():', err.name, err.message);
    });
  } else {
    setPlayState(true);
    startAudioWatchdog();
    startViz();
  }
}

function setPlayState(on) {
  isPlaying = on;
  playIcon.className        = on ? 'fa-solid fa-pause' : 'fa-solid fa-play';
  playBtn.style.paddingLeft = on ? '0' : '3px';
  playBtn.classList.toggle('playing', on);
  playBtn.setAttribute('aria-pressed', String(on));
  playAurora.classList.toggle('active', on);
  on ? hideHint() : showHint();
  if (!on) {
    stopAudioWatchdog();
    /* viz loop will self-terminate on next tick when isPlaying=false */
  }
}

function hideHint() { playHint.classList.add('hidden'); }
function showHint() { playHint.classList.remove('hidden'); }

let toastTimer = null;
function showToast(msg, ms = 4000) {
  audioToast.textContent = msg;
  audioToast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => audioToast.classList.remove('show'), ms);
}

/* ════════════════════════════════
   CONTROLS
════════════════════════════════ */
playBtn.addEventListener('click', () => {
  initAudioCtx();
  if (isPlaying) { audioEl.pause(); setPlayState(false); }
  else           { tryPlay(); }
});

nextBtn.addEventListener('click', () => loadSong(currentIdx + 1, isPlaying));

prevBtn.addEventListener('click', () => {
  audioEl.currentTime > 3
    ? (audioEl.currentTime = 0)
    : loadSong(currentIdx - 1, isPlaying);
});

audioEl.addEventListener('ended', () => {
  stopAudioWatchdog();
  loadSong(currentIdx + 1, true);
});

audioEl.addEventListener('error', () => {
  showToast(audioEl.error?.code === 4
    ? '⚠️ Unsupported audio format.'
    : '⚠️ Could not load audio.');
  setPlayState(false);
});

/* ════════════════════════════════
   CATEGORY TABS
════════════════════════════════ */
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    currentCat = btn.dataset.cat;
    loadSong(0, isPlaying);
  });
});

/* ════════════════════════════════
   SONG DOTS
════════════════════════════════ */
function renderDots() {
  const songs = getSongs();
  songDots.innerHTML = '';
  songs.forEach((s, i) => {
    const d = document.createElement('span');
    d.className = 'song-dot' + (i === currentIdx ? ' active' : '');
    d.setAttribute('role', 'listitem');
    d.setAttribute('aria-label', s.name);
    d.title = s.name;
    d.addEventListener('click', () => loadSong(i, isPlaying));
    songDots.appendChild(d);
  });
}

/* ════════════════════════════════
   KEYBOARD SHORTCUTS
════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return;
  if (e.key === ' ')               { e.preventDefault(); playBtn.click(); }
  else if (e.key === 'ArrowRight') loadSong(currentIdx + 1, isPlaying);
  else if (e.key === 'ArrowLeft')  loadSong(currentIdx - 1, isPlaying);
});

/* ════════════════════════════════
   INIT
════════════════════════════════ */
loadSong(0, false);
showHint();
