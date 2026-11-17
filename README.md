# Alberto Paleteiro — Portfolio

Portfolio estático bilingüe con Astro, TypeScript estricto y CSS nativo. Español en `/` e inglés en `/en/`. Sin backend ni frameworks de interfaz adicionales.

Perfil: **Ingeniero del Software | Full-stack Developer** / **Software Engineer | Full-stack Developer**. Tres proyectos destacados, en este orden: **DISTANS**, **Puerto Dataspace EDC** y **AURA**. Se mantienen ocho páginas estáticas; el simulador de ciberataques ya no se publica.

## Requisitos y desarrollo

Node.js **22.23.4 o posterior dentro de la rama 22**, npm y Git. Astro **7.4.12**, verificado con Node **22.23.4**. `.nvmrc` fija esa versión. Node 20.11 no es compatible; en Vercel selecciona **22.x** con parche al menos **22.23.4**.

```sh
npm ci
npm run dev
```

Abre la dirección que imprime Astro, normalmente `http://localhost:4321`.

En PowerShell con fnm, activa primero la versión del proyecto en cada terminal nueva:

```powershell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
fnm use 22.23.4
node -v
npm -v
```

Si aparece `Cannot find native binding` de Rolldown después de instalar con un Node anterior, ejecuta `npm ci --include=optional` con Node 22.23.4 activo y vuelve a iniciar `npm run dev`. El lockfile incluye el binding nativo de Windows: no es necesario borrarlo ni añadir el fallback WASM como dependencia del proyecto.

| Comando | Uso |
| --- | --- |
| `npm run dev` | Desarrollo local |
| `npm run check` | Comprobación de Astro y TypeScript |
| `npm run build` | Comprobación y compilación estática en `dist/` |
| `npm run preview` | Servidor de la compilación |
| `npm test` | Validación de la configuración de dominio |
| `npm run check:build` | Rutas, enlaces, anclas y SEO en `dist/` |
| `npm run check:browser` | 96 casos de navegador contra preview local; Chrome/Edge instalado |

## Estructura

```text
src/
  components/   Home, Header, Footer, SocialLinks, ProjectArt, ProjectDetail, ProjectSections, ProjectCaseStudy
  layouts/      BaseLayout: documento, SEO y estructura común
  data/         profile.ts y projects.ts
  i18n/         ui.ts: interfaz y tipo Locale
  lib/          content.ts: exportaciones compatibles con el starter
  pages/        Inicio, rutas dinámicas ES/EN, sitemap y robots
  styles/       global.css: variables, temas y responsive
  utils/        routes.ts: enlaces mediante astro:i18n
public/         Favicon y archivos públicos opcionales
config/         Validación del origen de producción
scripts/        Comprobaciones sin dependencias adicionales
docs/           Informes de seguridad y preparación de producción
```

## Traducciones y proyectos

Edita `src/i18n/ui.ts` para los textos de interfaz en ambos idiomas. El contenido de proyectos está en `src/data/projects.ts`, tipado mediante `Project` y `Record<Locale, ProjectContent>`. Astro configura los idiomas en `astro.config.mjs`.

Para añadir un proyecto, incorpora un objeto con slug único, etiquetas y contenido completo en `es` y `en`. Las dos rutas `[slug].astro` usan `getStaticPaths()` para generar las páginas automáticamente. El selector conserva el proyecto equivalente y el fragmento de sección. Añade `repository` y `website` únicamente con URLs reales; `results` es opcional y debe contener resultados documentados. `technologies` permite ampliar las etiquetas de la ficha; `sections` añade apartados desplegables con fuentes; `comparison` contiene la tabla Django/FastAPI. `implementations` presenta los dos bloques de implementación; `concurrency` describe el caso visible; `keyPoints` resume otras fichas. Las referencias se agrupan en un desplegable secundario. Cada idioma incluye `evidenceNote` para explicar el alcance de la verificación.

Las ilustraciones geométricas CSS se etiquetan como conceptuales; no son capturas ni documentación real de los sistemas. DISTANS reúne las implementaciones Django y FastAPI, ambas inspeccionadas y enlazadas. Su caso de estudio muestra las estrategias de reserva de stock y una comparación basada en código. Puerto EDC explica un demostrador local con datos mock y condiciones de acceso de la demo. AURA se documenta mediante revisión estática del repositorio del equipo, con atribución colaborativa y límites explícitos. Las fuentes fijadas a commits, limitaciones y datos pendientes están en [docs/project-evidence.md](docs/project-evidence.md). No se ejecutaron las aplicaciones externas ni sus suites de pruebas.

