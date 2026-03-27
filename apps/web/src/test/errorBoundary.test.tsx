import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ErrorBoundary from '../components/ErrorBoundary'

function BrokenRoute(): null {
  throw new Error('Route exploded')
}

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the route error and recovery actions', async () => {
    const user = userEvent.setup()
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    const historyBackSpy = vi
      .spyOn(window.history, 'back')
      .mockImplementation(() => {})

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <BrokenRoute />,
          errorElement: <ErrorBoundary />,
        },
      ],
      { initialEntries: ['/'] },
    )

    render(<RouterProvider router={router} />)

    expect(
      await screen.findByRole('heading', {
        name: /oops! something went wrong/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Route exploded')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute(
      'href',
      '/',
    )

    await user.click(screen.getByRole('button', { name: /go back/i }))

    expect(historyBackSpy).toHaveBeenCalledTimes(1)
    expect(consoleErrorSpy).toHaveBeenCalled()
  })
})
