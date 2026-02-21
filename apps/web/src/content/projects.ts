import type { Project } from './types'

export const projects: Project[] = [
  {
    slug: 'home-assistant',
    title: 'Home Assistant: Local-First Smart Home',
    description:
      'Self-hosted Home Assistant OS setup with 50+ Zigbee devices for automation, energy awareness, and comfort optimization',
    problem:
      'Wanted to improve day-to-day comfort and reduce friction at home while maintaining a local-first approach that works without internet. Needed a system simple enough for non-technical users while being powerful enough for complex automations.',
    approach:
      'Built a robust Zigbee mesh network using Home Assistant OS with ZHA coordinator and 50+ devices. Focused on reliability through strategic placement of routing devices and weekly updates. Designed automations as event-driven systems with location-based routines, energy monitoring, and security integrations.',
    technologies: [
      'Home Assistant OS',
      'Zigbee (ZHA)',
      'SkyConnect Coordinator',
      'Nabu Casa',
      'Grafana',
      'IoT Automation',
    ],
    featured: true,
    startDate: '2023-09',
  },
]
