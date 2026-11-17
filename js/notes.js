// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  NOTES.JS — fetches from api/notes.php, caches locally
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const NOTES_STRUCTURE = [
  {id:"n-y1",label:"Year 01",year:"2026 – 2027",semesters:[
    {id:"n-y1s1",label:"Semester 01",subjects:[
      {id:"n-y1s1-phil",label:"Philosophical Foundation of Education",recId:"r-y1s1-phil"},
      {id:"n-y1s1-ict",label:"ICT for Education",recId:"r-y1s1-ict"},
      {id:"n-y1s1-soft",label:"Soft Skills for Teachers",recId:"r-y1s1-soft"},
      {id:"n-y1s1-bcelt",label:"Basic Concepts in English Language Teaching",recId:"r-y1s1-bcelt"},
      {id:"n-y1s1-intro",label:"Introduction to English Language and English Grammar",recId:"r-y1s1-intro"},
      {id:"n-y1s1-elit",label:"Introduction to English Literature",recId:"r-y1s1-elit"}
    ]},
    {id:"n-y1s2",label:"Semester 02",subjects:[
      {id:"n-y1s2-psych",label:"Psychological Foundation of Education",recId:"r-y1s2-psych"},
      {id:"n-y1s2-tmeth",label:"Teaching Methods General & Special",recId:"r-y1s2-tmeth"},
      {id:"n-y1s2-socio",label:"Sociological Foundation of Education",recId:"r-y1s2-socio"},
      {id:"n-y1s2-litper",label:"Background to Literary Periods",recId:"r-y1s2-litper"},
      {id:"n-y1s2-eltm",label:"ELT Methodology",recId:"r-y1s2-eltm"},
      {id:"n-y1s2-rw",label:"Teaching Reading & Writing",recId:"r-y1s2-rw"}
    ]}
  ]},
  {id:"n-y2",label:"Year 02",year:"2027 – 2028",semesters:[
    {id:"n-y2s1",label:"Semester 01",subjects:[
      {id:"n-y2s1-comp",label:"Comparative Education",recId:"r-y2s1-comp"},
      {id:"n-y2s1-guid",label:"Guidance & Counselling",recId:"r-y2s1-guid"},
      {id:"n-y2s1-meas",label:"Measurements & Evaluation in Education",recId:"r-y2s1-meas"},
      {id:"n-y2s1-eng1",label:"Structure of English I (Phonetics, Phonology)",recId:"r-y2s1-eng1"},
      {id:"n-y2s1-eng2",label:"Structure of English II (Morphology)",recId:"r-y2s1-eng2"},
      {id:"n-y2s1-eng3",label:"Structure of English III (Syntax & Semantics)",recId:"r-y2s1-eng3"},
      {id:"n-y2s1-call",label:"Computer Assisted Language Learning",recId:"r-y2s1-call"}
    ]},
    {id:"n-y2s2",label:"Semester 02",subjects:[
      {id:"n-y2s2-aest",label:"Aesthetic Education",recId:"r-y2s2-aest"},
      {id:"n-y2s2-emgmt",label:"Educational Management",recId:"r-y2s2-emgmt"},
      {id:"n-y2s2-val",label:"Value Education",recId:"r-y2s2-val"},
      {id:"n-y2s2-ls",label:"Teaching, Listening & Speaking",recId:"r-y2s2-ls"},
      {id:"n-y2s2-writ",label:"Teaching Writing Skills",recId:"r-y2s2-writ"},
      {id:"n-y2s2-lp",label:"Lesson Planning & ELT Material",recId:"r-y2s2-lp"},
      {id:"n-y2s2-slle",label:"Sri Lankan Literature in English",recId:"r-y2s2-slle"}
    ]}
  ]},
  {id:"n-y3",label:"Year 03",year:"2028 – 2029",semesters:[
    {id:"n-y3s1",label:"Semester 01",subjects:[
      {id:"n-y3s1-clmgmt",label:"Classroom Management",recId:"r-y3s1-clmgmt"},
      {id:"n-y3s1-child",label:"Children's Rights",recId:"r-y3s1-child"},
      {id:"n-y3s1-tp",label:"Teaching Practice",recId:"r-y3s1-tp"},
      {id:"n-y3s1-port",label:"Portfolio",recId:"r-y3s1-port"},
      {id:"n-y3s1-disc",label:"Discourse Analysis",recId:"r-y3s1-disc"},
      {id:"n-y3s1-sla",label:"Second Language Acquisition/Learning & ESL in Sri Lanka",recId:"r-y3s1-sla"}
    ]},
    {id:"n-y3s2",label:"Semester 02",subjects:[
      {id:"n-y3s2-curr",label:"Curriculum Theory & Practice",recId:"r-y3s2-curr"},
      {id:"n-y3s2-pe",label:"Physical Education",recId:"r-y3s2-pe"},
      {id:"n-y3s2-eltcur",label:"ELT Curriculum in Sri Lanka",recId:"r-y3s2-eltcur"},
      {id:"n-y3s2-litth",label:"Literary Theory in English",recId:"r-y3s2-litth"},
      {id:"n-y3s2-shak",label:"Shakespearean Drama",recId:"r-y3s2-shak"},
      {id:"n-y3s2-test",label:"Testing & Evaluation in Second Language Teaching",recId:"r-y3s2-test"}
    ]}
  ]},
  {id:"n-y4",label:"Year 04",year:"2029 – 2030",semesters:[
    {id:"n-y4s1",label:"Semester 01",subjects:[
      {id:"n-y4s1-res",label:"Research Methods",recId:"r-y4s1-res"},
      {id:"n-y4s1-vic",label:"Victorian Literature",recId:"r-y4s1-vic"},
      {id:"n-y4s1-rom",label:"Romantic Poetry",recId:"r-y4s1-rom"},
      {id:"n-y4s1-eltcd",label:"ELT Curriculum Design",recId:"r-y4s1-eltcd"}
    ]},
    {id:"n-y4s2",label:"Semester 02",subjects:[
      {id:"n-y4s2-amer",label:"Introduction to American Literature (Optional)",recId:"r-y4s2-amer"},
      {id:"n-y4s2-aug",label:"Augustan Literature (Optional)",recId:"r-y4s2-aug"},
      {id:"n-y4s2-post",label:"Post-Colonial Literature (Optional)",recId:"r-y4s2-post"},
      {id:"n-y4s2-diss",label:"Dissertation",recId:"r-y4s2-diss"}
    ]}
  ]}
];

