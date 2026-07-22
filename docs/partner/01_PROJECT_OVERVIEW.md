# MPHO Aliados — Project Overview

## 1. Propósito del documento

Este documento establece una base de producto verificable para MPHO Aliados. Su objetivo es explicar qué problema resuelve, qué lugar ocupa dentro del ecosistema MPHO, qué existe hoy y qué pertenece todavía a una especificación, propuesta o decisión pendiente.

Este documento no sustituye el ciclo de vida de pedidos, las políticas de seguridad, los runbooks operativos ni los acuerdos comerciales. Tampoco aprueba comisiones, payouts, SLA, cancelaciones, disputas o responsabilidades económicas.

## 2. Convención de estado

Las afirmaciones sobre capacidades usan exclusivamente estas etiquetas:

- **IMPLEMENTADO:** existe comportamiento ejecutable y verificable en el repositorio para el alcance indicado. No implica aprobación para producción.
- **PARCIALMENTE IMPLEMENTADO:** existe una parte verificable, pero faltan capas necesarias de interfaz, servidor, persistencia, autorización, operación, integración, pruebas de aceptación o preparación productiva.
- **ESPECIFICADO NO IMPLEMENTADO:** existe una intención o diseño documentado, pero no hay evidencia ejecutable suficiente en MPHO Aliados.
- **DECISIÓN PENDIENTE:** falta aprobación de producto, negocio, seguridad, operación, legal o finanzas; no puede convertirse en regla por inferencia.

Una pantalla, ruta, texto, wireframe o prueba aislada no demuestra por sí solo una capacidad operativa completa.

## 3. Propósito de MPHO Aliados

MPHO Aliados es la aplicación operativa destinada a que un Partner autorizado gestione únicamente su propia operación dentro de MPHO.

Debe convertir el trabajo físico asignado por MPHO en acciones claras, acotadas y auditables. En su visión operativa, debe permitir que cada usuario autorizado conozca:

1. Qué tarea debe realizar.
2. Sobre qué pedido asignado puede actuar.
3. Qué plazo y evidencia aplican, cuando existan reglas aprobadas.
4. Qué acción está autorizada en el estado actual.
5. Qué ocurre después de una confirmación del servidor.
6. Cómo reportar una excepción sin inventar una resolución.

MPHO Aliados no es un panel de gobierno del ecosistema, no es un sustituto de MPHO Central y no convierte por sí solo a un negocio registrado en Punto MPHO.

## 4. Problema que resuelve

La operación de un regalo puede requerir coordinar disponibilidad, recepción de paquetes, inspección, preparación, personalización, evidencia, custodia y entrega al repartidor. Si estas acciones dependen solo de mensajes, llamadas o memoria, MPHO pierde trazabilidad sobre el pedido, su siguiente acción y su responsable.

MPHO Aliados busca reducir:

- Conversaciones largas y no estructuradas por WhatsApp.
- Instrucciones ambiguas o separadas del pedido oficial.
- Acciones sin actor, marca de tiempo o razón.
- Confusión entre una sesión iniciada y una autorización Partner vigente.
- Acceso de un Partner a datos de otro Partner.
- Datos operativos, financieros o de disponibilidad presentados sin fuente autorizada.
- Cambios de estado que no fueron confirmados por el servidor.
- Dependencia de una interfaz administrativa para ejecutar trabajo cotidiano autorizado.

La base de datos y los servicios de dominio de MPHO, no WhatsApp ni el estado local del navegador, deben conservar la verdad oficial.

## 5. Ecosistema y límites de responsabilidad

MPHO opera con tres aplicaciones separadas por audiencia, navegación y permisos.

| Aplicación | Usuario principal | Responsabilidad |
| --- | --- | --- |
| MPHO Customer o Tienda | Cliente final | Descubrir, configurar, comprar y consultar regalos dentro de la experiencia de MPHO. |
| MPHO Aliados | Operadores y administradores de un Partner autorizado | Ejecutar únicamente la operación propia que MPHO haya asignado y autorizado. |
| MPHO Central | Personal interno autorizado de MPHO | Gobernar el ecosistema, aprobar Partners, asignar roles, activar o suspender, configurar reglas globales y tomar decisiones administrativas sensibles. |

