<!--
Sync Impact Report
Version change: 1.2.0 → 1.3.0
Modified principles:
- II. Sistema de Diseño: los tokens de color tienen un valor por tema (claro y oscuro)
- IV. Accesibilidad WCAG 2.2 AA: el contraste MUST cumplirse en ambos temas
Added sections: none
Modified sections:
- Contrato de tokens: de "tema claro único" a dos temas; los valores del tema oscuro quedan
  pendientes de la aprobación de su prototipo (principio V)
Removed sections: none
Follow-up TODOs: fijar los valores del tema oscuro tras aprobar el prototipo (tarea T086)
(1.2.0: V. Aprobación previa de interfaz permite prototipos no publicados; el tamaño mínimo de
los controles es una dimensión, no un espacio)
-->

# Portafolio UX/UI Constitution

## Core Principles

### I. Stack Tecnológico

El portafolio MUST implementarse con React y Vite.
Los estilos MUST usar SASS y Tailwind CSS.
SASS MUST definir los tokens y los estilos globales (reset y foco).
Tailwind MUST consumir esos tokens en los componentes y MUST NOT definir
valores propios fuera de ellos.
El control de versiones MUST ser Git.
Reemplazar el framework, el sistema de estilos o el control de versiones
MUST requerir una enmienda de esta constitución.

Rationale: un stack fijo con un solo origen de tokens evita decisiones
locales que rompan el sistema visual.

### II. Sistema de Diseño (Design Tokens)

Los colores, la tipografía y el espaciado MUST definirse una sola vez
como variables CSS y MUST exponerse a Tailwind desde ese mismo origen.
Cada token de color MUST tener un valor para el tema claro y otro para el
tema oscuro, con el mismo nombre; los componentes MUST NOT conocer el tema.
Los valores vigentes están en Contrato de tokens.
El código MUST NOT introducir color, tipo o espacio fuera de esos tokens.
Cambiar un valor del contrato MUST hacerse en el origen central.

Rationale: los tokens son la única fuente de verdad visual. Un cambio
en el origen se propaga a toda la interfaz.

### III. Arquitectura Atomic Design

Los componentes MUST vivir en `src/components/atoms`,
`src/components/molecules`, `src/components/organisms`,
`src/components/templates` y `src/components/pages`.
Los nombres de clases y de componentes MUST ser semánticos: describen
propósito, no apariencia.
Un átomo MUST NOT contener moléculas ni organismos.
Una molécula MUST componerse de átomos.
Un organismo MUST componerse de moléculas y átomos.
Un template MUST definir estructura con organismos y MUST NOT contener
contenido real.
Una page MUST ser un template con contenido real.

Rationale: Atomic Design mantiene la UI componible y revisable, desde el
átomo hasta la página publicada.

### IV. Accesibilidad WCAG 2.2 AA

Todo elemento interactivo MUST operarse por teclado y MUST mostrar un
estado `:focus-visible` visible.
El foco MUST usar el token Focus como anillo de 2px separado del
elemento, para quedar siempre contra el fondo.
ARIA MUST usarse cuando el HTML semántico no baste, y MUST NOT repetir
semántica que el elemento nativo ya expone.
El contraste MUST cumplir WCAG 2.2 nivel AA en el tema claro y en el
tema oscuro, y MUST validarse antes de aprobar una pantalla.
Texto, nombre accesible y estado MUST quedar disponibles para tecnología
de asistencia.

Rationale: el nivel AA es el mínimo no negociable de este portafolio.

### V. Aprobación previa de interfaz

Implementar una pantalla, página o layout visual MUST contar con
aprobación explícita previa del responsable del proyecto.
Si un parámetro de esta constitución no fue entregado, MUST preguntarse
antes de fijarlo en especificación, plan o código.
La propuesta de una pantalla MAY presentarse como prototipo navegable.
Un prototipo MUST vivir bajo la ruta `/prototipos/`, MUST usar solo
contenido de prueba y MUST NOT publicarse ni entrar en el sitemap.
Al aprobarse la pantalla, su prototipo MUST borrarse antes de construir
la versión definitiva.

Rationale: esta constitución fija reglas. Las pantallas se cierran con
el responsable antes de construir; el prototipo sirve para decidir, no
para publicar.

## Contrato de tokens

Dos temas: claro y oscuro. Contraste medido con la fórmula de WCAG 2.2.

Color, tema claro:

| Token | Valor | Uso y contraste |
|---|---|---|
| Background | `#FAFAF9` | Fondo de página |
| Surface | `#FFFFFF` | Superficies elevadas |
| Text | `#1C1917` | Texto principal; 16.7:1 sobre Background |
| Text muted | `#57534E` | Texto secundario; 7.3:1 sobre Background |
| Primary | `#4338CA` | Acción principal; 7.6:1 sobre Background |
| Primary hover | `#3730A3` | Estado al pasar el puntero |
| Primary active | `#312E81` | Estado al presionar |
| Focus | `#0E7490` | Anillo de foco; 5.1:1 sobre Background |
| Error | `#B91C1C` | Feedback de error; 6.2:1 sobre Background |
| Success | `#15803D` | Feedback de éxito; 4.8:1 sobre Background |
| Border | `#D6D3D1` | Divisor decorativo |
| Border strong | `#78716C` | Borde de controles; 4.6:1 sobre Background |

El texto blanco sobre Primary, Primary hover y Primary active MUST
mantener al menos 4.5:1 (7.9:1, 9.9:1 y 11.4:1).
Border MUST NOT usarse como único indicador de un control.

Color, tema oscuro: PENDIENTE. Los 13 tokens llevan los mismos nombres. Sus
valores se proponen en un prototipo y se fijan aquí solo tras la aprobación
del responsable (principio V). Mientras tanto no hay valores vigentes.

Tipografía:

- Titulares: Manrope.
- Texto: Inter.
- Escala modular de ratio 1.25 sobre 16px: 0.8, 1, 1.25, 1.563, 1.953,
  2.441 y 3.052 rem.

Espaciado:

- Unidad base de 8px. 4px está permitido solo como medio paso.
- Todo espacio (margen, relleno y separación) MUST ser 4px o un múltiplo
  de 8px.
- El tamaño mínimo de un control interactivo es una dimensión, no un
  espacio: MUST ser al menos 44×44 px.

## Compuertas de calidad

Antes de implementar una pantalla, el trabajo MUST cumplir todo esto:

1. La pantalla fue descrita y aprobada de forma explícita.
2. Los tokens que usa existen en el Contrato de tokens.
3. La estructura respeta atoms, molecules, organisms, templates y pages.
4. Teclado, `:focus-visible`, ARIA justificado y contraste AA están
   previstos en la propuesta.
5. Las pruebas automatizadas de accesibilidad y de tokens pasan.

Una propuesta que falle cualquiera de estos puntos MUST detenerse y
volver a consulta.

## Governance

Esta constitución prevalece sobre prácticas que la contradigan.
Toda enmienda MUST documentar el cambio, el motivo y el impacto, y
MUST aprobarse por el responsable del proyecto antes de aplicarse.
El versionado MUST seguir SemVer:

- MAJOR: se elimina o se redefine un principio de forma incompatible.
- MINOR: se agrega un principio o se amplía una regla de forma material.
- PATCH: aclaración o corrección sin cambio de norma.

Cada especificación, plan e implementación MUST revisarse contra estos
principios. La guía de desarrollo es `.specify/memory/constitution.md`.

**Version**: 1.3.0 | **Ratified**: 2026-10-07 | **Last Amended**: 2026-10-08