// ── File type helpers ──────────────────────────────────────
const FT_MAP = {
  PDF:'ft-pdf',DOCX:'ft-docx',DOC:'ft-docx',PPTX:'ft-pptx',PPT:'ft-pptx',
  XLSX:'ft-xlsx',XLS:'ft-xlsx',ZIP:'ft-zip',IMG:'ft-img',JPG:'ft-img',
  PNG:'ft-img',TXT:'ft-txt',MD:'ft-txt',VIDEO:'ft-video'
};
function normalizeType(t) {
  if (!t) return 'OTHER';
  return String(t).replace(/^ft[-_]?/i,'').trim().toUpperCase();
}
function ftClass(t) { return FT_MAP[normalizeType(t)] || 'ft-other'; }
function ftLabel(t) { return String(t).replace(/^ft[-_]?/i,'').trim().toUpperCase() || 'FILE'; }

// ── Extract Google Drive file ID from any Drive URL ────────
function getDriveId(url) {
  if (!url) return null;
  let m;
  m = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/); if (m) return m[1];
  m = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/); if (m) return m[1];
  m = url.match(/drive\.google\.com\/uc\?[^"']*id=([a-zA-Z0-9_-]+)/); if (m) return m[1];
  return null;
}

// ── Build direct download URL ──────────────────────────────
function buildDlUrl(url) {
  if (!url) return '#';
  if (!url.startsWith('http')) return url;
  const id = getDriveId(url);
  if (id) return 'https://drive.google.com/uc?export=download&id=' + id + '&confirm=t';
  let m;
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
function buildPreviewUrl(url, fileType) {
  if (!url) return null;
  var nt = normalizeType(fileType);
  if (nt === 'VIDEO') return null;
  if (!url.startsWith('http')) return url;
  var id = getDriveId(url);
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
// Proxy streams file from its own domain so Android never
// sees a Drive URL — no app hijacking, full file size
function dlFile(url, name, fileType) {
  if (!url || url === '#') return;
  var rawExt = String(fileType || '').replace(/^ft[-_]?/i,'').trim().toLowerCase();
  var noExt  = ['other','video',''].includes(rawExt);
  var dlUrl  = buildDlUrl(url);
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
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:.55rem .95rem;background:linear-gradient(135deg,#1e3a8a,#3b6fd4);gap:.4rem;flex-shrink:0">' +
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
            '<div style="width:36px;height:36px;border:3px solid var(--border);border-top-color:#6ea8fe;border-radius:50%;animation:fpSpin .7s linear infinite"></div>' +
            '<span style="font-size:.72rem;color:var(--muted);font-family:Nunito,sans-serif">Loading preview\u2026</span>' +
          '</div>' +
          '<style>@keyframes fpSpin{to{transform:rotate(360deg)}}</style>' +
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
function detectVideoType(url) {
  if (!url) return 'other';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/drive\.google\.com/.test(url)) return 'drive';
  return 'other';
}
function extractYTId(url) {
  var m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}
function nOpenPlayer(title, url) {
  var modal = document.getElementById('nVidModal'), ovl = document.getElementById('nVidOvl');
  var ttl = document.getElementById('nVidTitle'), embed = document.getElementById('nVidEmbed');
  ttl.textContent = title; embed.innerHTML = '';
  ovl.classList.add('open'); modal.classList.add('open');
  var vt = detectVideoType(url);
  if (vt === 'youtube') {
    var id = extractYTId(url);
    if (!id) { embed.innerHTML = '<div style="color:#fff;padding:2rem;text-align:center">Invalid YouTube URL</div>'; return; }
    embed.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1" allowfullscreen allow="autoplay;fullscreen;accelerometer;gyroscope;picture-in-picture;web-share" loading="lazy"></iframe>';
  } else if (vt === 'drive') {
    var did = getDriveId(url);
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
function nClosePlayer() {
  document.getElementById('nVidModal').classList.remove('open');
  document.getElementById('nVidOvl').classList.remove('open');
  setTimeout(function () { var e = document.getElementById('nVidEmbed'); if (e) e.innerHTML = ''; }, 300);
}
function nMaybeClose(e) { if (e.target === document.getElementById('nVidOvl')) nClosePlayer(); }
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') nClosePlayer(); });

// ── Build file card ────────────────────────────────────────
function buildFileCard(file) {
  var ft = file.fileType || file.filetype || '';
  var nt = normalizeType(ft);
  var isVideo = (nt === 'VIDEO');
  var fc = ftClass(ft), fl = ftLabel(ft);
  var nm = (file.name || '').replace(/'/g, "\\'");
  var url = file.url || '';
  var safeUrl = url.replace(/'/g, "\\'");
  var desc = file.desc ? '<div class="file-desc">' + file.desc + '</div>' : '';

  if (isVideo) {
    return '<div class="file-card">' +
      '<div class="ft-badge ft-video"><i class="fa-solid fa-play" style="font-size:.7rem;margin-left:1px"></i></div>' +
      '<div class="file-info"><div class="file-name">' + (file.name || 'Video') + '</div>' + desc + '</div>' +
      '<button class="dl-btn dl-btn--play" onclick="nOpenPlayer(\'' + nm + '\',\'' + safeUrl + '\')" title="Play"><i class="fa-solid fa-play"></i><span> Play</span></button>' +
    '</div>';
  }

  var previewUrl = buildPreviewUrl(url, ft);
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

function buildFileList(files) {
  if (!files || !files.length) return '<p class="cat-empty"><i class="fa-regular fa-clock"></i>&nbsp; Coming soon\u2026</p>';
  return '<div class="file-list">' + files.map(buildFileCard).join('') + '</div>';
}

// ── Accordion builders ─────────────────────────────────────
function buildSubject(subj) {
  var watch = subj.recId
    ? '<a href="recordings.html#' + subj.recId + '" class="watch-link"><i class="fa-solid fa-circle-play"></i> Watch all recordings for this subject \u2192</a>'
    : '';
  return '<div class="subj-item" data-acc-item id="' + subj.id + '">' +
    '<button class="subj-head acc-head" data-acc-head aria-expanded="false">' +
      '<i class="fa-solid fa-book-bookmark subj-icon"></i>' +
      '<div class="subj-label-wrap"><span class="subj-label">' + subj.label + '</span></div>' +
      '<i class="fa-solid fa-chevron-right acc-chev subj-chev"></i>' +
    '</button>' +
    '<div class="acc-body"><div class="acc-body-inner"><div class="subj-body-inner">' +
      '<div class="cat-block"><div class="cat-head cat-lec"><i class="fa-solid fa-chalkboard-user"></i> Lecturer Notes</div>' + buildFileList(subj.lecturerNotes) + '</div>' +
      '<div class="cat-block"><div class="cat-head cat-aana"><i class="fa-solid fa-pen-nib"></i> \u0d86\u0db1\u0dcf\u0d9c\u0dda Notes</div>' + buildFileList(subj.aanaNotes) + '</div>' +
      '<div class="cat-block"><div class="cat-head cat-paper"><i class="fa-solid fa-scroll"></i> Past Papers</div>' + buildFileList(subj.pastPapers) + '</div>' +
      watch +
    '</div></div></div>' +
  '</div>';
}

function buildSemester(sem) {
  var inner = sem.subjects.length
    ? sem.subjects.map(buildSubject).join('')
    : '<div class="acc-empty"><i class="fa-regular fa-folder-open"></i><span>No content yet.</span></div>';
  var meta = sem.subjects.length ? sem.subjects.length + ' subject' + (sem.subjects.length > 1 ? 's' : '') : 'Empty';
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
  var total = year.semesters.reduce(function (n, s) { return n + s.subjects.length; }, 0);
  var badge = year.semesters.length
    ? year.semesters.length + ' sem' + (year.semesters.length > 1 ? 's' : '') + (total ? ' \u00b7 ' + total + ' subj' : '')
    : 'Upcoming';
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
  while (node && node.id !== 'notesRoot') {
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
  var root = document.getElementById('notesRoot'); if (!root) return;
  var CACHE_KEY = 'kuppia_notes_v2';
  var CACHE_TTL = 30 * 60 * 1000;
  var apiData = {};

  // Always load cache first — page never goes blank on repeat visits
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
        var res = await DSVB.api('notes');
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
    DSVB.api('notes').then(function (r) { return r.ok ? r.json() : null; }).then(function (json) {
      if (!isBad(json)) try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: json })); } catch (_) {}
    }).catch(function () {});
  }

  NOTES_STRUCTURE.forEach(function (year) {
    year.semesters.forEach(function (sem) {
      sem.subjects.forEach(function (subj) {
        var d = apiData[subj.id] || {};
        subj.lecturerNotes = d.lecturerNotes || [];
        subj.aanaNotes     = d.aanaNotes     || [];
        subj.pastPapers    = d.pastPapers    || [];
      });
    });
  });

  root.innerHTML = NOTES_STRUCTURE.map(buildYear).join('');

  root.addEventListener('click', function (e) {
    var head = e.target.closest('[data-acc-head]'); if (!head) return;
    var item = head.closest('[data-acc-item]'); if (!item) return;
    item.classList.toggle('open');
    head.setAttribute('aria-expanded', String(item.classList.contains('open')));
  });

  handleHash();
  window.addEventListener('hashchange', handleHash);
}());
