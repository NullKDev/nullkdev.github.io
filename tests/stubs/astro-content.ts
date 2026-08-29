/**
 * Test double for Astro's virtual `astro:content` module.
 *
 * The real module only exists inside an Astro build, so Vite fails at
 * import-analysis — `vi.mock('astro:content', factory)` never gets the chance
 * to run, because resolution happens first. Aliasing the specifier here is
 * what makes a lib module that reads a collection testable at all.
 *
 * Entries are whatever the test hands over. Nothing here validates a schema;
 * that is `tests/content/integrity.test.ts`'s job against the real records.
 */
const collections = new Map<string, readonly unknown[]>()

/** Seed one collection for the test about to run. */
export const setCollection = (
  name: string,
  entries: readonly unknown[],
): void => {
  collections.set(name, entries)
}

/** Clear every seeded collection, so one test cannot leak into the next. */
export const resetCollections = (): void => {
  collections.clear()
}

/** Stands in for Astro's loader. An unseeded collection reads as empty. */
export const getCollection = async (
  name: string,
): Promise<readonly unknown[]> => collections.get(name) ?? []
