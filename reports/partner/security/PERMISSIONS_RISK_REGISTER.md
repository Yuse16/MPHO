# Registro de riesgos de permisos — MPHO Aliados

Fecha de evidencia: 2026-07-21

Base: `5ca06c1`

Estado general: **abierto; producción bloqueada**

## 1. Escala y reglas

Se usa la escala definida en `docs/31_THREAT_MODEL_AND_ABUSE_CASES.md`:

```text
probabilidad: 1–5
impacto: 1–5
riesgo = probabilidad × impacto

1–4 bajo
5–9 medio
10–15 alto
16–25 crítico
```

La puntuación describe el riesgo de exponer MPHO Aliados con datos/usuarios reales en su estado actual. No afirma explotación. Un control requerido que no cuenta con evidencia se mantiene abierto aunque el código no muestre un exploit inmediato.

Ningún riesgo de este documento tiene aceptación aprobada. `Owner requerido` identifica la función que debe asumirlo; no asigna una persona ni inventa una aprobación. Toda excepción futura debe registrar amenaza, control compensatorio, owner nominal, aprobador, fecha y expiración.

Estados de evidencia:

- **IMPLEMENTADO**: control presente y probado para el alcance indicado.
- **PARCIALMENTE IMPLEMENTADO**: existe una mitigación incompleta.
- **ESPECIFICADO NO IMPLEMENTADO**: requisito sin evidencia de ejecución.
- **DECISIÓN PENDIENTE**: necesita definición aprobada antes del cierre.

## 2. Resumen priorizado

| ID | Riesgo | P | I | Puntaje | Severidad | Estado del control | Gate |
| --- | --- | ---: | ---: | ---: | --- | --- | --- |
| PSR-001 | Revocación incompleta en RLS heredada de catálogo | 4 | 4 | 16 | **Crítico** | Parcial | Producción |
| PSR-002 | Invariantes de `user_roles` no forzadas por esquema | 3 | 5 | 15 | **Alto** | Especificado no implementado | Antes de administración Central |
| PSR-003 | Contexto Partner ambiguo ante múltiples asignaciones | 3 | 4 | 12 | **Alto** | Decisión pendiente | Antes de datos operativos |
| PSR-004 | Administración elevada solo mediante DML `service_role` | 4 | 5 | 20 | **Crítico** | Parcial | Producción |
| PSR-005 | MFA, recuperación, step-up y límites de sesión ausentes | 4 | 5 | 20 | **Crítico** | Especificado no implementado | Producción |
| PSR-006 | Origen de callback/redirect no allowlisted | 2 | 4 | 8 | **Medio** | Parcial/no verificado | Antes de deploy público |
| PSR-007 | Protección de rutas no es deny-by-default | 3 | 3 | 9 | **Medio** | Parcial | Antes de nuevas rutas |
| PSR-008 | Cabeceras y cache privado no comprobados | 3 | 4 | 12 | **Alto** | Especificado no implementado | Producción |
| PSR-009 | Sin rate limit/alertas de abuso de identidad evidenciados | 4 | 4 | 16 | **Crítico** | Especificado no implementado/no verificado | Producción |
| PSR-010 | Detección de secretos limitada y sin inventario/rotación | 3 | 4 | 12 | **Alto** | Parcial | Producción |
| PSR-011 | Denegaciones y cambios sensibles sin auditoría de aplicación | 3 | 4 | 12 | **Alto** | Especificado no implementado | Producción |
| PSR-012 | Contratos de autorización operativa Partner aún inexistentes | 4 | 5 | 20 | **Crítico** | Especificado no implementado | Antes del piloto |
| PSR-013 | Permisos de Partner `paused` no cerrados por acción | 3 | 3 | 9 | **Medio** | Decisión pendiente | Antes de mutaciones operativas |
| PSR-014 | Contradicción sobre quién administra personal Partner | 3 | 5 | 15 | **Alto** | Decisión pendiente | Antes de staff management |

## 3. Registro detallado

### PSR-001 — Revocación incompleta en RLS heredada de catálogo

