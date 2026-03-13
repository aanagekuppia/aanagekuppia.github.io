/* ════════════════════════════════════════════════════════════
   js/notes.js  —  Notes page logic

   ✏️  SECTION 1 = Edit subject names, file lists here.
   ⚙️  SECTION 2+ = Engine — edit with care.

   FILE TYPES (case-insensitive, 'ft-' prefix also accepted):
     PDF  DOCX  PPTX  PPT  XLSX  XLS  ZIP  IMG  JPG  PNG  TXT  OTHER
     VIDEO  MP4  WEBM  MOV  (inline player — YT uses its own embed)

   URL / PATH formats:
     Google Drive share  →  auto-converted to direct download / embed
     YouTube             →  uses YouTube's own embedded player
     Local file path     →  'notes/week01.pdf'
     Any other URL       →  used as-is

   SUBJECT SHAPE:
   {
     id:    'n-y1s1-phil',
     label: 'Philosophical Foundation of Education',
     desc:  'Dr. Perera',     // optional — shown in accordion header
     recId: 'r-y1s1-phil',   // optional — links to recordings page
     lecturerNotes: [ … ],
     aanaNotes:     [ … ],
     pastPapers:    [ … ],
   }

   FILE ENTRY SHAPE:
   {
     name:     'Week 01 — Introduction',
     desc:     'Week one lecture notes',   // optional
     fileType: 'DOCX',                     // or 'VIDEO' for playable entries
     url:      'https://…' or 'notes/week01.pdf',
   { name: 'Week 01 — Introduction', desc: 'Lecture notes', fileType: 'DOCX', url: '' },
   { name: 'Class Recording',         fileType: 'VIDEO',     url: 'https://youtu.be/…' },
   }
════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   ✏️  SECTION 1 — NOTES DATA
════════════════════════════════════════════════════════════ */
const NOTES_DATA = [

  /* ══════════════════════════════════════════════════════════
     YEAR 01  —  2026 – 2027
  ══════════════════════════════════════════════════════════ */
  {
    id: 'n-y1',
    label: 'Year 01',
    year: '2026 – 2027',
    semesters: [

      /* ── Semester 01 ────────────────────────────────── */
      {
        id: 'n-y1s1',
        label: 'Semester 01',
        subjects: [
          {
            id:    'n-y1s1-phil',
            label: 'Philosophical Foundation of Education',
            recId: 'r-y1s1-phil',
            lecturerNotes: [
              {
                name:     'Student Handbook',
                desc:     'Student Handbook for B.Ed (Hons) English students (Provided for reading only)',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/Student_Handbook.pdf',
              },
              {
                name:     'Semester Breakdown',
                desc:     'Breakdown of all course content for year 01 semester 91 (Provided for reading only)',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/Year01-Sem01.pdf',
              },
              {
                name:     'Philosophical Foundations of Education - Aquinas Syllabi',
                desc:     'Philosophical Foundations of Education Syllabi (Provided for reading only)',   // optional
                fileType: 'DOCX',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/Philosophical_Foundations_of_Education.doc',
              },
              {
                name:     'Philosophical Bases of Education',
                desc:     'Day 01 Extra Note (Provided for reading only)',   // optional
                fileType: 'DOCX',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/Philosophical_Bases_of_Education.doc',
              },
              {
                name:     'Complete Guide to Philosophy',
                desc:     'Day 01 Extra Note (Provided for reading only)',   // optional
                fileType: 'DOCX',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/Complete_Guide_to_Philosophy.docx',
              },
              {
                name:     'Day 01 - Philosophy',
                desc:     'Day 01 Note (explained on philosophy)',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/Day_01_Philosophy.pdf',
              },
              {
                name:     'Education',
                desc:     'Day 01 Note (explained on education)',   // optional
                fileType: 'PPTX',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/Education.ppt',
              },
              {
                name:     'A step-by-step guide Learning Portfolio',
                desc:     'Day 01 Extra Note (Provided for reading only)',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/A_step-by-step_guide_Learning_Portfolio.pdf',
              },
              {
                name:     'Portfolios & Assessment',
                desc:     'Day 01 Extra Resource (Provided for viewing only)',   // optional
                fileType: 'Video',                     // or 'VIDEO' for playable entries
                url:      'https://youtu.be/AOWQAUuvIe8',
              },
              {
                name:     'Learning Log',
                desc:     'Day 01 Extra Resource (Provided for viewing only)',   // optional
                fileType: 'Video',                     // or 'VIDEO' for playable entries
                url:      'https://youtu.be/AOWQAUuvIe8',
              },
              {
                name:     'Rabindranath Tagore',
                desc:     'Day 01 Extra Resource (Provided for viewing only)',   // optional
                fileType: 'Video',                     // or 'VIDEO' for playable entries
                url:      'https://www.youtube.com/watch?v=2Jx4uOuj4Qg',
              },
              {
                name:     'Fact vs Theory vs Hypothesis vs Law',
                desc:     'Day 01 Extra Resource (Provided for viewing only)',   // optional
                fileType: 'Video',                     // or 'VIDEO' for playable entries
                url:      'https://www.youtube.com/watch?v=lqk3TKuGNBA&t=21s',
              },
              {
                name:     'Article about Education',
                desc:     'Day 01 Extra Resource (Provided for viewing only)',   // optional
                fileType: 'Other',                     // or 'VIDEO' for playable entries
                url:      'https://www.britannica.com/topic/education',
              }             
            ],
            aanaNotes:     [
              {
                name:     'Old Student Notes - 01',
                desc:     'Notes of old students of B.Ed (ආනාගේ නෙමෙයි)',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/old-philosophy.pdf',
              }
            ],
            pastPapers:    [
              {
                name:     '2024 August',
                desc:     'Philosophical Foundation of Education paper 2024 August',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/2024_August_All.pdf',
              },
              {
                name:     '2020 July',
                desc:     'Philosophical Foundation of Education paper 2020 July',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/2020_July_All.pdf',
              }
            ],
          },
          {
            id:    'n-y1s1-ict',
            label: 'ICT for Education',
            recId: 'r-y1s1-ict',
            lecturerNotes: [
              {
                name:     'Day 01 - ICT for Education',
                desc:     'Day 01 Note',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/ICT for Education/ICT_For_Education.pdf',
              }
            ],
            aanaNotes:     [],
            pastPapers:    [
              {
                name:     '2024 August',
                desc:     'ICT for Education paper',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/2024_August_All.pdf',
              },
              {
                name:     '2020 July',
                desc:     'ICT for Education paper 2020 July',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/2020_July_All.pdf',
              }
            ],
          },
          {
            id:    'n-y1s1-soft',
            label: 'Soft Skills for Teachers',
            recId: 'r-y1s1-soft',
            lecturerNotes: [
              {
                name:     'Day 01 Note',
                desc:     'Introduction to Soft Skills for Teachers',   // optional
                fileType: 'PPTX',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Soft Skills for Teachers/Day_01.pptx',
              },
              {
                name:     'Day 02 Note',
                desc:     'Time Management',   // optional
                fileType: 'PPTX',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Soft Skills for Teachers/Day_02.pptx',
              },
              {
                name:     'Day 03 Note',
                desc:     'Teamwork',   // optional
                fileType: 'PPTX',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Soft Skills for Teachers/Day_03.pptx',
              },
              {
                name:     'Soft Skills for the 21st Century',
                desc:     'Recommended reading material (Provided for reading only)',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Soft Skills for Teachers/Soft_Skills_for_the_21st_Century.pdf',
              },
              {
                name:     'Soft Skills - Research Paper',
                desc:     'Recommended reading material (Provided for reading only)',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Soft Skills for Teachers/Soft_Skills-Research_Paper.pdf',
              },
              {
                name:     'The Hard Truth about Soft Skills',
                desc:     'Recommended reading material (Provided for reading only)',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Soft Skills for Teachers/The_Hard_Truth_about_Soft_Skills.pdf',
              },
              {
                name:     'The Five Dysfunctions of a Team',
                desc:     'Teamwork video material (Provided for viewing only)',   // optional
                fileType: 'Video',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Soft Skills for Teachers/The_Five_Dysfunctions_of_a_Team.mp4',
              }
            ],
            aanaNotes:     [
              {
                name:     'Old Student Notes - 01',
                desc:     'Notes of old students of B.Ed (ආනාගේ නෙමෙයි)',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Soft Skills for Teachers/old-Soft_Skills_01.pdf',
              },
              {
                name:     'Old Student Notes - 02',
                desc:     'Notes of old students of B.Ed (ආනාගේ නෙමෙයි)',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Soft Skills for Teachers/old-Soft_Skills_02.pdf',
              }              
            ],
            pastPapers:    [
              {
                name:     '2024 August',
                desc:     'Soft Skills for Teachers paper 2024 August',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/2024_August_All.pdf',
              },
              {
                name:     '2020 July',
                desc:     'Soft Skills for Teachers paper 2020 July',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/2020_July_All.pdf',
              }
            ],
          },
          {
            id:    'n-y1s1-bcelt',
            label: 'Basic Concepts in English Language Teaching',
            recId: 'r-y1s1-bcelt',
            lecturerNotes: [],
            aanaNotes:     [
              {
                name:     'Old Student Notes - 01',
                desc:     'Notes of old students of B.Ed (ආනාගේ නෙමෙයි)',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Basic Concepts in English Language Teaching/old-ELT_01.pdf',
              },
              {
                name:     'Old Student Notes - 02',
                desc:     'Notes of old students of B.Ed (ආනාගේ නෙමෙයි)',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Basic Concepts in English Language Teaching/old-ELT_02.pdf',
              }
            ],
            pastPapers:    [
              {
                name:     '2024 August',
                desc:     'Basic Concepts in English Language Teaching paper 2024 August',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/2024_August_All.pdf',
              },
              {
                name:     '2020 July',
                desc:     'Basic Concepts in English Language Teaching paper 2020 July',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Basic Concepts in English Language Teaching/2020_July.pdf',
              }
            ],
          },
          {
            id:    'n-y1s1-intro',
            label: 'Introduction to English Language and English Grammar',
            recId: 'r-y1s1-intro',
            lecturerNotes: [
              {
                name:     'What is Language and the English Language',
                desc:     'Day 01 Note',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Introduction to English Language and English Grammar/what_is_language_and_the_english_language.pdf',
              },
              {
                name:     'Lexicon Sources',
                desc:     'Day 02 Note',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Introduction to English Language and English Grammar/lexicon_sources.pdf',
              },
              {
                name:     'Writing Systems',
                desc:     'Day 03 Note',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Introduction to English Language and English Grammar/writing_systems.pdf',
              }
            ],
            aanaNotes:  [
              {
                name:     'Old Student Notes - 01',
                desc:     'Notes of old students of B.Ed (ආනාගේ නෙමෙයි)',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Introduction to English Language and English Grammar/old-grammar_01.pdf',
              },
              {
                name:     'Old Student Notes - 02',
                desc:     'Notes of old students of B.Ed (ආනාගේ නෙමෙයි)',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Introduction to English Language and English Grammar/old-grammar_02.pdf',
              }
            ],
            pastPapers: [
              {
                name:     '2024 August',
                desc:     'Introduction to English Language and English Grammar paper 2024 August',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/2024_August_All.pdf',
              },
              {
                name:     '2020 July',
                desc:     'Introduction to English Language and English Grammar paper 2020 July',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/2020_July_All.pdf',
              }
            ],
          },
          {
            id:    'n-y1s1-elit',
            label: 'Introduction to English Literature',
            recId: 'r-y1s1-elit',
            lecturerNotes: [
              {
                name:     'Anthology',
                desc:     'Entire anthology for Year 01 Semester 01',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Introduction to English Literature/Anthology.pdf',
              },
              {
                name:     'Eveline',
                desc:     'Eveline short story',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Introduction to English Literature/Eveline.pdf',
              },
              {
                name:     'The Happy Prince',
                desc:     'The Happy Prince short story',   // optional
                fileType: 'DOCX',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Introduction to English Literature/The_Happy_Prince.docx',
              },
              {
                name:     'The Grasshopper',
                desc:     'The Grasshopper short story',   // optional
                fileType: 'DOCX',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Introduction to English Literature/The_Grasshopper.docx',
              },
              {
                name:     'The Old Man at the Bridge',
                desc:     'The Old Man at the Bridge short story',   // optional
                fileType: 'DOCX',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Introduction to English Literature/The_Old_Man_at_the_Bridge.docx',
              },
              {
                name:     'Animal Farm',
                desc:     'Animal Farm novel',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Introduction to English Literature/Animal_Farm.pdf',
              },
              {
                name:     'The Caucasian Chalk CIrcle',
                desc:     'The Caucasian Chalk CIrcle drama',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Introduction to English Literature/The_Caucasian_Chalk_CIrcle.pdf',
              }
            ],
            aanaNotes:     [],
            pastPapers:    [
              {
                name:     '2024 August',
                desc:     'Introduction to English Literature paper 2024 August',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/2024_August_All.pdf',
              },
              {
                name:     '2020 July',
                desc:     'Introduction to English Literature paper 2020 July',   // optional
                fileType: 'PDF',                     // or 'VIDEO' for playable entries
                url:      'notes/Year 01/Semester 01/Philosophical Foundation of Education/2020_July_All.pdf',
              }
            ],
          },
        ],
      },

      /* ── Semester 02 ────────────────────────────────── */
      {
        id: 'n-y1s2',
        label: 'Semester 02',
        subjects: [
          { id: 'n-y1s2-psych',  label: 'Psychological Foundation of Education', recId: 'r-y1s2-psych',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y1s2-tmeth',  label: 'Teaching Methods General & Special',    recId: 'r-y1s2-tmeth',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y1s2-socio',  label: 'Sociological Foundation of Education',  recId: 'r-y1s2-socio',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y1s2-litper', label: 'Background to Literary Periods',        recId: 'r-y1s2-litper', lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y1s2-eltm',   label: 'ELT Methodology',                       recId: 'r-y1s2-eltm',   lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y1s2-rw',     label: 'Teaching Reading & Writing',            recId: 'r-y1s2-rw',     lecturerNotes: [], aanaNotes: [], pastPapers: [] },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     YEAR 02  —  2027 – 2028
  ══════════════════════════════════════════════════════════ */
  {
    id: 'n-y2',
    label: 'Year 02',
    year: '2027 – 2028',
    semesters: [
      {
        id: 'n-y2s1',
        label: 'Semester 01',
        subjects: [
          { id: 'n-y2s1-comp',  label: 'Comparative Education',                         recId: 'r-y2s1-comp',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y2s1-guid',  label: 'Guidance & Counselling',                        recId: 'r-y2s1-guid',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y2s1-meas',  label: 'Measurements & Evaluation in Education',        recId: 'r-y2s1-meas',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y2s1-eng1',  label: 'Structure of English I (Phonetics, Phonology)', recId: 'r-y2s1-eng1',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y2s1-eng2',  label: 'Structure of English II (Morphology)',           recId: 'r-y2s1-eng2',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y2s1-eng3',  label: 'Structure of English III (Syntax & Semantics)', recId: 'r-y2s1-eng3',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y2s1-call',  label: 'Computer Assisted Language Learning',           recId: 'r-y2s1-call',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
        ],
      },
      {
        id: 'n-y2s2',
        label: 'Semester 02',
        subjects: [
          { id: 'n-y2s2-aest',  label: 'Aesthetic Education',            recId: 'r-y2s2-aest',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y2s2-emgmt', label: 'Educational Management',         recId: 'r-y2s2-emgmt', lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y2s2-val',   label: 'Value Education',                recId: 'r-y2s2-val',   lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y2s2-ls',    label: 'Teaching, Listening & Speaking', recId: 'r-y2s2-ls',    lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y2s2-writ',  label: 'Teaching Writing Skills',        recId: 'r-y2s2-writ',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y2s2-lp',    label: 'Lesson Planning & ELT Material', recId: 'r-y2s2-lp',    lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y2s2-slle',  label: 'Sri Lankan Literature in English', recId: 'r-y2s2-slle', lecturerNotes: [], aanaNotes: [], pastPapers: [] },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     YEAR 03  —  2028 – 2029
  ══════════════════════════════════════════════════════════ */
  {
    id: 'n-y3',
    label: 'Year 03',
    year: '2028 – 2029',
    semesters: [
      {
        id: 'n-y3s1',
        label: 'Semester 01',
        subjects: [
          { id: 'n-y3s1-clmgmt', label: 'Classroom Management',                                  recId: 'r-y3s1-clmgmt', lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y3s1-child',  label: "Children's Rights",                                     recId: 'r-y3s1-child',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y3s1-tp',     label: 'Teaching Practice',                                     recId: 'r-y3s1-tp',     lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y3s1-port',   label: 'Portfolio',                                             recId: 'r-y3s1-port',   lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y3s1-disc',   label: 'Discourse Analysis',                                    recId: 'r-y3s1-disc',   lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y3s1-sla',    label: 'Second Language Acquisition/Learning & ESL in Sri Lanka', recId: 'r-y3s1-sla',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
        ],
      },
      {
        id: 'n-y3s2',
        label: 'Semester 02',
        subjects: [
          { id: 'n-y3s2-curr',   label: 'Curriculum Theory & Practice',                    recId: 'r-y3s2-curr',   lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y3s2-pe',     label: 'Physical Education',                              recId: 'r-y3s2-pe',     lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y3s2-eltcur', label: 'ELT Curriculum in Sri Lanka',                    recId: 'r-y3s2-eltcur', lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y3s2-litth',  label: 'Literary Theory in English',                     recId: 'r-y3s2-litth',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y3s2-shak',   label: 'Shakespearean Drama',                            recId: 'r-y3s2-shak',   lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y3s2-test',   label: 'Testing & Evaluation in Second Language Teaching', recId: 'r-y3s2-test',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
        ],
      },
    ],
  },

  /* ══════════════════════════════════════════════════════════
     YEAR 04  —  2029 – 2030
  ══════════════════════════════════════════════════════════ */
  {
    id: 'n-y4',
    label: 'Year 04',
    year: '2029 – 2030',
    semesters: [
      {
        id: 'n-y4s1',
        label: 'Semester 01',
        subjects: [
          { id: 'n-y4s1-res',   label: 'Research Methods',       recId: 'r-y4s1-res',   lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y4s1-vic',   label: 'Victorian Literature',   recId: 'r-y4s1-vic',   lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y4s1-rom',   label: 'Romantic Poetry',        recId: 'r-y4s1-rom',   lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y4s1-eltcd', label: 'ELT Curriculum Design',  recId: 'r-y4s1-eltcd', lecturerNotes: [], aanaNotes: [], pastPapers: [] },
        ],
      },
      {
        id: 'n-y4s2',
        label: 'Semester 02',
        subjects: [
          { id: 'n-y4s2-amer', label: 'Introduction to American Literature (Optional)', recId: 'r-y4s2-amer', lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y4s2-aug',  label: 'Augustan Literature (Optional)',                 recId: 'r-y4s2-aug',  lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y4s2-post', label: 'Post-Colonial Literature (Optional)',            recId: 'r-y4s2-post', lecturerNotes: [], aanaNotes: [], pastPapers: [] },
          { id: 'n-y4s2-diss', label: 'Dissertation',                                  recId: 'r-y4s2-diss', lecturerNotes: [], aanaNotes: [], pastPapers: [] },
        ],
      },
    ],
  },
];

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 2 — FILE TYPE NORMALISER + CSS CLASS MAP
════════════════════════════════════════════════════════════ */
const FT_ALIAS = {
  DOC:'DOCX', WORD:'DOCX', DOCUMENT:'DOCX',
  XLS:'XLSX', EXCEL:'XLSX', SPREADSHEET:'XLSX',
  PPT:'PPTX', POWERPOINT:'PPTX', SLIDES:'PPTX', PRESENTATION:'PPTX',
  JPEG:'JPG', IMAGE:'IMG', PICTURE:'IMG',
  ARCHIVE:'ZIP', RAR:'ZIP',
  MP4:'VIDEO', WEBM:'VIDEO', MOV:'VIDEO',
};
const FT_MAP = {
  PDF:'ft-pdf', DOCX:'ft-docx', PPTX:'ft-pptx', PPT:'ft-pptx',
  XLSX:'ft-xlsx', XLS:'ft-xlsx', ZIP:'ft-zip',
  IMG:'ft-img', JPG:'ft-img', PNG:'ft-img',
  TXT:'ft-txt', MD:'ft-txt',
  VIDEO:'ft-video',
};

function normalizeType(raw) {
  if (!raw) return 'OTHER';
  const t = String(raw).replace(/^ft[-_]?/i, '').trim().toUpperCase();
  return FT_ALIAS[t] || t || 'OTHER';
}
function ftClass(raw) { return FT_MAP[normalizeType(raw)] || 'ft-other'; }
function ftLabel(raw) { return normalizeType(raw); }

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 3 — DOWNLOAD HELPER
════════════════════════════════════════════════════════════ */
function buildDlUrl(url) {
  if (!url) return '#';
  if (!url.startsWith('http')) return url; // local path — use as-is

  let m = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`;
  m = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (m) return `https://drive.google.com/uc?export=download&id=${m[1]}`;

  m = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://docs.google.com/document/d/${m[1]}/export?format=docx`;
  m = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://docs.google.com/spreadsheets/d/${m[1]}/export?format=xlsx`;
  m = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://docs.google.com/presentation/d/${m[1]}/export/pptx`;

  return url;
}

function dlFile(url, name, rawType) {
  if (!url || url === '#') return;
  const ext = normalizeType(rawType).toLowerCase();
  const a   = document.createElement('a');
  a.href    = buildDlUrl(url);
  a.download = (name || 'file') + '.' + (ext !== 'other' ? ext : 'file');
  a.target  = '_blank';
  a.rel     = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ── Video URL detection ── */
function detectVideoType(url) {
  if (!url) return 'other';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/drive\.google\.com/.test(url))      return 'drive';
  return 'other';
}
function extractYTId(url) {
  const m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
         || url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}
function toDriveEmbed(url) {
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
         || url.match(/open\?id=([a-zA-Z0-9_-]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : url;
}

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 4 — VIDEO PLAYER
   YouTube → embedded YT iframe (YT's own player)
   Drive / local / other → custom modal overlay
════════════════════════════════════════════════════════════ */
function nOpenPlayer(label, url) {
  const type    = detectVideoType(url);
  const modal   = document.getElementById('nVidModal');
  const ovl     = document.getElementById('nVidOvl');
  const titleEl = document.getElementById('nVidTitle');
  const embed   = document.getElementById('nVidEmbed');

  titleEl.textContent = label;
  embed.innerHTML = '';
  ovl.classList.add('open');
  modal.classList.add('open');

  if (type === 'youtube') {
    const vid = extractYTId(url);
    if (!vid) {
      embed.innerHTML = `<div style="color:#fff;padding:2rem;text-align:center">Invalid YouTube URL</div>`;
      return;
    }
    embed.innerHTML = `<iframe
      src="https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1"
      allowfullscreen
      allow="autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; web-share"
      loading="lazy"></iframe>`;
  } else if (type === 'drive') {
    embed.innerHTML = `<iframe src="${toDriveEmbed(url)}" allowfullscreen allow="autoplay;fullscreen" loading="lazy"></iframe>`;
  } else {
    const ext = url.split('?')[0].split('.').pop().toLowerCase();
    if (['mp4','webm','ogg','mov'].includes(ext)) {
      embed.innerHTML = `<video controls autoplay style="position:absolute;top:0;left:0;width:100%;height:100%;background:#000">
        <source src="${url}">
      </video>`;
    } else {
      embed.innerHTML = `<iframe src="${url}" allowfullscreen allow="autoplay;fullscreen" loading="lazy"></iframe>`;
    }
  }
}

function nClosePlayer() {
  document.getElementById('nVidModal').classList.remove('open');
  document.getElementById('nVidOvl').classList.remove('open');
  setTimeout(() => { const e = document.getElementById('nVidEmbed'); if (e) e.innerHTML = ''; }, 300);
}

function nMaybeClose(e) {
  if (e.target === document.getElementById('nVidOvl')) nClosePlayer();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') nClosePlayer(); });

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 5 — HTML BUILDERS
════════════════════════════════════════════════════════════ */
function buildFileCard(f) {
  const type    = f.fileType || f.filetype || '';
  const normed  = normalizeType(type);
  const isVideo = normed === 'VIDEO';
  const cls     = ftClass(type);
  const lbl     = isVideo ? 'VIDEO' : ftLabel(type);
  const safe    = (f.name || '').replace(/'/g, "\\'");
  const url     = f.url || '';
  const descHtml = f.desc ? `<div class="file-desc">${f.desc}</div>` : '';

  if (isVideo) {
    const safeUrl = url.replace(/'/g, "\\'");
    return `<div class="file-card">
      <div class="ft-badge ft-video"><i class="fa-solid fa-play" style="font-size:.7rem;margin-left:1px"></i></div>
      <div class="file-info">
        <div class="file-name">${f.name || 'Video'}</div>
        ${descHtml}
      </div>
      <button class="dl-btn dl-btn--play" onclick="nOpenPlayer('${safe}','${safeUrl}')" title="Play ${f.name || 'video'}">
        <i class="fa-solid fa-play"></i><span> Play</span>
      </button>
    </div>`;
  }

  return `<div class="file-card">
    <div class="ft-badge ${cls}">${lbl}</div>
    <div class="file-info">
      <div class="file-name">${f.name || lbl}</div>
      ${descHtml}
    </div>
    <button class="dl-btn" onclick="dlFile('${url}','${safe}','${type}')" title="Download ${f.name || lbl}">
      <i class="fa-solid fa-download"></i><span> Download</span>
    </button>
  </div>`;
}

function buildFileList(files) {
  if (!files || !files.length)
    return `<p class="cat-empty"><i class="fa-regular fa-clock"></i>&nbsp; Coming soon…</p>`;
  return `<div class="file-list">${files.map(buildFileCard).join('')}</div>`;
}

function buildSubject(subj) {
  const descHtml  = subj.desc ? `<span class="subj-desc">${subj.desc}</span>` : '';
  const watchLink = subj.recId
    ? `<a href="recordings.php#${subj.recId}" class="watch-link">
         <i class="fa-solid fa-circle-play"></i> Watch all recordings for this subject →
       </a>`
    : '';
  return `
  <div class="subj-item" data-acc-item id="${subj.id}">
    <button class="subj-head acc-head" data-acc-head aria-expanded="false">
      <i class="fa-solid fa-book-bookmark subj-icon"></i>
      <div class="subj-label-wrap">
        <span class="subj-label">${subj.label}</span>
        ${descHtml}
      </div>
      <i class="fa-solid fa-chevron-right acc-chev subj-chev"></i>
    </button>
    <div class="acc-body"><div class="acc-body-inner">
      <div class="subj-body-inner">
        <div class="cat-block">
          <div class="cat-head cat-lec"><i class="fa-solid fa-chalkboard-user"></i> Lecturer Notes</div>
          ${buildFileList(subj.lecturerNotes)}
        </div>
        <div class="cat-block">
          <div class="cat-head cat-aana"><i class="fa-solid fa-pen-nib"></i> ආනාගේ Notes</div>
          ${buildFileList(subj.aanaNotes)}
        </div>
        <div class="cat-block">
          <div class="cat-head cat-paper"><i class="fa-solid fa-scroll"></i> Past Papers</div>
          ${buildFileList(subj.pastPapers)}
        </div>
        ${watchLink}
      </div>
    </div></div>
  </div>`;
}

function buildSemester(sem) {
  const inner = sem.subjects.length
    ? sem.subjects.map(buildSubject).join('')
    : `<div class="acc-empty"><i class="fa-regular fa-folder-open"></i><span>No content yet for this semester.</span></div>`;
  const meta = sem.subjects.length
    ? `${sem.subjects.length} subject${sem.subjects.length > 1 ? 's' : ''}`
    : 'Empty';
  return `
  <div class="sem-item" data-acc-item id="${sem.id}">
    <button class="sem-head acc-head" data-acc-head aria-expanded="false">
      <i class="fa-solid fa-layer-group sem-icon"></i>
      <span class="sem-label">${sem.label}</span>
      <span class="sem-meta">${meta}</span>
      <i class="fa-solid fa-chevron-right acc-chev sem-chev"></i>
    </button>
    <div class="acc-body"><div class="acc-body-inner">
      <div class="sem-body-inner">${inner}</div>
    </div></div>
  </div>`;
}

function buildYear(yr) {
  const inner = yr.semesters.length
    ? yr.semesters.map(buildSemester).join('')
    : `<div class="acc-empty"><i class="fa-regular fa-folder-open"></i><span>No content yet for this year.</span></div>`;
  const totalSubs = yr.semesters.reduce((n, s) => n + s.subjects.length, 0);
  const badge = yr.semesters.length
    ? `${yr.semesters.length} sem${yr.semesters.length > 1 ? 's' : ''}${totalSubs ? ` · ${totalSubs} subj` : ''}`
    : 'Upcoming';
  return `
  <div class="year-item" data-acc-item id="${yr.id}">
    <button class="year-head acc-head" data-acc-head aria-expanded="false">
      <i class="fa-solid fa-chevron-right acc-chev year-chev"></i>
      <span class="year-num">${yr.label} <small>${yr.year}</small></span>
      <span class="year-badge">${badge}</span>
    </button>
    <div class="acc-body"><div class="acc-body-inner">
      <div class="year-body-inner">${inner}</div>
    </div></div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   ⚙️  SECTION 6 — RENDER + INIT
════════════════════════════════════════════════════════════ */
(function init() {
  const root = document.getElementById('notesRoot');
  if (!root) return;
  root.innerHTML = NOTES_DATA.map(buildYear).join('');

  root.addEventListener('click', e => {
    const head = e.target.closest('[data-acc-head]');
    if (!head) return;
    const item = head.closest('[data-acc-item]');
    if (!item) return;
    const open = item.classList.toggle('open');
    head.setAttribute('aria-expanded', String(open));
  });

  handleHash();
  window.addEventListener('hashchange', handleHash);
})();

function handleHash() {
  const hash = location.hash.slice(1);
  if (!hash) return;
  const target = document.getElementById(hash);
  if (!target || !target.hasAttribute('data-acc-item')) return;
  let el = target.parentElement;
  while (el && el.id !== 'notesRoot') {
    if (el.hasAttribute('data-acc-item')) {
      el.classList.add('open');
      el.querySelector(':scope > [data-acc-head]')?.setAttribute('aria-expanded', 'true');
    }
    el = el.parentElement;
  }
  target.classList.add('open');
  target.querySelector(':scope > [data-acc-head]')?.setAttribute('aria-expanded', 'true');
  setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
}
