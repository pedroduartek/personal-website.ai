import { getExperience } from '../utils/experience'
import type { Project } from './types'

function getProjects(): Project[] {
  const experience = getExperience()

  return [
    {
      slug: 'personal-website',
      title: 'AI-Assisted Personal Website',
      description:
        'The portfolio you are browsing right now: a content-driven personal website built through AI-assisted development, with an AI chat assistant, fast navigation, and interactive ways to explore my background.',
      problem: `I wanted a portfolio that did more than list technologies. It needed to explain my experience clearly to recruiters, feel like a real product, and give me a practical way to learn modern frontend development. As a backend engineer with ${experience.text} of C#/.NET experience, I also wanted to test how far AI-assisted development could accelerate the learning curve without lowering quality.`,
      approach:
        'I built the site as an ongoing product rather than a one-off landing page. Recurring career information is centralized so the content stays consistent as it evolves, while each page keeps its own voice. On top of the core portfolio experience, I added an AI assistant, command palette, terminal experience, and direct contact flows to make the site both useful and memorable. AI helped me iterate quickly, but I kept ownership of the design choices, architecture, copy, and quality bar.',
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
      featured: true,
      startDate: '2026-02',
    },
    {
      slug: 'home-assistant',
      title: 'Home Assistant: Local-First Smart Home',
      description:
        'Self-hosted smart home platform built around Home Assistant and 50+ Zigbee devices, with a focus on reliability, local control, and everyday usability.',
      problem:
        'I wanted to make day-to-day life at home smoother without depending on the internet or building something only I could operate. The system needed to be reliable enough for everyday routines, simple enough for non-technical users, and flexible enough to keep evolving as I learned.',
      approach:
        'I built the setup around Home Assistant OS, Zigbee, and a growing set of practical automations for comfort, energy awareness, and household routines. I treated the house like a production environment: strengthening the mesh, keeping backups and weekly updates in place, and testing changes against a simple rule - if they add complexity without improving everyday life, they do not stay.',
      technologies: [
        'Home Assistant OS',
        'Zigbee (ZHA)',
        'SkyConnect Coordinator',
        'Nabu Casa',
        'Grafana',
        'IoT Automation',
      ],
      featured: true,
      startDate: '2023-09',
    },
    {
      slug: 'ai-chat-api',
      title: 'AI Chat API',
      description:
        'Self-hosted backend that powers the conversational assistant and email delivery for pedroduartek.com, using Ollama and a local knowledge base to keep responses grounded.',
      problem:
        'I wanted the website assistant to answer from my real background, not from generic model guesses, while keeping cost, privacy, and operational control in my own hands. That meant building a focused backend I could run myself, understand end to end, and extend as the website needed more backend capability.',
      approach:
        'I built a compact ASP.NET Core API around a local Llama model via Ollama, a structured knowledge base, and guardrails that favor reliable answers over impressive but risky ones. On top of chat itself, I added streaming responses, email delivery, health checks, rate limiting, structured logging, containerized deployment, and keep-warm behavior so the service is practical for a real public website rather than just a prototype.',
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
      featured: true,
      startDate: '2026-02',
    },
  ]
}

export const projects = getProjects()
