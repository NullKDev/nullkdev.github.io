---
entryId: notes-android-14
locale: en
translationKey: android-14
slug: android-14
title: 'Android 14: typed services, selected photos'
summary: API 34, October 2023. Apps targeting below 23 stopped installing, users could share only the photos they picked, and every foreground service needed a declared type.
visibility: public
maturity: stable
publishedAt: 2026-10-17
topics: [android, platform-apis, security]
image: /banners/android-14.svg
imageAlt: 'Android 14 Upside Down Cake banner, with the version logo.'
links:
  - label: Android 14 features and APIs
    href: https://developer.android.com/about/versions/14/features
    kind: publication
  - label: 'Behavior changes: apps targeting Android 14'
    href: https://developer.android.com/about/versions/14/behavior-changes-14
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
  - documentId: beta-5
    slug: beta-5
    order: 7
protection: { mode: public }
kind: article
lifecycle: current
series:
  id: android-versions
  order: 16
citations:
  - title: 'Android 14 emblem — Wikimedia Commons (AOSP licence, trademark of Google LLC)'
    url: https://commons.wikimedia.org/wiki/File:Android_14_official_logo.svg
    accessedAt: 2026-10-17
  - title: Android 14 features and APIs
    url: https://developer.android.com/about/versions/14/features
    accessedAt: 2026-10-17
  - title: 'Behavior changes: all apps (Android 14)'
    url: https://developer.android.com/about/versions/14/behavior-changes-all
    accessedAt: 2026-10-17
  - title: 'Behavior changes: apps targeting Android 14'
    url: https://developer.android.com/about/versions/14/behavior-changes-14
    accessedAt: 2026-10-17
  - title: Foreground service types are required (Android 14)
    url: https://developer.android.com/about/versions/14/changes/fgs-types-required
    accessedAt: 2026-10-17
  - title: Foreground service types
    url: https://developer.android.com/develop/background-work/services/fgs/service-types
    accessedAt: 2026-10-17
  - title: Grant partial access to photos and videos
    url: https://developer.android.com/about/versions/14/changes/partial-photo-video-access
    accessedAt: 2026-10-17
  - title: Schedule exact alarms are denied by default
    url: https://developer.android.com/about/versions/14/changes/schedule-exact-alarms
    accessedAt: 2026-10-17
  - title: Data safety information is more visible
    url: https://developer.android.com/about/versions/14/changes/data-safety
    accessedAt: 2026-10-17
  - title: Detect when users take device screenshots
    url: https://developer.android.com/about/versions/14/features/screenshot-detection
    accessedAt: 2026-10-17
  - title: View.setAccessibilityDataSensitive reference
    url: https://developer.android.com/reference/android/view/View#setAccessibilityDataSensitive(int)
    accessedAt: 2026-10-17
  - title: CredentialManager reference
    url: https://developer.android.com/reference/android/credentials/CredentialManager
    accessedAt: 2026-10-17
  - title: 'Behavior changes: all apps (Android 15)'
    url: https://developer.android.com/about/versions/15/behavior-changes-all
    accessedAt: 2026-10-17
  - title: 'Behavior changes: apps targeting Android 15'
    url: https://developer.android.com/about/versions/15/behavior-changes-15
    accessedAt: 2026-10-17
  - title: Android 14 release notes (AOSP)
    url: https://source.android.com/docs/setup/about/android-14-release
    accessedAt: 2026-10-17
  - title: Security enhancements (AOSP)
    url: https://source.android.com/docs/security/enhancements
    accessedAt: 2026-10-17
  - title: Codenames, tags, and build numbers (AOSP)
    url: https://source.android.com/docs/setup/reference/build-numbers
    accessedAt: 2026-10-17
  - title: Build.java at android-14.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r1/core/java/android/os/Build.java
    accessedAt: 2026-10-17
  - title: PlatLogoActivity.java at android-14.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r1/core/java/com/android/internal/app/PlatLogoActivity.java
    accessedAt: 2026-10-17
  - title: EasterEgg AndroidManifest.xml at android-14.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r1/packages/EasterEgg/AndroidManifest.xml
    accessedAt: 2026-10-17
  - title: landroid MainActivity.kt at android-14.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r1/packages/EasterEgg/src/com/android/egg/landroid/MainActivity.kt
    accessedAt: 2026-10-17
  - title: landroid Universe.kt at android-14.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r1/packages/EasterEgg/src/com/android/egg/landroid/Universe.kt
    accessedAt: 2026-10-17
  - title: Android 14 is live in AOSP
    url: https://android-developers.googleblog.com/2023/10/android-14-is-live-in-aosp.html
    accessedAt: 2026-10-17
  - title: The first Developer Preview of Android 14
    url: https://android-developers.googleblog.com/2023/02/first-developer-preview-android14.html
    accessedAt: 2026-10-17
  - title: 'Android 14: More customization, control and accessibility features (The Keyword)'
    url: https://blog.google/products/android/android-14/
    accessedAt: 2026-10-17
  - title: Meet Pixel 8 and Pixel 8 Pro, our newest phones (The Keyword)
    url: https://blog.google/products/pixel/google-pixel-8-pro/
    accessedAt: 2026-10-17
  - title: Target API level requirements for Google Play apps (archived 8 August 2024)
    url: https://web.archive.org/web/20240808012229/https://support.google.com/googleplay/android-developer/answer/11926878
    accessedAt: 2026-10-17
  - title: 'Android 14 review: Predictable progress (Android Police)'
    url: https://www.androidpolice.com/android-14-review/
    accessedAt: 2026-10-17
  - title: Android 14 gets official internal codename 'Upside Down Cake' (9to5Google)
    url: https://9to5google.com/2022/04/22/android-14-gets-official-internal-codename-upside-down-cake/
    accessedAt: 2026-10-17
  - title: Android 14 Easter egg is a space minigame (9to5Google)
    url: https://9to5google.com/2023/07/11/android-14-easter-egg-minigame/
    accessedAt: 2026-10-17
  - title: Android Developers content license
    url: https://developer.android.com/license
    accessedAt: 2026-10-17
  - title: 'Android 14 home screen screenshot — Wikimedia Commons (free screenshot, Apache 2.0)'
    url: https://commons.wikimedia.org/wiki/File:Android_14_Homescreen_screenshot.png
    accessedAt: 2026-10-18
  - title: Android 14 Developer Preview 2
    url: https://android-developers.googleblog.com/2023/03/android-14-developer-preview-2.html
    accessedAt: 2026-10-18
  - title: Android 14 Beta 1
    url: https://android-developers.googleblog.com/2023/04/android-14-beta-1.html
    accessedAt: 2026-10-18
  - title: Second Beta of Android 14
    url: https://android-developers.googleblog.com/2023/05/android-14-beta-2.html
    accessedAt: 2026-10-18
  - title: Android 14 Beta 3 and Platform Stability
    url: https://android-developers.googleblog.com/2023/06/android-14-beta-3-and-platform-stability.html
    accessedAt: 2026-10-18
  - title: Android 14 Beta 4
    url: https://android-developers.googleblog.com/2023/07/android-14-beta-4.html
    accessedAt: 2026-10-18
  - title: Android 14 Beta 5
    url: https://android-developers.googleblog.com/2023/08/android-14-beta-5.html
    accessedAt: 2026-10-18
  - title: Android 14 release notes (archived 7 September 2023)
    url: https://web.archive.org/web/20230907134037/https://developer.android.com/about/versions/14/release-notes
    accessedAt: 2026-10-18
  - title: Configure a device as a webcam (AOSP)
    url: https://source.android.com/docs/core/camera/webcam
    accessedAt: 2026-10-18
  - title: Google launches Android 14 Developer Preview for Pixel (9to5Google)
    url: https://9to5google.com/2023/02/08/android-14-developer-preview-pixel/
    accessedAt: 2026-10-18
  - title: Google rolling out Android 14 Developer Preview 2 (9to5Google)
    url: https://9to5google.com/2023/03/08/android-14-developer-preview-2/
    accessedAt: 2026-10-18
  - title: Google rolling out Android 14 Beta 1 for Pixel (9to5Google)
    url: https://9to5google.com/2023/04/12/android-14-beta-1-pixel/
    accessedAt: 2026-10-18
  - title: Android 14 Beta 2 for Pixel phones rolling out (9to5Google)
    url: https://9to5google.com/2023/05/10/android-14-beta-2-pixel/
    accessedAt: 2026-10-18
  - title: Android 14 Beta 3 for Pixel phones rolling out, 7a included (9to5Google)
    url: https://9to5google.com/2023/06/07/android-14-beta-3-pixel/
    accessedAt: 2026-10-18
  - title: Google rolling out Android 14 Beta 4, Pixel Tablet and Fold included (9to5Google)
    url: https://9to5google.com/2023/07/11/android-14-beta-4-pixel/
    accessedAt: 2026-10-18
  - title: Google rolling out Android 14 Beta 5 to Pixel (9to5Google)
    url: https://9to5google.com/2023/08/10/android-14-beta-5-pixel/
    accessedAt: 2026-10-18
