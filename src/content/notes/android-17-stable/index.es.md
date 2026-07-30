---
entryId: notes-android-17-stable-es
locale: es
translationKey: android-17-stable
slug: android-17-estable
title: 'Android 17: cuatro cambios que rompen en targetSdk 37'
summary: De la Beta 3 al release del 16 de junio — qué llegó, y los cambios de comportamiento que quedan dormidos hasta que subís targetSdk a 37.
visibility: public
maturity: stable
publishedAt: 2026-07-29
updatedAt: 2026-07-29
topics: [android, kotlin, platform-apis, security]
featuredRank: 2
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
---

Android 17 pasó a estable el **16 de junio de 2026**, junto con el Pixel Drop de
junio, en Pixel 6 y posteriores. La Beta 4 — la última, donde se bloqueó la
superficie de API — salió el **16 de abril**. Mi [nota sobre la Beta 3](/es/notes/android-17-beta-3/)
cubre API 37 en platform stability; esta cubre lo que pasó después, y lo que
realmente te cuesta tiempo.

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

## Los cuatro que rompen en targetSdk 37

### 1. La redimensionabilidad en pantallas grandes ya no es opcional

Las apps que apunten a Android 17 **ya no pueden optar por salirse** de las
restricciones de orientación, redimensionamiento y aspect ratio en pantallas
grandes. Los flags del manifest que fijaban una app en vertical dejan de
respetarse.

Este es el que hay que planificar, no parchear. Si tu layout asumía una
orientación fija, va a ser redimensionado en una tablet o un plegable y vas a
descubrir dónde viven los supuestos. Google plantea Android 17 como el paso a un
estándar "adaptive-first", y esta es la cláusula que lo hace cumplir.

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
defecto**. Para acceso persistente hace falta el nuevo permiso
`ACCESS_LOCAL_NETWORK`.

Esto agarra a más apps de lo que parece: cualquier cosa que descubra una
impresora, un Chromecast, una lámpara inteligente, un servidor de desarrollo
local, u otro teléfono en la misma Wi-Fi. Si tu app le habla a hardware en la LAN,
necesita el permiso y una razón que mostrarle al usuario.

### 4. Certificate Transparency viene activado

CT era opt-in en Android 16. En 17 está **activado por defecto**.

Para casi todos esto es invisible y bueno. Muerde en un solo lugar: si pineás o
inyectás un certificado que no está en un log público de CT — un proxy
corporativo, un arnés de pruebas, una CA interna — conexiones que antes
funcionaban van a fallar. Probá tu entorno de staging antes de asumir que
producción está bien.

También se refuerzan restricciones sobre interacciones de audio en background, con
exenciones para el audio de alarmas y algo de gating por foreground service.

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
2. **Grep de `System.load(`.** El chequeo más rápido posible para el breaking
   change que más fácil se pasa por alto.
3. **Probá en un plegable o un emulador de tablet en horizontal.** No porque vaya
   a verse mal — porque ahora va a pasar, hayas optado o no.
4. **Corré tu camino de TLS en staging.** CT por defecto falla ruidosamente, pero
   solo donde tengas un certificado no público, y eso normalmente no es
   producción.
5. **Después subí `targetSdk`**, a propósito, con tiempo para reaccionar.

El patrón de este release es consistente: la plataforma está cerrando caminos que
antes eran opcionales — salirse de la orientación, librerías nativas escribibles,
acceso irrestricto a la LAN, memoria sin techo. Cada uno era un lugar donde una
app podía ser descuidada y el costo caía en otra parte. Es una dirección
defendible. También significa que "sigue funcionando" deja de ser evidencia de
nada el día que cambiás un número.
