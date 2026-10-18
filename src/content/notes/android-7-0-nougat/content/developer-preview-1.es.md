---
parentDomain: notes
parentId: notes-android-7-0-nougat-es
documentId: developer-preview-1
locale: es
translationKey: android-7-0-nougat-developer-preview-1
slug: developer-preview-1
title: 'Android N Developer Preview 1: adelantada'
summary: 9 de marzo de 2016. La primera build de Android N salió meses antes de lo habitual, con multiventana, Direct Reply, notificaciones agrupadas y el nuevo Android Beta Program.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google publicó la primera Developer Preview de Android N el 9 de marzo de
2016, dos meses antes de Google I/O, donde se habían presentado las vistas
previas anteriores. Dave Burke explicó el motivo: una build más temprana deja
más tiempo para el feedback de los desarrolladores y permite entregar la
versión final a los fabricantes en verano.

|              |                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| Fecha        | 9 de marzo de 2016                                                                                         |
| Builds       | `NPC56P`, `NPC56R`; actualizadas luego a `NPC56W`, `NPC56X`                                                |
| Dispositivos | Nexus 6, 5X, 6P, 9, Nexus Player, Pixel C, General Mobile 4G (Android One) y el emulador del SDK           |
| Estado       | Solo para desarrolladores; sin aprobación CTS, así que las apps que la exigen (Android Pay) no funcionaban |

Ese mismo día Google abrió el Android Beta Program en `g.co/androidbeta`. Al
inscribir un dispositivo compatible, la vista previa llegaba por OTA y se
mantenía actualizada, sin flashear nada a mano.

## Lo que abrió la primera vista previa

- **Multiventana.** Las apps con target N declaran `android:resizableActivity`
  para correr en pantalla dividida. Un cambio de tamaño se comporta como una
  rotación: la actividad maneja el cambio de configuración o se recrea. Las
  apps de TV obtienen picture-in-picture con
  `android:supportsPictureInPicture`.
- **Notificaciones.** La API `RemoteInput` de Android Wear ahora funciona en
  teléfonos y tablets, y el usuario responde desde el panel.
  `Notification.Builder.setGroup()` agrupa las notificaciones de una app.
- **Doze** ahora también ahorra batería cada vez que la pantalla se apaga, no
  solo con el dispositivo quieto. `JobScheduler` puede reaccionar a cambios en
  un content provider.
- **Java 8.** El compilador Jack lleva las lambdas a Android hasta Gingerbread;
  los métodos default y static de interfaces y los streams requieren N.
- **Compilador JIT.** El post de Google en I/O nombró después el nuevo
  compilador JIT como un cambio de la primera vista previa: instalaciones más
  rápidas y menos almacenamiento que compilar todo por adelantado.

Las notas de versión de Google la declararon no apta para uso diario: lenta a
ratos, con peor batería y algunas apps, incluidas las de Google, sin funcionar.
