// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RECORDINGS.JS — data comes from Supabase via js/data.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const RECORDINGS_STRUCTURE = [
  {id:"r-y1",label:"Year 01",year:"2026 – 2027",semesters:[
    {id:"r-y1s1",label:"Semester 01",subjects:[
      {id:"r-y1s1-phil",label:"Philosophical Foundation of Education"},
      {id:"r-y1s1-ict",label:"ICT for Education"},
      {id:"r-y1s1-soft",label:"Soft Skills for Teachers"},
      {id:"r-y1s1-bcelt",label:"Basic Concepts in English Language Teaching"},
      {id:"r-y1s1-intro",label:"Introduction to English Language and English Grammar"},
      {id:"r-y1s1-elit",label:"Introduction to English Literature"}
    ]},
    {id:"r-y1s2",label:"Semester 02",subjects:[
      {id:"r-y1s2-psych",label:"Psychological Foundation of Education"},
      {id:"r-y1s2-tmeth",label:"Teaching Methods General & Special"},
      {id:"r-y1s2-socio",label:"Sociological Foundation of Education"},
      {id:"r-y1s2-litper",label:"Background to Literary Periods"},
      {id:"r-y1s2-eltm",label:"ELT Methodology"},
      {id:"r-y1s2-rw",label:"Teaching Reading & Writing"}
    ]}
  ]},
  {id:"r-y2",label:"Year 02",year:"2027 – 2028",semesters:[
    {id:"r-y2s1",label:"Semester 01",subjects:[
      {id:"r-y2s1-comp",label:"Comparative Education"},
      {id:"r-y2s1-guid",label:"Guidance & Counselling"},
      {id:"r-y2s1-meas",label:"Measurements & Evaluation in Education"},
      {id:"r-y2s1-eng1",label:"Structure of English I (Phonetics, Phonology)"},
      {id:"r-y2s1-eng2",label:"Structure of English II (Morphology)"},
      {id:"r-y2s1-eng3",label:"Structure of English III (Syntax & Semantics)"},
      {id:"r-y2s1-call",label:"Computer Assisted Language Learning"}
    ]},
    {id:"r-y2s2",label:"Semester 02",subjects:[
      {id:"r-y2s2-aest",label:"Aesthetic Education"},
      {id:"r-y2s2-emgmt",label:"Educational Management"},
      {id:"r-y2s2-val",label:"Value Education"},
      {id:"r-y2s2-ls",label:"Teaching, Listening & Speaking"},
      {id:"r-y2s2-writ",label:"Teaching Writing Skills"},
      {id:"r-y2s2-lp",label:"Lesson Planning & ELT Material"},
      {id:"r-y2s2-slle",label:"Sri Lankan Literature in English"}
    ]}
  ]},
  {id:"r-y3",label:"Year 03",year:"2028 – 2029",semesters:[
    {id:"r-y3s1",label:"Semester 01",subjects:[
      {id:"r-y3s1-clmgmt",label:"Classroom Management"},
      {id:"r-y3s1-child",label:"Children's Rights"},
      {id:"r-y3s1-tp",label:"Teaching Practice"},
      {id:"r-y3s1-port",label:"Portfolio"},
      {id:"r-y3s1-disc",label:"Discourse Analysis"},
      {id:"r-y3s1-sla",label:"Second Language Acquisition/Learning & ESL in Sri Lanka"}
    ]},
    {id:"r-y3s2",label:"Semester 02",subjects:[
      {id:"r-y3s2-curr",label:"Curriculum Theory & Practice"},
      {id:"r-y3s2-pe",label:"Physical Education"},
      {id:"r-y3s2-eltcur",label:"ELT Curriculum in Sri Lanka"},
      {id:"r-y3s2-litth",label:"Literary Theory in English"},
      {id:"r-y3s2-shak",label:"Shakespearean Drama"},
      {id:"r-y3s2-test",label:"Testing & Evaluation in Second Language Teaching"}
    ]}
  ]},
  {id:"r-y4",label:"Year 04",year:"2029 – 2030",semesters:[
    {id:"r-y4s1",label:"Semester 01",subjects:[
      {id:"r-y4s1-res",label:"Research Methods"},
      {id:"r-y4s1-vic",label:"Victorian Literature"},
      {id:"r-y4s1-rom",label:"Romantic Poetry"},
      {id:"r-y4s1-eltcd",label:"ELT Curriculum Design"}
    ]},
    {id:"r-y4s2",label:"Semester 02",subjects:[
      {id:"r-y4s2-amer",label:"Introduction to American Literature (Optional)"},
      {id:"r-y4s2-aug",label:"Augustan Literature (Optional)"},
      {id:"r-y4s2-post",label:"Post-Colonial Literature (Optional)"},
      {id:"r-y4s2-diss",label:"Dissertation"}
    ]}
  ]}
];