- **Threats:** TM-001, TM-005, TM-030.
- **Estado:** abierto; **PARCIALMENTE IMPLEMENTADO**.
- **Evidencia:** `supabase/migrations/20250101000012_catalog_rls.sql:56-93,128-145` deriva el Partner usando solo rol Partner y `user_roles.status = 'active'`. No exige `profiles.status='active'`, `revoked_at IS NULL` ni Partner `active/paused`. `supabase/migrations/20260714090000_catalog_security_hardening.sql:5-55` limita grants/columnas pero no sustituye esas políticas Partner. `supabase/migrations/20260718111400_identity_partner_privilege_hardening.sql:169-209` crea el helper correcto, pero solo migra las políticas maestras listadas en `:280-385`.
- **Escenario:** un perfil suspendido, o una fila con `status='active'` y `revoked_at` ya establecido, puede seguir satisfaciendo la política Partner de listados. La lectura se limita a las columnas concedidas, pero puede incluir listados no publicados de su Partner.
- **Impacto:** acceso posterior a revocación; incumplimiento de revocación inmediata y de la regla “Partner suspendido sin acceso”.
- **Control existente:** el proxy impide entrar al shell y las tablas maestras usan el helper endurecido; no cubre llamadas PostgREST directas a una política residual.
- **Remediación requerida:** inventariar toda política Partner vigente, reemplazar subconsultas ad hoc por un predicado único, revisar grants y añadir pruebas de perfil suspendido, `revoked_at` inconsistente, rol revocado, Partner suspendido y cross-Partner para catálogo y futuras tablas.
- **Owner requerido:** seguridad de base de datos/RLS.
- **Aceptación:** ninguna; no aceptable para producción.

### PSR-002 — Invariantes de `user_roles` no forzadas por esquema

- **Threats:** TM-002, TM-003, TM-035.
- **Estado:** abierto; **ESPECIFICADO NO IMPLEMENTADO**.
- **Evidencia:** `supabase/migrations/20250101000003_identity_tables.sql:31-42` deja `partner_id` nullable y solo comenta que los roles Partner lo requieren. No existe `CHECK` rol/Partner ni unicidad activa. `docs/25_DATABASE_SCHEMA.md` exige ambas invariantes.
- **Escenario:** una operación elevada defectuosa crea un `partner_admin` sin Partner o asignaciones activas duplicadas/incompatibles.
- **Impacto:** identidad privilegiada incoherente, selección de contexto no determinista y potencial autorización distinta entre aplicación y RLS.
- **Control existente:** el proxy rechaza el rol Partner sin `partner_id`; el navegador no puede crear ni modificar roles.
- **Remediación requerida:** validar datos existentes, diseñar constraint/index compatible con el modelo aprobado, aplicar migración forward-only y probar fixtures corruptos, concurrencia y revocación.
- **Owner requerido:** identidad + base de datos.
- **Aceptación:** ninguna.

### PSR-003 — Contexto Partner ambiguo ante múltiples asignaciones

- **Threats:** TM-001, TM-002.
- **Estado:** abierto; **DECISIÓN PENDIENTE**.
- **Evidencia:** `apps/partner/lib/supabase/proxy.ts:57-66` usa `.limit(1).maybeSingle()` sin orden ni selector. `has_active_partner_membership` autoriza cualquier Partner asignado que cumpla condiciones.
- **Escenario:** una identidad tiene dos Puntos activos; el proxy elige uno de manera implícita mientras RLS puede permitir ambos.
- **Impacto:** UI, logs y acciones futuras pueden atribuirse al Partner equivocado; riesgo de datos de un Punto en contexto de otro.
- **Control existente:** cada policy compara el `partner_id` de la fila, por lo que no abre Puntos no asignados.
- **Decisión requerida:** prohibir múltiples asignaciones activas o implementar selección explícita, server-authorized, auditable y vinculada a cada request. No usar `default_role` ni un valor del cliente como autoridad.
- **Owner requerido:** producto Partner + identidad + seguridad.
- **Aceptación:** ninguna.

### PSR-004 — Administración elevada solo mediante DML `service_role`

- **Threats:** TM-002, TM-003, TM-007, TM-008, TM-035.
- **Estado:** abierto; **PARCIALMENTE IMPLEMENTADO**.
- **Evidencia:** la migración concede `service_role` sobre `profiles`, `user_roles`, `partners`, capacidades, excepciones, capacidad y horarios (`supabase/migrations/20260718111400_identity_partner_privilege_hardening.sql:219-224,256-273,288-338`). La prueba administrativa usa DML directo (`supabase/tests/identity_partner_privilege_hardening.test.sql:669-702`). No existe endpoint/RPC de identidad Partner en Central.
- **Escenario:** una futura ruta reutiliza un cliente elevado genérico y acepta actor, `partner_id`, rol, estado o campos desde el request sin transición, razón o auditoría.
- **Impacto:** escalación masiva, activación/suspensión indebida, pérdida de separación Central/Aliados y atribución insuficiente.
- **Control existente:** el secreto no existe en Partner y el navegador carece de DML; el escáner solo permite módulos server-only expresos.
- **Remediación requerida:** frontera Central específica por caso de uso, sesión Central + MFA/step-up, DTO allowlist, estado esperado, `partner_id` validado, motivo, idempotencia, auditoría inmutable, respuesta mínima y pruebas de BFLA/mass assignment. Evitar exponer CRUD genérico.
- **Owner requerido:** backend Central + seguridad + identidad.
- **Aceptación:** ninguna; no aceptable para producción.

