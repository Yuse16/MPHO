# 45_EXTERNAL_PRODUCTS_AND_THIRD_PARTY_MARKETPLACES.md

## 1. Status

```text
INTERNAL EXTERNAL-PURCHASE POLICY REQUIREMENTS
NOT READY FOR PUBLICATION
LEGAL, TAX, CONSUMER, IP, SECURITY, AND OPERATIONS REVIEW REQUIRED
```

This document governs products obtained from a third-party seller or marketplace before preparation by a Punto MPHO.

---

## 2. Core principle

An external product is not MPHO local stock.

The customer must understand:

```text
external seller
→ shipping to Punto MPHO
→ receipt
→ inspection
→ preparation
→ final delivery
```

The system must not hide the external dependency.

---

## 3. Required legal-model decision

Counsel must define whether MPHO acts as:

- Seller.
- Commission agent.
- Purchasing agent for customer.
- Marketplace intermediary.
- Reseller.
- Service provider coordinating a third-party purchase.

This decision affects:

- Invoice.
- consumer responsibility.
- title and risk.
- returns.
- warranty.
- taxes.
- payment.
- disclosure.
- external seller terms.

Do not launch external products until this is decided.

---

## 4. No implied affiliation

MPHO must not state or imply:

- Official Mercado Libre partnership.
- Official Amazon partnership.
- Authorized reseller status.
- Brand authorization.
- Warranty authorization.
- Seller verification beyond actual checks.

Use factual language such as:

> Producto adquirido por pedido a través de un vendedor externo.

The external platform's trademark may be used only as legally permitted and necessary to identify the source.

---

## 5. Approved source model

The MVP should use curated external listings.

Each source record should include:

```text
provider
seller
URL
external listing ID
product snapshot
variant
price
currency
shipping
availability
expected arrival
return policy summary
seller rating source when lawful
validation date
expiration
risk note
authorized receiving address
```

Do not accept arbitrary customer URLs automatically.

---

## 6. User-provided URLs

A customer-provided URL must enter review.

Controls:

- HTTPS.
- approved marketplace.
- SSRF protection.
- no shortened URL without expansion and validation.
- no private-network destination.
- no executable download.
- seller and product review.
- price validation.
- counterfeit risk.
- prohibited category check.
- shipping destination.
- return feasibility.
- legal model.

HADIA must not fetch arbitrary URLs with broad network access.

---

## 7. Quote

External quote should include:

- Product price.
- seller shipping.
- taxes or import cost when known.
- MPHO purchasing or coordination service.
- partner reception and inspection.
- wrapping/personalization.
- final delivery.
- contingency if price changes.
- expiration.
- estimated timeline.
- cancellation conditions.
- return conditions.

The quote must expire.

---

## 8. Exact authorization

Before purchase, the customer should authorize:

- Exact product.
- exact variant.
- seller.
- amount.
- currency.
- shipping.
- receiving Punto MPHO.
- service costs.
- replacement behavior.
- maximum approved price adjustment, if any.

Any material change invalidates approval.

No hidden substitute.

---

## 9. Purchase control

The MVP should require human-reviewed purchase.

Controls:

- Idempotency.
- buyer identity.
- approved source.
- approved amount.
- assigned address.
- provider order reference.
- screenshot or structured receipt.
- payment record.
- audit.
- no repeat purchase on retry.
- no purchase through a customer message alone.

---

## 10. Shipping address

The external seller should ship to the assigned Punto MPHO or approved location.

Do not ship directly to the recipient when the order requires:

- Inspection.
- wrapping.
- personalization.
- assembly.
- verification.

An address change after purchase requires controlled review.

---

## 11. Tracking

Store:

- Provider.
- tracking reference.
- carrier.
- shipped time.
- expected arrival.
- delivery event.
- exception.
- received time.

Do not expose external account credentials.

---

## 12. Receipt and inspection

Partner verifies:

- Package reference.
- visible condition.
- product identity.
- quantity.
- variant.
- visible damage.
- obvious mismatch.

