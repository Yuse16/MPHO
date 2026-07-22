# MPHO Aliados — Business Rules

## Convenciones de este documento

Este documento define reglas operativas trazables para MPHO Aliados y sirve como base para futuras pruebas. No convierte especificaciones de arquitectura, wireframes, runbooks o ejemplos en capacidades implementadas ni en decisiones comerciales aprobadas.

Estados permitidos para las reglas:

- **CONFIRMADA:** decisión normativa aprobada. No implica implementación.
- **PROPUESTA:** alcance o comportamiento propuesto pendiente de aprobación definitiva.
- **PARCIALMENTE IMPLEMENTADA:** una parte comprobable existe, pero faltan capas necesarias.
- **NO IMPLEMENTADA:** regla aprobada sin implementación operativa suficiente.
- **DECISIÓN PENDIENTE:** requiere una decisión de producto, negocio, seguridad, operación, legal o finanzas.
- **CONTRADICCIÓN DETECTADA:** dos fuentes vigentes o reutilizables atribuyen contratos incompatibles.

Jerarquía aplicada:

1. `AGENTS.md` y las decisiones aprobadas para Pack 02.
2. `docs/partner/01_PROJECT_OVERVIEW.md`.
3. Documentos normativos especializados.
4. Código, migraciones y pruebas para acreditar qué existe realmente.
5. Documentos conceptuales, runbooks y UX como arquitectura objetivo cuando no existe implementación.

Una regla **CONFIRMADA** puede estar técnicamente no implementada. Por ello cada ficha separa su estado normativo de la evidencia técnica actual.

## 1. Gobierno y autoridad

### BR-PARTNER-001 — Central gobierna el ecosistema

- **ID:** BR-PARTNER-001.
- **Nombre:** Central gobierna el ecosistema.
- **Estado:** CONFIRMADA.
- **Descripción:** MPHO Central gobierna MPHO Customer o Tienda, MPHO Aliados, aprobación de Partners, roles, activaciones, suspensiones, reglas globales, configuraciones administrativas y decisiones sensibles.
- **Origen o fuente:** decisiones aprobadas de Pack 02, puntos 1 a 3; `docs/partner/01_PROJECT_OVERVIEW.md`, §§5.2 y 6.3; `AGENTS.md`, §§12 y 25.
- **Actores:** personal Central expresamente autorizado; usuarios Partner como sujetos de la regla.
- **Precondiciones:** sesión Central válida, permiso suficiente y controles de aprobación aplicables.
- **Acción permitida o prohibida:** Central puede ejecutar las decisiones globales aprobadas; Aliados tiene prohibido asumir esas facultades.
- **Resultado esperado:** una operación global o sensible sólo cambia mediante un camino Central autorizado.
- **Consecuencias:** se conserva separación de funciones y se evita autoaprobación o escalamiento de privilegios.
- **Errores o bloqueos:** falta de identidad, permiso, aprobación, motivo o evidencia debe bloquear la acción.
- **Criterio de aceptación:** pruebas negativas demuestran que `partner_operator` y `partner_admin` no pueden aprobar Partners, asignar roles, activar, suspender ni modificar reglas globales.
- **Evidencia técnica actual:** el navegador autenticado no tiene DML sobre `user_roles` o `partners`; `supabase/migrations/20260718111400_identity_partner_privilege_hardening.sql` conserva esas mutaciones para un camino elevado.
- **Pruebas existentes:** `supabase/tests/identity_partner_privilege_hardening.test.sql` verifica que usuarios autenticados no insertan o actualizan asignaciones de rol ni datos maestros Partner.
- **Pruebas pendientes:** servicio Central end-to-end con MFA o step-up, allowlist de campos, idempotencia, auditoría y pruebas BFLA.
- **Decisión pendiente relacionada:** diseño del servicio Central acotado; no existe todavía una operación administrativa de negocio completa.

### BR-PARTNER-002 — Aliados administra sólo la operación propia

- **ID:** BR-PARTNER-002.
- **Nombre:** Aliados administra sólo la operación propia.
- **Estado:** PARCIALMENTE IMPLEMENTADA.
- **Descripción:** MPHO Aliados permite a un Partner autorizado operar únicamente recursos y tareas correspondientes a su propio `partner_id`.
- **Origen o fuente:** decisiones aprobadas de Pack 02, puntos 2, 3 y 7; `docs/partner/01_PROJECT_OVERVIEW.md`, §§3, 5.2 y 8.2; `AGENTS.md`, §§6.2 y 12.
- **Actores:** `partner_operator`, `partner_admin` y servicios autorizados.
- **Precondiciones:** contrato de acceso Partner válido y recurso dentro del scope autorizado.
- **Acción permitida o prohibida:** puede operar recursos propios expresamente concedidos; no puede listar, leer, modificar o inferir recursos de otro Partner.
- **Resultado esperado:** toda respuesta y mutación queda limitada al Partner autorizado.
- **Consecuencias:** se preserva aislamiento multitenant.
- **Errores o bloqueos:** recurso ajeno, `partner_id` inválido o membresía no verificable debe fallar cerrado sin filtrar existencia.
- **Criterio de aceptación:** fixtures Partner A/B prueban aislamiento para cada SELECT y comando del dominio.
- **Evidencia técnica actual:** `has_active_partner_membership` y las políticas endurecidas aíslan tablas maestras Partner, capacidades, horarios, excepciones y capacidad.
- **Pruebas existentes:** pgTAP versionado cubre Partner A/B en esas tablas; Vitest cubre el gate Partner.
- **Pruebas pendientes:** aislamiento de pedidos, tareas, paquetes, evidencia, catálogo endurecido, incidentes, earnings, payouts y personal.
- **Decisión pendiente relacionada:** modelo de recursos operativos posteriores a `paid` y cierre de `PSR-001` para políticas heredadas de catálogo.

### BR-PARTNER-003 — Cambios sensibles reservados a Central

- **ID:** BR-PARTNER-003.
- **Nombre:** Cambios sensibles reservados a Central.
- **Estado:** CONFIRMADA.
- **Descripción:** aprobación del Partner, estado administrativo, territorio, capacidades aprobadas, roles, reglas económicas, refunds, payouts y configuraciones sensibles permanecen bajo Central.
- **Origen o fuente:** decisiones aprobadas de Pack 02, puntos 1 a 3; `docs/partner/01_PROJECT_OVERVIEW.md`, §5.2; `AGENTS.md`, §§11, 12 y 25.
- **Actores:** Central autorizado; todos los roles Partner.
- **Precondiciones:** caso de uso Central aprobado con separación de funciones.
- **Acción permitida o prohibida:** Partner puede consultar o solicitar sólo lo permitido; tiene prohibido confirmar o alterar esas decisiones por sí mismo.
- **Resultado esperado:** ningún campo o estado sensible cambia desde Aliados.
- **Consecuencias:** evita escalamiento, fraude financiero y autoaprobación.
- **Errores o bloqueos:** campos reservados en una petición Partner se rechazan o se ignoran de forma segura, nunca se aplican parcialmente.
- **Criterio de aceptación:** DTO y grants usan allowlist; pruebas intentan cambiar estado Partner, territorio, agreement, capabilities y capacidad autoritativa.
- **Evidencia técnica actual:** column grants y RLS niegan desde `authenticated` las mutaciones sensibles cubiertas de identidad y datos maestros Partner; refunds, payouts y reglas económicas no tienen todavía un flujo Partner contra el cual acreditar RLS.
- **Pruebas existentes:** `identity_partner_privilege_hardening.test.sql` incluye casos negativos de identidad, roles y datos maestros cubiertos, no de refunds o payouts inexistentes.
- **Pruebas pendientes:** integración de UI/API y auditoría Central para cada acción sensible, además de contratos y pruebas específicas para los futuros dominios financieros.
- **Decisión pendiente relacionada:** matriz definitiva de campos Aliados/Central y niveles de aprobación.

## 2. Autenticación y autorización

### BR-PARTNER-004 — Autenticado no equivale a Partner autorizado

- **ID:** BR-PARTNER-004.
- **Nombre:** Autenticado no equivale a Partner autorizado.
- **Estado:** PARCIALMENTE IMPLEMENTADA.
- **Descripción:** una sesión válida no concede por sí sola acceso operativo a MPHO Aliados.
- **Origen o fuente:** decisión aprobada de Pack 02, punto 4; `docs/partner/01_PROJECT_OVERVIEW.md`, §6.4; `AGENTS.md`, §12.
- **Actores:** cualquier usuario autenticado.
- **Precondiciones:** sesión Supabase Auth válida.
- **Acción permitida o prohibida:** sólo un usuario que además cumpla el contrato Partner puede entrar a rutas protegidas; una cuenta Customer sin Partner queda prohibida.
- **Resultado esperado:** cuentas no autorizadas son dirigidas a acceso denegado o reciben respuesta API 403.
- **Consecuencias:** se evita que autenticación sea tratada como autorización.
- **Errores o bloqueos:** ausencia de asignación Partner, rol inadecuado o consulta fallida bloquean acceso.
- **Criterio de aceptación:** Customer autenticado sin Partner no abre `/inicio`, `/pedidos` ni una ruta no clasificada.
- **Evidencia técnica actual:** `apps/partner/proxy.ts` exige `partnerAccess.status === 'authorized'` para rutas protegidas.
- **Pruebas existentes:** `apps/partner/tests/proxy.test.ts` cubre Customer sin Partner; `partner-access.test.ts` cubre cuenta sin asignación.
- **Pruebas pendientes:** E2E con Supabase real y revocación durante sesión.
- **Decisión pendiente relacionada:** ninguna para el principio; sí falta completar controles productivos de identidad.

