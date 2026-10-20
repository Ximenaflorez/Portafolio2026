---
slug: caso-02-informes-financieros-aliados
type: product
status: published
order: 2
title: "Informes financieros claros para aliados de una fintech"
seo:
  title: "Informes financieros de aliados | Caso de estudio"
  description: "Investigación y rediseño de los informes de una plataforma B2B para que los aliados de una fintech entiendan su cierre contable."
summary:
  product: "Una lectura accesible de recaudos, créditos y cierre contable, para que el aliado entienda el dinero sin ser analista."
  role: "Product Designer"
  team: "Cuatro personas en diseño de producto"
  duration: "Por completar"
  keyResult: "El 83,3 % usaba los informes propios, pero el 33,3 % no tenía conocimientos financieros."
  indexLine: "Rediseño de informes para que el aliado entienda el cierre y pueda vender el crédito."
  productType: "B2B / Fintech"
  sector: "Fintech"
  kind: "Investigación y diseño de interfaz"
---

_Los nombres de las empresas y algunos datos se anonimizaron y se modificaron por confidencialidad._

## 1. Problema inicial

_Tensión: ¿por qué importaba?_

**Contexto de negocio:** Una fintech de crédito tenía una plataforma B2B para sus comercios aliados. La pregunta de fondo era si los informes financieros se entendían. Si no se entendían, el aliado dejaba de ofrecer el crédito.

**Problema del usuario:** Los aliados cargaban con mucho esfuerzo al leer el cierre contable y el cruce de cuentas del día. No sabían si la cartera era suya o de la fintech, y los términos internos —como el nombre de la garantía— no les decían nada. El dinero tardaba más de 104 días en volver, y algunos negocios dejaron de ofrecer el crédito. Sin el detalle de los recaudos en el momento, armaban su propio control en papel.

**Cómo lo sabíamos:** Entrevistas con aliados de distintos sectores y tamaños, entre ellos colchones, comercio y calzado, según qué tan seguido abrían los reportes.

**Restricciones:** El 33,3 % de las personas entrevistadas no tenía conocimientos de análisis de datos ni de temas financieros. La interfaz tenía que leerse sin esa formación.

**Objetivo y métrica de éxito:** Entender cómo usan los informes para proponer algo que les sirva en la operación: cómo interpretan las cifras, qué los frena, qué datos les importan y en qué momento los miran.

## 2. Investigación y datos

_Descubrimiento: ¿qué no era obvio?_

- **83,3 %** usaba los informes propios de la fintech
- **33,3 %** no tenía conocimientos financieros ni de análisis de datos
- **104 días** o más para que el dinero volviera al negocio

**Métodos:** Entrevistas con aliados de distintos sectores. Se miró el tamaño del negocio y cada cuánto usaban los reportes. Los hallazgos se agruparon en un mapa de afinidad.

**Muestra:** Comercios aliados de distinto tamaño y sector, entre ellos colchones, comercio general y calzado.

**Hallazgos:**

- Casi todos usaban los informes de la fintech. Una herramienta externa de analítica no la abría nadie.
- La plataforma no dejaba cargar los descuentos propios de la tienda.
- La jerarquía y los nombres de los valores subían la carga cognitiva.
- Los informes de pago no traían el detalle de cada movimiento.
- Faltaba capacitación y las preguntas frecuentes no aclaraban los términos.

> **Insight que cambió el rumbo:** El cliente del aliado tampoco tiene cultura de crédito, así que el aliado tiene que explicarle el proceso. Si el aliado no entiende el informe, no puede vender el crédito.

## 3. Arquitectura de la solución

_Decisión: ¿qué elegiste y qué descartaste?_

- **Dashboard:** Ventas, créditos, recaudo y fechas\
  Pieza central del MVP
- **Glosario:** Términos financieros y preguntas frecuentes\
  Segunda pieza del MVP

**Decisiones clave:** El MVP fue el dashboard y el glosario. Un recorrido guiado para personas nuevas y antiguas importaba mucho, pero era menos factible de inmediato, así que quedó por fuera de esta entrega.

**Sistema y componentes:** La pestaña «Mis informes» abre un dashboard, créditos, recaudos e informes estadísticos y comerciales. El dashboard compara recaudos, créditos y anulaciones con el periodo anterior. El cierre separa lo que está a favor de lo próximo a pagar, con barras de ventas por semana y un desglose de créditos generados, saldo de cartera y recaudos. El UI kit reúne color, tipografía, chips, gráficos de barras y tarjetas numéricas. Como referente se miraron un software contable, los reportes de pago de otra fintech y glosarios financieros claros.

**Colaboración con ingeniería:** _Por completar · handoff y ajustes con el sistema de informes actual._

**Validación:** Pruebas con personas. Todas encontraron la información desde el menú lateral. El resumen del cierre contable se entendió, y el verde para ingresos y el rojo para egresos aceleró la lectura del dashboard.

## 4. Resultados y aprendizajes

_Impacto y reflexión_

**Resultados:** En la prueba, todas las personas llegaron a la información de interés por el menú lateral. El resumen del cierre contable resultó entendible. El color —verde para ingresos, rojo para egresos— permitió leer el dashboard más rápido.

**Lo que no funcionó:** El monto a recibir o a pagar tenía que verse con más fuerza, y el saldo del aliado tenía que separarse mejor. Faltaban ayudas sobre las palabras técnicas y el historial de anulaciones en el dashboard.

**Lo que haría distinto:** Una interfaz limpia no basta si la persona desconoce los conceptos. El glosario y el recorrido guiado debieron ir junto con el dashboard, no después.

**Siguientes pasos:** Un solo lugar para explicar los términos financieros, un recorrido paso a paso para quien entra por primera vez y para quien ya usaba la plataforma, y videos cortos cuando la plataforma cambie.

## 5. Apoyo visual

_Evidencia visual_

![Tablero de Mis informes con recaudos, créditos, anulaciones, estado contable, cierre del periodo y ventas de la semana.](/casos/caso-02.png "Mis informes: el dashboard del aliado.")

**Hallazgos:**
![Qué encontramos: gráficas de uso de informes y de conocimiento financiero, junto a dos cierres de cuentas de tiendas.](/casos/caso-02-hallazgos.jpg "Qué encontramos en la investigación.")

**Arquitectura de Mis informes:**
![Árbol de la plataforma: Mis informes, créditos, recaudos e informes contable, estadístico y comercial, con el dashboard marcado.](/casos/caso-02-arquitectura.jpg "Arquitectura de Mis informes.")

**Matriz de priorización:**
![Matriz de importancia y factibilidad, con el dashboard y el glosario en la zona de alta importancia y alta factibilidad.](/casos/caso-02-priorizacion.jpg "Priorización: importancia y factibilidad.")

**Mapa de afinidad:**
![Mapa de afinidad en dos grupos: falencias técnicas de los informes y desconocimiento o falta de información.](/casos/caso-02-afinidad.jpg "Mapa de afinidad de los hallazgos.")
