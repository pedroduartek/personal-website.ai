export interface Profile {
  name: string
  role: string
  bio: string
  email: string
  linkedin: string
  linkedinHandle: string
  github?: string
  githubHandle?: string
  twitter?: string
  twitterHandle?: string
  location: string
}

export interface MediaAsset {
  src: string
  alt: string
  objectPosition?: string
}

export interface ExperienceItem {
  id: string
  company: string
  title: string
  startDate: string
  endDate?: string
  location: string
  description: string[]
  technologies: string[]
  logo?: string
}

export interface Project {
  slug: string
  title: string
  description: string
  problem: string
  approach: string
  technologies: string[]
  links?: {
    demo?: string
    github?: string
    article?: string
  }
  screenshots?: string[]
  featured: boolean
  startDate: string
  endDate?: string
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  location: string
  achievements?: string[]
  gpa?: string
  certificateUrl?: string
  certificateLabel?: string
  logo?: string
}

export interface ConferenceItem {
  id: string
  name: string
  type: 'Participant' | 'Presented' | 'Volunteer'
  date: string
  location: string
  title?: string
  description?: string
  logo?: string
  photos?: MediaAsset[]
  links?: {
    slides?: string
    video?: string
    website?: string
  }
}

export interface SkillGroup {
  category: string
  skills: Skill[]
}

export interface Skill {
  name: string
  startDate: string
}

export interface ContentCard {
  title: string
  content: string
}
