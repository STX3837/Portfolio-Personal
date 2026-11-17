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


## Iteración 5 — refinamiento visual (2026-11-05)

Git estaba limpio en `content/professional-projects`. Se conserva Astro 7.4.5, Node 22.23.4, TypeScript estricto, CSS nativo, ES/EN y salida estática sin adaptador. No hay cambios en dependencias, lockfile, datos personales, mecanismos de los proyectos ni configuración externa.

Archivos de implementación: `src/styles/global.css`, `src/components/ProjectCaseStudy.astro`, `Home.astro`, `ProjectDetail.astro`, nuevo `ProjectVisual.astro`, `src/data/projects.ts` (solo tipo opcional de imagen) y nuevo `config/project-screenshot.mjs`. Se amplían `scripts/check-config.mjs`, `scripts/check-browser.mjs` y README.

Cambios: etiquetas y listas móviles más legibles, referencias con más espacio interactivo, tabla con separación de columnas, primera columna fija en móvil y ayuda de scroll; diagrama textual de compradores → última unidad → control transaccional → aceptación/rechazo, sin comprador ganador ni prioridad asignados. Las estrategias verificadas Django/FastAPI y todos los datos de la tabla permanecen intactos. EDC continúa como prototipo local y AURA conserva su alcance sin confirmar.

El componente de capturas comparte fallback conceptual entre las tres fichas e inicio. Valida existencia local, ruta, dimensiones positivas y alt ES/EN. No se configuró ninguna imagen: se verificó el fallback en navegador y la validación con fixtures de archivos en pruebas unitarias; no se afirma haber revisado una captura real dentro del componente. README explica cómo aportarlas.

Verificaciones ejecutadas con Node 22.23.4:

| Comando | Resultado |
| --- | --- |
| `npm test` | Correcto: origen y capturas opcionales/invalidaciones |
| `npm run check` | 28 archivos, 0 errores, 0 advertencias, 0 hints |
| `npm run build` | Correcto; ocho páginas en `dist`, modo static |
| `npm run check:build` | Ocho páginas, 152 enlaces/recursos internos y anclas |
| Build + check:build con `SITE_URL` y entorno production | Correcto: canonical, hreflang, ocho URLs del sitemap y robots con origen reservado `.invalid` |
| Build + check:build final sin dominio de prueba | Correcto; no se deja el origen de prueba en dist |
| `npm audit` | 0 vulnerabilidades notificadas |

Las capturas de DISTANS se inspeccionaron a 375, 768 y 1440 px en claro y oscuro y se comparó la vista móvil anterior. Los artefactos están en `.verification/iteration-5/`, ignorados por Git. Una ejecución intermedia del navegador se lanzó antes de que finalizase la reconstrucción de dist y falló al acceder a localStorage en un documento de error. El script ahora comprueba HTTP del preview antes de arrancar Chrome; las pruebas deben ejecutarse después del build. Las aserciones nuevas de teclado se ajustaron para usar Tab real y admitir el ancho que ocupa la barra de desplazamiento de Windows, sin modificar los estilos de foco.

Pendientes: aportar capturas auténticas y revisar su contenido/alt/proporciones tras configurarlas; lectores de pantalla, Safari/Firefox y dispositivos físicos. Los controles de contraste de texto y teclado en Chrome no constituyen una certificación de accesibilidad. No se hizo commit ni despliegue.


Resultado final de `npm run check:browser`: **96 casos correctos** (8 páginas × 6 anchos × 2 temas), sin desbordamiento horizontal de página ni fallos de contraste de texto detectados, también con detalles abiertos. Pasan fallback conceptual, dos compradores/dos resultados, tabla ajustada en escritorio, acceso con Tab/foco visible/scroll con flechas en móvil, desplegables por Enter, enlace de salto, menú/Escape, idiomas/rutas/hash, persistencia y preferencia de tema, almacenamiento bloqueado y reduced motion. Se guardaron **28 PNG** y `browser-results.json`. La revisión visual directa cubrió los seis PNG de DISTANS en 375/768/1440 y ambos temas. Sigue pendiente la evaluación con lector de pantalla y otros motores.


## Iteración 6 — capturas reales FastAPI (2026-11-05)

Se continuó sobre los cambios sin commit de la iteración 5, conservándolos. Astro permanece en 7.4.5, sin dependencias nuevas ni cambios de configuración de despliegue, SSR o idiomas.

