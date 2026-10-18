---
parentDomain: notes
parentId: notes-android-9-pie
documentId: beta-1
locale: en
translationKey: android-9-pie-beta-1
slug: beta-1
title: 'Android P Beta: open to partner phones'
summary: 8 May 2018. The Google I/O build, also Developer Preview 2, reached six partner phones through Treble and added Adaptive Battery, Slices, BiometricPrompt and hard non-SDK errors.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google announced Android P Beta on 8 May 2018, at Google I/O. It is the
second developer preview: AOSP tags it `android-p-preview-2`, and 9to5Google
called it "the second Developer Preview build of Android P". It was the
first P build anyone could get over the air.

|                    |                                                                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Release date       | 8 May 2018                                                                                                                                     |
| Devices            | Pixel, Pixel XL, Pixel 2 and Pixel 2 XL; Sony Xperia XZ2, Xiaomi Mi Mix 2S, Nokia 7 Plus, Oppo R15 Pro, Vivo X21UD and X21, and Essential PH-1 |
| How to get it      | Over the air through Android Beta on Pixel; partner builds from each manufacturer's site                                                       |
| Platform stability | No; final APIs came with Beta 2                                                                                                                |

The partner phones were possible because of Project Treble, which Google
called "proof of what Treble can do". The build added the user-facing
features Pie is known for: Adaptive Battery with four App Standby buckets,
the single-button system navigation, battery-based background restrictions
in Settings, and the text `Magnifier`. For developers it added Slices (with
the APIs in Android Jetpack), smart replies in notifications, new
`TextClassifier` entity types, the Dynamics Processing audio effect,
Android Protected Confirmation and StrongBox keys.

Two changes broke what Preview 1 had shipped. `BiometricPrompt` replaced
`FingerprintDialog`, with one `USE_BIOMETRIC` permission, and
`FingerprintManager` and `USE_FINGERPRINT` became deprecated. Non-SDK
interfaces that were not exempted now threw exceptions instead of showing a
toast, and `StrictMode` gained `detectNonSdkApiUsage()` to find them.