Las tres aplicaciones comparten dominios de negocio, pero una aplicación cliente no se convierte en fuente oficial de pagos, pedidos, payouts o entregas.

### 5.1 Relación con MPHO Customer o Tienda

- Customer representa la experiencia normal del cliente final.
- Customer no debe exponer la identidad interna de un Punto MPHO salvo una obligación legal, fiscal, de garantía, seguridad, retiro autorizado o colaboración aprobada.
- Aliados recibe solo la información mínima necesaria para ejecutar trabajo asignado.
- Aliados no puede cambiar el precio final, confirmar pagos no verificados ni acceder al historial de un cliente fuera del pedido autorizado.

### 5.2 Relación con MPHO Central

MPHO Central administra:

- MPHO Aliados.
- MPHO Customer o Tienda.
- Asignación y revocación de roles.
- Aprobación de Partners.
- Activación, restricción, pausa o suspensión administrativa.
- Capacidades sujetas a aprobación.
- Reglas globales.
- Decisiones administrativas sensibles.

MPHO Aliados administra exclusivamente su propia operación autorizada, que puede abarcar, cuando el flujo exista y esté aprobado:

- Pedidos asignados.
- Horarios permitidos.
- Catálogo o disponibilidad dentro de campos y flujos autorizados.
- Personal autorizado dentro de los límites definidos por Central.
- Preparación y seguimiento.
- Información económica propia que provenga de registros conciliados.

MPHO Aliados no puede aprobar su propio Partner, elevar privilegios, asignar roles globales, modificar reglas globales, confirmar payouts, aprobar reembolsos ni operar sobre otro `partner_id`.

## 6. Usuarios

### 6.1 Partner operator

Usuario operativo nombrado que, en la visión especificada, ejecuta tareas diarias acotadas de su Punto MPHO. Sus acciones exactas dependen de una matriz de permisos aprobada, del estado del pedido, de la capacidad autorizada y del alcance del Partner.

### 6.2 Partner administrator

Usuario nombrado con responsabilidades adicionales sobre la operación propia del Partner. Esta denominación no concede autoridad de MPHO Central. La creación, asignación, elevación y revocación de roles permanece bajo gobierno de Central.

### 6.3 Personal interno de MPHO

Los roles internos operan mediante MPHO Central, no mediante una navegación mezclada con Aliados. Son responsables de las decisiones globales, las excepciones que exceden la autoridad del Partner y las acciones sensibles sujetas a aprobación.

### 6.4 Regla de autorización

Una sesión autenticada no equivale a un Partner autorizado.

El contrato verificable actual de acceso protegido exige en el servidor:

1. Usuario válido de Supabase Auth.
2. Perfil con estado `active`.
3. Asignación vigente con rol `partner_operator` o `partner_admin`.
4. Asignación con estado `active`, `revoked_at` nulo y `partner_id` no nulo.
5. Partner asociado con estado `active` o `paused`.

Si no se puede verificar el contrato, el acceso falla cerrado. Este contrato de entrada no demuestra que los flujos operativos posteriores ya existan.

## 7. Propuesta de valor

### 7.1 Para el Partner

- Recibir instrucciones estructuradas para trabajo asignado.
- Distinguir acciones permitidas de decisiones reservadas a Central.
- Reducir coordinación informal.
- Conservar trazabilidad de confirmaciones, evidencias e incidencias cuando los flujos estén implementados.
- Consultar información económica propia cuando exista una fuente financiera conciliada.
- Operar desde una experiencia responsive enfocada en tareas.

MPHO no promete volumen de pedidos, ingreso, territorio exclusivo, aprobación automática ni payout inmediato.

### 7.2 Para MPHO

- Mantener un solo registro oficial por operación.
- Aislar la información por `partner_id`.
- Aplicar capacidades y permisos aprobados.
- Reducir acciones manuales no auditadas.
- Escalar excepciones a Central en vez de delegar decisiones sensibles al Partner.

### 7.3 Para el cliente

- Recibir una experiencia coordinada por MPHO sin tener que gestionar directamente comercios, preparación y entrega.
- Conservar una comunicación coherente con el estado real del pedido.
- Limitar la exposición de datos del cliente y destinatario a lo estrictamente necesario.

