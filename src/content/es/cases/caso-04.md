---
slug: caso-04-embudo-vacantes
type: product
status: published
order: 2
title: "El embudo de vacantes se traba en las primeras etapas"
seo:
  title: "Embudo de vacantes | Caso de estudio"
  description: "Investigación del embudo de vacantes en un ATS B2B: hasta 20 etapas, más del 50 % se descarta al inicio y el 45 % entra desde el celular."
summary:
  product: "El pipeline por el que pasa quien se postula: hasta 20 etapas, con pruebas médicas, psicológicas y técnicas, y la integración de cada una."
  role: "Diseñadora UX/UI"
  team: "Product Owner, éxito del cliente y desarrollo"
  duration: "2 meses desde diseño"
  keyResult: "Un analista tardaba hasta 10 días, y más del 50 % se descartaba en las dos primeras etapas."
  indexLine: "Hasta 10 días para reunir candidatos, y más del 50 % se descarta al inicio."
  cardLine: "Rediseño y mapeo de casos extremos para un pipeline ATS de 20 etapas. El 50 % se iba en descartes automáticos que el analista no veía."
  cardTags:
    - UX Research
    - Mapas de Flujo
    - ATS
  productType: "B2B / ATS"
  sector: "ATS"
  kind: "Investigación de rediseño"
---

_Los nombres de las empresas y algunos datos se cambiaron por confidencialidad._

![Prototipo de la vacante: filtros a la izquierda, la lista de candidatos al centro y la gestión de talento, con las etapas, a la derecha.](/casos/caso-04-prototipo.jpg "Prototipo final de la vacante.")

## 1. Problema inicial

_Tensión: ¿por qué importaba?_

**Contexto de negocio:** El módulo de vacantes, en una plataforma B2B de reclutamiento, es el embudo. Quien solicita empleo recorre hasta 20 etapas: pruebas médicas, psicológicas y técnicas, y la integración de cada una.

**Problema del usuario:** El día a día de los analistas se trababa. Reunir candidatos podía tomar hasta 10 días. En las dos primeras etapas se descartaba en automático a más del 50 %, por ejemplo de 500 a 200, a menudo por preguntas condicionales mal configuradas. Esos descartes muchas veces pasaban sin que el analista los viera. Al refinar, tampoco sabía dónde había quedado cada persona, porque las subtablas la repartían. Quienes seguían no siempre eran los más aptos, así que dedicaba toda una mañana a buscar entre los descartados para devolverlos a mano. La llave de la base era el correo, no el documento: la misma persona, con correos distintos, aparecía hasta 3 veces. Si alguien se retiraba por cansancio o por una mala experiencia, desaparecía del sistema y la empresa no recibía el motivo.

**Cómo lo sabíamos:** Grupo focal con grandes empresas, observación del embudo, tableros de Power BI y analytics.

**Restricciones:** La complejidad técnica. El módulo depende de varias integraciones, y cada una tiene su versionamiento. Sin el mapa del último caso extremo, desarrollo no podía estimar tiempos ni costos.

**Objetivo y métrica de éxito:** Dar visibilidad y control sobre hasta 20 etapas, y poder pasar a alguien de una etapa a otra que no sea la siguiente, por ejemplo de la 3 a la 15. En móvil, hoy el 45 % del uso y sobre todo en pymes, el refactor busca subir ese 45 % a 55 % en el primer trimestre y bajar un 20 % las quejas por la visualización. Mucha gente no entra por la cantidad de problemas y por la falta de accesibilidad. Los analistas dijeron que, si pudieran, manejarían desde el celular muchos marcos de decisión.

## 2. Investigación y datos

_Descubrimiento: ¿qué no era obvio?_

- **10 días** para reunir candidatos en el embudo
- **50 %** o más se descartaba en las dos primeras etapas
- **45 %** de quienes usan el módulo entra desde el celular

**Métodos:** Grupo focal con grandes empresas y observación de procesos. Se revisaron tableros de Power BI y analytics, y se tomaron como muestra vacantes con alta movilidad. Eso se contrastó con el tiempo que el analista pasaba reuniendo candidatos.

