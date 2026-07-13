# 67_ROUTES_WIREFRAMES_AND_COMPONENT_INVENTORY.md

## 1. Purpose

This document provides low-fidelity wireframes, route inventory, and component inventory for OpenCode and design implementation.

These are structural specifications, not final pixel-perfect mockups.

---

## 2. Customer mobile home wireframe

```text
┌─────────────────────────────────────┐
│ MPHO        Saltillo ▼       Cart 1 │
├─────────────────────────────────────┤
│ Regalos preparados y entregados     │
│ por MPHO en Saltillo                │
│                                     │
│ EL REGALO CORRECTO, SIN PERDER      │
│ HORAS BUSCÁNDOLO                    │
│ HADIA encuentra opciones...         │
│ [ Encontrar mi regalo ]             │
│ [ Explorar regalos ]                │
│                                     │
│ [ Premium gift visual ]             │
├─────────────────────────────────────┤
│ ¿Para quién buscas un regalo?       │
│ [Pareja] [Mamá] [Papá] [Amistad]   │
│ [ Describe lo que buscas...       ] │
│ [ Pedir ayuda a HADIA ]             │
├─────────────────────────────────────┤
│ Lo necesitas hoy                    │
│ [ MPHORA product cards → ]          │
├─────────────────────────────────────┤
│ Regalos por ocasión                 │
│ [ cards grid ]                      │
├─────────────────────────────────────┤
│ Preparado cerca. Coordinado MPHO.   │
│ [ quality/process visuals ]         │
├─────────────────────────────────────┤
│ Inicio Explorar  HADIA Pedidos Perfil│
└─────────────────────────────────────┘
```

---

## 3. Customer product wireframe

```text
┌─────────────────────────────────────┐
│ ← Regalos                 ♡   Cart  │
├─────────────────────────────────────┤
│ [ Product gallery ]                 │
│                                     │
│ Ramo Amanecer                       │
│ $899 MXN                            │
│ MPHORA disponible                   │
│ Entrega estimada 6–7 p. m.          │
│                                     │
│ Incluye                             │
│ - Flores seleccionadas              │
│ - Chocolates                        │
│ - Tarjeta                           │
│                                     │
│ Personaliza                         │
│ [ Mensaje ] [ Color ] [ Extras ]    │
│                                     │
│ Preparación local MPHO              │
│ [ Agregar al carrito ]              │
└─────────────────────────────────────┘
```

---

## 4. Customer HADIA wireframe

```text
┌─────────────────────────────────────┐
│ ← HADIA                    Cart     │
├─────────────────────────────────────┤
│ Busquemos el regalo correcto        │
│                                     │
│ HADIA: ¿Para quién es?              │
│ [Pareja] [Mamá] [Amigo] [Otra]      │
│                                     │
│ User: Para mi esposa...             │
│                                     │
│ Presupuesto: $1,000                 │
│ Fecha: Hoy                          │
│ Zona: Saltillo                      │
├─────────────────────────────────────┤
│ Recomendaciones                     │
│ [ image ] Ramo Amanecer             │
│ $899 · MPHORA                       │
│ Por qué: entra en presupuesto...    │
│ [Ver] [Agregar]                     │
├─────────────────────────────────────┤
│ [ Escribe o responde... ]    [↑]    │
└─────────────────────────────────────┘
```

---

## 5. Customer order wireframe

```text
┌─────────────────────────────────────┐
│ ← Pedido MPHO-1042                  │
├─────────────────────────────────────┤
│ TU REGALO ESTÁ EN PREPARACIÓN       │
│ Próximo paso: quedará listo          │
│ Ventana: 6:00–7:00 p. m.            │
│                                     │
│ ✓ Pago confirmado                   │
│ ✓ Preparación coordinada            │
│ ● En preparación                    │
│ ○ Listo para entrega                │
│ ○ Va en camino                      │
│ ○ Entregado                         │
├─────────────────────────────────────┤
│ [Gift summary]                      │
│ [Recipient and address summary]     │
│ [Necesito ayuda]                    │
└─────────────────────────────────────┘
```

---

## 6. Partner mobile home wireframe

```text
┌─────────────────────────────────────┐
│ MPHO Aliados           Alerts 2     │
│ Abierto · Capacidad 4/6             │
│ MPHORA activo                       │
├─────────────────────────────────────┤
│ [2 Ofertas] [3 Preparar]            │
│ [1 Paquete] [2 Listos]              │
│ [$1,840 Por pagar]                  │
├─────────────────────────────────────┤
│ PRIORIDAD                           │
│ MPHO-1042 · Preparar ramo           │
│ 48 min restantes · $185             │
│ [Comenzar]                          │
│                                     │
│ MPHO-1048 · Paquete esperado        │
│ [Escanear recepción]                │
├─────────────────────────────────────┤
│ Inicio Pedidos Paquetes Ganancias Más│
└─────────────────────────────────────┘
```

