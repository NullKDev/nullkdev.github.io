---
parentDomain: notes
parentId: notes-android-12-es
documentId: beta-2
locale: es
translationKey: android-12-beta-2
slug: beta-2
title: 'Android 12 Beta 2: el panel de privacidad'
summary: 9 de junio de 2021. La segunda beta sumó el panel de privacidad, los indicadores e interruptores de cámara y micrófono, el aviso de lectura del portapapeles y el panel de Internet.
order: 5
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

La Beta 2 salió el 9 de junio de 2021 y trajo las funciones de privacidad que
Google había anunciado en I/O. Los Pixel inscritos para la Beta 1 la
recibieron solos.

|                       |                                                                              |
| --------------------- | ---------------------------------------------------------------------------- |
| Fecha                 | 9 de junio de 2021; Beta 2.1 el 23 de junio de 2021                          |
| Build                 | `SPB2.210513.007`; 2.1 `SPB2.210513.011`                                     |
| Parche de seguridad   | Junio de 2021                                                                |
| Dispositivos          | Del Pixel 3 al Pixel 5; teléfonos de socios como Sharp; Android TV; emulador |
| Cómo se obtenía       | Por OTA con Android Beta, o flasheando                                       |
| Estabilidad de la API | No                                                                           |

- **Panel de privacidad.** Una línea de tiempo de los accesos de las apps al
  micrófono, la cámara y la ubicación. Las apps explican un acceso manejando
  `ACTION_VIEW_PERMISSION_USAGE_FOR_PERIOD`.
- **Indicadores.** Un ícono en la barra de estado cada vez que una app usa la
  cámara o el micrófono.
- **Interruptores.** En Quick Settings cortan el acceso a cámara y micrófono
  para todas las apps, sin importar su target; una app bloqueada recibe
  imagen y audio vacíos. `SensorPrivacyManager` indica si el dispositivo los
  admite.
- **Aviso del portapapeles.** Un toast cada vez que una app llama a
  `getPrimaryClip()` sobre un contenido copiado desde otra app.
- **Panel de Internet.** Un solo panel en la barra de estado, Quick Settings
  y Ajustes para cambiar de proveedor y diagnosticar la conexión.

La Beta 2.1 corrigió una pantalla de bloqueo que ignoraba los deslizamientos
y un widget At a Glance que dejaba de mostrar el clima y los eventos del
calendario.
