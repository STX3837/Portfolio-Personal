# Alberto Paleteiro — Portfolio

Portfolio estático bilingüe con Astro, TypeScript estricto y CSS nativo. Español en `/` e inglés en `/en/`. Sin backend ni frameworks de interfaz adicionales.

## Requisitos y desarrollo

Node.js **22.19 o posterior** (rama 22 LTS recomendada), npm y Git. Node 20.11 no es compatible con las herramientas instaladas.

```sh
npm ci
npm run dev
```

Abre la dirección que imprime Astro, normalmente `http://localhost:4321`.

| Comando | Uso |
| --- | --- |
| `npm run dev` | Desarrollo local |
| `npm run check` | Comprobación de Astro y TypeScript |
| `npm run build` | Comprobación y compilación estática en `dist/` |
| `npm run preview` | Servidor de la compilación |

## Estructura

```text
src/
  components/   Home, Header, Footer, SocialLinks, ProjectArt, ProjectDetail
  layouts/      BaseLayout: documento, SEO y estructura común
  data/         profile.ts y projects.ts
  i18n/         ui.ts: interfaz y tipo Locale
  lib/          content.ts: exportaciones compatibles con el starter
  pages/        Inicio, rutas dinámicas ES/EN, sitemap y robots
  styles/       global.css: variables, temas y responsive
  utils/        routes.ts: enlaces mediante astro:i18n
public/         Favicon y archivos públicos opcionales
```

## Traducciones y proyectos

Edita `src/i18n/ui.ts` para los textos de interfaz en ambos idiomas. El contenido de proyectos está en `src/data/projects.ts`, tipado mediante `Project` y `Record<Locale, ProjectContent>`. Astro configura los idiomas en `astro.config.mjs`.

Para añadir un proyecto, incorpora un objeto con slug único, etiquetas y contenido completo en `es` y `en`. Las dos rutas `[slug].astro` usan `getStaticPaths()` para generar las páginas automáticamente. El selector conserva el proyecto equivalente y el fragmento de sección. Añade `repository` y `website` únicamente con URLs reales; `results` es opcional y debe contener resultados documentados.

Las ilustraciones son placeholders geométricos en CSS. Los retos describen áreas técnicas del alcance conocido, sin atribuir decisiones internas ni resultados no aportados. Completa las fichas con documentación verificable antes de presentarlas como casos técnicos exhaustivos.

## Enlaces personales y CV

Configura `email`, `github` y `linkedin` en `src/data/profile.ts`. Los enlaces vacíos se omiten. Sin canales configurados, contacto muestra un mensaje informativo.

Coloca el CV en `public/`, por ejemplo `public/cv.pdf`, y configura `cv: '/cv.pdf'`. El botón aparece únicamente si el archivo existe durante la compilación. Recompila tras añadirlo. Los archivos públicos son descargables por cualquier visitante.

## Temas y accesibilidad

El tema inicial respeta `prefers-color-scheme`. Un script en el head aplica la preferencia guardada antes de presentar el contenido, con localStorage protegido frente a errores. El menú móvil usa HTML nativo y Escape permite cerrarlo con JavaScript. Se incluyen enlace de salto, foco visible, navegación activa, controles etiquetados, estructura semántica y reducción de movimiento. Los estilos contemplan pantallas desde 320 px.

El objetivo es WCAG 2.2 AA; queda pendiente la revisión visual e interactiva en navegador y con lectores de pantalla.

## SEO y dominio

Exporta **`SITE_URL` con el origen real de producción** antes de compilar. `.env.example` documenta la variable. La configuración lee `process.env.SITE_URL`; defínela en la terminal o en Vercel, no solo en un archivo `.env`.

En PowerShell:

```powershell
$env:SITE_URL = 'https://tu-dominio-real'
npm run build
```

Sustituye el valor ilustrativo por tu URL auténtica. Sin `SITE_URL` se omiten canonical, hreflang absolutos y `og:url`; el sitemap queda vacío y robots no anuncia sitemap. Con la variable definida se generan canonical por página, alternates ES/EN y x-default, y ocho URLs en `/sitemap.xml`. Todas las páginas tienen título, descripción, Open Graph y Twitter Card de resumen. No se declara una imagen social inexistente.

## Vercel

1. Sube el repositorio a GitHub e impórtalo en Vercel.
2. Selecciona el preset Astro y Node 22.x compatible con el requisito.
3. Configura `SITE_URL` con el origen de producción.
4. Usa `npm run build` como compilación y `dist` como salida.

No requiere adaptador de servidor. No se ha publicado ni modificado ningún servicio externo.

## Verificación y pendientes

Se ejecutaron Astro Check y la compilación estática con Node 22.16 temporal: cero errores de tipos y ocho páginas generadas. El requisito documentado se eleva a 22.19 para cubrir todas las declaraciones de engines transitivas. Node global permanece sin cambios.

También se verificaron 136 enlaces internos y sus anclas, páginas equivalentes ES/EN, títulos únicos, un h1 por página e IDs únicos en el HTML generado. Una compilación con un origen reservado `.invalid` permitió validar canonical, hreflang, las ocho entradas de sitemap y robots; la compilación final vuelve a omitir ese origen. Se probaron diez escenarios del tema, almacenamiento bloqueado, conservación del fragmento de idioma y cierre con Escape mediante mocks del DOM; no equivalen a pruebas en navegador.

La auditoría online de npm detectó **5 paquetes con avisos (1 bajo, 3 altos y 1 crítico)** en el árbol heredado de Astro 5.18.2. npm propone Astro 7.4.5 como corrección mayor; no se ha aplicado `npm audit fix --force`. Antes del despliegue, revisa esa migración y repite las comprobaciones y la revisión en navegador. El uso de generación estática no demuestra por sí mismo la ausencia de exposición a todos los avisos.

Pendiente de aportar: email, perfiles sociales, repositorios, CV, dominio y detalles internos/resultados documentados de proyectos. Estos datos no se han inventado.
