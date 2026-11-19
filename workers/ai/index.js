// ආනා Study Buddy v2: Cloudflare Worker. Picks an AI, checks the quotes, caches good answers,
// streams live status ("thinking", "checking"), saves every answer for later training, pings Supabase.

// ================= EDIT HERE: your AIs (one line each) =================
// KEYS: you never edit code to add keys. In Cloudflare add a Secret whose name STARTS WITH the key name shown on the AI's line.
//   groq: GROQ_KEY, GROQ_KEY_2 ...   cerebras: CEREBRAS_KEY, CEREBRAS_KEY_2 ...   gemini: GEMINI_KEY_2, GEMINI_PAID_KEY ...
//   mistral: MISTRAL_KEY_2 ...   openrouter: OPENROUTER_KEY_2 ...   One secret may hold several keys separated by commas.
// Add any OpenAI-compatible AI: name, url, model, and the NAME of the secret holding its key.
//   effort:true  = this AI understands "reasoning_effort" (Fast/Balanced/Deep thinking is passed to it)
//   strong:true  = tried first when the student picks Deep thinking
// An AI with no key set is skipped automatically. Check model names on each provider's site (they change).
const PROVIDERS = [
  { name: "groq",       url: "https://api.groq.com/openai/v1/chat/completions",                          model: "openai/gpt-oss-120b", effort: true, strong: true, key: "GROQ_KEY" },
  { name: "cerebras",   url: "https://api.cerebras.ai/v1/chat/completions",                              model: "llama-3.3-70b",                           key: "CEREBRAS_KEY" },
  { name: "gemini",     url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", model: "gemini-3.5-flash-lite", strong: true, key: "GEMINI_KEY", also: ["GEMINI_PAID"] },
  { name: "mistral",    url: "https://api.mistral.ai/v1/chat/completions",                               model: "mistral-small-latest",                    key: "MISTRAL_KEY" },
  { name: "openrouter", url: "https://openrouter.ai/api/v1/chat/completions",                            model: "meta-llama/llama-3.3-70b-instruct:free",  key: "OPENROUTER_KEY" },
  { name: "cloudflare", cf: true, model: "@cf/meta/llama-3.1-8b-instruct" }   // uses the AI binding, no key needed
];
// Finds every key for every AI automatically (see KEYS note above). Add keys in Cloudflare, no code changes.
function expandProviders(env) {
  const out = [];
  for (const p of PROVIDERS) {
    if (p.cf) { if (env.AI) out.push(p); continue }
    const prefixes = [p.key, ...(p.also || [])];
    for (const sname of Object.keys(env).sort()) {
      if (typeof env[sname] !== "string" || !prefixes.some(x => sname.toUpperCase().startsWith(x))) continue;
      env[sname].split(/[,\s]+/).filter(k => k.length > 20).forEach((k, i) =>
        out.push({ ...p, name: p.name + ":" + sname + (i ? "#" + (i + 1) : ""), apiKey: k }));
    }
  }
  return out;
}
const SETTINGS = {
  CACHE_VERSION: 5,     // raise this number to throw away ALL saved answers
  cacheDays: 7,         // saved answers expire after this long
  perIp: 30,            // questions allowed per person...
  windowMin: 10,        // ...in this many minutes
  timeoutMs: 22000,     // give up on one AI after this long (Deep thinking gets double)
  maxTries: 5,          // how many different AIs to try per question
  skipMinutes: [5, 30, 120]  // how long a failing AI is skipped (grows each time)
};
// What the "Thinking" menu on the chat page means. Bigger = smarter and longer answers, but slower.
const EFFORT = {
  fast:     { reason: "low",    maxTokens: 1000, passages: 6,  hist: 2, histChars: 500 },
  balanced: { reason: "medium", maxTokens: 2200, passages: 10, hist: 4, histChars: 800 },
  deep:     { reason: "high",   maxTokens: 4000, passages: 16, hist: 6, histChars: 1200 }
};
// =======================================================================

function buildPrompt({ title, topic, mode, effort, passages, bg }) {
  const len = {
    short: "LENGTH: very short. At most 3 sentences and at most one quote.",
    simple: "LENGTH: short. Use very simple words and short sentences, like explaining to a younger friend. Give one small everyday example or comparison. Do not repeat your earlier wording.",
    normal: "LENGTH: clear and complete, usually 200 to 350 words, in short paragraphs. For a summary of the book or of a chapter, cover everything in order from start to finish (up to about 450 words). Never cut an answer short just to be brief.",
    detailed: "LENGTH: the student wants MORE. Give a full, deep explanation of about 500 to 800 words, in short paragraphs, going step by step. Add important details, reasons, examples and what it means. Do not repeat your earlier answer, build on it and add new information."
  }[mode] || "";
  const think = effort === "deep" ? "THINKING: take your time. Cover the question completely, connect ideas across the whole book, and check every claim against the excerpts before you write it."
    : effort === "fast" ? "THINKING: answer quickly and directly." : "";
  const style = `STYLE
- Never use em dashes or en dashes. Use commas or full stops instead.
- Do not use asterisks, hashes or other markdown. Write titles as plain text. For a short list, put each item on its own line starting with a hyphen and a space.
- Do not start with "Hi" or any greeting unless the student just greeted you. Go straight to the answer.
- Do not announce what you are about to do ("Here is a short, simple picture..."). Just do it.
- No emojis, except at most one when replying to a greeting.
- Always reply in simple English, even if the student writes in another language.`;
  const who = `You are Aana (ආනා), a friendly English teacher. Many students are not native English speakers, so use plain everyday words and short sentences, and explain any hard word in a few words. Sound like a kind human teacher chatting with a student, not a robot or a textbook. Be encouraging and never cold.`;
  if (topic === "general") return `${who}
You are in GENERAL CHAT: you help with English language, grammar, vocabulary, literature, essay writing, exam technique and teaching methods.

${style}

RULES
1. Greetings, thanks and small talk: reply warmly in one or two sentences, then offer help.
2. Explain ideas with a small everyday example. Be accurate. If you are not sure, say so honestly. Never guess.
3. Never invent quotations, page numbers or facts about a book. If the student asks about the exact words or details of a particular book, give only what you are sure of, and tell them to pick that book from the Topic menu so you can use the real text.
4. If the student says they still do not understand, explain again in a different, simpler way, gently.
${len}
${think}`;
  const ex = (passages || []).map((p, i) => `[${i + 1}] (${p.l}) ${p.t}`).join("\n\n") || "(none for this question)";
  return `${who}
You are helping students study "${title}".

${style}
- Never say "excerpt", "passage", "notes" or "the text you gave me". Talk about the book naturally.

RULES
1. Greetings, thanks and small talk: reply warmly in one or two sentences, then offer help with the book.
2. Questions about the book: use ONLY the information in the EXCERPTS and STUDY NOTES below. Take quotes only from the EXCERPTS, never from the notes. Back important claims with a SHORT exact quote copied character for character, in double quotes, followed by its label in brackets, like (Chapter 5) or (Letter 4). If you skip words inside a quote, use three dots, and make sure every piece is exact. Never invent or change a quote. If the answer is not there, say so honestly and suggest asking another way. Never guess.
3. Meaning of a word: first look for the word in the excerpts. Explain what it means IN THAT SENTENCE of the book (quote it with its label), then mention one or two other common meanings briefly so the student sees the difference. If the word is not in the excerpts, give its general meaning and say you could not find it in the part of the book you have in front of you.
4. If asked for quotes to use in an essay or exam: give 3 to 5 short exact quotes, each with its label and one plain sentence on what it shows.
5. If the student says they still do not understand, explain again in a different, simpler way with a small everyday example, and be gentle about it.
6. Never state facts about the book that are not in the excerpts or study notes. For a summary or overview, cover the whole story from start to finish in order, not just a few scenes.
${len}
${think}
${bg && bg.length ? "\nSTUDY NOTES (reliable facts about the book, in plain English. Use them for facts, but never put quotation marks around their words):\n" + bg.join("\n\n") + "\n" : ""}
EXCERPTS (the real words of the book, safe to quote):\n${ex}`;
}

const nz = t => t.toLowerCase().replace(/['’‘`]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
function checker(pool) {
  const w = nz(pool).split(" "), P = w.join(" "), tri = new Set();
  for (let i = 0; i < w.length - 2; i++) tri.add(w[i] + " " + w[i + 1] + " " + w[i + 2]);
  const part = n => { if (P.includes(n)) return true; const x = n.split(" "); if (x.length < 4) return false; let h = 0, t = 0;
    for (let i = 0; i < x.length - 2; i++) { t++; if (tri.has(x[i] + " " + x[i + 1] + " " + x[i + 2])) h++ } return h / t >= .8 };
  const found = s => { const ps = s.split(/\.\.\.|…/).map(nz).filter(Boolean); return ps.length > 0 && ps.every(part) };   // each piece between "..." checked on its own
  return a => { let n = 0, bad = 0; for (const m of a.matchAll(/(?:"|“)([^"”]{25,}?)(?:"|”)/g)) { n++; if (!found(m[1])) bad++ } return { n, bad } };
}
const clean = t => t.replace(/(“[^”]*”|"[^"]*")|\s*[—–]\s*/g, (m, q) => q || ", ");   // no em dashes outside quotes
const sha = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, "0")).join("");
const J = (o, s, h) => new Response(JSON.stringify(o), { status: s || 200, headers: { "Content-Type": "application/json", ...h } });
const slow = (ms) => new Promise((_, r) => setTimeout(() => r(Object.assign(new Error("timeout"), { status: 0 })), ms));
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const KEYLIKE = /\b(sk-[A-Za-z0-9_-]{20,}|gsk_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|sb_secret_\w+|eyJ[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{20,})/;

// ---- health: remember which AIs are failing, skip them for a while ----
let H = null, Ht = 0, rr = Math.floor(Math.random() * 100);
async function loadH(env) { if (H && Date.now() - Ht < 20000) return H; try { H = JSON.parse(await env.KV.get("health") || "{}") } catch { H = {} } Ht = Date.now(); return H }
const saveH = env => env.KV.put("health", JSON.stringify(H)).catch(() => {});
function markFail(p, e) {
  const h = H[p.name] || { f: 0, u: 0 }; h.f++; let m = 0;
  if (e.status === 401 || e.status === 403 || e.status === 404) m = 120;  // bad key or model gone: long rest
  else if (e.retry) m = Math.max(1, Math.ceil(e.retry / 60));             // provider told us when to come back
  else if (h.f >= 2) m = SETTINGS.skipMinutes[Math.min(h.f - 2, SETTINGS.skipMinutes.length - 1)];
  else if (e.status === 429) m = 1;
  if (m) h.u = Date.now() + m * 60000; H[p.name] = h;
}
async function callAI(p, env, msgs, E, timeoutMs) {
  if (p.cf) { const r = await Promise.race([env.AI.run(p.model, { messages: msgs, max_tokens: Math.min(E.maxTokens, 1500), temperature: .2 }), slow(timeoutMs)]); return r.response || "" }
  const ac = new AbortController(), t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const body = { model: p.model, messages: msgs, temperature: .2, max_tokens: E.maxTokens, ...(p.effort ? { reasoning_effort: E.reason } : {}), ...p.extra };
    const r = await fetch(p.url, { method: "POST", signal: ac.signal, headers: { "Content-Type": "application/json", Authorization: "Bearer " + (p.apiKey || env[p.key]) }, body: JSON.stringify(body) });
    if (!r.ok) throw Object.assign(new Error("http " + r.status), { status: r.status, retry: +r.headers.get("retry-after") || 0 });
    return (await r.json()).choices?.[0]?.message?.content || "";
  } catch (e) { if (e.name === "AbortError") e.status = 0; throw e } finally { clearTimeout(t) }
}

const hits = new Map();
function limited(ip, bucket, max) { const k = bucket + ip, n = Date.now(), w = SETTINGS.windowMin * 60000, a = (hits.get(k) || []).filter(t => n - t < w); a.push(n); hits.set(k, a); if (hits.size > 5000) hits.clear(); return a.length > max }

// ---- saving answers (for training later) ----
async function sb(env, method, path, body) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) return;
  try {
    const r = await fetch(env.SUPABASE_URL + "/rest/v1/" + path, { method, headers: { "Content-Type": "application/json", apikey: env.SUPABASE_SERVICE_KEY, Authorization: "Bearer " + env.SUPABASE_SERVICE_KEY, Prefer: "return=minimal" }, body: body ? JSON.stringify(body) : undefined });
    if (!r.ok) console.log("supabase", method, path, r.status);
  } catch (e) { console.log("supabase failed", e.message) }
}
const logRow = (env, row) => sb(env, "POST", "ai_logs", row);
const patchRow = (env, id, fields) => UUID.test(id || "") ? sb(env, "PATCH", "ai_logs?id=eq." + id, fields) : Promise.resolve();
async function ping(env) {                       // keeps the free Supabase project from pausing
  if (!env.SUPABASE_URL || !env.SUPABASE_KEY) return;
  try { const r = await fetch(env.SUPABASE_URL + "/rest/v1/subjects?select=id&limit=1", { headers: { apikey: env.SUPABASE_KEY } }); console.log("Supabase ping:", r.status) }
  catch (e) { console.log("Supabase ping failed:", e.message) }
}

// ---- one question, start to finish. send() reports live status ("thinking", "checking" ...) ----
async function ask(b, env, ctx, ip, send) {
  const q = String(b.q || "").slice(0, 400).trim(); if (!q) return { status: 400, error: "Empty question." };
  const topic = b.topic === "general" ? "general" : "book";
  const effort = EFFORT[b.effort] ? b.effort : "balanced", E = EFFORT[effort];
  const mode = ["short", "normal", "simple", "detailed"].includes(b.mode) ? b.mode : "normal";
  const passages = (b.passages || []).slice(0, E.passages).map(p => ({ l: String(p.l || "").slice(0, 40), t: String(p.t || "").slice(0, 2500) }));
  const bg = (b.bg || []).slice(0, 4).map(x => String(x).slice(0, 14000));
  const hist = (b.hist || []).slice(-E.hist).map(h => ({ q: String(h.q || "").slice(0, 300), a: String(h.a || "").slice(0, E.histChars) }));
  const book = topic === "general" ? "general" : String(b.book || "own").slice(0, 60), title = String(b.title || "this text").slice(0, 100);
  const sid = String(b.sid || "").slice(0, 40) || null, id = crypto.randomUUID();
  const base = { id, topic, book: book === "own" ? null : book, subject_id: String(b.subject || "").slice(0, 40) || null, mode, effort, question: q, sid, source: "worker", passages: passages.length };
  if (b.retry && b.prev) ctx.waitUntil(patchRow(env, String(b.prev), { retried: true }));   // "Try again" = the last answer was not good enough

  const cacheable = book !== "own" && (topic === "general" || passages.length > 0 || bg.length > 0) && hist.length === 0;
  const ck = cacheable ? "c:" + await sha(`${SETTINGS.CACHE_VERSION}|${book}|${mode}|${effort}|${nz(q)}`) : null;
  let avoid = "";
  if (ck) {
    const old = await env.KV.get(ck, "json").catch(() => null);
    if (old && !b.retry) { ctx.waitUntil(logRow(env, { ...base, answer: old.a, provider: old.p, verified: true, cached: true })); return { answer: old.a, provider: old.p, cached: true, verified: true, id } }
    if (old && b.retry) { avoid = old.p; await env.KV.delete(ck).catch(() => {}) }   // "Try again" throws the old answer away
  }

  const msgs = [{ role: "system", content: buildPrompt({ title, topic, mode, effort, passages, bg }) },
    ...hist.flatMap(h => [{ role: "user", content: h.q }, { role: "assistant", content: h.a }]), { role: "user", content: q }];
  const check = topic === "book" ? checker(passages.map(p => p.t).join(" ")) : () => ({ n: 0, bad: 0 });
  await loadH(env);
  let list = expandProviders(env);
  let up = list.filter(p => !(H[p.name]?.u > Date.now())); if (!up.length) up = list;   // all resting? try anyway
  const k = rr++ % Math.max(1, up.length); up = [...up.slice(k), ...up.slice(0, k)];       // take turns
  if (effort === "deep") up = [...up.filter(p => p.strong), ...up.filter(p => !p.strong)]; // strongest AIs first for Deep thinking
  if (avoid) up = [...up.filter(p => p.name !== avoid), ...up.filter(p => p.name === avoid)];

  const tmo = SETTINGS.timeoutMs * (effort === "deep" ? 2 : 1);
  let best = null, changed = false, n = 0;
  for (const p of up.slice(0, SETTINGS.maxTries)) {
    await send({ s: n++ ? "retrying" : "thinking" });
    try {
      const a = clean((await callAI(p, env, msgs, E, tmo)).trim()); if (!a) throw Object.assign(new Error("empty"), { status: 0 });
      if (H[p.name]) { delete H[p.name]; changed = true }
      await send({ s: "checking" });
      const c = check(a);
      if (c.bad === 0) {                                  // quotes all real: accept
        if (ck && (c.n > 0 || bg.length > 0 || topic === "general")) await env.KV.put(ck, JSON.stringify({ a, p: p.name }), { expirationTtl: SETTINGS.cacheDays * 86400 }).catch(() => {});
        if (changed) await saveH(env);
        ctx.waitUntil(logRow(env, { ...base, answer: a, provider: p.name.split(":")[0], verified: true, quotes: c.n, quotes_bad: 0, retried: false }));
        return { answer: a, provider: p.name, verified: true, id };
      }
      if (!best || c.bad < best.bad) best = { a, bad: c.bad, n: c.n, p: p.name };   // fake quote: try the next AI (not the AI's fault, no penalty)
    } catch (e) { console.log("AI failed:", p.name, e.status, e.message); markFail(p, e); changed = true }
  }
  if (changed) await saveH(env);
  if (best) { ctx.waitUntil(logRow(env, { ...base, answer: best.a, provider: best.p.split(":")[0], verified: false, quotes: best.n, quotes_bad: best.bad })); return { answer: best.a, provider: best.p, verified: false, id } }
  return { status: 503, error: "The AI helpers are all busy right now. Please try again in a minute." };
}

const enc = new TextEncoder();
export default {
  async fetch(req, env, ctx) {
    const cors = { "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*", "Access-Control-Allow-Headers": "Content-Type", Vary: "Origin" };
    const url = new URL(req.url), path = url.pathname.replace(/\/+$/, "") || "/";
    if (req.method === "OPTIONS") return new Response(null, { headers: { ...cors, "Access-Control-Allow-Methods": "POST, GET" } });
    if (req.method === "GET" && path === "/health") {                       // open this address in a browser to check the setup
      const ps = expandProviders(env).map(p => p.name);
      return J({ ok: true, worker: "dsvb-ai v2", kv: !!env.KV, workersAI: !!env.AI, aiKeys: ps.length, ais: ps, saving: !!(env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY), originLocked: !!env.ALLOWED_ORIGIN }, 200, cors);
    }
    if (req.method !== "POST" || (env.ALLOWED_ORIGIN && req.headers.get("Origin") !== env.ALLOWED_ORIGIN)) return J({ error: "Not allowed." }, 403, cors);
    const ip = req.headers.get("CF-Connecting-IP") || "x";
    let b; try { const raw = await req.text(); if (raw.length > 90000) throw 0; b = JSON.parse(raw) } catch { return J({ error: "Bad request." }, 400, cors) }

    if (path === "/feedback") {                                              // thumbs up/down and "copied" signals
      if (limited(ip, "fb", 120)) return J({ error: "Slow down." }, 429, cors);
      if (!UUID.test(String(b.id || ""))) return J({ error: "Bad id." }, 400, cors);
      const f = {}; if (b.rating === 1 || b.rating === -1) f.rating = b.rating; if (b.copied === true) f.copied = true;
      if (Object.keys(f).length) ctx.waitUntil(patchRow(env, b.id, f));
      return J({ ok: true }, 200, cors);
    }
    if (path === "/log") {                                                   // answers from students who use their OWN key (never receives the key)
      if (limited(ip, "log", 60)) return J({ error: "Slow down." }, 429, cors);
      const qq = String(b.q || "").slice(0, 400).trim(), aa = String(b.a || "").slice(0, 8000).trim();
      if (!qq || !aa) return J({ error: "Empty." }, 400, cors);
      if (KEYLIKE.test(qq) || KEYLIKE.test(aa)) return J({ error: "That looks like a secret key, so it was not saved." }, 400, cors);
      const id = crypto.randomUUID();
      ctx.waitUntil(logRow(env, { id, source: "byok", topic: b.topic === "general" ? "general" : "book", book: String(b.book || "").slice(0, 60) || null, subject_id: String(b.subject || "").slice(0, 40) || null,
        mode: ["short", "normal", "simple", "detailed"].includes(b.mode) ? b.mode : null, effort: EFFORT[b.effort] ? b.effort : null, question: qq, answer: aa,
        provider: "byok:" + String(b.provider || "").replace(/[^a-z0-9.-]/gi, "").slice(0, 40), verified: false, quotes: +b.quotes || 0, quotes_bad: +b.quotes_bad || 0, passages: +b.passages || 0, sid: String(b.sid || "").slice(0, 40) || null }));
      return J({ id }, 200, cors);
    }

    if (limited(ip, "ask", SETTINGS.perIp)) return J({ error: "You're asking very quickly! Take a short break and try again in a few minutes." }, 429, cors);
    if (!b.stream) {                                                         // plain answer (JSON)
      const r = await ask(b, env, ctx, ip, async () => {});
      return r.error ? J({ error: r.error }, r.status, cors) : J(r, 200, cors);
    }
    const { readable, writable } = new TransformStream(), w = writable.getWriter();   // live status lines, then the answer
    const send = o => w.write(enc.encode(JSON.stringify(o) + "\n")).catch(() => {});
    ctx.waitUntil((async () => {
      try { await send({ s: "start" }); const r = await ask(b, env, ctx, ip, send); await send(r.error ? { error: r.error } : { done: true, ...r }) }
      catch (e) { console.log("ask crashed", e && e.message); await send({ error: "Something went wrong. Please try again." }) }
      finally { await w.close().catch(() => {}) }
    })());
    return new Response(readable, { headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store", ...cors } });
  },
  async scheduled(event, env, ctx) { ctx.waitUntil(ping(env)) }
};
