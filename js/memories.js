/* ════════════════════════════════════════════════════════════
   js/memories.js  —  ✏️ Edit SECTION 1 only
════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   SECTION 1 — YOUR MEMORIES

   Image:   { type:'image',   src:'memories/x.webp', srcFb:'memories/x.jpg', caption:'...' }
   Video:   { type:'video',   src:'memories/x.mp4',  thumbW:'memories/t.webp', thumb:'memories/t.jpg', caption:'...' }
   YouTube: { type:'youtube', id:'VIDEO_ID',          caption:'...' }

   • 1 item  → zoom only, no carousel chrome
   • 2+ items → auto-advance (4.5 s), swipe, arrows, dots
   • Files go in /memories/ at site root
   • Colours auto-cycle: blue → red → amber → green → …
════════════════════════════════════════════════════════════ */
const MEMORIES = [
  {
    title: 'First Day at Aquinas 🎓',
    desc:  '😊 The very first morning we all walked into Aquinas together, nervous smiles and new friendships. A day none of us will ever forget.. ❤️',
    media: [
      { type:'image',   src:'memories/img01.webp',  srcFb:'memories/img01.jpg',  caption:'First day — Feb 2026' },
      { type:'image',   src:'memories/img02.webp',  srcFb:'memories/img02.jpg',  caption:'Aquinas — Feb 2026' }
    ],
  },
  {
    title: 'Presentation Time 💻',
    desc:  'During the ICT lecture we were asked to present infront of the class.. 😝',
    media: [
      { type:'image',   src:'memories/img03.webp',  srcFb:'memories/img03.jpg',  caption:'Lab session vibes' },
      { type:'image',   src:'memories/img04.webp',  srcFb:'memories/img04.jpg',  caption:'Lab session vibes' },
      { type:'image',   src:'memories/img05.webp',  srcFb:'memories/img05.jpg',  caption:'Lab session vibes' },
      { type:'image',   src:'memories/img06.webp',  srcFb:'memories/img06.jpg',  caption:'Lab session vibes' },
      { type:'image',   src:'memories/img07.webp',  srcFb:'memories/img07.jpg',  caption:'Lab session vibes' },
      { type:'image',   src:'memories/img08.webp',  srcFb:'memories/img08.jpg',  caption:'Lab session vibes' },
      { type:'image',   src:'memories/img09.webp',  srcFb:'memories/img09.jpg',  caption:'Lab session vibes' },
      { type:'image',   src:'memories/img10.webp',  srcFb:'memories/img10.jpg',  caption:'Lab session vibes' },
      { type:'image',   src:'memories/img11.webp',  srcFb:'memories/img11.jpg',  caption:'Lab session vibes' },
      { type:'image',   src:'memories/img12.webp',  srcFb:'memories/img12.jpg',  caption:'Lab session vibes' },
      { type:'image',   src:'memories/img13.webp',  srcFb:'memories/img13.jpg',  caption:'Lab session vibes' }
    ],
  },
];

/* ════════════════════════════════════════════════════════════
   ENGINE — do not edit below
════════════════════════════════════════════════════════════ */

var CS = {};               /* carousel state per card index */
var LB = {items:[],idx:0}; /* lightbox state */

/* ── IntersectionObserver for card-level lazy loading ── */
var cardIO = window.IntersectionObserver
  ? new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ loadCard(+e.target.dataset.ci); cardIO.unobserve(e.target); }
      });
    },{rootMargin:'200px'})
  : null;

