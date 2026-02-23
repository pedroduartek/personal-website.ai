
# Personal Website

This is the source code for Pedro Duarte's personal website—a modern, fast, and accessible portfolio and blog built with React, TypeScript, and Tailwind CSS. The site showcases professional experience, projects, blog posts, skills, and a downloadable CV.

## 🌟 Features

- **Home:** Quick intro and highlights
- **Blog:** Technical articles written in Markdown
- **Projects:** Portfolio with detailed project pages and screenshots
- **Experience:** Professional timeline with roles, companies, and technologies
- **Education:** Academic background
- **Conferences:** Speaking engagements and event attendance
- **Skills:** Categorized technical skills
- **CV:** Downloadable PDF resume and in-browser preview
- **SEO:** Optimized for search engines and social sharing
- **Performance:** Fast, code-split, and optimized
- **Accessibility:** Keyboard navigation, semantic HTML, dark mode

## 🛠️ Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Markdown (react-markdown, gray-matter)
- PDF (react-pdf/renderer)
- Vitest + React Testing Library
- Biome (lint/format)
- pnpm (monorepo)
- Vercel (deployment & analytics)

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+

### Installation
Clone the repo and install dependencies:
```bash
pnpm install
```

### Development
Start the local dev server:
```bash
pnpm dev
```

### Build
Create a production build:
```bash
pnpm build
```

### Test
Run all tests:
```bash
pnpm test
```

### Lint & Format
```bash
pnpm check
pnpm lint
pnpm format
```

## 📁 Project Structure

```
personal-website/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # (Optional) backend
├── infra/            # Infrastructure (docker, etc)
├── docs/             # Planning & documentation
└── .github/          # GitHub Actions CI/CD
```

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

## 📄 License

Private
