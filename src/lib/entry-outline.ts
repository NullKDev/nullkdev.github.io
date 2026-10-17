import { render } from 'astro:content'

import { getDocumentsForEntry, type ArchiveEntry } from '@/lib/content'
import { getReadingMinutes } from '@/lib/notes'
import {
  buildEntryOutline,
  getPartAnchor,
  type OutlineItem,
} from '@/lib/outline'

/**
 * An entry's outline as its page renders it: its own headings plus one part
 * per inlined subpost, through the same `buildEntryOutline` and part anchors
 * `EntryPage` uses. Anything that links into a page by heading — the notes
 * search index — reads it from here, so its anchors are the ones on the page.
 * `check-built-metadata.ts` proves every indexed anchor exists after the build.
 */
export const loadEntryOutline = async (
  entry: ArchiveEntry,
): Promise<OutlineItem[]> => {
  const documents = await getDocumentsForEntry(entry)
  const parts = await Promise.all(
    documents.map(async (document) => ({
      slug: getPartAnchor(document.data.order),
      title: document.data.title,
      minutes: getReadingMinutes([document.body]),
      headings: (await render(document)).headings,
    })),
  )
  return buildEntryOutline((await render(entry)).headings, parts)
}
