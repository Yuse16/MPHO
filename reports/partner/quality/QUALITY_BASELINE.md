# Línea base de calidad — MPHO Aliados

Fecha de ejecución: 2026-07-21

Rama: `agent/partner-quality-baseline`

Commit base inspeccionado: `5ca06c19f70878cd89c3d1231c11d66d7932b9f5`

Aplicación: `apps/partner` (`@mpho/partner`)

## 1. Veredicto

**PASS técnico para el shell web responsive actual; cobertura insuficiente para afirmar que MPHO Aliados es operativo, una PWA instalable o está listo para producción.**

Los gates finales de lint, tipos, Vitest y build pasan. La suite de la aplicación contiene 40 casos en 8 archivos y prueba principalmente autenticación, autorización simulada, redirects, navegación y la presentación honesta de módulos todavía no conectados. No existen en `apps/partner` flujos operativos de pedidos, transiciones de estado, horarios, evidencia, doble acción o PWA que puedan quedar validados por esos 40 casos.

Por lo tanto, los resultados demuestran que el alcance implementado compila y que sus controles básicos se comportan como esperan las pruebas; **no demuestran los flujos Partner especificados en la documentación**.

## 2. Alcance y fuentes revisadas

Se inspeccionaron:

- `AGENTS.md`, `README.md`, `docs/00_DOCUMENTATION_INDEX.md` y `docs/01_PROJECT_OVERVIEW.md`.
- Documentación especializada de programa, roles, journey, ciclo de pedido, aplicación Partner, QA, UX Partner, responsive, PWA y handoff (`docs/08`, `10`, `12`, `13`, `15`, `29`, `63`, `65`, `66` y `68`).
- `CODEX_PARTNER_AUDIT_REPORT.md` y `CODEX_IDENTITY_SECURITY_REPORT.md`.
- Todo `apps/partner`, incluidos configuración, rutas, proxy, clientes Supabase, componentes, páginas y pruebas.
- Contratos de tipos generados y la migración/prueba pgTAP de endurecimiento de identidad Partner, sólo para comprender el contrato vigente.
- Historial reciente de Git y estado de la rama.

No se modificaron código, pruebas, migraciones, configuración, dependencias declaradas ni lockfiles. Este trabajo no ejecutó Supabase local, pruebas pgTAP, navegador E2E, análisis de cobertura, auditoría automatizada de accesibilidad ni pruebas en dispositivos.

## 3. Estado verificable actual

| Área | Evidencia actual | Conclusión permitida |
| --- | --- | --- |
| Compilación | `next build` finaliza y genera 13 rutas | El shell actual compila para producción |
| Tipos | `tsc --noEmit` termina con código 0 | El alcance TypeScript actual satisface el chequeo configurado |
| Lint | `eslint .` termina con código 0 | No se reportan errores de ESLint en la configuración actual |
| Tests de app | 8 archivos, 40/40 casos Vitest | Pasan los comportamientos concretos enumerados en la sección 5 |
| Autenticación | Tests de callback PKCE, sign-out y redirects | Existe cobertura automatizada parcial del shell de autenticación |
| Autorización | Tests simulados de `profiles → user_roles → partners` y fail-closed | Existe cobertura unitaria con mocks; no prueba integración real con Supabase/RLS |
| Datos operativos | Las páginas muestran “no disponible” y evitan ceros ficticios | La UI no presenta datos no consultados como reales |
| Pedidos/estados | No hay servicio, endpoint ni mutación operativa en Partner | No existe cobertura funcional que permita afirmar operación de pedidos |
| PWA | No hay manifest, iconos instalables ni service worker | Es una aplicación web responsive, no una PWA instalable completa |

## 4. Resultados exactos de validación

### 4.1 Preparación ambiental

Los enlaces iniciales de `node_modules` apuntaban a otro worktree. Esto produjo dos fallos ambientales antes de poder obtener los resultados finales:

1. Primer `pnpm --filter @mpho/partner lint`: **FAIL, exit 1 antes de ESLint**.

```text
Scope: all 12 workspace projects
[ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY] Aborted removal of modules directory due to no TTY

If you are running pnpm in CI, set the CI environment variable to "true", or set "confirmModulesPurge" to "false".
```

2. Primer `pnpm --filter @mpho/partner build`: **FAIL, exit 1 por symlink externo de dependencias**.

