import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import BlogPage from '../features/blog/BlogPage'

describe('BlogPage', () => {
  it('renders blog page', async () => {
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>,
    )

    expect(await screen.findByText('Blog')).toBeInTheDocument()
  })
})
