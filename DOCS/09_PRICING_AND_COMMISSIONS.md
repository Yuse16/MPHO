# 09_PRICING_AND_COMMISSIONS.md

## 1. Purpose

This document defines the pricing framework for MPHO.

It explains:

- How customer prices are built.
- How partner earnings are calculated.
- How MPHO revenue is calculated.
- How delivery is priced.
- How external-product risk is handled.
- How discounts, refunds, and adjustments affect money.
- Which values are configurable.
- Which numbers are examples only.

This document does not approve final commercial rates.

All production values must come from configuration or signed commercial agreements.

---

## 2. Pricing principles

MPHO pricing must be:

- Clear.
- Traceable.
- Configurable.
- Fair to partners.
- Sustainable for MPHO.
- Understandable to customers.
- Adaptable by city and zone.
- Based on real costs.
- Protected against duplication.
- Auditable.

---

## 3. Money-storage rule

Store money in integer minor units.

Example:

```text
$785.00 MXN
→ 78500 centavos
```

Every monetary record must include:

- Amount.
- Currency.
- Type.
- Order.
- Actor.
- Status.
- Timestamp.

Do not use floating-point values for trusted calculations.

---

## 4. Customer price formula

General formula:

```text
product_subtotal
+ add_ons
+ preparation_fee
+ wrapping_fee
+ personalization_fee
+ delivery_fee
+ mpho_service_fee
+ payment_related_charge_when_allowed
+ taxes
- discounts
= customer_total
```

Not every order must use every line.

---

## 5. Internal order economics

Internal formula:

```text
customer_total
- taxes_collected
- product_cost
- partner_product_earning
- partner_service_earning
- courier_cost
- payment_processing_cost
- discount_cost
- refund_cost
- incident_cost
= contribution_margin
```

The platform must distinguish:

- Estimated values.
- Confirmed values.
- Final values.

---

## 6. Pricing ownership

Each price must identify who controls it.

Possible owners:

- MPHO.
- Partner.
- External provider.
- Delivery provider.
- Payment provider.
- Tax configuration.

Example:

| Price component | Possible owner |
|---|---|
| Local product supply price | Partner |
| Customer product price | MPHO or partner agreement |
| External product cost | External provider |
| Preparation labor | Partner agreement |
| Delivery cost | Courier/provider |
| MPHO service fee | MPHO |
| Payment fee | Payment provider |
| Discount | Campaign funding source |

---

## 7. Local-product pricing models

## 7.1 Commission model

The partner establishes or approves the customer product price.

Formula:

```text
partner_product_price
- marketplace_commission
= partner_product_earning
```

Use when:

- Partner owns the product.
- Partner manages cost.
- MPHO brings demand.

## 7.2 Wholesale model

Partner gives MPHO a supply price.

Formula:

```text
customer_product_price
- partner_supply_price
= product_margin
```

Use when:

- MPHO controls retail presentation.
- Price-risk terms are clear.

## 7.3 Hybrid model

A fixed partner earning plus MPHO service fee.

Formula:

```text
customer_product_price
= partner_agreed_amount + mpho_product_margin
```

## 7.4 Bundle model

The customer buys one bundle price.

Internally, the bundle must still split into:

- Product.
- Preparation.
- Add-ons.
- Partner earnings.
- MPHO revenue.
- Delivery.

---

## 8. External-product pricing

An external-product price may include:

```text
observed_external_price
+ external_shipping
+ external_price_buffer
+ receiving_fee
+ inspection_fee
+ wrapping_and_preparation
+ delivery
+ mpho_service_fee
= customer_total
```

The buffer exists for operational risk, not as a hidden false price.

Possible risks:

- External price change.
- Shipping change.
- Cancellation.
- Delay.
- Return.
- Damage.
- Replacement.

The customer should know the product is by order.

---

## 9. External-price validation

Each external product should record:

- Observed price.
- Currency.
- Source.
- Source URL.
- Validation date.
- Expiration date.
- Availability status.

If the observed price expires before purchase:

- Revalidate.
- Update customer total.
- Request approval if the customer already initiated checkout.
- Do not silently absorb a large uncontrolled difference.

---

## 10. Partner service pricing

Partner service types may include:

```text
package_reception
package_inspection
basic_wrapping
premium_wrapping
gift_assembly
personalization_text
personalization_qr
evidence_capture
temporary_storage
courier_handoff
own_delivery
```

Each service price may depend on:

- City.
- Zone.
- Partner.
- Product size.
- Product fragility.
- Preparation complexity.
- Urgency.
- Material used.
- Required time.
- Storage duration.

---

## 11. Wrapping pricing

Wrapping may be:

- Basic.
- Standard.
- Premium.
- Custom.

Pricing components may include:

- Material.
- Labor.
- Box.
- Paper.
- Ribbon.
- Decorative elements.
- Card.
- Special handling.

The customer-facing option should clearly state what is included.

---

## 12. Personalization pricing

Possible personalization:

- Printed card.
- Handwritten card.
- QR audio.
- QR video.
- Name.
- Color selection.
- Custom decoration.
- Engraving coordination.

