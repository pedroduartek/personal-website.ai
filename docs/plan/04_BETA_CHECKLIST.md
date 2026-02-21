# 04 — Beta checklist (definition of done)

Beta means: the foundation is solid, content is present, and it’s safe to deploy.

## 1) Functionality
- [ ] All routes work without errors
- [ ] Navigation works on mobile and desktop
- [ ] Projects have detail pages
- [ ] Blog list + blog post pages work
- [ ] Contact has mailto + LinkedIn link
- [ ] PDF CV download works

## 2) Content completeness
- [ ] About filled
- [ ] Experience filled with meaningful bullets
- [ ] Projects have at least 3 entries
- [ ] Education filled
- [ ] Conferences filled (or explicitly omitted)
- [ ] Skills filled
- [ ] At least 2 blog posts exist

## 3) Quality
- [ ] Lint passes
- [ ] Tests pass
- [ ] Build passes
- [ ] No console errors

## 4) Accessibility
- [ ] Keyboard navigation works
- [ ] Visible focus states
- [ ] Proper heading hierarchy

## 5) Performance
- [ ] Route-based code splitting enabled
- [ ] No obvious bundle bloat

## 6) Security & privacy
- [ ] No secrets in repo
- [ ] No phone/address shown publicly

## 7) GitHub hygiene
- [ ] README describes features + stack + how to run locally
- [ ] CI running on PRs

---

## Claude Code prompt (beta gate)
> **Prompt**: Audit the repo against `04_BETA_CHECKLIST.md`. Create tasks to close gaps. Do not do deployment work.