## 8. Principios de producto y operación

### 8.1 Mínimo privilegio

Cualquier usuario operativo nuevo debe recibir por defecto el nivel de privilegio más restrictivo hasta que exista una matriz de permisos aprobada. Ningún rol obtiene autoridad por la sola presencia de una pantalla o botón.

### 8.2 Aislamiento por Partner

El `partner_id` debe derivarse del contexto autorizado en el servidor, no de un valor confiado al navegador. Cada Partner puede acceder únicamente a sus pedidos, operación, catálogo, personal e información económica autorizada.

### 8.3 Denegación por defecto

Cuando una sesión, rol, asignación, estado o fuente de datos no pueda confirmarse, la aplicación debe denegar la acción o mostrar la información como no disponible. Un fallo de verificación nunca concede acceso.

### 8.4 Datos reales y fuente autorizada

No deben mostrarse como reales:

- Pedidos ficticios.
- Ganancias ficticias.
- Ventas simuladas.
- Métricas hardcodeadas.
- Disponibilidad no consultada.
- Estados exitosos sin persistencia confirmada.

La ausencia de una consulta autorizada no equivale a cero registros. Debe comunicarse como información no disponible, pendiente o sujeta a validación.

### 8.5 Confirmación del servidor

Ninguna acción local es oficial hasta que el servidor la autoriza, persiste y confirma. Las operaciones críticas deben ser idempotentes, auditables y compatibles con el ciclo de vida del pedido.

### 8.6 Separación de funciones

Customer compra y consulta; Aliados ejecuta operación propia autorizada; Central gobierna y resuelve decisiones globales o sensibles. Las navegaciones, permisos y contextos no deben mezclarse.

### 8.7 Privacidad operativa

Aliados debe recibir solo los datos de cliente, destinatario, pedido, evidencia y entrega necesarios para la tarea vigente. No se permite usar esos datos para marketing ni contacto ajeno al pedido.

### 8.8 Una sola responsabilidad operativa

En el MVP, un pedido tiene un solo Punto MPHO responsable. No se documenta ni habilita división entre varios Partners sin un diseño posterior aprobado.

## 9. Estado actual verificable

Fecha de evidencia: 2026-07-21. Base inspeccionada: commit `5ca06c1`, que incorpora el shell Partner, las correcciones de autorización y el endurecimiento de identidad descritos en los reportes de auditoría.

