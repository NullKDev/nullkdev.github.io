---
parentDomain: notes
parentId: notes-android-10
documentId: beta-4
locale: en
translationKey: android-10-beta-4
slug: beta-4
title: 'Android Q Beta 4: final APIs, API level 29'
summary: 5 June 2019. Beta 4 froze the developer APIs at API level 29, shipped the official API 29 SDK and opened Google Play to apps compiled against or targeting API 29.
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 4 came out on 5 June 2019 with "the final Android Q APIs and official
SDK". From this build on, the developer APIs were fixed at API level 29.

|                    |                                                                          |
| ------------------ | ------------------------------------------------------------------------ |
| Release date       | 5 June 2019                                                              |
| Build              | `QPP4.190502.019` (Pixel), June 2019 security patch                      |
| Devices            | Pixel phones and emulator first; partner devices "over the coming weeks" |
| How to get it      | Android Beta over the air, system images, or Generic System Images       |
| Platform stability | Yes; final API 29                                                        |

The official API 29 SDK worked in the stable Android Studio 3.4, with 3.5 Beta
recommended for the latest Android Q support. The same day, Google Play
accepted apps compiled against API 29 or targeting it, so developers could
ship compatible updates to Beta users.

Google's checklist for this build: test the current app for the privacy
changes, gesture navigation and the new dynamic linker paths for Bionic
libraries. Apps moving their target to API 29 also had to test scoped
storage, the location permission for wireless scans and the permission for
full-screen intents. Google said release candidate builds would follow soon.

On the user side, 9to5Google counted four new accent colours in this build:
Cinnamon, Ocean, Space and Orchid.
