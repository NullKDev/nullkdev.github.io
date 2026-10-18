---
parentDomain: notes
parentId: notes-android-12l-es
documentId: developer-preview-1
locale: es
translationKey: android-12l-developer-preview-1
slug: developer-preview-1
title: '12L Developer Preview 1: solo en el emulador'
summary: 27 de octubre de 2021. Anunciada en Android Dev Summit, la primera build de 12L solo corría en el emulador, con barra de tareas, interfaz a dos columnas y API provisional Sv2.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google anunció 12L en Android Dev Summit el 27 de octubre de 2021 y publicó
la Developer Preview 1 ese mismo día. Era solo para desarrolladores y solo
corría en el Android Emulator: los teléfonos no la recibieron.

|                       |                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------- |
| Fecha                 | 27 de octubre de 2021                                                                     |
| Build                 | `SPP4.211001.003`                                                                         |
| Parche de seguridad   | Octubre de 2021                                                                           |
| Dispositivos          | Android Emulator (x86 de 64 bits y ARM v8-A); después, la Lenovo Tab P12 Pro              |
| Estabilidad de la API | No; nivel de API provisional `Sv2`, y Google esperaba cambios en la API antes de la final |

La build ya tenía lo que identifica a 12L: el panel de notificaciones y la
pantalla de bloqueo a dos columnas en pantallas de más de 600dp, la barra de
tareas con arrastrar y soltar a pantalla dividida, y un letterboxing que los
fabricantes pueden personalizar. El post de Dave Burke prometió que no habría
cambios incompatibles, así que Google no exigiría apuntar a 12L.

Para usar las API nuevas, una app tenía que poner `compileSdkVersion`,
`targetSdkVersion` y `minSdkVersion` en `"Sv2"`. Google Play bloqueaba la
publicación de apps que apuntaban a `Sv2`. El consejo de Google fue probar la
app actual en pantalla dividida con ventanas de varios tamaños y en el nuevo
modo de compatibilidad. Lenovo ofreció después la misma Developer Preview 1
para su Tab P12 Pro, la primera tablet real que podía correr 12L.
