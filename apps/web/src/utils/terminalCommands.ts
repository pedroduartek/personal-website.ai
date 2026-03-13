import { conferences } from '../content/conferences'
import { education } from '../content/education'
import { experience } from '../content/experience'
import { profile as siteProfile } from '../content/profile'
import { projects } from '../content/projects'
import { skills } from '../content/skills'
import type { Profile } from '../content/types'
import myselfUrl from '../images/myself.webp'
import { calculateYearsFromDate } from './experience'

async function imageToAscii(url: string, charsWide?: number) {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return ['(ascii art not available server-side)']
  }

  function loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  try {
    const img = await loadImage(url)

    // determine target character width responsively if not provided
    const winW = typeof window !== 'undefined' ? window.innerWidth : 1600
    const defaultChars = Math.max(100, Math.min(200, Math.floor(winW / 6)))
    const targetW = Math.max(72, Math.min(200, charsWide ?? defaultChars))

    // upscale canvas to improve sampling/detail, then average per-char blocks
    const upscale = 6
    const aspectCorrection = 0.6 // tuning: character height/width correction

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ['(ascii conversion not supported)']

    const drawW = targetW * upscale
    // scale the full image to the target width, preserving aspect ratio
    const drawH = Math.max(
      6,
      Math.round(((img.height * drawW) / img.width) * aspectCorrection),
    )
    canvas.width = drawW
    canvas.height = drawH
    ctx.imageSmoothingEnabled = true
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // draw the entire source image scaled into the canvas (no cropping)
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      canvas.width,
      canvas.height,
    )

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    // density from darkest to lightest; a compact set emphasizes facial features
    const density = '@%#*+=-:. '

    const out: string[] = []
    const blockW = upscale
    const blockH = upscale

    // precompute luminance min/max for contrast stretching
    let lumMin = Number.POSITIVE_INFINITY
    let lumMax = Number.NEGATIVE_INFINITY
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
      if (lum < lumMin) lumMin = lum
      if (lum > lumMax) lumMax = lum
    }
    if (
      !Number.isFinite(lumMin) ||
      !Number.isFinite(lumMax) ||
      lumMax === lumMin
    ) {
      lumMin = 0
      lumMax = 255
    }

    for (let cy = 0; cy < canvas.height; cy += blockH) {
      let line = ''
      for (let cx = 0; cx < canvas.width; cx += blockW) {
        let rSum = 0
        let gSum = 0
        let bSum = 0
        let count = 0
        for (let yy = 0; yy < blockH; yy++) {
          const y = cy + yy
          if (y >= canvas.height) continue
          for (let xx = 0; xx < blockW; xx++) {
            const x = cx + xx
            if (x >= canvas.width) continue
            const idx = (y * canvas.width + x) * 4
            rSum += data[idx]
            gSum += data[idx + 1]
            bSum += data[idx + 2]
            count++
          }
        }
        if (count === 0) {
          line += ' '
          continue
        }
        const r = rSum / count
        const g = gSum / count
        const b = bSum / count
        let lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
        // contrast stretch
        lum = Math.max(lumMin, Math.min(lumMax, lum))
        const norm = (lum - lumMin) / (lumMax - lumMin)
        const p = 1 - norm
        const char = density[Math.floor(p * (density.length - 1))] || ' '
        line += char
      }
      out.push(line)
    }

    // trim empty top/bottom rows for compactness
    while (out.length && out[0].trim() === '') out.shift()
    while (out.length && out[out.length - 1].trim() === '') out.pop()

    return out.length ? out : ['(ascii conversion produced no output)']
  } catch (err) {
    return ['(failed to generate ascii art)']
  }
}

type RunOptions = { profile?: Partial<Profile> }

type ExperienceGroup = {
  company: string
  roles: typeof experience
}

function safeWindowOpen(path: string) {
  if (typeof window !== 'undefined' && typeof window.open === 'function') {
    try {
      window.open(path, '_self')
      return true
    } catch {
      return false
    }
  }
  return false
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function matchesQuery(value: string, query: string) {
  const normalizedValue = slugify(value)
  const normalizedQuery = slugify(query)

  return (
    normalizedValue === normalizedQuery ||
    normalizedValue.includes(normalizedQuery) ||
    normalizedQuery.includes(normalizedValue)
  )
}

function formatMonthYear(value: string) {
  const [year, month] = value.split('-')
  if (!year || !month) return value

  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
    },
  )
}

function formatPeriod(startDate: string, endDate?: string) {
  return `${formatMonthYear(startDate)} - ${
    endDate ? formatMonthYear(endDate) : 'Present'
  }`
}

function groupExperienceByCompany() {
  const grouped = new Map<string, ExperienceGroup>()

  for (const role of experience) {
    const existing = grouped.get(role.company)
    if (existing) {
      existing.roles.push(role)
      continue
    }

    grouped.set(role.company, {
      company: role.company,
      roles: [role],
    })
  }

  return Array.from(grouped.values())
}