## Enlaces personales y CV

Configura `name`, `email`, `github` y `linkedin` en `src/data/profile.ts`. El nombre de títulos y metadatos procede también de este archivo. Los enlaces vacíos se omiten. Sin canales configurados, contacto muestra un mensaje informativo.

Coloca el CV en `public/`, por ejemplo `public/cv.pdf`, y configura `cv: '/cv.pdf'`. El botón aparece únicamente si el archivo existe durante la compilación. Recompila tras añadirlo. Los archivos públicos son descargables por cualquier visitante.

## Temas y accesibilidad

El tema inicial respeta `prefers-color-scheme`. Un script en el head aplica la preferencia guardada antes de presentar el contenido, con localStorage protegido frente a errores. El menú móvil usa HTML nativo y Escape permite cerrarlo con JavaScript. Se incluyen enlace de salto, foco visible, navegación activa, controles etiquetados, estructura semántica y reducción de movimiento. Los estilos contemplan pantallas desde 320 px.

Se revisó Chrome headless en 320, 375, 768, 1024 y 1440 px, ambos temas y ambos idiomas: sin desbordamientos ni fallos de contraste de texto detectados. El objetivo es WCAG 2.2 AA; quedan pendientes lectores de pantalla, otros motores y dispositivos físicos. No es una certificación de accesibilidad.

## SEO y dominio

Exporta **`SITE_URL` con el origen real de producción** antes de compilar. `.env.example` documenta la variable. La configuración lee `process.env.SITE_URL`; defínela en la terminal o en Vercel, no solo en un archivo `.env`.

La validación está centralizada en `config/site.mjs`: rechaza credenciales, rutas, queries y fragmentos. Con `VERCEL_ENV=production`, la compilación falla si falta el origen o no usa HTTPS.

En PowerShell:

```powershell
$env:SITE_URL = 'https://tu-dominio-real'
npm run build
```

Sustituye el valor ilustrativo por tu URL auténtica. Sin `SITE_URL` se omiten canonical, hreflang absolutos y `og:url`; el sitemap queda vacío y robots no anuncia sitemap. Con la variable definida se generan canonical por página, alternates ES/EN y x-default, y ocho URLs en `/sitemap.xml`. Todas las páginas tienen título, descripción, Open Graph y Twitter Card de resumen. No se declara una imagen social inexistente.

## Vercel

1. Sube el repositorio a GitHub e impórtalo en Vercel.
2. Selecciona el preset Astro y Node 22.x con versión al menos 22.23.4.
3. Configura `SITE_URL` con el origen de producción.
4. Usa `npm run build` como compilación y `dist` como salida.

`vercel.json` fija preset Astro, instalación `npm ci`, compilación `npm run build`, salida `dist` y barra final. No requiere adaptador de servidor. No se ha publicado ni modificado ningún servicio externo. Los [pasos completos de publicación](docs/production-readiness.md) incluyen dominio, variables de entorno, DNS y verificaciones posteriores.

## Verificación y pendientes

Consulta el [informe de preparación](docs/production-readiness.md) para las verificaciones reales, límites y comandos reproducibles. Con Node 22.23.4 pasaron tests de configuración, comprobaciones de tipos, `npm run build`, ocho rutas estáticas y 152 enlaces internos/recursos en el HTML generado. Node global permanece sin cambios.

También se ejecutaron **80 casos reales en Chrome headless** e interacciones de tema, idioma y menú móvil. Las capturas y los resultados se guardan en `.verification/`, ignorado por Git. Una compilación con origen reservado `.invalid` validó el SEO de producción; ese origen se retira de la compilación local final.

Se completó la migración controlada **Astro 5.18.2 → 6.4.8 → 7.4.5** en `chore/astro-security-upgrade`. Tras una instalación limpia con `npm ci`, la auditoría pasó de **5 paquetes afectados (1 crítico, 3 altos y 1 bajo) a 0 vulnerabilidades notificadas**. Astro queda fijado en 7.4.5; el lockfile instala esbuild 0.28.2, sharp 0.35.5 y zod 4.6.7. zod-to-ts ya no forma parte del árbol. No se usaron overrides ni `npm audit fix --force`.

