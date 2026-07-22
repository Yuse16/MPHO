# Validación de producto y documentación — MPHO Aliados Project Overview

## 1. Resultado

**APROBADO PARA REVISIÓN HUMANA**, sujeto a resolver las decisiones pendientes antes de convertirlas en comportamiento operativo o contractual.

Archivo validado:

- `docs/partner/01_PROJECT_OVERVIEW.md`

Fecha de validación: 2026-07-21.

Base inspeccionada: commit `5ca06c1` en `agent/partner-docs-foundation` antes de este cambio documental.

## 2. Objetivo de la validación

Comprobar que el primer documento de MPHO Aliados:

- Define propósito, problema, ecosistema, usuarios y propuesta de valor.
- Separa Customer, Aliados y Central.
- No convierte especificaciones o mockups en capacidades reales.
- Registra estado actual y visión futura con etiquetas explícitas.
- Incluye una propuesta de piloto mínimo sin presentarla como aprobada.
- Aplica mínimo privilegio.
- No inventa negocio.
- Conserva decisiones ambiguas como `DECISIÓN PENDIENTE`.
- Reproduce el glosario requerido.
- No crea alcance documental adicional no autorizado.

## 3. Método

La revisión se ejecutó secuencialmente en dos perspectivas:

1. **Producto y negocio:** comparación de la documentación existente, las decisiones aprobadas para esta misión y el estado verificable del repositorio.
2. **Documentación:** redacción, trazabilidad de fuentes, consistencia de términos, clasificación de estados y control de alcance.

No se modificó código, esquema, migraciones, configuración, pruebas ni documentación fuera de las rutas autorizadas.

## 4. Matriz de cumplimiento

| Requisito | Resultado | Evidencia en el overview |
| --- | --- | --- |
| Propósito | CUMPLE | Secciones 1 y 3. |
| Problema | CUMPLE | Sección 4. |
| Ecosistema | CUMPLE | Sección 5. |
| Relación Customer, Aliados y Central | CUMPLE | Tabla y subsecciones 5.1 y 5.2. |
| Usuarios | CUMPLE | Sección 6. |
| Propuesta de valor | CUMPLE | Sección 7. |
| Principios | CUMPLE | Sección 8. |
| Estado actual | CUMPLE | Sección 9 con fecha, commit, estado y límite. |
| Visión futura | CUMPLE | Sección 11, explícitamente no implementada. |
| Fuera de alcance | CUMPLE | Sección 12. |
| Decisiones pendientes | CUMPLE | Sección 13. |
| Referencias | CUMPLE | Sección 14. |
| Glosario breve literal | CUMPLE | Sección 15 reproduce las seis definiciones solicitadas. |
| Propuesta del piloto mínimo | CUMPLE | Sección 10 la marca como propuesta pendiente. |
| Regla de privilegio mínimo | CUMPLE | Sección 8.1 y condiciones del piloto. |
| Diferencia Partner/Central | CUMPLE | Secciones 3, 5.2 y 6. |
| Diferencia estado real/visión futura | CUMPLE | Secciones 2, 9 y 11. |
| No crear 02/03 ni arquitectura definitiva | CUMPLE | Solo se crearon los dos archivos autorizados. |

## 5. Fuentes revisadas

### 5.1 Gobierno y fundamentos

- `AGENTS.md`, leído completo.
- `README.md`.
- `docs/00_DOCUMENTATION_INDEX.md`.
- `docs/01_PROJECT_OVERVIEW.md`.
- Objetivo supervisor `MPHO ALIADOS AGENTIC FOUNDATION 1.1` proporcionado para esta misión.

### 5.2 Producto Partner

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
- `docs/43_PARTNER_AGREEMENT_REQUIREMENTS.md`

### 5.3 Seguridad y operaciones

- `docs/31_THREAT_MODEL_AND_ABUSE_CASES.md` a `docs/38_PRODUCTION_READINESS_AND_LAUNCH_CHECKLIST.md`.
- `docs/48_PARTNER_ONBOARDING_AND_ACTIVATION_RUNBOOK.md` a `docs/57_PILOT_LAUNCH_AND_FIRST_100_ORDERS_RUNBOOK.md`.

### 5.4 PWA, implementación y auditoría

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
- `reports/partner/security/SECURITY_BASELINE.md`, hallazgo de aislamiento y revocación transversal.
- `reports/partner/security/PERMISSIONS_RISK_REGISTER.md`, riesgo crítico `PSR-001`.
- Rutas, páginas, contrato de autorización y pruebas existentes bajo `apps/partner`.
- Historial reciente de Git y estado de la rama.

## 6. Hallazgos de producto

### 6.1 Afirmaciones aceptadas como verdad para esta misión

1. MPHO Central gobierna Customer/Tienda, Aliados, roles, aprobaciones, activación, suspensión y reglas globales.
2. MPHO Aliados opera solo el alcance propio y autorizado de un Partner.
3. Autenticación no equivale a autorización Partner.
4. El piloto mínimo de pedidos, detalle, transiciones autorizadas y horarios es una propuesta, no una aprobación de lanzamiento.
5. Un usuario operativo nuevo recibe el privilegio más restrictivo hasta aprobar la matriz.
6. La aplicación actual es web responsive, no PWA instalable completa.
7. Los datos operativos o financieros no consultados no pueden presentarse como cero o como realidad.
8. Comisiones, payouts, SLA, cancelaciones, disputas y responsabilidad económica requieren decisión aprobada.

