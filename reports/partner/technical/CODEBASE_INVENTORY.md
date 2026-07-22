# Inventario verificable del codebase de MPHO Aliados

Fecha de inspección: 2026-07-21

Rama: `agent/partner-technical-inventory`

Commit inspeccionado antes de este reporte: `5ca06c19f70878cd89c3d1231c11d66d7932b9f5` (`merge: sync partner with secured main`)

Aplicación inspeccionada: `apps/partner/**`

## 1. Alcance y método

Este inventario separa deliberadamente:

- **implementación actual**: código, configuración, migraciones, tipos generados, pruebas y CI presentes en el commit inspeccionado;
- **arquitectura objetivo**: especificaciones bajo `docs/`, que no prueban comportamiento ejecutable por sí mismas.

También se revisaron `AGENTS.md`, `README.md`, el índice y overview, los documentos Partner/PWA/seguridad relacionados, los dos reportes de auditoría raíz, el historial reciente, las migraciones y `packages/database/types.generated.ts`. No se consultó ni modificó Supabase remoto, Vercel ni producción.

## 2. Veredicto técnico actual

MPHO Aliados es hoy una **aplicación web responsive independiente con autenticación Supabase, callback PKCE y una barrera de autorización Partner en proxy**. No es todavía una aplicación operativa: pedidos, paquetes, configuración, ganancias y detalle de pedido muestran estados honestos de indisponibilidad y no ejecutan consultas ni mutaciones de negocio.

Tampoco es una PWA instalable completa. No existen manifest, iconos de instalación, directorio `public`, service worker, registro de push, estrategia offline, flujo de instalación ni control de actualización.

La base de datos sí contiene la fundación de identidad y configuración Partner. La aplicación usa sólo `profiles`, `user_roles` y `partners` para autorizar acceso; no consume las tablas existentes de capacidades u horarios ni existe todavía un contrato persistente de ofertas, asignaciones, tareas, custodia, evidencia, earnings o payouts.

## 3. Tecnologías y dependencias reales

### 3.1 Runtime y build

| Elemento | Evidencia actual |
| --- | --- |
| Monorepo | pnpm workspace con `apps/*` y `packages/*`; `pnpm-workspace.yaml` |
| Framework | Next.js `16.2.6`, App Router; `apps/partner/package.json` |
| UI runtime | React/React DOM `^19` |
| Lenguaje | TypeScript `5.7.3`, `strict: true`, `noEmit: true`; `apps/partner/tsconfig.json` |
| Estilos | Tailwind CSS `^4.2.0`, PostCSS `^8.5`, `@tailwindcss/postcss`; `app/globals.css` y `postcss.config.mjs` |
| Backend/BaaS | Supabase con `@supabase/ssr ^0.12.0` y `@supabase/supabase-js ^2.110.2` |
| Iconos | `lucide-react ^1.24.0` |
| Clases | `clsx ^2.1.1` y `tailwind-merge ^3.6.0` mediante `lib/utils.ts` |
| Pruebas | Vitest `^3.2.0`, jsdom `^29.1.1`, Testing Library React/Jest DOM |
| Build de imágenes | `images.unoptimized: true`; `apps/partner/next.config.mjs` |
| Runtime local observado | Node `v24.11.1`, pnpm `11.10.0` |
| Runtime CI declarado | Node `22`, pnpm `9`; `.github/workflows/ci.yml` |

`@mpho/database` se usa sólo con `import type` para el tipo generado `Database`. `@mpho/design-tokens` y `@mpho/types` están declarados como dependencias directas, pero no tienen imports de runtime en `apps/partner` al momento de la inspección. La interfaz define sus tokens directamente en `apps/partner/app/globals.css`.

### 3.2 Scripts reales

En `apps/partner/package.json`:

```text
pnpm --filter @mpho/partner dev       # next dev --turbopack -p 3001
pnpm --filter @mpho/partner build     # next build
pnpm --filter @mpho/partner start     # next start
pnpm --filter @mpho/partner lint      # eslint .
pnpm --filter @mpho/partner typecheck # tsc --noEmit
pnpm --filter @mpho/partner test      # vitest run --passWithNoTests
```

El paquete raíz expone además `dev:partner` y `build:partner`. No hay script Partner específico de E2E, accesibilidad, PWA o prueba visual.

