# 00 — Decisions & Inputs (Locked for v1)

These choices are **locked** based on your answers. Claude Code should proceed without asking further questions.

## A) Site goals
- [x] Primary goal: **Technical writing/blog + portfolio**
- [x] Tone: **Friendly but professional**
- [x] Languages: **English only**

## B) Content scope for v1 (beta)
MUST have in v1:
- [x] About / Bio
- [x] Experience (timeline)
- [x] Side projects (with deep-dive pages)
- [x] Education
- [x] Conferences / Talks / Meetups
- [x] Skills / Tech stack
- [x] Contact
- [x] Downloadable PDF CV (auto-generated from content)
- [x] Blog

## C) Design / UI constraints
- [x] Style: **Clean + minimal**
- [x] Theme: **Dark theme only**
- [x] Animations: **Subtle**
- [x] Styling: **Tailwind CSS**

## D) Backend needs (v1)
- [x] **Frontend-only** static site
- [x] Contact method: **mailto + LinkedIn profile link**

## E) Hosting (after beta)
- [x] Preferred hosting: **Vercel**

## F) Domain
- [x] Use a custom domain: **yes**
- [x] Domain name: **personal-website.ai** (pedroduartek.com)

## G) Personal data safety
- [x] Phone number shown publicly: **no**
- [x] Address/exact location shown: **no**

## H) Repo preferences
- [x] Repo layout: **Monorepo** (best practice for this scope)
- [x] Package manager: **pnpm** (best for monorepos)
- [x] Lint/format: **Biome** (fast, single-tool)

---

## Claude Code prompt (run first)
> **Prompt**: Read `00_DECISIONS.md` and proceed without asking further questions. Create an implementation task list for milestones M0 and M1 from `01_FOUNDATION.md`.
