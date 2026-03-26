import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ExperienceDetailPage from '../features/experience/ExperienceDetailPage'

describe('ExperienceDetailPage', () => {
  it('renders the Enhesa gallery on the company detail route', () => {
    render(
      <MemoryRouter initialEntries={['/experience/enhesa']}>
        <Routes>
          <Route path="/experience/:id" element={<ExperienceDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Enhesa' })).toBeVisible()
    expect(
      screen.getByRole('heading', { name: /team building at enhesa/i }),
    ).toBeVisible()
    expect(
      screen.getByAltText(
        /rooftop group photo with the lisbon bridge in the background/i,
      ),
    ).toBeInTheDocument()
  })

  it('does not render the Enhesa gallery for other companies', () => {
    render(
      <MemoryRouter initialEntries={['/experience/vortal']}>
        <Routes>
          <Route path="/experience/:id" element={<ExperienceDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'VORTAL' })).toBeVisible()
    expect(
      screen.queryByRole('heading', { name: /team life at enhesa/i }),
    ).not.toBeInTheDocument()
  })
})
