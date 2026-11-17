// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ASSIGNMENTS.JS — fetches from api/assignments.php
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ASSIGNMENTS_STRUCTURE = [
  {id:"a-y1",label:"Year 01",year:"2026 – 2027",semesters:[
    {id:"a-y1s1",label:"Semester 01",subjects:[
      {id:"a-y1s1-phil",label:"Philosophical Foundation of Education"},
      {id:"a-y1s1-ict",label:"ICT for Education"},
      {id:"a-y1s1-soft",label:"Soft Skills for Teachers"},
      {id:"a-y1s1-bcelt",label:"Basic Concepts in English Language Teaching"},
      {id:"a-y1s1-intro",label:"Introduction to English Language and English Grammar"},
      {id:"a-y1s1-elit",label:"Introduction to English Literature"}
    ]},
    {id:"a-y1s2",label:"Semester 02",subjects:[
      {id:"a-y1s2-psych",label:"Psychological Foundation of Education"},
      {id:"a-y1s2-tmeth",label:"Teaching Methods General & Special"},
      {id:"a-y1s2-socio",label:"Sociological Foundation of Education"},
      {id:"a-y1s2-litper",label:"Background to Literary Periods"},
      {id:"a-y1s2-eltm",label:"ELT Methodology"},
      {id:"a-y1s2-rw",label:"Teaching Reading & Writing"}
    ]}
  ]},
  {id:"a-y2",label:"Year 02",year:"2027 – 2028",semesters:[
    {id:"a-y2s1",label:"Semester 01",subjects:[
      {id:"a-y2s1-comp",label:"Comparative Education"},
      {id:"a-y2s1-guid",label:"Guidance & Counselling"},
      {id:"a-y2s1-meas",label:"Measurements & Evaluation in Education"},
      {id:"a-y2s1-eng1",label:"Structure of English I (Phonetics, Phonology)"},
      {id:"a-y2s1-eng2",label:"Structure of English II (Morphology)"},
      {id:"a-y2s1-eng3",label:"Structure of English III (Syntax & Semantics)"},
      {id:"a-y2s1-call",label:"Computer Assisted Language Learning"}
    ]},
    {id:"a-y2s2",label:"Semester 02",subjects:[
      {id:"a-y2s2-aest",label:"Aesthetic Education"},
      {id:"a-y2s2-emgmt",label:"Educational Management"},
      {id:"a-y2s2-val",label:"Value Education"},
      {id:"a-y2s2-ls",label:"Teaching, Listening & Speaking"},
      {id:"a-y2s2-writ",label:"Teaching Writing Skills"},
      {id:"a-y2s2-lp",label:"Lesson Planning & ELT Material"},
      {id:"a-y2s2-slle",label:"Sri Lankan Literature in English"}
    ]}
  ]},
  {id:"a-y3",label:"Year 03",year:"2028 – 2029",semesters:[
    {id:"a-y3s1",label:"Semester 01",subjects:[
      {id:"a-y3s1-clmgmt",label:"Classroom Management"},
      {id:"a-y3s1-child",label:"Children's Rights"},
      {id:"a-y3s1-tp",label:"Teaching Practice"},
      {id:"a-y3s1-port",label:"Portfolio"},
      {id:"a-y3s1-disc",label:"Discourse Analysis"},
      {id:"a-y3s1-sla",label:"Second Language Acquisition/Learning & ESL in Sri Lanka"}
    ]},
    {id:"a-y3s2",label:"Semester 02",subjects:[
      {id:"a-y3s2-curr",label:"Curriculum Theory & Practice"},
      {id:"a-y3s2-pe",label:"Physical Education"},
      {id:"a-y3s2-eltcur",label:"ELT Curriculum in Sri Lanka"},
      {id:"a-y3s2-litth",label:"Literary Theory in English"},
      {id:"a-y3s2-shak",label:"Shakespearean Drama"},
      {id:"a-y3s2-test",label:"Testing & Evaluation in Second Language Teaching"}
    ]}
  ]},
  {id:"a-y4",label:"Year 04",year:"2029 – 2030",semesters:[
    {id:"a-y4s1",label:"Semester 01",subjects:[
      {id:"a-y4s1-res",label:"Research Methods"},
      {id:"a-y4s1-vic",label:"Victorian Literature"},
      {id:"a-y4s1-rom",label:"Romantic Poetry"},
      {id:"a-y4s1-eltcd",label:"ELT Curriculum Design"}
    ]},
    {id:"a-y4s2",label:"Semester 02",subjects:[
      {id:"a-y4s2-amer",label:"Introduction to American Literature (Optional)"},
      {id:"a-y4s2-aug",label:"Augustan Literature (Optional)"},
      {id:"a-y4s2-post",label:"Post-Colonial Literature (Optional)"},
      {id:"a-y4s2-diss",label:"Dissertation"}
    ]}
  ]}
];

