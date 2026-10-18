---
entryId: notes-android-13
locale: en
translationKey: android-13
slug: android-13
title: 'Android 13: notification and media permissions'
summary: API 33, August 2022. Notifications became a runtime permission, READ_EXTERNAL_STORAGE split into three media permissions, and a system photo picker needs no permission at all.
visibility: public
maturity: stable
publishedAt: 2026-10-17
topics: [android, platform-apis, security]
image: /banners/android-13.svg
imageAlt: 'Android 13 Tiramisu banner, with the version logo.'
links:
  - label: Android 13 features and APIs
    href: https://developer.android.com/about/versions/13/features
    kind: publication
  - label: 'Behavior changes: apps targeting Android 13'
    href: https://developer.android.com/about/versions/13/behavior-changes-13
    kind: publication
references: []
evidence: []
documents:
  - documentId: developer-preview-1
    slug: developer-preview-1
    order: 1
  - documentId: developer-preview-2
    slug: developer-preview-2
    order: 2
  - documentId: beta-1
    slug: beta-1
    order: 3
  - documentId: beta-2
    slug: beta-2
    order: 4
  - documentId: beta-3
    slug: beta-3
    order: 5
  - documentId: beta-4
    slug: beta-4
    order: 6
protection: { mode: public }
kind: article
lifecycle: current
series:
  id: android-versions
  order: 15
