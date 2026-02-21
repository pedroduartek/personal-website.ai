# GitHub Actions & Automation

This project uses GitHub Actions for continuous integration, quality assurance, and automation.

## Active Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)
**Triggers:** On every push and pull request to `main`

**What it does:**
- ✅ Runs Biome linting and formatting checks
- ✅ Executes all Vitest unit tests
- ✅ Generates test coverage reports (uploads to Codecov)
- ✅ Builds the production bundle
- ✅ Ensures code quality before merging

**Why it matters:** Catches bugs and style issues early, ensures consistent code quality.

---

### 2. Lighthouse CI (`.github/workflows/lighthouse.yml`)
**Triggers:** On every push and pull request to `main`

**What it does:**
- 🚀 Tests performance on 7 key pages (Home, About, Experience, Projects, Education, Skills, Contact)
- 📊 Measures Core Web Vitals (LCP, FID, CLS)
- ♿ Validates accessibility (WCAG compliance)
- 🔍 Checks SEO best practices
- 📈 Requires minimum 90% score on all categories

**Why it matters:** Shows recruiters you care about user experience and web standards. Performance impacts SEO and user retention.

**View reports:** Results are published to temporary public storage and commented on PRs.

---

### 3. Bundle Size Tracking (`.github/workflows/bundle-size.yml`)
**Triggers:** On every push and pull request to `main`

**What it does:**
- 📦 Analyzes JavaScript bundle size after build
- 📉 Comments on PRs showing size differences
- ⚠️ Alerts if bundle exceeds limits:
  - JavaScript: 250 KB
  - CSS: 50 KB

**Why it matters:** Prevents accidental bloat, keeps site fast for mobile users. Shows understanding of performance optimization.

**Configuration:** See `size-limit` section in `apps/web/package.json`

---

### 4. Dependabot (`.github/dependabot.yml`)
**Triggers:** Weekly on Monday mornings

**What it does:**
- 🔄 Automatically checks for dependency updates (npm packages + GitHub Actions)
- 🔐 Identifies security vulnerabilities
- 📝 Opens PRs with grouped updates (minor/patch together)
- 🏷️ Auto-labels PRs as "dependencies" and "automated"

**Why it matters:** Keeps dependencies secure and up-to-date without manual effort. Shows maintenance awareness.

**Configuration:**
- Groups development dependencies together
- Groups production dependencies together
- Requires your review before merging

---

## Local Commands

Run these locally before pushing to catch issues early:

```bash
# Run all checks (linting, formatting)
pnpm check

# Run tests
pnpm test

# Run tests with coverage
pnpm test -- --coverage

# Check bundle size
pnpm size

# Build production bundle
pnpm build
```

## Viewing Results

- **CI Status:** Check the Actions tab on GitHub
- **Lighthouse Reports:** View linked reports in PR comments
- **Bundle Size:** See size comparisons in PR comments
- **Dependabot PRs:** Review in Pull Requests tab

## Future Enhancements

Consider adding:
- Visual regression testing (screenshot comparison)
- E2E tests with Playwright
- Automated deployment previews on PRs
- Performance budgets per page