/* ── DOM ready ── */
document.addEventListener('DOMContentLoaded', function(){
  var grid =$('memGrid');
  var empty=$('memEmpty');
  if(!grid) return;
  if(!MEMORIES.length){ empty&&empty.classList.remove('hidden'); return; }

  /* preload ONLY the very first image (above the fold, highest priority) */
  var f0=MEMORIES[0]&&MEMORIES[0].media[0];
  if(f0){
    var hint = f0.type==='image'   ? (f0.src||f0.srcFb)
             : f0.type==='video'   ? (f0.thumbW||f0.thumb||'')
             : f0.type==='youtube' ? 'https://img.youtube.com/vi/'+f0.id+'/hqdefault.jpg'
             : '';
    if(hint){
      var pl=document.createElement('link');
      pl.rel='preload'; pl.as='image'; pl.href=hint;
      pl.setAttribute('fetchpriority','high');
      document.head.appendChild(pl);
    }
  }

  MEMORIES.forEach(function(mem,mi){
    /* build card shell — NO images yet, just structure */
    var card=mk('div','mem-card mc-'+(mi%20));
    card.dataset.ci=mi;

    card.appendChild(mk('div','mem-card-stripe'));

    var hdr=mk('div','mem-card-header');
    var ttl=mk('div','mem-card-title'); ttl.innerHTML=mem.title;
    hdr.appendChild(ttl); card.appendChild(hdr);

    /* carousel shell — images will be injected later */
    card.appendChild(buildShell(mem.media, mi));

    if(mem.desc){
      var d=mk('div','mem-card-desc'); d.innerHTML=mem.desc; card.appendChild(d);
    }

    grid.appendChild(card);

    /* stagger card reveal */
    (function(c,delay){ setTimeout(function(){ c.classList.add('revealed'); }, delay); })(card, 70+mi*90);

    /* first card: load immediately; rest: load when entering viewport */
    if(mi===0){
      loadCard(0);
    } else if(cardIO){
      cardIO.observe(card);
    } else {
      loadCard(mi); /* fallback if no IO support */
    }
  });

  /* lightbox events */
  $('lbClose').onclick=closeLb;
  $('lbPrev').onclick =function(){ lbStep(-1); };
  $('lbNext').onclick =function(){ lbStep(1);  };
  $('lbOverlay').addEventListener('click',function(e){ if(e.target===this) closeLb(); });
  swipe(document.querySelector('.mem-lb-body'), lbStep);

  buildParticles();
});

/* ════════════════════════════════════════════════════════════
   BUILD CAROUSEL SHELL (no images — just structure+placeholders)
════════════════════════════════════════════════════════════ */
function buildShell(media, ci){
  var total=media.length, single=total===1;
  CS[ci]={idx:0,total:total,timer:null,busy:false,loaded:{}};

  var wrap =mk('div','mem-car-wrap '+(single?'single':'multi'));
  var outer=mk('div','mem-car-outer');

  var skel=mk('div','mem-skel'); skel.id='sk'+ci;
  skel.innerHTML='<i class="fa-regular fa-image"></i>';
  outer.appendChild(skel);

  var track=mk('div','mem-track'); track.id='tk'+ci;
  /* build empty slide divs — src will be filled by loadSlide() */
  media.forEach(function(_,si){
    var slide=mk('div','mem-slide'); slide.id='sl'+ci+'_'+si;
    slide.addEventListener('click',handler(ci,si));
    track.appendChild(slide);
  });
  outer.appendChild(track);

  if(!single){
    var badge=mk('div','mem-badge'); badge.id='bd'+ci;
    badge.textContent='1 / '+total; outer.appendChild(badge);
  }
  outer.appendChild(arrBtn('prev',ci,single));
  outer.appendChild(arrBtn('next',ci,single));
  wrap.appendChild(outer);

  var dots=mk('div','mem-dots'); dots.id='dt'+ci;
  if(single) dots.style.display='none';
  for(var di=0;di<total;di++){
    var dot=mk('button','mem-dot'+(di===0?' on':''));
    dot.setAttribute('aria-label','Slide '+(di+1));
    dot.addEventListener('click',dotH(ci,di));
    dots.appendChild(dot);
  }
  wrap.appendChild(dots);
  if(!single) swipe(wrap,function(d){ carStep(ci,d); });
  return wrap;
}

/* ── loadCard: inject images for slide 0, then set up auto-advance ── */
function loadCard(ci){
  var s=CS[ci]; if(!s||s.loaded[-1]) return; /* already loaded */
  s.loaded[-1]=true;

  loadSlide(ci, 0, true);  /* load first slide eagerly */

  /* auto-advance only after first slide loaded */
  if(s.total>1) s.timer=setInterval(adv(ci),4500);
}

/* ── loadSlide: populate one slide's content ── */
function loadSlide(ci, si, isFirst){
  var s=CS[ci]; if(!s||s.loaded[si]) return;
  s.loaded[si]=true;

  var slide=$('sl'+ci+'_'+si); if(!slide) return;
  var item=MEMORIES[ci].media[si];
  var loading=isFirst?'eager':'lazy';
  var fetchp =isFirst?'high':'auto';

  var skelDone=false;
  function hideSkel(){
    if(skelDone) return; skelDone=true;
    var sk=$('sk'+ci); if(sk) sk.className='mem-skel gone';
  }
  if(!isFirst) hideSkel(); /* non-first slides don't control the skel */
  else setTimeout(hideSkel, 2200); /* hard fallback */

  if(item.type==='youtube'){
    var url='https://img.youtube.com/vi/'+item.id+'/hqdefault.jpg';
    var img=makeImg(url,item.caption||'YouTube',loading,fetchp);
    if(isFirst) onReady(img,hideSkel);
    slide.appendChild(img);
    slide.appendChild(playOv('yt'));

  } else if(item.type==='video'){
    if(item.thumbW||item.thumb){
      var pic=makePic(item.thumbW||'',item.thumb||'',item.caption||'Video',loading,fetchp);
      if(isFirst) onReady(pic.querySelector('img'),hideSkel);
      slide.appendChild(pic);
    } else { if(isFirst) hideSkel(); }
    slide.appendChild(playOv('vid'));

  } else {
    var pic=makePic(item.src||'',item.srcFb||item.src||'',item.caption||'',loading,fetchp);
    if(isFirst) onReady(pic.querySelector('img'),hideSkel);
    slide.appendChild(pic);
  }
}

