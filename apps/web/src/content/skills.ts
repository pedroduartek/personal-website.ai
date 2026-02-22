import type { SkillGroup } from './types'

export const skills: SkillGroup[] = [
  {
    category: 'Backend',
    skills: [
      { name: 'C#', years: '6 years' },
      { name: '.NET 6–10', years: '6 years' },
      { name: 'REST APIs', years: '6 years' },
      { name: 'ASP.NET Core', years: '5 years' },
      { name: 'Microservices architecture', years: '5 years' },
      { name: 'Event-driven systems', years: '4 years' },
      { name: 'Domain-driven design', years: '4 years' },
    ],
  },
  {
    category: 'Data & Messaging',
    skills: [
      { name: 'SQL Server', years: '6 years' },
      { name: 'Kafka', years: '4 years' },
      { name: 'PostgreSQL', years: '3 years' },
      { name: 'Elasticsearch', years: '3 years' },
      { name: 'Redis', years: '3 years' },
    ],
  },
  {
    category: 'Infrastructure & DevOps',
    skills: [
      { name: 'Docker', years: '5 years' },
      { name: 'Kubernetes', years: '3 years' },
      { name: 'Azure DevOps Pipelines', years: '3 years' },
    ],
  },
  {
    category: 'Other',
    skills: [
      { name: 'Tech Lead experience', years: '3 years' },
      { name: 'Home Assistant', years: '4 years' },
      { name: 'Zigbee', years: '4 years' },
      { name: 'GitHub Copilot', years: '2 years' },
    ],
  },
]