citations:
  - title: 'Android 13 emblem — Wikimedia Commons (PD-textlogo, trademark of Google LLC)'
    url: https://commons.wikimedia.org/wiki/File:Android_13_Developer_Preview_logo.svg
    accessedAt: 2026-10-17
  - title: Android 13 features and APIs
    url: https://developer.android.com/about/versions/13/features
    accessedAt: 2026-10-17
  - title: 'Behavior changes: all apps (Android 13)'
    url: https://developer.android.com/about/versions/13/behavior-changes-all
    accessedAt: 2026-10-17
  - title: 'Behavior changes: apps targeting Android 13'
    url: https://developer.android.com/about/versions/13/behavior-changes-13
    accessedAt: 2026-10-17
  - title: Set up the Android 13 SDK
    url: https://developer.android.com/about/versions/13/setup-sdk
    accessedAt: 2026-10-17
  - title: Notification runtime permission
    url: https://developer.android.com/develop/ui/views/notifications/notification-permission
    accessedAt: 2026-10-17
  - title: Photo picker
    url: https://developer.android.com/training/data-storage/shared/photopicker
    accessedAt: 2026-10-17
  - title: Per-app language preferences
    url: https://developer.android.com/guide/topics/resources/app-languages
    accessedAt: 2026-10-17
  - title: Copy and paste
    url: https://developer.android.com/develop/ui/views/touch-and-input/copy-paste
    accessedAt: 2026-10-17
  - title: Intents and intent filters
    url: https://developer.android.com/guide/components/intents-filters
    accessedAt: 2026-10-17
  - title: Schedule alarms
    url: https://developer.android.com/develop/background-work/services/alarms
    accessedAt: 2026-10-17
  - title: Context reference (revokeSelfPermissionsOnKill)
    url: https://developer.android.com/reference/android/content/Context
    accessedAt: 2026-10-17
  - title: PackageInstaller reference (PACKAGE_SOURCE_*)
    url: https://developer.android.com/reference/android/content/pm/PackageInstaller
    accessedAt: 2026-10-17
  - title: Build.VERSION_CODES reference
    url: https://developer.android.com/reference/android/os/Build.VERSION_CODES
    accessedAt: 2026-10-17
  - title: Add support for predictive back
    url: https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture
    accessedAt: 2026-10-17
  - title: Schedule exact alarms are denied by default (Android 14)
    url: https://developer.android.com/about/versions/14/changes/schedule-exact-alarms
    accessedAt: 2026-10-17
  - title: Grant partial access to photos and videos (Android 14)
    url: https://developer.android.com/about/versions/14/changes/partial-photo-video-access
    accessedAt: 2026-10-17
  - title: 'Behavior changes: apps targeting Android 14'
    url: https://developer.android.com/about/versions/14/behavior-changes-14
    accessedAt: 2026-10-17
  - title: Android 13 and Android 13 QPR release notes (AOSP)
    url: https://source.android.com/docs/setup/about/android-13-release
    accessedAt: 2026-10-17
  - title: Security enhancements (AOSP)
    url: https://source.android.com/docs/security/enhancements
    accessedAt: 2026-10-17
  - title: Android 13 Compatibility Definition (AOSP)
    url: https://source.android.com/docs/compatibility/13/android-13-cdd
    accessedAt: 2026-10-17
  - title: Android 15 Compatibility Definition (AOSP)
    url: https://source.android.com/docs/compatibility/15/android-15-cdd
    accessedAt: 2026-10-17
  - title: Codenames, tags, and build numbers (AOSP)
    url: https://source.android.com/docs/setup/reference/build-numbers
    accessedAt: 2026-10-17
  - title: Build.java at android-13.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-13.0.0_r1/core/java/android/os/Build.java
    accessedAt: 2026-10-17
  - title: ClipboardService.java at android-13.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-13.0.0_r1/services/core/java/com/android/server/clipboard/ClipboardService.java
    accessedAt: 2026-10-17
  - title: InstallPackageHelper.java at android-13.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-13.0.0_r1/services/core/java/com/android/server/pm/InstallPackageHelper.java
    accessedAt: 2026-10-17
  - title: RestrictedPreferenceHelper.java at android-13.0.0_r1 (AOSP Settings)
    url: https://android.googlesource.com/platform/packages/apps/Settings/+/refs/tags/android-13.0.0_r1/src/com/android/settings/accessibility/RestrictedPreferenceHelper.java
    accessedAt: 2026-10-17
  - title: RestrictedSwitchPreference.java at android-13.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-13.0.0_r1/packages/SettingsLib/src/com/android/settingslib/RestrictedSwitchPreference.java
    accessedAt: 2026-10-17
  - title: PlatLogoActivity.java at android-13.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-13.0.0_r1/core/java/com/android/internal/app/PlatLogoActivity.java
    accessedAt: 2026-10-17
  - title: Android 13 is in AOSP!
    url: https://android-developers.googleblog.com/2022/08/android-13-is-in-aosp.html
    accessedAt: 2026-10-17
  - title: First preview of Android 13
    url: https://android-developers.googleblog.com/2022/02/first-preview-android-13.html
    accessedAt: 2026-10-17
  - title: 'Lucky number Android 13: The latest features and updates (The Keyword)'
    url: https://blog.google/products/android/android-13/
    accessedAt: 2026-10-17
  - title: 'The latest and greatest: meet Pixel 7 and Pixel 7 Pro (The Keyword)'
    url: https://blog.google/products-and-platforms/devices/pixel/pixel-7-pixel-7-pro/
    accessedAt: 2026-10-17
  - title: Pixel phone hardware tech specs
    url: https://support.google.com/pixelphone/answer/7158570
    accessedAt: 2026-10-17
  - title: Learn about restricted settings (Android Help)
    url: https://support.google.com/android/answer/12623953
    accessedAt: 2026-10-17
  - title: Target API level requirements for Google Play apps (archived 16 March 2023)
    url: https://web.archive.org/web/20230316194303/https://support.google.com/googleplay/android-developer/answer/11926878?hl=en
    accessedAt: 2026-10-17
  - title: Target API level requirements for Google Play apps (archived 16 October 2023)
    url: https://web.archive.org/web/20231016070924/https://support.google.com/googleplay/android-developer/answer/11926878?hl=en
    accessedAt: 2026-10-17
  - title: 'Android 13 review: Plans for the future, but not much to offer today (Ars Technica)'
    url: https://arstechnica.com/gadgets/2022/08/android-13-review-plans-for-the-future-but-not-much-to-offer-today/
    accessedAt: 2026-10-17
  - title: Google releases Android 13 for Pixel phones (MobileSyrup)
    url: https://mobilesyrup.com/2022/08/15/google-releases-android-13-pixel-phones/
    accessedAt: 2026-10-17
  - title: Android 13 Easter egg (9to5Google)
    url: https://9to5google.com/2022/06/27/android-13-easter-egg/
    accessedAt: 2026-10-17
  - title: Android 13 restricted setting blocks sideloaded apps from notifications (Chrome Unboxed)
    url: https://chromeunboxed.com/android-13-restricted-setting-feature-blocks-sideloaded-apps-from-notifications/
    accessedAt: 2026-10-17
  - title: Android 15 sideloaded apps restrictions (9to5Google)
    url: https://9to5google.com/2024/09/12/android-15-sideloaded-apps-restrictions/
    accessedAt: 2026-10-17
  - title: Android Developers content license
    url: https://developer.android.com/license
    accessedAt: 2026-10-17
  - title: 'Android 13 home screen screenshot — Wikimedia Commons (Free screenshot, Apache 2.0)'
    url: https://commons.wikimedia.org/wiki/File:Android_13_Homescreen_Screenshot.png
    accessedAt: 2026-10-18
  - title: ScanResult reference (WIFI_STANDARD_11BE)
    url: https://developer.android.com/reference/android/net/wifi/ScanResult
    accessedAt: 2026-10-18
  - title: Android 13 Developer Preview 2
    url: https://android-developers.googleblog.com/2022/03/second-preview-android-13.html
    accessedAt: 2026-10-18
  - title: 'The Beta for Android 13 is out now: Android 13 Beta 1'
    url: https://android-developers.googleblog.com/2022/04/android-13-beta-1-blog.html
    accessedAt: 2026-10-18
  - title: Second Beta of Android 13
    url: https://android-developers.googleblog.com/2022/05/second-beta-of-android-13.html
    accessedAt: 2026-10-18
  - title: Android 13 Beta 3 and Platform Stability
    url: https://android-developers.googleblog.com/2022/06/android-13-beta-3-platform-stability.html
    accessedAt: 2026-10-18
  - title: 'Final Android 13 Beta update, official release is next!'
    url: https://android-developers.googleblog.com/2022/07/Final-Android-13-Beta-update-official-release-is-next.html
    accessedAt: 2026-10-18
  - title: 'Android 13 release notes, Developer Preview 1 to Beta 4.1 (archived 13 August 2022)'
    url: https://web.archive.org/web/20220813171935/https://developer.android.com/about/versions/13/release-notes
    accessedAt: 2026-10-18
  - title: 'Android 13 gets accelerated release timeline with earlier betas (9to5Google)'
    url: https://9to5google.com/2022/02/10/android-13-timeline/
    accessedAt: 2026-10-18
  - title: 'Google releases Android 13 DP2 for Pixel phones (9to5Google)'
    url: https://9to5google.com/2022/03/17/android-13-dp2-release/
    accessedAt: 2026-10-18
  - title: 'Google rolling out Android 13 Beta 1 for Pixel phones (9to5Google)'
    url: https://9to5google.com/2022/04/26/android-13-beta-1-pixel-launch/
    accessedAt: 2026-10-18
  - title: 'Android 13 Beta 2 hands-on: Top new features (9to5Google)'
    url: https://9to5google.com/2022/05/11/android-13-beta-2/
    accessedAt: 2026-10-18
  - title: 'Google releases Android 13 Beta 3 for Pixel phones (9to5Google)'
    url: https://9to5google.com/2022/06/08/android-13-beta-3-pixel-launch/
    accessedAt: 2026-10-18
  - title: 'Google rolling out Android 13 Beta 4 for Pixel (9to5Google)'
    url: https://9to5google.com/2022/07/13/android-13-beta-4-pixel-launch/
    accessedAt: 2026-10-18
