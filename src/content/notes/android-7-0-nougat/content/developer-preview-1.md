---
parentDomain: notes
parentId: notes-android-7-0-nougat
documentId: developer-preview-1
locale: en
translationKey: android-7-0-nougat-developer-preview-1
slug: developer-preview-1
title: 'Android N Developer Preview 1: early on purpose'
summary: 9 March 2016. The first Android N build shipped months earlier than usual, with multi-window, Direct Reply and bundled notifications, and the new Android Beta Program.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google released the first Android N Developer Preview on 9 March 2016, two
months before Google I/O, where earlier previews had debuted. Dave Burke gave
the reason: an earlier build leaves more time for developer feedback and lets
Google hand the final release to device makers in the summer.

|              |                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------ |
| Release date | 9 March 2016                                                                                     |
| Builds       | `NPC56P`, `NPC56R`; updated later to `NPC56W`, `NPC56X`                                          |
| Devices      | Nexus 6, 5X, 6P, 9, Nexus Player, Pixel C, General Mobile 4G (Android One), and the SDK emulator |
| Status       | Developers only; not CTS approved, so apps that check for it (Android Pay) did not run           |

The same day Google opened the Android Beta Program at `g.co/androidbeta`.
Enrolling a supported device installed the preview over the air and kept it
updated, with no manual flashing.

## What the first preview opened up

- **Multi-window.** Apps targeting N set `android:resizableActivity` to run in
  split screen. A resize behaves like a rotation: the activity handles the
  configuration change or is recreated. TV apps get picture-in-picture with
  `android:supportsPictureInPicture`.
- **Notifications.** The `RemoteInput` API from Android Wear now works on
  phones and tablets, so users reply from the shade. `Notification.Builder.setGroup()`
  bundles an app's notifications.
- **Doze** now also saves battery whenever the screen is off, not only when the
  device is still. `JobScheduler` can react to content provider changes.
- **Java 8.** The Jack compiler brings lambdas to Android back to Gingerbread;
  default and static interface methods and streams need N.
- **JIT compiler.** Google's I/O post later named the new JIT compiler as a
  first-preview change: faster installs and less storage than compiling
  everything ahead of time.

Google's release notes called the build unfit for daily use: slow at times,
with worse battery life and some apps, Google's included, not working.
