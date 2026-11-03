# Preparación de producción tras migrar a Astro 7

Fecha: **3 de noviembre de 2026**. Rama: **`chore/astro-security-upgrade`**. Estado: **apto técnicamente para despliegue estático**, con auditoría sin avisos y regresión completa superada. Antes de publicar hay que seleccionar Node compatible en el entorno de trabajo/Vercel y configurar el dominio auténtico. No se ha desplegado ni modificado ningún servicio externo.

## Versiones y compatibilidad

| Elemento | Antes | Después |
| --- | --- | --- |
| Astro | 5.18.2 | **7.4.5**, versión directa exacta |
| Etapa intermedia | — | 6.4.8, validada antes de continuar |
| Node requerido por el proyecto | >=22.19.0 <23 | **>=22.23.4 <23** |
| `.nvmrc` | 22 | **22.23.4** |
| Vite | 6.4.5 | **8.3.5** |
| esbuild | 0.27.7 / 0.25.12 | **0.28.2** |
| sharp | 0.34.5 | **0.35.5** |
| zod | 3.25.76 | **4.6.7** |
| zod-to-ts | 1.2.0 | Ya no instalado; Astro 7 no lo requiere |

Se conservan `@astrojs/check@0.9.12`, TypeScript 5.9.3 y `@types/node@22.20.5`. No hay integraciones o adaptadores SSR. El entorno probado fue Windows, Node **22.23.4**, npm **10.2.4** y Chrome headless **156.0.8078.80**.

El Node global de esta máquina sigue en **20.11.1**. Para esta tarea se ejecutó un Node temporal 22.23.4, también invocando npm mediante su CLI con ese runtime en la instalación final. Configurar Node 22.23.4 o posterior de la rama 22 en la terminal habitual es un paso pendiente del propietario. Vercel debe usar **22.x**, con parche al menos **22.23.4**; una versión anterior fallará los requisitos de Astro.

## Cambios realizados y revisión de APIs

Solo se modificaron `package.json`, `package-lock.json`, `.nvmrc`, `README.md` y estos dos informes de `docs/`. Se fijó Astro en 7.4.5 y se regeneró el lockfile. El único aviso residual tras instalar Astro 7 era una copia antigua del peer opcional esbuild de Vite; `npm update esbuild` seleccionó 0.28.2 dentro del rango declarado. No se añadieron overrides, dependencias directas ni herramientas nuevas.

