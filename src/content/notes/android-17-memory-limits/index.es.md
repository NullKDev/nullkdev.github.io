---
entryId: notes-android-17-memory-limits-es
locale: es
translationKey: android-17-memory-limits
slug: android-17-limites-memoria
title: 'Android 17 mata tu proceso sin stack trace'
summary: Los límites de memoria por app son límites de cgroup atados al RAM del dispositivo, no se pueden consultar en runtime, y la muerte no deja crash log.
visibility: public
maturity: stable
publishedAt: 2026-07-29
updatedAt: 2026-10-17
topics: [android, kotlin, performance, platform-apis]
featuredRank: 5
image: /banners/android-17-memory-limits.svg
imageAlt: 'Banner de Android 17 límites de memoria, con el logo de Android 17.'
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

Android 17 aplica límites de memoria por app. Cuando tu proceso cruza uno, el
sistema lo mata — y no hay **stack trace**, no hay `OutOfMemoryError`, no hay nada
en tu reportador de crashes que parezca un crash. Desde adentro es indistinguible
de que el proceso simplemente deje de existir.

Ese es todo el problema. No el límite. El silencio.

## Qué se está limitando realmente

El blog de desarrolladores de Google dice "límites de memoria basados en el RAM del
dispositivo". La documentación de AOSP dice qué significa eso, y es más específico
de lo que el blog sugiere.

El Memory Limiter fija dos valores de **cgroup** por proceso:

| Valor             | Efecto                                                           |
| ----------------- | ---------------------------------------------------------------- |
| `memory.high`     | Límite blando. El kernel estrangula el proceso y reclama memoria |
| `memory.swap.max` | Limita cuánto swap puede tomar el proceso                        |

La métrica es **memoria anónima** — heap más asignaciones nativas que no están
respaldadas por un archivo. Las páginas respaldadas por archivo se desalojan; las
anónimas van a swap. Por eso la descripción de salida dice `AnonSwap`.

Fíjate qué es `memory.high`: un límite **blando**. El kernel no te mata
inmediatamente por cruzarlo. Te estrangula e intenta reclamar. La muerte llega
después, cuando el reclamo no alcanza y una asignación falla. Por eso no hay un
`OutOfMemoryError` limpio que atrapar — a esa altura te están deteniendo, no
preguntando.

## Tres hechos que cambian cómo planificas

**1. No puedes consultar el límite.** A partir de Android 17 — SDK 37 — no hay API
en runtime para preguntar cuál es tu límite. Tu app no puede leerlo, loguearlo, ni
adaptarse a él. Cualquier estrategia que implique "consultar el presupuesto y
quedarse abajo" no está disponible. En un dispositivo de pruebas sí puedes verlo:
`adb shell am memory-limiter status` muestra los límites para procesos visibles y
no visibles, y `am memory-limiter manual <pid> <MB>` impone uno más estricto para
que veas a tu app chocar contra él.

**2. Quién fija los números depende de qué fuente leas.** Los límites son bloques
`<limitSet>` en un `memory-limiter-config.xml`, que declaran
`minimumRequiredMemTotal`, `maximumAllowedMemTotal`, `memVisible`,
`memNotVisible`, `swapVisible` y `swapNotVisible` en MiB. Las dos fuentes
primarias no coinciden en dónde vive ese archivo:

- **El código publicado** (`MemoryLimiter.java` en `android-17.0.0_r1`) lee
  `/vendor/etc/memory-limiter-config.xml`, la partición que controla el
  fabricante. La documentación de AOSP decía lo mismo en julio de 2026.
- **La documentación actual** (actualizada desde agosto de 2026) dice
  `/system/etc/memory-limiter-config.xml` y define límites estándar de plataforma
  por nivel de RAM. Nombra la "consistencia del ecosistema" como principio y no
  admite listas de excepciones por app.

Las dos ponen a los procesos visibles en aproximadamente 1/2 a 2/3 del RAM físico
y a los no visibles en 1/4 a 1/3. Los niveles estándar, según el `MemTotal` del
kernel:

| RAM del dispositivo | Rango de `MemTotal` (MiB) | Visible | No visible |
| ------------------- | ------------------------- | ------- | ---------- |
| 16 GB               | 14336 a 18431             | 10 GiB  | 5 GiB      |
| 12 GB               | 9216 a 14335              | 8 GiB   | 4 GiB      |
| 8 GB                | 6800 a 9215               | 5 GiB   | 3 GiB      |
| 6 GB                | 4800 a 6799               | 4 GiB   | 2 GiB      |
| 4 GB                | 3200 a 4799               | 2 GiB   | 1 GiB      |

Los límites de swap coinciden con el límite de memoria no visible en cada nivel.

**3. Algunos dispositivos no aplican nada.** En el código publicado, si el archivo
de configuración falta o es inválido, el limiter queda desactivado. Con los
niveles estándar, los dispositivos con 18.432 MiB de `MemTotal` o más, o con menos
de 3.200, no tienen límites. "Funciona en mi teléfono" nunca fue evidencia más
débil que aquí.

## Qué procesos están exentos

Solo `PERSISTENT` y `PERSISTENT_UI` — procesos del sistema. Todo lo que una app
puede ser está monitoreado: `TOP`, `FOREGROUND_SERVICE`, `IMPORTANT_FOREGROUND`,
`TRANSIENT_BACKGROUND`, `BACKUP`, `SERVICE`, `RECEIVER`, `CACHED`.