---

Android 14 is the release that made apps say why they run. Every foreground
service in an app targeting API 34 needs a declared type and a matching
permission, and users can hand an app a few photos instead of the whole
library. On every device, apps that target an API level below 23 can no longer
be installed.

![A phone home screen with a dark wallpaper fading to pale blue at the top, the date at the top left, five round app icons in the dock and a Google search bar below them](./assets/android-14-home-screen.png 'The Android 14 home screen, captured from the Android Emulator. Wikimedia Commons · Apache 2.0')

## At a glance

|                                 |                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------- |
| Version                         | Android 14                                                                       |
| API level                       | 34                                                                               |
| Name                            | Upside Down Cake, internal; visible in the SDK constant. Public name: Android 14 |
| `Build.VERSION_CODES`           | `UPSIDE_DOWN_CAKE`                                                               |
| Release                         | Pixel rollout began 4 October 2023                                               |
| Launch devices                  | Pixel 8 and Pixel 8 Pro, announced 4 October 2023, on sale from 12 October       |
| Google Play target-API deadline | New apps and app updates from 31 August 2024 (extension to 1 November 2024)      |

Google announced Android 14 with Developer Preview 1 on 8 February 2023. Beta 1
opened the Android Beta program on 12 April, and Beta 3 reached platform
stability on 7 June, with the APIs and app-facing behaviours final. The two
developer previews and the five betas are the parts that follow this overview.

