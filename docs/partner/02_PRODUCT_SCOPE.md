# MPHO Aliados — Product Scope

## 1. Propósito

Este documento delimita qué pertenece a MPHO Aliados, qué existe realmente en el repositorio, qué se propone para un piloto mínimo, qué corresponde al MVP y qué permanece para una etapa posterior.

MPHO Aliados es una parte del ecosistema MPHO. Este documento no sustituye el ciclo de vida de pedidos, las políticas de seguridad y privacidad, los runbooks operativos, los acuerdos Partner ni las decisiones financieras. Tampoco aprueba por sí mismo:

- Comisiones, tarifas, earnings o payouts.
- SLA, deadlines o tiempos de entrega.
- Cancelaciones, devoluciones, reembolsos o disputas.
- Responsabilidad por daño, pérdida o incumplimiento.
- Proveedores de pago, logística o notificaciones.
- Un piloto con pedidos reales.
- Preparación para producción.

Una capacidad descrita como objetivo no debe presentarse como implementada. Una pantalla, ruta, prueba aislada, tipo generado o wireframe no demuestra por sí solo una operación completa.

## 2. Autoridad documental

### 2.1 Precedencia

Este documento aplica el orden de autoridad definido en `docs/00_DOCUMENTATION_INDEX.md`:

1. `AGENTS.md`.
2. Documentos especializados aprobados bajo `docs/`.
3. `README.md`.
4. Decisiones técnicas registradas.
5. Código, migraciones y configuración vigentes.
6. Comentarios internos.

Si dos fuentes son incompatibles, la diferencia se registra como contradicción o decisión pendiente. No se elige silenciosamente una versión.

### 2.2 Fuentes consultadas

Se consultaron como base obligatoria:

- `AGENTS.md`.
- `README.md`.
- `docs/00_DOCUMENTATION_INDEX.md`.
- `docs/01_PROJECT_OVERVIEW.md`.
- `docs/partner/01_PROJECT_OVERVIEW.md`.

Se revisaron además las fuentes especializadas de visión, alcance, Partner, roles, pedidos, catálogo, finanzas, seguridad, operación, PWA y evidencia técnica enumeradas en la sección 19.

### 2.3 Reglas que provienen de `AGENTS.md`

Son obligatorias para este alcance:

- Un pedido tiene un solo Punto MPHO responsable en el MVP.
- No se inventan pedidos, stock, disponibilidad, precios, horarios, tiempos, costos, earnings ni estados.
- La base de datos y los servicios de dominio, no WhatsApp ni el navegador, conservan el estado oficial.
- Cada Partner accede únicamente a sus propios recursos autorizados.
- Las acciones sensibles se autorizan en el servidor y aplican mínimo privilegio.
- Los cambios críticos son auditables e idempotentes cuando corresponda.
- MPHO Customer o Tienda, MPHO Aliados y MPHO Central son aplicaciones separadas por audiencia, navegación y permisos.
- La ausencia de una integración o fuente real no puede representarse como una operación completa.

### 2.4 Decisiones de producto aprobadas para este paquete

- MPHO Central gobierna el ecosistema, las aprobaciones Partner, los roles, las activaciones, las suspensiones, las reglas globales y las decisiones sensibles.
- MPHO Aliados administra únicamente la operación autorizada de su propio Partner.
- Una sesión autenticada no equivale a una autorización Partner.
- Todo usuario operativo nuevo inicia con el nivel de privilegio más restrictivo hasta que exista una asignación explícita.
- Un Partner solo puede leer o modificar información asociada a su propio `partner_id` y permitida para su acción.
- MPHO Aliados es actualmente una aplicación web responsive, no una PWA instalable completa.
- El piloto mínimo descrito en la sección 6 es una propuesta pendiente de aprobación definitiva.
- Tipos definitivos de Partner, permisos internos, reglas económicas, SLA, responsabilidades, proveedores, evidencias obligatorias y consecuencias de desempeño siguen pendientes salvo aprobación posterior trazable.

### 2.5 Evidencia técnica actual

La fotografía ejecutable usada por este documento es `HEAD 95467b8` de la rama `docs/partner-scope-business-rules`. Se inspeccionaron, sin modificarlos:

- `apps/partner/**`.
- `packages/database/**`.
- Migraciones y pruebas Supabase relacionadas con identidad y Partner.
- Configuración del workspace y CI.
- Reportes técnicos, de seguridad, calidad y documentación de MPHO Aliados.

El código y las pruebas acreditan el alcance actual descrito en la sección 5. No sustituyen las decisiones de producto o negocio que siguen abiertas.

## 3. Identidad del producto

MPHO Aliados es la aplicación operativa para operadores y administradores nombrados de un Partner autorizado dentro de MPHO.

Su propósito es convertir trabajo físico realmente asignado por MPHO en acciones claras, acotadas y auditables. En su alcance objetivo, debe ayudar al usuario autorizado a conocer:

1. Qué tarea le corresponde.
2. Sobre qué pedido asignado puede actuar.
3. Qué instrucciones, plazo y evidencia aplican cuando estén aprobados.
4. Qué acción está permitida por su rol, el estado actual y la capacidad autorizada.
5. Qué resultado confirmó el servidor.
6. Cómo reportar una excepción sin inventar una resolución.

MPHO Aliados no es:

- Un panel de gobierno global.
- Un sustituto de MPHO Central.
- Un directorio público de comercios.
- Un canal de venta directa entre Customer y Partner.
- Una fuente autónoma de pagos, precios, payouts o estados de entrega.
- Un mecanismo que convierte automáticamente a un negocio registrado en Punto MPHO.

La propuesta de valor no promete volumen de pedidos, ingresos, territorio exclusivo, aprobación automática ni payout inmediato.

## 4. Relación con el ecosistema

