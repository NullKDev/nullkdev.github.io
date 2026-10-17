---
entryId: notes-android-15-es
locale: es
translationKey: android-15
slug: android-15
title: 'Android 15: edge-to-edge y espacio privado'
summary: API 35, octubre de 2024. Con target 35 las apps van edge-to-edge, dataSync tiene seis horas al día, el espacio privado oculta apps y el código nativo debe usar páginas de 16 KB.
visibility: public
maturity: stable
publishedAt: 2026-10-17
topics: [android, platform-apis, security]
image: /banners/android-15.svg
imageAlt: 'Banner de Android 15 Vanilla Ice Cream, con el logo de la versión.'
links:
  - label: Funciones y APIs de Android 15
    href: https://developer.android.com/about/versions/15/features
    kind: publication
  - label: Cambios de comportamiento para apps con target Android 15
    href: https://developer.android.com/about/versions/15/behavior-changes-15
    kind: publication
references: []
evidence: []
documents: []
protection: { mode: public }
kind: article
lifecycle: current
series:
  id: android-versions
  order: 17
citations:
  - title: Android 15 features and APIs
    url: https://developer.android.com/about/versions/15/features
    accessedAt: 2026-10-17
  - title: 'Behavior changes: all apps (Android 15)'
    url: https://developer.android.com/about/versions/15/behavior-changes-all
    accessedAt: 2026-10-17
  - title: 'Behavior changes: apps targeting Android 15'
    url: https://developer.android.com/about/versions/15/behavior-changes-15
    accessedAt: 2026-10-17
  - title: 'Behavior changes: apps targeting Android 16'
    url: https://developer.android.com/about/versions/16/behavior-changes-16
    accessedAt: 2026-10-17
  - title: 'Behavior changes: all apps (Android 16)'
    url: https://developer.android.com/about/versions/16/behavior-changes-all
    accessedAt: 2026-10-17
  - title: Support 16 KB page sizes
    url: https://developer.android.com/guide/practices/page-sizes
    accessedAt: 2026-10-17
  - title: Support 16 KB page sizes (archived 31 August 2025)
    url: https://web.archive.org/web/20250831231121/https://developer.android.com/guide/practices/page-sizes
    accessedAt: 2026-10-17
  - title: Media projection
    url: https://developer.android.com/media/grow/media-projection
    accessedAt: 2026-10-17
  - title: Manifest.permission reference
    url: https://developer.android.com/reference/android/Manifest.permission
    accessedAt: 2026-10-17
  - title: R.attr reference (windowOptOutEdgeToEdgeEnforcement)
    url: https://developer.android.com/reference/android/R.attr
    accessedAt: 2026-10-17
  - title: Android 15 and Android 15 QPR1 release notes (AOSP)
    url: https://source.android.com/docs/whatsnew/android-15-release
    accessedAt: 2026-10-17
  - title: Codenames, tags, and build numbers (AOSP)
    url: https://source.android.com/docs/setup/reference/build-numbers
    accessedAt: 2026-10-17
  - title: Build.java at android-15.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-15.0.0_r1/core/java/android/os/Build.java
    accessedAt: 2026-10-17
  - title: PlatLogoActivity.java at android-15.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-15.0.0_r1/core/java/com/android/internal/app/PlatLogoActivity.java
    accessedAt: 2026-10-17
  - title: EasterEgg AndroidManifest.xml at android-15.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-15.0.0_r1/packages/EasterEgg/AndroidManifest.xml
    accessedAt: 2026-10-17
  - title: EasterEgg landroid_strings.xml at android-15.0.0_r1 (AOSP)
    url: https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-15.0.0_r1/packages/EasterEgg/res/values/landroid_strings.xml
    accessedAt: 2026-10-17
  - title: The First Developer Preview of Android 15
    url: https://android-developers.googleblog.com/2024/02/first-developer-preview-android15.html
    accessedAt: 2026-10-17
  - title: Android 15 is released to AOSP
    url: https://android-developers.googleblog.com/2024/09/android-15-is-released-to-aosp.html
    accessedAt: 2026-10-17
  - title: "What's new in Android 15, plus more updates (The Keyword)"
    url: https://blog.google/products/android/android-15/
    accessedAt: 2026-10-17
  - title: Bringing new theft protection features to Android users around the world
    url: https://security.googleblog.com/2024/10/android-theft-protection.html
    accessedAt: 2026-10-17
  - title: Pixel tech specs (Google Store)
    url: https://store.google.com/us/product/pixel_9_specs?hl=en-US
    accessedAt: 2026-10-17
  - title: Target API level requirements for Google Play apps
    url: https://support.google.com/googleplay/android-developer/answer/11926878
    accessedAt: 2026-10-17
  - title: Target API level requirements for Google Play apps (archived 29 August 2025)
    url: https://web.archive.org/web/20250829010255/https://support.google.com/googleplay/android-developer/answer/11926878?hl=en
    accessedAt: 2026-10-17
  - title: Android 15 released to AOSP, Pixel update in 'coming weeks' (9to5Google)
    url: https://9to5google.com/2024/09/03/android-15-aosp/
    accessedAt: 2026-10-17
  - title: Google launches Android 15, rolling out now to Pixel (9to5Google)
    url: https://9to5google.com/2024/10/15/google-android-15-pixel-launch/
    accessedAt: 2026-10-17
  - title: Pixel 9 runs Android 14 out of the box (9to5Google)
    url: https://9to5google.com/2024/08/13/pixel-9-android-14/
    accessedAt: 2026-10-17
  - title: Android 15's Landroid Easter egg as a screen saver (9to5Google)
    url: https://9to5google.com/2024/07/19/android-15-landroid/
    accessedAt: 2026-10-17
  - title: Android 15's internal code name is Vanilla Ice Cream (Android Authority)
    url: https://www.androidauthority.com/android-15-vanilla-ice-cream-3292769/
    accessedAt: 2026-10-17
  - title: 'File:Android 15 Logo.svg (Wikimedia Commons)'
    url: https://commons.wikimedia.org/wiki/File:Android_15_Logo.svg
    accessedAt: 2026-10-17
  - title: Android Developers content license
    url: https://developer.android.com/license
    accessedAt: 2026-10-17
