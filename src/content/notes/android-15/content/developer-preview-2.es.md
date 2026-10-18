---
parentDomain: notes
parentId: notes-android-15-es
documentId: developer-preview-2
locale: es
translationKey: android-15-developer-preview-2
slug: developer-preview-2
title: 'Android 15 Developer Preview 2: satélite, PDF'
summary: 21 de marzo de 2024. La segunda preview sumó APIs de satélite y de observación NFC, un PdfRenderer actualizable, ApplicationStartInfo, el tipo mediaProcessing y la sonoridad.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Developer Preview 2 salió el 21 de marzo de 2024, cinco semanas después
de la primera. Seguía siendo solo para desarrolladores: esta vez Google no
ofreció imágenes para sideload, así que llegaba flasheando o por OTA desde la
Preview 1.

|                           |                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------- |
| Fecha                     | 21 de marzo de 2024                                                             |
| Build                     | `AP31.240223.016.A3`                                                            |
| Parche de seguridad       | Marzo de 2024                                                                   |
| Dispositivos              | Pixel 6, 6 Pro, 6a, 7, 7 Pro, 7a, 8 y 8 Pro, Pixel Fold, Pixel Tablet; emulador |
| Cómo obtenerla            | Flasheando, o por OTA desde la Preview 1                                        |
| Estabilidad de plataforma | No                                                                              |

- **Conectividad.** `ServiceState.isUsingNonTerrestrialNetwork()` indica una
  conexión satelital, y las apps de SMS, MMS y RCS preinstaladas pueden
  enviar mensajes por ella. En los dispositivos compatibles, el modo de
  observación de `NfcAdapter` entrega a la app objetos `PollingFrame` sin
  responder al lector.
- **PDF.** `PdfRenderer` pasa a un módulo que se actualiza por Google Play,
  con archivos protegidos por contraseña, anotaciones, formularios, búsqueda
  y selección. `PdfRendererPreV` lo lleva a Android 11.
- **Texto e intents.** `<nobreak>` y `<nohyphen>` mantienen palabras en una
  misma línea o sin guiones. `<uri-relative-filter-group>` filtra deep links
  por parámetros de consulta y fragmentos.
- **Información de la app.** `ApplicationStartInfo` explica por qué y cómo
  arrancó la app. `StorageStats.getAppBytesByDataType()` desglosa su tamaño
  por tipo. Las apps detenidas a la fuerza pierden sus pending intents y
  reciben `BOOT_COMPLETED` cuando el usuario las vuelve a abrir.
- **Trabajo en segundo plano.** El nuevo tipo de foreground service
  `mediaProcessing` cubre tareas como transcodificar; Google anunció que una
  beta posterior lo limitaría a seis horas.
- **Multimedia.** `setDesiredHdrHeadroom()` equilibra contenido HDR y SDR, y
  `LoudnessCodecController` aplica la sonoridad CTA-2075 al AAC.
  `Virtualizer` queda obsoleto en favor de `Spatializer`.
- **Además.** Soporte opcional para las pantallas externas de los plegables
  tipo concha, detección de grabación de pantalla, nuevas APIs de SQLite
  (transacciones diferidas de solo lectura, conteo de filas cambiadas), tipos,
  íconos y efectos de dispositivo en `AutomaticZenRule` y, para apps con
  target Android 15, `elegantTextHeight` activado por defecto.
