import type { ExperienceItem } from './types'

export const experience: ExperienceItem[] = [
  {
    id: '1',
    company: 'Tech Company',
    title: 'Senior Software Engineer',
    startDate: '2022-01',
    location: 'Remote',
    description: [
      'Led development of microservices architecture serving millions of users',
      'Mentored junior developers and conducted code reviews',
      'Improved system performance by 40% through optimization',
    ],
    technologies: [
      'TypeScript',
      'React',
      'Node.js',
      'PostgreSQL',
      'Docker',
      'Kubernetes',
    ],
  },
  {
    id: '2',
    company: 'Previous Company',
    title: 'Software Engineer',
    startDate: '2020-06',
    endDate: '2021-12',
    location: 'City, Country',
    description: [
      'Developed and maintained web applications using React and .NET',
      'Collaborated with cross-functional teams on product features',
      'Implemented CI/CD pipelines and automated testing',
    ],
    technologies: ['React', 'C#', '.NET', 'SQL Server', 'Azure'],
  },
]
