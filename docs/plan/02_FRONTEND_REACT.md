# 02 — Frontend (React) implementation plan

## 1) Tech choices (free)
- React + TypeScript + Vite
- Router: `react-router-dom`
- Styling: Tailwind CSS
- Content: typed TS modules + Markdown blog posts in-repo

## 2) Web app structure
Inside `apps/web/src/`:

```
src/
  app/
    router.tsx
    layout/
  features/
    home/
    about/
    experience/
    projects/
    education/
    conferences/
    skills/
    blog/
    contact/
    cv/
  content/
    blog/
    types.ts
    profile.ts
    experience.ts
    projects.ts
    education.ts
    conferences.ts
    skills.ts
  components/
    common/
    seo/
  styles/
  utils/
  assets/
```

Rules:
- Each `feature/*` owns its route component + subcomponents.
- Shared primitives go in `components/common`.

## 3) UI requirements
- Responsive, mobile-first.
- Accessibility: semantic HTML, focus states, proper headings.
- SEO: `<title>`, meta description, Open Graph tags.
- Performance: route-level code splitting.

## 4) Pages and components
### Home
- Hero: name, role, short bio.
- CTAs: Experience / Projects / Contact.
- Highlights: 3 cards.

### Experience
- Timeline component.
- Each role: company, title, dates, bullets, tech.

### Projects
- Grid/list.
- Detail page by slug: problem, approach, stack, screenshots, links.

### Education
- List; include certifications if relevant.

### Conferences
- Attended/presented; link to slides/videos.

### Skills
- Categorized skills + badges.

### Contact
- Frontend-only: `mailto:` + LinkedIn + other social links.

## 5) Content model (typed)
Create types in `src/content/types.ts`.
- `Profile`
- `ExperienceItem`
- `Project`
- `EducationItem`
- `ConferenceItem`
- `SkillGroup`

## 6) Routing & code-splitting
- Lazy-load route modules.
- Shared `AppLayout` with header/nav/footer.

## 7) Blog implementation (v1)
No CMS. Keep it simple:
- Posts as Markdown: `src/content/blog/*.md`
- Load with `import.meta.glob('/src/content/blog/*.md', { as: 'raw', eager: true })`
- Parse frontmatter: `gray-matter`
- Render Markdown: `react-markdown`

Frontmatter fields:
- `title` (string)
- `date` (ISO string)
- `tags` (array)
- `excerpt` (string)
- `slug` (string)

Routes:
- `/blog` list
- `/blog/:slug` post

## 8) PDF CV generation (v1)
Generate a downloadable PDF from the same content.
- Use `@react-pdf/renderer`.
- Provide a `/cv` page with a download button.
- Keep layout ATS-friendly.

## 9) Testing scope
- Router smoke test.
- Blog list renders posts.
- Project detail page renders by slug.

## 10) Quality gates
- `pnpm lint` / `pnpm format`
- `pnpm test`
- `pnpm build`

---

## Claude Code prompt (frontend)
> **Prompt**: Implement the frontend described in `02_FRONTEND_REACT.md`.

Deliverables:
1. Routes: `/`, `/about`, `/experience`, `/projects`, `/projects/:slug`, `/education`, `/conferences`, `/skills`, `/blog`, `/blog/:slug`, `/contact`, `/cv`.
2. Typed content modules under `src/content/` with placeholder data.
3. Blog posts in Markdown with frontmatter + list/detail pages.
4. A clean layout with header nav + footer, responsive.
5. Basic SEO helper per page.
6. PDF CV generation via `@react-pdf/renderer`.

Constraints:
- Minimal comments.
- Use route-level code splitting.
- Keep UI clean/minimal.
