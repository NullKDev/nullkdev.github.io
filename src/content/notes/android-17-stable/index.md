---
entryId: notes-android-17-stable
locale: en
translationKey: android-17-stable
slug: android-17-stable
title: 'Android 17: four changes that break on targetSdk 37'
summary: From Beta 3 to the June 16 release — what landed, and the behaviour changes that stay dormant until you bump targetSdk to 37.
visibility: public
maturity: stable
publishedAt: 2026-07-29
updatedAt: 2026-07-29
topics: [android, kotlin, platform-apis, security]
featuredRank: 2
image: /banners/android-17-stable.svg
imageAlt: Android 17 stable banner — stable, six weeks in.
links:
  - label: Android 17 is here
    href: https://android-developers.googleblog.com/2026/06/Android-17.html
    kind: publication
  - label: 'Behavior changes: apps targeting Android 17'
    href: https://developer.android.com/about/versions/17/behavior-changes-17
    kind: publication
references: []
evidence: []
documents: []
protection: { mode: public }
kind: article
lifecycle: current
series:
  id: android-17
  order: 2
citations:
  - title: Android 17 is here
    url: https://android-developers.googleblog.com/2026/06/Android-17.html
    accessedAt: 2026-07-29
  - title: The fourth beta of Android 17
    url: https://android-developers.googleblog.com/2026/04/the-fourth-beta-of-android-17.html
    accessedAt: 2026-07-29
  - title: 'Behavior changes: all apps'
    url: https://developer.android.com/about/versions/17/behavior-changes-all
    accessedAt: 2026-07-29
---

Android 17 went stable on **16 June 2026**, alongside the June Pixel Drop, on
Pixel 6 and newer. Beta 4 — the final beta, where the API surface locked — shipped
on **16 April**. My [Beta 3 write-up](/notes/android-17-beta-3/) covers API 37 at
platform stability; this covers what happened after it, and what actually costs
you time.

Six weeks in, the useful framing is not the feature list. It is this: **most of
what will break your app is dormant right now.** It fires when you bump
`targetSdk` to 37, not when a user updates their phone. That means you choose the
day it happens, which is worth using deliberately.

## The process changed, and that is the real news

For the first time in years, Google **shipped no Developer Previews**. Android 17
went straight to Beta.

That is not a shortcut. It is the [Canary channel](https://developer.android.com/about/versions/canary)
doing the job Developer Previews used to: APIs and features get tested
continuously there, so a separate preview build stopped earning its place in the
calendar. The consequence for planning is real — the window between "first
buildable release" and "platform stability" is now shorter, and if your process
assumed a DP phase to absorb surprises, that phase no longer exists.

## The four that break on targetSdk 37

### 1. Large-screen resizability is no longer optional

Apps targeting Android 17 **can no longer opt out** of orientation, resizability
and aspect-ratio constraints on large screens. The manifest flags that used to
pin an app to portrait stop being honoured.

This is the one to plan for, not patch. If your layout assumed a fixed
orientation, it will be resized on a tablet or a foldable and you will find out
where the assumptions live. Google frames Android 17 as the move to an
"adaptive-first" standard, and this is the clause that enforces it.

### 2. `System.load()` requires read-only native libraries

> All native files loaded using `System.load()` must be marked as read-only.
> Otherwise, the system throws `UnsatisfiedLinkError`.

If you ship native code that gets extracted, copied, or downloaded at runtime and
then loaded from a writable location, that path now throws. This is a Dynamic Code
Loading restriction: a library you can still write to is a library an attacker can
still rewrite between the check and the load.

Worth grepping for `System.load(` — not `loadLibrary`, which resolves from the APK
and is unaffected.

### 3. Local network access is blocked by default

Apps targeting 17 have **local network access blocked by default**. Persistent
access needs the new `ACCESS_LOCAL_NETWORK` permission.

This catches more apps than it sounds like: anything that discovers a printer, a
Chromecast, a smart bulb, a local dev server, or another phone on the same Wi-Fi.
If your app talks to hardware on the LAN, it needs the permission and a reason to
show the user.

### 4. Certificate Transparency is on by default

CT was opt-in on Android 16. On 17 it is **enabled by default**.

For almost everyone this is invisible and good. It bites in exactly one place: if
you pin or inject a certificate that is not in a public CT log — a corporate
proxy, a test harness, an internal CA — connections that used to work will fail.
Check your staging environment before you assume production is fine.

Also enforced: restrictions on background audio interactions, with exemptions for
alarm audio and some foreground-service gating.

## Post-quantum signing is in Keystore

Android Keystore now supports **ML-DSA** — Module-Lattice-Based Digital Signature
Algorithm, the NIST post-quantum standard — in two variants, `ML-DSA-65` and
`ML-DSA-87`.

The part that matters for adoption: it is exposed through the **standard Java
Cryptographic Architecture** APIs. `KeyPairGenerator`, `KeyFactory`, `Signature`.
No new surface to learn, no vendor SDK. If you generate signing keys in hardware
today, the shape of the code does not change — the algorithm string does.

Whether you need this yet is a separate question. Post-quantum signatures matter
where a signature has to remain verifiable for years and an adversary can store
today's traffic to attack later. For a session token that expires in an hour, it
does not. It is good that the platform is ready before the need is urgent, which
is the correct order for cryptographic migrations.

## Memory limits, briefly

Android 17 enforces **per-app memory limits derived from device RAM**, and a
process that exceeds them is killed **with no stack trace**. `ApplicationExitInfo`
is where you find out it happened.

This one deserves more than a paragraph, and it has its own note:
[Android 17 kills your process with no stack trace](/notes/android-17-memory-limits/).

## What users actually got

Two things worth knowing because support questions arrive about them:

**App Bubbles for any app.** Long-press an app on the home screen and it becomes a
chat-head-style floating bubble. Previously bubbles were a messaging affordance;
now any app can be one, which means your UI can be asked to render in a small
floating window it was never designed for.

**Find Hub "Mark as lost" can require biometrics.** Locking a lost device can now
demand biometric authentication in addition to the passcode, so someone who has
watched you type your PIN still cannot disable tracking. A small change with a
clear threat model behind it.

## What I would do this week

1. **Compile against SDK 37 in CI, without changing `targetSdk`.** You get
   deprecation and API-surface signal at zero behavioural risk.
2. **Grep for `System.load(`.** Fastest possible check for the breaking change
   most likely to be missed.
3. **Test on a foldable or a tablet emulator in landscape.** Not because it will
   look bad — because it will now happen whether or not you opted in.
4. **Run your staging TLS path.** CT-by-default fails loudly, but only where you
   have a non-public certificate, and that is usually not production.
5. **Then bump `targetSdk`**, deliberately, with time to react.

The pattern in this release is consistent: the platform is closing paths that used
to be optional — orientation opt-outs, writable native libraries, unrestricted LAN
access, unbounded memory. Each one was a place where an app could be careless and
the cost landed somewhere else. That is a defensible direction. It also means "it
still works" stops being evidence of anything the day you change one number.
