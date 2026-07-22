# Brechas de cobertura — MPHO Aliados

Fecha: 2026-07-21

Base: `5ca06c19f70878cd89c3d1231c11d66d7932b9f5`

Suite actual de la app: 8 archivos / 40 casos Vitest / sin reporte de cobertura

## 1. Criterio de clasificación

- **Cubierto:** una prueba actual ejerce directamente el comportamiento indicado.
- **Parcial:** existe evidencia de una parte o de otra capa, pero no del flujo completo.
- **No cubierto:** no existe una prueba directa o el comportamiento aún no está implementado.
- **No aplicable todavía:** falta el contrato aprobado o la implementación; sigue siendo una brecha de release, no un caso que deba simularse.

Prioridad:

- **P0:** seguridad, aislamiento, integridad de pedido o idempotencia; bloquea piloto del flujo afectado.
- **P1:** confiabilidad operativa y recuperación; bloquea declarar el módulo completo.
- **P2:** calidad de experiencia y compatibilidad; bloquea aceptación final/PWA.

## 2. Matriz obligatoria de brechas

| Área requerida | Estado actual | Evidencia real | Brecha | Prioridad |
| --- | --- | --- | --- | ---: |
| Pedidos | No cubierto operacionalmente | `pages.test.tsx` sólo renderiza “Pedidos no disponibles”; rutas aceptan `/pedidos/[id]` | Sin listado real, detalle, asignación, offer, aceptar/rechazar, deadline, acciones o E2E | P0 |
| Estados | No cubierto | No hay servicio de transición ni test de máquina de estados en Partner | Falta validar origen/destino, actor, datos, historia, auditoría, side effects, rollback y prohibición de saltos | P0 |
| Horarios | Parcial fuera de la app | pgTAP inspeccionado cubre lectura/aislamiento y columnas seguras; `configuracion` declara que horarios no se consultan | Falta API/Server Action, UI, validación temporal, permisos por rol, persistencia, conflictos y E2E | P1 |
| Aislamiento | Parcial | Vitest simula membresía; pgTAP inspeccionado cubre varias tablas Partner | No hay test actual de Supabase desde la app ni aislamiento de pedidos, destinatarios, evidencia, earnings o URLs | P0 |
| Errores backend | Parcial sólo en auth | Se cubren error de callback, sign-out, configuración, lookup y proxy | Faltan timeout, 4xx/5xx, RLS denied, storage, conflicto, retry, estado incierto y mensajes/acciones por módulo operativo | P0/P1 |
| Doble acción | No cubierto | No hay mutación operativa | Falta doble clic, dos dispositivos, retry, clave idempotente, respuesta repetida y side effects únicos | P0 |
| Sesión vencida | Parcial/indirecto | Proxy cubre usuario ausente y fallo genérico; AuthProvider cubre fallo de sign-out | Falta expiración durante una tarea, refresh fallido, redirect seguro, preservación de borrador y reanudación tras login | P1 |
| Partner suspendido | Parcial fuera de la app | pgTAP inspeccionado niega a perfil suspendido; `isAccessiblePartnerStatus` rechaza estados distintos de active/paused, sin caso Vitest explícito | Falta perfil suspendido, Partner `suspended/closed/pending_onboarding`, revocación durante sesión y bloqueo de mutaciones activas | P0 |
| Módulos sin datos | Parcial | Render cubre mensajes honestos de inicio, pedidos, paquetes, ganancias y configuración | Faltan detalle de pedido, perfil/acceso; no hay loading, error, offline, expired, unauthorized y update por módulo | P1 |
| PWA | No cubierto/no implementado | No hay manifest, iconos o service worker | Falta toda la matriz de instalación, cache, offline, update, logout, push y dispositivos | P2 antes de llamarla PWA; P0 para no cachear privados |
| Responsive | No cubierto en suite actual | Clases responsive y auditoría manual histórica 390/1440, no reejecutada | Falta matriz 360/390/430/768/1024/1280/1440, intermedios, zoom, texto largo, teclado, overflow y targets | P2 |
| Accesibilidad | Parcial semántico | Testing Library usa roles/labels en login y navegación | Falta axe, teclado, foco visible/orden, contraste, lector, 200% zoom, reduced motion, live regions, errores y dispositivo móvil | P2 |

## 3. Pruebas prioritarias por área

### 3.1 Pedidos — P0

Prerequisito: contrato operativo aprobado y fuente autoritativa conectada. No crear fixtures UI que aparenten funcionalidad productiva antes de ello.

