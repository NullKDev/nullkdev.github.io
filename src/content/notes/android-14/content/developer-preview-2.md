---
parentDomain: notes
parentId: notes-android-14
documentId: developer-preview-2
locale: en
translationKey: android-14-developer-preview-2
slug: developer-preview-2
title: 'Android 14 Developer Preview 2: selected photos'
summary: '8 March 2023. The second preview let users share only selected photos and videos, made Credential Manager a platform API and froze cached apps faster than Android 13.'
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 2 came out on 8 March 2023, still by manual download for
new testers and over the air for anyone on Preview 1. It was the last build
before the betas.

|                    |                                                                    |
| ------------------ | ------------------------------------------------------------------ |
| Release date       | 8 March 2023                                                       |
| Build              | `UPP2.230217.004`                                                  |
| Security patch     | March 2023                                                         |
| Devices            | The same Pixel phones as Preview 1; 64-bit Android Emulator images |
| How to get it      | Flash by hand, or over the air from Preview 1                      |
| Platform stability | No                                                                 |

The headline change was selected photos access. When an app asks for
`READ_MEDIA_IMAGES` or `READ_MEDIA_VIDEO`, the user can grant only the items
they pick, and `READ_MEDIA_VISUAL_USER_SELECTED` lets the app ask again.
Credential Manager became a platform API, with a Jetpack library back to
Android 4.4.

For apps targeting the new platform, a mutable `PendingIntent` built from an
implicit intent now throws, and apps must opt in to share their right to start
activities from the background. On every app, background work stopped a few
seconds after the app was cached, which Google called "an order of magnitude
faster than on Android 13". `FLAG_ONGOING_EVENT` notifications became
dismissible on unlocked phones.

The release notes add screenshot detection, regional preferences such as
`getTemperatureUnit()`, `killBackgroundProcesses()` limited to the app's own
processes, and redacted media owner names. App stores got
`requestUserPreapproval()`, `setRequestUpdateOwnership()`,
`setDontKillApp()` and the `InstallConstraints` API.