## 4. Rutas y layouts implementados

El build generó 13 rutas, contando `/_not-found`:

| Ruta | Tipo de build | Acceso esperado | Implementación actual |
| --- | --- | --- | --- |
| `/` | estática | pública | Server Component que redirige a `/login` |
| `/_not-found` | estática | framework | estado de Next.js |
| `/login` | estática | pública | Client Component; email/password con Supabase |
| `/signup` | estática | pública | Server Component informativo; no registra ni invita |
| `/callback` | dinámica | pública | Route Handler `GET`; intercambio PKCE y redirect sanitizado |
| `/acceso` | estática | pública | Client Component; explica falta de autorización y permite cerrar sesión |
| `/inicio` | estática | protegida | shell y resumen operativo no disponible |
| `/pedidos` | estática | protegida | placeholder honesto; sin consulta ni filtros |
| `/pedidos/[id]` | dinámica | protegida | no consume `params` ni consulta el pedido |
| `/paquetes` | estática | protegida | placeholder honesto; sin custodia persistida |
| `/ganancias` | estática | protegida | placeholder honesto; sin ledger |
| `/configuracion` | estática | protegida | placeholder honesto; sin perfil, horarios o capacidades |
| `/perfil` | estática | protegida | Client Component; muestra sólo email de Supabase Auth y logout |

Evidencia: `apps/partner/app/**`, `apps/partner/lib/routes.ts` y salida de `pnpm --filter @mpho/partner build`.

### 4.1 Contratos de rutas sin pantalla

`lib/routes.ts` clasifica `/equipo` y el prefijo `/equipo/` como protegidos, pero no existe ruta, enlace ni pantalla correspondiente. También clasifica `/paquetes/` como prefijo protegido, aunque sólo existe `/paquetes`. Esos valores son contratos de enrutamiento anticipados, no funcionalidades.

El matcher del proxy excluye `manifest.json`, `sw.js` e `icons/`, pero ninguno de esos artefactos existe. La exclusión no prueba PWA.

### 4.2 Layouts y composición Server/Client

- `app/layout.tsx`: Server Component raíz; metadata/viewport y montaje del provider cliente.
- `app/(auth)/layout.tsx`: Server Component centrado para acceso.
- `app/(protected)/layout.tsx`: Server Component que monta `PartnerShell`.
- `PartnerShell`: Server Component estructural.
- Client Components explícitos: `acceso`, `login`, `perfil`, `partner-bottom-nav`, `partner-header`, `partner-sidebar`, `auth-context` y `providers`.
- El resto de páginas/componentes son Server Components por defecto.
- No hay Server Actions.
- El único Route Handler de Partner es `GET /callback`.

## 5. Componentes implementados

| Componente | Responsabilidad real |
| --- | --- |
| `PartnerShell` | sidebar desktop + header móvil + contenido + bottom nav móvil |
| `PartnerSidebar` | navegación desktop y logout |
| `PartnerHeader` | título por pathname, marca y enlace al perfil en móvil |
| `PartnerBottomNav` | navegación móvil: Inicio, Pedidos, Paquetes, Ganancias, Más |
| `OperationalUnavailable` | estado reutilizable para módulos sin fuente autorizada |
| `AuthProvider` | usuario Supabase, loading/error, suscripción auth y logout confirmado |
| `Providers` | un único `AuthProvider` raíz |

No existen aún los componentes operativos descritos en Pack 12, por ejemplo `OfferCard`, `PreparationChecklist`, `EvidenceCapture`, `PackageScanner`, `EarningsLedger`, `OfflineBanner` o `SyncStatus`.

## 6. Responsive y accesibilidad observable

### Implementado

- Breakpoint efectivo principal: `lg` de Tailwind.
- Menos de `lg`: sidebar oculto; header y bottom navigation visibles.
- Desde `lg`: sidebar fijo de `16rem`; header y bottom navigation ocultos.
- Navegación inferior respeta `env(safe-area-inset-bottom)`.
- El contenido añade `pb-24` en móvil para no quedar bajo la navegación.
- Targets principales usan `min-h-11` o dimensiones equivalentes a 44 px.
- `aria-current`, etiquetas de navegación, `role="alert"`, `role="status"`, foco visible e iconos decorativos con `aria-hidden` están presentes.
- `viewportFit: 'cover'`, ancho de dispositivo y escala inicial están declarados.

