---
entryId: lab-docker-converter-es
locale: es
translationKey: docker-converter
slug: docker-a-kubernetes
title: Docker Run → Kubernetes
summary: Traducí un comando docker run acotado a recursos Kubernetes revisables sin ejecutarlo ni contactar un daemon.
visibility: public
maturity: growing
publishedAt: 2026-07-23
updatedAt: 2026-07-23
topics: [containers, developer-tools, yaml]
statusNote: Admite imagen, nombre, puertos publicados y variables de entorno. El resultado es un punto de partida, no una carga lista para producción.
links:
  - label: Código del sitio
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references: []
evidence:
  - id: docker-implementation-es
    kind: artifact
    claim: El parser local tokeniza un comando acotado y serializa datos; nunca ejecuta entrada de shell.
    source: Código del sitio
    provenance: first-party
    permission: public
    url: https://github.com/NullKDev/nullkdev.github.io
documents: []
protection: { mode: public }
kind: tool
lifecycle: prototype
surface: form
execution: local
sendsDataTo: []
inputs: [comando docker run soportado]
outputs: [YAML de Deployment y Service de Kubernetes]
implementationId: docker-converter
---

No pretende ser un parser completo del CLI de Docker ni un generador de configuración de clúster. Produce un Deployment y, cuando hay puertos, un Service. Revisá contextos de seguridad, límites de recursos, probes, almacenamiento, secretos y políticas de red antes de usar el resultado.
