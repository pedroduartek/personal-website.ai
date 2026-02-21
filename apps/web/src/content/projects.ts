import type { Project } from './types'

export const projects: Project[] = [
  {
    slug: 'project-management-tool',
    title: 'Project Management Tool',
    description:
      'A modern project management application with real-time collaboration features',
    problem:
      'Teams needed a lightweight, intuitive tool for managing projects without the overhead of enterprise solutions',
    approach:
      'Built a React-based SPA with real-time updates using WebSockets, focusing on simplicity and speed',
    technologies: ['React', 'TypeScript', 'Node.js', 'WebSocket', 'MongoDB'],
    links: {
      demo: 'https://demo.example.com',
      github: 'https://github.com/yourusername/project',
    },
    featured: true,
    startDate: '2023-01',
    endDate: '2023-06',
  },
  {
    slug: 'data-visualization-dashboard',
    title: 'Data Visualization Dashboard',
    description:
      'Interactive dashboard for analyzing and visualizing large datasets',
    problem:
      'Stakeholders struggled to interpret raw data and needed actionable insights',
    approach:
      'Created an interactive dashboard with customizable charts and real-time data processing',
    technologies: ['React', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL'],
    featured: true,
    startDate: '2022-08',
    endDate: '2022-12',
  },
  {
    slug: 'mobile-app-backend',
    title: 'Mobile App Backend API',
    description: 'RESTful API serving a mobile application with 100k+ users',
    problem: 'Needed a scalable, secure backend for mobile app',
    approach:
      'Designed and implemented a microservices architecture with proper authentication and caching',
    technologies: ['Node.js', 'Express', 'Redis', 'PostgreSQL', 'AWS'],
    featured: false,
    startDate: '2021-03',
    endDate: '2021-09',
  },
]
