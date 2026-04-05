import { SITE } from '@/consts'
import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getAllPosts, getAllProjects } from '@/lib/data-utils'

export async function GET(context: APIContext) {
  try {
    const [posts, projects] = await Promise.all([
      getAllPosts(),
      getAllProjects(),
    ])

    const postItems = posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
      customData: `<content:encoded><![CDATA[${post.data.description}

<a href="${SITE.href}blog/${post.id}/">Read full post →</a>]]></content:encoded>`,
    }))

    const projectItems = projects.map((project) => ({
      title: project.data.title,
      description: project.data.description,
      pubDate: project.data.startDate ?? new Date(),
      link: `/projects/${project.id}/`,
      categories: project.data.tags,
    }))

    const allItems = [...postItems, ...projectItems].sort(
      (a, b) => b.pubDate.getTime() - a.pubDate.getTime(),
    )

    return rss({
      title: SITE.title,
      description: SITE.description,
      site: context.site ?? SITE.href,
      items: allItems,
      customData: `<image>
        <url>${SITE.href}static/avatar.png</url>
        <title>${SITE.title}</title>
        <link>${SITE.href}</link>
      </image>`,
    })
  } catch (error) {
    if (import.meta.env.DEV) console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
