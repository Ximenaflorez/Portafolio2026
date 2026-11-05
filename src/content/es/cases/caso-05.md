---
slug: caso-05-orquestador-reglas
type: product
status: published
order: 1
featured: true
title: "Orquestador de métricas y feedback cualitativo con IA"
seo:
  title: "Métricas y feedback con IA | Caso de estudio"
  description: "El cierre mensual de un ATS B2B agrupa las quejas y calcula las métricas con un tope de 3 USD. La decisión sigue en una persona."
summary:
  product: "Un cierre mensual para un ATS B2B: agrupa las quejas, calcula las métricas y deja la decisión en una persona, con un tope de gasto que el modelo no puede saltarse."
  role: "Líder UX, Technical Product Designer"
  team: "Liderazgo UX e ingeniería (simulada)"
  duration: "Cuarto trimestre de 2026"
  keyResult: "El cierre pasó de hacerse a mano a un ciclo de menos de 3 minutos, con un tope de 3 USD y ningún ticket creado sin una persona."
  indexLine: "De un cierre a mano a un ciclo de menos de 3 minutos y 3 USD."
  productType: "B2B / ATS"
  sector: "Spec-Driven Development"
  kind: "Diseño con spec y decisión humana"
  screenUrl: "https://ximenaflorez.github.io/orquestador/"
  specUrl: "https://github.com/Ximenaflorez/orquestador"
---

_Los nombres de las empresas y algunos datos se anonimizaron y se modificaron por confidencialidad._

![Métricas UX del mes: carga del Excel, CSAT y CES de creación de vacantes, catálogo y gestión de vacantes, en julio y agosto de 2026, con el total y cuántas personas evaluaron.](/casos/caso-05-metricas.png "Métricas UX del mes: CSAT y CES por módulo.")

## 1. Problema inicial

_Tensión: ¿por qué importaba?_

**Contexto de negocio:** Cada mes, la operación de un ATS B2B entrega un Excel con la satisfacción (CSAT), el esfuerzo (CES) y decenas de comentarios. De ahí sale lo que el comité usa para decidir qué dolores atender.

**Problema del usuario:** Como Líder UX, la consolidación del reporte mensual dependía enteramente de mi gestión manual. Utilizaba hojas de cálculo con fórmulas paramétricas y me apoyaba en NotebookLM para explorar el feedback cualitativo. Sin embargo, el gran cuello de botella era la ingesta de datos: se hacía a mano, sección por sección. El análisis consumía horas de trabajo operativo para poder tipificar la información y poder entregar un backlog estructurado y accionable al Product Manager (PM).

**Cómo lo sabíamos:** Toda la información cualitativa llegaba a través de un input abierto, provocando que el mismo dolor se escribiera de mil formas distintas (ej. «La pantalla se queda en blanco» vs. «Se queda en blanco la pantalla»). Sabíamos que para estandarizar esto necesitábamos la misma lógica de correlación de datos que hace tan potente a NotebookLM: los embeddings.

**Restricciones:** El trabajo empezó por escrito, antes de la pantalla. La corrida no crea tickets: Jira solo se abre a mano, y solo desde lo que ya se decidió conservar. El modelo no calcula cifras ni elige el color de la alerta; eso lo hace el programa. Cada corrida tiene un tope de 3 USD y debe salir en menos de 3 minutos. Si el gasto llega al tope, se detiene y el resto vuelve a una persona. Si falta una pestaña o el mes no cuadra, no hay reporte oficial: llega un aviso. El Excel de entrada queda intacto.

**Objetivo y métrica de éxito:** La tabla de métricas y la lista tipificada salen en menos de 3 minutos. Al menos el 85 % de los comentarios queda con etiqueta y módulo correctos, sin que yo los corrija.

## 2. Investigación

_Descubrimiento: ¿qué no era obvio?_

**Métodos:** Antes de elegir herramientas, separé qué parte del cierre es una cuenta y qué parte pide lectura. Los promedios se pueden rehacer: una muestra del 10 % de los puntajes tiene que dar el mismo CSAT y el mismo CES si alguien los calcula otra vez a mano.

**Muestra:** El Excel real no entra al repositorio. Las pruebas usan libros ficticios de julio, agosto y septiembre. Cada tasa sale del libro de ese mes.

**Hallazgos:**