### 6.2 Estado real confirmado

- Existe una aplicación Next.js Partner separada.
- Las rutas protegidas validan sesión y autorización Partner en servidor.
- La autorización exige perfil activo, rol Partner vigente, `partner_id` y Partner con estado permitido.
- Las políticas endurecidas y sus pruebas aíslan las tablas maestras cubiertas: Partner, capacidades, horarios, excepciones de horario, capacidad, dirección y zonas.
- La revocación no es transversal todavía: las políticas Partner heredadas de listados y media de catálogo omiten perfil activo, `revoked_at` y estado operativo del Partner. El control es **PARCIALMENTE IMPLEMENTADO** y el riesgo crítico `PSR-001` permanece abierto.
- El callback completa PKCE en servidor.
- Las pantallas protegidas actuales muestran estados honestos de indisponibilidad en vez de datos inventados.
- No existe cola operativa conectada de pedidos, recepción de paquetes, preparación, evidencia, earnings o payouts.
- No existe PWA instalable completa: faltan validaciones de manifest, iconos, instalación, service worker, actualización, offline y dispositivos.
- Las pruebas existentes sustentan acceso, redirects, callback, navegación, cierre de sesión y estados honestos; no sustentan flujos de fulfillment.
- MPHO Aliados está **NO APROBADO PARA PRODUCCIÓN**: además de decisiones humanas pendientes, faltan controles verificables y permanecen riesgos abiertos de RLS transversal, privilegios, MFA/recuperación, cabeceras/caché, rate limits, auditoría, alertas y autorización operativa.

## 7. Contradicciones y tensiones documentales

### C-01 — PWA especificada frente a aplicación web actual

- `docs/15_PARTNER_APP.md`, `docs/59_THREE_PWA_ECOSYSTEM_AND_ARCHITECTURE.md` y `docs/63_PARTNER_PWA_UX_AND_SCREEN_SPEC.md` describen una experiencia instalable como objetivo.
- `CODEX_PARTNER_AUDIT_REPORT.md` y el código actual demuestran únicamente una aplicación web responsive.
- Resolución aplicada: el overview clasifica la PWA completa como **ESPECIFICADO NO IMPLEMENTADO**.

### C-02 — Autoservicio de personal frente a gobierno de Central

- `docs/08_PARTNER_PROGRAM.md`, `docs/10_USER_ROLES.md`, `docs/15_PARTNER_APP.md`, `docs/48_PARTNER_ONBOARDING_AND_ACTIVATION_RUNBOOK.md` y `docs/63_PARTNER_PWA_UX_AND_SCREEN_SPEC.md` atribuyen al Partner administrator acciones como invitar, asignar o revocar usuarios.
- La decisión aprobada de esta misión asigna a MPHO Central el gobierno de roles y decisiones administrativas sensibles.
- Resolución aplicada: Central conserva asignación y revocación; cualquier autoservicio futuro será solo una solicitud o acción acotada por una matriz aprobada. La matriz final queda como **DECISIÓN PENDIENTE**.

### C-03 — Matriz preliminar frente a privilegio restrictivo por defecto

- `docs/10_USER_ROLES.md` incluye una matriz preliminar amplia.
- La misión declara que aún no existe una matriz aprobada para nuevos usuarios operativos.
- Resolución aplicada: denegación por defecto y privilegio más restrictivo. Las acciones exactas de cada rol quedan como **DECISIÓN PENDIENTE**.

### C-04 — Datos ficticios en prototipo frente a datos reales en operación

- `docs/68_PROTOTYPE_ACCEPTANCE_AND_HANDOFF_TO_OPENCODE.md` permite contenido ficticio realista para prototipos.
- Las reglas permanentes y la misión prohíben mostrar pedidos, ganancias, disponibilidad o métricas ficticias como reales.
- Resolución aplicada: los datos ficticios solo podrían existir en un entorno de prototipo claramente aislado y etiquetado; nunca prueban funcionalidad ni pueden aparecer como operación real.

### C-05 — Documentos de estado desactualizados frente al commit actual

- `docs/69_CURRENT_IMPLEMENTATION_AND_FOUNDATION_STATUS.md` y `docs/75_PRODUCT_COMPLETION_GAPS_AND_CAPABILITY_ROADMAP.md` se basan en evidencia anterior y describen Partner como un shell más limitado.
- Los commits posteriores incorporaron autenticación, autorización, navegación, estados honestos y pruebas, pero no flujos operativos.
- Resolución aplicada: el overview usa el commit actual y los reportes posteriores para el shell, conservando como no implementados los flujos operativos.

### C-06 — Modelos financieros descritos frente a reglas no aprobadas