| Aplicación | Usuario principal | Responsabilidad de producto |
| --- | --- | --- |
| MPHO Customer o Tienda | Customer | Descubrir, configurar, comprar y consultar regalos dentro de la experiencia de MPHO. |
| MPHO Aliados | Operadores y administradores de un Partner autorizado | Ejecutar únicamente trabajo propio, asignado y autorizado. |
| MPHO Central | Personal interno autorizado de MPHO | Gobernar el ecosistema, aprobar Partners, administrar roles y estados, configurar reglas globales y resolver decisiones administrativas sensibles. |

Las tres aplicaciones pueden consumir dominios compartidos, pero tienen orígenes, navegación, permisos y responsabilidades diferentes. Ninguna interfaz cliente se convierte por sí sola en la fuente oficial de pedidos, pagos, entrega, earnings o payouts.

La separación requiere:

- Customer no administra operación Partner.
- Aliados no gobierna Customer, Central ni otro Partner.
- Central no debe usar la sesión de Aliados como sustituto de sus controles privilegiados.
- Los estados visibles en cada aplicación derivan del mismo estado oficial, con lenguaje y datos mínimos apropiados para cada audiencia.

## 5. Alcance actual implementado

### 5.1 Categorías de estado

- **IMPLEMENTADO:** existe comportamiento ejecutable y verificable para el límite indicado. No implica aprobación productiva.
- **PARCIALMENTE IMPLEMENTADO:** existe una barrera o parte útil, pero faltan capas necesarias para completar la capacidad.
- **INTERFAZ SIN OPERACIÓN COMPLETA:** existe una ruta o pantalla, pero no consulta ni ejecuta el contrato operativo real correspondiente.
- **NO IMPLEMENTADO:** no existe evidencia ejecutable suficiente de la capacidad en MPHO Aliados.
- **DECISIÓN PENDIENTE:** falta una aprobación de producto, negocio, seguridad, operación, legal o finanzas y no puede inferirse.

### 5.2 Matriz verificable en `HEAD 95467b8`

| Capacidad | Estado | Evidencia y límite |
| --- | --- | --- |
| Aplicación web independiente | **IMPLEMENTADO** | `apps/partner` es una aplicación Next.js separada con layout, estilos, rutas y navegación propios. Despliegue y origen productivo no fueron verificados. |
| Diseño responsive del shell | **IMPLEMENTADO** para el alcance auditado | El código aplica navegación adaptable, safe area y objetivos táctiles; existe evidencia histórica en `390x844` y `1440x900`. No acredita PWA, dispositivos objetivo ni accesibilidad completa. |
| Login y sesión | **IMPLEMENTADO** para la base local | Login con contraseña, renovación SSR y consulta de usuario con Supabase Auth. No incluye recuperación, MFA, invitación productiva ni step-up. |
| Callback PKCE | **IMPLEMENTADO** | `/callback` intercambia el código por sesión en servidor y limita el detalle expuesto en errores. Los redirects absolutos aún dependen del origin de la petición; falta fijar y validar el host canónico antes de exposición pública. |
| Protección de rutas | **IMPLEMENTADO** | Lista pública explícita; toda ruta restante queda protegida por defecto; recursos internos se omiten de forma expresa y las rutas API protegidas responden sin redirigir a HTML. La allowlist de host canónico permanece pendiente. |
| Autorización de entrada Partner | **PARCIALMENTE IMPLEMENTADO** | El servidor exige usuario, perfil activo, rol Partner activo/no revocado, `partner_id` y Partner `active` o `paused`; los fallos cierran el acceso. `user_roles.partner_id` sigue nullable, no existe una invariante de esquema rol Partner→`partner_id` ni unicidad de asignación activa, y el proxy toma una asignación sin selección explícita de contexto. Este gate no autoriza todavía acciones operativas. |
| Cierre de sesión | **IMPLEMENTADO** | La interfaz limpia estado y navega solo después de que el proveedor confirma `signOut()`. |
| Perfil de cuenta | **PARCIALMENTE IMPLEMENTADO** | Se muestra el correo de la sesión; preferencias, recuperación, edición completa y controles productivos no existen. |
| Aislamiento en tablas maestras Partner cubiertas | **PARCIALMENTE IMPLEMENTADO** | Helper, grants y RLS alcanzan Partner, capabilities, horarios, excepciones, capacidad, direcciones y zonas dentro del alcance documentado. El pgTAP A/B versionado cubre Partner, capabilities, horarios, excepciones y capacidad, pero no contiene casos de direcciones o zonas. |
| Aislamiento y revocación transversales | **PARCIALMENTE IMPLEMENTADO** | Políticas heredadas de catálogo y media no aplican todas las condiciones del helper endurecido. Pedidos, tareas, evidencia y finanzas Partner aún no tienen contratos que puedan acreditarse. |
| Inicio | **INTERFAZ SIN OPERACIÓN COMPLETA** | `/inicio` comunica que no existe una fuente autorizada para resumen, tareas, entregas o ganancias; no muestra métricas supuestas. |
| Pedidos | **INTERFAZ SIN OPERACIÓN COMPLETA** | `/pedidos` y `/pedidos/[id]` existen, pero no consultan cola, asignación ni detalle real. |
| Paquetes | **INTERFAZ SIN OPERACIÓN COMPLETA** | `/paquetes` no consulta recepción, condición ni custodia. |
| Ganancias | **INTERFAZ SIN OPERACIÓN COMPLETA** | `/ganancias` no consulta ledger ni muestra saldos ficticios. |
| Configuración | **INTERFAZ SIN OPERACIÓN COMPLETA** | `/configuracion` no consulta ni persiste perfil Partner, horarios, capacidades o elegibilidad MPHORA. |
| Horarios en base de datos | **PARCIALMENTE IMPLEMENTADO** | Existe tabla/RLS y `partner_admin` puede actualizar por PostgREST columnas permitidas de filas propias; no hay UI/ruta funcional, servicio de negocio, bootstrap, excepciones ni prueba de integración de producto. Faltan validación temporal, concurrencia, auditoría y workflow. |
| Direcciones propias en base de datos | **PARCIALMENTE IMPLEMENTADO** | `partner_admin` puede insertar por PostgREST una dirección con owner Partner propio bajo grants/RLS. No existe UI o servicio de negocio, no hay pgTAP A/B específico y esta facultad no permite modificar `partners.address_id`; la autoridad de producto y los campos permitidos siguen pendientes. |
| Pedido asignado a Partner | **NO IMPLEMENTADO** | No existe vínculo persistente `orders → Partner` ni oferta equivalente que Aliados pueda consultar. |
| Oferta, aceptación y rechazo | **NO IMPLEMENTADO** | No hay servicio Partner ni transición operativa conectada. |
| Stock, inventario y reservas | **NO IMPLEMENTADO** | El catálogo publicado no es inventario ni disponibilidad autorizada. |
| Paquetes, custodia e inspección | **NO IMPLEMENTADO** | No existen contratos Partner ejecutables ni persistencia conectada para el flujo. |
| Preparación, evidencia y handoff | **NO IMPLEMENTADO** | Existen especificaciones y SOP, no una operación en Aliados. |
| Entrega y tracking | **NO IMPLEMENTADO** | No hay asignación de courier, custodia, tracking ni prueba de entrega en Aliados. |
| Earnings y payouts | **NO IMPLEMENTADO** | No existe ledger Partner ni payout conciliado expuesto por la aplicación. |
| Notificaciones operativas | **NO IMPLEMENTADO** | No hay proveedor, outbox, plantillas, preferencias ni deep links conectados. |
| Soporte e incidencias | **NO IMPLEMENTADO** | No existe caso o incidente enlazado a una operación Partner en la aplicación. |
| PWA instalable completa | **NO IMPLEMENTADO** | No se verificaron manifest, iconos instalables, service worker, instalación, actualización, caché, offline, push ni dispositivos objetivo. |
| Route map definitivo del piloto | **DECISIÓN PENDIENTE** | Existen rutas actuales y rutas anticipadas, pero falta aprobación del mapa final. |
| Matriz exacta operator/admin | **DECISIÓN PENDIENTE** | Los roles existen; sus permisos operativos definitivos y el mínimo inicial requieren aprobación. |
| Preparación para producción | **PARCIALMENTE IMPLEMENTADO** | Existen controles locales útiles, pero los gates de seguridad, legal, operación, pagos, recuperación, incidentes y lanzamiento no están satisfechos con evidencia completa. **NO APROBADO PARA PRODUCCIÓN.** |

