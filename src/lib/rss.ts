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
