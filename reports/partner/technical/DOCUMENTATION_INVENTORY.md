# Inventario documental técnico de MPHO Aliados

Fecha de inspección: 2026-07-21

Base de evidencia: commit `5ca06c19f70878cd89c3d1231c11d66d7932b9f5`

## 1. Resultado

El repositorio contiene 76 documentos Markdown bajo `docs/`, más `AGENTS.md`, `README.md` y reportes históricos en la raíz. No se encontraron archivos documentales byte-a-byte idénticos entre los archivos rastreados por Git, pero sí hay **solapamiento semántico considerable** entre especificación de producto, journeys, runbooks, UX/PWA, seguridad y documentos de evidencia de fase.

La documentación no puede leerse como una sola fotografía del estado actual:

- `docs/02`–`30`, `docs/48`–`68` describen principalmente producto y arquitectura objetivo;
- `docs/31`–`38` son controles normativos y checklists, no evidencia de que estén completados;
- `docs/39`–`47` incluyen requisitos y esqueletos legales internos;
- `docs/69` y `docs/71`–`76` son registros de implementación por fecha/commit;
- el código, las migraciones vigentes y las pruebas determinan qué existe realmente, sin desplazar las reglas documentadas cuando hay contradicción.

La orden de la misión aprobada para esta auditoría agrega una verdad explícita: MPHO Aliados es actualmente web responsive y no debe llamarse PWA completa; sesión autenticada no equivale a Partner autorizado; Central gobierna aprobaciones/roles/reglas globales; y no deben mostrarse datos operativos inventados.

## 2. Gobierno y fuentes base

| Fuente | Naturaleza | Estado útil para Aliados |
| --- | --- | --- |
| `AGENTS.md` | reglas obligatorias | vigente; prohíbe inventar datos/reglas y exige seguridad, operación y PWA verificables |
| `README.md` | visión y arquitectura prevista | mezcla propósito, MVP y funciones futuras; no prueba implementación |
| `docs/00_DOCUMENTATION_INDEX.md` | índice y precedencia | cubre los 76 Markdown; “Complete” describe el archivo, no la funcionalidad |
| `docs/01_PROJECT_OVERVIEW.md` | overview de producto | visión amplia; sus flujos/funciones Partner son objetivo |
| objetivo aprobado de Agentic Foundation 1.1 | decisiones de esta misión | vigente para clasificar estado, límites Central/Aliados y decisiones pendientes |

## 3. Documentos Partner

### 3.1 Especificación de producto y roles

| Documento | Qué define | Clasificación para este inventario |
| --- | --- | --- |
| `docs/08_PARTNER_PROGRAM.md` | programa, capabilities, onboarding, estados y operación | objetivo; algunos estados no coinciden con el enum actual |
| `docs/10_USER_ROLES.md` | roles, ownership y matriz de permisos | normativo/conceptual; no equivale a grants implementados |
| `docs/12_PARTNER_JOURNEY.md` | journey completo onboarding → payout/offboarding | objetivo futuro |
| `docs/13_ORDER_LIFECYCLE.md` | estados y transiciones oficiales | normativo; el código sólo llega a `paid` y no implementa la parte Partner |
| `docs/15_PARTNER_APP.md` | pantalla por pantalla y funciones de Aliados | especificación amplia; no estado actual |
| `docs/17_CATALOG_AND_INVENTORY.md` | catálogo, stock, reservas | objetivo; inventario/reservas no existen aún |
| `docs/22_PAYMENTS_AND_PAYOUTS.md` | dinero, earnings, payout/refund | objetivo normativo; Partner finance no existe |

### 3.2 Operación y piloto

