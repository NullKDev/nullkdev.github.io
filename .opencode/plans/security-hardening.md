# Security Hardening Plan — nullkdev.github.io

## CRITICAL: IndexNow API Key Leak

### Problem

- `src/lib/indexnow.ts:10-11` hardcodes the API key `'afadbe044ea7453d8fd27d8d8f84ef12'`
- `public/afadbe044ea7453d8fd27d8d8f84ef12.txt` contains the plaintext key (IndexNow verification file)
- `src/pages/api/indexnow.ts` has NO authentication — anyone can POST arbitrary URLs

### Fix

**1. `src/lib/indexnow.ts`** — Move key to env var:

```ts
const INDEXNOW_API_KEY = import.meta.env.INDEXNOW_API_KEY || ''
const INDEXNOW_KEY_LOCATION = import.meta.env.INDEXNOW_KEY_LOCATION || ''
```

**2. `src/pages/api/indexnow.ts`** — Add bearer token auth:

```ts
const API_TOKEN = import.meta.env.INDEXNOW_API_TOKEN || ''

export const POST: APIRoute = async ({ request }) => {
  const auth = request.headers.get('Authorization')
  if (auth !== `Bearer ${API_TOKEN}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }
  // ... rest of handler
}
```

**3. Delete `public/afadbe044ea7453d8fd27d8d8f84ef12.txt`** — The IndexNow verification file should not be in the repo. Instead, serve it dynamically or configure the key location differently.

**4. Add to `.gitignore`**:

```
.env
.env.*
!.env.example
```

**5. Create `.env.example`**:

```
INDEXNOW_API_KEY=
INDEXNOW_KEY_LOCATION=
INDEXNOW_API_TOKEN=
```

---

## CRITICAL: ToolProtection Exposes Plaintext Password

### Problem

`src/components/ToolProtection.astro:82`:

```html
<script define:vars={{ toolId, password }}>
```

The plaintext `password` prop is embedded in the client-side script. Anyone can View Source and read it.

### Fix

Hash the password at build time, never send plaintext:

```astro
---
// At the top of the component
const passwordHash =
  isProtected && password
    ? await crypto.subtle
        .digest('SHA-256', new TextEncoder().encode(password))
        .then((buf) =>
          Array.from(new Uint8Array(buf))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join(''),
        )
    : ''
---

<script define:vars={{ toolId, passwordHash }}>
  // Compare input hash against passwordHash
  // Never expose the actual password
</script>
```

Since Astro scripts run at build time, we can compute the hash during build. The client only receives the hash, not the password.

**Updated `ToolProtection.astro` script section:**

```html
<script define:vars="{{" toolId, passwordHash }}>
  ;(function () {
    const HASH_KEY = `tool-pw-${toolId}`

    function sha256(str) {
      return crypto.subtle
        .digest('SHA-256', new TextEncoder().encode(str))
        .then((buf) =>
          Array.from(new Uint8Array(buf))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join(''),
        )
    }

    function reveal() {
      const gate = document.getElementById(`tool-gate-${toolId}`)
      const content = document.getElementById(`tool-content-${toolId}`)
      if (gate) gate.remove()
      if (content) {
        content.classList.remove('invisible')
        content.removeAttribute('aria-hidden')
      }
    }

    const stored = sessionStorage.getItem(HASH_KEY)
    if (stored === passwordHash) reveal()

    const form = document.getElementById(`tool-form-${toolId}`)
    const input = document.getElementById(`tool-input-${toolId}`)
    const errorEl = document.getElementById(`tool-error-${toolId}`)

    if (form && input) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const val = input.value
        if (!val) return
        const hash = await sha256(val)
        if (hash === passwordHash) {
          sessionStorage.setItem(HASH_KEY, hash)
          reveal()
        } else {
          if (errorEl) errorEl.classList.remove('hidden')
          input.value = ''
          input.focus()
          setTimeout(() => errorEl?.classList.add('hidden'), 3000)
        }
      })
    }
  })()
</script>
```

**Note**: This still has the fundamental limitation that client-side password protection can be brute-forced (the hash is in the source). For a static site this is the best we can do without a server. Add rate limiting client-side with exponential backoff to make brute-forcing slower.

---

## CRITICAL: No Security Headers

### Problem

Zero security headers are configured. Missing: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

### Fix

Create `public/_headers` for Cloudflare Pages:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.indexnow.org https://api.brevo.com https://www.google-analytics.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
```

**Note on CSP**: The `'unsafe-inline'` for scripts is needed because Astro embeds inline scripts for theme switching and i18n. To fully eliminate it, we'd need to move all inline scripts to external files with hashes/nonces — a larger refactor.

---

## HIGH: Password Protection Uses Weak Client-Side Encryption

### Problem

1. `PasswordProtection.tsx` — AES encrypted content is in the HTML, brute-force is trivial
2. `PhotoPasswordProtection.tsx` — SHA-256 hash is exposed, offline dictionary attacks possible
3. `dangerouslySetInnerHTML` renders decrypted content without sanitization — if the encrypted content were tampered with, XSS is possible

### Fix

**1. Add DOMPurify for HTML sanitization:**

```bash
pnpm add dompurify
pnpm add -D @types/dompurify
```

**2. Update `src/components/PasswordProtection.tsx`:**

