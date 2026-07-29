---
entryId: lab-ascii-converter
locale: en
translationKey: ascii-converter
slug: unicode-inspector
title: ASCII / Unicode Inspector
summary: Inspect characters as decimal code points and padded Unicode notation while preserving complete Unicode characters.
visibility: public
maturity: stable
publishedAt: 2026-07-23
updatedAt: 2026-07-23
topics: [encoding, developer-tools, web]
statusNote: The table reports Unicode code points, not encoded UTF-8 byte sequences or grapheme clusters.
links:
  - label: Site source
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references: []
evidence:
  - id: ascii-implementation
    kind: artifact
    claim: Inspection iterates JavaScript Unicode code points in the local implementation.
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
inputs: [text]
outputs: [character, decimal code point, Unicode notation]
implementationId: ascii-converter
---

The inspector is useful for checking invisible differences and non-ASCII characters. It labels the broader Unicode behavior honestly rather than treating every character as ASCII.
