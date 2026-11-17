/* ============================================================
   data.js  -  talks to Supabase and returns data in EXACTLY the
   shapes the old PHP api/*.php files returned, so the page code
   barely changed. Read-only (public). The admin uses its own file.
   ============================================================ */
(function () {
  "use strict";
  var C = window.DSVB_CONFIG || {};
  var READY = C.SUPABASE_URL && C.SUPABASE_KEY && C.SUPABASE_URL.indexOf("PASTE_") !== 0;
  var TIMEOUT = 7000;

  function lsGet(k) { try { return JSON.parse(localStorage.getItem("dsvb:" + k)); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem("dsvb:" + k, JSON.stringify(v)); } catch (e) {} }

  // One REST call. Falls back to the last good copy if the network (or a paused project) fails.
  function rest(table, query) {
    var key = "t:" + table + "?" + query;
    if (!READY) return Promise.reject(new Error("Site not configured yet (js/config.js)."));
    var ctl = ("AbortController" in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, TIMEOUT);
    return fetch(C.SUPABASE_URL + "/rest/v1/" + table + "?" + query, {
      headers: { apikey: C.SUPABASE_KEY, Accept: "application/json" },
      signal: ctl ? ctl.signal : undefined
    }).then(function (r) {
      clearTimeout(timer);
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (rows) { lsSet(key, rows); return rows; })
      .catch(function (err) {
        clearTimeout(timer);
        var old = lsGet(key);
        if (old) return old;
        throw err;
      });
  }

  function fileObj(r) { return { name: r.name, desc: r.description, fileType: r.file_type, url: r.url }; }
  var bySort = function (a, b) { return (a.sort_order - b.sort_order) || (a.id - b.id); };

  var builders = {
    // { "n-y1s1-phil": { lecturerNotes:[], aanaNotes:[], pastPapers:[] } }
    notes: function () {
      return rest("notes", "select=id,subject_id,category,name,description,file_type,url,sort_order&order=subject_id,sort_order,id").then(function (rows) {
        var out = {};
        rows.sort(bySort).forEach(function (r) {
          var k = "n-" + r.subject_id;
          var o = out[k] || (out[k] = { lecturerNotes: [], aanaNotes: [], pastPapers: [] });
          (r.category === "lecturer" ? o.lecturerNotes : r.category === "aana" ? o.aanaNotes : o.pastPapers).push(fileObj(r));
        });
        return out;
      });
    },
    // { "r-y1s1-phil": [ {label,date,url,noteId} ] }  noteId is automatic: the notes of the SAME subject
    recordings: function () {
      return Promise.all([
        rest("recordings", "select=id,subject_id,label,date_info,url,sort_order&order=subject_id,sort_order,id"),
        rest("notes", "select=subject_id").catch(function () { return []; })
      ]).then(function (res) {
        var has = {}; res[1].forEach(function (n) { has[n.subject_id] = 1; });
        var out = {};
        res[0].sort(bySort).forEach(function (r) {
          (out["r-" + r.subject_id] = out["r-" + r.subject_id] || []).push({
            label: r.label, date: r.date_info, url: r.url,
            noteId: has[r.subject_id] ? "n-" + r.subject_id : ""
          });
        });
        return out;
      });
    },
    // { "a-y1s1-ict": { briefFiles:[entry], aanaFiles:[entry] } }
    assignments: function () {
      return rest("assignments", "select=id,subject_id,category,name,description,entry_category,what_to_do,deadline,sort_order,assignment_files(id,name,description,file_type,url,sort_order)&order=subject_id,sort_order,id").then(function (rows) {
        var out = {};
        rows.sort(bySort).forEach(function (e) {
          var k = "a-" + e.subject_id;
          var o = out[k] || (out[k] = { briefFiles: [], aanaFiles: [] });
          var entry = { name: e.name, desc: e.description, category: e.entry_category, whatToDo: e.what_to_do, deadline: e.deadline,
            files: (e.assignment_files || []).sort(bySort).map(fileObj) };
          (e.category === "brief" ? o.briefFiles : o.aanaFiles).push(entry);
        });
        return out;
      });
    },
    // [{category,icon,iconColor,items:[{color,badge,title,text}]}]
    notifications: function () {
      return rest("notification_categories", "select=id,name,icon,icon_color,sort_order,notifications(id,color,badge,title,body,active,sort_order)&order=sort_order,id").then(function (cats) {
        return cats.map(function (c) {
          return { category: c.name, icon: c.icon, iconColor: c.icon_color,
            items: (c.notifications || []).filter(function (n) { return n.active; }).sort(bySort)
              .map(function (n) { return { color: n.color, badge: n.badge, title: n.title, text: n.body }; }) };
        }).filter(function (c) { return c.items.length; });
      });
    },
    // [{type,src,srcFb,thumb,thumbW,caption}]
    carousel: function () {
      return rest("carousel_items", "select=id,item,active,sort_order&order=sort_order,id").then(function (rows) {
        return rows.filter(function (r) { return r.active; }).sort(bySort).map(function (r) { return r.item; });
      });
    },
    // [{title,desc,media:[...]}]
    memories: function () {
      return rest("memories", "select=id,title,description,media,sort_order&order=sort_order,id").then(function (rows) {
        return rows.sort(bySort).map(function (r) { return { title: r.title, desc: r.description, media: r.media || [] }; });
      });
    },
    // { sinhala:[{file,name,desc,lyrics:[{time,text}]}], foreign:[...] }
    songs: function () {
      return rest("songs", "select=id,grp,name,artist,audio_file,lyrics,sort_order&order=sort_order,id").then(function (rows) {
        var out = { sinhala: [], foreign: [] };
        rows.sort(bySort).forEach(function (s) {
          (out[s.grp] || (out[s.grp] = [])).push({
            file: (C.MUSIC_DIR || "music/") + s.audio_file, name: s.name, desc: s.artist || "",
            lyrics: Array.isArray(s.lyrics) ? s.lyrics : []
          });
        });
        return out;
      });
    },
    // { whatsapp_number: "...", footer_name: "...", ... }
    settings: function () {
      return rest("site_settings", "select=key,value").then(function (rows) {
        var o = {}; rows.forEach(function (r) { o[r.key] = r.value; }); return o;
      });
    }
  };

  // DSVB.load("notes") -> Promise(data)      DSVB.api("notes") -> Promise(Response-like, drop-in for fetch('api/notes.php'))
  window.DSVB = {
    ready: !!READY,
    load: function (name) { return builders[name](); },
    api: function (name) {
      return builders[name]().then(function (d) { return { ok: true, json: function () { return Promise.resolve(d); } }; })
        .catch(function () { return { ok: false, json: function () { return Promise.resolve({ error: 'DB error' }); } }; });
    },
    cached: function (name) { return lsGet("s:" + name); },
    store: function (name, v) { lsSet("s:" + name, v); },
    // Same call shape the old download.php had. With a Cloudflare Worker set in config.js the file streams
    // through it (no Drive app hijack on Android). Without one, we fall back to the direct Drive link.
    proxyUrl: function (dlUrl, name, ext) {
      if (!C.DOWNLOAD_PROXY) return dlUrl;
      return C.DOWNLOAD_PROXY.replace(/\/$/, "") + "/?url=" + encodeURIComponent(dlUrl) +
        "&name=" + encodeURIComponent(name || "file") + (ext ? "&ext=" + ext : "");
    }
  };
})();
