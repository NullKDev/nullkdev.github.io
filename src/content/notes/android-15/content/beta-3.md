---
parentDomain: notes
parentId: notes-android-15
documentId: beta-3
locale: en
translationKey: android-15-beta-3
slug: beta-3
title: 'Android 15 Beta 3: platform stability'
summary: 18 June 2024. The third beta reached platform stability, so apps targeting Android 15 could ship on Google Play. It added one-step passkey sign-in and deprecated WebSQL in WebView.
order: 5
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 3 came out on 18 June 2024 and reached platform stability: the
developer APIs and all app-facing behaviours were final, and apps targeting
Android 15 could be published on Google Play. Google said there were only a
few new things in it.

|                    |                                                                    |
| ------------------ | ------------------------------------------------------------------ |
| Release date       | 18 June 2024; 3.1 on 1 July 2024                                   |
| Build              | `AP31.240517.022`; 3.1 `AP31.240517.031`                           |
| Security patch     | June 2024                                                          |
| Devices            | Pixel 6 to Pixel 8a, Pixel Fold, Pixel Tablet                      |
| How to get it      | Over the air through Android Beta, or by flashing; Emulator images |
| Platform stability | Yes: final APIs and behaviours                                     |

- **Passkeys in one step.** In apps targeting Android 15, users sign in with a
  passkey through a single face, fingerprint or screen lock prompt.
  Credential providers hand the authentication to the system UI through
  `androidx.credentials`.
- **Autofill fallback.** An app can tie a Credential Manager request to a
  username or password field. If the user dismisses the passkey prompt, the
  suggestions still appear in the keyboard or a dropdown.
- **WebSQL deprecated.** `WebSettings.setDatabaseEnabled()` and
  `getDatabaseEnabled()` are deprecated in WebView, and Google said they would
  become no-ops on every Android version within 12 months. IndexedDB is the
  replacement.

Beta 3.1 fixed the lock screen asking to unlock when the user touched items
that did not need it, and face unlock failures.
