---
entryId: lab-yaml-validator
locale: en
translationKey: yaml-validator
slug: yaml-validator
title: YAML Validator
summary: Validate and transform YAML locally using the same maintained YAML parser used by the archive build pipeline.
visibility: public
maturity: stable
publishedAt: 2026-07-23
updatedAt: 2026-07-23
topics: [developer-tools, yaml, web]
statusNote: Formatting can normalize comments and scalar styles; review transformed output before replacing source files.
links:
  - label: Site source
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references: []
evidence:
  - id: yaml-implementation
    kind: artifact
    claim: Validation and conversion use the checked-in yaml package and local implementation.
    source: Site source
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
inputs: [YAML or JSON text, transformation mode]
outputs: [validation result, normalized YAML, JSON]
implementationId: yaml-validator
---

The workspace parses YAML locally and can normalize it or convert between YAML and JSON. Serialization is structural, so formatting details and comments are not preserved.