### BR-PARTNER-005 — Contrato mínimo de acceso operativo

- **ID:** BR-PARTNER-005.
- **Nombre:** Contrato mínimo de acceso operativo.
- **Estado:** PARCIALMENTE IMPLEMENTADA.
- **Descripción:** todo acceso operativo debe verificar sesión, perfil, perfil activo, rol vigente, `partner_id`, Partner en estado permitido y permiso suficiente para la acción.
- **Origen o fuente:** decisión aprobada de Pack 02, punto 5; `docs/partner/01_PROJECT_OVERVIEW.md`, §6.4.
- **Actores:** `partner_operator`, `partner_admin` y capa de autorización.
- **Precondiciones:** usuario autenticado.
- **Acción permitida o prohibida:** se permite continuar sólo cuando todas las verificaciones son positivas; se prohíbe inferir autorización por una pantalla, URL o `default_role`.
- **Resultado esperado:** se obtiene contexto Partner autorizado o acceso denegado.
- **Consecuencias:** el gate de entrada se mantiene separado de los permisos por acción.
- **Errores o bloqueos:** perfil ausente/inactivo, rol revocado, `partner_id` nulo, Partner suspendido/cerrado o error de datos bloquean.
- **Criterio de aceptación:** prueba positiva con perfil/rol/Partner válidos y una prueba negativa por cada precondición.
- **Evidencia técnica actual:** `refreshSession()` consulta `profiles → user_roles → partners`; permite técnicamente Partner `active` o `paused`. `user_roles.partner_id` es nullable, no hay constraint rol Partner→`partner_id` ni unicidad activa, y la consulta elige una asignación sin selector explícito de contexto.
- **Pruebas existentes:** `partner-access.test.ts` cubre autorizado, sin asignación, Partner suspendido y fallo de consulta.
- **Pruebas pendientes:** perfil suspendido, rol revocado durante sesión, Partner `closed`/`pending_onboarding`, expiración y acción granular.
- **Decisión pendiente relacionada:** acciones exactas permitidas cuando Partner está `paused`, invariante de esquema y selección determinista cuando existan varias asignaciones.

### BR-PARTNER-006 — Sesión vencida y acceso denegado

- **ID:** BR-PARTNER-006.
- **Nombre:** Sesión vencida y acceso denegado.
- **Estado:** PARCIALMENTE IMPLEMENTADA.
- **Descripción:** sesión ausente, vencida o no verificable debe fallar cerrado y ofrecer un siguiente paso seguro sin revelar datos privados.
- **Origen o fuente:** `docs/partner/01_PROJECT_OVERVIEW.md`, §8.3; `AGENTS.md`, §§12 y 28; `docs/15_PARTNER_APP.md`, §40.
- **Actores:** usuario Partner y proxy/capa de sesión.
- **Precondiciones:** petición a recurso protegido.
- **Acción permitida o prohibida:** se permite redirigir a login o devolver error API seguro; se prohíbe servir datos cacheados como autorización vigente.
- **Resultado esperado:** navegador conserva sólo una ruta de retorno sanitizada; API devuelve 401/503 según el caso.
- **Consecuencias:** no existe apertura por fallo y se evitan loops de redirect.
- **Errores o bloqueos:** fallo de proveedor o configuración se comunica genéricamente y bloquea operación.
- **Criterio de aceptación:** token ausente/vencido, refresh fallido y error backend no exponen contenido ni generan loops.
- **Evidencia técnica actual:** proxy protege por defecto, sanitiza redirects y diferencia API de HTML; los redirects absolutos aún derivan del origin de la petición sin allowlist de host canónico.
- **Pruebas existentes:** `proxy.test.ts` y `routes.test.ts` cubren redirección, fallo cerrado, ruta desconocida, API y loop.
- **Pruebas pendientes:** expiración durante una mutación, reanudación segura y limpieza de datos tras logout/cambio de cuenta.
- **Decisión pendiente relacionada:** política de idle/absolute timeout, recuperación, MFA y host canónico permitido.

## 3. Privilegio mínimo

### BR-PARTNER-007 — Usuario nuevo restrictivo por defecto

- **ID:** BR-PARTNER-007.
- **Nombre:** Usuario nuevo restrictivo por defecto.
- **Estado:** CONFIRMADA.
- **Descripción:** un usuario operativo nuevo inicia con el nivel de privilegio más restrictivo hasta recibir permisos explícitos.
- **Origen o fuente:** decisión aprobada de Pack 02, punto 6; `docs/partner/01_PROJECT_OVERVIEW.md`, §8.1.
- **Actores:** Central, identidad nueva y servicios de onboarding.
- **Precondiciones:** creación de perfil o invitación.
- **Acción permitida o prohibida:** se permite asignar sólo el mínimo aprobado; se prohíbe otorgar `partner_admin` o facultades sensibles por defecto.
- **Resultado esperado:** identidad nueva sin permiso explícito no puede operar recursos Partner.
- **Consecuencias:** reduce impacto de errores de alta y credenciales comprometidas.
- **Errores o bloqueos:** asignación ausente o inconsistente impide acceso; no se completa alta privilegiada parcialmente.
- **Criterio de aceptación:** alta sin rol Partner falla cerrado y autoelevación desde browser es imposible.
- **Evidencia técnica actual:** `profiles.default_role` inicia como `customer`; browser no muta `user_roles`.
- **Pruebas existentes:** pgTAP niega inserción/actualización de rol y cambio de `default_role`.
- **Pruebas pendientes:** flujo Central de invitación, expiración, aceptación, MFA y asignación explícita.
- **Decisión pendiente relacionada:** rol interno definitivo más restrictivo y matriz operator/admin.

### BR-PARTNER-008 — Permisos explícitos; frontend no autoriza

- **ID:** BR-PARTNER-008.
- **Nombre:** Permisos explícitos; frontend no autoriza.
- **Estado:** PARCIALMENTE IMPLEMENTADA.
- **Descripción:** toda acción no concedida expresamente queda prohibida; visibilidad de ruta o botón no sustituye validación server-side ni RLS.
- **Origen o fuente:** `AGENTS.md`, §§12 y 14; `docs/10_USER_ROLES.md`, §2; decisiones aprobadas de Pack 02, puntos 5 y 6.
- **Actores:** frontend, backend, RLS y usuarios Partner.
- **Precondiciones:** intento de leer o mutar un recurso.
- **Acción permitida o prohibida:** servidor valida actor, Partner, recurso, estado y acción; cliente no decide autoridad.
- **Resultado esperado:** autorización consistente aunque se llame API/PostgREST directamente.
- **Consecuencias:** se evita bypass por URL, DevTools o request manipulada.
- **Errores o bloqueos:** autorización incierta o política ausente debe bloquear.
- **Criterio de aceptación:** pruebas directas al backend/RLS reproducen el mismo rechazo que la UI.
- **Evidencia técnica actual:** gate server-side y RLS endurecido para tablas maestras.
- **Pruebas existentes:** Vitest del proxy y pgTAP de identidad/Partner.
- **Pruebas pendientes:** todos los futuros comandos operativos; corregir políticas residuales de catálogo.
- **Decisión pendiente relacionada:** matriz por acción y rol.

## 4. Aislamiento entre Partners

### BR-PARTNER-009 — Aislamiento de lectura y escritura por `partner_id`

- **ID:** BR-PARTNER-009.
- **Nombre:** Aislamiento de lectura y escritura por `partner_id`.
- **Estado:** PARCIALMENTE IMPLEMENTADA.
- **Descripción:** cada Partner accede únicamente a su perfil operativo, pedidos, horarios, catálogo, capacidades, personal, ganancias y configuraciones autorizadas.
- **Origen o fuente:** decisión aprobada de Pack 02, punto 7; `AGENTS.md`, §12; `docs/partner/01_PROJECT_OVERVIEW.md`, §8.2.
- **Actores:** Partner A, Partner B, backend y RLS.
- **Precondiciones:** membresía Partner vigente y recurso con owner/scope explícito.
- **Acción permitida o prohibida:** A puede operar sólo filas propias; tiene prohibido operar o inferir filas de B.
- **Resultado esperado:** respuesta vacía/no encontrada o 403 seguro según contrato, sin datos ajenos.
- **Consecuencias:** tenant isolation verificable por recurso.
- **Errores o bloqueos:** `partner_id` del cliente nunca amplía el scope; recurso sin owner no se publica.
- **Criterio de aceptación:** matriz A/B para SELECT, INSERT, UPDATE, DELETE o RPC aplicable a cada tabla.
- **Evidencia técnica actual:** cobertura positiva acotada a tablas maestras y horarios; catálogo tiene riesgo `PSR-001`.
- **Pruebas existentes:** pgTAP A/B para Partner, capabilities, schedules, exceptions y capacity.
- **Pruebas pendientes:** direcciones, zonas, pedidos, stock, personal, evidencia, incidentes, earnings, payouts y URLs firmadas.
- **Decisión pendiente relacionada:** recursos y contratos todavía inexistentes; `partner_admin` ya puede insertar una dirección propia por PostgREST, pero su autoridad de producto, campos y workflow siguen pendientes y no puede modificar `partners.address_id`.

