# Contradicciones y decisiones pendientes — MPHO Aliados

Fecha: 2026-07-21

Base inspeccionada: `5ca06c19f70878cd89c3d1231c11d66d7932b9f5`

## 1. Convención

- **Contradicción**: dos fuentes hacen afirmaciones incompatibles sobre el mismo contrato.
- **Desactualización**: una afirmación fue correcta en su fecha, pero ya no describe el árbol actual.
- **Brecha**: la especificación existe y el código no; no es contradictoria si está rotulada como objetivo.
- **Decisión pendiente**: no se resuelve aquí porque requiere autoridad de producto, negocio, seguridad u operación.

Ningún punto de este reporte autoriza implementar la opción propuesta.

## 2. Contradicciones materiales

### CT-01 — “PWA” frente a web responsive

**Fuentes:** README, `docs/15_PARTNER_APP.md` §3, `docs/59_*`, `docs/66_*`, `docs/68_*` frente a `apps/partner/**` y la decisión aprobada de esta misión.

**Evidencia actual:** no hay `apps/partner/public`, manifest, iconos, service worker, instalación, push, cache/offline ni update flow. Sólo existen metadata/viewport y layout responsive. El matcher menciona rutas hipotéticas `manifest.json`, `sw.js` e `icons/`, pero no crea esos artefactos.

**Clasificación:** contradicción terminológica si se presenta la arquitectura objetivo como estado actual.

**Impacto:** expectativas falsas de instalación, operación offline y notificaciones; riesgo de incumplir Pack 12 y de cachear datos privados incorrectamente en una implementación apresurada.

**Resolución demostrable para el estado actual:** describir Aliados como **aplicación web responsive**. “PWA completa” queda `ESPECIFICADO NO IMPLEMENTADO` hasta pasar manifest, iconos, SW, logout/cache, update, offline y dispositivos objetivo.

**Decisión pendiente:** alcance exacto del primer release PWA y matriz de dispositivos.

### CT-02 — Límites de Central y administración Partner

**Fuentes:** decisión aprobada de la misión: Central administra asignación de roles, aprobación, activación, suspensión y reglas globales. `docs/10_USER_ROLES.md` §7 y `docs/15_PARTNER_APP.md` §36 dicen que Partner admin puede invitar/desactivar usuarios y asignar roles; `docs/63_*` también incluye team management. La misión permite que Aliados administre sólo personal autorizado de su propia operación.

**Evidencia actual:** `user_roles` no permite mutaciones desde `authenticated`; sólo un camino controlado de servidor con privilegio puede administrar roles. La app no tiene UI/API de equipo. `lib/routes.ts` clasifica `/equipo` pero no existe pantalla.

**Clasificación:** contradicción de responsabilidad; el contrato técnico actual favorece gobierno Central.

**Impacto:** una implementación literal de los docs antiguos podría reabrir escalación de privilegios o permitir autoasignación de rol Partner.

**Resolución propuesta para aprobación:** Aliados puede iniciar solicitudes y gestionar datos operativos permitidos de su personal; Central valida/ejecuta creación, rol, aprobación y revocación sensible. Todo usuario nuevo recibe el nivel más restrictivo.

**Decisión pendiente:** matriz exacta solicitud/aprobación/ejecución por acción y rol.

### CT-03 — Estados de Partner documentados frente al enum real

**Fuentes:** `docs/08_PARTNER_PROGRAM.md` §7 propone `draft`, `submitted`, `under_review`, `information_required`, `approved`, `active`, `paused_by_partner`, `paused_by_mpho`, `restricted`, `suspended`, `rejected`, `closed`. La migración `20250101000001_extensions_and_enums.sql` implementa sólo `pending_onboarding`, `active`, `paused`, `suspended`, `closed`.

**Evidencia actual:** `partners.status` usa el enum corto. El proxy permite `active|paused`; la función RLS `has_active_partner_membership` también.

**Clasificación:** contradicción de contrato de estado.

**Impacto:** onboarding, pausa, rechazo, restricción y autorización pueden mapearse de manera inconsistente; no se debe añadir un string ad hoc en UI o API.

**Decisión pendiente:** aprobar si los estados granulares requieren migración, otra entidad de onboarding/review, reason codes, o un mapping explícito al enum vigente.

### CT-04 — Navegación Partner en tres versiones

**Fuentes:**

- `docs/15_PARTNER_APP.md` §4: `Today / Orders / Catalog / Earnings / More` o alternativa;
- `docs/63_PARTNER_PWA_UX_AND_SCREEN_SPEC.md` §2: móvil `Inicio / Pedidos / Paquetes / Ganancias / Más`; desktop añade Ofertas, Preparación, Entregas, Incidentes, Equipo y Configuración;
- código actual: móvil sigue el conjunto de `docs/63`; desktop sólo Inicio, Pedidos, Paquetes, Ganancias, Configuración y Perfil.

**Clasificación:** contradicción documental y brecha de implementación.

**Impacto:** OpenCode no puede implementar navegación faltante sin elegir silenciosamente entre fuentes. Rutas y permisos podrían divergir.

