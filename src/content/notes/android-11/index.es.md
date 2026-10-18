---
entryId: notes-android-11-es
locale: es
translationKey: android-11
slug: android-11
title: 'Android 11: permisos de una vez, scoped storage'
summary: API 30, septiembre de 2020. Cámara, micrófono y ubicación sumaron "Only this time", las apps sin uso perdieron sus permisos y con target 30 ya no se podía evitar el scoped storage.
visibility: public
maturity: stable
publishedAt: 2026-10-17
topics: [android, platform-apis, security]
image: /banners/android-11.svg
imageAlt: 'Banner de Android 11 Red Velvet Cake, con el logo de la versión.'
links:
  - label: Funciones y APIs de Android 11
    href: https://developer.android.com/about/versions/11/features
    kind: publication
  - label: Privacidad en Android 11
    href: https://developer.android.com/about/versions/11/privacy
    kind: publication
references: []
evidence: []
documents: []
protection: { mode: public }
kind: article
lifecycle: current
series:
  id: android-versions
  order: 12
citations:
  - title: 'Android 11 emblem — Wikimedia Commons (PD-logo, trademark of Google LLC)'
    url: https://commons.wikimedia.org/wiki/File:Android_11_Developer_Preview_logo.svg
    accessedAt: 2026-10-17
  - title: Android 11 features and APIs
    url: https://developer.android.com/about/versions/11/features
    accessedAt: 2026-10-17
  - title: 'Behavior changes: all apps (Android 11)'
    url: https://developer.android.com/about/versions/11/behavior-changes-all
    accessedAt: 2026-10-17
  - title: 'Behavior changes: apps targeting Android 11'
    url: https://developer.android.com/about/versions/11/behavior-changes-11
    accessedAt: 2026-10-17
  - title: Privacy in Android 11
    url: https://developer.android.com/about/versions/11/privacy
    accessedAt: 2026-10-17
  - title: Permissions updates in Android 11
    url: https://developer.android.com/about/versions/11/privacy/permissions
    accessedAt: 2026-10-17
  - title: Location updates in Android 11
    url: https://developer.android.com/about/versions/11/privacy/location
    accessedAt: 2026-10-17
  - title: Storage updates in Android 11
    url: https://developer.android.com/about/versions/11/privacy/storage
    accessedAt: 2026-10-17
  - title: Foreground services in Android 11
    url: https://developer.android.com/about/versions/11/privacy/foreground-services
    accessedAt: 2026-10-17
  - title: Data access auditing in Android 11
    url: https://developer.android.com/about/versions/11/privacy/data-access-auditing
    accessedAt: 2026-10-17
  - title: Package visibility filtering on Android
    url: https://developer.android.com/training/package-visibility
    accessedAt: 2026-10-17
  - title: Declare package visibility needs
    url: https://developer.android.com/training/package-visibility/declaring
    accessedAt: 2026-10-17
  - title: Manage all files on a storage device
    url: https://developer.android.com/training/data-storage/manage-all-files
    accessedAt: 2026-10-17
  - title: Request runtime permissions
    url: https://developer.android.com/training/permissions/requesting
    accessedAt: 2026-10-17
  - title: App hibernation
    url: https://developer.android.com/topic/performance/app-hibernation
    accessedAt: 2026-10-17
  - title: Android Debug Bridge (adb)
    url: https://developer.android.com/tools/adb
    accessedAt: 2026-10-17
  - title: ApplicationExitInfo reference
    url: https://developer.android.com/reference/android/app/ApplicationExitInfo
    accessedAt: 2026-10-17
  - title: 'Behavior changes: Android 13'
    url: https://developer.android.com/about/versions/13/behavior-changes-13
    accessedAt: 2026-10-17
  - title: Foreground service types are required (Android 14)
    url: https://developer.android.com/about/versions/14/changes/fgs-types-required
    accessedAt: 2026-10-17
  - title: Android 11 release notes (AOSP)
    url: https://source.android.com/docs/setup/about/android-11-release
    accessedAt: 2026-10-17
  - title: Codenames, tags, and build numbers (AOSP)
    url: https://source.android.com/docs/setup/reference/build-numbers
    accessedAt: 2026-10-17
  - title: Build.java at android-11.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-11.0.0_r1/core/java/android/os/Build.java
    accessedAt: 2026-10-17
  - title: PlatLogoActivity.java at android-11.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-11.0.0_r1/core/java/com/android/internal/app/PlatLogoActivity.java
    accessedAt: 2026-10-17
  - title: NekoControlsService.kt at android-11.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-11.0.0_r1/packages/EasterEgg/src/com/android/egg/neko/NekoControlsService.kt
    accessedAt: 2026-10-17
  - title: EasterEgg strings.xml at android-11.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-11.0.0_r1/packages/EasterEgg/res/values/strings.xml
    accessedAt: 2026-10-17
  - title: 'Turning it up to 11: Android 11 for developers'
    url: https://android-developers.googleblog.com/2020/09/android11-final-release.html
    accessedAt: 2026-10-17
  - title: Turning it up to Android 11 (The Keyword)
    url: https://blog.google/products/android/android-11/
    accessedAt: 2026-10-17
  - title: Pixel 4a (5G) and Pixel 5 pack 5G speeds and so much more (The Keyword)
    url: https://blog.google/products-and-platforms/devices/pixel/new-5g-pixels-more-helpful-features/
    accessedAt: 2026-10-17
  - title: Pixel phone hardware tech specs (earlier models)
    url: https://support.google.com/pixelphone/answer/16043605
    accessedAt: 2026-10-17
  - title: New Android App Bundle and target API level requirements in 2021
    url: https://android-developers.googleblog.com/2020/11/new-android-app-bundle-and-target-api.html
    accessedAt: 2026-10-17
  - title: Use of the broad package (App) visibility (QUERY_ALL_PACKAGES) permission
    url: https://support.google.com/googleplay/android-developer/answer/10158779
    accessedAt: 2026-10-17
  - title: Use of All files access (MANAGE_EXTERNAL_STORAGE) permission
    url: https://support.google.com/googleplay/android-developer/answer/10467955
    accessedAt: 2026-10-17
  - title: Android 11—The Ars Technica Review
    url: https://arstechnica.com/gadgets/2020/09/android-11-the-ars-technica-review/
    accessedAt: 2026-10-17
  - title: Google launches Android 11, rolling out now to Pixel phones (9to5Google)
    url: https://9to5google.com/2020/09/08/google-android-11-pixel-launch/
    accessedAt: 2026-10-17
  - title: Android 11's internal dessert name is 'Red Velvet Cake' (9to5Google)
    url: https://9to5google.com/2020/07/23/android-red-velvet-cake/
    accessedAt: 2026-10-17
  - title: '"Red Velvet Cake" is Android 11''s internal dessert name (XDA Developers)'
    url: https://www.xda-developers.com/android-11-red-velvet-cake/
    accessedAt: 2026-10-17
  - title: 'File:Android 11 Easter Egg Light Theme.png (Wikimedia Commons)'
    url: https://commons.wikimedia.org/wiki/File:Android_11_Easter_Egg_Light_Theme.png
    accessedAt: 2026-10-17
  - title: Android Developers content license
    url: https://developer.android.com/license
    accessedAt: 2026-10-17
