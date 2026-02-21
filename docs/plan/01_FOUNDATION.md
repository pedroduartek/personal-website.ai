# 01 — Foundation (Repo, standards, information architecture)

## 1) High-level architecture (v1)
- Build the website as a **React + TypeScript** SPA using **Vite**.
- Keep all content in-repo (typed TS + Markdown posts).
- No backend for v1.

## 2) Repository layout (monorepo)

```
repo/
  apps/
    web/                 # React app
    api/                 # Optional post-beta .NET 10 minimal API
  infra/
    docker/              # Reserved (post-beta only if backend/DB is added)
  docs/
    plan/                # these md plan files
  .github/
    workflows/
  README.md
```

## 3) Tooling (free)
- Frontend: React + Vite + TypeScript
- Styling: Tailwind CSS
- Lint/format: Biome
- Tests: Vitest + React Testing Library
- CI: GitHub Actions
- Package manager: pnpm

### Locked v1 selections
- Monorepo + **pnpm**
- **Biome** for lint/format
- **Tailwind** for styling
- Backend: **none for v1**
- Blog: **included**
- PDF CV: **included**

## 4) Maintainability rules (minimal comments)
- Prefer self-explanatory code: clear names, small functions/components.
- Use feature folders (`features/*`).
- Keep shared UI in `components/common`.
- Short comments only for non-obvious decisions.

## 5) Information architecture (pages)
Included in v1:
- `/` Home
- `/about`
- `/experience`
- `/projects` + `/projects/:slug`
- `/education`
- `/conferences`
- `/skills`
- `/blog` + `/blog/:slug`
- `/contact`
- `/cv` (PDF CV download entry point)

## 6) Content model (single source of truth)
Store typed content in `apps/web/src/content/`:
- `profile.ts`
- `experience.ts`
- `projects.ts`
- `education.ts`
- `conferences.ts`
- `skills.ts`
Blog posts stored as Markdown in `apps/web/src/content/blog/*.md`.

## 7) Git & branching strategy
Recruiter-friendly and simple:
- `main` is always deployable.
- Feature branches: `feat/<name>`, fixes: `fix/<name>`.
- Use PRs even solo.

## 8) Milestones
- **M0**: Repo scaffolding + CI
- **M1**: Core UI + routing + layout
- **M2**: Content rendering + project detail pages + blog
- **M3**: PDF CV generation + polish + accessibility + performance budgets
- **M4**: Post-beta enhancements (RSS, search, analytics) — backend remains optional
- **M5**: Beta complete (see `04_BETA_CHECKLIST.md`)
- **M6**: Deployment (see `05_DEPLOYMENT_AFTER_BETA.md`)

---

## Claude Code prompt (foundation)
> **Prompt**: Implement the repository layout and tooling described in `01_FOUNDATION.md`.

Deliverables:
1. Monorepo structure with `apps/web` (React+Vite+TS) scaffold.
2. pnpm workspace configuration.
3. Biome configuration + scripts (`lint`, `format`, `check`).
4. Vitest + RTL test setup + one smoke test.
5. GitHub Actions workflow that runs `pnpm install`, `pnpm -r check`, `pnpm -r test`, and `pnpm -r build` on PRs.

Constraints:
- Minimal comments.
- No deployment yet.