**Decisión pendiente:** route map aprobado del piloto. La priorización pedidos, detalle, cambios de estado autorizados y horarios es una propuesta, no aprobación definitiva.

### CT-05 — Tokens visuales compartidos frente a CSS Partner local

**Fuentes:** `docs/65_SHARED_DESIGN_SYSTEM_AND_RESPONSIVE_RULES.md` propone, entre otros, `--bg-deep: #030712` y `--lime: #B8FF00`. `apps/partner/app/globals.css` usa `#030706` y `#c8ff35`, nombres diferentes y tokens locales. `@mpho/design-tokens` está declarado pero no importado.

**Clasificación:** contradicción entre diseño objetivo y shell implementado.

**Impacto:** deriva visual entre apps y riesgo de rediseño accidental.

**Decisión pendiente:** decidir si el shell conserva su paleta auditada o migra al sistema compartido aprobado; requiere revisión visual y de contraste, no un reemplazo mecánico.

## 3. Desactualizaciones verificadas

### ST-01 — `docs/69` mezcla estado pre y post Phase 8

El encabezado dice “through Phase 8”, pero la matriz conserva “Payments/refunds BLOCKED — No provider, payment/refund records” y la sección 11 recomienda Phase 8 como trabajo siguiente. `docs/76`, la migración `20260716180000_payment_integrity_foundation.sql` y los tipos generados prueban `payment_attempts`, `payment_provider_events`, endpoints y lifecycle hasta `paid`.

**Impacto:** el lector puede negar una fundación existente o reimplementar Phase 8. Producción sigue bloqueada; la corrección documental no debe convertir foundation en aprobación productiva.

### ST-02 — `docs/75` se contradice internamente sobre pagos

La nota inicial indica que la fundación through `paid` está implementada, pero la truth matrix conserva “No provider adapter, payment tables, endpoint or verified webhook”. `docs/76` es la evidencia posterior más específica.

**Impacto:** roadmap y dependencias incorrectas. La siguiente fase recomendada en `docs/76` es aceptación sandbox/reconciliación, no re-crear tablas de pagos.

### ST-03 — `docs/69` y `docs/75` preceden el hardening Partner actual

Sus fechas/bases son del 16 de julio. Los commits `a9f2b15` y `d6c64d4` son posteriores. Aliados sigue siendo no operacional, pero ahora sí tiene múltiples rutas, auth password, callback PKCE, proxy Partner, estados honestos y 40 pruebas.

**Impacto:** “shell” sigue siendo una clasificación válida de madurez, pero los detalles técnicos son incompletos.

### ST-04 — Reportes raíz dicen “sin commit” después de integración

`CODEX_PARTNER_AUDIT_REPORT.md` y `CODEX_IDENTITY_SECURITY_REPORT.md` registran correctamente el estado de sus worktrees al momento de auditoría. En el historial actual:

- correcciones Partner: `d6c64d4`;
- hardening de identidad/RLS: `3c6a53f`;
- integración: `5ca06c1`.

**Impacto:** las secciones “no commit” no deben reutilizarse como estado actual.

### ST-05 — Descripción puntual de home Partner

`docs/75` dice que home muestra “panel coming soon”. El código actual muestra “Resumen operativo no disponible” y explica que no consulta una fuente autorizada. La conclusión (no hay cola real) sigue vigente; el copy citado no.

## 4. Brechas entre objetivo e implementación

### BG-01 — Esquema conceptual frente a migraciones

`docs/25_DATABASE_SCHEMA.md` se autodefine conceptual y enumera en MVP `partner_offers`, `fulfillment_tasks`, `package_receipts`, `partner_earnings`, `partner_payout_accounts`, `payouts`, `deliveries`, `incidents` y otras tablas. Ninguna de esas tablas Partner existe en migraciones/tipos actuales.

**Impacto:** no se puede declarar DB Partner lista ni generar endpoints desde el documento. Cada tabla futura requiere alcance, reglas, RLS y pruebas en la misma fase.

**Decisión pendiente:** modelo mínimo para asignación/oferta y piloto Partner, sin importar automáticamente todo el esquema conceptual.

### BG-02 — No existe vínculo de pedido asignado a Partner

`orders` no tiene `responsible_partner_id`; no existe `partner_offers` ni una relación equivalente. Phase 8 termina en `paid` y excluye assignment.

**Impacto:** no hay consulta segura que permita a Aliados listar “sus pedidos”. Construir sólo la pantalla no resolvería ownership, idempotencia o RLS.

**Decisión pendiente:** contrato post-payment de una asignación responsable, oferta, deadline, aceptación/rechazo e historial.

### BG-03 — Horarios existen en DB pero no en app

La tabla/RLS vigente permite que `partner_admin` actualice columnas allowlisted de filas existentes de `partner_schedules`. No hay ruta, UI, API ni test de integración Partner. Insert y excepciones siguen reservados a camino controlado.

**Impacto:** la propuesta de piloto “gestión de horarios” no está implementada y necesita aclarar bootstrap, timezone, validación, conflictos y quién administra excepciones.