---

Android 11 es la versión en la que un permiso podía durar una sola sesión. Los
pedidos de cámara, micrófono y ubicación sumaron "Only this time", y las apps
que nadie abría en meses perdieron sus permisos. Para quien desarrolla, cerró la
salida del scoped storage y ocultó la lista de apps instaladas a las apps con
target API 30.

## De un vistazo

|                                    |                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------- |
| Versión                            | Android 11                                                                |
| Nivel de API                       | 30                                                                        |
| Nombre                             | Red Velvet Cake, solo interno. Nombre público: Android 11                 |
| `Build.VERSION_CODES`              | `R`                                                                       |
| Lanzamiento                        | Despliegue en Pixel desde el 8 de septiembre de 2020                      |
| Dispositivos de lanzamiento        | Pixel 5 y Pixel 4a (5G), anunciados el 30 de septiembre de 2020           |
| Plazo de target API en Google Play | Apps nuevas desde agosto de 2021, actualizaciones desde noviembre de 2021 |

Google lanzó Android 11 y publicó su código en AOSP el 8 de septiembre de 2020,
empezando por los Pixel 2, 3, 3a, 4 y 4a. El anuncio de Google también nombró
teléfonos de OnePlus, Xiaomi, OPPO y realme. Los primeros teléfonos vendidos con
Android 11 fueron el Pixel 5 y el Pixel 4a (5G), anunciados el 30 de septiembre.

Dave Burke, vicepresidente de ingeniería de Android, contó en el podcast All
About Android en julio de 2020 que su equipo llamaba a la versión "RVC", por Red
Velvet Cake. Dijo que el nombre no aparecería fuera de Google. La constante del
SDK es solo `R`, y los build IDs empiezan con R (`RP1A.200720.009` fue el primer
build para Pixel).