```tsx
import DOMPurify from 'dompurify'

// In the render:
return (
  <article
    className="prose max-w-none"
    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(decryptedHtml) }}
  />
)
```

**3. Update `src/components/ProjectPasswordProtection.tsx`** — same DOMPurify treatment

**4. Add client-side rate limiting to all password forms:**

```tsx
const [attempts, setAttempts] = useState(0)
const [locked, setLocked] = useState(false)

function handleSubmit(e: React.FormEvent) {
  if (locked) return
  if (attempts >= 5) {
    setLocked(true)
    setTimeout(() => {
      setLocked(false)
      setAttempts(0)
    }, 30000) // 30s lockout
    return
  }
  // ... existing logic
  if (!html) {
    setAttempts((prev) => prev + 1)
  }
}
```

**5. For PhotoPasswordProtection**: Instead of comparing raw SHA-256, use PBKDF2 with iterations to slow down brute-force:

```ts
// src/lib/encryption.ts — add:
export async function slowHashPassword(
  password: string,
  salt: string,
): Promise<string> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  )
  return Array.from(new Uint8Array(derived))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
```

---

## HIGH: No Rate Limiting on Cloudflare Functions

### Problem

Newsletter and reactions APIs have no rate limiting — open to abuse.

### Fix

**1. `functions/api/newsletter/subscribe.ts`** — Add IP-based rate limiting using Cloudflare's `request.headers.get('CF-Connecting-IP')`:

```ts
// Simple in-memory rate limiter (per-IP, 5 requests per 10 minutes)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 600000 }) // 10 min
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
}

export const onRequestPost = async ({ request, env }) => {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Try again later.' }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '600' },
      },
    )
  }
  // ... rest of handler
}
```

**2. `functions/api/reactions/[postId].ts`** — Same rate limiting pattern, plus per-IP tracking:

```ts
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 }) // 1 hour
    return true
  }
  if (entry.count >= 20) return false
  entry.count++
  return true
}
```

**Note**: In-memory rate limiting in Cloudflare Workers is per-isolate, not global. For production-grade rate limiting, use Cloudflare Rate Limiting rules or a KV-based counter.

---

## HIGH: CORS Wildcard on Reactions API

### Problem

`Access-Control-Allow-Origin: *` allows any site to read/write reactions.

### Fix

Replace `*` with the actual site origin:

```ts
const ALLOWED_ORIGIN = 'https://nullkdev.github.io'

// In every response header:
'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
```

For the OPTIONS preflight:

```ts
export const onRequestOptions = async ({ request }) => {
  const origin = request.headers.get('Origin')
  const allowedOrigin =
    origin === 'https://nullkdev.github.io'
      ? origin
      : 'https://nullkdev.github.io'
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
```

---

## MEDIUM: Brevo Error Messages Leaked to Client

### Problem

`functions/api/newsletter/subscribe.ts:119` — `brevoData?.message` is passed directly to the client, potentially revealing internal API details.

### Fix

```ts
// Replace:
const errorMessage = brevoData?.message || 'Failed to subscribe to newsletter'
return new Response(JSON.stringify({ error: errorMessage }), { ... })

// With:
const statusMap: Record<number, string> = {
  400: 'Invalid request. Please check your email address.',
  409: 'You are already subscribed to the newsletter.',
  429: 'Too many requests. Please try again later.',
}
const userMessage = statusMap[brevoResponse.status] || 'Failed to subscribe to newsletter. Please try again.'
return new Response(JSON.stringify({ error: userMessage }), { ... })

// Log the actual error server-side only:
console.error('Brevo API error:', { status: brevoResponse.status, data: brevoData })
```

---

## Files to Modify

| File                                           | Changes                                  |
| ---------------------------------------------- | ---------------------------------------- |
| `src/lib/indexnow.ts`                          | Move key to env vars                     |
| `src/pages/api/indexnow.ts`                    | Add bearer token auth                    |
| `public/afadbe044ea7453d8fd27d8d8f84ef12.txt`  | DELETE — remove from repo                |
| `.gitignore`                                   | Ensure .env files excluded               |
| `.env.example`                                 | CREATE — document required env vars      |
| `public/_headers`                              | CREATE — security headers for Cloudflare |
| `src/components/ToolProtection.astro`          | Hash password at build time              |
| `src/components/PasswordProtection.tsx`        | Add DOMPurify + rate limiting            |
| `src/components/ProjectPasswordProtection.tsx` | Add DOMPurify + rate limiting            |
| `src/components/PhotoPasswordProtection.tsx`   | Add rate limiting                        |
| `src/lib/encryption.ts`                        | Add PBKDF2 slow hash                     |
| `functions/api/newsletter/subscribe.ts`        | Rate limiting + sanitize errors          |
| `functions/api/reactions/[postId].ts`          | Rate limiting + restrict CORS            |
| `package.json`                                 | Add dompurify dependency                 |

---

## Post-Implementation Steps

1. Regenerate IndexNow API key (old one is compromised)
2. Set Cloudflare Pages environment variables: `INDEXNOW_API_KEY`, `INDEXNOW_KEY_LOCATION`, `INDEXNOW_API_TOKEN`
3. Update the IndexNow key verification file at the new location
4. Test all tools pages with password protection
5. Test newsletter subscription rate limiting
6. Test reactions API CORS restrictions
7. Run `pnpm build` to verify no type errors