Se copiaron únicamente los dos PNG aportados a `public/images/projects/distans-fastapi-catalogue.png` (1896 × 875, 245467 bytes) y `distans-fastapi-products.png` (1897 × 871, 139230 bytes). Se inspeccionaron visualmente: catálogo/comprador y gestión de productos/vendedor, sin correo visible. Sus hashes SHA-256 coinciden con los originales. No se recibió ni incorporó el archivo de gestión de cuentas mencionado con correo; no se intentó publicarlo ni editarlo.

`src/data/projects.ts` centraliza `implementationScreenshots.fastapi` (rutas, dimensiones, alt y captions ES/EN) y relaciona las traducciones mediante `visualId`. El nuevo `ProjectScreenshot.astro` comparte validación con `ProjectVisual.astro`. `ProjectDetail.astro` pasa los datos y `ProjectCaseStudy.astro` muestra el catálogo en la tarjeta FastAPI y una secuencia de ambas imágenes a ancho completo. El mismo PNG de catálogo se reutiliza. CSS mantiene proporciones y colores de origen, sin recorte, con enlaces al original y carga diferida. Hero, inicio, EDC y AURA conservan las ilustraciones conceptuales. Django conserva la tarjeta de texto y una remisión discreta a las referencias técnicas; no utiliza capturas FastAPI como si fueran Django.

Una comparación estructural con los datos de Git, excluyendo las nuevas propiedades visuales, confirmó que el contenido técnico de todos los proyectos permanece idéntico. Los scripts de build y navegador comprueban las dos rutas de imagen aprobadas, alt descriptivo, dimensiones y la ausencia de captura Django. README explica archivos, estructura, futura clave `django`, fallback y actualización de expectativas de pruebas al aportar nuevos archivos.

| Comprobación ejecutada | Resultado |
| --- | --- |
| `npm test` | Correcto: origen y validación de capturas opcionales |
| `npm run check` | 29 archivos; 0 errores, 0 advertencias, 0 hints |
| `npm run build` | Correcto: ocho páginas estáticas en dist |
| `npm run check:build` | Correcto: ocho rutas, 158 enlaces/recursos internos, metadatos, sitemap y robots sin dominio local |
| `npm audit` | 0 vulnerabilidades notificadas |

Se inspeccionaron los seis PNG de DISTANS en 375, 768 y 1440 px y ambos temas. En móvil las imágenes preservan el encuadre completo; para leer los textos de una captura de escritorio se ofrece el archivo a tamaño original. No se afirma que todo el texto incrustado en los PNG resulte legible en la miniatura móvil, ni que el contraste interno de las aplicaciones fotografiadas haya sido auditado por el comprobador de texto DOM.

Pendiente aportar capturas auténticas de Django. Continúan pendientes lectores de pantalla, otros motores y dispositivos físicos. No se hizo commit ni despliegue ni se modificaron servicios externos.


`npm run check:browser`, con preview iniciado después del build: **96 casos correctos**, ocho páginas × seis anchos (320/375/430/768/1024/1440) × dos temas. Se verificaron carga y dimensiones naturales de los PNG, proporciones renderizadas, fallback conceptual, ausencia de capturas Django, falta de desbordamiento de página, contraste de texto DOM, navegación por Tab/foco visible en los dos enlaces de galería y tabla, scroll por flechas, desplegables, menú/Escape, idiomas, rutas/hash, persistencia/preferencia de tema, almacenamiento bloqueado y reduced motion. Se guardaron 28 PNG y `browser-results.json` en `.verification/iteration-6/`, ignorado por Git. Preview se detuvo al terminar.


## Ampliación de DISTANS — 2026-11-10 (integración parcial)

Rama `content/professional-projects`, con cambios pendientes de iteraciones anteriores preservados. Se localizaron los dos PNG anteriores de FastAPI en `public/images/projects/`, ya configurados en `projects.ts`. No se encontraron los tres PNG nuevos en el workspace, carpeta del adjunto o Escritorio: las imágenes visibles del chat no ofrecen una ruta de archivo utilizable por las herramientas. Se solicitaron las rutas locales. **No están integradas las cinco capturas**: están disponibles y configuradas únicamente las dos anteriores. No se inventaron imágenes ni se publicaron archivos vacíos o referencias rotas. El panel de cuentas sigue excluido.

