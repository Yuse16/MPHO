# Reporte final — MPHO Aliados Agentic Foundation 1.1

Fecha: 2026-07-21

Base auditada: `agent/opencode-partner-night` (`5ca06c1`)

Rama supervisora: `feat/partner-agentic-foundation`

## 1. Veredicto

**APROBADO PARA REVISIÓN HUMANA como base documental y técnica; NO APROBADO PARA PRODUCCIÓN ni para un piloto con pedidos reales.**

La misión produjo una base verificable para desarrollo asistido por agentes sin implementar funciones operativas de Partner. El revisor independiente emitió primero **APROBADO CON CORRECCIONES** por dos afirmaciones documentales demasiado amplias y por dependencias locales enlazadas a otro worktree. Las afirmaciones se corrigieron, las dependencias se materializaron localmente con lockfile congelado y los gates se repitieron desde la rama supervisora.

Los dos hallazgos de la revisión posterior quedaron corregidos en `feat/partner-agentic-foundation`: la suite Partner ahora termina de forma determinista sin aumentar timeouts y el proxy aplica autorización segura por defecto. Las tres ejecuciones completas requeridas pasaron con 8/8 archivos y 51/51 pruebas. El gate local Partner queda **verde y reproducible** para el alcance actual; los bloqueadores de producción documentados en seguridad, operación, legal, datos y PWA permanecen abiertos.

## 2. Objetivo

Preparar MPHO Aliados para desarrollo asistido por agentes mediante:

- un Project Overview verificable;
- inventarios técnico y documental;
- líneas base de calidad y seguridad;
- registro explícito de contradicciones y decisiones pendientes;
- ramas y worktrees aislados;
- consolidación controlada;
- auditoría independiente.

Quedaron fuera de alcance nuevas funciones operativas, nuevas reglas comerciales, código de producto, cambios SQL, migraciones, producción, deploy, push, pagos, precios y mensajes.

## 3. Rama supervisora

- Rama: `feat/partner-agentic-foundation`.
- Commit inicial: `5ca06c1`, igual a `agent/opencode-partner-night` al comenzar.
- `main` permaneció en `0fcf50a` y limpio.
- No se integró ningún cambio en `main`.

## 4. Ramas creadas

| Rama | Responsabilidad | Commit principal |
| --- | --- | --- |
| `agent/partner-docs-foundation` | Producto y documentación | `8f6c7d5`; corrección `0cf7cea` |
| `agent/partner-technical-inventory` | Frontend, backend, DB y documentación técnica | `1202b4f` |
| `agent/partner-quality-baseline` | QA | `b4a6750` |
| `agent/partner-security-baseline` | Seguridad | `8258e51` |

Todas partieron de `5ca06c1`, modificaron únicamente sus rutas autorizadas y quedaron limpias.

## 5. Worktrees creados

| Rama | Worktree |
| --- | --- |
| `agent/partner-docs-foundation` | `/Users/jorge/Desktop/MPHO-WT-PARTNER-DOCS` |
| `agent/partner-technical-inventory` | `/Users/jorge/Desktop/MPHO-WT-PARTNER-TECH` |
| `agent/partner-quality-baseline` | `/Users/jorge/Desktop/MPHO-WT-PARTNER-QA` |
| `agent/partner-security-baseline` | `/Users/jorge/Desktop/MPHO-WT-PARTNER-SECURITY` |

No se reutilizó un worktree previo ni se trabajó en `main`.

## 6. Agentes utilizados

- **A. Coordinador/supervisor:** inspección, aislamiento, asignación, revisión, consolidación y reporte final.
- **B. Producto y negocio + C. Documentación:** un agente secuencial en el worktree documental; primero auditó producto y después redactó.
- **D. Frontend + E. Backend + F. DB/Supabase + J. Documentación técnica:** un agente técnico de solo inventario en su worktree.
- **G. QA:** agente de calidad sin permiso para modificar pruebas.
- **H. Seguridad:** agente de auditoría sin permiso para modificar código o SQL.
- **I. Revisor independiente:** agente de solo lectura que no participó en la redacción inicial.

## 7. Estado inicial

- Rama supervisora limpia: `feat/partner-agentic-foundation`.
- Base: `5ca06c1` (`merge: sync partner with secured main`).
- `main`, el worktree Customer existente y los cuatro worktrees nuevos estaban limpios al auditarse.
- MPHO Aliados era una aplicación web responsive con password login, callback PKCE, proxy y gate de autorización Partner.
- Pedidos, detalle, paquetes, configuración, ganancias y perfil operativo no estaban conectados a contratos de negocio.
- No había manifest, iconos instalables, service worker, instalación, offline, push ni actualización PWA.
- Existían 8 archivos Vitest con 40 pruebas del shell, autenticación, autorización simulada, navegación y estados honestos antes de corregir los hallazgos. La suite actual contiene 51 pruebas.

