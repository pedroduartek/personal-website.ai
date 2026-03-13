import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AppLayout from '../app/layout/AppLayout'
import TerminalPage from '../features/terminal/TerminalPage'

vi.mock('../components/ChatWidget', () => ({
  default: () => <div data-testid="chat-widget">Chat Widget</div>,
}))

vi.mock('../components/CommandPalette/CommandPaletteTip', () => ({
  default: () => null,
}))

describe('AppLayout terminal mode', () => {
  it('uses the main layout space when the terminal route is active', async () => {
    const user = userEvent.setup()
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
      {
        initialEntries: [{ pathname: '/terminal', state: { from: '/' } }],
      },
    )

    const { container } = render(<RouterProvider router={router} />)

    const appRoot = container.firstElementChild
    const main = container.querySelector('main')
    expect(screen.getByLabelText('Terminal shell')).toBeInTheDocument()
    expect(appRoot).toHaveClass('h-screen', 'overflow-hidden')
    expect(main).toHaveClass('overflow-hidden')
    expect(screen.getByLabelText('Terminal shell')).toHaveClass(
      'flex-1',
      'overflow-hidden',
    )
    expect(screen.getByRole('link', { name: /pedroduartek/i })).toHaveAttribute(
      'href',
      '/',
    )
    expect(
      screen.queryByRole('button', { name: 'Open command palette' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Toggle menu' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'About Me' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByText('Welcome. Type "help" for available commands.'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Home Content')).not.toBeInTheDocument()
    expect(screen.queryByTestId('chat-widget')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'close' }))

    expect(screen.queryByLabelText('Terminal shell')).not.toBeInTheDocument()
    expect(screen.getByText('Home Content')).toBeInTheDocument()
    expect(screen.getByTestId('chat-widget')).toBeInTheDocument()
  })
})
