import { getExperience } from '../utils/experience'
import type { Project } from './types'

function getProjects(): Project[] {
  const experience = getExperience()

  return [
    {
      slug: 'personal-website',
      title: 'AI-Assisted Personal Website',
      description:
        'Modern portfolio website built using AI-assisted development as a backend engineer learning frontend technologies',
      problem: `As a backend engineer with ${experience.text} of C#/.NET experience but minimal frontend knowledge, I wanted to build a professional portfolio website while learning modern frontend development. Traditional learning approaches would take months, and I wanted to experiment with AI as a productivity multiplier.`,
      approach:
        'Used AI-assisted development tools to build a production-ready React + TypeScript website from scratch. Leveraged AI for code generation, best practices, and real-time problem-solving while maintaining full ownership of architectural decisions. Focused on learning by doing: implementing features, understanding the patterns, and iterating based on AI guidance.',
      technologies: [
        'React 18.3',
        'TypeScript 5.7',
        'Vite 6.0',
        'Tailwind CSS 3.4',
        'React Router 6.28',
        'Biome 1.9',
        'Vitest 2.1',
        'pnpm',
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
        'A lightweight C#/.NET 10 API for conversational AI integrations',
      problem:
        'Needed a minimal, production-ready backend to power chat-style AI integrations with clear patterns for testing, containerization, and extensibility across model providers.',
      approach:
        'Implemented a small, well-structured ASP.NET Core API with typed request/response models, service abstractions for model providers, health checks, and CI-friendly patterns. Focused on testability, container-based local development, and clear HTTP semantics for clients.',
      technologies: ['C#', '.NET 10', 'Llama 3', 'Docker', 'REST API'],
      links: {
        github: 'https://github.com/pedroduartek/ai-chat-api',
      },
      featured: true,
      startDate: '2026-02',
    },
  ]
}

export const projects = getProjects()
