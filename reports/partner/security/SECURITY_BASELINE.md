# Línea base de seguridad — MPHO Aliados

Fecha de evidencia: 2026-07-21

Rama revisada: `agent/partner-security-baseline`

Commit base: `5ca06c1` (`merge: sync partner with secured main`)

Alcance de escritura de esta auditoría: exclusivamente `reports/partner/security/**`

## 1. Veredicto ejecutivo

**NO APROBADO PARA PRODUCCIÓN.**

La base actual es adecuada como _shell_ web responsive protegido para continuar el desarrollo, pero no como aplicación Partner productiva. La evidencia implementada sí corrige las escalaciones directas más graves de identidad: un usuario autenticado no obtiene acceso Partner por el solo hecho de tener sesión; el navegador no puede asignarse roles, cambiar su estado de perfil, aprobar un Partner ni modificar capacidades; y las tablas maestras Partner usan un predicado RLS común con `profile`, rol, `partner_id`, revocación y estado del Partner.

Persisten bloqueadores de producción:

- no hay MFA, recuperación endurecida, expiración propia de invitaciones, _step-up_, límites de sesión comprobados ni protección de fuerza bruta evidenciada para Partner;
- las políticas heredadas de catálogo no adoptaron el predicado endurecido y pueden conservar lectura de listados no publicados para una asignación con perfil suspendido o `revoked_at` no nulo si `user_roles.status` sigue en `active`;
- no existe una operación Central, auditada y de privilegio mínimo para asignar/revocar roles o administrar estado/capacidades Partner; la única capacidad técnica actual es DML directo con `service_role`;
- el esquema no materializa las restricciones documentadas de `partner_id` obligatorio para roles Partner ni unicidad de asignación activa;
- no hay evidencia de cabeceras de seguridad, auditoría de denegaciones, monitoreo, secretos por ambiente, MFA del proveedor, recuperación ni pruebas sobre una configuración desplegada.

No se identificó una clave elevada en `apps/partner`, un secreto confirmado en archivos rastreados ni un camino Partner actual que mueva dinero, cambie estados de pedidos o ejecute operaciones de Central. Esa ausencia no acredita la configuración de producción.

## 2. Fuentes y método

Se leyeron las instrucciones completas de `AGENTS.md`, `README.md`, `docs/00_DOCUMENTATION_INDEX.md`, `docs/01_PROJECT_OVERVIEW.md` y el paquete de seguridad `docs/31_...` a `docs/38_...`. Para el límite Partner se revisaron los documentos de programa, roles, viaje, aplicación, base de datos, seguridad, onboarding y PWA; también `CODEX_PARTNER_AUDIT_REPORT.md`, `CODEX_IDENTITY_SECURITY_REPORT.md`, la aplicación `apps/partner`, sus pruebas, las migraciones vigentes de identidad/Partner/RLS y los tipos generados solo como contrato.

La evidencia se clasifica así:

| Estado | Significado en este reporte |
| --- | --- |
| **IMPLEMENTADO** | Existe código o SQL vigente y prueba específica suficiente para el alcance afirmado. |
| **PARCIALMENTE IMPLEMENTADO** | Existe una barrera útil, pero faltan controles, cobertura real o consistencia de extremo a extremo. |
| **ESPECIFICADO NO IMPLEMENTADO** | La documentación exige el control y no existe evidencia de implementación en el alcance revisado. |
| **DECISIÓN PENDIENTE** | El resultado depende de una decisión de producto o permisos que esta auditoría no puede inventar. |

Las pruebas unitarias con dobles acreditan el contrato del código, no un Supabase remoto ni la configuración de Vercel. El reporte de identidad registra que la migración y sus 83 aserciones pgTAP pasaron localmente antes de integrarse; esta auditoría no volvió a ejecutar Supabase y no hizo cambios remotos.

## 3. Límite real actual

```text
Navegador Partner
  → Supabase Auth con URL pública + anon key
  → proxy de Next.js verifica getUser()
  → consulta RLS: profiles → user_roles → partners
  → solo entonces permite las rutas Partner conocidas

Navegador Partner
  ✕ service_role
  ✕ asignación/revocación de roles
  ✕ aprobación/activación/suspensión de Partner
  ✕ capacidades/capacidad/excepciones operativas
  ✓ lectura acotada de su Partner
  ✓ partner_admin: actualización de columnas permitidas de horario regular
```

