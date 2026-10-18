---
parentDomain: notes
parentId: notes-android-11
documentId: developer-preview-1
locale: en
translationKey: android-11-developer-preview-1
slug: developer-preview-1
title: 'Android 11 Developer Preview 1: flash only'
summary: 19 February 2020. The earliest preview Google had shipped, for Pixel 2 to 4 by manual flash, with one-time permissions, bubbles, 5G APIs and the plan for Platform Stability.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google released the first developer preview of Android 11 on 19 February 2020,
almost seven months before the final release. Dave Burke's post said Google was
"making this year's preview available to you earlier than ever". It was "an
early baseline build for developers only".

|                    |                                                                   |
| ------------------ | ----------------------------------------------------------------- |
| Release date       | 19 February 2020                                                  |
| Build              | `RPP1.200123.016`                                                 |
| Devices            | Pixel 2, 3, 3a and 4, with their XL models; Android Emulator; GSI |
| How to get it      | Manual download and flash only; Android Beta was not open for 11  |
| Platform stability | No; APIs still changing                                           |

Much of Android 11 was already there: one-time permissions for location,
camera and microphone; the conversations section and the Bubbles API; images in
inline notification replies; 5G meteredness and bandwidth estimates; waterfall
screens; NNAPI 1.3; call screening with STIR/SHAKEN status; animated HEIF and a
native image decoder; low-latency video decoding; and heap pointer tagging for
apps targeting 11. Scoped storage gained raw file paths for media and batch
edits in `MediaStore`, and Google said its rules would apply only once an app
targets Android 11.

For compatibility, the preview brought per-change toggles in Developer options
and adb, so apps could be tested without changing `targetSdkVersion`. It also
added a public Resource Loader API, 12 new Mainline modules, and announced a new
milestone, "Platform Stability", expected in early June. It would freeze not only
the APIs but "final internal APIs and system behaviors that may affect apps".

A bug-fix update, Developer Preview 1.1 (`RPP1.200123.020`), followed on 4 March.
It stopped a security exception for apps requesting foreground location together
with another permission, and temporarily relaxed the non-SDK restrictions on a
few methods used by OkHttp.
