import type { Profile } from './types'
import { getExperience } from '../utils/experience'

function getProfile(): Profile {
  const experience = getExperience()
  return {
    name: 'Pedro Duarte',
    role: 'Senior Software Engineer',
    bio: `Senior Software Engineer with ${experience.text} of experience building scalable platforms in C#/.NET (8+), microservices, and event-driven architectures with Kafka. Proven track record as a Tech Lead, owning system design, delivery, and production reliability across SQL and NoSQL data stores. Passionate about developer productivity and automation, including running a self-hosted Home Assistant environment with 50+ Zigbee devices and custom automations.`,
    email: 'pedroduartek@gmail.com',
    linkedin: 'https://www.linkedin.com/in/pedroduartek/',
    github: 'https://github.com/pedroduartek',
    location: 'Lisbon, Portugal',
  }
}

export const profile = getProfile()
