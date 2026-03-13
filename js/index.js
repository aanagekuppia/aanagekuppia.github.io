/* ════════════════════════════════════════════════════════════
   js/index.js  —  index page logic
   ────────────────────────────────────────────────────────────
   ✏️  EDIT SECTIONS 1–2 to add/remove content.
   Sections 3–4 are engine code.
════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   ✏️  SECTION 1 — CAROUSEL ITEMS
   type:    'image' or 'video'
   For images:
     src     — webp path
     srcFb   — jpg fallback path
     caption — text shown on slide
   For videos:
     src     — mp4 path
     thumb   — jpg thumbnail
     thumbW  — webp thumbnail (optional)
     caption — text shown on slide
════════════════════════════════════════════════════════════ */
const CAROUSEL_ITEMS = [
  {
    type:    'image',
    src:     'assets/carousal/img01.webp',
    srcFb:   'assets/carousal/img01.jpg',
    caption: '2026 February Batch',
  },
  {
    type:    'image',
    src:     'assets/carousal/img02.webp',
    srcFb:   'assets/carousal/img02.jpg',
    caption: 'ACHS',
  },
  {
    type:    'video',
    src:     'assets/carousal/vid01.mp4',
    thumb:   'assets/carousal/thum01.jpg',
    thumbW:  'assets/carousal/thum01.webp',
    caption: 'ඇස් දෙක පුරා..',
  },
  {
    type:    'video',
    src:     'assets/carousal/vid02.mp4',
    thumb:   'assets/carousal/thum02.jpg',
    thumbW:  'assets/carousal/thum02.webp',
    caption: 'මදේ හිස් ඩිස්..',
  },
];

/* ════════════════════════════════════════════════════════════
   ✏️  SECTION 2 — NOTIFICATIONS
   Each object = one group (column).
   Fields per group:
     category  — group heading text
     icon      — Font Awesome class (e.g. 'fa-pen-to-square')
     iconColor — hex / rgb colour for the icon
     items[]   — array of notification objects:
       color   — 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'orange'
       badge   — 'important' | 'new' | 'done' | 'soon' | 'info' | 'reminder' | 'update'
       title   — bold heading text
       text    — body text (HTML allowed)
       link    — optional URL (adds a link at the bottom)
       linkText— optional link label (default 'View →')
════════════════════════════════════════════════════════════ */
const NOTIFICATIONS = [
  {
    category:  'General Notices',
    icon:      'fa-circle-info',
    iconColor: '#3b82f6',
    items: [
      {
        color: 'green', badge: 'info',
        title: 'Welcome, Ma Mate & Future Batches! 👋',
        text:  'All the things you need for your B.Ed is here and its free. This includes all the Recordings/Notes/Assignments and my submissions too.. Share with your classmates & Good Luck..!',
      },
      {
        color: 'blue',  badge: 'new',
        title: 'All Notes/Recordings/Assignments Uploaded 📄 (2026.03.13)',
        text:  'If you wanna view small descriptions below files, in your device right side top, tap the 3 dots, enable Desktop Site, there ya go.. 😘😊',
      }
    ],
  },
  {
    category:  'Upcoming Assessments',
    icon:      'fa-pen-to-square',
    iconColor: '#f59e0b',
    items: [
      {
        color: 'red',   badge: 'important',
        title: 'ICT - Structured Report Writing',
        text:  'Deadline: <strong>30 April 2026</strong>. Submit via lecturer email.',
      },
      {
        color: 'yellow', badge: 'soon',
        title: 'Soft Skills - Movie Review (CA 01)',
        text:  'Scheduled <strong>30 April 2026</strong>. Submit via lecturer email.',
      },
      {
        color: 'yellow', badge: 'soon',
        title: 'Soft Skills - Report Writing (CA 01)',
        text:  'Scheduled <strong>30 May 2026</strong>. Submit via lecturer email.',
      },
    ],
  }
];

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 3 — CAROUSEL ENGINE
════════════════════════════════════════════════════════════ */
let carIdx = 0, carAuto = null, carMoving = false;

