---
parentDomain: work
parentId: work-keyboard-simple-es
documentId: integration
locale: es
translationKey: keyboard-simple-integration
slug: integracion
title: Integrar el release 1.0.5
summary: Coordenadas Gradle y JitPack respaldadas por la fuente para Keyboard Simple, con límites de verificación explícitos.
order: 1
visibility: public
maturity: archived
publishedAt: 2023-05-30
updatedAt: 2026-07-23
topics: [android, gradle, libraries]
references: []
evidence:
  - id: keyboard-integration-source-es
    kind: repository
    claim: La documentación original registra JitPack y las coordenadas de dependencia para 1.0.5.
    source: Repositorio de Keyboard Simple y copia archivada del portfolio
    provenance: derived
    permission: public
    url: https://github.com/NullKDev/Keyboard-Simple
protection:
  mode: public
---

La documentación archivada registra JitPack como fuente del paquete:

```kotlin
dependencyResolutionManagement {
    repositories {
        maven { url = uri("https://jitpack.io") }
    }
}
```

También registra esta coordenada para el release `1.0.5`:

```kotlin
dependencies {
    implementation("com.github.NearApps:Keyboard-Simple:1.0.5")
}
```

Estas instrucciones documentan el artefacto publicado; no garantizan compatibilidad. Verificá repositorio, disponibilidad, compatibilidad con Android Gradle Plugin y comportamiento antes de usarlo hoy.