- CSAT, CES y el color de la alerta los calcula el programa. El modelo no escribe cifras.
- Lo que pide lectura es la queja: de qué tipo es y a qué parte del producto pertenece. Si la confianza baja del 70 %, no se le pone una etiqueta a la fuerza. Queda para que lo vea una persona.
- Si el modelo decide solo, las dos frases del ejemplo pueden caer en el mismo grupo o en dos, según el día.

> **Insight que cambió el rumbo:** Trabajar con IA, aquí, fue escribir reglas que el modelo no puede cambiar. Solo agrupa comentarios si el Excel de entrada está completo. La pantalla muestra lo que esa corrida ya guardó.

## 3. Arquitectura de la solución

_Decisión: ¿qué elegiste y qué descartaste?_

**Decisiones clave:** El orden fue constitución, especificación, plan, tareas y, solo entonces, implementación. Cuatro controles se revisan en cada cambio: compuerta humana, taxonomía cerrada, registro de auditoría y apagado. Sin auditoría, el hallazgo no puede ir al tablero. Si apago el ciclo, el reporte sale de la bandeja del comité y el Excel queda intacto para seguir a mano. Se descartó un chat entre varios agentes, pedirle los promedios al modelo, y usar un cuaderno de notas o el plan de pago del chat como motor: la corrida necesita una API que pueda llamar, cortar y contar.

**Sistema y componentes:** El ciclo es un grafo de cinco pasos: ingesta, métricas, voz del cliente, reporte y compuerta. Las frases cuya similitud de coseno llega a 0,85 forman un hallazgo. En esta máquina esa comparación sale de Gemini, modelo gemini-embedding-001. El título resume, en dos líneas como máximo. Cada comentario original, ya anonimizado, se conserva, y el conteo lo hace el programa. En la pantalla hay cuatro bandejas, y son estados de una decisión:

- **Guardar el mes.** Todavía no hay decisión. Se queda o se va.
- **Tipificados.** Se queda, y todavía no tiene clave. Solo aquí aparece Enviar a Jira.
- **Backlog.** Ya tiene clave.
- **Excluidos.** Se va, y se conserva como descarte. No se borra.

**Colaboración con ingeniería:** Soy la Líder UX. Dejé las reglas escritas antes de la pantalla, uso el cierre y abro Jira a mano. La ingeniería de este corte es simulada: el código solo se escribió después de un sí, y solo dentro de lo que esas reglas ya habían cerrado.

**Validación:** Con el libro de julio leo el reporte sin abrir las pestañas. Si el archivo está incompleto, hay un aviso y no hay reporte oficial. Si un comentario baja del 70 %, entra a la cola y no nace un ticket.

## 4. Resultados y aprendizajes

_Impacto y reflexión_

**Resultados:** En los meses de prueba el ciclo cabe en menos de 3 minutos y en 3 USD. Al menos el 85 % de los comentarios queda con etiqueta y módulo correctos, sin que yo los corrija. `listo_para_comite` pide además que la tasa de finalización sea de al menos 85 %. Cerrar la cola a mano no enciende esa bandera. Los hallazgos que llegan al comité traen el comentario anonimizado y el motivo. Ninguna corrida crea tickets por su cuenta. _Por completar · la cifra del Excel real, que no entra al repositorio._

**Lo que no funcionó:** La pantalla estuvo a punto de pedirle al modelo una lectura nueva cada vez que alguien quería ver el comentario. El gasto se habría ido a la consulta, no al cierre.

**Lo que haría distinto:** Dejaría el umbral 0,85 como decisión visible en la interfaz, no solo en la configuración. Quien recluta o lidera diseño necesita ver que el agrupado es una regla, no un gusto del modelo.

![Métricas UX del mes: carga del Excel, CSAT y CES de creación de vacantes, catálogo y gestión de vacantes, en julio y agosto de 2026, con el total y cuántas personas evaluaron.](/casos/caso-05-metricas.png "Métricas UX del mes: CSAT y CES por módulo.")

![Hallazgos del mes en julio de 2026: síntesis, módulo, etiqueta, criticidad y veces que se repite, con Se queda y Se va.](/casos/caso-05-hallazgos.png "Hallazgos del mes: Se queda o Se va.")

_La página pública es de solo lectura. Subir el Excel, guardar Se queda o Se va y enviar a Jira corren en un servidor privado, con el programa de Python, las credenciales de Jira y los archivos del mes. En una URL pública esas claves quedarían expuestas, y cualquiera podría cambiar los datos o crear tickets._
