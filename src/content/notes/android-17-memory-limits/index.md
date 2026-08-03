---
entryId: notes-android-17-memory-limits
locale: en
translationKey: android-17-memory-limits
slug: android-17-memory-limits
title: 'Android 17 kills your process with no stack trace'
summary: Per-app memory limits are cgroup limits an OEM configures, you cannot query them at runtime, and the kill leaves no crash log.
visibility: public
maturity: stable
publishedAt: 2026-07-29
updatedAt: 2026-07-29
topics: [android, kotlin, performance, platform-apis]
featuredRank: 4
image: /banners/android-17-memory-limits.svg
imageAlt: Android 17 memory limits banner — killed with no stack trace.
links:
  - label: 'Prioritizing memory efficiency: essential steps for Android 17'
    href: https://android-developers.googleblog.com/2026/06/prioritizing-memory-efficiency-steps-for-android-17.html
    kind: publication
  - label: Memory Limiter (AOSP)
    href: https://source.android.com/docs/core/perf/memory-limiter
    kind: publication
references: []
evidence: []
documents: []
protection: { mode: public }
kind: article
lifecycle: current
series:
  id: android-17
  order: 3
citations:
  - title: 'Prioritizing memory efficiency: essential steps for Android 17'
    url: https://android-developers.googleblog.com/2026/06/prioritizing-memory-efficiency-steps-for-android-17.html
    accessedAt: 2026-07-29
  - title: Memory Limiter
    url: https://source.android.com/docs/core/perf/memory-limiter
    accessedAt: 2026-07-29
  - title: 'Behavior changes: all apps'
    url: https://developer.android.com/about/versions/17/behavior-changes-all
    accessedAt: 2026-07-29
---

Android 17 enforces per-app memory limits. When your process crosses one, the
system kills it — and there is **no stack trace**, no `OutOfMemoryError`, nothing
in your crash reporter that looks like a crash. From the inside it is
indistinguishable from the process simply ceasing to exist.

That is the whole problem. Not the limit. The silence.

## What is actually being limited

Google's developer blog says "memory limits based on device RAM". The AOSP
documentation says what that means, and it is more specific than the blog
suggests.

The Memory Limiter sets two **cgroup** values per process:

| Value             | Effect                                                    |
| ----------------- | --------------------------------------------------------- |
| `memory.high`     | Soft limit. The kernel throttles the process and reclaims |
| `memory.swap.max` | Caps how much swap the process can take                   |

The metric is **anonymous memory** — heap plus native allocations not backed by a
file. File-backed pages get evicted; anonymous pages get swapped. Which is why the
exit description says `AnonSwap`.

Note what `memory.high` is: a **soft** limit. The kernel does not immediately kill
you for crossing it. It throttles you and tries to reclaim. The death comes later,
when reclaim cannot keep up and an allocation fails. That is why there is no clean
`OutOfMemoryError` to catch — by then you are being stopped, not asked.

## Three facts that change how you plan

**1. You cannot query the limit.** As of Android 17 — SDK 37 — there is no runtime
API to ask what your limit is. You cannot read it, log it, or adapt to it. Any
strategy that involves "check the budget and stay under it" is not available.

**2. The OEM configures it.** The limits come from
`/vendor/etc/memory-limiter-config.xml`, with `<limitSet>` blocks declaring
`minimumRequiredMemTotal`, `memVisible`, `memNotVisible`, `swapVisible` and
`swapNotVisible` in MiB. AOSP recommends a range rather than a value:

- **Visible processes**: at least 1/2 and at most 2/3 of total physical RAM
- **Not visible**: 1/4 to 1/3 of total physical RAM

The example in the documentation gives `memVisible=8192` and `memNotVisible=4096`
for a device with 14GB or more.

A range set by the manufacturer, with no API to read it, means **behaviour differs
between devices with identical RAM**. Two phones with 8GB can have different
limits, and your app has no way to tell them apart.

**3. If the config file is absent, the limiter is disabled entirely.** So some
devices enforce nothing. "It works on my phone" has never been weaker evidence
than it is here.

## Which processes are exempt

Only `PERSISTENT` and `PERSISTENT_UI` — system processes. Everything an app can
be is monitored: `TOP`, `FOREGROUND_SERVICE`, `IMPORTANT_FOREGROUND`,
`TRANSIENT_BACKGROUND`, `BACKUP`, `SERVICE`, `RECEIVER`, `CACHED`.

