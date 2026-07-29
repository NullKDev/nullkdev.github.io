---
entryId: work-keyboard-simple-es
locale: es
translationKey: keyboard-simple
slug: teclado-simple
title: Keyboard Simple
summary: Una librería de teclado para Android documentada mediante su código público, licencia Apache-2.0, release 1.0.5 y AAR descargable.
visibility: public
maturity: stable
publishedAt: 2023-05-30
updatedAt: 2026-07-23
topics: [android, kotlin, java, libraries]
featuredRank: 1
statusNote: La evidencia pública se revisó el 2026-07-23. No se afirma compatibilidad actual con Android ni estado de mantenimiento.
links:
  - label: Repositorio fuente
    href: https://github.com/NullKDev/Keyboard-Simple
    kind: repository
  - label: Release 1.0.5
    href: https://github.com/NullKDev/Keyboard-Simple/releases/tag/1.0.5
    kind: release
references: []
evidence:
  - id: keyboard-repository-es
    kind: repository
    claim: El repositorio público contiene el código de la librería Android.
    source: Repositorio de GitHub
    provenance: third-party
    permission: public
    url: https://github.com/NullKDev/Keyboard-Simple
  - id: keyboard-release-es
    kind: release
    claim: El release 1.0.5 se publicó el 2023-05-30 con un AAR descargable.
    source: Release 1.0.5 de GitHub
    provenance: third-party
    permission: public
    url: https://github.com/NullKDev/Keyboard-Simple/releases/tag/1.0.5
  - id: keyboard-license-es
    kind: artifact
    claim: El repositorio declara la licencia Apache-2.0.
    source: Licencia del repositorio
    provenance: third-party
    permission: public
    url: https://github.com/NullKDev/Keyboard-Simple/blob/master/LICENSE
documents:
  - documentId: integration
    slug: integracion
    order: 1
protection:
  mode: public
lifecycle: shipped
role: Autor
domains: [mobile]
surfaces: [android-library]
technologies: [android, java, kotlin, gradle]
outcomes:
  - label: Publicó un artefacto versionado de librería Android.
    evidence:
      - id: keyboard-aar-es
        kind: release
        claim: El release 1.0.5 incluye un AAR descargable.
        source: Assets del release de GitHub
        provenance: third-party
        permission: public
        url: https://github.com/NullKDev/Keyboard-Simple/releases/tag/1.0.5
operatingConditions:
  - condition: Las instrucciones de integración reflejan el artefacto público 1.0.5.
    implication: Quien lo adopte debe verificar coordenadas y compatibilidad con una compilación Android actual.
---

Keyboard Simple se conserva aquí como un artefacto Android pequeño e inspeccionable. El registro se limita a lo verificable: existe código público, el repositorio usa Apache-2.0 y el release `1.0.5` ofrece un AAR.

El archivo no deduce adopción, cantidad de usuarios, contexto de equipo ni compatibilidad actual a partir de esos datos. Su valor es mostrar una frontera reutilizable para comportamiento de interfaz Android.

## Qué demuestra el artefacto

- un release versionado de una librería Android;
- código Java y Kotlin en un repositorio público;
- coordenadas Gradle/JitPack presentes en la documentación original;
- una licencia de código abierto explícita.

El documento de integración mantiene la configuración respaldada por la fuente separada de este caso de estudio.
