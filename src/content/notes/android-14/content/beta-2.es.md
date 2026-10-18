---
parentDomain: notes
parentId: notes-android-14-es
documentId: beta-2
locale: es
translationKey: android-14-beta-2
slug: beta-2
title: 'Android 14 Beta 2: otras marcas, Ultra HDR'
summary: '10 de mayo de 2023, en Google I/O. La segunda beta llegó a otras marcas y sumó Ultra HDR, mejoras de cámara, Health Connect en el sistema y límites al full-screen intent.'
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

La Beta 2 salió el 10 de mayo de 2023, el día de Google I/O, y fue la
primera build de Android 14 para teléfonos fuera de la línea Pixel.

|                       |                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Fecha                 | 10 de mayo de 2023; Beta 2.1 el 25 de mayo de 2023                                                                                     |
| Build                 | `UPB2.230407.014`; 2.1 `UPB2.230407.019`                                                                                               |
| Parche de seguridad   | Mayo de 2023                                                                                                                           |
| Dispositivos          | Del Pixel 4a (5G) al Pixel 7 Pro; teléfonos, tablets y plegables de iQOO, Lenovo, Nothing, OnePlus, OPPO, Realme, Tecno, vivo y Xiaomi |
| Cómo se obtenía       | Por OTA con Android Beta, o flasheando                                                                                                 |
| Estabilidad de la API | No; Google todavía la esperaba para junio                                                                                              |

Llegó Ultra HDR: fotos de 10 bits que siguen funcionando como JPEG y se ven en
HDR cuando la ventana lo activa con `Window.setColorMode()`. Las extensiones de
cámara ganaron estimaciones de latencia con
`getRealtimeStillCaptureLatency()`, callbacks de progreso, una imagen postview
y `EXTENSION_STRENGTH`. La build también sumó zoom en el sensor con un flujo
RAW recortado, audio USB sin pérdida con `AudioMixerAttributes`, mallas
personalizadas con shaders AGSL y `HardwareBufferRenderer`.

Health Connect pasó a la plataforma, con rutas de ejercicio. El diálogo de
ubicación empezó a mostrar los datos compartidos con terceros, tomados del
formulario de Seguridad de los datos de Play. `USE_FULL_SCREEN_INTENT` quedó
limitado a apps de llamadas y alarmas, con `canUseFullScreenIntent()` para
comprobarlo.

Predictive back se pudo activar por actividad, y
`overrideActivityTransition()` reemplazó a `overridePendingTransition()` en
las transiciones que siguen el deslizamiento. Las animaciones del sistema
siguieron detrás de una opción de desarrollador.

La Beta 2.1 corrigió la configuración del dispositivo después de salir de la
beta, un nivel de batería fijo en 0% y cortes de audio en el altavoz.
