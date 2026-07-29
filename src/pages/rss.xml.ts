import { brand } from '@/data/brand'
import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'

import { getPublicEnglishNotes } from '@/lib/content'
import { getFeedDate, sortFeedEntries } from '@/lib/rss'

export const GET: APIRoute = async (context) => {
  const notes = sortFeedEntries(await getPublicEnglishNotes())

  return rss({
    title: `${brand.name} Notes`,
    description: `Research notes, articles, and papers from ${brand.name}.`,
    site: context.site ?? 'https://nullkdev.github.io',
    items: notes.map(({ data }) => ({
      title: data.title,
      description: data.summary,
      pubDate: getFeedDate({ data }),
      link: `/notes/${data.slug}/`,
    })),
  })
}