### PSR-005 — MFA, recuperación, step-up y límites de sesión ausentes

- **Threats:** TM-004, TM-005, TM-006, TM-007, TM-030.
- **Estado:** abierto; **ESPECIFICADO NO IMPLEMENTADO**.
- **Evidencia:** Partner implementa password login, `getUser`, callback y logout, pero no consulta AAL, enrola MFA, verifica invitación, gestiona recuperación, recent auth, idle timeout o absolute timeout. No hay pruebas de esas funciones ni evidencia del proveedor desplegado.
- **Escenario:** credencial Partner admin comprometida se usa durante una sesión larga o recuperación débil; acciones sensibles futuras no requieren factor reciente.
- **Impacto:** toma de cuenta, datos de Partner/recipient y futuras cuentas de payout o personal.
- **Control existente:** usuario nominal, contraseña manejada por Supabase, verificación server-side en cada ruta y consulta de estado vigente.
- **Remediación requerida:** flujo de invitación, MFA mínimo para Partner admin y según riesgo para operadores, política AAL, recuperación endurecida, revocación, sesiones por dispositivo, timeouts, step-up y pruebas end-to-end.
- **Owner requerido:** identidad + seguridad de aplicación.
- **Aceptación:** ninguna; zero-tolerance para cuentas privilegiadas.

### PSR-006 — Origen de callback/redirect no allowlisted

- **Threats:** TM-016.
- **Estado:** abierto; **PARCIALMENTE IMPLEMENTADO / NO VERIFICADO**.
- **Evidencia:** el path de redirect sí usa allowlist (`apps/partner/lib/routes.ts:24-38`), pero `apps/partner/app/(auth)/callback/route.ts:14,20` compone con `url.origin` y `apps/partner/proxy.ts:13-41` con `request.url`. No existe validación de origin/host canónico ni fixture de host alterado.
- **Escenario:** si la plataforma acepta un Host no confiable, una respuesta de login/callback podría emitir un `Location` con host controlado aunque conserve path interno.
- **Impacto:** phishing, token-flow confusion o redirección posterior a autenticación. La explotabilidad depende de infraestructura no inspeccionada.
- **Control existente:** paths externos/protocol-relative se rechazan; PKCE se intercambia en servidor.
- **Remediación requerida:** origin explícito por ambiente o allowlist exacta, validación de forwarded host y pruebas para host malicioso, preview y producción.
- **Owner requerido:** frontend/backend Partner + plataforma.
- **Aceptación:** ninguna.

### PSR-007 — Protección de rutas no es deny-by-default

- **Threats:** TM-001, TM-002.
- **Estado:** abierto; **PARCIALMENTE IMPLEMENTADO**.
- **Evidencia:** `apps/partner/lib/routes.ts:1-21` enumera rutas protegidas; el proxy solo aplica autorización si `isProtectedRoute()` devuelve `true`.
- **Escenario:** una nueva ruta con datos Partner se añade y el desarrollador omite actualizar el set/prefix.
- **Impacto:** acceso autenticado o público accidental, dependiendo de la ruta y de su propia protección.
- **Control existente:** todas las rutas privadas existentes están listadas y actualmente son shell sin datos.
- **Remediación requerida:** declarar solo rutas públicas y proteger por defecto el resto, o establecer una frontera de layout/API server-authorized que no dependa de recordar una lista; añadir prueba de ruta desconocida/privada futura.
- **Owner requerido:** aplicación Partner.
- **Aceptación:** ninguna.

### PSR-008 — Cabeceras y cache privado no comprobados

- **Threats:** TM-005, TM-017, TM-028.
- **Estado:** abierto; **ESPECIFICADO NO IMPLEMENTADO / NO VERIFICADO**.
- **Evidencia:** `apps/partner/next.config.mjs:1-11` no define CSP, HSTS, nosniff, Referrer-Policy ni Permissions-Policy. Tampoco hay `no-store` Partner o prueba de despliegue. No existe service worker hoy.
- **Escenario:** una futura vista con recipient/order/earnings queda cacheada o expuesta a una clase de ataque que una política de navegador debía reducir.
- **Impacto:** fuga en dispositivo compartido, clickjacking/XSS con mayor impacto, persistencia de datos sensibles.
- **Control existente:** no hay datos operativos conectados ni cache PWA actual.
- **Remediación requerida:** cabeceras en aplicación/edge, CSP probada, `no-store` para auth y datos privados, logout que limpie estado privado y pruebas sobre deployment real.
- **Owner requerido:** plataforma web + seguridad.
- **Aceptación:** ninguna.

