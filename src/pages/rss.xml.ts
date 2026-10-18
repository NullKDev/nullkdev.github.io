import rss from '@astrojs/rss'
import type { APIContext, APIRoute } from 'astro'
import type { CollectionEntry } from 'astro:content'

import { getLocalizedPath, type Locale } from '@/i18n'
import { getArchiveEntries, getEntryPath } from '@/lib/content'
import { getFeedCopy, getFeedDate, sortFeedEntries } from '@/lib/rss'

/**
 * One feed per locale, each holding only that locale's notes and declaring
 * its `<language>`. A Spanish reader subscribing from a Spanish page gets the
 * Spanish feed; a missing translation stays missing, as on the site.
 */
export const notesFeed = async (locale: Locale, context: APIContext) => {
  const notes = sortFeedEntries(
    (await getArchiveEntries('notes', locale)) as CollectionEntry<'notes'>[],
  )
  const { title, description, language } = getFeedCopy(locale)

  return rss({
    title,
    description,
    // The channel links to the locale's home; item paths are absolute, so
    // they resolve the same against either.
    site: new URL(
      getLocalizedPath('/', locale),
      context.site ?? 'https://nullkdev.github.io',
    ).href,
    customData: `<language>${language}</language>`,
    items: notes.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: getFeedDate(entry),
      link: getEntryPath(entry),
    })),
  })
}

export const GET: APIRoute = (context) => notesFeed('en', context)