## 5. Propiedad y visibilidad de datos

### BR-PARTNER-010 — Propiedad, minimización y no exposición

- **ID:** BR-PARTNER-010.
- **Nombre:** Propiedad, minimización y no exposición.
- **Estado:** NO IMPLEMENTADA.
- **Descripción:** Partner recibe sólo datos de cliente, destinatario, pedido, entrega y evidencia estrictamente necesarios para la tarea actual; Central conserva datos globales y Customer conserva recursos propios.
- **Origen o fuente:** `AGENTS.md`, §12; `docs/10_USER_ROLES.md`, §§12 y 13; `docs/partner/01_PROJECT_OVERVIEW.md`, §§5.1 y 8.7.
- **Actores:** Customer, Partner, Central y servicios de datos.
- **Precondiciones:** tarea Partner asignada y necesidad operativa vigente.
- **Acción permitida o prohibida:** se permite un DTO mínimo; se prohíbe historial ajeno, marketing, exportación masiva, datos financieros del cliente o PII innecesaria.
- **Resultado esperado:** payload reducido por estado y acción.
- **Consecuencias:** menor exposición de datos y cumplimiento de privacidad operacional.
- **Errores o bloqueos:** falta de tarea o permiso devuelve respuesta sin PII y sin confirmar existencia ajena.
- **Criterio de aceptación:** pruebas inspeccionan payloads y logs para confirmar ausencia de campos no necesarios.
- **Evidencia técnica actual:** Aliados no sirve pedidos reales; por tanto no existe DTO operativo suficiente para acreditar la regla.
- **Pruebas existentes:** pruebas Phase 7 confirman que DTO Customer no expone identidad Partner, pero no prueban el sentido inverso Partner.
- **Pruebas pendientes:** pedido/detalle Partner, PII por estado, evidencia, logs, analytics y notificaciones.
- **Decisión pendiente relacionada:** campos exactos visibles por tarea, rol y estado.

## 6. Pedidos

### BR-PARTNER-011 — Un pedido tiene un Punto MPHO responsable

- **ID:** BR-PARTNER-011.
- **Nombre:** Un pedido tiene un Punto MPHO responsable.
- **Estado:** CONFIRMADA.
- **Descripción:** en el MVP un pedido tiene un solo Punto MPHO responsable y no se divide entre varios Partners sin diseño posterior aprobado.
- **Origen o fuente:** `AGENTS.md`, §5; `docs/partner/01_PROJECT_OVERVIEW.md`, §8.8; `docs/17_CATALOG_AND_INVENTORY.md`, §37.
- **Actores:** sistema de asignación, Central y Partner responsable.
- **Precondiciones:** pedido elegible para asignación.
- **Acción permitida o prohibida:** se permite asignar un único responsable; se prohíbe split silencioso.
- **Resultado esperado:** relación responsable única y auditable.
- **Consecuencias:** stock, custodia, preparación y entrega parten de una sola responsabilidad operativa.
- **Errores o bloqueos:** un pedido incompatible debe ofrecer alternativa o bloquearse; sólo un diseño posterior aprobado puede definir subórdenes, y nunca se fuerza multi-Partner por inferencia.
- **Criterio de aceptación:** constraint/transacción impide dos responsables activos y concurrencia de doble aceptación.
- **Evidencia técnica actual:** Phase 7 valida una sola fuente local para el quote, pero `orders` no tiene `responsible_partner_id`.
- **Pruebas existentes:** pgTAP de Phase 7 rechaza carrito con dos fuentes Partner distintas.
- **Pruebas pendientes:** asignación concurrente, aceptación doble, reasignación y conservación de historia.
- **Decisión pendiente relacionada:** contrato post-`paid` de asignación/oferta.

### BR-PARTNER-012 — Sólo pedidos pagados y asignados

- **ID:** BR-PARTNER-012.
- **Nombre:** Sólo pedidos pagados y asignados.
- **Estado:** NO IMPLEMENTADA.
- **Descripción:** Aliados sólo debe recibir pedidos realmente asignados y, cuando el flujo lo exige, con pago confirmado por la fuente autoritativa.
- **Origen o fuente:** `AGENTS.md`, §5; propuesta de piloto de Pack 02; `docs/partner/01_PROJECT_OVERVIEW.md`, §10.
- **Actores:** proveedor de pago, sistema, Central y Partner asignado.
- **Precondiciones:** orden en `paid` confirmado y asignación válida.
- **Acción permitida o prohibida:** se permite consultar/ofertar sólo después de esas precondiciones; se prohíbe crear operación Partner por estado cliente o pago no verificado.
- **Resultado esperado:** cola contiene únicamente pedidos propios respaldados por servidor.
- **Consecuencias:** evita preparar pedidos impagos o ajenos.
- **Errores o bloqueos:** pago bajo revisión, asignación ausente o fuente incierta bloquean oferta y crean la excepción aplicable cuando exista contrato.
- **Criterio de aceptación:** pedido no pagado/no asignado nunca aparece; retry de asignación no duplica ownership.
- **Evidencia técnica actual:** Phase 8 llega a `paid` e intencionalmente excluye assignment; `/pedidos` muestra no disponible.
- **Pruebas existentes:** pgTAP de pagos confirma ausencia de estados operativos posteriores.
- **Pruebas pendientes:** cola Partner, ownership, RLS A/B y transición `paid` a asignación aprobada.
- **Decisión pendiente relacionada:** modelo completo post-`paid`.

### BR-PARTNER-013 — Cambios de estado autorizados y trazables

- **ID:** BR-PARTNER-013.
- **Nombre:** Cambios de estado autorizados y trazables.
- **Estado:** NO IMPLEMENTADA.
- **Descripción:** cada cambio valida estado origen, destino, actor, Partner, recurso, motivo, versión y precondiciones; conserva historia y efectos aprobados.
- **Origen o fuente:** `AGENTS.md`, §10; `docs/13_ORDER_LIFECYCLE.md`, §§2, 38 a 43.
- **Actores:** Partner autorizado, Central y servicios verificados según transición.
- **Precondiciones:** pedido propio, transición aprobada, versión vigente y permiso suficiente.
- **Acción permitida o prohibida:** se permite sólo transición explícita; se prohíben saltos, free text como único estado y edición directa desde UI.
- **Resultado esperado:** estado persistido con actor, timestamp, razón, request e idempotencia.
- **Consecuencias:** efectos laterales se ejecutan una vez y la historia no se borra.
- **Errores o bloqueos:** estado obsoleto devuelve conflicto; transición inválida o actor incorrecto se rechaza.
- **Criterio de aceptación:** pruebas positivas/negativas por transición, rollback, concurrencia y side effects únicos.
- **Evidencia técnica actual:** existe patrón de versión, history, audit e idempotencia hasta pago, no servicio Partner.
- **Pruebas existentes:** suites SQL de fases 6 a 8 prueban parte del patrón fuera del dominio Partner.
- **Pruebas pendientes:** todas las transiciones Partner aprobadas, doble dispositivo y estado cambiado por otro actor.
- **Decisión pendiente relacionada:** lista contractual exacta de transiciones posteriores a `paid`.

### BR-PARTNER-014 — Aceptación, rechazo y cierre Partner

- **ID:** BR-PARTNER-014.
- **Nombre:** Aceptación, rechazo y cierre Partner.
- **Estado:** DECISIÓN PENDIENTE.
- **Descripción:** falta aprobar quién acepta/rechaza, estados origen/destino, precondiciones, expiración, reason codes, reasignación, cancelación y cierre.
- **Origen o fuente:** decisiones pendientes de Pack 02; `docs/partner/01_PROJECT_OVERVIEW.md`, §13; `docs/13_ORDER_LIFECYCLE.md`, §§13 a 15, como especificación objetivo.
- **Actores:** Partner operator/admin, Central y sistema.
- **Precondiciones:** oferta vigente, Partner correcto y condiciones operativas confirmadas, por definir.
- **Acción permitida o prohibida:** ninguna facultad exacta se considera aprobada mientras la matriz esté pendiente.
- **Resultado esperado:** futuro contrato explícito sin inventar estados o consecuencias.
- **Consecuencias:** evita implementar botones que aparenten operación inexistente.
- **Errores o bloqueos:** oferta expirada, reasignada, falta de capacidad o conflicto deben tener respuesta aprobada antes de implementación.
- **Criterio de aceptación:** decisión firmada y pruebas de aceptación/rechazo, doble aceptación, expiración, reasignación e historia.
- **Evidencia técnica actual:** no existen `partner_offers`, tareas o comandos Partner.
- **Pruebas existentes:** ninguna operativa.
- **Pruebas pendientes:** todas las anteriores después de aprobar el contrato.
- **Decisión pendiente relacionada:** permisos operator/admin, reason codes, deadlines, SLA, efectos y compensación.

