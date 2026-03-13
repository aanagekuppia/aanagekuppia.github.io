/* ════════════════════════════════════════════════════════════
   js/includes.js  —  shared interactive components
   ────────────────────────────────────────────────────────────
   ✏️  EDIT SECTIONS 1–3 to customise text content.
   All other sections are engine code — edit with care.
════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   ✏️  SECTION 1 — THEME MESSAGES
   Shown in the header when toggling TO dark mode.
   Add / remove / edit lines freely.
════════════════════════════════════════════════════════════ */
const STRETCH_MSGS = [
  'මලිත්ට ගහද්දි ඇයි චංචලා අඬන්නෙ..?',
  'සබ්බේ ලබං..',
  'සල්ලි සබන් පෙණ - ගෑණු අයිස් කැට..',
  'අංගම්මන සුමන අංගම්මන සුමන..',
];

/* ════════════════════════════════════════════════════════════
   ✏️  SECTION 2 — CAT SPEECH BUBBLES
   Each click cycles through these in order.
   Add / remove / edit lines freely.
════════════════════════════════════════════════════════════ */
const CAT_SPEECHES = [
  '😋 කෑවද බං?',
  '🥰😘 ආ පැටියෝ.. කොහොමද..?',
  '😠 අසහනේද.. පූසෙකුටවත් ඉන්න දියම්..',
  '😤 මරිසි දාන්න එපා.. හරිද..?',
  '😩 මාව මරාගෙන කාපියව්..!',
  '😠 උඹ වගේ ගොං හරකෙක් යකෝ මෝඩ මූසලයෙක්..',
  '😡 කනවා තෝව..',
  '🤬 මීට වැඩිය හොඳායි.. @#%_!',
  '😠 උඹ හෙන කැතයි යකෝ..',
  '😤 ඕන්න ඕක තමයි ප්‍රශ්නෙ..',
  '😡🤬 #$^_## කරදර කරන්නැතුව පලයංකෝ..',
];

/* ════════════════════════════════════════════════════════════
   ✏️  SECTION 3 — TROLL POPUP STAGES
   Each button click advances to the next stage.
   Fields:
     text     — HTML message shown in popup
     imgType  — 'static' for webp/jpg, 'gif' for animated webp
     imgW     — webp image path  (used when imgType='static')
     imgJ     — jpg fallback     (used when imgType='static')
     gifSrc   — animated webp    (used when imgType='gif')
     sound    — audio file path
════════════════════════════════════════════════════════════ */
const TROLL_STAGES = [
  {
    text:    "😊😇 හෙලෝ මගෙ රත්තරං යාළුවනෙ කොහොමද.. හොඳින් ඉන්නවද ඔයගොල්ලෝ..? ❤️ආයි ඔබන්න එපා පැටියො මේක..😘😘",
    imgType: 'static', imgW: 'assets/troll/01.webp', imgJ: 'assets/troll/01.jpg',
    sound:   'assets/aud/a.mp3',
  },
  {
    text:    '😭😭 හයියෝ.. සිංහල බැයිද? මේක ඔබන්න එපා යකෝ.. මේවා බලන්නෙ කොහොමද..',
    imgType: 'static', imgW: 'assets/troll/02.webp', imgJ: 'assets/troll/02.jpg',
    sound:   'assets/aud/b.mp3',
  },
  {
    text:    "😤😤 ආයි මේක එබුවොත් තෝව පරණ බඩු ලොරියට දෙනවා..",
    imgType: 'static', imgW: 'assets/troll/03.webp', imgJ: 'assets/troll/03.jpg',
    sound:   'assets/aud/c.mp3',
  },
  {
    text:    "😡😡 අඩෝ තොට පුළුවන්නං මට කොච්චර පුළුවන්ද, මෙතන.. මොකෙක්ද තෝ..?",
    imgType: 'static', imgW: 'assets/troll/04.webp', imgJ: 'assets/troll/04.jpg',
    sound:   'assets/aud/d.mp3',
  },
  {
    text:    '🤬💢 ශානෝ.. ටේප් එක ගෙනෙං මුගෙ අත කට බැඳලා දාන්න..!',
    imgType: 'gif', gifSrc: 'assets/troll/05.webp',
    sound:   'assets/aud/e.mp3',
  },
  {
    text:    '😠🤬 ඇටෙත් එක්කම පලාගත්තනං තමයි හොඳ..',
    imgType: 'gif', gifSrc: 'assets/troll/06.webp',
    sound:   'assets/aud/f.mp3',
  },
];

/* ════════════════════════════════════════════════════════════
   ⚙️  IMAGE HELPER — webp with jpg fallback
════════════════════════════════════════════════════════════ */
function loadImg(el, webpSrc, jpgSrc) {
  el.onerror = () => {
    el.onerror = () => { el.style.display = 'none'; };
    el.src = jpgSrc;
  };
  el.src = webpSrc;
}

