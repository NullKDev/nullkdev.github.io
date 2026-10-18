---
parentDomain: notes
parentId: notes-android-16-es
documentId: developer-preview-2
locale: es
translationKey: android-16-developer-preview-2
slug: developer-preview-2
title: 'Android 16 Developer Preview 2: jobs y trazas'
summary: 18 de diciembre de 2024. La segunda preview sumó perfilado iniciado por el sistema, motivos de jobs pendientes y hápticos más ricos, y trajo los primeros cambios en JobScheduler.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, performance]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 2 salió el 18 de diciembre de 2024. Google dijo que sus
cambios estaban "designed to enhance the app experience, improve battery life,
and boost performance while minimizing incompatibilities". Los teléfonos con la DP1 la recibieron
por OTA; seguía siendo una build solo para desarrolladores.

|                           |                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Fecha                     | 18 de diciembre de 2024                                                                                     |
| Build                     | `BP21.241121.009`                                                                                           |
| Parche de seguridad       | Diciembre de 2024                                                                                           |
| Dispositivos              | Pixel 6 y posteriores, Pixel Fold y Pixel Tablet; imágenes de 64 bits del Android Emulator                  |
| Cómo se obtenía           | Flasheando una imagen, o por OTA desde la DP1. Con Android 15 QPR Beta 2 se podía flashear sin borrar datos |
| Estabilidad de plataforma | No; seguía prevista para marzo de 2025                                                                      |

## Qué agregó la Developer Preview 2

- **Perfilado iniciado por el sistema.**
  `ProfilingManager.addProfilingTriggers()` pide al sistema una traza ante un
  arranque en frío (`onFullyDrawn`) o un ANR, casos que una app no puede
  trazar sola.
- **Componente de arranque.** `ApplicationStartInfo.getStartComponent()`
  indica qué tipo de componente inició el proceso.
- **Introspección de jobs.** `JobScheduler.getPendingJobReasons(int)` devuelve
  todos los motivos por los que un job espera, y
  `getPendingJobReasonsHistory(int)` los cambios recientes de sus
  restricciones.
- **Frecuencia de actualización adaptable.** Llegaron `hasArrSupport()` y
  `getSuggestedFrameRate(int)`, y volvió `getSupportedRefreshRates()`.
- **Hápticos más ricos.** Las apps pueden definir las curvas de amplitud y
  frecuencia de un efecto háptico, sin depender del actuador del dispositivo.
- **Atrás predictivo.** `PRIORITY_SYSTEM_NAVIGATION_OBSERVER` permite a una
  app ver los gestos atrás que maneja el sistema, y
  `finishAndRemoveTaskCallback()` y `moveTaskToBackCallback()` activan
  animaciones del sistema.
- **Otras.** APIs de búsqueda en la nube para el selector de fotos; medición
  de distancia segura por Wi-Fi con 802.11az, con cifrado AES-256 y
  protección contra ataques de intermediario; y un tipo de dato
  `ACTIVITY_INTENSITY` en Health Connect.

## Qué cambió la Developer Preview 2

- **Cuotas de jobs.** El tiempo de ejecución de los jobs normales y
  acelerados ahora depende del bucket de standby, y también cuenta mientras la
  app está visible o tiene un servicio en primer plano.
- **`setImportantWhileForeground()`.** Obsoleto desde Android 12, ahora se
  ignora, e `isImportantWhileForeground()` devuelve `false`.
- **Anuncios de accesibilidad.** `announceForAccessibility()` y los eventos
  `TYPE_ANNOUNCEMENT` quedan obsoletos; las alternativas son los títulos de
  panel, las regiones live y `setError()`.

La build también corrigió un error de la app Terminal, "No local assets",
reportado en la DP1.
