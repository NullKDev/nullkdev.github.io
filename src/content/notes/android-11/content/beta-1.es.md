---
parentDomain: notes
parentId: notes-android-11-es
documentId: beta-1
locale: es
translationKey: android-11-beta-1
slug: beta-1
title: 'Android 11 Beta 1: API finales, sin evento'
summary: 10 de junio de 2020. Con una semana de retraso y sin evento, la primera beta abrió Android Beta por OTA, congeló las API del SDK y del NDK y abrió Play a las apps con target 11.
order: 5
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 1 salió el 10 de junio de 2020, una semana después de la nueva fecha.
El 29 de mayo, Google postergó el evento y la beta del 3 de junio con un "now is
not the time to celebrate". Después canceló el evento virtual "to allow people
to focus on important discussions around racial justice in the United States" y
publicó la beta con videos cortos y páginas web.

|                       |                                                                   |
| --------------------- | ----------------------------------------------------------------- |
| Fecha                 | 10 de junio de 2020                                               |
| Build                 | `RPB1.200504.018`                                                 |
| Dispositivos          | Pixel 2, 3, 3a y 4, con sus modelos XL; Android Emulator          |
| Cómo se obtenía       | Por OTA con Android Beta, abierto por primera vez, o por flasheo  |
| Estabilidad de la API | No; API del SDK y del NDK finales, comportamientos del sistema no |

Desde esta build, las API del SDK y del NDK eran finales, y Google Play aceptaba
apps con target Android 11. Google presentó la versión en torno a tres temas:
People, Controls y Privacy. Las notificaciones de conversación y las burbujas
encabezaban el primero; los controles de dispositivos con una pulsación larga
del botón de encendido y los controles multimedia, el segundo. Los controles
multimedia estaban detrás de Developer options, y Google dijo que vendrían
activados por defecto en una beta posterior.

El restablecimiento automático de permisos se sumó a los permisos de una sola
vez: Android restablecería los permisos de ejecución de una app sin uso por
mucho tiempo. Las apps de autocompletado y los teclados podían mostrar
sugerencias en la franja de sugerencias del teclado.

El 17 de junio llegó la Beta 1.5 (`RPB1.200504.020`). Corrigió reinicios durante
la navegación por gestos, los pagos sin contacto con Google Pay y la
desvinculación de dispositivos Bluetooth.
