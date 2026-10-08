# Contract: Tokens de diseño

Fuente de verdad: Contrato de tokens de `.specify/memory/constitution.md` (v1.3.0).
SASS los emite como variables CSS en `:root`. Tailwind los lee y **reemplaza** su tema por defecto
para color, tipografía y espaciado, así que esas utilidades no existen fuera de estos tokens.

## Color

La tabla da los valores del **tema claro**. Los 13 tokens existen también en el **tema oscuro**, con
el mismo nombre, la misma variable y la misma clase de Tailwind; solo cambia el valor (ver Temas).

| Token | Variable CSS | Canales RGB | Clase Tailwind |
|---|---|---|---|
| Background | `--color-background` | `250 250 249` | `bg-background` |
| Surface | `--color-surface` | `255 255 255` | `bg-surface` |
| Text | `--color-text` | `28 25 23` | `text-text` |
| Text muted | `--color-text-muted` | `87 83 78` | `text-text-muted` |
| Primary | `--color-primary` | `67 56 202` | `bg-primary`, `text-primary` |
| Primary hover | `--color-primary-hover` | `55 48 163` | `hover:bg-primary-hover` |
| Primary active | `--color-primary-active` | `49 46 129` | `active:bg-primary-active` |
| Focus | `--color-focus` | `14 116 144` | uso global en `:focus-visible` |
| Error | `--color-error` | `185 28 28` | `text-error` |
| Success | `--color-success` | `21 128 61` | `text-success` |
| Border | `--color-border` | `214 211 209` | `border-border` |
| Border strong | `--color-border-strong` | `120 113 108` | `border-border-strong` |
| Sobre Primary | `--color-on-primary` | `255 255 255` | `text-on-primary` |

Valor en Tailwind: `rgb(var(--color-<token>) / <alpha-value>)`.

### Parejas de contraste que la prueba de tokens MUST medir

| Primer plano | Fondo | Mínimo |
|---|---|---|
| Text, Text muted, Primary, Error, Success | Background y Surface | 4.5:1 |
| On primary | Primary, Primary hover, Primary active | 4.5:1 |
| Focus, Border strong | Background y Surface | 3:1 |

Las mismas parejas se miden **en cada tema** (FR-037, SC-008).

## Temas (FR-036, FR-037)

SASS emite cada token de color dos veces; los componentes nunca conocen el tema.

| Selector | Tema |
|---|---|
| `:root` | Claro (valores de la tabla de Color); también cuando se elige claro con el botón, con `data-theme="light"` |
| `@media (prefers-color-scheme: dark)` sobre `:root:not([data-theme="light"])` | Oscuro, si la persona no eligió tema |
| `:root[data-theme="dark"]` | Oscuro, elegido con el botón |

- `color-scheme` vale `light` en `:root` y `dark` en los dos selectores oscuros, para que los
  controles nativos y las barras sigan el tema que se ve (no el del sistema cuando se eligió otro).
- La elección con el botón se guarda en `localStorage` (clave `theme`) y se aplica con un script
  mínimo en línea en `<head>`, antes de pintar, para que no haya destello del tema equivocado.
  Sin JavaScript manda la preferencia del sistema.
- Cambiar de tema no se anima: `transition` de color queda en `0ms` al cambiar de tema.

### Valores del tema oscuro (aprobados el 2026-10-08, tarea T086)

| Token | Canales RGB | Hex |
|---|---|---|
| Background | `12 10 9` | `#0C0A09` |
| Surface | `28 25 23` | `#1C1917` |
| Text | `250 250 249` | `#FAFAF9` |
| Text muted | `168 162 158` | `#A8A29E` |
| Primary | `165 180 252` | `#A5B4FC` |
| Primary hover | `199 210 254` | `#C7D2FE` |
| Primary active | `224 231 255` | `#E0E7FF` |
| Sobre Primary | `30 27 75` | `#1E1B4B` |
| Focus | `34 211 238` | `#22D3EE` |
| Error | `252 165 165` | `#FCA5A5` |
| Success | `134 239 172` | `#86EFAC` |
| Border | `68 64 60` | `#44403C` |
| Border strong | `120 113 108` | `#78716C` |

## Tipografía

| Token | Variable CSS | Valor | Clase Tailwind |
|---|---|---|---|
| Familia titulares | `--font-heading` | Manrope, sans-serif de sistema | `font-heading` |
| Familia texto | `--font-body` | Inter, sans-serif de sistema | `font-body` |
| Paso -1 | `--text-step--1` | `0.8rem` | `text-sm` |
| Paso 0 | `--text-step-0` | `1rem` | `text-base` |
| Paso 1 | `--text-step-1` | `1.25rem` | `text-lg` |
| Paso 2 | `--text-step-2` | `1.563rem` | `text-xl` |
| Paso 3 | `--text-step-3` | `1.953rem` | `text-2xl` |
| Paso 4 | `--text-step-4` | `2.441rem` | `text-3xl` |
| Paso 5 | `--text-step-5` | `3.052rem` | `text-4xl` |

