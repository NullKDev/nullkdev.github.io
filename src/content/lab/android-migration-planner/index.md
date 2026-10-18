---
entryId: lab-android-migration-planner
locale: en
translationKey: android-migration-planner
slug: android-migration-planner
title: Android targetSdk migration planner
summary: Pick your current and next targetSdk and get each level's checklist, behaviour changes and permission moves from the Android notes, plus a manifest check.
visibility: public
maturity: growing
publishedAt: 2026-10-18
updatedAt: 2026-10-18
topics: [android, platform-apis, developer-tools]
featuredRank: 1
statusNote: It knows only what the Android version notes say. It cannot see your code or libraries, so lint and a device test have the last word.
links:
  - label: Site source
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references:
  - domain: notes
    entryId: notes-android-versions
    relationship: related
evidence:
  - id: planner-derivation
    kind: artifact
    claim: The plan is parsed at build time from the version notes' own tables and checklists, and the manifest rules are tested against those notes.
    source: Site source
    provenance: first-party
    permission: public
    url: https://github.com/NullKDev/nullkdev.github.io
documents: []
protection: { mode: public }
kind: tool
lifecycle: active
surface: form
execution: local
sendsDataTo: []
inputs:
  [current targetSdk, new targetSdk, merged AndroidManifest.xml (optional)]
outputs:
  [
    ordered checklist per API level,
    behaviour and permission changes,
    manifest findings,
    Markdown plan,
  ]
implementationId: android-migration-planner
---

Raising `targetSdkVersion` is a walk through every API level in between, and each
level changes something different. This planner lays that walk out in order,
like a migration guide: for each level it shows the note's "Migrating to API N"
checklist, then the changes that hit apps targeting it, the changes every app
gets on that version, and the permission moves.

Nothing here is written for the tool. It is read at build time from the
[Android version notes](/notes/android-versions/), so it says exactly what they
say and changes when they do. Paste a merged manifest and about a dozen
deterministic rules point at what it already shows, or name the lint check to
run when the manifest alone cannot tell.

`adb`, lint and Gradle commands appear as text to copy into your own terminal.
This page runs none of them, and nothing you paste or open leaves your browser.
