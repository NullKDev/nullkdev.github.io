---
entryId: lab-timestamp-converter
locale: en
translationKey: timestamp-converter
slug: timestamp-converter
title: Timestamp Converter
summary: Convert Unix seconds, Unix milliseconds, or date strings into ISO, UTC, and normalized Unix representations locally.
visibility: public
maturity: stable
publishedAt: 2026-07-23
updatedAt: 2026-07-23
topics: [developer-tools, dates, web]
statusNote: Ambiguous non-ISO date strings follow browser parsing rules; prefer ISO 8601 or numeric Unix values.
links:
  - label: Site source
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references: []
evidence:
  - id: timestamp-implementation
    kind: artifact
    claim: Conversion uses the tested browser Date implementation without network access.
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
inputs: [Unix seconds, Unix milliseconds, date string]
outputs: [ISO time, UTC time, Unix seconds]
implementationId: timestamp-converter
---

The converter makes seconds-versus-milliseconds handling explicit and reports invalid dates instead of silently normalizing them.
