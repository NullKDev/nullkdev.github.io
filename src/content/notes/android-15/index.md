---
entryId: notes-android-15
locale: en
translationKey: android-15
slug: android-15
title: 'Android 15: edge-to-edge, private space'
summary: API 35, October 2024. Apps targeting 35 draw edge-to-edge, dataSync services get six hours a day, private space hides apps behind a lock, and native code must handle 16 KB pages.
visibility: public
maturity: stable
publishedAt: 2026-10-17
topics: [android, platform-apis, security]
image: /banners/android-15.svg
imageAlt: 'Android 15 Vanilla Ice Cream banner, with the version logo.'
links:
  - label: Android 15 features and APIs
    href: https://developer.android.com/about/versions/15/features
    kind: publication
  - label: 'Behavior changes: apps targeting Android 15'
    href: https://developer.android.com/about/versions/15/behavior-changes-15
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
  order: 17
citations:
  - title: 'Android 15 home screen screenshot — Wikimedia Commons (Free screenshot, Apache 2.0)'
    url: https://commons.wikimedia.org/wiki/File:Android_15_Homescreen_Screenshot.png
    accessedAt: 2026-10-18
  - title: Android common kernels (AOSP)
    url: https://source.android.com/docs/core/architecture/kernel/android-common
    accessedAt: 2026-10-18
  - title: 'Android 15 emblem — Wikimedia Commons (AOSP licence, trademark of Google LLC)'
    url: https://commons.wikimedia.org/wiki/File:Android_15_Developer_Preview_logo.svg
    accessedAt: 2026-10-17
  - title: Android 15 features and APIs
    url: https://developer.android.com/about/versions/15/features
    accessedAt: 2026-10-17
  - title: 'Behavior changes: all apps (Android 15)'
    url: https://developer.android.com/about/versions/15/behavior-changes-all
    accessedAt: 2026-10-17
  - title: 'Behavior changes: apps targeting Android 15'
    url: https://developer.android.com/about/versions/15/behavior-changes-15
    accessedAt: 2026-10-17
  - title: 'Behavior changes: apps targeting Android 16'
    url: https://developer.android.com/about/versions/16/behavior-changes-16
    accessedAt: 2026-10-17
  - title: 'Behavior changes: all apps (Android 16)'
    url: https://developer.android.com/about/versions/16/behavior-changes-all
    accessedAt: 2026-10-17
  - title: Support 16 KB page sizes
    url: https://developer.android.com/guide/practices/page-sizes
    accessedAt: 2026-10-17
  - title: Support 16 KB page sizes (archived 31 August 2025)
    url: https://web.archive.org/web/20250831231121/https://developer.android.com/guide/practices/page-sizes
    accessedAt: 2026-10-17
  - title: Media projection
    url: https://developer.android.com/media/grow/media-projection
    accessedAt: 2026-10-17
  - title: Manifest.permission reference
    url: https://developer.android.com/reference/android/Manifest.permission
    accessedAt: 2026-10-17
  - title: R.attr reference (windowOptOutEdgeToEdgeEnforcement)
    url: https://developer.android.com/reference/android/R.attr
    accessedAt: 2026-10-17
  - title: Android 15 and Android 15 QPR1 release notes (AOSP)
    url: https://source.android.com/docs/whatsnew/android-15-release
    accessedAt: 2026-10-17
  - title: Codenames, tags, and build numbers (AOSP)
    url: https://source.android.com/docs/setup/reference/build-numbers
    accessedAt: 2026-10-17
  - title: Build.java at android-15.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-15.0.0_r1/core/java/android/os/Build.java
    accessedAt: 2026-10-17
  - title: PlatLogoActivity.java at android-15.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-15.0.0_r1/core/java/com/android/internal/app/PlatLogoActivity.java
    accessedAt: 2026-10-17
  - title: EasterEgg AndroidManifest.xml at android-15.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-15.0.0_r1/packages/EasterEgg/AndroidManifest.xml
    accessedAt: 2026-10-17
  - title: EasterEgg landroid_strings.xml at android-15.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-15.0.0_r1/packages/EasterEgg/res/values/landroid_strings.xml
    accessedAt: 2026-10-17
  - title: The First Developer Preview of Android 15
    url: https://android-developers.googleblog.com/2024/02/first-developer-preview-android15.html
    accessedAt: 2026-10-17
  - title: 'The Second Developer Preview of Android 15'
    url: https://android-developers.googleblog.com/2024/03/the-second-developer-preview-of-android-15.html
    accessedAt: 2026-10-18
  - title: 'The First Beta of Android 15'
    url: https://android-developers.googleblog.com/2024/04/the-first-beta-of-android-15.html
    accessedAt: 2026-10-18
  - title: 'The Second Beta of Android 15'
    url: https://android-developers.googleblog.com/2024/05/the-second-beta-of-android-15.html
    accessedAt: 2026-10-18
  - title: 'The Third Beta of Android 15'
    url: https://android-developers.googleblog.com/2024/06/the-third-beta-of-android-15.html
    accessedAt: 2026-10-18
  - title: 'The Fourth Beta of Android 15'
    url: https://android-developers.googleblog.com/2024/07/the-fourth-beta-of-android-15.html
    accessedAt: 2026-10-18
  - title: 'Android 15 release notes, Developer Preview 1 and 2 (archived 5 April 2024)'
    url: https://web.archive.org/web/20240405121053/https://developer.android.com/about/versions/15/release-notes
    accessedAt: 2026-10-18
  - title: 'Android 15 release notes, Beta 1 to 1.2 (archived 10 May 2024)'
    url: https://web.archive.org/web/20240510092844/https://developer.android.com/about/versions/15/release-notes
    accessedAt: 2026-10-18
  - title: 'Android 15 release notes, Beta 2 to 2.2 (archived 10 June 2024)'
    url: https://web.archive.org/web/20240610024208/https://developer.android.com/about/versions/15/release-notes
    accessedAt: 2026-10-18
  - title: 'Android 15 release notes, Beta 3 and 3.1 (archived 11 July 2024)'
    url: https://web.archive.org/web/20240711141847/https://developer.android.com/about/versions/15/release-notes
    accessedAt: 2026-10-18
  - title: 'Android 15 release notes, Beta 4 to 4.2 (archived 24 August 2024)'
    url: https://web.archive.org/web/20240824150600/https://developer.android.com/about/versions/15/release-notes
    accessedAt: 2026-10-18
  - title: 'AppWidgetManager reference (setWidgetPreview)'
    url: https://developer.android.com/reference/android/appwidget/AppWidgetManager
    accessedAt: 2026-10-18
  - title: 'Android 15 Developer Preview 1 rolling out to Pixel (9to5Google)'
    url: https://9to5google.com/2024/02/16/android-15-developer-preview-pixel/
    accessedAt: 2026-10-18
  - title: 'Android 15 Developer Preview 2 rolling out to Pixel (9to5Google)'
    url: https://9to5google.com/2024/03/21/android-15-developer-preview-2-pixel/
    accessedAt: 2026-10-18
  - title: 'Android 15 Beta 1 rolling out to Pixel (9to5Google)'
    url: https://9to5google.com/2024/04/11/android-15-beta-1-pixel/
    accessedAt: 2026-10-18
  - title: 'Android 15 Beta 2 rolling out to Pixel (9to5Google)'
    url: https://9to5google.com/2024/05/15/android-15-beta-2-pixel/
    accessedAt: 2026-10-18
  - title: 'Android 15 Beta 2 available on these partner devices (9to5Google)'
    url: https://9to5google.com/2024/05/15/android-15-beta-available-for-these-devices/
    accessedAt: 2026-10-18
  - title: 'Android 15 Beta 3 rolling out to Pixel (9to5Google)'
    url: https://9to5google.com/2024/06/18/android-15-beta-3-pixel/
    accessedAt: 2026-10-18
  - title: 'Android 15 Beta 4 rolling out to Pixel (9to5Google)'
    url: https://9to5google.com/2024/07/18/android-15-beta-4-pixel/
    accessedAt: 2026-10-18
  - title: Android 15 is released to AOSP
    url: https://android-developers.googleblog.com/2024/09/android-15-is-released-to-aosp.html
    accessedAt: 2026-10-17
  - title: "What's new in Android 15, plus more updates (The Keyword)"
    url: https://blog.google/products/android/android-15/
    accessedAt: 2026-10-17
  - title: Bringing new theft protection features to Android users around the world
    url: https://security.googleblog.com/2024/10/android-theft-protection.html
    accessedAt: 2026-10-17
  - title: Pixel tech specs (Google Store)
    url: https://store.google.com/us/product/pixel_9_specs?hl=en-US
    accessedAt: 2026-10-17
  - title: Target API level requirements for Google Play apps
    url: https://support.google.com/googleplay/android-developer/answer/11926878
    accessedAt: 2026-10-17
  - title: Target API level requirements for Google Play apps (archived 29 August 2025)
    url: https://web.archive.org/web/20250829010255/https://support.google.com/googleplay/android-developer/answer/11926878?hl=en
    accessedAt: 2026-10-17
  - title: Android 15 released to AOSP, Pixel update in 'coming weeks' (9to5Google)
    url: https://9to5google.com/2024/09/03/android-15-aosp/
    accessedAt: 2026-10-17
  - title: Google launches Android 15, rolling out now to Pixel (9to5Google)
    url: https://9to5google.com/2024/10/15/google-android-15-pixel-launch/
    accessedAt: 2026-10-17
  - title: Pixel 9 runs Android 14 out of the box (9to5Google)
    url: https://9to5google.com/2024/08/13/pixel-9-android-14/
    accessedAt: 2026-10-17
  - title: Android 15's Landroid Easter egg as a screen saver (9to5Google)
    url: https://9to5google.com/2024/07/19/android-15-landroid/
    accessedAt: 2026-10-17
  - title: Android 15's internal code name is Vanilla Ice Cream (Android Authority)
    url: https://www.androidauthority.com/android-15-vanilla-ice-cream-3292769/
    accessedAt: 2026-10-17
  - title: Compatibility framework changes (Android 15)
    url: https://developer.android.com/about/versions/15/reference/compat-framework-changes
    accessedAt: 2026-10-18
  - title: Compatibility framework tools (test and debug)
    url: https://developer.android.com/guide/app-compatibility/test-debug
    accessedAt: 2026-10-18
  - title: Set up the Android 15 SDK
    url: https://developer.android.com/about/versions/15/setup-sdk
    accessedAt: 2026-10-18
  - title: 'Android Gradle plugin: minimum versions of tools for each API level'
    url: https://developer.android.com/build/releases/about-agp
    accessedAt: 2026-10-18
  - title: Foreground service timeouts
    url: https://developer.android.com/develop/background-work/services/fgs/timeout
    accessedAt: 2026-10-18
  - title: Foreground service types
    url: https://developer.android.com/develop/background-work/services/fgs/service-types
    accessedAt: 2026-10-18
  - title: NotificationManager reference (setInterruptionFilter, setNotificationPolicy)
    url: https://developer.android.com/reference/android/app/NotificationManager
    accessedAt: 2026-10-18
  - title: 'Lint check Aligned16KB: native library dependency not 16 KB aligned'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/Aligned16KB.md.html
    accessedAt: 2026-10-18
  - title: 'Lint check ForegroundServicePermission'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/ForegroundServicePermission.md.html
    accessedAt: 2026-10-18
  - title: Android 15 is finally here in stable with a Pixel Feature Drop (Android Police)
    url: https://www.androidpolice.com/android-15-announcement-pixel-feature-drop/
    accessedAt: 2026-10-18
  - title: Android 15 is officially out, but not in the way you want (Android Police)
    url: https://www.androidpolice.com/android-15-officially-out-but-not-in-the-way-you-want/
    accessedAt: 2026-10-18
  - title: Android Developers content license
    url: https://developer.android.com/license
    accessedAt: 2026-10-17