Se conservaron íntegramente los componentes, configuración, diseño y datos personales. La regresión vuelve a pasar: tests, tipos, build, verificación de dist y los 80 casos de navegador. El [informe de seguridad](docs/security-audit.md) detalla versiones y auditorías; el [informe de preparación](docs/production-readiness.md) recoge las pruebas y pasos de publicación. El resultado es apto técnicamente para despliegue estático con Node compatible y `SITE_URL` auténtico; no se ha desplegado. Una auditoría sin avisos no garantiza ausencia de vulnerabilidades desconocidas.

Pendiente de aportar: email, perfiles sociales, repositorios, CV, dominio y detalles internos/resultados documentados de proyectos. Estos datos no se han inventado.

Los repositorios públicos confirmados de DISTANS FastAPI y Puerto Dataspace EDC sí están configurados en sus fichas. Sigue pendiente el repositorio de AURA y la confirmación de sus funciones implementadas frente a previstas. Django ya está verificado junto a FastAPI. Las pruebas de build comprueban selección, orden, enlaces públicos y ausencia del proyecto retirado; las de navegador abren los apartados técnicos para comprobar también su contenido responsive.

## Iteración visual y técnica 4

Inicio con hero más compacto y tarjetas de dimensiones coherentes. Las fichas muestran un máximo de seis tecnologías iniciales, resumen de problema/solución y claves técnicas. DISTANS añade dos bloques de implementación, concurrencia visible, comparativa, síntesis de pruebas y conclusiones; las fuentes y detalles adicionales permanecen disponibles en desplegables. No se añadieron dependencias ni se cambió Astro, los slugs o la configuración de Vercel.

La inspección confirmó Haversine en Python en ambos catálogos: no se presenta como implementada una diferencia de consultas espaciales PostGIS. Django reserva con `atomic` y bloqueo de productos; FastAPI con `UPDATE` condicionado y `rowcount`. La explicación completa, fuentes permanentes y límites están en [project-evidence.md](docs/project-evidence.md).

Para guardar las capturas de navegador en una carpeta propia, inicia preview y define `QA_OUTPUT_DIR` antes de `npm run check:browser`, por ejemplo `$env:QA_OUTPUT_DIR = '.verification/iteration-4'`. Se capturan inicio y DISTANS, incluidos 375, 768 y 1440 px, en ambos temas. La prueba comprueba también el enlace de salto, los desplegables por teclado y que la tabla cabe en escritorio.


## Refinamiento visual 5 y capturas reales

`ProjectVisual.astro` comparte la presentación entre inicio y las tres fichas. Sin `screenshot` en `src/data/projects.ts`, conserva `ProjectArt.astro`. No se han añadido capturas ficticias ni imágenes externas.

Para añadir una captura auténtica:

1. Guarda el archivo en `public/images/projects/` (PNG, JPEG, WebP o AVIF; nombres sin espacios).
2. Añade `screenshot` al objeto del proyecto, junto a `slug`. Usa sus dimensiones reales y describe lo que muestra en ambos idiomas:

```ts
screenshot: {
  src: '/images/projects/distans.png',
  width: 1600, // sustituir por el ancho real en píxeles
  height: 900, // sustituir por el alto real
  alt: {
    es: 'Descripción concreta de la pantalla real de DISTANS',
    en: 'Specific description of the actual DISTANS screen',
  },
},
```

3. Ejecuta `npm test`, `npm run build` y `npm run check:build`; revisa la imagen con preview en ambos temas e idiomas. La compilación rechaza archivos ausentes, rutas externas, dimensiones inválidas o traducciones vacías. Para volver al concepto, elimina la propiedad `screenshot`.

Las imágenes conservan su proporción con `object-fit: contain`, sin recortar su contenido. Las tarjetas cargan imágenes de forma diferida; la ficha usa carga inmediata. Los atributos width/height reservan la proporción, pero deben coincidir con el archivo aportado.

