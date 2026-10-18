---
parentDomain: notes
parentId: notes-android-16
documentId: beta-3
locale: en
translationKey: android-16-beta-3
slug: beta-3
title: 'Android 16 Beta 3: platform stability'
summary: 13 March 2025. Platform stability locked the API surface and app-facing behaviours, and the beta added Auracast broadcast audio, outline text and local network protection testing.
order: 5
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, accessibility]
references: []
evidence: []
protection: { mode: public }
---

Beta 3 came out on 13 March 2025 and reached platform stability: "the API
surface is locked, the app-facing behaviors are final". From that day, apps
targeting Android 16 could be published on Google Play.

|                    |                                                                           |
| ------------------ | ------------------------------------------------------------------------- |
| Release date       | 13 March 2025; Beta 3.1 on 18 March; Beta 3.2 on 2 April 2025             |
| Build              | `BP22.250221.010`; Beta 3.1 `BP22.250221.013`; Beta 3.2 `BP22.250221.015` |
| Security patch     | March 2025                                                                |
| Devices            | Pixel 6 and newer, Pixel Fold and Pixel Tablet; 64-bit Android Emulator   |
| Platform stability | Yes                                                                       |

Google said there were "only a few new things" this late in the cycle:

- **Auracast.** Pixel 9 phones on the beta could receive broadcast audio on
  compatible LE Audio hearing aids, from venues such as airports and
  classrooms.
- **Outline text.** It replaced high contrast text, drawing a larger
  contrasting area around the text. New `AccessibilityManager` APIs let UI
  toolkits and custom text renderers check whether it is on.
- **Local network protection, opt-in.** Google planned to require a
  permission for local network access in a future major release. Beta 3 let
  developers test it with
  `adb shell am compat enable RESTRICT_LOCAL_NETWORK <package>`; a restricted
  app sees socket errors such as `EPERM` or `ECONNABORTED`.

Two bug-fix updates followed. Beta 3.1, on 18 March, fixed a Settings crash
when the system language was not English and screen brightness that
oscillated. Beta 3.2, on 2 April, fixed miscalibrated haptics and battery
drain on idle devices.