La suite Partner del `HEAD` base auditado contiene 51 pruebas en 8 archivos. Sustenta el shell, autenticación, autorización, redirects, navegación y estados honestos; no prueba los flujos operativos marcados como no implementados.

## 6. Propuesta de alcance del piloto

> **PROPUESTA DE PILOTO PENDIENTE DE APROBACIÓN DEFINITIVA**

Esta propuesta busca validar primero el núcleo operativo de MPHO Aliados sin asumir que el producto completo, las reglas comerciales o el lanzamiento real ya fueron aprobados.

### 6.1 Capacidades propuestas

1. **Recepción de pedidos asignados:** listar únicamente pedidos asociados por el servidor al único Punto MPHO responsable.
2. **Consulta del detalle:** mostrar el mínimo operativo necesario y autorizado para la tarea vigente.
3. **Cambios de estado autorizados:** ejecutar solo comandos permitidos por actor, permiso, estado actual y transición aprobada. Este documento no decide cuáles transiciones exactas se habilitan.
4. **Gestión de horarios:** consultar y modificar únicamente campos de horario permitidos para la operación propia, según rol y contrato aprobados.

### 6.2 Condiciones mínimas

- Ningún pedido se ofrece antes de que el pago haya sido verificado y el ciclo oficial permita avanzar desde `paid`.
- El `partner_id` y el pedido se derivan del contexto autorizado en servidor, no del navegador.
- Un pedido conserva un solo Punto MPHO responsable.
- Cada comando registra actor, fecha, razón, resultado y control de idempotencia cuando corresponda.
- Una respuesta local u optimista no se presenta como estado oficial antes de la confirmación del servidor.
- La interfaz cubre carga, vacío confirmado, error, sesión vencida, acceso denegado, estado no permitido y conflicto por concurrencia.
- “Sin pedidos” solo aparece después de una consulta autorizada exitosa.
- Los horarios no conceden capacidades, estado Partner, inventario ni elegibilidad MPHORA.
- El usuario nuevo conserva el privilegio más restrictivo hasta asignación explícita.
- Central conserva aprobación de Partners, roles, activación, suspensión, capabilities y reglas globales.

### 6.3 Fuera de esta primera propuesta

Salvo aprobación posterior y dependencias cumplidas, no forman parte del piloto mínimo:

- Autoservicio de onboarding o aprobación Partner.
- Catálogo e inventario completos.
- Recepción de paquetes, custodia, preparación, evidencia y entrega.
- Earnings, payouts, comisiones, penalizaciones o disputas.
- PWA instalable, offline y push.
- Analítica avanzada, performance scoring, automatización de asignación y MPHORA.

Esta propuesta de producto no autoriza pedidos reales. Un piloto operativo requiere además los gates de `docs/38_PRODUCTION_READINESS_AND_LAUNCH_CHECKLIST.md` y `docs/57_PILOT_LAUNCH_AND_FIRST_100_ORDERS_RUNBOOK.md`, así como las aprobaciones humanas aplicables.

## 7. Alcance del MVP

