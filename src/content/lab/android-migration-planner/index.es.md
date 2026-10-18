---
entryId: lab-android-migration-planner-es
locale: es
translationKey: android-migration-planner
slug: planificador-migracion-android
title: Planificador de migración de targetSdk
summary: Elige tu targetSdk actual y el siguiente, y obtén la lista de cada nivel, sus cambios y los permisos a mover según las notas de Android.
visibility: public
maturity: growing
publishedAt: 2026-10-18
updatedAt: 2026-10-18
topics: [android, platform-apis, developer-tools]
featuredRank: 1
statusNote: Solo sabe lo que dicen las notas de versiones de Android. No ve tu código ni tus librerías, así que lint y una prueba en un dispositivo tienen la última palabra.
links:
  - label: Código del sitio
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references:
  - domain: notes
    entryId: notes-android-versions-es
    relationship: related
evidence:
  - id: planner-derivation-es
    kind: artifact
    claim: El plan se lee al compilar de las propias tablas y listas de las notas de versiones, y las reglas del manifiesto se prueban contra esas notas.
    source: Código del sitio
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
  [targetSdk actual, targetSdk nuevo, AndroidManifest.xml combinado (opcional)]
outputs:
  [
    lista ordenada por nivel de API,
    cambios de comportamiento y de permisos,
    hallazgos del manifiesto,
    plan en Markdown,
  ]
implementationId: android-migration-planner
---

Subir `targetSdkVersion` es recorrer cada nivel de API intermedio, y cada nivel
cambia algo distinto. Este planificador ordena ese recorrido como una guía de
migración: para cada nivel muestra la lista "Migrar a API N" de su nota, luego
los cambios que afectan a las apps que apuntan a ese nivel, los que recibe toda
app en esa versión y los permisos que hay que mover.

Nada de esto se escribió para la herramienta. Se lee al compilar de las
[notas de versiones de Android](/es/notes/android-versiones/), así que dice
exactamente lo mismo que ellas y cambia cuando ellas cambian. Si pegas un
manifiesto combinado, una docena de reglas deterministas señalan lo que ya se
nota en él, o nombran la comprobación de lint que hay que ejecutar cuando el
manifiesto por sí solo no basta.

Los comandos de `adb`, lint y Gradle aparecen como texto para copiar en tu propia
terminal. Esta página no ejecuta ninguno, y nada de lo que pegues o abras sale de
tu navegador.
