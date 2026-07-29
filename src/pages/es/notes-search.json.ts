import type { APIRoute } from 'astro'
import { buildNotesSearchIndex } from '@/pages/notes-search.json'

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildNotesSearchIndex('es')), {
    headers: { 'Content-Type': 'application/json' },
  })
