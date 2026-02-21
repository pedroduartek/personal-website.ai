import matter from 'gray-matter'
import type { BlogPost } from './types'

const blogPosts = import.meta.glob<string>('/src/content/blog/*.md', {
  query: '?raw',
  import: 'default',
})

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await Promise.all(
    Object.entries(blogPosts).map(async ([_path, resolver]) => {
      const content = (await resolver()) as string
      const { data, content: markdown } = matter(content)

      return {
        slug: data.slug as string,
        title: data.title as string,
        date: data.date as string,
        tags: data.tags as string[],
        excerpt: data.excerpt as string,
        content: markdown,
      }
    }),
  )

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  const posts = await getAllBlogPosts()
  return posts.find((post) => post.slug === slug)
}
