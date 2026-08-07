---
entryId: notes-android-17-stable-es
locale: es
translationKey: android-17-stable
slug: android-17-estable
title: 'Android 17: qué rompe en targetSdk 37'
summary: De la Beta 3 al release del 16 de junio — los cambios que quedan dormidos hasta que subís targetSdk a 37, y las dos reescrituras de runtime debajo.
visibility: public
maturity: stable
publishedAt: 2026-07-29
updatedAt: 2026-08-06
topics: [android, kotlin, platform-apis, security]
featuredRank: 3
image: /banners/android-17-stable.svg
imageAlt: Banner de Android 17 estable — estable, seis semanas después.
links:
  - label: Android 17 is here
    href: https://android-developers.googleblog.com/2026/06/Android-17.html
    kind: publication
  - label: 'Behavior changes: apps targeting Android 17'
    href: https://developer.android.com/about/versions/17/behavior-changes-17
    kind: publication
references: []
evidence: []
documents: []
protection: { mode: public }
kind: article
lifecycle: current
series:
  id: android-17
  order: 2
citations:
  - title: Android 17 is here
    url: https://android-developers.googleblog.com/2026/06/Android-17.html
    accessedAt: 2026-07-29
  - title: The fourth beta of Android 17
    url: https://android-developers.googleblog.com/2026/04/the-fourth-beta-of-android-17.html
    accessedAt: 2026-07-29
  - title: 'Behavior changes: all apps'
    url: https://developer.android.com/about/versions/17/behavior-changes-all
    accessedAt: 2026-07-29
  - title: 'Behavior changes: apps targeting Android 17'
    url: https://developer.android.com/about/versions/17/behavior-changes-17
    accessedAt: 2026-08-06
  - title: MessageQueue behavior change guidance
    url: https://developer.android.com/about/versions/17/changes/messagequeue
    accessedAt: 2026-08-06
  - title: Background audio hardening
    url: https://developer.android.com/about/versions/17/changes/bg-audio
    accessedAt: 2026-08-06
  - title: Android Contact Picker
    url: https://developer.android.com/about/versions/17/features/contact-picker
    accessedAt: 2026-08-06
  - title: Prepare your app for the resizability and orientation changes
    url: https://android-developers.googleblog.com/2026/02/prepare-your-app-for-resizability-and.html
    accessedAt: 2026-08-06
---

Android 17 — API 37, nombre en código interno _Cinnamon Bun_ — pasó a estable el
**16 de junio de 2026**, junto con el Pixel Drop de junio, en Pixel 6 y
posteriores. El resto de los fabricantes se viene sumando al rollout desde
entonces. La Beta 4 — la última, donde se bloqueó la superficie de API — salió el
**16 de abril**. Mi [nota sobre la Beta 3](/es/notes/android-17-beta-3/) cubre API
37 en platform stability; esta cubre lo que pasó después, y lo que realmente te
cuesta tiempo.

Seis semanas después, el encuadre útil no es la lista de features. Es este: **casi
todo lo que va a romper tu app está dormido ahora mismo.** Se dispara cuando subís
`targetSdk` a 37, no cuando un usuario actualiza el teléfono. O sea que vos elegís
el día, y eso conviene usarlo a propósito.

## El proceso cambió, y esa es la noticia real

Por primera vez en años, Google **no publicó ningún Developer Preview**. Android
17 fue directo a Beta.