// ── Video helpers ──────────────────────────────────────────
function detectVideoType(url) {
  if (!url) return 'other';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/drive\.google\.com/.test(url))     return 'drive';
  return 'other';
}
function extractYTId(url) {
  const m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) || url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}
function toDriveEmbed(url) {
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/open\?id=([a-zA-Z0-9_-]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url;
}
function vtBadgeClass(t) { return t==='youtube'?'vt-yt':t==='drive'?'vt-drive':'vt-other'; }
function vtBadgeLabel(t) { return t==='youtube'?'YouTube':t==='drive'?'Drive':'Video'; }

// ── Video player ───────────────────────────────────────────
function openPlayer(vid) {
  const modal = document.getElementById('vidModal');
  const ovl   = document.getElementById('vidOvl');
  const ttl   = document.getElementById('vidTitle');
  const embed = document.getElementById('vidEmbed');
  const noteBtn = document.getElementById('vidNoteBtn');

  ttl.textContent = vid.date ? `${vid.label}  ·  ${vid.date}` : vid.label;
  embed.innerHTML = '';

  if (vid.noteId) {
    noteBtn.style.display = 'flex';
    noteBtn.onclick = () => { closePlayer(); window.location.href = `notes#${vid.noteId}`; };
  } else {
    noteBtn.style.display = 'none';
  }

  ovl.classList.add('open');
  modal.classList.add('open');

  // One universal player for YouTube, Drive, Vimeo and direct files (js/players.js)
  DSVBPlayer.mount(embed, vid.url, { title: vid.label, autoplay: true, compact: true });
}

function closePlayer() {
  document.getElementById('vidModal').classList.remove('open');
  document.getElementById('vidOvl').classList.remove('open');
  setTimeout(() => { const e=document.getElementById('vidEmbed'); if(e) DSVBPlayer.destroy(e); }, 300);
}
function maybeClosePlayer(e) { if (e.target===document.getElementById('vidOvl')) closePlayer(); }
document.addEventListener('keydown', e => { if (e.key==='Escape') closePlayer(); });

// ── Build video list ───────────────────────────────────────
function buildVideoList(videos) {
  if (!videos || !videos.length) {
    return '<div class="vid-empty"><i class="fa-regular fa-clock"></i> No recordings yet — check back soon.</div>';
  }
  return `<div class="vid-list">${videos.map((vid, i) => {
    const vt      = detectVideoType(vid.url);
    const safeVid = JSON.stringify({label:vid.label,date:vid.date,url:vid.url,noteId:vid.noteId||''})
                        .replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    const noteTag = vid.noteId
      ? `<a class="vid-note-tag" href="notes#${vid.noteId}" title="View notes" onclick="event.stopPropagation()"><i class="fa-solid fa-book-open"></i></a>`
      : '';
    return `<div class="vid-item" onclick="openPlayer(${safeVid.replace(/"/g,"'")})" style="animation-delay:${0.05*i}s">
      <div class="vid-num">${String(i+1).padStart(2,'0')}</div>
      <div class="vid-info">
        <div class="vid-label">${vid.label}</div>
        <div class="vid-date">${vid.date}</div>
      </div>
      <span class="vid-type-badge ${vtBadgeClass(vt)}">${vtBadgeLabel(vt)}</span>
      ${noteTag}
      <button class="vid-play-btn" tabindex="-1" aria-hidden="true"><i class="fa-solid fa-play" style="margin-left:2px"></i></button>
    </div>`;
  }).join('')}</div>`;
}

function buildSubject(subj) {
  const cnt = subj.videos ? subj.videos.length : 0;
  return `
  <div class="subj-item" data-acc-item id="${subj.id}">
    <button class="subj-head acc-head" data-acc-head aria-expanded="false">
      <i class="fa-solid fa-film subj-icon"></i>
      <span class="subj-label">${subj.label}</span>
      ${cnt ? `<span class="vid-count">${cnt} video${cnt>1?'s':''}</span>` : ''}
      <i class="fa-solid fa-chevron-right acc-chev subj-chev"></i>
    </button>
    <div class="acc-body"><div class="acc-body-inner">
      <div class="subj-body-inner">${buildVideoList(subj.videos)}</div>
    </div></div>
  </div>`;
}

