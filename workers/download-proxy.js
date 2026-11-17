/**
 * Kuppia download proxy  (Cloudflare Worker, free plan is plenty)
 *
 * Replaces the old download.php. The browser asks THIS address for a file, the Worker
 * fetches it from Google Drive and streams it back as a download, so Android never
 * sees a Drive link and does not hijack it into the Drive app.
 *
 * Same call shape as before:   https://YOUR-WORKER.workers.dev/?url=<drive link>&name=<file name>&ext=<pdf>
 */
const ALLOWED_HOSTS = [
  "drive.google.com",
  "docs.google.com",
  "drive.usercontent.google.com",
  "raw.githubusercontent.com",
];

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS" };
const fail = (status, msg) => new Response(msg, { status, headers: { ...CORS, "Content-Type": "text/plain; charset=utf-8" } });

function hostAllowed(host) {
  host = host.toLowerCase();
  return ALLOWED_HOSTS.some((a) => host === a || host.endsWith("." + a));
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (request.method !== "GET" && request.method !== "HEAD") return fail(405, "Method not allowed");

    const params = new URL(request.url).searchParams;
    const raw = params.get("url");
    if (!raw) return fail(400, "Missing URL");

    let target;
    try { target = new URL(raw); } catch (e) { return fail(403, "Invalid URL"); }
    if (!/^https?:$/.test(target.protocol)) return fail(403, "Invalid URL");
    if (!hostAllowed(target.hostname)) return fail(403, "Host not allowed");

    // Drive share/view links -> direct download link
    if (/(^|\.)(drive|docs)\.google\.com$/i.test(target.hostname)) {
      const m = target.pathname.match(/\/file\/d\/([\w-]+)/) || target.search.match(/[?&]id=([\w-]+)/);
      if (m) target = new URL("https://drive.google.com/uc?export=download&id=" + m[1] + "&confirm=t");
    }

    // File name: from the page, else from the link
    let name = (params.get("name") || "").replace(/[^a-zA-Z0-9 ._-]/g, "").trim();
    let ext = (params.get("ext") || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const last = decodeURIComponent(target.pathname.split("/").pop() || "");
    if (!name) name = last.replace(/\.[^.]+$/, "") || "file";
    if (!ext) { const e = last.match(/\.([a-z0-9]{1,6})$/i); ext = e ? e[1].toLowerCase() : ""; }
    let filename = name + (ext ? "." + ext : "");

    let upstream;
    try {
      upstream = await fetch(target.toString(), {
        method: "GET",
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; KuppiaProxy/2.0)", Accept: "*/*" },
      });
    } catch (e) {
      return fail(502, "Could not reach the file host");
    }
    if (!upstream.ok) return fail(upstream.status === 404 ? 404 : 502, "The file host returned an error (" + upstream.status + ")");

    // Drive sometimes names the file itself; use that only when we had no better name
    const cd = upstream.headers.get("Content-Disposition") || "";
    const m = cd.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]+)/i);
    if (m && !params.get("name")) { try { filename = decodeURIComponent(m[1].trim()); } catch (e) { filename = m[1].trim(); } }

    const safe = filename.replace(/["\\\r\n]/g, "");
    const headers = new Headers(CORS);
    headers.set("Content-Type", "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${safe.replace(/[^\x20-\x7e]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(safe)}`);
    headers.set("Cache-Control", "no-cache");
    headers.set("X-Content-Type-Options", "nosniff");
    const len = upstream.headers.get("Content-Length");
    if (len) headers.set("Content-Length", len);

    return new Response(request.method === "HEAD" ? null : upstream.body, { status: 200, headers });
  },
};