## 7. Horarios y capacidad

### BR-PARTNER-015 — Horario regular propio

- **ID:** BR-PARTNER-015.
- **Nombre:** Horario regular propio.
- **Estado:** PROPUESTA.
- **Descripción:** el piloto propone que un Partner admin gestione campos permitidos del horario regular de su propio Partner; operator sólo consulta.
- **Origen o fuente:** decisión aprobada de Pack 02, punto 11, expresamente como propuesta; `docs/partner/01_PROJECT_OVERVIEW.md`, §10; migración de hardening §§327 a 353.
- **Actores:** `partner_admin`, `partner_operator`, Central y RLS.
- **Precondiciones:** Partner autorizado, fila de horario existente y permiso admin.
- **Acción permitida o prohibida:** admin podría actualizar columnas allowlisted propias; operator y cross-Partner no pueden mutar; `id`, `partner_id` y timestamps no son editables.
- **Resultado esperado:** horario validado y persistido sin cambiar ownership.
- **Consecuencias:** cambios futuros deben afectar ofertas nuevas, no borrar responsabilidades activas.
- **Errores o bloqueos:** rangos inválidos, conflicto, fila ajena o backend fallido no muestran éxito.
- **Criterio de aceptación:** pruebas A/B, admin/operator, validación temporal, timezone, concurrencia y error UI.
- **Evidencia técnica actual:** DB permite al admin actualizar por PostgREST campos seguros de filas existentes; no hay UI/ruta funcional ni servicio de negocio conectado.
- **Pruebas existentes:** pgTAP cubre update allowlisted, rechazo operator y cross-Partner.
- **Pruebas pendientes:** bootstrap, formulario, integración, E2E y conflictos.
- **Decisión pendiente relacionada:** aprobación definitiva del piloto, campos, timezone y manejo de excepciones.

### BR-PARTNER-016 — Capacidad y excepciones de horario

- **ID:** BR-PARTNER-016.
- **Nombre:** Capacidad y excepciones de horario.
- **Estado:** CONTRADICCIÓN DETECTADA.
- **Descripción:** documentos UX atribuyen edición de capacidad al Partner, mientras SQL vigente niega update directo de `partner_capacity`; excepciones también permanecen en camino controlado.
- **Origen o fuente:** `docs/15_PARTNER_APP.md`, §§29 y 30; `docs/63_PARTNER_PWA_UX_AND_SCREEN_SPEC.md`, §15; migración de hardening §§288 a 338; decisiones pendientes de Pack 02.
- **Actores:** Partner, Central y sistema de capacidad.
- **Precondiciones:** contrato de capacidad aún no aprobado.
- **Acción permitida o prohibida:** provisionalmente se permite lectura propia según RLS; se prohíbe mutación directa desde Aliados.
- **Resultado esperado:** ninguna capacidad, excepción o disponibilidad se presenta como cambiada sin fuente autoritativa.
- **Consecuencias:** evita autoampliación de capacidad y promesas no verificadas.
- **Errores o bloqueos:** falta de capacidad verificada no se interpreta como disponible ni como cero.
- **Criterio de aceptación:** resolver autoridad, campos, tipos, vigencia, concurrencia y efecto sobre ofertas; después probar A/B y comandos.
- **Evidencia técnica actual:** tablas y lectura RLS existen; browser no actualiza capacidad ni inserta excepciones.
- **Pruebas existentes:** pgTAP niega update de capacidad e insert de excepción.
- **Pruebas pendientes:** contrato de negocio y flujo end-to-end.
- **Decisión pendiente relacionada:** quién administra capacidad/excepciones y qué ocurre cuando no hay capacidad.

## 8. Catálogo

### BR-PARTNER-017 — Catálogo propio y campos autorizados

- **ID:** BR-PARTNER-017.
- **Nombre:** Catálogo propio y campos autorizados.
- **Estado:** DECISIÓN PENDIENTE.
- **Descripción:** Partner sólo podrá consultar o modificar catálogo propio/asignado dentro de campos explícitamente aprobados.
- **Origen o fuente:** decisiones aprobadas de Pack 02, puntos 7 y 12; `docs/partner/01_PROJECT_OVERVIEW.md`, §13; `docs/17_CATALOG_AND_INVENTORY.md`, §53, como objetivo.
- **Actores:** Partner, Central y servicio de catálogo.
- **Precondiciones:** listing vinculado al Partner, membresía vigente y campo allowlisted.
- **Acción permitida o prohibida:** se prohíbe asumir facultad sobre precio, publicación, categoría, MPHORA o reglas globales; edición futura requiere contrato.
- **Resultado esperado:** cambio propio revisable y auditado, o rechazo seguro.
- **Consecuencias:** no se confunde propiedad de datos originales con autoridad de publicación.
- **Errores o bloqueos:** listing ajeno, campo reservado o membresía revocada bloquean sin filtrar información.
- **Criterio de aceptación:** matriz de campos/roles/estado, pruebas A/B y revisión Central donde aplique.
- **Evidencia técnica actual:** app Partner no tiene flujo de catálogo; RLS de listings tiene revocación incompleta (`PSR-001`).
- **Pruebas existentes:** pruebas de catálogo generales, no suficientes para la membresía Partner endurecida.
- **Pruebas pendientes:** suspensión, `revoked_at`, Partner suspendido, A/B y mutaciones allowlisted.
- **Decisión pendiente relacionada:** campos editables, precios sugeridos, variantes, stock, imágenes y publicación.

### BR-PARTNER-018 — Disponibilidad honesta y precio no manipulable

- **ID:** BR-PARTNER-018.
- **Nombre:** Disponibilidad honesta y precio no manipulable.
- **Estado:** CONFIRMADA.
- **Descripción:** stock, horario, capacidad, tiempos y disponibilidad deben provenir de fuente real; Partner no altera precio final, fees, comisión ni elegibilidad MPHORA.
- **Origen o fuente:** `AGENTS.md`, §§6.1, 6.4, 8, 9 y 11; decisiones pendientes de Pack 02 sobre precios y capacidad.
- **Actores:** Partner, Central, Customer y servicios de catálogo/precio.
- **Precondiciones:** fuente vigente y validación operacional.
- **Acción permitida o prohibida:** se permite confirmar únicamente datos autorizados; se prohíbe presentar por pedido como local, inventar stock o confiar en importes del browser.
- **Resultado esperado:** disponibilidad/importe verdadero o estado no disponible/pendiente.
- **Consecuencias:** Customer y Partner observan información coherente sin promesas falsas.
- **Errores o bloqueos:** dato faltante, stale o conflictivo desactiva afirmación de disponibilidad y MPHORA.
- **Criterio de aceptación:** error/no consulta nunca produce disponible; alteración de importe cliente no cambia total autoritativo.
- **Evidencia técnica actual:** pantallas Partner muestran estados honestos; pricing Customer se recalcula server-side, pero no existe flujo catálogo Partner.
- **Pruebas existentes:** `pages.test.tsx` verifica ausencia de totales ficticios; suites de quote prueban cálculo server-side.
- **Pruebas pendientes:** catálogo Partner, stock, stale data, suspensión y MPHORA.
- **Decisión pendiente relacionada:** campos de disponibilidad editables y reglas comerciales de precio.

## 9. Preparación y paquetes

### BR-PARTNER-019 — Recepción y cadena de custodia

- **ID:** BR-PARTNER-019.
- **Nombre:** Recepción y cadena de custodia.
- **Estado:** NO IMPLEMENTADA.
- **Descripción:** todo paquete identificado debe vincularse a un pedido y conservar recepción, condición, custodio, ubicación, transferencias y disposición final; un paquete desconocido conserva registro y custodia temporal en cuarentena hasta identificarlo o resolverlo por el procedimiento aprobado.
- **Origen o fuente:** `AGENTS.md`, §§9 y 27; `docs/50_PACKAGE_RECEIVING_INSPECTION_AND_STORAGE_SOP.md`, §§1, 6 y 15 a 21.
- **Actores:** Partner autorizado, Central, carrier/courier y servicios operativos.
- **Precondiciones:** paquete esperado o procedimiento de paquete desconocido; capacidad aprobada.
- **Acción permitida o prohibida:** se permite recibir/registrar dentro de alcance; se prohíbe aceptar silenciosamente, abrir paquete desconocido o perder custodia.
- **Resultado esperado:** último custodio, condición y ubicación siempre verificables.
- **Consecuencias:** discrepancia, daño o mismatch crea incidente y bloquea preparación cuando corresponda.
- **Errores o bloqueos:** paquete no esperado se pone en cuarentena; fallo de persistencia no confirma recepción.
- **Criterio de aceptación:** recepción duplicada es idempotente; paquete desconocido/dañado sigue flujo seguro; A/B impide acceso ajeno.
- **Evidencia técnica actual:** `/paquetes` declara no disponibilidad; no existe tabla `package_receipts` ni servicio de custodia.
- **Pruebas existentes:** sólo prueba de estado honesto de pantalla.
- **Pruebas pendientes:** cadena completa, duplicidad, offline, evidencia, daño, pérdida y reconciliación diaria.
- **Decisión pendiente relacionada:** evidencia obligatoria, alcance de inspección y responsabilidad por daño/pérdida.

