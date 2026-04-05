// Cloudflare Pages Function - Post Reactions API
// Stores reaction counts in Cloudflare KV

interface Env {
  REACTIONS_KV: {
    get(key: string): Promise<string | null>
    put(key: string, value: string): Promise<void>
  }
}

interface ReactionData {
  [reactionKey: string]: number
}

const ALLOWED_ORIGIN = 'https://nullkdev.github.io' // Set via SITE_URL env var in production // Set via SITE_URL env var in production

// Simple in-memory rate limiter (per-IP, 20 requests per hour for POST)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3_600_000 })
    return true
  }
  if (entry.count >= 20) return false
  entry.count++
  return true
}

function corsHeaders(
  extra: Record<string, string> = {},
): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    ...extra,
  }
}

/**
 * GET /api/reactions/[postId]
 * Fetch reaction counts for a post
 */
export const onRequestGet = async ({
  params,
  env,
}: {
  params: { postId: string }
  env: Env
}) => {
  try {
    const { postId } = params

    if (!postId) {
      return new Response(JSON.stringify({ error: 'Post ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      })
    }

    // Get reactions from KV
    const stored = await env.REACTIONS_KV.get(`reactions:${postId}`)
    const reactions: ReactionData = stored ? JSON.parse(stored) : {}

    return new Response(JSON.stringify({ reactions }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders({
          'Cache-Control': 'public, max-age=60',
        }),
      },
    })
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch reactions',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      },
    )
  }
}

/**
 * POST /api/reactions/[postId]
 * Increment a reaction count
 */
export const onRequestPost = async ({
  params,
  request,
  env,
}: {
  params: { postId: string }
  request: Request
  env: Env
}) => {
  // Rate limiting by IP
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders({ 'Retry-After': '3600' }),
        },
      },
    )
  }

  try {
    const { postId } = params
    const body = await request.json()
    const { reactionKey } = body

    if (!postId) {
      return new Response(JSON.stringify({ error: 'Post ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      })
    }

    if (!reactionKey || typeof reactionKey !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Reaction key is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        },
      )
    }

    // Valid reaction keys
    const validReactions = ['like', 'love', 'fire', 'celebrate', 'clap']
    if (!validReactions.includes(reactionKey)) {
      return new Response(JSON.stringify({ error: 'Invalid reaction key' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      })
    }

    // Get current reactions
    const stored = await env.REACTIONS_KV.get(`reactions:${postId}`)
    const reactions: ReactionData = stored ? JSON.parse(stored) : {}

    // Increment reaction count
    if (!reactions[reactionKey]) {
      reactions[reactionKey] = 0
    }
    reactions[reactionKey] += 1

    // Save back to KV
    await env.REACTIONS_KV.put(`reactions:${postId}`, JSON.stringify(reactions))

    return new Response(
      JSON.stringify({
        success: true,
        reactions,
        count: reactions[reactionKey],
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      },
    )
  } catch (error) {
    console.error('Error updating reactions:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to update reactions',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      },
    )
  }
}

/**
 * OPTIONS /api/reactions/[postId]
 * Handle CORS preflight
 */
export const onRequestOptions = async ({ request }: { request: Request }) => {
  const origin = request.headers.get('Origin')
  const allowedOrigin = origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}
