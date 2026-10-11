# DESIGN.md

**Fuente de verdad:** `.specify/memory/constitution.md` (v1.4.0) y
`specs/001-ux-portfolio-platform/contracts/tokens.md`. Este archivo solo las resume para
Impeccable. Si hay contradicción, mandan la constitución y el contrato de tokens. No cambiar
colores, tipografía, forma, cristal ni pantallas sin aprobación explícita (principio V).

Impeccable se usa solo para revisar (`/impeccable audit`, `/impeccable critique`). Sus hallazgos
pasan a `specs/001-ux-portfolio-platform/tasks.md` y se aplican uno por uno tras tu OK. No
ejecutar `polish`, `bolder`, `colorize` ni reescribir pantallas desde aquí.

## Producto

Portafolio de Ximena Alvarez, Senior Product Designer y UX/UI Lead. Una página con Inicio,
Trabajos, Sobre mí (incluye Trayectoria) y Contacto; casos de estudio en rutas aparte. Español
sin prefijo, inglés bajo `/en/`. Temas claro y oscuro.

## Identidad visual (aprobada el 2026-10-09)

- **Color:** 15 tokens (13 base + Surface tonal y Secondary container, derivados del Primary).
  Primary índigo `67 56 202`. Fondo cálido casi blanco. No introducir paleta nueva.
- **Tipo:** Manrope en titulares, Inter en cuerpo. Escala `text-sm` a `text-4xl` por tokens.
- **Forma:** botones píldora (`--button-radius` 9999px) con capa de estado 8 % / 16 %; tarjetas
  y chips con 16px; foto de perfil cuadrada, borde Primary de 4px, esquinas 16px.
- **Cristal:** solo el encabezado (`.header-glass`, alpha 0.9, blur 16px), con respaldo sólido.
- **Inter / índigo:** son del contrato, no un patrón genérico de IA. El detector no debe
  “corregirlos”.

## Modo

Experience: el trabajo (casos, trayectoria, propuesta de valor) va primero; la interfaz recede.
