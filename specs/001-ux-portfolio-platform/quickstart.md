# Quickstart: validar la plataforma

Guía de comprobación de punta a punta. Los comandos los define `package.json` durante la
implementación.

## Requisitos

- Node.js 22 LTS y npm.
- Navegadores de Playwright instalados (`npx playwright install`).

## Puesta en marcha

```bash
npm install
npm run dev        # servidor local
npm run build      # prerender de todas las rutas publicadas + sitemap
npm run preview    # sirve el build estático
```

## Escenarios de validación

| # | Escenario | Comando | Resultado esperado | Criterio |
|---|---|---|---|---|
| 1 | Contraste de tokens | `npm run test:unit -- tokens` | Todas las parejas de [tokens.md](./contracts/tokens.md) cumplen su mínimo | SC-008 |
| 2 | Propagación de tokens | `npm run test:unit -- tokens` | Cambiar una variable cambia la utilidad de Tailwind y el CSS resuelto | SC-006 |
| 3 | Sin valores sueltos | `npm run lint` | Stylelint y la prueba de clases arbitrarias pasan | FR-011 |
| 4 | Capas de Atomic Design | `npm run test:unit -- layers` | Ninguna capa importa una capa superior | Principio III |
| 5 | Contenido válido | `npm run build` | Un caso `published` con `[COMPLETAR]` rompe el build; los `draft` no generan ruta | FR-026, FR-001 |
| 6 | Accesibilidad de componentes | `npm run test:unit` | axe sin violaciones en cada componente | FR-009 |
| 7 | Teclado y foco | `npm run test:e2e -- keyboard` | Todos los controles se alcanzan con Tab, el foco es visible y no hay trampas | SC-003 |
| 8 | Accesibilidad de páginas | `npm run test:e2e -- a11y` | axe sin violaciones WCAG 2.2 AA en cada ruta | FR-009 |
| 9 | Responsive y zoom | `npm run test:e2e -- responsive` | Sin desborde horizontal en 360, 768 y 1280px, ni con texto al 200% | SC-005 |
| 10 | SEO | `npm run test:e2e -- seo` | Cada ruta tiene título, descripción, canónica y un solo `h1`; el sitemap coincide con las rutas | SC-007 |
| 11 | Auditoría | `npm run lighthouse` | Más de 95 en Rendimiento, Accesibilidad y Buenas prácticas, en teléfono y escritorio | SC-004 |

## Revisión manual

- Recorridos con evaluadores para SC-001, SC-009 y SC-010 (al menos 4 de 5 recorridos).
- Lector de pantalla (NVDA en Windows) sobre Inicio y un caso.