---

Android 15 es la versión en la que edge-to-edge dejó de ser opcional. Las apps
con target API 35 se dibujan detrás de la barra de estado y de navegación por
defecto, y los foreground services de tipo `dataSync` tienen un límite de
tiempo diario. Para el usuario trajo el espacio privado, una zona con bloqueo
que oculta apps del resto del teléfono.

![El logotipo de Android 15: la palabra Android seguida del número 15, en negro](./assets/android-15-logo.svg 'Logotipo de Android 15, sobre una placa clara. Wikimedia Commons · Dominio público (PD-textlogo) · Marca registrada de Google LLC')

## De un vistazo

|                                    |                                                                                                     |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| Versión                            | Android 15                                                                                          |
| Nivel de API                       | 35                                                                                                  |
| Nombre                             | Vanilla Ice Cream, interno; visible en la constante del SDK. Nombre público: Android 15             |
| `Build.VERSION_CODES`              | `VANILLA_ICE_CREAM`                                                                                 |
| Lanzamiento                        | Código en AOSP el 3 de septiembre de 2024; despliegue en Pixel desde el 15 de octubre de 2024       |
| Dispositivos de lanzamiento        | Ninguno al salir: la serie Pixel 9 llegó con Android 14                                             |
| Plazo de target API en Google Play | Apps nuevas y actualizaciones desde el 31 de agosto de 2025, con prórroga al 1 de noviembre de 2025 |

La primera developer preview salió el 16 de febrero de 2024. El 3 de septiembre
de 2024 Google publicó el código de Android 15 en AOSP antes de que ningún Pixel
recibiera la actualización, algo que rompía la costumbre de lanzar ambos el
mismo día. La última versión que los había separado fue Android 12. El tag
`android-15.0.0_r1` tiene fecha del 5 de septiembre. El despliegue en Pixel
empezó el 15 de octubre de 2024 para el Pixel 6 y posteriores, el Pixel Fold y
la Pixel Tablet.

