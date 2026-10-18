---
parentDomain: notes
parentId: notes-android-15-es
documentId: beta-3
locale: es
translationKey: android-15-beta-3
slug: beta-3
title: 'Android 15 Beta 3: estabilidad de plataforma'
summary: 18 de junio de 2024. Con la tercera beta llegó la estabilidad de plataforma y las apps con target 35 ya podían ir a Google Play. Sumó passkeys en un paso y WebSQL quedó obsoleto.
order: 5
visibility: public
maturity: stable
publishedAt: 2026-10-18
topics: [android, platform-apis]
references: []
evidence: []
protection: { mode: public }
---

La Beta 3 salió el 18 de junio de 2024 y alcanzó la estabilidad de
plataforma: las APIs para desarrolladores y todos los comportamientos hacia
las apps quedaron definitivos, y las apps con target Android 15 ya podían
publicarse en Google Play. Google dijo que traía pocas novedades.

|                           |                                                                   |
| ------------------------- | ----------------------------------------------------------------- |
| Fecha                     | 18 de junio de 2024; 3.1 el 1 de julio de 2024                    |
| Build                     | `AP31.240517.022`; 3.1 `AP31.240517.031`                          |
| Parche de seguridad       | Junio de 2024                                                     |
| Dispositivos              | Pixel 6 a Pixel 8a, Pixel Fold, Pixel Tablet                      |
| Cómo obtenerla            | Por OTA con Android Beta, o flasheando; imágenes para el emulador |
| Estabilidad de plataforma | Sí: APIs y comportamientos definitivos                            |

- **Passkeys en un paso.** En las apps con target Android 15, el usuario
  inicia sesión con una passkey en un solo diálogo de rostro, huella o
  bloqueo de pantalla. Los proveedores de credenciales delegan la
  autenticación en la interfaz del sistema con `androidx.credentials`.
- **Autocompletado de respaldo.** Una app puede asociar una solicitud de
  Credential Manager a un campo de usuario o contraseña. Si el usuario cierra
  el diálogo de passkey, las sugerencias siguen apareciendo en el teclado o en
  un desplegable.
- **WebSQL obsoleto.** `WebSettings.setDatabaseEnabled()` y
  `getDatabaseEnabled()` quedan obsoletos en WebView, y Google anunció que no
  harían nada en ninguna versión de Android en un plazo de 12 meses. IndexedDB
  es el reemplazo.

La Beta 3.1 corrigió que la pantalla de bloqueo pidiera desbloquear al tocar
elementos que no lo requerían, y fallos del desbloqueo facial.
