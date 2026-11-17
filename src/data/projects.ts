import type { Locale } from '../i18n/ui';
export interface EvidenceLink { label: string; href: string }
export interface ProjectScreenshot { src: string; width: number; height: number; alt: Record<Locale, string>; caption?: Record<Locale, string> }
export interface ProjectSection { title: string; paragraphs: string[]; items: string[]; sources: EvidenceLink[] }
export interface ProjectComparison { title: string; note: string; rows: { topic: string; django: string; fastapi: string }[] }
export interface ProjectImplementation {
 visualId?: string;
 name: string; repository: string; architecture: string; persistence: string; frontend: string; highlights: string[];
}
export interface ConcurrencyCase {
 title: string; intro: string; diagram: string[]; strategies: { name: string; steps: string[] }[]; note: string;
}
export interface ProjectContent {
 context?: string[];
 title: string; description: string; problem: string; solution: string;
 features: string[]; architecture: string[]; challenges: string[]; results?: string[];
 evidenceNote: string; sections?: ProjectSection[]; comparison?: ProjectComparison;
 featuresTitle?: string; solutionTitle?: string;
 keyPoints?: { title: string; text: string }[]; implementations?: ProjectImplementation[];
 concurrency?: ConcurrencyCase; testing?: string; conclusion?: string; references?: EvidenceLink[];
}
export interface Project {
 repositoryLabel?: Record<Locale, string>;
 gallery?: { title: Record<Locale, string>; groups: { id: string; title: Record<Locale, string>; description: Record<Locale, string>; note?: Record<Locale, string>; images: ProjectScreenshot[] }[] };
 screenshot?: ProjectScreenshot;
 implementationScreenshots?: Record<string, ProjectScreenshot[]>;
 slug: string; tags: string[]; repositories?: EvidenceLink[]; technologies?: string[]; repository?: string; website?: string;
 content: Record<Locale, ProjectContent>;
}
export const projects: Project[] = [
  {
    "slug": "distans",
    "tags": [
      "Django",
      "FastAPI",
      "PostgreSQL",
      "Stripe"
    ],
    "repository": "https://github.com/STX3837/Distans-FastAPI",
    "technologies": [
      "Python",
      "Django",
      "FastAPI",
      "SQLAlchemy 2",
      "Pydantic 2",
      "PostgreSQL",
      "PostGIS",
      "Jinja2",
      "JavaScript",
      "Docker Compose",
      "Stripe",
      "Pytest",
      "Locust"
    ],
    "content": {
      "es": {
        "title": "DISTANS",
        "description": "Marketplace geolocalizado de comercio de proximidad, con implementaciones en Django y FastAPI.",
        "problem": "Comprar cerca debería ser sencillo. El reto es reunir comercios, catálogo y pagos sin perder la consistencia del stock durante una compra.",
        "solution": "Un marketplace desarrollado en dos versiones: Django y FastAPI. Ambas conectan compradores y comercios, con catálogo geolocalizado, carrito, pedidos y pagos con Stripe.",
        "features": [
          "Descubrimiento de comercios por ubicación",
          "Carrito y pedidos por tienda",
          "Pagos y reservas de stock"
        ],
        "architecture": [
          "Django organiza el dominio en apps; las vistas de carrito están en products/views.py y sus modelos en carts/.",
          "FastAPI separa routers, esquemas Pydantic, modelos SQLAlchemy y módulos de negocio.",
          "Ambas generan HTML en el servidor con JavaScript para interacciones; no son SPA."
        ],
        "challenges": [
          "Reservar stock sin que dos compras consuman las mismas unidades.",
          "Coordinar transacciones locales con un pago externo que puede fallar o repetirse.",
          "Mantener precio, carrito y estado del pedido coherentes durante el checkout."
        ],
        "evidenceNote": "Fuentes de ambos repositorios fijadas a commits en Referencias técnicas. Contexto académico aportado por el propietario: TFG conjunto, calificado con 8,6/10. Pendiente confirmar el alcance exacto de la evaluación; no se atribuye una nota independiente a cada implementación.",
        "sections": [],
        "comparison": {
          "title": "Comparativa técnica",
          "note": "Decisiones verificadas en ambas implementaciones del marketplace.",
          "rows": [
            {
              "topic": "Organización",
              "django": "Apps con modelos, vistas y formularios.",
              "fastapi": "Routers, modelos SQLAlchemy y esquemas separados."
            },
            {
              "topic": "HTTP y frontend",
              "django": "URLconf, vistas y Django Templates.",
              "fastapi": "APIRouter, dependencias, Jinja2 y JSON."
            },
            {
              "topic": "Persistencia",
              "django": "ORM Django, relaciones y migraciones por app.",
              "fastapi": "SQLAlchemy 2, get_db y migrador incremental propio."
            },
            {
              "topic": "Validación",
              "django": "Forms, ModelForms y validadores de modelos.",
              "fastapi": "Pydantic 2 y comprobaciones de negocio."
            },
            {
              "topic": "Acceso",
              "django": "Auth y sesiones Django; comprobaciones de rol y tienda.",
              "fastapi": "Sesiones Starlette, CSRF y controles de rol/propiedad."
            },
            {
              "topic": "Geolocalización",
              "django": "Haversine en Python; radio en kilómetros.",
              "fastapi": "Haversine en Python; radio en metros. Modelo Geometry declarado."
            },
            {
              "topic": "Stock y transacción",
              "django": "atomic + select_for_update sobre productos.",
              "fastapi": "UPDATE condicional + rowcount + commit/rollback."
            },
            {
              "topic": "Reintentos",
              "django": "Código único, pago previo en sesión y clave Stripe por pedido. No equivale a deduplicar solicitudes simultáneas de checkout.",
              "fastapi": "Token de compra único, IntegrityError y clave Stripe."
            },
            {
              "topic": "Pagos",
              "django": "Checkout y webhook firmado; reserva y liberación bajo bloqueo.",
              "fastapi": "Checkout y webhook firmado; reconciliación de reservas."
            },
            {
              "topic": "Pruebas",
              "django": "Tests Django; caso concurrente condicionado a PostgreSQL.",
              "fastapi": "Pytest con SQLite en memoria y escenarios Locust."
            }
          ]
        },
        "implementations": [
          {
            "name": "Django",
            "repository": "https://github.com/STX3837/Distans-Django",
            "architecture": "Apps por dominio: users, stores, products, carts y orders.",
            "persistence": "Django ORM · PostgreSQL / PostGIS",
            "frontend": "Django Templates · JavaScript",
            "highlights": [
              "Formularios Django y autenticación integrada.",
              "Bloqueo de productos antes de reservar stock."
            ],
            "visualId": "django"
          },
          {
            "name": "FastAPI",
            "repository": "https://github.com/STX3837/Distans-FastAPI",
            "architecture": "Routers por dominio, modelos y esquemas separados.",
            "persistence": "SQLAlchemy 2 · PostgreSQL / PostGIS",
            "frontend": "Jinja2 · JavaScript",
            "highlights": [
              "Validación con Pydantic 2 y sesiones firmadas.",
              "Reserva mediante actualización condicional."
            ],
            "visualId": "fastapi"
          }
        ],
        "concurrency": {
          "title": "Dos compradores. Una última unidad.",
          "intro": "Si ambos leen el mismo stock antes de reservar, podrían intentar comprar la misma unidad. La disponibilidad debe comprobarse dentro de la operación que modifica el inventario.",
          "diagram": [
            "Comprador A",
            "1 unidad disponible",
            "Comprador B"
          ],
          "strategies": [
            {
              "name": "Django",
              "steps": [
                "transaction.atomic() agrupa validación, pedido y descuento.",
                "select_for_update() bloquea productos ordenados por pk; se releen stock y precio bajo bloqueo.",
                "Se guarda el nuevo stock. Una excepción revierte el bloque atómico; la liberación usa F() y un pedido bloqueado."
              ]
            },
            {
              "name": "FastAPI",
              "steps": [
                "UPDATE exige producto disponible y stock suficiente antes de descontar.",
                "rowcount confirma una fila modificada; si no, rollback y HTTP 409.",
                "La unicidad del código derivado del token y la recuperación tras IntegrityError gestionan reintentos; with_for_update bloquea pedidos existentes, no la lectura de productos."
              ]
            }
          ],
          "note": "El esquema representa una situación de compra. Los bloqueos de filas requieren una base de datos compatible, como PostgreSQL."
        },
        "testing": "Ambos repositorios incluyen pruebas de compras y pagos. Django contiene un TransactionTestCase concurrente que solo se ejecuta con PostgreSQL; su configuración portable y la de Pytest usan SQLite. Hay escenarios Locust y artefactos de carga, pero no se han ejecutado aquí ni se presentan como ensayos equivalentes.",
        "conclusion": "Dos formas de resolver un mismo dominio, trabajando el desarrollo full-stack, la arquitectura del backend, la persistencia, la integración de servicios, la consistencia de datos y la calidad del software.",
        "references": [
          {
            "label": "Django · nucleo/urls.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/nucleo/urls.py"
          },
          {
            "label": "Django · users/forms.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/users/forms.py"
          },
          {
            "label": "Django · products/views.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/products/views.py"
          },
          {
            "label": "Django · orders/utils.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/orders/utils.py"
          },
          {
            "label": "Django · orders/models.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/orders/models.py"
          },
          {
            "label": "Django · orders/views.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/orders/views.py"
          },
          {
            "label": "Django · stores/utils.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/stores/utils.py"
          },
          {
            "label": "Django · orders/test_payment_safety.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/orders/test_payment_safety.py"
          },
          {
            "label": "Django · nucleo/settings_test.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/nucleo/settings_test.py"
          },
          {
            "label": "FastAPI · main.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/main.py"
          },
          {
            "label": "FastAPI · app/database.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/database.py"
          },
          {
            "label": "FastAPI · app/schemas.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/schemas.py"
          },
          {
            "label": "FastAPI · app/routers/auth.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/routers/auth.py"
          },
          {
            "label": "FastAPI · app/routers/catalogo.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/routers/catalogo.py"
          },
          {
            "label": "FastAPI · app/routers/compra.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/routers/compra.py"
          },
          {
            "label": "FastAPI · app/models.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/models.py"
          },
          {
            "label": "FastAPI · app/stripe_payments.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/stripe_payments.py"
          },
          {
            "label": "FastAPI · tests/conftest.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/tests/conftest.py"
          },
          {
            "label": "FastAPI · tests/test_compra_directa.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/tests/test_compra_directa.py"
          },
          {
            "label": "FastAPI · tests/test_stripe_payments.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/tests/test_stripe_payments.py"
          },
          {
            "label": "FastAPI · load_tests/locustfile.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/load_tests/locustfile.py"
          }
        ],
        "context": [
          "Trabajo de Fin de Grado",
          "Desarrollado por dos personas",
          "Calificación: 8,6/10"
        ]
      },
      "en": {
        "title": "DISTANS",
        "description": "A geolocated local-commerce marketplace with Django and FastAPI implementations.",
        "problem": "Shopping locally should be straightforward. The challenge is bringing shops, catalogues, and payments together while keeping stock consistent during a purchase.",
        "solution": "A marketplace built in two versions: Django and FastAPI. Both connect shoppers and local businesses through a location-aware catalogue, cart, orders, and Stripe payments.",
        "features": [
          "Shop discovery by location",
          "Cart and store-specific orders",
          "Payments and stock reservations"
        ],
        "architecture": [
          "Django organises the domain into apps; cart views live in products/views.py and cart models in carts/.",
          "FastAPI separates routers, Pydantic schemas, SQLAlchemy models, and business modules.",
          "Both render server-side HTML and use JavaScript for interactions; neither is a SPA."
        ],
        "challenges": [
          "Reserving stock without two purchases consuming the same units.",
          "Coordinating local transactions with external payments that may fail or be retried.",
          "Keeping prices, carts, and order states consistent throughout checkout."
        ],
        "evidenceNote": "Sources from both repositories are pinned to commits under Technical references. Academic context supplied by the owner: a joint Bachelor's Final Project graded 8.6/10. The exact scope of assessment remains unconfirmed; no separate grade is assigned to either implementation.",
        "sections": [],
        "comparison": {
          "title": "Technical comparison",
          "note": "Verified decisions in both marketplace implementations.",
          "rows": [
            {
              "topic": "Organisation",
              "django": "Apps with models, views, and forms.",
              "fastapi": "Routers, SQLAlchemy models, and separate schemas."
            },
            {
              "topic": "HTTP and frontend",
              "django": "URLconf, views, and Django Templates.",
              "fastapi": "APIRouter, dependencies, Jinja2, and JSON."
            },
            {
              "topic": "Persistence",
              "django": "Django ORM, relationships, and app migrations.",
              "fastapi": "SQLAlchemy 2, get_db, and a custom incremental migrator."
            },
            {
              "topic": "Validation",
              "django": "Forms, ModelForms, and model validators.",
              "fastapi": "Pydantic 2 and business checks."
            },
            {
              "topic": "Access",
              "django": "Django auth/sessions; role and shop checks.",
              "fastapi": "Starlette sessions, CSRF, and role/ownership checks."
            },
            {
              "topic": "Geolocation",
              "django": "Python Haversine; radius in kilometres.",
              "fastapi": "Python Haversine; radius in metres. Geometry model declared."
            },
            {
              "topic": "Stock and transactions",
              "django": "atomic + select_for_update on products.",
              "fastapi": "Conditional UPDATE + rowcount + commit/rollback."
            },
            {
              "topic": "Retries",
              "django": "Unique code, previous payment in session, and per-order Stripe key. Not equivalent to deduplicating simultaneous checkout requests.",
              "fastapi": "Unique purchase token, IntegrityError, and Stripe key."
            },
            {
              "topic": "Payments",
              "django": "Checkout and signed webhook; reservation/release under locks.",
              "fastapi": "Checkout and signed webhook; reservation reconciliation."
            },
            {
              "topic": "Testing",
              "django": "Django tests; PostgreSQL-only concurrency case.",
              "fastapi": "Pytest with in-memory SQLite and Locust scenarios."
            }
          ]
        },
        "implementations": [
          {
            "name": "Django",
            "repository": "https://github.com/STX3837/Distans-Django",
            "architecture": "Domain apps: users, stores, products, carts, and orders.",
            "persistence": "Django ORM · PostgreSQL / PostGIS",
            "frontend": "Django Templates · JavaScript",
            "highlights": [
              "Django forms and built-in authentication.",
              "Product row locks before stock reservation."
            ],
            "visualId": "django"
          },
          {
            "name": "FastAPI",
            "repository": "https://github.com/STX3837/Distans-FastAPI",
            "architecture": "Domain routers with separate models and schemas.",
            "persistence": "SQLAlchemy 2 · PostgreSQL / PostGIS",
            "frontend": "Jinja2 · JavaScript",
            "highlights": [
              "Pydantic 2 validation and signed sessions.",
              "Reservation through conditional updates."
            ],
            "visualId": "fastapi"
          }
        ],
        "concurrency": {
          "title": "Two shoppers. One last unit.",
          "intro": "If both read the same stock before reserving, they may try to buy the same unit. Availability must be checked within the operation that changes inventory.",
          "diagram": [
            "Shopper A",
            "1 available unit",
            "Shopper B"
          ],
          "strategies": [
            {
              "name": "Django",
              "steps": [
                "transaction.atomic() groups validation, order creation, and stock deduction.",
                "select_for_update() locks products ordered by pk; stock and price are rechecked under the lock.",
                "The updated stock is saved. An exception rolls back the atomic block; release uses F() and a locked order."
              ]
            },
            {
              "name": "FastAPI",
              "steps": [
                "UPDATE requires an available product and sufficient stock before deduction.",
                "rowcount confirms one modified row; otherwise rollback and HTTP 409.",
                "A unique token-derived order code and recovery after IntegrityError handle retries; with_for_update locks existing orders, not the product read."
              ]
            }
          ],
          "note": "The diagram represents a purchase scenario. Row locks require a supporting database such as PostgreSQL."
        },
        "testing": "Both repositories include purchase and payment tests. Django contains a concurrent TransactionTestCase enabled only on PostgreSQL; its portable configuration and the Pytest setup use SQLite. Locust scenarios and load artefacts exist, but were not run here or presented as equivalent experiments.",
        "conclusion": "Two approaches to the same domain, covering full-stack development, backend architecture, persistence, service integration, data consistency, and software quality.",
        "references": [
          {
            "label": "Django · nucleo/urls.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/nucleo/urls.py"
          },
          {
            "label": "Django · users/forms.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/users/forms.py"
          },
          {
            "label": "Django · products/views.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/products/views.py"
          },
          {
            "label": "Django · orders/utils.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/orders/utils.py"
          },
          {
            "label": "Django · orders/models.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/orders/models.py"
          },
          {
            "label": "Django · orders/views.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/orders/views.py"
          },
          {
            "label": "Django · stores/utils.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/stores/utils.py"
          },
          {
            "label": "Django · orders/test_payment_safety.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/orders/test_payment_safety.py"
          },
          {
            "label": "Django · nucleo/settings_test.py",
            "href": "https://github.com/STX3837/Distans-Django/blob/a61fb698d1b59dec00cdced017dbddbb565b557e/nucleo/settings_test.py"
          },
          {
            "label": "FastAPI · main.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/main.py"
          },
          {
            "label": "FastAPI · app/database.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/database.py"
          },
          {
            "label": "FastAPI · app/schemas.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/schemas.py"
          },
          {
            "label": "FastAPI · app/routers/auth.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/routers/auth.py"
          },
          {
            "label": "FastAPI · app/routers/catalogo.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/routers/catalogo.py"
          },
          {
            "label": "FastAPI · app/routers/compra.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/routers/compra.py"
          },
          {
            "label": "FastAPI · app/models.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/models.py"
          },
          {
            "label": "FastAPI · app/stripe_payments.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/stripe_payments.py"
          },
          {
            "label": "FastAPI · tests/conftest.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/tests/conftest.py"
          },
          {
            "label": "FastAPI · tests/test_compra_directa.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/tests/test_compra_directa.py"
          },
          {
            "label": "FastAPI · tests/test_stripe_payments.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/tests/test_stripe_payments.py"
          },
          {
            "label": "FastAPI · load_tests/locustfile.py",
            "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/load_tests/locustfile.py"
          }
        ],
        "context": [
          "Bachelor's Final Project",
          "Developed by a two-person team",
          "Grade: 8.6/10"
        ]
      }
    },
    "repositories": [
      {
        "label": "Django",
        "href": "https://github.com/STX3837/Distans-Django"
      },
      {
        "label": "FastAPI",
        "href": "https://github.com/STX3837/Distans-FastAPI"
      }
    ],
    "implementationScreenshots": {
      "fastapi": [
        {
          "src": "/images/projects/distans-fastapi-catalogue.png",
          "width": 1896,
          "height": 875,
          "alt": {
            "es": "Catálogo principal de DISTANS FastAPI con buscador, filtros y productos de comercios locales.",
            "en": "DISTANS FastAPI main catalog with search, filters, and products from local stores."
          },
          "caption": {
            "es": "Catálogo y experiencia de compra — FastAPI",
            "en": "Catalog and shopping experience — FastAPI"
          }
        },
        {
          "src": "/images/projects/distans-fastapi-products.png",
          "width": 1897,
          "height": 871,
          "alt": {
            "es": "Panel de gestión de productos de DISTANS FastAPI con precios, stock y herramientas para vendedores.",
            "en": "DISTANS FastAPI product management interface showing prices, stock, and seller tools."
          },
          "caption": {
            "es": "Gestión de productos para vendedores — FastAPI",
            "en": "Product management for sellers — FastAPI"
          }
        },
        {
          "src": "/images/projects/fastapi-mapa-mobile.png",
          "width": 271,
          "height": 559,
          "alt": {
            "es": "Vista móvil de DISTANS FastAPI con mapa y marcadores de comercios cercanos.",
            "en": "DISTANS FastAPI mobile map showing nearby stores with location markers."
          },
          "caption": {
            "es": "Mapa de comercios en móvil — FastAPI",
            "en": "Mobile store map — FastAPI"
          }
        }
      ],
      "django": [
        {
          "src": "/images/projects/django-catalogo.png",
          "width": 522,
          "height": 444,
          "alt": {
            "es": "Catálogo de DISTANS Django con filtros de productos, precios y disponibilidad.",
            "en": "DISTANS Django product catalog showing product filters, prices, and availability."
          },
          "caption": {
            "es": "Catálogo de productos — Django",
            "en": "Product catalog — Django"
          }
        },
        {
          "src": "/images/projects/django-carrito.png",
          "width": 590,
          "height": 353,
          "alt": {
            "es": "Carrito de DISTANS Django con productos, cantidades y opciones de actualización.",
            "en": "DISTANS Django shopping cart showing products, quantities, and update actions."
          },
          "caption": {
            "es": "Carrito de compra — Django",
            "en": "Shopping cart — Django"
          }
        }
      ]
    }
  },
  {
    "slug": "puerto-dataspace-edc",
    "tags": [
      "Java",
      "EDC",
      "DSP / DCP",
      "Docker"
    ],
    "repository": "https://github.com/STX3837/puerto-dataspace-edc",
    "technologies": [
      "Java",
      "Eclipse Dataspace Components",
      "DSP",
      "DCP",
      "Docker",
      "Docker Compose",
      "Keycloak",
      "HashiCorp Vault",
      "PostgreSQL",
      "Python",
      "FastAPI",
      "Streamlit",
      "Gradle"
    ],
    "content": {
      "es": {
        "title": "Puerto Dataspace EDC",
        "description": "Prototipo de intercambio seguro y controlado de datos entre participantes del entorno portuario.",
        "problem": "Una empresa transportista necesita consultar tres autorizaciones independientes para saber si puede retirar un contenedor, respetando las condiciones de acceso de cada proveedor.",
        "solution": "Un demostrador local con EDC, DSP y DCP. Cada Provider expone su información y el Consumer agrega las respuestas autorizadas; el espacio de datos no actúa como almacén centralizado.",
        "features": [
          "Consumer: empresa transportista",
          "Customs: autorización aduanera",
          "Health: inspección sanitaria",
          "CivilGuard: autorización de Guardia Civil",
          "Tres estados CLEARED producen READY_FOR_PICKUP; cualquier bloqueo produce NOT_READY_FOR_PICKUP.",
          "Los estados regulatorios y las órdenes de transporte proceden de una Mock API, no de autoridades reales."
        ],
        "architecture": [
          "Control Plane por participante: publica o consulta catálogos y coordina contratos y transferencias.",
          "Data Plane por participante: sirve el acceso al dato autorizado; separado de la coordinación contractual.",
          "Identity Hubs: gestionan identidades de participantes y credenciales utilizadas en DCP.",
          "Issuer Service: provisiona y emite credenciales de pertenencia y de empresa transportista.",
          "La agregación la realiza el flujo consumidor después de descargar los datos; cada Provider sigue exponiendo su propia información."
        ],
        "challenges": [
          "Coordinar varios componentes, sus estados y la disponibilidad de los participantes.",
          "Vincular identidad, políticas y contenedor sin confundir autenticación con autorización.",
          "Hacer trazable un flujo de catálogo, contrato, transferencia y agregación."
        ],
        "evidenceNote": "Prototipo local con datos mock, Vault en modo dev y configuración de demostración. El evaluador de rol incluye una excepción para la identidad fija de la demo. No se han ejecutado sus contenedores ni suites en esta revisión.",
        "sections": [
          {
            "title": "Identidad y políticas de acceso",
            "paragraphs": [
              "Las identidades de participantes se representan mediante DIDs. Keycloak proporciona OAuth2 al entorno; DCP y los Identity Hubs gestionan el intercambio de credenciales. Autenticarse no equivale a cumplir una política ni a haber negociado un contrato."
            ],
            "items": [
              "El provisionado emite MembershipCredential y TransportCompanyCredential. Existe un evaluador de pertenencia activa basado en membership.since.",
              "Las definiciones contractuales de los tres Providers referencian la política TransportCompanyCredential.role + TransportOrder.activeForContainer. La orden se contrasta con el backend mock para el contenedor.",
              "Límite de demostración: el evaluador de rol incluye una aceptación alternativa para la identidad transportista fija de la demo. No se afirma exigencia estricta de esa credencial en todos los caminos.",
              "Con el operando dinámico ${containerId}, la comprobación de orden se difiere a transferencia si catálogo/negociación no tienen un asset concreto."
            ],
            "sources": [
              {
                "label": "resources/policies/policy-transport-company-valid-order.json",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/resources/policies/policy-transport-company-valid-order.json"
              },
              {
                "label": "resources/contracts/contract-clearance-mscu7654321.json",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/resources/contracts/contract-clearance-mscu7654321.json"
              },
              {
                "label": "extensions/dcp-impl/src/main/java/org/eclipse/edc/demo/dcp/policy/TransportCompanyRoleFunction.java",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/extensions/dcp-impl/src/main/java/org/eclipse/edc/demo/dcp/policy/TransportCompanyRoleFunction.java"
              },
              {
                "label": "extensions/dcp-impl/src/main/java/org/eclipse/edc/demo/dcp/policy/TransportOrderActiveForContainerFunction.java",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/extensions/dcp-impl/src/main/java/org/eclipse/edc/demo/dcp/policy/TransportOrderActiveForContainerFunction.java"
              }
            ]
          },
          {
            "title": "Del catálogo al dato autorizado",
            "paragraphs": [
              "El script multi-provider implementa la secuencia completa y guarda artefactos por proveedor."
            ],
            "items": [
              "Consultar catálogo DSP y seleccionar la oferta del asset.",
              "Revisar oferta/política y solicitar negociación; esperar a FINALIZED y obtener el acuerdo.",
              "Iniciar transferencia HttpData-PULL y esperar su estado.",
              "Obtener el Endpoint Data Reference (EDR), con endpoint y autorización de acceso.",
              "Descargar por el Data Plane y agregar las tres respuestas en un resultado de retirada."
            ],
            "sources": [
              {
                "label": "smoke-test-three-providers.ps1",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/smoke-test-three-providers.ps1"
              }
            ]
          },
          {
            "title": "Orquestación e infraestructura",
            "paragraphs": [
              "Docker Compose separa infraestructura común, participantes EDC y servicios auxiliares. Los participantes se ejecutan en una misma máquina para la demo."
            ],
            "items": [
              "Infraestructura: Keycloak, su PostgreSQL y Vault.",
              "Stack EDC: Control Planes, Data Planes, Identity Hubs, Issuer Service, sus bases de datos y Mock API.",
              "Servicio: UI Streamlit. Una API FastAPI local permite a la UI Docker ejecutar una lista de scripts predefinidos en Windows.",
              "Los runtimes Java se construyen con Gradle; no se atribuye persistencia SQL a los Control Planes: su dependencia SQL está comentada.",
              "Vault está en modo dev y Keycloak usa configuración de demo; PostgreSQL mantiene datos de infraestructura/identidad, no un repositorio central de autorizaciones portuarias."
            ],
            "sources": [
              {
                "label": "docker-compose.infra.yml",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/docker-compose.infra.yml"
              },
              {
                "label": "docker-compose.edc.yml",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/docker-compose.edc.yml"
              },
              {
                "label": "docker-compose.service.yml",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/docker-compose.service.yml"
              },
              {
                "label": "runtimes/controlplane/build.gradle.kts",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/runtimes/controlplane/build.gradle.kts"
              },
              {
                "label": "orchestrator_api/main.py",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/orchestrator_api/main.py"
              }
            ]
          },
          {
            "title": "Dashboard Streamlit",
            "paragraphs": [
              "La interfaz permite operar el demostrador y seguir eventos, progreso, participantes y resultados."
            ],
            "items": [
              "Ejecutar la demo completa, arrancar EDC sin smoke o lanzar solo la validación.",
              "Flujo manual por Provider: catálogo, oferta, negociación, transferencia, EDR y descarga.",
              "Provisionado: crear, consultar, actualizar y borrar Assets, Policies y Contract Definitions.",
              "Validaciones de coherencia de containerId y consulta de artefactos y timeline."
            ],
            "sources": [
              {
                "label": "ui/app.py",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/ui/app.py"
              },
              {
                "label": "ui/pages/1_Manual_Provider_Flow.py",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/ui/pages/1_Manual_Provider_Flow.py"
              },
              {
                "label": "ui/pages/2_Provider_Provisioning.py",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/ui/pages/2_Provider_Provisioning.py"
              }
            ]
          },
          {
            "title": "Automatización y validación",
            "paragraphs": [
              "El script principal arranca y provisiona participantes, emite credenciales, registra recursos y lanza el smoke test multi-provider."
            ],
            "items": [
              "El smoke consulta catálogos, negocia contratos, transfiere, descarga y comprueba la agregación.",
              "Hay tests Java de scopes DCP y evaluación de credenciales/órdenes.",
              "El resultado esperado para los datos favorables de demostración es READY_FOR_PICKUP; otros datos mock incluyen una inspección sanitaria pendiente."
            ],
            "sources": [
              {
                "label": "start-edc-and-smoke-three-providers.ps1",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/start-edc-and-smoke-three-providers.ps1"
              },
              {
                "label": "mock-api/main.py",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/mock-api/main.py"
              },
              {
                "label": "extensions/dcp-impl/src/test/java/org/eclipse/edc/demo/dcp/policy/TransportOrderActiveForContainerFunctionTest.java",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/extensions/dcp-impl/src/test/java/org/eclipse/edc/demo/dcp/policy/TransportOrderActiveForContainerFunctionTest.java"
              },
              {
                "label": "SERVICIO.md",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/SERVICIO.md"
              }
            ]
          }
        ],
        "featuresTitle": "Caso de uso y participantes",
        "solutionTitle": "Objetivo y solución",
        "keyPoints": [
          {
            "title": "Cuatro participantes",
            "text": "Un Consumer transportista y tres Providers: Customs, Health y CivilGuard."
          },
          {
            "title": "Acceso controlado",
            "text": "Catálogo, contrato, transferencia y EDR antes de descargar."
          },
          {
            "title": "Una decisión agregada",
            "text": "Tres autorizaciones CLEARED permiten READY_FOR_PICKUP, con datos mock."
          }
        ]
      },
      "en": {
        "title": "Puerto Dataspace EDC",
        "description": "Prototype for secure, controlled data exchange among participants in a port environment.",
        "problem": "A transport company needs three independent clearances before collecting a container, while respecting each provider’s access conditions.",
        "solution": "A local EDC, DSP, and DCP demonstrator. Each Provider exposes its information and the Consumer aggregates authorised responses; the dataspace is not a central data store.",
        "features": [
          "Consumer: transport company",
          "Customs: customs clearance",
          "Health: health inspection",
          "CivilGuard: Civil Guard clearance",
          "Three CLEARED statuses produce READY_FOR_PICKUP; any blocker produces NOT_READY_FOR_PICKUP.",
          "Clearances and transport orders come from a Mock API, not actual public authorities."
        ],
        "architecture": [
          "A Control Plane per participant publishes or queries catalogues and coordinates contracts and transfers.",
          "A Data Plane per participant serves authorised data access, separately from contractual coordination.",
          "Identity Hubs manage participant identities and credentials used in DCP.",
          "The Issuer Service provisions and issues membership and transport-company credentials.",
          "The consumer flow aggregates downloaded data; each Provider still exposes its own information."
        ],
        "challenges": [
          "Coordinating components, their states, and participant availability.",
          "Connecting identity, policies, and containers without confusing authentication with authorisation.",
          "Making catalogue, contract, transfer, and aggregation steps traceable."
        ],
        "evidenceNote": "Local prototype with mock data, dev-mode Vault, and demonstration configuration. Its role evaluator includes an exception for the fixed demo identity. Its containers and test suites were not run in this review.",
        "sections": [
          {
            "title": "Identity and access policies",
            "paragraphs": [
              "Participant identities use DIDs. Keycloak supplies OAuth2 for the environment; DCP and Identity Hubs handle credentials. Authentication does not itself satisfy a policy or establish a negotiated contract."
            ],
            "items": [
              "Provisioning issues MembershipCredential and TransportCompanyCredential. An active-membership evaluator checks membership.since.",
              "All three Providers’ contract definitions reference TransportCompanyCredential.role + TransportOrder.activeForContainer. The mock backend checks the order for the container.",
              "Demo limitation: the role evaluator also accepts the fixed demo transport identity as an alternative. Strict credential enforcement on every path is not claimed.",
              "With the dynamic ${containerId} operand, order checking is deferred to transfer if catalogue/negotiation has no concrete asset."
            ],
            "sources": [
              {
                "label": "resources/policies/policy-transport-company-valid-order.json",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/resources/policies/policy-transport-company-valid-order.json"
              },
              {
                "label": "resources/contracts/contract-clearance-mscu7654321.json",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/resources/contracts/contract-clearance-mscu7654321.json"
              },
              {
                "label": "extensions/dcp-impl/src/main/java/org/eclipse/edc/demo/dcp/policy/TransportCompanyRoleFunction.java",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/extensions/dcp-impl/src/main/java/org/eclipse/edc/demo/dcp/policy/TransportCompanyRoleFunction.java"
              },
              {
                "label": "extensions/dcp-impl/src/main/java/org/eclipse/edc/demo/dcp/policy/TransportOrderActiveForContainerFunction.java",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/extensions/dcp-impl/src/main/java/org/eclipse/edc/demo/dcp/policy/TransportOrderActiveForContainerFunction.java"
              }
            ]
          },
          {
            "title": "From catalogue to authorised data",
            "paragraphs": [
              "The multi-provider script implements the end-to-end sequence and stores per-provider artefacts."
            ],
            "items": [
              "Query the DSP catalogue and select the asset’s offer.",
              "Review the offer/policy, request negotiation, wait for FINALIZED, and obtain the agreement.",
              "Start an HttpData-PULL transfer and wait for its state.",
              "Obtain the Endpoint Data Reference (EDR), including the endpoint and access authorisation.",
              "Download through the Data Plane and aggregate the three responses into a pickup decision."
            ],
            "sources": [
              {
                "label": "smoke-test-three-providers.ps1",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/smoke-test-three-providers.ps1"
              }
            ]
          },
          {
            "title": "Orchestration and infrastructure",
            "paragraphs": [
              "Docker Compose separates shared infrastructure, EDC participants, and supporting services. Demo participants run on a single machine."
            ],
            "items": [
              "Infrastructure: Keycloak, its PostgreSQL database, and Vault.",
              "EDC stack: Control Planes, Data Planes, Identity Hubs, Issuer Service, their databases, and the Mock API.",
              "Service layer: Streamlit UI. A local FastAPI orchestrator lets the Docker UI invoke an allowlist of Windows scripts.",
              "Java runtimes are built with Gradle. SQL persistence is not attributed to Control Planes: their SQL dependency is commented out.",
              "Vault runs in dev mode and Keycloak uses demo configuration. PostgreSQL holds infrastructure/identity data, not a central collection of port clearances."
            ],
            "sources": [
              {
                "label": "docker-compose.infra.yml",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/docker-compose.infra.yml"
              },
              {
                "label": "docker-compose.edc.yml",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/docker-compose.edc.yml"
              },
              {
                "label": "docker-compose.service.yml",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/docker-compose.service.yml"
              },
              {
                "label": "runtimes/controlplane/build.gradle.kts",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/runtimes/controlplane/build.gradle.kts"
              },
              {
                "label": "orchestrator_api/main.py",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/orchestrator_api/main.py"
              }
            ]
          },
          {
            "title": "Streamlit dashboard",
            "paragraphs": [
              "The interface operates the demonstrator and displays events, progress, participant states, and results."
            ],
            "items": [
              "Run the full demo, start EDC without smoke, or run validation only.",
              "Manual Provider flow: catalogue, offer, negotiation, transfer, EDR, and download.",
              "Provisioning: create, read, update, and delete Assets, Policies, and Contract Definitions.",
              "Container-ID consistency checks, artefacts, and event timeline."
            ],
            "sources": [
              {
                "label": "ui/app.py",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/ui/app.py"
              },
              {
                "label": "ui/pages/1_Manual_Provider_Flow.py",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/ui/pages/1_Manual_Provider_Flow.py"
              },
              {
                "label": "ui/pages/2_Provider_Provisioning.py",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/ui/pages/2_Provider_Provisioning.py"
              }
            ]
          },
          {
            "title": "Automation and validation",
            "paragraphs": [
              "The main script starts and provisions participants, issues credentials, registers resources, and launches the multi-provider smoke test."
            ],
            "items": [
              "The smoke test queries catalogues, negotiates contracts, transfers, downloads, and checks aggregation.",
              "Java tests cover DCP scopes and credential/order evaluation.",
              "Favourable demo data is expected to yield READY_FOR_PICKUP; other mock data includes a pending health inspection."
            ],
            "sources": [
              {
                "label": "start-edc-and-smoke-three-providers.ps1",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/start-edc-and-smoke-three-providers.ps1"
              },
              {
                "label": "mock-api/main.py",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/mock-api/main.py"
              },
              {
                "label": "extensions/dcp-impl/src/test/java/org/eclipse/edc/demo/dcp/policy/TransportOrderActiveForContainerFunctionTest.java",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/extensions/dcp-impl/src/test/java/org/eclipse/edc/demo/dcp/policy/TransportOrderActiveForContainerFunctionTest.java"
              },
              {
                "label": "SERVICIO.md",
                "href": "https://github.com/STX3837/puerto-dataspace-edc/blob/197a47536ab2f1154b7308f1c19722429d1f74fb/SERVICIO.md"
              }
            ]
          }
        ],
        "featuresTitle": "Use case and participants",
        "solutionTitle": "Objective and solution",
        "keyPoints": [
          {
            "title": "Four participants",
            "text": "A transport Consumer and three Providers: Customs, Health, and CivilGuard."
          },
          {
            "title": "Controlled access",
            "text": "Catalogue, contract, transfer, and EDR before download."
          },
          {
            "title": "One aggregate decision",
            "text": "Three CLEARED authorisations yield READY_FOR_PICKUP, using mock data."
          }
        ]
      }
    },
    "gallery": {
      "title": {
        "es": "El demostrador en funcionamiento",
        "en": "The prototype in action"
      },
      "groups": [
        {
          "id": "dashboard",
          "title": {
            "es": "Ejecución y resultados",
            "en": "Execution and results"
          },
          "description": {
            "es": "El dashboard permite ejecutar y supervisar el flujo de intercambio de datos, consultar el estado de los proveedores y visualizar el resultado agregado.",
            "en": "The dashboard supports running and monitoring the data exchange workflow, checking provider states, and viewing the aggregated result."
          },
          "note": {
            "es": "Prototipo local con datos simulados. Estas capturas corresponden a un smoke test: no prueban la ejecución completa ni las etapas marcadas como SKIPPED.",
            "en": "Local prototype using simulated data. These screenshots show a smoke test: they do not prove a complete run or the execution of steps marked SKIPPED."
          },
          "images": [
            {
              "src": "/images/projects/puerto-dataspace-edc/dashboard/resultado.png",
              "width": 1917,
              "height": 865,
              "alt": {
                "es": "Dashboard de Puerto Dataspace EDC con smoke test correcto y resultado agregado READY_FOR_PICKUP.",
                "en": "Puerto Dataspace EDC dashboard showing a successful smoke test and the aggregated READY_FOR_PICKUP result."
              },
              "caption": {
                "es": "Resultado agregado del intercambio (smoke test)",
                "en": "Aggregated exchange result (smoke test)"
              }
            },
            {
              "src": "/images/projects/puerto-dataspace-edc/dashboard/providers.png",
              "width": 1917,
              "height": 846,
              "alt": {
                "es": "Estado de Customs, Health y CivilGuard durante las fases de catálogo, negociación, transferencia y descarga.",
                "en": "Status of Customs, Health, and CivilGuard across catalog, negotiation, transfer, and download steps."
              },
              "caption": {
                "es": "Estado de los tres proveedores",
                "en": "Status of the three providers"
              }
            }
          ]
        },
        {
          "id": "manual-flow",
          "title": {
            "es": "Negociación y transferencia",
            "en": "Negotiation and transfer"
          },
          "description": {
            "es": "El flujo manual permite consultar ofertas, negociar contratos e iniciar transferencias para obtener datos autorizados.",
            "en": "The manual workflow allows users to retrieve offers, negotiate contracts, and initiate transfers to obtain authorized data."
          },
          "note": {
            "es": "FINALIZED corresponde a la negociación. STARTED indica transferencia iniciada, no finalizada; la captura muestra además EDR obtenido y dato CLEARED. Los valores operativos se han ocultado.",
            "en": "FINALIZED refers to negotiation. STARTED means the transfer has started, not completed; the screenshot also shows a retrieved EDR and CLEARED data. Operational values have been redacted."
          },
          "images": [
            {
              "src": "/images/projects/puerto-dataspace-edc/manual-flow/negociacion.png",
              "width": 1917,
              "height": 861,
              "alt": {
                "es": "Flujo manual de EDC con oferta seleccionada y negociación contractual finalizada.",
                "en": "EDC manual workflow showing a selected offer and finalized contract negotiation."
              },
              "caption": {
                "es": "Negociación de contratos",
                "en": "Contract negotiation"
              }
            },
            {
              "src": "/images/projects/puerto-dataspace-edc/manual-flow/transferencia.png",
              "width": 1917,
              "height": 868,
              "alt": {
                "es": "Flujo manual con transferencia iniciada, EDR obtenido y dato autorizado descargado.",
                "en": "Manual workflow showing an initiated transfer, retrieved EDR, and downloaded authorized data."
              },
              "caption": {
                "es": "Transferencia y descarga de datos",
                "en": "Data transfer and download"
              }
            }
          ]
        },
        {
          "id": "provisioning",
          "title": {
            "es": "Configuración de proveedores",
            "en": "Provider configuration"
          },
          "description": {
            "es": "La interfaz de provisioning permite configurar activos de datos, políticas y definiciones de contratos mediante la Management API.",
            "en": "The provisioning interface supports configuring data assets, policies, and contract definitions through the Management API."
          },
          "note": {
            "es": "Configuración de demostración local. Las claves y direcciones internas se han ocultado en las copias públicas.",
            "en": "Local demonstration configuration. Keys and internal addresses have been redacted from the public copies."
          },
          "images": [
            {
              "src": "/images/projects/puerto-dataspace-edc/provisioning/policy.png",
              "width": 1917,
              "height": 870,
              "alt": {
                "es": "Configuración de una política de acceso para una empresa transportista en el proveedor Customs.",
                "en": "Access policy configuration for a transport company in the Customs provider."
              },
              "caption": {
                "es": "Configuración de políticas de acceso",
                "en": "Access policy configuration"
              }
            },
            {
              "src": "/images/projects/puerto-dataspace-edc/provisioning/contract.png",
              "width": 1917,
              "height": 873,
              "alt": {
                "es": "Definición de contrato EDC que relaciona un activo de datos con sus políticas de acceso y contrato.",
                "en": "EDC contract definition linking a data asset with its access and contract policies."
              },
              "caption": {
                "es": "Definición de contratos",
                "en": "Contract definition"
              }
            }
          ]
        }
      ]
    }
  },
  {
    "slug": "aura",
    "tags": [
      "Django",
      "PostGIS",
      "LangGraph",
      "OR-Tools",
      "Leaflet.js"
    ],
    "content": {
      "es": {
        "title": "AURA — Copiloto inteligente para guías turísticos",
        "description": "Proyecto colaborativo de 17 personas para planificar y gestionar experiencias turísticas con inteligencia artificial, datos geográficos y optimización de rutas.",
        "context": [
          "Proyecto colaborativo · Equipo de 17 personas"
        ],
        "problem": "Un guía necesita transformar preferencias y restricciones del grupo en un recorrido coherente, mantener sus paradas y acompañar la experiencia durante el tour.",
        "solution": "El equipo desarrolló una aplicación Django con creación manual y asistida de rutas, mapas y sesiones de tour. Combina puntos de interés curados, generación con Gemini, validación geográfica y ordenación de paradas; las propuestas se revisan antes de guardarlas.",
        "featuresTitle": "Tres ejes técnicos",
        "keyPoints": [
          {
            "title": "Arquitectura Django",
            "text": "Apps separadas para creación, rutas, tours y facturación. Modelos GeoDjango, vistas, servicios y templates con Bootstrap 5 y Leaflet."
          },
          {
            "title": "Planificación con IA",
            "text": "LangGraph encadena generación, validación, scoring y optimización. Las sesiones Django conservan restricciones, propuestas y checkpoints con caducidad."
          },
          {
            "title": "Geografía y recorridos",
            "text": "PostGIS guarda puntos y geometrías. OR-Tools ordena paradas con una matriz Haversine; GraphHopper permite calcular geometrías de recorrido."
          }
        ],
        "architecture": [
          "config registra creacion, rutas, tours, allowList y billing, con rutas HTTP por app.",
          "rutas modela guías, rutas, paradas y curiosidades; tours añade sesiones, participantes, ubicación y chat.",
          "El frontend se renderiza con templates Django y recursos HTML/CSS/JavaScript; Bootstrap 5 y Leaflet se cargan desde la plantilla base."
        ],
        "features": [
          "Creación y edición manual de rutas y paradas.",
          "Propuestas asistidas con puntos de interés curados, Gemini y validación geográfica.",
          "Estado de generación por sesión con TTL, checkpoints y selección de paradas.",
          "Mapas de guía y turista, sesiones de tour, ubicación y chat."
        ],
        "challenges": [
          "Validar respuestas y coordenadas de servicios externos antes de persistir una propuesta.",
          "Conservar el contexto de generación y permitir revisar o rechazar paradas.",
          "Mantener consistencia entre geometría, orden de paradas, permisos y sesiones de tour."
        ],
        "sections": [
          {
            "title": "IA, checkpoints y límites",
            "paragraphs": [
              "El grafo construye cuatro nodos: generación, validación, scoring y optimización. El generador prioriza la allowlist; Gemini actúa según la disponibilidad de puntos y la configuración.",
              "Los checkpoints están implementados en request.session con TTL renovable. No se presentan como un checkpointer persistente de LangGraph ni como ejecución asíncrona acreditada."
            ],
            "items": [
              "OR-Tools aplica una heurística de ordenación; no se afirma optimalidad global ni rendimiento medido.",
              "Mapbox/OSM participan en validación geográfica; GraphHopper es una integración externa para recorridos."
            ],
            "sources": []
          },
          {
            "title": "Infraestructura y calidad",
            "paragraphs": [
              "Docker Compose define base de datos y Redis. Celery tiene configuración y una tarea de limpieza de mensajes; no se localizó un encolado de la generación de itinerarios.",
              "pgvector figura en dependencias y en la activación de extensiones SQL; no se localizó un modelo vectorial o búsqueda semántica activa en el código inspeccionado."
            ],
            "items": [
              "Pruebas Django para modelos, servicios, vistas, sesiones, chat, geometría y nodos IA. Las pruebas de generación inspeccionadas simulan los proveedores externos.",
              "El repositorio incluye pruebas de navegador y escenarios Locust. No se ejecutaron aquí ni se publican métricas de cobertura, carga o fiabilidad."
            ],
            "sources": []
          },
          {
            "title": "Trabajo colaborativo y aportaciones verificables",
            "paragraphs": [
              "Equipo de 17 personas, incluido Alberto Paleteiro, según información del propietario. Las funcionalidades se describen como trabajo del equipo.",
              "El historial público asocia STX3837 a los PR #308 (pruebas de tours) y #436 (normalización de errores API), ambos integrados. Acreditan aportaciones concretas, no autoría exclusiva ni responsabilidad de diseño de todo un módulo."
            ],
            "items": [
              "Pendiente confirmar responsabilidades adicionales, coordinación y trabajo no reflejado en Git.",
              "Sin capturas públicas de AURA ni despliegue productivo verificado en esta revisión."
            ],
            "sources": []
          }
        ],
        "references": [
          {
            "label": "Django apps / URLconf",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/config/urls.py"
          },
          {
            "label": "Models / GeoDjango",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/rutas/models.py"
          },
          {
            "label": "LangGraph",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/creacion/langgraph/graph.py"
          },
          {
            "label": "Generation / sessions",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/creacion/services.py"
          },
          {
            "label": "Gemini / routing matrix",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/creacion/langgraph/utils.py"
          },
          {
            "label": "OR-Tools",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/creacion/langgraph/nodes/optimizacion.py"
          },
          {
            "label": "GraphHopper",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/rutas/graphhopper.py"
          },
          {
            "label": "Frontend",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/templates/base.html"
          },
          {
            "label": "Tours / cache",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/tours/services.py"
          },
          {
            "label": "Celery task",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/tours/tasks.py"
          },
          {
            "label": "Dependencies",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/requirements.txt"
          },
          {
            "label": "Compose",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/docker-compose.yml"
          },
          {
            "label": "Database extensions",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/init-extensions.sql"
          },
          {
            "label": "Generation tests",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/creacion/tests/test_e2e_generacion_ruta_ia.py"
          },
          {
            "label": "STX3837 · PR #308",
            "href": "https://github.com/G4-AURA/AURA/pull/308"
          },
          {
            "label": "STX3837 · PR #436",
            "href": "https://github.com/G4-AURA/AURA/pull/436"
          }
        ],
        "evidenceNote": "Inspección estática del repositorio del equipo, fijada al commit 3c5e491. No se ejecutaron la aplicación, sus servicios externos ni sus pruebas. El equipo de 17 personas es información aportada por el propietario; las contribuciones se limitan a la evidencia pública citada."
      },
      "en": {
        "title": "AURA — AI Copilot for Tour Guides",
        "description": "A collaborative 17-person project for planning and managing guided tourism experiences with artificial intelligence, geographic data, and route optimization.",
        "context": [
          "Collaborative project · 17-person team"
        ],
        "problem": "A guide needs to turn group preferences and constraints into a coherent itinerary, manage its stops, and support participants throughout the tour.",
        "solution": "The team developed a Django application with manual and assisted route creation, maps, and tour sessions. It combines curated points of interest, Gemini generation, geographic validation, and stop ordering; proposals are reviewed before they are saved.",
        "featuresTitle": "Three technical foundations",
        "keyPoints": [
          {
            "title": "Django architecture",
            "text": "Separate apps for creation, routes, tours, and billing. GeoDjango models, views, services, and templates using Bootstrap 5 and Leaflet."
          },
          {
            "title": "AI-assisted planning",
            "text": "LangGraph chains generation, validation, scoring, and optimization. Django sessions retain constraints, proposals, and checkpoints with expiry."
          },
          {
            "title": "Geography and routes",
            "text": "PostGIS stores points and geometries. OR-Tools orders stops using a Haversine matrix; GraphHopper supports route geometry calculation."
          }
        ],
        "architecture": [
          "config registers creacion, rutas, tours, allowList, and billing with app-specific HTTP routes.",
          "rutas models guides, routes, stops, and curiosities; tours adds sessions, participants, location, and chat.",
          "Django templates render HTML/CSS/JavaScript; Bootstrap 5 and Leaflet are loaded by the base template."
        ],
        "features": [
          "Manual creation and editing of routes and stops.",
          "Assisted proposals with curated points of interest, Gemini, and geographic validation.",
          "Session-based generation state with TTL, checkpoints, and stop selection.",
          "Guide and tourist maps, tour sessions, location, and chat."
        ],
        "challenges": [
          "Validate external responses and coordinates before persisting proposals.",
          "Retain generation context while allowing stop review and rejection.",
          "Keep geometry, stop order, permissions, and tour sessions consistent."
        ],
        "sections": [
          {
            "title": "AI, checkpoints, and limits",
            "paragraphs": [
              "The graph builds four nodes: generation, validation, scoring, and optimization. Generation prioritizes the allowlist; Gemini is used according to point availability and configuration.",
              "Checkpoints are implemented in request.session with renewable TTL. They are not presented as a persistent LangGraph checkpointer or as verified asynchronous generation."
            ],
            "items": [
              "OR-Tools applies a stop-ordering heuristic; no claim of global optimality or measured performance is made.",
              "Mapbox/OSM support geographic validation; GraphHopper provides an external routing integration."
            ],
            "sources": []
          },
          {
            "title": "Infrastructure and quality",
            "paragraphs": [
              "Docker Compose defines the database and Redis. Celery has configuration and a message-cleanup task; no queued itinerary generation was located.",
              "pgvector appears in dependencies and SQL extension setup; no active vector model or semantic search was located in the inspected code."
            ],
            "items": [
              "Django tests cover models, services, views, sessions, chat, geometry, and AI nodes. The inspected generation tests mock external providers.",
              "The repository includes browser tests and Locust scenarios. They were not run here; no coverage, load, or reliability results are claimed."
            ],
            "sources": []
          },
          {
            "title": "Collaboration and evidenced contributions",
            "paragraphs": [
              "A 17-person team, including Alberto Paleteiro, according to information supplied by the owner. Features are described as team work.",
              "Public history associates STX3837 with merged PR #308 (tour tests) and #436 (API error normalization). They evidence specific contributions, not sole authorship or ownership of an entire module’s design."
            ],
            "items": [
              "Additional responsibilities, coordination, and work not reflected in Git remain to be confirmed.",
              "No public AURA screenshots or verified production deployment were established in this review."
            ],
            "sources": []
          }
        ],
        "references": [
          {
            "label": "Django apps / URLconf",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/config/urls.py"
          },
          {
            "label": "Models / GeoDjango",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/rutas/models.py"
          },
          {
            "label": "LangGraph",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/creacion/langgraph/graph.py"
          },
          {
            "label": "Generation / sessions",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/creacion/services.py"
          },
          {
            "label": "Gemini / routing matrix",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/creacion/langgraph/utils.py"
          },
          {
            "label": "OR-Tools",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/creacion/langgraph/nodes/optimizacion.py"
          },
          {
            "label": "GraphHopper",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/rutas/graphhopper.py"
          },
          {
            "label": "Frontend",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/templates/base.html"
          },
          {
            "label": "Tours / cache",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/tours/services.py"
          },
          {
            "label": "Celery task",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/tours/tasks.py"
          },
          {
            "label": "Dependencies",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/requirements.txt"
          },
          {
            "label": "Compose",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/docker-compose.yml"
          },
          {
            "label": "Database extensions",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/init-extensions.sql"
          },
          {
            "label": "Generation tests",
            "href": "https://github.com/G4-AURA/AURA/blob/3c5e491d019ff5606a397c59485a531f447feed0/creacion/tests/test_e2e_generacion_ruta_ia.py"
          },
          {
            "label": "STX3837 · PR #308",
            "href": "https://github.com/G4-AURA/AURA/pull/308"
          },
          {
            "label": "STX3837 · PR #436",
            "href": "https://github.com/G4-AURA/AURA/pull/436"
          }
        ],
        "evidenceNote": "Static inspection of the team repository pinned to commit 3c5e491. The application, external services, and test suites were not run. The 17-person team size was supplied by the owner; individual contributions are limited to the cited public evidence."
      }
    },
    "repository": "https://github.com/G4-AURA/AURA",
    "repositoryLabel": {
      "es": "Equipo AURA",
      "en": "AURA team"
    },
    "technologies": [
      "Python",
      "Django",
      "GeoDjango",
      "PostgreSQL",
      "PostGIS",
      "pgvector",
      "Bootstrap 5",
      "Leaflet.js",
      "HTML",
      "CSS",
      "JavaScript",
      "LangGraph",
      "Gemini",
      "OR-Tools",
      "GraphHopper",
      "Mapbox",
      "Celery",
      "Redis",
      "Docker",
      "Docker Compose"
    ]
  }
];