Los Pixel 9, presentados en agosto de 2024, venían con Android 14 de fábrica.
El primer Pixel vendido con Android 15 fue el Pixel 9a. El anuncio de Google
nombró además a Samsung, Honor, Lenovo, Motorola, Nothing, OnePlus, Oppo, Sony,
vivo y Xiaomi entre los fabricantes que llevarían la actualización en los meses
siguientes.

El nombre en clave Vanilla Ice Cream nunca se usó en el marketing, pero es la
constante del SDK, y AOSP la documenta en una línea: `Vanilla Ice Cream.`
Apareció en cambios de código de AOSP mucho antes del lanzamiento, según
informó Android Authority.

## Qué trajo

- **Espacio privado.** Una zona separada y con bloqueo para apps sensibles.
  Sus apps tienen su propio contenedor en el launcher y, mientras está
  bloqueado, desaparecen de recientes, notificaciones, ajustes y otras apps.
  Puede usar el bloqueo del dispositivo o uno propio, y admitir una cuenta de
  Google distinta.
- **Archivado de apps.** `PackageInstaller.requestArchive()` borra el APK y la
  caché de una app pero conserva sus datos; `requestUnarchive()` la restaura.
  En Pixel, el usuario también puede archivar una app desde App info.
- **Compartir una sola app.** El usuario puede compartir o grabar la ventana de
  una app en vez de toda la pantalla. Apareció primero en Android 14 QPR2;
  Android 15 suma callbacks de `MediaProjection` para adaptar la experiencia.
- **PDF.** `PdfRenderer` abre archivos protegidos con contraseña y admite
  anotaciones, edición de formularios (`FormEditRecord`), búsqueda de texto
  (`Page.searchText()`) y selección con copia. `PdfRendererPreV` lleva la misma
  API a Android 11 y posteriores.
- **Satélite.** `ServiceState.isUsingNonTerrestrialNetwork()` indica que el
  dispositivo está en una red satelital. Las apps de SMS, MMS y RCS
  preinstaladas pueden enviar y recibir mensajes por ella.
- **Cámara.** Low Light Boost aclara la vista previa con poca luz, y
  `FLASH_SINGLE_STRENGTH_DEFAULT_LEVEL` y `FLASH_TORCH_STRENGTH_DEFAULT_LEVEL`
  dan a las apps control sobre la intensidad del flash.
- **Herramientas de rendimiento.** `ApplicationStartInfo` informa si el
  arranque fue en frío, templado o en caliente, y por qué arrancó la app.
  `ProfilingManager` toma volcados de heap y muestras de pila desde la propia
  app. `StorageStats.getAppBytesByDataType()` desglosa el tamaño de la app por
  APK, código AOT y bibliotecas.
- **Bibliotecas de la plataforma.** APIs de OpenJDK 17 como
  `SequencedCollection`, que las actualizaciones del sistema de Google Play
  también llevan a Android 12 y posteriores. SQLite 3.44.3 con transacciones
  diferidas de solo lectura. `Canvas.clipShader()` y `Matrix44`.
- **Pantallas grandes.** Pares de apps guardados para pantalla dividida y una
  barra de tareas que el usuario puede fijar.

![El cajón de apps de un launcher Android con un contenedor bloqueado llamado Private al final](./assets/private-space.png 'El espacio privado como contenedor bloqueado al final del cajón de apps. Android Developers · CC BY 2.5')

## Seguridad y privacidad

- **Protección contra robo, en dos partes.** Android 15 pide el PIN, la
  contraseña o la biometría para cambiar ajustes sensibles como Find My Device,
  bloquea el dispositivo tras varios intentos de desbloqueo fallidos y refuerza
  la protección contra el restablecimiento de fábrica. Theft Detection Lock,
  Offline Device Lock y Remote Lock son otra cosa: llegaron con una
  actualización de Google Play services a la mayoría de dispositivos con
  Android 10 o superior, no con Android 15.
- **OTP ocultos.** Los notification listeners que no son de confianza ya no
  pueden leer notificaciones en las que el sistema detectó una contraseña de
  un solo uso. Los de confianza, como las apps de dispositivos acompañantes,
  quedan exentos.