El esquema de concurrencia muestra dos compradores, inventario, control transaccional y dos resultados sin vincular ninguno a un comprador. Los mecanismos técnicos y datos de la comparativa se conservan. La tabla tiene columnas separadas y una indicación de desplazamiento con teclado en móvil; las etiquetas y listas técnicas tienen mayor legibilidad en pantallas pequeñas.

Las pruebas de navegador incluyen ahora 430 px además de 320, 375, 768, 1024 y 1440, ambos idiomas y temas. Guarda esta iteración con `$env:QA_OUTPUT_DIR = '.verification/iteration-5'` antes de `npm run check:browser`, con preview iniciado.


Resultado de esta iteración: tests, tipos (28 archivos sin diagnósticos), build estático, ocho rutas/152 enlaces y recursos, SEO con y sin origen, y 96 casos de navegador correctos. `npm audit`: 0 avisos. Se guardaron 28 capturas en `.verification/iteration-5/`; los seis PNG de DISTANS de 375/768/1440 px y ambos temas se revisaron visualmente. El [informe de preparación](docs/production-readiness.md) recoge resultados y límites. Pendiente incorporar y revisar imágenes auténticas, lectores de pantalla y otros navegadores. Sin commit ni despliegue.


## Iteración 6 — capturas de DISTANS FastAPI

Las dos capturas aportadas están en `public/images/projects/distans-fastapi-catalogue.png` (1896 × 875) y `distans-fastapi-products.png` (1897 × 871). Son copias sin editar de las vistas de catálogo/comprador y gestión de productos/vendedor, respectivamente. No se incorporó la captura de cuentas con correo personal: no forma parte de los archivos publicados.

Los visuales por implementación se centralizan en `projects.ts`, bajo `implementationScreenshots.fastapi`. Cada entrada contiene `src`, dimensiones reales, `alt` y `caption` traducidos a ES/EN. El `visualId` de cada implementación enlaza con esa clave sin duplicar archivos entre idiomas.

El hero y las tarjetas de inicio siguen usando la ilustración conceptual. En la ficha, FastAPI muestra el catálogo en su tarjeta y una secuencia a ancho completo con ambas capturas. El catálogo reutiliza el mismo archivo, que el navegador puede cachear. Cada figura permite abrir el PNG original en otra pestaña; en móvil es la opción para inspeccionar texto pequeño. No hay recortes, filtros de tema sobre las imágenes, carrusel ni JavaScript adicional.

`ProjectScreenshot.astro` comparte renderizado/validación con `ProjectVisual.astro`. Las imágenes usan dimensiones explícitas, proporción original y carga diferida. Los enlaces tienen foco visible y nombres accesibles que identifican la captura y la nueva pestaña.

Para añadir capturas auténticas de Django:

1. Guarda los archivos revisados en `public/images/projects/`, sin datos sensibles.
2. Añade un array `django` junto a `fastapi` dentro de `implementationScreenshots` de DISTANS. Usa la misma estructura de las entradas existentes: `src`, `width`, `height`, `alt: { es, en }`, `caption: { es, en }`, con textos y dimensiones reales.
3. Ya existe `visualId: 'django'` en las dos traducciones. Las imágenes aparecerán una sola vez en el grupo Django de la sección de interfaces.
4. Si no hay capturas, omite la clave o usa un array vacío: permanece la tarjeta de texto que remite a las referencias técnicas. El hero conceptual se conserva mientras no configures el `screenshot` general del proyecto.
5. Ejecuta las comprobaciones y revisa preview. Las pruebas de regresión actuales verifican expresamente que solo FastAPI tiene las dos imágenes aprobadas; cuando aportes Django, actualiza esas expectativas en `scripts/check-build.mjs` y `scripts/check-browser.mjs` para incluir únicamente los nuevos archivos revisados.

Puerto Dataspace EDC y AURA conservan sus fallbacks y datos. No se añadieron dependencias ni se cambió Astro 7.4.5. Para esta revisión usa `$env:QA_OUTPUT_DIR = '.verification/iteration-6'` antes de `npm run check:browser`, después de terminar el build y arrancar preview.