### BR-PARTNER-020 — Preparación validada y sin sustitución silenciosa

- **ID:** BR-PARTNER-020.
- **Nombre:** Preparación validada y sin sustitución silenciosa.
- **Estado:** NO IMPLEMENTADA.
- **Descripción:** preparación inicia sólo con producto físico validado, aprobaciones requeridas, personalización resuelta, tarea activa y sin incidente bloqueante; no existe sustitución silenciosa.
- **Origen o fuente:** `AGENTS.md`, §27; `docs/51_GIFT_PREPARATION_PERSONALIZATION_AND_QUALITY_SOP.md`, §§2, 4 a 6 y 13.
- **Actores:** Partner autorizado, Customer cuando aprueba y Central/operaciones.
- **Precondiciones:** pedido aceptado según contrato futuro, producto disponible, paquete inspeccionado cuando aplica y contenido aprobado.
- **Acción permitida o prohibida:** se permite preparar conforme al pedido aprobado; se prohíbe trabajo irreversible sin aprobación o reemplazo unilateral.
- **Resultado esperado:** preparación coincide con snapshot autorizado y conserva controles de calidad.
- **Consecuencias:** mismatch bloquea, preserva materiales/evidencia y abre incidente.
- **Errores o bloqueos:** aprobación faltante, producto incorrecto, daño o estado obsoleto impiden iniciar/marcar listo.
- **Criterio de aceptación:** pruebas por cada precondición y sustitución; servidor, no checklist local, confirma transición.
- **Evidencia técnica actual:** no existe checklist, tarea o comando de preparación.
- **Pruebas existentes:** ninguna operativa.
- **Pruebas pendientes:** start, mismatch, personalización, sustitución, QC, marcar listo y concurrencia.
- **Decisión pendiente relacionada:** transiciones, permisos, evidencia exacta y responsabilidades.

### BR-PARTNER-021 — Evidencia privada y vinculada

- **ID:** BR-PARTNER-021.
- **Nombre:** Evidencia privada y vinculada.
- **Estado:** NO IMPLEMENTADA.
- **Descripción:** evidencia requerida se vincula al pedido/evento, minimiza PII, no se reutiliza y usa almacenamiento protegido.
- **Origen o fuente:** `AGENTS.md`, §§6.2 y 12; `docs/50`, §8; `docs/51`, §§16 y 17.
- **Actores:** Partner, Central revisor y servicio de almacenamiento.
- **Precondiciones:** tarea/orden propia y tipo de evidencia aprobado.
- **Acción permitida o prohibida:** se permite carga protegida del archivo necesario; se prohíbe evidencia de otro pedido, URL pública privada, PII innecesaria o reutilización engañosa.
- **Resultado esperado:** archivo y metadatos quedan asociados a un único evento autorizado.
- **Consecuencias:** evidencia inválida bloquea el hito correspondiente y puede crear incidente.
- **Errores o bloqueos:** carga parcial, sesión vencida o permiso denegado no marcan operación completa.
- **Criterio de aceptación:** tenant A/B, URL firmada, hash/duplicado, retry y metadatos privados probados.
- **Evidencia técnica actual:** Supabase Storage y media de catálogo existen, pero no hay bucket/policy/contrato privado ni flujo Partner para evidencia operativa.
- **Pruebas existentes:** ninguna.
- **Pruebas pendientes:** todas las anteriores y limpieza/cache/logout.
- **Decisión pendiente relacionada:** matriz definitiva de evidencias obligatorias por operación y categoría.

## 10. Entregas

### BR-PARTNER-022 — Handoff sólo a courier verificado

- **ID:** BR-PARTNER-022.
- **Nombre:** Handoff sólo a courier verificado.
- **Estado:** NO IMPLEMENTADA.
- **Descripción:** custodia cambia únicamente al verificar courier/provider, pedido, paquete, condición y registrar el handoff.
- **Origen o fuente:** `AGENTS.md`, §§18 y 27; `docs/53_DELIVERY_DISPATCH_HANDOFF_AND_FAILED_DELIVERY_RUNBOOK.md`, §§5 y 6.
- **Actores:** Partner, courier/provider y operaciones.
- **Precondiciones:** pedido listo, paquete sellado, courier asignado y método de verificación aprobado.
- **Acción permitida o prohibida:** se permite entregar al courier verificado; se prohíbe handoff a quien sólo conoce nombre/destinatario.
- **Resultado esperado:** evento de custodia con hora, condición, identidad, operador y evidencia aplicable.
- **Consecuencias:** courier inválido o problema de pickup conserva custodia con Partner.
- **Errores o bloqueos:** verificación ausente, paquete no listo o proveedor incierto bloquean handoff.
- **Criterio de aceptación:** prueba positiva y negativas de courier incorrecto, retry y doble handoff.
- **Evidencia técnica actual:** no existen delivery/courier tasks ni comando Partner.
- **Pruebas existentes:** ninguna operativa.
- **Pruebas pendientes:** proveedor, identidad, A/B, idempotencia, custodia y error backend.
- **Decisión pendiente relacionada:** proveedor logístico y método de verificación.

### BR-PARTNER-023 — Entrega fallida conserva hechos y custodia

- **ID:** BR-PARTNER-023.
- **Nombre:** Entrega fallida conserva hechos y custodia.
- **Estado:** NO IMPLEMENTADA.
- **Descripción:** una entrega fallida registra causa, tiempo, custodia, condición, opciones y responsabilidad de costo; no reintenta ni cobra automáticamente.
- **Origen o fuente:** `AGENTS.md`, §27; `docs/53`, §§12 a 16.
- **Actores:** courier/provider, Partner, Customer y operaciones Central.
- **Precondiciones:** intento de entrega verificado.
- **Acción permitida o prohibida:** Partner registra recepción de retorno/custodia cuando aplica; decisiones de reintento, refund o responsabilidad no se inventan.
- **Resultado esperado:** incidente/estado verificable con siguiente acción aprobada.
- **Consecuencias:** producto inseguro o no viable no vuelve a entregarse.
- **Errores o bloqueos:** falta de causa/custodia impide cerrar; respuesta tardía se reconcilia antes de repetir.
- **Criterio de aceptación:** escenarios de retorno, pérdida, daño, rechazo y reintento idempotente.
- **Evidencia técnica actual:** no existe flujo de entrega Partner.
- **Pruebas existentes:** ninguna.
- **Pruebas pendientes:** todas las anteriores y provider reconciliation.
- **Decisión pendiente relacionada:** reprogramación, costos, responsabilidades, proveedor, prueba y SLA.

## 11. Notificaciones

### BR-PARTNER-024 — Notificación no es fuente oficial

- **ID:** BR-PARTNER-024.
- **Nombre:** Notificación no es fuente oficial.
- **Estado:** CONFIRMADA.
- **Descripción:** una notificación puede alertar, pero la base de datos y los servicios de dominio conservan el estado oficial.
- **Origen o fuente:** `AGENTS.md`, §§6.2, 18 y 27; `docs/partner/01_PROJECT_OVERVIEW.md`, §4.
- **Actores:** Partner, servicio de notificaciones y backend.
- **Precondiciones:** evento oficial persistido o transición aprobada según contrato.
- **Acción permitida o prohibida:** se permite alertar y deep-link futuro; se prohíbe aceptar, confirmar stock, recibir, marcar listo o handoff sólo en WhatsApp/mensaje.
- **Resultado esperado:** abrir la notificación consulta verdad vigente y autorización actual.
- **Consecuencias:** mensaje duplicado o retrasado no duplica ni revierte operación.
- **Errores o bloqueos:** fallo de canal crea retry/excepción, no cambia estado oficial.
- **Criterio de aceptación:** notificación duplicada/tardía y deep link expirado no ejecutan acciones automáticamente.
- **Evidencia técnica actual:** no existe servicio Partner de notificaciones.
- **Pruebas existentes:** ninguna.
- **Pruebas pendientes:** eventos, duplicidad, retry, privacidad, sesión y deep links.
- **Decisión pendiente relacionada:** canales, proveedores, eventos, destinatarios y prioridades.

## 12. Cancelaciones, devoluciones y disputas

### BR-PARTNER-025 — Solicitud no equivale a refund confirmado

