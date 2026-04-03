---
title: "Remote Compose: UI Server-Driven en Android, por Fin de la Manera Correcta"
description: "Remote Compose (androidx.compose.remote) permite definir UI Compose en un servidor y renderizarla en cualquier dispositivo Android sin actualizar la app en la Play Store. Cómo funciona, por qué importa, y cómo se compara con otros enfoques."
date: 2026-04-01
tags: ["android", "kotlin", "compose", "jetpack"]
authors: ["me"]
lang: es
image: ../compose-remote/banner.svg
order: 1
---

Algo silenciosamente significativo llegó a Jetpack a finales de 2025. `androidx.compose.remote` — **Remote Compose** — es la respuesta oficial de Google a la UI server-driven en Android. Alcanzó la versión alpha07 el 25 de marzo de 2026, y vale la pena entender qué es y, más importante, qué problema resuelve en realidad.

## El Problema que Nunca se Resolvió del Todo

La UI Server-Driven (SDUI) ha sido un patrón conocido en Android durante años. Airbnb, Twitter, Lyft y otros construyeron sus propios stacks de SDUI. El enfoque común: definir un esquema JSON para componentes, enviar un renderer que mapea claves JSON a UI real, y actualizar la interfaz cambiando el payload del servidor.

Funciona. Pero tiene desventajas reales:
- **JSON es verboso y sin tipos** — construyes tu propio contrato y esperas que ambos lados coincidan
- **Los renderers divergen** — el renderer del cliente y la definición del servidor se desincronizaron con el tiempo
- **Sin seguridad en compilación** — un typo en el nombre de un componente simplemente no renderiza nada

Mientras tanto, la solución nativa de Android era `RemoteViews` — un formato de UI serializable y cross-process que existe desde Android 1.5. Los widgets de Glance, los tiles de Wear OS, los widgets de la pantalla de bloqueo — todos usan `RemoteViews` hoy. Es confiable pero muy limitado: sin layouts personalizados, sin composables arbitrarios, sin Compose en absoluto.

Remote Compose es el sucesor de ambos.

---

## Qué Es Remote Compose en Realidad

Remote Compose es una **capa de serialización sobre la semántica de Jetpack Compose**. En lugar de renderizar en un Canvas, escribes código similar a Compose usando la API `remote-creation`, y esta produce un **documento** binario compacto — un árbol de UI serializado. Ese documento se transmite (por red, IPC, o como quieras) a un cliente Android que lo renderiza usando el runtime `remote-player`.

La idea clave: **el cliente no necesita un compilador de Compose ni un runtime de Kotlin para el código de UI**. El player simplemente deserializa el documento y lo pinta. Sin actualización de APK.

```
Servidor / Proceso JVM
  └── API remote-creation → escribe código similar a Compose
        ↓ produce
      [ documento binario ]
        ↓ transmite
Cliente Android
  └── remote-player → deserializa + renderiza en View/host Compose
```

### Cómo Difiere del SDUI Basado en JSON

| | SDUI con JSON | Remote Compose |
|---|---|---|
| Formato | Texto (verboso) | Binario (compacto) |
| Seguridad de tipos | Ninguna (runtime) | Aplicada en tiempo de creación |
| Renderer | Personalizado, diverge | Provisto por el sistema, versionado |
| Poder de layout | Limitado por tu esquema | Modelo de layout completo de Compose |
| Oficial (Google) | No | Sí (Jetpack) |

---

## La Conexión con Glance

Si has usado Glance (la librería Jetpack para widgets y tiles de Wear OS), estás usando `RemoteViews` bajo el capó — la misma API de 2009. Remote Compose es el **futuro backend de renderizado de Glance**. La migración ya está en curso.

Este contexto importa: Remote Compose no es una curiosidad experimental. Es la infraestructura que Google está construyendo para la próxima década de widgets e UIs cross-process.

