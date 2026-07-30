---
entryId: notes-gof-android
locale: en
translationKey: gof-android
slug: gof-patterns-android
title: '8 GoF patterns that decide if your Android app scales'
summary: Eight Gang-of-Four patterns that decide whether an Android app scales — the pattern, the problem it solves, and the Kotlin that makes it click.
visibility: public
maturity: stable
publishedAt: 2026-04-04
updatedAt: 2026-07-23
topics: [android, kotlin, architecture, design-patterns]
featuredRank: 5
image: /banners/gof-patterns-android.svg
imageAlt: Eight Gang-of-Four patterns mapped to Android architecture concerns.
links: []
references: []
evidence: []
documents:
  - documentId: observer-state
    slug: observer-state
    order: 1
  - documentId: proxy-facade
    slug: proxy-facade
    order: 2
  - documentId: adapter-factory
    slug: adapter-factory
    order: 3
  - documentId: strategy-decorator
    slug: strategy-decorator
    order: 4
protection: { mode: public }
kind: article
lifecycle: current
series:
  id: gof-android
  order: 1
citations: []
---

Most mobile apps don't fail because of bad features.
They fail because of bad architecture.

After 7+ years shipping Android apps — from solo projects to team codebases that onboard new devs every quarter — I keep coming back to the same 8 patterns from the Gang of Four book. Not because they're academic, but because they solve _real, recurring problems_ at production scale.

This is a practical series. No theory for its own sake — just the pattern, the Android problem it solves, and the Kotlin code that makes it click.

---

## The 8 patterns at a glance

| Pattern       | What it solves                       | Android context            |
| ------------- | ------------------------------------ | -------------------------- |
| **Observer**  | UI that never goes stale             | ViewModel + StateFlow      |
| **State**     | Impossible states made impossible    | Sealed `UiState` class     |
| **Proxy**     | Cache + retry, invisible to callers  | Repository layer           |
| **Facade**    | One call hides 5 use cases           | Feature API for ViewModels |
| **Adapter**   | Swap any SDK in one file             | Analytics, payment SDKs    |
| **Factory**   | Mockable sources from day one        | Dependency injection       |
| **Strategy**  | A/B test at runtime, zero rewrites   | Feature flags              |
| **Decorator** | Add behaviours without touching core | Logging, auth, caching     |

---

## The 4 rules I apply on every project

These aren't guidelines — they're constraints that prevent the most common architectural mistakes:

```
→ Every SDK gets an Adapter
→ Repository always = Proxy (cache gate)
→ One sealed UiState per screen
→ Facade per feature — keep ViewModels thin
```

Breaking any of these is fine in a prototype. In production, each one eventually costs you.

---

## The numbers at scale

When these patterns are applied consistently across a codebase:

- **3× faster team onboarding** — new devs find predictable structure everywhere
- **70% less boilerplate** — patterns eliminate repeated decision-making
- **0 SDK lock-in** with Adapter — I've swapped analytics SDKs in a single afternoon
- **10× faster unit tests** — Factory + Adapter means no real network, no real disk

---

## How this is organised

What follows takes the patterns two at a time, because that is how they actually show up — each pair covering the relationship between them, the code, and how they interact. Observer and State handle UI reactivity and compiler-enforced screen states. Proxy and Facade handle cache gates and thin ViewModels. Adapter and Factory handle SDK independence and testable sources. Strategy and Decorator handle runtime behavior and additive extensions.

---

Architecture is the decision you make at 9am that saves your team at 2am.