---

Android 13 is the release where an app had to ask before it could send a
notification. It also split the storage permission into images, video and
audio, and shipped a photo picker that needs no permission. For developers the
rest was a short list: per-app languages, themed icons, and stricter intent
delivery.

## At a glance

|                                 |                                                                    |
| ------------------------------- | ------------------------------------------------------------------ |
| Version                         | Android 13                                                         |
| API level                       | 33                                                                 |
| Name                            | Tiramisu, internal, but visible in the SDK constant                |
| `Build.VERSION_CODES`           | `TIRAMISU`                                                         |
| Release                         | Source in AOSP and Pixel rollout from 15 August 2022               |
| Launch devices                  | Pixel 7 and Pixel 7 Pro, announced 6 October 2022                  |
| Google Play target-API deadline | New apps and app updates from 31 August 2023 (extensions to 1 Nov) |

Google pushed Android 13 to AOSP and began the Pixel rollout on 15 August 2022.
Its announcement named Samsung, Asus, HMD, Motorola, OnePlus, OPPO, Sony,
Xiaomi and others for later that year. Google's first phones sold with it were
the Pixel 7 and Pixel 7 Pro, announced on 6 October and in US stores from
13 October.

The public name is just Android 13. Tiramisu is the internal dessert name, and
from this release it is no longer hidden: the constant is `TIRAMISU`, not a
single letter, and Android Studio's SDK Manager lists the platform as
"Android 13.0 ("Tiramisu")". Build IDs start with T (`TP1A`).

