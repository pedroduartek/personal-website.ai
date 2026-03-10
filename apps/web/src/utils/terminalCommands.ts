import { experience } from '../content/experience'
import { profile as siteProfile } from '../content/profile'
import { projects } from '../content/projects'
import { skills } from '../content/skills'
import type { Profile } from '../content/types'

type RunOptions = { profile?: Partial<Profile> }

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
      '  whoami       Show a short profile summary',
      '  socials|contacts     Show social links and contact info',
      '  skills              List skill groups and skills',
      '  experience          Summary of top 3 roles',
      '  projects            List notable projects with links',
      '  banner              Show a small ASCII header',
      '  sysinfo             Show basic system / navigator info',
      '  download-cv         Navigate to /cv to download the CV',
      '  open <path>         Navigate to a site path (e.g. /projects)',
      '  clear               Clear the terminal (client-side)',
      '  chat <message>      Ask the chat API and return a response',
      '  help                Show this help message',
    ]
  }

  if (name === 'whoami') {
    const out: string[] = []
    out.push(`${p.name} — ${p.role}`)
    out.push('')
    out.push(p.bio)
    out.push('')
    if (p.location) out.push(`Location: ${p.location}`)
    if (p.email) out.push(`Email: ${p.email}`)
    if (p.github) out.push(`GitHub: ${p.github}`)
    if (p.linkedin) out.push(`LinkedIn: ${p.linkedin}`)
    return out
  }

  if (name === 'socials' || name === 'contacts') {
    const out: string[] = []
    if (p.github) out.push(`GitHub: ${p.github}`)
    if (p.linkedin) out.push(`LinkedIn: ${p.linkedin}`)
    if (p.email) out.push(`Email: ${p.email}`)
    if (p.twitter) out.push(`Twitter: ${p.twitter}`)
    if (out.length === 0) out.push('No social links available.')
    return out
  }

  if (name === 'skills') {
    const out: string[] = []
    for (const g of skills) {
      const skillNames = g.skills.map((s) => s.name).join(', ')
      out.push(`${g.category}: ${skillNames}`)
    }
    return out
  }

  if (name === 'experience') {
    const top = experience.slice(0, 3)
    if (top.length === 0) return ['No experience entries available.']
    const out: string[] = []
    for (const e of top) {
      const dates = e.startDate + (e.endDate ? ` — ${e.endDate}` : ' — Present')
      out.push(`${e.title} @ ${e.company} (${dates}) — ${e.location}`)
      if (e.description && e.description.length > 0) {
        out.push(`  • ${e.description[0]}`)
      }
      out.push('')
    }
    return out
  }

  if (name === 'projects' || name === 'ls') {
    if (!projects || projects.length === 0) return ['No projects available.']
    const out: string[] = []
    for (const pr of projects) {
      out.push(`${pr.title} — ${pr.description}`)
      if (pr.links) {
        const linkParts: string[] = []
        if (pr.links.github) linkParts.push(`github: ${pr.links.github}`)
        if (pr.links.demo) linkParts.push(`demo: ${pr.links.demo}`)
        if (pr.links.article) linkParts.push(`article: ${pr.links.article}`)
        if (linkParts.length) out.push(`  ${linkParts.join(' | ')}`)
      }
      out.push('')
    }
    return out
  }

  if (name === 'banner') {
    const lines: string[] = []
    lines.push('===================================')
    lines.push(`${p.name} — ${p.role}`)
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

  if (name === 'open') {
    const path = args[0] ?? '/'
    const ok = safeWindowOpen(path)
    return ok
      ? [`Navigating to ${path}...`]
      : [`Navigation not available. Visit ${path}`]
  }

  if (name === 'chat') {
    const message = args.join(' ').trim()
    if (!message) return ['Usage: chat <message>']

    const apiUrl = import.meta.env.DEV
      ? '/api/chat'
      : 'https://api.pedroduartek.com/chat'

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

  // fallback
  return [`Command not found: ${cmd}`, 'Type "help" to see available commands.']
}
