---
parentDomain: notes
parentId: notes-android-12-es
documentId: beta-1
locale: es
translationKey: android-12-beta-1
slug: beta-1
title: 'Android 12 Beta 1: Material You en I/O'
summary: 18 de mayo de 2021. La primera beta abrió Android Beta y llegó a teléfonos de socios con Material You, ubicación aproximada, permisos Bluetooth, hibernación y performance class.
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

Google presentó la Beta 1 en Google I/O el 18 de mayo de 2021. Fue la primera
build para usuarios pioneros: los dueños de un Pixel podían inscribirse en
Android Beta y recibirla por OTA, y los teléfonos de ASUS, OnePlus, Oppo,
Realme, Sharp, TCL, Transsion, Vivo, Xiaomi y ZTE podían instalar builds de
cada fabricante.

|                       |                                                                            |
| --------------------- | -------------------------------------------------------------------------- |
| Fecha                 | 18 de mayo de 2021                                                         |
| Build                 | `SPB1.210331.013`                                                          |
| Parche de seguridad   | Mayo de 2021                                                               |
| Dispositivos          | Pixel 3, 3a, 4, 4a, 4a 5G y 5; teléfonos de socios; imágenes GSI; emulador |
| Cómo se obtenía       | Por OTA con Android Beta, o flasheando                                     |
| Estabilidad de la API | No; seguía prevista para agosto de 2021                                    |

La Beta 1 fue la primera build con el rediseño Material You, que Google
llamó "the biggest design change in Android's history". Los widgets ganaron
esquinas redondeadas, casillas, interruptores y API de color dinámico, y el
overscroll elástico reemplazó al brillo. Una app que pierde el foco de audio
ahora baja su volumen hasta silenciarse.

En privacidad sumó la ubicación aproximada, `BLUETOOTH_SCAN` con
`neverForLocation` y `BLUETOOTH_CONNECT`, y la hibernación de apps, que
detiene las apps sin uso y corta sus trabajos y mensajes push. Google dijo
que el restablecimiento automático de permisos había reseteado los permisos
de más de 8,5 millones de apps sin uso en las dos semanas previas. La
performance class dio a las apps una comprobación en tiempo de ejecución para
dispositivos multimedia de gama alta.

Google también puso cifras al trabajo de rendimiento: los servicios centrales
del sistema usaban un 22% menos de CPU, y Google Photos abría un 34% más
rápido tras dejar los trampolines de notificación. El panel de privacidad,
los indicadores de cámara y micrófono y sus interruptores se anunciaron para
la Beta 2.
