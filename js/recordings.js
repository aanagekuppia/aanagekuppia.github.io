/* ════════════════════════════════════════════════════════════
   js/recordings.js  —  Recordings page logic

   ✏️  SECTION 1 = Edit video entries here.
   ⚙️  SECTION 2+ = Player engine — edit with care.

   Supported URL / path formats:
     YouTube:    https://www.youtube.com/watch?v=VIDEO_ID
                 https://youtu.be/VIDEO_ID
                 → uses YouTube's own embedded player
     Drive:      https://drive.google.com/file/d/FILE_ID/view
                 https://drive.google.com/open?id=FILE_ID
                 → uses custom player modal
     Local path: 'recordings/class01.mp4'
                 → uses custom player modal (<video> tag)
     Other URL:  any https://… link
                 → uses custom player modal (iframe)

   VIDEO ENTRY SHAPE:
   {
     label:   'Class 01',
     date:    '2026.03.10',
     url:     'https://youtu.be/…',  // or Drive link or local path
     noteId:  'n-y1s1-phil',          // optional — links to Notes page
   }
════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   ✏️  SECTION 1 — RECORDINGS DATA
════════════════════════════════════════════════════════════ */
const RECORDINGS_DATA = [

  /* ══════════════════════════════════════════════════════════
     YEAR 01  —  2026 – 2027
  ══════════════════════════════════════════════════════════ */
  {
    id: 'r-y1',
    label: 'Year 01',
    year: '2026 – 2027',
    semesters: [

      /* ── Semester 01 ────────────────────────────────── */
      {
        id: 'r-y1s1',
        label: 'Semester 01',
        subjects: [
          {
            id:    'r-y1s1-phil',
            label: 'Philosophical Foundation of Education',
            videos: [
              { label: 'Day 01 - 2026.03.08', date: 'Philosophy & Education', url: 'https://drive.google.com/file/d/1vjuhsrYg4jan11IVpB5o3qUbSQxknnl6/view?usp=sharing', noteId: 'n-y1s1-phil' }
              // { label: 'Class 01', date: '2026.03.10', url: '', noteId: 'n-y1s1-phil' },
            ],
          },
          { id: 'r-y1s1-ict',   label: 'ICT for Education',                                        videos: [] },
          { id: 'r-y1s1-soft',  label: 'Soft Skills for Teachers',                                 videos: [] },
          { id: 'r-y1s1-bcelt', 
            label: 'Basic Concepts in English Language Teaching',              
            videos: [
              { label: 'Day 01 - 2026.02.25', date: 'Day 01', url: 'https://drive.google.com/file/d/1ppslIsM942pk7DL4QBcBJN-1wBCkNKg3/view?usp=sharing', noteId: 'n-y1s1-bcelt' },
              { label: 'Day 01 - 2026.03.04', date: 'Day 02', url: 'https://drive.google.com/file/d/1-3ko7ZtVrA_PIJFJgrofs7LaRnW5Jb1O/view?usp=sharing', noteId: 'n-y1s1-bcelt' },
              { label: 'Day 01 - 2026.03.11', date: 'Day 03', url: 'https://drive.google.com/file/d/1XipzmIITkCblw0noButJ-yu0mpNbmiZo/view?usp=sharing', noteId: 'n-y1s1-bcelt' }
            ] 
          },
          {
            id:    'r-y1s1-intro',
            label: 'Introduction to English Language and English Grammar',
            videos: [
              { label: 'Day 01 - 2026.03.01', date: 'Lexicon', url: 'https://drive.google.com/file/d/1cnT1uTISNJU_fo_rHtJed56R1E_KAiKX/view?usp=sharing', noteId: 'n-y1s1-intro' },
              { label: 'Day 01 - 2026.03.09', date: 'Writing Systems', url: 'https://drive.google.com/file/d/19rMzBo8MkowRvLRz6tP-oMdJOR7OKHhk/view?usp=sharing', noteId: 'n-y1s1-intro' }
              // { label: 'Class 03', date: '2026.03.17', url: '' },
            ],
          },
          { id: 'r-y1s1-elit',  label: 'Introduction to English Literature',                       videos: [] },
        ],
      },

      /* ── Semester 02 ────────────────────────────────── */
      {
        id: 'r-y1s2',
        label: 'Semester 02',
        subjects: [
          { id: 'r-y1s2-psych',  label: 'Psychological Foundation of Education', videos: [] },
          { id: 'r-y1s2-tmeth',  label: 'Teaching Methods General & Special',    videos: [] },
          { id: 'r-y1s2-socio',  label: 'Sociological Foundation of Education',  videos: [] },
          { id: 'r-y1s2-litper', label: 'Background to Literary Periods',        videos: [] },
          { id: 'r-y1s2-eltm',   label: 'ELT Methodology',                       videos: [] },
          { id: 'r-y1s2-rw',     label: 'Teaching Reading & Writing',            videos: [] },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     YEAR 02  —  2027 – 2028
  ══════════════════════════════════════════════════════════ */
  {
    id: 'r-y2',
    label: 'Year 02',
    year: '2027 – 2028',
    semesters: [
      {
        id: 'r-y2s1',
        label: 'Semester 01',
        subjects: [
          { id: 'r-y2s1-comp',  label: 'Comparative Education',                         videos: [] },
          { id: 'r-y2s1-guid',  label: 'Guidance & Counselling',                        videos: [] },
          { id: 'r-y2s1-meas',  label: 'Measurements & Evaluation in Education',        videos: [] },
          { id: 'r-y2s1-eng1',  label: 'Structure of English I (Phonetics, Phonology)', videos: [] },
          { id: 'r-y2s1-eng2',  label: 'Structure of English II (Morphology)',           videos: [] },
          { id: 'r-y2s1-eng3',  label: 'Structure of English III (Syntax & Semantics)', videos: [] },
          { id: 'r-y2s1-call',  label: 'Computer Assisted Language Learning',           videos: [] },
        ],
      },
      {
        id: 'r-y2s2',
        label: 'Semester 02',
        subjects: [
          { id: 'r-y2s2-aest',  label: 'Aesthetic Education',            videos: [] },
          { id: 'r-y2s2-emgmt', label: 'Educational Management',         videos: [] },
          { id: 'r-y2s2-val',   label: 'Value Education',                videos: [] },
          { id: 'r-y2s2-ls',    label: 'Teaching, Listening & Speaking', videos: [] },
          { id: 'r-y2s2-writ',  label: 'Teaching Writing Skills',        videos: [] },
          { id: 'r-y2s2-lp',    label: 'Lesson Planning & ELT Material', videos: [] },
          { id: 'r-y2s2-slle',  label: 'Sri Lankan Literature in English', videos: [] },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     YEAR 03  —  2028 – 2029
  ══════════════════════════════════════════════════════════ */
  {
    id: 'r-y3',
    label: 'Year 03',
    year: '2028 – 2029',
    semesters: [
      {
        id: 'r-y3s1',
        label: 'Semester 01',
        subjects: [
          { id: 'r-y3s1-clmgmt', label: 'Classroom Management',                                  videos: [] },
          { id: 'r-y3s1-child',  label: "Children's Rights",                                     videos: [] },
          { id: 'r-y3s1-tp',     label: 'Teaching Practice',                                     videos: [] },
          { id: 'r-y3s1-port',   label: 'Portfolio',                                             videos: [] },
          { id: 'r-y3s1-disc',   label: 'Discourse Analysis',                                    videos: [] },
          { id: 'r-y3s1-sla',    label: 'Second Language Acquisition/Learning & ESL in Sri Lanka', videos: [] },
        ],
      },
      {
        id: 'r-y3s2',
        label: 'Semester 02',
        subjects: [
          { id: 'r-y3s2-curr',   label: 'Curriculum Theory & Practice',                    videos: [] },
          { id: 'r-y3s2-pe',     label: 'Physical Education',                              videos: [] },
          { id: 'r-y3s2-eltcur', label: 'ELT Curriculum in Sri Lanka',                    videos: [] },
          { id: 'r-y3s2-litth',  label: 'Literary Theory in English',                     videos: [] },
          { id: 'r-y3s2-shak',   label: 'Shakespearean Drama',                            videos: [] },
          { id: 'r-y3s2-test',   label: 'Testing & Evaluation in Second Language Teaching', videos: [] },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     YEAR 04  —  2029 – 2030
  ══════════════════════════════════════════════════════════ */
  {
    id: 'r-y4',
    label: 'Year 04',
    year: '2029 – 2030',
    semesters: [
      {
        id: 'r-y4s1',
        label: 'Semester 01',
        subjects: [
          { id: 'r-y4s1-res',   label: 'Research Methods',       videos: [] },
          { id: 'r-y4s1-vic',   label: 'Victorian Literature',   videos: [] },
          { id: 'r-y4s1-rom',   label: 'Romantic Poetry',        videos: [] },
          { id: 'r-y4s1-eltcd', label: 'ELT Curriculum Design',  videos: [] },
        ],
      },
      {
        id: 'r-y4s2',
        label: 'Semester 02',
        subjects: [
          { id: 'r-y4s2-amer', label: 'Introduction to American Literature (Optional)', videos: [] },
          { id: 'r-y4s2-aug',  label: 'Augustan Literature (Optional)',                 videos: [] },
          { id: 'r-y4s2-post', label: 'Post-Colonial Literature (Optional)',            videos: [] },
          { id: 'r-y4s2-diss', label: 'Dissertation',                                  videos: [] },
        ],
      },
    ],
  },
];

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 2 — VIDEO URL DETECTION
════════════════════════════════════════════════════════════ */
function detectVideoType(url) {
  if (!url) return 'other';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/drive\.google\.com/.test(url))      return 'drive';
  return 'other'; // local path or generic URL
}

function extractYTId(url) {
  const m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
         || url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function toDriveEmbed(url) {
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
         || url.match(/open\?id=([a-zA-Z0-9_-]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url;
}

function vtBadgeClass(type) {
  return type === 'youtube' ? 'vt-yt' : type === 'drive' ? 'vt-drive' : 'vt-other';
}
function vtBadgeLabel(type) {
  return type === 'youtube' ? 'YouTube' : type === 'drive' ? 'Drive' : 'Video';
}

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 3 — PLAYER
   YouTube → YT's own embedded iframe (inside the modal)
   Drive / local / other → iframe or <video> inside the modal
════════════════════════════════════════════════════════════ */
function openPlayer(item) {
  const modal   = document.getElementById('vidModal');
  const ovl     = document.getElementById('vidOvl');
  const titleEl = document.getElementById('vidTitle');
  const embed   = document.getElementById('vidEmbed');
  const noteBtn = document.getElementById('vidNoteBtn');

  titleEl.textContent = `${item.label}  ·  ${item.date}`;
  embed.innerHTML = '';

  if (item.noteId) {
    noteBtn.style.display = 'flex';
    noteBtn.onclick = () => { closePlayer(); window.location.href = `notes.php#${item.noteId}`; };
  } else {
    noteBtn.style.display = 'none';
  }

  const type = detectVideoType(item.url);
  ovl.classList.add('open');
  modal.classList.add('open');

  if (type === 'youtube') {
    const vid = extractYTId(item.url);
    if (!vid) {
      embed.innerHTML = `<div style="color:#fff;padding:2rem;text-align:center;font-family:sans-serif">Invalid YouTube URL</div>`;
      return;
    }
    /* YouTube's own embedded player — standard iframe */
    embed.innerHTML = `<iframe
      src="https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1"
      allowfullscreen
      allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; web-share"
      loading="lazy"></iframe>`;
  } else if (type === 'drive') {
    embed.innerHTML = `<iframe
      src="${toDriveEmbed(item.url)}"
      allowfullscreen
      allow="autoplay; fullscreen"
      loading="lazy"></iframe>`;
  } else {
    /* Local path or generic URL */
    const ext = item.url.split('?')[0].split('.').pop().toLowerCase();
    if (['mp4','webm','ogg','mov'].includes(ext)) {
      embed.innerHTML = `<video controls autoplay style="position:absolute;top:0;left:0;width:100%;height:100%;background:#000">
        <source src="${item.url}">
      </video>`;
    } else {
      embed.innerHTML = `<iframe
        src="${item.url}"
        allowfullscreen
        allow="autoplay; fullscreen"
        loading="lazy"></iframe>`;
    }
  }
}

function closePlayer() {
  document.getElementById('vidModal').classList.remove('open');
  document.getElementById('vidOvl').classList.remove('open');
  setTimeout(() => {
    const e = document.getElementById('vidEmbed');
    if (e) e.innerHTML = '';
  }, 300);
}

function maybeClosePlayer(e) {
  if (e.target === document.getElementById('vidOvl')) closePlayer();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePlayer();
});

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 4 — HTML BUILDERS
════════════════════════════════════════════════════════════ */
function buildVideoList(videos) {
  if (!videos || !videos.length) {
    return `<div class="vid-empty"><i class="fa-regular fa-clock"></i> No recordings yet — check back soon.</div>`;
  }
  return `<div class="vid-list">${videos.map((v, i) => {
    const type     = detectVideoType(v.url);
    const safeItem = JSON.stringify({ label: v.label, date: v.date, url: v.url, noteId: v.noteId || '' })
                       .replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const noteTag  = v.noteId
      ? `<a class="vid-note-tag" href="notes.php#${v.noteId}" title="View notes for this class" onclick="event.stopPropagation()">
           <i class="fa-solid fa-book-open"></i>
         </a>`
      : '';
    return `<div class="vid-item" onclick="openPlayer(${safeItem.replace(/"/g, "'")})"
                 style="animation-delay:${i * 0.05}s">
      <div class="vid-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="vid-info">
        <div class="vid-label">${v.label}</div>
        <div class="vid-date">${v.date}</div>
      </div>
      <span class="vid-type-badge ${vtBadgeClass(type)}">${vtBadgeLabel(type)}</span>
      ${noteTag}
      <button class="vid-play-btn" tabindex="-1" aria-hidden="true">
        <i class="fa-solid fa-play" style="margin-left:2px"></i>
      </button>
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
      ${cnt ? `<span class="vid-count">${cnt} video${cnt > 1 ? 's' : ''}</span>` : ''}
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
    : `<div class="acc-empty"><i class="fa-regular fa-folder-open"></i><span>No recordings yet.</span></div>`;
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

function buildYear(yr) {
  const inner = yr.semesters.length
    ? yr.semesters.map(buildSemester).join('')
    : `<div class="acc-empty"><i class="fa-regular fa-folder-open"></i><span>No content yet.</span></div>`;
  const badge = yr.semesters.length ? `${yr.semesters.length} semesters` : 'Upcoming';
  return `
  <div class="year-item" data-acc-item id="${yr.id}">
    <button class="year-head acc-head" data-acc-head aria-expanded="false">
      <i class="fa-solid fa-chevron-right acc-chev year-chev"></i>
      <span class="year-num">${yr.label} <small>${yr.year}</small></span>
      <span class="year-badge">${badge}</span>
    </button>
    <div class="acc-body"><div class="acc-body-inner">
      <div class="year-body-inner">${inner}</div>
    </div></div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 5 — RENDER + INIT
════════════════════════════════════════════════════════════ */
(function init() {
  const root = document.getElementById('recRoot');
  if (!root) return;
  root.innerHTML = RECORDINGS_DATA.map(buildYear).join('');

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

function handleHash() {
  const hash = location.hash.slice(1);
  if (!hash) return;
  const target = document.getElementById(hash);
  if (!target || !target.hasAttribute('data-acc-item')) return;
  let el = target.parentElement;
  while (el && el.id !== 'recRoot') {
    if (el.hasAttribute('data-acc-item')) {
      el.classList.add('open');
      el.querySelector(':scope > [data-acc-head]')?.setAttribute('aria-expanded', 'true');
    }
    el = el.parentElement;
  }
  target.classList.add('open');
  target.querySelector(':scope > [data-acc-head]')?.setAttribute('aria-expanded', 'true');
  setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
}
