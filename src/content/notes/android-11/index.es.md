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
documents:
  - documentId: developer-preview-1
    slug: developer-preview-1
    order: 1
  - documentId: developer-preview-2
    slug: developer-preview-2
    order: 2
  - documentId: developer-preview-3
    slug: developer-preview-3
    order: 3
  - documentId: developer-preview-4
    slug: developer-preview-4
    order: 4
  - documentId: beta-1
    slug: beta-1
    order: 5
  - documentId: beta-2
    slug: beta-2
    order: 6
  - documentId: beta-3
    slug: beta-3
    order: 7
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
  - title: 'Android 11: Beta Plans (Android Developers Blog)'
    url: https://android-developers.googleblog.com/2020/05/android-11-beta-plans.html
    accessedAt: 2026-10-17
  - title: Android 11 Developer Preview (Android Developers Blog)
    url: https://android-developers.googleblog.com/2020/02/Android-11-developer-preview.html
    accessedAt: 2026-10-17
  - title: Unwrapping the Android 11 Beta, plus more (Android Developers Blog)
    url: https://android-developers.googleblog.com/2020/06/unwrapping-android-11-beta-plus-more.html
    accessedAt: 2026-10-17
  - title: Vivo V20 series is first with Android 11 out of the box (9to5Google)
    url: https://9to5google.com/2020/09/30/vivo-v20-series-beats-pixel-5-to-be-first-with-android-11-out-of-the-box/
    accessedAt: 2026-10-17
  - title: vivo releases full V20 specs as lineup begins global rollout (GSMArena)
    url: https://www.gsmarena.com/vivo_releases_full_v20_specs_as_lineup_begins_rollout-news-45556.php
    accessedAt: 2026-10-17
  - title: Resume-on-Reboot (AOSP)
    url: https://source.android.com/docs/core/ota/resume-on-reboot
    accessedAt: 2026-10-17
  - title: Android Developers content license
    url: https://developer.android.com/license
    accessedAt: 2026-10-17
  - title: 'Android 11: Developer Preview 2 (Android Developers Blog)'
    url: https://android-developers.googleblog.com/2020/03/android-11-developer-preview-2.html
    accessedAt: 2026-10-18
  - title: 'Android 11: Developer Preview 3 (Android Developers Blog)'
    url: https://android-developers.googleblog.com/2020/04/android-11-developer-preview-3.html
    accessedAt: 2026-10-18
  - title: Android 11 Beta 2 and Platform Stability (Android Developers Blog)
    url: https://android-developers.googleblog.com/2020/07/android-11-beta-2-and-platform-stability.html
    accessedAt: 2026-10-18
  - title: Android 11 final Beta update, official release coming soon! (Android Developers Blog)
    url: https://android-developers.googleblog.com/2020/08/android-11-final-beta-update.html
    accessedAt: 2026-10-18
  - title: Android 11 preview release notes (developer.android.com, archived 18 August 2020)
    url: https://web.archive.org/web/20200818230453/https://developer.android.com/preview/release-notes
    accessedAt: 2026-10-18
  - title: Google launches Android 11 Developer Preview for Pixel (9to5Google)
    url: https://9to5google.com/2020/02/19/android-11-developer-preview-launch/
    accessedAt: 2026-10-18
  - title: 'Android 11 timeline: Three developer previews, first beta in May, and Q3 launch (9to5Google)'
    url: https://9to5google.com/2020/02/19/android-11-launch-timeline/
    accessedAt: 2026-10-18
  - title: Google releases Android 11 DP2 with app resume on reboot and OTA from DP1 (9to5Google)
    url: https://9to5google.com/2020/03/18/android-11-dp2-launch/
    accessedAt: 2026-10-18
  - title: Google releases Android 11 DP3 ahead of first Android Beta (9to5Google)
    url: https://9to5google.com/2020/04/23/android-11-dp3-launch/
    accessedAt: 2026-10-18
  - title: Google releases Android 11 DP4, first beta now next month (9to5Google)
    url: https://9to5google.com/2020/05/06/android-11-dp4/
    accessedAt: 2026-10-18
  - title: Google delays next week's Android 11 Beta release and virtual launch event (9to5Google)
    url: https://9to5google.com/2020/05/29/android-11-beta-delay/
    accessedAt: 2026-10-18
  - title: Google launches Android 11 Beta 1 for Pixel phones (9to5Google)
    url: https://9to5google.com/2020/06/10/android-11-beta-launch/
    accessedAt: 2026-10-18
  - title: Google releases Android 11 Beta 2 for Pixel phones (9to5Google)
    url: https://9to5google.com/2020/07/08/android-11-beta-2/
    accessedAt: 2026-10-18
  - title: Google releases Android 11 Beta 3 ahead of public launch (9to5Google)
    url: https://9to5google.com/2020/08/06/android-11-beta-3/
    accessedAt: 2026-10-18
  - title: Android 11 Beta 3 is now available for the Pixel 4a (9to5Google)
    url: https://9to5google.com/2020/08/24/android-11-beta-pixel-4a/
    accessedAt: 2026-10-18
  - title: Compatibility framework changes (Android 11)
    url: https://developer.android.com/about/versions/11/reference/compat-framework-changes
    accessedAt: 2026-10-18
  - title: Compatibility framework tools (test and debug)
    url: https://developer.android.com/guide/app-compatibility/test-debug
    accessedAt: 2026-10-18
  - title: Set up the Android 11 SDK
    url: https://developer.android.com/about/versions/11/setup-sdk
    accessedAt: 2026-10-18
  - title: Preparing your Gradle build for package visibility in Android 11 (Android Developers Blog)
    url: https://android-developers.googleblog.com/2020/07/preparing-your-build-for-package-visibility-in-android-11.html
    accessedAt: 2026-10-18
  - title: Test package visibility behavior
    url: https://developer.android.com/training/package-visibility/testing
    accessedAt: 2026-10-18
  - title: Access media files from shared storage
    url: https://developer.android.com/training/data-storage/shared/media
    accessedAt: 2026-10-18
  - title: Merge multiple manifest files
    url: https://developer.android.com/build/manage-manifests
    accessedAt: 2026-10-18
  - title: 'Lint check QueryPermissionsNeeded: Using APIs affected by query permissions'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/QueryPermissionsNeeded.md.html
    accessedAt: 2026-10-18
  - title: 'Lint check QueryAllPackagesPermission: Using the QUERY_ALL_PACKAGES permission'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/QueryAllPackagesPermission.md.html
    accessedAt: 2026-10-18
  - title: 'Lint check ScopedStorage: Affected by scoped storage'
    url: https://googlesamples.github.io/android-custom-lint-rules/checks/ScopedStorage.md.html
    accessedAt: 2026-10-18
  - title: Android 11 starts rolling out today (Android Police)
    url: https://www.androidpolice.com/2020/09/08/android-11-starts-rolling-out-today-with-improvements-to-notifications-privacy-5g-and-more/
    accessedAt: 2026-10-18
  - title: 'Android 11 review: An incremental update that needs some polish (Engadget)'
    url: https://www.engadget.com/android-11-review-screen-recording-messaging-bubbles-170001960.html
    accessedAt: 2026-10-18
