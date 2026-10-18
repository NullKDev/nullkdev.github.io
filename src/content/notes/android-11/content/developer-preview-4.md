---
parentDomain: notes
parentId: notes-android-11
documentId: developer-preview-4
locale: en
translationKey: android-11-developer-preview-4
slug: developer-preview-4
title: 'Android 11 Developer Preview 4: added late'
summary: 6 May 2020. An unplanned fourth preview came with a new schedule that moved Beta 1 and every later milestone back about a month, while keeping the final release in Q3.
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 4 was not in the original plan. Google's February timeline, as
9to5Google reported it, had three previews and Beta 1 in May. On 6 May 2020, Google released a fourth
preview instead and moved "Beta 1 and all subsequent milestones by about a
month", keeping the final release "later in Q3".

|                    |                                                              |
| ------------------ | ------------------------------------------------------------ |
| Release date       | 6 May 2020                                                   |
| Build              | `RPP4.200409.015`                                            |
| Devices            | Pixel 2, 3, 3a and 4, with their XL models; Android Emulator |
| How to get it      | Manual flash, or OTA from an earlier preview                 |
| Platform stability | No; APIs still changing                                      |

The new schedule put Beta 1, with final SDK and NDK APIs, on 3 June; Beta 2,
with Platform Stability, in July; and Beta 3, with release candidate builds, in
August. With no in-person Google I/O that year, Google planned an online "#Android11: the Beta
Launch Show" for 3 June.

The build itself brought "the latest bug fixes, API tweaks, and features to
try". Two changes reached apps targeting Android 11: they could no longer be
installed with a compressed `resources.arsc`, and `getLine1Number()` in
`TelephonyManager` and `TelecomManager` required `READ_PHONE_NUMBERS`.
