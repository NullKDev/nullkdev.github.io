---
entryId: lab-docker-converter
locale: en
translationKey: docker-converter
slug: docker-to-kubernetes
title: Docker Run → Kubernetes
summary: Translate a constrained docker run command into reviewable Kubernetes resources without executing the command or contacting a daemon.
visibility: public
maturity: growing
publishedAt: 2026-07-23
updatedAt: 2026-07-23
topics: [containers, developer-tools, yaml]
statusNote: Supports image, name, published ports, and environment flags. The result is a starting point, not a production-ready workload.
links:
  - label: Site source
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references: []
evidence:
  - id: docker-implementation
    kind: artifact
    claim: The local parser tokenizes a constrained command and serializes data; it never executes shell input.
    source: Site source
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
inputs: [supported docker run command]
outputs: [Kubernetes Deployment and Service YAML]
implementationId: docker-converter
---

This is deliberately not a complete Docker CLI parser or cluster configuration generator. It produces a small Deployment and, when ports are present, a Service. Review security contexts, resource limits, probes, storage, secrets, and network policy before using the result.
