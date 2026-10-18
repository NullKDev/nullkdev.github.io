---
parentDomain: notes
parentId: notes-android-8-1-oreo
documentId: developer-preview-1
locale: en
translationKey: android-8-1-oreo-developer-preview-1
slug: developer-preview-1
title: 'Android 8.1 Developer Preview 1: final APIs'
summary: 25 October 2017. The first Android 8.1 build already carried the final API level 27, so Google Play opened to apps targeting it the same day.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 1 was the first Android 8.1 build, released on
25 October 2017. It already had final APIs: Google called API level 27 "already finalized" and opened Google
Play to apps compiled against or targeting it that day.

|                      |                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Release date         | 25 October 2017                                                                                                              |
| Build                | `OPP5.170921.005`                                                                                                            |
| Devices              | Pixel 2, Pixel 2 XL, Pixel, Pixel XL, Pixel C, Nexus 5X and Nexus 6P, through the Android Beta Program; the Android Emulator |
| Google Play services | 11.5.76                                                                                                                      |
| Platform stability   | Yes, from this build: API level 27 was final                                                                                 |

Google's post listed four API areas: the Android Go memory optimizations and
the low-RAM hardware feature constants, the Neural Networks API in the NDK,
Autofill changes such as `setAutofillOptions()` for spinners, and the
`SharedMemory` API. The release notes add a Wear change shipped alongside it:
the `AmbientMode` headless fragment, so a Wear app no longer has to extend
`WearableActivity` to stay visible in ambient mode. Google recommended
Android Studio 3.0 and Support Library 27.0.0 to build against API 27.

## Known issues in Developer Preview 1

- **Pixel 2 factory images.** A bootloader configuration issue stopped this
  build from being flashed onto a Pixel 2; Google told owners to enrol in the
  Android Beta Program instead.
- **Neural Networks API.** `ANeuralNetworksModel_identifyInputsAndOutputs()`
  could not be resolved in this build. Developer Preview 2 fixed it.
- **Pixel Visual Core.** Pixel 2 owners could not try it yet. Android Police
  reported on 1 November that the "Camera HAL HDR+" developer option only
  appeared on debug builds, and that Google had updated its notes to say
  testing would start with Developer Preview 2.
