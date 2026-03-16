import { getExperience } from '../utils/experience'
import type { Profile } from './types'

function getProfile(): Profile {
  const experience = getExperience()
  return {
    name: 'Pedro Duarte',
    role: 'Senior Software Engineer',
    bio: `Senior Software Engineer with ${experience.text} of experience designing and evolving backend platforms in C#/.NET, microservices, and event-driven systems. My work has centered on system design, delivery, production reliability, and mentoring junior and mid-level engineers. I am particularly interested in developer productivity, automation, and practical AI-assisted development.`,
    email: 'pedroduartek@gmail.com',
    linkedin: 'https://www.linkedin.com/in/pedroduartek/',
    linkedinHandle: 'pedroduartek',
    github: 'https://github.com/pedroduartek',
    githubHandle: 'pedroduartek',
    location: 'Lisbon, Portugal',
  }
}

export const profile = getProfile()
