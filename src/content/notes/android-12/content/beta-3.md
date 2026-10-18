---
parentDomain: notes
parentId: notes-android-12
documentId: beta-3
locale: en
translationKey: android-12-beta-3
slug: beta-3
title: 'Android 12 Beta 3: final APIs, API 31'
summary: 14 July 2021. The third beta shipped the final Android 12 APIs and the API level 31 SDK, plus scrolling screenshots, AppSearch, privacy indicator insets and face-aware auto-rotate.
order: 6
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Beta 3 came out on 14 July 2021 with the final Android 12 APIs and the
official API level 31 SDK. App-facing behaviours were not frozen yet; Google
left full platform stability for Beta 4.

|                    |                                                                      |
| ------------------ | -------------------------------------------------------------------- |
| Release date       | 14 July 2021; Beta 3.1 on 26 July 2021                               |
| Build              | `SPB3.210618.013`; 3.1 `SPB3.210618.016`                             |
| Security patch     | July 2021                                                            |
| Devices            | Pixel 3 to Pixel 5; partner phones such as Sharp and TCL; Android TV |
| How to get it      | Over the air through Android Beta, or by flashing                    |
| Platform stability | APIs final; behaviours still open                                    |

- **Scrolling screenshots.** A "Capture more" button extends a screenshot of
  scrollable content. Standard views work without changes; custom UIs use
  the new scroll capture API.
- **AppSearch.** An on-device full-text search engine, with a local index
  through Jetpack and a central system index.
- **Privacy indicator insets.** `WindowInsets` reports where the camera and
  microphone indicators can appear, so immersive apps keep controls clear.
- **Enterprise toggles.** Admins of fully managed devices can restrict the
  camera and microphone toggles.
- **Companion apps.** Apps paired through Companion Device Manager can start
  foreground services from the background by declaring a new normal
  permission.
- **Auto-rotate.** On Pixel 4 and newer, face detection with the front camera
  decides when to rotate, inside Private Compute Core.
- **Games.** Game Mode APIs and play as you download.

Beta 3.1 fixed a boot loop after restart, System UI crashes, and the low
memory killer daemon (`lmkd`) killing too many processes.
