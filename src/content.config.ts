import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const locale = z.enum(['en', 'es'])
const publicationVisibility = z.enum(['draft', 'public', 'unlisted'])
const editorialMaturity = z.enum(['seed', 'growing', 'stable', 'archived'])
const domain = z.enum(['work', 'lab', 'notes', 'gallery'])
const pathId = ({ entry }: { entry: string }) =>
  entry.replace(/\.(?:md|mdx)$/, '')

const publicProtection = z.object({ mode: z.literal('public') }).strict()
const encryptedProtection = z
  .object({
    mode: z.literal('encrypted'),
    keyId: id,
    unlockMessageKey: z.enum([
      'protection.work',
      'protection.lab',
      'protection.notes',
      'protection.gallery',
    ]),
    publicPreview: z.string().max(240).optional(),
  })
  .strict()
const protection = z.discriminatedUnion('mode', [
  publicProtection,
  encryptedProtection,
])

const link = z
  .object({
    label: z.string().min(1),
    href: z.url(),
    kind: z.enum(['repository', 'demo', 'publication', 'external', 'release']),
  })
  .strict()

const evidence = z
  .object({
    id,
    kind: z.enum([
      'metric',
      'artifact',
      'repository',
      'release',
      'publication',
      'observation',
      'testimonial',
    ]),
    claim: z.string().min(1),
    source: z.string().min(1),
    provenance: z.enum([
      'first-party',
      'third-party',
      'derived',
      'self-reported',
    ]),
    permission: z.enum(['public', 'granted', 'redacted', 'not-required']),
    url: z.url().optional(),
    disclosure: z.string().optional(),
  })
  .strict()

const crossReference = z
  .object({
    domain,
    entryId: id,
    relationship: z.enum([
      'implements',
      'documents',
      'supports',
      'extends',
      'related',
    ]),
  })
  .strict()

const subdocumentManifestItem = z
  .object({
    documentId: id,
    slug: id,
    order: z.number().int().positive(),
  })
  .strict()

const baseEntry = z
  .object({
    entryId: id,
    locale,
    translationKey: id,
    slug: id,
    title: z.string().min(1),
    summary: z.string().min(1).max(180),
    visibility: publicationVisibility,
    maturity: editorialMaturity,
    publishedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    topics: z.array(id).default([]),
    links: z.array(link).default([]),
    references: z.array(crossReference).default([]),
    evidence: z.array(evidence).default([]),
    documents: z.array(subdocumentManifestItem).default([]),
    protection,
    featuredRank: z.number().int().positive().optional(),
    statusNote: z.string().min(1).max(220).optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  })
  .strict()

const work = defineCollection({
  loader: glob({
    pattern: '**/index{,.es}.{md,mdx}',
    base: './src/content/work',
    generateId: pathId,
  }),
  schema: baseEntry
    .extend({
      lifecycle: z.enum([
        'research',
        'prototype',
        'active',
        'shipped',
        'maintained',
        'archived',
      ]),
      startedAt: z.coerce.date().optional(),
      endedAt: z.coerce.date().optional(),
      role: z.string().min(1).optional(),
      domains: z.array(id).min(1),
      surfaces: z.array(id).min(1),
      technologies: z.array(id).default([]),
      outcomes: z
        .array(
          z
            .object({
              label: z.string().min(1),
              evidence: z.array(evidence).min(1),
            })
            .strict(),
        )
        .default([]),
      operatingConditions: z
        .array(
          z
            .object({
              condition: z.string().min(1),
              implication: z.string().min(1),
            })
            .strict(),
        )
        .default([]),
    })
    .strict(),
})

