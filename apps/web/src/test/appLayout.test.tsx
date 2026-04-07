import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AppLayout from '../app/layout/AppLayout'
import { ThemeProvider } from '../app/theme/ThemeProvider'
import TerminalPage from '../features/terminal/TerminalPage'
import { openTerminalWindow } from '../utils/terminalWindow'

vi.mock('../components/ChatWidget', () => ({
  default: () => <div data-testid="chat-widget">Chat Widget</div>,
}))

vi.mock('../components/CommandPalette/CommandPaletteTip', () => ({
  default: () => null,
}))

function renderLayout(initialEntries: Array<string | { pathname: string }>) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <div>Home Content</div> },
          { path: 'terminal', element: <TerminalPage /> },
        ],
      },
    ],
    { initialEntries },
  )

  render(
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>,
  )

  return router
}

describe('AppLayout terminal window', () => {
  afterEach(() => {
    vi.useRealTimers()
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1024,
    })
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 768,
    })
  })

  it('opens the floating terminal on top of the current page', async () => {
    renderLayout(['/'])

    expect(screen.getByText('Home Content')).toBeInTheDocument()
    expect(screen.getByTestId('chat-widget')).toBeInTheDocument()
    expect(screen.queryByLabelText('Terminal shell')).not.toBeInTheDocument()

    await act(async () => {
      openTerminalWindow()
      await Promise.resolve()
    })

    expect(screen.getByText('Home Content')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Floating terminal window'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Terminal shell')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'close' }))

    expect(
      screen.queryByLabelText('Floating terminal window'),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Home Content')).toBeInTheDocument()
    expect(screen.getByTestId('chat-widget')).toBeInTheDocument()
  })

  it('keeps the terminal windowed and centered on desktop even with shorter viewport height', async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1280,
    })
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 640,
    })

    renderLayout(['/'])

    await act(async () => {
      openTerminalWindow()
      await Promise.resolve()
    })

    const terminalWindow = screen.getByLabelText('Floating terminal window')

    expect(terminalWindow).toHaveStyle({
      width: '930px',
      height: '520px',
      left: '175px',
      top: '60px',
    })
  })

  it('closes the floating terminal when the backdrop is clicked', async () => {
    const user = userEvent.setup()

    renderLayout(['/'])

    await act(async () => {
      openTerminalWindow()
      await Promise.resolve()
    })

    const terminalWindow = screen.getByLabelText('Floating terminal window')
    const backdrop = terminalWindow.parentElement

    expect(terminalWindow).toBeInTheDocument()
    expect(backdrop).not.toBeNull()

    await user.click(backdrop as HTMLElement)

    expect(
      screen.queryByLabelText('Floating terminal window'),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Home Content')).toBeInTheDocument()
  })

  it('shows the close countdown when the close command is typed in the floating terminal', async () => {
    vi.useFakeTimers()

    renderLayout(['/'])

    await act(async () => {
      openTerminalWindow()
      await Promise.resolve()
    })

    const input = screen.getByPlaceholderText('type a command (help)')

    vi.advanceTimersByTime(1)

    fireEvent.change(input, { target: { value: 'close' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(screen.getByText('> close')).toBeInTheDocument()
    expect(
      screen.getByText('Closing terminal in 3 seconds...'),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText('Floating terminal window'),
    ).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2999)
    })

    expect(
      screen.getByLabelText('Floating terminal window'),
    ).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })

    expect(
      screen.queryByLabelText('Floating terminal window'),
    ).not.toBeInTheDocument()
  })

  it('redirects the legacy /terminal route into the floating terminal window', async () => {
    const router = renderLayout(['/terminal'])

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/')
      expect(screen.getByText('Home Content')).toBeInTheDocument()
      expect(
        screen.getByLabelText('Floating terminal window'),
      ).toBeInTheDocument()
    })
  })

  it('uses desktop-style labels in the mobile header menu', async () => {
    const user = userEvent.setup()

    renderLayout(['/'])

    await user.click(
      await screen.findByRole('button', { name: /toggle menu/i }),
    )

    expect(screen.getByRole('link', { name: 'Download CV' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'About' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Experience' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Projects' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Education' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Skills' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Contact' })).toBeVisible()
  })
})