Agregar al menos:

1. Integración: un Partner sólo obtiene pedidos asignados a su `partner_id`.
2. Integración: el detalle inexistente, ajeno o no autorizado responde sin filtrar existencia ni PII.
3. Componente: lista con loading, datos reales fixtureados, vacío confirmado por backend, error y retry.
4. Componente: oferta muestra trabajo, deadline, capabilities y earning autorizado antes de aceptar.
5. Integración/E2E: aceptar y rechazar con razón estructurada; confirmar persistencia antes de UI de éxito.
6. E2E: pedido local mínimo `offer → accept → stock → preparing → ready → handoff`.
7. E2E negativo: reasignación o expiración mientras el Partner observa la oferta.
8. Privacidad: el payload sólo expone datos de destinatario necesarios para la acción actual.

### 3.2 Estados — P0

Por cada transición Partner autorizada en `docs/13_ORDER_LIFECYCLE.md`, probar:

- estado origen válido y destino válido;
- destino inválido y salto de estado;
- actor/Partner incorrecto;
- datos/evidencia requerida ausente;
- timestamp, actor, razón e historial;
- auditoría y side effects una sola vez;
- request repetida y concurrencia;
- rollback cuando falla un side effect requerido;
- pedido cancelado que no continúa y pedido entregado que no vuelve a preparación.

No usar el botón o el estado React como fuente de verdad; verificar el estado confirmado por servidor.

### 3.3 Horarios — P1

La prueba SQL existente es una base de permisos, no una prueba de producto. Añadir:

1. Partner admin lee y modifica sólo su horario regular.
2. Partner operator puede leer si corresponde, pero no mutar.
3. Partner A no lee ni cambia horarios/excepciones de Partner B.
4. `partner_id`, `id` y timestamps no son mutables.
5. Validación de día, apertura/cierre, rangos efectivos y zona horaria `America/Monterrey`.
6. Conflicto/concurrencia: una edición obsoleta no sobrescribe silenciosamente otra.
7. Error backend conserva los valores editados y no muestra éxito.
8. El cambio afecta ofertas nuevas sin borrar responsabilidades activas.
9. E2E responsive del formulario y navegación por teclado.

El flujo de excepciones/capacidad permanece decisión/contrato restringido según la migración vigente; no asumir permiso de escritura directo.

### 3.4 Aislamiento — P0

Ejecutar pgTAP actual en CI y agregar pruebas con dos Partners para cada recurso privado que se implemente:

- pedidos y tareas;
- productos/inventario autorizado;
- horarios/capacidad;
- destinatario y dirección mínima;
- evidencia y URLs firmadas;
- incidentes;
- earnings y payouts;
- personal/equipo.

Cada matriz debe cubrir SELECT, INSERT, UPDATE y DELETE/RPC según corresponda, además de adivinación de URL/id. Un mock de `from()` no sustituye RLS.

### 3.5 Errores backend — P0/P1

Para cada query y mutación operativa:

- timeout y desconexión;
- `401/403` y denegación RLS;
- `404` sin filtrar recurso ajeno;
- `409` por estado obsoleto/concurrencia;
- `429` con retry controlado;
- `5xx` y resultado desconocido después de enviar;
- storage/upload parcial;
- retry seguro sin duplicar transición;
- mensaje público sin secretos/PII;
- siguiente acción y ruta a excepción cuando corresponda.

### 3.6 Doble acción — P0

Escenarios mínimos para aceptar, rechazar, confirmar stock, recibir paquete, iniciar preparación, marcar listo y handoff:

1. Doble clic en el mismo cliente.
2. Mismo comando en dos pestañas/dispositivos.
3. Timeout del primer request seguido de retry.
4. Misma clave idempotente con mismo payload devuelve resultado estable.
5. Misma clave con payload distinto se rechaza.
6. Sólo existe una transición, reserva, tarea, earning y notificación.
7. La UI deshabilita mientras envía, pero la protección autoritativa permanece en servidor.

### 3.7 Sesión vencida — P1

Agregar:

- token vencido al abrir ruta protegida;
- token vencido durante una mutación;
- refresh exitoso conserva ruta y query;
- refresh fallido redirige a login sin filtrar datos;
- tras autenticar se vuelve sólo a una ruta protegida sanitizada;
- borrador seguro se conserva o se descarta conforme a política;
- datos privados del usuario anterior se limpian en logout/cambio de cuenta;
- múltiples eventos auth no producen redirect loop ni acciones duplicadas.

### 3.8 Partner suspendido — P0

