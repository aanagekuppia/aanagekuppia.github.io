# Download proxy (Cloudflare Worker) — optional but recommended

Without it, the Download buttons open the Google Drive link directly (fine on a laptop; on Android the Drive app may grab it).
With it, files download straight from your own Worker address, like your old `download.php`.

1. Go to dash.cloudflare.com, then **Workers & Pages**, then **Create**, then **Create Worker**.
2. Name it `kuppia-download`, click **Deploy**, then **Edit code**.
3. Delete everything in the editor, paste the whole of `download-proxy.js`, click **Deploy**.
4. Copy the address it shows (like `https://kuppia-download.YOURNAME.workers.dev`).
5. Paste it into `js/config.js` as `DOWNLOAD_PROXY`, then upload the change.

Free plan: 100,000 requests a day. More than enough.