/* ════════════════════════════════════════════════════════════
   CAROUSEL NAV
════════════════════════════════════════════════════════════ */
function carTo(ci, n){
  var s=CS[ci]; if(!s) return;
  s.idx=((n%s.total)+s.total)%s.total;

  /* load the target slide and the next one (preload) */
  loadSlide(ci, s.idx, false);
  loadSlide(ci, (s.idx+1)%s.total, false);

  var t=$('tk'+ci);
  if(t) requestAnimationFrame(function(){ t.style.transform='translateX(-'+(s.idx*100)+'%)'; });

  var d=$('dt'+ci);
  if(d) d.querySelectorAll('.mem-dot').forEach(function(dot,i){ dot.classList.toggle('on',i===s.idx); });

  var b=$('bd'+ci); if(b) b.textContent=(s.idx+1)+' / '+s.total;
}
function carStep(ci, dir){
  var s=CS[ci]; if(!s||s.busy) return;
  s.busy=true; setTimeout(function(){ s.busy=false; },420);
  clearInterval(s.timer); s.timer=setInterval(adv(ci),4500);
  carTo(ci, s.idx+dir);
}

/* ════════════════════════════════════════════════════════════
   LIGHTBOX
════════════════════════════════════════════════════════════ */
function openLb(ci, si){
  LB.items=MEMORIES[ci].media; LB.idx=si;
  $('lbOverlay').classList.add('open');
  document.body.style.overflow='hidden';
  renderLb();
  document.addEventListener('keydown',lbKey);
}
function renderLb(){
  var stage  =$('lbStage');
  var caption=$('lbCaption');
  var counter=$('lbCounter');
  var dl     =$('lbDownload');
  var prev   =$('lbPrev');
  var next   =$('lbNext');
  var item   =LB.items[LB.idx];
  var multi  =LB.items.length>1;

  stage.innerHTML='';
  counter.textContent=multi?(LB.idx+1)+' / '+LB.items.length:'';
  caption.textContent=item.caption||'';
  prev.classList.toggle('hide',!multi);
  next.classList.toggle('hide',!multi);

  if(item.type==='youtube'){
    var ifr=document.createElement('iframe');
    ifr.src='https://www.youtube-nocookie.com/embed/'+item.id+'?autoplay=1&rel=0&modestbranding=1';
    ifr.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';
    ifr.allowFullscreen=true;
    stage.appendChild(ifr);
    dl.classList.add('hide');

  } else if(item.type==='video'){
    var vid=document.createElement('video');
    vid.controls=true; vid.autoplay=true; vid.playsInline=true; vid.preload='auto';
    vid.style.cssText='opacity:0;transition:opacity .22s ease;';
    vid.addEventListener('canplay',function(){ vid.style.opacity='1'; },{once:true});
    setTimeout(function(){ vid.style.opacity='1'; },900);
    vid.src=item.src;
    stage.appendChild(vid);
    dl.classList.remove('hide');
    setupDl(dl, item.src, fname(item.src));

  } else {
    var img=document.createElement('img');
    img.decoding='async'; img.alt=item.caption||'';
    if(item.srcFb&&item.src!==item.srcFb){
      img.onerror=function(){ if(img.src!==item.srcFb) img.src=item.srcFb; };
    }
    img.src=item.src||item.srcFb||'';
    stage.appendChild(img);
    dl.classList.remove('hide');
    setupDl(dl, item.srcFb||item.src, fname(item.srcFb||item.src));
  }
}
function setupDl(a, url, filename){
  if(a._dlH) a.removeEventListener('click',a._dlH);
  a._dlH=function(e){
    e.preventDefault();
    fetch(url,{mode:'cors'})
      .then(function(r){ return r.blob(); })
      .then(function(blob){
        var u=URL.createObjectURL(blob);
        var x=document.createElement('a');
        x.href=u; x.download=filename; x.style.display='none';
        document.body.appendChild(x); x.click();
        setTimeout(function(){ URL.revokeObjectURL(u); x.remove(); },1400);
      })
      .catch(function(){ window.open(url,'_blank'); });
  };
  a.addEventListener('click',a._dlH);
}
function fname(url){ try{return url.split('/').pop().split('?')[0]||'download';}catch(e){return 'download';} }

