---
parentDomain: notes
parentId: notes-android-10-es
documentId: beta-1
locale: es
translationKey: android-10-beta-1
slug: beta-1
title: 'Android Q Beta 1: primero la privacidad'
summary: 13 de marzo de 2019. La primera build de Android Q, para todos los Pixel, trajo los cambios de ubicación, almacenamiento, inicios en segundo plano e identificadores.
order: 1
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

Google publicó Android Q Beta 1 el 13 de marzo de 2019, casi seis meses antes
de la versión final. El post de Dave Burke la presentó como "Beta 1 of Android
Q for early adopters and a preview SDK for developers". No hubo una developer
preview aparte: la primera build pública ya estaba en el programa Android
Beta.

|                       |                                                                                 |
| --------------------- | ------------------------------------------------------------------------------- |
| Fecha                 | 13 de marzo de 2019                                                             |
| Build                 | `QPP1.190205.018.B4`, parche de seguridad de marzo de 2019                      |
| Dispositivos          | Pixel, Pixel XL, Pixel 2, Pixel 2 XL, Pixel 3 y Pixel 3 XL; Android Emulator    |
| Cómo se obtenía       | Por OTA a través de Android Beta, o flasheando la imagen de sistema descargable |
| Estabilidad de la API | No; SDK de preview con las API todavía en cambio                                |

El Pixel original estaba incluido, algo que Google dijo haber extendido "by
popular demand". Para compilar contra la preview, las notas de versión
indicaban `compileSdkVersion "android-Q"` y `targetSdkVersion "Q"` con Android
Studio 3.3 o posterior.

Google puso los cambios de privacidad en la primera build para dar a los
desarrolladores el mayor tiempo posible. La ubicación sumó la elección entre
"all the time" y "only while the app is in use". El almacenamiento acotado
puso los archivos compartidos detrás de permisos nuevos para las colecciones
de fotos y videos y de audio, y la carpeta Downloads detrás del selector de
archivos del sistema. Las apps en segundo plano ya no podían iniciar una
actividad; la alternativa era una notificación de alta prioridad con un
full-screen intent. Se restringió el acceso al IMEI, al número de serie y a
otros identificadores no reiniciables, y la MAC aleatoria por red Wi-Fi pasó a
ser el comportamiento por defecto.

Las API para desarrolladores de la Beta 1 incluían los sharing shortcuts, las
acciones de `Settings.Panel`, los network specifiers y las sugerencias de
Wi-Fi que no requieren permiso de ubicación, los Wi-Fi locks de baja latencia,
el formato de foto Dynamic Depth, AV1, Opus y HDR10+, una API nativa de MIDI,
ANGLE sobre Vulkan en modo experimental, la Neural Networks API 1.2 con 60
operaciones nuevas, la biometría pasiva en `BiometricPrompt` y TLS 1.3 activo
por defecto. Las nuevas restricciones a interfaces fuera del SDK se aplicaban
solo a las apps con target Q, y las apps con target menor a la API 23 pasaron
a mostrar un diálogo de advertencia en la primera ejecución.

Dos detalles se revirtieron después. La Beta 1 cambió el valor por defecto de
`android:extractNativeLibs` a `false`; la Beta 2 lo devolvió a `true`. El tema
oscuro del sistema no estaba: 9to5Google no encontró ningún ajuste de modo
oscuro en la build, y Google lo agregó en la Beta 3.