function getCompanyTechnologies(roles: typeof experience) {
  const seen = new Set<string>()
  const items: string[] = []

  for (const role of roles) {
    for (const tech of role.technologies) {
      const key = tech.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      items.push(tech)
    }
  }

  return items
}

function findExperienceGroup(query: string) {
  return groupExperienceByCompany().find((group) =>
    matchesQuery(group.company, query),
  )
}

function findProject(query: string) {
  return projects.find(
    (project) =>
      matchesQuery(project.slug, query) || matchesQuery(project.title, query),
  )
}

function findSkillGroup(query: string) {
  return skills.find(
    (group) =>
      matchesQuery(group.category, query) ||
      matchesQuery(`skills ${group.category}`, query),
  )
}

function listContentSections() {
  return [
    'Content sections:',
    '  about',
    '  experience',
    '  projects',
    '  education',
    '  conferences',
    '  skills',
    '  contacts',
    '',
    'Tip: use `cat <section>` or `help` to explore further.',
  ]
}

function listProjectSuggestions() {
  return [
    'Usage: project <slug-or-name>',
    'Available projects:',
    ...projects.map((project) => `  ${project.slug}`),
  ]
}

async function handleCatCommand(
  args: string[],
  opts: RunOptions,
): Promise<string[]> {
  if (args.length === 0) {
    return [
      'Usage: cat <section[/item]>',
      'Examples:',
      '  cat about',
      '  cat project/ai-chat-api',
      '  cat experience/enhesa',
      '  cat skills/backend',
    ]
  }

  if (args.length > 1) {
    const [head, ...tail] = args
    if (
      [
        'about',
        'project',
        'projects',
        'experience',
        'skills',
        'education',
        'conference',
        'conferences',
        'contacts',
        'contact',
      ].includes(head.toLowerCase())
    ) {
      return runCommand(`${head} ${tail.join(' ')}`.trim(), opts)
    }
  }

  const path = args.join(' ').replace(/^\/+/, '')
  const parts = path.split('/').filter(Boolean)
  const [section, ...tail] = parts

  if (!section) {
    return ['Usage: cat <section[/item]>']
  }

  const remainder = tail.join(' ')
  const normalizedSection = section.toLowerCase()

  if (normalizedSection === 'about') return runCommand('about', opts)
  if (normalizedSection === 'project' || normalizedSection === 'projects') {
    return remainder
      ? runCommand(`project ${remainder}`, opts)
      : runCommand('projects', opts)
  }
  if (normalizedSection === 'experience') {
    return remainder
      ? runCommand(`experience ${remainder}`, opts)
      : runCommand('experience', opts)
  }
  if (normalizedSection === 'skills') {
    return remainder
      ? runCommand(`skills ${remainder}`, opts)
      : runCommand('skills', opts)
  }
  if (normalizedSection === 'education') {
    return remainder
      ? runCommand(`education ${remainder}`, opts)
      : runCommand('education', opts)
  }
  if (
    normalizedSection === 'conference' ||
    normalizedSection === 'conferences'
  ) {
    return remainder
      ? runCommand(`conferences ${remainder}`, opts)
      : runCommand('conferences', opts)
  }
  if (normalizedSection === 'contacts' || normalizedSection === 'contact') {
    return runCommand('contacts', opts)
  }

  return [`Unknown section: ${path}`]
}