---

Android 15 is the release where edge-to-edge stopped being optional. Apps
targeting API 35 draw behind the status and navigation bars by default, and
long-running `dataSync` foreground services get a daily time limit. For users
it brought the private space, a locked area that hides apps from the rest of
the phone.

![A phone home screen with a dark wallpaper and a pale blue wave at the top, the date at the top left, five round app icons in the dock and a Google search bar below them](./assets/android-15-home-screen.png 'The Android 15 home screen, captured from the Android Emulator. Wikimedia Commons · Apache 2.0')

## At a glance

|                                 |                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------- |
| Version                         | Android 15                                                                        |
| API level                       | 35                                                                                |
| Name                            | Vanilla Ice Cream, internal; visible in the SDK constant. Public name: Android 15 |
| `Build.VERSION_CODES`           | `VANILLA_ICE_CREAM`                                                               |
| Release                         | Source in AOSP on 3 September 2024; Pixel rollout began 15 October 2024           |
| Launch devices                  | None at release: the Pixel 9 series shipped with Android 14                       |
| Google Play target-API deadline | New apps and updates from 31 August 2025, with an extension to 1 November 2025    |
| Toolchain                       | `compileSdk 35`, Android Gradle Plugin 8.6 or later (Studio below)                |

Google's compatibility table lists Android Studio Koala Feature Drop and AGP
8.6.0 as the minimum for API 35, and numbers that Studio release 2024.2.1. The
Android 15 SDK setup page asks for Koala Feature Drop 2024.1.2 or higher and
AGP 8.6.1 or higher. Use the higher AGP version when the two disagree.