## 8. Documentos creados

- `docs/partner/01_PROJECT_OVERVIEW.md`.

El documento incluye propósito, problema, ecosistema, relación Customer/Aliados/Central, usuarios, propuesta de valor, principios, estado actual, piloto propuesto, visión futura, fuera de alcance, decisiones pendientes, referencias y glosario solicitado.

No se crearon `02_PRODUCT_SCOPE.md`, `03_BUSINESS_RULES.md`, un nuevo `AGENTS.md` ni una arquitectura definitiva.

## 9. Reportes creados

- `reports/partner/documentation/PROJECT_OVERVIEW_VALIDATION.md`.
- `reports/partner/technical/CODEBASE_INVENTORY.md`.
- `reports/partner/technical/DOCUMENTATION_INVENTORY.md`.
- `reports/partner/technical/CONTRADICTIONS.md`.
- `reports/partner/quality/QUALITY_BASELINE.md`.
- `reports/partner/quality/TEST_COVERAGE_GAPS.md`.
- `reports/partner/security/SECURITY_BASELINE.md`.
- `reports/partner/security/PERMISSIONS_RISK_REGISTER.md`.
- `PARTNER_AGENTIC_FOUNDATION_1_1_REPORT.md`.

## 10. Contradicciones encontradas

1. MPHO Aliados está especificado como PWA, pero hoy sólo es web responsive.
2. Documentos antiguos atribuyen administración de personal/roles a Partner admin, mientras la decisión vigente reserva asignación de roles y acciones sensibles a Central.
3. El lifecycle documental de Partner no coincide con el enum SQL vigente.
4. Existen tres mapas de navegación Partner incompatibles o de diferente madurez.
5. Los tokens visuales especificados no coinciden completamente con el CSS local.
6. `docs/69` y `docs/75` mezclan afirmaciones anteriores y posteriores a Phase 8.
7. Los reportes raíz conservan metadata histórica de “sin commit”, aunque sus cambios ya fueron integrados.
8. Prototipos permiten datos ficticios etiquetados, pero operación real prohíbe presentarlos como hechos.
9. La preparación productiva no es sólo una decisión pendiente: existen controles ausentes y riesgos críticos abiertos.

No se eligió silenciosamente entre reglas incompatibles.

## 11. Decisiones pendientes

- Route map y navegación del piloto.
- Matriz exacta `partner_operator`/`partner_admin`, con privilegio mínimo por defecto.
- Frontera Central/Aliados para personal, roles, capacidades, pausas y datos maestros.
- Mapping o ampliación del lifecycle de estado Partner.
- Contrato post-`paid` para una sola asignación responsable, oferta y transiciones.
- Bootstrap y alcance editable de horarios/excepciones.
- Contratos de stock, reserva, evidencia, custodia y Storage.
- Comisiones, earnings, payout, SLA, cancelaciones, disputas y responsabilidades económicas.
- Permitir o prohibir múltiples Puntos activos por identidad.
- Permisos por acción para un Partner `paused`.
- Estrategia PWA/offline/push y dispositivos objetivo.
- Versiones soportadas de Node/pnpm.
- Decisiones legales, fiscales, contractuales, laborales, de privacidad y seguros.

## 12. Hallazgos técnicos

- Stack real: Next.js 16.2.6, React 19, TypeScript 5.7.3, Tailwind 4, Supabase SSR/JS, Vitest y Testing Library.
- Build actual: 13 rutas, incluyendo callback dinámico y detalle dinámico.
- Único endpoint Partner: `GET /callback`; no hay Server Actions ni APIs operativas.
- El gate de acceso consulta `profiles → user_roles → partners` y falla cerrado.
- La aplicación no usa `service_role`.
- La DB contiene tablas maestras Partner, capacidades, horarios, excepciones y capacidad; la app sólo consume las tres tablas del gate.
- No existe vínculo persistente `orders → Partner`, ofertas, tareas, custodia, evidencia, earnings o payouts.
- CI existe y está fijado por SHA, pero no se verificó un run remoto para esta rama porque no hubo push.

## 13. Hallazgos de calidad

