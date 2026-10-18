---
parentDomain: notes
parentId: notes-android-12
documentId: beta-2
locale: en
translationKey: android-12-beta-2
slug: beta-2
title: 'Android 12 Beta 2: the privacy dashboard'
summary: 9 June 2021. The second beta added the privacy dashboard, camera and microphone indicators and toggles, the clipboard read toast and the new Internet panel.
order: 5
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

Beta 2 came out on 9 June 2021 and delivered the privacy features Google had
announced at I/O. Pixel phones enrolled for Beta 1 got it automatically.

|                    |                                                                        |
| ------------------ | ---------------------------------------------------------------------- |
| Release date       | 9 June 2021; Beta 2.1 on 23 June 2021                                  |
| Build              | `SPB2.210513.007`; 2.1 `SPB2.210513.011`                               |
| Security patch     | June 2021                                                              |
| Devices            | Pixel 3 to Pixel 5; partner phones such as Sharp; Android TV; emulator |
| How to get it      | Over the air through Android Beta, or by flashing                      |
| Platform stability | No                                                                     |

- **Privacy dashboard.** A timeline of app access to microphone, camera and
  location. Apps explain an access by handling
  `ACTION_VIEW_PERMISSION_USAGE_FOR_PERIOD`.
- **Indicators.** A status bar icon whenever an app uses the camera or
  microphone.
- **Toggles.** Quick Settings switches cut camera and microphone access for
  every app, whatever its target; a blocked app gets blank feeds.
  `SensorPrivacyManager` tells whether the device supports them.
- **Clipboard toast.** A toast each time an app calls `getPrimaryClip()` on a
  clip copied from another app.
- **Internet panel.** One panel in the status bar, Quick Settings and
  Settings to switch providers and troubleshoot connectivity.

Beta 2.1 fixed a lock screen that ignored swipes and a home screen At a
Glance widget that stopped showing weather and calendar events.