Google released Android 14 and pushed its source to AOSP on 4 October 2023.
The first Pixel build (`UP1A.231005.007`) covered the Pixel 4a (5G) through
the Pixel Fold and Pixel Tablet. Google's post named Samsung, iQOO, Nothing,
OnePlus, Oppo, Realme, Sharp, Sony, Tecno, vivo and Xiaomi for later in the
year. Pixel 8 and 8 Pro were announced the same day, and AOSP lists Android 14
builds made for them.

Google kept the dessert name inside the code. A change posted to AOSP in April
2022 named the release Upside Down Cake, and `Build.java` defines
`UPSIDE_DOWN_CAKE = 34` with the comment "Upside Down Cake.". Build IDs start
with U. Google's announcements only ever say Android 14.

## What it brought

- **Lock screen.** A rebuilt customization picker, lock screen templates for
  clocks, widgets and colors, custom lock screen shortcuts, and a monochromatic theme.
  Generative AI wallpapers came first to the Pixel 8.
- **Accessibility.** Font size goes up to 200%, on a non-linear curve so large
  text grows more slowly than small text. Google's launch post says the Pixel
  maximum was 130% before. Users also got "Flash notifications" and a
  hearing-aid setup flow.
- **Ultra HDR.** 10-bit HDR photos in a format that stays readable as a normal
  JPEG. An app opts in to HDR display per window.
- **Health Connect in the platform.** The health data store moves from a Play
  Store app into the system, updated through Google Play system updates, and
  sits in Settings. It added exercise routes, and another app can read a route
  only after the user allows that route.
- **Credential Manager.** One platform API (`android.credentials`) for
  passwords, passkeys and federated sign-in. The Jetpack library brings it back
  to Android 4.4 through Google Play services.
- **Regional preferences.** Users pick temperature units, the first day of the
  week and the numbering system in "Regional preferences". Apps read them with
  calls such as `getTemperatureUnit()` and `getFirstDayOfWeek()`.
- **Languages.** The Grammatical Inflection API addresses the user in their
  grammatical gender. Per-app languages gained `setOverrideLocaleConfig()`, and
  AGP 8.1 generates the `LocaleConfig` file.
- **Screenshot detection.** An activity registers an
  `Activity.ScreenCaptureCallback` and learns that a screenshot was taken while
  it was visible. The app never gets the image, and the system tells the user
  the app noticed.
- **Predictive back.** Cross-activity and cross-task animations join the
  back-to-home animation from Android 13, with new callbacks for in-app
  transitions. The system animations stayed behind a developer option.
- **Developer APIs.** Custom sharesheet actions, `PathIterator` and
  `Path.interpolate()`, custom meshes with AGSL shaders, `HardwareBufferRenderer`,
  lossless USB audio, and about 300 `java.base` classes updated to OpenJDK 17.
- **App stores.** Installers can ask for approval before downloading, claim
  update ownership with `setRequestUpdateOwnership()`, and wait until the app is
  not in use to update it.