Se añadió `DISTANS en funcionamiento / DISTANS in action` con traducción centralizada, grupos por implementación y cuadrícula de dos columnas (una hasta 800 px). Cada imagen aparece una sola vez: se retiró la vista duplicada del catálogo de la tarjeta, conservando todos los datos técnicos y enlaces de ambas tarjetas. `ProjectScreenshot` reconoce imágenes verticales mediante dimensiones y limita su ancho a 280 px; esa variante queda preparada, pero no se comprobó con el mapa real porque falta su archivo. No se tocaron el diagrama, la comparativa técnica, los otros proyectos, dependencias, Astro o Vercel. Una comparación estructural de los datos con Git confirmó contenido técnico idéntico excluyendo configuración visual.

Los dos archivos existentes se reutilizan sin mover, renombrar ni recomprimir (245467 y 139230 bytes). Se actualizaron sus alt y captions a los textos exactos solicitados. `README.md` documenta rutas pendientes, datos, reuso, proporciones, fallbacks y pruebas. Los scripts conservan comprobaciones de carga, dimensiones, privacidad por lista aprobada, teclado, contraste y enlaces; adaptan la expectativa a dos imágenes sin repetición.

Resultados ejecutados con Node 22.23.4: `npm test` correcto; `npm run check`, 29 archivos sin errores/advertencias/hints; `npm run build`, ocho páginas estáticas; `npm run check:build`, ocho rutas y 156 enlaces/recursos. También pasaron builds y verificación SEO con origen reservado `.invalid` y sin dominio: canonical/hreflang, metadatos, sitemap y robots. La salida final no conserva el origen de prueba. `npm audit`: cero vulnerabilidades notificadas.

Pendientes para finalizar: archivos reales de catálogo Django, carrito Django y mapa móvil FastAPI, con inspección de dimensiones/peso/privacidad, incorporación a sus grupos y repetición de regresión para las cinco imágenes. La galería actual no se presenta como una selección completa de cinco. Continúan pendientes lectores de pantalla, otros motores y dispositivos físicos. Sin commit ni despliegue.


`npm run check:browser`, con preview iniciado: 96 casos correctos para el estado actual de dos imágenes (8 páginas × 6 anchos × 2 temas), sin imágenes rotas, duplicados, desbordamiento de página ni fallos de contraste de texto DOM detectados. Pasan carga, dimensiones/proporciones, alt descriptivos, enlaces por Tab con foco visible, menú/Escape, idioma/rutas/hash, temas/persistencia, almacenamiento bloqueado, reduced motion, tabla y desplegables. Se generaron 28 PNG y `browser-results.json` en `.verification/iteration-6-expanded/`. Se inspeccionaron los seis PNG ES de DISTANS en 375/768/1440 y ambos temas. Estos resultados no incluyen las tres imágenes ausentes ni prueban la variante vertical con el mapa auténtico. Preview se detuvo al terminar.


## Galería completa de cinco imágenes — 2026-11-10

El usuario aportó los tres archivos pendientes en `public/images/projects/`. Se inspeccionaron antes de integrarlos: `django-catalogo.png` (522 × 444, 57507 bytes), `django-carrito.png` (590 × 353, 45779 bytes) y `fastapi-mapa-mobile.png` (271 × 559, 80604 bytes). Coinciden con catálogo/carrito Django y mapa móvil FastAPI. No se aprecian correos, credenciales ni información privada en las vistas. No se ha incorporado el panel de cuentas.

Este estado resuelve el bloqueo de archivos del apartado anterior: **las cinco capturas auténticas están configuradas**. Se mantienen las rutas y bytes anteriores de los dos PNG FastAPI y se usan las rutas aportadas de los tres nuevos, sin moverlos, editarlos ni crear copias. Peso conjunto: 568587 bytes (unos 555 KiB); sin compresión adicional para preservar el texto. Las dimensiones explícitas y la carga diferida se mantienen.

La sección de interfaces tiene dos grupos: Django, catálogo y carrito; FastAPI, catálogo, gestión y mapa. Cada imagen aparece una sola vez y conserva proporciones, alt y caption ES/EN solicitados. El mapa usa la variante vertical limitada a 280 px. La cuadrícula sigue siendo de dos columnas en escritorio y una hasta 800 px. Los enlaces permiten abrir originales. Se conservan hero conceptual, las dos tarjetas completas, diagrama, comparativa, EDC y AURA. La comparación estructural de datos confirma que solo se modificó configuración visual.

