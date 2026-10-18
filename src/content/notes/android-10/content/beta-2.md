---
parentDomain: notes
parentId: notes-android-10
documentId: beta-2
locale: en
translationKey: android-10-beta-2
slug: beta-2
title: 'Android Q Beta 2: bubbles and foldables'
summary: 3 April 2019. Beta 2 turned scoped storage on for new installs, added the bubbles API, a foldable emulator in Android Studio 3.5 canary and a microphone direction API.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 2 came out on 3 April 2019 for every Pixel and the emulator, with the
April 2019 security patch. Burke wrote that developers had sent "thousands of
bug reports" since Beta 1, and warned to "expect rough edges".

|                    |                                                                    |
| ------------------ | ------------------------------------------------------------------ |
| Release date       | 3 April 2019; a patch build followed later in April                |
| Build              | `QPP2.190228.021`; patch `QPP2.190228.023`                         |
| Devices            | All Pixel phones from the first generation on; Android Emulator    |
| How to get it      | Over the air through Android Beta, or by flashing the system image |
| Platform stability | No; APIs still changing                                            |

Scoped storage was now on by default for new app installs, and for installs
and restores after a full device reset, so testers would see what broke.
Google warned of issues with apps that access photos, videos and other
files, such as when browsing or sharing in social media apps.

Beta 2 added bubbles: a notification carries a `BubbleMetadata` set with
`setBubbleMetadata()`, which names the activity shown inside the bubble. The
sharesheet could now show a preview of the content from `EXTRA_TITLE` or the
intent's `ClipData`. A new `MicrophoneDirection` API let a selfie video ask
for the front microphone with `setMicrophoneDirection(MIC_DIRECTION_FRONT)`
and control a zoomable microphone with `setMicrophoneFieldDimension()`. The
canary build of Android Studio 3.5 added foldable virtual devices of 7.3 and
8 inches, using the Beta 2 system image.

Two Beta 1 defaults moved back. `android:extractNativeLibs` returned to
`true`. With the patch build, the execute-only memory restriction applied only
to apps targeting an API level above 28, instead of 26 and above. Google also
made "a few minor updates" to the non-SDK interface lists.
