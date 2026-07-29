---
entryId: lab-json-formatter-es
locale: es
translationKey: json-formatter
slug: formateador-json
title: Formateador JSON
summary: Formateá, minificá y validá JSON localmente en el navegador con errores explícitos y sin solicitudes de red.
visibility: public
maturity: stable
publishedAt: 2026-07-23
updatedAt: 2026-07-23
topics: [developer-tools, json, web]
featuredRank: 1
statusNote: Funciona localmente con el parser JSON del navegador; no valida contra JSON Schema.
links:
  - label: Código del sitio
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references: []
evidence:
  - id: json-implementation-es
    kind: artifact
    claim: El formateador usa el parser y serializador JSON nativos en la implementación versionada del Lab.
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
inputs: [texto JSON, indentación]
outputs: [JSON formateado, JSON minificado, resultado de validación]
implementationId: json-formatter
---

Usá este espacio para inspeccionar JSON sin enviarlo a un servicio. El parseo sigue `JSON.parse` y el formato es determinista mediante `JSON.stringify`.
