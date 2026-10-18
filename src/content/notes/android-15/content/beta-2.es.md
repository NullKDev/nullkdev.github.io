---
parentDomain: notes
parentId: notes-android-15-es
documentId: beta-2
locale: es
translationKey: android-15-beta-2
slug: beta-2
title: 'Android 15 Beta 2: espacio privado y socios'
summary: 15 de mayo de 2024. La segunda beta llegó a teléfonos de socios y sumó el espacio privado, seis horas para dataSync y mediaProcessing, páginas de 16 KB y un target mínimo de 24.
order: 4
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 2 salió el 15 de mayo de 2024, durante Google I/O. Fue la primera
build de Android 15 en teléfonos de otros fabricantes, y sumó la mayoría de
las funciones que el usuario vería en la versión final.

|                           |                                                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Fecha                     | 15 de mayo de 2024; 2.1 el 20 de mayo; 2.2 el 3 de junio de 2024                                                                               |
| Build                     | `AP31.240426.022`; 2.1 `AP31.240426.023`; 2.2 `AP31.240426.023.B4`                                                                             |
| Parche de seguridad       | Mayo de 2024                                                                                                                                   |
| Dispositivos              | Pixel 6 a Pixel 8a, Pixel Fold, Pixel Tablet; dispositivos de Honor, iQOO, Lenovo, Nothing, OnePlus, OPPO, Realme, Sharp, Tecno, vivo y Xiaomi |
| Cómo obtenerla            | Por OTA con Android Beta, o flasheando; programas de cada fabricante                                                                           |
| Estabilidad de plataforma | No                                                                                                                                             |

- **Espacio privado.** Un perfil de usuario separado, con autenticación
  propia. Cuando el usuario lo bloquea, el perfil se pausa y sus apps dejan
  de ejecutarse.
- **Foreground services.** Los servicios `dataSync` y `mediaProcessing`
  vencen tras unas seis horas, y el sistema llama a
  `Service.onTimeout(int, int)`. Una app con target Android 15 que usa
  `SYSTEM_ALERT_WINDOW` para iniciar uno desde segundo plano debe mostrar
  antes una ventana superpuesta visible.
- **Páginas de 16 KB.** Android 15 admite dispositivos con páginas de memoria
  de 16 KB, y las apps con código nativo deben recompilarse. Las primeras
  pruebas de Google mostraron arranques un 3,16 % más rápidos con poca memoria
  y un inicio del sistema un 1,5 % (unos 0,8 s) más rápido; las cifras
  posteriores de su guía de 16 KB son mayores.
- **Mínimo para instalar.** Ya no se pueden instalar apps con target menor a
  la API 24; la instalación falla con `INSTALL_FAILED_DEPRECATED_SDK_VERSION`.
- **Seguridad de apps.** `Context.checkContentUriPermissionFull()` y el
  atributo `requireContentUriPermissionFromCaller` verifican el acceso a URIs
  de contenido. Un flag opcional bloquea el secuestro de tareas desde apps
  que están debajo en la misma tarea. La coincidencia estricta de intents se
  puede probar con `StrictMode`.
- **Fotos.** `QUERY_ARG_LATEST_SELECTION_ONLY` devuelve solo las fotos que el
  usuario eligió la última vez con acceso parcial.
- **Gráficos.** ANGLE es una capa opcional que ejecuta OpenGL ES sobre Vulkan.
  `Matrix44` y `Canvas.clipShader()` se suman a la API de Canvas, y el
  decodificador AV1 por software dav1d está disponible por nombre.
- **Pantallas e interfaz.** Barra de tareas fijable y pares de apps guardados
  en pantallas grandes. `Configuration.screenWidthDp` incluye las barras del
  sistema para apps con target Android 15. Vistas previas generadas de
  widgets, entrada más fluida a picture-in-picture, animaciones de predictive
  back fuera de las opciones de desarrollador y vibración por canal con
  `NotificationChannel.setVibrationEffect()`.
- **Idioma.** Un ajuste de género gramatical, primero en francés, ICU 74 con
  Unicode 15.1, la fuente NotoSansCJK variable y una fuente Hentaigana.

La Beta 2.1 corrigió solo en parte la desaparición de íconos de la pantalla de
inicio al crear por primera vez un espacio privado. La Beta 2.2 terminó esa
corrección y reparó los pagos NFC con el rol de Wallet y el modo de
observación.
