---
entryId: work-keyboard-simple
locale: en
translationKey: keyboard-simple
slug: keyboard-simple
title: Keyboard Simple
summary: An Android keyboard library documented through its public source, Apache-2.0 license, release 1.0.5, and downloadable AAR.
visibility: public
maturity: stable
publishedAt: 2023-05-30
updatedAt: 2026-07-23
topics: [android, kotlin, java, libraries]
featuredRank: 1
statusNote: Public evidence was last reviewed on 2026-07-23. Current Android compatibility and maintenance status are not asserted.
links:
  - label: Source repository
    href: https://github.com/NullKDev/Keyboard-Simple
    kind: repository
  - label: Release 1.0.5
    href: https://github.com/NullKDev/Keyboard-Simple/releases/tag/1.0.5
    kind: release
references: []
evidence:
  - id: keyboard-repository
    kind: repository
    claim: The public repository contains the Android library source.
    source: GitHub repository
    provenance: third-party
    permission: public
    url: https://github.com/NullKDev/Keyboard-Simple
  - id: keyboard-release
    kind: release
    claim: Release 1.0.5 was published on 2023-05-30 with a downloadable AAR.
    source: GitHub release 1.0.5
    provenance: third-party
    permission: public
    url: https://github.com/NullKDev/Keyboard-Simple/releases/tag/1.0.5
  - id: keyboard-license
    kind: artifact
    claim: The repository declares the Apache-2.0 license.
    source: Repository license
    provenance: third-party
    permission: public
    url: https://github.com/NullKDev/Keyboard-Simple/blob/master/LICENSE
documents:
  - documentId: integration
    slug: integration
    order: 1
protection:
  mode: public
lifecycle: shipped
role: Author
domains: [mobile]
surfaces: [android-library]
technologies: [android, java, kotlin, gradle]
outcomes:
  - label: Published a versioned Android library artifact.
    evidence:
      - id: keyboard-aar
        kind: release
        claim: Release 1.0.5 includes a downloadable AAR asset.
        source: GitHub release assets
        provenance: third-party
        permission: public
        url: https://github.com/NullKDev/Keyboard-Simple/releases/tag/1.0.5
operatingConditions:
  - condition: Integration instructions reflect the public 1.0.5 artifact.
    implication: Consumers should verify repository coordinates and compatibility before adopting it in a current Android build.
---

Keyboard Simple is preserved here as a small, inspectable Android library artifact. The record deliberately stays close to what can be checked: public source exists, the repository is licensed under Apache-2.0, and release `1.0.5` provides an AAR.

The archive does not infer adoption, user counts, team context, or current compatibility from those facts. Its value here is as a concrete example of packaging Android UI behavior into a reusable library boundary.

## What the artifact demonstrates

- a versioned Android library release;
- Java and Kotlin source in a public repository;
- Gradle/JitPack integration coordinates recorded in the original documentation;
- an explicit open-source license.

The integration document keeps the source-supported setup separate from this case-study record.
