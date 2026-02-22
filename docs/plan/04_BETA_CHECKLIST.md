# 04 — Beta checklist (definition of done)

Beta means: the foundation is solid, content is present, and it’s safe to deploy.

## 1) Functionality
- [x] All routes work without errors
- [x] Navigation works on mobile and desktop
- [x] Projects have detail pages
- [x] Blog list + blog post pages work
- [x] Contact has mailto + LinkedIn link
- [x] PDF CV download works

## 2) Content completeness
- [x] About filled
- [x] Experience filled with meaningful bullets
- [x] Projects have at least 3 entries
- [x] Education filled
- [x] Conferences filled (or explicitly omitted)
- [x] Skills filled
- [x] At least 2 blog posts exist

## 3) Quality
- [x] Lint passes
- [x] Tests pass
- [x] Build passes
- [x] No console errors

## 4) Accessibility
- [x] Keyboard navigation works
- [x] Visible focus states
- [x] Proper heading hierarchy

## 5) Performance
- [x] Route-based code splitting enabled
- [x] No obvious bundle bloat
- [x] Bundle size tracking implemented

## 6) Security & privacy
- [x] No secrets in repo
- [x] No phone/address shown publicly

## 7) GitHub hygiene
- [x] README describes features + stack + how to run locally
- [x] CI running on PRs

## 8) Additional features implemented
- [x] Error boundary for graceful error handling
- [x] Photo lightbox with zoom functionality
- [x] Dynamic skill years calculation
- [x] Vercel Analytics + Speed Insights integration
- [x] Lighthouse CI for performance monitoring

---

## Status: ✅ BETA COMPLETE

All core requirements met. Site is deployed and production-ready.

---

## Claude Code prompt (beta gate)
> **Prompt**: Audit the repo against `04_BETA_CHECKLIST.md`. Create tasks to close gaps. Do not do deployment work.
