import { getExperience } from '../utils/experience'
import type { Project } from './types'

function getProjects(): Project[] {
  const experience = getExperience()

  return [
    {
      slug: 'personal-website',
      title: 'AI-Assisted Personal Website',
      description:
        'Modern portfolio website built using AI-assisted development, featuring an integrated chatbot powered by a self-hosted Llama 3 model',
      problem: `As a backend engineer with ${experience.text} of C#/.NET experience but minimal frontend knowledge, I wanted to build a professional portfolio while learning modern frontend development. Traditional learning approaches would take months, and I wanted to experiment with AI as a productivity multiplier.`,
      approach:
        'Used AI-assisted development to build a production-ready React + TypeScript website from scratch. Integrated a self-hosted AI chatbot (via the AI Chat API project) that lets visitors ask questions about my background. Focused on learning by doing while maintaining full ownership of architectural decisions.',
      technologies: [
        'React 18',
        'TypeScript 5',
        'Vite',
        'Tailwind CSS',
        'React Router',
        'Vitest',
        'AI-Assisted',
      ],
      featured: true,
      startDate: '2026-02',
    },
    {
      slug: 'home-assistant',
      title: 'Home Assistant: Local-First Smart Home',
      description:
        'Self-hosted Home Assistant OS setup with 50+ Zigbee devices for automation, energy awareness, and comfort optimization',
      problem:
        'Wanted to improve day-to-day comfort and reduce friction at home while maintaining a local-first approach that works without internet. Needed a system simple enough for non-technical users while being powerful enough for complex automations.',
      approach:
        'Built a robust Zigbee mesh network using Home Assistant OS with ZHA coordinator and 50+ devices. Focused on reliability through strategic placement of routing devices and weekly updates. Designed automations as event-driven systems with location-based routines, energy monitoring, and security integrations.',
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
        'A self-hosted conversational AI API built with C#/.NET 10 that powers the chat assistant on pedroduartek.com using a locally-running Llama 3 model via Ollama',
      problem:
        'Relying on third-party AI services introduces costs, rate limits, and data-privacy trade-offs. I wanted full ownership of the inference pipeline, shipping a production-grade API that runs entirely on a single VPS with the model included.',
      approach:
        'Built a clean, layered ASP.NET Core API that connects to Llama 3 via Ollama, augments every prompt with a curated knowledge base about my background, and returns grounded answers. Implemented streaming via SSE, retry policies with Polly, IP-based rate limiting, and a full Docker Compose production stack with Caddy for automatic HTTPS. Added observability with structured logging and cloud monitoring to provide clear insights into API usage and performance.',
      technologies: [
        'C#',
        '.NET 10',
        'Llama 3.2',
        'Ollama',
        'Docker',
        'Caddy',
        'Polly',
        'Serilog',
        'xUnit',
        'Swagger',
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
