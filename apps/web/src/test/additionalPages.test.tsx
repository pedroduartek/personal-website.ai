import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import CVPage from '../features/cv/CVPage'
import EducationPage from '../features/education/EducationPage'
import ExperiencePage from '../features/experience/ExperiencePage'
import AiChatApiProjectPage from '../features/projects/AiChatApiProjectPage'
import PersonalWebsiteProjectPage from '../features/projects/PersonalWebsiteProjectPage'
import SkillsPage from '../features/skills/SkillsPage'

const originalRequestAnimationFrame = window.requestAnimationFrame
const originalCancelAnimationFrame = window.cancelAnimationFrame

describe('additional page coverage', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      writable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0)
        return 1
      },
    })
    Object.defineProperty(window, 'cancelAnimationFrame', {
      configurable: true,
      writable: true,
      value: () => {},
    })
  })

  afterAll(() => {
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      writable: true,
      value: originalRequestAnimationFrame,
    })
    Object.defineProperty(window, 'cancelAnimationFrame', {
      configurable: true,
      writable: true,
      value: originalCancelAnimationFrame,
    })
  })

  it('renders the experience timeline and detail links', () => {
    render(
      <MemoryRouter>
        <ExperiencePage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /^experience$/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Enhesa')).toBeInTheDocument()
    expect(
      screen.getByText(/Senior Software Engineer - Tech Lead/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Enhesa/i })).toHaveAttribute(
      'href',
      '/experience/enhesa',
    )
  })

  it('renders the education page certificate and conference links', () => {
    render(
      <MemoryRouter>
        <EducationPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /^education$/i })).toBeVisible()
    expect(
      screen.getByRole('link', { name: /view certificate/i }),
    ).toHaveAttribute('download')
    expect(
      screen.getAllByRole('link', { name: /azure dev summit/i })[0],
    ).toHaveAttribute('href', '/conferences')
  })

  it('renders the skills page categories and experience badges', () => {
    render(<SkillsPage />)

    expect(screen.getByRole('heading', { name: /^skills$/i })).toBeVisible()
    expect(screen.getByText('Backend')).toBeInTheDocument()
    expect(screen.getByText('Infrastructure & DevOps')).toBeInTheDocument()
    expect(screen.getAllByText(/\d+ years?/i).length).toBeGreaterThan(3)
  })

  it('renders the CV download and inline preview', () => {
    render(<CVPage />)

    expect(screen.getByRole('heading', { name: /^cv$/i })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /download cv \(pdf\)/i }),
    ).toHaveAttribute('download', 'Pedro_Duarte_CV.pdf')
    expect(screen.getByTitle('CV Preview')).toHaveAttribute(
      'src',
      expect.stringContaining('#view=FitH'),
    )
  })

  it('renders the AI Chat API project details and repository link', () => {
    render(
      <MemoryRouter>
        <AiChatApiProjectPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /ai chat api/i })).toBeVisible()
    expect(
      screen.getByRole('link', { name: /view repository on github/i }),
    ).toHaveAttribute('href', expect.stringContaining('ai-chat-api'))
    expect(screen.getByText('POST /chat')).toBeInTheDocument()
    expect(screen.getByText('Streaming support')).toBeInTheDocument()
  })

  it('renders the personal website project details and internal project link', () => {
    render(
      <MemoryRouter>
        <PersonalWebsiteProjectPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /personal website/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Low-friction contact flow')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ai chat api/i })).toHaveAttribute(
      'href',
      '/projects/ai-chat-api',
    )
  })
})