| Capacidad | Estado | Evidencia y límite |
| --- | --- | --- |
| Aplicación web independiente | **IMPLEMENTADO** | `apps/partner` existe como aplicación Next.js separada con rutas y navegación propias. |
| Diseño responsive | **IMPLEMENTADO** | La auditoría registró validación en `390x844` y `1440x900` sin overflow horizontal. |
| Autenticación y callback PKCE | **IMPLEMENTADO** | Supabase Auth, renovación de sesión y `exchangeCodeForSession` en servidor. |
| Autorización de entrada Partner | **IMPLEMENTADO** | Verificación cerrada de perfil, rol vigente, `partner_id` y estado del Partner antes de rutas protegidas. |
| Aislamiento RLS en tablas maestras Partner cubiertas | **IMPLEMENTADO** | El helper endurecido, las políticas y las pruebas aíslan `partners`, capacidades, horarios, excepciones de horario, capacidad, dirección y zonas Partner. Este control positivo se limita expresamente a esas tablas. |
| Aislamiento transversal y revocación consistente | **PARCIALMENTE IMPLEMENTADO** | Las políticas heredadas `listings_select_partner_own` y `media_assets_select_partner_own` de catálogo no exigen perfil activo, `revoked_at IS NULL` ni estado operativo del Partner. El proxy protege el shell, pero no cubre llamadas PostgREST directas. El riesgo crítico abierto `PSR-001` exige inventario y corrección de todas las políticas Partner; pedidos, tareas, evidencia, ganancias y payouts aún no tienen contratos cuyo aislamiento pueda acreditarse. |
| Cuenta propia y cierre de sesión | **PARCIALMENTE IMPLEMENTADO** | Se muestra el correo de la sesión y se confirma el cierre con el proveedor; preferencias, recuperación y controles productivos completos no están terminados. |
| Inicio, Pedidos, Paquetes, Ganancias y Configuración | **PARCIALMENTE IMPLEMENTADO** | Existen rutas y estados honestos de “no disponible”, pero no consultan contratos operativos autorizados. |
| Recepción y detalle real de pedidos | **ESPECIFICADO NO IMPLEMENTADO** | No existe cola ni detalle conectado a pedidos asignados. |
| Cambios de estado autorizados | **ESPECIFICADO NO IMPLEMENTADO** | No existe servicio Partner conectado para aceptar, rechazar, confirmar o preparar. |
| Gestión de horarios | **ESPECIFICADO NO IMPLEMENTADO** | Existen esquema y reglas de acceso endurecidas, pero la interfaz actual no consulta ni persiste horarios. |
| Paquetes, custodia e inspección | **ESPECIFICADO NO IMPLEMENTADO** | La pantalla actual no consulta datos y no registra custodia. |
| Preparación, evidencia y handoff | **ESPECIFICADO NO IMPLEMENTADO** | Existen especificaciones y SOP, no un flujo ejecutable en Aliados. |
| Catálogo, inventario y disponibilidad | **ESPECIFICADO NO IMPLEMENTADO** | No hay flujo Partner conectado; la disponibilidad real no puede inferirse del catálogo publicado. |
| Ganancias y payouts | **ESPECIFICADO NO IMPLEMENTADO** | La pantalla evita totales ficticios; no existe ledger Partner o payout conciliado expuesto por Aliados. |
| PWA instalable completa | **ESPECIFICADO NO IMPLEMENTADO** | No se verificaron manifest, iconos instalables, instalación, service worker, actualización, offline ni dispositivos objetivo. Hoy debe describirse como aplicación web responsive. |
| Preparación para producción | **PARCIALMENTE IMPLEMENTADO** | **NO APROBADO PARA PRODUCCIÓN.** Existen controles locales positivos, pero permanecen controles ausentes y riesgos abiertos de RLS transversal, administración privilegiada, MFA y recuperación, cabeceras y caché, rate limits, auditoría, alertas y autorización operativa. Además de cerrar esas brechas con evidencia, siguen pendientes decisiones y aprobaciones humanas de seguridad, legal, operación y lanzamiento. |

La suite Partner auditada registró 40 pruebas en 8 archivos y resultados satisfactorios de lint, typecheck, test y build. Estas pruebas sustentan el shell y su frontera de acceso; no prueban flujos operativos que todavía no existen.

## 10. Propuesta de piloto mínimo

Estado: **PROPUESTA DE PRODUCTO — DECISIÓN PENDIENTE DE APROBACIÓN DEFINITIVA**.

Para reducir el riesgo y validar primero el núcleo de MPHO Aliados, se propone concentrar el piloto inicial en:

1. Recepción de pedidos realmente asignados al único Punto MPHO responsable.
2. Consulta del detalle operativo mínimo y autorizado.
3. Cambios de estado permitidos por actor, estado actual y transición aprobada.
4. Gestión de horarios permitidos para la propia operación.

Condiciones mínimas de esta propuesta:

- Ningún pedido se ofrece antes de pago confirmado cuando el ciclo oficial exija `paid → assignment_pending → partner_offered`.
- Cada acción deriva el `partner_id` en servidor y conserva actor, fecha, razón e idempotencia.
- La interfaz incluye carga, vacío real, error, sesión vencida, acceso no autorizado y conflicto de estado.
- “Sin pedidos” solo se muestra después de una consulta autorizada exitosa.
- Los horarios no conceden capacidades, estado Partner ni elegibilidad MPHORA.
- Los nuevos usuarios operativos reciben el privilegio más restrictivo.
- Central conserva aprobación, asignación de roles, activación, suspensión y reglas globales.

No forman parte de esta primera propuesta, salvo aprobación posterior y dependencias cumplidas:

- PWA instalable completa, offline y push.
- Autoservicio de onboarding o aprobación de Partners.
- Catálogo e inventario completos.
- Recepción de paquetes, preparación, evidencia y entrega.
- Ganancias, payouts, comisiones y disputas.
- Analítica avanzada, performance scoring y MPHORA.