export async function runCommand(
  cmd: string,
  _opts: RunOptions = {},
): Promise<string[]> {
  const parts = cmd.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return []

  const name = parts[0].toLowerCase()
  const args = parts.slice(1)
  const p: Profile = _opts.profile
    ? ({ ...siteProfile, ..._opts.profile } as Profile)
    : siteProfile

  if (name === 'help' || name === '?') {
    return [
      'Available commands:',
      '  ls                  List the main content sections',
      '  cat <section>       Read a section or item (e.g. cat about)',
      '  whoami              Show a short profile summary',
      '  about               Show a broader personal summary',
      '  socials|contacts    Show social links and contact info',
      '  skills [category]   List skill groups or inspect one category',
      '  experience [name]   List companies or inspect one in detail',
      '  project <slug>      Show one project in detail',
      '  projects            List notable projects or inspect one with `project <slug>`',
      '  education           Show education and certifications',
      '  conferences         Show conferences and community events',
      '  banner              Show a small ASCII header',
      '  sysinfo             Show basic system / navigator info',
      '  download-cv         Navigate to /cv to download the CV',
      '  clear               Clear the terminal (client-side)',
      '  email               Compose and send an email from the terminal',
      '  chat <message>      Ask the chat API and return a response',
      '  help                Show this help message',
    ]
  }

  if (name === 'ls') {
    return listContentSections()
  }

  if (name === 'cat') {
    return handleCatCommand(args, _opts)
  }

  if (name === 'whoami') {
    const out: string[] = []
    out.push(`${p.name} - ${p.role}`)
    out.push('')
    out.push(p.bio)
    out.push('')
    if (p.location) out.push(`Location: ${p.location}`)
    if (p.email) out.push(`Email: ${p.email}`)
    if (p.github) out.push(`GitHub: ${p.github}`)
    if (p.linkedin) out.push(`LinkedIn: ${p.linkedin}`)
    // append ASCII art of the author (if available)
    try {
      // request a slightly narrower rendering (20% smaller width)
      const art = await imageToAscii(myselfUrl, 96)
      out.push('')
      // emit a single block with a sentinel so the terminal can render it specially
      out.push(`::ASCII_ART::\n${art.join('\n')}`)
    } catch (e) {
      // ignore failures and return textual info
    }

    return out
  }

  if (name === 'about' || name === 'bio') {
    return [
      `${p.name} - ${p.role}`,
      '',
      p.bio,
      '',
      `Location: ${p.location}`,
      'Focus: backend platforms, distributed systems, developer productivity, and practical automation.',
      'Product mindset: reliability and user experience matter as much as implementation details.',
      'Outside work: fishing, motorcycling, cooking, and running a self-hosted Home Assistant setup with 50+ Zigbee devices.',
    ]
  }

  if (name === 'socials' || name === 'contacts' || name === 'contact') {
    const out: string[] = []
    if (p.github) out.push(`GitHub: ${p.github}`)
    if (p.linkedin) out.push(`LinkedIn: ${p.linkedin}`)
    if (p.email) out.push(`Email: ${p.email}`)
    if (p.twitter) out.push(`Twitter: ${p.twitter}`)
    if (out.length === 0) out.push('No social links available.')
    return out
  }

  if (name === 'skills') {
    if (args.length === 0) {
      const out: string[] = ['Skill groups:']
      for (const group of skills) {
        out.push(
          `  ${slugify(group.category)} - ${group.skills.map((skill) => skill.name).join(', ')}`,
        )
      }
      out.push('')
      out.push('Tip: run `skills backend` for a focused view.')
      return out
    }

    const query = args.join(' ')
    const group = findSkillGroup(query)
    if (!group) {
      return [
        `No skill group matched: ${query}`,
        'Try one of: backend, data-messaging, infrastructure-devops, other',
      ]
    }

    return [
      `${group.category} skills:`,
      ...group.skills.map((skill) => {
        const years = calculateYearsFromDate(skill.startDate)
        const yearsText = years === 1 ? '1 year' : `${years} years`
        return `  ${skill.name} - ~${yearsText}`
      }),
    ]
  }

  if (name === 'experience') {
    if (args.length === 0) {
      const groups = groupExperienceByCompany()
      if (groups.length === 0) return ['No experience entries available.']

      const out: string[] = ['Experience:']
      for (const group of groups) {
        const firstRole = group.roles[0]
        const earliestRole = group.roles[group.roles.length - 1]
        const titles = group.roles.map((role) => role.title).join(' | ')
        out.push(
          `  ${slugify(group.company)} - ${group.company} (${formatPeriod(earliestRole.startDate, firstRole.endDate)})`,
        )
        out.push(`    ${titles}`)
      }
      out.push('')
      out.push('Tip: run `experience enhesa` for full details.')
      return out
    }

    const query = args.join(' ')
    const group = findExperienceGroup(query)
    if (!group) {
      return [
        `No company matched: ${query}`,
        'Try one of: enhesa, vortal, closer-consulting',
      ]
    }

    const out: string[] = []
    const location = group.roles[0]?.location
    out.push(`${group.company}${location ? ` - ${location}` : ''}`)
    out.push(`Route: /experience/${slugify(group.company)}`)
    out.push('')

    const companyTech = getCompanyTechnologies(group.roles)
    if (companyTech.length > 0) {
      out.push(`Technologies: ${companyTech.join(', ')}`)
      out.push('')
    }

    for (const role of group.roles) {
      out.push(`${role.title} (${formatPeriod(role.startDate, role.endDate)})`)
      for (const line of role.description) {
        out.push(`  - ${line}`)
      }
      out.push('')
    }

    return out
  }

  if (name === 'projects') {
    if (!projects || projects.length === 0) return ['No projects available.']

    const out: string[] = ['Projects:']
    for (const project of projects) {
      out.push(`  ${project.slug} - ${project.title}`)
      out.push(`    ${project.description}`)
      out.push(`    route: /projects/${project.slug}`)
    }
    out.push('')
    out.push('Tip: run `project ai-chat-api` for a detailed view.')
    return out
  }

  if (name === 'project') {
    const query = args.join(' ').trim()
    if (!query) return listProjectSuggestions()

    const project = findProject(query)
    if (!project) {
      return [
        `No project matched: ${query}`,
        'Try one of: personal-website, home-assistant, ai-chat-api',
      ]
    }

    const out: string[] = []
    out.push(
      `${project.title} (${formatPeriod(project.startDate, project.endDate)})`,
    )
    out.push('')
    out.push(project.description)
    out.push('')
    out.push(`Why: ${project.problem}`)
    out.push('')
    out.push(`Approach: ${project.approach}`)
    out.push('')
    out.push(`Stack: ${project.technologies.join(', ')}`)
    out.push(`Route: /projects/${project.slug}`)
    if (project.links?.github) out.push(`GitHub: ${project.links.github}`)
    if (project.links?.demo) out.push(`Demo: ${project.links.demo}`)
    if (project.links?.article) out.push(`Article: ${project.links.article}`)
    return out
  }

  if (name === 'education') {
    const query = args.join(' ').trim()
    const items = query
      ? education.filter(
          (item) =>
            matchesQuery(item.institution, query) ||
            matchesQuery(item.field, query),
        )
      : education

    if (items.length === 0) {
      return [`No education entry matched: ${query}`]
    }

    const out: string[] = ['Education:']
    for (const item of items) {
      out.push(
        `  ${item.degree} in ${item.field} - ${item.institution} (${formatPeriod(item.startDate, item.endDate)})`,
      )
      out.push(`    ${item.location}`)
      if (item.gpa) out.push(`    GPA: ${item.gpa}`)
      for (const achievement of item.achievements ?? []) {
        out.push(`    - ${achievement}`)
      }
      if (item.certificateLabel) {
        out.push(`    Certificate: ${item.certificateLabel}`)
      }
      out.push('')
    }

    return out
  }

  if (name === 'conference' || name === 'conferences') {
    const query = args.join(' ').trim()
    const items = query
      ? conferences.filter((item) => matchesQuery(item.name, query))
      : conferences

    if (items.length === 0) {
      return [`No conference matched: ${query}`]
    }

    const out: string[] = ['Conferences & events:']
    for (const item of items) {
      out.push(`  ${item.name} - ${item.type} (${formatMonthYear(item.date)})`)
      out.push(`    ${item.location}`)
      if (item.description) out.push(`    ${item.description}`)
      if (item.links?.website) out.push(`    Website: ${item.links.website}`)
      out.push('')
    }
    return out
  }

  if (name === 'banner') {
    const lines: string[] = []
    lines.push('===================================')
    lines.push(`${p.name} - ${p.role}`)
    lines.push('Personal site terminal. Type `help` for commands.')
    lines.push('===================================')
    return lines
  }

  if (name === 'sysinfo') {
    const out: string[] = []
    if (typeof navigator !== 'undefined') {
      out.push(`User Agent: ${navigator.userAgent}`)
      const platform = (navigator as Navigator & { platform?: string }).platform
      if (platform) out.push(`Platform: ${platform}`)
    } else {
      out.push('Navigator info not available (server-side).')
    }
    const maybeProcess = (
      globalThis as unknown as {
        process?: { versions?: Record<string, unknown>; version?: string }
      }
    ).process
    if (maybeProcess?.versions) {
      out.push(`Node: ${maybeProcess.version}`)
    }
    return out
  }

  if (name === 'download-cv') {
    const path = '/cv'
    const ok = safeWindowOpen(path)
    return ok
      ? [`Navigating to ${path}...`]
      : [`Navigation not available. Visit ${path}`]
  }

  // `open` command removed: navigation via terminal is intentionally disabled.

  if (name === 'chat') {
    const message = args.join(' ').trim()
    if (!message) return ['Usage: chat <message>']

    const apiUrl = 'https://api.pedroduartek.com/chat'

    try {
      const maxAttempts = 2
      let res: Response | null = null
      let lastErr: unknown = null

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
          })
          if (res.ok) break
          lastErr = new Error(`HTTP ${res.status}`)
        } catch (e) {
          lastErr = e
        }
      }

      if (!res || !res.ok) {
        try {
          console.error('chat command fetch failed:', lastErr)
        } catch {}
        return ['Chat service unavailable.']
      }

      const data = await res.json()
      const reply =
        typeof data === 'string'
          ? data
          : data && typeof data === 'object'
            ? (data.answer ??
              data.reply ??
              data.message ??
              JSON.stringify(data))
            : String(data)

      return String(reply).split('\n')
    } catch (err) {
      try {
        console.error('chat command error:', err)
      } catch {}
      return ['Chat service unavailable.']
    }
  }

  return [`Command not found: ${cmd}`, 'Type "help" to see available commands.']
}
