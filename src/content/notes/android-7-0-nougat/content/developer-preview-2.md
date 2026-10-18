---
parentDomain: notes
parentId: notes-android-7-0-nougat
documentId: developer-preview-2
locale: en
translationKey: android-7-0-nougat-developer-preview-2
slug: developer-preview-2
title: 'Android N Developer Preview 2: Vulkan arrives'
summary: 13 April 2016. The second preview made Vulkan part of the platform, added launcher shortcuts and Unicode 9 emoji, and fixed bugs developers reported against the first.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Developer Preview 2 came out on 13 April 2016, builds `NPC91K` and `NPC91O`,
for the same devices as the first; the Nexus Player followed several days
later. Devices in the Android Beta Program got it over the air. It still
required Android Studio 2.1 and was still not meant for daily use.

## What Developer Preview 2 added

- **Vulkan** became part of the platform: a low-overhead 3D API that Google
  helped develop at Khronos. Google said some synthetic benchmarks reached up
  to 10 times the single-core draw-call throughput of OpenGL ES.
- **Launcher shortcuts.** `ShortcutManager.setDynamicShortcuts()` and
  `addDynamicShortcut()` let an app publish intents into specific screens.
  This API did not survive: see Developer Preview 3 and 4.
- **Emoji.** Unicode 9 glyphs, skin tones and a new human-looking design for
  people emoji. Apps check for a glyph with `Paint.hasGlyph()`.
- **Multi-window** gained a separate minimum height and minimum width for an
  activity, and several of its API names changed.

It also fixed bugs developers had filed against Preview 1, among them hidden
Wi-Fi networks that would not connect (AOSP 203116), YouTube pausing when
multi-window focus changed (203424) and Direct Reply closing an open activity
(204411).