MPHO Aliados no tiene todavía pedidos, ofertas, paquetes, evidencia, ganancias, payouts ni mutaciones operativas conectadas. Por tanto, esta línea base evalúa identidad, acceso al _shell_ y tablas Partner existentes; no acredita autorización de flujos que aún no existen.

## 4. Matriz de controles

### 4.1 Sesión y autenticación

| Control | Estado | Evidencia | Evaluación |
| --- | --- | --- | --- |
| Sesión validada en servidor | **IMPLEMENTADO** | `apps/partner/lib/supabase/proxy.ts:15-39` usa `auth.getUser()` antes del lookup Partner. | Una sesión inválida no se trata como usuario. |
| Renovación de cookies SSR | **IMPLEMENTADO** para el contrato local | `apps/partner/lib/supabase/proxy.ts:19-31` copia las opciones de cookies entregadas por `@supabase/ssr`. | No se verificaron atributos ni comportamiento en un despliegue real. |
| Logout confirmado por proveedor | **IMPLEMENTADO** | `apps/partner/lib/auth-context.tsx:78-94`; pruebas en `apps/partner/tests/auth-context.test.tsx`. | Si Supabase devuelve error, la UI conserva la sesión y muestra error genérico. |
| Revocación de autorización Partner | **PARCIALMENTE IMPLEMENTADO** | Cada request protegido vuelve a leer `profiles`, `user_roles` y `partners`; RLS endurecida usa las mismas condiciones. | La sesión de Auth no se revoca; además hay políticas heredadas fuera del helper común. |
| MFA Partner/admin | **ESPECIFICADO NO IMPLEMENTADO** | Requerido por `docs/31`, `32`, `33`, `38`, `48`, `59` y `63`; no hay código o prueba Partner de AAL/MFA. | Bloqueador antes de activar cuentas Partner privilegiadas. |
| Recuperación segura, cambio de factor, invitación expirable | **ESPECIFICADO NO IMPLEMENTADO** | No hay rutas, servicios ni pruebas Partner de recuperación/invitación. | El `/signup` es informativo; eso evita autoalta engañosa, pero no implementa onboarding seguro. |
| Idle/absolute timeout, reautenticación y step-up | **ESPECIFICADO NO IMPLEMENTADO** | No hay política o prueba en la aplicación. | La configuración administrada por el proveedor tampoco fue verificada. |
| Rate limit, credential stuffing y alertas de login | **ESPECIFICADO NO IMPLEMENTADO / NO VERIFICADO** | No existe control en el repositorio Partner; no se revisó configuración remota. | No debe inferirse que Supabase o infraestructura lo cubren sin evidencia. |

### 4.2 Identidad, perfiles y roles

| Control | Estado | Evidencia | Evaluación |
| --- | --- | --- | --- |
| Alta de identidad por Auth, con rol Customer por defecto | **IMPLEMENTADO** | `supabase/migrations/20260718111400_identity_partner_privilege_hardening.sql:26-79`; prueba de signup en `supabase/tests/identity_partner_privilege_hardening.test.sql:705-789`. | Registrarse no crea un Partner. |
| Perfil propio sin escalación de columnas | **IMPLEMENTADO** | La migración revoca mutación general y concede solo `display_name`/`phone` (`:211-233`); pgTAP verifica columnas administrativas (`:232-243`, `:350-407`). | `default_role`, `status`, identidad y timestamps no son editables por el navegador. |
| `user_roles` no mutable desde navegador | **IMPLEMENTADO** | Revocaciones/grants en la migración `:251-263`; pruebas `:245-251` y `:414-458`. | Incluso una sesión `mpho_admin` del navegador no hace DML directo. |
| Perfil activo + rol Partner activo/no revocado + `partner_id` + Partner operativo | **IMPLEMENTADO** en proxy y tablas migradas al helper | Proxy `apps/partner/lib/supabase/proxy.ts:46-89`; helper SQL `supabase/migrations/20260718111400_identity_partner_privilege_hardening.sql:169-209`. | Una sesión autenticada por sí sola no autoriza MPHO Aliados. |
| Restricción `partner_id` para rol Partner | **ESPECIFICADO NO IMPLEMENTADO** | `supabase/migrations/20250101000003_identity_tables.sql:31-42` solo lo declara en comentario; no hay `CHECK`. | Una operación elevada puede crear una asignación incoherente; el proxy la niega, pero la integridad no está en el esquema. |
| Unicidad de rol activo | **ESPECIFICADO NO IMPLEMENTADO** | `docs/25_DATABASE_SCHEMA.md` la exige; la tabla no tiene índice/constraint correspondiente. | `.limit(1)` sin orden en `apps/partner/lib/supabase/proxy.ts:57-66` vuelve ambiguo el contexto ante múltiples asignaciones. |
| Estados completos del ciclo de rol | **ESPECIFICADO NO IMPLEMENTADO** | Enum real: `active`, `revoked`; documentos describen invitado/pausado/deshabilitado. | La aplicación depende de perfil y Partner para otras suspensiones; falta alinear el modelo definitivo. |