El reporte `CODEX_PARTNER_AUDIT_REPORT.md` registra una comprobación histórica a `390x844` y `1440x900` sin overflow. En esta inspección no se repitió una prueba visual de navegador; sí se verificó el código y el build actual.

### No implementado o no probado aquí

- No hay adaptación específica para tablet, cola + detalle, cámara o scanner.
- No hay skip link, prueba automatizada de teclado, lector de pantalla, zoom 200 %, reduced motion o contraste.
- No hay estados offline/update/maintenance.
- No hay E2E de navegador ni matriz de dispositivos en el paquete.

## 7. Placeholders y verdad operacional

Las pantallas protegidas no simulan datos:

- `/inicio` no muestra métricas ni tareas supuestas;
- `/pedidos` y `/pedidos/[id]` no afirman que la cola esté vacía o que un ID no exista;
- `/paquetes` no afirma recepción o custodia;
- `/ganancias` no muestra saldos `0` ni adeudos ficticios;
- `/configuracion` no inventa horarios, capacidades o elegibilidad MPHORA.

El único contenido “próximamente” visible está en preferencias de perfil. No existe persistencia asociada.

## 8. Autenticación y autorización

### 8.1 Flujo de autenticación implementado

1. `/login` crea el browser client con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Ejecuta `auth.signInWithPassword` en cliente.
3. El proxy usa `auth.getUser()` en servidor y renueva cookies mediante `@supabase/ssr`.
4. `/callback` usa `exchangeCodeForSession(code)` en servidor para PKCE.
5. `getSafeRedirect` admite sólo rutas protegidas internas conocidas y rechaza origen externo, `//`, rutas públicas y normalizaciones inseguras.
6. `AuthProvider` usa `getUser()` y una sola suscripción `onAuthStateChange`.
7. Logout sólo limpia estado y navega después de que Supabase confirma `signOut()`.

No hay auto-registro Partner: `/signup` explica invitación y asignación administrativa. No están implementados recuperación de contraseña, MFA, enrollment, invitaciones, device trust ni step-up.

### 8.2 Barrera Partner del proxy

Para una ruta protegida, `lib/supabase/proxy.ts` exige acumulativamente:

1. un usuario válido de Supabase Auth;
2. `profiles.auth_user_id = user.id` y `profiles.status = active`;
3. un `user_roles` activo, no revocado, con rol `partner_operator` o `partner_admin` y `partner_id` no nulo;
4. el `partners.id` asignado con estado `active` o `paused`.

Un error de consulta devuelve `unavailable` y falla cerrado. Una sesión válida sin autorización Partner va a `/acceso`. Las consultas usan la anon key y la sesión del usuario, por lo que dependen de RLS; no hay `service_role` en `apps/partner`.

La autorización actual es sólo una puerta de rutas. No hay todavía autorización por objeto/acción para pedidos u operaciones porque esos endpoints no existen.

## 9. Backend, endpoints y contratos

### Implementado

- `GET /callback`: intercambio PKCE y redirect.
- Proxy Next.js: refresh de sesión y gate Partner.
- Clientes Supabase separados para browser, servidor y proxy.
- Validación explícita de configuración pública; falla si falta URL o anon key.

### No implementado

- Ningún endpoint/API Partner de pedidos, ofertas, paquetes, preparación, evidencia, incidentes, catálogo, horarios, equipo, ganancias o payouts.
- Ninguna Server Action Partner.
- Ningún webhook Partner.
- Ningún servicio de transición de estado consumido por Aliados.
- Ningún upload a Storage, URL firmada, cámara, notificación, analytics u observabilidad operacional.
- Ningún adapter de WhatsApp, logística, n8n o pagos dentro de `apps/partner`.

## 10. Base de datos y Supabase vigentes

### 10.1 Migraciones que forman el contrato Partner

| Migración | Papel vigente |
| --- | --- |
| `20250101000001_extensions_and_enums.sql` | roles, estados de perfil/Partner/capacidad |
| `20250101000003_identity_tables.sql` | `profiles`, `user_roles`, helpers de identidad históricos |
| `20250101000006_partner_tables.sql` | tablas Partner y relaciones |
| `20250101000008_rls_policies.sql` | RLS base; varias políticas/grants son sustituidas después |
| `20250101000009_auth_signup_trigger.sql` | creación de perfil, Customer y rol Customer |
| `20250101000011_catalog_tables.sql` | `listings.partner_id` para catálogo local |
| `20250101000012_catalog_rls.sql` | acceso de catálogo asociado a Partner |
| `20260718111400_identity_partner_privilege_hardening.sql` | contrato efectivo de mínimo privilegio y membresía activa |