/* ════════════════════════════════════════════════════════════
   ⚙️  AUDIO ENGINE
   Pre-decodes files into an AudioContext buffer for
   zero-latency playback. Falls back to HTML Audio.
════════════════════════════════════════════════════════════ */
let _audioCtx = null;
const _audioCache = new Map(); // src → AudioBuffer

function _getCtx() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

async function _preload(src) {
  if (_audioCache.has(src)) return _audioCache.get(src);
  try {
    const res = await fetch(src);
    const ab  = await res.arrayBuffer();
    const buf = await _getCtx().decodeAudioData(ab);
    _audioCache.set(src, buf);
    return buf;
  } catch(e) { return null; }
}

function _playBufferNow(ctx, buf, onEnd) {
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  if (onEnd) src.onended = onEnd;
  src.start(0);
  return { stop: () => { try { src.stop(); } catch(e){} } };
}

function _playBuffer(src, onEnd) {
  const ctx = _getCtx();
  const buf = _audioCache.get(src);
  if (!buf) {
    (async () => {
      const b = await _preload(src);
      if (b) _playBufferNow(ctx, b, onEnd);
      else if (onEnd) onEnd();
    })();
    return { stop: () => {} };
  }
  return _playBufferNow(ctx, buf, onEnd);
}

/** Public: plays audio, calls onEnd when done. Returns {stop()} handle. */
function playAudio(url, onEnd) {
  const buf = _audioCache.get(url);
  if (buf) return _playBufferNow(_getCtx(), buf, onEnd);
  // Fallback to HTML Audio
  const a = new Audio();
  a.preload = 'auto';
  a.addEventListener('ended', () => { if (onEnd) onEnd(); }, { once: true });
  a.addEventListener('error', () => { if (onEnd) onEnd(); }, { once: true });
  a.src = url;
  a.play().catch(() => { if (onEnd) onEnd(); });
  return { stop: () => { a.pause(); a.src = ''; } };
}

// Preload all shared audio after first paint
(function preloadSharedAudio() {
  const sources = [
    'assets/aud/flush.mp3',
    ...TROLL_STAGES.map(s => s.sound),
    ...[1,2,3,4,5,6,7,8,9,10,11].map(n => `assets/aud/${String(n).padStart(2,'0')}.mp3`),
  ];
  setTimeout(() => sources.forEach(src => _preload(src).catch(() => {})), 300);
})();

/* ════════════════════════════════════════════════════════════
   ⚙️  THEME TOGGLE
════════════════════════════════════════════════════════════ */
let _stretchIdx = 0, _themeLocked = false;

function toggleTheme() {
  if (_themeLocked) return;
  _themeLocked = true;
  setTimeout(() => _themeLocked = false, 650);
  const h      = document.documentElement;
  const isDark = h.getAttribute('data-theme') === 'dark';
  h.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('aana-theme', isDark ? 'light' : 'dark');
  playAudio('assets/aud/flush.mp3');
  const panel = document.getElementById('hdrStretch');
  const txt   = document.getElementById('hdrStretchTxt');
  if (isDark) {
    panel.classList.remove('open');
  } else {
    txt.textContent = STRETCH_MSGS[_stretchIdx % STRETCH_MSGS.length];
    _stretchIdx++;
    panel.classList.add('open');
  }
}

// Initialise: always start light, close stretch panel
document.documentElement.setAttribute('data-theme', 'light');
(function(){
  const el = document.getElementById('hdrStretch');
  if (el) el.classList.remove('open');
})();

/* ════════════════════════════════════════════════════════════
   ⚙️  ADMIN MODAL
════════════════════════════════════════════════════════════ */
function openAdminModal() {
  const m = document.getElementById('adminModal');
  if (m) m.classList.add('open');
}
function closeAdmin() {
  const m = document.getElementById('adminModal');
  if (m) m.classList.remove('open');
}
function maybeCloseAdmin(e) {
  if (e.target === document.getElementById('adminModal')) closeAdmin();
}

/* ════════════════════════════════════════════════════════════
   ⚙️  LIGHTBOX
════════════════════════════════════════════════════════════ */
let lbOpen = false, lbCurrentIdx = null;

function _lbUpdateArrows() {
  const prev  = document.getElementById('lbPrev');
  const next  = document.getElementById('lbNext');
  const items = (typeof CAROUSEL_ITEMS !== 'undefined') ? CAROUSEL_ITEMS : [];
  const hide  = lbCurrentIdx === null || items.length <= 1;
  if (prev) prev.classList.toggle('lb-hidden', hide);
  if (next) next.classList.toggle('lb-hidden', hide);
}

