---
title: "Cómo Funciona Pretext: Dos Fases, Un Canvas, Cero Reflow"
description: "Pretext usa measureText() del Canvas como oráculo de fuentes durante la preparación, luego calcula todos los layouts subsiguientes con aritmética pura. Aquí está el modelo mental completo y la API."
date: 2026-04-04
tags: ["javascript", "performance", "web", "typography"]
authors: ["me"]
lang: es
order: 3
---

*Parte 2 de [Pretext: La Librería de 15 kb Que Esquiva la Operación Más Cara del Navegador](/es/blog/pretext)*

---

## El Modelo Mental

Pretext está construido sobre una sola idea: **medir texto y componer texto son dos problemas diferentes**.

Medir es costoso porque requiere el pipeline completo de conformación de fuentes del navegador — kerning, ligaduras, reglas de scripts complejos, clusters de emoji. Pero solo necesitas hacerlo una vez por combinación texto+fuente.

Componer es rápido si ya tienes las medidas: es solo aritmética — acumula anchos hasta que desbordes el contenedor, inserta un salto de línea, repite.

Pretext separa estas dos cosas claramente:

```
prepare(text, font) → PreparedText    // Oráculo de fuentes: mide una vez
layout(prepared, width, lineHeight)   // Aritmética pura: ejecuta muchas veces
```

---

## Fase 1: `prepare()` — El Oráculo Canvas

```ts
import { prepare } from '@chenglou/pretext'

const prepared = prepare('El reflow desaparece cuando sacas la medición del DOM.', '16px Inter')
```

Durante `prepare()`, pretext hace tres cosas:

**1. Segmentación** — Usando `Intl.Segmenter`, divide el texto en segmentos con conciencia del idioma. Esto maneja correctamente caracteres CJK, texto árabe de derecha a izquierda, clusters de emoji y límites de palabras a través de todos los scripts.

**2. Medición en Canvas** — Cada segmento se mide usando `CanvasRenderingContext2D.measureText()`. Esta es la operación clave. `measureText()` del Canvas le pregunta al motor de fuentes del navegador por anchos con precisión de píxeles — el mismo motor que el DOM usa para el layout — pero sin pasar por el pipeline de layout. Sin reflow, sin árbol de layout, solo métricas de glifos.

**3. Caché** — Los resultados se almacenan en un identificador opaco `PreparedText`. Este identificador es independiente del ancho: puedes llamar a `layout()` con cualquier ancho de contenedor y las medidas siguen siendo válidas.

El costo de preparación es aproximadamente equivalente a un pase de medición DOM. Lo pagas una vez.

---

## Fase 2: `layout()` — Aritmética Pura

```ts
import { layout } from '@chenglou/pretext'

const { height, lineCount } = layout(prepared, 320, 24)
// 320px de ancho del contenedor, 24px de altura de línea
```

`layout()` itera a través de los anchos de segmento cacheados, acumulando el ancho de línea actual. Cuando el ancho acumulado superaría `maxWidth`, rompe la línea. Cada salto de línea agrega `lineHeight` a la altura total.

Esto es aritmética de enteros/flotantes sobre un array de números. Sin acceso al DOM, sin llamadas a Canvas, sin interacción con el motor de fuentes. Se ejecuta en microsegundos independientemente de la longitud del texto.

**El caso de redimensionamiento** — la optimización más importante — se vuelve trivial:

```ts
const prepared = prepare(text, font) // una vez

// Responder al redimensionamiento del contenedor — solo aritmética
window.addEventListener('resize', () => {
  const { height } = layout(prepared, container.offsetWidth, 24)
  element.style.height = `${height}px`
})
```

---

## La API Rica: `prepareWithSegments` + `layoutWithLines`

El camino rápido te da altura y número de líneas. Cuando necesitas el contenido real de las líneas — para renderizado personalizado, posicionamiento del cursor o layout en streaming — usa la API rica:

```ts
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'

const prepared = prepareWithSegments('Cada token en streaming suma al costo de layout — a menos que uses pretext.', '18px "Helvetica Neue"')
const { lines } = layoutWithLines(prepared, 320, 26)

for (const line of lines) {
  console.log(`"${line.text}" — ${line.width}px`)
}
```

Cada `LayoutLine` lleva `text`, `width`, cursores `start` y `end`. Los cursores son posiciones de segmento/grafema — no offsets de string crudos — así que se mantienen correctos a través de caracteres multibyte y emoji.

---

## Layout en Streaming: `layoutNextLine`

Para el streaming de IA, a menudo necesitas fluir texto línea por línea mientras llegan los tokens. La función `layoutNextLine` maneja esto:

```ts
import { prepareWithSegments, layoutNextLine, type LayoutCursor } from '@chenglou/pretext'

const prepared = prepareWithSegments(streamingText, '16px Inter')
let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }

// Llamado cada vez que el texto crece
function renderNextLine(containerWidth: number) {
  const line = layoutNextLine(prepared, cursor, containerWidth)
  if (!line) return
  
  drawLine(line.text, currentY)
  cursor = line.end
  currentY += lineHeight
}
```

Esta es la API que hace que el chat de IA en streaming sea fluido: cada nuevo token puede extender la línea actual o iniciar una nueva, y el costo de esa determinación son nanosegundos.

---

## Qué Maneja Pretext (y Qué No)

**Maneja correctamente:**
- Latin, CJK (chino, japonés, coreano), árabe, hebreo, tailandés, jemer
- Emoji y secuencias de emoji (🏳️‍🌈 cuenta como un cluster)
- Texto bidireccional (algoritmo Unicode BiDi)
- `overflow-wrap: break-word` para palabras muy largas
- `white-space: pre-wrap` (tabulaciones, saltos de línea, espacios explícitos)
- `word-break: keep-all` para titulares CJK

**No maneja:**
- Fuente `system-ui` en macOS — Canvas y DOM pueden resolver variantes ópticas diferentes para el mismo tamaño. Siempre usa nombres de fuente explícitos: `'16px Inter'` no `'16px system-ui'`
- Renderizado del lado del servidor — Canvas requiere un entorno de navegador. La llamada a `prepare()` debe ejecutarse en el cliente
- Formato en línea CSS completo (spans anidados con fuentes mixtas) — usa el sidecar inline-flow para eso

---

## Cuándo No Usarlo

Pretext agrega sobrecarga de configuración (`prepare()` es tan costoso como un pase DOM) y complejidad mental. Es la herramienta incorrecta para:

- Contenido estático que no se redimensiona ni hace streaming
- Mediciones únicas de pocos elementos
- Cualquier contexto donde no estés en el camino caliente de "medir muchas veces"

Si `getBoundingClientRect()` no te está causando problemas de rendimiento, pretext no te ayudará. Agrega complejidad cuando los números lo justifican.

---

## Siguiente: Vélo en Acción

La teoría es limpia, pero los demos lo hacen tangible.

[Demo React: Chat en Streaming →](/es/blog/pretext/react-demo)