El MVP de MPHO Aliados es más amplio que la propuesta de piloto mínimo. Debe permitir que el único Punto MPHO responsable ejecute su parte del ciclo real de un pedido de forma segura, trazable y recuperable. Cada módulo permanece especificado o pendiente hasta contar con evidencia completa.

| Módulo | Resultado necesario para el MVP | Estado actual |
| --- | --- | --- |
| Autenticación | Acceso nominal, recuperación segura y controles apropiados al riesgo. | **PARCIALMENTE IMPLEMENTADO** |
| Autorización | Permisos por actor, Partner, objeto, acción y estado; denegación por defecto. | **PARCIALMENTE IMPLEMENTADO** |
| Perfil | Consulta y edición acotada de datos permitidos de cuenta y operación propia. | **PARCIALMENTE IMPLEMENTADO** |
| Horarios | Consulta y gestión permitida de horarios, cierres y excepciones con timezone y validación. | **PARCIALMENTE IMPLEMENTADO** en datos; interfaz **NO IMPLEMENTADA** |
| Capacidades | Consulta de capabilities aprobadas; solicitud o cambio sujeto a Central. | **NO IMPLEMENTADO** en Aliados |
| Catálogo | Consulta y mantenimiento de campos expresamente autorizados, sin cambiar precio final ni publicar por inferencia. | **NO IMPLEMENTADO** |
| Pedidos | Oferta post-pago, detalle, aceptación/rechazo, owner, siguiente acción, historial y estados autorizados. | **NO IMPLEMENTADO** |
| Stock e inventario | Confirmación real, reservas y conflictos de concurrencia con fuente y vigencia. | **NO IMPLEMENTADO** |
| Preparación | Instrucciones autorizadas, checklist, personalización, control de calidad y listo. | **NO IMPLEMENTADO** |
| Paquetes | Recepción, identificación, condición, custodia, discrepancias y almacenamiento temporal. | **NO IMPLEMENTADO** |
| Evidencia | Captura privada, asociación al pedido, revisión, retención y acceso protegido. | **NO IMPLEMENTADO** |
| Entregas | Handoff, custodia, estado permitido, prueba y manejo de intento fallido. | **NO IMPLEMENTADO** |
| Ganancias | Consulta de líneas propias derivadas de hitos verificados y ledger auditable. | **NO IMPLEMENTADO** |
| Payouts | Consulta de registros conciliados; Partner no confirma el pago. | **NO IMPLEMENTADO** |
| Notificaciones | Avisos transaccionales idempotentes y enlazados a acciones autenticadas. | **NO IMPLEMENTADO** |
| Soporte | Casos vinculados a pedido, verificación, escalamiento y cierre. | **NO IMPLEMENTADO** |
| Incidencias | Reporte estructurado, severidad, owner, evidencia, próxima acción y recuperación. | **NO IMPLEMENTADO** |

El MVP no aprueba fórmulas, importes, plazos, canales, proveedores o responsabilidades todavía pendientes. Las operaciones pueden iniciar con coordinación manual o asistida siempre que el estado oficial, la evidencia, los permisos y la auditoría permanezcan dentro de MPHO.

## 8. Visión posterior al MVP

Las siguientes capacidades pertenecen a una etapa posterior y no deben bloquear el primer circuito real salvo que sean necesarias para seguridad, legalidad, dinero o integridad del pedido:

### 8.1 Automatización

- Asignación automática basada en reglas aprobadas.
- Sincronización de stock e inventario con fuentes autorizadas.
- Reintentos controlados, colas y recuperación de trabajos.
- Reconciliación y alertas más automatizadas.
- Integraciones logísticas y de proveedores más profundas.

### 8.2 Analítica e inteligencia operativa

- Priorización basada en riesgo y deadlines reales.
- Analítica de capacidad, aceptación, calidad e incidencias.
- Performance scoring con métricas y consecuencias aprobadas.
- Pronósticos o recomendaciones de capacidad sin sustituir decisiones autorizadas.
- HADIA y MPHORA operativos desde dominios autorizados, sin conceder a Aliados autoridad global.

### 8.3 PWA, offline y push

- Manifest e iconos propios.
- Instalación validada por dispositivo.
- Service worker con alcance independiente.
- Caché segura que excluya pedidos, datos personales, evidencia y finanzas privadas.
- Actualización controlada.
- Offline seguro y resolución de conflictos.
- Limpieza de datos privados al cerrar sesión o cambiar de cuenta.
- Push con contenido mínimo y deep links autenticados.

### 8.4 Expansión funcional

- Scanner o cámara operacional.
- Integraciones de impresoras y periféricos.
- Centro de capacitación.
- Multi-sucursal y expansión a nuevas ciudades solo después de validación.
- Onboarding autoservicio con revisión de Central.
- Analítica avanzada y automatización financiera aprobada.

## 9. Responsabilidades de MPHO Aliados

Cuando los flujos correspondientes existan y estén aprobados, MPHO Aliados puede:

- Autenticar usuarios Partner nombrados y verificar su contexto autorizado.
- Mostrar únicamente trabajo asignado al Partner propio.
- Exponer la información mínima necesaria para la tarea vigente.
- Permitir acciones operativas expresamente autorizadas por rol, estado y capability.
- Consultar horarios y permitir cambios acotados aprobados.
- Confirmar stock o recepción cuando exista el contrato y la evidencia requeridos.
- Guiar preparación, control de calidad, evidencia y handoff.
- Registrar incidentes y solicitar revisión sin decidir una compensación no autorizada.
- Mostrar earnings y payout propios solo desde registros reales y conciliados.
- Comunicar la confirmación, rechazo o conflicto devuelto por el servidor.
- Conservar trazabilidad de actor, tiempo, entidad, transición, resultado y error.

Estas responsabilidades son operativas. No transfieren gobierno del ecosistema ni autoridad económica a un Partner.

## 10. Responsabilidades reservadas a Central

MPHO Central conserva como mínimo:

- Aprobación o rechazo de Partners.
- Asignación, elevación, revocación y auditoría de roles.
- Activación, restricción, pausa administrativa, suspensión y cierre.
- Aprobación de capabilities y excepciones.
- Reglas globales, categorías y configuraciones administrativas.
- Comisiones, tarifas, fórmulas de earnings y reglas de payout.
- Aprobación y confirmación administrativa de refunds y payouts según separación de funciones.
- Excepciones administrativas y decisiones sensibles.
- Disputas administrativas y compensaciones dentro de autoridad aprobada.
- Configuración de proveedores e integraciones.
- Gobierno de catálogo, precios y disponibilidad cuando el campo no haya sido delegado expresamente.
- Supervisión global, auditoría y respuesta a incidentes.
- Acceso controlado a operaciones de otros Partners cuando el rol interno y el caso lo permitan.

MPHO Aliados no puede autoaprobar un Partner, autoasignar un rol, elevar privilegios, modificar reglas globales ni ejecutar directamente operaciones privilegiadas mediante una clave elevada.

## 11. Relación con Customer

Customer y Aliados deben observar proyecciones coherentes del mismo pedido y de las mismas transiciones confirmadas, adaptadas a sus necesidades y permisos.

Reglas de relación:

- Customer compra y consulta dentro de MPHO; Aliados ejecuta trabajo propio autorizado.
- Aliados recibe solo datos de Customer, destinatario, dirección, personalización y entrega necesarios para la tarea vigente.
- Los datos recibidos no pueden usarse para marketing, captación directa o contacto ajeno al pedido.
- La identidad interna del Punto MPHO no se muestra normalmente a Customer, salvo obligación legal, fiscal, de garantía, seguridad, retiro autorizado o colaboración aprobada.
- Aliados no puede cambiar el precio final, confirmar pagos no verificados ni consultar historial no relacionado con el pedido.
- Un estado local de Aliados no se comunica como éxito a Customer hasta que el servidor lo autoriza y persiste.
- Customer recibe lenguaje neutral de MPHO; los estados internos pueden mapearse a mensajes seguros sin alterar el estado oficial.
- Las obligaciones legales de vendedor, factura, garantía, retiro o seguridad no deben ocultarse.

La sincronización completa entre ambas aplicaciones está especificada, no implementada en el alcance Partner actual.

## 12. No objetivos

MPHO Aliados no tiene como objetivo:

- Administrar Customer, Central u otros Partners.
- Ser un marketplace público de Puntos MPHO.
- Permitir contacto directo para ventas fuera de MPHO.
- Sustituir MPHO Central.
- Ser un POS completo, contabilidad, nómina, CRM, banco o sistema fiscal.
- Reemplazar todos los sistemas internos del Partner.
- Aprobar su propio estado, roles, capabilities, tarifas o territorio.
- Cambiar precios finales, comisiones o reglas globales.
- Confirmar pagos, refunds, earnings pagados o payouts.
- Dividir un pedido entre múltiples Partners responsables.
- Ejecutar compras externas de forma autónoma.
- Prometer stock, preparación, MPHORA o entrega sin validación.
- Usar WhatsApp, una hoja de cálculo o estado local como fuente oficial.
- Mostrar datos ficticios como operación real.
- Implementar operación nacional, internacional o multi-sucursal avanzada en el MVP.
- Crear aplicaciones nativas separadas en la etapa inicial.
- Convertir funciones de analítica o IA en autoridad operativa o financiera.

## 13. Restricciones

### 13.1 Seguridad y autorización

- Denegación por defecto ante sesión, perfil, rol, asignación, Partner, permiso o fuente no verificable.
- El `partner_id` se deriva en servidor.
- Una ruta o botón no concede autorización.
- Cada comando vuelve a comprobar actor, recurso, acción, estado y capability.
- Los datos de un Partner no se exponen a otro Partner.
- Las operaciones privilegiadas permanecen fuera del navegador y aplican separación de funciones.

### 13.2 Datos reales

Está prohibido presentar como real:

- Pedidos, ventas o métricas ficticias.
- Disponibilidad o capacidad no consultada.
- Ganancias, saldos o adeudos sin ledger.
- Un payout como pagado sin referencia y conciliación.
- Una acción como completada sin confirmación del servidor.
- Un vacío de datos cuando la consulta falló o no se realizó.

### 13.3 Operación e integridad

- Un pedido conserva un único Punto MPHO responsable en el MVP.
- Las transiciones respetan `docs/13_ORDER_LIFECYCLE.md` y no omiten estados críticos sin justificación aprobada.
- Toda acción crítica conserva actor, timestamp, motivo y resultado.
- Reintentos, doble clic, respuestas tardías y solicitudes duplicadas no deben repetir efectos.
- Un pedido cancelado no continúa a entrega y uno entregado no vuelve a preparación.
- Preparación no comienza antes de los pagos, aprobaciones y validaciones físicas requeridos.
- No se permite sustitución silenciosa.

### 13.4 Dinero y datos privados

- El navegador no calcula totales financieros confiables ni mueve dinero por sí solo.
- Los importes usan unidades menores enteras y moneda.
- Revenue, costo, comisión, earning y payable se separan.
- Refunds y payouts requieren confirmación verificable y conciliación.
- Evidencia, destinatarios, pedidos y finanzas no se incluyen en cachés genéricas.
- La información privada se minimiza y se protege con controles de servidor y almacenamiento apropiados.

## 14. Dependencias

### 14.1 Dependencias técnicas verificadas

Existen:

- Aplicación Partner separada.
- Supabase Auth y clientes SSR/browser.
- Perfiles, roles y entidades maestras Partner.
- Base de horarios, capabilities y capacidad.
- RLS y grants acotados para parte de las tablas Partner.
- Ciclo ejecutable de pago hasta `paid`, sin asignación Partner.
- Ciclo de pedidos documentado para las etapas posteriores.

