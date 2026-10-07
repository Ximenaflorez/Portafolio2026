# Contract: Tokens de diseño

Fuente de verdad: Contrato de tokens de `.specify/memory/constitution.md` (v1.1.0).
SASS los emite como variables CSS en `:root`. Tailwind los lee y **reemplaza** su tema por defecto
para color, tipografía y espaciado, así que esas utilidades no existen fuera de estos tokens.

## Color

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

## Foco

```text
:focus-visible → outline 2px solid rgb(var(--color-focus)); outline-offset 2px
```

Ningún componente MUST anular este estilo sin reemplazarlo por uno equivalente.

## Garantías verificables

1. Cambiar una variable en `src/styles/tokens/` cambia todas las utilidades que la usan (SC-006).
2. `src/components/` no contiene colores, tamaños ni espacios literales, ni clases arbitrarias de
   Tailwind.
3. Todas las parejas de la tabla de contraste cumplen su mínimo (SC-008).
