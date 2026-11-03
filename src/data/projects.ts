import type { Locale } from '../i18n/ui';
export interface EvidenceLink { label: string; href: string }
export interface ProjectSection { title: string; paragraphs: string[]; items: string[]; sources: EvidenceLink[] }
export interface ProjectComparison { title: string; note: string; rows: { topic: string; django: string; fastapi: string }[] }
export interface ProjectContent {
 title: string; description: string; problem: string; solution: string;
 features: string[]; architecture: string[]; challenges: string[]; results?: string[];
 evidenceNote: string; sections?: ProjectSection[]; comparison?: ProjectComparison;
 featuresTitle?: string; solutionTitle?: string;
}
export interface Project {
 slug: string; tags: string[]; technologies?: string[]; repository?: string; website?: string;
 content: Record<Locale, ProjectContent>;
}
export const projects: Project[] = [
  {
    "slug": "distans",
    "tags": [
      "Django",
      "FastAPI",
      "PostGIS",
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
        "problem": "Conectar comercios cercanos con compradores y coordinar catálogo, disponibilidad, pedidos y pagos en una experiencia de compra coherente.",
        "solution": "Dos implementaciones del mismo dominio: una versión Django y una versión FastAPI con páginas Jinja2 y endpoints JSON. Una única ficha permite explorar qué se conoce de cada una.",
        "features": [
          "Usuarios y roles, comercios y productos",
          "Geolocalización con PostgreSQL y PostGIS",
          "Catálogo, carrito y pedidos",
          "Pagos con Stripe y reserva de stock"
        ],
        "architecture": [
          "FastAPI: routers por dominio, modelos SQLAlchemy y esquemas Pydantic separados.",
          "Jinja2 sirve HTML; JavaScript consume endpoints JSON. No es una SPA.",
          "PostgreSQL/PostGIS para persistencia y consultas geográficas; sesiones de base de datos mediante dependencia get_db."
        ],
        "challenges": [
          "Coordinar disponibilidad, creación del pedido y pago externo.",
          "Evitar reservas repetidas al reintentar una compra.",
          "Mantener consistencia entre el pedido y el carrito cuando este cambia durante el pago."
        ],
        "evidenceNote": "FastAPI: inspección estática de código y documentación públicos. Django: alcance aportado por el propietario, sin repositorio inspeccionado. No he ejecutado Pytest ni Locust ni reproducido pruebas de concurrencia; no se publican comparativas de rendimiento.",
        "sections": [
          {
            "title": "Implementación Django",
            "paragraphs": [
              "El propietario describe una aplicación con Django y Python, PostgreSQL/PostGIS y Stripe."
            ],
            "items": [
              "Usuarios y roles; comercios y productos; geolocalización y catálogo.",
              "Carrito, pagos, gestión de pedidos y reserva de stock.",
              "Sin acceso al repositorio Django: no se atribuyen mecanismos concretos de autenticación, validación, bloqueo o pruebas."
            ],
            "sources": []
          },
          {
            "title": "Implementación FastAPI",
            "paragraphs": [
              "El código separa rutas HTML y API por dominio, lógica compartida, modelos y esquemas. El backend renderiza páginas y atiende peticiones JSON."
            ],
            "items": [
              "FastAPI, SQLAlchemy 2 y Pydantic 2; interfaz Jinja2 y JavaScript.",
              "Sesiones firmadas de Starlette, contraseñas PBKDF2-SHA256 y controles CSRF, rol y propiedad.",
              "Stripe Checkout, webhooks firmados y reconciliación de reservas.",
              "Docker Compose para desarrollo; Pytest y escenarios Locust presentes."
            ],
            "sources": [
              {
                "label": "main.py",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/main.py"
              },
              {
                "label": "app/routers/auth.py",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/routers/auth.py"
              },
              {
                "label": "app/security.py",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/security.py"
              },
              {
                "label": "requirements.txt",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/requirements.txt"
              }
            ]
          },
          {
            "title": "Concurrencia: la última unidad",
            "paragraphs": [
              "Si dos compradores leen una unidad disponible, una lectura previa no basta para que ambos puedan reservarla. La versión FastAPI comprueba la disponibilidad dentro de la actualización de stock."
            ],
            "items": [
              "finalizar_compra ejecuta UPDATE condicionado por producto disponible y stock suficiente; comprueba rowcount == 1.",
              "Si no se actualiza una fila, rollback revierte la reserva de la operación y se responde con conflicto HTTP 409. Pedido y líneas se confirman antes de contactar con Stripe.",
              "with_for_update bloquea pedidos existentes; no se presenta como un bloqueo previo de productos inexistentes. La reserva del producto usa la actualización condicional.",
              "El código de pedido deriva del token de compra y es único. Ante IntegrityError se revierte la transacción y se recupera el pedido ya creado.",
              "Stripe usa una clave de idempotencia; la liberación comprueba reserva_liberada. Son mecanismos inspeccionados, no una garantía de concurrencia demostrada mediante ensayos propios."
            ],
            "sources": [
              {
                "label": "Compra y reserva condicional",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/routers/compra.py#L146-L198"
              },
              {
                "label": "Restricciones de pedido",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/models.py#L345-L375"
              },
              {
                "label": "Idempotencia y liberación",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/stripe_payments.py#L56-L80"
              }
            ]
          },
          {
            "title": "Pruebas y mantenibilidad",
            "paragraphs": [
              "El repositorio contiene pruebas de compra, control de acceso, pagos y liberación de reservas, además de escenarios de carga."
            ],
            "items": [
              "Las pruebas de compra verifican reintentos idempotentes y rechazo al cambiar precio, stock o disponibilidad.",
              "La configuración de Pytest usa SQLite en memoria: su presencia no prueba bloqueos o aislamiento bajo PostgreSQL concurrente.",
              "Routers, esquemas, modelos y pagos separados facilitan localizar responsabilidades. La comparación con Django no atribuye una superioridad de mantenibilidad.",
              "Hay artefactos de carga en el repositorio, pero no se utilizan para afirmar rendimiento sin demostrar condiciones equivalentes."
            ],
            "sources": [
              {
                "label": "tests/test_compra_directa.py",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/tests/test_compra_directa.py"
              },
              {
                "label": "tests/test_stripe_payments.py",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/tests/test_stripe_payments.py"
              },
              {
                "label": "tests/conftest.py",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/tests/conftest.py"
              },
              {
                "label": "load_tests/locustfile.py",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/load_tests/locustfile.py"
              }
            ]
          }
        ],
        "comparison": {
          "title": "Mismo problema, dos implementaciones",
          "note": "La columna Django distingue capacidades generales del framework de los detalles pendientes de verificar. FastAPI describe decisiones observadas en este repositorio, no ventajas automáticas del framework.",
          "rows": [
            {
              "topic": "Arquitectura",
              "django": "Django es un framework integrado; la estructura concreta del proyecto no está verificada.",
              "fastapi": "Routers, esquemas, modelos y lógica compartida separados."
            },
            {
              "topic": "Organización del backend",
              "django": "Django permite organizar por apps; organización real pendiente.",
              "fastapi": "app/routers por dominio y módulos compartidos en app/."
            },
            {
              "topic": "Rutas y peticiones",
              "django": "Django dispone de URLs y vistas; rutas reales pendientes.",
              "fastapi": "APIRouter, dependencias, HTML Jinja2 y endpoints JSON."
            },
            {
              "topic": "ORM y persistencia",
              "django": "Django incluye ORM; uso concreto pendiente. PostgreSQL/PostGIS aportados por el propietario.",
              "fastapi": "SQLAlchemy 2, sesiones get_db y modelos relacionales/geográficos."
            },
            {
              "topic": "Validación",
              "django": "Django ofrece formularios y validadores; implementación pendiente.",
              "fastapi": "Modelos y validadores Pydantic 2, además de comprobaciones de negocio."
            },
            {
              "topic": "Autenticación",
              "django": "Django incluye autenticación; configuración del proyecto no inspeccionada.",
              "fastapi": "Sesiones firmadas, PBKDF2-SHA256, CSRF y comprobaciones de rol/propiedad."
            },
            {
              "topic": "Transacciones",
              "django": "El propietario confirma reserva de stock; mecanismo interno sin verificar.",
              "fastapi": "UPDATE condicional, rowcount, rollback, códigos únicos y bloqueos de pedidos."
            },
            {
              "topic": "Integraciones",
              "django": "Geolocalización y Stripe confirmados por el propietario.",
              "fastapi": "PostGIS, Stripe Checkout, webhook firmado y correo local documentado."
            },
            {
              "topic": "Pruebas",
              "django": "Suite y cobertura no disponibles.",
              "fastapi": "Archivos Pytest y Locust inspeccionados; no ejecutados en esta revisión."
            },
            {
              "topic": "Mantenibilidad",
              "django": "No se infiere calidad de implementación a partir del framework.",
              "fastapi": "Separación de responsabilidades observada; sin métricas comparativas."
            }
          ]
        }
      },
      "en": {
        "title": "DISTANS",
        "description": "A geolocated local-commerce marketplace with Django and FastAPI implementations.",
        "problem": "Connect nearby shops with shoppers while coordinating catalogues, availability, orders, and payments in a coherent shopping experience.",
        "solution": "Two implementations of the same domain: a Django version and a FastAPI version serving Jinja2 pages and JSON endpoints. One case study distinguishes what is known about each.",
        "features": [
          "Users and roles, shops and products",
          "Geolocation with PostgreSQL and PostGIS",
          "Catalogue, cart, and orders",
          "Stripe payments and stock reservation"
        ],
        "architecture": [
          "FastAPI: domain routers, SQLAlchemy models, and separate Pydantic schemas.",
          "Jinja2 serves HTML; JavaScript consumes JSON endpoints. This is not a SPA.",
          "PostgreSQL/PostGIS for persistence and geographic queries; database sessions through the get_db dependency."
        ],
        "challenges": [
          "Coordinating availability, order creation, and an external payment service.",
          "Avoiding repeated reservations when a purchase is retried.",
          "Keeping orders and carts consistent when a cart changes during payment."
        ],
        "evidenceNote": "FastAPI: static inspection of public code and documentation. Django: owner-provided scope, without an inspected repository. I have not run Pytest or Locust or reproduced concurrency tests; no performance comparisons are published.",
        "sections": [
          {
            "title": "Django implementation",
            "paragraphs": [
              "The owner describes a Django/Python application using PostgreSQL/PostGIS and Stripe."
            ],
            "items": [
              "Users and roles; shops and products; geolocation and catalogue.",
              "Cart, payments, order management, and stock reservation.",
              "Without the Django repository, specific authentication, validation, locking, and testing mechanisms remain unverified."
            ],
            "sources": []
          },
          {
            "title": "FastAPI implementation",
            "paragraphs": [
              "The code separates HTML/API routes by domain from shared logic, models, and schemas. The backend renders pages and handles JSON requests."
            ],
            "items": [
              "FastAPI, SQLAlchemy 2, and Pydantic 2; a Jinja2 and JavaScript interface.",
              "Signed Starlette sessions, PBKDF2-SHA256 passwords, CSRF, and role/ownership checks.",
              "Stripe Checkout, signed webhooks, and reservation reconciliation.",
              "Docker Compose for development; Pytest and Locust scenarios are present."
            ],
            "sources": [
              {
                "label": "main.py",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/main.py"
              },
              {
                "label": "app/routers/auth.py",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/routers/auth.py"
              },
              {
                "label": "app/security.py",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/security.py"
              },
              {
                "label": "requirements.txt",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/requirements.txt"
              }
            ]
          },
          {
            "title": "Concurrency: the last unit",
            "paragraphs": [
              "When two shoppers read one available unit, an earlier read alone cannot guarantee a reservation. The FastAPI implementation checks availability as part of its stock update."
            ],
            "items": [
              "finalizar_compra issues a conditional UPDATE requiring an available product and sufficient stock, then checks rowcount == 1.",
              "If no row is updated, rollback reverses the operation’s reservation and the request receives HTTP 409. Orders and lines are committed before contacting Stripe.",
              "with_for_update locks existing orders; it is not presented as locking absent products in advance. Product reservation uses the conditional update.",
              "The order code derives from the purchase token and is unique. IntegrityError triggers rollback and retrieval of the existing order.",
              "Stripe receives an idempotency key; release checks reserva_liberada. These are inspected mechanisms, not concurrency guarantees demonstrated by my own tests."
            ],
            "sources": [
              {
                "label": "Purchase and conditional reservation",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/routers/compra.py#L146-L198"
              },
              {
                "label": "Order constraints",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/models.py#L345-L375"
              },
              {
                "label": "Idempotency and release",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/app/stripe_payments.py#L56-L80"
              }
            ]
          },
          {
            "title": "Testing and maintainability",
            "paragraphs": [
              "The repository contains tests for purchases, access control, payments, and reservation release, alongside load scenarios."
            ],
            "items": [
              "Purchase tests cover idempotent retries and rejection when price, stock, or availability changes.",
              "The Pytest configuration uses in-memory SQLite: these files do not demonstrate concurrent PostgreSQL locking or isolation.",
              "Separate routers, schemas, models, and payment modules make responsibilities easier to locate. No maintainability superiority over Django is claimed.",
              "Load artefacts exist, but no performance conclusions are drawn without establishing equivalent conditions."
            ],
            "sources": [
              {
                "label": "tests/test_compra_directa.py",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/tests/test_compra_directa.py"
              },
              {
                "label": "tests/test_stripe_payments.py",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/tests/test_stripe_payments.py"
              },
              {
                "label": "tests/conftest.py",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/tests/conftest.py"
              },
              {
                "label": "load_tests/locustfile.py",
                "href": "https://github.com/STX3837/Distans-FastAPI/blob/21779c98d258f5f2a69313d2fa1b4b4bb2589ba4/load_tests/locustfile.py"
              }
            ]
          }
        ],
        "comparison": {
          "title": "Same problem, two implementations",
          "note": "The Django column separates general framework capabilities from unverified project details. FastAPI describes observed repository decisions, not automatic framework advantages.",
          "rows": [
            {
              "topic": "Architecture",
              "django": "Django is an integrated framework; this project’s structure has not been verified.",
              "fastapi": "Separate routers, schemas, models, and shared logic."
            },
            {
              "topic": "Backend organisation",
              "django": "Django supports apps; the actual organisation is unverified.",
              "fastapi": "Domain routers in app/routers and shared modules in app/."
            },
            {
              "topic": "Routes and requests",
              "django": "Django provides URL routing and views; actual routes are unverified.",
              "fastapi": "APIRouter, dependencies, Jinja2 HTML, and JSON endpoints."
            },
            {
              "topic": "ORM and persistence",
              "django": "Django includes an ORM; actual usage is unverified. PostgreSQL/PostGIS are owner-confirmed.",
              "fastapi": "SQLAlchemy 2, get_db sessions, and relational/geographic models."
            },
            {
              "topic": "Validation",
              "django": "Django offers forms and validators; implementation is unverified.",
              "fastapi": "Pydantic 2 models and validators, plus business checks."
            },
            {
              "topic": "Authentication",
              "django": "Django includes authentication; project configuration was not inspected.",
              "fastapi": "Signed sessions, PBKDF2-SHA256, CSRF, and role/ownership checks."
            },
            {
              "topic": "Transactions",
              "django": "The owner confirms stock reservation; internals are unverified.",
              "fastapi": "Conditional UPDATE, rowcount, rollback, unique codes, and order locks."
            },
            {
              "topic": "Integrations",
              "django": "Geolocation and Stripe are owner-confirmed.",
              "fastapi": "PostGIS, Stripe Checkout, signed webhooks, and documented local email."
            },
            {
              "topic": "Testing",
              "django": "Test suite and coverage are unavailable.",
              "fastapi": "Pytest and Locust files inspected, not executed in this review."
            },
            {
              "topic": "Maintainability",
              "django": "Implementation quality is not inferred from the framework.",
              "fastapi": "Observed separation of responsibilities; no comparative metrics."
            }
          ]
        }
      }
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
        "solution": "Un demostrador local de espacio de datos con EDC, DSP y DCP. El Consumer obtiene información autorizada de tres Providers y construye un estado agregado, sin convertir el espacio de datos en un almacén centralizado.",
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
        "evidenceNote": "Demostrador local con servicios mock y configuración de desarrollo. Se han inspeccionado código, configuración y documentación; no se han levantado contenedores ni ejecutado Gradle o los smoke tests en esta revisión. No representa una plataforma productiva ni una integración con autoridades reales.",
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
              "Validaciones de coherencia de containerId y consulta de artefactos y timeline. No se han generado capturas ficticias."
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
              "El smoke consulta catálogos, negocia contratos, transfiere, descarga y comprueba la agregación. Son pasos implementados, no una ejecución realizada para este portfolio.",
              "Hay tests Java de scopes DCP y evaluación de credenciales/órdenes. Su presencia no se presenta como un resultado de tests ejecutados.",
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
        "solutionTitle": "Objetivo y solución"
      },
      "en": {
        "title": "Puerto Dataspace EDC",
        "description": "Prototype for secure, controlled data exchange among participants in a port environment.",
        "problem": "A transport company needs three independent clearances before collecting a container, while respecting each provider’s access conditions.",
        "solution": "A local EDC, DSP, and DCP dataspace demonstrator. A Consumer obtains authorised information from three Providers and builds an aggregate status without turning the dataspace into a central data store.",
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
        "evidenceNote": "A local demonstrator with mock services and development configuration. Code, configuration, and documentation were inspected; containers, Gradle, and smoke tests were not run in this review. This is neither a production platform nor an integration with actual public authorities.",
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
              "Container-ID consistency checks, artefacts, and event timeline. No fictional screenshots have been created."
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
              "The smoke test queries catalogues, negotiates contracts, transfers, downloads, and checks aggregation. These are implemented steps, not a run performed for this portfolio.",
              "Java tests cover DCP scopes and credential/order evaluation. Their presence is not presented as an executed test result.",
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
        "solutionTitle": "Objective and solution"
      }
    }
  },
  {
    "slug": "aura",
    "tags": [
      "LLM",
      "Web",
      "Maps"
    ],
    "content": {
      "es": {
        "title": "AURA",
        "description": "Aplicación orientada a generar itinerarios de viaje personalizados mediante modelos de lenguaje y datos geográficos.",
        "problem": "Combinar preferencias del viajero, destinos y recorridos al organizar un itinerario.",
        "solution": "Un planificador de viajes con IA. El alcance aportado por el propietario incluye generación de itinerarios, personalización, rutas y mapas e interfaz responsive.",
        "features": [
          "Itinerarios según preferencias del viajero",
          "Integración de modelos de lenguaje",
          "Información geográfica, rutas y destinos",
          "Diseño responsive y experiencia de usuario"
        ],
        "architecture": [
          "Alcance funcional proporcionado por el propietario; arquitectura interna pendiente de verificar.",
          "Proveedor de IA, modelo y stack técnico no confirmados."
        ],
        "challenges": [
          "Coherencia de los itinerarios y su adaptación a preferencias.",
          "Presentación comprensible de destinos y rutas en pantallas pequeñas.",
          "Retos del dominio, sin atribuir soluciones internas no verificadas."
        ],
        "evidenceNote": "Información aportada por el propietario, sin repositorio disponible para esta revisión. No se han verificado implementaciones, pruebas, proveedor de IA ni despliegue. La separación entre funciones implementadas y previstas queda pendiente de confirmar.",
        "featuresTitle": "Alcance declarado, pendiente de confirmar"
      },
      "en": {
        "title": "AURA",
        "description": "An application designed to generate personalised travel itineraries using language models and geographic data.",
        "problem": "Combine traveller preferences, destinations, and routes when planning an itinerary.",
        "solution": "An AI travel planner. The owner-provided scope includes itinerary generation, personalisation, routes and maps, and a responsive interface.",
        "features": [
          "Itineraries based on traveller preferences",
          "Language model integration",
          "Geographic information, routes, and destinations",
          "Responsive design and user experience"
        ],
        "architecture": [
          "Owner-provided functional scope; internal architecture awaits verification.",
          "AI provider, model, and technical stack are unconfirmed."
        ],
        "challenges": [
          "Itinerary coherence and adaptation to preferences.",
          "Clear presentation of destinations and routes on small screens.",
          "Domain challenges, without attributing unverified internal solutions."
        ],
        "evidenceNote": "Owner-provided information, without a repository available for this review. Implementation, tests, AI provider, and deployment have not been verified. Confirmation of which features are implemented or planned is pending.",
        "featuresTitle": "Stated scope, awaiting confirmation"
      }
    }
  }
];
