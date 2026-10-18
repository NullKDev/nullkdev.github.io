---
parentDomain: notes
parentId: notes-android-12
documentId: beta-1
locale: en
translationKey: android-12-beta-1
slug: beta-1
title: 'Android 12 Beta 1: Material You at I/O'
summary: 18 May 2021. The first beta opened Android Beta and partner phones, and brought Material You, approximate location, Bluetooth permissions, hibernation and performance class.
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

Google unveiled Beta 1 at Google I/O on 18 May 2021. It was the first build
for early adopters: Pixel owners could enroll in Android Beta and get it over
the air, and phones from ASUS, OnePlus, Oppo, Realme, Sharp, TCL, Transsion,
Vivo, Xiaomi and ZTE could install partner builds.

|                    |                                                                       |
| ------------------ | --------------------------------------------------------------------- |
| Release date       | 18 May 2021                                                           |
| Build              | `SPB1.210331.013`                                                     |
| Security patch     | May 2021                                                              |
| Devices            | Pixel 3, 3a, 4, 4a, 4a 5G and 5; partner phones; GSI images; emulator |
| How to get it      | Over the air through Android Beta, or by flashing                     |
| Platform stability | No; still planned for August 2021                                     |

Beta 1 was the first build with the Material You redesign, which Google
called "the biggest design change in Android's history". Widgets got rounded
corners, checkboxes, switches and dynamic colour APIs, and the stretch
overscroll replaced the glow. An app that loses audio focus now fades out.

For privacy it added approximate location, `BLUETOOTH_SCAN` with
`neverForLocation` and `BLUETOOTH_CONNECT`, and app hibernation, which
force-stops unused apps and stops their jobs and push messages. Google said
permission auto-reset had reset permissions for over 8.5 million unused apps
in the two weeks before. Performance class gave apps a runtime check for
high-end media devices.

Google also put numbers on the performance work: core system services used
22% less CPU time, and Google Photos launched 34% faster after dropping
notification trampolines. The privacy dashboard, the camera and microphone
indicators and their toggles were announced for Beta 2.