### 4.3 Aislamiento Partner y RLS

| Control | Estado | Evidencia | Evaluación |
| --- | --- | --- | --- |
| Aislamiento de `partners`, capacidades, horarios, excepciones, capacidad, dirección y zonas | **IMPLEMENTADO** | Helper común y políticas en la migración `:280-385`; pruebas Partner A/B y columnas en `supabase/tests/identity_partner_privilege_hardening.test.sql:487-667`. | Para esas tablas, Customer y otro Partner reciben cero filas y las escrituras están acotadas. |
| Partner anónimo no enumerable | **IMPLEMENTADO** | Revoca todo a `anon` y elimina política pública (`:265-283`); prueba `:253-255` y Customer cero filas `:460-463`. | Corrige la filtración de identidad interna del Punto MPHO. |
| Horario regular por `partner_admin` | **IMPLEMENTADO** | Solo columnas de horario (`:326-353`); pruebas de admin, operador y cross-Partner (`:546-653`). | No permite cambiar `partner_id`, id o timestamps. |
| Capacidad, capacidades, estado, territorio y acuerdo reservados | **IMPLEMENTADO** como denegación al navegador | Migración `:265-338`; pruebas `:589-626`. | La operación positiva de Central aún no existe. |
| Revocación consistente en todo dato Partner | **PARCIALMENTE IMPLEMENTADO** | `listings_select_partner_own` y `media_assets_select_partner_own` de `supabase/migrations/20250101000012_catalog_rls.sql:56-93,128-145` consultan `user_roles.status='active'` sin perfil activo, `revoked_at` ni estado Partner. | La migración de catálogo posterior limita columnas/grants, pero conserva lectura de listados no publicados bajo esa política. Ver riesgo `PSR-001`. |
| Pedidos, tareas, evidencia, ganancias y payouts aislados | **ESPECIFICADO NO IMPLEMENTADO** | Las tablas/contratos operativos Partner no existen en la aplicación actual. | No se puede acreditar aislamiento de recursos inexistentes. |

### 4.4 Callback y redirects

| Control | Estado | Evidencia | Evaluación |
| --- | --- | --- | --- |
| Intercambio PKCE en servidor | **IMPLEMENTADO** | `apps/partner/app/(auth)/callback/route.ts:5-20`; pruebas en `apps/partner/tests/callback.test.ts`. | Los errores públicos son fijos y no filtran detalle del proveedor. |
| Destino interno allowlisted | **IMPLEMENTADO** | `apps/partner/lib/routes.ts:24-38`; pruebas rechazan URL absoluta, protocol-relative, rutas públicas y normalización `..`. | Solo rutas protegidas conocidas pueden ser destino. |
| Origen confiable para redirects absolutos | **PARCIALMENTE IMPLEMENTADO / NO VERIFICADO** | El callback y proxy construyen destinos con `url.origin` o `request.url` (`callback/route.ts:14,20`; `apps/partner/proxy.ts:13-41`). | No hay allowlist de host/canonical origin ni prueba de `Host` alterado; la infraestructura podría normalizarlo, pero no hay evidencia. |
| Protección por defecto de nuevas rutas | **PARCIALMENTE IMPLEMENTADO** | `apps/partner/lib/routes.ts:1-21` enumera rutas protegidas. | Una ruta futura no listada no hereda automáticamente la barrera Partner. Las rutas actuales sí están clasificadas. |

### 4.5 Secretos, claves y `service_role`

