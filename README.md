# Portfolio — Astro + TypeScript

MVP bilingüe minimalista.

## Requisitos
Node.js compatible con la versión de Astro instalada (consulta docs.astro.build).

## Desarrollo
```bash
npm install
npm run dev
```

Páginas: `/` (español) y `/en/` (inglés).

## Comprobación y compilación
```bash
npm run check
npm run build
npm run preview
```

## Personalización
1. Edita `src/lib/content.ts`: `profile`, `copy` y `projects`.
2. Cambia estilos en `src/styles/global.css`.
3. Añade imágenes y CV a `public/` (y sus enlaces en los componentes).
4. Antes de publicar, configura el dominio real en `astro.config.mjs` como `site`, y actualiza alternates a URLs absolutas.

## Despliegue
Importa el repositorio en Vercel; framework Astro; comando build `npm run build`; salida `dist`.

Nota: los enlaces sociales están vacíos de forma intencionada hasta añadir URLs auténticas.