The first developer preview came out on 16 February 2024. A second preview
and four betas followed, and Beta 3 reached platform stability on 18 June 2024. Each milestone is a part below this overview. On 3 September 2024
Google published the Android 15 source to AOSP before any Pixel got the update,
which broke the usual pattern of releasing both on the same day. Android 12
was the last release to split them. The tag
`android-15.0.0_r1` is dated 5 September. The Pixel rollout started on 15
October 2024 for the Pixel 6 and later, the Pixel Fold and the Pixel Tablet.

The Pixel 9 phones, launched in August 2024, ran Android 14 out of the box. The
first Pixel sold with Android 15 was the Pixel 9a. Google's announcement also
named Samsung, Honor, Lenovo, Motorola, Nothing, OnePlus, Oppo, Sony, vivo and
Xiaomi among the makers that would ship the update in the following months.

The codename Vanilla Ice Cream was never used in marketing, but it is the SDK
constant, and AOSP documents it in one line: `Vanilla Ice Cream.` It surfaced
in AOSP code changes long before release, as Android Authority reported.

## What it brought

- **Private space.** A separate, locked area for sensitive apps. Its apps sit
  in their own launcher container, and while it is locked
  they disappear from recents, notifications, settings and other apps. It can
  use the device lock or its own, and can hold a separate Google account.