- **Protección al compartir pantalla.** Mientras se comparte la pantalla, el
  contenido de las notificaciones y los campos de contraseña quedan ocultos
  para quien mira. Una app puede marcar una vista como sensible con
  `setContentSensitivity`.
- **Detección de grabación de pantalla.**
  `WindowManager.addScreenRecordingCallback()` avisa a la app cuando la están
  grabando.
- **Redes móviles inseguras.** Nuevos ajustes avisan cuando la conexión no está
  cifrada o cuando la red pide identificadores como el IMSI de una forma que
  permitiría rastrear al usuario. Los operadores ya no pueden ocultar el
  interruptor de 2G.
- **Plataforma.** Los permisos de firma que piden apps que no son del sistema
  pasan por una allowlist explícita. Virtual A/B versión 3 hace las
  actualizaciones más pequeñas y rápidas.

## Permisos

No se agregó ni cambió ningún permiso de tiempo de ejecución. Los permisos
nuevos son todos normales y se conceden al instalar:

- `FOREGROUND_SERVICE_MEDIA_PROCESSING`, necesario para un foreground service
  del nuevo tipo `mediaProcessing`.
- `ACCESS_HIDDEN_PROFILES`, que declara un launcher para mostrar el espacio
  privado. Además debe tener el rol de home.
- `DETECT_SCREEN_RECORDING`, necesario para el callback de grabación de
  pantalla.

El acceso a fotos, que Android 14 volvió parcial con
`READ_MEDIA_VISUAL_USER_SELECTED`, suma `MediaStore.QUERY_ARG_LATEST_SELECTION_ONLY`
para que una app consulte solo las fotos que el usuario eligió la última vez.
En [Android 14](/notes/android-14/) está cómo funciona el acceso parcial.

## Qué cambió para tu app

### Todas las apps en Android 15

| Cambio                                                                              | Qué hacer                                                                                               |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| No se pueden instalar apps con `targetSdkVersion` menor que 24                      | Sube el target; las apps ya instaladas se quedan                                                        |
| Una app detenida a la fuerza pierde sus pending intents y sus widgets se ven grises | Vuelve a registrar alarmas y pending intents con el `ACTION_BOOT_COMPLETED` del siguiente inicio        |
| Los dispositivos pueden usar páginas de memoria de 16 KB                            | Recompila las bibliotecas nativas con alineación ELF de 16 KB; las apps solo Kotlin o Java ya funcionan |
| Tu app puede instalarse otra vez dentro del espacio privado                         | No supongas que un segundo perfil es un perfil de trabajo                                               |
| Desaparece la fuente de emoji PNG `NotoColorEmojiLegacy.ttf`                        | Dibuja los emoji con las APIs de texto de la plataforma o con COLRv1                                    |
| Las animaciones de predictive back aparecen en las apps que se adhirieron           | Si te adheriste, revisa las animaciones de retroceso y las transiciones de fragments                    |
| Las peticiones de red fuera de un ciclo de vida válido del proceso fallan           | Ata las peticiones a un ciclo de vida; usa WorkManager o un foreground service para trabajo largo       |

### Apps con target API 35

| Cambio                                                                                                                                | Qué hacer                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Edge-to-edge es el comportamiento por defecto; `setStatusBarColor` y `setNavigationBarColor` no hacen nada                            | Maneja los window insets; los componentes de Material 3 lo hacen por ti                   |
| Los foreground services `dataSync` tienen 6 horas cada 24                                                                             | Detenlos en `Service.onTimeout(int, int)` o pasa el trabajo a WorkManager                 |
| Los receivers de `BOOT_COMPLETED` no pueden iniciar servicios `dataSync`, `camera`, `mediaPlayback`, `phoneCall` ni `mediaProjection` | Inícialos más tarde, a partir de una acción del usuario                                   |
| Tener `SYSTEM_ALERT_WINDOW` ya no basta para iniciar un foreground service desde segundo plano                                        | Muestra antes una ventana superpuesta visible                                             |
| Quien crea un `PendingIntent` bloquea por defecto los inicios de actividad desde segundo plano                                        | Acepta de forma explícita si quien lo envía debe abrir tu actividad                       |
| TLS 1.0 y 1.1 no están permitidos                                                                                                     | Usa TLS 1.2 o superior en todos los servidores                                            |
| Las peticiones de audio focus desde segundo plano fallan                                                                              | Pide el foco mientras la app es visible o desde un foreground service                     |
| Las apps no pueden activar ni desactivar el No molestar global                                                                        | Aporta una `AutomaticZenRule`                                                             |
| `elegantTextHeight` es true por defecto                                                                                               | Revisa los layouts en árabe, tailandés, tamil y los demás sistemas de escritura afectados |
| `Arrays.asList(...).toArray()` devuelve `Object[]` y `String.format()` es más estricto                                                | Usa `toArray(new String[0])`; corrige formatos del estilo `%0`                            |

