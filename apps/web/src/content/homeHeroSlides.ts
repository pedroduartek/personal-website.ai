import commandPalettePreview from '../images/command_pallete.webp'
import type { ProjectHeroContent } from './types'

export type HomeHeroFeatureSlide = {
  slug: string
  title: string
  technologies: string[]
  href: string
  customMedia: 'terminal' | 'chat' | 'command'
  desktopOnly?: boolean
  opensChatWidget?: boolean
  opensCommandPalette?: boolean
  opensTerminalWindow?: boolean
  homeHero: ProjectHeroContent
  preview: {
    label: string
    title: string
    status: string
    lines: string[]
    footer: string
  }
}

export const commandPaletteHeroSlide: HomeHeroFeatureSlide = {
  slug: 'command-palette',
  title: 'Command Palette',
  technologies: ['React 19', 'TypeScript 5', 'React Router'],
  href: '/',
  customMedia: 'command',
  opensCommandPalette: true,
  homeHero: {
    eyebrow: 'Keyboard-first shortcut',
    summary:
      'A fast launcher for jumping to pages, opening the AI assistant, downloading the CV, and triggering quick site actions without breaking your flow.',
    media: {
      src: commandPalettePreview,
      alt: 'Screenshot of the command palette open on the website',
      fit: 'cover',
      objectPosition: 'center top',
    },
  },
  preview: {
    label: 'Command palette',
    title: 'Go anywhere or run a command',
    status: 'ready',
    lines: [
      'pro',
      'Projects  Browse featured builds and case studies',
      'Start AI Assistant Conversation  Open the site assistant',
      'Download CV  Save the latest PDF instantly',
    ],
    footer: 'press the shortcut to jump anywhere from the current page',
  },
}

export const terminalHeroSlide: HomeHeroFeatureSlide = {
  slug: 'terminal',
  title: 'Terminal Shell',
  technologies: ['React 19', 'TypeScript 5'],
  href: '/',
  customMedia: 'terminal',
  desktopOnly: true,
  opensTerminalWindow: true,
  homeHero: {
    eyebrow: 'Desktop-only experience',
    summary:
      'A floating terminal window you can open on top of any page to explore the site, inspect background details, and stay in your current context.',
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
