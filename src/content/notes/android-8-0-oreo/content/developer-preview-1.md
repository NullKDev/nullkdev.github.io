---
parentDomain: notes
parentId: notes-android-8-0-oreo
documentId: developer-preview-1
locale: en
translationKey: android-8-0-oreo-developer-preview-1
slug: developer-preview-1
title: 'Android O Developer Preview 1: flash only'
summary: 21 March 2017. The first Android O build, for developers only and by manual flash, brought background limits, notification channels, autofill and picture-in-picture on phones.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google released the first developer preview of "Android O" on
21 March 2017, five months before the final release. Dave Burke's post
called it early: "there are more features coming, and there's still plenty
of stabilization and performance work ahead of us. But it's booting :)".

|                    |                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| Release date       | 21 March 2017                                                                                  |
| Build              | `OPP1.170223.013`, per the AOSP tag "Android O Preview Release 1"                              |
| Devices            | Nexus 5X, Nexus 6P, Nexus Player, Pixel, Pixel XL and Pixel C; Android Emulator; Wear emulator |
| How to get it      | Manual download and flash only; Android Beta was not open for O                                |
| Platform stability | No; APIs still changing                                                                        |

Most of what defines Android 8.0 was already in this build: the background
limits on implicit broadcasts, services and location updates; notification
channels; the autofill framework; picture-in-picture on phones and tablets;
fonts as an XML resource; adaptive icons; wide-gamut colour per activity;
Wi-Fi Aware and the LDAC codec; the AAudio native audio API, released as an
early version for feedback; multiprocess WebView by default with Safe
Browsing; and `java.time`. Google asked developers to read the background
limits first, because they "represent a significant change in Android".

Google's advice was to test the current app on the preview and publish a
compatible update without changing `targetSdkVersion`. Support Library
26.0.0 came out as an alpha the same day and raised its `minSdkVersion`
to 14. Google took preview bug reports in Issue Tracker, the tool it also
uses internally.
