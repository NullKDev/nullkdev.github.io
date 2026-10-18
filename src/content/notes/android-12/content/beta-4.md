---
parentDomain: notes
parentId: notes-android-12
documentId: beta-4
locale: en
translationKey: android-12-beta-4
slug: beta-4
title: 'Android 12 Beta 4: platform stability'
summary: 11 August 2021. The fourth beta reached platform stability, freezing APIs, app-facing behaviours and non-SDK restrictions, and Google asked for compatible app updates.
order: 7
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 4 came out on 11 August 2021 and reached platform stability: the SDK and
NDK APIs, app-facing system behaviours and non-SDK interface restrictions
were final. Google said developers could release compatibility updates
"knowing that the platform won't change".

|                    |                                                                                   |
| ------------------ | --------------------------------------------------------------------------------- |
| Release date       | 11 August 2021; Beta 4.1 on 25 August 2021                                        |
| Build              | `SPB4.210715.011`; 4.1 `SPB4.210715.014`                                          |
| Security patch     | August 2021                                                                       |
| Devices            | Pixel 3 to Pixel 5; ASUS, OnePlus, Oppo, Realme, Sharp and ZTE phones; Android TV |
| How to get it      | Over the air through Android Beta, or by flashing                                 |
| Platform stability | Yes                                                                               |

The post added no features. It listed what to test: for all apps, the
privacy dashboard, indicators and toggles, the clipboard toast, stretch
overscroll, splash screens and the BouncyCastle removal; for apps targeting
31, foreground service starts, approximate location, `SCHEDULE_EXACT_ALARM`,
WebView `SameSite` cookies, `android:exported`, custom notifications and
notification trampolines. Library, SDK and game engine developers were asked
to ship first, because their users depend on them.

Beta 4.1 fixed a boot loop after restart, missing heads-up notifications,
volume controls while casting, and Face Unlock on some devices.
