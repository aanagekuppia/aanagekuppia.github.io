-- ============================================================
--  ආනාගේ Kuppia  |  Supabase schema  (step 1 of the migration)
--  Paste this WHOLE file into Supabase > SQL Editor > New query > Run.
--  Safe to run once on a fresh project. It makes tables, locks them
--  down, and fills in the fixed list of subjects. No old data yet.
-- ============================================================

-- ---------- who is the admin ----------
-- The admin is ONE login: superadmin@aanagekuppia.github.io
-- (you type just "superadmin" on the admin page; the site adds the rest).
-- Nobody can ever receive mail at that address, so password-reset tricks
-- cannot be used against it.
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'superadmin@aanagekuppia.github.io'
$$;

-- ---------- subjects (fixed list, never changes) ----------
create table public.subjects (
  id    text primary key,            -- e.g. y1s1-phil  (year 1, sem 1, philosophy)
  year  smallint not null,
  sem   smallint not null,
  name  text not null,
  sort  smallint not null default 0
);

-- ---------- notes / past papers / old student notes ----------
create table public.notes (
  id          bigint generated always as identity primary key,
  subject_id  text not null references public.subjects(id) on update cascade on delete cascade,
  category    text not null check (category in ('lecturer','aana','paper')),
  name        text not null,
  description text,
  file_type   text not null default 'PDF',
  url         text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index on public.notes (subject_id);

-- ---------- recordings ----------
-- No note_id column any more: the "Notes" button for a recording is simply
-- the notes of the SAME subject_id. Nothing to type, nothing to get wrong.
create table public.recordings (
  id          bigint generated always as identity primary key,
  subject_id  text not null references public.subjects(id) on update cascade on delete cascade,
  label       text not null,
  date_info   text,
  url         text not null,          -- YouTube, Drive or Vimeo link
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index on public.recordings (subject_id);

-- ---------- assignments ----------
create table public.assignments (
  id             bigint generated always as identity primary key,
  subject_id     text not null references public.subjects(id) on update cascade on delete cascade,
  category       text not null check (category in ('brief','aana')),
  name           text not null,
  description    text,
  entry_category text,
  what_to_do     text,
  deadline       text,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now()
);
create index on public.assignments (subject_id);

create table public.assignment_files (
  id            bigint generated always as identity primary key,
  assignment_id bigint not null references public.assignments(id) on delete cascade,
  name          text not null,
  description   text,
  file_type     text not null default 'PDF',
  url           text not null,
  sort_order    integer not null default 0
);
create index on public.assignment_files (assignment_id);

-- ---------- songs + timed lyrics ----------
-- audio_file is JUST the file name (song09.mp3). The site looks for it in the music/ folder.
-- lyrics = [{"time": 57.5, "text": "line one"}, ...]  (seconds)
create table public.songs (
  id         bigint generated always as identity primary key,
  grp        text not null check (grp in ('sinhala','foreign')),
  name       text not null,
  artist     text,
  audio_file text not null,
  lyrics     jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- memories + home carousel ----------
-- media / item hold the same small objects the old JS files had, so nothing is lost.
create table public.memories (
  id          bigint generated always as identity primary key,
  title       text not null,
  description text,
  media       jsonb not null default '[]'::jsonb,   -- [{type,src,srcFb,caption}]
  sort_order  integer not null default 0
);
create table public.carousel_items (
  id         bigint generated always as identity primary key,
  item       jsonb not null,                         -- {type,src,srcFb,thumb,caption,...}
  active     boolean not null default true,
  sort_order integer not null default 0
);

-- ---------- notifications (the bell on the home page) ----------
create table public.notification_categories (
  id         bigint generated always as identity primary key,
  name       text not null,
  icon       text not null default 'fa-circle-info',
  icon_color text not null default '#3b82f6',
  sort_order integer not null default 0
);
create table public.notifications (
  id          bigint generated always as identity primary key,
  category_id bigint not null references public.notification_categories(id) on delete cascade,
  color       text not null default 'blue',     -- green | blue | red | ...
  badge       text not null default 'info',     -- info | new | important | ...
  title       text not null,
  body        text not null,
  active      boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------- site settings (whatsapp number, footer text, links ...) ----------
create table public.site_settings (
  key   text primary key,
  value jsonb not null
);

-- ============================================================
--  SECURITY: everyone can READ, only the admin can WRITE
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array['subjects','notes','recordings','assignments','assignment_files',
    'songs','memories','carousel_items','notification_categories','notifications','site_settings']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    execute format('create policy "admin write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;
grant usage, select on all sequences in schema public to authenticated;

-- ============================================================
--  SEED: the 46 fixed subjects (Year 1 to Year 4)
-- ============================================================
insert into public.subjects (id, year, sem, name, sort) values
  ('y1s1-phil', 1, 1, 'Philosophical Foundation of Education', 0),
  ('y1s1-ict', 1, 1, 'ICT for Education', 1),
  ('y1s1-soft', 1, 1, 'Soft Skills for Teachers', 2),
  ('y1s1-bcelt', 1, 1, 'Basic Concepts in English Language Teaching', 3),
  ('y1s1-intro', 1, 1, 'Introduction to English Language and English Grammar', 4),
  ('y1s1-elit', 1, 1, 'Introduction to English Literature', 5),
  ('y1s2-psych', 1, 2, 'Psychological Foundation of Education', 0),
  ('y1s2-tmeth', 1, 2, 'Teaching Methods General & Special', 1),
  ('y1s2-socio', 1, 2, 'Sociological Foundation of Education', 2),
  ('y1s2-litper', 1, 2, 'Background to Literary Periods', 3),
  ('y1s2-eltm', 1, 2, 'ELT Methodology', 4),
  ('y1s2-rw', 1, 2, 'Teaching Reading & Writing', 5),
  ('y2s1-comp', 2, 1, 'Comparative Education', 0),
  ('y2s1-guid', 2, 1, 'Guidance & Counselling', 1),
  ('y2s1-meas', 2, 1, 'Measurements & Evaluation in Education', 2),
  ('y2s1-eng1', 2, 1, 'Structure of English I (Phonetics, Phonology)', 3),
  ('y2s1-eng2', 2, 1, 'Structure of English II (Morphology)', 4),
  ('y2s1-eng3', 2, 1, 'Structure of English III (Syntax & Semantics)', 5),
  ('y2s1-call', 2, 1, 'Computer Assisted Language Learning', 6),
  ('y2s2-aest', 2, 2, 'Aesthetic Education', 0),
  ('y2s2-emgmt', 2, 2, 'Educational Management', 1),
  ('y2s2-val', 2, 2, 'Value Education', 2),
  ('y2s2-ls', 2, 2, 'Teaching, Listening & Speaking', 3),
  ('y2s2-writ', 2, 2, 'Teaching Writing Skills', 4),
  ('y2s2-lp', 2, 2, 'Lesson Planning & ELT Material', 5),
  ('y2s2-slle', 2, 2, 'Sri Lankan Literature in English', 6),
  ('y3s1-clmgmt', 3, 1, 'Classroom Management', 0),
  ('y3s1-child', 3, 1, 'Children''s Rights', 1),
  ('y3s1-tp', 3, 1, 'Teaching Practice', 2),
  ('y3s1-port', 3, 1, 'Portfolio', 3),
  ('y3s1-disc', 3, 1, 'Discourse Analysis', 4),
  ('y3s1-sla', 3, 1, 'Second Language Acquisition/Learning & ESL in Sri Lanka', 5),
  ('y3s2-curr', 3, 2, 'Curriculum Theory & Practice', 0),
  ('y3s2-pe', 3, 2, 'Physical Education', 1),
  ('y3s2-eltcur', 3, 2, 'ELT Curriculum in Sri Lanka', 2),
  ('y3s2-litth', 3, 2, 'Literary Theory in English', 3),
  ('y3s2-shak', 3, 2, 'Shakespearean Drama', 4),
  ('y3s2-test', 3, 2, 'Testing & Evaluation in Second Language Teaching', 5),
  ('y4s1-res', 4, 1, 'Research Methods', 0),
  ('y4s1-vic', 4, 1, 'Victorian Literature', 1),
  ('y4s1-rom', 4, 1, 'Romantic Poetry', 2),
  ('y4s1-eltcd', 4, 1, 'ELT Curriculum Design', 3),
  ('y4s2-amer', 4, 2, 'Introduction to American Literature (Optional)', 0),
  ('y4s2-aug', 4, 2, 'Augustan Literature (Optional)', 1),
  ('y4s2-post', 4, 2, 'Post-Colonial Literature (Optional)', 2),
  ('y4s2-diss', 4, 2, 'Dissertation', 3);

-- ============================================================
--  SEED: starting settings (all editable later from the admin panel)
-- ============================================================
insert into public.site_settings (key, value) values
  ('whatsapp_number',  '"94724600493"'),
  ('whatsapp_message', '"ආනා අයියේ.. පොඩි සීන් එකක් බං support එකක් දෙන්නකෝ.."'),
  ('admin_name',       '"ආනා"'),
  ('admin_role',       '"B.Ed Hons English | Dip. English Lang & Lit."'),
  ('footer_copy',      '"All Rights Reserved"'),
  ('footer_dev_label', '"Developed by"'),
  ('footer_name',      '"DSVB"'),
  ('footer_url',       '"https://venurakabojithananda.github.io/"'),
  ('footer_links',     '[]');