function lbNav(dir) {
  if (lbCurrentIdx === null) return;
  const items = (typeof CAROUSEL_ITEMS !== 'undefined') ? CAROUSEL_ITEMS : [];
  const vid   = document.getElementById('lbMedia').querySelector('video');
  if (vid && !vid.paused) return;
  if (vid) { vid.pause(); vid.src = ''; }
  lbCurrentIdx = (lbCurrentIdx + dir + items.length) % items.length;
  _renderLb(items[lbCurrentIdx]);
  _lbUpdateArrows();
}

function openLb(i) {
  if (lbOpen) return;
  const items = (typeof CAROUSEL_ITEMS !== 'undefined') ? CAROUSEL_ITEMS : [];
  const item  = items[i];
  if (!item) return;
  lbOpen = true;
  lbCurrentIdx = i;
  _renderLb(item);
  _lbUpdateArrows();
  document.getElementById('lightbox').classList.add('open');
}

function _renderLb(item) {
  const med = document.getElementById('lbMedia');
  const dl  = document.getElementById('lbDl');
  const cap = document.getElementById('lbCap');
  if (item.type === 'video') {
    med.innerHTML = `<video src="${item.src}" class="lb-media" controls autoplay playsinline></video>`;
    if (dl) dl.style.display = 'none';
  } else {
    const src = item.srcFb || item.src;
    med.innerHTML = `<picture>
      <source srcset="${item.src}" type="image/webp"/>
      <img src="${src}" class="lb-media" alt="${item.caption || ''}"/>
    </picture>`;
    if (dl) { setupDownload(dl, src, item.caption || 'image'); dl.style.display = 'inline-flex'; }
  }
  if (cap) cap.textContent = item.caption || '';
}

function openAdminLb() {
  if (lbOpen) return;
  lbOpen = true;
  lbCurrentIdx = null;
  closeAdmin();
  const med = document.getElementById('lbMedia');
  const dl  = document.getElementById('lbDl');
  const cap = document.getElementById('lbCap');
  const src = 'assets/admin/admin.jpg';
  med.innerHTML = `<picture>
    <source srcset="assets/admin/admin.webp" type="image/webp"/>
    <img src="${src}" class="lb-media" alt="ආනා"/>
  </picture>`;
  if (dl) { setupDownload(dl, src, 'aana'); dl.style.display = 'inline-flex'; }
  if (cap) cap.textContent = 'ආනා';
  _lbUpdateArrows();
  document.getElementById('lightbox').classList.add('open');
}

function setupDownload(dlEl, src, filename) {
  dlEl.removeEventListener('click', dlEl._dlHandler);
  dlEl._dlHandler = async function(e) {
    e.preventDefault(); e.stopPropagation();
    try {
      const res  = await fetch(src, { mode: 'same-origin' });
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      const ext  = src.split('.').pop().split('?')[0] || 'jpg';
      a.href = url; a.download = `${filename}.${ext}`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch { window.open(src, '_blank'); }
  };
  dlEl.addEventListener('click', dlEl._dlHandler);
  dlEl.href = src;
  const ext = src.split('.').pop().split('?')[0] || 'jpg';
  dlEl.download = `${filename}.${ext}`;
}

function closeLb() {
  const lb  = document.getElementById('lightbox');
  const med = document.getElementById('lbMedia');
  if (!lb) return;
  const vid = med ? med.querySelector('video') : null;
  if (vid) { vid.pause(); vid.src = ''; }
  lb.classList.remove('open');
  if (med) med.innerHTML = '';
  lbOpen = false; lbCurrentIdx = null;
  const prev = document.getElementById('lbPrev');
  const next = document.getElementById('lbNext');
  if (prev) prev.classList.add('lb-hidden');
  if (next) next.classList.add('lb-hidden');
}
function maybeCloseLb(e) {
  if (e.target === document.getElementById('lightbox')) closeLb();
}

// Lightbox touch swipe
(function lbSwipe() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  let tx = null;
  lb.addEventListener('touchstart', e => {
    if (e.target.closest('video')) return;
    tx = e.touches[0].clientX;
  }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) < 45 || lbCurrentIdx === null) return;
    const vid = document.getElementById('lbMedia').querySelector('video');
    if (vid && !vid.paused) return;
    lbNav(dx < 0 ? 1 : -1);
  }, { passive: true });
})();

/* ════════════════════════════════════════════════════════════
   ⚙️  TROLL POPUP  (auto-closes when audio ends)
════════════════════════════════════════════════════════════ */
let trollStage = 0, trollOpen = false, trollAudioHandle = null;