El tamaño se expresa en `rem` para respetar la ampliación de texto al 200% (SC-005).

| Token | Variable CSS | Valor | Clase Tailwind |
|---|---|---|---|
| Peso texto | `--weight-body` | `400` | `font-normal` |
| Peso texto con énfasis | `--weight-body-strong` | `600` | `font-semibold` |
| Peso titulares | `--weight-heading` | `700` | `font-bold` |
| Peso titulares secundario | `--weight-heading-soft` | `600` | `font-semibold` |
| Interlineado texto | `--leading-body` | `1.5` | `leading-body` |
| Interlineado titulares | `--leading-heading` | `1.2` | `leading-heading` |

Pesos cargados (aprobados): Inter 400 y 600, Manrope 600 y 700.

## Espaciado

Unidad base de 8px. En este proyecto la clave `1` de Tailwind vale 8px (en Tailwind por defecto
vale 4px).

| Clase | Valor |
|---|---|
| `0` | `0` |
| `0.5` | `4px` (medio paso) |
| `1` | `8px` |
| `2` | `16px` |
| `3` | `24px` |
| `4` | `32px` |
| `5` | `40px` |
| `6` | `48px` |
| `8` | `64px` |
| `10` | `80px` |
| `12` | `96px` |
| `16` | `128px` |

## Movimiento

| Token | Variable CSS | Valor |
|---|---|---|
| Duración de estado | `--duration-state` | `200ms`; `0ms` con `prefers-reduced-motion: reduce` |

Solo se animan cambios de estado (puntero, presión, foco). No hay animaciones de aparición,
de scroll ni en bucle (FR-029).

## Tamaño de objetivo

| Token | Variable CSS | Valor |
|---|---|---|
| Objetivo mínimo | `--target-min` | `44px` (FR-027) |
| Indicador de página actual | `--indicator-width` | `3px`, subrayado en Primary con texto semibold |
| Borde de botón | `--control-border-width` | `2px` |

## Botones (FR-033)

Los dos botones comparten tamaño (mínimo `--target-min`), borde `--control-border-width`, relleno
horizontal de espacio 4 (32px), texto semibold y transición `--duration-state`.

| Estado | Primario | Secundario |
|---|---|---|
| Reposo | fondo y borde `primary`, texto `on-primary` | sin fondo, borde y texto `primary` |
| Puntero encima | fondo y borde `primary-hover` | borde y texto `primary-hover` |
| Presionado | fondo y borde `primary-active` | borde y texto `primary-active` |
| Foco de teclado | anillo `focus` (ver Foco) | anillo `focus` (ver Foco) |

El contraste de `primary`, `primary-hover` y `primary-active` sobre `background` y `surface` es de
4.5:1 o más (prueba en `tests/unit/tokens/contrast.test.ts`).

## Layout

| Token | Variable CSS | Valor |
|---|---|---|
| Ancho máximo del contenido | `--content-max` | `64rem` (1024px), centrado |
| Ancho de lectura del texto de un caso | `--prose-max` | `65ch`, unos 65 caracteres por línea; las imágenes de apoyo usan todo `--content-max` |
| Grosor de borde | `--border-width` | `1px` |
| Altura visible del encabezado fijo | `--header-height` | Desde `sm`: `61px` = objetivo mínimo (44) + 2 × espacio 1 (8) + borde (1). En teléfono, la fila fija lleva dos líneas (navegación; idioma y tema): `105px` = 2 × 44 + 2 × 8 + 1 |
| Parte del encabezado que sale en teléfono | `--header-collapse` | `-52px` = −(objetivo mínimo + espacio 1); posición `top` del encabezado en teléfono, `0` desde el punto de corte `sm` |

```text
html → scroll-padding-top: var(--header-height) + var(--focus-ring-offset) + var(--focus-ring-width)
```

Evita que el encabezado fijo tape el control enfocado, su anillo o el título de una sección (FR-028).

## Foco

| Token | Variable CSS | Valor |
|---|---|---|
| Grosor del anillo | `--focus-ring-width` | `2px` |
| Separación del anillo | `--focus-ring-offset` | `2px` |

```text
:focus-visible → outline var(--focus-ring-width) solid rgb(var(--color-focus));
                 outline-offset var(--focus-ring-offset)
```

Ningún componente MUST anular este estilo sin reemplazarlo por uno equivalente.

## Garantías verificables

1. Cambiar una variable en `src/styles/tokens/` cambia todas las utilidades que la usan (SC-006).
2. `src/components/` no contiene colores, tamaños ni espacios literales, ni clases arbitrarias de
   Tailwind.
3. Todas las parejas de la tabla de contraste cumplen su mínimo en el tema claro y en el oscuro
   (SC-008).
4. Cambiar de tema solo cambia valores de variables CSS: ningún componente tiene estilos propios
   por tema.