Pricing should reflect:

- Material.
- Labor.
- Third-party cost.
- Revision allowance.
- Irreversibility.

---

## 13. Delivery pricing

Delivery may be priced by:

- Exact provider quote.
- Zone.
- Distance.
- Time.
- Urgency.
- Package size.
- Fragility.
- Weather or availability.
- Partner own-delivery rate.

Possible formula:

```text
base_delivery
+ distance_adjustment
+ urgency_adjustment
+ handling_adjustment
+ coordination_fee
= customer_delivery_price
```

The internal courier cost and customer delivery price must remain separate.

---

## 14. MPHORA pricing

MPHORA may include:

- Fast-preparation fee.
- Priority handling.
- Higher courier cost.
- Short-window surcharge.

MPHORA pricing must be shown before payment.

Do not use urgency fees when no extra operational effort or cost exists.

---

## 15. MPHO service fee

The MPHO service fee may pay for:

- Platform.
- Discovery.
- HADIA.
- Order coordination.
- Partner assignment.
- Tracking.
- Notifications.
- Customer support.
- Exception management.

Possible structures:

- Fixed.
- Percentage.
- Tiered by order value.
- Tiered by complexity.
- Reduced for repeat customers.
- Included inside a bundle.

No structure is final until tested.

---

## 16. Minimum order

A minimum order may be required when:

- Delivery cost is too large relative to value.
- Payment fees create negative margins.
- Partner labor exceeds economic value.
- MPHORA operations require a minimum.

Minimums may vary by zone and service type.

---

## 17. Maximum order

High-value orders may require:

- Manual review.
- Stronger payment verification.
- Special insurance.
- Special partner approval.
- Delivery controls.
- Different cancellation rules.

Maximum automated order value should be configurable.

---

## 18. Taxes

Tax handling depends on legal structure.

The system must support:

- Tax-inclusive prices.
- Tax-exclusive internal records when required.
- Invoices or receipts when required.
- Tax identity.
- Separate tax lines.
- Partner tax information.

No tax behavior should be assumed without professional review.

---

## 19. Discounts

Discount types:

- Fixed amount.
- Percentage.
- Free delivery.
- Reduced service fee.
- Bundle discount.
- Partner-funded promotion.
- MPHO-funded promotion.
- Shared promotion.
- Referral credit.

Each discount must define:

- Funding source.
- Start.
- End.
- Limits.
- Eligible products.
- Eligible zones.
- Minimum purchase.
- Maximum discount.
- First-order restriction.
- Effect on partner earnings.

---

## 20. Discount funding rules

### MPHO-funded

Partner earnings remain unchanged unless documented otherwise.

### Partner-funded

The partner's earning is reduced by the agreed amount.

### Shared-funded

The reduction is split according to configured percentages.

The ledger must show the funding source.

---

## 21. Promo-code rules

Promo codes should support:

- Unique code.
- Campaign.
- Usage limit.
- Customer limit.
- Expiration.
- Eligible products.
- Eligible zones.
- Minimum order.
- Maximum discount.
- Funding source.

Promo validation must occur on the server.

---

## 22. Partner earnings formula

Example structure:

```text
partner_product_earning
+ reception_earning
+ inspection_earning
+ wrapping_earning
+ preparation_earning
+ personalization_earning
+ own_delivery_earning
+ bonus
- partner_funded_discount
- approved_adjustment
= partner_net_earning
```

Do not subtract MPHO costs from partner earnings unless agreed.

---

## 23. MPHO revenue formula

Possible structure:

```text
marketplace_commission
+ product_margin
+ mpho_service_fee
+ preparation_margin
+ personalization_margin
+ delivery_coordination_margin
+ mphora_fee
- mpho_funded_discount
- refund_impact
- incident_cost
= mpho_net_revenue_before_overhead
```

This is not the same as contribution margin.

---

## 24. Payment processing

Payment processing cost should be recorded separately.

Possible treatment:

- Included in MPHO service fee.
- Included in product pricing.
- Included in total economics.
- Passed through only when legally and commercially appropriate.

The customer should not see confusing duplicate charges.

---

## 25. Earnings states

Partner earnings may use:

```text
estimated
pending
approved
payable
paid
reversed
disputed
adjusted
```

Definitions:

### Estimated

Calculated before fulfillment completes.

### Pending

Order activity occurred, but release conditions are incomplete.

### Approved

Amount has been validated.

### Payable

Ready for payout.

### Paid

Included in a completed payout.

### Reversed

Removed due to cancellation, refund, or correction.

### Disputed

Under review.

### Adjusted

Corrected through a separate auditable movement.

---

## 26. Payout calculation

Payout formula:

```text
approved_payable_earnings
+ bonuses
+ positive_adjustments
- authorized_negative_adjustments
- prior_overpayment_recovery
= payout_total
```

Every payout must have:

- Partner.
- Period.
- Currency.
- Line items.
- Total.
- Payment reference.
- Payment date.
- Status.

---

## 27. Payout timing

Potential schedules:

