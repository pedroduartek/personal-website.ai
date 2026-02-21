# 03 — Optional Backend (.NET 10) + Postgres (Post-beta)

v1 is **frontend-only**. If you later add a backend, use:
- **.NET 10** (Minimal API)
- **Postgres**
- Free libraries only (OSS)

## Suggested post-beta goals
- Contact form API (instead of mailto)
- Lightweight analytics (page views)
- Admin-only view (simple shared-secret auth)

## Structure (when needed)
`apps/api/`:

```
src/
  Api/
    Program.cs
    Endpoints/
    Persistence/
    Models/
  Api.Tests/
```

## Local dev (when needed)
- Add `infra/docker/docker-compose.yml` with Postgres.

---

## Claude Code prompt (post-beta backend)
> **Prompt**: Implement the optional backend described in `03_BACKEND_DOTNET10_OPTIONAL.md` only after beta is complete.

Constraints:
- Minimal comments.
- No secrets committed.