La propuesta no autoriza un piloto con pedidos reales. El lanzamiento requiere cumplir los gates de seguridad, identidad, operación, legal, pagos, recuperación e incidentes aplicables.

## 11. Visión futura

La visión documentada de MPHO Aliados es una aplicación operativa que cubra, de manera progresiva y con contratos aprobados:

```text
invitación segura
→ autorización Partner
→ horario y capacidad
→ pedido pagado y asignado
→ oferta
→ aceptación o rechazo
→ stock o recepción externa
→ preparación
→ evidencia
→ listo
→ handoff
→ seguimiento limitado
→ ganancia auditable
→ payout conciliado
```

Cada bloque futuro permanece **ESPECIFICADO NO IMPLEMENTADO** hasta que existan interfaz, servidor, persistencia, RLS, auditoría, pruebas y aceptación operativa suficientes. La secuencia no aprueba por sí sola tarifas, plazos, responsabilidades ni permisos.

MPHO Aliados podrá describirse como PWA instalable completa únicamente después de validar por aplicación:

- Manifest.
- Iconos.
- Instalación.
- Service worker y alcance.
- Estrategia de caché segura.
- Actualización.
- Comportamiento offline.
- Logout y limpieza de datos privados.
- Notificaciones y deep links autenticados.
- Dispositivos objetivo.

## 12. Fuera de alcance de esta base

- Crear o aprobar reglas de comisiones, tarifas o earnings.
- Definir frecuencia, mínimos, holds o destinos de payout.
- Aprobar SLA, tiempos de aceptación o tiempos de preparación.
- Decidir cancelaciones, reembolsos, disputas o responsabilidad económica.
- Diseñar una arquitectura definitiva.
- Implementar endpoints, migraciones, RLS, pantallas o flujos operativos nuevos.
- Crear una cuarta aplicación o mezclar navegación Customer, Aliados y Central.
- Habilitar órdenes con varios Partners responsables.
- Presentar datos de prototipo como operación real.
- Declarar producción, instalación PWA o integraciones como completas sin evidencia.

## 13. Decisiones pendientes

Las siguientes preguntas permanecen como **DECISIÓN PENDIENTE**:

1. Matriz final de permisos para `partner_operator` y `partner_admin`, incluida la autoridad exacta para aceptar pedidos y gestionar personal.
2. Flujo controlado de Central para invitar, asignar, elevar, revocar y auditar usuarios Partner.
3. Reglas de comisiones, earnings, deducciones, liberación, payout y conciliación.
4. SLA, deadlines, timeouts, horarios de servicio y reglas de escalamiento.
5. Reglas definitivas de cancelación, reembolso, disputa y compensación por trabajo realizado.
6. Responsabilidades económicas y operativas ante stock incorrecto, daño, pérdida, retraso, entrega fallida o proveedor externo.
7. Alcance exacto del piloto, participantes, zonas, catálogo, capacidad y criterios de salida.
8. Contrato de pedidos y transiciones que expondrá MPHO Aliados después de `paid`.
9. Campos de catálogo, inventario, disponibilidad y horarios que el Partner podrá modificar sin aprobación adicional.
10. Controles productivos de MFA, recuperación, sesiones y reautenticación para cada rol Partner.
11. Estrategia PWA, offline, almacenamiento local protegido, push y dispositivos objetivo.
12. Entidad legal, tratamiento fiscal, acuerdo Partner, protección de datos, seguros y responsabilidades necesarias para operar en México.

Mientras una decisión no esté aprobada, la aplicación debe conservar denegación por defecto y evitar representar la opción como funcional.

## 14. Referencias

Fuentes de producto y gobierno:

- `AGENTS.md`
- `README.md`
- `docs/00_DOCUMENTATION_INDEX.md`
- `docs/01_PROJECT_OVERVIEW.md`
- `docs/03_BRAND_ECOSYSTEM.md`
- `docs/04_GLOSSARY.md`
- `docs/05_SCOPE_AND_NON_GOALS.md`
- `docs/06_BUSINESS_MODEL.md`
- `docs/08_PARTNER_PROGRAM.md`
- `docs/09_PRICING_AND_COMMISSIONS.md`
- `docs/10_USER_ROLES.md`
- `docs/12_PARTNER_JOURNEY.md`
- `docs/13_ORDER_LIFECYCLE.md`
- `docs/15_PARTNER_APP.md`
- `docs/22_PAYMENTS_AND_PAYOUTS.md`

