/* ============================================================
   ආනා Study Buddy: chat page.
   Free AI: the page asks the Cloudflare Worker (it picks the AI, checks the quotes, saves the answer).
   "My key": the page asks the student's own AI provider directly. The key never goes to our Worker or database.
   ============================================================ */
(function () {
  "use strict";
  var C = window.DSVB_CONFIG || {}, WORKER = String(C.AI_WORKER || "").replace(/\/$/, ""), P = window.AanaPrompt, LS = "aana:";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function h(tag, props) {
    var el = document.createElement(tag), later = null; props = props || {};
    Object.keys(props).forEach(function (k) {
      var v = props[k]; if (v == null || v === false) return;
      if (k === "class") el.className = v; else if (k === "value") later = v; else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? "" : v);
    });
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    if (later !== null) el.value = later; return el;
  }
  function add(el, c) { if (c == null || c === false) return; if (Array.isArray(c)) c.forEach(function (x) { add(el, x); }); else el.appendChild(c.nodeType ? c : document.createTextNode(String(c))); }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function ic(c) { return h("i", { class: "fa-solid " + c }); }
  function uid() { return "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function lsGet(k, d) { try { var v = JSON.parse(localStorage.getItem(LS + k)); return v == null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch (e) {} }
  function toast(t) { var e = $("#aiToast") || document.body.appendChild(h("div", { id: "aiToast" })); e.textContent = t; e.className = "show"; clearTimeout(toast._t); toast._t = setTimeout(function () { e.className = ""; }, 2400); }

  var AV = "../assets/admin/admin.webp";
  var PRESETS = {
    groq: { label: "Groq", url: "https://api.groq.com/openai/v1/chat/completions", model: "openai/gpt-oss-120b", effort: true, get: "console.groq.com/keys" },
    openrouter: { label: "OpenRouter", url: "https://openrouter.ai/api/v1/chat/completions", model: "meta-llama/llama-3.3-70b-instruct:free", get: "openrouter.ai/keys" },
    gemini: { label: "Google Gemini", url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", model: "gemini-2.5-flash", get: "aistudio.google.com/apikey" },
    mistral: { label: "Mistral", url: "https://api.mistral.ai/v1/chat/completions", model: "mistral-small-latest", get: "console.mistral.ai" },
    cerebras: { label: "Cerebras", url: "https://api.cerebras.ai/v1/chat/completions", model: "llama-3.3-70b", get: "cloud.cerebras.ai" },
    openai: { label: "OpenAI", url: "https://api.openai.com/v1/chat/completions", model: "gpt-4o-mini", get: "platform.openai.com/api-keys" },
    custom: { label: "Other (OpenAI-compatible)", url: "", model: "", get: "" }
  };

  /* ---------------- state ---------------- */
  var saved = lsGet("state", {});
  var S = { topicId: saved.topicId || null, style: saved.style || "normal", effort: saved.effort || "balanced", messages: Array.isArray(saved.messages) ? saved.messages.slice(-80) : [], book: null, busy: false,
    byok: lsGet("byok", null), sid: lsGet("sid", null) };
  if (!S.sid) { S.sid = Math.random().toString(36).slice(2, 12) + Date.now().toString(36).slice(-4); lsSet("sid", S.sid); }
  S.messages.forEach(function (m) { if (m.pending) { m.pending = false; m.err = true; m.text = "That answer did not finish. Press the retry button to ask again."; } });   // page was closed mid-answer
  var catalog = null, books = {}, loading = {};
  function save() { lsSet("state", { topicId: S.topicId, style: S.style, effort: S.effort, messages: S.messages.slice(-80).map(function (m) { var c = {}; for (var k in m) if (k !== "status") c[k] = m[k]; return c; }) }); }

  var chat = $("#chat"), box = $("#msgBox"), sendBtn = $("#sendBtn");

  /* ---------------- text -> safe HTML ---------------- */
  function fmt(text) {
    function inline(s) {
      s = esc(s);
      s = s.replace(/(&quot;|\u201c)([^]{20,}?)(&quot;|\u201d)/g, function (m, a, b, c) { return '<span class="q">\u201c' + b + "\u201d</span>"; });
      s = s.replace(/\((?:Chapter|Letter|Act|Scene|Part|Book|Canto|Volume|Preface|Author[^)]{0,20}|Front[^)]{0,30})[^)]{0,34}\)/g, function (m) { return '<span class="cite">' + m + "</span>"; });
      return s;
    }
    var out = [], para = [], list = [];
    function fp() { if (para.length) { out.push("<p>" + inline(para.join(" ")) + "</p>"); para = []; } }
    function fl() { if (list.length) { out.push("<ul>" + list.map(function (x) { return "<li>" + inline(x) + "</li>"; }).join("") + "</ul>"); list = []; } }
    String(text || "").split(/\n/).forEach(function (ln) {
      var m = /^\s*[-\u2022]\s+(.*)$/.exec(ln);
      if (m) { fp(); list.push(m[1]); } else if (!ln.trim()) { fp(); fl(); } else { fl(); para.push(ln.trim()); }
    });
    fp(); fl(); return out.join("");
  }

  /* ---------------- rendering ---------------- */
  var STATUS = { start: "ආනා is reading your question\u2026", search: "ආනා is searching the book\u2026", thinking: "ආනා is thinking\u2026", checking: "ආනා is checking the book\u2026", retrying: "ආනා wants to double-check\u2026" };
  function statusText(s) { if (s === "thinking" && S.effort === "deep") return "ආනා is thinking deeply\u2026"; if (s === "checking" && !S.book) return "ආනා is finishing up\u2026"; return STATUS[s] || STATUS.thinking; }
  function who() { return h("div", { class: "who" }, h("span", { class: "si" }, "ආනා"), " \u00b7 Study Buddy"); }
  function avatar() { return h("img", { class: "av", src: AV, alt: "", onerror: function (e) { e.target.onerror = null; e.target.src = "../assets/admin/admin.jpg"; } }); }
  function actBtn(icon, title, fn, cls) { return h("button", { class: "act" + (cls ? " " + cls : ""), type: "button", title: title, "aria-label": title, onclick: fn }, ic(icon)); }

  function renderMsg(m) {
    if (m.role === "div") return h("div", { class: "div", "data-id": m.id }, ic("fa-book-open-reader"), h("span", {}, m.text));
    if (m.role === "user") return h("div", { class: "msg user", "data-id": m.id }, h("div", { class: "col" }, h("div", { class: "bubble" }, m.text)));
    var body, meta = null;
    if (m.pending) {
      body = h("div", { class: "status" }, h("span", { class: "dots" }, h("i"), h("i"), h("i")), h("em", {}, m.status || statusText("start")));
      if (S.effort === "deep" || m.slow) body.appendChild(h("div", { class: "hint" }));
    } else {
      body = h("div"); body.innerHTML = fmt(m.text);
      var i = S.messages.indexOf(m);
      meta = h("div", { class: "meta" },
        actBtn("fa-copy", "Copy", function (e) { copyMsg(m, e.currentTarget); }),
        actBtn("fa-arrows-rotate", "Try again", function () { retry(m); }),
        actBtn("fa-thumbs-up", "Good answer", function () { rate(m, 1); }, m.rating === 1 ? "on" : ""),
        actBtn("fa-thumbs-down", "Not helpful", function () { rate(m, -1); }, m.rating === -1 ? "on down" : ""));
      if (!m.err && m.topic === "book") meta.appendChild(m.verified ? h("span", { class: "vbadge ok" }, ic("fa-circle-check"), "quotes checked") : h("span", { class: "vbadge warn", title: "ආනා could not match every quote to the book" }, ic("fa-triangle-exclamation"), "check quotes"));
    }
    return h("div", { class: "msg ai" + (m.err ? " err" : ""), "data-id": m.id }, avatar(), h("div", { class: "col" }, who(), h("div", { class: "bubble" }, body), meta));
  }
  function nearBottom() { return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 220; }
  function toBottom(force) { if (force || nearBottom()) requestAnimationFrame(function () { window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" }); }); }
  function welcome() {
    var book = S.book && S.book.meta, tips = book
      ? ["Give me a summary of " + (book.labelWord || "Chapter") + " 5", "Who are the main characters?", "What are the main themes?", "Give me 4 short quotes for an essay on isolation", "What does \u201cabhorred\u201d mean in the book?"]
      : ["Explain the present perfect tense simply", "How do I write a good essay introduction?", "What is the difference between \u201cmake\u201d and \u201cdo\u201d?", "Give me tips to learn new words"];
    return h("div", { class: "welcome" }, h("div", { class: "big" }, book ? book.title : "What shall we study today?"),
      h("p", {}, book ? "Ask about " + book.title + (book.author ? " by " + book.author : "") + ". I answer from the real text and show you quotes." : "Ask me anything about English. To study a book, choose it from the Topic menu above."),
      h("div", { class: "chips" }, tips.map(function (t) { return h("button", { class: "chip", type: "button", onclick: function () { box.value = t; send(); } }, t); })));
  }
  function renderAll() {
    clear(chat);
    if (!S.messages.length) chat.appendChild(welcome());
    S.messages.forEach(function (m) { chat.appendChild(renderMsg(m)); });
  }
  function replaceEl(m) { var old = chat.querySelector('[data-id="' + m.id + '"]'), n = renderMsg(m); if (old) { n.style.animation = "none"; old.replaceWith(n); } else chat.appendChild(n); }

  /* ---------------- topic ---------------- */
  function topicName() { return S.book ? S.book.meta.title : "General chat"; }
  function renderTopic() { $("#topicName").textContent = S.topicId && !S.book ? "Loading\u2026" : topicName(); }
  function loadCatalog() {
    if (catalog) return Promise.resolve(catalog);
    return fetch("library/catalog.json").then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) { catalog = j.books || []; return catalog; }).catch(function () { catalog = []; return catalog; });
  }
  function loadBook(meta) {
    if (books[meta.id]) return Promise.resolve(books[meta.id]);
    if (loading[meta.id]) return loading[meta.id];
    var base = "library/" + meta.path + "/";
    return (loading[meta.id] = Promise.all([fetch(base + "book.txt").then(function (r) { if (!r.ok) throw new Error("book"); return r.text(); }), fetch(base + "notes.txt").then(function (r) { return r.ok ? r.text() : ""; }).catch(function () { return ""; })])
      .then(function (a) { var o = window.AanaBook.load(meta, a[0], a[1]); books[meta.id] = o; return o; }));
  }
  function divider(text) { S.messages.push({ id: uid(), role: "div", text: text }); }
  function chooseTopic(meta) {
    closeOverlay();
    if ((meta && S.topicId === meta.id) || (!meta && !S.topicId)) return;
    if (!meta) { S.topicId = null; S.book = null; divider("Topic: General chat"); renderTopic(); renderAll(); save(); toBottom(true); return; }
    toast("Loading " + meta.title + "\u2026"); $("#topicName").textContent = "Loading\u2026";
    loadBook(meta).then(function (obj) {
      S.topicId = meta.id; S.book = { meta: meta, obj: obj };
      divider("Topic: " + meta.title + " \u00b7 Year " + meta.year + " \u00b7 Semester " + meta.semester);
      renderTopic(); renderAll(); save(); toBottom(true);
    }).catch(function () { renderTopic(); toast("Could not load that book. Check your internet and try again."); });
  }
  var ovl = null;
  function closeOverlay() { if (ovl) { ovl.remove(); ovl = null; document.removeEventListener("keydown", onEsc); } }
  function onEsc(e) { if (e.key === "Escape") closeOverlay(); }
  function openOverlay(title, body) {
    closeOverlay();
    ovl = h("div", { class: "ovl", onclick: function (e) { if (e.target === ovl) closeOverlay(); } },
      h("div", { class: "sheet", role: "dialog", "aria-label": title }, h("div", { class: "sh-hd" }, h("h3", {}, title), h("button", { class: "sh-x", type: "button", "aria-label": "Close", onclick: closeOverlay }, ic("fa-xmark"))), h("div", { class: "sh-bd" }, body)));
    document.body.appendChild(ovl); document.addEventListener("keydown", onEsc); return ovl;
  }
  function openTopics() {
    var cur = S.book ? S.book.meta : null, year = cur ? cur.year : 1, sem = cur ? cur.semester : 1, host = h("div");
    function draw() {
      clear(host);
      host.appendChild(h("button", { class: "opt" + (!S.topicId ? " on" : ""), type: "button", onclick: function () { chooseTopic(null); } }, h("span", { class: "oi" }, ic("fa-comments")), h("span", {}, h("b", {}, "General chat"), h("small", {}, "English, grammar, essays, exams. No book needed."))));
      host.appendChild(h("div", { class: "lbl" }, "Or study a book"));
      host.appendChild(h("div", { class: "pills" }, [1, 2, 3, 4].map(function (y) { return h("button", { class: "pill" + (year === y ? " on" : ""), type: "button", onclick: function () { year = y; draw(); } }, "Year " + y); }),
        h("span", { style: "opacity:.4" }, "\u00b7"), [1, 2].map(function (s) { return h("button", { class: "pill" + (sem === s ? " on" : ""), type: "button", onclick: function () { sem = s; draw(); } }, "Semester " + s); })));
      var list = (catalog || []).filter(function (b) { return b.year === year && b.semester === sem; });
      if (!list.length) host.appendChild(h("div", { class: "sh-note" }, "No books here yet. New books are added soon."));
      list.forEach(function (b) { host.appendChild(h("button", { class: "opt" + (S.topicId === b.id ? " on" : ""), type: "button", onclick: function () { chooseTopic(b); } }, h("span", { class: "oi" }, ic("fa-book")), h("span", {}, h("b", {}, b.title), h("small", {}, (b.author ? b.author + " \u00b7 " : "") + "Year " + b.year + " \u00b7 Semester " + b.semester)))); });
    }
    openOverlay("Choose a topic", host); loadCatalog().then(draw); draw();
  }

  /* ---------------- asking ---------------- */
  function histFor(m, E) {
    var i = S.messages.indexOf(m), out = [], q = null;
    for (var k = i - 1; k >= 0; k--) { if (S.messages[k].role === "div") break; }
    var seg = S.messages.slice(k + 1, i);
    for (var j = 0; j < seg.length; j++) {
      if (seg[j].role === "user") q = seg[j].text;
      else if (seg[j].role === "ai" && q && !seg[j].err && !seg[j].pending) { out.push({ q: q, a: seg[j].text }); q = null; }
    }
    return out.slice(-E.hist);
  }
  function setStatus(m, key) { m.status = statusText(key); var el = chat.querySelector('[data-id="' + m.id + '"] .status em'); if (el) el.textContent = m.status; }
  function post(path, body) { return fetch(WORKER + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), keepalive: true }); }

  async function askWorker(m, q, ctx, retry) {
    var payload = { q: q, topic: ctx.topic, book: ctx.book ? ctx.book.meta.id : "general", title: ctx.book ? ctx.book.meta.title : "", subject: ctx.book ? ctx.book.meta.subject || "" : "",
      mode: S.style, effort: S.effort, passages: ctx.passages, bg: ctx.bg, hist: ctx.hist, retry: !!retry, prev: retry ? m.logId || "" : "", sid: S.sid, stream: true };
    var res = await post("", payload);
    if (!res.ok) { var j = null; try { j = await res.json(); } catch (e) {} throw Object.assign(new Error((j && j.error) || "http " + res.status), { status: res.status, shown: !!(j && j.error) }); }
    if (!(res.body && res.body.getReader)) { var jj = await res.json(); if (jj.error) throw Object.assign(new Error(jj.error), { shown: true }); return jj; }
    var rd = res.body.getReader(), dec = new TextDecoder(), buf = "", result = null;
    for (;;) {
      var r = await rd.read(); if (r.done) break;
      buf += dec.decode(r.value, { stream: true });
      var lines = buf.split("\n"); buf = lines.pop();
      lines.forEach(function (ln) {
        if (!ln.trim()) return; var o; try { o = JSON.parse(ln); } catch (e) { return; }
        if (o.s) setStatus(m, o.s); if (o.error) throw Object.assign(new Error(o.error), { shown: true }); if (o.done) result = o;
      });
    }
    if (buf.trim()) { try { var o2 = JSON.parse(buf); if (o2.error) throw Object.assign(new Error(o2.error), { shown: true }); if (o2.done) result = o2; } catch (e) { if (e.shown) throw e; } }
    if (!result) throw new Error("no answer");
    return result;
  }
  async function askByok(m, q, ctx) {
    var K = S.byok, E = P.EFFORT[S.effort], pre = PRESETS[K.provider] || PRESETS.custom;
    var msgs = [{ role: "system", content: P.buildPrompt({ title: ctx.book ? ctx.book.meta.title : "", topic: ctx.topic, mode: S.style, effort: S.effort, passages: ctx.passages, bg: ctx.bg }) }];
    ctx.hist.forEach(function (x) { msgs.push({ role: "user", content: x.q }, { role: "assistant", content: x.a.slice(0, E.histChars) }); });
    msgs.push({ role: "user", content: q });
    var check = ctx.topic === "book" ? P.checker(ctx.passages.map(function (p) { return p.t; }).join(" ")) : function () { return { n: 0, bad: 0 }; };
    var best = null;
    for (var attempt = 0; attempt < 2; attempt++) {
      setStatus(m, attempt ? "retrying" : "thinking");
      var ac = new AbortController(), t = setTimeout(function () { ac.abort(); }, 70000), r;
      try {
        r = await fetch(K.url, { method: "POST", signal: ac.signal, headers: { "Content-Type": "application/json", Authorization: "Bearer " + K.key },
          body: JSON.stringify(Object.assign({ model: K.model, messages: msgs, temperature: .2, max_tokens: E.maxTokens }, pre.effort ? { reasoning_effort: E.reason } : {})) });
      } catch (e) { clearTimeout(t); throw Object.assign(new Error(e.name === "AbortError" ? "This is taking too long." : "Could not reach " + (pre.label || "your AI provider") + ". Some providers do not allow websites to use them directly. Try Groq, OpenRouter or Gemini."), { shown: true }); }
      clearTimeout(t);
      if (!r.ok) { var msg = r.status === 401 || r.status === 403 ? "Your key was rejected. Open \u201cMy key\u201d and check it." : r.status === 429 ? "Your AI provider says you are asking too fast or are out of free credit. Wait a minute and try again." : r.status === 404 ? "The model name was not found. Open \u201cMy key\u201d and check the model." : "Your AI provider returned an error (" + r.status + ")."; throw Object.assign(new Error(msg), { shown: true }); }
      var j = await r.json(), a = P.clean(String(((j.choices || [])[0] || {}).message ? j.choices[0].message.content || "" : "").trim());
      if (!a) continue;
      setStatus(m, "checking"); var c = check(a);
      if (!best || c.bad < best.c.bad) best = { a: a, c: c };
      if (c.bad === 0) break;
    }
    if (!best) throw Object.assign(new Error("The AI sent an empty answer. Please try again."), { shown: true });
    var host = ""; try { host = new URL(K.url).hostname; } catch (e) {}
    var id = null;
    try {                                                  // saved for training as "untrusted"; the key is never part of this
      var lr = await Promise.race([post("/log", { q: q, a: best.a, topic: ctx.topic, book: ctx.book ? ctx.book.meta.id : "", subject: ctx.book ? ctx.book.meta.subject || "" : "", mode: S.style, effort: S.effort, provider: host, quotes: best.c.n, quotes_bad: best.c.bad, passages: ctx.passages.length, sid: S.sid }), new Promise(function (_, rej) { setTimeout(rej, 4000); })]);
      if (lr.ok) id = (await lr.json()).id || null;
    } catch (e) {}
    return { answer: best.a, verified: best.c.bad === 0, id: id };
  }

  async function answer(m, q, retryFlag) {
    S.busy = true; sendBtn.disabled = true; sendBtn.classList.add("busy"); sendBtn.firstChild.className = "fa-solid fa-spinner";
    m.pending = true; m.err = false; m.status = statusText("start"); m.q = q; replaceEl(m); toBottom(true);
    var slow = setTimeout(function () { var hnt = chat.querySelector('[data-id="' + m.id + '"] .hint'); if (hnt) hnt.textContent = S.effort === "deep" ? "Deep thinking takes a little longer. Worth the wait!" : "Still working on it\u2026"; else { var st = chat.querySelector('[data-id="' + m.id + '"] .status'); if (st) st.appendChild(h("div", { class: "hint" }, "Still working on it\u2026")); } }, 9000);
    try {
      var E = P.EFFORT[S.effort], ctx = { topic: S.book ? "book" : "general", book: S.book, passages: [], bg: [], hist: histFor(m, E) };
      if (S.book) { setStatus(m, "search"); await new Promise(function (r) { setTimeout(r, 60); }); ctx.passages = S.book.obj.passages(q, E.passages); ctx.bg = S.book.obj.notesFor(q); }
      var res = S.byok ? await askByok(m, q, ctx) : await askWorker(m, q, ctx, retryFlag);
      m.text = res.answer; m.verified = res.verified !== false; m.logId = res.id || null; m.topic = ctx.topic; m.err = false; m.rating = 0; m.copied = false;
    } catch (e) {
      m.err = true; m.topic = S.book ? "book" : "general";
      m.text = e.shown ? e.message : (!navigator.onLine || /fetch|network|failed/i.test(e.message || "") ? "I can't reach the server right now. Check your internet connection and press the retry button." : "Something went wrong. Please press the retry button to try again.");
    }
    clearTimeout(slow); m.pending = false; S.busy = false; sendBtn.disabled = false; sendBtn.classList.remove("busy"); sendBtn.firstChild.className = "fa-solid fa-paper-plane";
    replaceEl(m); save(); toBottom(true); if (!(window.matchMedia && matchMedia("(pointer:coarse)").matches)) box.focus({ preventScroll: true });
  }
  function send() {
    var q = box.value.trim(); if (!q || S.busy) return;
    if (!WORKER && !S.byok) { toast("The AI is not set up yet."); return; }
    box.value = ""; grow();
    S.messages.push({ id: uid(), role: "user", text: q });
    var m = { id: uid(), role: "ai", text: "", pending: true, q: q, topic: S.book ? "book" : "general" }; S.messages.push(m);
    renderAll(); answer(m, q, false);
  }
  function retry(m) { if (S.busy || !m.q) return; answer(m, m.q, true); }

  function copyMsg(m, btn) {
    var done = function () { btn.classList.add("ok"); btn.firstChild.className = "fa-solid fa-check"; setTimeout(function () { btn.classList.remove("ok"); btn.firstChild.className = "fa-solid fa-copy"; }, 1600); if (m.logId && !m.copied) { m.copied = true; post("/feedback", { id: m.logId, copied: true }).catch(function () {}); } };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(m.text).then(done, function () { fallbackCopy(m.text); done(); });
    else { fallbackCopy(m.text); done(); }
  }
  function fallbackCopy(t) { var ta = h("textarea", { style: "position:fixed;opacity:0" }); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove(); }
  function rate(m, v) {
    m.rating = m.rating === v ? 0 : v; replaceEl(m); save();
    if (m.logId && m.rating) post("/feedback", { id: m.logId, rating: m.rating }).catch(function () {});
    if (m.rating === 1) toast("Thank you! \ud83d\udc99"); else if (m.rating === -1) toast("Thanks. Press the retry button for a new answer.");
  }

  /* ---------------- own key ---------------- */
  function renderKeyBtn() { var b = $("#keyBtn"); b.classList.toggle("on", !!S.byok); $("#keyTxt").textContent = S.byok ? "My key on" : "My key"; b.title = S.byok ? "Using your own " + ((PRESETS[S.byok.provider] || {}).label || "AI") + " key" : "Use your own AI key"; }
  function openKey() {
    var cur = S.byok || {}, prov = cur.provider || "groq";
    var sel = h("select", {}, Object.keys(PRESETS).map(function (k) { return h("option", { value: k }, PRESETS[k].label); })); sel.value = prov;
    var url = h("input", { type: "text", value: cur.url || PRESETS[prov].url, placeholder: "https://…/v1/chat/completions" });
    var model = h("input", { type: "text", value: cur.model || PRESETS[prov].model, placeholder: "model name" });
    var key = h("input", { type: "password", autocomplete: "off", placeholder: "Paste your key here", value: cur.key || "" });
    var rem = h("input", { type: "checkbox" }); rem.checked = !!(S.byok && S.byok.remember);
    var msg = h("div", { class: "keymsg" }), get = h("div", { class: "sh-note", style: "text-align:left;margin-top:.35rem" });
    function sync() { var p = PRESETS[sel.value]; url.value = p.url; model.value = p.model; get.textContent = p.get ? "Get a free key at " + p.get : ""; }
    sel.addEventListener("change", sync); get.textContent = (PRESETS[prov].get ? "Get a free key at " + PRESETS[prov].get : "");
    function cfg() { return { provider: sel.value, url: url.value.trim(), model: model.value.trim(), key: key.value.trim(), remember: rem.checked }; }
    var test = h("button", { class: "btn pri", type: "button", onclick: async function () {
      var c = cfg(); if (!/^https:\/\//.test(c.url) || !c.model || !c.key) { msg.className = "keymsg bad"; msg.textContent = "Fill in the address, model and key."; return; }
      test.disabled = true; msg.className = "keymsg"; msg.textContent = "Testing your key\u2026";
      try {
        var r = await fetch(c.url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + c.key }, body: JSON.stringify({ model: c.model, messages: [{ role: "user", content: "Reply with the word OK." }], max_tokens: 20 }) });
        if (!r.ok) throw Object.assign(new Error("http"), { status: r.status });
        S.byok = c; if (c.remember) lsSet("byok", c); else { try { localStorage.removeItem(LS + "byok"); } catch (e) {} }
        renderKeyBtn(); msg.className = "keymsg ok"; msg.textContent = "Your key works. ආනා will use it now."; setTimeout(closeOverlay, 900);
      } catch (e) { msg.className = "keymsg bad"; msg.textContent = e.status === 401 || e.status === 403 ? "That key was rejected. Check that you copied it fully." : e.status === 404 ? "Model not found. Check the model name." : e.status ? "The provider returned an error (" + e.status + ")." : "Could not reach that provider from a website. Try Groq, OpenRouter or Gemini."; }
      test.disabled = false;
    } }, "Test and use my key");
    var off = h("button", { class: "btn bad", type: "button", onclick: function () { S.byok = null; try { localStorage.removeItem(LS + "byok"); } catch (e) {} renderKeyBtn(); toast("Back to the free ආනා."); closeOverlay(); } }, "Stop using my key");
    openOverlay("Use my own AI key", h("div", {},
      h("div", { class: "privacy" }, ic("fa-shield-halved"), " Your key stays in this browser and goes only to the AI company you choose. It is ", h("b", {}, "never"), " sent to our server or saved. Your questions and the answers are saved anonymously to help improve ආනා."),
      h("label", { class: "lbl" }, "AI provider"), sel, get, h("label", { class: "lbl" }, "Address"), url, h("label", { class: "lbl" }, "Model"), model, h("label", { class: "lbl" }, "Your key"), key,
      h("label", { class: "chk" }, rem, "Remember my key on this device (do not tick this on a shared computer)"), msg,
      h("div", { class: "ft" }, S.byok ? off : null, h("button", { class: "btn", type: "button", onclick: closeOverlay }, "Close"), test)));
  }

  /* ---------------- composer + page ---------------- */
  function grow() { box.style.height = "auto"; box.style.height = Math.min(140, box.scrollHeight) + "px"; fit(); }
  function fit() { var c = $("#composer"); if (c) document.documentElement.style.setProperty("--cmp-h", c.offsetHeight + "px"); var hd = $("body > header"); if (hd) document.documentElement.style.setProperty("--hdr-h", hd.offsetHeight + "px"); }
  function init() {
    $("#styleSel").value = S.style; $("#thinkSel").value = S.effort;
    $("#styleSel").addEventListener("change", function (e) { S.style = e.target.value; save(); });
    $("#thinkSel").addEventListener("change", function (e) { S.effort = e.target.value; save(); toast(e.target.value === "deep" ? "Deep thinking: slower, but more careful." : e.target.value === "fast" ? "Fast: quick, shorter answers." : "Balanced."); });
    $("#topicBtn").addEventListener("click", openTopics);
    $("#keyBtn").addEventListener("click", openKey);
    $("#newChat").addEventListener("click", function () { if (!S.messages.length) return; if (S.busy) { toast("Wait for the answer to finish first."); return; } if (confirm("Start a new chat? This clears the conversation on this device.")) { S.messages = []; renderAll(); save(); toast("New chat started."); } });
    sendBtn.addEventListener("click", send);
    var touch = window.matchMedia && matchMedia("(pointer:coarse)").matches;
    box.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey && !touch) { e.preventDefault(); send(); } });
    box.addEventListener("input", grow);
    var small = window.matchMedia && matchMedia("(max-width:760px)");
    box.addEventListener("focus", function () { if (small && small.matches) { document.body.classList.add("kbd"); setTimeout(function () { fit(); toBottom(true); }, 120); } });
    box.addEventListener("blur", function () { setTimeout(function () { if (document.activeElement !== box) { document.body.classList.remove("kbd"); fit(); } }, 220); });
    ["sendBtn", "newChat"].forEach(function (id) { $("#" + id).addEventListener("mousedown", function (e) { e.preventDefault(); }); });   // tapping Send must not close the keyboard (the layout would jump and the tap would be lost)
    window.addEventListener("resize", fit); if (window.ResizeObserver) new ResizeObserver(fit).observe($("#composer"));
    renderKeyBtn(); renderTopic(); renderAll(); fit(); setTimeout(fit, 400); setTimeout(function () { toBottom(true); }, 50);
    if (S.topicId) loadCatalog().then(function (cat) {                  // restore the book you were studying
      var meta = cat.filter(function (b) { return b.id === S.topicId; })[0];
      if (!meta) { S.topicId = null; renderTopic(); return; }
      loadBook(meta).then(function (obj) { S.book = { meta: meta, obj: obj }; renderTopic(); renderAll(); }).catch(function () { S.topicId = null; renderTopic(); toast("Could not load your book. Using General chat."); });
    });
  }
  window.AanaChat = { fmt: fmt, state: S };
  init();
})();
