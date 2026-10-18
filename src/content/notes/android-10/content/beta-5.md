---
parentDomain: notes
parentId: notes-android-10
documentId: beta-5
locale: en
translationKey: android-10-beta-5
slug: beta-5
title: 'Android Q Beta 5: tuning gesture navigation'
summary: 10 July 2019. Beta 5 brought system behaviour close to final and tuned gestures, with an Assistant corner swipe, a drawer peek and a plan for custom launchers.
order: 5
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 5 came out on 10 July 2019. Google said it brought the beta "very close
to the system behaviors you'll see in the final release"; the APIs had been
final since Beta 4.

|                    |                                                                    |
| ------------------ | ------------------------------------------------------------------ |
| Release date       | 10 July 2019                                                       |
| Build              | `QPP5.190530.014` (Pixel), July 2019 security patch                |
| Devices            | Pixel phones and emulator; partner devices "over the coming weeks" |
| How to get it      | Android Beta over the air, system images, or Generic System Images |
| Platform stability | Yes; final API 29                                                  |

Most of the changes were to gesture navigation. A swipe from either bottom
corner now opened the Assistant, with corner indicators Google was still
tuning. Apps with a navigation drawer got a "peek" when the user grabbed the
edge, on every version of `DrawerLayout` and best with 1.1.0-alpha02.

Custom launchers still had stability problems with gestures and Recents.
Google announced that from Beta 6 the system would switch users of a custom
launcher to 3-button navigation by default, and fix the rest in a
post-launch update. The post also said there would be one more beta before
the consumer launch.
