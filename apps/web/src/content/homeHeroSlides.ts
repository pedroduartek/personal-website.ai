import type { ProjectHeroContent } from './types'

export type HomeHeroFeatureSlide = {
  slug: string
  title: string
  technologies: string[]
  href: string
  customMedia: 'terminal' | 'chat'
  desktopOnly?: boolean
  opensChatWidget?: boolean
  homeHero: ProjectHeroContent
  preview: {
    label: string
    title: string
    status: string
    lines: string[]
    footer: string
  }
}

export const terminalHeroSlide: HomeHeroFeatureSlide = {
  slug: 'terminal',
  title: 'Terminal Shell',
  technologies: ['React 19', 'TypeScript 5'],
  href: '/terminal',
  customMedia: 'terminal',
  desktopOnly: true,
  homeHero: {
    eyebrow: 'Desktop-only experience',
    summary:
      'A terminal-style route for navigating the site, exploring background details, and interacting with the portfolio through a focused command-driven UI.',
    media: {
      src: '',
      alt: 'Terminal interface preview',
      fit: 'contain',
    },
  },
  preview: {
    label: 'Terminal Shell',
    title: 'terminal - pedroduartek',
    status: 'live',
    lines: [
      'help',
      'about  experience  projects  contact',
      'email',
      'Turnstile-verified message flow ready.',
    ],
    footer: 'keyboard-first shell for desktop visitors',
  },
}

export const aiChatHeroSlide: HomeHeroFeatureSlide = {
  slug: 'ai-chat-feature',
  title: 'AI Chat Assistant',
  technologies: ['.NET 10', 'Ollama'],
  href: '/projects/personal-website',
  customMedia: 'chat',
  opensChatWidget: true,
  homeHero: {
    eyebrow: 'Interactive site feature',
    summary:
      'A built-in assistant that lets visitors ask natural-language questions about experience, projects, and skills without digging through the whole site manually.',
    media: {
      src: '',
      alt: 'AI chat assistant preview',
      fit: 'contain',
    },
  },
  preview: {
    label: 'AI assistant',
    title: "Ask about Pedro's background",
    status: 'live',
    lines: [
      'What skills does pedro have?',
      'Backend: C#, .NET 6-10, REST APIs, ASP.NET Core, microservices, event-driven systems, and domain-driven design.',
      'Data and platform: SQL Server, Kafka, PostgreSQL, Elasticsearch, Redis, Docker, Kubernetes, Azure DevOps, plus Home Assistant and Zigbee.',
    ],
    footer:
      'grounded answers, route-aware links, and Turnstile-protected contact flows',
  },
}
