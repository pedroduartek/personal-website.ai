import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ProjectDetailPage from '../features/projects/ProjectDetailPage'

describe('ProjectDetailPage', () => {
  it('renders project details by slug', () => {
    render(
      <MemoryRouter initialEntries={['/projects/home-assistant']}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(
      screen.getByText('Home Assistant: Local-First Smart Home'),
    ).toBeInTheDocument()
  })

  it('shows not found for invalid slug', () => {
    render(
      <MemoryRouter initialEntries={['/projects/invalid-slug']}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Project not found')).toBeInTheDocument()
  })
})
