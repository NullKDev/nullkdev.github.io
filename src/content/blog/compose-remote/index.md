---
title: "Remote Compose: Server-Driven UI Comes to Android the Right Way"
description: "Remote Compose (androidx.compose.remote) lets you define Compose UI on a server and render it on any Android device without a Play Store update. Here's how it works, why it matters, and how it compares to existing approaches."
date: 2026-04-01
tags: ["android", "kotlin", "compose", "jetpack"]
authors: ["me"]
lang: en
image: ./banner.svg
order: 1
---

Something quietly significant landed in Jetpack at the end of 2025. `androidx.compose.remote` — **Remote Compose** — is Google's first-party answer to server-driven UI on Android. It reached alpha07 on March 25, 2026, and it's worth understanding what it is and, more importantly, what problem it actually solves.

## The Problem That Never Got Solved

Server-Driven UI (SDUI) has been a known pattern in Android for years. Airbnb, Twitter, Lyft, and others have built their own SDUI stacks. The common approach: define a JSON schema for components, ship a renderer that maps JSON keys to actual UI, and update the UI by changing the server payload.

It works. But it has real downsides:
- **JSON is verbose and untyped** — you build your own contract and hope both sides agree
- **Renderers diverge** — the client renderer and the server definition drift over time
- **No compile-time safety** — a typo in a component name silently renders nothing

Meanwhile, Android's built-in solution was `RemoteViews` — a serializable, cross-process UI format that's been around since Android 1.5. Glance widgets, Wear OS tiles, lock screen widgets — they all use `RemoteViews` today. It's reliable but deeply limited: no custom layouts, no arbitrary composables, no Compose at all.

Remote Compose is the successor to both.

---

## What Remote Compose Actually Is

Remote Compose is a **serialization layer on top of Jetpack Compose semantics**. Instead of rendering to a Canvas, you write Compose-like code using the `remote-creation` API, and it produces a compact binary **document** — a serialized UI tree. That document is then transmitted (over the network, IPC, or however you want) to an Android client that renders it using the `remote-player` runtime.

The key insight: **the client doesn't need a Compose compiler or a Kotlin runtime for the UI code**. The player just deserializes the document and paints it. No APK update required.

```
Server / JVM Process
  └── remote-creation API → writes Compose-like code
        ↓ produces
      [ binary document ]
        ↓ transmitted
Android Client
  └── remote-player → deserializes + renders to View/Compose host
```

### How It Differs from JSON-based SDUI

| | JSON SDUI | Remote Compose |
|---|---|---|
| Format | Text (verbose) | Binary (compact) |
| Type safety | None (runtime) | Enforced at creation time |
| Renderer | Custom, diverges | System-provided, versioned |
| Layout power | Limited by your schema | Full Compose layout model |
| First-party | No | Yes (Google/Jetpack) |

---

## The Glance Connection

If you've used Glance (the Jetpack library for widgets and Wear OS tiles), you're using `RemoteViews` under the hood — the same API from 2009. Remote Compose is **Glance's future rendering backend**. The migration is already in progress.

This context matters: Remote Compose isn't an experimental curiosity. It's the infrastructure Google is building for the next decade of widgets and cross-process UIs.

The "Back to the Future" framing that [Arman Chatikyan](https://medium.com/@chatikyan/remote-compose-back-to-the-future-454b8e824fad) used is apt: same problem as RemoteViews in 2009, modern solution.

---

## Module Structure

The library is split into **creation** (server/JVM side) and **player** (Android client side):

```kotlin
// Server / JVM — produces documents
implementation("androidx.compose.remote:remote-creation:1.0.0-alpha07")
implementation("androidx.compose.remote:remote-creation-compose:1.0.0-alpha07") // if writing from Compose

// Android client — renders documents
implementation("androidx.compose.remote:remote-player-core:1.0.0-alpha07")
implementation("androidx.compose.remote:remote-player-view:1.0.0-alpha07")

// Tooling
debugImplementation("androidx.compose.remote:remote-tooling-preview:1.0.0-alpha07")
```

The separation is intentional: the creation side can run on a JVM backend (a Spring service, a Cloud Function, etc.) with no Android dependency. The player side is Android-only.

---

## The RemoteApplier Boundary

One design decision that stands out: since alpha04, the `RemoteApplier` is **enabled by default**. This is a compile-time guard that prevents regular Jetpack Compose composables from being accidentally used inside Remote Compose code.

In practice, Remote Compose functions look similar to regular Compose functions, but they're in a different composition scope. The compiler enforces the boundary. If you try to call a regular `@Composable` from inside a Remote Compose function, you get a compile-time error.

This is the right call — it prevents a class of bugs where non-serializable UI leaks into a document that the player can't render.

---

## What's Available in alpha07 (March 25, 2026)

The latest release added:

- **Non-linear font scaling** — respects accessibility settings for large text
- **LayoutDirection** — RTL/LTR support for international layouts
- `RemoteSpacer`, `RemoteImageVector`, `painterRemoteVector` — newly public APIs
- Semantic modifier functions — accessibility support
- `RemoteArrangement.spacedBy()` — gap-based layout spacing
- Extended `RemoteDrawScope`, `RemoteCanvas`, `RemotePainter`, `RemoteBrush`
- `RemoteFloat` arithmetic operations and `asRemoteDp()` conversion

**Breaking changes in alpha07:**
- `RemoteArrangement.CenterHorizontally` removed — use `RemoteArrangement.Center`
- `RemoteBox` alignment parameter changed to a single `RemoteAlignment`

---

## Current State: Still Alpha, But Moving Fast

The library has shipped 7 alpha releases in roughly 3.5 months (December 2025 → March 2026). The pace is aggressive: each release both adds new public APIs and breaks existing ones. 

Milestone by milestone, the API surface has grown from almost nothing to a reasonably complete set of layout primitives. But the fact that every release still has breaking changes means this isn't production-ready — yet.

Meaningful milestones so far:
- **alpha04**: `minSdk` dropped from 26 to 23 — a signal the team intends broad adoption
- **alpha04**: `FlowLayout` support added
- **alpha06**: Java 11 target (may require desugaring)
- **alpha07**: Font scaling + RTL — table stakes for internationalized apps

---

## Should You Use It Now?

**For production apps**: not yet. The API breaks every two weeks, and the player runtime's capabilities are still being defined.

**For Glance widget developers**: start paying attention. This is where Glance is going, and early familiarity will pay off when the migration path is formalized.

**For SDUI teams**: worth a serious prototype. If your team has been maintaining a custom SDUI stack, the appeal of a first-party, type-safe, binary-format alternative is obvious.

**For widget/tile use cases**: this is arguably the most immediate practical application, since Glance is already on this path.

---

## Next Up

In the [next part](./getting-started), we'll walk through a practical example: building a simple Remote Compose document on the creation side, serializing it, and rendering it inside an Android app using `remote-player-view`.

---

## Resources

- [Remote Compose — Official Release Notes](https://developer.android.com/jetpack/androidx/releases/compose-remote)
- [Arman Chatikyan — Remote Compose: Back to the Future](https://medium.com/@chatikyan/remote-compose-back-to-the-future-454b8e824fad)
- [Luca Fioravanti — From RemoteViews to RemoteCompose](https://medium.com/@fioravanti.luka/glance-remoteviews-and-remotecompose-what-actually-changed-in-android-16-4afc4b63b0ad)
- [Nativeblocks — Google's Official Answer to SDUI](https://nativeblocks.io/blog/remote-compose-googles-answer-to-server-driven-ui)
