import type { SkillGroup } from './types'

export const skills: SkillGroup[] = [
  {
    category: 'Backend',
    skills: [
      { name: 'C#', startDate: '2020-03-01' },
      { name: '.NET 6–10', startDate: '2020-03-01' },
      { name: 'REST APIs', startDate: '2020-03-01' },
      { name: 'ASP.NET Core', startDate: '2021-03-01' },
      { name: 'Microservices architecture', startDate: '2021-03-01' },
      { name: 'Event-driven systems', startDate: '2022-03-01' },
      { name: 'Domain-driven design', startDate: '2022-03-01' },
    ],
  },
  {
    category: 'Data & Messaging',
    skills: [
      { name: 'SQL Server', startDate: '2020-03-01' },
      { name: 'Kafka', startDate: '2022-03-01' },
      { name: 'PostgreSQL', startDate: '2023-03-01' },
      { name: 'Elasticsearch', startDate: '2023-03-01' },
      { name: 'Redis', startDate: '2023-03-01' },
    ],
  },
  {
    category: 'Infrastructure & DevOps',
    skills: [
      { name: 'Docker', startDate: '2021-03-01' },
      { name: 'Kubernetes', startDate: '2023-03-01' },
      { name: 'Azure DevOps Pipelines', startDate: '2023-03-01' },
    ],
  },
  {
    category: 'Other',
    skills: [
      { name: 'Tech Lead experience', startDate: '2023-03-01' },
      { name: 'Home Assistant', startDate: '2021-09-01' },
      { name: 'Zigbee', startDate: '2021-09-01' },
      { name: 'GitHub Copilot', startDate: '2024-03-01' },
    ],
  },
]
