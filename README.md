# ආනාගේ Kuppia — GitHub Pages version

Plain HTML / CSS / JS. No PHP, no build step. Data lives in Supabase.

## Folders
```
index.html, notes.html, recordings.html, assignments.html, memories.html, music.html, loader.html, 404.html
   (visitors never see ".html": the site shows /notes, /recordings ... and rewrites the address bar if someone opens a .html link)
admin/               the admin panel (https://aanagekuppia.github.io/admin/)
css/                 page styles (unchanged look)
js/                  page scripts
  config.js          <- the ONLY file with settings (Supabase URL + key, download proxy)
  data.js            talks to Supabase (read only)
  layout.js          header, footer, WhatsApp button, AI button
  players.js         one video player for YouTube / Drive / Vimeo / mp4
  vendor/supabase.js used by the admin panel
assets/logos/        your 6 logo files (Aquinas + DSVB)
supabase/01-schema.sql   run once in Supabase (tables + security)
supabase/02-migrate-old-data.sql   run once AFTER 01 (brings over your old data)
supabase/03-ai-logs.sql            run once (saved AI answers)
workers/ai/          the AI Worker (deploys automatically from GitHub, see SETUP-2)
workers/             download proxy (optional)
ai/library/          books for the AI chat + BOOK-BUILDER.md (how to add a book)
.github/workflows/   keeps the free Supabase project from pausing
```

## Media you copy over from the OLD site (same folder names, same file names)
```
assets/admin/     admin.webp admin.jpg cat01.webp cat01.jpg cat02.webp cat.gif
assets/carousal/  img01.webp img01.jpg img02.webp img02.jpg img03.webp ... vid01.mp4 vid02.mp4 thum01.jpg thum01.webp ...
assets/aud/       01.mp3 ... 11.mp3, a.mp3 ... f.mp3, flush.mp3
assets/troll/     01.webp/jpg ... 06.webp
memories/         every photo / video used on the Memories page
music/            song01.mp3 ... , vid01.mp4 vid01m.mp4 vid02.mp4 vid02m.mp4   <- new songs go here too
```
You do NOT need `assets/admin/aquinas.png` or `assets/admin/loader.gif` any more (replaced by the animated logos).

## First-time checklist
1. Do SETUP-1 (Supabase + GitHub).
2. Put your Project URL and Publishable key into `js/config.js`.
3. Copy the media folders above in.
4. Push with GitHub Desktop. Open https://aanagekuppia.github.io
