---
parentDomain: notes
parentId: notes-android-14
documentId: beta-2
locale: en
translationKey: android-14-beta-2
slug: beta-2
title: 'Android 14 Beta 2: partner phones, Ultra HDR'
summary: '10 May 2023, at Google I/O. The second beta reached partner phones and added Ultra HDR, camera extension upgrades, Health Connect in the platform and limits on full-screen intents.'
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

Beta 2 came out on 10 May 2023, the day of Google I/O, and was the first
Android 14 build for phones outside the Pixel line.

|                    |                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Release date       | 10 May 2023; Beta 2.1 on 25 May 2023                                                                                                  |
| Build              | `UPB2.230407.014`; 2.1 `UPB2.230407.019`                                                                                              |
| Security patch     | May 2023                                                                                                                              |
| Devices            | Pixel 4a (5G) to Pixel 7 Pro; phones, tablets and foldables from iQOO, Lenovo, Nothing, OnePlus, OPPO, Realme, Tecno, vivo and Xiaomi |
| How to get it      | Over the air through Android Beta, or by flashing                                                                                     |
| Platform stability | No; Google still expected it in June                                                                                                  |

Ultra HDR arrived: 10-bit photos that stay readable as JPEG, shown in HDR when
the window opts in with `Window.setColorMode()`. Camera extensions gained
latency estimates through `getRealtimeStillCaptureLatency()`, progress
callbacks, a postview image and `EXTENSION_STRENGTH`. The build also added
in-sensor zoom with a cropped RAW stream, lossless USB audio through
`AudioMixerAttributes`, custom meshes with AGSL shaders and
`HardwareBufferRenderer`.

Health Connect moved into the platform, with exercise routes. The location
dialog started showing data shared with third parties, from the Play Data
safety form. `USE_FULL_SCREEN_INTENT` was limited to calling and alarm apps,
with `canUseFullScreenIntent()` to check it.

Predictive back could be enabled per activity, and
`overrideActivityTransition()` replaced `overridePendingTransition()` for
transitions that follow the swipe. The system animations stayed behind a
developer option.

Beta 2.1 fixed device setup after leaving the beta, a battery level stuck at
0% and speaker audio disruptions.