| Control | Estado | Evidencia | Evaluación |
| --- | --- | --- | --- |
| Partner usa solo URL pública y anon key | **IMPLEMENTADO** | `apps/partner/lib/supabase/config.ts:10-18`; no hay referencia de `service_role` en `apps/partner`. | La anon key no es un control por sí sola; RLS sigue siendo obligatoria. |
| Escáner impide referencia elevada accidental en aplicaciones | **PARCIALMENTE IMPLEMENTADO** | `scripts/check-client-secrets.sh:1-23`. | Busca dos cadenas en `apps` y permite dos módulos server-only; no sustituye un escáner de secretos completo, inventario, rotación o revisión de bundles. |
| Operaciones elevadas de identidad están aisladas del navegador | **IMPLEMENTADO** | `user_roles` y tablas maestras Partner solo conceden mutación a `service_role`. | Es una barrera negativa, no una API administrativa segura. |
| Camino Central controlado, auditado y de mínimo privilegio | **ESPECIFICADO NO IMPLEMENTADO** | La prueba usa `SET ROLE service_role` y DML directo (`supabase/tests/identity_partner_privilege_hardening.test.sql:669-702`); no existe endpoint/RPC de identidad Partner. | Falta validar actor, rol, razón, transición, idempotencia y auditoría. |
| Inventario, separación y rotación por ambiente | **ESPECIFICADO NO IMPLEMENTADO / NO VERIFICADO** | `.env.example` contiene nombres y valores vacíos; no hay evidencia de inventario, owner, rotación o configuración remota. | No se confirmó exposición, pero tampoco cumplimiento productivo. |

### 4.6 Operaciones reservadas a Central

Las decisiones aprobadas para esta misión reservan a MPHO Central la asignación de roles, aprobación, activación, suspensión, reglas globales y decisiones administrativas sensibles. El estado real es:

| Operación | Navegador Aliados | Camino elevado actual | Estado |
| --- | --- | --- | --- |
| Crear/revocar `user_roles` | Denegado | DML `service_role` directo | **PARCIALMENTE IMPLEMENTADO** |
| Aprobar/activar/pausar/suspender/cerrar Partner | Denegado | DML `service_role` directo | **PARCIALMENTE IMPLEMENTADO** |
| Aprobar capacidades, excepciones y capacidad | Denegado | DML `service_role` directo | **PARCIALMENTE IMPLEMENTADO** |
| Editar horario regular propio | `partner_admin`, columnas allowlisted | RLS + grants | **IMPLEMENTADO** |
| Administrar catálogo/disponibilidad aprobada | Sin flujo Partner conectado | Sin operación Central/Partner aprobada | **ESPECIFICADO NO IMPLEMENTADO** |
| Personal autorizado del Punto MPHO | Sin flujo | Sin operación auditada | **DECISIÓN PENDIENTE** sobre solicitud/invitación/delegación; la asignación final permanece Central |

Ningún DML con `service_role` debe exponerse directamente desde una interfaz. La futura operación Central necesita una frontera server-only específica, actor derivado de sesión Central, MFA/step-up, DTO allowlist, validación de transición y `partner_id`, idempotencia cuando corresponda, motivo obligatorio y auditoría inmutable.

### 4.7 Browser, PWA y exposición

| Control | Estado | Evidencia | Evaluación |
| --- | --- | --- | --- |
| Shell responsive separado | **IMPLEMENTADO** | Aplicación `apps/partner` independiente y auditoría visual previa. | No equivale a PWA completa. |
| Manifest/service worker/offline/cache/push | **ESPECIFICADO NO IMPLEMENTADO** | No existen manifest, iconos instalables ni worker; el matcher solo reserva nombres futuros. | No hay riesgo actual de cache privado por worker, pero tampoco capacidad PWA aprobada. |
| Cabeceras CSP/HSTS/nosniff/referrer/permissions | **ESPECIFICADO NO IMPLEMENTADO / NO VERIFICADO** | `apps/partner/next.config.mjs:1-11` no configura headers; no se inspeccionó un despliegue. | Requeridas antes de producción. |
| `no-store` para vistas Partner | **ESPECIFICADO NO IMPLEMENTADO** | No hay API/datos privados conectados ni política explícita de cache en Partner. | Debe incorporarse antes de servir pedidos, recipient data o finanzas. |
| Estado oficial confirmado por servidor | **IMPLEMENTADO** solo para acceso/logout | El shell no contiene mutaciones operativas. | Los futuros estados de pedido/evidencia requieren servicios idempotentes y pruebas. |

## 5. Cobertura y límites de prueba

Evidencia disponible:

