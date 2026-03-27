import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

vi.mock('yet-another-react-lightbox', () => ({
  default: ({
    open,
    slides,
    index,
  }: {
    open: boolean
    slides: Array<{ src: string }>
    index: number
  }) => (open ? <div data-testid="lightbox">{slides[index]?.src}</div> : null),
}))

vi.mock('yet-another-react-lightbox/plugins/zoom', () => ({
  default: {},
}))

vi.mock('yet-another-react-lightbox/styles.css', () => ({}))

import ConferencesPage from '../features/conferences/ConferencesPage'

describe('ConferencesPage', () => {
  it('renders conference links and opens the lightbox from event photos', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ConferencesPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /conferences & events/i }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('link', { name: /event website/i })[0],
    ).toHaveAttribute('href', 'https://azuredevsummit.com/')

    await user.click(screen.getAllByRole('button')[0])

    expect(screen.getByTestId('lightbox')).toBeInTheDocument()
  })
})
