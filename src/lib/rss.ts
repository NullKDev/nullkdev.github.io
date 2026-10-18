import { brand } from '@/data/brand'
import { getDictionary, getLocalizedPath, type Locale } from '@/i18n'

interface DatedEntry {
  data: { publishedAt?: Date; updatedAt?: Date }
}

const feedDate = ({ data }: DatedEntry) => {
  const date = data.updatedAt ?? data.publishedAt
  if (!date)
    throw new Error('RSS entries require a publishedAt or updatedAt date')
  return date
}

export const sortFeedEntries = <Entry extends DatedEntry>(entries: Entry[]) =>
  entries
    .map((entry) => ({ entry, date: feedDate(entry) }))
    .toSorted((left, right) => right.date.getTime() - left.date.getTime())
    .map(({ entry }) => entry)

export const getFeedDate = feedDate

/** Each locale has its own feed; a Spanish page never offers the English one. */
export const getFeedPath = (locale: Locale): string =>
  getLocalizedPath('/rss.xml', locale)

export interface FeedCopy {
  readonly title: string
  readonly description: string
  readonly language: Locale
}

/** Feed title, description and `<language>`, from the locale's dictionary. */
export const getFeedCopy = (locale: Locale): FeedCopy => {
  const { notes } = getDictionary(locale)
  return {
    title: notes.feedTitle.replace('{name}', brand.name),
    description: notes.feedDescription.replace('{name}', brand.name),
    language: locale,
  }
}