Se revisaron las guías oficiales de [Astro 6](https://docs.astro.build/en/guides/upgrade-to/v6/) y [Astro 7](https://docs.astro.build/en/guides/upgrade-to/v7/). Se comprobó el cambio de orden de scripts, i18n, endpoints con extensión, Vite 8, el compilador Rust y su manejo de HTML/espacios. No fue necesario cambiar código de aplicación ni configuración:

- `prefixDefaultLocale: false` mantiene español en `/` e inglés en `/en/`, sin redirección de la raíz.
- Los scripts de tema siguen aplicando la preferencia antes del contenido y funcionan con almacenamiento bloqueado.
- Los dos `getStaticPaths()` conservan las seis páginas de proyectos, además de las dos páginas de inicio.
- Sitemap y robots continúan enlazados como `/sitemap.xml` y `/robots.txt`, sin barra tras su extensión.
- `output: 'static'`, `astro.config.mjs` y `vercel.json` permanecen intactos. El directorio final contiene HTML, CSS, favicon y archivos XML/TXT; no contiene runtime de servidor, funciones ni adaptador SSR.

Los datos personales, contenido de proyectos, traducciones y CSS conservan sus hashes SHA-256 originales. No se eliminaron funciones ni se rediseñó el portfolio.

## Seguridad

Auditoría inicial: **5 paquetes afectados: 1 crítico, 3 altos y 1 bajo**. Auditoría final completa, tras `npm ci`: **0 vulnerabilidades notificadas**, sin avisos directos o transitivos. Los resultados completos y la evaluación de exposición se describen en [security-audit.md](security-audit.md).

Evidencia local en `.verification/astro-security-upgrade/`:

- `audit-before.json` y `audit-after.json`.
- `before/`: copias originales de los documentos y manifests, capturas y resultados del navegador en Astro 5.
- `after/`: capturas y resultados del navegador en Astro 7.
- `visual-comparison.json`: comparación de las 14 capturas.
- `content-hashes-before.json`: ubicado en la raíz del directorio de migración.

Una auditoría sin avisos no garantiza ausencia de vulnerabilidades desconocidas. Hay que repetirla cuando cambien las dependencias y antes de publicar.

## Resultados reales de regresión

| Comprobación | Resultado |
| --- | --- |
| `npm ci` con Node 22.23.4 | Correcto; instalación reproducible, sin advertencias de engines y con 0 vulnerabilidades |
| `npm test` | Correcto: dominio, HTTPS, ausencia de dominio y rechazo de URLs inválidas |
| `npm run check` | 24 archivos; **0 errores, 0 advertencias, 0 sugerencias** |
| `npm run build` | Correcto; **8 páginas estáticas** en `dist` |
| `npm run check:build` sin dominio | Correcto; **152 enlaces internos/recursos**, anclas, ES/EN, IDs, h1, títulos y descripciones únicos; sin origen inventado |
| Build con `VERCEL_ENV=production` y origen reservado HTTPS `.invalid` | Correcto; `check:build` valida canonical, hreflang ES/EN/x-default, og:url, ocho entradas de sitemap y referencia de robots |
| `npm run check:browser`, con preview iniciado | **80 casos correctos**: 8 páginas × 5 anchuras × 2 temas |
| Resoluciones | 320, 375, 768, 1024 y 1440 px; sin desbordamiento horizontal detectado |
| Tema | Alternancia, persistencia entre rutas, preferencia del sistema y localStorage bloqueado correctos |
| Idioma y proyectos | Cambio al proyecto equivalente ES/EN y conservación de fragmento de sección correctos |
| Menú móvil | Apertura, indicador activo, clic de navegación, cierre y Escape correctos |
| Movimiento reducido | `scroll-behavior: auto` comprobado |
| Contraste de texto renderizado | Sin fallos detectados en los 80 casos |
| Comparación visual antes/después | 14 capturas con iguales dimensiones; 13 idénticas, una con diferencia de 1 píxel |
| Respuestas HTTP en preview | 200 en las 8 páginas, sitemap, robots y favicon; tipos de contenido correctos |
| Conservación de contenido | Hashes originales de datos personales, proyectos, traducciones y CSS intactos |

El origen `.invalid` se utiliza únicamente para pruebas y se retira de la compilación local final. Las pruebas de contraste se limitan al texto visible sobre fondos sólidos; no son una certificación WCAG. No se probaron lectores de pantalla, Safari, Firefox, dispositivos físicos ni hosting remoto.

## Estado de Git y posibilidad de volver atrás

La rama original es `feat/portfolio-v1`, en **`c9ed6237e3984900bb174cdb3e1a51dcc85711da`**. Al comenzar, únicamente los dos informes de `docs/` estaban sin seguimiento; el usuario eligió conservarlos sin commit y autorizar su actualización tras respaldarlos. No se eliminó trabajo del usuario ni se creó ningún commit.

Los cambios quedan sin commit en `chore/astro-security-upgrade`, listos para revisión. El historial original y el respaldo `before/` permiten reconstruir el estado anterior. Antes de restaurar archivos o cambiar de rama, conserva los cambios de migración en un commit revisado o en una copia externa, incluidos los informes aún sin seguimiento. No utilices `reset --hard` ni borres el respaldo si necesitas esos documentos originales.

## Configuración y ejecución

Los datos reales siguen en `src/data/profile.ts`: nombre, email, GitHub, LinkedIn y CV. Los repositorios/demos están en `src/data/projects.ts`. Se ocultan los enlaces vacíos y el botón de CV si falta un archivo real. El dominio está en la variable de entorno **`SITE_URL`**, validada en `config/site.mjs`.

Con Node compatible, desde la raíz:

```powershell
node --version
npm ci
npm audit
npm test
npm run check
npm run build
npm run check:build
npm run preview -- --host 127.0.0.1
```

En otra terminal, manteniendo preview abierto:

```powershell
npm run check:browser
```

El script usa un Chrome/Edge instalado. Si está en otra ruta, define `CHROME_PATH`; `PREVIEW_URL` permite cambiar el servidor. No descarga navegadores ni dependencias. Las capturas se guardan en `.verification/`. Ctrl+C detiene preview y el script cierra su navegador aislado.

## Pasos para publicar cuando corresponda

1. Activar **Node 22.23.4 o posterior dentro de la rama 22**. Revisar la migración y guardar en Git los manifests, `.nvmrc`, README y ambos informes.
2. Completar únicamente los datos personales reales que quieras mostrar. Siguen pendientes email, perfiles, repositorios, CV y detalles internos/resultados de proyectos; sus ausencias no se suplen con datos inventados.
3. Elegir el origen HTTPS definitivo. Exportar `$env:SITE_URL = 'https://TU_DOMINIO_REAL'`, sustituyendo el marcador. La configuración lee `process.env`; `.env.example` es documentación y no carga por sí sola esa variable.
4. Ejecutar instalación, auditoría y todas las pruebas anteriores. Con `SITE_URL` definido, `check:build` debe validar ocho URLs auténticas en el sitemap y las equivalencias de idioma.
5. Subir el repositorio a GitHub e importarlo en Vercel. Antes de pulsar Deploy, seleccionar la raíz del proyecto, preset **Astro**, Node **22.x** con parche compatible y definir `SITE_URL` en **Production**. `vercel.json` fija `npm ci`, `npm run build`, salida `dist` y trailing slash. No añadir adaptador SSR ni rewrites de SPA.
6. Si habrá Preview deployments, configurar también su política de canonical/SITE_URL y protegerlos frente a acceso o indexación públicos. Esos ajustes externos no se han modificado.
7. Cuando quieras publicar, pulsar Deploy. Para dominio propio, añadirlo en Settings → Domains y aplicar los registros DNS exactos indicados por Vercel. Si cambia el origen, actualizar `SITE_URL` y recompilar.
8. Revisar en la URL real las ocho páginas, enlaces, CV si existe, favicon, sitemap, robots, canonical/hreflang y redirecciones con barra final. Esa comprobación remota sigue pendiente porque no se ha desplegado.

Referencias: [Astro estático en Vercel](https://docs.astro.build/en/guides/deploy/vercel/) y [configuración de Vercel](https://vercel.com/docs/project-configuration/vercel-json).
