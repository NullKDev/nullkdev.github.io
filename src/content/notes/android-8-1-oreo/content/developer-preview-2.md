---
parentDomain: notes
parentId: notes-android-8-1-oreo
documentId: developer-preview-2
locale: en
translationKey: android-8-1-oreo-developer-preview-2
slug: developer-preview-2
title: 'Android 8.1 Developer Preview 2: Visual Core'
summary: 27 November 2017. The last preview before release brought near-final images, the November 2017 security patch and Pixel Visual Core for Pixel 2 developers.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 2 came out on 27 November 2017, the last preview before the
December release. Google described it as "near-final" system images with the
official API level 27, the latest bug fixes and the November 2017 security
patch. Devices already in the Android Beta Program got it over the air "over
the next few days".

|                      |                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------- |
| Release date         | 27 November 2017                                                                        |
| Build                | `OPP6.171019.012`                                                                       |
| Security patch       | November 2017                                                                           |
| Devices              | Pixel 2, Pixel 2 XL, Pixel, Pixel XL, Pixel C, Nexus 6P, Nexus 5X; the Android Emulator |
| Google Play services | 11.5.80                                                                                 |

## What Developer Preview 2 changed

- **Pixel Visual Core.** On Pixel 2, a new developer option turned on Google's
  image co-processor, and apps using the Camera API could capture HDR+ shots
  through it. It is the change the final release kept; see "What it brought"
  above.
- **TensorFlow Lite.** Google's post announced TensorFlow Lite as available
  the same day, running models such as MobileNets, Inception v3 and Smart
  Reply on top of the Neural Networks API.
- **One named fix.** `ANeuralNetworksModel_identifyInputsAndOutputs()`, missing
  in Developer Preview 1, became resolvable. The release notes list no other
  fixed issue and no API change; API level 27 was already final.
