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
      { name: 'ArgoCD', startDate: '2023-03-01' },
      { name: 'Structurizr', startDate: '2026-01-01' },
    ],
  },
  {
    category: 'Testing',
    skills: [
      { name: 'xUnit', startDate: '2020-03-01' },
      { name: 'Stryker Mutator', startDate: '2025-01-01' },
      { name: 'Vitest', startDate: '2026-02-01' },
      { name: 'Playwright', startDate: '2026-07-01' },
    ],
  },
  {
    category: 'AI',
    skills: [
      { name: 'Claude', startDate: '2026-02-01' },
      { name: 'Codex', startDate: '2024-03-01' },
      { name: 'GitHub Copilot', startDate: '2024-03-01' },
      { name: 'Llama', startDate: '2026-02-01' },
    ],
  },
  {
    category: 'Other',
    skills: [
      { name: 'Tech Lead experience', startDate: '2023-03-01' },
      { name: 'Home Assistant', startDate: '2021-09-01' },
      { name: 'Zigbee', startDate: '2021-09-01' },
    ],
  },
]
