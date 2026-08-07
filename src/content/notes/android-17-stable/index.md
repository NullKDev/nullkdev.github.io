---
entryId: notes-android-17-stable
locale: en
translationKey: android-17-stable
slug: android-17-stable
title: 'Android 17: what breaks on targetSdk 37'
summary: From Beta 3 to the June 16 release — the behaviour changes that stay dormant until you bump targetSdk to 37, and the two runtime rewrites underneath them.
visibility: public
maturity: stable
publishedAt: 2026-07-29
updatedAt: 2026-08-06
topics: [android, kotlin, platform-apis, security]
featuredRank: 3
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
  - title: 'Behavior changes: apps targeting Android 17'
    url: https://developer.android.com/about/versions/17/behavior-changes-17
    accessedAt: 2026-08-06
  - title: MessageQueue behavior change guidance
    url: https://developer.android.com/about/versions/17/changes/messagequeue
    accessedAt: 2026-08-06
  - title: Background audio hardening
    url: https://developer.android.com/about/versions/17/changes/bg-audio
    accessedAt: 2026-08-06
  - title: Android Contact Picker
    url: https://developer.android.com/about/versions/17/features/contact-picker
    accessedAt: 2026-08-06
  - title: Prepare your app for the resizability and orientation changes
    url: https://android-developers.googleblog.com/2026/02/prepare-your-app-for-resizability-and.html
    accessedAt: 2026-08-06
---

Android 17 — API 37, internal codename _Cinnamon Bun_ — went stable on
**16 June 2026**, alongside the June Pixel Drop, on Pixel 6 and newer. Other OEMs
have been joining the rollout since. Beta 4 — the final beta, where the API
surface locked — shipped on **16 April**. My
[Beta 3 write-up](/notes/android-17-beta-3/) covers API 37 at platform stability;
this covers what happened after it, and what actually costs you time.

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

## What breaks on targetSdk 37

### 1. Large-screen resizability is no longer optional

Apps targeting Android 17 **can no longer opt out** of orientation, resizability
and aspect-ratio constraints on displays whose smallest width is over **600dp**.
The manifest flags that used to pin an app to portrait stop being honoured, the
app fills the whole display window, and there is no pillarboxing to hide behind.

This is the one to plan for, not patch. If your layout assumed a fixed
orientation, it will be resized on a tablet or a foldable and you will find out
where the assumptions live. Google frames Android 17 as the move to an
"adaptive-first" standard, and this is the clause that enforces it.

The exemption is narrower than "games are fine": it applies to apps that
**declare `android:appCategory="game"`**. It is a manifest declaration, not a
vibe, and Play distribution makes targeting API 37 mandatory for new apps and
updates in **August 2027** — so the exemption buys layout work, not an escape.

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

Apps targeting 17 have **local network access blocked by default**. mDNS, raw
sockets, device discovery — anything that reaches a printer, a Chromecast, a smart
bulb, a local dev server, or another phone on the same Wi-Fi.

There are **two ways back in**, and the order matters:

1. **A system-mediated device picker.** The user chooses the device, the system
   grants the scope, and you never show a permission prompt at all.
2. **The new `ACCESS_LOCAL_NETWORK` runtime permission**, requested explicitly,
   for persistent LAN communication.

Reaching for the permission first is the reflex, and it is the worse option: you
pay a prompt, a denial rate, and a justification you have to write. Try the picker
before you decide you need blanket access.

### 4. Background audio needs a foreground service

Playback, audio-focus requests and volume changes from an app that is not visible
now require a **running foreground service**. On top of that, the app must satisfy
one of two conditions:

- the foreground service has **while-in-use (WIU)** capabilities, or
- the app holds the **exact alarm** permission and is driving `USAGE_ALARM`
  streams.

Note what the platform actually demands — a foreground service with the right
capability. `MediaSessionService` is not in the rule; it is the practical way to
satisfy it. Media3 configures, starts and stops that service for you and publishes
the media notification, so an app built on `MediaSessionService` is mostly already
compliant.

Which makes this the deadline for **ExoPlayer 2**. It is unmaintained, it does not
manage the foreground-service lifecycle, and the new rules are shaped around
Media3's session and focus handling. Nothing hard-blocks ExoPlayer 2 from running
— you just get interrupted playback, lost focus and broken notifications, which is
a worse failure than a crash because nobody files a bug for it.

For apps that do _not_ target 17, the softer version of this still applies: audio
APIs called outside a valid lifecycle **fail silently**, and audio focus returns
`AUDIOFOCUS_REQUEST_FAILED`.