Verificación real: `npm test`, `npm run check` (29 archivos sin diagnósticos), `npm run build` (8 páginas), `npm run check:build` (158 enlaces/recursos), `npm audit` (0 avisos) y `npm run check:browser` (96 casos) correctos. El navegador comprueba también carga/dimensiones/proporciones de los PNG y Tab/foco visible en los enlaces al original. Se guardaron 28 capturas; se revisaron visualmente los seis PNG ES de DISTANS en 375/768/1440 y ambos temas. El [informe](docs/production-readiness.md) detalla resultados y límites, incluida la lectura de imágenes de escritorio desde móvil.


## Ampliación de interfaces DISTANS — 2026-11-10 (estado inicial parcial)

Estado actual: **2 de las 5 capturas solicitadas disponibles como archivos locales**. Se reutilizan sin renombrar ni duplicar `distans-fastapi-catalogue.png` (1896 × 875, 245467 bytes) y `distans-fastapi-products.png` (1897 × 871, 139230 bytes), en `public/images/projects/`. Los alt y captions siguen los textos ES/EN de la nueva selección.

Las tres nuevas imágenes se ven en el chat, pero no se encontraron como archivos en el workspace, el directorio del adjunto ni el Escritorio. Faltan para completar la selección:

- `public/images/projects/distans/django-catalogo.png`: catálogo Django.
- `public/images/projects/distans/django-carrito.png`: carrito Django.
- `public/images/projects/distans/fastapi-mapa-mobile.png`: mapa móvil FastAPI.

No se crearon imágenes ficticias ni referencias a archivos inexistentes. La captura de administración de cuentas con correo permanece excluida.

La sección **DISTANS en funcionamiento / DISTANS in action** va después de las dos tarjetas y antes del diagrama de concurrencia. Cada implementación con imágenes configuradas tiene su grupo; actualmente solo FastAPI. Se eliminó la repetición del catálogo en la tarjeta para mostrar cada captura una sola vez. La cuadrícula usa dos columnas en escritorio y una hasta 800 px. Las imágenes verticales se detectan por sus dimensiones y se limitan a 280 px de ancho sin recortar controles ni marcadores. El hero conserva su ilustración conceptual.

Al disponer de los nuevos PNG, revisa privacidad, dimensiones y peso reales; añádelos a `implementationScreenshots.django` (dos entradas) y al array `fastapi` (mapa). Cada entrada usa `src`, `width`, `height`, `alt: { es, en }` y `caption: { es, en }`. Reutiliza las rutas anteriores para FastAPI. No es necesario cambiar el componente: `visualId` ya relaciona los dos frameworks en ambos idiomas. Una clave ausente o un array vacío omite ese grupo; `ProjectVisual` mantiene el concepto si falta `project.screenshot`.

Para otros proyectos, `project.screenshot` permite una imagen principal; proyectos con implementaciones pueden usar `implementationScreenshots` y sus `visualId`. Las figuras comparten `ProjectScreenshot.astro`, dimensiones explícitas, `loading="lazy"`, proporción original y enlace al PNG para leer textos pequeños. No se aplicaron compresión ni cambios de formato a los dos PNG disponibles: suman unos 376 KiB y se prioriza su texto original.

Actualiza las listas de archivos aprobados en `check-build.mjs` y `check-browser.mjs` cuando se incorporen los tres archivos restantes; conserva las comprobaciones de imágenes únicas, carga, dimensiones, alt, teclado y asociación por framework. Las pruebas actuales verifican únicamente los dos archivos físicamente disponibles y no certifican cinco capturas.


Verificación del estado parcial (2026-11-10): tests, tipos (29 archivos sin diagnósticos), build (8 páginas), check:build (156 enlaces/recursos; SEO con y sin dominio de prueba), audit (0 avisos) y navegador (96 casos) correctos. Capturas en `.verification/iteration-6-expanded/`; revisión visual de DISTANS en 375/768/1440 px y ambos temas. Estos resultados cubren solo las dos imágenes disponibles: **faltan los tres archivos nuevos para completar las cinco**.


## Galería completa de DISTANS — 2026-11-10

**Las cinco capturas reales ya están disponibles y configuradas.** Este estado sustituye el bloqueo por archivos ausentes descrito en el apartado anterior. No se duplicaron, renombraron ni editaron los PNG anteriores. Los tres archivos nuevos aportados se reutilizan desde `public/images/projects/`:

| Grupo | Archivo | Dimensiones | Peso |
| --- | --- | --- | --- |
| Django | `django-catalogo.png` | 522 × 444 | 57507 bytes |
| Django | `django-carrito.png` | 590 × 353 | 45779 bytes |
| FastAPI | `distans-fastapi-catalogue.png` | 1896 × 875 | 245467 bytes |
| FastAPI | `distans-fastapi-products.png` | 1897 × 871 | 139230 bytes |
| FastAPI | `fastapi-mapa-mobile.png` | 271 × 559 | 80604 bytes |

La sección «DISTANS en funcionamiento / DISTANS in action» tiene dos grupos, Django (2) y FastAPI (3), entre las tarjetas de implementación y el diagrama. Las cinco imágenes aparecen una sola vez. El mapa conserva toda su captura vertical y controles con un ancho máximo de 280 px; las otras imágenes conservan también sus proporciones. En móvil la cuadrícula usa una columna. Los enlaces al original permiten leer texto pequeño.

La configuración completa está en `implementationScreenshots` de DISTANS, en `src/data/projects.ts`. Para añadir una imagen, guarda su archivo revisado en la carpeta pública y añade una entrada al grupo correspondiente con ruta, dimensiones reales, `alt` y `caption` en ES/EN. No dupliques el archivo por idioma. Los `visualId` enlazan cada grupo con su implementación. Si falta el grupo o su array está vacío, no se dibuja; el hero y los proyectos sin `screenshot` mantienen su fallback conceptual. El renderizado y la validación se comparten en `ProjectScreenshot.astro` y `ProjectVisual.astro`.

Los cinco archivos suman unos 555 KiB; se conservan en PNG sin recomprimir para preservar el texto. Se inspeccionaron los tres nuevos: corresponden a catálogo/carrito Django y mapa FastAPI, sin correo ni credenciales visibles. El panel de cuentas no forma parte de la selección. No se alteraron contenidos técnicos, diagrama, dependencias ni configuración de Vercel. Las expectativas de build/navegador ya verifican cinco imágenes únicas y la asociación exacta Django/FastAPI.


Verificación final de las cinco capturas: `npm run check:browser` pasa **96 casos** (8 páginas × 6 anchos × 2 temas). Comprueba cinco imágenes únicas, asignación exacta de los grupos Django/FastAPI, carga y dimensiones naturales desde dist, proporciones, ancho acotado del mapa, alt descriptivos, foco visible y navegación por Tab en los cinco enlaces, temas/idiomas, menú, tabla, desplegables y reduced motion. Sin imágenes rotas, desbordamientos de página ni fallos de contraste DOM detectados. Se generaron 28 PNG y `browser-results.json` en `.verification/iteration-6-complete/`; se revisaron los seis PNG ES de DISTANS a 375/768/1440 px en ambos temas. No falta ninguna de las cinco imágenes. Pendientes generales: lectores de pantalla, otros motores y dispositivos físicos; el contraste del texto incrustado en los PNG no se certifica con las pruebas DOM. Sin commit ni despliegue.


## Iteración 7 — Puerto Dataspace EDC

Se incorporan **seis capturas reales revisadas**, dos por grupo, en «El demostrador en funcionamiento / The prototype in action». El dashboard muestra un **smoke test** con datos simulados: `SUCCESS` y `READY_FOR_PICKUP` no se presentan como evidencia de ejecución integral. `SKIPPED` conserva su significado; `STARTED` indica transferencia iniciada, no finalizada. Las capturas no prueban integración con administraciones reales y no se ejecutaron servicios externos durante esta revisión.

Los originales se encontraron en `public/images/projects/puerto-dataspace/`, no en la ruta orientativa `public/puerto-dataspace/`. Se inspeccionaron 12 PNG, se respaldaron fuera de `public/` y se verificaron todos sus SHA-256. Los originales sin modificar se conservan en `.verification/iteration-7/originals/` y `.verification/iteration-7/source-originals/`, ambos ignorados por Git. No están en el resultado estático. No deben copiarse a carpetas públicas ni añadirse a Git.

Copias públicas, exclusivamente saneadas:

```text
public/images/projects/puerto-dataspace-edc/
  dashboard/resultado.png
  dashboard/providers.png
  manual-flow/negociacion.png
  manual-flow/transferencia.png
  provisioning/policy.png
  provisioning/contract.png
```