Cached processes get the harshest treatment: maximally reclaimed and frozen. Which
is the point of the feature, stated plainly in Google's own framing:

> When an app becomes bloated or leaks memory while holding a privileged state,
> the LMK is forced to compensate by killing off dozens of smaller, well-behaved
> cached apps.

One greedy app used to cost every other app its warm state. The limiter makes the
greedy app pay instead. Hard to argue with the direction.

## How to detect it

This is the actionable part. The kill is silent, but it is recorded.

```kotlin
val activityManager = getSystemService(ActivityManager::class.java)

activityManager.getHistoricalProcessExitReasons(packageName, 0, 10)
    .filter { it.reason == ApplicationExitInfo.REASON_OTHER }
    .filter { it.description?.contains("MemoryLimiter") == true }
    .forEach { exit ->
        // description contains "MemoryLimiter:AnonSwap"
        report("memory-limit-kill", exit.description, exit.timestamp)
    }
```

Two details that matter:

- The reason is **`REASON_OTHER`**, not a dedicated constant. You have to match on
  the description string, which means a platform wording change can silently break
  your detection. Match on `"MemoryLimiter"`, not the full `"MemoryLimiter:AnonSwap"`.
- Read this **on the next launch**, not at the moment of death — there is no moment
  of death you get to observe. `getHistoricalProcessExitReasons` is the only
  window.

If you do not add something like this, these kills arrive as an unexplained dip in
session length and a rise in cold starts, with nothing in Crashlytics to connect
them to.

## Catching it before the platform does

`ProfilingManager` — introduced in Android 15, extended in 17 — gives you two
triggers worth wiring up:

- **`TRIGGER_TYPE_OOM`** collects a Java heap dump at the moment of an
  `OutOfMemoryError`. The dump you always wanted and never had.
- **`TRIGGER_TYPE_ANOMALY`** fires on severe performance problems including memory
  thresholds being approached — _before_ the system enforces.

```kotlin
val profilingManager = getSystemService(ProfilingManager::class.java)
profilingManager.registerForAllProfilingResults(mainExecutor, resultCallback)
profilingManager.addProfilingTriggers(triggers)
```

`TRIGGER_TYPE_ANOMALY` is the one that changes the game: it is the closest thing to
the query API that does not exist. You cannot ask what your limit is, but you can
be told when you are approaching it.

## What actually reduces the number

None of this is new advice. It is newly enforced advice, which is different.

**Turn on R8 properly.** `isMinifyEnabled = true`, `isShrinkResources = true`, and
`proguard-android-optimize.txt` rather than the non-optimising variant. A
surprising number of projects have the first two and not the third.

**Downsample images at decode time.** `inSampleSize` when you know the target
size, and `RGB_565` when you do not need transparency — that is half the bytes per
pixel of `ARGB_8888`. A full-resolution bitmap for a thumbnail is the single most
common way an app wastes tens of megabytes.

**Respond to `onTrimMemory`.** Specifically `TRIM_MEMORY_UI_HIDDEN` — the user
left, your views are not visible, and whatever you cached for rendering is pure
cost — and `TRIM_MEMORY_BACKGROUND`. Most apps override this method and drop
nothing meaningful in it.

**Find the leaks.** LeakCanary now integrates into the Android Studio profiler
directly in Panda 3. A leak under a memory limit is no longer a slow degradation;
it is a hard kill on a timer.

## What I would do this week

1. **Ship the `ApplicationExitInfo` check first.** It is a dozen lines and without
   it you are blind. You cannot fix a rate you cannot see.
2. **Wire `TRIGGER_TYPE_ANOMALY`.** It is the only forward-looking signal available.
3. **Check the third R8 flag.** Two minutes, and often a real reduction.
4. **Audit bitmap decoding paths.** Where the megabytes usually are.
5. **Do not tune to a number.** There is no number you can read, it varies by OEM,
   and on some devices it does not exist. Build headroom, not a target.

The honest summary: this is a good change with a bad failure mode. Making a
memory-hungry app bear its own cost — instead of every other app on the phone
paying for it — is the right call. Doing it with a kill that leaves no trace means
the apps most affected are the least likely to find out. Which is why detection,
not optimisation, is the first thing to ship.