- Weekly.
- Biweekly.
- Monthly.
- Minimum-balance based.
- Per-order for selected arrangements.

Timing must consider:

- Delivery completion.
- Refund window.
- Payment settlement.
- Fraud risk.
- Partner cash-flow needs.

No schedule is final until approved.

---

## 28. Cancellation financial rules

The financial effect depends on stage.

### Before payment

No charge.

### Paid, not accepted

Potential full refund.

### Accepted, not prepared

Possible committed service cost.

### Personalized

Possible non-refundable labor and materials.

### External product purchased

Depends on external cancellation and return.

### Courier dispatched

Delivery cost may be non-refundable.

Each cancellation must identify:

- Customer refund.
- Partner earning.
- Courier earning.
- MPHO revenue.
- External cost.

---

## 29. Refund allocation

Refund causes should determine who absorbs the cost.

Examples:

### Partner stock error

Possible impact:

- Customer refund.
- Partner earning reversal.
- Partner incident record.
- MPHO may absorb processing fee.

### Courier failure

Possible impact:

- Delivery refund.
- Courier dispute.
- Product recovery cost.

### Customer address error

Possible impact:

- New delivery fee.
- Limited refund.
- Partner preparation still payable.

### External provider delay

Possible impact:

- External purchase recovery.
- Customer cancellation.
- Partner reception fee only if work occurred.

Final responsibility rules require approved policy.

---

## 30. Adjustments

Adjustments must be separate ledger entries.

Never silently rewrite:

- Original partner earning.
- Original customer total.
- Original payout.

Adjustment fields:

- Type.
- Reason.
- Amount.
- Currency.
- Actor.
- Approval.
- Related order.
- Related payout.
- Timestamp.

---

## 31. Rounding

Rounding rules must be consistent.

Recommended:

- Calculate in minor units.
- Round only at defined boundaries.
- Avoid repeated percentage rounding.
- Preserve original provider amounts.
- Reconcile displayed and charged total.

---

## 32. Currency

MVP currency:

- Expected initial currency: MXN.

The system should still store currency explicitly.

Do not support multi-currency behavior until documented.

---

## 33. Example only: local order

The following values are examples, not approved production pricing.

```text
Local product:               $500
Preparation and wrapping:     $90
Delivery:                     $85
MPHO service:                 $75
Customer total:              $750
```

Possible internal distribution:

```text
Partner product earning:     $420
Partner preparation earning:  $70
Courier cost:                 $85
Payment cost:                 $25
MPHO remaining amount:       $150
```

The final contribution margin still depends on taxes, discounts, incidents, and actual costs.

---

## 34. Example only: external order

The following values are examples only.

```text
External product:            $420
External shipping:             $0
Reception and inspection:     $30
Wrapping:                      $70
Delivery:                      $85
MPHO service:                 $80
Customer total:              $685
```

Possible partner earning:

```text
Reception and inspection:     $30
Wrapping:                      $60
Total partner earning:        $90
```

Actual rates must come from partner agreement and configuration.

---

## 35. Pricing configuration hierarchy

A pricing rule may be defined at:

```text
global
→ country
→ city
→ zone
→ partner
→ category
→ product
→ service
→ campaign
→ order override with approval
```

The most specific approved rule may take precedence.

The system must record which rule produced the price.

---

## 36. Price-versioning

When prices change:

- Do not alter historical orders.
- Create a new effective version.
- Store start date.
- Store end date when applicable.
- Store actor.
- Store reason.
- Preserve old version.

---

## 37. Checkout price lock

A quoted price may have an expiration.

The system should define:

- Quote creation time.
- Quote expiration.
- External price expiration.
- Delivery quote expiration.
- Stock reservation expiration.

If the quote expires:

- Recalculate.
- Show changes.
- Require customer confirmation.

---

## 38. Profitability controls

The system should detect:

- Negative margin.
- Missing cost.
- Missing partner rate.
- Missing delivery cost.
- Expired external price.
- Unconfigured fee.
- Excessive discount.
- High refund risk.

Orders with invalid economics should not proceed automatically.

---

## 39. Pricing governance

Price changes should require:

- Authorized role.
- Effective date.
- Reason.
- Affected scope.
- Margin impact.
- Partner impact.
- Customer impact.
- Documentation.

Sensitive overrides should require approval.

---

## 40. MVP pricing recommendation

For the MVP:

- Use simple pricing rules.
- Keep one responsible partner per order.
- Show clear customer totals.
- Store detailed internal line items.
- Record actual delivery cost.
- Record partner earnings separately.
- Allow manual approved adjustments.
- Use auditable manual payouts if needed.
- Avoid complex automatic split payment.
- Calculate contribution margin for every completed order.
- Test rates with real orders before scaling.

---

## 41. Summary

MPHO pricing must support three goals simultaneously:

1. The customer understands the value.
2. The partner receives fair and transparent earnings.
3. MPHO maintains sustainable unit economics.

No price should exist only as an unexplained total.

Every order must be reconstructable from its pricing rules, costs, earnings, discounts, refunds, and adjustments.
