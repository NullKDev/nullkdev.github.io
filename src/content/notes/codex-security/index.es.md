---
entryId: notes-codex-security-es
locale: es
translationKey: codex-security
slug: codex-security-brecha-precision
title: 'El número que Codex Security no publicó'
summary: 'OpenAI liberó su escáner de seguridad y reportó 92% de recall. El número que decide si los hallazgos sirven — la precisión — nunca se publicó.'
visibility: public
maturity: stable
publishedAt: 2026-08-03
updatedAt: 2026-08-03
topics: [security, developer-tools, architecture]
featuredRank: 1
image: /banners/codex-security.svg
imageAlt: Banner de Codex Security — el número que no publicaron.
links:
  - label: openai/codex-security
    href: https://github.com/openai/codex-security
    kind: repository
  - label: Documentación del CLI de Codex Security
    href: https://learn.chatgpt.com/docs/security/cli
    kind: external
  - label: '@openai/codex-security en npm'
    href: https://www.npmjs.com/package/@openai/codex-security
    kind: release
references: []
evidence: []
documents:
  - documentId: ci-integration
    slug: integracion-ci
    order: 1
protection: { mode: public }
kind: article
lifecycle: current
citations:
  - title: openai/codex-security
    url: https://github.com/openai/codex-security
    accessedAt: 2026-08-03
  - title: Documentación del CLI de Codex Security
    url: https://learn.chatgpt.com/docs/security/cli
    accessedAt: 2026-08-03
  - title: Referencia de comandos del CLI de Codex Security
    url: https://learn.chatgpt.com/docs/security/cli/reference
    accessedAt: 2026-08-03
  - title: 'RealVuln: evaluación de escáneres basados en reglas, LLM de propósito general y especializados en seguridad sobre código real'
    url: https://arxiv.org/abs/2604.13764
    accessedAt: 2026-08-03
  - title: '¿Están los LLM de frontera listos para ciberseguridad? Evidencia desde benchmarks de vulnerabilidades de doble modo'
    url: https://arxiv.org/abs/2605.23243
    accessedAt: 2026-08-03
  - title: 'Sifting the Noise: estudio comparativo de agentes LLM para filtrar falsos positivos de vulnerabilidades'
    url: https://arxiv.org/abs/2601.22952
    accessedAt: 2026-08-03
---

El 29 de julio de 2026, OpenAI publicó **Codex Security** — un CLI y un SDK de
TypeScript para encontrar, validar y corregir vulnerabilidades — bajo licencia
Apache 2.0. Venía funcionando desde marzo como research preview con el nombre
Aardvark, y el número que lo acompañó en todas partes es genuinamente llamativo:
**92% de las vulnerabilidades conocidas e introducidas sintéticamente**
detectadas en repositorios de referencia, más 3.000 vulnerabilidades críticas
corregidas hasta abril y diez CVE divulgados en proyectos de código abierto.

El repositorio superó las 8.000 estrellas en menos de un mes. Fui a buscar la
metodología detrás de ese 92%, y lo que encontré no fue un defecto. Fue una
ausencia.

**El número es recall. El número que decide si podés usar la herramienta es la
precisión, y la precisión nunca se publicó.**

## Qué es realmente

Antes del argumento, la arquitectura — porque la mayoría de las notas la contó
mal, y en las dos direcciones.

El CLI corre en tu máquina y escanea repositorios que ya están en disco. Pero el
razonamiento no es local. Llama a un modelo hospedado — `gpt-5.6-sol` con
esfuerzo de razonamiento `xhigh` por defecto — y **ejecutar escaneos requiere
acceso a Codex Security**, que está restringido. Los escaneos de repositorio
completo pueden requerir además lo que la documentación llama Trusted Access for
Cyber.

Así que la descripción precisa es más estrecha que la nota de prensa y que la
reacción en contra. Lo que es Apache 2.0 es el CLI, el SDK, el arnés de Docker y
la orquestación. Lo que está cerrado es aquello que decide si un hallazgo es un
hallazgo. Podés leer cada línea de cómo se recolecta, se trocea y se envía tu
código. No podés leer, ejecutar ni auditar la parte que razona sobre él.

Esa distinción importa más que la discusión de licencias a la que suele
reducirse. Significa que la propiedad interesante de esta herramienta — su
criterio — no es reproducible por vos, y que su perfil de error es el que diga la
evaluación de OpenAI.

Lo que nos lleva a la evaluación.

## De dónde sale el 92%

El recall responde una pregunta: _de las vulnerabilidades que existen, ¿cuántas
encontró el escáner?_ Sobre repositorios de referencia sembrados con fallos
conocidos e introducidos a propósito, Codex Security encontró 92 de cada 100.