---

Android 11 es la versión en la que un permiso podía durar una sola sesión. Los
pedidos de cámara, micrófono y ubicación sumaron "Only this time", y las apps
que nadie abría en meses perdieron sus permisos. Para quien desarrolla, cerró la
salida del scoped storage y ocultó la lista de apps instaladas a las apps con
target API 30.

## De un vistazo

|                                    |                                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Versión                            | Android 11                                                                                                    |
| Nivel de API                       | 30                                                                                                            |
| Nombre                             | Red Velvet Cake, solo interno. Nombre público: Android 11                                                     |
| `Build.VERSION_CODES`              | `R`                                                                                                           |
| Lanzamiento                        | Despliegue en Pixel desde el 8 de septiembre de 2020                                                          |
| Dispositivos de lanzamiento        | vivo V20, a la venta el 30 de septiembre de 2020; Pixel 5 y Pixel 4a (5G) de Google, anunciados ese mismo día |
| Plazo de target API en Google Play | Apps nuevas desde agosto de 2021, actualizaciones desde noviembre de 2021                                     |
| Herramientas                       | `compileSdkVersion 30`, Android Gradle Plugin 4.1 o una versión anterior parcheada (abajo)                    |

La página del SDK de Android 11 recomienda Android Studio 4.2 o superior y dice
que desde 3.3 se puede compilar, con posibles fallos de sincronización de
Gradle. Las versiones anteriores del Android Gradle Plugin no saben fusionar el
nuevo elemento `<queries>`, así que Google publicó 3.3.3, 3.4.3, 3.5.4, 3.6.4 y
4.0.1 con soporte para él; 4.1 no necesita parche. La tabla de versiones mínimas
de AGP de Google empieza en API 33.

