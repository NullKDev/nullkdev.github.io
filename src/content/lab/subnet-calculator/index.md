---
entryId: lab-subnet-calculator
locale: en
translationKey: subnet-calculator
slug: subnet-calculator
title: IPv4 Subnet Calculator
summary: Calculate network, broadcast, mask, and usable IPv4 ranges locally from an address and CIDR prefix.
visibility: public
maturity: stable
publishedAt: 2026-07-23
updatedAt: 2026-07-23
topics: [networking, developer-tools, web]
featuredRank: 2
statusNote: Supports IPv4 CIDR prefixes only; it does not model IPv6, routing policy, or address allocation plans.
links:
  - label: Site source
    href: https://github.com/NullKDev/nullkdev.github.io
    kind: repository
references: []
evidence:
  - id: subnet-implementation
    kind: artifact
    claim: The calculator uses tested unsigned 32-bit IPv4 arithmetic in the local implementation.
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
inputs: [IPv4 address, CIDR prefix]
outputs: [network, broadcast, mask, usable range, host counts]
implementationId: subnet-calculator
---

The calculator handles `/31` point-to-point and `/32` single-address cases explicitly. It is a planning aid, not a network discovery service.
