# Personal Website Build Plan (React + optional .NET 10 + Postgres)

This folder contains a **Claude Code–friendly** implementation plan for building a personal website that showcases you as a software engineer.

## Locked choices for v1
- Goal: **Blog + portfolio**
- Tone: **Friendly but professional**
- Language: **English**
- Stack: **React + TypeScript (Vite) + Tailwind + Biome + pnpm**
- Backend: **none for v1** (static site)
- Features included in v1: **About, Experience, Projects (detail pages), Education, Conferences, Skills, Contact, Blog, PDF CV**
- Hosting target after beta: **Cloudflare Pages**

## How to use with Claude Code
1. Put these files under `docs/plan/` in your repo (or keep them anywhere).
2. Give Claude Code the files **in order** (start with `00_DECISIONS.md`).
3. Follow the “Claude Code prompt” blocks section by section.

## File order
- `00_DECISIONS.md` — locked decisions (no assumptions)
- `01_FOUNDATION.md` — repo scaffolding, tooling, standards
- `02_FRONTEND_REACT.md` — React app plan (includes blog + PDF CV)
- `03_BACKEND_DOTNET10_OPTIONAL.md` — post-beta optional backend
- `04_BETA_CHECKLIST.md` — beta definition + quality gates
- `05_DEPLOYMENT_AFTER_BETA.md` — deployment plan (only after beta)
- `06_GITHUB_RECRUITER_POLISH.md` — GitHub polish for recruiters

> Deployment is intentionally placed **after** beta.
