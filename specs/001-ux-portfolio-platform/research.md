# Research: Plataforma de portafolio UX/UI

Las decisiones marcadas como "aprobada" las eligió el responsable el 2026-10-07.

## 1. Versión de Tailwind

- **Decision**: Tailwind CSS 3.4 (aprobada).
- **Rationale**: Tailwind v4 no está pensado para usarse con preprocesadores como SASS. Con 3.4,
  SASS emite las variables CSS y `tailwind.config.ts` las lee, que es el reparto de la
  constitución (principio I).
- **Alternatives considered**: Tailwind v4 con `@theme` en CSS nativo. Exigía mover los tokens fuera
  de SASS y enmendar la constitución.

## 2. Lenguaje

- **Decision**: TypeScript (aprobada).
- **Rationale**: Tipa el modelo de contenido y los props de componentes. Los errores de estructura
  de un caso aparecen en el build.
- **Alternatives considered**: JavaScript.

## 3. Generación de páginas y SEO

- **Decision**: React Router 7 en modo framework con `prerender` de todas las rutas publicadas
  (aprobada).
- **Rationale**: Cada ruta sale como HTML real con título y descripción propios (FR-014). Ayuda al
  rendimiento (SC-004) y sigue siendo React sobre Vite.
- **Alternatives considered**: SPA con metadatos en el cliente (los buscadores ven menos contenido);
  `vite-react-ssg` (menos mantenido).

## 4. Formato del contenido

- **Decision**: Markdown con frontmatter, validado con `zod` en el build (aprobada).
- **Rationale**: Se escribe igual que las plantillas de `content/`. El esquema hace cumplir el
  resumen (FR-020) y las cuatro secciones (FR-002).
- **Publicación**: `status: draft | published`. Los borradores no generan ruta ni entran en el
  sitemap. Un caso `published` con `[COMPLETAR]` rompe el build (FR-026).
- **Render**: `react-markdown` mapea encabezados, párrafos, listas, enlaces e imágenes a átomos, para
  que el contenido también use los tokens.
- **Alternatives considered**: objetos TypeScript (incómodo para textos largos), MDX (más complejo).

## 5. Pruebas

- **Decision**: Vitest + Testing Library + `vitest-axe`; Playwright + `@axe-core/playwright`;
  Lighthouse CI (aprobada).
- **Pruebas de tokens**:
  - Contraste: la prueba compila `main.scss` con la API de `sass`, lee las variables de `:root` y
    calcula el contraste de cada pareja del contrato (SC-008).
  - Propagación: cambia un token en una compilación de prueba y comprueba que cambia el valor
    resuelto en Tailwind y en CSS (SC-006).
  - Anti valores sueltos: Stylelint prohíbe colores y medidas literales fuera de
    `src/styles/tokens/`; una prueba rechaza clases arbitrarias de Tailwind (`[#...]`, `[13px]`)
    en `src/components/`.
- **Prueba de capas**: una prueba lee los imports de cada componente y falla si una capa importa una
  capa superior (principio III).
- **Alternatives considered**: solo Vitest con axe y Lighthouse manual.

## 6. Fuentes

- **Decision**: Fontsource con archivos `woff2` del propio sitio (aprobada).
- **Rationale**: Sin terceros y sin conexión extra. Solo los pesos necesarios, `font-display: swap`
  y precarga de la fuente de texto.
- **Alternatives considered**: Google Fonts.

## 7. Publicación

- **Decision**: GitHub Pages con GitHub Actions (aprobada).
- **Rationale**: Hosting estático gratuito, alineado con Git.
- **Implicaciones**: si el sitio es de proyecto, vive bajo `/<repo>/`, así que `basename` y la base de
  Vite salen de una variable `BASE_PATH`. El sitemap necesita URLs absolutas: sale de `SITE_URL`.
  Cada ruta prerenderizada se publica como `ruta/index.html`, y la página 404 como `404.html`.
- **Abierto**: no hay repositorio remoto ni dominio. `SITE_URL` y `BASE_PATH` se fijan cuando
  existan.

## 8. Breakpoints

- **Decision**: usar los de Tailwind 3.4: `sm` 640px, `md` 768px, `lg` 1024px y `xl` 1280px,
  diseñando primero para teléfono (aprobada).
- **Rationale**: Cubren teléfono, tableta y escritorio (FR-013), y son conocidos por el equipo de
  ingeniería que evalúa el código.
- **Alternatives considered**: breakpoints propios definidos por el contenido.

## 9. Mapeo de tokens a Tailwind

- **Decision**: las variables de color se emiten como canales RGB (`--color-primary: 67 56 202`)
  para que Tailwind admita opacidad con `rgb(var(--color-primary) / <alpha-value>)`.
- **Rationale**: Tailwind 3.4 solo calcula opacidad sobre colores con canales separados.
- **Detalle**: ver [contracts/tokens.md](./contracts/tokens.md).