const lab = defineCollection({
  loader: glob({
    pattern: '**/index{,.es}.{md,mdx}',
    base: './src/content/lab',
    generateId: pathId,
  }),
  schema: baseEntry
    .extend({
      kind: z.enum(['tool', 'experiment']),
      lifecycle: z.enum(['prototype', 'active', 'stable', 'archived']),
      // Larger experiments carry a real stack; small tools stay on topics
      // alone and the index falls back to those.
      technologies: z.array(id).default([]),
      execution: z.enum(['none', 'local', 'third-party-network']),
      sendsDataTo: z.array(z.url()).default([]),
      // A text-in / text-out contract only describes some entries. An OCR
      // pass, a local model, or an emulator declares nothing here and the
      // block simply does not render.
      inputs: z.array(z.string()).default([]),
      outputs: z.array(z.string()).default([]),
      /**
       * The shape of the running thing, so the console frames it correctly:
       * a form of fields, a drawing/vision canvas, a full viewport (emulator,
       * 3D scene), an embedded surface, or nothing runnable at all.
       */
      surface: z
        .enum(['form', 'canvas', 'viewport', 'embed', 'none'])
        .default('form'),
      /** Browser capabilities the entry needs before it can run at all. */
      requires: z
        .array(
          z.enum([
            'webgpu',
            'webgl',
            'wasm',
            'simd',
            'threads',
            'shared-array-buffer',
            'camera',
            'microphone',
            'clipboard',
            'file-system',
            'storage',
            'network',
          ]),
        )
        .default([]),
      /** What the visitor's browser must fetch on first run, in bytes. */
      downloads: z
        .array(
          z
            .object({
              label: z.string().min(1),
              bytes: z.number().int().positive(),
            })
            .strict(),
        )
        .default([]),
      /** Ordered setup an entry needs before it is usable. */
      steps: z
        .array(
          z
            .object({
              label: z.string().min(1),
              detail: z.string().min(1).optional(),
            })
            .strict(),
        )
        .default([]),
      implementationId: id.optional(),
    })
    .strict(),
})

const notes = defineCollection({
  loader: glob({
    pattern: '**/index{,.es}.{md,mdx}',
    base: './src/content/notes',
    generateId: pathId,
  }),
  schema: baseEntry
    .extend({
      /**
       * The form of the writing. Drives the index colour system, the type
       * filter routes, and how an entry is framed — a manual is not an
       * article and should not read like one.
       */
      kind: z.enum([
        'note',
        'article',
        'paper',
        'guide',
        'decision',
        'reference',
      ]),
      lifecycle: z.enum(['current', 'superseded', 'archived']),
      /**
       * `translationKey` of the entry that replaced this one. Without it
       * `lifecycle: superseded` tells a reader something is stale and gives
       * them nowhere to go.
       */
      supersededBy: id.optional(),
      /** Who the piece is written for. Most useful on guides and references. */
      level: z.enum(['intro', 'working', 'deep']).optional(),
      series: z
        .object({ id, order: z.number().int().positive() })
        .strict()
        .optional(),
      pdf: z
        .object({ href: z.string(), size: z.string().optional() })
        .strict()
        .optional(),
      citations: z
        .array(
          z
            .object({
              title: z.string(),
              url: z.url(),
              accessedAt: z.coerce.date().optional(),
            })
            .strict(),
        )
        .default([]),
    })
    .strict(),
})

const localizedText = z
  .object({ en: z.string().min(1), es: z.string().min(1) })
  .strict()

/**
 * How a piece came to exist. This is the field that makes the Gallery an
 * archive rather than a carousel: a generated image and a photograph are not
 * the same kind of object and must not be presented as one.
 */
const itemOrigin = z.enum(['captured', 'generated', 'derived', 'third-party'])

/** Required whenever `origin` is `generated` — see the refinement below. */
const generation = z
  .object({
    tool: z.string().min(1),
    model: z.string().min(1),
    prompt: z.string().min(1),
    negativePrompt: z.string().min(1).optional(),
    seed: z.union([z.string(), z.number()]).optional(),
    createdAt: z.coerce.date().optional(),
  })
  .strict()

/** Facts the scanner fills in from the file itself; never hand-written. */
const fileFacts = {
  bytes: z.number().int().positive().optional(),
  format: z.string().min(1).optional(),
  /**
   * A 16px WebP of the image inlined as a data URI, used as the loading
   * placeholder. Generated by `bun run gallery:scan`.
   */
  lqip: z.string().startsWith('data:image/').optional(),
}

const itemBase = {
  id,
  order: z.number().int().positive(),
  origin: itemOrigin.default('captured'),
  generation: generation.optional(),
  rights: z.string().min(1),
  provenance: z.string().min(1),
  capturedAt: z.coerce.date().optional(),
  topics: z.array(id).default([]),
  caption: localizedText.optional(),
}