Faltan para el piloto o MVP:

- Contrato persistente de un único Partner responsable y su oferta.
- Ownership, RLS y consultas de pedidos Partner.
- Servicios de comandos y transiciones post-`paid`.
- Autorización por objeto y acción.
- Historial, auditoría e idempotencia operativa.
- UI/ruta funcional, servicio de negocio y bootstrap de horarios; la mutación PostgREST acotada ya existe.
- Invariante de esquema y selección determinista de contexto para asignaciones Partner activas.
- Contrato de producto, pruebas y workflow para direcciones propias.
- Host canónico validado para redirects absolutos.
- Inventario y reservas.
- Tareas, paquetes, custodia, evidencia privada e incidentes.
- Entrega y tracking.
- Ledger, earnings y payouts.
- Eventos, outbox, notificaciones y observabilidad.
- Operaciones Central acotadas para administración privilegiada.

### 14.2 Dependencias operativas

- Route map y permisos del piloto.
- Capabilities aprobadas por Partner.
- Definición de owner, siguiente acción y deadline.
- SOP de stock, paquetes, preparación, calidad, evidencia y handoff.
- Soporte, escalamiento, continuidad y manejo de incidentes.
- Cobertura real de Partner y delivery.
- Capacidad y horarios verificados.
- Personal y fallback manual para el piloto.
- Stop conditions y revisión por cohortes.

### 14.3 Dependencias comerciales, financieras y legales

- Entidad legal, modelo fiscal y facturación.
- Acuerdo Partner revisado.
- Reglas de comisión, earning, deducción, liberación y payout.
- Política de cancelación, refund y disputa.
- Responsabilidad por stock, daño, pérdida, retraso y entrega fallida.
- Proveedor logístico y condiciones de entrega.
- Evidencias obligatorias y retención.
- Privacidad de Customer y destinatario.
- Categorías permitidas y seguros aplicables.

### 14.4 Decisiones pendientes

Las dependencias que requieren decisión, dueño y evidencia se enumeran en la sección 18. Ninguna puede resolverse por inferencia del código, un wireframe o un ejemplo.

## 15. Criterios para aceptar una nueva función

Una nueva función de MPHO Aliados puede aceptarse en alcance únicamente cuando documenta:

1. Problema y resultado esperado.
2. Regla de negocio aprobada y su fuente.
3. Fase: piloto, MVP o posterior al MVP.
4. Usuario y rol autorizados.
5. Recurso y `partner_id` aplicables.
6. Flujo principal y excepciones.
7. Estados de entrada y salida.
8. Permisos y acciones prohibidas.
9. Contrato de datos y fuente oficial.
10. Datos mínimos visibles.
11. Errores, sesión vencida y recuperación.
12. Concurrencia e idempotencia cuando apliquen.
13. Consecuencias operativas, financieras, de privacidad y seguridad.
14. Pruebas unitarias, integración, autorización y aceptación necesarias.
15. Métrica verificable sin inventar un objetivo numérico.
16. Documentación afectada.
17. Rama independiente y revisión proporcional al riesgo.

Una idea no entra al alcance por aparecer en un mockup, menú, tipo generado o documento histórico.

## 16. Criterios para declarar una función terminada

Una función no está terminada porque la pantalla abra o el build pase. Debe existir evidencia de:

- Operación real conectada al dominio correspondiente.
- Persistencia correcta y fuente oficial definida.
- Autenticación y autorización en servidor.
- Aislamiento por Partner y RLS cuando aplique.
- Validación de datos y transiciones.
- Manejo de loading, vacío, error, sesión vencida, no autorizado, conflicto y éxito.
- Prevención de duplicados y reintentos seguros cuando existan efectos críticos.
- Consecuencias operativas y financieras verificadas.
- Actor, timestamps, razón e historial para acciones críticas.
- Privacidad, caché y retención apropiadas.
- Pruebas de comportamiento, permisos, fallos y concurrencia.
- Lint, typecheck, tests y build verdes.
- Validación responsive, accesibilidad y dispositivos cuando correspondan.
- Documentación y criterios de soporte actualizados.
- Revisión independiente sin afirmaciones no sustentadas.

Una capacidad financiera, de entrega, evidencia o producción requiere además reconciliación, seguridad y aceptación operacional específicas. Una PWA completa exige todos los controles enumerados en la sección 8.3.

## 17. Fuera de alcance actual

En `HEAD 95467b8` están fuera del alcance ejecutable actual:

- Pedidos Partner reales y vínculo de asignación.
- Ofertas y transiciones operativas.
- Gestión de horarios en la interfaz.
- Catálogo, stock e inventario Partner conectados.
- Recepción, inspección y custodia de paquetes.
- Preparación, evidencia, control de calidad y handoff.
- Entrega, tracking e intentos fallidos.
- Incidencias y soporte operativo.
- Earnings, payouts, conciliación y disputas.
- Notificaciones, WhatsApp, push o proveedor logístico.
- Onboarding y administración de personal desde Aliados.
- PWA instalable, offline y actualización.
- Analítica, scoring, HADIA operativo y MPHORA real.
- Preparación productiva y piloto con pedidos reales.

También quedan fuera de este documento la aprobación de tarifas, importes, SLA, responsabilidades y proveedores.

## 18. Decisiones pendientes