function trollClick() {
  if (trollOpen) return;
  const s   = TROLL_STAGES[trollStage % TROLL_STAGES.length]; trollStage++;
  const img = document.getElementById('tImg');
  if (s.imgType === 'gif') {
    img.onerror = () => {};
    img.src = s.gifSrc;
  } else {
    loadImg(img, s.imgW, s.imgJ);
  }
  document.getElementById('tTxt').innerHTML = s.text;
  if (trollAudioHandle) { trollAudioHandle.stop(); trollAudioHandle = null; }
  document.getElementById('trollOvl').classList.add('open');
  document.getElementById('trollBox').classList.add('open');
  trollOpen = true;
  trollAudioHandle = playAudio(s.sound, () => {
    trollAudioHandle = null;
    closeTroll();
  });
}

function closeTroll() {
  if (trollAudioHandle) { trollAudioHandle.stop(); trollAudioHandle = null; }
  const box = document.getElementById('trollBox');
  const ovl = document.getElementById('trollOvl');
  if (box) box.classList.remove('open');
  if (ovl) ovl.classList.remove('open');
  trollOpen = false;
}

/* ════════════════════════════════════════════════════════════
   ⚙️  CAT WIDGET
════════════════════════════════════════════════════════════ */
let catBusy = false, cSpkIdx = 0, cAudIdx = 0, catSpeechTimer = null;

function catClick() {
  if (catBusy) return;
  catBusy = true;
  setZzz(false);
  setCatImg('cat02');
  document.getElementById('catGif').style.display = 'block';
  const txt    = CAT_SPEECHES[cSpkIdx % CAT_SPEECHES.length]; cSpkIdx++;
  const bubble = document.getElementById('catSpeech');
  bubble.innerHTML = txt;
  bubble.classList.remove('show');
  void bubble.offsetWidth;
  bubble.classList.add('show');
  if (catSpeechTimer) { clearTimeout(catSpeechTimer); catSpeechTimer = null; }
  const num = String((cAudIdx % 11) + 1).padStart(2, '0'); cAudIdx++;

  function onAudioEnd() {
    bubble.classList.remove('show');
    setCatImg('cat01');
    document.getElementById('catGif').style.display = 'none';
    setZzz(true);
    catBusy = false;
  }
  playAudio(`assets/aud/${num}.mp3`, onAudioEnd);
  catSpeechTimer = setTimeout(onAudioEnd, 5000);
}

function setCatImg(name) {
  loadImg(document.getElementById('catImg'), `assets/admin/${name}.webp`, `assets/admin/${name}.jpg`);
}
function setZzz(show) {
  const el = document.getElementById('catZzzWrap');
  if (el) el.style.display = show ? '' : 'none';
}
function genMeow() {
  try {
    const c = new(window.AudioContext || window.webkitAudioContext)();
    const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 2.5;
    o.connect(f); f.connect(g); g.connect(c.destination); o.type = 'sawtooth';
    const t = c.currentTime;
    o.frequency.setValueAtTime(380, t); o.frequency.linearRampToValueAtTime(960, t+.1); o.frequency.linearRampToValueAtTime(520, t+.38);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.2, t+.04); g.gain.setValueAtTime(.2, t+.22); g.gain.linearRampToValueAtTime(0, t+.42);
    o.start(t); o.stop(t+.45); setTimeout(() => c.close(), 700);
  } catch(e) {}
}

/* ════════════════════════════════════════════════════════════
   ⚙️  SCROLL TO TOP
════════════════════════════════════════════════════════════ */
(function(){
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 220);
  }, { passive: true });
})();

/* ════════════════════════════════════════════════════════════
   ⚙️  TITLE LINK  —  spam-click protection
   Clicking the title always loads loader.php.
   Prevents rapid re-clicks causing double navigation.
════════════════════════════════════════════════════════════ */
(function(){
  const link = document.getElementById('hdrTitleLink');
  if (!link) return;
  let _clicked = false;
  link.addEventListener('click', function(e) {
    if (_clicked) { e.preventDefault(); return; }
    _clicked = true;
    // Reset after a second so back-nav works cleanly
    setTimeout(() => _clicked = false, 1200);
  });
})();

/* ════════════════════════════════════════════════════════════
   ⚙️  KEYBOARD  —  ESC closes any open overlay
════════════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeLb(); closeAdmin(); closeTroll(); }
});

/* ════════════════════════════════════════════════════════════
   ⚙️  AUDIO CONTEXT UNLOCK
   Browser autoplay policy requires a user gesture before
   AudioContext can be used. This unlocks it on first click.
════════════════════════════════════════════════════════════ */
(function unlockAudio() {
  const unlock = () => {
    _getCtx();
    document.removeEventListener('click',      unlock);
    document.removeEventListener('touchstart', unlock);
  };
  document.addEventListener('click',      unlock, { once: true });
  document.addEventListener('touchstart', unlock, { once: true, passive: true });
})();
