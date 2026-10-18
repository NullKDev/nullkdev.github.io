---
parentDomain: notes
parentId: notes-android-10-es
documentId: beta-2
locale: es
translationKey: android-10-beta-2
slug: beta-2
title: 'Android Q Beta 2: burbujas y emulador plegable'
summary: 3 de abril de 2019. La Beta 2 activó el almacenamiento acotado en instalaciones nuevas y sumó la API de burbujas, un emulador plegable y una API de dirección del micrófono.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 2 salió el 3 de abril de 2019 para todos los Pixel y el emulador, con
el parche de seguridad de abril de 2019. Burke escribió que los desarrolladores
habían enviado "thousands of bug reports" desde la Beta 1, y advirtió: "expect
rough edges".

|                       |                                                                     |
| --------------------- | ------------------------------------------------------------------- |
| Fecha                 | 3 de abril de 2019; una build de parche llegó más tarde en abril    |
| Build                 | `QPP2.190228.021`; parche `QPP2.190228.023`                         |
| Dispositivos          | Todos los Pixel desde la primera generación; Android Emulator       |
| Cómo se obtenía       | Por OTA a través de Android Beta, o flasheando la imagen de sistema |
| Estabilidad de la API | No; las API seguían cambiando                                       |

El almacenamiento acotado pasó a estar activo por defecto en las apps recién
instaladas, y en las instalaciones y restauraciones después de un
restablecimiento completo, para que los testers vieran qué se rompía. Google
advirtió de problemas en las apps que acceden a fotos, videos y otros
archivos, por ejemplo al navegar o compartir en redes sociales.

La Beta 2 sumó las burbujas: una notificación lleva un `BubbleMetadata`
definido con `setBubbleMetadata()`, que indica la actividad que se muestra
dentro de la burbuja. La hoja de compartir podía mostrar una vista previa del
contenido a partir de `EXTRA_TITLE` o del `ClipData` del intent. Una nueva API
`MicrophoneDirection` permitía que un video selfie pidiera el micrófono frontal
con `setMicrophoneDirection(MIC_DIRECTION_FRONT)` y controlar un micrófono con
zoom con `setMicrophoneFieldDimension()`. La versión canary de Android Studio
3.5 agregó dispositivos virtuales plegables de 7,3 y 8 pulgadas con la imagen
de sistema de la Beta 2.

Dos valores por defecto de la Beta 1 volvieron atrás.
`android:extractNativeLibs` regresó a `true`. Con la build de parche, la
restricción de memoria de solo ejecución se aplicó solo a las apps con target
mayor a la API 28, en lugar de 26 o más. Google también hizo "a few minor
updates" a las listas de interfaces fuera del SDK.