Crear casos explícitos en Vitest e integración para:

- `profiles.status = suspended`;
- rol `revoked` o `revoked_at` informado;
- `partners.status = suspended`, `closed` y `pending_onboarding`;
- Partner `paused`: puede entrar según el contrato actual, pero no debe recibir nuevas ofertas; esa regla requiere prueba operativa al existir el flujo;
- suspensión durante una sesión activa;
- revocación de acceso a datos y mutaciones sin borrar historia;
- pantalla de acceso con razón pública segura y siguiente acción;
- ninguna acción sensible queda autorizada sólo por estado cliente cacheado.

### 3.9 Módulos sin datos — P1

La interfaz actual hace algo correcto: dice “no disponible” en vez de inventar cero. Mantener esa prueba y ampliar a:

- `inicio`, `pedidos`, detalle, `paquetes`, `ganancias`, `configuracion`, perfil y acceso;
- loading/skeleton;
- vacío confirmado por respuesta exitosa;
- backend no disponible;
- sin permiso;
- sesión vencida;
- offline;
- dato obsoleto o update requerido;
- retry y soporte;
- ausencia de precios, stock, earnings, horarios o estados inventados.

### 3.10 PWA — P2/P0 privacidad

No llamar PWA completa a la app hasta probar:

1. Manifest por origen con campos e iconos requeridos.
2. Instalación en iPhone Safari, Android Chrome y desktop Chrome/Edge.
3. Scope/start URL correctos y separación de Customer/Central.
4. Service worker versionado y actualización controlada.
5. Cache estático permitido.
6. Tests que demuestren **network-only/no-store** para auth, pedidos, destinatario, evidencia, earnings y payouts.
7. Offline: acciones oficiales no se marcan completas.
8. Logout/cambio de cuenta elimina estado privado local.
9. Storage cleared, versión antigua, uninstall/reinstall.
10. Push duplicado, deep link vencido y privacidad en lock screen.

La ausencia de cache privado es P0 de seguridad desde el momento en que se introduzca un service worker.

### 3.11 Responsive — P2

Automatizar screenshots/overflow y completar QA manual en:

```text
360 × 800
390 × 844
430 × 932
768 × 1024
1024 × 768
1280 × 800
1440 × 900
```

Probar también tamaños intermedios, orientación, safe areas, teclado móvil, cámara, zoom/text scaling, textos largos, monedas grandes y ausencia de scroll horizontal. La auditoría histórica de 390/1440 es evidencia útil, pero no cubre la matriz ni fue reejecutada aquí.

### 3.12 Accesibilidad — P2

Agregar checks automatizados con axe como señal temprana y mantener revisión manual de:

- landmarks y skip link;
- teclado y orden de foco;
- foco visible y retorno de foco;
- nombres/descripciones accesibles;
- errores y resumen de formulario;
- contraste y estado no dependiente sólo de color;
- 200% de zoom/reflow;
- reduced motion;
- live regions sin ruido;
- targets de al menos 44 × 44 CSS px;
- VoiceOver/TalkBack en los flujos críticos.

Testing Library por roles mejora la semántica comprobada, pero no constituye una auditoría de accesibilidad.

## 4. Gates recomendados por fase

### Antes de integrar un primer flujo operativo Partner

- Unit tests de transición/validación.
- Integración de servidor con base local.
- pgTAP/RLS ejecutado, no sólo inspeccionado.
- Idempotencia y concurrencia.
- Error/permission/expired session.
- Build, lint, typecheck y regresión del shell.

### Antes del piloto mínimo propuesto

- E2E real de recepción de pedido, detalle, transición autorizada y horarios.
- Dos Partners para aislamiento.
- Partner suspendido/revocado durante sesión.
- Backend timeout/conflict/retry y doble acción.
- Móvil objetivo, teclado y accesibilidad crítica.
- Ningún dato o éxito ficticio.

### Antes de declarar PWA completa

- Manifest/iconos/service worker por origen.
- Matriz iOS/Android/desktop instalada.
- Offline/update/logout/account-switch.
- Pruebas de no-cache para datos privados y financieros.
- Push, permisos, deep links y privacidad.

## 5. Riesgo de interpretación

El principal riesgo de calidad actual no es un test fallido, sino extrapolar un PASS de 40 casos de shell a capacidades que aún no existen. Cada claim futuro debe enlazar una prueba que ejerza directamente el comportamiento, la capa autoritativa y el escenario de fallo; una pantalla renderizada, un mock o un build verde no bastan para declarar operación Partner completa.