El encuadre "Volver al Futuro" que usó [Arman Chatikyan](https://medium.com/@chatikyan/remote-compose-back-to-the-future-454b8e824fad) es acertado: mismo problema que RemoteViews en 2009, solución moderna.

---

## Estructura de Módulos

La librería está dividida en **creación** (lado servidor/JVM) y **player** (cliente Android):

```kotlin
// Servidor / JVM — produce documentos
implementation("androidx.compose.remote:remote-creation:1.0.0-alpha07")
implementation("androidx.compose.remote:remote-creation-compose:1.0.0-alpha07")

// Cliente Android — renderiza documentos
implementation("androidx.compose.remote:remote-player-core:1.0.0-alpha07")
implementation("androidx.compose.remote:remote-player-view:1.0.0-alpha07")

// Tooling
debugImplementation("androidx.compose.remote:remote-tooling-preview:1.0.0-alpha07")
```

La separación es intencional: el lado de creación puede ejecutarse en un backend JVM (un servicio Spring, una Cloud Function, etc.) sin ninguna dependencia de Android. El lado del player es exclusivo de Android.

---

## La Barrera del RemoteApplier

Una decisión de diseño que destaca: desde alpha04, el `RemoteApplier` está **habilitado por defecto**. Es una barrera en tiempo de compilación que evita que composables regulares de Jetpack Compose se usen accidentalmente dentro de código de Remote Compose.

En la práctica, las funciones de Remote Compose se parecen a las funciones Compose regulares, pero operan en un scope de composición diferente. El compilador aplica la barrera. Si intentas llamar a un `@Composable` regular desde dentro de una función de Remote Compose, obtienes un error en compilación.

Es la decisión correcta — previene una clase de bugs donde UI no serializable se filtra a un documento que el player no puede renderizar.

---

## Qué Hay en alpha07 (25 de marzo de 2026)

La última versión agregó:

- **Escalado de fuente no lineal** — respeta la configuración de accesibilidad para texto grande
- **LayoutDirection** — soporte RTL/LTR para layouts internacionales
- `RemoteSpacer`, `RemoteImageVector`, `painterRemoteVector` — APIs recién públicas
- Funciones de modificador semántico — soporte de accesibilidad
- `RemoteArrangement.spacedBy()` — espaciado basado en gaps
- `RemoteDrawScope`, `RemoteCanvas`, `RemotePainter`, `RemoteBrush` extendidos
- Operaciones aritméticas en `RemoteFloat` y conversión `asRemoteDp()`

**Cambios que rompen compatibilidad en alpha07:**
- `RemoteArrangement.CenterHorizontally` eliminado — usar `RemoteArrangement.Center`
- El parámetro de alineación de `RemoteBox` cambió a un único `RemoteAlignment`

---

## Estado Actual: Todavía Alpha, pero Moviéndose Rápido

La librería publicó 7 releases alpha en aproximadamente 3.5 meses (diciembre 2025 → marzo 2026). El ritmo es agresivo: cada release agrega nuevas APIs públicas y rompe las existentes.

Hitos significativos hasta ahora:
- **alpha04**: `minSdk` bajó de 26 a 23 — señal de que el equipo busca adopción amplia
- **alpha04**: Soporte de `FlowLayout` agregado
- **alpha06**: Target Java 11 (puede requerir desugaring)
- **alpha07**: Escalado de fuente + RTL — requisitos básicos para apps internacionalizadas

---

## ¿Deberías Usarlo Ahora?

**Para apps en producción**: todavía no. La API cambia cada dos semanas.

**Para desarrolladores de widgets con Glance**: empieza a prestar atención. Hacia aquí va Glance, y la familiaridad temprana valdrá la pena cuando se formalice el camino de migración.

**Para equipos de SDUI**: vale la pena hacer un prototipo serio. Si tu equipo ha estado manteniendo un stack de SDUI personalizado, el atractivo de una alternativa oficial, con tipos, en formato binario, es obvio.

**Para casos de uso de widgets y tiles**: esta es la aplicación práctica más inmediata, ya que Glance ya está en este camino.

---

## Siguiente Parte

En la [siguiente parte](./getting-started), recorremos un ejemplo práctico: construir un documento Remote Compose simple en el lado de creación, serializarlo, y renderizarlo dentro de una app Android usando `remote-player-view`.

---

## Recursos

- [Remote Compose — Notas de Lanzamiento Oficiales](https://developer.android.com/jetpack/androidx/releases/compose-remote)
- [Arman Chatikyan — Remote Compose: Volver al Futuro](https://medium.com/@chatikyan/remote-compose-back-to-the-future-454b8e824fad)
- [Luca Fioravanti — De RemoteViews a RemoteCompose](https://medium.com/@fioravanti.luka/glance-remoteviews-and-remotecompose-what-actually-changed-in-android-16-4afc4b63b0ad)
