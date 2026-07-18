# Auditoría independiente — MPHO Partner

Fecha: 2026-07-18

Rama auditada: `agent/opencode-partner-night`

Commit auditado: `a9f2b15 feat(partner): build initial partner operational PWA`

## 1. Veredicto

**APROBADO CON CORRECCIONES.**

El commit `a9f2b15` no debe enviarse o integrarse sin incluir las correcciones no
confirmadas que constan en el árbol de trabajo. Con esas correcciones, el alcance
queda aceptable como un shell web responsive y protegido de MPHO Aliados. No se
considera una PWA instalable ni una aplicación operativa completa, y no está
aprobada para producción bajo esas denominaciones.

No se realizó commit, push, PR ni deploy.

## 2. Hallazgos críticos

### Corregidos

1. **Cualquier usuario autenticado podía entrar a las rutas Partner.** El proxy
   sólo comprobaba la sesión y no el rol ni la asignación. Ahora valida en el
   servidor un perfil activo, un rol vigente `partner_operator` o
   `partner_admin`, un `partner_id` no nulo y un Punto con estado `active` o
   `paused`. Si no puede comprobarlo, falla cerrado y redirige a `/acceso`.
2. **El callback de autenticación no completaba PKCE.** La página cliente usaba
   `getSession()` pero no intercambiaba el código. Se sustituyó por un Route
   Handler que ejecuta `exchangeCodeForSession`, sanitiza `redirect` y devuelve
   un error público fijo sin filtrar detalles.
3. **El alta pública se presentaba como registro de socio aunque el trigger real
   crea una identidad de cliente.** Se eliminó el formulario de auto-registro de
   Partner y `/signup` explica de forma honesta el proceso por invitación y
   asignación administrativa.

### Pendientes fuera del alcance permitido

No quedan defectos críticos dentro de `apps/partner`. La autorización depende de
que las políticas y asignaciones de Supabase mantengan su contrato; esta
auditoría no modificó RLS ni migraciones por prohibición expresa.

## 3. Hallazgos importantes

### Corregidos

- `redirect` aceptaba rutas públicas como `/login` y `/signup`, lo que podía
  producir ciclos. Ahora sólo admite destinos protegidos conocidos y rechaza
  URLs externas, protocol-relative, normalizaciones hacia rutas públicas y rutas
  desconocidas.
- El layout protegido montaba un segundo `AuthProvider`; se eliminó la
  suscripción duplicada y se conserva un único provider raíz.
- Cifras como `0`, `$0`, “sin pedidos”, “sin paquetes”, “sin ganancias” y estados
  del Punto se presentaban sin consultas reales. Se sustituyeron por estados de
  “información no disponible” que explican que no se consultó una fuente
  autorizada.
- Los filtros visuales de Pedidos y Paquetes no tenían acción; se retiraron.
- “Más” en la navegación móvil cerraba sesión en vez de navegar a `/perfil`;
  ahora es un enlace real y su estado activo depende de `usePathname()`.
- El icono de menú móvil no tenía acción; se reemplazó por un enlace de marca a
  `/inicio` sin añadir un menú ficticio.
- El cierre de sesión ignoraba errores de Supabase y borraba estado local de
  todas formas. Ahora sólo redirige tras confirmación del proveedor y muestra un
  error genérico si falla.
- Faltaban tokens CSS y la clase visual `glass` utilizada por toda la interfaz;
  se definieron sin rediseñar la identidad existente.
- `/pedidos/[id]` ya no afirma “no encontrado” sin haber consultado datos; declara
  que el detalle operativo no está disponible.

### Pendientes

1. **No es una PWA instalable.** No hay manifest, iconos de instalación, service
   worker, estrategia de actualización u offline. Añadir esa arquitectura quedó
   expresamente fuera de esta auditoría.
2. **No existen contratos conectados para pedidos, paquetes, custodia, ganancias,
   pagos o configuración operativa en esta versión.** La interfaz queda
   deliberadamente informativa y no presenta esos módulos como funcionales.
3. **Riesgo de esquema a resolver antes de producción:** la política existente
   `profiles_update_own` concede actualización de la fila propia y el GRANT es de
   tabla, mientras el comentario indica que las columnas se limitarían por API.
   No se observó una restricción SQL de columna que impida al usuario cambiar
   `profiles.status` o `default_role`. Esto no permite crear un `user_roles`
   Partner, que sigue bajo política administrativa, pero puede debilitar una
   suspensión basada exclusivamente en `profiles.status`. Debe corregirse y
   probarse en una fase autorizada de RLS; no se tocó en esta auditoría.

