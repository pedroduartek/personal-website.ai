import duartekScreenshot from '../images/duartek.webp'
import haScreenshot from '../images/ha.webp'
import ollamaSlidePreview from '../images/ollama_slide.webp'
import { getExperience } from '../utils/experience'
import type { Project } from './types'

function getProjects(): Project[] {
  const experience = getExperience()

  return [
    {
      slug: 'duartek',
      title: 'DUARTEK Website',
      description:
        'Public-facing website for DUARTEK, my local-first smart-home service built on Home Assistant. A fast, content-driven React site that presents the single-app value, the brands it can integrate, and how the service works, backed by a full CI/CD pipeline.',
      problem:
        'DUARTEK needed a site that could explain a genuinely different idea, a local-first smart home that unifies the devices people already own into one app, to non-technical homeowners, and do it in seconds without the generic-template feel. The site is the front door to the service, so it had to build trust and make the value obvious fast.',
      approach:
        'I built it as a content-driven React 19, TypeScript, and Vite single-page app on Vercel. The copy, pricing, FAQ, and brand list live in structured content files; the brand wall serves resized WebP logos, lazy-loaded and deliberately kept out of the JS bundle; and Open Graph metadata plus a generated share image handle link previews. Everything is gated by CI (lint, tests, dependency audit, bundle size, and Lighthouse budgets), and a set of Python scripts generates the brand, favicon, social image, and print-ready flyers so every surface stays consistent.',
      technologies: [
        'React 19',
        'TypeScript',
        'Vite',
        'Tailwind CSS',
        'React Router',
        'Vitest',
        'Biome',
        'Vercel',
      ],
      links: {
        demo: 'https://www.duartek.pt',
      },
      homeHero: {
        eyebrow: 'Smart-home service website',
        summary:
          'The marketing site for a local-first smart-home service: a fast, content-driven React SPA with a performance-tuned brand wall, Open Graph, and full CI/CD.',
        media: {
          src: duartekScreenshot,
          alt: 'DUARTEK marketing website homepage',
          fit: 'cover',
          objectPosition: 'center top',
        },
      },
      featured: true,
      startDate: '2026-07',
    },
    {
      slug: 'personal-website',
      title: 'Personal Website',
      description:
        'The portfolio you are browsing right now: a content-driven personal website built through AI-assisted development, with an AI chat assistant, fast navigation, and interactive ways to explore my background.',
      problem: `I wanted a portfolio that did more than list technologies. It needed to explain my experience clearly to recruiters, feel like a real product, and give me a practical way to learn modern frontend development. As a backend engineer with ${experience.text} of C#/.NET experience, I also wanted to test how far AI-assisted development could accelerate the learning curve without lowering quality.`,
      approach:
        'I built the site as an ongoing product rather than a one-off landing page. Recurring career information is centralized so the content stays consistent as it evolves, while each page keeps its own voice. On top of the core portfolio experience, I added an AI assistant, command palette, terminal experience, and direct contact flows protected with Cloudflare Turnstile to make the site both useful and memorable. AI helped me iterate quickly, but I kept ownership of the design choices, architecture, copy, and quality bar.',
      technologies: [
        'React 19',
        'TypeScript 5',
        'Vite',
        'Tailwind CSS',
        'React Router',
        'Vitest',
        'Biome',
      ],
      links: {
        github: 'https://github.com/pedroduartek/personal-website.ai',
      },
      homeHero: {
        eyebrow: 'AI-assisted product build',
        summary:
          'A content-driven portfolio that combines clear career storytelling with a chat assistant, command palette, and terminal-like exploration paths.',
        media: {
          src: '/pld_logo_header.webp',
          alt: 'Pedroduartek logo used as the visual mark for the personal website project',
          fit: 'contain',
          themeTreatment: 'header-logo',
        },
      },
      featured: true,
      startDate: '2026-02',
    },
    {
      slug: 'ourivesaria-rinchoa',
      title: 'Ourivesaria Rinchoa Website',
      description:
        "Public-facing website for my parents-in-law's jewelry and watch store, built to present in-store services, wedding rings, and contact details with clear Portuguese copy and strong local-business SEO.",
      problem:
        'The store needed a website that matched how the business actually works: a physical shop, personalized service, appointments for wedding rings and watch evaluations, and clear local contact details. Generic small-business templates tend to flatten that into stock sections and vague copy, so I wanted something more specific, easier to trust, and easier for local customers to use.',
      approach:
        'I built a focused React SPA around the main customer journeys: homepage, watch repair and maintenance, weddings, and contacts. Business details, route-level SEO metadata, and reusable copy live in centralized content files so the site stays consistent as details evolve. On top of that, I added lazy-loaded routes, an error boundary, responsive layouts, WebP image delivery, LocalBusiness structured data, and tests covering navigation, accessibility, and SEO behavior so the final site feels tailored rather than templated.',
      technologies: [
        'React 19',
        'TypeScript 5',
        'Vite',
        'Tailwind CSS 4',
        'React Router 7',
        'Vitest',
        'Vercel',
      ],
      links: {
        github: 'https://github.com/pedroduartek/ourivesaria-rinchoa',
        demo: 'https://ourivesariarinchoa.pt',
      },
      homeHero: {
        eyebrow: 'Local business website',
        summary:
          'A focused storefront site for a real jewelry and watch business, built around trust, wedding-ring appointments, service visibility, and local SEO.',
        media: {
          src: 'https://ourivesariarinchoa.pt/images/social-share.webp',
          alt: 'Social share image for the Ourivesaria Rinchoa website project',
          fit: 'cover',
          objectPosition: 'center top',
        },
      },
      featured: true,
      startDate: '2026-03',
    },
    {
      slug: 'home-assistant',
      title: 'Home Assistant: Local-First Smart Home',
      description:
        'My self-hosted Home Assistant setup: a local-first smart home that now spans 800+ entities across 14 rooms, with a room-first dashboard, solar and energy optimization, pool automation, AI cameras, and secure remote access, all favouring reliability over novelty.',
      problem:
        'I wanted a smart home that removed friction from everyday life without turning the house into a gadget demo that only I could understand. That meant local control where possible, dashboards the whole household can use, and automations, including the energy and solar layer, that earn their place through reliability rather than novelty.',
      approach:
        'It runs on Home Assistant OS with a large ZHA Zigbee network, mobile presence, and a Lovelace dashboard organized around rooms. Beyond lighting, covers, gates, climate, alarm and reminders, it now runs a solar and energy layer on a Deye inverter and battery, shifting high-draw appliances (pool pump, car charger, water heater) onto real solar surplus and tracking the savings; pool filtration and heating on that same surplus; Reolink cameras with AI detection; and secure remote access over a Cloudflare Tunnel (no open ports, 2FA, geo-block, rate limiting). The rule across every automation stays the same: if it adds complexity without clearly improving daily life, it does not stay.',
      technologies: [
        'Home Assistant OS',
        'Zigbee (ZHA)',
        'Reolink',
        'Cloudflare Tunnel',
        'Lovelace',
        'HACS',
      ],
      homeHero: {
        eyebrow: 'Smart home & energy',
        summary:
          'A self-hosted, local-first home across 800+ entities and 14 rooms: a room-first dashboard, solar and energy optimization on a Deye inverter and battery, pool automation, and AI cameras.',
        media: {
          src: haScreenshot,
          alt: 'Home Assistant dashboard screenshot',
          fit: 'cover',
        },
      },
      featured: true,
      startDate: '2023-09',
    },
    {
      slug: 'ai-chat-api',
      title: 'AI Chat API',
      description:
        'Self-hosted backend that powers the conversational assistant and Turnstile-protected email delivery for pedroduartek.com, using Ollama and a local knowledge base to keep responses grounded.',
      problem:
        'I wanted the website assistant to answer from my real background, not from generic model guesses, while keeping cost, privacy, and operational control in my own hands. That meant building a focused backend I could run myself, understand end to end, and extend as the website needed more backend capability.',
      approach:
        'I built a compact ASP.NET Core API around a local Llama model via Ollama, a structured knowledge base, and guardrails that favor reliable answers over impressive but risky ones. On top of chat itself, I added streaming responses, Turnstile-verified email delivery, health checks, rate limiting, structured logging, containerized deployment, and keep-warm behavior so the service is practical for a real public website rather than just a prototype.',
      technologies: [
        'C#',
        '.NET 10',
        'Ollama',
        'Llama 3.2',
        'ASP.NET Core',
        'Docker Compose',
        'Caddy',
        'Polly',
        'Serilog',
        'MailKit',
        'xUnit',
      ],
      links: {
        github: 'https://github.com/pedroduartek/ai-chat-api',
      },
      homeHero: {
        eyebrow: 'Self-hosted AI backend',
        summary:
          'An ASP.NET Core API that keeps responses grounded with a local knowledge base, streams answers, and protects the contact flow with Turnstile verification.',
        media: {
          src: ollamaSlidePreview,
          alt: 'Screenshot of the Ollama AI Chat API slide on the website',
          fit: 'cover',
          objectPosition: 'center',
        },
      },
      featured: true,
      startDate: '2026-02',
    },
    {
      slug: 'prod-monitor',
      title: 'Production Monitor',
      description:
        'A synthetic-monitoring service that runs real end-to-end checks against all my production apps every day and emails a report: instantly when something breaks, and a weekly digest when everything is healthy.',
      problem:
        'I run several independent production apps (three public sites and a self-hosted API) and wanted to know they were actually working before a user told me otherwise, without paying for a monitoring SaaS or babysitting dashboards. The checks had to be real (a rendered page, a valid certificate, a live API) rather than a shallow ping, and the alerting had to stay quiet when all was well and be immediate when it was not.',
      approach:
        'I built it as a small .NET 10 console app, using Playwright for .NET, that GitHub Actions runs on a daily cron. It loads each site in a real browser and asserts it renders, verifies the Open Graph image resolves, checks that every TLS certificate still has at least two weeks of validity, and confirms the AI chat API is healthy indirectly through the chat launcher on the site, which only appears once the browser reaches the health endpoint. It then emails a report through the same Brevo account as the API (via MailKit): any failure alerts immediately and exits non-zero, while a passing run only emails once a week.',
      technologies: ['C#', '.NET 10', 'Playwright', 'MailKit', 'Brevo'],
      links: {
        github: 'https://github.com/pedroduartek/prod-monitor',
      },
      featured: false,
      startDate: '2026-07',
    },
  ]
}

export const projects = getProjects()