```text
$ next build
▲ Next.js 16.2.6 (Turbopack)

  Creating an optimized production build ...
FATAL: An unexpected Turbopack error occurred.
Error [TurbopackInternalError]: Symlink [project]/apps/partner/node_modules is invalid, it points out of the filesystem root
[ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL] @mpho/partner@0.1.0 build: `next build`
Exit status 1
```

Se eliminaron únicamente los dos symlinks ignorados y se materializaron dependencias dentro del worktree mediante `CI=true pnpm install --offline --frozen-lockfile`. El comando terminó con exit 0, reutilizó 691 paquetes y no cambió `package.json` ni `pnpm-lock.yaml`. Después se repitieron los gates literales.

### 4.2 `pnpm --filter @mpho/partner lint`

Resultado final: **PASS, exit 0**.

```text
Scope: all 12 workspace projects
✓ Lockfile passes supply-chain policies (verified 4d ago)
Lockfile is up to date, resolution step is skipped
Already up to date

Done in 4.6s using pnpm v11.10.0
$ eslint .
```

ESLint no emitió errores ni advertencias.

### 4.3 `pnpm --filter @mpho/partner typecheck`

Resultado: **PASS, exit 0**.

```text
$ tsc --noEmit
```

### 4.4 `pnpm --filter @mpho/partner test`

Resultado: **PASS, exit 0**.

```text
$ vitest run --passWithNoTests

 RUN  v3.2.7 /Users/jorge/Desktop/MPHO-WT-PARTNER-QA/apps/partner

 ✓ tests/auth-context.test.tsx (2 tests)
 ✓ tests/pages.test.tsx (7 tests)
 ✓ tests/navigation.test.tsx (3 tests)
 ✓ tests/callback.test.ts (4 tests)
 ✓ tests/routes.test.ts (13 tests)
 ✓ tests/proxy.test.ts (6 tests)
 ✓ tests/partner-access.test.ts (3 tests)
 ✓ tests/config.test.ts (2 tests)

 Test Files  8 passed (8)
      Tests  40 passed (40)
   Start at  21:48:09
   Duration  36.42s (transform 711ms, setup 4.93s, collect 7.75s, tests 8.32s, environment 45.30s, prepare 5.14s)
```

No hay umbral ni reporte de cobertura de líneas, ramas o funciones configurado en `vitest.config.ts` o en el script `test`.

### 4.5 `pnpm --filter @mpho/partner build`

Resultado final después de corregir el entorno: **PASS, exit 0**.

