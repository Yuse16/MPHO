# CODEX Customer Night Report — Fase 9.2

## 1. Veredicto

**APROBADO TÉCNICAMENTE DENTRO DEL ALCANCE DE CUSTOMER.**

La Fase 9.2 implementa un catálogo navegable sobre el contrato público real existente, con búsqueda, filtro de categoría, estados completos, detalle por slug e integración con el carrito persistente. No se modificaron Supabase, migraciones, RLS, pagos, infraestructura, variables de entorno, configuración raíz ni paquetes de Customer.

La aprobación no equivale a autorización de producción. El Supabase local configurado en `.env.local` no estaba ejecutándose durante la prueba visual (`127.0.0.1:54321`), por lo que la experiencia viva se validó en carga y error recuperable. Los estados con datos, vacíos y sin resultados se validaron mediante pruebas del contrato público.

## 2. Resumen ejecutivo

- `/explorar` consulta `get_public_catalog` y `get_public_catalog_categories` mediante el cliente público anónimo ya existente.
- La consulta ocurre en un Server Component. El navegador no recibe un cliente adicional ni filtra datos sensibles.
- La búsqueda usa nombre, descripciones y categoría del DTO público; ignora mayúsculas y acentos.
- El filtro de categoría usa el slug real soportado por el RPC.
- Búsqueda y categoría se conservan en `searchParams` (`q` y `categoria`) y se pueden limpiar.
- Se diferencian carga, error recuperable, catálogo vacío y búsqueda sin coincidencias.
- `/producto/[slug]` usa el slug público real, `notFound()` para productos no publicados o inexistentes, shell compartido, imagen real o ausencia honesta de imagen y retorno a `/explorar`.
- Los productos configurables obligan a abrir el detalle; no se agrega una selección incompleta.
- El carrito valida cantidades entre 1 y 20 en cliente y en el límite HTTP, y la base de datos sigue siendo la autoridad final.
- La previsualización de cotización aplica el mismo rango de 1 a 20 y rechaza opciones duplicadas o excesivas antes de consultar el servidor.
- Agregar una selección idéntica actualiza su cantidad mediante la mutación versionada existente, en vez de crear una línea duplicada.
- Las cotizaciones se invalidan visualmente al cambiar cantidad, variante, opciones o zona, para no presentar importes obsoletos.
- Una respuesta `unavailable` se muestra como no disponible y bloquea el agregado de esa selección mientras siga vigente.
- Las respuestas de cotización y su configuración se validan en tiempo de ejecución antes de renderizarlas.
- Se eliminó el favorito únicamente visual de `ProductCard` y se corrigió la afirmación no verificada “Entrega hoy”.

## 3. Funciones terminadas

1. Catálogo real en `/explorar`.
2. Búsqueda compartible por campos públicos existentes.
3. Filtro compartible por categoría real.
4. Limpieza de filtros.
5. Conteo de resultados.
6. Estado de carga con skeletons.
7. Estado de error recuperable sin detalles técnicos.
8. Estado de catálogo vacío.
9. Estado de búsqueda sin coincidencias.
10. Navegación de `ProductCard` a `/producto/[slug]`.
11. Detalle real con imagen pública o ausencia explícita.
12. `notFound()` para slug inexistente o producto no visible en el contrato público.
13. Estado de error recuperable en detalle.
14. Shell compartido en detalle, móvil y escritorio.
15. Agregar producto simple desde tarjeta o detalle.
16. Configuración obligatoria en detalle cuando existen opciones publicadas.
17. Validación de cantidad de 1 a 20.
18. Fusión de selecciones idénticas usando `PATCH` y versión de carrito.
19. Confirmaciones accesibles mediante texto y regiones `aria-live`.
20. Corrección de lenguaje MPHORA para no prometer entrega rápida sin validación.
21. Categoría retirada o desconocida visible como filtro activo, con limpieza disponible.
22. Invalidación de cotización cuando cambia cualquier dato que interviene en su cálculo.
23. Representación diferenciada de disponibilidad elegible, pendiente y no disponible.
24. Validación estructural de configuración y respuesta de cotización.
25. Mensajes seguros del carrito que no exponen texto técnico del servidor.