### 5. Reflection into the platform stops working

Two changes, one root cause, and they land on your dependencies rather than your
code.

**`static final` fields can no longer be changed.** An app running on 17 and
targeting 37 that rewrites one by reflection gets an `IllegalAccessException`;
doing it through JNI (`SetStaticLongField()` and friends) **crashes the process**.
Test doubles, feature-flag shims and analytics SDKs do this more than you would
guess.

**`MessageQueue` is a new lock-free implementation.** The old one used a single
lock for the main thread's task queue, so a background thread could block the main
one — contention that showed up as dropped frames. The rewrite removes it. The
cost is that anything reflecting into `MessageQueue` internals breaks: `mMessages`
still exists for binary compatibility, but it is **always `null`**, whether or not
messages are pending. Espresso and Robolectric are the ones you will hit first, so
update those libraries before you touch `targetSdk`.

Audit your dependency tree before the bump, not after. A silent `null` from a
field that used to hold data is the most expensive kind of failure to trace.

### 6. OTP SMS arrives three hours late

For most apps targeting 17, one-time-password SMS **is not readable until three
hours after it arrives**. During that window the `SMS_RECEIVED_ACTION` broadcast
is withheld and SMS provider queries are filtered. The default SMS assistant app
and companion-device apps are exempt.

The same three-hour hold applies to **WebOTP-format messages regardless of
targetSdk**, when the app is not the verified recipient by domain.

Three hours is not a delay you design around; it is a message that reading the
inbox is over. If you still parse SMS directly, move to **SMS Retriever** or **SMS
User Consent** — both hand you the code without the app reading the user's
messages, which is the point.

### 7. Certificate Transparency is on by default

CT was opt-in on Android 16. For apps targeting 17 it is **enabled by default**.

For almost everyone this is invisible and good. It bites in exactly one place: if
you pin or inject a certificate that is not in a public CT log — a corporate
proxy, a test harness, an internal CA — connections that used to work will fail.
Check your staging environment before you assume production is fine.

### 8. Contacts get narrower

Two things moved, and only one of them breaks.

The breaking one: for apps targeting 37, **Contacts Provider 2 hides PII columns**
from the data view — `ACCOUNT_NAME`, `ACCOUNT_TYPE`, `ACCOUNT_TYPE_AND_DATA_SET`.
If you query them, plan for them to be gone.

The other is an opportunity. Android 17 ships a standardised **Contact Picker**: a
browsable system UI where you declare the fields you need — phone numbers, emails
— and the user hands you specific contacts. `READ_CONTACTS` is not deprecated, but
it is now the blunt option. If you asked for the whole address book because there
was no alternative, there is one now.

## The garbage collector went generational

ART's Concurrent Mark-Compact collector is now **generational**. Instead of
treating every object the same and sweeping the whole heap, it runs frequent cheap
young-generation collections and reserves full-heap passes for when they are
actually needed.

The premise is the oldest observation in garbage collection: most objects die
young. Acting on it cuts GC CPU cost and collection duration, which shows up as
fewer dropped frames and less battery burned doing bookkeeping.

You get this for free — no `targetSdk`, no code change. And because ART ships
through Google Play system updates, runtime improvements reach devices back to
**API 31**, not just the ones that took the OS upgrade.

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
2. **Audit your dependencies for reflection.** Testing, feature-flag and analytics
   libraries are the ones rewriting `static final` fields and reading
   `MessageQueue` internals. Update Espresso and Robolectric first.
3. **Grep for `System.load(`.** Fastest possible check for the breaking change
   most likely to be missed.
4. **Test on a foldable or a tablet emulator in landscape.** Not because it will
   look bad — because it will now happen whether or not you opted in.
5. **Inventory your permissions.** Anything touching the LAN, the address book or
   the SMS inbox now has a narrower, system-mediated path that beats asking.
6. **Run your staging TLS path.** CT-by-default fails loudly, but only where you
   have a non-public certificate, and that is usually not production.
7. **Then bump `targetSdk`**, deliberately, with time to react.

If you run a team, do not wait for the Play deadline to force the number. The
audit is the slow part, not the bump.

The pattern in this release is consistent: the platform is closing paths that used
to be optional — orientation opt-outs, writable native libraries, unrestricted LAN
access, broad contact reads, SMS scraping, reflection into internals, unbounded
memory. Each one was a place where an app could be careless and the cost landed
somewhere else. That is a defensible direction. It also means "it still works"
stops being evidence of anything the day you change one number.
