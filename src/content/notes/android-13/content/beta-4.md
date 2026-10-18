---
parentDomain: notes
parentId: notes-android-13
documentId: beta-4
locale: en
translationKey: android-13-beta-4
slug: beta-4
title: 'Android 13 Beta 4: the release candidate'
summary: 13 July 2022. The last beta was a release candidate for Pixel and the emulator, with nothing new for developers; Beta 4.1 followed on 25 July with bug fixes.
order: 6
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 4 was released on 13 July 2022 as "a final update for your testing and
development". It was a release candidate build for Pixel and the Android
Emulator. Since platform stability came at Beta 3, it changed no API or
behaviour; it carried fixes and optimisations.

|                    |                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------- |
| Release date       | 13 July 2022; Beta 4.1 on 25 July 2022 (1 August on the Pixel 6a)                  |
| Build              | `TPB4.220624.005`; 4.1 `TPB4.220624.008`, `TPB4.220624.008.A2` on the Pixel 6a     |
| Security patch     | July 2022                                                                          |
| Devices            | Pixel 4 to Pixel 6 Pro; the Pixel 6a from Beta 4.1; partner devices; emulator; GSI |
| How to get it      | OTA through Android Beta, or flash                                                 |
| Platform stability | Yes, since Beta 3                                                                  |

Beta 4.1 fixed apps that could not turn Bluetooth on or off without
`BLUETOOTH_CONNECT` even though their target did not need it, crashes and
reboots on some Wi-Fi networks, Meet calls dropping while driving and wrong
readings of GPS data. The final release reached AOSP and Pixel phones on
15 August 2022.
