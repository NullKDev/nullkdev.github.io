---
parentDomain: work
parentId: work-keyboard-simple
documentId: integration
locale: en
translationKey: keyboard-simple-integration
slug: integration
title: Integrating release 1.0.5
summary: Source-supported Gradle and JitPack coordinates for the published Keyboard Simple artifact, with explicit verification limits.
order: 1
visibility: public
maturity: archived
publishedAt: 2023-05-30
updatedAt: 2026-07-23
topics: [android, gradle, libraries]
references: []
evidence:
  - id: keyboard-integration-source
    kind: repository
    claim: The original project documentation records JitPack and dependency coordinates for 1.0.5.
    source: Keyboard Simple repository and archived portfolio copy
    provenance: derived
    permission: public
    url: https://github.com/NullKDev/Keyboard-Simple
protection:
  mode: public
---

The archived documentation records JitPack as the package source:

```kotlin
dependencyResolutionManagement {
    repositories {
        maven { url = uri("https://jitpack.io") }
    }
}
```

It records this dependency coordinate for release `1.0.5`:

```kotlin
dependencies {
    implementation("com.github.NearApps:Keyboard-Simple:1.0.5")
}
```

These instructions document the published artifact; they are not a compatibility guarantee. Verify the repository, artifact availability, Android Gradle Plugin compatibility, and API behavior before using the library in a current project.