Fuentes de seguridad y operación:

- `docs/31_THREAT_MODEL_AND_ABUSE_CASES.md`
- `docs/32_SECURITY_CONTROLS_AND_ASVS_CHECKLIST.md`
- `docs/33_SECRETS_KEYS_AND_PRIVILEGED_ACCESS.md`
- `docs/34_DEPLOYMENT_ENVIRONMENTS_AND_HARDENING.md`
- `docs/35_BACKUP_RECOVERY_AND_BUSINESS_CONTINUITY.md`
- `docs/36_SECURITY_INCIDENT_RESPONSE_RUNBOOK.md`
- `docs/37_FRAUD_RISK_AND_FINANCIAL_CONTROLS.md`
- `docs/38_PRODUCTION_READINESS_AND_LAUNCH_CHECKLIST.md`
- `docs/43_PARTNER_AGREEMENT_REQUIREMENTS.md`
- `docs/48_PARTNER_ONBOARDING_AND_ACTIVATION_RUNBOOK.md`
- `docs/49_DAILY_ORDER_OPERATIONS_RUNBOOK.md`
- `docs/50_PACKAGE_RECEIVING_INSPECTION_AND_STORAGE_SOP.md`
- `docs/51_GIFT_PREPARATION_PERSONALIZATION_AND_QUALITY_SOP.md`
- `docs/53_DELIVERY_DISPATCH_HANDOFF_AND_FAILED_DELIVERY_RUNBOOK.md`
- `docs/54_CANCELLATIONS_REFUNDS_AND_DISPUTE_OPERATIONS_RUNBOOK.md`
- `docs/55_PARTNER_EARNINGS_PAYOUT_AND_RECONCILIATION_RUNBOOK.md`
- `docs/56_INCIDENT_EXCEPTION_AND_RECOVERY_OPERATIONS.md`
- `docs/57_PILOT_LAUNCH_AND_FIRST_100_ORDERS_RUNBOOK.md`

Fuentes de experiencia y evidencia actual:

- `docs/59_THREE_PWA_ECOSYSTEM_AND_ARCHITECTURE.md`
- `docs/63_PARTNER_PWA_UX_AND_SCREEN_SPEC.md`
- `docs/64_CENTRAL_ADMIN_PWA_UX_AND_SCREEN_SPEC.md`
- `docs/66_PWA_INSTALLATION_NOTIFICATIONS_OFFLINE_CACHE_AND_UPDATES.md`
- `docs/67_ROUTES_WIREFRAMES_AND_COMPONENT_INVENTORY.md`
- `docs/68_PROTOTYPE_ACCEPTANCE_AND_HANDOFF_TO_OPENCODE.md`
- `docs/69_CURRENT_IMPLEMENTATION_AND_FOUNDATION_STATUS.md`
- `docs/75_PRODUCT_COMPLETION_GAPS_AND_CAPABILITY_ROADMAP.md`
- `CODEX_PARTNER_AUDIT_REPORT.md`
- `CODEX_IDENTITY_SECURITY_REPORT.md`

## 15. Glosario breve

**Punto MPHO:**

Negocio o unidad operativa Partner autorizada para participar dentro del ecosistema MPHO y asociada mediante partner_id.

**MPHO Central:**

Aplicación administrativa que gobierna Partners, Customer/Tienda, roles, aprobaciones y reglas globales.

**MPHO Customer o Tienda:**

Aplicación utilizada por el cliente final para descubrir, configurar, comprar y consultar regalos.

**MPHO Aliados:**

Aplicación operativa para que un Partner autorizado gestione únicamente su propia operación.

**Partner:**

Entidad de negocio autorizada dentro de MPHO.

**Codex:**

Agente de desarrollo utilizado para inspeccionar, implementar, probar y auditar cambios técnicos bajo reglas aprobadas.
