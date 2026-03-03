import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomeAssistantProjectPage from '../features/projects/HomeAssistantProjectPage'

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
})