// ── File type helpers ──────────────────────────────────────
const FT_MAP_A = {
  PDF:'ft-pdf',DOCX:'ft-docx',DOC:'ft-docx',PPTX:'ft-pptx',PPT:'ft-pptx',
  XLSX:'ft-xlsx',XLS:'ft-xlsx',ZIP:'ft-zip',IMG:'ft-img',JPG:'ft-img',
  PNG:'ft-img',TXT:'ft-txt',MD:'ft-txt',VIDEO:'ft-video'
};
function normType(t) {
  if (!t) return 'OTHER';
  return String(t).replace(/^ft[-_]?/i,'').trim().toUpperCase();
}
function ftCls(t) { return FT_MAP_A[normType(t)] || 'ft-other'; }
function ftLbl(t) { return String(t).replace(/^ft[-_]?/i,'').trim().toUpperCase() || 'FILE'; }

// ── Extract Google Drive file ID ───────────────────────────
function getDriveIdA(url) {
  if (!url) return null;
  var m;
  m = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/); if (m) return m[1];
  m = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/); if (m) return m[1];
  m = url.match(/drive\.google\.com\/uc\?[^"']*id=([a-zA-Z0-9_-]+)/); if (m) return m[1];
  return null;
}

// ── Build direct download URL ──────────────────────────────
function buildDlUrlA(url) {
  if (!url) return '#';
  if (!url.startsWith('http')) return url;
  var id = getDriveIdA(url);
  if (id) return 'https://drive.google.com/uc?export=download&id=' + id + '&confirm=t';
  var m;
  m = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return 'https://docs.google.com/document/d/' + m[1] + '/export?format=docx';
  m = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return 'https://docs.google.com/spreadsheets/d/' + m[1] + '/export?format=xlsx';
  m = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return 'https://docs.google.com/presentation/d/' + m[1] + '/export/pptx';
  return url;
}

// ── Build preview URL ──────────────────────────────────────
// PDF    → Drive /preview
// Office → Microsoft Office Online viewer with Drive sharing URL
// (uc?export=download requires auth — view URL is public with "Anyone with link")
function buildPreviewUrlA(url, ft) {
  if (!url) return null;
  var nt = normType(ft);
  if (nt === 'VIDEO') return null;
  if (!url.startsWith('http')) return url;
  var id = getDriveIdA(url);
  if (id) {
    if (nt === 'PDF') {
      return 'https://drive.google.com/file/d/' + id + '/preview';
    }
    // Office files: use Microsoft viewer with the public Drive sharing URL
    var shareUrl = 'https://drive.google.com/file/d/' + id + '/view?usp=sharing';
    return 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(shareUrl);
  }
  var m;
  m = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return 'https://docs.google.com/document/d/' + m[1] + '/preview';
  m = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return 'https://docs.google.com/presentation/d/' + m[1] + '/embed?start=false&loop=false&delayms=3000';
  m = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return 'https://docs.google.com/spreadsheets/d/' + m[1] + '/preview';
  if (/youtube\.com|youtu\.be/.test(url)) return null;
  return null;
}

// ── Download via streaming proxy ──────────────────────────
function dlFile(url, name, ft) {
  if (!url || url === '#') return;
  var rawExt = String(ft || '').replace(/^ft[-_]?/i,'').trim().toLowerCase();
  var noExt  = ['other','video',''].includes(rawExt);
  var dlUrl  = buildDlUrlA(url);
  var proxy  = DSVB.proxyUrl(dlUrl, name || 'file', rawExt && !noExt ? rawExt : '');
  var a = document.createElement('a');
  a.href = proxy;
  a.setAttribute('download', (name || 'file') + (rawExt && !noExt ? '.' + rawExt : ''));
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

// ── In-page preview modal with zoom ───────────────────────
(function () {
  var _ovl = null, _scale = 1;
  var BTN = 'background:rgba(255,255,255,.18);border:none;min-width:28px;height:28px;border-radius:6px;cursor:pointer;color:#fff;font-size:.82rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:1;font-family:Nunito,sans-serif;font-weight:800;padding:0 6px';

  function _build() {
    var ovl = document.createElement('div');
    ovl.id = 'fp-ovl';
    ovl.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:522;display:none;align-items:center;justify-content:center;padding:.8rem';
    ovl.innerHTML =
      '<div id="fp-box" style="background:var(--bg2);border-radius:14px;width:min(96vw,860px);height:min(88vh,660px);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.65)">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:.55rem .95rem;background:linear-gradient(135deg,#c2410c,#ea580c);gap:.4rem;flex-shrink:0">' +
          '<span id="fp-title" style="font-size:.78rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0;font-family:Syne,sans-serif"></span>' +
          '<div style="display:flex;gap:.3rem;align-items:center;flex-shrink:0">' +
            '<button id="fp-zout" style="' + BTN + '" title="Zoom out">\u2212</button>' +
            '<span id="fp-zval" style="font-size:.65rem;color:rgba(255,255,255,.8);min-width:34px;text-align:center;font-family:Nunito,sans-serif">100%</span>' +
            '<button id="fp-zin" style="' + BTN + '" title="Zoom in">+</button>' +
            '<button id="fp-zreset" style="' + BTN + ';font-size:.6rem" title="Reset zoom">\u27f3</button>' +
            '<button id="fp-close" style="' + BTN + ';margin-left:4px" title="Close">\u2715</button>' +
          '</div>' +
        '</div>' +
        '<div id="fp-wrap" style="position:relative;flex:1;min-height:0;overflow:auto">' +
          '<div id="fp-spin" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.75rem;background:var(--bg2);z-index:1;pointer-events:none">' +
            '<div style="width:36px;height:36px;border:3px solid var(--border);border-top-color:#fb923c;border-radius:50%;animation:fpSpinA .7s linear infinite"></div>' +
            '<span style="font-size:.72rem;color:var(--muted);font-family:Nunito,sans-serif">Loading preview\u2026</span>' +
          '</div>' +
          '<style>@keyframes fpSpinA{to{transform:rotate(360deg)}}</style>' +
          '<iframe id="fp-iframe" style="position:absolute;inset:0;width:100%;height:100%;border:none;transform-origin:top left;z-index:2" allowfullscreen></iframe>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ovl);
    ovl.addEventListener('click', function (e) { if (e.target === ovl) _close(); });
    document.getElementById('fp-close').addEventListener('click', _close);
    document.getElementById('fp-zin').addEventListener('click', function () { _zoom(0.15); });
    document.getElementById('fp-zout').addEventListener('click', function () { _zoom(-0.15); });
    document.getElementById('fp-zreset').addEventListener('click', function () { _setScale(1); });
    document.getElementById('fp-iframe').addEventListener('load', function () {
      var s = document.getElementById('fp-spin'); if (s) s.style.display = 'none';
    });
    // Fallback: hide spinner after 4s even if load never fires (Office viewer quirk)
    setTimeout(function() { var s = document.getElementById('fp-spin'); if (s) s.style.display = 'none'; }, 4000);
    return ovl;
  }

  function _zoom(d) { _setScale(Math.min(3, Math.max(0.3, Math.round((_scale + d) * 100) / 100))); }

  function _setScale(s) {
    _scale = s;
    var f = document.getElementById('fp-iframe'), v = document.getElementById('fp-zval');
    if (!f) return;
    if (v) v.textContent = Math.round(s * 100) + '%';
    if (s === 1) { f.style.transform = 'none'; f.style.width = '100%'; f.style.height = '100%'; }
    else { var inv = Math.round((1 / s) * 10000) / 100; f.style.transform = 'scale(' + s + ')'; f.style.transformOrigin = 'top left'; f.style.width = inv + '%'; f.style.height = inv + '%'; }
  }

  function _close() {
    if (!_ovl) return;
    _ovl.style.display = 'none';
    var f = document.getElementById('fp-iframe'), s = document.getElementById('fp-spin');
    if (f) setTimeout(function () { f.src = ''; _setScale(1); }, 280);
    if (s) s.style.display = 'flex';
  }

  window.openFilePreview = function (url, name) {
    if (!_ovl) _ovl = _build();
    _setScale(1);
    document.getElementById('fp-title').textContent = name || 'Preview';
    var s = document.getElementById('fp-spin'), f = document.getElementById('fp-iframe');
    if (s) s.style.display = 'flex';
    if (f) f.src = url;
    _ovl.style.display = 'flex';
  };

  window.closeFilePreview = _close;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') _close(); });
}());

// ── Video detection & player ───────────────────────────────
function detectVideoTypeA(url) {
  if (!url) return 'other';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/drive\.google\.com/.test(url)) return 'drive';
  return 'other';
}
function extractYTIdA(url) {
  var m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}
function aOpenPlayer(title, url) {
  var modal = document.getElementById('aVidModal'), ovl = document.getElementById('aVidOvl');
  var ttl = document.getElementById('aVidTitle'), embed = document.getElementById('aVidEmbed');
  ttl.textContent = title; embed.innerHTML = '';
  ovl.classList.add('open'); modal.classList.add('open');
  var vt = detectVideoTypeA(url);
  if (vt === 'youtube') {
    var id = extractYTIdA(url);
    if (!id) { embed.innerHTML = '<div style="color:#fff;padding:2rem;text-align:center">Invalid YouTube URL</div>'; return; }
    embed.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1" allowfullscreen allow="autoplay;fullscreen;accelerometer;gyroscope;picture-in-picture;web-share" loading="lazy"></iframe>';
  } else if (vt === 'drive') {
    var did = getDriveIdA(url);
    var src = did ? 'https://drive.google.com/file/d/' + did + '/preview' : url;
    embed.innerHTML = '<iframe src="' + src + '" allowfullscreen allow="autoplay;fullscreen" loading="lazy"></iframe>';
  } else {
    var ext = url.split('?')[0].split('.').pop().toLowerCase();
    if (['mp4','webm','ogg','mov'].includes(ext)) {
      embed.innerHTML = '<video controls autoplay style="position:absolute;top:0;left:0;width:100%;height:100%;background:#000"><source src="' + url + '"></video>';
    } else {
      embed.innerHTML = '<iframe src="' + url + '" allowfullscreen allow="autoplay;fullscreen" loading="lazy"></iframe>';
    }
  }
}
function aClosePlayer() {
  document.getElementById('aVidModal').classList.remove('open');
  document.getElementById('aVidOvl').classList.remove('open');
  setTimeout(function () { var e = document.getElementById('aVidEmbed'); if (e) e.innerHTML = ''; }, 300);
}
function aMaybeClose(e) { if (e.target === document.getElementById('aVidOvl')) aClosePlayer(); }
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') aClosePlayer(); });

// ── Build file card ────────────────────────────────────────
function buildFileCard(file) {
  var ft = file.fileType || file.filetype || '';
  var nt = normType(ft);
  var isVideo = (nt === 'VIDEO');
  var fc = ftCls(ft), fl = ftLbl(ft);
  var nm = (file.name || '').replace(/'/g, "\\'");
  var url = file.url || '';
  var safeUrl = url.replace(/'/g, "\\'");
  var desc = file.desc ? '<div class="file-desc">' + file.desc + '</div>' : '';

  if (isVideo) {
    return '<div class="file-card">' +
      '<div class="ft-badge ft-video"><i class="fa-solid fa-play" style="font-size:.7rem;margin-left:1px"></i></div>' +
      '<div class="file-info"><div class="file-name">' + (file.name || 'Video') + '</div>' + desc + '</div>' +
      '<button class="dl-btn dl-btn--play" onclick="aOpenPlayer(\'' + nm + '\',\'' + safeUrl + '\')" title="Play"><i class="fa-solid fa-play"></i><span> Play</span></button>' +
    '</div>';
  }

  var previewUrl = buildPreviewUrlA(url, ft);
  var eyeBtn = '';
  if (previewUrl) {
    var sp = previewUrl.replace(/'/g, "\\'");
    eyeBtn = '<button class="dl-btn" onclick="openFilePreview(\'' + sp + '\',\'' + nm + '\')" title="Preview" style="background:transparent;color:var(--pa);border:1.5px solid var(--border);box-shadow:none;padding:.38rem .52rem"><i class="fa-regular fa-eye"></i></button>';
  }

  return '<div class="file-card">' +
    '<div class="ft-badge ' + fc + '">' + fl + '</div>' +
    '<div class="file-info"><div class="file-name">' + (file.name || fl) + '</div>' + desc + '</div>' +
    '<div style="display:flex;gap:.3rem;flex-shrink:0;align-items:center">' +
      eyeBtn +
      '<button class="dl-btn" onclick="dlFile(\'' + safeUrl + '\',\'' + nm + '\',\'' + ft + '\')" title="Download"><i class="fa-solid fa-download"></i><span> Download</span></button>' +
    '</div>' +
  '</div>';
}

// ── Assignment entry builders ──────────────────────────────
function buildAssignEntry(entry) {
  var files = (entry.files || []).filter(function (f) { return f.url; });
  var badges = [];
  if (entry.category) badges.push('<span class="assign-cat">' + entry.category + '</span>');
  if (entry.deadline) badges.push('<span class="assign-dl"><i class="fa-regular fa-calendar-xmark"></i> ' + entry.deadline + '</span>');
  var what = entry.whatToDo ? '<div class="assign-what"><i class="fa-solid fa-list-check"></i><span>' + entry.whatToDo + '</span></div>' : '';
  var fileList = files.length
    ? '<div class="file-list">' + files.map(buildFileCard).join('') + '</div>'
    : '<p class="cat-empty"><i class="fa-regular fa-clock"></i>&nbsp; Coming soon\u2026</p>';
  return '<div class="assign-entry">' +
    '<div class="assign-entry-hd">' +
      '<span class="assign-entry-name">' + (entry.name || 'Untitled') + '</span>' +
      (entry.desc ? '<span class="assign-entry-desc">' + entry.desc + '</span>' : '') +
      (badges.length ? '<span class="assign-entry-meta">' + badges.join('') + '</span>' : '') +
    '</div>' + what + fileList +
  '</div>';
}

function buildAssignList(entries) {
  if (!entries || !entries.length) return '<p class="cat-empty"><i class="fa-regular fa-clock"></i>&nbsp; Coming soon\u2026</p>';
  return entries.map(buildAssignEntry).join('');
}

// ── Accordion builders ─────────────────────────────────────
function buildSubject(subj) {
  return '<div class="subj-item" data-acc-item id="' + subj.id + '">' +
    '<button class="subj-head acc-head" data-acc-head aria-expanded="false">' +
      '<i class="fa-solid fa-scroll subj-icon"></i>' +
      '<div class="subj-label-wrap"><span class="subj-label">' + subj.label + '</span></div>' +
      '<i class="fa-solid fa-chevron-right acc-chev subj-chev"></i>' +
    '</button>' +
    '<div class="acc-body"><div class="acc-body-inner"><div class="subj-body-inner">' +
      '<div class="cat-block"><div class="cat-head cat-brief"><i class="fa-solid fa-clipboard-list"></i> Assignment Details</div>' + buildAssignList(subj.briefFiles) + '</div>' +
      '<div class="cat-block"><div class="cat-head cat-aana"><i class="fa-solid fa-pen-nib"></i> \u0d86\u0db1\u0dcf\u0d9c\u0dda Submission</div>' + buildAssignList(subj.aanaFiles) + '</div>' +
    '</div></div></div>' +
  '</div>';
}

function buildSemester(sem) {
  var inner = sem.subjects.length
    ? sem.subjects.map(buildSubject).join('')
    : '<div class="acc-empty"><i class="fa-regular fa-folder-open"></i><span>No content yet.</span></div>';
  var meta = sem.subjects.length ? sem.subjects.length + ' subjects' : 'Empty';
  return '<div class="sem-item" data-acc-item id="' + sem.id + '">' +
    '<button class="sem-head acc-head" data-acc-head aria-expanded="false">' +
      '<i class="fa-solid fa-layer-group sem-icon"></i>' +
      '<span class="sem-label">' + sem.label + '</span><span class="sem-meta">' + meta + '</span>' +
      '<i class="fa-solid fa-chevron-right acc-chev sem-chev"></i>' +
    '</button>' +
    '<div class="acc-body"><div class="acc-body-inner"><div class="sem-body-inner">' + inner + '</div></div></div>' +
  '</div>';
}

function buildYear(year) {
  var inner = year.semesters.length
    ? year.semesters.map(buildSemester).join('')
    : '<div class="acc-empty"><i class="fa-regular fa-folder-open"></i><span>No content yet.</span></div>';
  var badge = year.semesters.length ? year.semesters.length + ' semesters' : 'Upcoming';
  return '<div class="year-item" data-acc-item id="' + year.id + '">' +
    '<button class="year-head acc-head" data-acc-head aria-expanded="false">' +
      '<i class="fa-solid fa-chevron-right acc-chev year-chev"></i>' +
      '<span class="year-num">' + year.label + ' <small>' + year.year + '</small></span>' +
      '<span class="year-badge">' + badge + '</span>' +
    '</button>' +
    '<div class="acc-body"><div class="acc-body-inner"><div class="year-body-inner">' + inner + '</div></div></div>' +
  '</div>';
}

// ── Hash navigation ────────────────────────────────────────
function handleHash() {
  var id = location.hash.slice(1); if (!id) return;
  var el = document.getElementById(id); if (!el || !el.hasAttribute('data-acc-item')) return;
  var node = el.parentElement;
  while (node && node.id !== 'assignRoot') {
    if (node.hasAttribute('data-acc-item')) {
      node.classList.add('open');
      var h = node.querySelector(':scope > [data-acc-head]');
      if (h) h.setAttribute('aria-expanded', 'true');
    }
    node = node.parentElement;
  }
  el.classList.add('open');
  var h2 = el.querySelector(':scope > [data-acc-head]');
  if (h2) h2.setAttribute('aria-expanded', 'true');
  setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 150);
}

// ── MAIN ──────────────────────────────────────────────────
(async function init() {
  var root = document.getElementById('assignRoot'); if (!root) return;
  var CACHE_KEY = 'kuppia_assign_v2';
  var CACHE_TTL = 30 * 60 * 1000;
  var apiData = {};

  try {
    var raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      var saved = JSON.parse(raw);
      if (saved && saved.data && Object.keys(saved.data).length) apiData = saved.data;
    }
  } catch (_) { try { localStorage.removeItem(CACHE_KEY); } catch (_) {} }

  if (!Object.keys(apiData).length) {
    root.innerHTML = '<div class="acc-empty"><i class="fa-solid fa-spinner fa-spin"></i><span>Loading\u2026</span></div>';
  }

  function isBad(j) { return !j || typeof j !== 'object' || j.error || !Object.keys(j).length; }

  var cacheStale = (function () {
    try {
      var r = localStorage.getItem(CACHE_KEY); if (!r) return true;
      var s = JSON.parse(r);
      return !s || !s.data || !Object.keys(s.data).length || (Date.now() - (s.ts || 0)) > CACHE_TTL;
    } catch (_) { return true; }
  }());

  if (cacheStale) {
    var ok = false;
    for (var i = 0; i < 3; i++) {
      try {
        var res = await DSVB.api('assignments');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var json = await res.json();
        if (!isBad(json)) {
          apiData = json;
          try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: json })); } catch (_) {}
          ok = true; break;
        }
      } catch (_) { if (i < 2) await new Promise(function (r) { setTimeout(r, 1500); }); }
    }
    if (!ok && !Object.keys(apiData).length) {
      root.innerHTML = '<div class="acc-empty"><i class="fa-regular fa-circle-xmark"></i><span>Could not load \u2014 please refresh.</span></div>';
      return;
    }
  } else {
    DSVB.api('assignments').then(function (r) { return r.ok ? r.json() : null; }).then(function (json) {
      if (!isBad(json)) try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: json })); } catch (_) {}
    }).catch(function () {});
  }

  ASSIGNMENTS_STRUCTURE.forEach(function (year) {
    year.semesters.forEach(function (sem) {
      sem.subjects.forEach(function (subj) {
        var d = apiData[subj.id] || {};
        subj.briefFiles = d.briefFiles || [];
        subj.aanaFiles  = d.aanaFiles  || [];
      });
    });
  });

  root.innerHTML = ASSIGNMENTS_STRUCTURE.map(buildYear).join('');

  root.addEventListener('click', function (e) {
    var head = e.target.closest('[data-acc-head]'); if (!head) return;
    var item = head.closest('[data-acc-item]'); if (!item) return;
    item.classList.toggle('open');
    head.setAttribute('aria-expanded', String(item.classList.contains('open')));
  });

  handleHash();
  window.addEventListener('hashchange', handleHash);
}());
