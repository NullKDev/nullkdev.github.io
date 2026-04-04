---
title: "8 Patrones GoF que Deciden si tu App Android Escala"
description: "La mayoría de las apps móviles no fracasan por malas funcionalidades — fracasan por mala arquitectura. Aquí están los 8 patrones del Gang of Four que impactan directamente la escala y confiabilidad en apps Android en producción."
date: 2026-04-04
tags: ["android", "kotlin", "arquitectura", "patrones-de-diseño"]
authors: ["me"]
lang: es
image: ../gof-patterns-android/banner.svg
order: 1
---

La mayoría de las apps móviles no fracasan por malas funcionalidades.
Fracasan por mala arquitectura.

Después de 7+ años publicando apps Android — desde proyectos personales hasta codebases de equipo que incorporan nuevos devs cada trimestre — siempre vuelvo a los mismos 8 patrones del libro del Gang of Four. No porque sean académicos, sino porque resuelven *problemas reales y recurrentes* a escala en producción.

Esta es una serie práctica. Sin teoría por sí misma — solo el patrón, el problema Android que resuelve, y el código Kotlin que lo hace funcionar.

---

## Los 8 Patrones de un Vistazo

| Patrón | Qué resuelve | Contexto Android |
|---|---|---|
| **Observer** | UI que nunca queda desactualizada | ViewModel + StateFlow |
| **State** | Estados imposibles, imposibles de representar | Sealed class `UiState` |
| **Proxy** | Cache + retry, invisible para quien llama | Capa Repository |
| **Facade** | Una llamada oculta 5 casos de uso | API de feature para ViewModels |
| **Adapter** | Cambiar cualquier SDK en un archivo | SDKs de analíticas, pagos |
| **Factory** | Fuentes mockeables desde el día uno | Inyección de dependencias |
| **Strategy** | A/B test en runtime, sin reescrituras | Feature flags |
| **Decorator** | Agregar comportamientos sin tocar el núcleo | Logging, auth, caché |

---

## Las 4 Reglas que Aplico en Cada Proyecto

No son pautas — son restricciones que previenen los errores arquitectónicos más comunes:

```
→ Cada SDK obtiene un Adapter
→ Repository siempre = Proxy (cache gate)
→ Un sealed UiState por pantalla
→ Facade por feature — ViewModels delgados
```

Romper cualquiera está bien en un prototipo. En producción, cada una eventualmente tiene un costo.

---

## Los Números a Escala

Cuando estos patrones se aplican consistentemente en un codebase:

- **3× más rápido el onboarding del equipo** — los nuevos devs encuentran estructura predecible en todas partes
- **70% menos boilerplate** — los patrones eliminan la toma de decisiones repetitiva
- **0 vendor lock-in** con Adapter — he cambiado SDKs de analíticas en una tarde
- **10× más rápidas las pruebas unitarias** — Factory + Adapter significa sin red real, sin disco real

---

## Estructura de la Serie

Cada parte cubre dos patrones — su relación, su código, y cómo interactúan:

1. **[Observer & State](./observer-state)** — Reactividad UI y estados de pantalla forzados por el compilador
2. **[Proxy & Facade](./proxy-facade)** — Cache gates y ViewModels delgados
3. **[Adapter & Factory](./adapter-factory)** — Independencia de SDKs y fuentes testeables
4. **[Strategy & Decorator](./strategy-decorator)** — Comportamiento en runtime y extensiones aditivas

---

La arquitectura es la decisión que tomas a las 9am que salva a tu equipo a las 2am.

Empieza con la Parte 1: [Observer & State →](./observer-state)
