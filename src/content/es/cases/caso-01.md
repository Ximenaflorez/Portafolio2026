---
slug: caso-01-microcredito-tiendas
type: product
status: published
order: 5
title: "Microcrédito en tiendas de barrio para familias colombianas"
seo:
  title: "Microcréditos en tiendas de barrio | Caso de estudio"
  description: "Investigación sobre la viabilidad de microcréditos para alimentos en tiendas de barrio, para familias colombianas."
summary:
  product: "Un modelo de «apuntado» o fiado digital para compras de alimentos, pensado como ajuste de fin de mes en la tienda de confianza."
  role: "UX Researcher / Product Designer"
  team: "Producto e investigación"
  duration: "2 meses en enero de 2024"
  keyResult: "Las familias gastan 47,3 % en alimentos pero solo asignan 31,5 %: necesitan crédito a fin de mes."
  indexLine: "Validación de crédito para alimentación en el canal tradicional y tiendas de barrio."
  productType: "B2B2C / Fintech"
  sector: "Fintech"
  tags:
    - "Investigación"
  kind: "Investigación de viabilidad"
---

*Los nombres de las empresas y algunos datos se anonimizaron y se modificaron por confidencialidad.*

## 1. Problema inicial

*Tensión: ¿por qué importaba?*

**Contexto de negocio:** Una fintech de crédito de consumo quería evaluar crédito para alimentos en tiendas de barrio. Las tiendas son el lugar predilecto de compra (35,3 %), pero los tenderos —el 70 % gana un salario mínimo— cada vez fían menos.

**Problema del usuario:** Hogares de clase media (~2,95 personas, ingresos de 1 a 2 millones) asignan 31,52 % del salario a alimentos, pero la canasta exige 47,30 %. El efectivo no alcanza el mes.

**Cómo lo sabíamos:** Un estudio de gasto (oct. 2023) mostró que el 20 % de los gastos ya venía de créditos. Los tenderos reportaban más necesidad de fiar y retornos cada vez más tardíos.

**Restricciones:** El negocio es relacional (confianza 27,1 %, satisfacción 25 %, lealtad 24,1 %). Márgenes bajos y fricción al cobrar intereses por alimentos básicos.

**Objetivo y métrica de éxito:** Definir viabilidad de dos productos —«apuntado digital» y «fiado electrónico»— con un sobrecosto tolerable para quien compra (~4,17 %).

## 2. Investigación y datos

*Descubrimiento: ¿qué no era obvio?*

- **31,5 %** del presupuesto asignado a alimentos
- **47,3 %** lo que realmente exige la canasta básica
- **20 %** de los gastos del hogar ya se financia con crédito

**Métodos:** Revisión de gasto de hogares y análisis del canal tradicional: fiado, márgenes y competencia con hard discount.

**Muestra:** Hogares de clase media y tenderos del canal tradicional.

**Hallazgos:**

- El apuntado digital cubre el «ajuste» de fin de mes cuando suben los alimentos.
- Se mantiene cerca del 20 % ya financiado, sin superar la capacidad de pago.
- Abre historial crediticio a millennials y centennials sin score.
- El fiado de palabra exige tiempo y confianza; el desplazamiento lo dificulta.
- Para la tienda, ceder el fiado asegura caja y quita el riesgo de impago.

> **Insight que cambió el rumbo:** El producto no reemplaza la canasta: entra como ajuste de fin de mes. La tienda lo adopta si el riesgo pasa a un tercero que garantiza monto y plazo.

## 3. Arquitectura de la solución

*Decisión: ¿qué elegiste y qué descartaste?*

- **Apuntado digital:** $10.000 – $100.000\
  30 días · compras chicas y rotativas
- **Fiado electrónico:** $150.000 – $1.000.000\
  60 días · compra completa en minimercado

**Decisiones clave:** Dos modalidades en lugar de un crédito genérico: rangos, plazos y motivos no coinciden. Se descartó un monto único.

**Sistema y componentes:** Reusar el sistema de créditos existente e incorporar las nuevas modalidades al portafolio.

**Validación:** Deseabilidad (31,52 % vs 47,30 %), factibilidad (reuso del sistema) y viabilidad (~4 % de sobrecosto). *Por completar: pruebas con personas.*

## 4. Resultados y aprendizajes

*Impacto y reflexión*

**Resultados:** El modelo resultó deseable, factible y viable: cubre el ajuste de fin de mes, se monta sobre el sistema actual y la tienda recupera el préstamo en un plazo fijo. La investigación abrió una prueba piloto de 100 millones de pesos para leer cómo se comporta quien fía alimentos, distinto de quien fía mercancía.

## 5. Apoyo visual

*Evidencia visual*

![Tendero con delantal y un cliente en una tienda de barrio, junto a un letrero que ofrece crédito para el negocio.](/casos/caso-01.jpg "Crédito en el canal tradicional: la tienda de barrio.")

![Gráfico de RADDAR del pocketshare en Colombia en octubre de 2023: alimentos para el hogar ocupan 31,52 % de cada 100 pesos.](/casos/caso-01-canasta.png "El 31,52 % del salario se va en alimentos (salario mínimo de $403.000) y no alcanza para la canasta del grupo familiar.")

![Gráfico de RADDAR de octubre de 2023: barras de participación del gasto del hogar en salario y rentas, crédito y remesas, y la línea anual de esas tres fuentes.](/casos/caso-01-fuentes.png "En octubre de 2023, el 20 % del gasto del hogar venía de crédito y el 75,45 % de salario y renta. Fuente: RADDAR, Gastometría.")

![Tabla del gasto familiar frente al salario mínimo: el hogar destina 31,52 % del salario a alimentos y la canasta exige 47,30 %, con un sobrecosto de 4,17 %.](/casos/caso-01-salario.png "Frente al salario mínimo, el 31,52 % del salario va a alimentos, pero la canasta exige 47,30 %.")

![Lámina con dos preguntas de negocio: por qué quien compra aceptaría intereses y un aval, y por qué la tienda dejaría de fiar en efectivo.](/casos/caso-01-negocio.png "Qué queremos responder como negocio: el crédito como ajuste de fin de mes, y la tienda cede el fiado si un tercero garantiza el retorno.")
