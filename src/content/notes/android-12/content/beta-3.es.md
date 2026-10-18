---
parentDomain: notes
parentId: notes-android-12-es
documentId: beta-3
locale: es
translationKey: android-12-beta-3
slug: beta-3
title: 'Android 12 Beta 3: API finales, API 31'
summary: 14 de julio de 2021. La tercera beta dio las API finales de Android 12 y el SDK de API 31, con capturas desplazables, AppSearch, insets de indicadores y autorrotación por rostro.
order: 6
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 3 salió el 14 de julio de 2021 con las API finales de Android 12 y el
SDK oficial de API 31. El comportamiento hacia las apps todavía no estaba
congelado; Google dejó la estabilidad de plataforma completa para la Beta 4.

|                       |                                                                          |
| --------------------- | ------------------------------------------------------------------------ |
| Fecha                 | 14 de julio de 2021; Beta 3.1 el 26 de julio de 2021                     |
| Build                 | `SPB3.210618.013`; 3.1 `SPB3.210618.016`                                 |
| Parche de seguridad   | Julio de 2021                                                            |
| Dispositivos          | Del Pixel 3 al Pixel 5; teléfonos de socios como Sharp y TCL; Android TV |
| Cómo se obtenía       | Por OTA con Android Beta, o flasheando                                   |
| Estabilidad de la API | API finales; comportamientos aún abiertos                                |

- **Capturas con desplazamiento.** Un botón "Capture more" extiende la
  captura de un contenido desplazable. Las vistas estándar funcionan sin
  cambios; las interfaces propias usan la nueva API de scroll capture.
- **AppSearch.** Un motor de búsqueda de texto completo en el dispositivo,
  con un índice local vía Jetpack y un índice central del sistema.
- **Insets de los indicadores.** `WindowInsets` informa dónde pueden aparecer
  los indicadores de cámara y micrófono, para que las apps inmersivas no
  tapen sus controles.
- **Interruptores en empresas.** Los administradores de dispositivos
  totalmente gestionados pueden restringir los interruptores de cámara y
  micrófono.
- **Apps acompañantes.** Las apps vinculadas con Companion Device Manager
  pueden iniciar foreground services desde segundo plano si declaran un nuevo
  permiso normal.
- **Autorrotación.** En el Pixel 4 y posteriores, la detección de rostro con
  la cámara frontal decide cuándo girar, dentro de Private Compute Core.
- **Juegos.** Las API de Game Mode y el juego mientras se descarga.

La Beta 3.1 corrigió un bucle de arranque tras reiniciar, cierres de System
UI y que el daemon low memory killer (`lmkd`) matara demasiados procesos.
