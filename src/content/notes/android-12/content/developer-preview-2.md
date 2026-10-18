---
parentDomain: notes
parentId: notes-android-12
documentId: developer-preview-2
locale: en
translationKey: android-12-developer-preview-2
slug: developer-preview-2
title: 'Android 12 Developer Preview 2: effects'
summary: 17 March 2021. The second preview added RenderEffect blurs, rounded corner APIs, overlay hiding, app checksums, CompanionDeviceService and lock screen authentication for actions.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 2 came out on 17 March 2021, four weeks after the first.
It was still for developers only, by manual flash or over the air for
anyone already on Preview 1.

|                    |                                                                                |
| ------------------ | ------------------------------------------------------------------------------ |
| Release date       | 17 March 2021; 2.1 on 29 March; 2.2 on 7 April 2021                            |
| Build              | `SPP2.210219.008`; 2.1 `SPP2.210219.008.A1`; 2.2 `SPP2.210219.018`             |
| Security patch     | March 2021; 2.2 April 2021                                                     |
| Devices            | Pixel 3, 3a, 4, 4a, 4a 5G and 5; Android Emulator; Android TV on the ADT-3 kit |
| How to get it      | Flash or sideload; over the air from Preview 1 or 1.1                          |
| Platform stability | No                                                                             |

Preview 2 was about graphics, windows and companion devices:

- `RenderEffect` blurs or colour-filters any view in one call
  (`View.setRenderEffect()`), and `Window.setBackgroundBlurRadius()` blurs
  the window background.
- `Display.getRoundedCorner()` and `WindowInsets.getRoundedCorner()` return a
  `RoundedCorner` with its radius and centre.
- `Window.setHideOverlayWindows()` hides every `TYPE_APPLICATION_OVERLAY`
  window over the app, for screens such as payment confirmation.
- `PackageManager.requestChecksums()` returns the digest of an installed app.
- `CompanionDeviceService` keeps a watch or tracker app bound while the
  device is nearby.
- Notification actions can require authentication when tapped on the lock
  screen.
- Auto-enter picture-in-picture on swipe up to home, stashing at the screen
  edge, and resizing for non-video content.

Google told developers to ship a compatible update by Beta 1, without
changing `targetSdkVersion`. Developer Preview 2.1 updated WebView to fix app
crashes. Developer Preview 2.2 fixed a Settings crash in Bluetooth settings,
home screen widgets removed by an OTA, and Wi-Fi passwords that were not
saved.