Archivos modificados en esta continuación: `src/data/projects.ts`, `scripts/check-build.mjs`, `scripts/check-browser.mjs`, README y este informe. Los tres PNG fueron aportados por el usuario; se usan desde `public/images/projects/`. Los componentes existentes ya admitían grupos múltiples y orientación vertical, así que no se duplicó lógica.

Resultados: `npm test` correcto; `npm run check`, 29 archivos sin errores/advertencias/hints; `npm run build`, ocho páginas estáticas; `npm run check:build`, 162 enlaces/recursos y ocho rutas. Se verificó además SEO con origen reservado de prueba y sin dominio: canonical/hreflang, sitemap, robots y metadatos correctos. El build final no incluye el origen de prueba. `npm audit`: cero vulnerabilidades notificadas. Astro permanece en 7.4.5, sin dependencias nuevas ni cambios en Vercel. Sin commit ni despliegue.


Verificación final de las cinco capturas: `npm run check:browser` pasa **96 casos** (8 páginas × 6 anchos × 2 temas). Comprueba cinco imágenes únicas, asignación exacta de los grupos Django/FastAPI, carga y dimensiones naturales desde dist, proporciones, ancho acotado del mapa, alt descriptivos, foco visible y navegación por Tab en los cinco enlaces, temas/idiomas, menú, tabla, desplegables y reduced motion. Sin imágenes rotas, desbordamientos de página ni fallos de contraste DOM detectados. Se generaron 28 PNG y `browser-results.json` en `.verification/iteration-6-complete/`; se revisaron los seis PNG ES de DISTANS a 375/768/1440 px en ambos temas. No falta ninguna de las cinco imágenes. Pendientes generales: lectores de pantalla, otros motores y dispositivos físicos; el contraste del texto incrustado en los PNG no se certifica con las pruebas DOM. Sin commit ni despliegue.


## Iteración 7 — Puerto Dataspace EDC (2026-11-10)

**Se incorporaron las seis capturas previstas**, dos por página, tras inspeccionar los doce originales. Rama `content/professional-projects`, con todos los cambios anteriores preservados. La ubicación real era `public/images/projects/puerto-dataspace/`; `public/puerto-dataspace/` no existía. Ningún original estaba bajo seguimiento Git. No fue necesario modificar el índice.

Inventario completo: todos los archivos son PNG; ninguno repite hash exacto, aunque varios solapan contenido.

| Página | Original | Dimensiones | Bytes | Selección / motivo |
| --- | --- | --- | --- | --- |
| dashboard | Captura de pantalla 2026-11-10 205558.png | 1917 × 865 | 112081 | Seleccionada → `dashboard/resultado.png` |
| dashboard | Captura de pantalla 2026-11-10 210144.png | 1917 × 860 | 121746 | Descartada: EDR con fragmentos de token y URLs; solapa el resultado de proveedores. |
| dashboard | Captura de pantalla 2026-11-10 211219.png | 1917 × 863 | 187174 | Descartada: logs/flujo global, menor valor visual y solapamiento. |
| dashboard | Captura de pantalla 2026-11-10 211241.png | 1917 × 846 | 173571 | Seleccionada → `dashboard/providers.png` |
| dashboard | Captura de pantalla 2026-11-10 211305.png | 1906 × 851 | 165270 | Descartada: timeline extenso, principalmente etapas SKIPPED. |
| manual-flow | Captura de pantalla 2026-11-10 211918.png | 1917 × 868 | 120193 | Descartada: selección/catálogo, solapamiento con la negociación y direcciones internas. |
| manual-flow | Captura de pantalla 2026-11-10 211955.png | 1917 × 861 | 131395 | Seleccionada → `manual-flow/negociacion.png` |
| manual-flow | Captura de pantalla 2026-11-10 212036.png | 1917 × 868 | 85673 | Seleccionada → `manual-flow/transferencia.png` |
| provisioning | Captura de pantalla 2026-11-10 212513.png | 1917 × 867 | 89138 | Descartada: Asset y backend interno; se priorizan Policy y Contract. |
| provisioning | Captura de pantalla 2026-11-10 212552.png | 1917 × 870 | 94145 | Seleccionada → `provisioning/policy.png` |
| provisioning | Captura de pantalla 2026-11-10 212638.png | 1917 × 873 | 107212 | Seleccionada → `provisioning/contract.png` |
| provisioning | Captura de pantalla 2026-11-10 212717.png | 1917 × 868 | 128857 | Descartada: resumen redundante con claves y endpoints internos. |