---

## 7. Partner task wireframe

```text
┌─────────────────────────────────────┐
│ ← MPHO-1042              Incidente  │
├─────────────────────────────────────┤
│ Preparación · vence 5:15 p. m.      │
│ Ganancia: $185                      │
│                                     │
│ Checklist                           │
│ ☑ Producto correcto                 │
│ ☑ Tarjeta revisada                  │
│ ☐ Envoltura premium                 │
│ ☐ Chocolates incluidos              │
│ ☐ Evidencia final                   │
│                                     │
│ [Abrir cámara]                      │
│ [Marcar listo] disabled             │
└─────────────────────────────────────┘
```

---

## 8. Central desktop wireframe

```text
┌──────────────┬──────────────────────────────────────────────┐
│ MPHO Central │ Resumen                       Alerts 5 User  │
│              ├──────────────────────────────────────────────┤
│ Resumen      │ [Pedidos activos] [En riesgo] [Ventas]      │
│ Operación    │ [Margen] [Entregas] [Incidentes]            │
│ Pedidos      ├──────────────────────────────────────────────┤
│ Aliados      │ Embudo operativo                             │
│ Catálogo     │ Paid 12 → Assigned 8 → Preparing 5 → ...    │
│ Inventario   ├──────────────────────────────────────────────┤
│ Entregas     │ Alertas prioritarias                         │
│ Clientes     │ P0 Pago duplicado · Owner · 4 min           │
│ HADIA        │ P1 Courier missing · MPHO-1042 · 11 min     │
│ MPHORA       ├──────────────────────────────────────────────┤
│ Pagos        │ Mapa / capacidad / delivery risk             │
│ Reembolsos   ├──────────────────────────────────────────────┤
│ Payouts      │ Finanzas y reconciliación                    │
│ Incidentes   │                                               │
│ Seguridad    │                                               │
└──────────────┴──────────────────────────────────────────────┘
```

---

## 9. Route ownership

Each route should declare:

```text
app
route
audience
auth_required
role
data_classification
cache_policy
indexing
primary_action
analytics
tests
```

---

## 10. Customer component inventory

```text
CustomerHeader
MobileBottomNav
LocationSelector
Hero
HadiaEntry
OccasionChips
MphoraSection
ProductGrid
ProductCard
ProductGallery
AvailabilityBadge
PriceBreakdown
PersonalizationBuilder
RecipientForm
DeliveryForm
CheckoutProgress
PaymentStatus
OrderTimeline
InstallPrompt
NotificationEducation
RedMphoTrustSection
SupportEntry
```

---

## 11. Partner component inventory

```text
PartnerHeader
PartnerBottomNav
AvailabilityControl
CapacityControl
UrgentTaskCard
OfferCard
OfferCountdown
EarningBreakdown
PackageScanner
ReceiptWizard
PreparationChecklist
EvidenceCapture
UploadQueue
HandoffVerifier
IncidentLauncher
EarningsLedger
OfflineBanner
SyncStatus
```

---

## 12. Central component inventory

```text
CentralSidebar
CentralMobileNav
MetricCard
OperationsFunnel
ExceptionTable
FilterBar
OrderSidePanel
PartnerReviewPanel
CatalogPreview
InventoryAdjustmentDialog
DeliveryMap
RefundReview
PayoutApproval
LedgerView
AuditTimeline
IncidentCommanderPanel
SecurityAlert
FeatureFlagControl
StepUpDialog
```

---

## 13. Shared component inventory

```text
Button
IconButton
Input
Textarea
Select
Combobox
Checkbox
Radio
Switch
DatePicker
TimeWindowPicker
AddressAutocomplete
MapPicker
Badge
Status
Card
Dialog
Drawer
Sheet
Tabs
Accordion
Toast
Alert
Skeleton
EmptyState
ErrorState
FileUploader
CameraCapture
Money
DateTime
Progress
Timeline
Pagination
Table
```

---

## 14. Screen-state requirement

Every screen must define:

```text
loading
success
empty
partial
offline
permission_denied
validation_error
provider_error
server_error
expired
unauthorized
maintenance
```

No design is approved with only the happy path.

---

## 15. Route naming

Customer routes use readable Spanish slugs where beneficial for public pages.

Internal apps may use stable Spanish or English route conventions, but must be consistent.

Order URLs should use a public order number or opaque safe identifier, never sequential database IDs alone.

---

## 16. Acceptance criteria

- Every route has an owner and permission.
- Every route has cache and indexing policy.
- Every critical screen has a low-fidelity wireframe.
- Components are shared intentionally.
- No customer component requires partner identity.
- OpenCode can implement screens without inventing navigation.
