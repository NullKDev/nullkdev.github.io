---
parentDomain: notes
parentId: notes-android-14-es
documentId: developer-preview-1
locale: es
translationKey: android-14-developer-preview-1
slug: developer-preview-1
title: 'Android 14 Developer Preview 1: primeras reglas'
summary: '8 de febrero de 2023. Primera build de Android 14, solo para desarrolladores. Exigió tipos en los foreground services, bloqueó targets menores a 23 y negó las alarmas exactas.'
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis, security]
references: []
evidence: []
protection: { mode: public }
---

Google publicó la primera developer preview de Android 14 el 8 de febrero
de 2023, ocho meses antes del despliegue en Pixel. El post de Dave Burke la
llamó "just the beginning", y el programa Android Beta no estaba abierto para
ella.

|                       |                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------ |
| Fecha                 | 8 de febrero de 2023                                                                       |
| Build                 | `UPP1.230113.009`                                                                          |
| Parche de seguridad   | Febrero de 2023                                                                            |
| Dispositivos          | Pixel 4a (5G), 5, 5a 5G, 6, 6 Pro, 6a, 7 y 7 Pro; imágenes de 64 bits del Android Emulator |
| Cómo se obtenía       | Flasheando una imagen del sistema a mano; las previews y betas siguientes llegaban por OTA |
| Estabilidad de la API | No; Google la esperaba para junio de 2023                                                  |

Casi todo lo que define el target API 34 ya estaba aquí. Los foreground
services debían declarar un tipo, y un nuevo trabajo de transferencia iniciado
por el usuario se encargó de las descargas y subidas grandes. Los broadcasts
registrados por contexto quedaban en cola mientras la app estaba en caché. Las
apps recién instaladas con target 33 o superior perdieron el
`SCHEDULE_EXACT_ALARM` concedido de antemano; las apps de reloj y calendario
podían declarar `USE_EXACT_ALARM` en su lugar.

Las apps con `targetSdkVersion` menor a 23 ya no se podían instalar, y
`adb install --bypass-low-target-sdk-block` existió desde el primer día para
pruebas. Los receivers registrados en tiempo de ejecución debían indicar si
eran exportados, los intents implícitos dejaron de llegar a componentes
internos y el código cargado dinámicamente tuvo que ser de solo lectura.

La build también trajo fuentes de hasta 200% con una curva no lineal,
`LocaleManager.setOverrideLocaleConfig()`, la Grammatical Inflection API y
unas 300 clases de OpenJDK 17. La mayoría de los cambios de comportamiento se
podían activar uno por uno desde las opciones de desarrollador o con `adb`.