## 4. Hallazgos menores

- Algunos textos heredados de navegación omiten tildes (`Configuracion`,
  `Navegacion`). No afecta rutas, permisos, teclado ni comprensión funcional y
  no se cambió por no ser un defecto importante.
- El acceso inicial desde `/` realiza un paso adicional por `/login` antes de que
  el proxy envíe a un Partner ya autorizado a `/inicio`. No produce un ciclo y
  no expone información.

## 5. Estado real de autenticación

- Supabase Auth se usa mediante `@supabase/ssr` con URL pública y anon key.
- No existe service role en `apps/partner` ni se encontró un secreto incluido en
  componentes cliente.
- Las rutas protegidas conservan el path y query en el redirect a `/login`.
- El callback intercambia el código PKCE en servidor.
- La configuración incompleta falla cerrada en rutas protegidas y muestra un
  error público genérico.
- El cierre de sesión se confirma con Supabase antes de limpiar estado y navegar.

## 6. Estado real de autorización Partner

La decisión se toma en el proxy del servidor con el siguiente contrato:

1. `auth.getUser()` confirma una sesión válida.
2. `profiles.auth_user_id` debe corresponder al usuario y `profiles.status` debe
   ser `active`.
3. Debe existir un `user_roles` con estado `active`, `revoked_at IS NULL`, rol
   `partner_operator` o `partner_admin` y `partner_id` asignado.
4. El registro `partners` asignado debe estar `active` o `paused`.

Una cuenta autenticada sin autorización Partner es enviada a `/acceso`. Un error
al leer la autorización nunca concede acceso. Las consultas se hacen con la
sesión del usuario y RLS; no se usa una clave elevada.

## 7. Estado real de los datos

- `/inicio`: no muestra métricas, conteos, ventas ni tareas supuestas.
- `/pedidos` y `/pedidos/[id]`: no afirman que la cola esté vacía ni exponen un
  pedido sin fuente real.
- `/paquetes`: no afirma recepción ni custodia inexistentes.
- `/ganancias`: no muestra saldos, adeudos ni históricos en cero.
- `/configuracion`: no inventa nombre, dirección, horarios, capacidades o
  elegibilidad MPHORA.
- `/perfil`: sólo muestra el correo de la sesión actual; no expone datos de otro
  usuario.

## 8. Dependencias revisadas

Las dependencias añadidas por el commit están justificadas:

- `@mpho/database`: tipos `Database` importados con `import type`; se eliminan del
  bundle y no incorporan acceso privilegiado al cliente.
- `@supabase/ssr`: clientes browser/server y renovación de sesión.
- `@supabase/supabase-js`: tipo `User` y contrato de Supabase usado por SSR.
- `clsx` y `tailwind-merge`: helper `cn` de clases.
- `lucide-react`: iconografía de la interfaz.
- `@testing-library/react`, `@testing-library/jest-dom`, `@vitejs/plugin-react` y
  `jsdom`: suite Vitest de componentes.

`@mpho/design-tokens` y `@mpho/types` ya existían en `main`; no fueron agregadas
por este commit ni se alteraron. `pnpm-lock.yaml` sólo refleja dependencias reales
añadidas por `apps/partner`; la auditoría no lo modificó.

## 9. Estado PWA

**MPHO Partner es actualmente una aplicación web responsive, no una PWA
instalable completa.**

Tiene metadata básica y viewport, pero no tiene manifest, iconos instalables,
service worker, caché/offline privada segura, actualización controlada ni flujo
de instalación. Por tanto no se puede validar instalación móvil.

## 10. Pruebas añadidas o modificadas

Se ampliaron de 7 pruebas de renderizado a **40 pruebas en 8 archivos**:

- render y ausencia de métricas ficticias;
- clasificación de rutas públicas/protegidas;
- redirects seguros y prevención de ciclos;
- proxy sin sesión, sin autorización y con autorización Partner;
- fallo cerrado por configuración o verificación;
- lookup real del contrato `profiles` → `user_roles` → `partners`;
- callback PKCE, errores y sanitización;
- navegación móvil, sidebar y estados activos;
- cierre de sesión exitoso y fallido;
- configuración pública completa e incompleta.

## 11. Validaciones finales

Ejecutadas después de la última modificación de código:

- `git diff --check main...HEAD`: **PASS**, salida vacía.
- `git diff --check main`: **PASS**, salida vacía; incluye las correcciones no
  confirmadas del árbol de trabajo.
