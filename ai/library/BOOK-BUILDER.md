# Adding a new book to ආනා Study Buddy

You need **three things per book**, all inside one folder named after the year and semester:

```
ai/library/
  catalog.json                      <- the list of books (the Topic menu is built from it)
  y1s2/                             <- year 1, semester 2
    frankenstein/
      meta.json                     <- title, author, which year/semester/subject
      book.txt                      <- the full text of the book (you paste it)
      notes.txt                     <- study notes (an AI writes it for you with the prompt below)
```

## Step 1. Make `book.txt`
1. Get the full text (Project Gutenberg for old books, or your own copy).
2. Delete the junk: licence text, page numbers, repeated headers.
3. Put every chapter / letter / act on its own line that starts with `## `, exactly like this:
   ```
   ## Letter 1
   To Mrs. Saville, England. ...text of the letter...

   ## Chapter 1
   I am by birth a Genevese, ...
   ```
   These headings are how the chat labels quotes, like (Chapter 5). Keep them short and consistent.
4. Save the file as `book.txt` (UTF-8).

## Step 2. Make `notes.txt` with an AI
Open a strong AI chat (Claude, Gemini or ChatGPT). Paste the **PROMPT** below, then paste the whole book under it.
If the AI says the book is too long, use the **long book method** underneath.

### PROMPT (copy everything in the box)
```
You are writing STUDY NOTES for a chatbot that helps English-language students (many are not native speakers) study a book.
Read the book I paste below. Then write ONE plain-text file, in exactly the format described here. Nothing before or after it.

FORMAT RULES
- The file is made of sections. Every section starts with a line that begins with "## " followed by the section title, then the text.
- No other formatting: no bold, no asterisks, no bullet symbols other than a hyphen and a space, no tables.
- Write in plain, simple English (about B1 level). Short sentences. Explain hard ideas in everyday words.
- Do NOT copy sentences from the book and do NOT use quotation marks. Describe things in your own words. The chatbot gets the real quotes from the book text separately.
- Only write facts that are really in the book or are well-known and certain about the author and the period. If you are not sure, leave it out. Never guess.
- Use the book's own names for chapters, exactly as they appear in the headings of the text I pasted (for example Letter 4, Chapter 12, Act 2 Scene 1).

SECTIONS, in this order:
## Overview
The whole story from start to finish in order, 200 to 300 words. Who, what happens, how it ends, and what the book is really about.
## About the author and the time
Who wrote it, when, and the historical and cultural background that helps students understand it. 120 to 200 words.
## Characters
One line per important character: Name: who they are, what they want, how they change, and which chapters matter most for them.
## Setting
Where and when the story happens and why the settings matter.
## Structure and narration
Who tells the story, from whose point of view, how the book is organised (parts, frames, letters), and why the author chose this.
## Themes
One line per theme: Theme: what the book says about it, and the chapters where it is clearest.
## Symbols and motifs
One line per symbol: Symbol: what it stands for, and where it appears.
## Important events in order
A numbered list of the 12 to 20 key events, each with its chapter, like: 1. (Chapter 3) Victor leaves home for university.
## Chapter by chapter
Do NOT write this heading. Instead write one section for EACH chapter/letter/act/part, titled exactly like the book's heading, like "## Chapter 5". In each: 120 to 220 words saying what happens, who is involved, and why it matters for the story and the themes.
## Key words
20 to 40 hard or old-fashioned words from the book. One per line: word: simple meaning (the chapter where it appears).
## Exam help
10 to 12 questions students are likely to get (essay and short-answer). For each: the question, then 2 to 4 lines of what a good answer should include, naming the chapters to use.
## Where to find key moments
12 to 20 lines. Each line says where an important moment, speech or description is and what it shows, without quoting. Example: Chapter 5: the moment the creature first opens its eyes and Victor runs away in horror.

BEGIN. The book text follows.
```

### Long book method (if the AI refuses or cuts off)
1. Paste the PROMPT, then say: "The book is long, so I will send it in parts. Do not write anything yet. Reply only 'ready'."
2. Paste Part 1 (about 10 chapters), say "PART 1 of N. Reply only 'ok'." Repeat for each part.
3. After the last part say: "That was the whole book. Now write the notes file."
4. If the reply stops halfway, type "continue exactly where you stopped, same format".

### Check the result
- Every chapter heading in `book.txt` has a matching `## ...` section in `notes.txt`.
- There are no quotation marks copied from the book.
- Skim the Overview and a few chapters. If something is wrong, fix it by hand. A short, correct file beats a long wrong one.
- Save it as `notes.txt` in the same folder as `book.txt`.

## Step 3. Fill in `meta.json`
```json
{
  "id": "frankenstein",
  "title": "Frankenstein",
  "author": "Mary Shelley",
  "year": 1,
  "semester": 2,
  "subject": "y1s2-litper",
  "labelWord": "Chapter",
  "blurb": "The 1818 Gothic novel about Victor Frankenstein and the creature he makes."
}
```
`subject` is the subject code from the admin panel tree (optional, you can leave it empty).

## Step 4. Add one line to `catalog.json`
```json
{ "id": "frankenstein", "path": "y1s2/frankenstein", "title": "Frankenstein", "author": "Mary Shelley", "year": 1, "semester": 2, "subject": "y1s2-litper" }
```
Push to GitHub. The book appears in the Topic menu under Year 1, Semester 2.

## Tips
- Public-domain books are safe to include. For books still under copyright, include only your own notes and short fair-use excerpts.
- To fix an answer the AI keeps getting wrong, improve that chapter's section in `notes.txt`.
