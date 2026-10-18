---
parentDomain: notes
parentId: notes-android-5-0-lollipop
documentId: final-preview-images
locale: en
translationKey: android-5-0-lollipop-final-preview-images
slug: final-preview-images
title: 'Final SDK and LPX13D preview images'
summary: 17 October 2014. The final Android 5.0 SDK at API level 21, Play open to apps targeting it, and a last preview build, LPX13D, for the Nexus 5 and Nexus 7 (2013).
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

On 17 October 2014, two days after announcing Lollipop, Google published the
final Android 5.0 SDK and a last preview build, `LPX13D`, for the Nexus 5
and Nexus 7 (2013) Wi-Fi. The APIs were final at API level 21, and Google
Play accepted apps with `targetSdkVersion` 21 from that day. The system image
for users was still two weeks away.

The SDK added 32-bit and 64-bit x86 emulator images, the v7 `appcompat`
library with the Material theme for older versions, the v17 `leanback`
library for TV, and NDK r10c. Google warned that "APIs have changed between
the preview SDK and the final SDK": apps built against the preview had to be
recompiled, and the `android-L` packages deleted.

The `LPX13D` images had no OTA: the device had to be wiped and reflashed, and Google said they "only have the minimal apps pre-installed". To receive the consumer update in November, the device needed a factory image again. GSMArena reported the build the same
day.