Los procesos cacheados reciben el trato más duro: reclamados al máximo y
congelados. Que es el punto de la función, dicho sin vueltas en el propio planteo
de Google:

> Cuando una app se infla o pierde memoria mientras mantiene un estado
> privilegiado, el LMK se ve forzado a compensar matando decenas de apps cacheadas
> más chicas y bien comportadas.

Una app codiciosa le costaba a todas las demás su estado tibio. El limiter hace que
pague la codiciosa. Difícil discutir la dirección.

## Cómo detectarlo

Esta es la parte accionable. La muerte es silenciosa, pero queda registrada.

```kotlin
val activityManager = getSystemService(ActivityManager::class.java)

activityManager.getHistoricalProcessExitReasons(packageName, 0, 10)
    .filter { it.reason == ApplicationExitInfo.REASON_OTHER }
    .filter { it.description?.contains("MemoryLimiter") == true }
    .forEach { exit ->
        // la descripción contiene "MemoryLimiter:AnonSwap"
        report("memory-limit-kill", exit.description, exit.timestamp)
    }
```

Dos detalles que importan:

- La razón es **`REASON_OTHER`**, no una constante dedicada. Tienes que matchear
  contra el string de descripción, lo que significa que un cambio de redacción en
  la plataforma puede romper tu detección en silencio. Matchea contra
  `"MemoryLimiter"`, no contra el `"MemoryLimiter:AnonSwap"` completo.
- Lee esto **en el siguiente arranque**, no en el momento de la muerte — no hay
  momento de la muerte que puedas observar. `getHistoricalProcessExitReasons` es la
  única ventana.

Si no agregas algo así, estas muertes llegan como una caída inexplicable en la
duración de sesión y una suba de cold starts, sin nada en Crashlytics que las
conecte.

## Atraparlo antes que la plataforma

`ProfilingManager` — introducido en Android 15, extendido en 17 — te da dos
disparadores que vale cablear:

- **`TRIGGER_TYPE_OOM`** recolecta un heap dump de Java en el momento de un
  `OutOfMemoryError`. El dump que siempre quisiste y nunca tuviste.
- **`TRIGGER_TYPE_ANOMALY`** se dispara ante problemas severos de rendimiento,
  incluyendo umbrales de memoria que se están acercando — _antes_ de que el sistema
  aplique el límite.

```kotlin
val profilingManager = getSystemService(ProfilingManager::class.java)
profilingManager.registerForAllProfilingResults(mainExecutor, resultCallback)
profilingManager.addProfilingTriggers(triggers)
```

`TRIGGER_TYPE_ANOMALY` es el que cambia el juego: es lo más cercano a la API de
consulta que no existe. No puedes preguntar cuál es tu límite, pero sí te pueden
avisar cuando te estás acercando.

## Qué reduce el número de verdad

Nada de esto es consejo nuevo. Es consejo recién obligatorio, que es distinto.

**Activa R8 bien.** `isMinifyEnabled = true`, `isShrinkResources = true`, y
`proguard-android-optimize.txt` en lugar de la variante que no optimiza. Una
cantidad sorprendente de proyectos tiene los dos primeros y no el tercero.

**Baja la resolución de las imágenes al decodificar.** `inSampleSize` cuando
conoces el tamaño destino, y `RGB_565` cuando no necesitas transparencia — eso es
la mitad de bytes por pixel que `ARGB_8888`. Un bitmap a resolución completa para
un thumbnail es la forma más común de desperdiciar decenas de megabytes.

**Responde a `onTrimMemory`.** Específicamente `TRIM_MEMORY_UI_HIDDEN` — el usuario
se fue, tus vistas no están visibles, y lo que cacheaste para dibujar es costo puro
— y `TRIM_MEMORY_BACKGROUND`. Casi todas las apps sobreescriben este método y no
liberan nada significativo dentro.

**Encuentra los leaks.** LeakCanary ahora se integra al profiler de Android Studio
directamente en Panda 3. Un leak bajo un límite de memoria ya no es una
degradación lenta; es una muerte segura con temporizador.

## Qué haría esta semana

1. **Envía primero el chequeo de `ApplicationExitInfo`.** Son una docena de líneas
   y sin eso estás ciego. No puedes arreglar una tasa que no puedes ver.
2. **Cablea `TRIGGER_TYPE_ANOMALY`.** Es la única señal que mira para adelante.
3. **Revisa el tercer flag de R8.** Dos minutos, y a menudo una reducción real.
4. **Audita los caminos de decodificación de bitmaps.** Donde suelen estar los
   megabytes.
5. **No ajustes contra un número.** Tu app no puede leerlo, depende del nivel
   de RAM del dispositivo, y en algunos dispositivos no existe. Construye margen,
   no un objetivo.

El resumen honesto: es un buen cambio con un mal modo de falla. Hacer que una app
hambrienta de memoria cargue con su propio costo — en vez de que lo paguen todas
las demás apps del teléfono — es la decisión correcta. Hacerlo con una muerte que
no deja rastro significa que las apps más afectadas son las que menos
probablemente se enteren. Por eso la detección, y no la optimización, es lo primero
que hay que publicar.
