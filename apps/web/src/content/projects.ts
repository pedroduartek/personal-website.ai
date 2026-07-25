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
      title: 'DUARTEK: Local-First Smart Homes',
      description:
        'A local-first smart-home product I built end to end: a React marketing site, a Home Assistant based automation platform with secure remote access, and the Python tooling that generates its brand, favicon, social image, and print assets. Engineered for reliability and privacy over cloud lock-in.',
      problem:
        'Taking a local-first smart home from a personal setup to something that runs reliably in other homes is an engineering problem more than a hardware one: a dependable Zigbee network, secure remote access with no open ports, automations driven by live solar and energy data, and a fast, well-built site to present it, all favouring reliability and privacy over cloud dependence.',
      approach:
        'The platform runs on Home Assistant OS with a ZHA Zigbee network and secure remote access through a Cloudflare Tunnel (no open ports, 2FA, geo-blocking, and rate limiting). Energy automations shift high-draw appliances onto real solar surplus using sensors derived from the inverter telemetry. The public site at duartek.pt is a React 19, TypeScript, and Vite SPA on Vercel, with a performance-tuned brand wall (optimized WebP, lazy-loaded, kept out of the JS bundle) and Open Graph metadata. A set of Python scripts generates the brand, favicon, social image, and print-ready flyers programmatically via headless Chrome.',
      technologies: [
        'Home Assistant OS',
        'Zigbee (ZHA)',
        'React 19',
        'TypeScript',
        'Vite',
        'Tailwind CSS',
        'Cloudflare Tunnel',
        'Python',
        'Vercel',
      ],
      links: {
        github: 'https://github.com/pedroduartek/duartek',
        demo: 'https://www.duartek.pt',
      },
      homeHero: {
        eyebrow: 'Full-stack product',
        summary:
          'A local-first smart-home product on Home Assistant: a React site on Vercel, secure remote access over Cloudflare Tunnel, and solar-driven energy automations.',
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
        'Self-hosted smart home platform built on Home Assistant, with local automations, a room-first dashboard, and a focus on reliability over novelty.',
      problem:
        'I wanted a smart home that removed friction from everyday life without turning the house into a gadget demo that only I could understand. That meant local control where possible, clear dashboards for non-technical users, and automations that had to earn their place through reliability rather than novelty.',
      approach:
        'I built the setup around Home Assistant OS, a ZHA-based Zigbee network, mobile presence, and a Lovelace dashboard customized for everyday use. It coordinates lighting, covers, gates, climate, alarm, cameras, and household reminders, with the same rule across every automation: if it adds complexity without clearly improving daily life, it does not stay.',
      technologies: [
        'Home Assistant OS',
        'Zigbee (ZHA)',
        'SkyConnect Coordinator',
        'Lovelace',
        'HACS',
        'Nabu Casa',
      ],
      homeHero: {
        eyebrow: 'Smart Home',
        summary:
          'A self-hosted dashboard and automation stack built around rooms, dependable state modeling, and local control instead of gadget-driven novelty.',
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
  ]
}

export const projects = getProjects()
