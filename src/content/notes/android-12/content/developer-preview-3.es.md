---
parentDomain: notes
parentId: notes-android-12-es
documentId: developer-preview-3
locale: es
translationKey: android-12-developer-preview-3
slug: developer-preview-3
title: 'Android 12 Developer Preview 3: splash screens'
summary: 21 de abril de 2021. La última developer preview sumó la splash screen del sistema, CallStyle, SCHEDULE_EXACT_ALARM, el nuevo manejo de enlaces web y dejó obsoleto RenderScript.
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 3 salió el 21 de abril de 2021, cuatro semanas antes de
Google I/O. Fue la última build solo para desarrolladores; Google pidió
publicar actualizaciones compatibles "over the next few weeks", antes de la
Beta 1.

|                       |                                                          |
| --------------------- | -------------------------------------------------------- |
| Fecha                 | 21 de abril de 2021                                      |
| Build                 | `SPP3.210325.010`                                        |
| Parche de seguridad   | Abril de 2021                                            |
| Dispositivos          | Pixel 3, 3a, 4, 4a, 4a 5G y 5; Android Emulator          |
| Cómo se obtenía       | Flasheo o instalación manual; por OTA desde la Preview 2 |
| Estabilidad de la API | No                                                       |

La Preview 3 trajo la experiencia de arranque y la regla de las alarmas:

- **Splash screens.** Una animación de arranque y una splash screen con el
  ícono de la app, activas por defecto en todas las apps y personalizables con
  las nuevas API de splash screen.
- **`Notification.CallStyle`** para llamadas entrantes, en curso y filtradas.
- **`SCHEDULE_EXACT_ALARM`.** Las apps con target Android 12 debían
  declararlo para programar alarmas exactas. Google lo describió como un
  permiso normal, concedido al primer inicio, que el usuario podía revocar en
  "Special app access", y sumó `canScheduleExactAlarms()`.
- **Enlaces web.** Los enlaces que no estaban verificados como Android App
  Links ni aprobados por el usuario se abrían en el navegador por defecto, sin
  selector.
- **Reglas de backup.** Las apps con target Android 12 recibieron un nuevo
  formato XML con reglas separadas para el backup en la nube y la
  transferencia entre dispositivos.
- **Cierres nativos.** `ApplicationExitInfo.getTraceInputStream()` devolvía
  el tombstone de una salida `REASON_CRASH_NATIVE` como protocol buffer.
- **Cámara y multimedia.** Extensiones de fabricante en Camera2, soporte para
  sensores quad bayer y claves estándar para la cuantización del codificador
  de video.

Google también dejó obsoleto RenderScript en favor de Vulkan y OpenGL, e hizo
que los drivers de la Neural Networks API se actualizaran por Google Play
services.