Es un resultado real y difícil. También es, por sí solo, infalsificable como
afirmación de utilidad, porque se puede alcanzar 100% de recall reportando que
cada línea del código es vulnerable.

La pregunta complementaria es la precisión: _de las cosas que el escáner reportó,
¿cuántas eran reales?_ El recall mide lo que atrapás. La precisión mide lo que
tenés que atravesar para llegar ahí. Poné un escáner con 92% de recall y 20% de
precisión sobre un monorepo y le habrás entregado a tu equipo de seguridad cuatro
falsas alarmas por cada verdadera — indefinidamente, en cada commit.

Hay dos cosas más sobre ese 92% que conviene retener.

Incluye vulnerabilidades **introducidas sintéticamente**. Los fallos inyectados
son más fáciles que los orgánicos: suelen estar contenidos localmente, tener una
forma idiomática y no estar enredados con la arquitectura que los rodea. Las
vulnerabilidades reales son con frecuencia emergentes — una función segura
llamada con estado influido por un atacante tres capas más arriba. Cualquier
cifra de recall que mezcle ambas sobrestima el desempeño sobre el segundo tipo.

Y está medido sobre repositorios elegidos para el benchmark. Tu código no.

## Qué encontraron los benchmarks independientes

Acá la historia gira, y gira en contra de la narrativa fácil, no a favor.

