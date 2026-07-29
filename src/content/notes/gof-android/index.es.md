---
entryId: notes-gof-android-es
locale: es
translationKey: gof-android
slug: patrones-gof-android
title: '8 patrones GoF que deciden si tu app Android escala'
summary: Ocho patrones del Gang of Four que deciden si una app Android escala — el patrón, el problema que resuelve y el Kotlin que lo hace funcionar.
visibility: public
maturity: stable
publishedAt: 2026-04-04
updatedAt: 2026-07-23
topics: [android, kotlin, architecture, design-patterns]
featuredRank: 2
image: /banners/gof-patterns-android.svg
imageAlt: Ocho patrones del Gang of Four mapeados a preocupaciones de arquitectura Android.
links: []
references: []
evidence: []
documents:
  - documentId: observer-state
    slug: observer-state
    order: 1
  - documentId: proxy-facade
    slug: proxy-facade
    order: 2
  - documentId: adapter-factory
    slug: adapter-factory
    order: 3
  - documentId: strategy-decorator
    slug: strategy-decorator
    order: 4
protection: { mode: public }
kind: article
lifecycle: current
series:
  id: gof-android
  order: 1
citations: []
---

La mayoría de las apps móviles no fracasan por malas funcionalidades.
Fracasan por mala arquitectura.

Después de 7+ años publicando apps Android — desde proyectos personales hasta codebases de equipo que incorporan nuevos devs cada trimestre — siempre vuelvo a los mismos 8 patrones del libro del Gang of Four. No porque sean académicos, sino porque resuelven _problemas reales y recurrentes_ a escala en producción.

Esta es una serie práctica. Sin teoría por sí misma — solo el patrón, el problema Android que resuelve, y el código Kotlin que lo hace funcionar.

---

## Los 8 patrones de un vistazo

| Patrón        | Qué resuelve                                  | Contexto Android               |
| ------------- | --------------------------------------------- | ------------------------------ |
| **Observer**  | UI que nunca queda desactualizada             | ViewModel + StateFlow          |
| **State**     | Estados imposibles, imposibles de representar | Sealed class `UiState`         |
| **Proxy**     | Cache + retry, invisible para quien llama     | Capa Repository                |
| **Facade**    | Una llamada oculta 5 casos de uso             | API de feature para ViewModels |
| **Adapter**   | Cambiar cualquier SDK en un archivo           | SDKs de analíticas, pagos      |
| **Factory**   | Fuentes mockeables desde el día uno           | Inyección de dependencias      |
| **Strategy**  | A/B test en runtime, sin reescrituras         | Feature flags                  |
| **Decorator** | Agregar comportamientos sin tocar el núcleo   | Logging, auth, caché           |

---

## Las 4 reglas que aplico en cada proyecto

No son pautas — son restricciones que previenen los errores arquitectónicos más comunes:

```
→ Cada SDK obtiene un Adapter
→ Repository siempre = Proxy (cache gate)
→ Un sealed UiState por pantalla
→ Facade por feature — ViewModels delgados
```

Romper cualquiera está bien en un prototipo. En producción, cada una eventualmente tiene un costo.

---

## Los números a escala

Cuando estos patrones se aplican consistentemente en un codebase:

- **3× más rápido el onboarding del equipo** — los nuevos devs encuentran estructura predecible en todas partes
- **70% menos boilerplate** — los patrones eliminan la toma de decisiones repetitiva
- **0 vendor lock-in** con Adapter — he cambiado SDKs de analíticas en una tarde
- **10× más rápidas las pruebas unitarias** — Factory + Adapter significa sin red real, sin disco real

---

## Cómo está organizado

Lo que sigue toma los patrones de a dos, porque así es como aparecen en la práctica — cada par cubre la relación entre ellos, el código, y cómo interactúan. Observer y State resuelven la reactividad de la UI y los estados de pantalla forzados por el compilador. Proxy y Facade resuelven los cache gates y los ViewModels delgados. Adapter y Factory resuelven la independencia de SDKs y las fuentes testeables. Strategy y Decorator resuelven el comportamiento en runtime y las extensiones aditivas.

---

La arquitectura es la decisión que tomas a las 9am que salva a tu equipo a las 2am.
