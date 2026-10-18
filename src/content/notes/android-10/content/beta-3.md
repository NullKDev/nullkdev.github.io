---
parentDomain: notes
parentId: notes-android-10
documentId: beta-3
locale: en
translationKey: android-10-beta-3
slug: beta-3
title: 'Android Q Beta 3: I/O, partners and dark theme'
summary: 7 May 2019. Released at Google I/O on 23 devices from 13 makers, Beta 3 added the dark theme and full gesture navigation and relaxed scoped storage for older apps.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google released Beta 3 on 7 May 2019, at Google I/O. It was the first build
outside Pixel phones: 15 partner devices from 12 manufacturers, Huawei,
Xiaomi, Nokia, Sony, Vivo, OPPO, OnePlus, ASUS, LGE, TECNO, Essential and
realme. With every Pixel, that made 23 devices from 13 makers. Google credited
Project Treble for the jump.

|                    |                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| Release date       | 7 May 2019                                                                                       |
| Build              | `QPP3.190404.015` (Pixel), May 2019 security patch                                               |
| Devices            | All Pixel phones, 15 partner devices listed at android.com/beta, Generic System Images, emulator |
| How to get it      | Android Beta over the air on Pixel; each partner's own site for the others                       |
| Platform stability | No; APIs still changing                                                                          |

## Beta 3 features users could see

The system-wide dark theme arrived in this build: in Settings > Display, as a
Quick Settings tile, or by turning on Battery Saver. Apps without a dark theme
could opt in to Force Dark with `android:forceDarkAllowed="true"`. A new fully
gestural navigation mode, in Settings > System > Gestures, removed the
navigation bar: swipe up for Home, swipe up and hold for Recents, swipe from
either edge for Back. Notifications got system-generated smart replies and
actions by default; apps opt out per notification with
`setAllowGeneratedReplies()` and `setAllowSystemGeneratedContextualActions()`.

## Behaviour changes that tightened or relaxed in Beta 3

Background activity starts went from a warning toast to a real block. Scoped
storage relaxed: Google had announced on 25 April that, from Beta 3, apps
targeting API 28 or lower would see no change by default, with a manifest
attribute to opt in early. The same post said scoped storage "will be required
in next year’s major platform release for all apps, independent of target SDK
level". TLS 1.3 was on for every connection through Conscrypt, regardless of
target API level. `WebViewRendererClient` was renamed to
`WebViewRenderProcessClient`, and the release notes flagged crashes in apps
whose DRM or security libraries relied on the old Bionic library paths.

Google also announced Project Mainline at I/O: system components updated from
Google Play without a full system update, which Google said every device
running Android Q or later would be able to get.
