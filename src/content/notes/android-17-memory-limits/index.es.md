---
entryId: notes-android-17-memory-limits-es
locale: es
translationKey: android-17-memory-limits
slug: android-17-limites-memoria
title: 'Android 17 mata tu proceso sin stack trace'
summary: Los límites de memoria por app son límites de cgroup que configura el fabricante, no se pueden consultar en runtime, y la muerte no deja crash log.
visibility: public
maturity: stable
publishedAt: 2026-07-29
updatedAt: 2026-07-29
topics: [android, kotlin, performance, platform-apis]
featuredRank: 4
image: /banners/android-17-memory-limits.svg
imageAlt: Banner de límites de memoria en Android 17 — muerto sin stack trace.
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

Fijate qué es `memory.high`: un límite **blando**. El kernel no te mata
inmediatamente por cruzarlo. Te estrangula e intenta reclamar. La muerte llega
después, cuando el reclamo no alcanza y una asignación falla. Por eso no hay un
`OutOfMemoryError` limpio que atrapar — a esa altura te están deteniendo, no
preguntando.

## Tres hechos que cambian cómo planificás

**1. No podés consultar el límite.** A partir de Android 17 — SDK 37 — no hay API
en runtime para preguntar cuál es tu límite. No podés leerlo, loguearlo, ni
adaptarte a él. Cualquier estrategia que implique "consultar el presupuesto y
quedarse abajo" no está disponible.

**2. Lo configura el fabricante.** Los límites vienen de
`/vendor/etc/memory-limiter-config.xml`, con bloques `<limitSet>` que declaran
`minimumRequiredMemTotal`, `memVisible`, `memNotVisible`, `swapVisible` y
`swapNotVisible` en MiB. AOSP recomienda un rango, no un valor:

- **Procesos visibles**: al menos 1/2 y como máximo 2/3 del RAM físico total
- **No visibles**: 1/4 a 1/3 del RAM físico total

El ejemplo de la documentación da `memVisible=8192` y `memNotVisible=4096` para un
dispositivo de 14GB o más.

Un rango fijado por el fabricante, sin API para leerlo, significa que **el
comportamiento difiere entre dispositivos con el mismo RAM**. Dos teléfonos de 8GB
pueden tener límites distintos, y tu app no tiene manera de distinguirlos.

**3. Si el archivo de configuración no está, el limiter queda desactivado por
completo.** Así que algunos dispositivos no aplican nada. "Funciona en mi teléfono"
nunca fue evidencia más débil que acá.

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

- La razón es **`REASON_OTHER`**, no una constante dedicada. Tenés que matchear
  contra el string de descripción, lo que significa que un cambio de redacción en
  la plataforma puede romper tu detección en silencio. Matcheá contra
  `"MemoryLimiter"`, no contra el `"MemoryLimiter:AnonSwap"` completo.
- Leé esto **en el siguiente arranque**, no en el momento de la muerte — no hay
  momento de la muerte que puedas observar. `getHistoricalProcessExitReasons` es la
  única ventana.

Si no agregás algo así, estas muertes llegan como una caída inexplicable en la
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
consulta que no existe. No podés preguntar cuál es tu límite, pero sí te pueden
avisar cuando te estás acercando.

## Qué reduce el número de verdad

Nada de esto es consejo nuevo. Es consejo recién obligatorio, que es distinto.

**Activá R8 bien.** `isMinifyEnabled = true`, `isShrinkResources = true`, y
`proguard-android-optimize.txt` en lugar de la variante que no optimiza. Una
cantidad sorprendente de proyectos tiene los dos primeros y no el tercero.

**Bajá la resolución de las imágenes al decodificar.** `inSampleSize` cuando
conocés el tamaño destino, y `RGB_565` cuando no necesitás transparencia — eso es
la mitad de bytes por pixel que `ARGB_8888`. Un bitmap a resolución completa para
un thumbnail es la forma más común de desperdiciar decenas de megabytes.

**Respondé a `onTrimMemory`.** Específicamente `TRIM_MEMORY_UI_HIDDEN` — el usuario
se fue, tus vistas no están visibles, y lo que cacheaste para dibujar es costo puro
— y `TRIM_MEMORY_BACKGROUND`. Casi todas las apps sobreescriben este método y no
liberan nada significativo dentro.

**Encontrá los leaks.** LeakCanary ahora se integra al profiler de Android Studio
directamente en Panda 3. Un leak bajo un límite de memoria ya no es una
degradación lenta; es una muerte segura con temporizador.

## Qué haría esta semana

1. **Enviá primero el chequeo de `ApplicationExitInfo`.** Son una docena de líneas
   y sin eso estás ciego. No podés arreglar una tasa que no podés ver.
2. **Cableá `TRIGGER_TYPE_ANOMALY`.** Es la única señal que mira para adelante.
3. **Revisá el tercer flag de R8.** Dos minutos, y a menudo una reducción real.
4. **Auditá los caminos de decodificación de bitmaps.** Donde suelen estar los
   megabytes.
5. **No ajustes contra un número.** No hay número que puedas leer, varía por
   fabricante, y en algunos dispositivos no existe. Construí margen, no un
   objetivo.

El resumen honesto: es un buen cambio con un mal modo de falla. Hacer que una app
hambrienta de memoria cargue con su propio costo — en vez de que lo paguen todas
las demás apps del teléfono — es la decisión correcta. Hacerlo con una muerte que
no deja rastro significa que las apps más afectadas son las que menos
probablemente se enteren. Por eso la detección, y no la optimización, es lo primero
que hay que publicar.
