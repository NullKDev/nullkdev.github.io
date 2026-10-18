---
parentDomain: notes
parentId: notes-android-12-es
documentId: developer-preview-2
locale: es
translationKey: android-12-developer-preview-2
slug: developer-preview-2
title: 'Android 12 Developer Preview 2: efectos'
summary: 17 de marzo de 2021. La segunda preview sumó desenfoques con RenderEffect, API de esquinas redondeadas, ocultar overlays, checksums de apps y CompanionDeviceService.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 2 salió el 17 de marzo de 2021, cuatro semanas después
de la primera. Seguía siendo solo para desarrolladores, por flasheo manual o
por OTA para quien ya tenía la Preview 1.

|                       |                                                                             |
| --------------------- | --------------------------------------------------------------------------- |
| Fecha                 | 17 de marzo de 2021; 2.1 el 29 de marzo; 2.2 el 7 de abril de 2021          |
| Build                 | `SPP2.210219.008`; 2.1 `SPP2.210219.008.A1`; 2.2 `SPP2.210219.018`          |
| Parche de seguridad   | Marzo de 2021; 2.2 abril de 2021                                            |
| Dispositivos          | Pixel 3, 3a, 4, 4a, 4a 5G y 5; Android Emulator; Android TV en el kit ADT-3 |
| Cómo se obtenía       | Flasheo o instalación manual; por OTA desde la Preview 1 o 1.1              |
| Estabilidad de la API | No                                                                          |

La Preview 2 se centró en gráficos, ventanas y dispositivos acompañantes:

- `RenderEffect` desenfoca o aplica un filtro de color a cualquier vista con
  una llamada (`View.setRenderEffect()`), y `Window.setBackgroundBlurRadius()`
  desenfoca el fondo de la ventana.
- `Display.getRoundedCorner()` y `WindowInsets.getRoundedCorner()` devuelven
  un `RoundedCorner` con su radio y su centro.
- `Window.setHideOverlayWindows()` oculta toda ventana
  `TYPE_APPLICATION_OVERLAY` sobre la app, para pantallas como la
  confirmación de un pago.
- `PackageManager.requestChecksums()` devuelve el digest de una app
  instalada.
- `CompanionDeviceService` mantiene enlazada la app de un reloj o una pulsera
  mientras el dispositivo está cerca.
- Las acciones de una notificación pueden pedir autenticación cuando se tocan
  desde la pantalla de bloqueo.
- Picture-in-picture automático al deslizar hacia el inicio, la ventana
  guardada en el borde de la pantalla y el redimensionado para contenido que
  no es video.

Google pidió publicar una actualización compatible antes de la Beta 1, sin
cambiar `targetSdkVersion`. La Developer Preview 2.1 actualizó `WebView`
para corregir cierres de apps. La 2.2 corrigió un cierre de Ajustes en la
configuración de Bluetooth, widgets que desaparecían tras una OTA y
contraseñas de Wi-Fi que no se guardaban.
