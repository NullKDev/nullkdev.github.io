---
parentDomain: notes
parentId: notes-android-13
documentId: beta-1
locale: en
translationKey: android-13-beta-1
slug: beta-1
title: 'Android 13 Beta 1: granular media permissions'
summary: 26 April 2022. The first beta opened Android Beta before Google I/O and split READ_EXTERNAL_STORAGE into READ_MEDIA_IMAGES, READ_MEDIA_VIDEO and READ_MEDIA_AUDIO.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 1 came out on 26 April 2022, two weeks before Google I/O, where betas
had usually started. It opened Android Beta, so early adopters could enrol a
Pixel and get the build over the air.

|                    |                                                                    |
| ------------------ | ------------------------------------------------------------------ |
| Release date       | 26 April 2022                                                      |
| Build              | `TPB1.220310.029`                                                  |
| Security patch     | April 2022                                                         |
| Devices            | Pixel 4 to Pixel 6 Pro; Android Emulator; GSI                      |
| How to get it      | OTA through Android Beta, or flash; preview devices updated by OTA |
| Platform stability | No; still expected in June                                         |

- **Granular media permissions.** `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO` and
  `READ_MEDIA_AUDIO` replaced `READ_EXTERNAL_STORAGE` for shared media in apps
  targeting 13. Images and video requested together share one dialog.
- **Keystore and KeyMint errors.** New exceptions under
  `java.security.ProviderException` carry the KeyMint error code and say
  whether a retry can help.
- **Audio routing.** `AudioManager.getAudioDevicesForAttributes()` and
  `getDirectProfilesForAttributes()` tell a media app where its audio will go
  and whether it can play directly.
- **Media controls** started to come from `PlaybackState` actions, and the
  legacy copy of the Google app's speech service was removed.