- **App archiving.** `PackageInstaller.requestArchive()` removes an app's APK
  and cache but keeps its data; `requestUnarchive()` restores it. On Pixel,
  users can also archive an app from App info.
- **App screen sharing.** A user can share or record a single app window
  instead of the whole screen. It first appeared in Android 14 QPR2; Android 15
  adds `MediaProjection` callbacks to adapt the experience.
- **PDF.** `PdfRenderer` opens password-protected files and supports
  annotations, form editing (`FormEditRecord`), text search
  (`Page.searchText()`) and selection with copy. `PdfRendererPreV` brings the
  same API to Android 11 and later.
- **Satellite.** `ServiceState.isUsingNonTerrestrialNetwork()` tells an app the
  device is on a satellite network. SMS, MMS and preloaded RCS apps can send
  and receive messages over it.
- **Camera.** Low Light Boost brightens the preview in the dark, and
  `FLASH_SINGLE_STRENGTH_DEFAULT_LEVEL` and `FLASH_TORCH_STRENGTH_DEFAULT_LEVEL`
  give apps control over flash strength.
- **Audio and video.** `LoudnessCodecController` applies the CTA-2075
  loudness standard to AAC content that carries loudness metadata. The dav1d
  AV1 software decoder is available as `c2.android.av1-dav1d.decoder` on
  devices without hardware AV1 decoding; apps opt in by name, and Google Play
  system updates bring it back to Android 11.
- **Tap to pay.** On supported devices, `NfcAdapter` observe mode lets the
  device listen to a reader without answering, so a payment app can prepare
  before the first exchange. A new Wallet role replaces the default
  contactless payment setting.
- **Performance tools.** `ApplicationStartInfo` reports cold, warm or hot
  starts and why the app started. `ProfilingManager` takes heap dumps and stack
  samples from inside the app. `StorageStats.getAppBytesByDataType()` breaks
  app size down by APK, AOT code and libraries.
- **Platform libraries.** OpenJDK 17 APIs such as `SequencedCollection`, which
  Google Play system updates also deliver to Android 12 and later. SQLite
  3.44.3 with read-only deferred transactions. `Canvas.clipShader()` and
  `Matrix44`.
- **Large screens.** Saved split-screen app pairs and a taskbar the user can
  pin.
- **Widget previews.** `AppWidgetManager.setWidgetPreview()` lets an app send
  generated `RemoteViews` as its picker preview, instead of a static image
  that rarely matched the real widget.