(function buildCar() {
  const track    = document.getElementById('carTrack');
  const dots     = document.getElementById('carDots');
  const prev     = document.getElementById('carPrev');
  const next     = document.getElementById('carNext');
  const skeleton = document.getElementById('carSkeleton');
  if (!track) return;

  if (!CAROUSEL_ITEMS.length) {
    track.innerHTML = `<div class="car-slide"><div class="car-placeholder">
      <i class="fa-regular fa-image"></i>
      <span>Add photos &amp; videos in CAROUSEL_ITEMS above</span>
    </div></div>`;
    if (prev) prev.style.display = 'none';
    if (next) next.style.display = 'none';
    if (skeleton) skeleton.classList.add('hidden');
    return;
  }

  let firstLoaded = false;
  function maybeHideSkeleton() {
    if (firstLoaded) return;
    firstLoaded = true;
    if (skeleton) skeleton.classList.add('hidden');
  }

  CAROUSEL_ITEMS.forEach((item, i) => {
    const s = document.createElement('div');
    s.className = 'car-slide';
    s.onclick = () => openLb(i);

    if (item.type === 'video') {
      const thumbW = item.thumbW || '';
      const thumbJ = item.thumb  || '';
      s.innerHTML = `
        <div class="car-vid-wrap">
          ${thumbJ
            ? `<picture>
                ${thumbW ? `<source srcset="${thumbW}" type="image/webp"/>` : ''}
                <img src="${thumbJ}" alt="${item.caption || 'Video'}" class="car-vid-thumb"
                     loading="${i === 0 ? 'eager' : 'lazy'}"
                     onerror="this.style.background='var(--bg3)'"
                     ${i === 0 ? 'id="carFirstThumb"' : ''}/>
              </picture>`
            : `<div class="car-vid-thumb" style="background:var(--bg3)"></div>`
          }
          <div class="car-vid-overlay">
            <div class="car-play"><i class="fa-solid fa-play" style="margin-left:3px"></i></div>
          </div>
        </div>
        ${item.caption ? `<div class="car-cap">${item.caption}</div>` : ''}`;
      if (i === 0) {
        setTimeout(() => {
          const fi = document.getElementById('carFirstThumb');
          if (fi) {
            if (fi.complete && fi.naturalWidth > 0) maybeHideSkeleton();
            else {
              fi.addEventListener('load',  maybeHideSkeleton, { once: true });
              fi.addEventListener('error', maybeHideSkeleton, { once: true });
            }
          } else { maybeHideSkeleton(); }
        }, 0);
        setTimeout(maybeHideSkeleton, 1500);
      }
    } else {
      const webp = item.src;
      const jpg  = item.srcFb || item.src;
      s.innerHTML = `
        <picture>
          <source srcset="${webp}" type="image/webp"/>
          <img src="${jpg}" alt="${item.caption || ''}"
               loading="${i === 0 ? 'eager' : 'lazy'}"
               ${i === 0 ? 'id="carFirstImg"' : ''}
               onerror="this.parentElement.parentElement.style.background='var(--bg3)'"/>
        </picture>
        ${item.caption ? `<div class="car-cap">${item.caption}</div>` : ''}`;
      if (i === 0) {
        setTimeout(() => {
          const fi = document.getElementById('carFirstImg');
          if (fi) {
            if (fi.complete && fi.naturalWidth > 0) maybeHideSkeleton();
            else {
              fi.addEventListener('load',  maybeHideSkeleton, { once: true });
              fi.addEventListener('error', maybeHideSkeleton, { once: true });
            }
          } else { maybeHideSkeleton(); }
        }, 0);
      }
    }

    track.appendChild(s);

    // Dot
    const d = document.createElement('div');
    d.className = 'car-dot' + (i === 0 ? ' active' : '');
    d.onclick = e => { e.stopPropagation(); goTo(i); };
    if (dots) dots.appendChild(d);
  });

  goTo(0);
  carAuto = setInterval(() => carMove(1), 4500);

  // Touch swipe on carousel
  const outer = document.getElementById('carOuter');
  if (outer) {
    let touchX = null;
    outer.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    outer.addEventListener('touchend',   e => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX; touchX = null;
      if (Math.abs(dx) > 40) carMove(dx < 0 ? 1 : -1);
    }, { passive: true });
  }
})();

function goTo(n) {
  const total = CAROUSEL_ITEMS.length || 1;
  carIdx = (n + total) % total;
  const track = document.getElementById('carTrack');
  if (track) track.style.transform = `translateX(-${carIdx * 100}%)`;
  document.querySelectorAll('.car-dot').forEach((d, i) => d.classList.toggle('active', i === carIdx));
}
function carMove(dir) {
  if (carMoving) return;
  carMoving = true; setTimeout(() => carMoving = false, 520);
  if (carAuto) { clearInterval(carAuto); carAuto = setInterval(() => carMove(1), 4500); }
  goTo(carIdx + dir);
}

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 4 — NOTIFICATIONS BUILDER
════════════════════════════════════════════════════════════ */
(function buildNotifs() {
  const grid = document.getElementById('notifGrid');
  if (!grid) return;
  NOTIFICATIONS.forEach((cat, ci) => {
    const g = document.createElement('div');
    g.className = 'notif-group';
    g.innerHTML = `<div class="notif-gtitle">
      <i class="fa-solid ${cat.icon}" style="color:${cat.iconColor}"></i> ${cat.category}
    </div>`;
    cat.items.forEach((n, ni) => {
      const id = `n${ci}_${ni}`;
      const d  = document.createElement('div');
      d.className = `notif notif-${n.color}`; d.id = id;
      const badgeHTML = n.badge
        ? `<span class="notif-badge badge-${n.badge}">${n.badge}</span>`
        : '';
      d.innerHTML = `
        <button class="notif-x" onclick="dismissNotif('${id}')" title="Dismiss">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="notif-head">
          <span class="notif-title-txt">${n.title}</span>${badgeHTML}
        </div>
        ${n.text}
        ${n.link ? `<br><a href="${n.link}" target="_blank" rel="noopener">${n.linkText || 'View →'}</a>` : ''}`;
      g.appendChild(d);
    });
    grid.appendChild(g);
  });
})();

function dismissNotif(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('gone');
}