- Los documentos 06, 09, 22, 43 y 55 detallan modelos, categorías y posibles secuencias de earnings y payouts.
- La propia documentación indica que tasas, frecuencia, holds, responsabilidades y varias condiciones no están aprobadas.
- Resolución aplicada: esos modelos son referencias de diseño; el overview no aprueba cifras ni reglas y las conserva como **DECISIÓN PENDIENTE**.

### C-07 — Piloto de producto frente a runbook de primeros 100 pedidos

- `docs/57_PILOT_LAUNCH_AND_FIRST_100_ORDERS_RUNBOOK.md` propone un piloto operacional amplio.
- Esta misión propone primero un alcance de producto más estrecho para Aliados.
- Resolución aplicada: ambos son propuestas de capas distintas; ninguno autoriza pedidos reales. El overview limita su propuesta al núcleo indicado y remite los gates de lanzamiento a los runbooks.

### C-08 — Aislamiento positivo de tablas maestras frente a revocación transversal incompleta

- La migración de endurecimiento y sus pruebas demuestran aislamiento para `partners`, capacidades, horarios, excepciones de horario, capacidad, dirección y zonas Partner.
- Las políticas heredadas `listings_select_partner_own` y `media_assets_select_partner_own` conservan un predicado más débil y pueden permitir lectura posterior a una revocación o suspensión mediante PostgREST directo.
- Resolución aplicada: el overview conserva **IMPLEMENTADO** para las tablas maestras probadas y clasifica el aislamiento transversal como **PARCIALMENTE IMPLEMENTADO**, con referencia al riesgo crítico abierto `PSR-001`.

## 8. Decisiones pendientes consolidadas

1. Permisos exactos de `partner_operator` y `partner_admin`.
2. Flujo de Central para alta, asignación, elevación, revocación y auditoría de usuarios Partner.
3. Comisiones, earnings, liberación, payout, conciliación y deducciones.
4. SLA, horarios, deadlines, timeouts y escalamiento.
5. Cancelaciones, reembolsos, disputas y compensación.
6. Responsabilidad por stock, daño, custodia, pérdida, retraso, proveedor externo y entrega fallida.
7. Alcance, capacidad, zonas, Partners y criterios de salida del piloto.
8. Contrato de pedidos y transiciones posteriores a `paid` para Aliados.
9. Campos Partner editables de horario, catálogo, inventario, disponibilidad y personal.
10. MFA, recuperación, sesiones y reautenticación por rol Partner.
11. PWA, cache, offline, push, logout y dispositivos objetivo.
12. Definiciones legales, fiscales, contractuales, laborales, de privacidad y seguro.

Estas decisiones no bloquean la creación de la base documental. Sí bloquean convertir el alcance afectado en funcionalidad productiva.

## 9. Riesgos documentales pendientes

- Los documentos generales anteriores pueden leerse como afirmaciones de capacidad actual si no se consulta la fecha de evidencia.
- Las palabras “PWA”, “administra personal”, “earnings” y “payout” requieren etiqueta de estado al reutilizarse.
- La lista de estados Partner no es uniforme entre especificaciones antiguas y el contrato actual del esquema.
- Las políticas Partner no comparten todavía un único predicado de membresía y revocación; `PSR-001` bloquea producción hasta corregir y probar las políticas heredadas de catálogo.
- Las propuestas de permisos deben consolidarse en un documento futuro aprobado antes de desarrollo operativo.
- Los ejemplos numéricos de wireframes y pricing no son valores productivos.

## 10. Esquema de documentación futura, sin crear archivos

La siguiente documentación puede proponerse después de revisión humana. No fue creada en esta misión:

- Alcance de producto de MPHO Aliados, con MVP, piloto y no objetivos.
- Reglas de negocio aprobadas, con decisiones, versiones y responsables.
- Matriz de permisos y gobierno Central/Aliados.
- Contrato operativo de pedidos y transiciones Partner.
- Inventario técnico y contratos de datos.
- Estrategia PWA y aceptación por dispositivo.

No se asignan números de archivo ni se declara una arquitectura definitiva.

## 11. Control de alcance

Archivos creados:

- `docs/partner/01_PROJECT_OVERVIEW.md`
- `reports/partner/documentation/PROJECT_OVERVIEW_VALIDATION.md`

No se crearon:

- `docs/partner/02_PRODUCT_SCOPE.md`
- `docs/partner/03_BUSINESS_RULES.md`
- Un nuevo `AGENTS.md`.
- Documentos de arquitectura definitiva.

No se realizaron cambios en Customer, Central, Supabase, migraciones, variables, Vercel, dependencias, lockfile, código Partner o producción.

## 12. Recomendación

Revisar humanamente este overview como base de MPHO Aliados y aprobar o corregir explícitamente las decisiones de gobierno indicadas. No iniciar implementación del piloto operativo hasta contar al menos con:

- Matriz de permisos aprobada.
- Contrato de pedidos y transiciones posteriores a pago confirmado.
- Alcance de horarios editable.
- RLS y pruebas de aislamiento para los recursos operativos.
- Gates aplicables de seguridad, legal y operación.

La aprobación de este documento no equivale a aprobación de producción, PWA completa ni piloto con pedidos reales.
