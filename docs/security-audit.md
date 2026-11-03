# Migración de seguridad — 3 de noviembre de 2026

Portfolio migrado de **Astro 5.18.2 → 6.4.8 → 7.4.5**, última versión estable consultada en el registro npm. La instalación limpia desde el lockfile final y `npm audit --json` dan **0 vulnerabilidades notificadas**, tanto directas como transitivas. Esto describe el resultado de la auditoría en esta fecha, no una garantía de ausencia de vulnerabilidades desconocidas.

No se ejecutó `npm audit fix --force`, ni se añadieron overrides o dependencias directas adicionales. No se desplegó ni se modificó ningún servicio externo.

## Preparación y conservación del estado

- Rama inicial: `feat/portfolio-v1`, commit `c9ed6237e3984900bb174cdb3e1a51dcc85711da`.
- Git no estaba completamente limpio: solo estos dos documentos de `docs/` estaban sin seguimiento. El usuario confirmó conservarlos sin commit, guardar copias y actualizarlos en la rama de migración.
- Rama de trabajo: `chore/astro-security-upgrade`. No se creó ningún commit ni se reescribió el historial.
- Respaldo de documentos, manifests, configuración, capturas y resultados anteriores: `.verification/astro-security-upgrade/before/`.
- Auditoría inicial: `.verification/astro-security-upgrade/audit-before.json`.
- Auditoría final: `.verification/astro-security-upgrade/audit-after.json`.

Los artefactos de `.verification/` son locales y están excluidos de Git. Los documentos finales resumen la evidencia que debe conservarse antes de limpiar ese directorio.

## Antes y después

| Paquete | Antes | Después | Resultado |
| --- | --- | --- | --- |
| Astro | 5.18.2, crítico | **7.4.5** | Sin avisos notificados |
| Vite | 6.4.5 | **8.3.5** | Actualización transitiva de Astro |
| esbuild | 0.27.7; otra copia 0.25.12 bajo Vite 6 | **0.28.2** | Corregido el aviso bajo de la copia 0.27.7 |
| sharp | 0.34.5, alto | **0.35.5** | Sin avisos notificados |
| zod | 3.25.76, alto | **4.6.7** | Sin avisos notificados |
| zod-to-ts | 1.2.0, alto heredado | **No instalado** | Astro 7 ya no lo requiere; no se eliminó ninguna función del portfolio |
| @astrojs/check | 0.9.12 | 0.9.12 | Conservado; compatible con TypeScript 5 |
| TypeScript | 5.9.3 | 5.9.3 | Conservado, modo estricto |
| @types/node | 22.20.5 | 22.20.5 | Conservado en la rama 22 |

Auditoría inicial: **5 paquetes afectados: 1 crítico, 3 altos y 1 bajo**. La cifra agrupaba varios avisos de Astro y un riesgo heredado por zod-to-ts, no cinco fallos independientes. Auditoría final completa: **0 críticos, 0 altos, 0 moderados y 0 bajos**. No quedan vulnerabilidades conocidas activas según ese informe ni bloqueos de compatibilidad identificados.

## Exposición de los avisos anteriores

| Paquete | Problema anterior | Exposición del portfolio estático |
| --- | --- | --- |
| Astro | RCE al optimizar AVIF no confiable; XSS en funciones de renderizado; SSRF y otros avisos agrupados | Desarrollo/compilación usaban Astro. El despliegue no ejecutaba un servidor Astro; un XSS generado durante la compilación sí podía persistir en HTML. No se utilizaban AVIF, JSX/MDX, server islands ni transiciones. |
| esbuild | Lectura fuera del directorio servido al usar su servidor en Windows | Herramienta local; este proyecto no utilizaba la API `serve` de esbuild. No se enviaba esbuild al navegador. |
| sharp | Fallos en libvips, libheif y librsvg | Riesgo al transformar imágenes durante desarrollo/compilación. El portfolio utiliza placeholders CSS y favicon estático, sin optimización de imágenes. |
| zod | Agotamiento de memoria al validar colecciones grandes con errores | Configuración y herramientas de compilación; no había validación de datos de visitantes mediante zod. |
| zod-to-ts | Dependencia de zod vulnerable | Generación de tipos; el aviso era transitivo. |

Referencias de los avisos originales: [Astro/AVIF](https://github.com/advisories/GHSA-26w7-cxv4-gfx2), [esbuild](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr), [sharp/libvips](https://github.com/advisories/GHSA-f88m-g3jw-g9cj), [sharp/libheif](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c), [sharp/librsvg](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) y [zod](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). El JSON inicial conserva todos los identificadores y rangos de Astro.

## Compatibilidad y corrección controlada

1. Se consultaron las guías oficiales de [Astro 6](https://docs.astro.build/en/guides/upgrade-to/v6/) y [Astro 7](https://docs.astro.build/en/guides/upgrade-to/v7/), los manifests instalados, `npm view` y los peerDependencies.
2. Se elevó Node de `>=22.19.0 <23` a **`>=22.23.4 <23`**, y `.nvmrc` quedó fijado en **22.23.4**. Es el mínimo declarado por Astro 7.4.5 y la versión usada para verificar el resultado. Node global 20.11.1 sigue sin modificarse y no debe usarse para ejecutar este proyecto.
3. Astro 6.4.8 pasó tipos, compilación y la comprobación de las ocho rutas antes de continuar a 7.4.5.
4. La primera instalación de Astro 7 retuvo esbuild 0.27.7 como peer opcional de Vite. Se ejecutó **`npm update esbuild`**, seleccionando 0.28.2 dentro del rango admitido por Vite 8.3.5 (`^0.27.0 || ^0.28.0`). No se añadió esbuild a package.json ni se forzó una versión mediante override.
5. Se ejecutó `npm ci` con Node 22.23.4 para comprobar que el lockfile reproduce la instalación corregida. La auditoría final se guardó después de esa instalación limpia.

Las revisiones de compatibilidad cubren el nuevo orden de scripts, i18n sin prefijo español, endpoints con extensión sin barra final, Vite 8, el compilador Rust y el cambio de tratamiento de espacios. No se utilizan integraciones, plugins propios de Vite, Markdown de contenido, APIs SSR ni flags experimentales que necesiten migración. No fue necesario modificar `src/` ni `astro.config.mjs`. La regresión completa y sus límites figuran en [preparación de producción](production-readiness.md).

## Seguimiento

Usar Node 22.23.4 o posterior dentro de la rama 22 también en Vercel, configurar el `SITE_URL` real y volver a ejecutar auditoría y pruebas cuando se actualicen dependencias. La versión directa de Astro queda fijada en `7.4.5` para que futuras actualizaciones sean explícitas. No se ha verificado un despliegue remoto.
