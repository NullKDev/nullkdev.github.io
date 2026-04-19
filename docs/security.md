# Security Documentation — nullkdev.github.io

This document covers security configurations, remediation measures, and operational security procedures for this project.

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
   # In Cloudflare Pages dashboard:
   # Variables → INDEXNOW_API_KEY = <new-key>
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

### Phase 1 (CRITICAL) — Completed

| Task | Description | Status |
| --- | --- | --- |
| Task 1 | IndexNow key moved to env vars | Done |
| Task 2 | Password hashing with salt | Done |
| Task 3 | ToolProtection uses hash | Done |

### Phase 2 (HIGH) — Completed

| Task | Description | Status |
| --- | --- | --- |
| Task 4 | Security headers configured | Done |
| Task 5 | Password protection with DOMPurify | Done |
| Task 6 | Rate limiting on APIs | Done |
| Task 7 | CORS restricted to origin | Done |

### Phase 3 (MEDIUM) — Completed

| Task | Description | Status |
| --- | --- | --- |
| Task 8 | Error messages sanitized | Done |
| Task 9 | Password forms rate limiting | Done |
| Task 10 | PBKDF2 slow hash | Done |

### Phase 4 (LOW) — Current

| Task | Description | Status |
| --- | --- | --- |
| Task 11 | Hash salt documentation | This document |
| Task 12 | API key rotation docs | This document |

---

## Hash with Salt Implementation

### Overview

Password hashing with salting is implemented in `src/lib/encryption.ts` to protect against rainbow table attacks and brute-force.

### Implementation Details

**Sync version (Node.js / build-time):**

```ts
// src/lib/encryption.ts
const SALT_LENGTH = 32
const ITERATIONS = 100_000

function deriveKeyNode(password: string, salt: Buffer): Buffer {
  return pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
}
```

- Uses PBKDF2 with SHA-512
- 100,000 iterations
- 32-byte random salt per encryption
- AES-256-CBC for content encryption

**Async version (browser / runtime):**

```ts
async function deriveKeyWebCrypto(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  // PBKDF2 with 100,000 iterations
  // AES-256-GCM for encryption
}
```

### Slow Hash for Password Storage

For storage hashes that need to resist brute-force:

```ts
// src/lib/encryption.ts — slowHashPassword()
export async function slowHashPassword(
  password: string,
  salt: string,
): Promise<string> {
  // PBKDF2 with 100,000 iterations
  // Returns hex string for comparison
}
```

### Usage in Components

- `PasswordProtection.tsx` — Encrypts content with salted hash
- `ProjectPasswordProtection.tsx` — Same pattern
- `PhotoPasswordProtection.tsx` — Uses slow hash for verification
- `ToolProtection.astro` — Hashes password at build time

---

## Security Headers

Security headers are configured in `public/_headers` for Cloudflare Pages:

```
/*
  Content-Security-Policy: default-src 'self'; ...
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000; ...
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), ...
```

---

## Rate Limiting

Rate limiting is implemented in Cloudflare Functions:

- Newsletter subscribe: 5 requests per 10 minutes per IP
- Reactions: 20 requests per hour per IP
- Tool password attempts: Client-side lockout after 5 failed attempts

---

## Reporting Security Issues

If you discover a security vulnerability:

1. Do NOT open a public GitHub issue
2. Email directly (if contact available)
3. Or use GitHub's private vulnerability reporting

---

## Last Updated

- **Date**: April 2026
- **Phase**: 4 (LOW) complete