| ID | Decisión | Dueño necesario | Bloquea |
| --- | --- | --- | --- |
| PS-DP-01 | Alcance final y route map del piloto | Producto + UX + Operación | Pantallas y navegación del piloto |
| PS-DP-02 | Matriz exacta `partner_operator`/`partner_admin` y mínimo inicial | Producto + Seguridad | Comandos Partner |
| PS-DP-03 | Frontera solicitud Partner/aprobación Central para personal, roles, capabilities y pausas | Producto + Seguridad + Operación | Equipo y onboarding |
| PS-DP-04 | Tipos definitivos de Partner | Producto + Operación + Legal | Onboarding y capabilities |
| PS-DP-05 | Mapping entre lifecycle documental y enum `partner_status` vigente | Producto + Operación + Datos | Activación, pausa y suspensión |
| PS-DP-06 | Contrato post-`paid` de asignación y oferta a un solo Partner | Producto + Backend + Datos + Seguridad | Pedidos reales |
| PS-DP-07 | Transiciones exactas por actor, rol y estado | Producto + Operación + Seguridad | Aceptación y preparación |
| PS-DP-08 | Bootstrap, timezone, mutación y excepciones de horarios | Operación + Datos | Gestión de horarios |
| PS-DP-09 | Stock, reserva, variantes, vigencia y concurrencia | Producto + Operación + Datos | Disponibilidad y preparación |
| PS-DP-10 | Evidencia obligatoria, Storage, custodia y retención | Operación + Seguridad + Privacidad | Paquetes y preparación |
| PS-DP-11 | Reglas de comisiones, earnings, deducciones y payouts | Negocio + Finanzas + Legal | Ganancias y pagos Partner |
| PS-DP-12 | SLA, deadlines, tiempos y escalamiento | Operación + Producto | Ofertas, tareas y soporte |
| PS-DP-13 | Cancelaciones, devoluciones, refunds, disputas y compensaciones | Negocio + Legal + Finanzas + Operación | Excepciones y cierre |
| PS-DP-14 | Responsabilidad por stock, daño, pérdida, retraso y entrega fallida | Legal + Operación + Negocio | Custodia y entrega |
| PS-DP-15 | Proveedor logístico, fallback y evidencias de entrega | Operación + Legal + Tecnología | Entrega |
| PS-DP-16 | Canales y proveedor de notificaciones | Producto + Operación + Privacidad | Avisos transaccionales |
| PS-DP-17 | Métricas de desempeño y consecuencias | Producto + Operación + Legal | Scoring y cumplimiento |
| PS-DP-18 | Alcance PWA, offline, push y dispositivos objetivo | Producto + Frontend + Seguridad + QA | PWA completa |
| PS-DP-19 | Resolución del riesgo transversal de RLS de catálogo/media | Seguridad + Datos | Acceso Partner productivo |
| PS-DP-20 | Gates de seguridad, legal, recuperación, incidentes y lanzamiento | Dueños de cada gate | Producción y piloto real |
| PS-DP-21 | Invariante rol Partner→`partner_id`, unicidad y selección explícita del contexto cuando existan varias asignaciones | Producto + Identidad + Seguridad + Datos | Contexto Partner determinista |
| PS-DP-22 | Autoridad, campos y workflow permitidos para direcciones propias | Producto + Operación + Privacidad + Seguridad | Gestión de ubicación/contacto Partner |
| PS-DP-23 | Host canónico y allowlist de origin para redirects absolutos | Plataforma + Seguridad | Exposición pública de autenticación |

Mientras una decisión permanezca pendiente, la aplicación debe fallar cerrada, omitir la acción o mostrar la información como no disponible.

## 19. Referencias verificadas

### 19.1 Gobierno y producto

- `AGENTS.md`, especialmente secciones 2–12, 18–23 y addenda 25–28.
- `README.md`, secciones “Ecosistema MPHO”, “Operación inicial”, “Alcance del MVP” y “Estado del proyecto”.
- `docs/00_DOCUMENTATION_INDEX.md`, secciones 2, 3, 7, 11–18.
- `docs/01_PROJECT_OVERVIEW.md`, secciones 6–10, 14, 18–24.
- `docs/02_PRODUCT_VISION.md`, secciones 9–16 y 18–19.
- `docs/03_BRAND_ECOSYSTEM.md`, secciones 7–8, 11 y 15.
- `docs/04_GLOSSARY.md`.
- `docs/05_SCOPE_AND_NON_GOALS.md`, secciones 6–7, 14–15 y 20–24.
- `docs/08_PARTNER_PROGRAM.md`, usado como especificación/propuesta y no como prueba de implementación.
- `docs/10_USER_ROLES.md`, con la contradicción sobre administración de personal registrada como pendiente.
- `docs/12_PARTNER_JOURNEY.md`, como journey objetivo.
- `docs/13_ORDER_LIFECYCLE.md`, como fuente especializada de estados y transiciones.
- `docs/15_PARTNER_APP.md`, como especificación amplia de producto, no estado actual.
- `docs/17_CATALOG_AND_INVENTORY.md`.
- `docs/22_PAYMENTS_AND_PAYOUTS.md`.
- `docs/30_MVP_ROADMAP_AND_BACKLOG.md`.

### 19.2 Seguridad, legal y operación

- `docs/31_THREAT_MODEL_AND_ABUSE_CASES.md` a `docs/38_PRODUCTION_READINESS_AND_LAUNCH_CHECKLIST.md`.
- `docs/39_LEGAL_AND_REGULATORY_REQUIREMENTS.md` a `docs/47_BRAND_INTELLECTUAL_PROPERTY_AND_CONTENT_RULES.md`.
- `docs/48_PARTNER_ONBOARDING_AND_ACTIVATION_RUNBOOK.md`.
- `docs/49_DAILY_ORDER_OPERATIONS_RUNBOOK.md`.
- `docs/50_PACKAGE_RECEIVING_INSPECTION_AND_STORAGE_SOP.md`.
- `docs/51_GIFT_PREPARATION_PERSONALIZATION_AND_QUALITY_SOP.md`.
- `docs/52_CUSTOMER_SUPPORT_AND_COMMUNICATION_PLAYBOOK.md`.
- `docs/53_DELIVERY_DISPATCH_HANDOFF_AND_FAILED_DELIVERY_RUNBOOK.md`.
- `docs/54_CANCELLATIONS_REFUNDS_AND_DISPUTE_OPERATIONS_RUNBOOK.md`.
- `docs/55_PARTNER_EARNINGS_PAYOUT_AND_RECONCILIATION_RUNBOOK.md`.
- `docs/56_INCIDENT_EXCEPTION_AND_RECOVERY_OPERATIONS.md`.
- `docs/57_PILOT_LAUNCH_AND_FIRST_100_ORDERS_RUNBOOK.md`.

