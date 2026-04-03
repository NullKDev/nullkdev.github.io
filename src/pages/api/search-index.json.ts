import type { APIRoute } from 'astro'
import { getAllPosts, getAllProjects } from '@/lib/data-utils'

export const prerender = true

export const GET: APIRoute = async () => {
  try {
    const [posts, projects] = await Promise.all([
      getAllPosts(),
      getAllProjects(),
    ])

    const postItems = posts.map((post) => {
      const htmlContent = (post as { body?: string }).body || ''
      const textContent = htmlContent
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      return {
        id: post.id || '',
        type: 'blog' as const,
        title: post.data.title || '',
        description: post.data.description || '',
        date: post.data.date?.toISOString() || new Date().toISOString(),
        tags: post.data.tags || [],
        authors: post.data.authors || [],
        url: `/blog/${post.id}`,
        content: textContent,
      }
    })

    const projectItems = projects.map((project) => {
      const htmlContent = (project as { body?: string }).body || ''
      const textContent = htmlContent
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      return {
        id: project.id || '',
        type: 'project' as const,
        title: project.data.title || '',
        description: project.data.description || '',
        date: project.data.startDate?.toISOString() || new Date().toISOString(),
        tags: project.data.tags || [],
        authors: [] as string[],
        url: `/projects/${project.id}`,
        content: textContent,
      }
    })

    const searchIndex = [...postItems, ...projectItems]

    return new Response(JSON.stringify(searchIndex), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    if (import.meta.env.DEV)
      console.error('Error generating search index:', error)
    // Return empty array on error instead of failing
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}
