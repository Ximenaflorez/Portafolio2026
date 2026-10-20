---
slug: caso-04-embudo-vacantes
type: product
status: published
order: 4
title: "El embudo de vacantes se traba en las primeras etapas"
seo:
  title: "Embudo de vacantes | Caso de estudio"
  description: "Investigación del embudo de vacantes en un ATS B2B: hasta 20 etapas, más del 50 % se descarta al inicio y el 45 % entra desde el celular."
summary:
  product: "El pipeline donde quien se postula recorre hasta 20 etapas, con pruebas médicas, psicológicas, técnicas y sus integraciones."
  role: "Diseñadora UX/UI"
  team: "Product Owner, éxito del cliente y desarrollo"
  duration: "Por completar"
  keyResult: "Un analista tardaba hasta 10 días, y más del 50 % se descartaba en las dos primeras etapas."
  indexLine: "Hasta 10 días para reunir candidatos, y más del 50 % se descarta al inicio."
  productType: "B2B / ATS"
  sector: "ATS"
  kind: "Investigación de rediseño"
---

_Los nombres de las empresas y algunos datos se anonimizaron y se modificaron por confidencialidad._

## 1. Problema inicial

_Tensión: ¿por qué importaba?_

**Contexto de negocio:** El módulo de vacantes de una plataforma B2B de reclutamiento es el embudo. Quien solicita empleo pasa por una evaluación de hasta 20 etapas: pruebas médicas, psicológicas, técnicas y las integraciones de cada una.

**Problema del usuario:** El día a día de los analistas se trababa. Reunir candidatos podía tomar hasta 10 días. En las dos primeras etapas se descartaba automáticamente a más del 50 % —por ejemplo, de 500 a 200—, a menudo por preguntas condicionales mal configuradas. Como quienes quedaban no siempre eran los más aptos, el analista pasaba toda una mañana buscando entre los descartados para devolverlos a mano. Además, la llave de la base era el correo y no el documento de identidad: la misma persona, con correos distintos, aparecía hasta 3 veces. Si alguien se retiraba por cansancio o por una mala experiencia, desaparecía del sistema. La empresa no recibía el motivo.

**Cómo lo sabíamos:** Grupo focal con grandes empresas y observación de cómo operaban el embudo.

**Restricciones:** La complejidad técnica. El módulo depende de varias integraciones, cada una con su versionamiento. Sin el mapa del último caso extremo, desarrollo no estimaba tiempos ni costos.

**Objetivo y métrica de éxito:** Dar visibilidad y control a un proceso de hasta 20 etapas, y poder pasar a alguien de una etapa a otra que no sea la siguiente, por ejemplo de la 3 a la 15. En móvil —hoy el 45 % del uso, sobre todo pymes— la hipótesis era llegar al 55 % en el primer trimestre y bajar un 20 % a quienes se quejaban de la visualización.

## 2. Investigación y datos

_Descubrimiento: ¿qué no era obvio?_

- **10 días** para reunir candidatos en el embudo
- **50 %** o más se descartaba en las dos primeras etapas
- **45 %** de quienes usan el módulo entra desde el celular

**Métodos:** Grupo focal con grandes empresas y observación de procesos. Se contrastó con el tiempo que el analista pasaba reuniendo candidatos y con el uso en escritorio y en móvil.

**Muestra:** Analistas de grandes empresas que operan el embudo, y el uso del módulo en pymes, que concentran el acceso desde el celular.

**Hallazgos:**

- No sabían cuánto tiempo llevaba alguien estancado en una etapa. Tenían gráficas en un tablero de analítica, pero no el detalle del día a día.
- El archivo que exportaba la plataforma salía en vertical. No se podía filtrar, así que armaban su propia hoja de cálculo para poner los datos en horizontal.
- No había un filtro de veto. Si alguien que ya había sido problemático volvía a postularse y avanzaba, lo buscaban a mano para sacarlo.
- Las pruebas psicométricas bloqueaban etapa por etapa y atrasaban el proceso varios días. Pedían correr esas evaluaciones en paralelo.

> **Insight que cambió el rumbo:** El embudo no se traba solo por tener 20 etapas. Se traba porque el analista no ve cuánto lleva alguien en una etapa, no puede filtrar lo que exporta y tiene que cazar a mano a quien no debió avanzar.

## 3. Arquitectura de la solución

_Decisión: ¿qué elegiste y qué descartaste?_

**Decisiones clave:** _Por completar · cómo se pasó a alguien entre etapas no consecutivas y qué enfoque se descartó._

**Sistema y componentes:** _Por completar · etapas, movilidad, vista móvil e integraciones._

**Colaboración con ingeniería:** Desarrollo no estimaba tiempos ni costos hasta que diseño mapeara el último caso extremo. Cada integración tenía su propio versionamiento, y sin ese mapa la viabilidad no cerraba.

**Validación:** _Por completar · pruebas del rediseño con analistas._

## 4. Resultados y aprendizajes

_Impacto y reflexión_

**Resultados:** _Por completar · efecto en el tiempo de recolección, en los descartes y en el uso móvil._

**Lo que no funcionó:** _Por completar · qué hipótesis del rediseño fallaron o qué hubo que corregir._

**Lo que haría distinto:** _Por completar · tu reflexión como diseñadora._

**Siguientes pasos:** _Por completar · piloto, métricas de móvil y de tiempo en cada etapa._

## 5. Apoyo visual

_Evidencia visual_

**Visual refactorización:**
![Vista refactorizada del embudo: filtros a la izquierda, lista de candidatos al centro y, a la derecha, gestión de talento y de etapas.](/casos/caso-04-refactor.png "Visual de la refactorización.")

**Versión antes de la refactor e investigación:**
![Tabla del embudo antes del rediseño: etapas de sugeridos, candidatos, preseleccionados y contratados, con columnas de fecha de postulación, perfil, estudios, edad, género, salario, experiencia e idiomas.](/casos/caso-04-antes.png "Versión del embudo antes de la refactor e investigación.")

**Vista móvil:** _Por completar · imagen aquí._

**Gestión individual por candidato desktop:**
![Perfil de un candidato en escritorio: datos personales a la izquierda, hoja de vida y video al centro, y notificaciones y etapas a la derecha.](/casos/caso-04-candidato.png "Gestión individual del candidato en escritorio.")