Google lanzó Android 11 y publicó su código en AOSP el 8 de septiembre de 2020,
empezando por los Pixel 2, 3, 3a, 4 y 4a: todos los Pixel salvo los originales
de 2016, como señaló Android Police. El anuncio de Google también nombró
teléfonos de OnePlus, Xiaomi, OPPO y realme. Los primeros teléfonos vendidos con
Android 11 fueron los vivo V20, que salieron a la venta en el sudeste asiático
el 30 de septiembre. Google anunció los suyos, el Pixel 5 y el Pixel 4a (5G), ese
mismo día.

El camino fue un mes más largo de lo previsto. La primera versión preliminar
para desarrolladores salió el 19 de febrero de 2020. En mayo, Google agregó una
cuarta versión preliminar y retrasó la Beta 1 y todas las etapas siguientes
cerca de un mes. Luego postergó el evento del 3 de junio para dar espacio a las
conversaciones sobre justicia racial en Estados Unidos, y publicó la Beta 1 el
10 de junio, sin evento. Cada preview y cada beta tiene su propia parte después
de esta vista general.

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
  del micrófono, del dispositivo o de ambos. Fue lo que más gustó en la reseña
  de Engadget, porque reemplazaba a un grabador de terceros.
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
- **Más APIs.** Una Thermal API en el NDK avisa cuando el dispositivo se
  calienta, para que un juego reduzca la carga antes de que la CPU baje su
  frecuencia. Un `CallScreeningService` puede leer el estado de verificación
  STIR/SHAKEN de una llamada entrante. `ImageDecoder.decodeDrawable()` devuelve
  un `AnimatedImageDrawable` para un archivo HEIF con varios cuadros, como una
  ráfaga de fotos.
