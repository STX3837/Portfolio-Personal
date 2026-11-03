# Alberto Paleteiro — Portfolio

Portfolio estático bilingüe con Astro, TypeScript estricto y CSS nativo. Español en `/` e inglés en `/en/`. Sin backend ni frameworks de interfaz adicionales.

## Requisitos y desarrollo

Node.js **22.19 o posterior dentro de la rama 22**, npm y Git. Verificado con **22.23.4**. Node 20.11 no es compatible con las herramientas instaladas.

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
| `npm test` | Validación de la configuración de dominio |
| `npm run check:build` | Rutas, enlaces, anclas y SEO en `dist/` |
| `npm run check:browser` | 80 casos de navegador contra preview local; Chrome/Edge instalado |

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
config/         Validación del origen de producción
scripts/        Comprobaciones sin dependencias adicionales
docs/           Informes de seguridad y preparación de producción
```

## Traducciones y proyectos

Edita `src/i18n/ui.ts` para los textos de interfaz en ambos idiomas. El contenido de proyectos está en `src/data/projects.ts`, tipado mediante `Project` y `Record<Locale, ProjectContent>`. Astro configura los idiomas en `astro.config.mjs`.

Para añadir un proyecto, incorpora un objeto con slug único, etiquetas y contenido completo en `es` y `en`. Las dos rutas `[slug].astro` usan `getStaticPaths()` para generar las páginas automáticamente. El selector conserva el proyecto equivalente y el fragmento de sección. Añade `repository` y `website` únicamente con URLs reales; `results` es opcional y debe contener resultados documentados.

Las ilustraciones son placeholders geométricos en CSS. Los retos describen áreas técnicas del alcance conocido, sin atribuir decisiones internas ni resultados no aportados. Completa las fichas con documentación verificable antes de presentarlas como casos técnicos exhaustivos.

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
2. Selecciona el preset Astro y Node 22.x compatible con el requisito.
3. Configura `SITE_URL` con el origen de producción.
4. Usa `npm run build` como compilación y `dist` como salida.

`vercel.json` fija preset Astro, instalación `npm ci`, compilación `npm run build`, salida `dist` y barra final. No requiere adaptador de servidor. No se ha publicado ni modificado ningún servicio externo. Los [pasos completos de publicación](docs/production-readiness.md) incluyen dominio, variables de entorno, DNS y verificaciones posteriores.

## Verificación y pendientes

Consulta el [informe de preparación](docs/production-readiness.md) para las verificaciones reales, límites y comandos reproducibles. Con Node 22.23.4 pasaron tests de configuración, comprobaciones de tipos, `npm run build`, ocho rutas estáticas y 152 enlaces internos/recursos en el HTML generado. Node global permanece sin cambios.

También se ejecutaron **80 casos reales en Chrome headless** e interacciones de tema, idioma y menú móvil. Las capturas y los resultados se guardan en `.verification/`, ignorado por Git. Una compilación con origen reservado `.invalid` validó el SEO de producción; ese origen se retira de la compilación local final.

La auditoría online mantiene **5 paquetes con avisos (1 bajo, 3 altos y 1 crítico)** en el árbol de Astro 5.18.2. No hay correcciones dentro de todos los rangos compatibles actuales. No se ejecutó `npm audit fix --force` ni se realizó una migración mayor. El [informe de seguridad](docs/security-audit.md) identifica cada paquete, la exposición concreta y los riesgos y requisitos para migrar a Astro 7.4.5. Resolver esta migración sigue pendiente antes de cerrar la preparación de seguridad.

Pendiente de aportar: email, perfiles sociales, repositorios, CV, dominio y detalles internos/resultados documentados de proyectos. Estos datos no se han inventado.