The launch post also reported performance numbers from the beta population.
Cached processes used up to 50% fewer CPU cycles than on Android 13, cold app
starts fell 20% on 8 GB devices and over 30% on 12 GB devices, and ART code
size shrank by 9.3% on average.

## Security and privacy

On every Android 14 device:

- **Minimum installable target.** An app with `targetSdkVersion` below 23 fails
  to install with `INSTALL_FAILED_DEPRECATED_SDK_VERSION`. Google said malware
  targets 22 to dodge the runtime permissions of
  [Android 6.0](/notes/android-6-marshmallow/). Apps already installed before
  the upgrade stay, and `adb install --bypass-low-target-sdk-block` installs one
  for testing.
- **Accessibility services.** A view can call
  `setAccessibilityDataSensitive()` so only services that declare
  `isAccessibilityTool` can read it or act on it. Malware often abuses
  accessibility services.
- **Media owners.** `MediaStore` redacts `OWNER_PACKAGE_NAME`, unless the owner
  app is always visible or the caller holds `QUERY_ALL_PACKAGES`.
- **PIN.** Android 14 encourages a six-digit PIN and unlocks without "Enter"
  once a correct six-digit or longer PIN is typed.
- **Cellular.** IT admins can stop managed devices from falling back to 2G, and
  a new toggle, where the manufacturer enables it, rejects null-ciphered
  connections so voice and SMS stay encrypted.
- **Platform.** AES-HCTR2 is the preferred filename encryption on devices with
  crypto instructions, and key attestation supports two IMEIs.

For apps that target API 34:

- **Implicit intents** reach only exported components. A mutable
  `PendingIntent` built from an intent with no component or package throws an
  exception.
- **Runtime receivers** must pass `RECEIVER_EXPORTED` or
  `RECEIVER_NOT_EXPORTED` to `registerReceiver()`, except for receivers of
  system broadcasts only.
- **Dynamic code loading.** Every DEX, JAR or APK an app loads at runtime must be
  read-only, or the system throws.
- **Zip path traversal.** `ZipFile(String)` and
  `ZipInputStream.getNextEntry()` throw a `ZipException` for entry names that
  contain `..` or start with `/`.
- **Background activity starts.** A `PendingIntent` sender or an app binding a
  service must opt in to share its right to start activities from the
  background.
- **Screen capture.** Each `MediaProjection` session needs fresh user consent;
  a cached consent intent or a second `createVirtualDisplay()` call throws.

## Permissions

- **Selected photos and videos.** When an app targeting API 34 asks for
  `READ_MEDIA_IMAGES` or `READ_MEDIA_VIDEO`, the dialog offers "Select photos
  and videos", "Allow all" and "Don't allow". The new
  `READ_MEDIA_VISUAL_USER_SELECTED` permission reports partial access and lets
  the app reopen the picker. An app that does not declare it runs in a
  compatibility mode the system controls. The media permissions themselves
  began in [Android 13](/notes/android-13/).
- **Foreground service permissions.** Each foreground service type has its own
  permission, such as `FOREGROUND_SERVICE_CAMERA`. They are normal permissions,
  granted at install; the user cannot revoke them.
- **Exact alarms.** `SCHEDULE_EXACT_ALARM` is no longer pre-granted to most new
  installs of apps targeting API 33 or higher. The user turns on "Alarms &
  reminders" in Settings. Calendar and alarm clock apps can use
  `USE_EXACT_ALARM`, which Play allows only for them. Apps that held the
  permission before the upgrade keep it.
- **Full-screen intents.** For apps targeting API 34, `USE_FULL_SCREEN_INTENT`
  is meant only for calling and alarm apps, and Google Play revokes it from
  other apps from 31 May 2024. `canUseFullScreenIntent()` checks it, and
  `ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT` opens its settings page.
- **Data sharing in the location dialog.** If an app declared in Play's Data
  safety form that it shares location with third parties, the location dialog
  shows that. If an app starts sharing location with third parties or for ads,
  the user gets a notification within 30 days.
- **Screenshot detection** needs `DETECT_SCREEN_CAPTURE`, an install-time
  permission.

