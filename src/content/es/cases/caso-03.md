---
slug: caso-03-catalogo-candidatos
type: product
status: published
order: 3
title: "Búsqueda de talento en un catálogo de 50.000 perfiles"
seo:
  title: "Catálogo de candidatos | Caso de estudio"
  description: "Rediseño de la búsqueda en frío en un catálogo B2B de 50.000 perfiles, para que el reclutador filtre sin repetir la tarea ni exportar la lista."
summary:
  product: "Una tabla densa y un solo prompt, para que el reclutador encuentre talento sin digitar cédula por cédula."
  role: "Product Designer, UX/UI Lead B2B"
  team: "Éxito del cliente y gestión de producto"
  duration: "Tercer trimestre de 2026"
  keyResult: "La búsqueda pasó de 8 a 3 clics, sin digitar documento por documento ni exportar la lista."
  indexLine: "De 8 a 3 clics para buscar talento en un catálogo de 50.000 perfiles."
  productType: "B2B / ATS"
  sector: "ATS"
  kind: "Investigación y diseño de interfaz"
---

_Los nombres de las empresas y algunos datos se anonimizaron y se modificaron por confidencialidad._

## 1. Problema inicial

_Tensión: ¿por qué importaba?_

**Contexto de negocio:** El catálogo de candidatos es la base de una plataforma B2B de reclutamiento. Las empresas buscan talento entre 50.000 perfiles, muchas veces en frío: sin que la persona se haya postulado a esa vacante.

**Problema del usuario:** Esa búsqueda no estaba afinada y la fricción aportaba al retiro de 3 empresas Enterprise cada mes. Para revisar a alguien, el analista digitaba la cédula una por una. No podía guardar los filtros de los cargos operativos que se repiten, así que armaba la misma búsqueda desde cero. Como no veía los datos clave juntos, exportaba la lista a una hoja de cálculo para bloquear perfiles vetados y cruzar ciudad, experiencia y aspiración salarial.

**Cómo lo sabíamos:** El tiempo de permanencia en escritorio y en móvil, cruzado con NPS, CSAT y CES, y el retiro mensual de esas tres cuentas.

**Restricciones:** El trabajo estaba previsto para el tercer trimestre de 2026 y competía con la deuda técnica de otros productos B2B. Hubo que sustentarlo ante dirección, gestión de producto, éxito del cliente y el liderazgo de desarrollo para que entrara al trimestre.

**Objetivo y métrica de éxito:** Bajar el tiempo de búsqueda, hacer visible el talento y parametrizar con inteligencia artificial, atacando las causas del abandono. En la prueba, la tarea debía resolverse en menos clics que en el sistema anterior.

## 2. Investigación y datos

_Descubrimiento: ¿qué no era obvio?_

- **50.000** perfiles disponibles en el catálogo
- **7** empresas en el grupo focal, las de mayor ingreso
- **3** empresas Enterprise que se iban cada mes

**Métodos:** Análisis mixto. En lo cuantitativo, tiempo de permanencia en escritorio y móvil, cruzado con NPS, CSAT y CES. En lo cualitativo, un grupo focal. Los hallazgos se ordenaron por dificultad técnica y frecuencia de uso.

**Muestra:** Las 7 empresas que más ingreso generan, con reclutadores que buscan cargos de alta rotación.

**Hallazgos:**

- El modelo mental estaba anclado en el buscador profesional que ya usaban a diario.
- No podían pedir perfiles parecidos de forma automática para los cargos que se repiten.
- Para decidir si alguien servía, les bastaban ciudad, estudios, palabras clave, aspiración salarial y documento, sin abrir la hoja de vida.
- Las necesidades estaban sueltas en el roadmap. Se agruparon para unir el desarrollo y entregar por MVP.

> **Insight que cambió el rumbo:** El reclutador no quiere otra forma de ver personas: quiere buscar como ya busca, y decidir con unos pocos datos. Si tiene que abrir cada hoja de vida, la búsqueda en frío no cierra.

## 3. Arquitectura de la solución

_Decisión: ¿qué elegiste y qué descartaste?_

- **Tabla densa:** Nombre, perfil, fecha, edad, ciudad, salario\
  Vista principal del catálogo
- **Un solo prompt:** La descripción se vuelve filtros\
  Categoría, experiencia y salario

**Decisiones clave:** Se descartó una vista de tarjetas. Con tantos perfiles, la lectura masiva pide una tabla densa, como en el buscador de referencia y en un CRM de datos masivos. También se descartó un chat continuo para ir afinando el perfil: mantener la conversación por API salía demasiado caro y las empresas no iban a pagar ese sobrecosto. Quedó un solo prompt por búsqueda, en una sola transacción.

**Sistema y componentes:** Un panel a la izquierda recibe la descripción en lenguaje natural —por ejemplo, un liderazgo técnico con cinco años y ciertos lenguajes— y la traduce a filtros de categoría laboral, tiempo de experiencia y rango salarial. La tabla muestra nombre y fotografía, porcentaje de perfil, fecha de actualización, edad, localización, salario, último empleo y un indicador de coincidencia de palabras clave. Cada fila tiene un selector para actuar sobre varios perfiles sin cambiar de pantalla.

**Colaboración con ingeniería:** El chat continuo se revisó con desarrollo en el prototipo. El costo de sostener la conversación lo hacía inviable. La búsqueda en una sola transacción fue la forma que cerraba en costo y en utilidad.

**Validación:** Pruebas de usabilidad comparadas con el sistema anterior. Los reclutadores encontraron y usaron las opciones frecuentes con más agilidad. La tarea de búsqueda pasó de 8 a 3 clics.

## 4. Resultados y aprendizajes

_Impacto y reflexión_

**Resultados:** En la prueba comparativa, la búsqueda bajó de 8 a 3 clics y las opciones frecuentes se usaron con más agilidad. _Por completar: efecto en el retiro de cuentas después del lanzamiento._

**Lo que no funcionó:** El chat continuo, parecido a ir refinando el perfil en una conversación, no cerró. El costo de la API era prohibitivo y las empresas no iban a absorberlo.

**Lo que haría distinto:** Mediría el costo de cada búsqueda antes de prototipar el chat. Un solo prompt robusto alcanza para parametrizar, y el costo sí cierra.

**Siguientes pasos:** _Por completar · siguientes MVP del catálogo y métricas de abandono a medir._

## 5. Apoyo visual

_Evidencia visual_

**Búsqueda con IA:**
![Catálogo de candidatos: a la izquierda, búsqueda con IA que arma filtros desde una descripción; a la derecha, la tabla con porcentaje de perfil, ubicación, salario y último empleo.](/casos/caso-03-busqueda.png "Búsqueda con IA del catálogo.")

**Tabla de candidatos:**
![Tabla de resultados de la búsqueda con IA, con columnas de nombre, porcentaje de perfil, actualización, edad, localización, salario, último empleo y coincidencia de palabras clave, y un panel para personalizar la búsqueda.](/casos/caso-03-tabla.png "Tabla de candidatos de la búsqueda con IA.")

**Wireframes:** _Por completar · imagen aquí._

**Grupo focal:**
![Grupo focal alrededor de una mesa, con portátiles y fichas de colores para priorizar.](/casos/caso-03-grupo-focal.jpg "Grupo focal del catálogo.")
