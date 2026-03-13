/* ════════════════════════════════════════════════════════════
   js/assignments.js  —  Assignments page logic

   ✏️  SECTION 1 = Edit assignment entries here.
   ⚙️  SECTION 2+ = Engine — edit with care.

   FILE TYPES (case-insensitive, 'ft-' prefix also accepted):
     PDF  DOCX  PPTX  PPT  XLSX  XLS  ZIP  IMG  JPG  PNG  TXT  OTHER
     VIDEO  MP4  WEBM  MOV  (inline player)

   URL / PATH formats:
     Google Drive share  →  auto-converted to direct download / embed
     YouTube             →  uses YouTube's own embedded player
     Local file path     →  'assignments/brief.pdf'
     Any other URL       →  used as-is

   SUBJECT SHAPE:
   {
     id:    'a-y1s1-phil',
     label: 'Philosophical Foundation of Education',
     desc:  'Dr. Smith',       // optional — shown in accordion header
     briefFiles: [ … ],
     aanaFiles:  [ … ],
   }

   ENTRY SHAPE (briefFiles / aanaFiles):
   {
     name:     'Assignment 01',
     desc:     'Short subtitle note',    // optional
     category: 'Essay',                  // optional — green pill
     whatToDo: 'Write 1500 words on…',  // optional — blue task bar
     deadline: '20 March 2026',          // optional — red deadline
     files: [
       { name: 'Brief',             fileType: 'PDF',   url: 'assignments/brief.pdf' },
       { name: 'Rubric',            fileType: 'DOCX',  url: 'https://drive.google.com/…' },
       { name: 'Class 01 Recording',fileType: 'VIDEO', url: 'https://youtu.be/…' },
     ],
   }
════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   ✏️  SECTION 1 — ASSIGNMENTS DATA
════════════════════════════════════════════════════════════ */
const ASSIGNMENTS_DATA = [

  /* ══════════════════════════════════════════════════════════
     YEAR 01  —  2026 – 2027
  ══════════════════════════════════════════════════════════ */
  {
    id: 'a-y1',
    label: 'Year 01',
    year: '2026 – 2027',
    semesters: [

      /* ── Semester 01 ────────────────────────────────── */
      {
        id: 'a-y1s1',
        label: 'Semester 01',
        subjects: [
          {
            id:    'a-y1s1-phil',
            label: 'Philosophical Foundation of Education',
            // desc: 'Dr. Perera',
            briefFiles: [
              // {
              //   name:     'Assignment 01',
              //   desc:     'Individual essay',
              //   category: 'Essay',
              //   whatToDo: 'Write a 1500-word essay on the philosophy of education.',
              //   deadline: '20 March 2026',
              //   files: [
              //     { name: 'Brief',  fileType: 'PDF',  url: '' },
              //     { name: 'Rubric', fileType: 'DOCX', url: '' },
              //   ],
              // },
            ],
            aanaFiles: [],
          },
          { id: 'a-y1s1-ict',   label: 'ICT for Education',                                        
            briefFiles: [
              {
                name:     'Assignment - Structured Report Writing',
                desc:     'Report Writing',
                category: 'Report',
                whatToDo: 'Write a 2000–2500 word structured report',
                deadline: 'Unsure - Possibly 30 April 2026',
                files: [
                  { name: 'Instructions', fileType: 'PDF', desc:'Lecturer provided instructions', url: 'assignments/Year 01/Semester 01/ICT for Education/Instructions.pdf' },
                ],
              }
            ], 
            aanaFiles: [] 
          },
          { id: 'a-y1s1-soft',  label: 'Soft Skills for Teachers',                                 
            briefFiles: [
              {
                name:     'Continuous Assessment 01',
                desc:     'Movie Review',
                category: 'Case Study',
                whatToDo: 'Write a 1,000–1,200 word case study analyzing soft skills in the movie',
                deadline: '30 April 2026',
                files: [
                  { name: 'Instructions', fileType: 'DOCX', desc:'Lecturer provided instructions', url: 'assignments/Year 01/Semester 01/Soft Skills for Teachers/CA1-instructions.docx' },
                  { name: 'Video', fileType: 'Video', desc:'Movie - To Sir with Love (1967)', url: 'https://drive.google.com/file/d/1EFxChcV_2GQJn2z0k9-u_SrOQ6nrl6mf/view?usp=sharing' },
                  { name: 'English Subtitles.srt', fileType: 'Other', desc:'Download and open with VLC player', url: 'assignments/Year 01/Semester 01/Soft Skills for Teachers/To_Sir_with_Love_1967.srt' },
                ],
              },
              {
                name:     'Continuous Assessment 02',
                desc:     'Review Report',
                category: 'Report',
                whatToDo: 'Write an 800–1000 word review of the given research paper',
                deadline: '30 May 2026',
                files: [
                  { name: 'Instructions', fileType: 'DOCX', desc:'Lecturer provided instructions', url: 'assignments/Year 01/Semester 01/Soft Skills for Teachers/CA2-instructions.docx' },
                  { name: 'Research Paper', fileType: 'PDF', desc:'Lecturer provided research paper', url: 'assignments/Year 01/Semester 01/Soft Skills for Teachers/CA2-research_paper.pdf' },
                ],
              },
              {
                name:     'Assessment - Portfolio',
                desc:     'Portfolio Creation',
                category: 'Portfolio',
                whatToDo: 'Maintain a handwritten portfolio throughout the program',
                deadline: 'Last day of the module',
                files: [
                  { name: 'Instructions', fileType: 'DOCX', desc:'Lecturer provided instructions', url: 'assignments/Year 01/Semester 01/Soft Skills for Teachers/Portfolio.docx' },
                ],
              }
            ], 
            aanaFiles: [] 
          },
          { id: 'a-y1s1-bcelt', label: 'Basic Concepts in English Language Teaching',              briefFiles: [], aanaFiles: [] },
          { id: 'a-y1s1-intro', label: 'Introduction to English Language and English Grammar',     briefFiles: [], aanaFiles: [] },
          { id: 'a-y1s1-elit',  label: 'Introduction to English Literature',                       briefFiles: [], aanaFiles: [] },
        ],
      },

      /* ── Semester 02 ────────────────────────────────── */
      {
        id: 'a-y1s2',
        label: 'Semester 02',
        subjects: [
          { id: 'a-y1s2-psych',  label: 'Psychological Foundation of Education', briefFiles: [], aanaFiles: [] },
          { id: 'a-y1s2-tmeth',  label: 'Teaching Methods General & Special',    briefFiles: [], aanaFiles: [] },
          { id: 'a-y1s2-socio',  label: 'Sociological Foundation of Education',  briefFiles: [], aanaFiles: [] },
          { id: 'a-y1s2-litper', label: 'Background to Literary Periods',        briefFiles: [], aanaFiles: [] },
          { id: 'a-y1s2-eltm',   label: 'ELT Methodology',                       briefFiles: [], aanaFiles: [] },
          { id: 'a-y1s2-rw',     label: 'Teaching Reading & Writing',            briefFiles: [], aanaFiles: [] },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     YEAR 02  —  2027 – 2028
  ══════════════════════════════════════════════════════════ */
  {
    id: 'a-y2',
    label: 'Year 02',
    year: '2027 – 2028',
    semesters: [
      {
        id: 'a-y2s1',
        label: 'Semester 01',
        subjects: [
          { id: 'a-y2s1-comp',  label: 'Comparative Education',                         briefFiles: [], aanaFiles: [] },
          { id: 'a-y2s1-guid',  label: 'Guidance & Counselling',                        briefFiles: [], aanaFiles: [] },
          { id: 'a-y2s1-meas',  label: 'Measurements & Evaluation in Education',        briefFiles: [], aanaFiles: [] },
          { id: 'a-y2s1-eng1',  label: 'Structure of English I (Phonetics, Phonology)', briefFiles: [], aanaFiles: [] },
          { id: 'a-y2s1-eng2',  label: 'Structure of English II (Morphology)',           briefFiles: [], aanaFiles: [] },
          { id: 'a-y2s1-eng3',  label: 'Structure of English III (Syntax & Semantics)', briefFiles: [], aanaFiles: [] },
          { id: 'a-y2s1-call',  label: 'Computer Assisted Language Learning',           briefFiles: [], aanaFiles: [] },
        ],
      },
      {
        id: 'a-y2s2',
        label: 'Semester 02',
        subjects: [
          { id: 'a-y2s2-aest',  label: 'Aesthetic Education',            briefFiles: [], aanaFiles: [] },
          { id: 'a-y2s2-emgmt', label: 'Educational Management',         briefFiles: [], aanaFiles: [] },
          { id: 'a-y2s2-val',   label: 'Value Education',                briefFiles: [], aanaFiles: [] },
          { id: 'a-y2s2-ls',    label: 'Teaching, Listening & Speaking', briefFiles: [], aanaFiles: [] },
          { id: 'a-y2s2-writ',  label: 'Teaching Writing Skills',        briefFiles: [], aanaFiles: [] },
          { id: 'a-y2s2-lp',    label: 'Lesson Planning & ELT Material', briefFiles: [], aanaFiles: [] },
          { id: 'a-y2s2-slle',  label: 'Sri Lankan Literature in English', briefFiles: [], aanaFiles: [] },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     YEAR 03  —  2028 – 2029
  ══════════════════════════════════════════════════════════ */
  {
    id: 'a-y3',
    label: 'Year 03',
    year: '2028 – 2029',
    semesters: [
      {
        id: 'a-y3s1',
        label: 'Semester 01',
        subjects: [
          { id: 'a-y3s1-clmgmt', label: 'Classroom Management',                                  briefFiles: [], aanaFiles: [] },
          { id: 'a-y3s1-child',  label: "Children's Rights",                                     briefFiles: [], aanaFiles: [] },
          { id: 'a-y3s1-tp',     label: 'Teaching Practice',                                     briefFiles: [], aanaFiles: [] },
          { id: 'a-y3s1-port',   label: 'Portfolio',                                             briefFiles: [], aanaFiles: [] },
          { id: 'a-y3s1-disc',   label: 'Discourse Analysis',                                    briefFiles: [], aanaFiles: [] },
          { id: 'a-y3s1-sla',    label: 'Second Language Acquisition/Learning & ESL in Sri Lanka', briefFiles: [], aanaFiles: [] },
        ],
      },
      {
        id: 'a-y3s2',
        label: 'Semester 02',
        subjects: [
          { id: 'a-y3s2-curr',   label: 'Curriculum Theory & Practice',                    briefFiles: [], aanaFiles: [] },
          { id: 'a-y3s2-pe',     label: 'Physical Education',                              briefFiles: [], aanaFiles: [] },
          { id: 'a-y3s2-eltcur', label: 'ELT Curriculum in Sri Lanka',                    briefFiles: [], aanaFiles: [] },
          { id: 'a-y3s2-litth',  label: 'Literary Theory in English',                     briefFiles: [], aanaFiles: [] },
          { id: 'a-y3s2-shak',   label: 'Shakespearean Drama',                            briefFiles: [], aanaFiles: [] },
          { id: 'a-y3s2-test',   label: 'Testing & Evaluation in Second Language Teaching', briefFiles: [], aanaFiles: [] },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     YEAR 04  —  2029 – 2030
  ══════════════════════════════════════════════════════════ */
  {
    id: 'a-y4',
    label: 'Year 04',
    year: '2029 – 2030',
    semesters: [
      {
        id: 'a-y4s1',
        label: 'Semester 01',
        subjects: [
          { id: 'a-y4s1-res',   label: 'Research Methods',       briefFiles: [], aanaFiles: [] },
          { id: 'a-y4s1-vic',   label: 'Victorian Literature',   briefFiles: [], aanaFiles: [] },
          { id: 'a-y4s1-rom',   label: 'Romantic Poetry',        briefFiles: [], aanaFiles: [] },
          { id: 'a-y4s1-eltcd', label: 'ELT Curriculum Design',  briefFiles: [], aanaFiles: [] },
        ],
      },
      {
        id: 'a-y4s2',
        label: 'Semester 02',
        subjects: [
          { id: 'a-y4s2-amer', label: 'Introduction to American Literature (Optional)', briefFiles: [], aanaFiles: [] },
          { id: 'a-y4s2-aug',  label: 'Augustan Literature (Optional)',                 briefFiles: [], aanaFiles: [] },
          { id: 'a-y4s2-post', label: 'Post-Colonial Literature (Optional)',            briefFiles: [], aanaFiles: [] },
          { id: 'a-y4s2-diss', label: 'Dissertation',                                  briefFiles: [], aanaFiles: [] },
        ],
      },
    ],
  },
];

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 2 — FILE TYPE NORMALISER + CSS CLASS MAP
════════════════════════════════════════════════════════════ */
const FT_ALIAS = {
  DOC:'DOCX', WORD:'DOCX', DOCUMENT:'DOCX',
  XLS:'XLSX', EXCEL:'XLSX', SPREADSHEET:'XLSX',
  PPT:'PPTX', POWERPOINT:'PPTX', SLIDES:'PPTX', PRESENTATION:'PPTX',
  JPEG:'JPG', IMAGE:'IMG', PICTURE:'IMG',
  ARCHIVE:'ZIP', RAR:'ZIP',
  MP4:'VIDEO', WEBM:'VIDEO', MOV:'VIDEO',
};
const FT_MAP = {
  PDF:'ft-pdf', DOCX:'ft-docx', PPTX:'ft-pptx', PPT:'ft-pptx',
  XLSX:'ft-xlsx', XLS:'ft-xlsx', ZIP:'ft-zip',
  IMG:'ft-img', JPG:'ft-img', PNG:'ft-img',
  TXT:'ft-txt', MD:'ft-txt',
  VIDEO:'ft-video',
};

function normalizeType(raw) {
  if (!raw) return 'OTHER';
  const t = String(raw).replace(/^ft[-_]?/i, '').trim().toUpperCase();
  return FT_ALIAS[t] || t || 'OTHER';
}
function ftClass(raw) { return FT_MAP[normalizeType(raw)] || 'ft-other'; }
function ftLabel(raw) { return normalizeType(raw); }

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 3 — URL HELPERS
════════════════════════════════════════════════════════════ */
function buildDlUrl(url) {
  if (!url) return '#';
  if (!url.startsWith('http')) return url; // local path — use as-is

  let m = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`;
  m = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`;

  m = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://docs.google.com/document/d/${m[1]}/export?format=docx`;
  m = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://docs.google.com/spreadsheets/d/${m[1]}/export?format=xlsx`;
  m = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://docs.google.com/presentation/d/${m[1]}/export/pptx`;

  return url;
}

function dlFile(url, name, rawType) {
  if (!url || url === '#') return;
  const ext = normalizeType(rawType).toLowerCase();
  const a   = document.createElement('a');
  a.href    = buildDlUrl(url);
  a.download = (name || 'file') + '.' + (ext !== 'other' ? ext : 'file');
  a.target  = '_blank';
  a.rel     = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ── Video URL detection ── */
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

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 4 — VIDEO PLAYER
   YouTube → embedded YT iframe (YT's own player, no custom chrome)
   Drive / local / other → custom modal overlay
════════════════════════════════════════════════════════════ */
function aOpenPlayer(label, url) {
  const type    = detectVideoType(url);
  const modal   = document.getElementById('aVidModal');
  const ovl     = document.getElementById('aVidOvl');
  const titleEl = document.getElementById('aVidTitle');
  const embed   = document.getElementById('aVidEmbed');

  titleEl.textContent = label;
  embed.innerHTML = '';
  ovl.classList.add('open');
  modal.classList.add('open');

  if (type === 'youtube') {
    const vid = extractYTId(url);
    if (!vid) {
      embed.innerHTML = `<div style="color:#fff;padding:2rem;text-align:center">Invalid YouTube URL</div>`;
      return;
    }
    /* YouTube's own embedded player — standard iframe embed */
    embed.innerHTML = `<iframe
      src="https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1"
      allowfullscreen
      allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; web-share"
      loading="lazy"></iframe>`;
  } else if (type === 'drive') {
    embed.innerHTML = `<iframe src="${toDriveEmbed(url)}" allowfullscreen allow="autoplay;fullscreen" loading="lazy"></iframe>`;
  } else {
    /* Local path or other URL — try <video>, fall back to iframe */
    const ext = url.split('?')[0].split('.').pop().toLowerCase();
    if (['mp4','webm','ogg','mov'].includes(ext)) {
      embed.innerHTML = `<video controls autoplay style="position:absolute;top:0;left:0;width:100%;height:100%;background:#000">
        <source src="${url}">
      </video>`;
    } else {
      embed.innerHTML = `<iframe src="${url}" allowfullscreen allow="autoplay;fullscreen" loading="lazy"></iframe>`;
    }
  }
}

function aClosePlayer() {
  document.getElementById('aVidModal').classList.remove('open');
  document.getElementById('aVidOvl').classList.remove('open');
  setTimeout(() => { const e = document.getElementById('aVidEmbed'); if (e) e.innerHTML = ''; }, 300);
}

function aMaybeClose(e) {
  if (e.target === document.getElementById('aVidOvl')) aClosePlayer();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') aClosePlayer(); });

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 5 — HTML BUILDERS
════════════════════════════════════════════════════════════ */
function buildFileCard(f) {
  const type    = f.fileType || f.filetype || '';
  const normed  = normalizeType(type);
  const isVideo = normed === 'VIDEO';
  const cls     = ftClass(type);
  const lbl     = isVideo ? 'VIDEO' : ftLabel(type);
  const safe    = (f.name || '').replace(/'/g, "\\'");
  const url     = f.url || '';
  const descHtml = f.desc ? `<div class="file-desc">${f.desc}</div>` : '';

  if (isVideo) {
    const safeUrl = url.replace(/'/g, "\\'");
    return `<div class="file-card">
      <div class="ft-badge ft-video"><i class="fa-solid fa-play" style="font-size:.7rem;margin-left:1px"></i></div>
      <div class="file-info">
        <div class="file-name">${f.name || 'Video'}</div>
        ${descHtml}
      </div>
      <button class="dl-btn dl-btn--play" onclick="aOpenPlayer('${safe}','${safeUrl}')" title="Play ${f.name || 'video'}">
        <i class="fa-solid fa-play"></i><span> Play</span>
      </button>
    </div>`;
  }

  return `<div class="file-card">
    <div class="ft-badge ${cls}">${lbl}</div>
    <div class="file-info">
      <div class="file-name">${f.name || lbl}</div>
      ${descHtml}
    </div>
    <button class="dl-btn" onclick="dlFile('${url}','${safe}','${type}')" title="Download ${f.name || lbl}">
      <i class="fa-solid fa-download"></i><span> Download</span>
    </button>
  </div>`;
}

function buildAssignEntry(entry) {
  const files    = entry.files || [];
  const hasFiles = files.some(f => f.url);

  const metaBits = [];
  if (entry.category) metaBits.push(`<span class="assign-cat">${entry.category}</span>`);
  if (entry.deadline)  metaBits.push(`<span class="assign-dl"><i class="fa-regular fa-calendar-xmark"></i> ${entry.deadline}</span>`);

  const whatHtml = entry.whatToDo
    ? `<div class="assign-what"><i class="fa-solid fa-list-check"></i><span>${entry.whatToDo}</span></div>`
    : '';

  const filesHtml = hasFiles
    ? `<div class="file-list">${files.filter(f => f.url).map(buildFileCard).join('')}</div>`
    : `<p class="cat-empty"><i class="fa-regular fa-clock"></i>&nbsp; Coming soon…</p>`;

  return `<div class="assign-entry">
    <div class="assign-entry-hd">
      <span class="assign-entry-name">${entry.name || 'Untitled'}</span>
      ${entry.desc ? `<span class="assign-entry-desc">${entry.desc}</span>` : ''}
      ${metaBits.length ? `<span class="assign-entry-meta">${metaBits.join('')}</span>` : ''}
    </div>
    ${whatHtml}
    ${filesHtml}
  </div>`;
}

function buildAssignList(entries) {
  if (!entries || !entries.length)
    return `<p class="cat-empty"><i class="fa-regular fa-clock"></i>&nbsp; Coming soon…</p>`;
  return entries.map(buildAssignEntry).join('');
}

function buildSubject(subj) {
  /* desc shown as small subtitle in the accordion header */
  const descHtml = subj.desc ? `<span class="subj-desc">${subj.desc}</span>` : '';
  return `
  <div class="subj-item" data-acc-item id="${subj.id}">
    <button class="subj-head acc-head" data-acc-head aria-expanded="false">
      <i class="fa-solid fa-scroll subj-icon"></i>
      <div class="subj-label-wrap">
        <span class="subj-label">${subj.label}</span>
        ${descHtml}
      </div>
      <i class="fa-solid fa-chevron-right acc-chev subj-chev"></i>
    </button>
    <div class="acc-body"><div class="acc-body-inner">
      <div class="subj-body-inner">
        <div class="cat-block">
          <div class="cat-head cat-brief"><i class="fa-solid fa-clipboard-list"></i> Assignment Details</div>
          ${buildAssignList(subj.briefFiles)}
        </div>
        <div class="cat-block">
          <div class="cat-head cat-aana"><i class="fa-solid fa-pen-nib"></i> ආනාගේ Submission</div>
          ${buildAssignList(subj.aanaFiles)}
        </div>
      </div>
    </div></div>
  </div>`;
}

function buildSemester(sem) {
  const inner = sem.subjects.length
    ? sem.subjects.map(buildSubject).join('')
    : `<div class="acc-empty"><i class="fa-regular fa-folder-open"></i><span>No content yet.</span></div>`;
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
   ⚙️  SECTION 6 — RENDER + INIT
════════════════════════════════════════════════════════════ */
(function init() {
  const root = document.getElementById('assignRoot');
  if (!root) return;
  root.innerHTML = ASSIGNMENTS_DATA.map(buildYear).join('');

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
  while (el && el.id !== 'assignRoot') {
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
