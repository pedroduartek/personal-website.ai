# 05 — Deployment (ONLY after beta)

Do not deploy until `04_BETA_CHECKLIST.md` is satisfied.

## Chosen hosting target
- **Cloudflare Pages** (static hosting), connected to GitHub.

## 1) Deployment steps (Cloudflare Pages)
1. Create a Cloudflare Pages project linked to your GitHub repo.
2. Configure build:
   - Build command: `pnpm -r build`
   - Output directory: `apps/web/dist`
3. Configure SPA routing:
   - Add a `_redirects` or platform equivalent so all routes fall back to `/index.html`.
4. Set custom domain (when ready) and enable HTTPS.

## 2) GitHub Actions (optional)
Cloudflare Pages can build on push automatically. Optionally add:
- A workflow that runs CI on PRs (already in M0).
- A workflow that builds on `main` and optionally triggers Pages deployments (if you prefer action-driven deploys).

## 3) Environment variables
- None required for v1.

---

## Claude Code prompt (deployment)
> **Prompt**: Implement deployment automation described in `05_DEPLOYMENT_AFTER_BETA.md` for Cloudflare Pages. Only do this after beta is complete.