![Four phone screens: a chat app, the dialog with Select photos and videos, Allow all and Don't allow, a picker with five photos chosen, and the chat app showing only those photos](./assets/selected-photos-access.png 'Selected Photos Access in Android 14: the user picks which photos and videos the app can see. Android Developers · CC BY 2.5')

## What changed for your app

### All apps on Android 14

| Change                                                                     | What to do                                                                                   |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Apps targeting below 23 cannot be installed                                | Raise `targetSdkVersion` to at least 23                                                      |
| `SCHEDULE_EXACT_ALARM` denied by default on new installs (target 33+)      | Call `canScheduleExactAlarms()` first; use inexact alarms or WorkManager when you can        |
| Cached apps are frozen shortly after leaving the screen                    | Run background work through services, JobScheduler or WorkManager                            |
| Context-registered broadcasts are queued while the app is cached           | Do not expect them on time; some, such as `BATTERY_CHANGED`, may be merged                   |
| `killBackgroundProcesses()` only kills your own processes                  | Stop trying to manage other apps' processes                                                  |
| Ongoing (`setOngoing(true)`) notifications can be dismissed                | Keep state in the app, not in the notification; call, media and lock-screen cases are exempt |
| Font scale up to 200%, non-linear                                          | Use `sp` for text and `lineHeight`; convert with `TypedValue.applyDimension()`               |
| `mlock()` limited to 64 KB per process (was 64 MB)                         | Check native code that locks memory                                                          |
| First GATT client's MTU request asks for 517 bytes; later requests ignored | Make the peripheral answer the MTU request with a size it supports                           |

### Apps targeting API 34

The security changes for this target are listed in
[Security and privacy](#security-and-privacy).

| Change                                                                      | What to do                                                                                        |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Every foreground service needs `android:foregroundServiceType`              | Declare the type, its `FOREGROUND_SERVICE_*` permission, and pass the type to `startForeground()` |
| Partial access to photos and videos                                         | Use the photo picker, or declare `READ_MEDIA_VISUAL_USER_SELECTED` and handle partial access      |
| JobScheduler ANRs when `onStartJob` or `onStopJob` blocks                   | Move work off the main thread, or use WorkManager                                                 |
| Network constraints in JobScheduler need `ACCESS_NETWORK_STATE`             | Declare it, or scheduling throws a `SecurityException`                                            |
| `BluetoothAdapter.getProfileConnectionState()` enforces `BLUETOOTH_CONNECT` | Declare and request it before the call                                                            |
| `TileService.startActivityAndCollapse(Intent)` throws                       | Pass a `PendingIntent` instead                                                                    |
| Stricter regular expressions and `UUID.fromString()` (OpenJDK 17)           | Test parsing code; both now throw `IllegalArgumentException` on bad input                         |

The foreground service rule is the one most apps hit. A missing type throws
`MissingForegroundServiceTypeException`; a missing type permission or runtime
prerequisite throws `SecurityException`.

```mermaid title="Starting a foreground service in an app targeting API 34"
flowchart TD
  start([Service calls startForeground]) --> type{Type declared in the manifest?}
  type -- No --> missing[MissingForegroundServiceTypeException]
  type -- Yes --> perm{FOREGROUND_SERVICE_TYPE permission declared?}
  perm -- No --> sec[SecurityException]
  perm -- Yes --> prereq{Runtime prerequisite met, such as CAMERA granted?}
  prereq -- No --> sec
  prereq -- Yes --> ok[Service runs in the foreground]
```

Android 14 adds five types: `health`, `remoteMessaging`, `shortService`,
`specialUse` and `systemExempted`. A `shortService` runs for about 3 minutes
and needs no extra permission. A `specialUse` service explains its use case in
a manifest `<property>`, and Google Play reviews it. Google recommends
WorkManager or user-initiated data transfer jobs for work that fits no type.

## What lasted

- **Minimum installable target** kept rising: Android 15 blocks apps that
  target below 24.
- **Foreground service types** stayed mandatory. Android 15 added a
  `mediaProcessing` type and limits `dataSync` services to 6 hours in 24.
- **Predictive back** left the developer option in Android 15. System
  animations now play for every app that opted in.
- **Selected photo access** and `READ_MEDIA_VISUAL_USER_SELECTED` are still how
  a gallery app gets partial access.
- **Health Connect** and **Credential Manager** remain platform APIs.
- **USB webcam.** Android 14 enabled the UVC gadget driver in the Generic
  Kernel Image by default; using the device as a USB webcam came with the
  Android 14 QPR1 update, not the first release.

## Worth knowing

- The Easter egg is a spaceflight game. Tap "Android version" in Settings three
  times, then long-press the logo. You steer a ship by dragging; the screen
  shows thrust, position and velocity, and `LND:` with the planet's name when
  you land.
- Each game starts in a random star system with 1 to 10 planets, each named
  after the system plus a number.
- The starfield on the logo screen draws 34 stars. The constant reads
  `NUM_STARS = 34; // Build.VERSION_CODES.UPSIDE_DOWN_CAKE`.
- Its top speed is `MAX_WARP = 10f`, with the comment "after all these years".
