import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import StyledLink from '../components/StyledLink'
import TechIcon from '../components/TechIcon'
import WebsitePeek from '../components/WebsitePeek'

function LocationProbe() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

describe('UI helpers', () => {
  it('navigates internal StyledLink targets through the router', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/start']}>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <StyledLink href="/contact">Open contact</StyledLink>
                <LocationProbe />
              </>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('link', { name: /open contact/i }))

    expect(screen.getByTestId('location')).toHaveTextContent('/contact')
  })

  it('preserves StyledLink attributes and sizing variants', () => {
    render(
      <MemoryRouter>
        <StyledLink
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          variant="inline-chip"
          bigger
        >
          External
        </StyledLink>
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: /external/i })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link.className).toContain('text-[1.05em]')
  })

  it('renders mapped technology icons and a fallback badge', () => {
    render(
      <>
        <TechIcon tech="React" />
        <TechIcon tech="Apache Kafka" />
      </>,
    )

    expect(screen.getByAltText('React')).toBeInTheDocument()
    expect(screen.getByText('AK')).toBeInTheDocument()
  })

  it('derives the website domain when no explicit label is provided', () => {
    render(<WebsitePeek href="https://example.com/products" title="Example" />)

    expect(screen.getByText('example.com')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open example/i })).toHaveAttribute(
      'href',
      'https://example.com/products',
    )
  })

  it('uses a custom website domain label when provided', () => {
    render(
      <WebsitePeek
        href="https://example.com/products"
        title="Example"
        domain="preview.example"
      />,
    )

    expect(screen.getByText('preview.example')).toBeInTheDocument()
  })
})
