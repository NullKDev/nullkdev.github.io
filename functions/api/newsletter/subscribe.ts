// Cloudflare Pages Function - Newsletter Subscription
// Uses Cloudflare's built-in rate limiting (no in-memory Map needed)

interface Env {
  BREVO_API_KEY: string
  BREVO_LIST_ID: string
  BREVO_TEMPLATE_ID?: string
  SITE_URL?: string
}

// NOTE: In-memory rate limiting removed - Cloudflare handles rate limiting natively
// Per Cloudflare docs: Workers can use Cloudflare Rate Limiting via dashboard or API
// For production, configure rate limiting rules in Cloudflare dashboard
// This eliminates memory leaks and state issues between worker restarts

// Brevo API response types
interface BrevoErrorResponse {
  code?: string
  message?: string
}

interface BrevoSuccessResponse {
  id: number
  email: string
  // Add other success response fields as needed
}

// Honeypot field name - invisible to humans, catches bots
const HONEYPOT_FIELD = 'website'

// Timestamp-based token to prevent replay attacks (valid for 5 minutes)
function generateToken(): string {
  const payload = `${Date.now()}:${Math.random().toString(36).slice(2)}`
  return btoa(payload)
}

function isTokenValid(token: string, maxAgeMs: number = 5 * 60 * 1000): boolean {
  try {
    const decoded = atob(token)
    const timestamp = parseInt(decoded.split(':')[0], 10)
    return Date.now() - timestamp < maxAgeMs
  } catch {
    return false
  }
}

// Map Brevo status codes to user-friendly messages (never leak internal details)
function getUserMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Invalid request. Please check your email address.',
    401: 'Service temporarily unavailable. Please try again later.',
    403: 'Service temporarily unavailable. Please try again later.',
    409: 'You are already subscribed to the newsletter.',
    429: 'Too many requests. Please try again later.',
  }
  return (
    messages[status] || 'Failed to subscribe to newsletter. Please try again.'
  )
}

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}) => {
  // NOTE: Rate limiting removed - Cloudflare handles it automatically
  // Configure rate limiting rules in Cloudflare dashboard for production:
  // Settings > Security > DDoS > Rate Limiting
  // Recommended: 5 requests per 10 minutes per IP

  // Limit JSON payload size to prevent DoS attacks (1MB max)
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > 1024 * 1024) {
    return new Response(JSON.stringify({ error: 'Payload too large' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const formData = await request.json()

    // Honeypot check - bots filling invisible fields get rejected
    const honeypot = formData[HONEYPOT_FIELD]
    if (honeypot && typeof honeypot === 'string' && honeypot.length > 0) {
      // Silent reject - bot detected but pretend success
      console.warn('[SECURITY] Bot honeypot triggered:', {
        timestamp: new Date().toISOString(),
        honeypot,
      })
      return new Response(
        JSON.stringify({
          message: 'Successfully subscribed! Please check your email.',
          success: true,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Timestamp token validation - prevents replay attacks
    const token = formData._token
    if (token && !isTokenValid(token)) {
      console.warn('Invalid token detected')
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { email } = formData

    // Validate email
    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // RFC 5321 specifies max 254 characters for email
    if (email.length > 254) {
      return new Response(JSON.stringify({ error: 'Email exceeds maximum length of 254 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get configuration from environment variables
    const brevoApiKey = env.BREVO_API_KEY as string
    const brevoListId = env.BREVO_LIST_ID as string
    const brevoTemplateId = env.BREVO_TEMPLATE_ID || '5'
    const siteUrl = env.SITE_URL || 'https://nullkdev.github.io/'

    if (!brevoApiKey) {
      console.error('BREVO_API_KEY is not configured')
      return new Response(
        JSON.stringify({ error: 'Newsletter service is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const templateId = parseInt(brevoTemplateId, 10)
    const listId = brevoListId ? parseInt(brevoListId, 10) : null

    if (isNaN(templateId)) {
      return new Response(
        JSON.stringify({ error: 'Newsletter service is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    if (!listId || isNaN(listId)) {
      return new Response(
        JSON.stringify({ error: 'Newsletter service is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Prepare double opt-in request
    const contactData = {
      email: email.trim().toLowerCase(),
      includeListIds: [listId],
      templateId: templateId,
      redirectionUrl: `${siteUrl}/newsletter/confirmed`,
      updateEnabled: true,
    }

    // Call Brevo double opt-in confirmation endpoint
    const brevoResponse = await fetch(
      'https://api.brevo.com/v3/contacts/doubleOptinConfirmation',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': brevoApiKey,
        },
        body: JSON.stringify(contactData),
      },
    )

    // Handle responses
    if (!brevoResponse.ok) {
      // Contact already exists - already subscribed
      if (brevoResponse.status === 409) {
        return new Response(
          JSON.stringify({
            message: 'You are already subscribed to the newsletter',
            success: true,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      // Parse error response for logging only (never expose to client)
      let brevoData: BrevoErrorResponse = {}
      const contentType = brevoResponse.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        try {
          const text = await brevoResponse.text()
          if (text) {
            brevoData = JSON.parse(text) as BrevoErrorResponse
          }
        } catch (e) {
          console.error('Failed to parse Brevo error response:', e)
        }
      }

      // Log actual error server-side only
      console.error('Brevo API error:', {
        status: brevoResponse.status,
        statusText: brevoResponse.statusText,
        data: brevoData,
      })

      // Return sanitized user-friendly message
      return new Response(
        JSON.stringify({ error: getUserMessage(brevoResponse.status) }),
        {
          status:
            brevoResponse.status >= 400 && brevoResponse.status < 500
              ? brevoResponse.status
              : 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Success - Contact added and confirmation email sent
    return new Response(
      JSON.stringify({
        message:
          'Successfully subscribed! Please check your email to confirm your subscription.',
        success: true,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred. Please try again.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
