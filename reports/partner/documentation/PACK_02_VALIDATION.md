# MPHO Aliados — Pack 02 Validation

## 1. Veredicto

**APROBADO PARA REVISIÓN DOCUMENTAL EN RAMA; NO APROBADO PARA PRODUCCIÓN.**

El paquete define el alcance de MPHO Aliados y 32 reglas de negocio trazables sin convertir arquitectura objetivo, propuestas o decisiones pendientes en funcionalidad real. Las validaciones técnicas obligatorias pasaron y el revisor independiente emitió veredicto final **APROBADO**.

## 2. Objetivo

Crear el segundo paquete documental de MPHO Aliados:

- `docs/partner/02_PRODUCT_SCOPE.md`;
- `docs/partner/03_BUSINESS_RULES.md`;
- `reports/partner/documentation/PACK_02_VALIDATION.md`.

No se modificaron código, pruebas, SQL, migraciones, paquetes, configuración, precios, secretos ni datos productivos.

## 3. Rama utilizada

- Rama: `docs/partner-scope-business-rules`.
- Worktree: `/Users/jorge/Desktop/MPHO-OPENCODE`.
- Base auditada: `95467b898960df3bc2fb22d75859750ff461a9d0`.
- `main` observado al inicio: `0fcf50a30dcf23160823691eecd32b7461c87e89`.

La rama indicada por el objetivo ya estaba activa y el trabajo se mantuvo exclusivamente en ella.

## 4. Estado inicial

Al comenzar:

- `git branch --show-current` devolvió `docs/partner-scope-business-rules`;
- el worktree estaba limpio;
- `HEAD` era `95467b8` (`feat(partner): establish agentic foundation and harden access`);
- no existía una rama remota `origin/docs/partner-scope-business-rules`;
- no había cambios que preservar ni integrar desde otra rama.

## 5. AGENTS.md leídos

Se buscó `AGENTS.md` desde el worktree y se encontró únicamente el archivo raíz. El coordinador y cada agente especializado usado en el paquete lo leyeron completo antes de actuar. También se leyeron `README.md`, el índice, el overview global, el overview Partner y los documentos especializados aplicables.

No se modificó `AGENTS.md`.

## 6. Inventario de Markdown revisado

Antes de redactar se ejecutó `git ls-files '*.md'`: el inventario inicial contenía **91 archivos Markdown versionados**. Después de los dos primeros documentos del paquete, el repositorio contiene 93; el presente informe será el número 94 al quedar versionado.

Clasificación aplicada a los documentos relacionados con Aliados:

| Clasificación | Criterio y ejemplos |
| --- | --- |
| Vigentes | `AGENTS.md`, decisiones aprobadas del brief de Pack 02, `docs/partner/01_PROJECT_OVERVIEW.md` y reglas globales aplicables de seguridad, dinero, privacidad y operación. |
| Parcialmente vigentes | `README.md`, `docs/01_PROJECT_OVERVIEW.md`, `docs/05_SCOPE_AND_NON_GOALS.md`, `docs/08_PARTNER_PROGRAM.md`, `docs/10_USER_ROLES.md`, `docs/12_PARTNER_JOURNEY.md` y `docs/15_PARTNER_APP.md`; mezclan principios vigentes, diseño pendiente y afirmaciones anteriores al código actual. |
| Arquitectura objetivo | `docs/23` a `docs/30`, `docs/48` a `docs/68`, en especial `docs/59`, `docs/63`, `docs/65`, `docs/66`, `docs/67` y `docs/68`. No acreditan implementación. |
| Históricos | `docs/69`, `docs/71` a `docs/76`, reportes `CODEX_*`, reportes de fundación Partner y evidencia fechada. Se usan como evidencia temporal, no como estado actual por sí solos. |
| Duplicados conceptuales | Clústeres de Partner end-to-end (`docs/08`, `docs/12`, `docs/15`, `docs/48` a `docs/57`, `docs/63`, `docs/67`), roles/seguridad, PWA, piloto e implementación. |
| Contradictorios | Gestión de roles por Central frente a Partner admin; lifecycle Partner documental frente al enum; edición de capacidad UX frente a SQL; precio sugerido frente a autoridad no aprobada; PWA objetivo frente a web responsive actual. |
| Pendientes de validación técnica | Operación post-`paid`, RLS transversal, PWA, controles productivos, integraciones, evidencia, entrega, ledger, earnings y payouts. |

## 7. Documentos vigentes utilizados

Fuentes principales y de control:

- `AGENTS.md` y el brief aprobado de Pack 02;
- `README.md`;
- `docs/00_DOCUMENTATION_INDEX.md`;
- `docs/01_PROJECT_OVERVIEW.md`;
- `docs/partner/01_PROJECT_OVERVIEW.md`;
- `PARTNER_AGENTIC_FOUNDATION_1_1_REPORT.md`;
- inventarios, contradicciones, baseline y riesgos bajo `reports/partner/**`;
- especificaciones de roles, pedidos, catálogo, pagos, seguridad, legal, operación, PWA y responsive aplicables;
- código, migraciones, pgTAP, Vitest y CI únicamente para comprobar el estado real.

La autoridad se aplicó así: instrucciones y decisiones aprobadas definen el producto; código y pruebas acreditan únicamente lo implementado; documentos objetivo no sustituyen evidencia ejecutable.

## 8. Documentos históricos o contradictorios

Se conservaron, sin resolver por inferencia, estas diferencias relevantes:

- Algunos reportes históricos mencionan 40 pruebas Partner y `PSR-007` abierto; el `HEAD` auditado contiene 51 pruebas y protección deny-by-default.
- Documentos objetivo describen una PWA completa; el producto actual es una web responsive sin evidencia de instalación, service worker, actualización, caché u offline.
- `docs/08_PARTNER_PROGRAM.md` describe estados Partner más granulares que el enum vigente.
- `docs/10_USER_ROLES.md`, `docs/15_PARTNER_APP.md` y `docs/63_PARTNER_PWA_UX_AND_SCREEN_SPEC.md` atribuyen gestión de personal o roles a Partner admin, mientras Pack 02 reserva roles a Central.
- Documentos UX permiten editar capacidad, pero SQL vigente niega mutación directa de `partner_capacity`.
- Documentos de catálogo sugieren campos de precio sin permiso aprobado para cambiar precio final.
- `docs/13_ORDER_LIFECYCLE.md` especifica operación posterior a `paid`; la implementación real termina en `paid`.
- Políticas heredadas de catálogo/media no aplican por completo el predicado endurecido de revocación (`PSR-001`).

## 9. Agentes o roles utilizados

| Rol | Agente real | Participación |
| --- | --- | --- |
| Coordinador | `/root` | Rama, inventario, fuentes, plan, consolidación, correcciones, validaciones, commits y publicación. |
| Producto | `/root/pack02_product` | Redacción inicial de Product Scope; separó actual, piloto, MVP y futuro. |
| Negocio | `/root/pack02_business` | Redacción inicial de 32 reglas y matrices. |
| Técnico y Seguridad | `/root/pack02_technical_security` | Auditoría solo lectura de código, migraciones, RLS, auth, riesgos y borradores. |
| QA de negocio | `/root/pack02_qa_business` | Auditoría de testabilidad, consecuencias, estados, campos y coherencia cruzada. |
| Revisor independiente | `/root/pack02_independent_reviewer` | Agente nuevo, sin participación en la redacción inicial; revisó el diff terminado, solicitó correcciones y emitió veredicto final. |

Se usaron agentes reales. Producto y Negocio editaron archivos distintos; Técnico/Seguridad y QA trabajaron en solo lectura.

## 10. Ramas auxiliares creadas

Ninguna. No se necesitaban: los autores modificaron archivos distintos y las demás revisiones fueron de solo lectura.

## 11. Worktrees creados

Ninguno. Se usó únicamente el worktree ya existente `/Users/jorge/Desktop/MPHO-OPENCODE`.

## 12. Documentos creados

- `docs/partner/02_PRODUCT_SCOPE.md`.
- `docs/partner/03_BUSINESS_RULES.md`.
- `reports/partner/documentation/PACK_02_VALIDATION.md`.

No se modificó ningún archivo preexistente.

## 13. Decisiones confirmadas

Se documentaron como confirmadas las decisiones explícitas del brief:

- Central gobierna ecosistema, roles, activación, suspensión, reglas globales y decisiones sensibles.
- Aliados limita su autoridad a la operación expresamente autorizada del Partner propio.
- Autenticación no equivale a autorización Partner.
- El acceso exige sesión, perfil activo, rol vigente, `partner_id`, Partner permitido y permiso de acción.
- El usuario nuevo inicia con el privilegio más restrictivo.
- El aislamiento se define por `partner_id` y debe reforzarse en servidor/RLS.
- El producto actual es web responsive y no una PWA instalable acreditada.
- Están prohibidos datos, métricas, ganancias, disponibilidad y éxitos ficticios.
- El alcance de piloto permanece rotulado exactamente como propuesta pendiente de aprobación definitiva.
- Las fórmulas, importes, SLA, responsabilidades, proveedores y reglas comerciales enumeradas por el brief siguen pendientes.

## 14. Reglas propuestas