- 40 pruebas Partner registradas por la auditoría anterior; cubren rutas, redirects, callback PKCE, lookup `profiles → user_roles → partners`, fallo cerrado, navegación y logout.
- 83 aserciones pgTAP en `identity_partner_privilege_hardening.test.sql`; cubren grants, columnas, aislamiento A/B, usuario suspendido en tablas maestras, horario admin/operator y DML elevado.
- `CODEX_IDENTITY_SECURITY_REPORT.md` registra `supabase db reset`, 243 pruebas SQL totales, tipos y drift como `PASS` antes de la integración.

Cobertura insuficiente o ausente:

- no hay prueba E2E contra un proyecto Supabase alojado;
- no hay prueba de MFA, invitación, recuperación, sesión expirada, idle/absolute timeout o revocación de sesión;
- no hay prueba de perfil suspendido, `revoked_at` inconsistente o Partner suspendido sobre políticas de catálogo heredadas;
- no hay prueba de múltiples asignaciones Partner activas ni constraint que las evite;
- no hay prueba de host alterado en callback/proxy;
- no hay prueba de cabeceras, rate limit, alertas, auditoría, secretos/rotación, PWA/logout cache ni configuración productiva;
- no existen todavía pruebas de autorización para pedidos, ofertas, evidencia, earnings, payouts o personal Partner.

## 6. Contradicciones y decisiones pendientes

1. **Administración de personal Partner.** `docs/10_USER_ROLES.md`, `docs/15_PARTNER_APP.md` y `docs/63_PARTNER_PWA_UX_AND_SCREEN_SPEC.md` permiten al Partner admin invitar/asignar/revocar personal; la decisión aprobada de esta misión reserva la asignación de roles a Central. Hasta alinear la documentación, Aliados puede como máximo proponer o solicitar; no debe asignar privilegios por sí solo.
2. **Múltiples Puntos por identidad.** El esquema permite varias filas Partner activas y el proxy elige una con `.limit(1)` sin selector u orden. Se necesita decidir si una identidad puede operar varios Puntos y, si sí, diseñar un selector server-authorized que mantenga un único contexto activo.
3. **Partner `paused`.** El helper permite lectura y actualización del horario regular cuando el Partner está `paused`. Los documentos permiten conservar acceso histórico, pero falta precisar qué mutaciones de disponibilidad/personal siguen habilitadas y cuáles deben denegarse.
4. **Matriz operator/admin.** El piloto exige privilegio mínimo, pero no existe una matriz final por acción. Todo nuevo usuario operativo debe quedar en el nivel más restrictivo hasta aprobarla.
5. **Ciclo de estados.** Los enums técnicos (`profiles`: active/suspended/deleted; asignación: active/revoked; Partner: pending_onboarding/active/paused/suspended/closed) no representan todos los estados documentales de onboarding y roles. Cualquier ampliación necesita decisión y migración; no debe inferirse de texto libre.

## 7. Prioridad de remediación

1. Corregir todas las políticas Partner heredadas para usar un único predicado vigente y añadir pruebas de revocación/suspensión en cada tabla (`PSR-001`).
2. Implementar constraints de rol Partner y resolver múltiples asignaciones antes de crear el flujo Central (`PSR-002`, `PSR-003`).
3. Diseñar una operación Central server-only, auditada y de mínimo privilegio; no reutilizar un cliente `service_role` genérico (`PSR-004`).
4. Implementar y verificar MFA, invitación/recuperación, step-up, expiración de sesión y revocación (`PSR-005`).
5. Añadir host/canonical-origin allowlist, protección por defecto de rutas y pruebas negativas (`PSR-006`, `PSR-007`).
6. Añadir cabeceras, `no-store`, rate limits, auditoría/alertas e inventario/rotación de secretos antes de datos operativos reales (`PSR-008` a `PSR-011`).
7. Solo después, conectar el piloto de pedidos/estados/horarios con autorización por actor, Partner, recurso, estado y acción.

El detalle, severidad, aceptación y evidencia de cada riesgo está en `PERMISSIONS_RISK_REGISTER.md`.

## 8. Confirmaciones de alcance

- No se modificó código, SQL, migraciones, tipos ni documentación oficial.
- No se ejecutó `supabase db push`, migración remota ni escritura de datos.
- No se hizo push, deploy, PR ni cambio de producción.
- No se inventaron comisiones, payouts, SLA, estados operativos ni permisos no aprobados.