El cambio a edge-to-edge es el que más apps notaron. Las barras se vuelven
transparentes (la navegación de tres botones conserva un velo del 80 %) y lo
que no tenga padding de insets queda debajo: top app bars, botones flotantes,
el último elemento de una lista. Con target 35 todavía se podía salir con
`windowOptOutEdgeToEdgeEnforcement` mientras se arreglaban las pantallas.

El nuevo tipo `mediaProcessing`, pensado para tareas como transcodificar,
tiene el mismo presupuesto de seis horas que `dataSync`:

```mermaid title="Un foreground service dataSync en una app con target API 35"
flowchart TD
  start([startForeground con tipo dataSync]) --> run[El servicio corre]
  run -- 6 horas usadas en las últimas 24 --> timeout[El sistema llama a onTimeout]
  timeout -- stopSelf en pocos segundos --> stopped[El servicio se detiene bien]
  timeout -- sigue corriendo --> crash[RemoteServiceException]
  stopped --> again{¿Iniciar otro dataSync?}
  again -- la app sigue en segundo plano --> denied[ForegroundServiceStartNotAllowedException]
  again -- el usuario trae la app al frente --> reset[El contador se reinicia]
```

Como `List.removeFirst()` y `removeLast()` pasan a resolverse con los nuevos
métodos de `SequencedCollection` al compilar contra API 35, el código con un
`minSdk` menor falla con `NoSuchMethodError` en Android 14 y anteriores. El
check `NewApi` de Lint lo detecta; `removeAt(0)` lo evita.

## Qué perduró

- **Edge-to-edge se volvió obligatorio.** Para apps con target Android 16,
  `windowOptOutEdgeToEdgeEnforcement` está obsoleto y se ignora.
- **Predictive back fue más lejos.** Las apps con target Android 16 tienen las
  animaciones del sistema por defecto y ya no se llama a `onBackPressed`.
- **`elegantTextHeight`**, activado por defecto aquí, está obsoleto en Android
  16 y se ignora en las apps con ese target.
- **Las páginas de 16 KB se volvieron una regla de Play.** Desde el 1 de
  noviembre de 2025, las apps nuevas y las actualizaciones con target Android
  15 o superior debían soportar páginas de 16 KB en dispositivos de 64 bits. La
  página actual fija el 1 de febrero de 2027 como la fecha desde la que se
  rechazan las actualizaciones que no cumplan. Android 16 agregó un modo de
  compatibilidad para algunas apps de 4 KB.
- **El espacio privado, el archivado de apps y los límites de tiempo de los
  foreground services** siguen igual.

## Para saber

- El Easter egg es **Landroid**, el juego espacial de Android 14. Mantener
  pulsado el logotipo de Android 15 carga un salto estelar durante cinco
  segundos, con el teléfono vibrando, antes de abrir el juego.
- Como novedad de Android 15, el juego también funciona como protector de
  pantalla una vez desbloqueado. Su descripción en AOSP es
  `---- AUTOPILOT ENGAGED ----`, y la nave vuela sola entre planetas.
- Google midió las páginas de 16 KB en sus propios dispositivos: arranques de
  apps cerca de un 3 % más rápidos con poca memoria libre y un inicio del
  sistema alrededor de un 8 % (unos 950 ms) más rápido de media.
