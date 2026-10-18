---
parentDomain: notes
parentId: notes-android-11
documentId: developer-preview-2
locale: en
translationKey: android-11-developer-preview-2
slug: developer-preview-2
title: 'Android 11 Developer Preview 2: first OTA'
summary: 18 March 2020. The second preview reached DP1 users over the air and added the 5G state API, the hinge angle sensor, camera and microphone service types and resume on reboot.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 2 came out on 18 March 2020, four weeks after the first.
It was still for developers only, but owners of a Pixel already on Developer
Preview 1 or 1.1 got it as an over-the-air update. The Android Flash Tool was a
new, optional way to install it.

|                    |                                                                   |
| ------------------ | ----------------------------------------------------------------- |
| Release date       | 18 March 2020                                                     |
| Build              | `RPP2.200227.009`                                                 |
| Devices            | Pixel 2, 3, 3a and 4, with their XL models; Android Emulator      |
| How to get it      | Manual flash, Android Flash Tool, or OTA from Developer Preview 1 |
| Platform stability | No; APIs still changing                                           |

The build added a 5G state API to tell when the user is on a 5G network, a
hinge angle sensor for foldables, and call screening apps that can report why
they rejected a call. Foreground services gained the `camera` and `microphone`
types, required to use either from a service. Scoped storage got a path to
migrate files from the legacy model.

It also brought synchronized keyboard animations through
`WindowInsetsAnimationController` and an insets animation listener, a preferred
frame rate per window for variable refresh rate screens, and resume on reboot:
after an OTA reboot, apps could read credential-encrypted storage before the user
unlocked the device. The emulator gained front and back cameras.

Developer Preview 2.1 (`RPP2.200227.014`) followed on 2 April with crash fixes
in the recent apps overview, the status bar and the Settings app.