Los doce originales se copiaron a `.verification/iteration-7/originals/`, se verificaron SHA-256 y después se retiró la carpeta pública mediante un traslado a `.verification/iteration-7/source-originals/`. Se verificó nuevamente que ambas copias privadas contienen los doce archivos idénticos byte a byte. Ambas rutas están excluidas de Git y no forman parte de dist. No se eliminó permanentemente ningún original.

Riesgos observados: claves API visibles, fragmentos bearer/EDR, URLs internas y valores de oferta, negociación, acuerdo, ejecución y transferencia. Los identificadores de activos, políticas y contenedores del escenario simulado se conservan para explicar sus relaciones; no se tratan como credenciales. No se infiere vigencia real de ninguna clave/token. Si alguno se utiliza en servicios accesibles, su propietario debe revocarlo o rotarlo: esta tarea no modifica servicios y el saneamiento no invalida credenciales.

Saneamiento: trece rectángulos opacos en cinco capturas; la captura de estados por proveedor no contenía los valores sensibles observados y se reencodificó sin cambiar píxeles. Se utilizó sharp ya instalado por Astro, sin dependencias nuevas, para reemplazar exactamente los píxeles y reencodificar PNG sin metadatos ni capas. Verificación exhaustiva de todos los píxeles: cada región cubierta contiene únicamente el color opaco y cada píxel exterior coincide con el original. Las seis salidas se revisaron visualmente. El procedimiento local reproducible y sus coordenadas están en `.verification/iteration-7/sanitize.mjs`, junto al respaldo, ignorado por Git. No se utilizaron desenfoques ni generación de contenido.

Copias públicas en `public/images/projects/puerto-dataspace-edc/`, agrupadas en dashboard, manual-flow y provisioning. El total es 569681 bytes, aproximadamente 556 KiB. Se conservaron dimensiones y estados SUCCESS/CLEARED/FINALIZED/STARTED/SKIPPED; no se simularon resultados. Se aclaró que el dashboard corresponde a smoke test y que STARTED no equivale a proceso finalizado. No se ejecutó el prototipo ni se presentaron integraciones con autoridades reales.

La galería se comparte con DISTANS a través de `ProjectGallery.astro`, que reutiliza `ProjectScreenshot.astro`. EDC usa imágenes anchas, texto y acceso al raster público a tamaño original; el texto incrustado en las miniaturas móviles requiere abrir ese enlace. `projects.ts` centraliza grupos, descripciones, notas, alt y captions ES/EN. DISTANS mantiene sus cinco PNG y comparativa; AURA mantiene el concepto. Se conservan las interfaces anteriores de datos, con una propiedad gallery opcional. No se modificaron dependencias ni Vercel.

Archivos: nuevo `ProjectGallery.astro`, ajustes en `ProjectCaseStudy.astro`, `ProjectDetail.astro`, `projects.ts` y CSS; seis PNG revisados; nuevo `config/edc-public-images.json` y `scripts/check-public-images.mjs`; ampliaciones de scripts de configuración/build/navegador; script build de package.json; README y documentación. El lockfile y las versiones permanecen sin cambios. `docs/project-evidence.md` añade únicamente la procedencia y límites de esta evidencia visual.

Comprobación de privacidad incorporada antes y después del build: hashes SHA-256 de seis archivos revisados, dimensiones, estructura PNG sin metadatos, ausencia de los hashes de los doce originales aunque se renombren, rutas privadas y rutas originales. Pruebas negativas locales: un original renombrado se rechaza; un raster revisado alterado también. Esto verifica los archivos conocidos, no detecta automáticamente secretos en cualquier nueva imagen: toda incorporación requiere inspección y nueva revisión del manifiesto.

Resultados reales con Node 22.23.4 y Astro 7.4.5:

| Comprobación | Resultado |
| --- | --- |
| `npm test` | Correcto: dominio, configuración opcional de imágenes y exclusión de originales |
| `npm run check` | 31 archivos, 0 errores, 0 advertencias y 0 hints |
| `npm run build` | Ocho páginas estáticas; controles de privacidad public/dist correctos |
| `npm run check:build` | Ocho rutas ES/EN, 174 enlaces/recursos y anclas, seis EDC y cinco DISTANS |
| SEO con origen reservado de prueba | Canonical, hreflang, sitemap, robots y metadatos correctos; salida final restaurada sin dominio de prueba |
| `npm audit` | 0 vulnerabilidades notificadas |
| `npm run check:browser` con preview en 4347 | 96 casos correctos, ocho páginas × seis anchos × dos temas |

Chrome comprobó carga desde dist, seis imágenes EDC únicas y sus tres grupos, dimensiones/proporciones, alt, ausencia de imágenes rotas, contraste DOM, ausencia de desbordamiento de página, Tab/foco visible en seis enlaces EDC y cinco DISTANS, menú/Escape, idioma/rutas/hash, temas/persistencia, almacenamiento bloqueado, reduced motion, tabla y desplegables. Las rutas originales y una ruta de respaldo respondieron HTTP 404. Los hashes de los doce originales están ausentes de todos los archivos de public y dist. Los metadatos PNG publicados no contienen la fuente original ni datos reversibles.

Se generaron 40 PNG y browser-results.json en `.verification/iteration-7/browser/`. Se revisaron visualmente los seis PNG ES de EDC en 375, 768 y 1440 px, ambos temas, además de las seis copias públicas saneadas. Estos controles no certifican accesibilidad ni el contraste del texto dentro de los raster. Pendientes: lectores de pantalla, otros motores/dispositivos, comprobar o rotar valores expuestos si siguen vigentes y revisión del hosting cuando se publique. Preview se detuvo al terminar. Sin commit, despliegue ni modificaciones externas.

## Iteración 8 — verificación del 17-11-2026

Rama inicial: content/professional-projects; árbol limpio antes de editar. Se mantiene Astro 7.4.5, Node 22.23.4, TypeScript estricto, CSS nativo y SSG. No se modifican dependencias, lockfile, configuración de despliegue, imágenes ni datos técnicos de EDC. Una comparación de los datos contra HEAD confirmó que DISTANS solo añade contexto académico y su nota de procedencia; conserva íntegro el caso de estudio.

AURA se presenta como proyecto de 17 personas, con repositorio de equipo, tres ejes técnicos visibles y detalles secundarios en desplegables. Las fuentes permanentes y atribuciones limitadas a PR están en project-evidence.md. No se ejecutaron AURA ni sus pruebas, servicios o integraciones.

| Comprobación | Resultado real |
| --- | --- |
| npm test | Correcto: configuración y privacidad |
| npm run check | 31 archivos; cero errores, advertencias e hints |
| npm run build | Ocho páginas estáticas y barreras de privacidad public/dist correctas |
| npm run check:build | Ocho páginas, 174 enlaces/recursos y anclas; ES/EN y metadatos correctos |
| SEO con dominio reservado de prueba | Canonical, hreflang, sitemap y robots correctos; dist restaurado sin ese dominio |
| npm audit | Salida 1: un aviso moderado directo en Astro, GHSA-r3h5-4585-7x3w; véase security-audit.md |
| npm run check:browser | Correcto: 96 casos con preview local en 4347 |

Chrome comprobó ocho rutas, seis anchos (320/375/430/768/1024/1440), ambos temas, ausencia de desbordamiento de página, contraste DOM, idioma y hash, persistencia/sistema/almacenamiento bloqueado, menú móvil/Escape, movimiento reducido y teclado/foco visible. Se verificaron las etiquetas académicas ES/EN, nota global sin calificación por implementación, equipo AURA y enlace al repositorio, sus tres puntos técnicos y ausencia de galería ficticia. También pasan las cinco imágenes DISTANS, seis EDC y las rutas privadas con HTTP 404.

Se generaron 52 PNG y browser-results.json en .verification/iteration-8 (ignorados por Git). Revisión visual de doce capturas ES: DISTANS y AURA a 375/768/1440 en claro y oscuro. Las miniaturas conservan acceso al original; el contraste DOM no certifica texto incrustado en imágenes. El primer intento de navegador coincidió con la regeneración de dist y falló; se repitió completo contra la salida estable, con los 96 casos correctos.

