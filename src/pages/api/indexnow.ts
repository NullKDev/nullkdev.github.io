import type { APIRoute } from 'astro'
import { AUTHOR } from '@/consts'
import { submitToIndexNow } from '@/lib/indexnow'

/**
 * IndexNow API endpoint
 * 
 * POST /api/indexnow
 * 
 * Body: { urls: string[], host?: string }
 * 
 * Example:
 * curl -X POST https://nullkdev.github.io/api/indexnow \
 *   -H "Content-Type: application/json" \
 *   -d '{"urls": ["https://nullkdev.github.io/blog/post"]}'
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { urls, host = AUTHOR.social.website.host } = body

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'urls array is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const response = await submitToIndexNow({ host, urls })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(
        JSON.stringify({
          error: 'IndexNow submission failed',
          details: errorText,
          status: response.status,
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully submitted ${urls.length} URL(s) to IndexNow`,
        urls,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