function lbStep(dir){
  if(LB.items.length<=1) return;
  var v=document.querySelector('#lbStage video'); if(v) v.pause();
  LB.idx=((LB.idx+dir)+LB.items.length)%LB.items.length;
  renderLb();
}
function lbKey(e){
  if(e.key==='Escape')    closeLb();
  if(e.key==='ArrowLeft') lbStep(-1);
  if(e.key==='ArrowRight')lbStep(1);
}
function closeLb(){
  $('lbOverlay').classList.remove('open');
  document.body.style.overflow='';
  document.removeEventListener('keydown',lbKey);
  var s=$('lbStage'); if(s) s.innerHTML='';
}

/* ════════════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════════════ */
function makePic(webp, jpg, alt, loading, fetchp){
  var pic=document.createElement('picture');
  if(webp&&webp!==jpg){
    var src=document.createElement('source');
    src.srcset=webp; src.type='image/webp';
    pic.appendChild(src);
  }
  var img=document.createElement('img');
  img.src=jpg||webp; img.alt=alt; img.loading=loading; img.decoding='async';
  img.setAttribute('fetchpriority',fetchp);
  img.sizes='(max-width:680px) 100vw, 680px';
  img.onerror=function(){ this.style.opacity='.2'; };
  pic.appendChild(img); return pic;
}
function makeImg(src, alt, loading, fetchp){
  var img=document.createElement('img');
  img.src=src; img.alt=alt; img.loading=loading; img.decoding='async';
  img.setAttribute('fetchpriority',fetchp);
  img.sizes='(max-width:680px) 100vw, 680px';
  img.onerror=function(){ this.style.opacity='.2'; };
  return img;
}
function playOv(kind){
  var ov=mk('div','mem-vid-ov'), btn=mk('div','mem-play');
  btn.innerHTML=kind==='yt'
    ?'<i class="fa-brands fa-youtube" style="color:#ff1a1a;font-size:1.1rem"></i>'
    :'<i class="fa-solid fa-play" style="margin-left:3px"></i>';
  ov.appendChild(btn); return ov;
}
function arrBtn(dir, ci, hide){
  var b=mk('button','mem-arr mem-arr-'+dir+(hide?' hide':''));
  b.setAttribute('aria-label',dir==='prev'?'Previous':'Next');
  b.innerHTML='<i class="fa-solid fa-chevron-'+(dir==='prev'?'left':'right')+'"></i>';
  b.addEventListener('click',function(e){ e.stopPropagation(); carStep(ci,dir==='prev'?-1:1); });
  return b;
}
function onReady(img, cb){
  if(!img){cb();return;}
  if(img.complete&&img.naturalWidth>0){cb();return;}
  img.addEventListener('load', cb,{once:true});
  img.addEventListener('error',cb,{once:true});
}
function handler(ci,si){ return function(e){ e.stopPropagation(); openLb(ci,si); }; }
function dotH(ci,di)    { return function(e){ e.stopPropagation(); carTo(ci,di); }; }
function adv(ci)        { return function(){ carStep(ci,1); }; }

function mk(t,c){ var e=document.createElement(t); if(c) e.className=c.trim(); return e; }
function $(id) { return document.getElementById(id); }

function swipe(el, cb){
  if(!el) return;
  var tx=null;
  el.addEventListener('touchstart',function(e){ tx=e.touches[0].clientX; },{passive:true});
  el.addEventListener('touchend',  function(e){
    if(tx===null) return;
    var dx=e.changedTouches[0].clientX-tx; tx=null;
    if(Math.abs(dx)>36) cb(dx<0?1:-1);
  },{passive:true});
}

function buildParticles(){
  var c=$('heroParticles'); if(!c) return;
  var n=window.innerWidth<480?5:10;
  for(var i=0;i<n;i++){
    var d=mk('div','p-dot'), sz=3+Math.random()*5;
    d.style.cssText='width:'+sz+'px;height:'+sz+'px;'
      +'left:'+(Math.random()*100)+'%;'
      +'top:'+(18+Math.random()*64)+'%;'
      +'animation-duration:'+(4+Math.random()*5)+'s;'
      +'animation-delay:'+(Math.random()*5)+'s;';
    c.appendChild(d);
  }
}
