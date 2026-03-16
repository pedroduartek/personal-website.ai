import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AboutPage from '../features/about/AboutPage'

describe('AboutPage', () => {
  it('renders the About Me page', () => {
    render(<AboutPage />)

    expect(screen.getByRole('heading', { name: 'About Me' })).toBeVisible()
    expect(
      screen.getByText(/Personal projects are where I pressure-test/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/technical sessions, code reviews/i),
    ).toBeInTheDocument()
  })
})