Inspection does not prove:

- Authenticity.
- hidden quality.
- safety.
- full performance.
- manufacturer warranty.

---

## 13. Counterfeit and IP risk

Do not list or purchase when:

- Seller appears unauthorized.
- Price indicates strong counterfeit risk.
- Brand or character merchandise lacks confidence.
- Product violates IP.
- Source is suspicious.
- Customer requests a fake or replica.

If counterfeit is suspected after receipt:

- Quarantine.
- do not deliver.
- preserve evidence.
- contact seller/platform.
- inform customer.
- pursue return/refund.
- open incident.

---

## 14. Product restrictions

External availability does not override MPHO rules.

Block:

- Prohibited categories.
- age-restricted products without approved flow.
- dangerous goods.
- controlled medicines.
- weapons.
- illegal products.
- recalled products.
- unsupported import.
- unsafe electrical products.
- pirated or counterfeit content.

---

## 15. Price change

If price changes before purchase:

- Requote.
- explain.
- obtain approval.
- or cancel and refund.

Do not silently absorb or charge a difference without policy.

After purchase, preserve exact external cost for accounting.

---

## 16. Seller cancellation or delay

Options:

- Wait.
- choose approved alternative.
- change seller.
- cancel.
- refund.
- scheduled later delivery.

Customer must approve a material change.

MPHORA is not available for an external product.

---

## 17. Wrong or damaged product

Flow:

```text
partner receives
→ records evidence
→ pauses preparation
→ opens issue
→ seller return or replacement reviewed
→ customer informed
→ timing and refund options shown
```

Do not hide delay to preserve a promised date.

---

## 18. Returns

Before purchase, determine:

- Return deadline.
- eligible condition.
- packaging requirement.
- return label.
- shipping cost.
- refund destination.
- seller restocking or other cost.
- who performs return.
- who stores product.
- what happens to preparation services.

Return action must be auditable.

---

## 19. Warranty

The customer should receive available information about:

- Manufacturer.
- seller.
- proof of purchase.
- warranty conditions.
- who assists.
- limitations.

MPHO must not promise manufacturer warranty without evidence.

---

## 20. Refund destination

External seller refund may return to:

- MPHO purchasing account.
- customer.
- provider.
- another authorized account.

The legal and accounting model must define this.

MPHO should not mark customer refund complete merely because the external seller initiated a refund.

---

## 21. External account security

- Named authorized purchaser.
- MFA.
- no shared password.
- purchasing limits.
- no saved uncontrolled payment method.
- audit.
- seller-message retention.
- payout/refund destination monitoring.
- separate production purchasing account.
- access review.
- no purchase from personal accounts without approved pilot procedure.

---

## 22. Spanish public skeleton

# Política de Productos Externos o por Pedido

Un producto externo no se encuentra en existencia local de MPHO.

Antes de pagar se mostrará:

- Fuente.
- vendedor cuando corresponda.
- producto y variante.
- precio.
- envío.
- vigencia.
- tiempo estimado.
- Punto MPHO receptor.
- servicios de preparación.
- condiciones de cancelación y devolución.

La disponibilidad, precio y fecha del vendedor externo pueden cambiar antes de la compra.

Si ocurre un cambio material, MPHO solicitará autorización o presentará opciones de cancelación y reembolso.

El Punto MPHO revisará la identidad y condición visible del producto al recibirlo.

La inspección no certifica autenticidad, ausencia de defectos ocultos ni garantía del fabricante.

MPHO no está afiliado oficialmente con el mercado o vendedor externo salvo que se indique expresamente y exista una relación autorizada.

---

## 23. Product requirements

- External badge.
- source.
- seller.
- validation time.
- quote expiration.
- exact authorization.
- approved purchase user.
- receiving address.
- tracking.
- package receipt.
- issue workflow.
- return.
- customer notification.
- refund reconciliation.
- no MPHORA.
- no arbitrary URL automation.
