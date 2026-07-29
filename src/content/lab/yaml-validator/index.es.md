---
entryId: lab-yaml-validator-es
locale: es
translationKey: yaml-validator
slug: validador-yaml
title: Validador YAML
summary: Validá y transformá YAML localmente con el mismo parser mantenido que utiliza el pipeline de compilación del archivo.
visibility: public
maturity: stable
publishedAt: 2026-07-23
updatedAt: 2026-07-23
topics: [developer-tools, yaml, web]
statusNote: El formato puede normalizar comentarios y estilos de escalares; revisá la salida antes de reemplazar archivos fuente.
links:
  - label: Código del sitio
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references: []
evidence:
  - id: yaml-implementation-es
    kind: artifact
    claim: La validación y conversión usan el paquete yaml y la implementación local versionada.
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
inputs: [texto YAML o JSON, modo de transformación]
outputs: [resultado de validación, YAML normalizado, JSON]
implementationId: yaml-validator
---

El espacio procesa YAML localmente y puede normalizarlo o convertir entre YAML y JSON. La serialización es estructural: no conserva comentarios ni detalles de formato.