### 19.3 PWA y experiencia

- `docs/58_BRAND_VISIBILITY_AND_CUSTOMER_EXPERIENCE_MODEL.md`.
- `docs/59_THREE_PWA_ECOSYSTEM_AND_ARCHITECTURE.md`.
- `docs/63_PARTNER_PWA_UX_AND_SCREEN_SPEC.md`.
- `docs/65_SHARED_DESIGN_SYSTEM_AND_RESPONSIVE_RULES.md`.
- `docs/66_PWA_INSTALLATION_NOTIFICATIONS_OFFLINE_CACHE_AND_UPDATES.md`.
- `docs/67_ROUTES_WIREFRAMES_AND_COMPONENT_INVENTORY.md`.
- `docs/68_PROTOTYPE_ACCEPTANCE_AND_HANDOFF_TO_OPENCODE.md`.

### 19.4 Evidencia actual e histórica

- `apps/partner/**` en `HEAD 95467b8`.
- Migraciones y pruebas Supabase de identidad/Partner vigentes en ese commit.
- `docs/partner/01_PROJECT_OVERVIEW.md`.
- `PARTNER_AGENTIC_FOUNDATION_1_1_REPORT.md`.
- `reports/partner/technical/CODEBASE_INVENTORY.md`.
- `reports/partner/technical/CONTRADICTIONS.md`.
- `reports/partner/technical/DOCUMENTATION_INVENTORY.md`.
- `reports/partner/security/SECURITY_BASELINE.md`.
- `reports/partner/security/PERMISSIONS_RISK_REGISTER.md`.
- `reports/partner/quality/QUALITY_BASELINE.md`.
- `reports/partner/quality/TEST_COVERAGE_GAPS.md`.
- `reports/partner/documentation/PROJECT_OVERVIEW_VALIDATION.md`.
- `CODEX_PARTNER_AUDIT_REPORT.md` y `CODEX_IDENTITY_SECURITY_REPORT.md`, leídos como evidencia histórica con su fecha/commit, no como estado Git actual.
- `docs/69_CURRENT_IMPLEMENTATION_AND_FOUNDATION_STATUS.md` y `docs/71`–`76`, usados con su base temporal explícita.

El estado “Complete” de un archivo en el índice significa que el documento existe; no demuestra que la capacidad descrita esté implementada.

## 20. Glosario

**MPHO:** plataforma principal que coordina descubrimiento, compra, preparación y entrega de regalos.

**MPHO Customer o Tienda:** aplicación usada por Customer para descubrir, configurar, comprar y consultar regalos dentro de la experiencia de MPHO.

**MPHO Aliados:** aplicación operativa para que usuarios nombrados de un Partner autorizado ejecuten únicamente su propia operación asignada.

**MPHO Central:** aplicación privada de gobierno y operación interna que administra Partners, roles, estados, reglas globales, excepciones sensibles y supervisión del ecosistema.

**Partner:** entidad de negocio autorizada o en proceso controlado de autorización dentro de MPHO. Los tipos definitivos permanecen pendientes.

**Punto MPHO:** Partner o unidad operativa autorizada para capacidades específicas de suministro, recepción, inspección, preparación, personalización, almacenamiento o despacho.

**`partner_id`:** identificador estable que delimita la entidad Partner. Para operaciones autorizadas debe derivarse del contexto de servidor y no confiarse al navegador.

**Partner autorizado:** contexto que cumple sesión válida, perfil válido y activo, asignación de rol vigente, `partner_id`, Partner en estado permitido y permiso suficiente para la acción. La autenticación por sí sola no cumple esta definición.

**Piloto:** propuesta acotada para validar capacidades y operación bajo supervisión. En este documento el piloto mínimo sigue pendiente de aprobación y no autoriza pedidos reales.

**MVP:** producto mínimo que debe demostrar el circuito real de un pedido con un único Punto MPHO responsable, incluyendo ejecución Partner, evidencia, entrega, integridad financiera y recuperación de al menos un fallo aplicable.

**Arquitectura objetivo:** diseño o capacidad prevista en documentación que orienta evolución futura, pero no se considera implementada hasta existir código, persistencia, autorización, pruebas y aceptación suficientes.

**Customer:** persona que crea y paga un pedido en MPHO.

**Recipient o destinatario:** persona que recibe el regalo y que puede no tener cuenta MPHO.

**Partner operator:** usuario nombrado para tareas operativas acotadas. Sus permisos exactos dependen de una matriz aprobada.

**Partner administrator:** usuario nombrado con responsabilidades adicionales sobre la operación propia. No equivale a un administrador de MPHO Central ni concede autoridad global.

**Capability:** capacidad operativa aprobada individualmente para un Partner. Una capability no se deriva de una pantalla, un tipo de Partner propuesto o una autodeclaración.

**Pedido asignado:** pedido vinculado de forma persistente y auditable al único Punto MPHO responsable después de las validaciones requeridas. Este contrato no está implementado actualmente en Aliados.

**Fuente oficial:** sistema autorizado que conserva el estado confiable de un dominio, como la base de datos y servicios de pedido, el proveedor de pago verificado, el registro de entrega o el ledger financiero.

**PWA completa:** aplicación que ha validado manifest, iconos, instalación, service worker, actualización, caché, offline, logout, notificaciones y dispositivos objetivo. MPHO Aliados no cumple hoy esta definición.