## Qué trajo

- **Conversaciones.** Las notificaciones de mensajería tienen su propia sección
  arriba del panel. El usuario puede marcar una conversación como prioritaria,
  por contacto y no por app.
- **Burbujas.** Las ventanas de chat flotantes, experimentales detrás de una
  opción de desarrollador en Android 10, quedan abiertas a todas las apps. Una
  app con target API 30 solo muestra burbujas en notificaciones ligadas a un
  shortcut.
- **Controles de dispositivos.** Una pulsación larga en el botón de encendido
  muestra los controles de los dispositivos del hogar. Las apps agregan los
  suyos con `ControlsProviderService`.
- **Controles multimedia.** Los reproductores pasan a Quick Settings, en un
  carrusel que se desliza y retoma sesiones recientes, con un selector de salida
  para parlantes y auriculares.
- **Grabación de pantalla.** Un grabador integrado en Quick Settings, con audio
  del micrófono, del dispositivo o de ambos.
- **Depuración inalámbrica.** `adb` se conecta por Wi-Fi sin cable USB, tras
  emparejar con un código (`adb pair ipaddr:port`) o con un código QR desde
  Android Studio.
- **APIs de 5G.** Las apps saben si el usuario está en 5G
  (`TelephonyDisplayInfo`), si la conexión está temporalmente sin medición
  (`NET_CAPABILITY_TEMPORARILY_NOT_METERED`) y su ancho de banda estimado. El
  emulador sumó un ajuste de red 5G en la versión 30.0.22.
- **Herramientas.** Auditoría de acceso a datos (ver abajo), motivos de cierre
  de la app (`ApplicationExitInfo`), interruptores de compatibilidad por cambio,
  `adb install --incremental` para APKs grandes y más anotaciones de nulabilidad
  para Kotlin.
- **Otros añadidos.** Animaciones del teclado sincronizadas
  (`WindowInsetsAnimation.Callback`), APIs para pantallas curvas en los bordes y
  para el ángulo de la bisagra, NNAPI 1.3, decodificación de baja latencia en
  `MediaCodec`, un decodificador de imágenes en el NDK y Android Auto
  inalámbrico en autos compatibles.

## Seguridad y privacidad

- **Auditoría de acceso a datos.** Una app registra
  `AppOpsManager.OnOpNotedCallback` y recibe un aviso cada vez que su código, o
  una biblioteca incluida en ella, toca datos privados. Las etiquetas de
  atribución indican qué parte de la app hizo la llamada.
- **Scudo.** Las asignaciones del heap nativo usan el asignador endurecido
  Scudo, salvo en dispositivos de poca memoria. Los fallos que detecta aparecen
  como `Scudo ERROR:`.
- **fdsan aborta.** El sanitizador de descriptores de archivo de Android 10 ahora
  detiene el proceso ante un doble cierre o un uso después de cerrar, en lugar de
  solo registrarlo.
- **Etiquetado de punteros del heap.** En las apps con target 30, los punteros
  del heap llevan una etiqueta en su byte más alto, como preparación para la
  Memory Tagging Extension de Arm.
- **Mainline.** Google duplicó con creces la cantidad de módulos del sistema que
  puede actualizar por Google Play system updates, con 12 nuevos.
- **Identificadores protegidos.** `getIccId()` devuelve una cadena vacía. Las
  estadísticas de uso de apps pasan al almacenamiento cifrado por credencial y no
  se pueden leer hasta que el usuario desbloquea el dispositivo.
- **Plataforma.** La Generic Kernel Image (GKI) saca el soporte de cada SoC del
  kernel común y lo lleva a módulos. Virtual A/B da actualizaciones sin
  interrupción con menos almacenamiento. GWP-ASan corre en las apps del sistema
  para detectar errores del heap.

## Permisos

Tres cambios alcanzan a todas las apps, sin importar su target:

- **Permisos de una sola vez.** Los diálogos de cámara, micrófono y ubicación
  ofrecen "While using the app", "Only this time" y "Deny". Un permiso de una
  vez dura mientras la actividad está visible y un rato después de que la app
  pasa a segundo plano, o hasta que se detiene un servicio en primer plano
  iniciado desde la actividad visible.
