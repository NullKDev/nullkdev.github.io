---
entryId: lab-timestamp-converter-es
locale: es
translationKey: timestamp-converter
slug: conversor-timestamps
title: Conversor de timestamps
summary: Convertí segundos Unix, milisegundos Unix o fechas a representaciones ISO, UTC y Unix normalizadas de forma local.
visibility: public
maturity: stable
publishedAt: 2026-07-23
updatedAt: 2026-07-23
topics: [developer-tools, dates, web]
statusNote: Las fechas no ISO ambiguas siguen las reglas del navegador; preferí ISO 8601 o valores Unix numéricos.
links:
  - label: Código del sitio
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references: []
evidence:
  - id: timestamp-implementation-es
    kind: artifact
    claim: La conversión usa la implementación Date probada del navegador sin acceso de red.
    source: Código del sitio
    provenance: first-party
    permission: public
    url: https://github.com/NullKDev/nullkdev.github.io
documents: []
protection: { mode: public }
kind: tool
lifecycle: stable
surface: form
execution: local
sendsDataTo: []
inputs: [segundos Unix, milisegundos Unix, texto de fecha]
outputs: [hora ISO, hora UTC, segundos Unix]
implementationId: timestamp-converter
---

El conversor explicita la diferencia entre segundos y milisegundos y reporta fechas inválidas en lugar de normalizarlas silenciosamente.