La última migración es la fuente técnica vigente para grants/policies Partner; no se debe interpretar la migración base 008 de forma aislada.

### 10.2 Tablas y relaciones Partner existentes

| Tabla | Relaciones principales | Uso actual desde `apps/partner` |
| --- | --- | --- |
| `profiles` | `auth_user_id`; padre de `user_roles` | sí, autorización |
| `user_roles` | `profile_id → profiles`; `partner_id → partners` | sí, autorización |
| `partners` | `city_id → cities`; `primary_zone_id → zones`; `address_id → addresses` | sí, autorización/estado |
| `partner_capabilities` | `partner_id → partners`; `approved_by → profiles` | no |
| `partner_schedules` | `partner_id → partners` | no |
| `partner_schedule_exceptions` | `partner_id → partners` | no |
| `partner_capacity` | `partner_id → partners`; `updated_by → profiles` | no |
| `listings` | `partner_id → partners` para `partner_local` | no |

El enum de roles incluye `partner_operator` y `partner_admin`. El enum `partner_status` implementado contiene `pending_onboarding`, `active`, `paused`, `suspended` y `closed`.

### 10.3 RLS y privilegios efectivos

`has_active_partner_membership(partner_id, require_admin)` exige perfil activo, rol Partner activo/no revocado, mismo `partner_id`, Partner `active|paused` y, cuando se solicita, `partner_admin`.

- `partners`: lectura del propio Partner; sin mutación desde navegador autenticado.
- `partner_capabilities`, `partner_schedule_exceptions`, `partner_capacity`: lectura propia; sin mutación directa autenticada.
- `partner_schedules`: lectura propia; Partner admin puede actualizar únicamente `day_of_week`, `opens_at`, `closes_at`, `is_closed`, `effective_from`, `effective_to` de filas propias.
- `user_roles`: lectura propia; sin inserción/actualización/borrado autenticado.
- `profiles`: lectura propia y actualización allowlisted de `display_name`/`phone`.
- `addresses`: la política endurecida permite lectura de dirección Partner propia e inserción para Partner admin; la aplicación actual no la usa.

Los tipos generados describen la forma SQL completa; sus tipos `Insert`/`Update` no conceden permisos y no sustituyen grants/RLS.

### 10.4 Contratos operativos ausentes

No existen tablas ejecutables denominadas `partner_offers`, `fulfillment_tasks`, `package_receipts`, `partner_earnings`, `partner_payout_accounts`, `payouts`, `deliveries` o `incidents`. Tampoco existe `responsible_partner_id` en `orders`.

La fase de pagos actual llega a `paid`, pero documenta y aplica explícitamente que no asigna Partner. Por ello Aliados no tiene aún una relación segura pedido → Punto MPHO que pueda consultar.

## 11. Pruebas, build y CI

### 11.1 Suite Partner

Hay 8 archivos y 40 pruebas:

- auth context y logout exitoso/fallido;
- callback PKCE, errores y redirect seguro;
- configuración pública completa/incompleta;
- navegación móvil/desktop y rutas activas;
- render de pantallas y ausencia de métricas ficticias;
- lookup `profiles → user_roles → partners` y fallo cerrado;
- proxy sin sesión, sin autorización, autorizado y errores;
- clasificación y sanitización de rutas.

No prueban pedidos reales, autorización por order/partner ID, horarios, mutaciones, suspensión durante una sesión, doble acción operacional, uploads, PWA, responsive real, accesibilidad ni integraciones.

### 11.2 Ejecución local definitiva

| Comando | Resultado |
| --- | --- |
| `pnpm --filter @mpho/partner lint` | PASS, exit 0 |
| `pnpm --filter @mpho/partner typecheck` | PASS, exit 0 |
| `pnpm --filter @mpho/partner test` | PASS en rerun serial: 8 archivos, 40/40 pruebas, exit 0 |
| `pnpm --filter @mpho/partner build` | PASS, 13 rutas, exit 0 |

