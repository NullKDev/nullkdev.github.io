---
title: "El Impuesto del Reflow: Por Qué Medir Texto Es Caro"
description: "Antes de entender por qué pretext es rápido, necesitas entender qué es el layout reflow, por qué el navegador lo hace y exactamente cuándo tu código lo activa — muchas veces sin saberlo."
date: 2026-04-04
tags: ["javascript", "performance", "web", "typography"]
authors: ["me"]
lang: es
order: 2
---

*Parte 1 de [Pretext: La Librería de 15 kb Que Esquiva la Operación Más Cara del Navegador](/es/blog/pretext)*

---

## ¿Qué Es el Layout Reflow?

Cuando un navegador renderiza una página, construye dos árboles: el **árbol DOM** (qué elementos existen) y el **árbol de layout** (dónde está cada elemento, en píxeles). Construir el árbol de layout requiere conocer fuentes, contenido, dimensiones del contenedor y reglas CSS de cada elemento. Es costoso — las páginas modernas pueden tardar decenas de milisegundos.

El navegador es inteligente al respecto. Agrupa las mutaciones del DOM y solo recomputa el árbol de layout cuando es absolutamente necesario — típicamente antes de pintar. Esta agrupación es lo que hace que las IUs complejas en JavaScript se sientan rápidas.

El problema es que algunas operaciones de JavaScript *fuerzan* al navegador a abandonar esa agrupación y computar el layout de inmediato, síncronamente, en medio de tu código. Esta computación síncrona forzada es el **layout reflow**.

---

## ¿Qué Desencadena el Reflow?

Leer cualquier propiedad de geometría cuando el layout está "sucio" (es decir, JavaScript ha cambiado algo desde el último pase de layout) desencadena el reflow:

```js
// Esta escritura ensucia el layout
element.style.width = '300px'

// Esta lectura fuerza el reflow inmediato — el navegador debe
// terminar el layout antes de poder darte una respuesta válida
const height = element.getBoundingClientRect().height

// Otra escritura, otra marca de suciedad
element.style.fontSize = '18px'

// Otro reflow forzado
const newHeight = element.offsetHeight
```

El patrón de arriba — escribir, leer, escribir, leer — se llama **layout thrashing**. Cada par lectura-después-escritura fuerza un recálculo de layout completo.

Las propiedades que desencadenan reflow forzado incluyen:
- `getBoundingClientRect()`
- `offsetHeight`, `offsetWidth`, `offsetTop`, `offsetLeft`
- `scrollHeight`, `scrollWidth`
- `clientHeight`, `clientWidth`
- `getComputedStyle()`

---

## Medir Texto Siempre Es una Lectura Sucia

Aquí está el punto de dolor específico para la medición de texto. Cuando quieres saber qué tan alto será un bloque de texto, el enfoque estándar es:

```js
function getTextHeight(text, font, maxWidth) {
  const el = document.createElement('div')
  el.style.cssText = `
    position: fixed;
    top: -9999px;
    width: ${maxWidth}px;
    font: ${font};
    word-break: break-word;
  `
  el.textContent = text
  document.body.appendChild(el)

  const height = el.getBoundingClientRect().height // ← reflow forzado
  
  document.body.removeChild(el)
  return height
}
```

Cada llamada a `getTextHeight()` agrega un elemento DOM (ensucia el layout), lee geometría (fuerza reflow) y elimina el elemento (ensucia de nuevo). Si llamas esto para 100 elementos de una lista, activas 100 pases de layout síncronos.

En una página compleja, cada reflow forzado puede tomar 10–50 ms. Para 100 elementos, eso es potencialmente 5 segundos de hilo principal bloqueado — solo para mediciones.

---

## Cuándo Realmente Duele

La mayoría de los sitios web nunca se topan con esto. Un blog estático con 10 posts no tiene problema. Los patrones donde se vuelve crítico son:

### Chat de IA en Streaming

Una respuesta en streaming actualiza una burbuja de chat cada pocos milisegundos. Si calculas la altura usando medición DOM, cada token desencadena un reflow. A tan solo 10 tokens por segundo, estás forzando 10 pases de layout por segundo solo para la altura, además de todo el renderizado normal. Las burbujas se entrecortan, las animaciones se atascan, el ancla de scroll lucha con cada actualización.

### Listas Virtualizadas

Librerías como `react-virtual` o `tanstack/virtual` necesitan conocer la altura de cada elemento antes de renderizarlo para posicionar correctamente los elementos debajo de él. La solución típica es renderizar elementos en un contenedor oculto, medirlos y luego eliminarlos. Para una lista de 1.000 elementos, esto significa 1.000 reflows forzados antes de poder siquiera desplazarse.

### Layouts Masonry

Masonry requiere conocer las alturas de las tarjetas antes de colocarlas en columnas. El mismo patrón de renderizar-oculto-y-medir causa la misma tormenta de reflows.

### Colaboración en Tiempo Real

Cualquier interfaz donde el contenido de texto cambia rápidamente por actualizaciones externas (documentos colaborativos, feeds en vivo, dashboards) choca con esta pared. El contenido llega, el layout se ajusta, las mediciones se actualizan — todo peleando entre sí en el hilo principal.

---

## Por Qué getBoundingClientRect No Puede Ser Rápido

Podrías preguntarte: ¿pueden los navegadores optimizar esto? La respuesta es mayoritariamente no. La razón por la que `getBoundingClientRect()` debe desencadenar un recálculo de layout síncrono es que **JavaScript es monohilo y los navegadores deben darte una respuesta válida y actual**.

Si el navegador calculara el layout de forma diferida en segundo plano (lo que hace para la pintura), una llamada de JavaScript que lee geometría obtendría datos desactualizados. Como JavaScript puede tomar decisiones basadas en esas mediciones (`if (height > 300) do X`), los navegadores no pueden mentir sobre el estado actual del layout.

La única manera de hacer la medición de texto verdaderamente rápida es moverla completamente fuera del DOM.

---

## Siguiente: Cómo Pretext Lo Resuelve

Eso es exactamente lo que Pretext hace. En lugar de preguntarle al motor de layout del navegador por las alturas, le pregunta al **motor de fuentes** — a través del Canvas — que no tiene árbol de layout y nunca causa reflow.

[Cómo Funciona Pretext →](/es/blog/pretext/how-it-works)