## 4. Funciones parciales

- La búsqueda opera sobre hasta 100 registros devueltos por el RPC público, porque ese es el límite explícito del contrato existente. No se añadió paginación ni un índice de búsqueda sin soporte de backend.
- La prueba visual con catálogo exitoso quedó limitada por la ausencia del Supabase local. La transformación y todos los estados exitosos se cubren con pruebas unitarias y de componentes.
- La cotización y el carrito conservan el comportamiento existente: siguen requiriendo validación del servidor y no representan reserva ni promesa de entrega.

## 5. Funciones no realizadas y motivo

- Ocasión, destinatario, rango de precio y disponibilidad: el DTO/RPC público actual no ofrece filtros confiables para esos dominios.
- Aliado o comercio: además de no existir en el DTO público, está prohibido exponer o convertir Customer en un directorio de Puntos MPHO.
- Filtro MPHORA: `mphora_candidate` no es elegibilidad operacional confirmada.
- Ordenamiento por popularidad, velocidad o novedades: el contrato no proporciona señales verificadas para esos criterios.
- Inventario, existencias, tiempos, promociones, descuentos, reseñas y calificaciones: no existen como datos públicos confiables en esta arquitectura.
- Cambios de esquema o RPC: expresamente fuera de alcance.

## 6. Archivos modificados

### Aplicación

- `apps/customer/app/api/cart/items/[id]/route.ts`
- `apps/customer/app/api/cart/items/route.ts`
- `apps/customer/app/error.tsx`
- `apps/customer/app/explorar/page.tsx`
- `apps/customer/app/explorar/loading.tsx`
- `apps/customer/app/producto/[slug]/page.tsx`
- `apps/customer/app/producto/[slug]/loading.tsx`
- `apps/customer/app/producto/[slug]/not-found.tsx`
- `apps/customer/components/basic-add-to-cart.tsx`
- `apps/customer/components/catalog-filters.tsx`
- `apps/customer/components/catalog-retry-button.tsx`
- `apps/customer/components/mphora-section.tsx`
- `apps/customer/components/product-card.tsx`
- `apps/customer/components/product-carousel.tsx`
- `apps/customer/components/quote-calculator.tsx`
- `apps/customer/lib/cart-context.tsx`
- `apps/customer/lib/cart-item-selection.ts`
- `apps/customer/lib/catalog.ts`
- `apps/customer/lib/data.ts`
- `apps/customer/lib/quotes.ts`

### Pruebas

- `apps/customer/tests/cart-api.test.ts`
- `apps/customer/tests/cart-context.test.tsx`
- `apps/customer/tests/cart-item-selection.test.ts`
- `apps/customer/tests/catalog.test.ts`
- `apps/customer/tests/explore-page.test.tsx`
- `apps/customer/tests/product-card.test.tsx`
- `apps/customer/tests/product-detail.test.tsx`
- `apps/customer/tests/quote-calculator.test.tsx`
- `apps/customer/tests/quotes.test.ts`

### Informe solicitado

- `CODEX_CUSTOMER_NIGHT_REPORT.md`

## 7. Decisiones arquitectónicas

1. Mantener `lib/catalog.ts` como adaptador único del contrato público.
2. Ejecutar catálogo y categorías en `/explorar` como Server Component.
3. Usar formulario GET nativo para búsqueda y categoría; no se añadió estado duplicado en cliente.
4. Aplicar categoría en el RPC y búsqueda textual una sola vez sobre el DTO seguro recuperado.
5. No consultar tablas públicas directamente ni crear un cliente Supabase adicional.
6. Mantener el slug porque el RPC existente garantiza un producto público único por slug.
7. Mantener `CartContext` y sus APIs versionadas; la consolidación de duplicados utiliza la mutación `update_item` existente.
8. Validar forma y límites del payload antes de invocar la mutación, conservando la base de datos como autoridad sobre publicación, opciones, precios y disponibilidad.
9. No renderizar productos configurables como agregado rápido si sus opciones no han sido cargadas.
10. Invalidar una previsualización cuando cambia su selección, y no convertir `unavailable` en una afirmación de elegibilidad.
11. Validar en tiempo de ejecución el subconjunto de datos de cotización que consume la UI.
12. Enmascarar mensajes internos en la capa de experiencia del carrito conservando códigos tipados para decisiones de flujo.

