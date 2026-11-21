/* ============================================================
   retrieve.js  -  finds the right parts of a book for a question.
   A book = book.txt (full text, sections start with "## Chapter 5") + notes.txt (study notes, same "## " style).
   AanaBook.load(meta, bookText, notesText) -> object with:
     .passages(question, max)  real book passages to quote from   [{l: "Chapter 5", t: "..."}]
     .notesFor(question)       study-note sections                 ["Chapter 5: ...", ...]
   ============================================================ */
(function () {
  "use strict";
  var STOP = {}; ("a an the and or but if then than that this those these of to in on at by for with from as is are was were be been being am do does did have has had " +
    "i you he she it we they me him her us them my your his its our their not no so too very can could would should will shall may might must just about into over under " +
    "again there here what which who whom whose when where why how all any each few more most other some such only own same tell me please explain give say said says").split(" ").forEach(function (w) { STOP[w] = 1; });
  var NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20 };
  var BROAD = /\b(summar\w*|overview|synopsis|recap|whole (book|story|novel|play|poem)|entire (book|story|novel|play|poem)|plot|what (is|was) (this|the) (book|story|novel|play|poem) about|what happens|main (characters|themes|ideas|events)|characters|themes?|ending|beginning|timeline|narrators?|setting)\b/i;
  var AUTHOR = /\b(author|writer|who wrote|biograph\w*|background|context|preface|introduction|when (was|did)\b.*\b(written|wrote|published)|why did\b.*\bwrite|inspiration)\b/i;

  function stem(w) {
    if (w.length > 5 && /ies$/.test(w)) return w.slice(0, -3) + "y";
    if (w.length > 6 && /ing$/.test(w)) return w.slice(0, -3);
    if (w.length > 5 && /ed$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) return w.slice(0, -1);
    return w;
  }
  function toks(t) { return (String(t).toLowerCase().match(/[a-z0-9]+/g) || []).filter(function (w) { return w.length > 1 && !STOP[w]; }).map(stem); }
  function tf(t) { var m = {}; t.forEach(function (x) { m[x] = (m[x] || 0) + 1; }); return m; }

  function parseSections(text) {
    var re = /^## (.+)$/gm, m, idx = [], out = [];
    while ((m = re.exec(text || ""))) idx.push({ h: m[1].trim(), s: m.index, e: re.lastIndex });
    for (var i = 0; i < idx.length; i++) out.push({ label: idx[i].h, text: text.slice(idx[i].e, i + 1 < idx.length ? idx[i + 1].s : text.length).replace(/\s+/g, " ").trim() });
    return out;
  }
  function index(items) {                               // items: [{text,...}] -> adds tf/len, returns stats
    var df = {}, total = 0;
    items.forEach(function (c) { c.t = toks(c.text); c.tf = tf(c.t); c.len = c.t.length || 1; total += c.len; Object.keys(c.tf).forEach(function (k) { df[k] = (df[k] || 0) + 1; }); });
    return { df: df, N: items.length, avg: total / Math.max(1, items.length) };
  }
  function bm25(qt, c, st) {
    var s = 0, k1 = 1.4, b = .75;
    for (var i = 0; i < qt.length; i++) {
      var f = c.tf[qt[i]]; if (!f) continue;
      var idf = Math.log(1 + (st.N - st.df[qt[i]] + .5) / (st.df[qt[i]] + .5));
      s += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * c.len / st.avg));
    }
    return s;
  }
  function unique(a) { var s = {}; return a.filter(function (x) { return s[x] ? false : (s[x] = 1); }); }
  function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }

  function Book(meta, bookText, notesText) {
    this.meta = meta || {};
    this.sections = parseSections(bookText); this.notes = parseSections(notesText);
    var chunks = [], SIZE = 170, STEP = 130;
    this.sections.forEach(function (sec, si) {
      var w = sec.text.split(" ");
      for (var i = 0; i < w.length; i += STEP) {
        chunks.push({ text: w.slice(i, i + SIZE).join(" "), label: sec.label, sec: si });
        if (i + SIZE >= w.length) break;
      }
    });
    this.chunks = chunks; this.cs = index(chunks);
    this.nt = this.notes.map(function (n) { return { text: n.label + " " + n.text, label: n.label, full: n.text }; }); this.ns = index(this.nt);
  }
  // "chapter 5", "letter two", "act 3" -> {word:"Chapter", n:5}
  Book.prototype.ref = function (q) {
    var m = String(q).match(/\b(chapter|letter|act|scene|part|book|canto|volume)s?\s+(\d+|[a-z]+)\b/i); if (!m) return null;
    var n = /^\d+$/.test(m[2]) ? +m[2] : NUM[m[2].toLowerCase()]; if (!n) return null;
    var word = cap(m[1]), re = new RegExp("^" + word + " " + n + "(?![0-9])", "i");
    if (!this.sections.some(function (s) { return re.test(s.label); })) return null;
    return { word: word, n: n, re: re, text: m[0] };
  };
  Book.prototype.passages = function (q, max) {
    max = max || 10; var ref = this.ref(q), broad = BROAD.test(q) && !ref, self = this, pick = [];
    var qt = unique(toks(ref ? q.replace(ref.text, " ") : q));
    if (ref) {
      var own = this.chunks.filter(function (c) { return ref.re.test(c.label); });
      if (own.length <= max) pick = own;
      else {                                            // spread across the whole chapter so a summary covers it all
        for (var i = 0; i < max; i++) pick.push(own[Math.round(i * (own.length - 1) / (max - 1))]);
        pick = unique(pick.map(function (c) { return own.indexOf(c); })).map(function (i) { return own[i]; });
      }
    } else if (broad) {
      var firsts = [], seen = {};
      this.chunks.forEach(function (c) { if (!seen[c.sec]) { seen[c.sec] = 1; firsts.push(c); } });
      var step = Math.max(1, firsts.length / Math.max(1, max - 2));
      for (var j = 0; j < firsts.length && pick.length < max - 2; j += step) pick.push(firsts[Math.floor(j)]);
      pick = unique(pick.map(function (c) { return self.chunks.indexOf(c); })).map(function (i) { return self.chunks[i]; });
      this._best(qt, 2, pick).forEach(function (c) { pick.push(c); });
    } else {
      pick = this._best(qt, max, []);
    }
    return pick.slice(0, max).sort(function (a, b) { return self.chunks.indexOf(a) - self.chunks.indexOf(b); }).map(function (c) { return { l: c.label, t: c.text.slice(0, 2500) }; });
  };
  Book.prototype._best = function (qt, n, skip) {      // best-scoring chunks, at most 3 per section so answers see the whole book
    var self = this, per = {}, out = [];
    var scored = this.chunks.map(function (c) { return { c: c, s: bm25(qt, c, self.cs) }; }).filter(function (x) { return x.s > 0 && skip.indexOf(x.c) < 0; }).sort(function (a, b) { return b.s - a.s; });
    for (var i = 0; i < scored.length && out.length < n; i++) { var k = scored[i].c.sec; if ((per[k] || 0) >= 3) continue; per[k] = (per[k] || 0) + 1; out.push(scored[i].c); }
    return out;
  };
  Book.prototype.notesFor = function (q) {
    var ref = this.ref(q), self = this, pick = [], MAXC = 13500;
    function line(n, cut) { return n.label + ": " + (cut ? n.full.slice(0, cut) : n.full); }
    function pack(arr) { var out = [], cur = ""; arr.forEach(function (s) { if (cur && (cur + "\n\n" + s).length > MAXC) { out.push(cur); cur = ""; } cur = cur ? cur + "\n\n" + s : s; }); if (cur) out.push(cur); return out.slice(0, 4); }
    if (ref) pick = this.nt.filter(function (n) { return ref.re.test(n.label); }).map(function (n) { return line(n); });
    var qt = unique(toks(ref ? q.replace(ref.text, " ") : q));
    if (!ref && BROAD.test(q)) {
      pick = this.nt.filter(function (n) { return !/^afterword/i.test(n.label); }).map(function (n) { return line(n, 650); });
    } else {
      var sc = this.nt.map(function (n) { return { n: n, s: bm25(qt, n, self.ns) }; }).filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; }).slice(0, ref ? 2 : 3);
      sc.forEach(function (x) { var l = line(x.n); if (pick.indexOf(l) < 0) pick.push(l); });
      if (AUTHOR.test(q)) { var fm = this.nt.filter(function (n) { return /^(front matter|about the author)/i.test(n.label); })[0]; if (fm) { var fl = line(fm); if (pick.indexOf(fl) < 0) pick.unshift(fl); } }
    }
    return pack(pick);
  };
  window.AanaBook = { load: function (meta, b, n) { return new Book(meta, b, n); }, parseSections: parseSections };
})();
