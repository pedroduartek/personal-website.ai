import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomeAssistantProjectPage from '../features/projects/HomeAssistantProjectPage'
import OurivesariaRinchoaProjectPage from '../features/projects/OurivesariaRinchoaProjectPage'

describe('HomeAssistantProjectPage', () => {
  it('renders Home Assistant project page', () => {
    render(
      <MemoryRouter initialEntries={['/projects/home-assistant']}>
        <Routes>
          <Route
            path="/projects/home-assistant"
            element={<HomeAssistantProjectPage />}
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(
      screen.getByText(/Home Assistant: Local-First Smart Home/),
    ).toBeInTheDocument()
  })

  it('renders Ourivesaria Rinchoa project page', () => {
    render(
      <MemoryRouter initialEntries={['/projects/ourivesaria-rinchoa']}>
        <Routes>
          <Route
            path="/projects/ourivesaria-rinchoa"
            element={<OurivesariaRinchoaProjectPage />}
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText(/Ourivesaria Rinchoa Website/)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /visit live site/i }),
    ).toHaveAttribute('href', 'https://ourivesariarinchoa.pt')
    expect(
      screen.getByRole('link', { name: /view repository on github/i }),
    ).toHaveAttribute(
      'href',
      'https://github.com/pedroduartek/ourivesaria-rinchoa',
    )
    expect(
      screen.getByRole('link', { name: /open ourivesaria rinchoa homepage/i }),
    ).toHaveAttribute('href', 'https://ourivesariarinchoa.pt')
    expect(
      screen.queryByText(/repository stays private/i),
    ).not.toBeInTheDocument()
  })
})
