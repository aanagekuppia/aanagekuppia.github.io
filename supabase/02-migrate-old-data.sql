-- ============================================================
--  ආනාගේ Kuppia  |  Step 2: move your OLD data into Supabase
--  Run this ONCE in Supabase > SQL Editor, AFTER 01-schema.sql.
--
--  What it brings over
--    * 52 notes / past papers / old-student notes     (same links as before)
--    * 48 recordings                                  (the "Notes" button is now automatic, so the old
--                                                      broken note_id values simply disappear)
--    * 4 assignments + their 7 files
--    * 10 songs (with the lyrics that existed)        * 4 home slideshow items
--    * 2 memories (13 photos)                         * 2 notification categories, 5 notifications
--  Past papers are imported exactly as they were (one big PDF shared by several subjects).
--  Safe to run twice: it stops with a message if the data is already there.
-- ============================================================
begin;

do $$
begin
  if exists (select 1 from public.notes) or exists (select 1 from public.recordings)
     or exists (select 1 from public.songs) or exists (select 1 from public.assignments) then
    raise exception 'Old data is already imported. Nothing was changed.';
  end if;
end $$;

-- ---------- notes / past papers / old-student notes ----------
insert into public.notes (subject_id, category, name, description, file_type, url, sort_order, created_at) values
  ($q$y1s1-bcelt$q$, $q$aana$q$, $q$Old Student Notes - 01$q$, $q$Notes of old students of B.Ed (ආනාගේ නෙමෙයි)$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1OASN6AHyzsZeA8RIJwP_IQoelchDeIfr/view?usp=drive_link$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-bcelt$q$, $q$aana$q$, $q$Old Student Notes - 02$q$, $q$Notes of old students of B.Ed (ආනාගේ නෙමෙයි)$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/17H-34EKhcOkm0rI-anuKJOJRD7E5pr_P/view?usp=drive_link$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-bcelt$q$, $q$paper$q$, $q$2024 August$q$, $q$Basic Concepts in English Language Teaching paper 2024 August$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/15vpIsDwxUfO_r0h8Xl4nBxFDbBEmTlOr/view?usp=drive_link$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-bcelt$q$, $q$paper$q$, $q$2020 July$q$, $q$Basic Concepts in English Language Teaching paper 2020 July$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/17r2aRu2sya7DhLB2HQwaXTESFqePW9mK/view?usp=drive_link$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-elit$q$, $q$lecturer$q$, $q$Anthology$q$, $q$Entire anthology for Year 01 Semester 01$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1-zb1X0HDK64y8T5BlROyK1-HnWCG3wGN/view?usp=drive_link$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-elit$q$, $q$lecturer$q$, $q$Eveline$q$, $q$Eveline short story$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1kE6i0YNtOEbQFEmLE4wFk4VFG53i_cfy/view?usp=drive_link$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-elit$q$, $q$lecturer$q$, $q$The Happy Prince$q$, $q$The Happy Prince short story$q$, $q$DOCX$q$, $q$https://docs.google.com/document/d/1uVwrEVbBl5xpgsmthG1kI08RAv1-kscA/edit?usp=drive_link&ouid=101046105833544566588&rtpof=true&sd=true$q$, 2, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-elit$q$, $q$lecturer$q$, $q$The Grasshopper$q$, $q$The Grasshopper short story$q$, $q$DOCX$q$, $q$https://docs.google.com/document/d/1CUwSAorOdY7ka7O_oV3B9Ndul7iAnhe3/edit?usp=drive_link&ouid=101046105833544566588&rtpof=true&sd=true$q$, 3, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-elit$q$, $q$lecturer$q$, $q$The Old Man at the Bridge$q$, $q$The Old Man at the Bridge short story$q$, $q$DOCX$q$, $q$https://docs.google.com/document/d/1RVygs0KhJQx1KwdxjUH7YF-QF9_CqqYC/edit?usp=drive_link&ouid=101046105833544566588&rtpof=true&sd=true$q$, 4, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-elit$q$, $q$lecturer$q$, $q$Animal Farm$q$, $q$Animal Farm novel$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1Bn0RdHLuE7hCcP6T0L8HF2e53tml3yPW/view?usp=drive_link$q$, 5, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-elit$q$, $q$lecturer$q$, $q$The Caucasian Chalk Circle$q$, $q$The Caucasian Chalk Circle drama$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1s0R23_Am4kAao-XawaTmOUcGWukvpA2W/view?usp=drive_link$q$, 6, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-elit$q$, $q$paper$q$, $q$2024 August$q$, $q$Introduction to English Literature paper 2024 August$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/15vpIsDwxUfO_r0h8Xl4nBxFDbBEmTlOr/view?usp=drive_link$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-elit$q$, $q$paper$q$, $q$2020 July$q$, $q$Introduction to English Literature paper 2020 July$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1sm1aOjYEa67flgk9cBi-NikQAP4bfkFu/view?usp=drive_link$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-ict$q$, $q$lecturer$q$, $q$Day 01 - ICT for Education$q$, $q$Day 01 Note$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/15SBOZCFz4mZhNiCzXcE4yhOJkcBmRSiy/view?usp=drive_link$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-ict$q$, $q$paper$q$, $q$2024 August$q$, $q$ICT for Education paper$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/15vpIsDwxUfO_r0h8Xl4nBxFDbBEmTlOr/view?usp=drive_link$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-ict$q$, $q$paper$q$, $q$2020 July$q$, $q$ICT for Education paper 2020 July$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1sm1aOjYEa67flgk9cBi-NikQAP4bfkFu/view?usp=drive_link$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-intro$q$, $q$lecturer$q$, $q$What is Language and the English Language$q$, $q$Day 01 Note$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1vr_LhSZsla2ZK6Rtyiz-XGo1XKoYL3tQ/view?usp=drive_link$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-intro$q$, $q$lecturer$q$, $q$Lexicon Sources$q$, $q$Day 02 Note$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1Q92L7txdIvq7vN994HAlb_NFjVTalOep/view?usp=drive_link$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-intro$q$, $q$lecturer$q$, $q$Writing Systems$q$, $q$Day 03 Note$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1Og8vdiWj7nsx2YTnZ6Dru_AaG-RXRRs7/view?usp=drive_link$q$, 2, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-intro$q$, $q$lecturer$q$, $q$Grammar and Grammatical Units$q$, $q$Day 04 Note$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1NNQ_Bqys1XRtY1X4uRc4wNiODs99pF36/view?usp=drive_link$q$, 3, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-intro$q$, $q$aana$q$, $q$Old Student Notes - 01$q$, $q$Notes of old students of B.Ed (ආනාගේ නෙමෙයි)$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/19N-AnnMOn-RKnZtImnKG2gbGQ0gjdMa2/view?usp=drive_link$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-intro$q$, $q$aana$q$, $q$Old Student Notes - 02$q$, $q$Notes of old students of B.Ed (ආනාගේ නෙමෙයි)$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1zL5fVzF8aux8BhBRDTVxZXAafOZhNQzu/view?usp=drive_link$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-intro$q$, $q$paper$q$, $q$2024 August$q$, $q$Introduction to English Language and English Grammar paper 2024 August$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/15vpIsDwxUfO_r0h8Xl4nBxFDbBEmTlOr/view?usp=drive_link$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-intro$q$, $q$paper$q$, $q$2020 July$q$, $q$Introduction to English Language and English Grammar paper 2020 July$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1sm1aOjYEa67flgk9cBi-NikQAP4bfkFu/view?usp=drive_link$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$lecturer$q$, $q$Student Handbook$q$, $q$Student Handbook for B.Ed (Hons) English students (Provided for reading only)$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1FNboJhulWR2C6VQOeecUDCFMCJndcWKC/view?usp=drive_link$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$lecturer$q$, $q$Philosophical Foundations of Education - Aquinas Syllabi$q$, $q$Philosophical Foundations of Education Syllabi (Provided for reading only)$q$, $q$DOC$q$, $q$https://docs.google.com/document/d/1nCY25cwmzonk6XCMs64hVIAQEEXRo6Cb/edit?usp=drive_link&ouid=101046105833544566588&rtpof=true&sd=true$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$lecturer$q$, $q$Semester Breakdown$q$, $q$Breakdown of all course content for year 01 semester 01 (Provided for reading only)$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1pXOxTX-Xv2oo0d12cPVs4m4RGmaHsbC0/view?usp=drive_link$q$, 2, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$lecturer$q$, $q$Philosophical Bases of Education$q$, $q$Day 01 Extra Note (Provided for reading only)$q$, $q$DOC$q$, $q$https://docs.google.com/document/d/1lG04eiHd6Z4AHs8bbhENCgA7YShZrlMW/edit?usp=drive_link&ouid=101046105833544566588&rtpof=true&sd=true$q$, 3, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$lecturer$q$, $q$Complete Guide to Philosophy$q$, $q$Day 01 Extra Note (Provided for reading only)$q$, $q$DOCX$q$, $q$https://docs.google.com/document/d/13bmHFksJPEYbkrk2MJ32BICRy7iZAC82/edit?usp=drive_link&ouid=101046105833544566588&rtpof=true&sd=true$q$, 4, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$lecturer$q$, $q$Day 01 - Philosophy$q$, $q$Day 01 Note (explained on philosophy)$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1tG8wZE7uziZS5X0LyxMqoSKyvnXblN5y/view?usp=drive_link$q$, 5, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$lecturer$q$, $q$Education$q$, $q$Day 01 Note (explained on education)$q$, $q$PPTX$q$, $q$https://docs.google.com/presentation/d/1gairapHIDhX4iz-7neyvqujbafQQdEg8/edit?usp=sharing&ouid=101046105833544566588&rtpof=true&sd=true$q$, 6, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$lecturer$q$, $q$A step-by-step guide Learning Portfolio$q$, $q$Day 01 Extra Note (Provided for reading only)$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1djpvBJmmqQg8t3QPZJCWoHiiDrjuUNdx/view?usp=drive_link$q$, 7, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$lecturer$q$, $q$Portfolios & Assessment$q$, $q$Day 01 Extra Resource (Provided for viewing only)$q$, $q$Video$q$, $q$https://youtu.be/AOWQAUuvIe8$q$, 8, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$lecturer$q$, $q$Learning Log$q$, $q$Day 01 Extra Resource (Provided for viewing only)$q$, $q$Video$q$, $q$https://youtu.be/AOWQAUuvIe8$q$, 9, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$lecturer$q$, $q$Rabindranath Tagore$q$, $q$Day 01 Extra Resource (Provided for viewing only)$q$, $q$Video$q$, $q$https://www.youtube.com/watch?v=2Jx4uOuj4Qg$q$, 10, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$lecturer$q$, $q$Fact vs Theory vs Hypothesis vs Law$q$, $q$Day 01 Extra Resource (Provided for viewing only)$q$, $q$Video$q$, $q$https://www.youtube.com/watch?v=lqk3TKuGNBA&t=21s$q$, 11, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$lecturer$q$, $q$Article about Education$q$, $q$Day 01 Extra Resource (Provided for viewing only)$q$, $q$Other$q$, $q$https://www.britannica.com/topic/education$q$, 12, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$lecturer$q$, $q$On Education$q$, $q$Day 02 Extra Note (Provided for reading only)$q$, $q$DOCX$q$, $q$https://docs.google.com/document/d/1Vh1BBGbrNXb9hH0z1Vr9kT9n0nyjWg8J/edit?usp=drive_link&ouid=101046105833544566588&rtpof=true&sd=true$q$, 13, $q$2026-03-18 03:02:24$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$aana$q$, $q$Old Student Notes - 01$q$, $q$Notes of old students of B.Ed (ආනාගේ නෙමෙයි)$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1hAeeGhFx3w6X6YuNxU94uDJcbyYfuNei/view?usp=drive_link$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$paper$q$, $q$2024 August$q$, $q$Philosophical Foundation of Education paper 2024 August$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/15vpIsDwxUfO_r0h8Xl4nBxFDbBEmTlOr/view?usp=drive_link$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$paper$q$, $q$2020 July$q$, $q$Philosophical Foundation of Education paper 2020 July$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1sm1aOjYEa67flgk9cBi-NikQAP4bfkFu/view?usp=drive_link$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-soft$q$, $q$lecturer$q$, $q$Day 01 Note$q$, $q$Introduction to Soft Skills for Teachers$q$, $q$PPTX$q$, $q$https://docs.google.com/presentation/d/1awAdgv8yBxF6dLMnPOXVic_dHDCzRieI/edit?usp=drive_link&ouid=101046105833544566588&rtpof=true&sd=true$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-soft$q$, $q$lecturer$q$, $q$Day 02 Note$q$, $q$Time Management$q$, $q$PPTX$q$, $q$https://docs.google.com/presentation/d/1SaCQIGb4EOhgsxLe0b0sZFkE3vwwuVJx/edit?usp=drive_link&ouid=101046105833544566588&rtpof=true&sd=true$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-soft$q$, $q$lecturer$q$, $q$Day 03 Note$q$, $q$Teamwork$q$, $q$PPTX$q$, $q$https://docs.google.com/presentation/d/1rfQ-0vI09GnAV8-23wmfCEjDardCM289/edit?usp=drive_link&ouid=101046105833544566588&rtpof=true&sd=true$q$, 2, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-soft$q$, $q$lecturer$q$, $q$Soft Skills for the 21st Century$q$, $q$Recommended reading material (Provided for reading only)$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/13VcdT58sXFVZCBhl3hClRVUY5WGVqONE/view?usp=drive_link$q$, 3, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-soft$q$, $q$lecturer$q$, $q$Soft Skills - Research Paper$q$, $q$Recommended reading material (Provided for reading only)$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/149hKUBjJ0qP7KjODTbJ0aWJsualLvpQK/view?usp=drive_link$q$, 4, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-soft$q$, $q$lecturer$q$, $q$The Hard Truth about Soft Skills$q$, $q$Recommended reading material (Provided for reading only)$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1j-quOM-rq5IupYED7oP1Udc4r7-ObVL_/view?usp=drive_link$q$, 5, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-soft$q$, $q$lecturer$q$, $q$The Five Dysfunctions of a Team$q$, $q$Teamwork video material (Provided for viewing only)$q$, $q$Video$q$, $q$https://youtu.be/HJv8QQJYhJ8$q$, 6, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-soft$q$, $q$aana$q$, $q$Old Student Notes - 01$q$, $q$Notes of old students of B.Ed (ආනාගේ නෙමෙයි)$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1xoj6Si4V3DJ3LjtxxxY-8I-341keoSpy/view?usp=drive_link$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-soft$q$, $q$aana$q$, $q$Old Student Notes - 02$q$, $q$Notes of old students of B.Ed (ආනාගේ නෙමෙයි)$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1ZS-cVhvMPYbMp8trxCnFQnilQhbWrqYh/view?usp=drive_link$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-soft$q$, $q$paper$q$, $q$2024 August$q$, $q$Soft Skills for Teachers paper 2024 August$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/15vpIsDwxUfO_r0h8Xl4nBxFDbBEmTlOr/view?usp=drive_link$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-soft$q$, $q$paper$q$, $q$2020 July$q$, $q$Soft Skills for Teachers paper 2020 July$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1sm1aOjYEa67flgk9cBi-NikQAP4bfkFu/view?usp=drive_link$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz);

-- ---------- recordings ----------
insert into public.recordings (subject_id, label, date_info, url, sort_order, created_at) values
  ($q$y1s1-bcelt$q$, $q$Day 01 - 2026.02.25$q$, $q$Day 01$q$, $q$https://youtu.be/KjMoBDhKWnU$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-bcelt$q$, $q$Day 02 - 2026.03.04$q$, $q$Day 02$q$, $q$https://youtu.be/_iWT2pWzHrU$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-bcelt$q$, $q$Day 03 - 2026.03.11$q$, $q$Day 03$q$, $q$https://youtu.be/8A_FP6OmK_8$q$, 2, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-bcelt$q$, $q$Day 04 - 2026.03.25$q$, null, $q$https://youtu.be/oM5dsMy1fUs$q$, 3, $q$2026-05-03 12:46:02$q$::timestamptz),
  ($q$y1s1-bcelt$q$, $q$Day 05 - 2026.03.26$q$, null, $q$https://youtu.be/jjCtjLsimsY$q$, 4, $q$2026-05-03 12:46:31$q$::timestamptz),
  ($q$y1s1-bcelt$q$, $q$Day 06 - 2026.04.08$q$, null, $q$https://youtu.be/gPNEdJsJl7w$q$, 5, $q$2026-05-03 12:47:19$q$::timestamptz),
  ($q$y1s1-bcelt$q$, $q$Day 07 - 2026.04.22$q$, null, $q$https://youtu.be/lW6WOfavdT8$q$, 6, $q$2026-05-03 12:47:53$q$::timestamptz),
  ($q$y1s1-bcelt$q$, $q$Day 08 - 2026.04.29$q$, null, $q$https://youtu.be/MUnVxFK3axI$q$, 7, $q$2026-05-04 02:53:55$q$::timestamptz),
  ($q$y1s1-ict$q$, $q$Day 01 - 2026.04.19$q$, null, $q$https://youtu.be/OW128K46nnQ$q$, 0, $q$2026-05-03 12:54:04$q$::timestamptz),
  ($q$y1s1-ict$q$, $q$Day 02 - 2026.04.26$q$, null, $q$https://youtu.be/T4O3Fl2mTdQ$q$, 1, $q$2026-05-03 12:54:21$q$::timestamptz),
  ($q$y1s1-ict$q$, $q$Day 03 - 2026.05.03$q$, null, $q$https://youtu.be/0GSlDMDk-08$q$, 2, $q$2026-05-04 02:54:55$q$::timestamptz),
  ($q$y1s1-intro$q$, $q$Day 01 - 2026.03.01$q$, $q$Lexicon$q$, $q$https://youtu.be/hoEBTkmZ0CE$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-intro$q$, $q$Day 02 - 2026.03.09$q$, $q$Writing Systems$q$, $q$https://youtu.be/il3oELKo9Pg$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-intro$q$, $q$Day 03 - 2026.03.15$q$, $q$Adverbs$q$, $q$https://youtu.be/XSHpVY3KJHQ$q$, 2, $q$2026-03-17 08:13:45$q$::timestamptz),
  ($q$y1s1-intro$q$, $q$Day 04 - 2026.03.22$q$, null, $q$https://youtu.be/Q7gj6S6_BxA$q$, 3, $q$2026-05-01 13:39:57$q$::timestamptz),
  ($q$y1s1-intro$q$, $q$Day 05 - 2026.04.19$q$, null, $q$https://youtu.be/YupyUfHEhFU$q$, 4, $q$2026-05-01 13:40:45$q$::timestamptz),
  ($q$y1s1-intro$q$, $q$Day 06 - 2026.04.26$q$, null, $q$https://youtu.be/0z4LeVdhujg$q$, 5, $q$2026-05-01 13:41:34$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$Day 01 - 2026.03.08$q$, $q$Philosophy & Education$q$, $q$https://youtu.be/UORD5ceQBgI$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$Day 02 - 2026.03.15$q$, $q$Philosophy & Education - 02$q$, $q$https://youtu.be/5aLH69UjhSs$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$Day 03 - 2026.03.22$q$, $q$Philosophy$q$, $q$https://youtu.be/DLwrL2zZ5OI$q$, 2, $q$2026-03-24 02:40:54$q$::timestamptz),
  ($q$y1s1-phil$q$, $q$Day 04 - 2026.03.29$q$, null, $q$https://youtu.be/jED9jeTfuAY$q$, 3, $q$2026-05-04 02:55:26$q$::timestamptz),
  ($q$y1s2-litper$q$, $q$Day 01 - 2026.08.23$q$, null, $q$https://youtu.be/WaVv_RGHCck$q$, 0, $q$2026-10-18 11:21:33$q$::timestamptz),
  ($q$y1s2-litper$q$, $q$Day 02 - 2026.08.30$q$, null, $q$https://youtu.be/eG9d3yGuTYU$q$, 1, $q$2026-10-18 11:22:47$q$::timestamptz),
  ($q$y1s2-litper$q$, $q$Day 03 - 2026.09.06$q$, null, $q$https://youtu.be/uy8h-9Ej7HA$q$, 2, $q$2026-10-18 11:23:17$q$::timestamptz),
  ($q$y1s2-litper$q$, $q$Day 04 - 2026.09.20$q$, null, $q$https://youtu.be/NfXV6NSEN_M$q$, 3, $q$2026-10-18 11:27:06$q$::timestamptz),
  ($q$y1s2-litper$q$, $q$Day 05 - 2026.09.27$q$, null, $q$https://youtu.be/cU8FfYBil7Q$q$, 4, $q$2026-10-18 11:29:34$q$::timestamptz),
  ($q$y1s2-litper$q$, $q$Day 06 - 2026.10.04$q$, null, $q$https://youtu.be/cQXvEwoJ9D8$q$, 5, $q$2026-10-18 11:32:45$q$::timestamptz),
  ($q$y1s2-litper$q$, $q$Day 07 - 2026.11.01$q$, null, $q$https://youtu.be/0C3hTanghwU$q$, 6, $q$2026-11-06 01:51:53$q$::timestamptz),
  ($q$y1s2-psych$q$, $q$Day 01 - 2026.09.06$q$, null, $q$https://youtu.be/jsKWhXJ31dU$q$, 0, $q$2026-10-18 11:25:03$q$::timestamptz),
  ($q$y1s2-psych$q$, $q$Day 02 - 2026.09.27$q$, null, $q$https://youtu.be/yZy5S10T5zQ$q$, 1, $q$2026-10-18 11:30:15$q$::timestamptz),
  ($q$y1s2-psych$q$, $q$Day 03 - 2026.10.11$q$, null, $q$https://youtu.be/U61xdH8I4RE$q$, 2, $q$2026-10-18 11:34:37$q$::timestamptz),
  ($q$y1s2-psych$q$, $q$Day 04 - 2026.10.18$q$, null, $q$https://youtu.be/imidt8mbzqM$q$, 3, $q$2026-10-20 23:58:38$q$::timestamptz),
  ($q$y1s2-rw$q$, $q$Day 01 - 2026.08.16$q$, null, $q$https://youtu.be/uOdnCs9CA0Q$q$, 0, $q$2026-10-18 11:17:59$q$::timestamptz),
  ($q$y1s2-rw$q$, $q$Day 02 - 2026.08.30$q$, null, $q$https://youtu.be/JRpx9dJ2tns$q$, 1, $q$2026-10-18 11:19:41$q$::timestamptz),
  ($q$y1s2-rw$q$, $q$Day 03 - 2026.09.06$q$, null, $q$https://youtu.be/6t_r-PhsKB8$q$, 2, $q$2026-10-18 11:24:00$q$::timestamptz),
  ($q$y1s2-rw$q$, $q$Day 04 - 2026.09.13$q$, null, $q$https://youtu.be/VT_iy6nqhy8$q$, 3, $q$2026-10-18 11:25:32$q$::timestamptz),
  ($q$y1s2-rw$q$, $q$Day 05 - 2026.09.27$q$, null, $q$https://youtu.be/mKJvpkkxeH8$q$, 4, $q$2026-10-18 11:30:59$q$::timestamptz),
  ($q$y1s2-rw$q$, $q$Day 06 - 2026.11.01$q$, null, $q$https://youtu.be/dYAcuN4A5lE$q$, 5, $q$2026-11-06 01:52:58$q$::timestamptz),
  ($q$y1s2-socio$q$, $q$Day 01 - 2026.10.11$q$, null, $q$https://youtu.be/DpGbGGATXyk$q$, 0, $q$2026-10-18 11:35:40$q$::timestamptz),
  ($q$y1s2-socio$q$, $q$Day 02 - 2026.11.01$q$, null, $q$https://youtu.be/N_AI4rCknoQ$q$, 1, $q$2026-11-06 01:50:31$q$::timestamptz),
  ($q$y1s2-tmeth$q$, $q$Day 01 - 2026.09.16$q$, null, $q$https://youtu.be/ImDavXf9lmA$q$, 0, $q$2026-10-18 11:26:25$q$::timestamptz),
  ($q$y1s2-tmeth$q$, $q$Day 02 - 2026.09.23$q$, null, $q$https://youtu.be/ZEz0wQIuhyM$q$, 1, $q$2026-10-18 11:28:51$q$::timestamptz),
  ($q$y1s2-tmeth$q$, $q$Day 03 - 2026.09.30$q$, null, $q$https://youtu.be/9Gbm3NUlIUk$q$, 2, $q$2026-10-18 11:31:52$q$::timestamptz),
  ($q$y1s2-tmeth$q$, $q$Day 04 - 2026.10.07$q$, null, $q$https://youtu.be/k5I9crRFVy8$q$, 3, $q$2026-10-18 11:33:39$q$::timestamptz),
  ($q$y1s2-tmeth$q$, $q$Day 05 - 2026.10.14$q$, null, $q$https://youtu.be/Kp3RIiE0Xto$q$, 4, $q$2026-10-25 09:51:15$q$::timestamptz),
  ($q$y1s2-tmeth$q$, $q$Day 06 - 2026.10.21$q$, null, $q$https://youtu.be/DRIrqFYaiVA$q$, 5, $q$2026-10-25 09:51:50$q$::timestamptz),
  ($q$y1s2-tmeth$q$, $q$Day 07 - 2026.10.28$q$, null, $q$https://youtu.be/JS5r-p6Yc4g$q$, 6, $q$2026-11-06 01:49:15$q$::timestamptz),
  ($q$y1s2-tmeth$q$, $q$Day 08 - 2026.11.04$q$, null, $q$https://youtu.be/yP--jz8VaUA$q$, 7, $q$2026-11-06 01:54:01$q$::timestamptz);

-- ---------- assignments + files ----------
insert into public.assignments (id, subject_id, category, name, description, entry_category, what_to_do, deadline, sort_order, created_at) overriding system value values
  (1, $q$y1s1-ict$q$, $q$brief$q$, $q$Assignment - Structured Report Writing$q$, $q$Report Writing$q$, $q$Report$q$, $q$Write a 2000–2500 word structured report$q$, $q$Unsure - Possibly 30 April 2026$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  (2, $q$y1s1-soft$q$, $q$brief$q$, $q$Continuous Assessment 01$q$, $q$Movie Review$q$, $q$Case Study$q$, $q$Write a 1,000–1,200 word case study analyzing soft skills in the movie$q$, $q$30 April 2026$q$, 0, $q$2026-03-17 05:23:02$q$::timestamptz),
  (3, $q$y1s1-soft$q$, $q$brief$q$, $q$Continuous Assessment 02$q$, $q$Review Report$q$, $q$Report$q$, $q$Write an 800–1000 word review of the given research paper$q$, $q$30 May 2026$q$, 1, $q$2026-03-17 05:23:02$q$::timestamptz),
  (4, $q$y1s1-soft$q$, $q$brief$q$, $q$Assessment - Portfolio$q$, $q$Portfolio Creation$q$, $q$Portfolio$q$, $q$Maintain a handwritten portfolio throughout the program$q$, $q$Last day of the module$q$, 2, $q$2026-03-17 05:23:02$q$::timestamptz);
insert into public.assignment_files (assignment_id, name, description, file_type, url, sort_order) values
  (1, $q$Instructions$q$, $q$Lecturer provided instructions$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/1naRGqa7MZNy40xsQCpilvr7L-e1poVMJ/view?usp=drive_link$q$, 0),
  (2, $q$Instructions$q$, $q$Lecturer provided instructions$q$, $q$DOCX$q$, $q$https://docs.google.com/document/d/1pcZLHl9oJryvtxFp0ryyuIr5voMw8f3-/edit?usp=drive_link&ouid=101046105833544566588&rtpof=true&sd=true$q$, 0),
  (2, $q$Video$q$, $q$Movie - To Sir with Love (1967)$q$, $q$Video$q$, $q$https://drive.google.com/file/d/1ZuDLn8hddH8jfdnvpJXjHKUpEdzhfTjm/view?usp=drive_link$q$, 1),
  (2, $q$English Subtitles.srt$q$, $q$Download and open with VLC player$q$, $q$Other$q$, $q$https://drive.google.com/file/d/1VyU7C4EFPovJhaczXf19UCMjez5QiWv6/view?usp=drive_link$q$, 2),
  (3, $q$Instructions$q$, $q$Lecturer provided instructions$q$, $q$DOCX$q$, $q$https://docs.google.com/document/d/1G7-Oxg5aZviOK0Bg2cHN-XMo0-5BL8uE/edit?usp=drive_link&ouid=101046105833544566588&rtpof=true&sd=true$q$, 0),
  (3, $q$Research Paper$q$, $q$Lecturer provided research paper$q$, $q$PDF$q$, $q$https://drive.google.com/file/d/14sQqAntkhZzcglOwAW582fvPGrfHxSL5/view?usp=drive_link$q$, 1),
  (4, $q$Instructions$q$, $q$Lecturer provided instructions$q$, $q$DOCX$q$, $q$https://docs.google.com/document/d/1FanpYw0ZS4GrmMtLGXDSYNuUTOSBFBMX/edit?usp=drive_link&ouid=101046105833544566588&rtpof=true&sd=true$q$, 0);
select setval(pg_get_serial_sequence('public.assignments','id'), (select max(id) from public.assignments));

-- ---------- songs (mp3 files stay in the music/ folder) ----------
insert into public.songs (grp, name, artist, audio_file, lyrics, sort_order) values
  ($q$sinhala$q$, $q$කිරුළ මුතු ලිහී..$q$, $q$Janaka Wickramasinghe$q$, $q$song01.mp3$q$, $j$[{"time": 57.5, "text": "කිරුළ මුතු ලිහී සර සර හඬින් වැගිරෙනා.."}, {"time": 62.5, "text": "සුළු මැදුම් දෙතිත පැටලී ගිගිරි වැලපෙනා.."}, {"time": 68, "text": "නටනවා නොවෙයි වැහැරුණු දෙපා වෙව්ලනා.."}, {"time": 72, "text": "තන තන තාන තම් දෙනා.."}, {"time": 75, "text": "තන තන තාන තම් දෙනා.."}, {"time": 108.5, "text": "දිලිසෙනා සේම කරලිය දිලෙන්නේ නැති.."}, {"time": 114, "text": "වන්නමක් සේම සුමිහිරි තානමක් නැති.."}, {"time": 118.2, "text": "සකියනි ගිරෙන් ගිරට පැන යන්නට ජීවිතෙන් බැරි.."}, {"time": 122.8, "text": "සකියනි ගිරෙන් ගිරට පැන යන්නට ජීවිතෙන් බැරි.."}, {"time": 130, "text": "කිරුළ මුතු ලිහී සර සර හඬින් වැගිරෙනා.."}, {"time": 134.5, "text": "සුළු මැදුම් දෙතිත පැටලී ගිගිරි වැලපෙනා.."}, {"time": 139.5, "text": "නටනවා නොවෙයි වැහැරුණු දෙපා වෙව්ලනා.."}, {"time": 144.5, "text": "තන තන තාන තම් දෙනා.."}, {"time": 147, "text": "තන තන තාන තම් දෙනා.."}, {"time": 181, "text": "රඟ බිමෙන් බහින විට ගෙයි සන්තකව ඇති.."}, {"time": 186, "text": "නළල් පට මාල හත් පට සින්න වී ඇති.."}, {"time": 189.8, "text": "සකියණි රිදී කාසි සොලවන්නට බෙර පදය මදි.."}, {"time": 195.2, "text": "සකියණි රිදී කාසි සොලවන්නට බෙර පදය මදි.."}, {"time": 201.2, "text": "කිරුළ මුතු ලිහී සර සර හඬින් වැගිරෙනා.."}, {"time": 206, "text": "සුළු මැදුම් දෙතිත පැටලී ගිගිරි වැලපෙනා.."}, {"time": 211.2, "text": "නටනවා නොවෙයි වැහැරුණු දෙපා වෙව්ලනා.."}, {"time": 223.1, "text": "තන තන තාන තම් දෙනා.."}]$j$::jsonb, 0),
  ($q$sinhala$q$, $q$කෝටු කෑලි සොයාලා..$q$, $q$Mohideen Beg$q$, $q$song02.mp3$q$, $j$[{"time": 3, "text": "Lyrics තාම දාලා නෑ"}]$j$::jsonb, 1),
  ($q$sinhala$q$, $q$යමු සෙල්ල කතරගම්..$q$, $q$Karunarathna Divulgane$q$, $q$song03.mp3$q$, $j$[{"time": 3, "text": "Lyrics තාම දාලා නෑ"}]$j$::jsonb, 2),
  ($q$sinhala$q$, $q$ආලවන්ත නෙත් විදා..$q$, $q$Dayasiri Jayasekara$q$, $q$song04.mp3$q$, $j$[{"time": 3, "text": "Lyrics තාම දාලා නෑ"}]$j$::jsonb, 3),
  ($q$sinhala$q$, $q$බාලිකාවියන්..$q$, $q$Janaka Wickramasingha$q$, $q$song05.mp3$q$, $j$[{"time": 3, "text": "Lyrics තාම දාලා නෑ"}]$j$::jsonb, 4),
  ($q$sinhala$q$, $q$දීපාවලී දාට..$q$, $q$Asanga Priyamantha Peiris$q$, $q$song06.mp3$q$, $j$[{"time": 3, "text": "Lyrics තාම දාලා නෑ"}]$j$::jsonb, 5),
  ($q$sinhala$q$, $q$මුව මදහාසේ..$q$, $q$Sarath Dassanayake$q$, $q$song07.mp3$q$, $j$[{"time": 3, "text": "Lyrics තාම දාලා නෑ"}]$j$::jsonb, 6),
  ($q$sinhala$q$, $q$ගලන ගලන දොළ පාරේ..$q$, $q$Nirmala Ranatunga$q$, $q$song08.mp3$q$, $j$[{"time": 3, "text": "Lyrics තාම දාලා නෑ"}]$j$::jsonb, 7),
  ($q$foreign$q$, $q$Woods$q$, $q$Jupp Hauff$q$, $q$en-song01.mp3$q$, $j$[{"time": 3, "text": "Lyrics තාම දාලා නෑ"}]$j$::jsonb, 0),
  ($q$foreign$q$, $q$Премьера$q$, $q$Adam Zhurek$q$, $q$en-song02.mp3$q$, $j$[{"time": 3, "text": "Lyrics තාම දාලා නෑ"}]$j$::jsonb, 1);

-- ---------- home slideshow ----------
insert into public.carousel_items (item, active, sort_order) values
  ($j${"type": "image", "src": "assets/carousal/img01.webp", "srcFb": "assets/carousal/img01.jpg", "caption": "2026 February Batch"}$j$::jsonb, true, 0),
  ($j${"type": "image", "src": "assets/carousal/img02.webp", "srcFb": "assets/carousal/img02.jpg", "caption": "ACHS"}$j$::jsonb, true, 1),
  ($j${"type": "video", "src": "assets/carousal/vid01.mp4", "thumb": "assets/carousal/thum01.jpg", "thumbW": "assets/carousal/thum01.webp", "caption": "ඇස් දෙක පුරා.."}$j$::jsonb, true, 2),
  ($j${"type": "video", "src": "assets/carousal/vid02.mp4", "thumb": "assets/carousal/thum02.jpg", "thumbW": "assets/carousal/thum02.webp", "caption": "මදේ හිස් ඩිස්.."}$j$::jsonb, true, 3);

-- ---------- memories ----------
insert into public.memories (title, description, media, sort_order) values
  ($q$First Day at Aquinas 🎓$q$, $q$😊 The very first morning we all walked into Aquinas together, nervous smiles and new friendships. A day none of us will ever forget.. ❤️$q$, $j$[{"type": "image", "src": "memories/img01.webp", "srcFb": "memories/img01.jpg", "caption": "First day — Feb 2026"}, {"type": "image", "src": "memories/img02.webp", "srcFb": "memories/img02.jpg", "caption": "Aquinas — Feb 2026"}]$j$::jsonb, 0),
  ($q$Presentation Time 💻$q$, $q$During the ICT lecture we were asked to present infront of the class.. 😝$q$, $j$[{"type": "image", "src": "memories/img03.webp", "srcFb": "memories/img03.jpg", "caption": "Lab session vibes"}, {"type": "image", "src": "memories/img04.webp", "srcFb": "memories/img04.jpg", "caption": "Lab session vibes"}, {"type": "image", "src": "memories/img05.webp", "srcFb": "memories/img05.jpg", "caption": "Lab session vibes"}, {"type": "image", "src": "memories/img06.webp", "srcFb": "memories/img06.jpg", "caption": "Lab session vibes"}, {"type": "image", "src": "memories/img07.webp", "srcFb": "memories/img07.jpg", "caption": "Lab session vibes"}, {"type": "image", "src": "memories/img08.webp", "srcFb": "memories/img08.jpg", "caption": "Lab session vibes"}, {"type": "image", "src": "memories/img09.webp", "srcFb": "memories/img09.jpg", "caption": "Lab session vibes"}, {"type": "image", "src": "memories/img10.webp", "srcFb": "memories/img10.jpg", "caption": "Lab session vibes"}, {"type": "image", "src": "memories/img11.webp", "srcFb": "memories/img11.jpg", "caption": "Lab session vibes"}, {"type": "image", "src": "memories/img12.webp", "srcFb": "memories/img12.jpg", "caption": "Lab session vibes"}, {"type": "image", "src": "memories/img13.webp", "srcFb": "memories/img13.jpg", "caption": "Lab session vibes"}]$j$::jsonb, 1);

-- ---------- notifications ----------
with cat as (
  insert into public.notification_categories (name, icon, icon_color, sort_order) values
    ($q$General Notices$q$, $q$fa-circle-info$q$, $q$#3b82f6$q$, 0),
    ($q$Upcoming Assessments$q$, $q$fa-pen-to-square$q$, $q$#f59e0b$q$, 1)
  returning id, name
)
insert into public.notifications (category_id, color, badge, title, body, active, sort_order) values
  ((select id from cat where name = $q$General Notices$q$), $q$green$q$, $q$info$q$, $q$Welcome, Ma Mate & Future Batches! 👋$q$, $q$All the things you need for your B.Ed is here and its free. This includes all the Recordings/Notes/Assignments and my submissions too.. Share with your classmates & Good Luck..!$q$, true, 0),
  ((select id from cat where name = $q$General Notices$q$), $q$blue$q$, $q$new$q$, $q$All Notes/Recordings/Assignments Uploaded 📄 (2026.03.13)$q$, $q$If you wanna view small descriptions below files, in your device right side top, tap the 3 dots, enable Desktop Site, there ya go.. 😘😊$q$, true, 1),
  ((select id from cat where name = $q$Upcoming Assessments$q$), $q$red$q$, $q$important$q$, $q$ICT - Structured Report Writing$q$, $q$Deadline: <strong>30 April 2026</strong>. Submit via lecturer email.$q$, true, 0),
  ((select id from cat where name = $q$Upcoming Assessments$q$), $q$yellow$q$, $q$soon$q$, $q$Soft Skills - Movie Review (CA 01)$q$, $q$Scheduled <strong>30 April 2026</strong>. Submit via lecturer email.$q$, true, 1),
  ((select id from cat where name = $q$Upcoming Assessments$q$), $q$yellow$q$, $q$soon$q$, $q$Soft Skills - Report Writing (CA 01)$q$, $q$Scheduled <strong>30 May 2026</strong>. Submit via lecturer email.$q$, true, 2);

commit;

-- Done. Quick check you can run afterwards:
--   select (select count(*) from notes) notes, (select count(*) from recordings) recordings, (select count(*) from songs) songs;