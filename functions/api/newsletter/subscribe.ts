// Cloudflare Pages Function - Newsletter Subscription
// This runs as a native Cloudflare Worker, no Astro adapter needed

interface Env {
  BREVO_API_KEY: string
  BREVO_LIST_ID: string
  BREVO_TEMPLATE_ID?: string
  SITE_URL?: string
}

// Simple in-memory rate limiter (per-IP, 5 requests per 10 minutes)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 600_000 })
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
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
  // Rate limiting by IP
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '600' },
      },
    )
  }

  try {
    const { email } = await request.json()

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
      let brevoData: any = {}
      const contentType = brevoResponse.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        try {
          const text = await brevoResponse.text()
          if (text) {
            brevoData = JSON.parse(text)
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