![An Android launcher app drawer with a locked container labelled Private at the bottom](./assets/private-space.png 'The private space as a locked container at the bottom of the app drawer. Android Developers · CC BY 2.5')

## Security and privacy

- **Theft protection, in two parts.** Android 15 itself requires the PIN,
  password or biometric to change sensitive settings such as Find My Device,
  locks the device after repeated failed unlock attempts, and strengthens
  factory reset protection. Theft Detection Lock, Offline Device Lock and Remote
  Lock are different: they arrived through a Google Play services update on
  most Android 10+ devices, not through Android 15.
- **Hidden OTPs.** Untrusted notification listeners can no longer read
  notifications in which the system detected a one-time password. Trusted
  ones, such as companion device apps, are exempt.
- **Screen sharing protection.** During screen sharing, notification content
  and password fields are hidden from the remote viewer. Apps can mark a view
  sensitive with `setContentSensitivity`.
- **Screen recording detection.** `WindowManager.addScreenRecordingCallback()`
  tells an app when it is being recorded.
- **Insecure mobile networks.** New settings warn users when the connection is
  not encrypted or when the network asks for identifiers like the IMSI in a way
  that could track them. Carriers can no longer hide the 2G toggle.
- **Credential Manager.** Apps can link username and password fields to a
  Credential Manager request, so its suggestions appear in autofill. Credential
  Manager also runs the biometric prompt itself during sign-up and sign-in, so
  providers no longer build their own.
- **Contact keys.** `E2eeContactKeysManager` stores contacts' public keys at
  the OS level for end-to-end encrypted apps, and lets users verify them from
  the contacts app.
- **Content URI checks.** `Context.checkContentUriPermissionFull()` checks a
  content URI fully, and the activity attribute
  `requireContentUriPermissionFromCaller` enforces permissions on the URIs a
  caller passes at launch.
- **Unsafe intents.** `StrictMode.VmPolicy.Builder().detectUnsafeIntentLaunch()`
  logs intent usage violations while you develop.