Google announced Android 13 with Developer Preview 1 on 10 February 2022.
Beta 1 followed on 26 April, and Beta 3 reached platform stability on 8 June,
freezing the API 33 SDK and app-facing behaviour. The two developer previews
and four betas are the parts below this overview.

![A phone home screen with a dark wallpaper and a pale blue wave at the top, the date at the top left, five round app icons in the dock and a Google search bar below them](./assets/android-13-home-screen.png 'The Android 13 home screen, captured from the Android Emulator. Wikimedia Commons · Apache 2.0')

## What it brought

- **Per-app languages.** Users pick a language per app in "App languages",
  while the system stays in another. An app declares
  `android:localeConfig` to appear there and can set the language itself with
  `LocaleManager.setApplicationLocales()`. AppCompat 1.6 backports the API.
- **Themed app icons.** An app that adds a monochrome layer to its adaptive
  icon gets tinted to match the wallpaper, when the user turns on "Themed
  icons" and the launcher supports it. Ars Technica noted that the feature was
  still in beta at launch.
- **Clipboard preview.** Copying shows a small confirmation with a preview of
  the content, like a screenshot thumbnail; tapping it opens an editor.
- **Foreground Services Task Manager.** The bottom of Quick Settings shows how
  many apps run a foreground service, with a "Stop" button for each.
- **Quick Settings placement API.** An app can ask the user, in one system
  dialog, to add its custom tile.
- **Media controls.** For apps targeting 33, the system builds the media player
  buttons from `PlaybackState` actions instead of the notification's action
  list.
- **Audio.** Built-in Bluetooth LE Audio on compatible devices, MIDI 2.0 over
  USB, spatial audio with head tracking, and `AudioManager` APIs that tell an
  app how its audio will be routed.
- **Graphics and text.** `RuntimeShader` with AGSL, COLRv1 vector emoji, up to
  200% faster hyphenation, better line heights for non-Latin scripts, and
  phrase-based Japanese line breaks.
- **Runtime.** JNI calls up to 2.5x faster, mostly non-blocking reference
  processing, and a first set of OpenJDK 11 library APIs (`String.strip()`,
  `Optional.isEmpty()` and more), also sent to Android 12 through the ART
  module. A garbage collector built on the kernel's `userfaultfd` was not in
  the release: Google said it would reach Android 13 devices in a later
  Google Play system update.
- **Wi-Fi 7.** `ScanResult.WIFI_STANDARD_11BE`, new in API 33, lets an app
  tell 802.11be access points apart in scan results. Whether a phone connects
  over Wi-Fi 7 depends on its hardware.
- **Predictive back.** New APIs let an app say ahead of time that it handles
  back, so the system can preview the destination. In Android 13 the animation
  is only behind a developer option.
- **Tablets.** It builds on [Android 12L](/notes/android-12l/): a taskbar
  with an app drawer, and multi-window enabled for all apps on large screens.

## Security and privacy

- **Photo picker.** A system screen where the user picks specific photos or
  videos, and only those reach the app. The app declares no permission. The
  same picker reached Android 11 and 12 through a Google Play system update.