## 8. Consultas y fuentes de datos utilizadas

- `get_public_catalog(text, text, integer, integer)`:
  - productos activos;
  - listings publicados con precio MXN;
  - slug, título, descripciones, precio, media pública y categoría;
  - sin identidad de aliado, costos, notas internas, inventario ni datos sensibles.
- `get_public_catalog_categories()`:
  - categorías activas de tipo producto y conteo calculado por servidor.
- `get_public_quote_configuration(uuid)`:
  - variantes, opciones y zonas públicas de la selección.
- `/api/cart`, `/api/cart/items` y `/api/cart/items/[id]`:
  - carrito autenticado, privado, versionado y confirmado por servidor.
- `mutate_customer_cart` permanece como autoridad de publicación, pertenencia de variante/opción, límites y concurrencia. No fue modificado.

## 9. Pruebas creadas o actualizadas

- Transformación segura del catálogo y rechazo de respuestas inválidas.
- Búsqueda por nombre, descripción y categoría, con normalización de acentos.
- Catálogo con datos válidos.
- Catálogo vacío.
- Error recuperable sin exposición técnica.
- Búsqueda sin coincidencias.
- Categoría y limpieza de filtros.
- Navegación desde `ProductCard`.
- Detalle existente.
- Detalle inexistente/no disponible mediante `notFound()`.
- Error de detalle.
- Producto configurable sin opciones cargadas.
- Agregado al carrito.
- Validación de cantidades.
- Validación coherente de cantidad y opciones en el límite HTTP de cotización.
- Rechazo de UUID, opciones duplicadas, precios inyectados y personalización inválida.
- Normalización y límites de textos de personalización.
- Consolidación de líneas idénticas.
- Categoría activa retirada o desconocida.
- Cotización no disponible, invalidación de cotización obsoleta y respuesta de cotización malformada.
- Validación estructural de configuración pública de cotización.
- Persistencia y comportamiento previo del carrito.
- Regresiones de navegación, autenticación, cotización y pagos.

## 10. Resultado exacto de lint

```text
Comando: pnpm --filter @mpho/customer lint
Resultado: exit 0
Salida: $ eslint .
```

## 11. Resultado exacto de typecheck

```text
Comando: pnpm --filter @mpho/customer typecheck
Resultado: exit 0
Salida: $ tsc --noEmit
```

## 12. Resultado exacto de tests

```text
Comando: pnpm --filter @mpho/customer test
Resultado: exit 0
Test Files: 22 passed (22)
Tests: 128 passed (128)
Duración final: 42.19s
```

## 13. Resultado exacto de build

```text
Comando: pnpm --filter @mpho/customer build
Resultado: exit 0
Next.js: 16.2.6 (Turbopack)
Compilación: correcta en 10.1s
TypeScript de build: correcto en 8.1s
Generación estática: 23/23
Rutas verificadas por build: /explorar y /producto/[slug] dinámicas, más las rutas existentes de Customer
```

## 14. Hallazgos críticos, importantes y menores

### Críticos

Ninguno abierto.

### Importantes

Resueltos:

