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

const ALLOWED_ORIGIN = 'https://nullkdev.github.io'

// Security event logging
function logSecurityEvent(
  event: string,
  details: Record<string, unknown>,
): void {
  console.warn(`[SECURITY] ${event}`, {
    timestamp: new Date().toISOString(),
    ...details,
  })
}

/**
 * Validates postId to prevent path traversal and injection attacks
 * - Must be alphanumeric, hyphens, or underscores only
 * - Max 100 characters
 * - No path traversal patterns
 */
function isValidPostId(postId: string): boolean {
  if (!postId || typeof postId !== 'string') {
    return false
  }

  // Length check
  if (postId.length > 100) {
    return false
  }

  // Prevent path traversal and special characters
  // Only allow alphanumeric, hyphens, underscores, slashes for nested paths
  const validPattern = /^[a-zA-Z0-9][a-zA-Z0-9/_-]*$/
  if (!validPattern.test(postId)) {
    return false
  }

  // Double-check no path traversal patterns
  if (postId.includes('..') || postId.includes('//') || postId.startsWith('/')) {
    return false
  }

  return true
}

// NOTE: In-memory rate limiting removed - Cloudflare handles it natively
// Per Cloudflare docs: Rate limiting is handled at the edge level
// Configure in Cloudflare dashboard: Settings > Security > DDoS > Rate Limiting
// Recommended: 20 POST requests per hour per IP

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

    // Validate postId format
    if (!isValidPostId(postId)) {
      logSecurityEvent('invalid_postId', { postId, length: postId?.length })
      return new Response(JSON.stringify({ error: 'Invalid Post ID format' }), {
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
  // NOTE: Rate limiting removed - Cloudflare handles it natively
  // Configure rate limiting rules in Cloudflare dashboard

  // Limit JSON payload size to prevent DoS attacks (1KB max)
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > 1024) {
    return new Response(JSON.stringify({ error: 'Payload too large' }), {
      status: 413,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    })
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

    // Validate postId format
    if (!isValidPostId(postId)) {
      return new Response(JSON.stringify({ error: 'Invalid Post ID format' }), {
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
      logSecurityEvent('invalid_reaction_key', { reactionKey, postId })
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
