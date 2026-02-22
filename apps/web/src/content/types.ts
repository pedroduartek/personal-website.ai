export interface Profile {
  name: string
  role: string
  bio: string
  email: string
  linkedin: string
  github?: string
  twitter?: string
  location: string
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
}

export interface ConferenceItem {
  id: string
  name: string
  type: 'attended' | 'presented' | 'organized'
  date: string
  location: string
  title?: string
  description?: string
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

export interface BlogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  content: string
}
