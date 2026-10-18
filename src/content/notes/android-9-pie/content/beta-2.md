---
parentDomain: notes
parentId: notes-android-9-pie
documentId: beta-2
locale: en
translationKey: android-9-pie-beta-2
slug: beta-2
title: 'Android P Beta 2: API 28 is final'
summary: 6 June 2018. Developer Preview 3 froze API level 28, shipped the official SDK, opened Google Play to apps targeting it, and settled which non-SDK interfaces stayed reachable.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 2 came out on 6 June 2018, four weeks after Google I/O. Google
described it as "an update that includes the final Android P APIs". AOSP
tags it `android-p-preview-3`, and 9to5Google reported it as Developer
Preview 3.

|                    |                                                                                  |
| ------------------ | -------------------------------------------------------------------------------- |
| Release date       | 6 June 2018                                                                      |
| Build              | `PPP3.180510.008`, in the AOSP tag message and in 9to5Google's report            |
| Devices            | Pixel, Pixel XL, Pixel 2 and Pixel 2 XL; partner phones over the following weeks |
| How to get it      | Over the air through Android Beta, or by flashing the factory image              |
| Platform stability | Yes: API level 28 and the official SDK                                           |

With the API frozen, Google opened Google Play to APKs compiled against or
targeting API 28, and asked developers to move `targetSdkVersion` to 28 "as
soon as possible". An app already on API 26 for Play's upcoming rule, it
said, faced "a small jump".

On 12 June Google explained what Beta 2 did to non-SDK interfaces. Most
interfaces that developers had reported went on a greylist that stayed
available. Apps targeting API 28 could reach only the greylist; apps
targeting Oreo or lower kept most access and got logcat warnings instead.
Google said Beta 2 should "closely match" the final release on this point.
