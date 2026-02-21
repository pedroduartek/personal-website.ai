# Personal Website

A modern personal website built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **Linting/Formatting**: Biome
- **Package Manager**: pnpm

## Project Structure

```
personal-website/
├── apps/
│   ├── web/          # React frontend application
│   └── api/          # Reserved for optional backend (post-beta)
├── infra/
│   └── docker/       # Reserved for infrastructure (post-beta)
├── docs/
│   └── plan/         # Project planning documents
└── .github/
    └── workflows/    # GitHub Actions CI/CD
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
```

### Lint & Format

```bash
pnpm check
pnpm lint
pnpm format
```

## Scripts

All scripts can be run from the root and will execute across all workspace packages:

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm check` - Run Biome checks (lint + format)
- `pnpm lint` - Lint code
- `pnpm format` - Format code

## Development Workflow

- `main` branch is always deployable
- Feature branches: `feat/<name>`
- Bug fixes: `fix/<name>`
- Use PRs for all changes

## License

Private
