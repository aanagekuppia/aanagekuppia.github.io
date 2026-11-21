/* ============================================================
   prompt.js  -  the SAME prompt, quote-checker and "Thinking" levels the Worker uses.
   Used when a student brings their own key (the Worker is not involved then).
   GENERATED from workers/ai/index.js, do not edit by hand.
   ============================================================ */
window.AanaPrompt = (function () {
const EFFORT = {
  fast:     { reason: "low",    maxTokens: 1000, passages: 6,  hist: 2, histChars: 500 },
  balanced: { reason: "medium", maxTokens: 2200, passages: 10, hist: 4, histChars: 800 },
  deep:     { reason: "high",   maxTokens: 4000, passages: 16, hist: 6, histChars: 1200 }
};
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
return { EFFORT: EFFORT, buildPrompt: buildPrompt, nz: nz, checker: checker, clean: clean };
})();