- **ID:** BR-PARTNER-025.
- **Nombre:** Solicitud no equivale a refund confirmado.
- **Estado:** NO IMPLEMENTADA.
- **Descripción:** cancelación solicitada, cancelación aprobada, refund enviado y refund confirmado son hechos distintos; Partner no aprueba refunds.
- **Origen o fuente:** `AGENTS.md`, §§7, 10, 25 y 27; `docs/42_CANCELLATIONS_REFUNDS_AND_DISPUTES_POLICY.md`, §§2 y 14; `docs/22_PAYMENTS_AND_PAYOUTS.md`, §45.
- **Actores:** Customer/solicitante, Central/finanzas, proveedor y Partner como aportante de hechos.
- **Precondiciones:** caso identificado, estado confiable y autorización Central.
- **Acción permitida o prohibida:** Partner puede aportar evidencia futura; se prohíbe aprobar, ejecutar o marcar refund completo.
- **Resultado esperado:** estado refleja confirmación real del proveedor y ledger reconciliado.
- **Consecuencias:** no hay refund doble ni deducción silenciosa al Partner.
- **Errores o bloqueos:** provider incierto, chargeback o idempotencia conflictiva bloquean completion y exigen revisión.
- **Criterio de aceptación:** misma solicitud no duplica refund; UI nunca dice “reembolsado” mientras está enviado/procesando.
- **Evidencia técnica actual:** Phase 8 excluye refunds; Aliados no tiene flujo.
- **Pruebas existentes:** ninguna Partner.
- **Pruebas pendientes:** lifecycle, provider retry, ledger, disputa y efecto Partner.
- **Decisión pendiente relacionada:** política de cancelación, devolución, disputa y compensación.

### BR-PARTNER-026 — Política comercial y responsabilidades pendientes

- **ID:** BR-PARTNER-026.
- **Nombre:** Política comercial y responsabilidades pendientes.
- **Estado:** DECISIÓN PENDIENTE.
- **Descripción:** no están aprobados porcentajes, plazos, componentes retenibles, devoluciones, penalizaciones, responsabilidad por daño/pérdida/retraso ni compensación por trabajo.
- **Origen o fuente:** decisión aprobada de Pack 02, punto 12; `docs/partner/01_PROJECT_OVERVIEW.md`, §13; `docs/42`, §1, declara revisión legal pendiente.
- **Actores:** Producto, Legal, Finanzas, Operaciones, Customer y Partner.
- **Precondiciones:** revisión legal, consumidor, fiscal, pagos y operación.
- **Acción permitida o prohibida:** se prohíbe publicar o implementar una regla comercial concreta por inferencia.
- **Resultado esperado:** decisión versionada con base legal, aceptación y trazabilidad.
- **Consecuencias:** la ruta afectada permanece bloqueada para producción.
- **Errores o bloqueos:** ausencia de decisión no se reemplaza con texto de ejemplo o cálculo ad hoc.
- **Criterio de aceptación:** política aprobada, versionada, casos de prueba y software alineado.
- **Evidencia técnica actual:** no hay motor Partner de cancelaciones/disputas.
- **Pruebas existentes:** ninguna aplicable al flujo completo.
- **Pruebas pendientes:** matriz por etapa y causa después de la aprobación.
- **Decisión pendiente relacionada:** todas las reglas comerciales enumeradas en la descripción.

## 13. Comisiones, saldos y payouts

### BR-PARTNER-027 — Central gobierna reglas económicas; Partner sólo consulta lo propio

- **ID:** BR-PARTNER-027.
- **Nombre:** Central gobierna reglas económicas; Partner sólo consulta lo propio.
- **Estado:** NO IMPLEMENTADA.
- **Descripción:** Central define reglas económicas aprobadas; Partner sólo consulta earnings/payouts propios provenientes de ledger real y nunca marca payout pagado.
- **Origen o fuente:** decisiones aprobadas de Pack 02, puntos 1, 3, 7 y 12; `AGENTS.md`, §§6.2, 11, 12, 25 y 27.
- **Actores:** Central/finanzas, Partner y proveedor/banco.
- **Precondiciones:** evento fuente, acuerdo/rate aprobado, currency, ledger y permiso Partner.
- **Acción permitida o prohibida:** Partner puede consultar/desafiar información propia futura; se prohíbe cambiar comisión, importe, periodicidad, saldo o destino sin flujo aprobado, y marcar un payout como pagado sin evidencia.
- **Resultado esperado:** información itemizada, conciliada y aislada por `partner_id`.
- **Consecuencias:** earning, saldo pagable y payout permanecen separados; no hay total opaco.
- **Errores o bloqueos:** ausencia de ledger se muestra no disponible, no cero; una referencia faltante impide marcar el payout como pagado, sin alterar por ello el estado `paid` del pedido.
- **Criterio de aceptación:** A/B financiero, minor units/currency, evento único, payout con destino verificado, referencia y conciliación.
- **Evidencia técnica actual:** `/ganancias` muestra información no disponible; no existen tablas Partner de earnings/payouts.
- **Pruebas existentes:** prueba de pantalla honesta, no prueba financiera.
- **Pruebas pendientes:** ledger, reversos, refunds, ajustes, payout, conciliación, A/B e idempotencia.
- **Decisión pendiente relacionada:** fórmula, importes, periodicidad, saldos, holds, deducciones, liquidaciones y penalizaciones.

## 14. Soporte e incidencias

### BR-PARTNER-028 — Partner reporta; Central resuelve lo que excede su autoridad

- **ID:** BR-PARTNER-028.
- **Nombre:** Partner reporta; Central resuelve lo que excede su autoridad.
- **Estado:** NO IMPLEMENTADA.
- **Descripción:** Partner registra hechos y evidencia de una incidencia propia; no inventa resolución económica, administrativa, legal o de seguridad.
- **Origen o fuente:** `AGENTS.md`, §§6.3 y 27; `docs/partner/01_PROJECT_OVERVIEW.md`, §§3 y 8; `docs/56_INCIDENT_EXCEPTION_AND_RECOVERY_OPERATIONS.md`.
- **Actores:** Partner, operaciones Central, soporte, seguridad y finanzas según caso.
- **Precondiciones:** recurso propio y tipo de incidente permitido.
- **Acción permitida o prohibida:** se permite reportar dentro del scope; se prohíbe cerrar o resolver fuera de permiso.
- **Resultado esperado:** incidente con owner, estado, siguiente acción y evidencia verificable.
- **Consecuencias:** excepciones críticas tienen responsable y próxima actualización; operación bloqueada no continúa silenciosamente.
- **Errores o bloqueos:** fallo de envío preserva borrador seguro sin mostrar éxito; incidente ajeno no se revela.
- **Criterio de aceptación:** A/B, severidad, owner, escalamiento, offline/timeout y cierre autorizado.
- **Evidencia técnica actual:** no existe tabla o UI operativa de incidentes Partner.
- **Pruebas existentes:** ninguna.
- **Pruebas pendientes:** todas las anteriores.
- **Decisión pendiente relacionada:** catálogo de incidencias, severidades, SLA, consecuencias y autoridad de cierre.

## 15. Auditoría y trazabilidad

### BR-PARTNER-029 — Acción crítica con registro auditable

- **ID:** BR-PARTNER-029.
- **Nombre:** Acción crítica con registro auditable.
- **Estado:** PARCIALMENTE IMPLEMENTADA.
- **Descripción:** toda acción crítica futura conserva actor, fecha/hora, entidad, estado anterior/posterior, resultado, error, razón e identificador de correlación cuando corresponda.
- **Origen o fuente:** `AGENTS.md`, §§10, 12 y 15; `docs/10_USER_ROLES.md`, §18; `docs/13_ORDER_LIFECYCLE.md`, §43.
- **Actores:** usuarios, servicios, auditoría y revisores autorizados.
- **Precondiciones:** comando o acceso sensible.
- **Acción permitida o prohibida:** se permite registrar metadatos mínimos y protegidos; se prohíbe borrar historia o incluir secretos/PII innecesaria.
- **Resultado esperado:** evento correlacionable, inmutable para actores operativos y separado de analytics.
- **Consecuencias:** investigación, reconciliación y atribución verificables.
- **Errores o bloqueos:** acción sensible que no pueda auditarse debe fallar o usar control compensatorio aprobado; no se declara completa.
- **Criterio de aceptación:** cada comando deja al menos un rastro auditable completo conforme a la política, sin duplicados no intencionales; cada rechazo sensible queda observable cuando la política lo exige.
- **Evidencia técnica actual:** `audit_logs` e `order_state_history` cubren quote/pago; no cubren proxy ni operación Partner.
- **Pruebas existentes:** pgTAP Phase 7/8 comprueba idempotencia y redacción de audit logs.
- **Pruebas pendientes:** login/denegación, roles, horarios y todos los comandos Partner.
- **Decisión pendiente relacionada:** retención, visibilidad, alertas y política de auditoría Partner.

## 16. Datos honestos

### BR-PARTNER-030 — Prohibición de datos y éxitos ficticios

