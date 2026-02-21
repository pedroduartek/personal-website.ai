import type { SkillGroup } from './types'

export const skills: SkillGroup[] = [
  {
    category: 'Backend',
    skills: [
      { name: 'C#', level: 'expert' },
      { name: '.NET 6–10', level: 'expert' },
      { name: 'ASP.NET Core', level: 'expert' },
      { name: 'Microservices architecture', level: 'expert' },
      { name: 'REST APIs', level: 'expert' },
      { name: 'Event-driven systems', level: 'advanced' },
      { name: 'Domain-driven design', level: 'advanced' },
    ],
  },
  {
    category: 'Data & Messaging',
    skills: [
      { name: 'Kafka', level: 'expert' },
      { name: 'SQL Server', level: 'expert' },
      { name: 'PostgreSQL', level: 'expert' },
      { name: 'Elasticsearch', level: 'advanced' },
      { name: 'Redis', level: 'advanced' },
      { name: 'NoSQL data modelling', level: 'advanced' },
      { name: 'High-volume indexing & query optimization', level: 'advanced' },
    ],
  },
  {
    category: 'Infrastructure & DevOps',
    skills: [
      { name: 'Docker', level: 'expert' },
      { name: 'Kubernetes', level: 'advanced' },
      { name: 'Azure DevOps Pipelines', level: 'expert' },
      { name: 'Cloud-ready architectures', level: 'advanced' },
      { name: 'CI/CD', level: 'expert' },
    ],
  },
  {
    category: 'Architecture & Leadership',
    skills: [
      { name: 'Tech Lead experience', level: 'expert' },
      { name: 'System design for scalable services', level: 'expert' },
      { name: 'Production reliability', level: 'expert' },
      { name: 'Security & vulnerability management', level: 'expert' },
    ],
  },
  {
    category: 'Automation & IoT',
    skills: [
      { name: 'Home Assistant', level: 'expert' },
      { name: 'Zigbee network integration', level: 'advanced' },
      { name: 'Automation design and monitoring', level: 'advanced' },
    ],
  },
  {
    category: 'Modern AI Tools',
    skills: [
      { name: 'GitHub Copilot', level: 'advanced' },
      { name: 'Agentic coding tools', level: 'advanced' },
    ],
  },
]