[RealVuln](https://arxiv.org/abs/2604.13764) (Pellew y Raza, marzo de 2026)
evaluó 15 escáneres sobre 26 repositorios Python vulnerables con **796 hallazgos
etiquetados a mano — 676 vulnerabilidades reales y 120 trampas deliberadas de
falso positivo**. El conjunto de trampas es la parte que importa: existe
específicamente para atrapar herramientas que llegan a un recall alto por
coincidencia de patrones.

Los resultados de precisión:

| Escáner           | Categoría                  | Precisión |
| ----------------- | -------------------------- | --------- |
| Claude Sonnet 4.6 | LLM de propósito general   | 0,785     |
| Gemini 3.1 Pro    | LLM de propósito general   | 0,774     |
| SonarQube         | SAST basado en reglas      | 0,611     |
| SecLab Agent      | Especializado en seguridad | 0,605     |
| Snyk              | SAST basado en reglas      | 0,282     |
| Semgrep           | SAST basado en reglas      | 0,205     |

Yo esperaba que esta tabla condenara a los LLM. Hace lo contrario. **Los modelos
de propósito general fueron aproximadamente tres veces más precisos que las
herramientas SAST basadas en reglas que la industria viene ejecutando hace una
década.** En las clases que exigen entender de verdad qué hace el código, la
brecha de recall es todavía mayor: inyección SQL 95% contra 32%, inyección de
comandos 83% contra 24%.

Semgrep con 0,205 de precisión significa que cuatro de cada cinco hallazgos son
ruido. Ese es el titular actual. Eso es lo que los equipos ya toleran.

Así que el encuadre honesto no es «los escáneres con IA son ruidosos». Es: **los
escáneres con IA parecen una mejora grande sobre una línea base que era muy mala,
y Codex Security decidió no reportar dónde cae en el eje donde esa mejora se
vería.**

El segundo paper fija el rango.
[¿Están los LLM de frontera listos para ciberseguridad?](https://arxiv.org/abs/2605.23243)
(Dahiya et al., revisado en junio de 2026) evaluó ocho modelos y encontró que
**todos los modelos de frontera producen entre 10% y 50% de falsos positivos** en
detección de caja blanca, sobrepredciendo vulnerabilidades de forma sistemática.
Su mejor modelo especializado alcanzó 0,904 de precisión con 9,7% de falsos
positivos. La motivación que declaran es exactamente la misma brecha: los
benchmarks previos no reportaban tasas de falsos positivos, y esa es la métrica
que determina la utilidad en el mundo real.

Un 10% y un 50% de falsos positivos son la diferencia entre una herramienta en la
que tu equipo confía y una que tu equipo silencia. Codex Security podría estar en
cualquiera de los dos extremos. Nada de lo publicado te dice cuál.

## Por qué esto lo es todo

Si creés que un escáner ruidoso es apenas molesto, mirá lo que le hizo a curl.

curl mantuvo un bug bounty en HackerOne desde abril de 2019. Para 2025, los
reportes generados con LLM — largos, seguros de sí mismos, superficialmente
plausibles y fabricados — habían desbordado a un equipo de seguridad voluntario
de siete personas. Los números de Daniel Stenberg: la **tasa de vulnerabilidades
confirmadas cayó de más del 15% a menos del 5%**, con aproximadamente uno de cada
cinco envíos siendo basura directa. Cada reporte falso seguía costando horas,
porque no se puede descartar una afirmación de seguridad sin leerla.

A comienzos de 2026 curl cerró el programa. Lo reabrió alrededor de un mes
después, cuando la calidad de los reportes se recuperó, pero el volumen siguió
subiendo.

El encuadre del propio Stenberg fue que la basura generada por IA es un ataque de
denegación de servicio contra el código abierto. Ese es el modelo mental
correcto, y se traslada directo a tu pipeline de CI. **Los falsos positivos en
herramientas de seguridad no se degradan con elegancia.** Consumen el recurso más
escaso del equipo — la atención experta — y cuando ese recurso se agota, la gente
deja de leer los hallazgos. Un escáner ignorado tiene valor negativo, porque
sigue cargando la promesa de que algo se está revisando.

Por eso mismo, un detalle chico de diseño del CLI tranquiliza más que cualquier
benchmark. `findings false-positive` permite marcar un hallazgo como no aplicable
con una razón escrita, y **la decisión persiste entre escaneos futuros sin
suprimir la regla subyacente**. Eso no es una comodidad. Es una admisión, en
código, de que los falsos positivos son el problema operativo — y está construido
de la forma correcta, porque suprimir la regla es justamente como los equipos se
quedan ciegos ante una clase entera de vulnerabilidad.

Alguien en ese equipo entiende el modo de falla real. Eso hace que la métrica
faltante resalte más, no menos.

## Qué te da la liberación del código

En concreto, y conviene separarlo del debate sobre si la etiqueta corresponde.

**Obtenés:** la capacidad de auditar qué sale de tu máquina, ejecutar el escáner
en tus propios contenedores, integrarlo a CI con tu propia política, mantener los
resultados en infraestructura que controlás y bifurcar la orquestación si no te
sirve. Para entornos regulados eso no es poco — el flujo de datos es la pregunta
que realmente hace cumplimiento, y ahora se responde leyendo el código.

**No obtenés:** la capacidad de ejecutarlo sin la aprobación de OpenAI,
reproducir sus resultados, evaluarlo antes de pedir acceso, ni seguir usándolo si
cambian los términos. La inteligencia de escaneo es una dependencia hospedada con
una puerta delante.

Una advertencia que la documentación plantea y que la cobertura pasó por alto: la
salida del escaneo contiene **fragmentos de código fuente y detalles de las
vulnerabilidades**. El directorio de salida es un artefacto sensible. Si lo
apuntás dentro del repositorio, tarde o temprano vas a commitear un archivo que
describe exactamente cómo explotar tu propio producto. Mantenelo fuera del árbol
y con una política de retención — el cableado está en el
[complemento sobre integración con CI](/es/notes/codex-security-brecha-precision/integracion-ci/).

## Qué haría yo

- **Tomate la prueba en serio y diseñala como una medición.** El acceso está
  restringido, así que tenés una sola oportunidad de primera impresión. No la
  gastes en un repositorio que ya sabés que está limpio.
- **Medí la precisión vos, porque nadie más lo hizo.** Ejecutalo sobre un
  repositorio cuyo historial de vulnerabilidades conozcas — uno con CVE resueltos
  y commits auditados. Contá hallazgos confirmados sobre hallazgos totales. Esa
  sola razón te dice más que el 92%.
- **Incluí un conjunto de trampas de falso positivo.** El diseño de RealVuln vale
  la pena copiarlo: sembrá código que parezca vulnerable y no lo sea. El
  comportamiento de un escáner ante casi-aciertos deliberados es el mejor sustituto
  disponible de su comportamiento sobre tu código real.
- **Compará contra la línea base que realmente ejecutás,** no contra la
  perfección. Si hoy Semgrep te da 0,205 de precisión, un escáner en 0,6 es una
  ganancia grande aunque esté lejos de estar limpio.
- **Presupuestá el tiempo de revisión antes de habilitarlo en CI.** Con cualquier
  precisión plausible, alguien va a leer hallazgos que terminan en nada. Decidí
  quién y cuánto tiempo antes de que se bloquee el primer pull request.

Lo que vale la pena llevarse no es que Codex Security esté sobrevalorado — con la
evidencia disponible es una herramienta fuerte, y la literatura independiente es
más amable con esta clase de escáner de lo que yo esperaba al empezar.

Es que **una cifra de 92% de recall, publicada sin su contraparte de precisión, es
media medición presentada como una completa**. La mitad que se publicó es la
mitad que vende. La mitad que no, es la que determina si tu equipo va a seguir
leyendo la salida dentro de seis meses.

Pedí ese número cuando solicites acceso. Si existe, es lo más útil que podrían
decirte.
