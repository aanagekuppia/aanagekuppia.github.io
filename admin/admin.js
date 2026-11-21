/* ============================================================
   Admin panel  -  ආනාගේ Kuppia
   Everything here talks to Supabase as the logged-in admin.
   The database itself refuses writes from anyone else (RLS),
   so this page is only a friendly screen, not the lock.
   ============================================================ */
(function () {
  "use strict";
  var C = window.DSVB_CONFIG || {};
  var EMAIL = function (u) { u = String(u || "").trim().toLowerCase(); return u.indexOf("@") >= 0 ? u : u + "@" + (C.ADMIN_EMAIL_DOMAIN || "aanagekuppia.github.io"); };
  var sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true } });

  /* ---------- speed: remember lists between visits, thin progress bar while loading ---------- */
  var MEM = {}, GEN = 0, SKEY = "adm:c:", busyN = 0, LOADED = {};
  function busy(d) { busyN = Math.max(0, busyN + d); document.body.classList.toggle("busy", busyN > 0); }
  function bust() {                                    // any write makes remembered lists out of date
    GEN++; MEM = {};
    try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf(SKEY) === 0) localStorage.removeItem(k); }); } catch (e) {}
  }
  (function () {
    var from = sb.from.bind(sb);
    sb.from = function (t) {
      var q = from(t);
      ["insert", "update", "delete", "upsert"].forEach(function (m) { var o = q[m]; if (o) q[m] = function () { bust(); return o.apply(q, arguments); }; });
      return q;
    };
  })();
  // Shows the remembered copy at once, then quietly checks for newer data and redraws only if something changed.
  async function swr(key, fetcher, redraw) {
    var hit = MEM[key];
    if (!hit) { try { var saved = JSON.parse(localStorage.getItem(SKEY + key)); if (saved) hit = MEM[key] = { data: saved, t: 0 }; } catch (e) {} }
    var gen = GEN;
    function store(data) { MEM[key] = { data: data, t: Date.now() }; try { localStorage.setItem(SKEY + key, JSON.stringify(data)); } catch (e) {} }
    if (hit) {
      if (Date.now() - hit.t > 4000) {
        hit.t = Date.now();
        fetcher().then(function (fresh) {
          if (gen !== GEN) return;
          var same = JSON.stringify(fresh) === JSON.stringify(hit.data);
          store(fresh); if (!same && redraw) redraw();
        }).catch(function () {});
      }
      return hit.data;
    }
    var data = await fetcher(); if (gen === GEN) store(data); return data;
  }
  function loadScript(src) {                           // load a heavy script only when it is first needed
    if (LOADED[src]) return LOADED[src];
    return (LOADED[src] = new Promise(function (res, rej) { var s = document.createElement("script"); s.src = src; s.async = true; s.onload = res; s.onerror = rej; document.head.appendChild(s); }));
  }
  var subjPromise = null;                              // the subject list is public, so fetch it while the page is still starting up
  function prefetchSubjects() {
    if (!subjPromise) subjPromise = (typeof fetch !== "function" ? Promise.reject(new Error("no fetch")) : fetch(C.SUPABASE_URL + "/rest/v1/subjects?select=*&order=year,sem,sort", { headers: { apikey: C.SUPABASE_KEY } })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); }));
    return subjPromise;
  }
  prefetchSubjects().catch(function () {});
  async function loadSubjects() {
    var cached = null; try { cached = JSON.parse(localStorage.getItem("adm:subjects")); } catch (e) {}
    var fresh = prefetchSubjects().then(function (rows) { try { localStorage.setItem("adm:subjects", JSON.stringify(rows)); } catch (e) {} return rows; });
    if (cached && cached.length) { fresh.catch(function () {}); return cached; }
    try { return await fresh; } catch (e) { return db(sb.from("subjects").select("*").order("year").order("sem").order("sort")); }
  }

  /* ---------- tiny DOM helper (text is always inserted as text, never as HTML) ---------- */
  function h(tag, props) {
    var el = document.createElement(tag), later = null;
    props = props || {};
    Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (v == null || v === false) return;
      if (k === "class") el.className = v;
      else if (k === "value") later = v;
      else if (k === "checked") el.checked = !!v;
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    });
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    if (later !== null) el.value = later;
    return el;
  }
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) c.forEach(function (x) { add(el, x); });
    else el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }
  function toast(msg, kind) {
    var t = $("#toast") || document.body.appendChild(h("div", { id: "toast" }));
    t.textContent = msg; t.className = "show " + (kind || ""); clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.className = ""; }, kind === "err" ? 5000 : 2200);
  }
  async function db(p) {
    var r; busy(1);
    try { r = await p; } finally { busy(-1); }
    if (r.error) { toast(r.error.message || "Database error", "err"); throw r.error; }
    return r.data;
  }
  function pad(n, w) { n = String(n); while (n.length < (w || 2)) n = "0" + n; return n; }
  function isHttp(u) { return /^https?:\/\//i.test(String(u || "")); }
  function today() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }

  /* ---------- generic pop-up form ---------- */
  // fields: [{key,label,type:text|textarea|select|number|date|checkbox|color,options:[[value,label]],hint,required,placeholder}]
  // onInput(key, api) lets a form react while typing; api = {get(key), set(key,val)}
  function openForm(o) {
    return new Promise(function (resolve) {
      var inputs = {}, err = h("div", { class: "err" });
      var api = {
        get: function (k) { var e = inputs[k]; return e.type === "checkbox" ? e.checked : e.value; },
        set: function (k, v) { var e = inputs[k]; if (e.type === "checkbox") e.checked = !!v; else e.value = v; }
      };
      var form = h("form", { novalidate: true });
      o.fields.forEach(function (f) {
        var val = (o.values && o.values[f.key] != null) ? o.values[f.key] : (f.default != null ? f.default : "");
        var el;
        if (f.type === "textarea") el = h("textarea", { placeholder: f.placeholder || "", value: val });
        else if (f.type === "select") el = h("select", {}, f.options.map(function (op) { return h("option", { value: op[0] }, op[1]); })), el.value = val;
        else if (f.type === "checkbox") el = h("input", { type: "checkbox", checked: val === true || val === "true" });
        else el = h("input", { type: f.type || "text", placeholder: f.placeholder || "", value: val });
        inputs[f.key] = el;
        if (o.onInput) el.addEventListener("input", function () { o.onInput(f.key, api); });
        if (o.onInput && f.type === "select") el.addEventListener("change", function () { o.onInput(f.key, api); });
        form.appendChild(h("div", { class: "fld" },
          f.type === "checkbox" ? h("label", { class: "chk" }, el, f.label) : [h("label", {}, f.label + (f.required ? " *" : "")), el],
          f.hint ? h("div", { class: "hint" }, f.hint) : null));
      });
      var save = h("button", { class: "btn pri", type: "submit" }, o.submitText || "Save");
      var cancel = h("button", { class: "btn", type: "button", onclick: function () { close(null); } }, "Cancel");
      form.appendChild(err); form.appendChild(h("div", { class: "foot" }, cancel, save));
      var ovl = h("div", { class: "ovl" }, h("div", { class: "modal" }, h("h3", {}, o.title), form));
      function close(v) { document.removeEventListener("keydown", esc); ovl.remove(); resolve(v); }
      function esc(e) { if (e.key === "Escape") close(null); }
      document.addEventListener("keydown", esc);
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        var out = {};
        for (var i = 0; i < o.fields.length; i++) {
          var f = o.fields[i], v = api.get(f.key);
          if (typeof v === "string") v = v.trim();
          if (f.required && (v === "" || v == null)) { err.textContent = "“" + f.label + "” is required."; inputs[f.key].focus(); return; }
          if (f.type === "number" && v !== "") v = Number(v);
          out[f.key] = v;
        }
        if (o.validate) { var m = o.validate(out); if (m) { err.textContent = m; return; } }
        save.disabled = true;
        try { await o.onSave(out); close(out); }
        catch (x) { save.disabled = false; err.textContent = (x && x.message) || "Could not save."; }
      });
      document.body.appendChild(ovl);
      var first = form.querySelector("input,textarea,select"); if (first) first.focus();
    });
  }
  function bigModal(title, body, opts) {
    opts = opts || {};
    var ovl = h("div", { class: "ovl" }, h("div", { class: "modal wide" }, h("h3", {}, title), body));
    ovl.close = function () { document.removeEventListener("keydown", esc); ovl.remove(); if (opts.onClose) opts.onClose(); };
    function esc(e) { if (e.key === "Escape" && !opts.noEsc) ovl.close(); }
    document.addEventListener("keydown", esc);
    document.body.appendChild(ovl);
    return ovl;
  }

  /* ---------- reusable bits ---------- */
  var sortRows = function (a) { return a.slice().sort(function (x, y) { return (x.sort_order - y.sort_order) || (x.id - y.id); }); };
  // Saves a new order: ids = row ids in their new order; only rows whose position changed are written.
  async function applyOrder(table, rows, ids) {
    var byId = {}; rows.forEach(function (r) { byId[r.id] = r; });
    var jobs = [];
    ids.forEach(function (id, p) { var r = byId[id]; if (r && r.sort_order !== p) jobs.push(db(sb.from(table).update({ sort_order: p }).eq("id", id))); });
    await Promise.all(jobs);
    return jobs.length;
  }
  function nextSort(rows) { return rows.reduce(function (m, r) { return Math.max(m, r.sort_order || 0); }, -1) + 1; }
  function btn(label, cls, fn, title) { return h("button", { class: "btn " + (cls || ""), type: "button", onclick: fn, title: title || null }, label); }
  // A drag handle (only visible after you press the lock button). itemSel = which element is the draggable row.
  function mover(table, rows, i, again, itemSel) {
    var hd = h("span", { class: "drag-handle", title: "Drag to reorder", "data-rid": rows[i].id }, "\u283f");
    hd._mv = { table: table, rows: rows, again: again, sel: itemSel || ".row" };
    return hd;
  }
  var UNLOCKED = false;
  function setUnlocked(v) {
    UNLOCKED = !!v; document.body.classList.toggle("drag-unlocked", UNLOCKED);
    var b = $(".lock-btn"); if (!b) return;
    b.classList.toggle("unlocked", UNLOCKED); clear(b);
    b.appendChild(h("i", { class: "fa-solid " + (UNLOCKED ? "fa-lock-open" : "fa-lock") }));
    b.appendChild(document.createTextNode(UNLOCKED ? " Reordering: drag the \u283f handles" : " Reorder"));
  }
  document.addEventListener("pointerdown", function (e) {
    if (!UNLOCKED || (e.button != null && e.button > 0)) return;
    var hd = e.target.closest && e.target.closest(".drag-handle"); if (!hd || !hd._mv) return;
    var mv = hd._mv, item = hd.closest(mv.sel); if (!item) return;
    e.preventDefault();
    function handleOf(c) { return Array.prototype.filter.call(c.querySelectorAll(".drag-handle"), function (x) { return x._mv && x._mv.table === mv.table && x.closest(mv.sel) === c; })[0]; }
    function sibs() { return Array.prototype.filter.call(item.parentElement.children, function (c) { return c.matches(mv.sel) && !!handleOf(c); }); }
    var r = item.getBoundingClientRect(), offY = e.clientY - r.top, last = e.clientY, drop = null;
    var ghost = item.cloneNode(true); ghost.className += " drag-ghost"; ghost.style.cssText += ";width:" + r.width + "px;left:" + r.left + "px;top:" + r.top + "px";
    document.body.appendChild(ghost); item.classList.add("drag-dragging"); document.body.classList.add("dragging");
    function mark() { sibs().forEach(function (c) { c.classList.remove("drag-over-top", "drag-over-bot"); }); if (drop) drop.el.classList.add(drop.before ? "drag-over-top" : "drag-over-bot"); }
    function move(ev) {
      last = ev.clientY; ghost.style.top = (ev.clientY - offY) + "px";
      var list = sibs().filter(function (c) { return c !== item; });
      drop = null;
      for (var k = 0; k < list.length; k++) { var b = list[k].getBoundingClientRect(); if (ev.clientY < b.top + b.height / 2) { drop = { el: list[k], before: true }; break; } }
      if (!drop && list.length) drop = { el: list[list.length - 1], before: false };
      mark();
    }
    var scroller = setInterval(function () { if (last < 90) window.scrollBy(0, -14); else if (last > window.innerHeight - 90) window.scrollBy(0, 14); }, 16);
    function cleanup() { clearInterval(scroller); document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up); document.removeEventListener("pointercancel", cancel); ghost.remove(); item.classList.remove("drag-dragging"); document.body.classList.remove("dragging"); sibs().forEach(function (c) { c.classList.remove("drag-over-top", "drag-over-bot"); }); }
    function cancel() { cleanup(); }
    async function up() {
      var d = drop; cleanup(); if (!d) return;
      var ids = sibs().map(function (c) { return Number(handleOf(c).getAttribute("data-rid")); });
      var me = Number(handleOf(item).getAttribute("data-rid")), tgt = Number(handleOf(d.el).getAttribute("data-rid"));
      ids = ids.filter(function (x) { return x !== me; });
      var at = ids.indexOf(tgt) + (d.before ? 0 : 1); ids.splice(at, 0, me);
      var n = 0; try { n = await applyOrder(mv.table, mv.rows, ids); } catch (err) {}
      if (n) toast("Order saved", "ok");
      mv.again();
    }
    document.addEventListener("pointermove", move); document.addEventListener("pointerup", up); document.addEventListener("pointercancel", cancel);
  });
  function kind(url) {
    url = String(url || "");
    var c = /(youtube\.com|youtu\.be)/i.test(url) ? "youtube" : /drive\.google\.com/i.test(url) ? "drive" : /vimeo\.com/i.test(url) ? "vimeo" : /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(url) ? "direct" : "external";
    return { youtube: ["yt", "YouTube"], drive: ["drive", "Drive"], vimeo: ["vimeo", "Vimeo"], direct: ["", "Video file"] }[c] || ["warn", "Link"];
  }
  function guessType(url) {
    url = String(url || "");
    if (/docs\.google\.com\/document/.test(url)) return "DOCX";
    if (/docs\.google\.com\/presentation/.test(url)) return "PPTX";
    if (/docs\.google\.com\/spreadsheets/.test(url)) return "XLSX";
    if (/youtu\.?be/.test(url)) return "Video";
    var m = /\.([a-z0-9]{2,5})(\?|#|$)/i.exec(url); if (m) { var e = m[1].toUpperCase(); if (["PDF", "DOCX", "DOC", "PPTX", "XLSX"].indexOf(e) >= 0) return e; }
    return "";
  }
  var FILE_TYPES = ["PDF", "DOCX", "DOC", "PPTX", "XLSX", "Video", "Image", "Other"].map(function (t) { return [t, t]; });

  /* ---------- subjects + the year / semester / subject picker ---------- */
  var SUBJECTS = [], SEL = { year: 1, sem: 1, id: null };
  try { var saved = JSON.parse(localStorage.getItem("adm:sel")); if (saved) SEL = saved; } catch (e) {}
  function subjName(id) { var s = SUBJECTS.filter(function (x) { return x.id === id; })[0]; return s ? s.name : id; }
  var OPEN = { y: {}, s: {} };
  function acadYear(y) { var a = 2025 + y; return a + "-" + String(a + 1).slice(-2); }
  function ic(c) { return h("i", { class: "fa-solid " + c }); }
  function treeView(onPick) {
    var col = h("div", { class: "tree-col" });
    var cur0 = SUBJECTS.filter(function (s) { return s.id === SEL.id; })[0];
    if (cur0) { OPEN.y[cur0.year] = true; OPEN.s[cur0.year + "-" + cur0.sem] = true; if (window.matchMedia && matchMedia("(max-width:760px)").matches) col.classList.add("collapsed"); }
    else if (!Object.keys(OPEN.y).length) { OPEN.y[1] = true; OPEN.s["1-1"] = true; }
    function draw() {
      clear(col);
      var cur = SUBJECTS.filter(function (s) { return s.id === SEL.id; })[0];
      col.appendChild(h("div", { class: "tree-hd", onclick: function () { col.classList.toggle("collapsed"); } }, ic("fa-sitemap"), "Select subject", cur ? h("span", { class: "tree-cur" }, cur.name) : null, ic("fa-chevron-down tree-tog")));
      var sc = h("div", { class: "tree-scroll" });
      [1, 2, 3, 4].forEach(function (y) {
        var yo = !!OPEN.y[y];
        sc.appendChild(h("div", { class: "t-year" + (yo ? " open" : ""), onclick: function () { OPEN.y[y] = !yo; draw(); } }, ic("fa-graduation-cap"), "Year " + pad(y), h("small", {}, acadYear(y)), ic("fa-chevron-right t-chev")));
        var yb = h("div", { class: "t-body" + (yo ? " open" : "") });
        [1, 2].forEach(function (m) {
          var key = y + "-" + m, so = !!OPEN.s[key];
          yb.appendChild(h("div", { class: "t-sem" + (so ? " open" : ""), onclick: function () { OPEN.s[key] = !so; draw(); } }, ic("fa-layer-group"), "Semester " + pad(m), ic("fa-chevron-right t-chev")));
          var sb2 = h("div", { class: "t-body" + (so ? " open" : "") });
          SUBJECTS.filter(function (s) { return s.year === y && s.sem === m; }).sort(function (a, b) { return a.sort - b.sort; }).forEach(function (s) {
            sb2.appendChild(h("div", { class: "t-subj" + (SEL.id === s.id ? " active" : ""), onclick: function () {
              SEL.id = s.id; SEL.year = s.year; SEL.sem = s.sem; try { localStorage.setItem("adm:sel", JSON.stringify(SEL)); } catch (e) {}
              col.classList.add("collapsed"); draw(); onPick(s); } }, ic("fa-file-lines"), s.name));
          });
          yb.appendChild(sb2);
        });
        sc.appendChild(yb);
      });
      col.appendChild(sc);
    }
    draw();
    return col;
  }
  function subjectTab(host, title, render) {            // shared layout for tabs that work per subject
    var content = h("div", { class: "content-col" });
    function show(s) {
      clear(content);
      if (!s) content.appendChild(h("div", { class: "content-placeholder" }, ic("fa-hand-pointer"), "Select a subject from the tree to manage its files."));
      else render(content, s);
    }
    host.appendChild(h("div", { class: "panel" }, treeView(show), content));
    show(SUBJECTS.filter(function (s) { return s.id === SEL.id; })[0]);
  }

  /* ============================================================
     RECORDINGS
     ============================================================ */
  async function tabRecordings(host) {
    subjectTab(host, "Recordings", async function (body, subj) {
      function again() { if (body.isConnected && SEL.id === subj.id) draw(); }
      async function draw() {
        var pair = await swr("rec:" + subj.id, function () { return Promise.all([db(sb.from("recordings").select("*").eq("subject_id", subj.id)), db(sb.from("notes").select("id").eq("subject_id", subj.id).limit(1))]); }, again);
        var rows = sortRows(pair[0]), hasNotes = pair[1].length > 0;
        clear(body);
        var card = h("div", { class: "card" });
        card.appendChild(h("div", { class: "head" }, h("h2", {}, subj.name + " — " + rows.length + " video" + (rows.length === 1 ? "" : "s")),
          btn("+ Add recording", "pri", function () { edit(null, rows); })));
        card.appendChild(h("div", { class: "muted", style: "margin-bottom:.6rem" },
          "The “Notes” button on each video links to this subject's notes automatically" + (hasNotes ? "." : " (this subject has no notes yet, so the button is hidden).")));
        if (!rows.length) card.appendChild(h("div", { class: "empty" }, "No recordings yet."));
        var list = h("div", { class: "list" });
        rows.forEach(function (r, i) {
          var k = kind(r.url);
          list.appendChild(h("div", { class: "row" },
            h("div", { class: "main" }, h("div", { class: "t" }, r.label), h("div", { class: "s" }, h("span", { class: "badge " + k[0] }, k[1]), r.date_info || "", " ", r.url)),
            h("div", { class: "acts" }, btn("▶ Preview", "sm", function () { preview(r); }), btn("Edit", "sm", function () { edit(r, rows); }),
              btn("✕", "bad sm ico", async function () { if (confirm("Delete “" + r.label + "”?")) { await db(sb.from("recordings").delete().eq("id", r.id)); toast("Deleted", "ok"); draw(); } }),
              mover("recordings", rows, i, draw))));
        });
        card.appendChild(list); body.appendChild(card);
      }
      function preview(r) {
        var box = h("div"), o = bigModal(r.label, box, { onClose: function () { if (window.DSVBPlayer) DSVBPlayer.destroy(box); } });
        box.appendChild(h("div", { class: "muted" }, "Loading player…"));
        loadScript("../js/players.js").then(function () { DSVBPlayer.mount(box, r.url, { title: r.label, autoplay: false, compact: true }); });
      }
      function edit(r, rows) {
        var nextDay = pad(rows.length + 1), m = r && /^Day\s*(\d+)\s*-\s*(\d{4})\.(\d{2})\.(\d{2})/i.exec(r.label || "");
        var vals = r ? { label: r.label, date_info: r.date_info || "", url: r.url, day: m ? m[1] : "", date: m ? m[2] + "-" + m[3] + "-" + m[4] : "" }
                     : { label: "Day " + nextDay + " - " + today().replace(/-/g, "."), day: nextDay, date: today(), date_info: "", url: "" };
        var touched = !!r && !m;
        openForm({
          title: r ? "Edit recording" : "Add recording to " + subj.name,
          values: vals,
          fields: [
            { key: "day", label: "Day number", type: "number", hint: "The label below fills itself from the day and date." },
            { key: "date", label: "Date of the lecture", type: "date" },
            { key: "label", label: "Label (shown on the site)", required: true },
            { key: "date_info", label: "Small description (optional)", placeholder: "e.g. Time management" },
            { key: "url", label: "Video link", required: true, hint: "YouTube, Google Drive or Vimeo link. YouTube plays in your custom player." }
          ],
          onInput: function (k, a) {
            if (k === "label") { touched = true; return; }
            if ((k === "day" || k === "date") && !touched && a.get("day") && a.get("date")) a.set("label", "Day " + pad(a.get("day")) + " - " + a.get("date").replace(/-/g, "."));
          },
          validate: function (v) { return isHttp(v.url) ? "" : "The link must start with http:// or https://"; },
          onSave: async function (v) {
            var row = { label: v.label, date_info: v.date_info || null, url: v.url };
            if (r) await db(sb.from("recordings").update(row).eq("id", r.id));
            else await db(sb.from("recordings").insert(Object.assign({ subject_id: subj.id, sort_order: nextSort(rows) }, row)));
            toast("Saved", "ok"); draw();
          }
        });
      }
      draw();
    });
  }

  /* ============================================================
     NOTES
     ============================================================ */
  var NCAT = [["lecturer", "Lecturer notes"], ["aana", "Old student notes (ආනා)"], ["paper", "Past papers"]];
  async function tabNotes(host) {
    subjectTab(host, "Notes & past papers", function (body, subj) {
      function again() { if (body.isConnected && SEL.id === subj.id) draw(); }
      async function draw() {
        var all = sortRows(await swr("notes:" + subj.id, function () { return db(sb.from("notes").select("*").eq("subject_id", subj.id)); }, again));
        clear(body);
        var card = h("div", { class: "card" });
        card.appendChild(h("div", { class: "head" }, h("h2", {}, subj.name + " — " + all.length + " file" + (all.length === 1 ? "" : "s")),
          btn("+ Add file", "pri", function () { edit(null, "lecturer", all); })));
        if (!all.length) card.appendChild(h("div", { class: "empty" }, "No files yet."));
        NCAT.forEach(function (c) {
          var rows = all.filter(function (r) { return r.category === c[0]; });
          if (!rows.length) return;
          card.appendChild(h("div", { class: "group" }, c[1]));
          var list = h("div", { class: "list" });
          rows.forEach(function (r, i) {
            list.appendChild(h("div", { class: "row" },
              h("div", { class: "main" }, h("div", { class: "t" }, r.name), h("div", { class: "s" }, h("span", { class: "badge" }, r.file_type), r.description || "")),
              h("div", { class: "acts" }, btn("Open", "sm", function () { window.open(r.url, "_blank", "noopener"); }), btn("Edit", "sm", function () { edit(r, r.category, all); }),
                btn("✕", "bad sm ico", async function () { if (confirm("Delete “" + r.name + "”?")) { await db(sb.from("notes").delete().eq("id", r.id)); toast("Deleted", "ok"); draw(); } }),
                mover("notes", rows, i, draw))));
          });
          card.appendChild(list);
        });
        body.appendChild(card);
      }
      function edit(r, cat, all) {
        openForm({
          title: r ? "Edit file" : "Add file to " + subj.name,
          values: r ? { category: r.category, name: r.name, description: r.description || "", file_type: r.file_type, url: r.url } : { category: cat, file_type: "PDF" },
          fields: [
            { key: "category", label: "Section", type: "select", options: NCAT },
            { key: "name", label: "Name", required: true },
            { key: "description", label: "Description (optional)" },
            { key: "file_type", label: "File type", type: "select", options: FILE_TYPES, hint: "Filled in for you when you paste a Google Docs / Slides / YouTube link." },
            { key: "url", label: "Link", required: true, hint: "Paste the Google Drive / Docs link, or a YouTube link for videos." }
          ],
          onInput: function (k, a) { if (k === "url") { var g = guessType(a.get("url")); if (g) a.set("file_type", g); } },
          validate: function (v) { return isHttp(v.url) ? "" : "The link must start with http:// or https://"; },
          onSave: async function (v) {
            var row = { category: v.category, name: v.name, description: v.description || null, file_type: v.file_type, url: v.url };
            if (r) await db(sb.from("notes").update(row).eq("id", r.id));
            else await db(sb.from("notes").insert(Object.assign({ subject_id: subj.id, sort_order: nextSort(all.filter(function (x) { return x.category === v.category; })) }, row)));
            toast("Saved", "ok"); draw();
          }
        });
      }
      draw();
    });
  }

  /* ============================================================
     ASSIGNMENTS
     ============================================================ */
  async function tabAssignments(host) {
    subjectTab(host, "Assignments", function (body, subj) {
      function again() { if (body.isConnected && SEL.id === subj.id) draw(); }
      async function draw() {
        var rows = sortRows(await swr("asg:" + subj.id, function () { return db(sb.from("assignments").select("*, assignment_files(*)").eq("subject_id", subj.id)); }, again));
        clear(body);
        var card = h("div", { class: "card" });
        card.appendChild(h("div", { class: "head" }, h("h2", {}, subj.name + " — " + rows.length + " assignment" + (rows.length === 1 ? "" : "s")),
          btn("+ Add assignment", "pri", function () { editEntry(null, rows); })));
        if (!rows.length) card.appendChild(h("div", { class: "empty" }, "No assignments yet."));
        rows.forEach(function (e, i) {
          var files = sortRows(e.assignment_files || []);
          var box = h("div", { class: "mrow" });
          box.appendChild(h("div", { class: "row", style: "background:transparent;border:0;padding:0 0 .4rem" },
            h("div", { class: "main" }, h("div", { class: "t" }, e.name), h("div", { class: "s" }, h("span", { class: "badge" }, e.category === "brief" ? "Brief" : "Aana's"), e.entry_category || "", e.deadline ? " · Deadline: " + e.deadline : "")),
            h("div", { class: "acts" }, btn("Edit", "sm", function () { editEntry(e, rows); }),
              btn("✕", "bad sm ico", async function () { if (confirm("Delete “" + e.name + "” and its files?")) { await db(sb.from("assignments").delete().eq("id", e.id)); toast("Deleted", "ok"); draw(); } }),
              mover("assignments", rows, i, draw, ".mrow"))));
          var list = h("div", { class: "list" });
          files.forEach(function (f, j) {
            list.appendChild(h("div", { class: "row" },
              h("div", { class: "main" }, h("div", { class: "t" }, f.name), h("div", { class: "s" }, h("span", { class: "badge" }, f.file_type), f.description || "")),
              h("div", { class: "acts" }, btn("Open", "sm", function () { window.open(f.url, "_blank", "noopener"); }), btn("Edit", "sm", function () { editFile(e, f, files); }),
                btn("✕", "bad sm ico", async function () { if (confirm("Delete this file?")) { await db(sb.from("assignment_files").delete().eq("id", f.id)); draw(); } }),
                mover("assignment_files", files, j, draw))));
          });
          box.appendChild(list);
          box.appendChild(h("div", { style: "margin-top:.5rem" }, btn("+ Add file", "sm", function () { editFile(e, null, files); })));
          card.appendChild(box);
        });
        body.appendChild(card);
      }
      function editEntry(e, rows) {
        openForm({
          title: e ? "Edit assignment" : "Add assignment",
          values: e ? { category: e.category, name: e.name, description: e.description || "", entry_category: e.entry_category || "", what_to_do: e.what_to_do || "", deadline: e.deadline || "" } : { category: "brief" },
          fields: [
            { key: "category", label: "Section", type: "select", options: [["brief", "Brief (from the lecturer)"], ["aana", "Aana's submission"]] },
            { key: "name", label: "Name", required: true },
            { key: "description", label: "Short description" },
            { key: "entry_category", label: "Type", placeholder: "Report / Case Study / Portfolio ..." },
            { key: "what_to_do", label: "What to do", type: "textarea" },
            { key: "deadline", label: "Deadline", placeholder: "30 April 2026" }
          ],
          onSave: async function (v) {
            var row = { category: v.category, name: v.name, description: v.description || null, entry_category: v.entry_category || null, what_to_do: v.what_to_do || null, deadline: v.deadline || null };
            if (e) await db(sb.from("assignments").update(row).eq("id", e.id));
            else await db(sb.from("assignments").insert(Object.assign({ subject_id: subj.id, sort_order: nextSort(rows) }, row)));
            toast("Saved", "ok"); draw();
          }
        });
      }
      function editFile(e, f, files) {
        openForm({
          title: f ? "Edit file" : "Add file to “" + e.name + "”",
          values: f ? { name: f.name, description: f.description || "", file_type: f.file_type, url: f.url } : { name: "Instructions", file_type: "PDF" },
          fields: [
            { key: "name", label: "Name", required: true },
            { key: "description", label: "Description" },
            { key: "file_type", label: "File type", type: "select", options: FILE_TYPES },
            { key: "url", label: "Link", required: true }
          ],
          onInput: function (k, a) { if (k === "url") { var g = guessType(a.get("url")); if (g) a.set("file_type", g); } },
          validate: function (v) { return isHttp(v.url) ? "" : "The link must start with http:// or https://"; },
          onSave: async function (v) {
            var row = { name: v.name, description: v.description || null, file_type: v.file_type, url: v.url };
            if (f) await db(sb.from("assignment_files").update(row).eq("id", f.id));
            else await db(sb.from("assignment_files").insert(Object.assign({ assignment_id: e.id, sort_order: nextSort(files) }, row)));
            toast("Saved", "ok"); draw();
          }
        });
      }
      draw();
    });
  }

  /* ============================================================
     SONGS + LYRICS EDITOR
     ============================================================ */
  function parseTime(s) {
    s = String(s == null ? "" : s).trim().replace(",", "."); if (s === "") return null;
    var m = /^(\d+):(\d{1,2}(?:\.\d+)?)$/.exec(s);
    if (m) return Number(m[1]) * 60 + Number(m[2]);
    return /^\d+(\.\d+)?$/.test(s) ? Number(s) : NaN;
  }
  function fmtTime(t) {
    if (t == null || isNaN(t)) return "";
    t = Math.round(t * 10) / 10; var m = Math.floor(t / 60), s = t - m * 60;
    return m + ":" + (s < 10 ? "0" : "") + s.toFixed(1);
  }
  function parseLyricsText(text) {                    // plain lines, or LRC lines like [01:23.45] words
    return String(text || "").split(/\r?\n/).map(function (ln) {
      var m = /^\s*\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/.exec(ln);
      if (m) return { t: Number(m[1]) * 60 + Number(m[2]), text: m[3].trim() };
      return ln.trim() ? { t: null, text: ln.trim() } : null;
    }).filter(Boolean);
  }
  function toLrc(lines) {
    return lines.filter(function (l) { return l.t != null && !isNaN(l.t); }).sort(function (a, b) { return a.t - b.t; }).map(function (l) {
      var m = Math.floor(l.t / 60), s = l.t - m * 60; return "[" + pad(m) + ":" + (s < 10 ? "0" : "") + s.toFixed(2) + "] " + l.text;
    }).join("\n");
  }

  function openLyrics(song, done) {
    var lines = (Array.isArray(song.lyrics) ? song.lyrics : []).map(function (l) { return { t: Number(l.time), text: String(l.text == null ? "" : l.text) }; });
    var src = "../" + (C.MUSIC_DIR || "music/") + song.audio_file;
    var audio = h("audio", { controls: true, preload: "auto", src: src });
    var status = h("div", { class: "muted" }, "Loading audio…");
    var rowsBox = h("div", { class: "lrows" }), els = [], paste = h("textarea", { placeholder: "Paste lyrics here: plain lines, or LRC lines like [01:23.45] words", style: "min-height:80px" });
    audio.addEventListener("error", function () { status.textContent = "⚠ Can't find “" + song.audio_file + "” in the music/ folder yet. Upload it to GitHub, wait a minute, then reopen this."; });
    audio.addEventListener("loadedmetadata", function () { status.textContent = "Audio ready (" + fmtTime(audio.duration) + "). Play it, then press the big button (or Space) at the start of each line."; });

    function nextIdx() { for (var i = 0; i < lines.length; i++) if (lines[i].t == null || isNaN(lines[i].t)) return i; return -1; }
    function paintNext() { var n = nextIdx(); els.forEach(function (e, i) { e.classList.toggle("next", i === n); }); }
    function paintActive() {
      var cur = audio.currentTime, a = -1;
      lines.forEach(function (l, i) { if (l.t != null && !isNaN(l.t) && l.t <= cur + 0.05 && (a < 0 || l.t >= lines[a].t)) a = i; });
      els.forEach(function (e, i) { e.classList.toggle("active", i === a); });
    }
    audio.addEventListener("timeupdate", paintActive);
    audio.addEventListener("seeked", paintActive);

    function row(l, i) {
      var tm = h("input", { type: "text", class: "tm", value: fmtTime(l.t), placeholder: "m:ss.s", inputmode: "decimal" });
      tm.addEventListener("input", function () { var t = parseTime(tm.value); l.t = t; tm.classList.toggle("bad", isNaN(t)); paintNext(); paintActive(); });
      tm.addEventListener("blur", function () { if (l.t != null && !isNaN(l.t)) tm.value = fmtTime(l.t); });
      var tx = h("input", { type: "text", value: l.text, placeholder: "line text" });
      tx.addEventListener("input", function () { l.text = tx.value; });
      var el = h("div", { class: "lrow" }, tm, tx, h("div", { class: "lbtns" },
        btn("⏱", "sm ico", function () { l.t = Math.round(audio.currentTime * 100) / 100; tm.value = fmtTime(l.t); tm.classList.remove("bad"); paintNext(); paintActive(); }, "Stamp this line with the current time"),
        btn("▶", "sm ico", function () { if (l.t != null && !isNaN(l.t)) { audio.currentTime = Math.max(0, l.t - 0.3); audio.play(); } }, "Play from this line"),
        btn("＋", "sm ico", function () { lines.splice(i + 1, 0, { t: null, text: "" }); render(i + 1); }, "Add a line below"),
        btn("✕", "bad sm ico", function () { lines.splice(i, 1); render(); }, "Delete this line")));
      return el;
    }
    function render(focusIdx) {
      clear(rowsBox); els = lines.map(row); els.forEach(function (e) { rowsBox.appendChild(e); });
      if (!lines.length) rowsBox.appendChild(h("div", { class: "empty" }, "No lines yet. Paste the lyrics below, or add a line."));
      paintNext(); paintActive();
      if (focusIdx != null && els[focusIdx]) { var inp = els[focusIdx].querySelectorAll("input")[1]; inp && inp.focus(); }
    }
    function stampNext() {
      var i = nextIdx(); if (i < 0) { toast("Every line already has a time"); return; }
      lines[i].t = Math.round(audio.currentTime * 100) / 100;
      els[i].querySelector(".tm").value = fmtTime(lines[i].t); els[i].querySelector(".tm").classList.remove("bad");
      paintNext(); paintActive();
      var n = nextIdx(); if (n >= 0) els[n].scrollIntoView({ block: "center", behavior: "smooth" });
    }
    function shift(d) { lines.forEach(function (l) { if (l.t != null && !isNaN(l.t)) l.t = Math.max(0, Math.round((l.t + d) * 100) / 100); }); render(); toast("Shifted " + (d > 0 ? "+" : "") + d + "s"); }

    var speed = h("select", {}, [["0.5", "0.5×"], ["0.75", "0.75×"], ["1", "1×"]].map(function (o) { return h("option", { value: o[0] }, o[1]); })); speed.value = "1";
    speed.addEventListener("change", function () { audio.playbackRate = Number(speed.value); });

    var body = h("div", {},
      h("div", { class: "lyr-audio" }, audio, status),
      h("div", { class: "lyr-tools" },
        btn("« 3s", "sm", function () { audio.currentTime = Math.max(0, audio.currentTime - 3); }), speed,
        btn("−0.5s all", "sm", function () { shift(-0.5); }), btn("+0.5s all", "sm", function () { shift(0.5); }),
        btn("Sort by time", "sm", function () { lines.sort(function (a, b) { return (a.t == null ? 1e9 : a.t) - (b.t == null ? 1e9 : b.t); }); render(); }),
        btn("Copy as LRC", "sm", function () { var t = toLrc(lines); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { toast("Copied", "ok"); }, function () { paste.value = t; toast("Put into the box below — copy it from there"); }); })),
      rowsBox,
      h("div", { class: "stamp" },
        btn("⏱ Stamp next line  (Space)", "pri big", stampNext),
        btn("+ Empty line", "sm", function () { lines.push({ t: null, text: "" }); render(lines.length - 1); })),
      h("div", { class: "fld", style: "margin-top:.8rem" }, h("label", {}, "Paste lyrics"), paste,
        h("div", { class: "lyr-tools" },
          btn("Add to the list", "sm", function () { lines = lines.concat(parseLyricsText(paste.value)); paste.value = ""; render(); }),
          btn("Replace everything", "bad sm", function () { if (!lines.length || confirm("Replace all current lines?")) { lines = parseLyricsText(paste.value); paste.value = ""; render(); } }))),
      h("div", { class: "foot" }, btn("Close", "", function () { ovl.close(); }),
        btn("Save lyrics", "good", async function (ev) {
          var bad = lines.filter(function (l) { return l.text.trim() && (l.t == null || isNaN(l.t)); });
          if (bad.length) { toast(bad.length + " line(s) still have no valid time", "err"); return; }
          var out = lines.filter(function (l) { return l.t != null && !isNaN(l.t); }).sort(function (a, b) { return a.t - b.t; })
            .map(function (l) { return { time: Math.round(l.t * 100) / 100, text: l.text.trim() }; });
          ev.target.disabled = true;
          try { await db(sb.from("songs").update({ lyrics: out }).eq("id", song.id)); toast("Lyrics saved (" + out.length + " lines)", "ok"); ovl.close(); done && done(); }
          catch (e) { ev.target.disabled = false; }
        })));
    var ovl = bigModal("Lyrics — " + song.name, body, { noEsc: false, onClose: function () { audio.pause(); audio.removeAttribute("src"); document.removeEventListener("keydown", key); } });
    function key(e) { if (e.code === "Space" && !/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test((e.target || {}).tagName || "")) { e.preventDefault(); stampNext(); } }
    document.addEventListener("keydown", key);
    render();
  }

  async function tabSongs(host) {
    var body = h("div"); host.appendChild(body);
    function again() { if (body.isConnected) draw(); }
    async function draw() {
      var rows = sortRows(await swr("songs", function () { return db(sb.from("songs").select("*")); }, again));
      clear(body);
      var card = h("div", { class: "card" });
      card.appendChild(h("div", { class: "head" }, h("h2", {}, "Songs — " + rows.length), btn("+ Add song", "pri", function () { edit(null, rows); })));
      card.appendChild(h("div", { class: "muted", style: "margin-bottom:.6rem" }, "1) Upload the mp3 into the music/ folder of your GitHub repo.  2) Add the song here with just the file name (like song09.mp3).  3) Click “Lyrics” to type the subtitles."));
      [["sinhala", "Sinhala songs"], ["foreign", "Foreign songs"]].forEach(function (g) {
        var list = rows.filter(function (r) { return r.grp === g[0]; });
        if (!list.length) return;
        card.appendChild(h("div", { class: "group" }, g[1]));
        var box = h("div", { class: "list" });
        list.forEach(function (r, i) {
          var n = Array.isArray(r.lyrics) ? r.lyrics.length : 0;
          box.appendChild(h("div", { class: "row" },
            h("div", { class: "main" }, h("div", { class: "t" }, r.name), h("div", { class: "s" }, h("span", { class: "badge " + (n ? "" : "off") }, n ? n + " lyric lines" : "no lyrics"), (r.artist || "") + " · " + r.audio_file)),
            h("div", { class: "acts" }, btn("Lyrics", "pri sm", function () { openLyrics(r, draw); }), btn("Edit", "sm", function () { edit(r, rows); }),
              btn("✕", "bad sm ico", async function () { if (confirm("Delete “" + r.name + "”?")) { await db(sb.from("songs").delete().eq("id", r.id)); toast("Deleted", "ok"); draw(); } }),
              mover("songs", list, i, draw))));
        });
        card.appendChild(box);
      });
      if (!rows.length) card.appendChild(h("div", { class: "empty" }, "No songs yet."));
      body.appendChild(card);
    }
    function edit(r, rows) {
      openForm({
        title: r ? "Edit song" : "Add song",
        values: r ? { grp: r.grp, name: r.name, artist: r.artist || "", audio_file: r.audio_file } : { grp: "sinhala" },
        fields: [
          { key: "grp", label: "Group", type: "select", options: [["sinhala", "Sinhala"], ["foreign", "Foreign"]] },
          { key: "name", label: "Song name", required: true },
          { key: "artist", label: "Artist / small description" },
          { key: "audio_file", label: "mp3 file name", required: true, placeholder: "song09.mp3", hint: "Only the file name, no folders. The file lives in the music/ folder." }
        ],
        validate: function (v) { return /\.(mp3|m4a|ogg|wav|aac)$/i.test(v.audio_file.split(/[\\/]/).pop()) ? "" : "The file name should end in .mp3 (or .m4a / .ogg / .wav)"; },
        onSave: async function (v) {
          var row = { grp: v.grp, name: v.name, artist: v.artist || null, audio_file: v.audio_file.split(/[\\/]/).pop().trim() };
          if (r) await db(sb.from("songs").update(row).eq("id", r.id));
          else await db(sb.from("songs").insert(Object.assign({ sort_order: nextSort(rows), lyrics: [] }, row)));
          toast("Saved", "ok"); draw();
        }
      });
    }
    draw();
  }

  /* ============================================================
     NOTIFICATIONS (the bell on the home page)
     ============================================================ */
  var NCOLORS = ["blue", "green", "orange", "purple", "red", "yellow"].map(function (c) { return [c, c]; });
  var NBADGES = ["info", "new", "important", "reminder", "soon", "update", "done"].map(function (c) { return [c, c]; });
  var stripTags = function (s) { return String(s || "").replace(/<[^>]*>/g, ""); };
  async function tabNotifications(host) {
    var body = h("div"); host.appendChild(body);
    function again() { if (body.isConnected) draw(); }
    async function draw() {
      var cats = sortRows(await swr("notif", function () { return db(sb.from("notification_categories").select("*, notifications(*)")); }, again));
      clear(body);
      var top = h("div", { class: "card" }, h("div", { class: "head" }, h("h2", {}, "Notifications"), btn("+ Add category", "pri", function () { editCat(null, cats); })),
        h("div", { class: "muted" }, "Notifications are grouped into categories. Hidden ones stay saved but don't show on the site."));
      body.appendChild(top);
      if (!cats.length) body.appendChild(h("div", { class: "empty" }, "No categories yet. Add one, then add notifications inside it."));
      cats.forEach(function (c, ci) {
        var items = sortRows(c.notifications || []);
        var card = h("div", { class: "card" });
        card.appendChild(h("div", { class: "head" },
          h("div", {}, h("h2", { style: "margin:0" }, h("span", { style: "display:inline-block;width:.8rem;height:.8rem;border-radius:50%;margin-right:.5rem;background:" + (/^#[0-9a-f]{3,8}$/i.test(c.icon_color) ? c.icon_color : "#888") }), c.name), h("div", { class: "muted" }, "icon: " + c.icon)),
          h("div", { class: "acts", style: "display:flex;gap:.3rem;flex-wrap:wrap" }, btn("+ Notification", "pri sm", function () { editNote(c, null, items); }), btn("Edit", "sm", function () { editCat(c, cats); }),
            btn("✕", "bad sm ico", async function () { if (confirm("Delete category “" + c.name + "” and all notifications in it?")) { await db(sb.from("notification_categories").delete().eq("id", c.id)); draw(); } }),
            mover("notification_categories", cats, ci, draw, ".card"))));
        var list = h("div", { class: "list" });
        if (!items.length) list.appendChild(h("div", { class: "empty" }, "Empty category (it is hidden on the site until it has a visible notification)."));
        items.forEach(function (n, i) {
          list.appendChild(h("div", { class: "row", style: n.active ? "" : "opacity:.55" },
            h("div", { class: "main" }, h("div", { class: "t" }, n.title), h("div", { class: "s" }, h("span", { class: "badge" }, n.badge), h("span", { class: "badge" }, n.color), n.active ? "" : h("span", { class: "badge off" }, "hidden"), stripTags(n.body).slice(0, 110))),
            h("div", { class: "acts" }, btn(n.active ? "Hide" : "Show", "sm", async function () { await db(sb.from("notifications").update({ active: !n.active }).eq("id", n.id)); draw(); }),
              btn("Edit", "sm", function () { editNote(c, n, items); }),
              btn("✕", "bad sm ico", async function () { if (confirm("Delete “" + n.title + "”?")) { await db(sb.from("notifications").delete().eq("id", n.id)); draw(); } }),
              mover("notifications", items, i, draw))));
        });
        card.appendChild(list); body.appendChild(card);
      });
    }
    function editCat(c, cats) {
      openForm({
        title: c ? "Edit category" : "Add category",
        values: c ? { name: c.name, icon: c.icon, icon_color: c.icon_color } : { icon: "fa-circle-info", icon_color: "#3b82f6" },
        fields: [
          { key: "name", label: "Category name", required: true, placeholder: "General Notices" },
          { key: "icon", label: "Icon", required: true, hint: "A Font Awesome name, e.g. fa-circle-info, fa-pen-to-square, fa-bell, fa-bullhorn, fa-calendar-days, fa-star" },
          { key: "icon_color", label: "Icon colour", type: "color" }
        ],
        onSave: async function (v) {
          var row = { name: v.name, icon: v.icon, icon_color: v.icon_color };
          if (c) await db(sb.from("notification_categories").update(row).eq("id", c.id));
          else await db(sb.from("notification_categories").insert(Object.assign({ sort_order: nextSort(cats) }, row)));
          toast("Saved", "ok"); draw();
        }
      });
    }
    function editNote(c, n, items) {
      openForm({
        title: n ? "Edit notification" : "New notification in “" + c.name + "”",
        values: n ? { title: n.title, body: n.body, color: n.color, badge: n.badge, active: n.active } : { color: "blue", badge: "info", active: true },
        fields: [
          { key: "title", label: "Title", required: true, placeholder: "You can use emojis 📄" },
          { key: "body", label: "Message", type: "textarea", required: true, hint: "Plain text is fine. For bold use <strong>like this</strong>. Line break: <br>. Link: <a href=\"https://…\" target=\"_blank\">text</a>" },
          { key: "color", label: "Colour", type: "select", options: NCOLORS },
          { key: "badge", label: "Badge", type: "select", options: NBADGES },
          { key: "active", label: "Show on the site", type: "checkbox" }
        ],
        onSave: async function (v) {
          var row = { title: v.title, body: v.body, color: v.color, badge: v.badge, active: !!v.active };
          if (n) await db(sb.from("notifications").update(row).eq("id", n.id));
          else await db(sb.from("notifications").insert(Object.assign({ category_id: c.id, sort_order: nextSort(items) }, row)));
          toast("Saved", "ok"); draw();
        }
      });
    }
    draw();
  }

  /* ============================================================
     HOME CAROUSEL
     ============================================================ */
  async function tabCarousel(host) {
    var body = h("div"); host.appendChild(body);
    function again() { if (body.isConnected) draw(); }
    async function draw() {
      var rows = sortRows(await swr("carousel", function () { return db(sb.from("carousel_items").select("*")); }, again));
      clear(body);
      var card = h("div", { class: "card" }, h("div", { class: "head" }, h("h2", {}, "Home page slideshow — " + rows.length), btn("+ Add slide", "pri", function () { edit(null, rows); })),
        h("div", { class: "muted", style: "margin-bottom:.6rem" }, "Put the picture/video file into the repo first (for example assets/carousal/img04.webp), then type its path here."));
      if (!rows.length) card.appendChild(h("div", { class: "empty" }, "No slides yet."));
      var list = h("div", { class: "list" });
      rows.forEach(function (r, i) {
        var it = r.item || {}, pic = it.type === "video" ? (it.thumbW || it.thumb) : it.src;
        list.appendChild(h("div", { class: "row", style: r.active ? "" : "opacity:.55" },
          pic ? h("img", { class: "th", src: "../" + pic, alt: "", onerror: function (e) { e.target.style.visibility = "hidden"; } }) : null,
          h("div", { class: "main" }, h("div", { class: "t" }, it.caption || "(no caption)"), h("div", { class: "s" }, h("span", { class: "badge" }, it.type || "image"), r.active ? "" : h("span", { class: "badge off" }, "hidden"), it.src || "")),
          h("div", { class: "acts" }, btn("Edit", "sm", function () { edit(r, rows); }),
            btn("✕", "bad sm ico", async function () { if (confirm("Delete this slide?")) { await db(sb.from("carousel_items").delete().eq("id", r.id)); draw(); } }),
            mover("carousel_items", rows, i, draw))));
      });
      card.appendChild(list); body.appendChild(card);
    }
    function edit(r, rows) {
      var it = r ? (r.item || {}) : {};
      openForm({
        title: r ? "Edit slide" : "Add slide",
        values: { type: it.type || "image", src: it.src || "", srcFb: it.srcFb || "", thumb: it.thumb || "", thumbW: it.thumbW || "", caption: it.caption || "", active: r ? r.active : true },
        fields: [
          { key: "type", label: "Type", type: "select", options: [["image", "Photo"], ["video", "Video"]] },
          { key: "src", label: "File path", required: true, placeholder: "assets/carousal/img04.webp" },
          { key: "srcFb", label: "Photo fallback (jpg, optional)", placeholder: "assets/carousal/img04.jpg" },
          { key: "thumb", label: "Video cover image (jpg)", placeholder: "assets/carousal/thum03.jpg" },
          { key: "thumbW", label: "Video cover image (webp, optional)", placeholder: "assets/carousal/thum03.webp" },
          { key: "caption", label: "Caption" },
          { key: "active", label: "Show on the site", type: "checkbox" }
        ],
        onSave: async function (v) {
          var item = { type: v.type, src: v.src, caption: v.caption };
          if (v.type === "image" && v.srcFb) item.srcFb = v.srcFb;
          if (v.type === "video") { if (v.thumb) item.thumb = v.thumb; if (v.thumbW) item.thumbW = v.thumbW; }
          if (r) await db(sb.from("carousel_items").update({ item: item, active: !!v.active }).eq("id", r.id));
          else await db(sb.from("carousel_items").insert({ item: item, active: !!v.active, sort_order: nextSort(rows) }));
          toast("Saved", "ok"); draw();
        }
      });
    }
    draw();
  }

  /* ============================================================
     MEMORIES
     ============================================================ */
  async function tabMemories(host) {
    var body = h("div"); host.appendChild(body);
    function again() { if (body.isConnected) draw(); }
    async function draw() {
      var rows = sortRows(await swr("memories", function () { return db(sb.from("memories").select("*")); }, again));
      clear(body);
      var card = h("div", { class: "card" }, h("div", { class: "head" }, h("h2", {}, "Memories — " + rows.length), btn("+ Add memory", "pri", function () { edit(null, rows); })));
      if (!rows.length) card.appendChild(h("div", { class: "empty" }, "No memories yet."));
      var list = h("div", { class: "list" });
      rows.forEach(function (r, i) {
        var m = Array.isArray(r.media) ? r.media : [], first = m[0], pic = first && (first.type === "video" ? first.thumb : first.src);
        list.appendChild(h("div", { class: "row" },
          pic ? h("img", { class: "th", src: "../" + pic, alt: "", onerror: function (e) { e.target.style.visibility = "hidden"; } }) : null,
          h("div", { class: "main" }, h("div", { class: "t" }, r.title), h("div", { class: "s" }, m.length + " item" + (m.length === 1 ? "" : "s") + (r.description ? " · " + r.description : ""))),
          h("div", { class: "acts" }, btn("Edit", "sm", function () { edit(r, rows); }),
            btn("✕", "bad sm ico", async function () { if (confirm("Delete “" + r.title + "”?")) { await db(sb.from("memories").delete().eq("id", r.id)); draw(); } }),
            mover("memories", rows, i, draw))));
      });
      card.appendChild(list); body.appendChild(card);
    }
    function edit(r, rows) {
      var media = (r && Array.isArray(r.media) ? r.media : []).map(function (m) { return Object.assign({ type: "image" }, m); });
      var title = h("input", { type: "text", value: r ? r.title : "", placeholder: "Memory title" }), desc = h("textarea", { style: "min-height:60px", value: r ? r.description || "" : "" });
      var box = h("div"), err = h("div", { class: "err" });
      function field(label, el) { return h("div", { class: "fld", style: "margin:0" }, h("label", {}, label), el); }
      function paint() {
        clear(box);
        media.forEach(function (m, i) {
          var type = h("select", {}, [["image", "Photo"], ["video", "Video"]].map(function (o) { return h("option", { value: o[0] }, o[1]); })); type.value = m.type || "image";
          type.addEventListener("change", function () { m.type = type.value; paint(); });
          var src = h("input", { type: "text", value: m.src || "", placeholder: "memories/photo.webp" }); src.addEventListener("input", function () { m.src = src.value; });
          var fb = h("input", { type: "text", value: (m.type === "video" ? m.thumb : m.srcFb) || "", placeholder: m.type === "video" ? "cover image (jpg)" : "fallback jpg (optional)" });
          fb.addEventListener("input", function () { if (m.type === "video") m.thumb = fb.value; else m.srcFb = fb.value; });
          var cap = h("input", { type: "text", value: m.caption || "", placeholder: "caption (optional)" }); cap.addEventListener("input", function () { m.caption = cap.value; });
          box.appendChild(h("div", { class: "mrow" }, h("div", { class: "two" }, field("Type", type), field("File path", src)), h("div", { class: "two", style: "margin-top:.5rem" }, field(m.type === "video" ? "Cover image" : "Fallback", fb), field("Caption", cap)),
            h("div", { class: "foot", style: "margin-top:.4rem" },
              btn("↑", "sm ico", function () { if (i > 0) { var t = media[i]; media[i] = media[i - 1]; media[i - 1] = t; paint(); } }),
              btn("↓", "sm ico", function () { if (i < media.length - 1) { var t = media[i]; media[i] = media[i + 1]; media[i + 1] = t; paint(); } }),
              btn("Remove", "bad sm", function () { media.splice(i, 1); paint(); }))));
        });
        if (!media.length) box.appendChild(h("div", { class: "empty" }, "No photos or videos yet."));
      }
      paint();
      var body2 = h("div", {}, field("Title *", title), h("div", { style: "height:.5rem" }), field("Description", desc), h("div", { class: "group" }, "Photos & videos"), box,
        h("div", { style: "margin-top:.4rem" }, btn("+ Add photo / video", "sm", function () { media.push({ type: "image", src: "" }); paint(); })), err,
        h("div", { class: "foot" }, btn("Cancel", "", function () { ovl.close(); }),
          btn("Save", "good", async function (ev) {
            if (!title.value.trim()) { err.textContent = "Title is required."; return; }
            var clean = media.filter(function (m) { return (m.src || "").trim(); }).map(function (m) {
              var o = { type: m.type || "image", src: m.src.trim() };
              if (o.type === "video") { if ((m.thumb || "").trim()) o.thumb = m.thumb.trim(); } else if ((m.srcFb || "").trim()) o.srcFb = m.srcFb.trim();
              if ((m.caption || "").trim()) o.caption = m.caption.trim();
              return o;
            });
            var row = { title: title.value.trim(), description: desc.value.trim() || null, media: clean };
            ev.target.disabled = true;
            try {
              if (r) await db(sb.from("memories").update(row).eq("id", r.id)); else await db(sb.from("memories").insert(Object.assign({ sort_order: nextSort(rows) }, row)));
              toast("Saved", "ok"); ovl.close(); draw();
            } catch (e) { ev.target.disabled = false; }
          })));
      var ovl = bigModal(r ? "Edit memory" : "Add memory", body2);
    }
    draw();
  }

  /* ============================================================
     SETTINGS (WhatsApp, footer, links)
     ============================================================ */
  function cleanWhatsapp(v) {
    var d = String(v || "").replace(/[^0-9]/g, "");
    if (/^0\d{9}$/.test(d)) d = "94" + d.slice(1);       // Sri Lankan 0724600493 -> 94724600493
    return d;
  }
  async function tabSettings(host) {
    var rows = await db(sb.from("site_settings").select("*")), S = {};
    rows.forEach(function (r) { S[r.key] = r.value; });
    var links = Array.isArray(S.footer_links) ? S.footer_links.map(function (l) { return { label: l.label || "", url: l.url || "" }; }) : [];
    var F = {};
    function fld(key, label, hint, area) {
      var el = area ? h("textarea", { style: "min-height:64px", value: S[key] == null ? "" : S[key] }) : h("input", { type: "text", value: S[key] == null ? "" : S[key] });
      F[key] = el; return h("div", { class: "fld" }, h("label", {}, label), el, hint ? h("div", { class: "hint" }, hint) : null);
    }
    var linkBox = h("div");
    function paintLinks() {
      clear(linkBox);
      links.forEach(function (l, i) {
        var a = h("input", { type: "text", value: l.label, placeholder: "Label (e.g. My website)" }), b = h("input", { type: "text", value: l.url, placeholder: "https://…" });
        a.addEventListener("input", function () { l.label = a.value; }); b.addEventListener("input", function () { l.url = b.value; });
        linkBox.appendChild(h("div", { class: "mrow" }, h("div", { class: "two" }, a, b), h("div", { class: "foot", style: "margin-top:.4rem" },
          btn("↑", "sm ico", function () { if (i > 0) { var t = links[i]; links[i] = links[i - 1]; links[i - 1] = t; paintLinks(); } }),
          btn("↓", "sm ico", function () { if (i < links.length - 1) { var t = links[i]; links[i] = links[i + 1]; links[i + 1] = t; paintLinks(); } }),
          btn("Remove", "bad sm", function () { links.splice(i, 1); paintLinks(); }))));
      });
      if (!links.length) linkBox.appendChild(h("div", { class: "empty" }, "No extra footer links."));
    }
    paintLinks();
    var card = h("div", { class: "card" }, h("h2", {}, "Site settings"),
      h("div", { class: "group" }, "WhatsApp button"),
      fld("whatsapp_number", "WhatsApp number", "With country code, digits only (94724600493). If you type 0724600493 it is converted for you."),
      fld("whatsapp_message", "Message that opens in WhatsApp", "", true),
      h("div", { class: "group" }, "About pop-up (tap the avatar)"),
      fld("admin_name", "Name"), fld("admin_role", "Line under the name"),
      h("div", { class: "group" }, "Footer"),
      fld("footer_copy", "Copyright text", "The year is added automatically."),
      fld("footer_dev_label", "Text before the logo", "Default: Developed by"),
      fld("footer_url", "Where the footer logo links to", "Your personal website."),
      h("div", { class: "group" }, "Extra footer links"), linkBox,
      h("div", { style: "margin:.4rem 0 1rem" }, btn("+ Add link", "sm", function () { links.push({ label: "", url: "" }); paintLinks(); })),
      h("div", { class: "foot" }, btn("Save settings", "good", async function (ev) {
        var wa = cleanWhatsapp(F.whatsapp_number.value);
        if (wa.length < 9) { toast("That WhatsApp number looks too short", "err"); return; }
        var url = F.footer_url.value.trim();
        if (url && !isHttp(url)) { toast("The footer link must start with https://", "err"); return; }
        for (var i = 0; i < links.length; i++) if (links[i].url && !isHttp(links[i].url)) { toast("Footer link " + (i + 1) + " must start with https://", "err"); return; }
        var out = [
          { key: "whatsapp_number", value: wa }, { key: "whatsapp_message", value: F.whatsapp_message.value },
          { key: "admin_name", value: F.admin_name.value.trim() }, { key: "admin_role", value: F.admin_role.value.trim() },
          { key: "footer_copy", value: F.footer_copy.value.trim() }, { key: "footer_dev_label", value: F.footer_dev_label.value.trim() },
          { key: "footer_url", value: url },
          { key: "footer_links", value: links.filter(function (l) { return l.label.trim() && l.url.trim(); }).map(function (l) { return { label: l.label.trim(), url: l.url.trim() }; }) }
        ];
        ev.target.disabled = true;
        try { await db(sb.from("site_settings").upsert(out)); F.whatsapp_number.value = wa; toast("Saved. Students see it within a few minutes.", "ok"); }
        finally { ev.target.disabled = false; }
      })));
    host.appendChild(card);
  }

  /* ============================================================
     BACKUP
     ============================================================ */
  async function tabBackup(host) {
    var out = h("div", { class: "muted" });
    host.appendChild(h("div", { class: "card" }, h("h2", {}, "Backup"),
      h("p", { class: "muted" }, "Downloads everything in the database as one file. Keep a copy now and then (for example before big changes)."),
      btn("⬇ Download backup", "pri", async function () {
        var tables = ["subjects", "notes", "recordings", "assignments", "assignment_files", "songs", "memories", "carousel_items", "notification_categories", "notifications", "site_settings"], dump = { exported_at: new Date().toISOString() };
        for (var i = 0; i < tables.length; i++) { out.textContent = "Reading " + tables[i] + "…"; dump[tables[i]] = await db(sb.from(tables[i]).select("*")); }
        var a = h("a", { href: URL.createObjectURL(new Blob([JSON.stringify(dump, null, 1)], { type: "application/json" })), download: "kuppia-backup-" + today() + ".json" });
        document.body.appendChild(a); a.click(); a.remove(); out.textContent = "Done."; toast("Backup downloaded", "ok");
      }), out));
  }

  /* ============================================================
     AI DATA (saved answers, quality signals, export for training)
     ============================================================ */
  function toJsonl(rows) {                               // one training example per line (chat format)
    return rows.map(function (r) { return JSON.stringify({ messages: [{ role: "user", content: r.question }, { role: "assistant", content: r.answer }], book: r.book || null, mode: r.mode || null, effort: r.effort || null, rating: r.rating || 0 }); }).join("\n") + "\n";
  }
  async function fetchAll(table, build) {                // the database hands out 1000 rows at a time
    var out = [], from = 0;
    for (;;) { var part = await db(build(sb.from(table)).range(from, from + 999)); out = out.concat(part); if (part.length < 1000) break; from += 1000; }
    return out;
  }
  function download(name, text, type) {
    var a = h("a", { href: URL.createObjectURL(new Blob([text], { type: type || "text/plain" })), download: name });
    document.body.appendChild(a); a.click(); a.remove();
  }
  async function tabAiData(host) {
    var body = h("div"); host.appendChild(body);
    var F = { kind: "all", book: "", term: "" };
    async function draw() {
      var rows = await db(sb.from("ai_logs").select("*").order("created_at", { ascending: false }).limit(300));
      clear(body);
      var cnt = function (f) { return rows.filter(f).length; }, worker = rows.filter(function (r) { return r.source === "worker"; });
      var stats = [["Saved answers", rows.length], ["👍 Good", cnt(function (r) { return r.rating === 1; })], ["👎 Not helpful", cnt(function (r) { return r.rating === -1; })], ["Tried again", cnt(function (r) { return r.retried; })],
        ["Copied", cnt(function (r) { return r.copied; })], ["Quotes verified", worker.length ? Math.round(100 * worker.filter(function (r) { return r.verified; }).length / worker.length) + "%" : "-"], ["Own key", cnt(function (r) { return r.source === "byok"; })]];
      var top = h("div", { class: "card" }, h("div", { class: "head" }, h("h2", {}, "AI data"),
        h("div", { style: "display:flex;gap:.4rem;flex-wrap:wrap" },
          btn("⬇ Good answers (training file)", "pri sm", async function (ev) {
            ev.target.disabled = true; try { var good = await fetchAll("ai_training", function (q) { return q.select("*").order("created_at"); }); if (!good.length) { toast("No good answers yet."); return; } download("kuppia-training-" + today() + ".jsonl", toJsonl(good), "application/x-ndjson"); toast(good.length + " answers exported", "ok"); } finally { ev.target.disabled = false; } }),
          btn("⬇ Everything (JSON)", "sm", async function (ev) {
            ev.target.disabled = true; try { var all = await fetchAll("ai_logs", function (q) { return q.select("*").order("created_at"); }); download("kuppia-ai-logs-" + today() + ".json", JSON.stringify(all, null, 1), "application/json"); toast(all.length + " rows exported", "ok"); } finally { ev.target.disabled = false; } }))),
        h("div", { class: "muted" }, "Every answer ආනා gives is saved without any name or IP. 👍, copying, and “Try again” tell you which answers were good. The training file contains only real-quote answers that nobody retried or thumbed down."),
        h("div", { style: "display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.8rem" }, stats.map(function (x) { return h("span", { class: "badge", style: "padding:.35rem .7rem;font-size:.72rem" }, x[0] + ": ", h("b", {}, String(x[1]))); })));
      body.appendChild(top);
      var books = {}; rows.forEach(function (r) { if (r.book) books[r.book] = 1; });
      var KINDS = [["all", "All"], ["good", "👍 Good"], ["bad", "👎 Bad"], ["retried", "Tried again"], ["unverified", "Quotes not verified"], ["byok", "Own key"]];
      var term = h("input", { type: "text", placeholder: "Search questions and answers…", value: F.term, style: "flex:1;min-width:160px" });
      var bsel = h("select", { style: "width:auto" }, h("option", { value: "" }, "All books"), Object.keys(books).map(function (b) { return h("option", { value: b }, b); })); bsel.value = F.book;
      var listBox = h("div", { class: "list" });
      function match(r) {
        if (F.kind === "good" && r.rating !== 1) return false; if (F.kind === "bad" && r.rating !== -1) return false; if (F.kind === "retried" && !r.retried) return false;
        if (F.kind === "unverified" && (r.verified || r.source === "byok" || r.topic === "general")) return false; if (F.kind === "byok" && r.source !== "byok") return false;
        if (F.book && r.book !== F.book) return false;
        if (F.term && (r.question + " " + r.answer).toLowerCase().indexOf(F.term.toLowerCase()) < 0) return false; return true;
      }
      function paint() {
        clear(listBox); var shown = rows.filter(match);
        if (!shown.length) listBox.appendChild(h("div", { class: "empty" }, rows.length ? "Nothing matches these filters." : "No answers saved yet. They appear here as students chat."));
        shown.slice(0, 120).forEach(function (r) {
          listBox.appendChild(h("div", { class: "row" },
            h("div", { class: "main" }, h("div", { class: "t" }, r.question),
              h("div", { class: "s" }, r.rating === 1 ? h("span", { class: "badge" }, "👍") : null, r.rating === -1 ? h("span", { class: "badge warn" }, "👎") : null, r.retried ? h("span", { class: "badge warn" }, "tried again") : null, r.copied ? h("span", { class: "badge" }, "copied") : null,
                r.source === "byok" ? h("span", { class: "badge vimeo" }, "own key") : (r.topic === "book" ? h("span", { class: "badge " + (r.verified ? "drive" : "warn") }, r.verified ? "quotes ok" : "quotes?") : null),
                [r.book || "general", r.mode, r.effort, new Date(r.created_at).toLocaleString()].filter(Boolean).join(" · "))),
            h("div", { class: "acts" }, btn("Read", "sm", function () { read(r); }),
              btn("✕", "bad sm ico", async function () { if (confirm("Delete this saved answer?")) { await db(sb.from("ai_logs").delete().eq("id", r.id)); toast("Deleted", "ok"); draw(); } }))));
        });
        if (shown.length > 120) listBox.appendChild(h("div", { class: "muted", style: "text-align:center;padding:.5rem" }, "Showing 120 of " + shown.length + ". Narrow the filters to see the rest."));
      }
      function read(r) {
        var pre = function (t) { return h("div", { style: "white-space:pre-wrap;line-height:1.65;font-size:.92rem;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:.8rem 1rem" }, t); };
        var m = bigModal("Saved answer", h("div", {}, h("div", { class: "group" }, "Question"), pre(r.question), h("div", { class: "group" }, "Answer"), pre(r.answer),
          h("div", { class: "muted", style: "margin-top:.8rem" }, "Provider: " + (r.provider || "-") + " · quotes: " + r.quotes + " (" + r.quotes_bad + " not found in the book) · " + (r.cached ? "from saved copy" : "fresh answer")),
          h("div", { class: "foot" }, btn("Close", "", function () { m.close(); }))));
      }
      term.addEventListener("input", function () { F.term = term.value; paint(); });
      bsel.addEventListener("change", function () { F.book = bsel.value; paint(); });
      body.appendChild(h("div", { class: "card" }, h("div", { style: "display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.7rem" }, KINDS.map(function (k) { return btn(k[1], "sm" + (F.kind === k[0] ? " pri" : ""), function () { F.kind = k[0]; draw(); }); })),
        h("div", { style: "display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.8rem" }, term, bsel), listBox));
      paint();
    }
    draw();
  }

  /* ============================================================
     LOGIN + SHELL
     ============================================================ */
  var TABS = [["notes", "fa-book-open", "Notes", tabNotes], ["recordings", "fa-clapperboard", "Recordings", tabRecordings], ["assignments", "fa-file-pen", "Assignments", tabAssignments],
    ["songs", "fa-music", "Songs", tabSongs], ["notifications", "fa-bell", "Notices", tabNotifications], ["carousel", "fa-images", "Slideshow", tabCarousel],
    ["memories", "fa-camera-retro", "Memories", tabMemories], ["aidata", "fa-robot", "AI Data", tabAiData], ["settings", "fa-gear", "Settings", tabSettings], ["backup", "fa-floppy-disk", "Backup", tabBackup]];
  var NO_REORDER = { settings: 1, backup: 1, aidata: 1 };
  var app = document.getElementById("app");
  document.body.appendChild(h("div", { class: "busy-bar" }));

  function showLogin(msg) {
    clear(app); document.body.classList.remove("admin-page");
    var user = h("input", { type: "text", autocomplete: "username", autocapitalize: "none", spellcheck: "false", placeholder: "Username", "aria-label": "Username", required: true }),
        pass = h("input", { type: "password", autocomplete: "current-password", placeholder: "Password", "aria-label": "Password", required: true }),
        err = h("div", { class: "lg-err", role: "alert" }, msg || ""), go = h("button", { class: "lg-btn", type: "submit" }, "Log in");
    var eye = h("button", { class: "lg-eye", type: "button", tabindex: "-1", "aria-label": "Show password", onclick: function () {
      var show = pass.type === "password"; pass.type = show ? "text" : "password"; clear(eye); eye.appendChild(ic(show ? "fa-eye-slash" : "fa-eye")); } }, ic("fa-eye"));
    var aq = document.createElement("aquinas-logo"); aq.setAttribute("size", "100%"); aq.setAttribute("once", "adm-aq"); aq.setAttribute("fps", "30");
    var ds = document.createElement("dsvb-logo"); ds.setAttribute("size", "100%"); ds.setAttribute("once", "adm-ds"); ds.setAttribute("fps", "30");
    var f = h("form", { class: "lg-body", novalidate: true },
      h("div", { class: "lg-title" }, h("span", {}, "ආනාගේ"), " Kuppia"), h("div", { class: "lg-sub" }, "Admin panel"),
      h("div", { class: "lg-field" }, h("i", { class: "fa-solid fa-user lead" }), user),
      h("div", { class: "lg-field" }, h("i", { class: "fa-solid fa-lock lead" }), pass, eye),
      err, go, h("div", { class: "lg-foot" }, h("a", { href: "../" }, "← Back to the site")));
    f.addEventListener("submit", async function (e) {
      e.preventDefault(); err.textContent = "";
      if (!user.value.trim() || !pass.value) { err.textContent = "Enter your username and password."; return; }
      go.disabled = true; go.textContent = "Signing in…";
      var r = await sb.auth.signInWithPassword({ email: EMAIL(user.value), password: pass.value });
      go.disabled = false; go.textContent = "Log in";
      if (r.error) {
        err.textContent = /invalid login/i.test(r.error.message) ? "Wrong username or password." : /not confirmed/i.test(r.error.message) ? "This user isn’t confirmed yet. In Supabase, tick “Auto Confirm User”." : r.error.message;
        return;
      }
      start();
    });
    app.appendChild(h("div", { class: "lg-wrap" }, h("div", { class: "lg-card" }, h("div", { class: "lg-band" }, h("div", { class: "lg-logo" }, aq), h("div", { class: "lg-logo" }, ds)), f)));
    user.focus();
    setTimeout(function () { loadScript("../assets/logos/aquinas-logo.js"); loadScript("../assets/logos/dsvb-logo.js"); }, 40);
  }

  var IDLE_MS = 30 * 60 * 1000, idleLeft = IDLE_MS, tickH = null;
  function startTimer(chip) {
    ["pointerdown", "keydown", "touchstart"].forEach(function (ev) { document.addEventListener(ev, function () { idleLeft = IDLE_MS; }, true); });
    var txt = h("span", {}, "30:00"); chip.appendChild(ic("fa-clock")); chip.appendChild(txt);
    tickH = setInterval(function () {
      if (document.querySelector(".ovl")) idleLeft = IDLE_MS;           // never log out in the middle of editing
      else idleLeft -= 1000;
      var m = Math.max(0, Math.floor(idleLeft / 60000)), sec = Math.max(0, Math.floor(idleLeft / 1000) % 60);
      txt.textContent = pad(m) + ":" + pad(sec); chip.classList.toggle("warn", idleLeft < 120000);
      if (idleLeft <= 0) logout();
    }, 1000);
  }
  async function logout() {
    clearInterval(tickH); await sb.auth.signOut();
    showLogin(); try { location.reload(); } catch (e) {}
  }

  async function start() {
    try { SUBJECTS = await loadSubjects(); }
    catch (e) { showLogin("Could not load data. Is the Supabase project paused or the SQL not run yet?"); return; }
    clear(app); document.body.classList.add("admin-page");
    if (window.DSVBLayout) { DSVBLayout.top(); DSVBLayout.bottom(); }
    window.DSVB_NO_PRELOAD = true; var inc = document.createElement("script"); inc.src = "../js/includes.js"; inc.onload = function () { window.playAudio = function () {}; try { var th = localStorage.getItem("aana-theme"); if (th) document.documentElement.setAttribute("data-theme", th); } catch (e) {} }; document.body.appendChild(inc);

    var main = h("div"), chip = h("span", { class: "session-timer", title: "You are logged out after 30 minutes without activity" });
    var lock = h("button", { class: "lock-btn", type: "button", onclick: function () { setUnlocked(!UNLOCKED); } });
    var tabsBar = h("div", { class: "main-tabs" });
    function open(id) {
      var t = TABS.filter(function (x) { return x[0] === id; })[0] || TABS[0];
      Array.prototype.forEach.call(tabsBar.children, function (b) { b.classList.toggle("active", b.getAttribute("data-id") === t[0]); });
      lock.style.display = NO_REORDER[t[0]] ? "none" : "";
      clear(main); history.replaceState(null, "", "#" + t[0]);
      Promise.resolve(t[3](main)).catch(function (e) { console.error(e); });
    }
    TABS.forEach(function (t) { tabsBar.appendChild(h("button", { class: "main-tab", "data-id": t[0], type: "button", onclick: function () { open(t[0]); } }, ic(t[1]), t[2])); });
    app.appendChild(h("div", { class: "adm-wrap" },
      h("div", { class: "adm-title-bar" },
        h("div", {}, h("div", { class: "adm-title" }, h("span", { class: "adm-title-icon" }, ic("fa-screwdriver-wrench")), "Admin Panel"), h("div", { class: "adm-sub" }, "Manage your site content", chip)),
        h("div", { class: "adm-actions" }, lock, h("button", { class: "logout-btn", type: "button", onclick: logout }, ic("fa-right-from-bracket"), "Logout"))),
      tabsBar, main));
    setUnlocked(false); startTimer(chip);
    open((location.hash || "").slice(1));
  }

  async function boot() {
    if (!C.SUPABASE_URL || C.SUPABASE_URL.indexOf("PASTE_") === 0) { app.textContent = "Open js/config.js and paste your Supabase URL and key first."; return; }
    var s = (await sb.auth.getSession()).data.session;
    if (s && s.user && s.user.email === EMAIL("superadmin")) start(); else { if (s) await sb.auth.signOut(); showLogin(); }
  }

  window.AdminLib = { parseTime: parseTime, fmtTime: fmtTime, parseLyricsText: parseLyricsText, toLrc: toLrc, cleanWhatsapp: cleanWhatsapp, guessType: guessType, applyOrder: applyOrder, toJsonl: toJsonl, acadYear: acadYear, EMAIL: EMAIL };
  boot();
})();
