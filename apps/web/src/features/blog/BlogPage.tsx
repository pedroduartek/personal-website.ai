import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageSEO from '../../components/seo/PageSEO'
import { getAllBlogPosts } from '../../content/blog'
import type { BlogPost } from '../../content/types'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllBlogPosts().then((data) => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-gray-600 dark:text-gray-300">Loading posts...</p>
      </div>
    )
  }

  return (
    <>
      <PageSEO
        title="Blog"
        description="Articles about software development, web technologies, and best practices."
      />
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
          Blog
        </h1>
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-gray-200 pb-8 dark:border-gray-800"
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group block hover:opacity-75"
              >
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {post.title}
                </h2>
                <time className="mb-3 block text-sm text-gray-600 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <p className="mb-3 text-gray-700 dark:text-gray-300">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
