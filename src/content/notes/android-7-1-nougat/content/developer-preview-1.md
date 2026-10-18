---
parentDomain: notes
parentId: notes-android-7-1-nougat
documentId: developer-preview-1
locale: en
translationKey: android-7-1-nougat-developer-preview-1
slug: developer-preview-1
title: 'Android 7.1 Developer Preview 1: API 25 final'
summary: 19 October 2016. The first Nexus build of 7.1 came with API 25 already final, so developers could publish apps targeting it to Google Play the same day.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 1 brought Android 7.1 to Nexus devices on 19 October 2016,
two weeks after the Pixel launched with it. Because 7.1 had already shipped on
a phone, Google called this preview "beta quality" and said its goal was "to
tease out any device-specific issues".

|              |                                                                           |
| ------------ | ------------------------------------------------------------------------- |
| Release date | 19 October 2016                                                           |
| Build        | `NPF10C`                                                                  |
| Devices      | Nexus 5X, Nexus 6P and Pixel C, over the air through Android Beta         |
| API status   | Final: "We've finalized the new APIs as API Level 25"                     |
| Google Play  | Open to apps compiled against, and optionally targeting, API 25           |
| SDK          | API 25 platform and emulator images in Android Studio 2.2.2's SDK Manager |

Unlike the Android 7.0 previews, this one did not start with unstable APIs.
The API 25 SDK was final from the first build, so an app built against it
needed no rebuild for the release. Google recommended setting
`targetSdkVersion` to 25 to test "with compatibility behaviors disabled".

The preview shipped the developer features already on the Pixel: app
shortcuts, round icons and image keyboards. The Google APIs emulator image for
API 25 included the Pixel Launcher, to check round icons. The device images
included Messenger and Google Keyboard, which already used the image keyboard
API. Support library 25.0.0 came out with it, adding image keyboard support
back to API 13 and the `BottomNavigationView` widget.

On a Nexus 5X, 9to5Google found the Pixel's user-side changes too: an extra
tile in the top Quick Settings row, a Settings shortcut beside it, and a "Moves" screen
with the double-twist camera gesture. Round icons did not appear there, even
with the Pixel Launcher sideloaded. On 3 November Google added the preview to
Firebase Test Lab virtual devices, free until the end of 2016.