- El shell pasa lint, typecheck y build.
- La suite contiene 51 pruebas en 8 archivos, sin reporte de cobertura.
- Los tests acreditan shell/auth/redirects/mocks, no operaciones Partner ni RLS integrado.
- Faltan pruebas de pedidos, estados, horarios end-to-end, cross-Partner operacional, errores backend, doble acción, sesión vencida, suspensión durante sesión, PWA, responsive completo y accesibilidad.
- La inestabilidad del test de login quedó corregida sin modificar el timeout: los módulos de página se cargan antes del periodo medido, cada test limpia DOM y mocks, y Vitest ejecuta los archivos jsdom sin competencia entre workers.

## 14. Hallazgos de seguridad

- No basta una sesión: el proxy exige perfil activo, rol Partner vigente/no revocado, `partner_id` y Partner `active|paused`.
- El navegador no puede autoasignarse roles, autoaprobar un Partner ni mutar capacidades maestras.
- Las tablas maestras cubiertas usan el helper de membresía endurecido y pruebas pgTAP históricas.
- Riesgo crítico `PSR-001`: políticas heredadas de catálogo no aplican de manera completa suspensión, `revoked_at` y estado Partner.
- Falta constraint de `partner_id` para roles Partner y una decisión/constraint sobre asignaciones activas múltiples.
- Falta una operación Central acotada, auditada y de mínimo privilegio; hoy sólo existe DML técnico con `service_role`.
- MFA, recovery, step-up, timeouts, rate limiting, headers, auditoría/alertas y evidencia de secretos por ambiente siguen ausentes o no verificados.
- La aplicación no está aprobada para producción.

## 15. Corrección de los hallazgos de revisión

### Hallazgo 1 — prueba inestable

**Causa raíz:** `apps/partner/tests/pages.test.tsx` hacía un `import()` dinámico dentro de cada `it`. En la primera prueba, Vitest contabilizaba dentro del timeout la transformación y evaluación inicial de la página de login y sus dependencias. Cuando los ocho archivos jsdom competían en paralelo por CPU, ese trabajo de inicialización ocasionalmente consumía los 5 segundos aunque el render y las aserciones fueran correctos. El aislamiento eliminaba la contención y explicaba por qué el test pasaba individualmente.

**Cambios realizados:** las páginas se importan al cargar el archivo de pruebas, fuera del periodo medido por cada caso; los tests de render son síncronos; `cleanup()` y `vi.clearAllMocks()` se ejecutan después de cada prueba; y `fileParallelism: false` evita competencia no determinista entre entornos jsdom. No se aumentó ningún timeout.

**Pruebas modificadas:** se preservaron las siete verificaciones de páginas. La prueba focalizada pasó en 245 ms para `pages.test.tsx`, y las tres suites completas mantuvieron ese archivo entre 247 y 275 ms.

### Hallazgo 2 — autorización segura por defecto

**Causa raíz:** `isProtectedRoute()` era una lista positiva de rutas conocidas. Toda ruta nueva, renombrada u olvidada devolvía `false` y el proxy la trataba como pública.

**Cambios realizados:** `isPublicRoute()` conserva una lista explícita de entradas públicas necesarias (`/`, `/login`, `/signup`, `/callback`, `/acceso`) y toda ruta restante queda protegida por defecto. Los destinos post-login siguen una lista separada para no convertir una ruta desconocida en una redirección aceptada. Recursos `/_next/*`, favicon, manifest, service worker e iconos tienen un bypass explícito; el matcher excluye todo `/_next/*`. Las rutas `/api` quedan protegidas por defecto y responden 401, 403 o 503 en vez de redirigir a HTML. Se conserva la validación de sesión, perfil, rol Partner vigente, asociación y estado Partner permitido.

**Pruebas agregadas o ampliadas:** clasificación pública de `/login`, `/callback` y `/acceso`; protección de `/inicio`, `/pedidos` y `/ruta-nueva-no-clasificada`; redirección de una ruta desconocida no autenticada; rechazo de Customer sin rol Partner; rechazo de Partner suspendido; respuesta API no autenticada; y bypass de un recurso interno de Next.js sin consultar sesión.

## 16. Validaciones ejecutadas

Desde `feat/partner-agentic-foundation`, después de corregir los hallazgos:

```text
git diff --check
pnpm --filter @mpho/partner lint
pnpm --filter @mpho/partner typecheck
pnpm --filter @mpho/partner test
pnpm --filter @mpho/partner test
pnpm --filter @mpho/partner test
pnpm --filter @mpho/partner build
```