`docs/partner/03_BUSINESS_RULES.md` contiene 32 reglas estables `BR-PARTNER-001` a `BR-PARTNER-032`:

| Estado | Cantidad |
| --- | ---: |
| CONFIRMADA | 7 |
| PROPUESTA | 1 |
| PARCIALMENTE IMPLEMENTADA | 9 |
| NO IMPLEMENTADA | 11 |
| DECISIÓN PENDIENTE | 3 |
| CONTRADICCIÓN DETECTADA | 1 |

Las 32 reglas contienen los 16 campos obligatorios y una fila de trazabilidad a fuentes, implementación y pruebas. `PROPUESTA` se usa únicamente para la gestión de horario regular incluida en el piloto propuesto; no se presenta como aprobación comercial.

## 15. Decisiones pendientes

Product Scope registra 26 decisiones canónicas `PS-DP-*`; Business Rules contiene 19 referencias locales `DP-BR-*` con crosswalk explícito. Las referencias locales no constituyen decisiones independientes y deben cambiar o cerrarse junto con sus IDs canónicos.

Los grupos principales son:

- tipos Partner, roles internos, personal y contexto multi-Partner;
- invariante rol Partner→`partner_id`, unicidad y selección de contexto;
- estado `paused`, lifecycle, asignación, oferta y transiciones post-`paid`;
- horarios, timezone, excepciones, capacidad y direcciones propias;
- catálogo, stock, variantes, precios y disponibilidad;
- evidencia, paquetes, custodia, preparación y calidad;
- delivery, proveedor, fallos, responsabilidades y evidencias;
- cancelaciones, refunds, disputas y compensaciones;
- comisiones, earnings, saldos, liquidaciones y payouts;
- SLA, deadlines, notificaciones, métricas y consecuencias;
- PWA, offline, push, dispositivos y host canónico;
- gates de seguridad, legal, operación y producción.

## 16. Contradicciones encontradas

Se registraron sin elegir silenciosamente una versión:

1. Roles reservados a Central frente a documentos que permiten gestionarlos desde Aliados.
2. Lifecycle Partner documental frente al enum SQL vigente.
3. Capacidad editable en UX frente a mutación directa denegada en SQL.
4. Precio sugerido/editable frente a ausencia de autoridad aprobada sobre precio final.
5. Partner `paused` admitido por el shell/RLS sin matriz de acciones operativas.
6. Lifecycle post-`paid` especificado frente a implementación detenida en `paid`.
7. Revocación incompleta en políticas heredadas de catálogo/media (`PSR-001`).
8. Inserción PostgREST de direcciones propias técnicamente permitida sin contrato de producto ni pruebas A/B específicas.

## 17. Afirmaciones verificadas contra código

Se comprobaron directamente:

- aplicación Next.js Partner separada y responsive;
- rutas, navegación y estados honestos sin datos operativos ficticios;
- login por contraseña, callback PKCE, renovación SSR y logout confirmado;
- rutas públicas explícitas, protección por defecto, bypass interno y semántica API;
- gate Partner por perfil, rol, `partner_id` y estado;
- 51 pruebas Vitest en 8 archivos;
- grants/RLS y pgTAP para tablas maestras Partner cubiertas;
- falta de casos pgTAP específicos para direcciones y zonas;
- mutación PostgREST acotada de horarios y `INSERT` de dirección propia para Partner admin;
- `user_roles.partner_id` nullable, ausencia de invariante/unicidad activa y selección ambigua de contexto;
- riesgo pendiente de host canónico en redirects absolutos;
- riesgo transversal `PSR-001` en catálogo/media;
- ausencia de asignación Partner, ofertas, tareas, custodia, evidencia privada, delivery, earnings y payouts;
- estado de pedidos implementado sólo hasta `paid`.

## 18. Afirmaciones que no pudieron verificarse

No se acreditaron como implementados:

- origen o despliegue productivo de Aliados;
- MFA, recuperación, step-up y controles de cuenta productivos;
- aislamiento de todos los futuros recursos Partner;
- pedidos asignados, aceptación/rechazo y transiciones operativas;
- inventario, reservas, preparación, evidencia, custodia y delivery;
- notificaciones, soporte, incidentes, ledger, earnings y payouts;
- PWA instalable, offline, actualización, push y dispositivos objetivo;
- servicios Central de negocio con mínimo privilegio y auditoría completa;
- reglas comerciales, legales, financieras u operativas aún pendientes;
- readiness o autorización para producción o piloto con pedidos reales.

## 19. Validaciones ejecutadas

