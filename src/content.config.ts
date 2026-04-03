import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      order: z.number().optional(),
      image: image().optional(),
      tags: z.array(z.string()).optional(),
      authors: z.array(z.string()).optional().default(['me']),
      draft: z.boolean().optional(),
      lang: z.enum(['en', 'es']).optional().default('en'),
      protected: z.boolean().optional().default(false),
      password: z.string().optional(),
      protectionMessage: z.string().optional(),
    }),
})

const authors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    pronouns: z.string().optional(),
    avatar: z.string().url().or(z.string().startsWith('/')),
    bio: z.string().optional(),
    mail: z.string().email().optional(),
    website: z.string().url().optional(),
    twitter: z.string().url().optional(),
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    discord: z.string().url().optional(),
    isRegistered: z.boolean().optional().default(false),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      image: image().optional(),
      link: z.string().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      order: z.number().optional(),
      contributors: z.array(z.string()).optional().default(['me']),
      lang: z.enum(['en', 'es']).optional().default('en'),
      protected: z.boolean().optional().default(false),
      password: z.string().optional(),
      protectionMessage: z.string().optional(),
    }),
})

const photos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/photos' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      title: z.string().optional(),
      description: z
        .string()
        .max(
          160,
          'Description should be 160 characters or less for optimal Open Graph display.',
        ),
      image: image(),
      date: z.coerce.date().optional(),
      authors: z.array(z.string()).optional().default(['me']),
      tags: z.array(z.string()).default([]),
      model: z.string().optional(),
      preset: z.string().optional(),
      lang: z.enum(['en', 'es']).optional().default('en'),
      protected: z.boolean().optional().default(false),
      password: z.string().optional(),
      protectionMessage: z.string().optional(),
    }),
})

export const collections = { blog, authors, projects, photos }