- **Dos rechazos significan no.** Si el usuario toca "Deny" dos veces para el
  mismo permiso, el diálogo deja de aparecer. `adb shell dumpsys package
<package>` lo muestra como `USER_FIXED`.
- **"Files & Media".** El grupo de permisos Storage cambia de nombre. Una app con
  scoped storage que pide `READ_EXTERNAL_STORAGE` muestra un diálogo sobre fotos
  y contenido multimedia.

![Un diálogo de permiso de ubicación con tres botones: While using the app, Only this time y Deny](./assets/one-time-permission-dialog.png 'El diálogo de ubicación en Android 11, con la nueva opción "Only this time". Android Developers · CC BY 2.5')

Para las apps con target API 30:

- **Restablecimiento automático.** Si el usuario no abre la app durante unos
  meses, Android restablece sus permisos en tiempo de ejecución y le avisa. El
  interruptor por app es "Remove permissions if app isn't used", en App info >
  Permissions.
- **Ubicación en segundo plano.** Un pedido de ubicación en primer y segundo
  plano a la vez se ignora. La app pide primero la ubicación en primer plano,
  luego `ACCESS_BACKGROUND_LOCATION`, y el usuario activa "Allow all the time"
  en Ajustes.
- **Números de teléfono.** `getLine1Number()` requiere `READ_PHONE_NUMBERS` en
  lugar de `READ_PHONE_STATE`.
- **Nuevos.** `MANAGE_EXTERNAL_STORAGE` ("All files access") y
  `QUERY_ALL_PACKAGES`, ambos explicados más abajo.

```mermaid title="Ubicación en segundo plano para una app con target API 30"
flowchart TD
  start([La función necesita ubicación]) --> fg[Pedir ACCESS_FINE_LOCATION]
  fg --> gatedDialog[Diálogo del sistema]
  gatedDialog -- While using the app --> bg[Pedir ACCESS_BACKGROUND_LOCATION]
  bg --> gatedSettings[Página de Ajustes]
  gatedSettings -- Allow all the time --> done[Ubicación en segundo plano]
  gatedSettings -- sin cambios --> fgOnly[Solo ubicación en primer plano]
```

Los dos pasos con borde punteado son del sistema. El diálogo de ubicación en
segundo plano no tiene un botón para otorgarla; el usuario debe elegir "Allow
all the time" en la página de ajustes.

El permiso de superposición también cambió. `ACTION_MANAGE_OVERLAY_PERMISSION`
siempre abre la lista general de ajustes e ignora el paquete del intent. Las
apps de filtrado de llamadas y las que capturan la pantalla reciben
`SYSTEM_ALERT_WINDOW` al pedirlo.

## Qué cambió para tu app

### Todas las apps en Android 11

| Cambio                                                                                            | Qué hacer                                                                             |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Permisos de una sola vez y la regla de los dos rechazos                                           | Verifica el permiso antes de cada acceso; espera un rechazo sin diálogo               |
| Los servicios en primer plano iniciados desde segundo plano pierden cámara, micrófono y ubicación | Inícialos mientras la app está visible                                                |
| Scudo es el asignador nativo y fdsan aborta                                                       | Corrige los errores de memoria y de descriptores de archivo en el código nativo       |
| `getIccId()` devuelve una cadena vacía                                                            | Usa `getSubscriptionId()`                                                             |
| Las estadísticas de uso requieren un usuario desbloqueado                                         | Llama a `UsageStatsManager` después de que `isUserUnlocked()` devuelva true           |
| Compartir una URI de contenido                                                                    | Agrega `FLAG_GRANT_READ_URI_PERMISSION` o `FLAG_GRANT_WRITE_URI_PERMISSION` al intent |
| Se eliminó la biblioteca compartida de Maps v1                                                    | Pasa al Maps SDK for Android y quita su `<uses-library>`                              |
| Las apps no pueden leer las carpetas de otras apps en `Android/data`                              | Comparte archivos con un `FileProvider` o con el Storage Access Framework             |

### Apps con target API 30