```text
$ next build
▲ Next.js 16.2.6 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 94s
  Running TypeScript ...
  Finished TypeScript in 49s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/13) ...
✓ Generating static pages using 3 workers (13/13) in 6.5s
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /acceso
├ ƒ /callback
├ ○ /configuracion
├ ○ /ganancias
├ ○ /inicio
├ ○ /login
├ ○ /paquetes
├ ○ /pedidos
├ ƒ /pedidos/[id]
├ ○ /perfil
└ ○ /signup

ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

### 4.6 `git diff --check`

Resultado: **PASS, exit 0, salida vacía**.

Un PASS significa únicamente ausencia de errores de whitespace en el diff; no valida contenido ni cobertura.

## 5. Inventario de pruebas de `apps/partner`

| Archivo | Casos | Cobertura real |
| --- | ---: | --- |
| `tests/auth-context.test.tsx` | 2 | Sign-out confirmado y error del proveedor sin borrar la sesión local |
| `tests/callback.test.ts` | 4 | Intercambio PKCE simulado, redirect protegido, redirect inseguro y error público fijo |
| `tests/config.test.ts` | 2 | URL/anon key públicas y fallo explícito por configuración incompleta |
| `tests/navigation.test.tsx` | 3 | Links móvil, estado activo, acción explícita de sign-out y header sin control inerte |
| `tests/pages.test.tsx` | 7 | Render de login, invitación, inicio, pedidos, ganancias, paquetes y configuración; ausencia selectiva de métricas ficticias |
| `tests/partner-access.test.ts` | 3 | Lookup de autorización totalmente simulado: autorizado, sin rol y error de consulta |
| `tests/proxy.test.ts` | 6 | Redirect sin sesión, cuenta sin autorización, ruta permitida, redirect seguro, prevención de loop y fail-closed por error |
| `tests/routes.test.ts` | 13 | Clasificación de rutas y sanitización de redirects mediante casos parametrizados |
| **Total** | **40** | **Shell/autenticación/autorización simulada; no operación Partner** |

### Evidencia relacionada fuera del gate de la aplicación

`supabase/tests/identity_partner_privilege_hardening.test.sql` declara 83 aserciones pgTAP. Por inspección estática contiene pruebas de:

- aislamiento entre Partner A y Partner B para master data, capacidades, horarios, excepciones y capacidad;
- columnas de horario que puede actualizar Partner admin;
- denegación de cambios de horario a Partner operator;
- perfil suspendido sin lectura Partner;
- grants y helpers de membresía.

Esa suite **no fue ejecutada por** `pnpm --filter @mpho/partner test` ni se ejecutó por separado en esta tarea. `CODEX_IDENTITY_SECURITY_REPORT.md` registra un PASS histórico del 2026-07-18, pero ese reporte no demuestra el estado de ejecución actual. Por ello se clasifica como **cobertura existente no revalidada en este baseline**, no como PASS actual.

Además, `CODEX_PARTNER_AUDIT_REPORT.md` describía un riesgo histórico de columnas de `profiles`; la migración posterior `20260718111400_identity_partner_privilege_hardening.sql` y el reporte de identidad documentan su corrección. La línea base usa el estado actual del repositorio y no perpetúa ese hallazgo como vigente sin nueva evidencia.

## 6. Claims permitidos y no permitidos

| Claim | Estado | Motivo |
| --- | --- | --- |
| “El shell actual pasa lint, typecheck, 40 tests y build” | Permitido | Evidencia ejecutada en este worktree |
| “Una cuenta autenticada sin asignación Partner se redirige a acceso denegado” | Permitido con alcance unitario | Proxy y lookup usan mocks; no prueba un proyecto Supabase real |
| “La interfaz evita mostrar cero o vacío como datos operativos consultados” | Permitido para las páginas cubiertas | Tests de render verifican mensajes explícitos y ausencia selectiva de `$0` |
| “El aislamiento RLS Partner está probado por el test de la app” | No permitido | Vitest no ejecuta RLS ni Supabase real |
| “Los pedidos y estados Partner funcionan” | No permitido | No existen contratos operativos conectados ni tests del flujo |
| “Los horarios funcionan end-to-end” | No permitido | Sólo hay contrato SQL relacionado; la UI declara configuración no disponible |
| “La app tolera doble acción” | No permitido | No hay mutación Partner ni test de concurrencia/idempotencia |
| “La sesión vencida se recupera correctamente” | No permitido | Se cubre ausencia genérica/error, no expiración y reanudación del trabajo |
| “Un Partner suspendido queda cubierto en todas las capas” | No permitido | Hay prueba SQL no reejecutada y código no cubierto por caso explícito en Vitest |
| “MPHO Aliados es una PWA instalable” | No permitido | Faltan manifest, iconos, service worker, instalación, update y offline |
| “Responsive y accesibilidad están aprobados” | No permitido | No se ejecutaron matrices de viewport, dispositivos, axe, teclado o lector de pantalla |

## 7. Riesgos principales

1. **Cobertura verde sobre un alcance pequeño.** Los 40 casos pueden interpretarse erróneamente como validación del producto Partner, aunque sólo validan el shell y estados informativos.
2. **Ausencia de integración operativa.** No hay pedidos, cambios de estado, horarios conectados, evidencia, earnings ni acciones idempotentes que probar.
3. **Capas de seguridad separadas.** Los mocks de Vitest no demuestran RLS; pgTAP no forma parte del gate de la app y no fue reejecutado aquí.
4. **Sin métrica de cobertura.** No se conoce cobertura de líneas/ramas y un archivo verde no implica que todos sus caminos estén ejercitados.
5. **Sin E2E ni dispositivos.** Build y jsdom no prueban sesión real, navegador, responsive, cámara, offline, instalación o accesibilidad real.
6. **Evidencia ambiental.** Los symlinks compartidos causaron falsos fallos iniciales; los gates requieren dependencias materializadas dentro del worktree para ser reproducibles con Turbopack.

## 8. Condición para elevar el veredicto

El baseline sólo debe elevarse cuando existan los contratos operativos aprobados y se implementen las pruebas priorizadas en `TEST_COVERAGE_GAPS.md`, incluyendo integración real de autorización/RLS, transiciones idempotentes, E2E del piloto, PWA en dispositivos objetivo, responsive y accesibilidad manual/automatizada.
