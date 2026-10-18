---
parentDomain: notes
parentId: notes-android-7-0-nougat
documentId: developer-preview-3
locale: en
translationKey: android-7-0-nougat-developer-preview-3
slug: developer-preview-3
title: 'Android N Developer Preview 3: beta quality'
summary: 18 May 2016, at Google I/O. Google's first beta-quality N build, fit for a primary phone, added VR Mode and FrameMetrics and deferred launcher shortcuts.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google announced Developer Preview 3 at Google I/O on 18 May 2016 as "our
first beta-quality candidate, available to test on your primary phone or
tablet". Build `NPD35K` was CTS approved on the Nexus 5X, 6, 6P and Pixel C,
so apps that require it, such as Android Pay, worked. It reached every
supported device plus the Sony Xperia Z3 (D6603 and D6653).

## What Developer Preview 3 added

- **VR Mode**: an exclusive CPU core for VR apps, head tracking, stereo
  notifications and low-latency graphics. Google measured motion-to-photon
  latency under 20 ms on a Nexus 6P.
- **Sustained performance mode**: device hints for apps that run for a long
  time at a steady level. Testable only on the Nexus 6P in this preview.
- **FrameMetrics API**: a listener that streams frame timing for the app's
  window, so UI performance can be measured in production without USB.
- **Keyboard Shortcuts helper**: Meta+/ lists system and app shortcuts.
- **Multiprocess WebView** behind a developer option, running web content in
  a separate sandboxed process from WebView 51.

## Behaviour changes in Developer Preview 3

- **Launcher shortcuts deferred.** Google pulled the feature from N and said
  `ShortcutManager` would leave the public API in the next preview.
- **WebView**, for apps targeting N: the JavaScript context resets on each
  new page load, and geolocation works only on secure (HTTPS) origins.
- **Data Saver**: apps can open a system dialog that adds them to the
  Data Saver exemption list.
- **Number blocking** by an unauthorized caller now throws
  `SecurityException` instead of `UnsupportedOperationException`.
- **Quick Settings tiles** take their mode from the
  `TileService.META_DATA_ACTIVE_TILE` metadata instead of the return value of
  `onTileAdded()`.
