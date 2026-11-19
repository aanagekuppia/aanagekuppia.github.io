-- ============================================================
--  ආනා Study Buddy: saved answers (for training later)
--  Run ONCE in Supabase > SQL Editor, after 01 and 02.
--  Nobody on the public site can read or write this table.
--  Only the Worker (with its secret key) writes, and only YOU (admin login) can read.
-- ============================================================
create table public.ai_logs (
  id          uuid primary key,                       -- made by the Worker, so the chat can send thumbs up/down for it
  created_at  timestamptz not null default now(),
  source      text not null default 'worker' check (source in ('worker','byok')),   -- byok = student used their own key (not verified)
  topic       text not null default 'book'   check (topic in ('book','general')),
  book        text,                                   -- e.g. frankenstein
  subject_id  text,
  mode        text check (mode   in ('short','normal','simple','detailed')),
  effort      text check (effort in ('fast','balanced','deep')),
  question    text not null,
  answer      text not null,
  provider    text,                                   -- groq, gemini, cloudflare, byok:api.groq.com ...
  verified    boolean not null default false,         -- every quote in the answer was found in the book
  quotes      int not null default 0,
  quotes_bad  int not null default 0,
  passages    int not null default 0,                 -- how many book passages the AI was given
  cached      boolean not null default false,
  retried     boolean not null default false,         -- the student pressed "Try again": the answer was not good enough
  copied      boolean not null default false,         -- the student copied it: probably useful
  rating      smallint check (rating in (-1,1)),      -- thumbs down / up
  sid         text,                                   -- anonymous random id of the browser (no name, no IP)
  note        text                                    -- your own note while reviewing
);
create index on public.ai_logs (created_at desc);
create index on public.ai_logs (book);
create index on public.ai_logs (rating);

alter table public.ai_logs enable row level security;
create policy "admin read"   on public.ai_logs for select to authenticated using (public.is_admin());
create policy "admin update" on public.ai_logs for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin delete" on public.ai_logs for delete to authenticated using (public.is_admin());
grant select, update, delete on public.ai_logs to authenticated;
grant all on public.ai_logs to service_role;          -- the Worker

-- The "good answers" list, ready to export for training: real quotes, not retried, not thumbs-down.
create view public.ai_training with (security_invoker = true) as
  select id, created_at, book, topic, mode, effort, question, answer, provider, rating, copied
  from public.ai_logs
  where verified and not retried and coalesce(rating, 0) >= 0 and source = 'worker';
grant select on public.ai_training to authenticated;