### PSR-009 — Sin rate limit/alertas de abuso de identidad evidenciados

- **Threats:** TM-004, TM-020, TM-030.
- **Estado:** abierto; **ESPECIFICADO NO IMPLEMENTADO / NO VERIFICADO**.
- **Evidencia:** no existe rate limit en Partner ni prueba/configuración versionada de límites Supabase; no hay alertas por fallos, recuperación, dispositivo o MFA.
- **Escenario:** credential stuffing, password spraying o agotamiento del proveedor sobre login/callback.
- **Impacto:** toma de cuentas y degradación del acceso operativo.
- **Control existente:** respuestas genéricas de login para credenciales inválidas y proveedor administrado de Auth.
- **Remediación requerida:** límites por cuenta/IP/dispositivo/ruta, protección del proveedor, monitoreo, owner de alertas y pruebas sin enumeración.
- **Owner requerido:** identidad/plataforma + seguridad operativa.
- **Aceptación:** ninguna.

### PSR-010 — Detección de secretos limitada y sin inventario/rotación

- **Threats:** TM-008, TM-026, TM-028.
- **Estado:** abierto; **PARCIALMENTE IMPLEMENTADO**.
- **Evidencia:** `scripts/check-client-secrets.sh:4-23` detecta referencias `SUPABASE_SERVICE_ROLE_KEY|service_role` dentro de `apps` y exige `server-only` en dos excepciones. La búsqueda de archivos rastreados no encontró un valor secreto confirmado. No hay inventario S1–S4, owners, rotación, provider confirmation o bundle scan evidenciado.
- **Escenario:** secreto con nombre distinto, valor materializado, archivo fuera de `apps`, log, artefacto o configuración preview no es detectado por el script.
- **Impacto:** bypass de RLS, datos o dinero según la clave.
- **Control existente:** `.env` real ignorado, ejemplo sin valores y módulos elevados server-only acotados.
- **Remediación requerida:** escáner de patrones/entropía e historial, push protection, inspección de bundle, inventario y rotación por ambiente, alertas y ejercicio de revocación.
- **Owner requerido:** plataforma/DevSecOps.
- **Aceptación:** ninguna.

### PSR-011 — Denegaciones y cambios sensibles sin auditoría de aplicación

- **Threats:** TM-001, TM-007, TM-028, TM-035.
- **Estado:** abierto; **ESPECIFICADO NO IMPLEMENTADO**.
- **Evidencia:** proxy y RLS deniegan, pero no escriben un evento de seguridad; no hay servicio de auditoría Partner para login, acceso denegado, rol, Partner status, horario o uso elevado.
- **Escenario:** intento repetido, revocación incorrecta o abuso interno ocurre sin evidencia correlacionable de actor, motivo, request y resultado.
- **Impacto:** detección y respuesta tardías; administración privilegiada no atribuible.
- **Control existente:** historial Git/migraciones y errores públicos genéricos, no auditoría operativa.
- **Remediación requerida:** eventos estructurados minimizando PII/tokens, request ID, actor/rol/recurso/acción/resultado/razón, protección contra edición, alertas y retención aprobada.
- **Owner requerido:** observabilidad + seguridad + backend Central.
- **Aceptación:** ninguna.

### PSR-012 — Contratos de autorización operativa Partner aún inexistentes

- **Threats:** TM-001, TM-002, TM-003, TM-010, TM-031, TM-032.
- **Estado:** abierto; **ESPECIFICADO NO IMPLEMENTADO**.
- **Evidencia:** `apps/partner` solo contiene estados informativos. No hay servicio/endpoints/tablas conectadas para ofertas, pedidos asignados, estados, paquetes, evidencia, ganancias, payouts o personal.
- **Escenario:** se conecta UI directamente a tablas o se crea una mutación sin actor/Partner/recurso/estado/acción, idempotencia y auditoría.
- **Impacto:** acceso cross-Partner, saltos de estado, evidencia falsa, efectos duplicados o exposición financiera.
- **Control existente:** la UI no simula operación exitosa ni persiste cambios falsos.
- **Remediación requerida:** diseñar primero contratos server-side y RLS por recurso, transición e idempotencia; probar cross-Partner, doble acción, sesión expirada, Partner suspendido, estado obsoleto y error backend antes del piloto.
- **Owner requerido:** backend Partner + seguridad + dominio de órdenes.
- **Aceptación:** ninguna; bloqueador antes del piloto.