La selección, dimensiones, descartes y riesgos se detallan en `docs/production-readiness.md`. Claves, URLs internas e identificadores operativos se ocultaron mediante rectángulos opacos aplicados al raster. Se reencodificaron los PNG sin metadatos originales ni capas reversibles. Se verificó píxel a píxel que las máscaras son opacas y que el resto no cambia; después se revisaron visualmente las seis salidas. No se utilizó desenfoque, generación de imágenes ni sustitución de estados. Los identificadores de activos, políticas y contenedores de demostración permanecen para entender sus relaciones. Si una clave o token expuesto siguiera siendo válido, su propietario debe revocarlo o rotarlo: ocultarlo en el PNG no lo invalida. No se han rotado credenciales ni modificado servicios.

`gallery` en `src/data/projects.ts` centraliza título, grupos, descripciones, notas, dimensiones, alt y captions ES/EN de EDC. `ProjectGallery.astro` se comparte con DISTANS y usa `ProjectScreenshot.astro`; DISTANS conserva sus cinco imágenes. EDC usa una columna más ancha para facilitar la lectura de los paneles, con acceso a cada copia saneada a tamaño original. AURA conserva su concepto. No se modificaron dependencias, slugs, contenido técnico previo ni Vercel.

Para nuevas capturas: conserva el original fuera de `public/`, revisa toda la imagen, aplica máscaras opacas a valores sensibles con un editor raster, exporta una imagen aplanada sin metadatos, revisa visualmente el resultado y configura su ruta/dimensiones/alt/caption en el grupo correspondiente. Reutiliza el archivo entre idiomas. Una galería vacía se omite; `ProjectVisual.astro` mantiene el fallback cuando no hay imagen principal.

El script de build ahora comprueba privacidad antes y después de Astro. `scripts/check-public-images.mjs` coteja las seis imágenes con `config/edc-public-images.json`, valida dimensiones y estructura PNG, y rechaza originales conocidos aunque se renombren, rutas privadas y archivos EDC no revisados o modificados. Al aprobar nuevas imágenes, revisa y actualiza el manifiesto de hashes y las expectativas de pruebas; no regeneres hashes a ciegas para eludir un fallo. Esta comprobación protege los archivos revisados y no sustituye la inspección de nuevos raster.

Para las pruebas con preview en otro puerto: `$env:PREVIEW_URL = 'http://127.0.0.1:4347'` y `$env:QA_OUTPUT_DIR = '.verification/iteration-7/browser'` antes de `npm run check:browser`. Arranca previamente `npm run preview -- --host 127.0.0.1 --port 4347` después del build.


Resultados reales: `npm test`, `npm run check` (31 archivos sin diagnósticos), `npm run build` (8 páginas), `npm run check:build` (174 enlaces/recursos), SEO con y sin origen de prueba, `npm audit` (0 avisos) y `npm run check:browser` (96 casos) correctos. Public/dist no contienen los doce originales conocidos ni rutas de respaldo. Pasan las pruebas negativas del control de privacidad. Se generaron 40 PNG; se revisó EDC en 375/768/1440 px y ambos temas. Siguen pendientes lectores de pantalla, otros motores y dispositivos físicos. Los detalles de selección y resultados están en [production-readiness.md](docs/production-readiness.md). Sin commit ni despliegue.


## Iteración 8 — AURA y contexto académico de DISTANS

