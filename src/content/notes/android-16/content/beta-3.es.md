---
parentDomain: notes
parentId: notes-android-16-es
documentId: beta-3
locale: es
translationKey: android-16-beta-3
slug: beta-3
title: 'Android 16 Beta 3: estabilidad de plataforma'
summary: 13 de marzo de 2025. La estabilidad de plataforma cerró las APIs y los comportamientos, y la beta sumó audio Auracast, outline text y pruebas de protección de la red local.
order: 5
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, accessibility]
references: []
evidence: []
protection: { mode: public }
---

La Beta 3 salió el 13 de marzo de 2025 y alcanzó la estabilidad de
plataforma: "the API surface is locked, the app-facing behaviors are final".
Desde ese día, las apps con target Android 16 podían publicarse en Google
Play.

|                           |                                                                               |
| ------------------------- | ----------------------------------------------------------------------------- |
| Fecha                     | 13 de marzo de 2025; Beta 3.1 el 18 de marzo; Beta 3.2 el 2 de abril de 2025  |
| Build                     | `BP22.250221.010`; Beta 3.1 `BP22.250221.013`; Beta 3.2 `BP22.250221.015`     |
| Parche de seguridad       | Marzo de 2025                                                                 |
| Dispositivos              | Pixel 6 y posteriores, Pixel Fold y Pixel Tablet; Android Emulator de 64 bits |
| Estabilidad de plataforma | Sí                                                                            |

Google dijo que a esta altura del ciclo había "only a few new things":

- **Auracast.** Los Pixel 9 con la beta podían recibir audio transmitido en
  audífonos LE Audio compatibles, desde lugares como aeropuertos y aulas.
- **Outline text.** Reemplazó al texto de alto contraste: dibuja un área de
  contraste más amplia alrededor del texto. Nuevas APIs de
  `AccessibilityManager` permiten que los toolkits de UI y quien dibuja su
  propio texto sepan si está activo.
- **Protección de la red local, opcional.** Google planeaba exigir un permiso
  para acceder a la red local en una futura versión mayor. La Beta 3 permitía
  probarlo con `adb shell am compat enable RESTRICT_LOCAL_NETWORK <package>`;
  una app restringida ve errores de socket como `EPERM` o `ECONNABORTED`.

Siguieron dos actualizaciones de correcciones. La Beta 3.1, el 18 de marzo,
corrigió un cierre de Settings cuando el idioma del sistema no era inglés y un
brillo de pantalla que oscilaba. La Beta 3.2, el 2 de abril, corrigió hápticos
mal calibrados y el consumo de batería con el dispositivo en reposo.
