---
parentDomain: notes
parentId: notes-android-15
documentId: beta-4
locale: en
translationKey: android-15-beta-4
slug: beta-4
title: 'Android 15 Beta 4: last beta, PNG emoji gone'
summary: 18 July 2024. The last scheduled beta was the second platform-stability build. It removed the legacy PNG emoji font; Beta 4.2 reached the Pixel 9 and 9 Pro XL in August.
order: 6
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 4 came out on 18 July 2024, the last scheduled beta and the second
platform-stability release. It was mostly fixes, before the source reached
AOSP on 3 September.

|                    |                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------ |
| Release date       | 18 July 2024; 4.1 on 29 July; 4.2 on 13 August 2024 (22 August on Pixel 9, 9 Pro XL) |
| Build              | `AP31.240617.009`; 4.1 `AP31.240617.010`; 4.2 `AP31.240617.015`                      |
| Security patch     | July 2024; 4.2 August 2024                                                           |
| Devices            | Pixel 6 to Pixel 8a, Pixel Fold, Pixel Tablet; Pixel 9 and 9 Pro XL from Beta 4.2    |
| How to get it      | Over the air through Android Beta, or by flashing; Emulator images                   |
| Platform stability | Yes                                                                                  |

The one new change was the removal of `NotoColorEmojiLegacy.ttf`, the PNG
emoji font kept since Android 13 for apps with their own font renderers.
Google gave three ways out: render text with the platform, use a library
that supports COLRv1 such as FreeType 2.13.0 or later, or bundle the old
font, which weighs 10.1 MB.

Beta 4.1 fixed audio crashes during calls. Beta 4.2 fixed devices waking up
late, camera crashes and low frame rates, UI flicker and YouTube crashes.
