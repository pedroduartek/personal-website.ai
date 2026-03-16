import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import NewGuidPage from '../features/newguid/NewGuidPage'

let writeTextMock: ReturnType<typeof vi.spyOn>

describe('NewGuidPage', () => {
  beforeEach(() => {
    vi.spyOn(globalThis.crypto, 'randomUUID')

    if (!navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async () => {},
        },
      })
    }

    writeTextMock = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('generates and copies a GUID on load', async () => {
    vi.mocked(globalThis.crypto.randomUUID).mockReturnValue(
      '11111111-1111-4111-8111-111111111111',
    )

    render(
      <MemoryRouter>
        <NewGuidPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(
        '11111111-1111-4111-8111-111111111111',
      )
    })

    expect(screen.getByLabelText('Generated GUID')).toHaveTextContent(
      '11111111-1111-4111-8111-111111111111',
    )
    expect(
      screen.getByText('Fresh GUID copied to your clipboard.'),
    ).toBeInTheDocument()
  })

  it('generates and copies another GUID on demand', async () => {
    const user = userEvent.setup()
    writeTextMock = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue(undefined)

    vi.mocked(globalThis.crypto.randomUUID)
      .mockReturnValueOnce('11111111-1111-4111-8111-111111111111')
      .mockReturnValueOnce('22222222-2222-4222-8222-222222222222')

    render(
      <MemoryRouter>
        <NewGuidPage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(
        '11111111-1111-4111-8111-111111111111',
      )
    })

    await user.click(
      screen.getByRole('button', { name: /generate and copy another/i }),
    )

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenLastCalledWith(
        '22222222-2222-4222-8222-222222222222',
      )
    })

    expect(screen.getByLabelText('Generated GUID')).toHaveTextContent(
      '22222222-2222-4222-8222-222222222222',
    )
  })
})