- **Clipboard auto-clear.** The clipboard is wiped a while after the last
  copy. In AOSP the default is `3600000` ms, one hour, adjustable by the
  device through `DeviceConfig`. Apps that copy passwords should set
  `ClipDescription.EXTRA_IS_SENSITIVE` so the preview hides the content.
- **Restricted settings.** An app installed from a local or downloaded file
  cannot be granted accessibility or notification listener access until the
  user opens its App info page and picks "Allow restricted settings". AOSP
  sets this on installs whose source is `PACKAGE_SOURCE_LOCAL_FILE` or
  `PACKAGE_SOURCE_DOWNLOADED_FILE`, so installs made by an app store are not
  flagged.
- **Intent matching.** An exported component of an app targeting 33 only
  receives intents from other apps that match one of its `<intent-filter>`
  elements. See below for what to change.
- **Exported receivers.** `registerReceiver()` takes `RECEIVER_EXPORTED` or
  `RECEIVER_NOT_EXPORTED`, so a runtime receiver no longer has to be open to
  every app.
- **Platform.** Device log access needs the user's approval on each request.
  The Android Virtualization Framework (pKVM) arrives as an optional feature
  for isolated workloads. APK Signature Scheme v3.1 lets key rotation target
  Android 13 and later only. Keystore and KeyMint report errors as typed
  exceptions that say whether a retry can help. Bluetooth and Ultra-wideband
  became Mainline modules, so Google can update them through Google Play
  system updates.

## Permissions

New runtime permissions in Android 13:

| Permission                                                  | Replaces or extends                                   | Granted by                              |
| ----------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------- |
| `POST_NOTIFICATIONS`                                        | Notifications were on by default                      | Runtime dialog                          |
| `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `READ_MEDIA_AUDIO` | `READ_EXTERNAL_STORAGE` for other apps' media         | Runtime dialog                          |
| `NEARBY_WIFI_DEVICES`                                       | `ACCESS_FINE_LOCATION` for Wi-Fi scanning and connect | Runtime dialog (`NEARBY_DEVICES` group) |
| `BODY_SENSORS_BACKGROUND`                                   | Extends `BODY_SENSORS` to the background              | Hard-restricted; installer allowlist    |

The notification permission reaches every app, but how depends on the target:

```mermaid title="When the notification dialog appears on Android 13"
flowchart TD
  start([App on an Android 13 device]) --> upgraded{Installed before the upgrade?}
  upgraded -- yes, notifications were on --> pre[Pre-granted, no dialog]
  upgraded -- no, fresh install --> target{targetSdkVersion}
  target -- 33 or higher --> own[App requests POST_NOTIFICATIONS when it chooses]
  target -- 32 or lower --> sys[System asks after the first notification channel is created]
  sys -- Don't allow --> stuck[No new dialog until reinstall or target 33]
