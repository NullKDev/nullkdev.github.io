import type { APIRoute } from 'astro'
import { notesFeed } from '@/pages/rss.xml'

export const GET: APIRoute = (context) => notesFeed('es', context)
