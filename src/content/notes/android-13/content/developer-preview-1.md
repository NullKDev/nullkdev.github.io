---
parentDomain: notes
parentId: notes-android-13
documentId: developer-preview-1
locale: en
translationKey: android-13-developer-preview-1
slug: developer-preview-1
title: 'Android 13 Developer Preview 1: photo picker'
summary: 10 February 2022. The first Android 13 build, for developers only, brought the photo picker, the NEARBY_WIFI_DEVICES permission, themed app icons and per-app languages.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google released the first developer preview of Android 13 on
10 February 2022, six months before the Pixel rollout. It was a manual
download for developers; Android Beta was not open for it. Google also said
there would be only two previews this time before Beta 1.

|                    |                                                                                 |
| ------------------ | ------------------------------------------------------------------------------- |
| Release date       | 10 February 2022                                                                |
| Build              | `TPP1.220114.016`                                                               |
| Security patch     | February 2022                                                                   |
| Devices            | Pixel 4, 4 XL, 4a, 4a (5G), 5, 5a 5G, 6 and 6 Pro; 64-bit Android Emulator; GSI |
| How to get it      | Flash a system image; later previews and betas then arrived over the air        |
| Platform stability | No; Google expected it in June 2022                                             |

The privacy work started here. The system photo picker let a user share
chosen photos and videos without the app holding a storage permission, and
Google planned to bring it to Android 11 and later through a MediaProvider
module update. `NEARBY_WIFI_DEVICES`, in the `NEARBY_DEVICES` group, let
Wi-Fi apps scan and connect without location when they declare
`neverForLocation`.

For developers the build added the Quick Settings tile placement API, themed
app icons (on Pixel at first), a platform API for per-app languages, faster
hyphenation through the `fullFast` and `normalFast` frequencies,
`RuntimeShader` with AGSL, and the first OpenJDK 11 core library updates.
Bluetooth and Ultra-wideband became new Mainline modules. Most behaviour
changes could be toggled one by one from Developer options or `adb`.
