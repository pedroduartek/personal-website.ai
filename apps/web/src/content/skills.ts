import type { SkillGroup } from './types'

export const skills: SkillGroup[] = [
  {
    category: 'Frontend',
    skills: [
      { name: 'React', level: 'expert' },
      { name: 'TypeScript', level: 'expert' },
      { name: 'JavaScript', level: 'expert' },
      { name: 'HTML/CSS', level: 'expert' },
      { name: 'Tailwind CSS', level: 'advanced' },
      { name: 'Next.js', level: 'advanced' },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js', level: 'expert' },
      { name: 'Express', level: 'advanced' },
      { name: '.NET', level: 'advanced' },
      { name: 'Python', level: 'intermediate' },
      { name: 'GraphQL', level: 'intermediate' },
    ],
  },
  {
    category: 'Database',
    skills: [
      { name: 'PostgreSQL', level: 'advanced' },
      { name: 'MongoDB', level: 'advanced' },
      { name: 'Redis', level: 'intermediate' },
      { name: 'SQL Server', level: 'intermediate' },
    ],
  },
  {
    category: 'DevOps & Tools',
    skills: [
      { name: 'Docker', level: 'advanced' },
      { name: 'Kubernetes', level: 'intermediate' },
      { name: 'Git', level: 'expert' },
      { name: 'CI/CD', level: 'advanced' },
      { name: 'AWS', level: 'intermediate' },
      { name: 'Azure', level: 'intermediate' },
    ],
  },
]