También se ejecutó una prueba focalizada de `pages.test.tsx`, `routes.test.ts`, `proxy.test.ts` y `partner-access.test.ts`, con resultado PASS de 40/40, y se revisó que no hubiera cambios en Customer, Central, Supabase ni migraciones. Un revisor independiente, en modo de sólo lectura, volvió a ejecutar esos cuatro archivos y `git diff --check`: obtuvo 40/40 y no encontró hallazgos accionables.

## 17. Resultados exactos

| Validación | Resultado |
| --- | --- |
| `git diff --check` | PASS; salida vacía |
| lint | PASS; exit 0; ESLint sin errores |
| typecheck | PASS; exit 0; `tsc --noEmit` |
| test completo, ejecución 1 | PASS; 8/8 archivos, 51/51 pruebas; 14.80 s; `pages.test.tsx` 264 ms |
| test completo, ejecución 2 | PASS; 8/8 archivos, 51/51 pruebas; 13.96 s; `pages.test.tsx` 247 ms |
| test completo, ejecución 3 | PASS; 8/8 archivos, 51/51 pruebas; 14.26 s; `pages.test.tsx` 275 ms |
| build final | PASS; exit 0; compilación en 6.5 s; TypeScript en 4.9 s; 13/13 páginas |
| revisión independiente del diff | PASS; sin hallazgos accionables; prueba focalizada 40/40; `git diff --check` limpio |

La evidencia histórica previa a la corrección fue 38/40 y 39/40 en ejecuciones completas, con timeout de 5 segundos en el primer test que cargaba páginas. El test pasaba aislado. Esa diferencia permitió localizar la contención de carga de módulos dentro del periodo medido; no se alteró `testTimeout`.

## 18. Cambios rechazados

- No se aceptó ninguna modificación fuera de Partner y este reporte.
- No se aumentaron timeouts ni se eliminaron aserciones para ocultar la inestabilidad.
- No se implementaron endpoints operativos, pantallas operativas, SQL, RLS ni migraciones nuevas.
- No se resolvieron por inferencia reglas comerciales, comisiones, payouts, SLA, cancelaciones, disputas ni responsabilidades.

## 19. Riesgos pendientes

- Revocación incompleta en políticas heredadas de catálogo (`PSR-001`).
- Administración privilegiada sin una operación Central de negocio acotada.
- MFA, recovery, sesiones, rate limiting y controles de producción incompletos.
- Modelo post-`paid` y ownership de pedidos inexistentes.
- Matriz de permisos y estados no aprobada.
- `fileParallelism: false` prioriza estabilidad y aislamiento jsdom sobre velocidad; si la suite crece, convendrá separar pruebas Node/jsdom o perfilar workers antes de reactivar paralelismo.
- El listado explícito de recursos públicos debe revisarse cuando se agreguen nuevos activos raíz; una omisión fallará cerrada y puede impedir cargar el activo, no exponer una página privada.
- Sin RLS/pgTAP reejecutado en esta corrección.
- Sin E2E, dispositivos, instalación PWA, offline, push o accesibilidad completa.
- Sin evidencia de CI remoto, despliegue, sandbox productivo o aceptación legal/operativa.

## 20. Recomendación de revisión humana

Revisar y aprobar primero:

1. Project Overview y etiquetas de estado.
2. Contradicciones CT-01 a CT-05 y decisiones DP-01 a DP-12.
3. Riesgos PSR-001 a PSR-014.
4. Matriz de permisos y frontera Central/Aliados.
5. Contrato mínimo post-`paid` con un solo Punto MPHO responsable.
6. Alcance real del piloto.

El gate local Partner ya es reproducible en tres ejecuciones completas. Antes de producción o un piloto real, cerrar los bloqueadores de seguridad, orden, legal, operación y PWA aplicables con evidencia.

## 21. Confirmación de acciones no realizadas

- Push: **no realizado**.
- Merge a `main`: **no realizado**.
- Pull request: **no creado**.
- Deploy o cambio de Vercel: **no realizado**.
- Migración remota o `supabase db push`: **no realizado**.
- Cambio de producción: **no realizado**.
- Pago, refund, payout, precio o movimiento de dinero: **no realizado**.
- Mensaje externo o automatización remota: **no realizado**.
- Cambio de Customer o Central: **no realizado**.
- Cambio de Supabase, migraciones, variables, `package.json` o `pnpm-lock.yaml`: **no realizado**.
- Secretos añadidos: **ninguno identificado**.

Veredicto final de esta corrección: **HALLAZGOS 1 Y 2 CORREGIDOS; VALIDACIÓN LOCAL VERDE; SIN MERGE A `main`, SIN PUSH Y SIN DEPLOY.**