function buildSemester(sem) {
  const inner = sem.subjects.length
    ? sem.subjects.map(buildSubject).join('')
    : '<div class="acc-empty"><i class="fa-regular fa-folder-open"></i><span>No recordings yet.</span></div>';
  const meta = sem.subjects.length ? `${sem.subjects.length} subjects` : 'Empty';
  return `
  <div class="sem-item" data-acc-item id="${sem.id}">
    <button class="sem-head acc-head" data-acc-head aria-expanded="false">
      <i class="fa-solid fa-layer-group sem-icon"></i>
      <span class="sem-label">${sem.label}</span>
      <span class="sem-meta">${meta}</span>
      <i class="fa-solid fa-chevron-right acc-chev sem-chev"></i>
    </button>
    <div class="acc-body"><div class="acc-body-inner">
      <div class="sem-body-inner">${inner}</div>
    </div></div>
  </div>`;
}

function buildYear(year) {
  const inner = year.semesters.length
    ? year.semesters.map(buildSemester).join('')
    : '<div class="acc-empty"><i class="fa-regular fa-folder-open"></i><span>No content yet.</span></div>';
  const badge = year.semesters.length ? `${year.semesters.length} semesters` : 'Upcoming';
  return `
  <div class="year-item" data-acc-item id="${year.id}">
    <button class="year-head acc-head" data-acc-head aria-expanded="false">
      <i class="fa-solid fa-chevron-right acc-chev year-chev"></i>
      <span class="year-num">${year.label} <small>${year.year}</small></span>
      <span class="year-badge">${badge}</span>
    </button>
    <div class="acc-body"><div class="acc-body-inner">
      <div class="year-body-inner">${inner}</div>
    </div></div>
  </div>`;
}

function handleHash() {
  const id = location.hash.slice(1);
  if (!id) return;
  const el = document.getElementById(id);
  if (!el || !el.hasAttribute('data-acc-item')) return;
  let node = el.parentElement;
  while (node && node.id !== 'recRoot') {
    if (node.hasAttribute('data-acc-item')) {
      node.classList.add('open');
      node.querySelector(':scope > [data-acc-head]')?.setAttribute('aria-expanded','true');
    }
    node = node.parentElement;
  }
  el.classList.add('open');
  el.querySelector(':scope > [data-acc-head]')?.setAttribute('aria-expanded','true');
  setTimeout(() => el.scrollIntoView({behavior:'smooth',block:'start'}), 150);
}

// ── MAIN ──────────────────────────────────────────────────
(async function init() {
  const root = document.getElementById('recRoot');
  if (!root) return;

  root.innerHTML = '<div class="acc-empty"><i class="fa-solid fa-spinner fa-spin"></i><span>Loading recordings…</span></div>';

  const CACHE_KEY = 'kuppia_recs_v1';
  const CACHE_TTL = 5 * 60 * 1000;
  let apiData = {};
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { ts, data } = JSON.parse(cached);
      if (Date.now() - ts < CACHE_TTL) apiData = data;
    }
  } catch(_) {}
  if (!Object.keys(apiData).length) {
    try {
      const res = await DSVB.api('recordings');
      if (!res.ok) throw new Error('load failed');
      apiData = await res.json();
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ts: Date.now(), data: apiData})); } catch(_) {}
    } catch (e) {
      root.innerHTML = '<div class="acc-empty"><i class="fa-regular fa-circle-xmark"></i><span>Could not load recordings. Please refresh.</span></div>';
      return;
    }
  } else {
    DSVB.api('recordings').then(r => r.ok ? r.json() : null).then(data => { if (!data) return;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ts: Date.now(), data})); } catch(_) {}
    }).catch(() => {});
  }

  RECORDINGS_STRUCTURE.forEach(year => {
    year.semesters.forEach(sem => {
      sem.subjects.forEach(subj => {
        subj.videos = apiData[subj.id] || [];
      });
    });
  });

  root.innerHTML = RECORDINGS_STRUCTURE.map(buildYear).join('');

  root.addEventListener('click', e => {
    const head = e.target.closest('[data-acc-head]');
    if (!head) return;
    const item = head.closest('[data-acc-item]');
    if (!item) return;
    const open = item.classList.toggle('open');
    head.setAttribute('aria-expanded', String(open));
  });

  handleHash();
  window.addEventListener('hashchange', handleHash);
})();
