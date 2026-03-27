import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ProjectsPage from '../features/projects/ProjectsPage'

describe('ProjectsPage', () => {
  it('renders projects in a two-column grid on medium screens and up', () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /projects/i }),
    ).toBeInTheDocument()

    const grid = container.querySelector('.grid.gap-6.md\\:grid-cols-2')
    expect(grid).toBeInTheDocument()
    expect(grid?.children.length).toBeGreaterThan(1)
  })
})