Pendientes: alcance académico exacto de la evaluación de DISTANS; responsabilidades adicionales de AURA, ejecución real de sus servicios y suites, capturas públicas autorizadas, lectores de pantalla y otros motores/dispositivos. Antes de publicar: revisar el parche de Astro (corregido desde 7.4.7, retenido en 7.4.5 por instrucción), configurar SITE_URL definitivo y repetir comprobaciones. La salida estática funciona; la auditoría no está limpia. Sin commit, despliegue ni cambios externos.

## Iteración 9 — validación final del 17-11-2026

Estado vigente: **apto técnicamente para publicación estática**, sujeto a configurar el dominio real y Node compatible en el hosting. Astro **7.4.5 → 7.4.12**, último parche estable de la rama 7.4.x consultado en npm. Corrige GHSA-r3h5-4585-7x3w (parche desde 7.4.7). No se realizó migración mayor de Astro ni se modificaron funcionalidades, proyectos, CSS, arquitectura, configuración o sistema de imágenes.

Se conservó la rama content/professional-projects y todo el trabajo pendiente de iteración 8. Antes de instalar se guardaron hashes de sus archivos y copia del lockfile en .verification/iteration-9. Una comparación posterior confirmó que los archivos pendientes ajenos a los tres documentos autorizados permanecen idénticos byte a byte. Esta iteración solo modifica package.json, package-lock.json, README.md, docs/security-audit.md y este informe. docs/project-evidence.md conserva exactamente el estado previo.

| Verificación ejecutada | Resultado real |
| --- | --- |
| npm ci --include=optional | Correcto; 270 paquetes instalados con Node 22.23.4 |
| npm audit --json | Salida 0; cero vulnerabilidades notificadas |
| npm test | Correcto; dominio, imágenes opcionales y controles de privacidad |
| npm run check | 31 archivos, cero errores, advertencias e hints |
| npm run build | Ocho páginas estáticas; controles public/dist correctos |
| npm run check:build | Ocho páginas y 174 enlaces/recursos/anclas correctos |
| Build SEO con SITE_URL HTTPS reservado | Canonical, hreflang, sitemap y robots correctos; dist restaurado después sin dominio de prueba |
| npm run check:browser con preview en 4347 | Correcto: 96 casos (8 páginas × 6 anchos × 2 temas) |

Chrome comprobó los tres proyectos ES/EN, cinco capturas DISTANS, seis EDC saneadas y únicas, fallback conceptual AURA sin galería ficticia, etiquetas académicas y equipo, menú móvil, Escape, rutas, idioma y hash, temas/persistencia/sistema/almacenamiento bloqueado, movimiento reducido, enlaces mediante teclado y foco visible. Se comprobaron contraste DOM y ausencia de desbordamiento de página en 320/375/430/768/1024/1440 px, incluidos desplegables abiertos. Las rutas conocidas de originales y respaldo siguen devolviendo 404. Las barreras de privacidad comprueban hashes de imágenes revisadas y excluyen los doce originales conocidos y rutas privadas; no constituyen un detector general de secretos nuevos.

Artefactos locales ignorados: .verification/iteration-9/audit.json, dependency-changes.json y browser/browser-results.json junto a 52 PNG. Esta iteración ejecuta comprobaciones automatizadas de navegador; no certifica accesibilidad completa, lectores de pantalla, todos los dispositivos/motores ni texto incrustado en imágenes.

La configuración sigue en output: static, sin adaptador SSR y sin @astrojs/node instalado. dist contiene las ocho páginas, endpoints estáticos sitemap/robots y recursos. Las dependencias transitivas y su exposición están documentadas en security-audit.md; no quedan avisos conocidos según la auditoría ejecutada. Se mantiene Node >=22.23.4 <23 y .nvmrc 22.23.4.

Para publicar, cuando se autorice: seleccionar Node 22.x con parche >=22.23.4 en Vercel, configurar SITE_URL con el origen HTTPS definitivo (sin ruta/query/fragmento), usar el vercel.json existente (npm ci, npm run build, dist) y repetir las comprobaciones con ese dominio antes del despliegue. Comprobar entonces dominio, redirecciones, cabeceras y rutas en el hosting real. No se ha validado ni realizado despliegue remoto. Preview local se detuvo al terminar; no se crearon commits ni se modificaron servicios externos. Los pendientes de evidencias académicas y de AURA registrados en iteración 8 siguen vigentes, sin cambiar su documentación.