No es un atajo. Es el [canal Canary](https://developer.android.com/about/versions/canary)
haciendo el trabajo que hacían los Developer Preview: las APIs y features se
prueban continuamente ahí, así que un build de preview aparte dejó de ganarse su
lugar en el calendario. La consecuencia para planificar es concreta — la ventana
entre "primer release compilable" y "platform stability" es más corta, y si tu
proceso asumía una fase de DP para absorber sorpresas, esa fase ya no existe.

## Qué rompe en targetSdk 37

### 1. La redimensionabilidad en pantallas grandes ya no es opcional

Las apps que apunten a Android 17 **ya no pueden optar por salirse** de las
restricciones de orientación, redimensionamiento y aspect ratio en pantallas cuyo
ancho mínimo supera los **600dp**. Los flags del manifest que fijaban una app en
vertical dejan de respetarse, la app ocupa toda la ventana del display, y ya no
hay pillarboxing donde esconderse.

Este es el que hay que planificar, no parchear. Si tu layout asumía una
orientación fija, va a ser redimensionado en una tablet o un plegable y vas a
descubrir dónde viven los supuestos. Google plantea Android 17 como el paso a un
estándar "adaptive-first", y esta es la cláusula que lo hace cumplir.

La exención es más angosta que "los juegos zafan": aplica a las apps que
**declaran `android:appCategory="game"`**. Es una declaración en el manifest, no
una interpretación. Y en Play, apuntar a API 37 pasa a ser obligatorio para apps
nuevas y actualizaciones en **agosto de 2027** — así que la exención te compra
tiempo de layout, no una salida.

### 2. `System.load()` exige librerías nativas de solo lectura

> Todos los archivos nativos cargados con `System.load()` deben estar marcados
> como solo lectura. Si no, el sistema lanza `UnsatisfiedLinkError`.

Si distribuís código nativo que se extrae, se copia o se descarga en runtime y
después se carga desde una ubicación escribible, ese camino ahora lanza excepción.
Es una restricción de Dynamic Code Loading: una librería que todavía podés
escribir es una librería que un atacante todavía puede reescribir entre el chequeo
y la carga.

Vale hacer un grep de `System.load(` — no de `loadLibrary`, que resuelve desde el
APK y no está afectado.

### 3. El acceso a la red local está bloqueado por defecto

Las apps que apunten a 17 tienen el **acceso a la red local bloqueado por
defecto**. mDNS, sockets, descubrimiento de dispositivos — cualquier cosa que
llegue a una impresora, un Chromecast, una lámpara inteligente, un servidor de
desarrollo local u otro teléfono en la misma Wi-Fi.

Hay **dos caminos de vuelta**, y el orden importa:

1. **Un selector de dispositivos mediado por el sistema.** El usuario elige el
   dispositivo, el sistema otorga el alcance, y vos no mostrás ningún prompt de
   permiso.
2. **El nuevo permiso runtime `ACCESS_LOCAL_NETWORK`**, pedido explícitamente,
   para comunicación persistente con la LAN.

Ir al permiso primero es el reflejo, y es la peor opción: pagás un prompt, una
tasa de rechazo y una justificación que tenés que escribir. Probá el selector
antes de decidir que necesitás acceso amplio.

### 4. El audio en background exige un foreground service

Reproducir, pedir foco de audio o cambiar el volumen desde una app que no está
visible ahora requiere un **foreground service corriendo**. Además, la app tiene
que cumplir una de dos condiciones:

- el foreground service tiene capacidades **while-in-use (WIU)**, o
- la app tiene el permiso de **alarma exacta** y está manejando streams
  `USAGE_ALARM`.

Ojo con lo que exige la plataforma: un foreground service con la capacidad
correcta. `MediaSessionService` no está en la regla; es la forma práctica de
cumplirla. Media3 configura, arranca y para ese servicio por vos y publica la
notificación de media, así que una app construida sobre `MediaSessionService` ya
está mayormente en regla.

Lo que convierte esto en la fecha límite de **ExoPlayer 2**. No tiene
mantenimiento, no gestiona el ciclo de vida del foreground service, y las reglas
nuevas están modeladas alrededor del manejo de sesión y foco de Media3. Nada
bloquea de golpe a ExoPlayer 2 — simplemente vas a tener reproducción
interrumpida, foco perdido y notificaciones rotas, que es una falla peor que un
crash porque nadie reporta un bug por eso.

Para las apps que **no** apuntan a 17 igual aplica la versión suave: las APIs de
audio llamadas fuera de un ciclo de vida válido **fallan en silencio**, y el foco
de audio devuelve `AUDIOFOCUS_REQUEST_FAILED`.

### 5. La reflection sobre la plataforma deja de funcionar

Dos cambios, una misma causa, y caen sobre tus dependencias más que sobre tu
código.

**Los campos `static final` ya no se pueden cambiar.** Una app corriendo en 17 y
apuntando a 37 que reescriba uno por reflection recibe un `IllegalAccessException`;
hacerlo por JNI (`SetStaticLongField()` y compañía) **crashea el proceso**. Los
dobles de prueba, los shims de feature flags y los SDK de analytics hacen esto más
de lo que uno supone.

**`MessageQueue` es una implementación nueva sin locks.** La vieja usaba un único
lock para la cola del hilo principal, así que un hilo de fondo podía bloquear al
principal — contención que aparecía como frames perdidos. La reescritura lo
elimina. El costo es que todo lo que reflexione sobre los internos de
`MessageQueue` se rompe: `mMessages` sigue existiendo por compatibilidad binaria,
pero **siempre es `null`**, haya mensajes pendientes o no. Espresso y Robolectric
son los primeros que vas a tocar, así que actualizá esas librerías antes de mover
`targetSdk`.

Auditá el árbol de dependencias antes del bump, no después. Un `null` silencioso
en un campo que antes traía datos es el tipo de falla más caro de rastrear.

### 6. Los SMS con OTP llegan tres horas tarde

Para la mayoría de las apps que apuntan a 17, los SMS con código de un solo uso
**no se pueden leer hasta tres horas después de llegar**. Durante esa ventana el
broadcast `SMS_RECEIVED_ACTION` se retiene y las consultas al proveedor de SMS se
filtran. La app de mensajería por defecto y las apps de dispositivos vinculados
están exentas.

La misma retención de tres horas aplica a los **mensajes en formato WebOTP sin
importar el targetSdk**, cuando la app no es el destinatario verificado por
dominio.

Tres horas no es una demora con la que se diseña: es un mensaje de que leer la
bandeja se terminó. Si todavía parseás SMS directamente, pasate a **SMS Retriever**
o **SMS User Consent** — los dos te entregan el código sin que la app lea los
mensajes del usuario, que es justamente el punto.

### 7. Certificate Transparency viene activado

CT era opt-in en Android 16. Para las apps que apuntan a 17 está **activado por
defecto**.

Para casi todos esto es invisible y bueno. Muerde en un solo lugar: si pineás o
inyectás un certificado que no está en un log público de CT — un proxy
corporativo, un arnés de pruebas, una CA interna — conexiones que antes
funcionaban van a fallar. Probá tu entorno de staging antes de asumir que
producción está bien.

### 8. Los contactos se angostan

Se movieron dos cosas, y solo una rompe.

La que rompe: para las apps que apuntan a 37, **Contacts Provider 2 esconde las
columnas con PII** de la vista de datos — `ACCOUNT_NAME`, `ACCOUNT_TYPE`,
`ACCOUNT_TYPE_AND_DATA_SET`. Si las consultás, contá con que no van a estar.

La otra es una oportunidad. Android 17 trae un **Contact Picker** estandarizado:
una UI del sistema navegable donde declarás los campos que necesitás — teléfonos,
mails — y el usuario te entrega contactos puntuales. `READ_CONTACTS` no está
deprecado, pero ahora es la opción bruta. Si pedías la agenda entera porque no
había alternativa, ahora la hay.

## El recolector de basura se volvió generacional

El Concurrent Mark-Compact de ART ahora es **generacional**. En vez de tratar a
todos los objetos igual y barrer el heap completo, corre recolecciones de
generación joven, frecuentes y baratas, y reserva las pasadas de heap completo
para cuando hacen falta de verdad.

La premisa es la observación más vieja de la recolección de basura: la mayoría de
los objetos muere joven. Actuar sobre eso baja el costo de CPU y la duración de la
recolección, lo que se ve como menos frames perdidos y menos batería quemada
haciendo contabilidad.

Esto lo tenés gratis — sin `targetSdk`, sin cambiar código. Y como ART se
distribuye por Google Play system updates, las mejoras de runtime llegan a
dispositivos hasta **API 31**, no solo a los que se actualizaron de OS.

## La firma post-cuántica ya está en Keystore

Android Keystore ahora soporta **ML-DSA** — Module-Lattice-Based Digital Signature
Algorithm, el estándar post-cuántico del NIST — en dos variantes, `ML-DSA-65` y
`ML-DSA-87`.

La parte que importa para la adopción: está expuesto a través de las APIs
**estándar de Java Cryptographic Architecture**. `KeyPairGenerator`, `KeyFactory`,
`Signature`. Ninguna superficie nueva que aprender, ningún SDK de proveedor. Si
hoy generás claves de firma en hardware, la forma del código no cambia — cambia el
string del algoritmo.

Si ya lo necesitás es otra pregunta. Las firmas post-cuánticas importan donde una
firma tiene que seguir siendo verificable durante años y un adversario puede
guardar el tráfico de hoy para atacarlo después. Para un token de sesión que
expira en una hora, no. Está bien que la plataforma esté lista antes de que la
necesidad sea urgente: ese es el orden correcto en las migraciones
criptográficas.

## Límites de memoria, en breve

Android 17 aplica **límites de memoria por app derivados del RAM del dispositivo**,
y un proceso que los excede muere **sin stack trace**. `ApplicationExitInfo` es
donde te enterás de que pasó.

Este merece más que un párrafo, y tiene su propia nota:
[Android 17 mata tu proceso sin stack trace](/es/notes/android-17-limites-memoria/).

## Qué recibieron los usuarios

Dos cosas que vale conocer porque llegan preguntas de soporte por ellas:

**App Bubbles para cualquier app.** Presión larga sobre una app en la pantalla de
inicio y se convierte en una burbuja flotante estilo chat head. Antes las burbujas
eran una función de mensajería; ahora cualquier app puede serlo, lo que significa
que a tu UI le pueden pedir que se dibuje en una ventana flotante chiquita para la
que nunca fue diseñada.

**"Marcar como perdido" de Find Hub puede exigir biometría.** Bloquear un
dispositivo perdido ahora puede pedir autenticación biométrica además del código,
así que alguien que te vio escribir el PIN igual no puede desactivar el rastreo. Un
cambio chico con un modelo de amenaza claro detrás.

## Qué haría esta semana

1. **Compilá contra SDK 37 en CI, sin cambiar `targetSdk`.** Obtenés señal de
   deprecaciones y de superficie de API con riesgo de comportamiento cero.
2. **Auditá tus dependencias por reflection.** Las librerías de testing, feature
   flags y analytics son las que reescriben campos `static final` y leen los
   internos de `MessageQueue`. Actualizá Espresso y Robolectric primero.
3. **Grep de `System.load(`.** El chequeo más rápido posible para el breaking
   change que más fácil se pasa por alto.
4. **Probá en un plegable o un emulador de tablet en horizontal.** No porque vaya
   a verse mal — porque ahora va a pasar, hayas optado o no.
5. **Inventariá tus permisos.** Todo lo que toque la LAN, la agenda o la bandeja
   de SMS ahora tiene un camino más angosto y mediado por el sistema que le gana a
   pedir.
6. **Corré tu camino de TLS en staging.** CT por defecto falla ruidosamente, pero
   solo donde tengas un certificado no público, y eso normalmente no es
   producción.
7. **Después subí `targetSdk`**, a propósito, con tiempo para reaccionar.

Si manejás un equipo, no esperes a que el plazo de Play te fuerce el número. La
auditoría es la parte lenta, no el bump.

El patrón de este release es consistente: la plataforma está cerrando caminos que
antes eran opcionales — salirse de la orientación, librerías nativas escribibles,
acceso irrestricto a la LAN, lecturas amplias de contactos, scraping de SMS,
reflection sobre los internos, memoria sin techo. Cada uno era un lugar donde una
app podía ser descuidada y el costo caía en otra parte. Es una dirección
defendible. También significa que "sigue funcionando" deja de ser evidencia de
nada el día que cambiás un número.