| Cambio                                                                                    | Qué hacer                                                                                                     |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| El scoped storage es obligatorio; `requestLegacyExternalStorage` se ignora                | Usa `MediaStore` y el Storage Access Framework; migra los archivos antiguos antes de subir `targetSdkVersion` |
| `WRITE_EXTERNAL_STORAGE` no da acceso adicional                                           | Escribe en tus propios directorios o en las colecciones de `MediaStore`                                       |
| Las apps instaladas se filtran en `getInstalledApplications()` y llamadas similares       | Declara las apps o intents que necesitas en `<queries>`                                                       |
| Cámara o micrófono en un servicio en primer plano                                         | Agrega `camera` o `microphone` a `android:foregroundServiceType`                                              |
| Se bloquean los toasts personalizados desde segundo plano                                 | Usa un toast de texto o una notificación; `Toast.addCallback()` avisa cuándo se muestra y se oculta           |
| Se ignora un pedido conjunto de ubicación en primer y segundo plano                       | Pídelas en dos pasos                                                                                          |
| No se instalan APKs firmados solo con v1                                                  | Firma con APK Signature Scheme v2 o superior, y mantén v1 para dispositivos antiguos                          |
| Un `resources.arsc` comprimido o sin alinear impide la instalación                        | Guárdalo sin comprimir y alineado a 4 bytes                                                                   |
| Los intents implícitos `IMAGE_CAPTURE` y `VIDEO_CAPTURE` solo van a la cámara del sistema | Indica el paquete para usar una cámara de terceros                                                            |
| Firebase JobDispatcher y `GcmNetworkManager` dejan de funcionar en Android 6.0+           | Pasa a WorkManager                                                                                            |

El scoped storage llegó en [Android 10](/es/notes/android-10/), donde una app
todavía podía evitarlo. Desde API 30 ya no hay salida, pero Android 11 devolvió
las rutas directas a archivos (`File`, `fopen()`) para el contenido multimedia
al que la app ya tiene acceso, y sumó ediciones en lote de archivos multimedia.

Las apps cuya función principal necesita todos los archivos, como gestores de
archivos, antivirus y apps de copias de seguridad, pueden declarar
`MANAGE_EXTERNAL_STORAGE`. El usuario activa "Allow access to manage all files"
en una página de ajustes que la app abre con
`ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION`, e `isExternalStorageManager()`
informa el resultado. Aun así, las carpetas de otras apps en `Android/data`
siguen cerradas.

La visibilidad de paquetes funciona igual. Una app que usa un motor de texto a
voz o un servicio de reconocimiento de voz, por ejemplo, debe declarar ese
intent en `<queries>`. Para la app poco común que necesita la lista completa
existe `QUERY_ALL_PACKAGES`. Google Play revisa ambos permisos: All files access
desde mayo de 2021, y `QUERY_ALL_PACKAGES` mediante su formulario de declaración
de permisos.

## Qué perduró

- **El restablecimiento automático se convirtió en hibernación.** Desde Android
  12, una app sin uso también pierde sus jobs, sus mensajes push y su caché.
  Desde diciembre de 2021, Google Play services llevó el restablecimiento de
  permisos a Android 6.0 a 10.
- **La visibilidad de paquetes** y `<queries>` siguen siendo la regla, y Play
  sigue limitando `QUERY_ALL_PACKAGES` a las apps cuya función principal lo
  necesita.
- **El almacenamiento** se siguió acotando. Android 13 reemplazó
  `READ_EXTERNAL_STORAGE` por `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO` y
  `READ_MEDIA_AUDIO`.
- **Los tipos de servicio en primer plano**, exigidos aquí para cámara y
  micrófono, pasaron a ser obligatorios para todo servicio en primer plano en las
  apps con target Android 14.
- **La depuración inalámbrica** se quedó. Android 17 con adb 37.0.0 sumó "adb
  Wi-Fi 2.0", que se reconecta solo en una red de confianza.
- **Los permisos de una sola vez** y la regla de los dos rechazos no cambiaron.

## Para saber

- El Easter egg es una perilla de volumen de 11 pasos que se detiene en 10.
  Si se gira hasta arriba tres veces, se desbloquea: entonces llega a 11 y empieza
  la etapa siguiente. El código lo dice: "until the dial is "unlocked", you
  can't turn it all the way to 11".
- La etapa siguiente es **Cat Controls**, el coleccionista de gatos de Android
  7.0 trasladado a los nuevos controles de dispositivos: un bebedero que se llena
  de 0 a 200 mL, un plato de comida y un juguete para lanzar.
- La publicación de Google para desarrolladores se tituló "Turning it up to 11",
  y la dirigida al público enumeró 11 novedades.
- La constante `R` en AOSP tiene un comentario de una palabra, `R.`, justo
  debajo de una cita de tres líneas en la `Q` de Android 10.

![El Easter egg de Android 11: una perilla verde con un botón blanco, rodeada de once puntos, con un número 11 naranja al lado, sobre fondo celeste](./assets/android-11-easter-egg.png 'El Easter egg de Android 11, subido a 11. Wikimedia Commons · CC BY-SA 4.0')
