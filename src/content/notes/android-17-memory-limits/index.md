---
entryId: notes-android-17-memory-limits
locale: en
translationKey: android-17-memory-limits
slug: android-17-memory-limits
title: 'Android 17 kills your process with no stack trace'
summary: Per-app memory limits are cgroup limits tied to device RAM, you cannot query them at runtime, and the kill leaves no crash log.
visibility: public
maturity: stable
publishedAt: 2026-07-29
updatedAt: 2026-10-17
topics: [android, kotlin, performance, platform-apis]
featuredRank: 5
image: /banners/android-17-memory-limits.svg
imageAlt: 'Android 17 memory limits banner, with the Android 17 logo.'
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
  - title: 'Android 17 emblem — Wikimedia Commons (AOSP / Android Developers licence, trademark of Google LLC)'
    url: https://commons.wikimedia.org/wiki/File:Android_17_Developer_Preview_Logo.svg
    accessedAt: 2026-10-17
  - title: 'Prioritizing memory efficiency: essential steps for Android 17'
    url: https://android-developers.googleblog.com/2026/06/prioritizing-memory-efficiency-steps-for-android-17.html
    accessedAt: 2026-07-29
  - title: Memory Limiter
    url: https://source.android.com/docs/core/perf/memory-limiter
    accessedAt: 2026-10-17
  - title: 'Behavior changes: all apps'
    url: https://developer.android.com/about/versions/17/behavior-changes-all
    accessedAt: 2026-10-17
  - title: MemoryLimiter.java at android-17.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-17.0.0_r1/services/core/java/com/android/server/am/MemoryLimiter.java
    accessedAt: 2026-10-17
  - title: Memory Limiter, as published in July 2026 (Internet Archive)
    url: https://web.archive.org/web/20260723233811/https://source.android.com/docs/core/perf/memory-limiter
    accessedAt: 2026-10-17
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
API to ask what your limit is. Your app cannot read it, log it, or adapt to it.
Any strategy that involves "check the budget and stay under it" is not available.
On a test device you can see it: `adb shell am memory-limiter status` prints the
visible and not-visible limits, and `am memory-limiter manual <pid> <MB>` imposes
a tighter one so you can watch your app hit it.

**2. Who sets the numbers depends on which source you read.** The limits are
`<limitSet>` blocks in a `memory-limiter-config.xml`, declaring
`minimumRequiredMemTotal`, `maximumAllowedMemTotal`, `memVisible`,
`memNotVisible`, `swapVisible` and `swapNotVisible` in MiB. The two primary
sources disagree on where that file lives:

- **The released code** (`MemoryLimiter.java` at `android-17.0.0_r1`) reads
  `/vendor/etc/memory-limiter-config.xml`, the partition the device maker owns.
  AOSP's documentation said the same in July 2026.
- **The current documentation** (updated since August 2026) says
  `/system/etc/memory-limiter-config.xml` and defines standard platform limits
  per RAM tier. It names "ecosystem consistency" as a principle and allows no
  per-app allowlists.

Both put visible processes at roughly 1/2 to 2/3 of physical RAM and not-visible
ones at 1/4 to 1/3. The standard tiers, by kernel `MemTotal`:

| Device RAM | `MemTotal` range (MiB) | Visible | Not visible |
| ---------- | ---------------------- | ------- | ----------- |
| 16 GB      | 14336 to 18431         | 10 GiB  | 5 GiB       |
| 12 GB      | 9216 to 14335          | 8 GiB   | 4 GiB       |
| 8 GB       | 6800 to 9215           | 5 GiB   | 3 GiB       |
| 6 GB       | 4800 to 6799           | 4 GiB   | 2 GiB       |
| 4 GB       | 3200 to 4799           | 2 GiB   | 1 GiB       |

Swap limits match the not-visible memory limit in every tier.

**3. Some devices enforce nothing.** In the released code, a missing or invalid
config file disables the limiter. Under the standard tiers, devices with 18,432
MiB of `MemTotal` or more, or less than 3,200, get no limits at all. "It works on
my phone" has never been weaker evidence than it is here.

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
5. **Do not tune to a number.** Your app cannot read it, it depends on the
   device's RAM tier, and on some devices it does not exist. Build headroom, not a
   target.

The honest summary: this is a good change with a bad failure mode. Making a
memory-hungry app bear its own cost — instead of every other app on the phone
paying for it — is the right call. Doing it with a kill that leaves no trace means
the apps most affected are the least likely to find out. Which is why detection,
not optimisation, is the first thing to ship.
