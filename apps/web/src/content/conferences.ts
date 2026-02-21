import type { ConferenceItem } from './types'

export const conferences: ConferenceItem[] = [
  {
    id: '1',
    name: 'ReactConf 2025',
    type: 'presented',
    date: '2025-10',
    location: 'San Francisco, CA',
    title: 'Building Scalable React Applications',
    description:
      'Presented best practices for building and maintaining large-scale React applications',
    links: {
      slides: 'https://slides.example.com/reactconf-2025',
      video: 'https://youtube.com/watch?v=example',
    },
  },
  {
    id: '2',
    name: 'TypeScript Summit 2024',
    type: 'attended',
    date: '2024-09',
    location: 'Remote',
    description:
      'Attended talks on advanced TypeScript patterns and best practices',
  },
  {
    id: '3',
    name: 'Local Tech Meetup',
    type: 'organized',
    date: '2024-06',
    location: 'Your City',
    title: 'Monthly React Developers Meetup',
    description:
      'Organized monthly meetups for local React developers to share knowledge and network',
  },
]