- **ID:** BR-PARTNER-030.
- **Nombre:** Prohibición de datos y éxitos ficticios.
- **Estado:** PARCIALMENTE IMPLEMENTADA.
- **Descripción:** no se muestran pedidos, ventas, métricas, stock, disponibilidad, ganancias, saldos o estados exitosos sin fuente y confirmación backend.
- **Origen o fuente:** decisión aprobada de Pack 02, punto 10; `AGENTS.md`, §§6.1, 20 y 21; `docs/partner/01_PROJECT_OVERVIEW.md`, §8.4.
- **Actores:** UI Aliados, backend y usuarios Partner.
- **Precondiciones:** carga de un módulo operativo o financiero.
- **Acción permitida o prohibida:** se permite mostrar dato real o estado no disponible/pendiente; se prohíbe hardcode, placeholder engañoso, cero inferido o éxito local.
- **Resultado esperado:** el usuario distingue vacío confirmado de información no consultada.
- **Consecuencias:** no se toman decisiones operativas o financieras con datos falsos.
- **Errores o bloqueos:** error/timeout no cambia a vacío o éxito; conserva retry/siguiente acción.
- **Criterio de aceptación:** pruebas verifican ausencia de `$0`, conteos, pedidos y botones de éxito ficticios cuando no hay fuente.
- **Evidencia técnica actual:** Inicio, Pedidos, Paquetes, Ganancias y Configuración muestran mensajes honestos.
- **Pruebas existentes:** `apps/partner/tests/pages.test.tsx` cubre esos estados.
- **Pruebas pendientes:** loading, vacío backend real, error, offline y estados honestos por cada futuro módulo.
- **Decisión pendiente relacionada:** ninguna para la prohibición; métricas definitivas siguen pendientes.

## 17. Errores e idempotencia

### BR-PARTNER-031 — Operaciones deterministas ante duplicidad y fallo

- **ID:** BR-PARTNER-031.
- **Nombre:** Operaciones deterministas ante duplicidad y fallo.
- **Estado:** PARCIALMENTE IMPLEMENTADA.
- **Descripción:** doble clic, dos dispositivos, retry, petición duplicada, conexión interrumpida, respuesta tardía, sesión vencida y operación parcial no duplican ni contradicen efectos.
- **Origen o fuente:** `AGENTS.md`, §§10, 16, 20 y 25; `docs/13_ORDER_LIFECYCLE.md`, §§40 y 41.
- **Actores:** usuario Partner, backend, jobs y proveedores.
- **Precondiciones:** comando con clave idempotente, versión esperada y request/correlation ID cuando aplique.
- **Acción permitida o prohibida:** misma clave y payload puede reproducir resultado; misma clave con payload distinto se rechaza; se prohíbe retry ciego de resultado incierto.
- **Resultado esperado:** una transición, reserva, tarea, earning, notificación, delivery o payout por evento lógico.
- **Consecuencias:** consistencia ante concurrencia y fallos parciales.
- **Errores o bloqueos:** versión obsoleta produce conflicto; timeout exige consulta/reconciliación; sesión vencida no confirma operación.
- **Criterio de aceptación:** matriz de doble clic, dos pestañas, timeout/retry, replay, payload conflictivo y side effects únicos.
- **Evidencia técnica actual:** quote, draft, revisión y pago implementan patrones de versión/idempotencia; no hay comandos Partner.
- **Pruebas existentes:** suites SQL de fases 5 a 8 cubren replay/conflicto en esos dominios.
- **Pruebas pendientes:** aceptar/rechazar, stock, recepción, preparación, listo, handoff, incidentes, earnings y notificaciones.
- **Decisión pendiente relacionada:** envelope y semántica de error de cada comando Partner.

## 18. Acciones reservadas a Central

### BR-PARTNER-032 — Catálogo mínimo de acciones Central

- **ID:** BR-PARTNER-032.
- **Nombre:** Catálogo mínimo de acciones Central.
- **Estado:** CONFIRMADA.
- **Descripción:** permanecen en Central: aprobación de Partners, asignación/revocación de roles, activación, suspensión, reglas globales, comisiones, excepciones administrativas, disputas administrativas, supervisión global y configuraciones sensibles.
- **Origen o fuente:** decisiones aprobadas de Pack 02, punto 1; requerimiento obligatorio de esta sección; `docs/partner/01_PROJECT_OVERVIEW.md`, §5.2.
- **Actores:** roles Central autorizados; Partner como sujeto o solicitante limitado.
- **Precondiciones:** permiso, nivel de aprobación, razón y evidencia aplicables.
- **Acción permitida o prohibida:** Central puede ejecutar sólo mediante contrato aprobado; Aliados no expone facultad equivalente.
- **Resultado esperado:** cada acción sensible tiene actor Central y rastro auditable.
- **Consecuencias:** la separación de aplicaciones no se limita a navegación, sino también a autoridad.
- **Errores o bloqueos:** ausencia de servicio seguro, MFA/step-up o auditoría mantiene la acción no disponible.
- **Criterio de aceptación:** tests de permisos desde Aliados y Central, sin `service_role` genérico expuesto.
- **Evidencia técnica actual:** browser Partner no muta roles/master data; no existe todavía servicio Central completo.
- **Pruebas existentes:** negativos SQL de identidad Partner.
- **Pruebas pendientes:** positivos/negativos de cada caso de uso Central.
- **Decisión pendiente relacionada:** workflows, aprobación dual, owners y campos por acción.

## 19. Matriz de decisiones pendientes

| ID | Decisión pendiente | Fuentes | Dueños requeridos | Bloquea |
| --- | --- | --- | --- | --- |
| DP-BR-001 | Tipos definitivos de aliado y capacidades asociadas. | Pack 02, decisión 12; `docs/08` como objetivo. | Producto, Operaciones, Legal. | Onboarding y asignación. |
| DP-BR-002 | Matriz final `partner_operator`/`partner_admin` y mínimo por defecto. | Pack 02, decisiones 5, 6 y 12. | Producto, Identidad, Seguridad. | Toda mutación Partner. |
| DP-BR-003 | Frontera para invitar, asignar, elevar y revocar personal Partner. | CT-02/PSR-014. | Producto, Central, Seguridad. | Gestión de equipo. |
| DP-BR-004 | Invariante rol Partner→`partner_id`, unicidad y selección explícita ante múltiples asignaciones activas. | PSR-002/PSR-003. | Producto, Identidad, Seguridad, Datos. | Contexto Partner determinista. |
| DP-BR-005 | Acciones permitidas a Partner `paused`. | PSR-013; enum/proxy actual. | Producto, Operaciones, Seguridad. | Comandos operativos. |
| DP-BR-006 | Contrato post-`paid`: asignación, oferta, aceptación/rechazo, caducidad e historia. | Partner Overview §13; Pack 02. | Producto, Órdenes, Operaciones. | Piloto de pedidos. |
| DP-BR-007 | Campos editables de horario, bootstrap, excepciones y timezone. | BG-03; propuesta de piloto. | Producto, Operaciones. | Gestión de horarios. |
| DP-BR-008 | Modelo de capacidad y conducta cuando no hay capacidad. | CT capacidad; Pack 02 decisión 12. | Producto, Operaciones. | Asignación y MPHORA. |
| DP-BR-009 | Campos de catálogo/inventario editables y tratamiento de precios sugeridos. | Partner Overview §13; PSR-001. | Producto, Catálogo, Finanzas, Seguridad. | Catálogo Partner. |
| DP-BR-010 | Evidencia obligatoria por operación, categoría y riesgo. | Pack 02 decisión 12; SOP 50/51. | Operaciones, Seguridad, Legal. | Paquetes, preparación, entrega. |
| DP-BR-011 | Proveedor logístico, modos, verificación, pruebas y responsabilidades. | Pack 02 decisión 12. | Operaciones, Legal, Finanzas. | Entregas. |
| DP-BR-012 | SLA, deadlines, cutoffs, escalamiento y consecuencias. | Pack 02 decisión 12. | Producto, Operaciones, Legal. | Promesas y timeouts. |
| DP-BR-013 | Cancelaciones, devoluciones, refunds, disputas y responsabilidad económica. | `docs/42` draft; Pack 02. | Legal, Finanzas, Operaciones. | Flujos afectados y publicación. |
| DP-BR-014 | Comisiones, earnings, saldos, liberación, payouts y penalizaciones. | Pack 02 decisión 12. | Finanzas, Legal, Producto. | Módulo financiero. |
| DP-BR-015 | Canales, proveedores, eventos y destinatarios de notificación. | Pack 02 decisión 12. | Producto, Operaciones, Privacidad. | Notificaciones. |
| DP-BR-016 | Métricas de desempeño y consecuencias por incumplimiento. | Pack 02 decisión 12. | Producto, Operaciones, Legal. | Performance/scoring. |
| DP-BR-017 | Alcance definitivo, participantes y autorización del piloto. | Pack 02 decisión 11. | Product owner, Seguridad, Operaciones, Legal. | Pedidos reales. |
| DP-BR-018 | Autoridad, campos, validación y workflow para insertar o gestionar direcciones propias. | Grants/RLS vigentes; Pack 02. | Producto, Operaciones, Privacidad, Seguridad. | Gestión de ubicación/contacto Partner. |
| DP-BR-019 | Host canónico y allowlist de origin para redirects absolutos. | PSR-006. | Plataforma, Seguridad. | Exposición pública de autenticación. |

Contradicciones que no deben resolverse por inferencia:

1. El brief reserva roles a Central, mientras `docs/10` §7, `docs/15` §36 y `docs/63` §16 atribuyen gestión de roles al Partner admin.
2. `docs/08` define un lifecycle Partner granular, pero el enum SQL sólo contiene `pending_onboarding`, `active`, `paused`, `suspended` y `closed`.
3. Documentos UX permiten editar capacidad, pero SQL vigente niega mutación directa de `partner_capacity`.
4. Documentos de catálogo sugieren campos de precio, pero no existe permiso aprobado para cambiar precio final.
5. Partner `paused` conserva acceso al shell/RLS, pero no hay matriz de acciones permitidas.
6. `docs/13` especifica lifecycle posterior a `paid`, pero la implementación real termina en `paid` y excluye assignment/fulfillment.
7. Las políticas heredadas de catálogo no aplican por completo el predicado endurecido de revocación (`PSR-001`).

## 20. Trazabilidad entre reglas y pruebas

| ID de regla | Estado | Fuente principal | Implementación actual | Prueba existente | Prueba requerida | Prioridad |
| --- | --- | --- | --- | --- | --- | --- |
| BR-PARTNER-001 | CONFIRMADA | Pack 02 #1–3 | DML browser negado; servicio Central incompleto | pgTAP identidad | E2E Central + BFLA + audit | P0 |
| BR-PARTNER-002 | PARCIALMENTE IMPLEMENTADA | Pack 02 #2, #7 | RLS maestro Partner; recursos operativos ausentes | pgTAP A/B parcial | A/B por cada recurso | P0 |
| BR-PARTNER-003 | CONFIRMADA | Overview §5.2 | Grants niegan master data sensible | pgTAP campos sensibles | Casos Central positivos/negativos | P0 |
| BR-PARTNER-004 | PARCIALMENTE IMPLEMENTADA | Pack 02 #4 | Proxy distingue auth/authz | Vitest proxy/access | E2E proveedor real | P0 |
| BR-PARTNER-005 | PARCIALMENTE IMPLEMENTADA | Pack 02 #5 | Gate perfil/rol/Partner | Vitest access | Revocación/estado/sesión en vivo | P0 |
| BR-PARTNER-006 | PARCIALMENTE IMPLEMENTADA | Overview §8.3 | Redirect/API fail-closed | Vitest proxy/routes | Expiración durante mutación | P1 |
| BR-PARTNER-007 | CONFIRMADA | Pack 02 #6 | Default customer; roles no mutables | pgTAP | Invitación/MFA/rol inicial | P0 |
| BR-PARTNER-008 | PARCIALMENTE IMPLEMENTADA | `docs/10` §2 | Proxy + RLS parcial | Vitest + pgTAP | Backend/RLS por comando | P0 |
| BR-PARTNER-009 | PARCIALMENTE IMPLEMENTADA | Pack 02 #7 | Aislamiento maestro; PSR-001 abierto | pgTAP parcial | Matriz CRUD/RPC completa | P0 |
| BR-PARTNER-010 | NO IMPLEMENTADA | `AGENTS.md` §12 | Sin DTO operativo Partner | Ninguna directa | Payload/PII/logs por estado | P0 |
| BR-PARTNER-011 | CONFIRMADA | `AGENTS.md` §5 | Single source pre-quote; sin owner | pgTAP Phase 7 | Concurrencia de asignación | P0 |
| BR-PARTNER-012 | NO IMPLEMENTADA | Overview §10 | DB termina en `paid` | pgTAP Phase 8 | Cola pagada/asignada A/B | P0 |
| BR-PARTNER-013 | NO IMPLEMENTADA | `AGENTS.md` §10 | Patrón pre-Partner únicamente | SQL fases 6–8 | Transiciones Partner completas | P0 |
| BR-PARTNER-014 | DECISIÓN PENDIENTE | Overview §13 | Sin ofertas/comandos | Ninguna | Contrato + aceptación/rechazo | P0 |
| BR-PARTNER-015 | PROPUESTA | Piloto Pack 02 | Update PostgREST admin de filas existentes | pgTAP horario | UI/servicio de negocio/E2E/conflicto | P1 |
| BR-PARTNER-016 | CONTRADICCIÓN DETECTADA | UX vs SQL | Lectura propia; mutación negada | pgTAP negativo | Resolver decisión y probar flujo | P0 |
| BR-PARTNER-017 | DECISIÓN PENDIENTE | Overview §13 | Sin UI; RLS catálogo incompleta | Catálogo general insuficiente | PSR-001 + campos/roles A/B | P0 |
| BR-PARTNER-018 | CONFIRMADA | `AGENTS.md` §§6, 8, 11 | Estados honestos; sin catálogo Partner | Pages + quote SQL | Stock/stale/MPHORA/precio | P0 |
| BR-PARTNER-019 | NO IMPLEMENTADA | `AGENTS.md` §27 | Pantalla no conectada | Pages | Custodia E2E/idempotencia/A-B | P0 |
| BR-PARTNER-020 | NO IMPLEMENTADA | SOP 51 | Sin tarea/preparación | Ninguna | Preconditions/substitución/QC | P0 |
| BR-PARTNER-021 | NO IMPLEMENTADA | `AGENTS.md` §§6.2, 12 | Sin storage privado ni contrato de evidencia Partner | Ninguna | Signed URL/hash/retry/A-B | P0 |
| BR-PARTNER-022 | NO IMPLEMENTADA | Runbook 53 | Sin delivery/handoff | Ninguna | Identidad/custodia/doble handoff | P0 |
| BR-PARTNER-023 | NO IMPLEMENTADA | `AGENTS.md` §27 | Sin flujo failed delivery | Ninguna | Retorno/daño/pérdida/retry | P0 |
| BR-PARTNER-024 | CONFIRMADA | `AGENTS.md` §§18, 27 | Sin servicio de notificación | Ninguna | Duplicidad/deep-link/privacidad | P1 |
| BR-PARTNER-025 | NO IMPLEMENTADA | `AGENTS.md` §§25, 27 | Refund excluido de Phase 8 | Ninguna Partner | Provider/ledger/idempotencia | P0 |
| BR-PARTNER-026 | DECISIÓN PENDIENTE | Pack 02 #12 | Sin motor/política aprobada | Ninguna | Matriz legal/operativa | P0 |
| BR-PARTNER-027 | NO IMPLEMENTADA | `AGENTS.md` §11 | Pantalla honesta; sin ledger/payout | Pages | Finanzas A/B/reconcile | P0 |
| BR-PARTNER-028 | NO IMPLEMENTADA | `AGENTS.md` §§6.3, 27 | Sin incidentes Partner | Ninguna | A/B/escalamiento/owner | P1 |
| BR-PARTNER-029 | PARCIALMENTE IMPLEMENTADA | `docs/10` §18 | Audit pre-Partner | pgTAP Phase 7/8 | Audit de auth y comandos Partner | P0 |
| BR-PARTNER-030 | PARCIALMENTE IMPLEMENTADA | Pack 02 #10 | Estados honestos UI | Vitest pages | Loading/empty/error/offline | P1 |
| BR-PARTNER-031 | PARCIALMENTE IMPLEMENTADA | `docs/13` §§40–41 | Idempotencia pre-Partner | SQL fases 5–8 | Doble acción por comando Partner | P0 |
| BR-PARTNER-032 | CONFIRMADA | Pack 02 #1 | Browser Partner negado; Central incompleto | pgTAP negativo | Servicios Central por caso | P0 |

### Referencias verificadas

- `AGENTS.md`.
- Instrucción aprobada de Pack 02 — Product Scope and Business Rules.
- `docs/partner/01_PROJECT_OVERVIEW.md`.
- `reports/partner/technical/DOCUMENTATION_INVENTORY.md`.
- `reports/partner/technical/CONTRADICTIONS.md`.
- `reports/partner/security/PERMISSIONS_RISK_REGISTER.md`.
- `reports/partner/quality/TEST_COVERAGE_GAPS.md`.
- `docs/08_PARTNER_PROGRAM.md`.
- `docs/10_USER_ROLES.md`.
- `docs/13_ORDER_LIFECYCLE.md`.
- `docs/15_PARTNER_APP.md`.
- `docs/17_CATALOG_AND_INVENTORY.md`.
- `docs/22_PAYMENTS_AND_PAYOUTS.md`.
- `docs/42_CANCELLATIONS_REFUNDS_AND_DISPUTES_POLICY.md`.
- `docs/50_PACKAGE_RECEIVING_INSPECTION_AND_STORAGE_SOP.md`.
- `docs/51_GIFT_PREPARATION_PERSONALIZATION_AND_QUALITY_SOP.md`.
- `docs/53_DELIVERY_DISPATCH_HANDOFF_AND_FAILED_DELIVERY_RUNBOOK.md`.
- `docs/55_PARTNER_EARNINGS_PAYOUT_AND_RECONCILIATION_RUNBOOK.md`.
- `docs/56_INCIDENT_EXCEPTION_AND_RECOVERY_OPERATIONS.md`.
- `supabase/migrations/20260715180000_persistent_cart_and_draft_orders.sql`.
- `supabase/migrations/20260716090000_operational_review_final_quotes.sql`.
- `supabase/migrations/20260716180000_payment_integrity_foundation.sql`.
- `supabase/migrations/20260718111400_identity_partner_privilege_hardening.sql`.
- `apps/partner/**` y sus pruebas versionadas.