- El favorito de `ProductCard` era únicamente visual y no persistía: eliminado.
- `mphoraCandidate` se presentaba como “Entrega hoy”: sustituido por lenguaje de confirmación obligatoria.
- Una selección idéntica podía crear líneas duplicadas: ahora actualiza cantidad mediante versión del carrito.
- Productos con opciones publicadas podían agregarse sin configuración desde la tarjeta: ahora abren el detalle.
- Los mensajes de error de cotización podían mostrar texto técnico recibido: ahora muestran un mensaje seguro en español.
- Una cotización `unavailable` podía presentarse como validada: ahora se identifica y bloquea honestamente.
- Una cotización seguía visible al cambiar su selección: ahora se invalida inmediatamente.
- El límite HTTP de cotización aceptaba cantidades superiores a 20 y normalizaba opciones repetidas: ahora las rechaza.
- La configuración y previsualización de cotización se consumían mediante casts sin validación estructural: ahora se validan antes de renderizar.
- El carrito mostraba mensajes recibidos del servidor: ahora usa mensajes públicos seguros basados en el código de error.
- Los textos de personalización podían conservar espacios externos después de validar su longitud: ahora se normalizan antes de enviarlos a la mutación.

### Menores

- El RPC limita la exploración a 100 resultados. Es una limitación legítima del contrato actual, no ocultada mediante datos ficticios.
- Una categoría válida en formato pero retirada del contrato podía quedar oculta en el selector: ahora permanece visible como no disponible y se puede limpiar.
- Sin servicio local de Supabase, las solicitudes fallan después de los reintentos internos del cliente. La UI concluye en un estado recuperable y no queda en carga infinita.

La auditoría de arquitectura no detectó imports circulares en 112 archivos TypeScript de `apps/customer`.

## 15. Riesgos y pendientes

- Validar con una instancia local o de prueba autorizada que contenga catálogo publicado, sin modificar infraestructura.
- Si el catálogo supera 100 productos, diseñar paginación o búsqueda en servidor en una fase de backend aprobada.
- Añadir filtros adicionales solo cuando el contrato público exponga datos reales y una semántica verificada.
- La Fase 9.2 no cambia los bloqueos de producción documentados para inventario, MPHORA, autenticación, pagos, operación y observabilidad.

## 16. Archivos fuera de alcance encontrados

Durante la auditoría aparecieron cambios concurrentes que no estaban presentes al inicio y no fueron realizados ni modificados por esta tarea:

```text
apps/partner/app/layout.tsx
apps/partner/app/page.tsx
apps/partner/package.json
apps/partner/tsconfig.json
apps/partner/app/(auth)/callback/page.tsx
apps/partner/app/(auth)/layout.tsx
apps/partner/app/(auth)/login/page.tsx
apps/partner/app/(auth)/signup/page.tsx
apps/partner/app/(protected)/configuracion/page.tsx
apps/partner/app/(protected)/ganancias/page.tsx
apps/partner/app/(protected)/inicio/page.tsx
apps/partner/app/(protected)/layout.tsx
apps/partner/app/(protected)/paquetes/page.tsx
apps/partner/app/(protected)/pedidos/[id]/page.tsx
apps/partner/app/(protected)/pedidos/page.tsx
apps/partner/app/(protected)/perfil/page.tsx
apps/partner/components/partner-bottom-nav.tsx
apps/partner/components/partner-header.tsx
apps/partner/components/partner-shell.tsx
apps/partner/components/partner-sidebar.tsx
apps/partner/lib/auth-context.tsx
apps/partner/lib/providers.tsx
apps/partner/lib/routes.ts
apps/partner/lib/supabase/browser.ts
apps/partner/lib/supabase/config.ts
apps/partner/lib/supabase/proxy.ts
apps/partner/lib/supabase/server.ts
apps/partner/lib/utils.ts
apps/partner/proxy.ts
apps/partner/tests/pages.test.tsx
apps/partner/tests/setup.ts
apps/partner/vitest.config.ts
pnpm-lock.yaml
```

No se detectaron cambios de esta tarea en `.gitignore`, `.env*`, `docs/**`, `packages/**`, `supabase/**`, migraciones, seeds, RLS, Vercel, GitHub Actions ni configuración de despliegue.

## 17. Confirmación de acciones no realizadas

- No se hizo commit.
- No se hizo push.
- No se creó pull request.
- No se hizo deploy.
- No se ejecutó instalación de dependencias.
- No se modificó infraestructura.
- No se modificó Supabase ni sus migraciones.
- No se modificaron variables de entorno.
- No se incluyeron secretos en este informe.
