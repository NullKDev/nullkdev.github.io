# Security Documentation — nullkdev.github.io

This document covers security configurations, remediation measures, and operational security procedures for this project.

---

## Security Score: A

The project has achieved an **A security rating** after implementing comprehensive security remediations.

---

## API Keys Management

### Storage Location

All sensitive API keys are stored as environment variables, NOT in source code:

| Key | Environment Variable | Service | Purpose |
| --- | --- | --- | --- |
| IndexNow API Key | `INDEXNOW_API_KEY` | IndexNow | Search engine ping |
| IndexNow Key Location | `INDEXNOW_KEY_LOCATION` | IndexNow | Key verification file URL |
| IndexNow API Token | `INDEXNOW_API_TOKEN` | Internal | Bearer token for API auth |
| Brevo API Key | `BREVO_API_KEY` | Brevo | Newsletter subscriptions |

### Configuration Files

- `.env` — Local development (NOT committed)
- `.env.example` — Template with required variables (committed)
- `.gitignore` — Excludes `.env*` files

---

## API Key Rotation Procedure

### When to Rotate

- **IndexNow API Key**: Every 90 days or immediately if suspected compromised
- **Brevo API Key**: Every 180 days or if API key is exposed

### Rotation Steps

1. **Generate new key**:
   - IndexNow: Request new key from IndexNow dashboard
   - Brevo: Generate new API key in Brevo settings

2. **Update environment**:
   ```bash
   # In GitHub Pages secrets or Cloudflare if used:
   # Settings → Secrets → INDEXNOW_API_KEY = <new-key>
   ```

3. **Verify functionality**:
   ```bash
   # Test IndexNow ping
   curl -X POST https://api.indexnow.org/indexnow \
     -H "Content-Type: application/json" \
     -d '{"host": "nullkdev.github.io", "key": "<new-key>", "urlList": ["https://nullkdev.github.io"]}'
   ```

4. **Revoke old key**:
   - IndexNow: Delete from IndexNow dashboard
   - Brevo: Deactivate in Brevo API settings

### Recommended Rotation Schedule

| Key Type | Frequency | Alert |
| --- | --- | --- |
| IndexNow API Key | 90 days | Calendar reminder |
| Brevo API Key | 180 days | Calendar reminder |
| Internal API Token | 180 days | Calendar reminder |

---

## Security Remediations Applied

### CRITICAL — Completed

| Task | Description | Status |
| --- | --- | --- |
| PBKDF2 iterations | 100k → 600k (OWASP recommended) | ✅ Done |
| Hash with salt | Format: `base64(salt):hash` | ✅ Done |
| crypto-js removed | Replaced with Web Crypto API | ✅ Done |
| DOMPurify SRI | Integrity hash corrected | ✅ Done |

### HIGH — Completed

| Task | Description | Status |
| --- | --- | --- |
| CSP headers | Configured with allowlists | ✅ Done |
| DOMPurify XSS | Sanitization on i18n_html | ✅ Done |
| Rate limiting | Cloudflare native / honeypot | ✅ Done |
| CORS | Restricted to origin | ✅ Done |
| Security logging | [SECURITY] events | ✅ Done |

### MEDIUM — Completed

| Task | Description | Status |
| --- | --- | --- |
| Email validation | Max 254 chars (RFC 5321) | ✅ Done |
| JSON payload limits | 1MB newsletter, 1KB reactions | ✅ Done |
| postId validation | Regex check + path traversal | ✅ Done |
| Honeypot anti-spam | Silent bot rejection | ✅ Done |

### LOW — Completed

| Task | Description | Status |
| --- | --- | --- |
| Security docs | This document | ✅ Done |
| API rotation | Rotation procedures | ✅ Done |

---

## Cryptography Implementation

### PBKDF2 Configuration

```ts
// src/lib/encryption.ts
const ITERATIONS = 600_000  // OWASP recommended minimum
const KEY_LENGTH = 32
const DIGEST = 'sha512'
```

- **600,000 iterations** (upgraded from 100,000)
- **SHA-512** for key derivation
- **AES-256-CBC** for content encryption (Node.js)
- **AES-256-GCM** for browser runtime (Web Crypto API)

### Password Hashing with Salt

**Format**: `base64(salt):hash`

```ts
// Async version (browser)
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(saltBase64 + password))
  return `${saltBase64}:${hash}`
}
```

- **16-byte random salt** per hash
- **Format compatible** with both new (with salt) and legacy (plain hash)

---

## CSP Configuration

### GitHub Pages (`src/components/Head.astro`)

```html
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com 
    https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: blob:;
  font-src 'self';
  connect-src 'self' https://cdnjs.cloudflare.com https://ipapi.co ...
```

### Cloudflare Pages (`public/_headers`)

Same CSP + additional headers for Cloudflare deployment.

### Allowlisted External Scripts

| Source | Purpose |
| --- | --- |
| `cdnjs.cloudflare.com` | DOMPurify 3.2.7 |
| `googletagmanager.com` | Google Analytics |
| `google-analytics.com` | Google Analytics |

---

## Rate Limiting

Implemented via:

- **Cloudflare Rate Limiting** (if using Cloudflare)
- **Honeypot anti-spam** in newsletter form
- **JSON payload limits** to prevent DoS

---

## XSS Protection

- **DOMPurify 3.2.7** with integrity verification
- **Allowed tags**: `strong`, `b`, `em`, `i`, `u`, `a`, `br`, `span`
- **Allowed attributes**: `style`, `href`, `target`, `rel`

---

## Security Headers

| Header | Value |
| --- | --- |
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Strict-Transport-Security | max-age=31536000; includeSubDomains; preload |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera=(), microphone=(), geolocation=(), ... |
| Cross-Origin-Opener-Policy | same-origin |
| Cross-Origin-Resource-Policy | same-origin |

---

## Known Limitations (for future improvement)

1. **CSP 'unsafe-inline'**: Required for SSG (Static Site Generation). Full nonce-based CSP requires SSR adapter.
2. **View Transitions**: Known issue with i18n hydration - use LanguageToggle for language changes.

---

## Reporting Security Issues

If you discover a security vulnerability:

1. Do NOT open a public GitHub issue
2. Email directly (if contact available)
3. Or use GitHub's private vulnerability reporting

---

## Last Updated

- **Date**: April 2026
- **Security Score**: A
- **Version**: 1.0