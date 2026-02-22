# 05 — Deployment (ONLY after beta)

Do not deploy until `04_BETA_CHECKLIST.md` is satisfied.

## Chosen hosting target
- **Vercel** (static hosting), connected to GitHub.

## 1) Deployment steps (Vercel)
1. Create a Vercel project linked to your GitHub repo.
2. Configure build:
   - Framework Preset: Vite
   - Build command: `pnpm -r build`
   - Output directory: `apps/web/dist`
3. Configure SPA routing:
   - Vercel handles this automatically with the rewrites in `vercel.json`.
4. Set custom domain (personal-website.ai / pedroduartek.com) and enable HTTPS.
5. Configure deployment settings:
   - Use `vercel.json` `git.deploymentEnabled` to control when deployments trigger

## 2) GitHub Actions
Vercel builds on push automatically. CI workflows run on PRs:
- Lint + format checks (Biome)
- Unit tests (Vitest)
- Build verification
- Lighthouse CI performance checks
- Bundle size tracking

## 3) Environment variables
- None required for v1.

---

## Claude Code prompt (deployment)
> **Prompt**: Implement deployment automation described in `05_DEPLOYMENT_AFTER_BETA.md` for Vercel. Only do this after beta is complete.
