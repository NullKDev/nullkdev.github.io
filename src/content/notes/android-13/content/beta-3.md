---
parentDomain: notes
parentId: notes-android-13
documentId: beta-3
locale: en
translationKey: android-13-beta-3
slug: beta-3
title: 'Android 13 Beta 3: platform stability, API 33'
summary: '8 June 2022. Beta 3 reached platform stability: the API 33 SDK and NDK and every app-facing behaviour became final, two months earlier than Android 12 did.'
order: 5
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 3 came out on 8 June 2022 and took Android 13 to platform stability.
From this build the official API 33 SDK and NDK, the app-facing behaviours and
the non-SDK interface lists were final, so developers could ship compatibility
updates knowing the platform would not change.

|                    |                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------- |
| Release date       | 8 June 2022; Beta 3.1 on 10 June, 3.2 on 16 June, 3.3 on 27 June                          |
| Build              | `TPB3.220513.017`; 3.1 `TPB3.220513.017.B1`; 3.2 `TPB3.220610.004`; 3.3 `TPB3.220617.002` |
| Security patch     | June 2022                                                                                 |
| Devices            | Pixel 4 to Pixel 6 Pro; partner devices; Android Emulator; GSI                            |
| How to get it      | OTA through Android Beta, or flash                                                        |
| Platform stability | Yes: final APIs and final app-facing behaviour                                            |

The only feature the release notes list as new is copy and paste: the
clipboard preview that apps must keep from showing passwords. Google's
checklist for all apps named the notification permission, that clipboard
preview and `JobScheduler` prefetch.

Three point releases followed in June. Beta 3.1 restored the Android Beta
Feedback app. Beta 3.2 fixed apps crashing on open, the back gesture failing
in some apps and the microphone switching on and off by itself. Beta 3.3 fixed
a System UI crash on the back gesture, Wi-Fi networks that would not connect,
phones left unresponsive after charging overnight, and a kernel panic.
