import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import StyledLink from '../../components/StyledLink'
import PageSEO from '../../components/seo/PageSEO'
import { getBlogPostBySlug } from '../../content/blog'
import type { BlogPost } from '../../content/types'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      getBlogPostBySlug(slug).then((data) => {
        setPost(data || null)
        setLoading(false)
      })
    }
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 animate-slide-down">
        <p className="text-gray-300">Loading...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 animate-slide-down">
        <h1 className="text-2xl font-bold text-white">Post not found</h1>
      </div>
    )
  }

  return (
    <>
      <PageSEO title={post.title} description={post.excerpt} />
      <article className="container mx-auto px-4 py-16 animate-slide-down">
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-white">{post.title}</h1>
          <time className="mb-4 block text-gray-400">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              a: ({ href, children }) => (
                <StyledLink
                  href={href ?? ''}
                  className="inline"
                  ariaLabel={
                    typeof children === 'string' ? children : undefined
                  }
                >
                  {children}
                </StyledLink>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </>
  )
}
