---
parentDomain: notes
parentId: notes-android-14-es
documentId: beta-1
locale: es
translationKey: android-14-beta-1
slug: beta-1
title: 'Android 14 Beta 1: abierta a usuarios'
summary: '12 de abril de 2023. La primera beta abrió el programa Android Beta y sumó acciones propias en la hoja de compartir, paths consultables y el atributo accessibilityDataSensitive.'
order: 3
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 1 salió el 12 de abril de 2023 y abrió Android 14 a usuarios
curiosos a través del programa Android Beta. Los dueños de un Pixel que ya
estaban en la beta QPR de Android 13 la recibieron sin hacer nada.

|                       |                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------- |
| Fecha                 | 12 de abril de 2023; Beta 1.1 el 26 de abril de 2023                                |
| Build                 | `UPB1.230309.014`; 1.1 `UPB1.230309.017` (`.A1` en Pixel 6, 6 Pro y 6a con Verizon) |
| Parche de seguridad   | Abril de 2023 (marzo de 2023 en los Pixel 6 con Verizon)                            |
| Dispositivos          | Del Pixel 4a (5G) al Pixel 7 Pro; imágenes de 64 bits del Android Emulator          |
| Cómo se obtenía       | Por OTA con Android Beta, o flasheando                                              |
| Estabilidad de la API | No                                                                                  |

Las apps pueden sumar sus propias acciones a la hoja de compartir del sistema
con `ChooserAction.Builder` y `Intent.EXTRA_CHOOSER_CUSTOM_ACTIONS`, y el orden
de los destinos de direct share usa el uso informado con
`pushDynamicShortcut()`. `Path` se volvió consultable e interpolable, con una
librería de AndroidX que llega hasta API 21. El atributo
`accessibilityDataSensitive` oculta una vista a los servicios de accesibilidad
que no declaran ayudar a personas con discapacidad.

La navegación por gestos recibió una flecha de retroceso más grande que toma
los colores del fondo de pantalla. Android Studio Giraffe Canary 7 con AGP
8.1.0-alpha07 empezó a generar el archivo `LocaleConfig` para los idiomas por
app.

La Beta 1.1 corrigió un cierre de System UI en "Wallpaper & style", el
desbloqueo con huella, un ícono de red móvil que faltaba y la detección de SIM
o eSIM.