| Grupo | Documentos | Naturaleza |
| --- | --- | --- |
| onboarding | `docs/48_PARTNER_ONBOARDING_AND_ACTIVATION_RUNBOOK.md` | runbook objetivo; no flujo ejecutable actual |
| operación diaria | `docs/49_DAILY_ORDER_OPERATIONS_RUNBOOK.md` | colas, owner, deadlines y asignación futura |
| custodia/calidad | `docs/50_*`, `docs/51_*` | SOP objetivo; no tablas/UI de Aliados |
| soporte/entrega | `docs/52_*`, `docs/53_*` | playbooks futuros |
| cancelación/refund | `docs/54_*` | operación futura dependiente de pagos/ledger |
| earnings/payout | `docs/55_PARTNER_EARNINGS_PAYOUT_AND_RECONCILIATION_RUNBOOK.md` | futuro; reglas exactas siguen pendientes |
| incidentes | `docs/56_*` | operación futura |
| piloto | `docs/57_PILOT_LAUNCH_AND_FIRST_100_ORDERS_RUNBOOK.md` | gate de lanzamiento, no evidencia de piloto realizado |

Estos runbooks son relevantes para diseñar estados, evidencia y auditoría, pero no autorizan inventar tablas o completar checklists sin implementación.

## 4. Documentos PWA y UX

| Documento | Contenido | Estado respecto al código actual |
| --- | --- | --- |
| `docs/58_BRAND_VISIBILITY_AND_CUSTOMER_EXPERIENCE_MODEL.md` | identidad MPHO y confidencialidad de Punto MPHO | normativo |
| `docs/59_THREE_PWA_ECOSYSTEM_AND_ARCHITECTURE.md` | tres orígenes, manifests, SW, despliegues y rutas | arquitectura objetivo; sólo existen tres apps web en monorepo |
| `docs/63_PARTNER_PWA_UX_AND_SCREEN_SPEC.md` | navegación y pantallas Partner | objetivo; current shell implementa sólo un subconjunto visual |
| `docs/65_SHARED_DESIGN_SYSTEM_AND_RESPONSIVE_RULES.md` | tokens, breakpoints, accesibilidad y personalidades | objetivo; CSS Partner tiene tokens locales distintos |
| `docs/66_PWA_INSTALLATION_NOTIFICATIONS_OFFLINE_CACHE_AND_UPDATES.md` | manifest, iconos, instalación, push, cache, offline y updates | no implementado en Partner |
| `docs/67_ROUTES_WIREFRAMES_AND_COMPONENT_INVENTORY.md` | wireframes, rutas y componentes | diseño estructural/futuro; sus números son ejemplos de prototipo, no datos de producción |
| `docs/68_PROTOTYPE_ACCEPTANCE_AND_HANDOFF_TO_OPENCODE.md` | aceptación y handoff | proceso objetivo; no hay evidencia de aceptación de PWA Partner completa |

`docs/63` y `docs/67` son la descripción visual más reciente de Aliados, pero no sustituyen las decisiones de producto ni las reglas de permisos. Su contenido debe marcarse como especificado no implementado salvo evidencia de código.

## 5. Documentos técnicos y seguridad

### 5.1 Arquitectura técnica general

| Documento | Clasificación |
| --- | --- |
| `docs/23_TECH_STACK.md` | stack recomendado/objetivo; sólo una parte está instalada |
| `docs/24_SYSTEM_ARCHITECTURE.md` | arquitectura objetivo por dominios, outbox, workers, providers y observabilidad |
| `docs/25_DATABASE_SCHEMA.md` | esquema **conceptual**; muchas tablas enumeradas no existen en migraciones |
| `docs/26_API_AND_INTEGRATIONS.md` | contrato objetivo de APIs/adapters; Partner sólo tiene callback hoy |
| `docs/27_SECURITY_AND_PRIVACY.md` | baseline general anterior a Pack 09 |
| `docs/28_DESIGN_SYSTEM.md` | sistema de diseño general |
| `docs/29_TESTING_AND_QA.md` | estrategia objetivo; la suite actual cubre un subconjunto |
| `docs/30_MVP_ROADMAP_AND_BACKLOG.md` | roadmap, no implementación |

### 5.2 Pack 09

`docs/31`–`38` se leyeron como controles normativos obligatorios:

- threat model y abuso;
- ASVS/checklist;
- secretos y acceso privilegiado;
- entornos/CI/hardening;
- backup/recuperación;
- incident response;
- fraude/controles financieros;
- launch gate.