- **Detalles que notaron los usuarios.** Un historial de notificaciones,
  desactivado por defecto, guarda las "Recently dismissed", que todavía abren su
  app, y las de "Last 24 hours". Las apps se pueden fijar arriba en el menú de
  compartir. El tema oscuro puede seguir un horario o la puesta del sol. Una red
  Wi-Fi se puede guardar con "Auto-connect" desactivado.

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
  Memory Tagging Extension de Arm. Qué revisar está en
  [la tabla de target](#apps-con-target-api-30).
- **Mainline.** Google duplicó con creces la cantidad de módulos del sistema que
  puede actualizar por Google Play system updates, con 12 nuevos.
- **Identificadores protegidos.** `getIccId()` devuelve una cadena vacía. Las
  estadísticas de uso de apps pasan al almacenamiento cifrado por credencial y no
  se pueden leer hasta que el usuario desbloquea el dispositivo.
- **Plataforma.** La Generic Kernel Image (GKI) saca el soporte de cada SoC del
  kernel común y lo lleva a módulos. Virtual A/B da actualizaciones sin
  interrupción con menos almacenamiento. GWP-ASan corre en las apps del sistema
  para detectar errores del heap.
- **Resume-on-Reboot.** Tras reiniciar para instalar una actualización OTA, el
  dispositivo puede desbloquear el almacenamiento cifrado por credencial de
  todas las apps, incluso las que no soportan Direct Boot, para que las
  notificaciones lleguen antes de que el usuario ingrese el PIN. Requiere la
  función `android.hardware.reboot_escrow`.

## Permisos

Android 11 agregó dos permisos que una app puede declarar,
`MANAGE_EXTERNAL_STORAGE` y `QUERY_ALL_PACKAGES`, y cambió cómo se conceden
otros o qué cubren:

| Permiso                                  | Qué cambió en API 30                                                                                                            | Qué declarar                                                                           | Qué quitar o limitar                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Cámara, micrófono y ubicación            | El diálogo suma "Only this time"; el permiso termina poco después de que la app deja el primer plano                            | Nada nuevo                                                                             | Nada                                                                           |
| Cualquier permiso en tiempo de ejecución | Dos toques en "Deny" equivalen a no volver a preguntar; las apps con target 30 pierden sus permisos si no se usan durante meses | Nada nuevo; verifica el permiso antes de cada acceso                                   | Nada                                                                           |
| `ACCESS_BACKGROUND_LOCATION`             | Las apps con target 30 lo piden solo, después de la ubicación en primer plano; el usuario lo concede en Ajustes                 | Pídelo solo cuando `ACCESS_FINE_LOCATION` o `ACCESS_COARSE_LOCATION` ya está concedido | Quítalo si ninguna función necesita ubicación en segundo plano                 |
| `READ_PHONE_NUMBERS`                     | Necesario en lugar de `READ_PHONE_STATE` para `getLine1Number()` y `getMsisdn()` en apps con target 30                          | Decláralo si lees el número de teléfono                                                | Nada                                                                           |
| `READ_PHONE_STATE`                       | Ya no cubre los métodos del número de teléfono en apps con target 30                                                            | Mantenlo para otros métodos de telefonía                                               | `android:maxSdkVersion="29"` si solo lo usabas para el número                  |
| `READ_EXTERNAL_STORAGE`                  | Su grupo pasa a llamarse "Files & Media"; con scoped storage el diálogo pide fotos y contenido multimedia                       | Mantenlo para leer contenido multimedia de otras apps                                  | Nada aquí; Android 13 lo limita                                                |
| `WRITE_EXTERNAL_STORAGE`                 | No da acceso adicional a las apps con target 30                                                                                 | Mantenlo solo para Android 10 y anteriores                                             | `android:maxSdkVersion="29"`                                                   |
| `MANAGE_EXTERNAL_STORAGE`                | Nuevo "All files access", que el usuario activa en Ajustes                                                                      | Solo si gestionar archivos es la función principal de la app; Google Play lo revisa    | Nunca como forma de evitar el scoped storage                                   |
| `QUERY_ALL_PACKAGES`                     | Nuevo; devuelve todas las apps instaladas a las apps con target 30                                                              | Mejor `<queries>`; decláralo solo si la función principal necesita todas las apps      | `tools:node="remove"` sobre la copia que fusiona un SDK; Google Play lo revisa |
| `SYSTEM_ALERT_WINDOW`                    | El intent de ajustes ignora tu paquete; las apps de filtrado de llamadas y las que capturan la pantalla lo reciben al pedirlo   | Sigue pidiéndolo; indica al usuario que busque tu app en la lista                      | Nada                                                                           |
| `WRITE_APN_SETTINGS`                     | Privilegiado; las apps con target 30 lo necesitan para leer la base de datos de APN                                             | Solo las apps del sistema pueden tenerlo                                               | Deja de leer la base de datos de APN                                           |

Un manifiesto para una app que corre en Android 10 o anterior y en 11 o
posterior. Conserva solo los bloques que tu app necesita:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Número de teléfono: READ_PHONE_STATE hasta API 29, READ_PHONE_NUMBERS desde 30.
         Quita maxSdkVersion si llamas a otros métodos de telefonía. -->
    <uses-permission
        android:name="android.permission.READ_PHONE_STATE"
        android:maxSdkVersion="29" />
    <uses-permission android:name="android.permission.READ_PHONE_NUMBERS" />

    <!-- Almacenamiento: escribir no da acceso adicional desde API 30 -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission
        android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="29" />

    <!-- Ubicación: el segundo plano se pide aparte -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />

    <!-- Visibilidad de paquetes: nombra con qué hablas y bloquea la lista completa fusionada -->
    <uses-permission
        android:name="android.permission.QUERY_ALL_PACKAGES"
        tools:node="remove" />
    <queries>
        <intent>
            <action android:name="android.intent.action.TTS_SERVICE" />
        </intent>
    </queries>

    <!-- El flag de almacenamiento antiguo solo aplica en Android 10 -->
    <application android:requestLegacyExternalStorage="true">
        <service
            android:name=".CallService"
            android:foregroundServiceType="camera|microphone" />
    </application>
</manifest>
```

La página de almacenamiento de Google recomienda mantener
`requestLegacyExternalStorage` para los dispositivos con Android 10; Android 11
lo ignora en las apps con target 30.

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

Para las apps con target API 30, el restablecimiento automático de permisos, el
pedido de ubicación en segundo plano en dos pasos y el permiso del número de
teléfono son filas de [la tabla de target](#apps-con-target-api-30). El
interruptor por app del restablecimiento es "Remove permissions if app isn't
used", en App info > Permissions.

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

| Cambio                                                                                                                                   | Qué hacer                                                                             | Cómo comprobarlo                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Permisos de una sola vez y la regla de los dos rechazos                                                                                  | Verifica el permiso antes de cada acceso; espera un rechazo sin diálogo               | `adb shell dumpsys package <package>` muestra `USER_FIXED`; `adb shell pm clear-permission-flags <package> <permission> user-set user-fixed` lo restablece |
| Los servicios en primer plano iniciados desde segundo plano pierden cámara y micrófono, y la ubicación si no hay acceso en segundo plano | Inícialos mientras la app está visible                                                |                                                                                                                                                            |
| El intent de ajustes de superposición ignora el paquete                                                                                  | Indica al usuario que elija tu app en la lista                                        | Compat `CHANGE_RESTRICT_SAW_INTENT` (135920175), solo se registra                                                                                          |
| Scudo es el asignador nativo y fdsan aborta                                                                                              | Corrige los errores de memoria y de descriptores de archivo en el código nativo       |                                                                                                                                                            |
| `getIccId()` devuelve una cadena vacía                                                                                                   | Usa `getSubscriptionId()`                                                             |                                                                                                                                                            |
| Las estadísticas de uso requieren un usuario desbloqueado                                                                                | Llama a `UsageStatsManager` después de que `isUserUnlocked()` devuelva true           |                                                                                                                                                            |
| Compartir una URI de contenido                                                                                                           | Agrega `FLAG_GRANT_READ_URI_PERMISSION` o `FLAG_GRANT_WRITE_URI_PERMISSION` al intent |                                                                                                                                                            |
| Se eliminó la biblioteca compartida de Maps v1                                                                                           | Pasa al Maps SDK for Android y quita su `<uses-library>`                              |                                                                                                                                                            |
| Las apps no pueden leer las carpetas de otras apps en `Android/data`                                                                     | Comparte archivos con un `FileProvider` o con el Storage Access Framework             |                                                                                                                                                            |

### Apps con target API 30

| Cambio                                                                                                                                              | Qué hacer                                                                                                     | Cómo comprobarlo                                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| El scoped storage es obligatorio; `requestLegacyExternalStorage` se ignora                                                                          | Usa `MediaStore` y el Storage Access Framework; migra los archivos antiguos antes de subir `targetSdkVersion` | Lint `ScopedStorage`; compat `DEFAULT_SCOPED_STORAGE` (149924527) y `FORCE_ENABLE_SCOPED_STORAGE` (132649864)                  |
| `WRITE_EXTERNAL_STORAGE` no da acceso adicional                                                                                                     | Escribe en tus propios directorios o en las colecciones de `MediaStore`                                       | Lint `ScopedStorage`                                                                                                           |
| Los selectores del Storage Access Framework rechazan las raíces de almacenamiento, la carpeta Download como árbol, y `Android/data` y `Android/obb` | No pidas al usuario que elija esas ubicaciones                                                                | Compat `RESTRICT_STORAGE_ACCESS_FRAMEWORK` (141600225)                                                                         |
| Los directorios de datos privados de otras apps quedan cerrados, aunque sean legibles por todos                                                     | Comparte con un `ContentProvider` o un `FileProvider`                                                         | Compat `APP_DATA_DIRECTORY_ISOLATION` (143937733)                                                                              |
| Las apps instaladas se filtran en `getInstalledApplications()` y llamadas similares                                                                 | Declara las apps o intents que necesitas en `<queries>`, incluidos TTS y reconocimiento de voz                | Lint `QueryPermissionsNeeded`; compat `FILTER_APPLICATION_QUERY` (135549675); `adb shell pm log-visibility --enable <package>` |
| Las apps sin uso pierden sus permisos en tiempo de ejecución                                                                                        | Verifica los permisos cuando se usa cada función, no una vez al abrir                                         | Los pasos de `adb` de la página de hibernación de apps de Google                                                               |
| Se ignora un pedido conjunto de ubicación en primer y segundo plano                                                                                 | Pide la ubicación en segundo plano sola y luego lleva al usuario a Ajustes                                    | Compat `BACKGROUND_RATIONALE_CHANGE_ID` (147316723)                                                                            |
| `getLine1Number()` requiere `READ_PHONE_NUMBERS`                                                                                                    | Decláralo; limita `READ_PHONE_STATE` si el número era su único uso                                            |                                                                                                                                |
| Cámara o micrófono en un servicio en primer plano                                                                                                   | Agrega `camera` o `microphone` a `android:foregroundServiceType`                                              | Compat `CAMERA_MICROPHONE_CAPABILITY_CHANGE_ID` (136219221)                                                                    |
| Se bloquean los toasts personalizados desde segundo plano                                                                                           | Usa un toast de texto o una notificación; `Toast.addCallback()` avisa cuándo se muestra y se oculta           | Compat `CHANGE_BACKGROUND_CUSTOM_TOAST_BLOCK` (128611929); logcat muestra "Blocking custom toast"                              |
| El sistema dibuja los toasts de texto; `setGravity()` y `setMargin()` no hacen nada                                                                 | No posiciones los toasts de texto                                                                             | Compat `CHANGE_TEXT_TOASTS_IN_THE_SYSTEM` (147798919)                                                                          |
| Los punteros del heap llevan una etiqueta en el byte más alto                                                                                       | Corrige el código nativo que modifica bits de los punteros                                                    | Compat `NATIVE_HEAP_POINTER_TAGGING` (135754954)                                                                               |
| No se instalan APKs firmados solo con v1                                                                                                            | Firma con APK Signature Scheme v2 o superior, y mantén v1 para dispositivos antiguos                          | Android Studio o `apksigner`                                                                                                   |
| Un `resources.arsc` comprimido o sin alinear impide la instalación                                                                                  | Guárdalo sin comprimir y alineado a 4 bytes                                                                   | Compat `RESOURCES_ARSC_COMPRESSED` (132742131)                                                                                 |
| Los intents implícitos `IMAGE_CAPTURE` y `VIDEO_CAPTURE` solo van a la cámara del sistema                                                           | Indica el paquete para usar una cámara de terceros                                                            |                                                                                                                                |
| Firebase JobDispatcher y `GcmNetworkManager` dejan de funcionar en Android 6.0+                                                                     | Pasa a WorkManager                                                                                            |                                                                                                                                |
| `Editor.clear()` llama a `onSharedPreferenceChanged()` con una clave null                                                                           | Maneja una clave null en el listener                                                                          | Compat `CALLBACK_ON_CLEAR_CHANGE` (119147584)                                                                                  |
| Se ignora el flag del botón de accesibilidad puesto en tiempo de ejecución                                                                          | Declara `flagRequestAccessibilityButton` en el archivo de metadatos del servicio                              | Compat `REQUEST_ACCESSIBILITY_BUTTON_CHANGE` (136293963)                                                                       |
| Leer la base de datos de APN requiere `WRITE_APN_SETTINGS`                                                                                          | Deja de leerla; solo las apps privilegiadas tienen ese permiso                                                | Compat `APN_READING_PERMISSION_CHANGE_ID` (124107808)                                                                          |
| Se bloquean las interfaces no SDK de la lista max-target-q                                                                                          | Pasa a APIs públicas                                                                                          | Compat `HIDE_MAXTARGETSDK_Q_HIDDEN_APIS` (149994052)                                                                           |

La lista de compat de Google marca `DEFAULT_SCOPED_STORAGE` como "Enabled for
all apps", mientras que su página de almacenamiento liga la aplicación al target
de la app. Para probar sin scoped storage hay que desactivar los dos cambios de
scoped storage. La lista también incluye cambios de administración de
dispositivos, telefonía y validación del manifiesto que pocas apps encuentran.

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
existe `QUERY_ALL_PACKAGES`, y lint `QueryAllPackagesPermission` lo señala.
Google Play revisa ambos permisos: All files access desde mayo de 2021, y
`QUERY_ALL_PACKAGES` mediante su formulario de declaración de permisos.

## Migrar a API 30

De `targetSdk 29` a 30, en este orden:

1. **Actualiza las herramientas.** Pon `compileSdkVersion 30` y usa AGP 4.1, o
   las versiones parcheadas de 3.3.3 a 4.0.1. Si lo saltas, una biblioteca que
   declara `<queries>` rompe la fusión del manifiesto con "unexpected element
   `<queries>`". Comprueba: el proyecto compila y el manifiesto fusionado
   muestra tus queries.
2. **Mueve los archivos antes de subir el target.** Copia los datos de las
   rutas del almacenamiento compartido a directorios propios de la app o a
   `MediaStore`, y limita `WRITE_EXTERNAL_STORAGE` con `maxSdkVersion="29"`.
   Si lo saltas, los archivos que la app escribió con el modelo antiguo quedan
   inaccesibles. Comprueba: lint `ScopedStorage` y luego la app con
   `DEFAULT_SCOPED_STORAGE` y `FORCE_ENABLE_SCOPED_STORAGE` activados.
3. **Declara la visibilidad de paquetes.** Lista en `<queries>` los paquetes e
   intents que consultas o inicias. Si lo saltas, las llamadas a
   `PackageManager` actúan como si esas apps no estuvieran instaladas.
   Comprueba: lint `QueryPermissionsNeeded`, luego
   `adb shell pm log-visibility --enable <package>` y busca `AppsFilter` en
   logcat.
4. **Separa los pedidos de ubicación.** Pide la ubicación en primer plano,
   luego `ACCESS_BACKGROUND_LOCATION` sola, y después lleva al usuario a
   Ajustes. Si lo saltas, un pedido conjunto no concede ninguna. Comprueba:
   cada flujo de ubicación en Android 11.
5. **Indica el tipo de tus servicios en primer plano.** Agrega `camera` o
   `microphone` a `android:foregroundServiceType`. Si lo saltas, el servicio
   pierde el acceso a la cámara o al micrófono. Comprueba: la función responde
   con la app en segundo plano, o cambia
   `CAMERA_MICROPHONE_CAPABILITY_CHANGE_ID`.
6. **Corrige el permiso del número de teléfono.** Pide `READ_PHONE_NUMBERS`
   para `getLine1Number()`. Si lo saltas, `READ_PHONE_STATE` solo ya no lo
   cubre.
7. **Revisa el empaquetado.** Firma con APK Signature Scheme v2 o superior y
   deja `resources.arsc` sin comprimir y alineado. Si lo saltas, Android 11 no
   instala la app. Comprueba: instala la build de release en un dispositivo con
   Android 11.
8. **Revisa las filas menores** de la tabla de target que te apliquen: toasts,
   intents de cámara, JobDispatcher, preferencias compartidas, el botón de
   accesibilidad, acceso a APN e interfaces no SDK.
9. **Prueba el resultado** en un dispositivo o emulador con Android 11 y
   `targetSdk 30`. Para aislar un cambio, cámbialo en una build depurable en
   Developer options > "App Compatibility Changes", o con
   `adb shell am compat disable <change ID> <package>`. Para volver a ver un
   diálogo de permiso tras dos rechazos, borra sus flags con
   `adb shell pm clear-permission-flags`.

Si saltas varios niveles a la vez: haz los pasos de cada versión en orden,
desde [Android 10](/es/notes/android-10/) si tu target es 28 o menos.

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
