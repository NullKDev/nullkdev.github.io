---
parentDomain: notes
parentId: notes-android-10
documentId: beta-6
locale: en
translationKey: android-10-beta-6
slug: beta-6
title: 'Android Q Beta 6: the release candidate'
summary: 7 August 2019. The last beta, a release candidate with final behaviour, capped the Back gesture exclusion at 200dp and added a Back sensitivity setting.
order: 6
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 6, "the last Beta update", came out on 7 August 2019. The release notes
called it "a release candidate build of Android Q" with "final system
behaviors". Android 10 shipped to Pixel phones and AOSP on 3 September 2019.

|                    |                                                                    |
| ------------------ | ------------------------------------------------------------------ |
| Release date       | 7 August 2019                                                      |
| Build              | `QPP6.190730.005` (Pixel), August 2019 security patch              |
| Devices            | Pixel phones and emulator; partner devices "over the coming weeks" |
| How to get it      | Android Beta over the air, system images, or Generic System Images |
| Platform stability | Yes; final API 29 and final system behaviour                       |

The gesture changes affected apps directly. Google set "a 200dp vertical app
exclusion limit for the Back gesture", which caps how much of the screen edge
an app can claim for its own gestures. Users got a sensitivity
setting for the Back gesture. The developer option that turned off the block
on background activity starts was removed. 9to5Google also noticed the
gesture bar was now hidden on the home screen.

Google's last request was the same as since Beta 4: test the current app on
Android Q and publish the compatible update before the consumer release.