### PSR-013 — Permisos de Partner `paused` no cerrados por acción

- **Threats:** TM-002, TM-030.
- **Estado:** abierto; **DECISIÓN PENDIENTE**.
- **Evidencia:** `has_active_partner_membership` acepta `active` y `paused` para lectura y para el modo admin (`supabase/migrations/20260718111400_identity_partner_privilege_hardening.sql:195-202`). El proxy también permite ambos (`apps/partner/lib/supabase/proxy.ts:73-97`).
- **Escenario:** una futura mutación reutiliza el helper genérico y permite a un Partner pausado aceptar trabajo o cambiar un control que debería estar bloqueado.
- **Impacto:** operación fuera de capacidad/autorización.
- **Control existente:** hoy solo la edición de horario regular es positiva; no existen acciones de pedido.
- **Decisión requerida:** matriz por estado y acción: acceso histórico, completar pedidos activos, horarios, personal, catálogo, nuevas ofertas y acciones financieras. Un helper booleano genérico no debe sustituir la matriz.
- **Owner requerido:** producto/operaciones Partner + seguridad.
- **Aceptación:** ninguna.

### PSR-014 — Contradicción sobre quién administra personal Partner

- **Threats:** TM-002, TM-003, TM-030, TM-035.
- **Estado:** abierto; **DECISIÓN PENDIENTE**.
- **Evidencia:** la decisión aprobada de la misión reserva asignación de roles a MPHO Central. `docs/10_USER_ROLES.md`, `docs/15_PARTNER_APP.md` y `docs/63_PARTNER_PWA_UX_AND_SCREEN_SPEC.md` atribuyen invitación/asignación/revocación al Partner admin. El SQL vigente impide DML de roles a todo navegador.
- **Escenario:** dos equipos implementan flujos incompatibles y uno concede autoasignación privilegiada al Partner.
- **Impacto:** escalación de privilegios, cuentas no verificadas, falta de separación de funciones.
- **Control existente:** deny-by-default actual; solo `service_role` puede mutar.
- **Decisión requerida:** documentar si Aliados solicita/invita y Central aprueba, quién puede desactivar de emergencia, el rol inicial más restrictivo, MFA, expiración y auditoría. Hasta aprobarla, Aliados no asigna roles.
- **Owner requerido:** propietario de producto + identidad + seguridad.
- **Aceptación:** ninguna.

## 4. Controles positivos que no deben degradarse

| Control | Evidencia actual | Regla de regresión |
| --- | --- | --- |
| Sesión no equivale a Partner | Proxy valida perfil, rol, `partner_id`, revocación y Partner. | Ninguna ruta/dato Partner puede depender solo de `auth.getUser()`. |
| Perfil no autoeleva privilegios | Column grants permiten solo `display_name`/`phone`. | No devolver `UPDATE` de tabla a `authenticated`. |
| Roles no se mutan desde browser | `user_roles` es lectura propia; DML solo elevado. | No exponer CRUD directo ni aceptar rol/Partner del cliente. |
| Partner no se autoaprueba | Browser no muta `partners`, capacidades ni capacidad. | Aprobación/activación/suspensión permanece Central y auditada. |
| Partner A no ve Partner B en tablas endurecidas | Helper canónico + pgTAP A/B. | Toda nueva tabla Partner debe reutilizar una política vigente y tener fixture cross-tenant. |
| Horario admin usa columnas allowlisted | Grants y RLS separan admin/operator. | No conceder `partner_id`, id ni timestamps; validar reglas horarias en servidor. |
| Partner no usa `service_role` | Config pública literal y escáner. | Todo secreto elevado debe ser server-only, específico y fuera del bundle. |
| Callback evita open redirect por path | Allowlist de rutas y PKCE server-side. | Mantener fixtures de URL absoluta, `//`, normalización y rutas públicas. |

## 5. Criterio de cierre

Un riesgo solo puede cerrarse cuando:

1. existe implementación vigente;
2. existe prueba negativa y positiva que cubre el alcance del riesgo;
3. la prueba se ejecutó en un entorno representativo;
4. la documentación/decisión de producto está alineada;
5. el owner y, si aplica, monitoreo/recuperación están operativos;
6. no queda una política, grant, endpoint o camino alternativo que contradiga el control.

`git diff --check` o una suite verde por sí solos no acreditan cierre de permisos.
