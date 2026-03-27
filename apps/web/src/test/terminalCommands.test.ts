import { describe, expect, it } from 'vitest'
import {
  getTerminalAutocomplete,
  getTerminalAutocompleteSuggestions,
  runCommand,
} from '../utils/terminalCommands'

describe('terminalCommands', () => {
  it('lists the main content sections and help hints', async () => {
    const listOutput = await runCommand('ls')
    const helpOutput = await runCommand('help')

    expect(listOutput).toContain('Content sections:')
    expect(listOutput).toContain('  about')
    expect(listOutput).toContain('  experience')
    expect(helpOutput).toContain(
      '  cat <section>       Read a section or item (e.g. cat about)',
    )
    expect(helpOutput).toContain(
      '  project <slug>      Show one project in detail',
    )
    expect(helpOutput).toContain('  close               Return to the homepage')
  })

  it('shows a project in detail', async () => {
    const output = await runCommand('project ai-chat-api')

    expect(output[0]).toMatch(/AI Chat API/)
    expect(output.join('\n')).toContain('Why: I wanted the website assistant')
    expect(output.join('\n')).toContain('Route: /projects/ai-chat-api')
  })

  it('suggests available projects when no project slug is provided', async () => {
    const output = await runCommand('project')

    expect(output).toContain('Usage: project <slug-or-name>')
    expect(output).toContain('Available projects:')
    expect(output).toContain('  personal-website')
    expect(output).toContain('  ourivesaria-rinchoa')
    expect(output).toContain('  home-assistant')
    expect(output).toContain('  ai-chat-api')
  })

  it('shows a project with public demo and GitHub links', async () => {
    const output = await runCommand('project ourivesaria-rinchoa')
    const joined = output.join('\n')

    expect(output[0]).toMatch(/Ourivesaria Rinchoa Website/)
    expect(joined).toContain('Route: /projects/ourivesaria-rinchoa')
    expect(joined).toContain('Demo: https://ourivesariarinchoa.pt')
    expect(joined).toContain(
      'GitHub: https://github.com/pedroduartek/ourivesaria-rinchoa',
    )
  })

  it('shows detailed company experience and supports cat aliases', async () => {
    const output = await runCommand('cat experience/enhesa')
    const joined = output.join('\n')

    expect(joined).toContain('Enhesa - Lisbon, Portugal')
    expect(joined).toContain('Route: /experience/enhesa')
    expect(joined).toContain('Senior Software Engineer - Tech Lead')
    expect(joined).toContain('Introduced Stryker mutation testing')
  })

  it('shows the broader about summary', async () => {
    const output = await runCommand('about')
    const joined = output.join('\n')

    expect(output[0]).toContain('Pedro Duarte')
    expect(joined).toContain(
      'Leadership: mentoring junior and mid-level engineers',
    )
    expect(joined).toContain(
      'Product mindset: reliability and user experience matter as much as implementation details.',
    )
  })

  it('shows focused skills by category', async () => {
    const output = await runCommand('skills backend')
    const joined = output.join('\n')

    expect(output[0]).toBe('Backend skills:')
    expect(joined).toContain('C# - ~')
    expect(joined).toContain('Microservices architecture - ~')
  })

  it('shows education and conference content', async () => {
    const educationOutput = await runCommand('education')
    const conferenceOutput = await runCommand('conferences azure')

    expect(educationOutput.join('\n')).toContain(
      "Bachelor's Degree in Management Information Systems - Polytechnic Institute of Setúbal",
    )
    expect(educationOutput.join('\n')).toContain(
      'Certificate: View Certificate',
    )
    expect(conferenceOutput.join('\n')).toContain(
      'Azure Dev Summit - Participant',
    )
    expect(conferenceOutput.join('\n')).toContain(
      'Website: https://azuredevsummit.com/',
    )
  })

  it('suggests command and argument autocompletions', () => {
    expect(getTerminalAutocomplete('dow')).toBe('download-cv')
    expect(getTerminalAutocomplete('proj')).toBe('project')
    expect(getTerminalAutocomplete('clo')).toBe('close')
    expect(getTerminalAutocomplete('ls ab')).toBe('ls about')
    expect(getTerminalAutocomplete('project ai')).toBe('project ai-chat-api')
    expect(getTerminalAutocomplete('cat experience enh')).toBe(
      'cat experience enhesa',
    )
    expect(getTerminalAutocomplete('cat experience/enh')).toBe(
      'cat experience/enhesa',
    )
  })

  it('shows command suggestions before typing and filters them by input', () => {
    expect(getTerminalAutocompleteSuggestions('')).toEqual(
      expect.arrayContaining(['ls', 'cat', 'help']),
    )
    expect(getTerminalAutocompleteSuggestions('pro')).toEqual(['project'])
    expect(getTerminalAutocompleteSuggestions('ls ')).toEqual(
      expect.arrayContaining(['ls about', 'ls experience', 'ls projects']),
    )
  })

  it('hides api-backed command autocompletions when the api is unavailable', () => {
    expect(getTerminalAutocomplete('em', { apiAvailable: false })).toBeNull()
    expect(getTerminalAutocomplete('cha', { apiAvailable: false })).toBeNull()
    expect(
      getTerminalAutocompleteSuggestions('', { apiAvailable: false }),
    ).not.toEqual(expect.arrayContaining(['email', 'chat']))
  })
})
