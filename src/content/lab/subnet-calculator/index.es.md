---
entryId: lab-subnet-calculator-es
locale: es
translationKey: subnet-calculator
slug: calculadora-subred
title: Calculadora de subred IPv4
summary: Calculá red, broadcast, máscara y rango IPv4 utilizable localmente a partir de una dirección y prefijo CIDR.
visibility: public
maturity: stable
publishedAt: 2026-07-23
updatedAt: 2026-07-23
topics: [networking, developer-tools, web]
featuredRank: 2
statusNote: Solo admite prefijos CIDR IPv4; no modela IPv6, políticas de routing ni planes de asignación.
links:
  - label: Código del sitio
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references: []
evidence:
  - id: subnet-implementation-es
    kind: artifact
    claim: La calculadora usa aritmética IPv4 de 32 bits sin signo y probada en la implementación local.
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
inputs: [dirección IPv4, prefijo CIDR]
outputs: [red, broadcast, máscara, rango utilizable, cantidad de hosts]
implementationId: subnet-calculator
---

La calculadora maneja explícitamente `/31` para enlaces punto a punto y `/32` para una sola dirección. Es una ayuda de planificación, no un servicio de descubrimiento.