const galleryItem = z
  .discriminatedUnion('type', [
    z
      .object({
        ...itemBase,
        ...fileFacts,
        type: z.literal('image'),
        src: z.string().min(1),
        /** Bilingual alt is mandatory: WCAG AA is a product requirement. */
        alt: localizedText,
        dimensions: z.tuple([z.number().int(), z.number().int()]).optional(),
        exif: z
          .record(z.string(), z.union([z.string(), z.number()]))
          .optional(),
      })
      .strict(),
    z
      .object({
        ...itemBase,
        ...fileFacts,
        type: z.literal('video'),
        src: z.string().min(1),
        alt: localizedText,
        poster: z.string().min(1).optional(),
        durationSeconds: z.number().positive().optional(),
        dimensions: z.tuple([z.number().int(), z.number().int()]).optional(),
      })
      .strict(),
    z
      .object({
        ...itemBase,
        ...fileFacts,
        type: z.literal('document'),
        src: z.string().min(1),
        label: localizedText,
        pages: z.number().int().positive().optional(),
        preview: z.string().min(1).optional(),
      })
      .strict(),
    z
      .object({
        ...itemBase,
        ...fileFacts,
        type: z.literal('archive'),
        src: z.string().min(1),
        label: localizedText,
        contents: z.array(z.string().min(1)).default([]),
      })
      .strict(),
    z
      .object({
        ...itemBase,
        type: z.literal('link'),
        href: z.url(),
        label: localizedText,
        accessedAt: z.coerce.date().optional(),
        preview: z.string().min(1).optional(),
      })
      .strict(),
  ])
  .superRefine((item, context) => {
    if (item.origin === 'generated' && !item.generation) {
      context.addIssue({
        code: 'custom',
        path: ['generation'],
        message:
          'origin "generated" requires a generation block (tool, model, prompt)',
      })
    }
    if (item.origin !== 'generated' && item.generation) {
      context.addIssue({
        code: 'custom',
        path: ['origin'],
        message: 'a generation block is only valid when origin is "generated"',
      })
    }
  })

export type GalleryItem = z.infer<typeof galleryItem>

const gallery = defineCollection({
  loader: glob({
    pattern: '**/index{,.es}.{md,mdx}',
    base: './src/content/gallery',
    generateId: pathId,
  }),
  schema: baseEntry
    .extend({
      kind: z.enum(['album', 'shelf', 'library']),
      lifecycle: z.enum(['collecting', 'curated', 'archived']),
    })
    .strict(),
})

/**
 * One record per asset, read from the `items.yml` sitting beside each
 * collection's `index.md`. Kept out of the entry frontmatter so a library of
 * hundreds of files does not turn `index.md` into an unreviewable diff, and
 * shared by both locales because an asset's facts do not change by language.
 */
const galleryItems = defineCollection({
  loader: {
    name: 'gallery-items',
    load: async ({ store, parseData, generateDigest, logger, watcher }) => {
      const { readdir, readFile } = await import('node:fs/promises')
      const { existsSync } = await import('node:fs')
      const { parse } = await import('yaml')
      const { fileURLToPath } = await import('node:url')
      // Relative to this config file, which lives in `src/`.
      const base = new URL('./content/gallery/', import.meta.url)
      store.clear()

      const folders = existsSync(base)
        ? await readdir(base, { withFileTypes: true })
        : []
      for (const folder of folders) {
        if (!folder.isDirectory()) continue
        const manifest = new URL(`${folder.name}/items.yml`, base)
        if (!existsSync(manifest)) continue
        // Without this, editing a manifest in dev silently does nothing.
        watcher?.add(fileURLToPath(manifest))
        const raw = parse(await readFile(manifest, 'utf8')) as unknown
        if (!Array.isArray(raw)) {
          logger.warn(`${folder.name}/items.yml is not a list; skipped`)
          continue
        }
        for (const entry of raw) {
          const record = entry as Record<string, unknown>
          const itemId = `${folder.name}/${String(record.id)}`
          const data = await parseData({
            id: itemId,
            data: { ...record, collection: folder.name },
          })
          store.set({ id: itemId, data, digest: generateDigest(data) })
        }
      }
    },
  },
  schema: z.intersection(
    galleryItem,
    z.object({ collection: z.string().min(1) }),
  ),
})

const documents = defineCollection({
  loader: glob({
    pattern: '{work,lab,notes,gallery}/**/content/**/*.{md,mdx}',
    base: './src/content',
    generateId: pathId,
  }),
  schema: z
    .object({
      parentDomain: domain,
      parentId: id,
      documentId: id,
      locale,
      translationKey: id,
      slug: id,
      title: z.string().min(1),
      summary: z.string().min(1).max(180),
      order: z.number().int().positive(),
      visibility: publicationVisibility,
      maturity: editorialMaturity,
      publishedAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      topics: z.array(id).default([]),
      references: z.array(crossReference).default([]),
      evidence: z.array(evidence).default([]),
      protection,
    })
    .strict(),
})

export const collections = {
  work,
  lab,
  notes,
  gallery,
  galleryItems,
  documents,
}