**Muestra:** Analistas de grandes empresas que operan el embudo, y el uso del módulo en pymes, donde se concentra el acceso desde el celular.

**Hallazgos:**

- No sabían cuánto tiempo llevaba alguien detenido en una etapa. Había gráficas en un tablero de analítica, pero no el detalle del día a día.
- El archivo que exportaba la plataforma salía en vertical y no se podía filtrar. Por eso armaban su propia hoja y pasaban los datos a horizontal.
- No había un filtro de veto. Si alguien que ya había sido un problema volvía a postularse y avanzaba, lo buscaban a mano para sacarlo.
- Las pruebas psicométricas bloqueaban el paso de una etapa a la siguiente y atrasaban el proceso varios días. Pedían correr esas evaluaciones en paralelo.

> **Insight que cambió el rumbo:** El embudo no se traba solo por tener 20 etapas. Se traba porque el analista no ve cuánto lleva alguien en una etapa, no puede filtrar lo que exporta y tiene que buscar a mano a quien no debió avanzar.

## 3. Arquitectura de la solución

_Decisión: ¿qué elegiste y qué descartaste?_

**Decisiones clave:** El primer enfoque fue un tablero kanban, como los de Jira o Azure. No sirvió: la cantidad de datos no cabía en esa vista y, sobre todo, el trabajo de los analistas sigue los hábitos que ya tienen en LinkedIn. Como ese tablero no se aprobó, se diseñó una vista más cercana a LinkedIn. Los filtros quedan a la derecha y siempre a la vista. Las fichas, o la tabla, son más compactas y muestran solo lo relevante. La selección funciona como en Salesforce. Las etapas eran el mayor dolor porque estaban arriba. Ahora se ven, y el analista elige a una persona y la envía arrastrando el componente. Quien no fue elegido queda en un solo lugar. Los descartes automáticos quedan a la vista, para no caer en un error de capa 8. Pasar a alguien de una etapa a otra que no es la siguiente, por ejemplo de la 3 a la 15, ya está en el producto y sigue en proceso.

**Colaboración con ingeniería:** Desarrollo no estimaba tiempos ni costos hasta que diseño mapeara el último caso extremo. Cada integración tenía su propio versionamiento. Sin ese mapa, la viabilidad no cerraba.

**Validación:** Hubo una validación temprana con analistas de 8 empresas y con los comerciales internos, que son quienes venden el producto. Se mostró cada funcionalidad y cada integración. Sirvió porque, entre todos, vieron cómo operaba cada empresa y cerraron con un visto bueno de los procesos macro: filtros, datos visibles e integraciones. Aun así, hace falta una entrega temprana con inteligencia artificial para evitar errores y para revisar la movilidad y las capas de las integraciones que quizá no salieron en esas pruebas.

## 4. Resultados y aprendizajes

_Impacto y reflexión_

**Lo que no funcionó:** Durante mucho tiempo se construyeron soluciones a medida. Había subtableros para las personas descartadas o eliminadas. Por eso el analista casi no podía ver, en un solo lugar, cómo iban sus vacantes: tenía que entrar etapa por etapa. Lo urgente era estandarizar, para dejar atrás los versionamientos viejos.

**Lo que haría distinto:** A partir de ahí abrí espacios con soporte, comerciales y empresas, para reaccionar antes y no cuando el problema ya estaba encima, y para conectar lo que las empresas necesitaban con nuevas funcionalidades.

## 5. Apoyo visual

_Evidencia visual_

![Tabla del embudo antes del rediseño: etapas de sugeridos, candidatos, preseleccionados y contratados, con columnas de fecha de postulación, perfil, estudios, edad, género, salario, experiencia e idiomas.](/casos/caso-04-antes.png "Antes")
![Vista del embudo después del rediseño: filtros a la izquierda, lista de candidatos al centro y gestión de talento y de etapas a la derecha.](/casos/caso-04-despues.jpg "Después")

**Vista móvil:**

![Lista móvil de candidatos para Auxiliar de empaque: cada ficha muestra ciudad, documento, estado de la aplicación, match, fecha, completitud y experiencia. Abajo, la barra para cambiar de etapa.](/casos/caso-04-movil.png "Vista móvil del embudo.")
