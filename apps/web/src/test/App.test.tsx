import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

describe('Router', () => {
  it('renders home page', async () => {
    const HomePage = () => <div>Personal Website</div>
    const router = createMemoryRouter([{ path: '/', element: <HomePage /> }], {
      initialEntries: ['/'],
    })

    render(<RouterProvider router={router} />)
    expect(screen.getByText('Personal Website')).toBeInTheDocument()
  })
})