Sus checkboxes no están marcados con evidencia y no deben convertirse en una afirmación de producción segura. Para Partner sí existe evidencia local acotada de authn/authz, RLS y ausencia de service role cliente; faltan MFA, recovery, rate limits, observabilidad, backup/restore, incident drills, Storage/evidence y aceptación productiva.

## 6. Documentos de estado e implementación

| Documento | Fecha/base declarada | Uso correcto | Desactualización observada |
| --- | --- | --- | --- |
| `docs/69_CURRENT_IMPLEMENTATION_AND_FOUNDATION_STATUS.md` | 2026-07-16, base Phase 7/nota Phase 8 | mapa histórico transversal | no incorpora los commits Partner del 18 de julio; conserva secciones pre-Phase 8 contradictorias |
| `docs/71_CATALOG_SECURITY_TYPES_AND_CI_HARDENING.md` | 2026-07-14, Phase 4.1 | evidencia de catálogo/CI en esa fase | histórico; no es baseline Partner actual |
| `docs/72_SERVER_SIDE_PRICING_AVAILABILITY_AND_QUOTES.md` | Phase 5 | evidencia de quote | no implementa Partner |
| `docs/73_PERSISTENT_CART_AND_DRAFT_ORDER.md` | Phase 6 | evidencia cart/draft | excluye Partner operativo |
| `docs/74_OPERATIONAL_REVIEW_AND_FINAL_QUOTE.md` | Phase 7 | evidencia review/quoted | declara que evidencia manual no es asignación Partner |
| `docs/75_PRODUCT_COMPLETION_GAPS_AND_CAPABILITY_ROADMAP.md` | 2026-07-16, nota Phase 8 | mapa de gaps | contiene texto/matriz anterior a Phase 8 y anterior al shell Partner endurecido |
| `docs/76_PAYMENT_INTEGRITY_AND_MERCADO_PAGO_FOUNDATION.md` | 2026-07-16, Phase 8 | evidencia vigente de `quoted → pending_payment → paid` | no cubre Partner y mantiene producción bloqueada |

`docs/76` confirma expresamente que Partner no recibe acceso, notificación ni asignación a causa de Phase 8. Esa frontera es consistente con el código Partner sin pedidos.

## 7. Reportes históricos en la raíz

### `CODEX_PARTNER_AUDIT_REPORT.md`

Es evidencia útil de los defectos y correcciones de `apps/partner` y registra 40 pruebas, build y responsive manual. Sin embargo, su metadata final dice que las correcciones estaban sin commit. En el historial actual esas correcciones están en `d6c64d4` y fueron integradas por `5ca06c1`; por tanto, sus secciones de estado Git son históricas.

### `CODEX_IDENTITY_SECURITY_REPORT.md`

Describe correctamente el hardening `20260718111400_identity_partner_privilege_hardening.sql`, sus grants/RLS y 83 aserciones de identidad Partner dentro de un archivo pgTAP de 792 líneas. Su encabezado también dice “sin commit”; en el historial actual el cambio está en `3c6a53f` e integrado en `5ca06c1`.

Los reportes raíz deben citarse con commit/fecha y no como estado actual de la rama.

## 8. Solapamientos y duplicados semánticos

No hay duplicados exactos por SHA-256 entre los archivos rastreados de `docs/`. Sí existen estos clusters:

| Dominio | Documentos que se solapan | Riesgo |
| --- | --- | --- |
| Partner end-to-end | `08`, `12`, `15`, `48`–`57`, `63`, `67` | navegación, estados y responsabilidades aparecen en varias versiones |
| roles/autorización | `10`, `15`, `27`, `31`–`38`, migración de hardening | confundir permiso deseado con grant vigente |
| PWA | README, `15`, `59`, `63`, `65`, `66`, `67`, `68` | llamar PWA a un shell responsive |
| schema Partner | `25`, `69`, `75`, migraciones/tipos | crear tablas conceptuales como si estuvieran aprobadas/implementadas |
| piloto/operación | `30`, `48`–`57`, `68`, `75` | métricas/escenarios propuestos pueden parecer datos reales |
| seguridad | `27` y `31`–`38` | baseline general y Pack 09 no están señalados como “anterior/expansión” de forma suficiente |
| estado de implementación | `69`, `71`–`76`, reportes raíz | cada documento tiene base y fecha distintas; algunos recibieron notas parciales sin actualizar secciones internas |