AURA enlaza al [repositorio del equipo](https://github.com/G4-AURA/AURA) y se presenta como copiloto para guías turísticos, desarrollado por 17 personas según información del propietario. La ficha muestra tres ejes: arquitectura Django, planificación IA y geografía/optimización; los detalles y fuentes están en los desplegables existentes. La revisión está fijada al commit `3c5e491d019ff5606a397c59485a531f447feed0`. No se ejecutó AURA ni se añadieron sus dependencias al portfolio.

Se verificaron código Django/GeoDjango, LangGraph, Gemini, OR-Tools, mapas Leaflet, templates Bootstrap y clientes geográficos. Los checkpoints están en la sesión Django. Celery/Redis y pgvector tienen configuración/dependencias, pero no se afirma generación IA encolada ni búsqueda vectorial activa. STX3837 figura como autor de PR integrados sobre pruebas de tours (#308) y normalización de errores API (#436): se reconocen esas aportaciones sin atribuir el producto o módulos completos a una sola persona. AURA conserva su ilustración conceptual sin galería vacía ni demo inventada.

DISTANS añade tres etiquetas discretas: Trabajo de Fin de Grado, autoría de dos personas y calificación 8,6/10 (8.6/10 en inglés). Son datos aportados por el propietario, no acreditados mediante expediente en esta revisión. La nota corresponde al TFG general; queda pendiente confirmar el alcance exacto de la evaluación y no se asigna una calificación independiente a cada versión. Conserva sus cinco capturas y contenido técnico. EDC conserva datos, seis capturas saneadas y controles de privacidad sin modificaciones.

`ProjectContent.context` centraliza etiquetas localizadas; `Project.repositoryLabel` permite identificar el enlace como repositorio de equipo. Se renderizan en `ProjectDetail.astro` con CSS nativo. No cambian rutas, arquitectura, dependencias ni configuración de despliegue. Las fuentes y límites están en [docs/project-evidence.md](docs/project-evidence.md).

Auditoría del 17-11-2026: **un aviso moderado en Astro 7.4.5**, [GHSA-r3h5-4585-7x3w](https://github.com/advisories/GHSA-r3h5-4585-7x3w). Afecta al endpoint de imágenes con renderizado bajo demanda y adaptador Node en las condiciones descritas por el aviso. Este portfolio usa SSG, no instala `@astrojs/node` ni configura ese endpoint en su salida estática. El aviso permanece en npm audit: no se declara cero vulnerabilidades. La corrección está publicada desde Astro 7.4.7; se mantiene 7.4.5 por la restricción de esta iteración. No se usó audit fix --force ni se cambiaron versiones. Revisar una actualización de parche antes de publicar.

Verificación de iteración 8 (Node 22.23.4): npm test, check (31 archivos sin diagnósticos), build (ocho páginas), check:build (174 enlaces/recursos) y check:browser (96 casos) correctos. SEO comprobado con y sin dominio reservado de prueba. Se generaron 52 PNG en .verification/iteration-8; revisión visual de DISTANS y AURA en 375/768/1440, ambos temas. npm audit conserva un aviso moderado en Astro, documentado arriba. Los resultados históricos de cero avisos no describen la auditoría actual. Detalles, límites y pendientes en docs/production-readiness.md. Sin commit ni despliegue.

## Iteración 9 — actualización de seguridad (17-11-2026)

Estado vigente: **Astro 7.4.12**, actualizado desde 7.4.5 al último parche estable 7.4.x consultado en npm. Corrige [GHSA-r3h5-4585-7x3w](https://github.com/advisories/GHSA-r3h5-4585-7x3w), resuelto desde 7.4.7. Node requerido permanece en >=22.23.4 <23; probado con 22.23.4. No cambian proyectos, estilos, imágenes ni configuración SSG; sin adaptador SSR.

Instalación limpia con npm ci --include=optional correcta. npm audit --json devuelve **cero vulnerabilidades** (salida 0). npm test, npm run check (31 archivos sin diagnósticos), npm run build (ocho páginas), npm run check:build (174 enlaces/recursos) y npm run check:browser (96 casos con preview) correctos. SEO verificado con y sin origen reservado de prueba, luego restaurado dist sin ese dominio. Se conservan las cinco imágenes DISTANS, seis EDC saneadas, fallback AURA y barreras de privacidad. Los avisos y restricciones de Astro 7.4.5 en apartados de iteraciones anteriores son históricos, sustituidos por este resultado.

Solo se modificaron package.json, package-lock.json y estos tres documentos de entrega: README.md, docs/security-audit.md y docs/production-readiness.md. Los cambios pendientes de iteración 8 se conservan. Detalles de dependencias en [security-audit.md](docs/security-audit.md) y pruebas/límites/pasos para publicar en [production-readiness.md](docs/production-readiness.md).

Apto técnicamente para publicación estática; falta configurar el SITE_URL HTTPS real y Node 22.x compatible en Vercel, repetir verificaciones con ese dominio y revisar el hosting cuando se autorice publicar. Sin commit ni despliegue.