```

Media sessions and apps that self-manage calls (`Notification.CallStyle`) are
exempt. Foreground services can still start without the permission, but their
notification only shows in the Task Manager.

![A system dialog titled Allow My App to access music and other audio files on this device, with Allow and Don't allow buttons](./assets/read-media-audio-dialog.png 'The READ_MEDIA_AUDIO dialog in Android 13. Android Developers · CC BY 2.5')

Images and video share one dialog if requested together. An app that held
`READ_EXTERNAL_STORAGE` gets the new media permissions automatically when it
updates its target.

Two more changes:

- **Exact alarms.** `USE_EXACT_ALARM` is granted at install and cannot be
  revoked, but it is meant only for alarm clocks, timers and calendars, and a
  Google Play policy restricts it to them. Everyone else keeps `SCHEDULE_EXACT_ALARM`, which the user can
  revoke.
- **Giving permissions back.** `Context.revokeSelfPermissionsOnKill()` lets an
  app drop runtime permissions it no longer needs. It takes effect when the
  app's processes are killed, not while it is in the foreground.

## What changed for your app

### All apps on Android 13

| Change                                                                                                 | What to do                                                                       |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| New installs start with notifications off                                                              | Target 33 and ask for `POST_NOTIFICATIONS` in context                            |
| The clipboard shows a preview of copied content                                                        | Set `EXTRA_IS_SENSITIVE` on passwords and card numbers; drop your own copy toast |
| Users can stop a foreground service from the Task Manager                                              | Handle being stopped like a user force-stop                                      |
| Foreground service notifications can be swiped away                                                    | Do not rely on the notification staying visible                                  |
| Prefetch jobs run before the predicted next launch                                                     | Check that `setPrefetch()` work still runs when you expect                       |
| An app the user restricts for battery cannot start foreground services; its jobs and alarms do not run | Test with `adb shell cmd appops set <package> RUN_ANY_IN_BACKGROUND ignore`      |
| High-priority FCM that never shows a notification is downgraded                                        | Send normal priority when no notification follows                                |
| The Google app's speech service trampoline is gone                                                     | Use the device's default `SpeechService`, not a hard-coded package               |

### Apps targeting API 33

| Change                                                          | What to do                                                                                    |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| You control when the notification dialog appears                | Request `POST_NOTIFICATIONS` after a user action, not at launch                               |
| `READ_EXTERNAL_STORAGE` no longer gives access to others' media | Request `READ_MEDIA_*`, or use the photo picker for images and video                          |
| Wi-Fi APIs require `NEARBY_WIFI_DEVICES`                        | Declare it with `android:usesPermissionFlags="neverForLocation"` if you never derive location |
| Intents from other apps must match your `<intent-filter>`       | Check exported components; a sender gets `ActivityNotFoundException` on no match              |
| Background body sensor access needs `BODY_SENSORS_BACKGROUND`   | Request it after `BODY_SENSORS`                                                               |
| Advertising ID is zeros without `AD_ID`                         | Declare `com.google.android.gms.permission.AD_ID` if you use it                               |
| `BluetoothAdapter.enable()` and `disable()` return false        | Send the user to Bluetooth settings                                                           |
| `WebView.setForceDark()` is a no-op                             | Let `isLightTheme` drive `prefers-color-scheme`; use `setAlgorithmicDarkeningAllowed()`       |
| No `BOOT_COMPLETED` while the user restricts your battery use   | Do not depend on it for restricted apps                                                       |

Intent matching is not enforced for components without any intent filter,
intents from inside the same app, and intents from the system or root.

![Two Quick Settings screens: the first has a button reading 1 at the bottom; tapping it opens an Active apps list with a Stop button next to an app](./assets/fgs-task-manager.png 'The Foreground Services Task Manager in Quick Settings. Android Developers · CC BY 2.5')

## What lasted

- **Granular media access** stayed, and Android 14 narrowed it further:
  `READ_MEDIA_VISUAL_USER_SELECTED` lets the user share only some photos.
- **Exact alarms.** From Android 14, `SCHEDULE_EXACT_ALARM` is denied by
  default for most new installs of apps targeting 33 or higher, which pushes
  apps to `USE_EXACT_ALARM` or inexact alarms.
- **Exported receivers.** The flag that was optional here became mandatory for
  context-registered receivers in apps targeting Android 14.
- **Restricted settings** grew. The Android 15 CDD requires them for device
  admin, display over other apps, usage access, the dialer and SMS roles and
  SMS permissions, besides accessibility and notification listeners.
- **Predictive back** left the developer option in Android 15, for apps that
  opted in.
- The **photo picker** now also reaches Android 4.4 to 10 as a backported
  module through Google Play services.

## Worth knowing

- The Easter egg reuses Android 12's clock; its unlock setting is still called
  `egg_mode_s`. Set the hands to 1:00 and the code logs `"13:00"` before
  bubbles in Material You colours fill the screen. A long press cycles through
  14 emoji sets, from fruit to zodiac signs.
- One set never shipped. AOSP keeps it commented out with the note
  "this one is too much".
- `TIRAMISU` is the first constant spelled out as a dessert since Android
  5.1's `LOLLIPOP_MR1`; 6.0 to 12L used letters. In AOSP its comment is one
  word: "Tiramisu."
- Google first set the API 33 deadline as 1 August 2023 for new apps and
  1 November 2023 for updates. It then moved both to 31 August, "unifying the
  dates to August 31 every year".
