---
entryId: lab-ascii-converter-es
locale: es
translationKey: ascii-converter
slug: inspector-unicode
title: Inspector ASCII / Unicode
summary: Inspeccioná caracteres como puntos de código decimales y notación Unicode, preservando caracteres Unicode completos.
visibility: public
maturity: stable
publishedAt: 2026-07-23
updatedAt: 2026-07-23
topics: [encoding, developer-tools, web]
statusNote: La tabla informa puntos de código Unicode, no bytes UTF-8 codificados ni clústeres de grafemas.
links:
  - label: Código del sitio
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references: []
evidence:
  - id: ascii-implementation-es
    kind: artifact
    claim: La inspección itera puntos de código Unicode de JavaScript en la implementación local.
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
inputs: [texto]
outputs: [carácter, punto de código decimal, notación Unicode]
implementationId: ascii-converter
---

El inspector ayuda a encontrar diferencias invisibles y caracteres no ASCII. Describe el comportamiento Unicode real en lugar de tratar cada carácter como ASCII.
