# Personal Website AI

Frontend for pedroduartek.com. This repository is a `pnpm` workspace that
currently contains a single Vite/React application in `apps/web`. It renders
the portfolio, terminal-style navigation, CV, project detail pages, and the
chat entry point backed by `ai-chat-api`.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Vitest + Testing Library
- Biome

## Local development

Prerequisites: Node.js and `pnpm`.

```bash
pnpm install
pnpm dev
```

Run only the website app:

```bash
pnpm --filter @personal-website/web dev
```

## Repository layout

```text
personal-website-ai/
├── apps/web/            # frontend app
│   ├── src/features/    # route-level pages
│   ├── src/components/  # shared UI
│   ├── src/content/     # structured site data
│   ├── src/hooks/       # reusable hooks
│   ├── src/utils/       # non-UI helpers
│   └── src/test/        # Vitest + Testing Library
├── docs/                # project notes
└── scripts/             # workspace helpers
```

## Quality gates

Primary local checks:

```bash
pnpm -r check
pnpm -r test
pnpm --filter @personal-website/web test -- --coverage
pnpm -r build
```

CI also runs a workspace dependency audit and fails on high or critical
vulnerabilities.

## License

Proprietary. All rights reserved. See [LICENSE](LICENSE).