### BG-04 — Un estado `paused` conserva acceso al shell

El proxy y RLS autorizan Partner `paused`, mientras `docs/08` dice que un Partner pausado conserva acceso histórico y no recibe ofertas. Como no existen acciones operativas, hoy no hay bypass práctico. En el futuro el gate de ruta no será suficiente: cada comando debe bloquear nuevas ofertas/acciones incompatibles según estado.

**Decisión pendiente:** matriz de lectura/acción para `paused` y tipos de pausa.

### BG-05 — Rutas anticipadas sin UI

`/equipo`, `/equipo/*` y `/paquetes/*` están clasificadas como protegidas sin página. Esto no crea autorización ni funcionalidad.

**Impacto:** 404 en destinos anticipados y riesgo de confundir clasificación de ruta con feature.

**Resolución técnica futura:** eliminar contratos muertos o implementar sólo después de route map y permisos aprobados.

### BG-06 — Auth foundation sin controles productivos

Existen password, PKCE, cookies SSR, redirect seguro y logout. No existen MFA, recovery, invitaciones, step-up, rate limiting, session policy productiva ni prueba con Supabase real en esta auditoría.

**Impacto:** “Partner authentication works” del launch checklist no está probado para producción.

### BG-07 — Responsive no equivale a aceptación PWA/accesibilidad

El shell usa `lg`, safe area y targets táctiles. Faltan tablet workspaces, camera/scan, device matrix, keyboard/screen reader, zoom, offline, update y account-switch cache tests.

**Impacto:** build verde no satisface `docs/65`, `66` o `68`.

## 5. Riesgos de interpretación documental

### RI-01 — “Complete” en el índice

En `docs/00_DOCUMENTATION_INDEX.md`, “Complete” es estado del documento. No significa que Partner app, DB, seguridad, operación o PWA estén completados.

### RI-02 — Wireframes con dinero y métricas

`docs/63` y `docs/67` muestran ejemplos como capacidades, pedidos y earnings. `docs/68` permite datos ficticios para prototipo, mientras `AGENTS.md` y la misión prohíben mostrarlos como realidad operacional. El código actual hizo la elección segura: no renderiza esos ejemplos.

### RI-03 — Tipos generados y permisos

`types.generated.ts` expone shapes `Insert`/`Update` completos de Supabase. Eso no autoriza al browser: grants y RLS de la migración vigente siguen siendo la barrera.

### RI-04 — CI local/remoto y versión de pnpm

CI fija pnpm 9 y Node 22; el entorno local usado aquí fue pnpm 11.10.0 y Node 24.11.1. No hay `packageManager` en `package.json`.

**Impacto:** drift de tooling y posibles diferencias de install/test. Los comandos pasaron localmente después de materializar dependencias, pero no se verificó un run remoto.

**Decisión pendiente:** versión soportada y mecanismo de pinning para contribución local/CI.

## 6. Decisiones pendientes consolidadas

| ID | Decisión | Dueño necesario | Bloquea |
| --- | --- | --- | --- |
| DP-01 | route map y navegación del piloto | producto/UX | implementación de pantallas |
| DP-02 | matriz de permisos operator/admin y mínimo por defecto | producto + seguridad | comandos Partner |
| DP-03 | frontera Central vs Partner para staff, roles, capabilities y pausas | producto + seguridad + operaciones | equipo/onboarding |
| DP-04 | lifecycle/mapping de `partner_status` | producto + DB + operaciones | onboarding/suspensión |
| DP-05 | contrato de asignación/oferta post-`paid` | producto + backend + DB + seguridad | pedidos reales |
| DP-06 | bootstrap y mutación de horarios/excepciones | operaciones + DB | gestión de horarios |
| DP-07 | stock/reserva y confirmación de variante | producto + operaciones + DB | availability/preparation |
| DP-08 | evidencia, Storage, custodia y retención | seguridad + privacidad + operaciones | paquetes/preparación |
| DP-09 | earnings, payout, SLA, cancelación, disputa y responsabilidades | negocio + finanzas + legal | ganancias/pagos |
| DP-10 | tokens visuales finales | diseño + accesibilidad | consolidación visual |
| DP-11 | alcance PWA y dispositivos objetivo | producto + frontend + seguridad + QA | instalación/push/offline |
| DP-12 | versiones Node/pnpm soportadas | plataforma/CI | reproducibilidad |

## 7. Recomendación de resolución

Resolver primero, sin implementar operaciones todavía:

1. aprobar el route map del piloto;
2. aprobar la matriz de permisos y la frontera Central/Aliados;
3. aprobar el estado/mapping Partner;
4. diseñar el contrato mínimo post-`paid` con una sola asignación responsable, RLS, historial e idempotencia;
5. decidir si horarios entra antes o junto con ese contrato;
6. mantener el resto como `ESPECIFICADO NO IMPLEMENTADO` o `DECISIÓN PENDIENTE`.

Esta secuencia no decide comisiones, SLA, payout, cancelaciones ni responsabilidades económicas.