## 9. Documentos o afirmaciones desactualizadas

1. `docs/69` declara estado through Phase 8, pero aún contiene “Payments/refunds BLOCKED — No provider, payment/refund records” y recomienda Phase 8 como próximo trabajo. `docs/76` y las migraciones prueban que la fundación de pago ya existe, aunque no esté aprobada para producción.
2. `docs/75` abre con nota de Phase 8 implementada, pero su matriz mantiene “Payments BLOCKED — No provider adapter, payment tables, endpoint or webhook”.
3. `docs/69`/`75` preceden `a9f2b15` y `d6c64d4`; describen Partner como shell, pero no registran el gate de autorización, callback PKCE, rutas y 40 pruebas actuales.
4. Los dos reportes raíz conservan “sin commit” aunque sus cambios ya están en commits e integrados.
5. `docs/08` propone un lifecycle Partner más granular que el enum real `partner_status`; no existe un mapping aprobado.
6. `docs/15` propone una navegación móvil diferente de `docs/63`; el código actual sigue un subconjunto de `docs/63`.
7. `docs/25` enumera como MVP tablas de ofertas, tareas, custodia, earnings, payouts y deliveries que no existen. El propio documento dice que es conceptual, pero esa advertencia debe preservarse en cualquier uso técnico.
8. `docs/65` propone tokens distintos de los valores CSS locales de Partner; no hay decisión registrada de cuál sistema visual es final.

## 10. Documentos que describen visión futura

Debe asumirse visión/especificación no implementada, salvo prueba contraria:

- la mayor parte de `docs/02`–`30`;
- Pack legal/policy `39`–`47` (varios son drafts/skeletons);
- runbooks `48`–`57`;
- arquitectura PWA y UX `58`–`68`;
- bloques Partner posteriores a `paid` en `13` y roadmap `75`.

En particular son futuros para Aliados: ofertas, aceptación/rechazo persistido, stock/reserva, recepción/custodia, preparación/checklists, evidencia, handoff, incidentes, equipo, catálogo autogestionado, earnings/payouts, instalación, push y offline.

## 11. Reglas recomendadas para consumir esta documentación

1. Citar siempre documento + sección + fecha/commit de evidencia cuando exista.
2. Usar una de estas etiquetas en trabajo Partner: `IMPLEMENTADO`, `PARCIALMENTE IMPLEMENTADO`, `ESPECIFICADO NO IMPLEMENTADO`, `DECISIÓN PENDIENTE`.
3. Tratar migraciones posteriores como contrato técnico vigente sin borrar la intención de docs; reportar diferencias.
4. No inferir implementación de un status “Complete” del índice.
5. No usar wireframes ni ejemplos como stock, dinero, pedidos, SLA o disponibilidad reales.
6. No crear tablas desde `docs/25` sin un diseño/migración aprobado para la fase concreta.
7. Mantener Central como autoridad de aprobación/roles/reglas globales y Aliados limitado a su operación autorizada.

## 12. Comandos de verificación documental

```text
rg --files docs -g '*.md' | sort
rg --files docs -g '*.md' | wc -l
git ls-files docs -z | xargs -0 shasum -a 256
rg -n '^#{1,3} ' docs/08_PARTNER_PROGRAM.md docs/10_USER_ROLES.md docs/12_PARTNER_JOURNEY.md
rg -n '^#{1,3} ' docs/23_TECH_STACK.md docs/24_SYSTEM_ARCHITECTURE.md docs/25_DATABASE_SCHEMA.md
rg -n '^#{1,3} ' docs/59_THREE_PWA_ECOSYSTEM_AND_ARCHITECTURE.md docs/63_PARTNER_PWA_UX_AND_SCREEN_SPEC.md docs/66_PWA_INSTALLATION_NOTIFICATIONS_OFFLINE_CACHE_AND_UPDATES.md
git log --oneline --decorate -15
```