| Comando | Resultado exacto |
| --- | --- |
| `git diff --check` | PASS, exit 0, sin salida. |
| `pnpm --filter @mpho/partner lint` | PASS, exit 0; `eslint .`. |
| `pnpm --filter @mpho/partner typecheck` | PASS, exit 0; `tsc --noEmit`. |
| `pnpm --filter @mpho/partner test` | PASS, exit 0; 8/8 archivos y 51/51 pruebas, duración Vitest 16.30 s. |
| `pnpm --filter @mpho/partner build` | PASS, exit 0; Next.js 16.2.6, compilación 6.9 s, TypeScript 5.4 s, 13 rutas generadas/registradas. |

Controles documentales adicionales:

- 20/20 secciones obligatorias en Product Scope.
- 20/20 secciones obligatorias en Business Rules.
- 32 IDs únicos y 32/32 reglas con 16 campos.
- Sólo estados permitidos en las fichas de reglas.
- Referencias versionadas comprobadas.
- Búsqueda de secretos conocidos: sin coincidencias.
- QA de negocio: aprobado después de corregir cuatro ambigüedades.
- Revisión técnica/seguridad: seis hallazgos y dos residuales de redacción corregidos.
- Revisión independiente: aprobada después de corregir referencias, canonicidad/crosswalk, convención de prioridad, nombre de base auditada y completitud de la matriz.

## 20. Commits creados

| Hash | Commit |
| --- | --- |
| `12c89fe` | `docs(partner): define product scope` |
| `37fcbd7` | `docs(partner): establish business rules` |
| Pendiente | `docs(partner): audit documentation pack 02` |

El hash del commit que contiene este propio informe no puede registrarse dentro de su contenido sin alterar ese hash; se incluirá en la entrega final.

## 21. Push realizado

Después del veredicto independiente se ejecutó:

```text
git push -u origin docs/partner-scope-business-rules
```

Resultado: PASS, se creó `origin/docs/partner-scope-business-rules`, se configuró upstream y el remoto avanzó inicialmente hasta `37fcbd7`. El commit final de correcciones e informe se sincroniza con un segundo push normal de la misma rama; su hash y la verificación remota final se consignan en la entrega. No se usó force push ni se publicó `main`.

## 22. Riesgos pendientes

Persisten, entre otros:

- `PSR-001`: revocación transversal incompleta en catálogo/media.
- Invariante de esquema y selección determinista para asignaciones Partner activas.
- Semántica operativa de Partner `paused`.
- Superficies PostgREST de horarios/direcciones sin servicio de negocio completo.
- MFA, recuperación, step-up, host canónico, headers/cache, rate limits, auditoría y alertas productivas.
- Contratos y RLS de pedidos, tareas, evidencia, entrega y finanzas todavía inexistentes.
- Servicios Central específicos, auditados y de mínimo privilegio pendientes.
- Decisiones legales, financieras, operativas y de piloto aún no aprobadas.

Ninguno de estos riesgos se oculta mediante una afirmación de implementación o readiness.

## 23. Recomendación del revisor independiente

El agente `/root/pack02_independent_reviewer`, que no participó en la redacción inicial, revisó en solo lectura los dos documentos y este informe. Su primera revisión fue **APROBADO CON CORRECCIONES** y detectó:

1. dos referencias de archivo incorrectas en el inventario;
2. decisiones `DP-BR-*` sin canonicidad/crosswalk explícito;
3. prioridades P0/P1 sin convención ni rótulo de propuesta QA/riesgo;
4. uso de `HEAD 95467b8` para una base técnica histórica;
5. durante la reverificación, una fila faltante de `BR-PARTNER-008` y falta de decisión canónica específica para acciones de Partner `paused`.

Tras las correcciones, verificó:

- referencias existentes;
- `PS-DP-*` como registro canónico y 19 referencias locales con crosswalk válido;
- 26 decisiones canónicas únicas;
- P0/P1 definido como propuesta QA/riesgo no comercial;
- 32 reglas y 32 filas únicas `BR-PARTNER-001` a `032`;
- `git diff --check` limpio;
- alcance limitado a los tres archivos autorizados.

**Veredicto final independiente: APROBADO, sin hallazgos pendientes.**

## 24. Confirmación de que no hubo merge a main, deploy ni cambios de producción

Confirmado hasta este punto:

- no hubo merge a `main`;
- no hubo push a `main`;
- no hubo Pull Request automático;
- no hubo deploy;
- no se modificó producción;
- no se aplicaron migraciones remotas;
- no se cambiaron secretos, precios ni configuración;
- no se ejecutaron pagos ni se enviaron mensajes;
- no se borraron ramas, no hubo force push y no se reescribió historial compartido.

La única operación remota ejecutada fue publicar y sincronizar la rama documental autorizada. El segundo push normal incorpora el commit final del informe; no amplía el alcance ni modifica producción.