- **For apps targeting 35**, TLS 1.0 and 1.1 are disallowed and background
  activity launches are tighter; both are in
  [the targeting table](#apps-targeting-api-35).
- **Platform.** Signature permissions requested by non-system apps go through
  an explicit allowlist. Virtual A/B version 3 makes updates smaller and
  faster.

## Permissions

Android 15 added no runtime permission and replaced none, so no permission
needs a `maxSdkVersion` here. It added three normal permissions, granted at
install, and changed what five existing ones allow:

| Permission                            | What changed in API 35                                                                                                      | What to declare                                                           | What to remove or limit                                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `FOREGROUND_SERVICE_MEDIA_PROCESSING` | New normal permission for the new `mediaProcessing` foreground service type                                                 | It, plus `android:foregroundServiceType="mediaProcessing"` on the service | Nothing                                                               |
| `ACCESS_HIDDEN_PROFILES`              | New normal permission; a launcher needs it, and the home role, to show the private space                                    | Only in a launcher app                                                    | Never in other apps                                                   |
| `DETECT_SCREEN_RECORDING`             | New normal permission, required by `WindowManager.addScreenRecordingCallback()`                                             | Only if you register that callback                                        | Nothing                                                               |
| `FOREGROUND_SERVICE_DATA_SYNC`        | For apps targeting 35, its services share 6 hours in every 24                                                               | Keep it for sync started by the user                                      | Move long or repeated syncs to WorkManager                            |
| `RECEIVE_BOOT_COMPLETED`              | For apps targeting 35, a boot receiver cannot start `dataSync`, `camera`, `mediaPlayback`, `phoneCall` or `mediaProjection` | Keep it for alarms and jobs                                               | Do not start those service types from the boot receiver               |
| `SYSTEM_ALERT_WINDOW`                 | For apps targeting 35, it lets you start a foreground service from the background only while an overlay window is visible   | Keep it if you draw overlays                                              | Do not rely on it alone to start services                             |
| `ACCESS_NOTIFICATION_POLICY`          | For apps targeting 35, policy access no longer changes the global Do Not Disturb state                                      | Keep it; your calls now drive an `AutomaticZenRule` for your app          | Do not expect `INTERRUPTION_FILTER_ALL` to turn off other apps' rules |
| `REQUEST_DELETE_PACKAGES`             | Now also lets an app call `PackageInstaller.requestArchive()`                                                               | Only if you uninstall or archive other apps                               | Nothing                                                               |

One manifest for an app that runs on Android 14 and earlier and on 15 and
later. None of these replaces an older permission, so none needs a version
bound. Keep only the blocks your app needs:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

    <!-- Sync: required since API 34; from 35 it gets 6 hours a day -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_DATA_SYNC" />

    <!-- Transcoding: a new type in API 35, with the same 6-hour budget -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROCESSING" />

    <!-- Only if you register a screen recording callback -->
    <uses-permission android:name="android.permission.DETECT_SCREEN_RECORDING" />

    <!-- Launchers only, together with the home role -->
    <uses-permission android:name="android.permission.ACCESS_HIDDEN_PROFILES" />

    <application>
        <service
            android:name=".SyncService"
            android:exported="false"
            android:foregroundServiceType="dataSync" />
        <!-- Start this one with FOREGROUND_SERVICE_TYPE_MEDIA_PROCESSING
             only on API 35 and later -->
        <service
            android:name=".TranscodeService"
            android:exported="false"
            android:foregroundServiceType="mediaProcessing" />
    </application>
</manifest>
```

Photo access, which Android 14 made partial with
`READ_MEDIA_VISUAL_USER_SELECTED`, gains
`MediaStore.QUERY_ARG_LATEST_SELECTION_ONLY` so an app can query only the
photos the user picked last. It needs no new declaration. See
[Android 14](/notes/android-14/) for how partial access works.

## What changed for your app

### All apps on Android 15

| Change                                                              | What to do                                                                                | How to check                                                                      |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Apps targeting below 24 cannot be installed                         | Raise the target; apps already installed stay                                             | `adb install --bypass-low-target-sdk-block <apk>` installs one anyway for testing |
| A force-stopped app loses its pending intents; widgets grey out     | Re-register alarms and pending intents on the `ACTION_BOOT_COMPLETED` sent on next launch | `ApplicationStartInfo.wasForceStopped()` tells you it happened                    |
| Devices may use 16 KB memory pages                                  | Rebuild native libraries with 16 KB ELF alignment; pure Kotlin or Java apps work as is    | Lint `Aligned16KB`; `zipalign -c -P 16 -v 4 <apk>`                                |
| Your app may be installed again in the private space                | Do not assume a second profile is a work profile                                          |                                                                                   |
| The PNG emoji font `NotoColorEmojiLegacy.ttf` is gone               | Render emoji with the platform text APIs or COLRv1                                        | Search your code for `NotoColorEmojiLegacy.ttf`                                   |
| Predictive back animations show for apps that opted in              | If you opted in, check back animations and fragment transitions                           |                                                                                   |
| Network requests outside a valid process lifecycle fail             | Tie requests to a lifecycle; use WorkManager or a foreground service for longer work      |                                                                                   |
| A new direct or offload audio track can invalidate yours            | Handle your `AudioTrack` being invalidated when resource limits are reached               |                                                                                   |
| From Android 15 QPR1, screen projection stops when the screen locks | Handle the projection ending; a status bar chip also lets the user stop it                |                                                                                   |

### Apps targeting API 35

| Change                                                                    | What to do                                                                            | How to check                                                                    |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Edge-to-edge is the default; `setStatusBarColor` does nothing             | Handle window insets; Material 3 components do it for you                             | Compat `ENFORCE_EDGE_TO_EDGE` (309578419)                                       |
| Display cutout modes other than `ALWAYS` are read as `ALWAYS`             | Pad content by insets; a launch crash points at core splashscreen below 1.2.0-alpha01 |                                                                                 |
| `Configuration.screenWidthDp` and `screenHeightDp` include system bars    | Lay out with `WindowInsets` or `WindowMetricsCalculator`, not `Configuration`         |                                                                                 |
| `dataSync` and `mediaProcessing` services get 6 hours in every 24         | Call `stopSelf()` in `Service.onTimeout(int, int)`, or move the work to WorkManager   | Compat `FGS_INTRODUCE_TIME_LIMITS` (317799821)                                  |
| Boot receivers cannot start five foreground service types                 | Start them later, from a user action                                                  | Compat `FGS_BOOT_COMPLETED_RESTRICTIONS` (296558535)                            |
| `SYSTEM_ALERT_WINDOW` alone no longer starts services from the background | Show a visible overlay window first                                                   | Compat `FGS_SAW_RESTRICTIONS` (319471980)                                       |
| `PendingIntent` creators block background activity launches               | Opt in explicitly if a sender must open your activity                                 | Compat `DEFAULT_RESCIND_BAL_PRIVILEGES_FROM_PENDING_INTENT_CREATOR` (296478951) |
| TLS 1.0 and 1.1 are disallowed                                            | Use TLS 1.2 or later on every server                                                  |                                                                                 |
| Audio focus requests from the background fail                             | Request focus while on top or from a foreground service                               | The call returns `AUDIOFOCUS_REQUEST_FAILED`                                    |
| Apps cannot change global Do Not Disturb                                  | Contribute an `AutomaticZenRule`                                                      | Compat `MANAGE_GLOBAL_ZEN_VIA_IMPLICIT_RULES` (308670109)                       |
| `elegantTextHeight` is true by default                                    | Check layouts in Arabic, Thai, Tamil and the other listed scripts                     | Compat `DEPRECATE_UI_FONT` (279646685)                                          |
| `TextView` takes more width for complex letter shapes                     | Check tight layouts; `setUseBoundsForWidth(false)` restores the old width             |                                                                                 |
| `EditText` reserves the locale's line height                              | Set `useLocalePreferredLineHeightForMinimum` to false to restore the old height       |                                                                                 |
| `Arrays.asList(...).toArray()` returns `Object[]`                         | Use `toArray(new String[0])`                                                          | Compat `DO_NOT_CLONE_IN_ARRAYS_AS_LIST` (202956589)                             |
| `String.format()` validates format strings strictly                       | Fix `%0` style argument indexes                                                       | Compat `ENABLE_STRICT_FORMATTER_VALIDATION` (270674727)                         |
| Hebrew, Yiddish and Indonesian keep their ISO 639-1 codes                 | Expect `he`, `yi` and `id`, not `iw`, `ji` and `in`                                   | Compat `USE_NEW_ISO_LOCALE_CODES` (291868760)                                   |
| `Random.ints()` no longer matches `Random.nextInt()`                      | Do not depend on the two sequences being equal                                        | Compat `STREAM_INT_DIFFERS_FROM_NEXT_INT` (308103782)                           |
| Network callbacks include local networks by default                       | Check callbacks that assumed internet-only networks                                   | Compat `ENABLE_MATCH_LOCAL_NETWORK` (319212206)                                 |

The compat list also holds camera session, device owner and
`Content-Disposition` parsing changes that few apps meet. Every change with an
ID can be toggled on a debuggable build.

The edge-to-edge change is the one most apps noticed. Bars become transparent
(three-button navigation keeps an 80% scrim), and anything not padded by insets
slides under them: top app bars, floating action buttons, the last list item.
Apps could still opt out for API 35 with `windowOptOutEdgeToEdgeEnforcement`
while they fixed their screens.

The new `mediaProcessing` type, meant for jobs like transcoding, has the same
six-hour budget as `dataSync`:

```mermaid title="A dataSync foreground service in an app targeting API 35"
flowchart TD
  start([startForeground with type dataSync]) --> run[Service runs]
  run -- 6 hours used in the last 24 --> timeout[System calls onTimeout]
  timeout -- stopSelf within seconds --> stopped[Service stops cleanly]
  timeout -- keeps running --> crash[RemoteServiceException]
  stopped --> again{Start another dataSync?}
  again -- app still in background --> denied[ForegroundServiceStartNotAllowedException]
  again -- user brings app to foreground --> reset[Timer resets]
```

The five boot-blocked types are `dataSync`, `camera`, `mediaPlayback`,
`phoneCall` and `mediaProjection`; `microphone` has been blocked since
Android 14.

## Migrating to API 35

From `targetSdk 34` to 35, in this order:

1. **Update the toolchain.** Set `compileSdk 35`, use AGP 8.6 or later and
   Android Studio Koala Feature Drop or later. Skipped, the new constants
   (`FOREGROUND_SERVICE_TYPE_MEDIA_PROCESSING`) do not compile. Compiling
   against 35 also makes Kotlin's `list.removeFirst()` and `removeLast()`
   resolve to the new `List` methods, which crash with `NoSuchMethodError` on
   Android 14 and older. Verify: lint `NewApi` reports no errors, and remove
   any `@SuppressLint("NewApi")` hiding them; use `removeAt(0)` instead.
2. **Handle insets on every screen.** Pad content by `WindowInsets`, add
   `android:fitsSystemWindows="true"` to an `AppBarLayout`, and
   `clipToPadding="false"` to a padded `RecyclerView`. Skipped, bars, buttons
   and list items hide under the status and navigation bars. Verify: on an
   Android 15 device, open every screen, onboarding and settings included,
   in gesture and three-button navigation.
3. **Bound your foreground services.** Implement `Service.onTimeout(int, int)`
   in `dataSync` and `mediaProcessing` services, move boot-time starts of the
   five blocked types to a user action, and show an overlay before a
   `SYSTEM_ALERT_WINDOW` start. Skipped, services crash or fail with
   `ForegroundServiceStartNotAllowedException`. Verify:
   `adb shell am compat enable FGS_INTRODUCE_TIME_LIMITS <package>`, shorten
   the limit with
   `adb shell device_config put activity_manager data_sync_fgs_timeout_duration <ms>`,
   and send `adb shell am broadcast -a android.intent.action.BOOT_COMPLETED <package>`
   with `FGS_BOOT_COMPLETED_RESTRICTIONS` enabled. Lint
   `ForegroundServicePermission` finds a missing type permission.
4. **Check background launches.** Where another app or the system must open
   your activity through your `PendingIntent`, grant it explicitly. Skipped,
   those launches are blocked. Verify: run the flow with the target raised.
5. **Check network and audio.** Every server must speak TLS 1.2 or later, and
   audio focus must be requested while on top or from a foreground service.
   Skipped, connections fail and focus requests return
   `AUDIOFOCUS_REQUEST_FAILED`. Verify: run each server call and playback
   path on Android 15.
6. **Go through the smaller rows** of the targeting table that apply to you:
   `elegantTextHeight`, text widths, `String.format()`, `Arrays.asList()`,
   locale codes, `Random.ints()`, local network callbacks and Do Not Disturb.
7. **Check 16 KB pages.** Google Play requires apps targeting 35 or higher to
   support 16 KB pages on 64-bit devices. Skipped, Play will refuse updates
   from 1 February 2027. Verify: lint `Aligned16KB`,
   `zipalign -c -P 16 -v 4 <apk>`, and a 16 KB emulator where
   `adb shell getconf PAGE_SIZE` prints `16384`.
8. **Test the result** on an Android 15 device or emulator with
   `targetSdk 35`. To isolate one change, toggle it on a debuggable build in
   Developer options > "App Compatibility Changes", or with
   `adb shell am compat disable <change ID> <package>`.

Skipping several levels at once: do each version's steps in order, starting
from [Android 14](/notes/android-14/) if you target 33 or lower.

## What lasted

- **Edge-to-edge became mandatory.** For apps targeting Android 16,
  `windowOptOutEdgeToEdgeEnforcement` is deprecated and ignored.
- **Predictive back went further.** Apps targeting Android 16 get the system
  animations by default, and `onBackPressed` is no longer called.
- **`elegantTextHeight`**, defaulted here, is deprecated in Android 16 and
  ignored for apps targeting it.
- **16 KB pages became a Play rule.** From 1 November 2025, new apps and
  updates targeting Android 15 or higher had to support 16 KB pages on 64-bit
  devices. The current page sets 1 February 2027 as the date from which
  non-compliant updates are refused. Android 16 added a compatibility mode for
  some 4 KB apps.
- **Private space, app archiving and the foreground service time limits** are
  unchanged.

## Worth knowing

- The Easter egg is **Landroid**, the space game from Android 14. Holding the
  Android 15 logo charges a starfield warp for five seconds, with the phone
  rumbling, before the game opens.
- New in Android 15, the game also runs as a screen saver once unlocked. Its
  description in AOSP is `---- AUTOPILOT ENGAGED ----`, and the ship flies
  between planets on its own.
- Google measured 16 KB pages on its own devices: about 3% faster app launch
  under memory pressure and about 8% (roughly 950 ms) faster boot on average.
- Android 15 introduced the `android15-6.6` kernel, on Linux 6.6. It also
  supports older GKI kernels back to `android12-5.10`, so an updated phone can
  keep the kernel it launched with. From this release on, there is only one
  new GKI kernel per kernel version: there is no `android15-6.1`.