- `pnpm --filter @mpho/partner lint`: **PASS**, ESLint sin errores ni warnings.
- `pnpm --filter @mpho/partner typecheck`: **PASS**, `tsc --noEmit` sin errores.
- `pnpm --filter @mpho/partner test`: **PASS**, 8 archivos, 40 pruebas pasadas,
  0 fallidas.
- `pnpm --filter @mpho/partner build`: **PASS**, Next.js 16.2.6 compiló,
  comprobó TypeScript y generó 13 rutas sin errores.

Rutas generadas y comprobadas por build:

- `/`
- `/_not-found`
- `/acceso`
- `/callback`
- `/configuracion`
- `/ganancias`
- `/inicio`
- `/login`
- `/paquetes`
- `/pedidos`
- `/pedidos/[id]`
- `/perfil`
- `/signup`

Validación responsive local con sesión Partner autorizada de auditoría:

- `390x844`: sidebar oculto, header y navegación inferior visibles, safe area
  inferior aplicada, targets de navegación de `64x44`, ruta activa correcta y
  `scrollWidth = 390` (sin overflow horizontal).
- `1440x900`: sidebar visible, header y navegación inferior ocultos, ruta activa
  correcta y `scrollWidth = 1440` (sin overflow horizontal).
- Login, invitación, acceso denegado, `/inicio` y navegación real a `/pedidos`
  también se comprobaron en navegador.

## 12. Archivos modificados por las correcciones de auditoría

- `apps/partner/app/(auth)/acceso/page.tsx`
- `apps/partner/app/(auth)/callback/route.ts`
- `apps/partner/app/(auth)/callback/page.tsx` (eliminado)
- `apps/partner/app/(auth)/login/page.tsx`
- `apps/partner/app/(auth)/signup/page.tsx`
- `apps/partner/app/(protected)/configuracion/page.tsx`
- `apps/partner/app/(protected)/ganancias/page.tsx`
- `apps/partner/app/(protected)/inicio/page.tsx`
- `apps/partner/app/(protected)/layout.tsx`
- `apps/partner/app/(protected)/paquetes/page.tsx`
- `apps/partner/app/(protected)/pedidos/[id]/page.tsx`
- `apps/partner/app/(protected)/pedidos/page.tsx`
- `apps/partner/app/(protected)/perfil/page.tsx`
- `apps/partner/app/globals.css`
- `apps/partner/app/layout.tsx`
- `apps/partner/components/operational-unavailable.tsx`
- `apps/partner/components/partner-bottom-nav.tsx`
- `apps/partner/components/partner-header.tsx`
- `apps/partner/components/partner-sidebar.tsx`
- `apps/partner/lib/auth-context.tsx`
- `apps/partner/lib/routes.ts`
- `apps/partner/lib/supabase/proxy.ts`
- `apps/partner/proxy.ts`
- `apps/partner/tests/auth-context.test.tsx`
- `apps/partner/tests/callback.test.ts`
- `apps/partner/tests/config.test.ts`
- `apps/partner/tests/navigation.test.tsx`
- `apps/partner/tests/pages.test.tsx`
- `apps/partner/tests/partner-access.test.ts`
- `apps/partner/tests/proxy.test.ts`
- `apps/partner/tests/routes.test.ts`
- `apps/partner/tests/setup.ts`
- `CODEX_PARTNER_AUDIT_REPORT.md`

## 13. Cambios fuera de alcance

No se modificaron `apps/customer`, `apps/central`, Supabase, migraciones, RLS,
seeds, Vercel, variables o archivos `.env`, `.gitignore`, Mercado Pago ni
configuración raíz. El único archivo nuevo fuera de `apps/partner` es este informe
obligatorio en la raíz.

## 14. Riesgos y siguientes condiciones

- No enviar únicamente `a9f2b15`: las correcciones siguen sin commit por
  instrucción expresa.
- Resolver y probar el control de columnas de `profiles_update_own` antes de
  depender de `profiles.status` como mecanismo de suspensión en producción.
- Definir contratos operativos, RLS, estados, evidencia y auditoría antes de
  conectar pedidos, paquetes, ganancias o configuración.
- Implementar y auditar la PWA separada de Partner en una fase explícita antes de
  anunciar instalación, offline o actualizaciones.
- No se probó contra un proyecto Supabase real; las pruebas validan el contrato y
  un proveedor local controlado, no una integración productiva.

## 15. Confirmación de acciones no realizadas

- Commit: **no realizado**.
- Push: **no realizado**.
- Pull request: **no creado**.
- Deploy: **no realizado**.
