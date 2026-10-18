---
parentDomain: notes
parentId: notes-android-17
documentId: beta-1
locale: en
translationKey: android-17-beta-1
slug: beta-1
title: 'Android 17 Beta 1: straight to beta'
summary: 13 February 2026. The first Android 17 build, with no Developer Preview before it, removed the large-screen orientation opt-out for apps targeting API 37.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 1 was the first Android 17 build Google gave developers, on
13 February 2026. No Developer Preview came before it: Google replaced that
phase with the Android Canary channel. Most of what later breaks on
`targetSdk 37` was already in this build.

|                    |                                                                                   |
| ------------------ | --------------------------------------------------------------------------------- |
| Release date       | 13 February 2026                                                                  |
| Build              | `CP21.260116.011` (`.A1` for Pixel 6, 6 Pro, 6a, 7 and 7 Pro; `.B1` for the rest) |
| Security patch     | 2026-01-05                                                                        |
| Devices            | Supported Pixel phones and tablets over the air; 64-bit Android Emulator images   |
| Platform stability | Not yet; Google targeted March                                                    |

Google calls the build "suitable for development, testing, and general use",
with the warning that the system and apps "might not always work as
expected". It reached Pixel phones two days later than planned: 9to5Google
reported a two-day delay before the rollout began on the 13th.

## Why there was no Developer Preview

Google's Beta 1 post says Android "has replaced the traditional 'Developer
Preview' with a continuous Canary channel". Features and APIs land in Canary
once they pass internal testing, Canary updates over the air, and the beta
starts closer to final. The same post set the year's plan: the Q2 release is
the only one with planned app-breaking behaviour changes, and a minor SDK
follows in Q4.

## Behaviour changes in Beta 1

- **Large screens.** Apps targeting API 37 on displays with a smallest width
  of 600dp or more can no longer opt out of resizing or orientation changes.
  `screenOrientation`, `setRequestedOrientation()`, `resizeableActivity`,
  `minAspectRatio` and `maxAspectRatio` are ignored there. Apps declaring
  `android:appCategory="game"` are exempt.
- **Fewer activity restarts.** `CONFIG_KEYBOARD`, `CONFIG_KEYBOARD_HIDDEN`,
  `CONFIG_NAVIGATION`, `CONFIG_TOUCHSCREEN`, `CONFIG_COLOR_MODE` and some
  `CONFIG_UI_MODE` changes no longer recreate the activity; it gets
  `onConfigurationChanged()`. `android:recreateOnConfigChanges` opts back in.
- **Lock-free `MessageQueue`** for apps targeting 37. Code that reflects on its
  private fields breaks.
- **`static final` is final.** Changing one by reflection throws
  `IllegalAccessException`; doing it through JNI crashes the app.
- **Custom notification views** get strict size limits for apps targeting 37,
  closing a loophole that used URIs to bypass the old ones.
- **Background audio.** Playback, focus requests and volume changes fail
  silently when the app is not in a valid lifecycle state. Beta 4 later
  narrowed this rule.
- **Cleartext traffic.** Google announced that `android:usesCleartextTraffic`
  is deprecated; the release notes say the deprecation takes effect with a
  future SDK level, and apps should move to a network security config.

## New APIs in Beta 1

- `ProfilingManager` triggers for cold start, OOM and excessive CPU use.
- `CameraCaptureSession.updateOutputConfigurations()` switches between photo
  and video without closing the session, and
  `LOGICAL_MULTI_CAMERA_ADDITIONAL_RESULTS` returns metadata from every active
  physical camera.
- H.266 (VVC) support for devices with a hardware decoder, and
  `MediaRecorder.setVideoEncodingQuality()` for constant-quality recording.
- A public Service Provider Interface for HPKE hybrid encryption.
- Medical device and fitness tracker profiles in `CompanionDeviceManager`,
  and `setExtraPermissions()` to fold nearby permissions into the pairing
  dialog.

Google's post also listed ART's generational garbage collector as an
Android 17 change. AOSP shows it was already on in Android 16 QPR2; see
"Worth knowing" in the overview above.
