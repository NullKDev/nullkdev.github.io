---
parentDomain: notes
parentId: notes-android-11
documentId: beta-2
locale: en
translationKey: android-11-beta-2
slug: beta-2
title: 'Android 11 Beta 2: Platform Stability'
summary: 8 July 2020. The second beta reached Platform Stability, new in Android 11, with final APIs, system behaviors and non-SDK restrictions two months before release.
order: 6
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 2 came out on 8 July 2020 and brought Android 11 to Platform Stability,
the milestone Google added that year "just for developers". It meant "all
app-facing surfaces and behaviors are now final": SDK and NDK APIs, system
behaviors, and the restrictions on non-SDK interfaces.

|                    |                                                               |
| ------------------ | ------------------------------------------------------------- |
| Release date       | 8 July 2020                                                   |
| Build              | `RPB2.200611.009`                                             |
| Devices            | Pixel 2, 3, 3a and 4, with their XL models; Android Emulator  |
| How to get it      | Over the air through Android Beta, automatic for Beta 1 users |
| Platform stability | Yes, from this build                                          |

Google asked every app developer to start final compatibility testing, and SDK,
library and game engine developers to ship first, since apps downstream "may be
blocked" until they did. The four changes it listed for all apps were one-time
permissions, no access to other apps' files in external storage, the Scudo
allocator for native code, and fdsan on by default.

Beta 2.5 (`RPB2.200611.012`) followed on 22 July. It fixed lost audio after a
VoIP call, random reboots, screen flicker at low brightness, and a block on
returning some Pixel 4 phones to Android 10.