Durante la materialización inicial de `node_modules`, una ejecución concurrente de los cuatro comandos produjo un timeout de 5 s en la prueba de login (39/40). La repetición serial, una vez terminada la instalación, pasó 40/40; se registra para no ocultar sensibilidad a contención, pero el resultado definitivo del comando solicitado es PASS.

### 11.3 CI existente

Existe un único workflow: `.github/workflows/ci.yml`.

- Dispara en push y PR hacia `main`.
- Declara `permissions: contents: read`.
- Fija Actions por SHA completo.
- Usa Node 22 y pnpm 9.
- Ejecuta frozen install, secret scan, lint, typecheck y tests.
- Inicia Supabase local, exporta y enmascara la anon key local, resetea DB, ejecuta pgTAP y REST, genera/verifica tipos, comprueba drift y construye las tres apps.
- Detiene Supabase con `if: always()`.

No se consultó el estado de una ejecución remota ni se hizo push. La existencia del YAML no prueba un run remoto verde para esta rama.

## 12. Estado PWA real

| Requisito objetivo | Estado actual |
| --- | --- |
| origen/app Next.js separado | existe en monorepo; despliegue/origen no verificado |
| metadata y viewport | sí |
| manifest propio | no |
| iconos 192/512/maskable/apple | no |
| favicon/public assets Partner | no |
| service worker | no |
| instalación | no implementada/probada |
| offline/cache | no implementado |
| push/notificaciones | no implementado |
| actualización controlada | no implementada |
| limpieza de caché privada al logout | no aplica aún; no hay caché PWA |
| QA en dispositivos objetivo | no verificada en esta rama |

Conclusión: **web responsive, no PWA instalable completa**.

## 13. Implementación actual frente a arquitectura objetivo

| Dominio | Implementación actual | Arquitectura objetivo documentada |
| --- | --- | --- |
| acceso | password, PKCE, sesión y gate Partner | invitación, MFA, recovery y step-up |
| navegación | Inicio, Pedidos, Paquetes, Ganancias, Perfil/Configuración | ofertas, preparación, entregas, incidentes, equipo y más |
| pedidos | pantallas sin datos | cola, detalle, acciones autorizadas, deadlines y evidencia |
| horarios | tabla/RLS existentes; sin UI/servicio | gestión autorizada de horarios y excepciones |
| paquetes | placeholder | recepción, condición, custodia y discrepancias |
| preparación | inexistente | checklist, evidencia, QC y listo |
| finanzas Partner | placeholder | earning lines, estados, statements y payouts conciliados |
| PWA | responsive | manifest, iconos, SW, instalación, push, offline seguro, updates |
| observabilidad | errores públicos genéricos | logs/audit/alerts con minimización de PII |

## 14. Comandos reproducibles usados para el inventario

```text
git status --short --branch
git log --oneline --decorate -15
git worktree list --porcelain
rg --files apps/partner
rg --files supabase/migrations
rg -n "partner_id|has_active_partner_membership" supabase/migrations
rg -n "partner_" packages/database/types.generated.ts
find .github -maxdepth 3 -type f -print
pnpm --filter @mpho/partner lint
pnpm --filter @mpho/partner typecheck
pnpm --filter @mpho/partner test
pnpm --filter @mpho/partner build
git diff --check
```

## 15. Decisiones pendientes que bloquean implementación operacional

1. Contrato persistente de asignación y oferta de un único Punto MPHO después de `paid`.
2. Matriz exacta de acciones para `partner_operator` y `partner_admin`, con privilegio mínimo por defecto.
3. División precisa entre solicitud Partner y aprobación/ejecución Central para personal, roles, capacidades, pausas y datos maestros.
4. Mapeo aprobado entre lifecycle documental de Partner y enum/migraciones reales.
5. Contratos de horarios: quién crea filas, quién gestiona excepciones y qué cambia un Partner pausado.
6. Modelo de tareas, evidencia privada, custodia, incidentes y auditoría.
7. Reglas económicas, ledger, earnings, payouts, SLA, cancelaciones y disputas.
8. Alcance y aceptación de PWA por dispositivo, offline y notificaciones.
9. Mapa de rutas definitivo del piloto; la priorización pedidos/detalle/estados/horarios sigue siendo propuesta hasta aprobación.
