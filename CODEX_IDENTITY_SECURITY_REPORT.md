# Auditoría de seguridad de identidad y Partner

Fecha: 2026-07-18

Rama: `fix/identity-partner-privilege-escalation`

Estado: implementado y validado localmente; sin commit, push, PR, despliegue ni `supabase db push`.

## Objetivo

Eliminar la escalación de privilegios causada por permisos de escritura demasiado amplios en `profiles`, `user_roles` y datos Partner, preservando el alta mediante Supabase Auth y los únicos campos de autoservicio actualmente seguros.

## Alcance auditado

- Migraciones históricas de identidad, RLS, signup y Partner.
- Grants de `anon`, `authenticated` y `service_role`.
- Políticas RLS de `profiles`, `customers`, `user_roles`, `partners`, `partner_capabilities`, `partner_schedules`, `partner_schedule_exceptions`, `partner_capacity`, direcciones Partner y zonas Partner.
- Funciones de identidad con `SECURITY DEFINER`.
- Uso real de Supabase Auth e identidad en `apps/customer` y `apps/partner`.
- Pruebas SQL existentes y nuevas, generación de tipos y drift del esquema.

No se modificaron Mercado Pago, catálogo, carrito, `apps/central`, Vercel, variables de entorno, `.env`, `.gitignore`, dependencias, `package.json`, lockfiles ni migraciones históricas.

## Hallazgos confirmados antes de la corrección

### Críticos

1. `authenticated` tenía `UPDATE` de tabla sobre `profiles`. La política limitaba la fila, pero no las propiedades, por lo que un usuario podía escribir campos administrativos de su propio perfil como `default_role`, `status`, `email`, `created_at`, `updated_at` y `last_login_at`.
2. `authenticated` tenía `INSERT` directo en `profiles` y una política de inserción redundante con el trigger de Supabase Auth.
3. `authenticated` tenía grants directos de mutación sobre `user_roles`. Aunque las políticas existentes exigían `mpho_admin`, la administración de roles quedaba expuesta como DML de cliente en vez de un camino de servidor controlado.
4. La política pública de `partners` exponía todos los registros activos a `anon` y clientes, en contradicción con la regla que prohíbe filtrar la identidad interna de Puntos MPHO.

### Importantes

1. Los predicados Partner no exigían de forma consistente perfil activo, `revoked_at IS NULL`, rol Partner válido y Partner en estado operativo.
2. `partner_schedules` permitía `UPDATE` de tabla completo a Partner admin; la política protegía filas, pero no `partner_id`, identificadores ni timestamps.
3. Capacidades, excepciones de horario y capacidad operativa conservaban mutaciones directas desde clientes autenticados para roles administrativos.
4. `auth_uid()` parseaba manualmente el claim `sub` con privilegios de definidor, aunque Supabase ya ofrece `auth.uid()`.
5. Las funciones de identidad `SECURITY DEFINER` históricas no fijaban un `search_path` seguro y eran ejecutables por `PUBLIC`.

## Corrección aplicada

### Profiles y Customer

- Se revocaron `INSERT`, `DELETE` y el `UPDATE` general de `profiles` a `authenticated`.
- Se conservó exclusivamente `UPDATE(display_name, phone)` para el perfil propio.
- Se eliminó la política `profiles_insert_authenticated`; el trigger de Auth es el único camino de alta.
- Se revocó la inserción directa de `customers`; el trigger crea esa extensión.
- Se conservó exclusivamente `UPDATE(marketing_consent, preferred_currency)` para el Customer propio.
- `id`, `auth_user_id`, `email`, `status`, `default_role`, `created_at`, `updated_at` y `last_login_at` no son editables por el cliente.

### Decisión sobre email

`auth.users.email` es la fuente autoritativa y el cambio de correo debe pasar por Supabase Auth (`updateUser`/flujo de confirmación), no por `public.profiles`. `profiles.email` queda como snapshot de lectura creado durante signup. La aplicación actual solo muestra `user.email` de Supabase Auth y no depende de editar `profiles.email`.

Pendiente no bloqueante: si una función futura necesita consultar el snapshot después de un cambio confirmado de correo, deberá añadirse una sincronización controlada desde Auth; no se debe devolver el permiso directo al cliente.

### Roles

- Se revocaron `INSERT`, `UPDATE` y `DELETE` de `user_roles` a todos los clientes autenticados, incluidos administradores de interfaz.
- Se eliminaron las políticas directas de inserción/actualización por `mpho_admin`.
- La lectura propia se conserva mediante RLS.
- La administración legítima queda limitada a `service_role` y deberá exponerse, si se necesita, mediante una operación de servidor auditada; no se añadió una función de negocio nueva.
- La revocación continúa representándose con `status` y `revoked_at`; no se otorgó `DELETE` a `service_role`.

### Partner

- Se retiró el `SELECT` anónimo de `partners` y se eliminó `partners_select_public`.
- Ningún rol de navegador autenticado puede insertar, actualizar o borrar `partners`.
- Estado, territorio, asignación, acuerdo, aprobación, suspensión, nombres administrativos y timestamps solo quedan disponibles para un camino controlado con `service_role`.
- Capacidades, excepciones y capacidad operativa quedan en solo lectura acotada para Partner y sin mutaciones directas.
- Partner admin conserva únicamente las columnas de horario regular:
  - `day_of_week`
  - `opens_at`
  - `closes_at`
  - `is_closed`
  - `effective_from`
  - `effective_to`
- `partner_id`, `id`, `created_at` y `updated_at` de horarios no son editables por Partner.

### Aislamiento RLS Partner

Se creó `has_active_partner_membership(partner_id, require_admin)` con estas condiciones acumulativas:

- el usuario se deriva de `auth.uid()`;
- el perfil debe estar `active`;
- el rol debe ser `partner_operator` o `partner_admin`;
- la asignación debe estar `active` y sin `revoked_at`;
- la asignación debe pertenecer al Partner consultado;
- el Partner debe estar `active` o `paused`;
- para escritura de horario se exige `partner_admin`.

El mismo invariante se aplica a Partner, capacidades, horarios, excepciones, capacidad, direcciones Partner y zonas asociadas.

### Funciones de identidad

- `auth_uid()` ahora es un wrapper `SECURITY INVOKER` de `auth.uid()`; ambas identidades se verifican como equivalentes en pruebas.
- `auth_roles()`, `auth_profile_id()`, `has_role()`, `is_mpho_staff()`, `handle_new_user()` y `has_active_partner_membership()` fijan `search_path = ''` y califican esquemas.
- Las funciones privilegiadas revocan ejecución a `PUBLIC` y `anon`.
- Solo `authenticated` y `service_role` reciben ejecución donde RLS la necesita.
- `handle_new_user()` no puede invocarse directamente por `authenticated`; continúa funcionando como trigger de `auth.users`.
- Las políticas que llaman helpers privilegiados se restringieron explícitamente a `authenticated`.

## Nota sobre SELECT anónimo de tablas de identidad

El catálogo histórico contiene políticas que evalúan subconsultas de identidad aun en sesión anónima. Para no modificar catálogo ni romper su lectura pública, `anon` conserva el privilegio base `SELECT` sobre `profiles` y `user_roles`, pero ninguna política RLS de lectura aplica a `anon`; el resultado comprobado es cero filas. `anon` no tiene ningún permiso de escritura ni acceso a `partners`.

## Pruebas de seguridad añadidas

Archivo: `supabase/tests/identity_partner_privilege_hardening.test.sql`

Aserciones nuevas: 83.

Escenarios comprobados:

1. Lectura del perfil propio y denegación de perfiles ajenos.
2. Edición de `display_name` y `phone` propios.
3. Denegación de `default_role` y `status`.
4. Denegación de `auth_user_id`, `id`, `email` y timestamps.
5. Denegación de inserción directa de perfil y Customer.
6. Lectura de roles propios.
7. Denegación de inserción de rol Partner.
8. Denegación de cambios en rol, `partner_id`, estado, `revoked_at` y `created_by`.
9. Denegación de reactivación de un rol revocado.
10. Customer sin acceso a datos Partner.
11. Partner A sin lectura ni escritura sobre Partner B.
12. Aislamiento de capacidades, horarios, excepciones y capacidad entre Partners.
13. Partner admin puede modificar únicamente campos seguros de su horario.
14. Partner operator no puede modificar horarios.
15. Un perfil suspendido no puede usar una asignación Partner todavía activa.
16. `service_role` puede crear/revocar asignaciones y administrar estado Partner.
17. Signup real en `auth.users` crea perfil activo, Customer y solo rol Customer.
18. `auth_uid()` equivale a `auth.uid()`.
19. Grants por tabla/columna y ejecución de funciones coinciden con mínimo privilegio.
20. Todas las funciones de identidad `SECURITY DEFINER` fijan `search_path = ''`.

## Archivos modificados

- `supabase/migrations/20260718111400_identity_partner_privilege_hardening.sql`
- `supabase/tests/identity_partner_privilege_hardening.test.sql`
- `packages/database/types.generated.ts`
- `CODEX_IDENTITY_SECURITY_REPORT.md`

## Validaciones

| Validación | Resultado |
| --- | --- |
| `git diff --check` | PASS |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS después de regenerar el artefacto `.next` obsoleto de Partner mediante build |
| `pnpm test` | PASS; Customer 97/97, Partner sin archivos de test y `--passWithNoTests`, resto del workspace PASS |
| `pnpm build:customer` | PASS; 23 páginas generadas, rutas dinámicas y estáticas sin errores |
| `pnpm build:partner` | PASS; aplicación actual de una ruta estática |
| `npx supabase db reset` | PASS desde un esquema local limpio |
| `npx supabase test db` | PASS; 6 archivos, 243 pruebas totales |
| `pnpm db:types:check` | PASS |
| `pnpm db:schema:check` | PASS; `No schema changes found` |
| `pnpm security:check` | PASS |

El primer arranque local encontró un volumen PostgreSQL 15 incompatible con la versión 17 asociada al proyecto enlazado. Se descartó únicamente el volumen local de desarrollo, se ejecutaron las pruebas con PostgreSQL 15 según `supabase/config.toml`, y al finalizar se restauró el metadata local de enlace. No se consultó ni modificó el esquema remoto.

## Riesgos y pendientes

- No existe todavía una operación de negocio para administrar roles/Partners desde una interfaz. Hasta que se diseñe una función de servidor auditada, esas mutaciones solo pueden ejecutarse desde infraestructura confiable con `service_role`.
- El esquema histórico documenta que roles Partner requieren `partner_id`, pero no contiene una restricción `CHECK`. Esta fase impide que el cliente elija o cambie esa asignación; una operación administrativa futura debe validar la invariante antes de escribir. Añadir la restricción requiere corregir fixtures históricos que hoy usan roles Partner sin asignación para pruebas negativas y queda fuera de esta corrección mínima.
- No se hizo revisión visual manual del shell Partner porque no se modificó UI. Sus lint, typecheck y build sí fueron ejecutados.

## Veredicto

**APROBADO PARA COMMIT DESDE LA PERSPECTIVA DE LA CORRECCIÓN DE ESCALACIÓN DE PRIVILEGIOS**, sujeto a revisión humana del diff. No se realizó commit ni push.
