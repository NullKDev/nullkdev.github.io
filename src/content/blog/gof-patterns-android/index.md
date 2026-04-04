---
title: "8 GoF Patterns That Decide If Your Android App Scales"
description: "Most mobile apps don't fail because of bad features — they fail because of bad architecture. Here are the 8 Gang of Four patterns that directly impact scale and reliability in production Android apps."
date: 2026-04-04
tags: ["android", "kotlin", "architecture", "design-patterns"]
authors: ["me"]
lang: en
image: ./banner.svg
order: 1
---

Most mobile apps don't fail because of bad features.
They fail because of bad architecture.

After 7+ years shipping Android apps — from solo projects to team codebases that onboard new devs every quarter — I keep coming back to the same 8 patterns from the Gang of Four book. Not because they're academic, but because they solve *real, recurring problems* at production scale.

This is a practical series. No theory for its own sake — just the pattern, the Android problem it solves, and the Kotlin code that makes it click.

---

## The 8 Patterns at a Glance

| Pattern | What it solves | Android context |
|---|---|---|
| **Observer** | UI that never goes stale | ViewModel + StateFlow |
| **State** | Impossible states made impossible | Sealed `UiState` class |
| **Proxy** | Cache + retry, invisible to callers | Repository layer |
| **Facade** | One call hides 5 use cases | Feature API for ViewModels |
| **Adapter** | Swap any SDK in one file | Analytics, payment SDKs |
| **Factory** | Mockable sources from day one | Dependency injection |
| **Strategy** | A/B test at runtime, zero rewrites | Feature flags |
| **Decorator** | Add behaviours without touching core | Logging, auth, caching |

---

## The 4 Rules I Apply on Every Project

These aren't guidelines — they're constraints that prevent the most common architectural mistakes:

```
→ Every SDK gets an Adapter
→ Repository always = Proxy (cache gate)
→ One sealed UiState per screen
→ Facade per feature — keep ViewModels thin
```

Breaking any of these is fine in a prototype. In production, each one eventually costs you.

---

## The Numbers at Scale

When these patterns are applied consistently across a codebase:

- **3× faster team onboarding** — new devs find predictable structure everywhere
- **70% less boilerplate** — patterns eliminate repeated decision-making
- **0 SDK lock-in** with Adapter — I've swapped analytics SDKs in a single afternoon
- **10× faster unit tests** — Factory + Adapter means no real network, no real disk

---

## Series Structure

Each part covers two patterns — their relationship, their code, and how they interact:

1. **[Observer & State](./observer-state)** — UI reactivity and compiler-enforced screen states
2. **[Proxy & Facade](./proxy-facade)** — Cache gates and thin ViewModels
3. **[Adapter & Factory](./adapter-factory)** — SDK independence and testable sources
4. **[Strategy & Decorator](./strategy-decorator)** — Runtime behavior and additive extensions

---

Architecture is the decision you make at 9am that saves your team at 2am.

Start with Part 1: [Observer & State →](./observer-state)
