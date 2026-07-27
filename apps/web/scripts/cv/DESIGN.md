# CV Generator — Design (2026-07-27)

## Goal
A reproducible generator for Pedro's CV that keeps it consistent with
pedroduartek.com. It keeps the **exact same structure, sections, skill
groupings, and visual style** as the current CV; only the information stays
updated. One command regenerates `.docx` + `.pdf`.

## Non-goals
- No change to the CV's structure, sections, skill groupings, or look. It is a
  faithful reproduction of the current `Pedro_Duarte_CV.pdf`, made regenerable.

## Baseline (current CV)
4 pages, US Letter, Word / Aptos font. Sections, in order:
1. **Header** — name, contact line (location, email, phone, LinkedIn).
2. **Summary** — one paragraph.
3. **Technical Skills** — 6 groups, each a bulleted line: Backend; Data &
   Messaging; Infrastructure & DevOps; Architecture & Leadership; Automation &
   IoT; Modern AI.
4. **Professional Experience** — Enhesa (Tech Lead, then Software Engineer),
   VORTAL, Closer Consulting; two-column layout (company left; role, dates,
   "Tech stack:", prose right).
5. **Education** — Polytechnic Institute of Setúbal (grade, courses), Formabase.
6. **Conferences and Events** — Azure Dev Summit (attendee), Web Summit (volunteer).

Style: name 36pt bold, section headers 16pt bold, body 12pt, teal (#467886)
hyperlink colour, `•` bullets.

## Data model (hybrid)
**From the site (`apps/web/src/content/*`), so the CV tracks the site:**
- `profile`: name, title, email, LinkedIn, GitHub, location.
- `experience`: company, role, start/end dates, technologies ("Tech stack:").
- `education`: institution, degree, field, dates, gpa, achievements (courses).
- `conferences`: name, type, date, description.
- computed years of experience (dynamic).

**From `cv-data.json` (CV-only text, authored to match the current CV 1:1):**
- the Summary paragraph;
- the per-group skill lists for the 6 Technical Skills groups;
- the per-role prose descriptions in Professional Experience;
- the phone number;
- any CV-specific labels/wording.

## Components (`apps/web/scripts/cv/`)
1. `cv-data.json` — the CV-only content above (the only file Pedro edits by hand
   for CV-specific text).
2. `export-cv-data.ts` — run via **vite-node** (uses apps/web's Vite config so
   the content's image imports resolve). Imports the site content, merges
   `cv-data.json`, writes `cv-build.json`.
3. `build_cv.py` — **python-docx**; reads `cv-build.json`; builds
   `Pedro_Duarte_CV.docx` in the exact current style; then drives **Word COM**
   to export `Pedro_Duarte_CV.pdf`. Writes both into `apps/web/src/CV/`.
4. `npm run cv` (in `apps/web/package.json`) — runs the exporter, then the Python
   build.

## Data flow
site content + `cv-data.json` → `export-cv-data.ts` (vite-node) → `cv-build.json`
→ `build_cv.py` → `.docx` → Word COM → `.pdf` → `apps/web/src/CV/` → `/cv` serves it.

## Consequences of "site drives the facts"
The regenerated CV uses the site's values: title "Senior Software Engineer",
years computed (~6), Enhesa Software Engineer end date from `experience.ts`
(2023-03). This aligns the CV with the site.

## Error handling
- Exporter fails loudly if a required site field is missing.
- `build_cv.py` verifies `cv-build.json` exists; if Word COM / PDF export fails,
  it keeps the `.docx` and reports the error (so a missing Word install degrades
  gracefully to docx-only).

## Requirements (local, not CI)
Node (vite-node via the repo's vitest/vite), Python with `python-docx` +
`pywin32`, and Microsoft Word (Windows) for the PDF step. Pedro runs it locally.

## Verification
Generate once, open the PDF, compare structure/style/content against the current
`Pedro_Duarte_CV.pdf`, and iterate on the python-docx styling until it matches.
