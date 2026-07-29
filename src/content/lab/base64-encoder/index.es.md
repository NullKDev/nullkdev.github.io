---
entryId: lab-base64-encoder-es
locale: es
translationKey: base64-encoder
slug: codificador-base64
title: Codificador Base64
summary: Codificá y decodificá texto UTF-8 como Base64 dentro del navegador, con errores claros para entradas inválidas.
visibility: public
maturity: stable
publishedAt: 2026-07-23
updatedAt: 2026-07-23
topics: [developer-tools, encoding, web]
statusNote: Base64 es una codificación, no cifrado, y no protege datos sensibles.
links:
  - label: Código del sitio
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references: []
evidence:
  - id: base64-implementation-es
    kind: artifact
    claim: La implementación usa primitivas UTF-8 y Base64 del navegador sin acceso de red.
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
inputs: [texto UTF-8, texto Base64]
outputs: [texto Base64, texto UTF-8 decodificado]
implementationId: base64-encoder
---

Este codec mantiene explícitos los límites Unicode mediante `TextEncoder` y `TextDecoder`. Rechaza Base64 malformado en lugar de devolver resultados ambiguos.
