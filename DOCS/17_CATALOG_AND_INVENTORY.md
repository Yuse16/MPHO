# 17_CATALOG_AND_INVENTORY.md

## 1. Purpose

This document defines the MPHO catalog and inventory model.

It explains:

- Catalog entities.
- Product sources.
- Listings.
- Variants.
- Bundles.
- Services.
- Personalization.
- Inventory.
- Availability.
- Reservations.
- External products.
- MPHORA eligibility.
- Product publication.
- Pricing references.
- Data quality.
- Audit requirements.

This document is the source of truth for how products and availability are represented.

---

## 2. Catalog principles

The MPHO catalog must be:

- Curated.
- Truthful.
- Operationally fulfillable.
- Clear about source.
- Clear about timing.
- Clear about personalization.
- Clear about price.
- Clear about restrictions.
- Organized for search and HADIA.
- Safe for partner execution.

A large inaccurate catalog is worse than a small reliable catalog.

---

## 3. Catalog item types

Official item types:

```text
product
service
bundle
add_on
```

### Product

A physical item.

### Service

A non-product task or charge.

Examples:

- Wrapping.
- Reception.
- Inspection.
- Personalization.
- Delivery.

### Bundle

A predefined combination of products and services.

### Add-on

An optional additional item or service.

---

## 4. Product source types

Official source types:

```text
partner_local
external_curated
mpho_owned_future
```

### Partner local

Supplied by a partner.

### External curated

Obtained from an external provider after customer order.

### MPHO owned future

Inventory owned by MPHO in a future phase.

The MVP does not require MPHO-owned inventory.

---

## 5. Catalog architecture

Recommended conceptual structure:

```text
Catalog item
→ Product or service definition
→ Listing
→ Partner offer or external source
→ Variants
→ Options
→ Add-ons
→ Availability
→ Inventory
→ Pricing
→ Media
→ Categories
→ Tags
```

A product definition and a partner listing should not be the same entity when multiple partners may supply similar products.

---

## 6. Product definition

A product definition describes what the item is.

Fields may include:

- ID.
- Name.
- Slug.
- Description.
- Category.
- Brand when relevant.
- Product type.
- Attributes.
- Dimensions.
- Weight.
- Fragility.
- Perishability.
- Handling requirements.
- Restricted status.
- Publication status.

---

## 7. Listing

A listing represents how an item is sold in MPHO.

Fields may include:

- Listing ID.
- Product definition ID.
- Partner ID or external source ID.
- Source type.
- Customer-facing title.
- Customer-facing description.
- Images.
- Base price.
- Currency.
- Preparation time.
- Availability mode.
- City.
- Zone.
- Publication state.
- Last verified.
- Validity window.
- MPHORA eligibility.
- Cancellation notes.
- Substitution policy.

---

## 8. Variant

A variant is a specific purchasable version.

Examples:

- Size.
- Color.
- Flavor.
- Flower count.
- Box type.
- Mug design.

Variant fields:

- Variant ID.
- Listing ID.
- Name.
- SKU.
- Attributes.
- Price adjustment.
- Stock.
- Image.
- Active state.

---

## 9. Option

An option customizes the product without necessarily creating a separate SKU.

Examples:

- Ribbon color.
- Card style.
- Message type.
- Surprise mode.

Option fields:

- Name.
- Values.
- Required or optional.
- Price adjustment.
- Compatibility.
- Customer-facing label.

---

## 10. Add-on

An add-on may be:

- Chocolate.
- Balloon.
- Card.
- QR message.
- Premium wrapping.
- Small accessory.

Add-on rules:

- Must be compatible with responsible partner.
- Must have real availability.
- Must have clear price.
- Must not force a second partner in the MVP.
- Must affect preparation time when relevant.

---

## 11. Bundle

A bundle should define:

- Included items.
- Quantities.
- Default services.
- Optional variants.
- Add-ons.
- Preparation instructions.
- Partner compatibility.
- Customer price.
- Internal cost allocation.
- Substitution rules.

Bundles should be operationally repeatable.

---

## 12. Service catalog

Service types may include:

```text
basic_wrapping
premium_wrapping
gift_assembly
card_printing
handwritten_card
qr_audio
qr_video
package_reception
package_inspection
temporary_storage
courier_handoff
local_delivery
```

Each service may have:

- Partner capability requirement.
- Price.
- Cost.
- Duration.
- Restrictions.
- Evidence requirement.
- Availability.

---

## 13. Category hierarchy

Possible hierarchy:

```text
Occasion
Recipient
Product category
Style
Budget
Delivery type
```

Product categories may include:

- Flowers.
- Chocolates.
- Balloons.
- Mugs.
- Plush toys.
- Gift boxes.
- Personalized items.
- Desserts.
- Beauty.
- Accessories.
- Small electronics.

Categories must support:

- Search.
- HADIA.
- Filters.
- Analytics.
- Restricted-product rules.

---

## 14. Occasion taxonomy

Examples:

- Birthday.
- Anniversary.
- Love.
- Thank you.
- Congratulations.
- Graduation.
- Recovery.
- Mother's Day.
- Father's Day.
- Christmas.
- Corporate.
- Just because.

An item may belong to multiple occasions.

---

## 15. Recipient taxonomy

Examples:

- Partner.
- Spouse.
- Friend.
- Parent.
- Child.
- Coworker.
- Client.
- Employee.
- Teacher.
- General.

Avoid sensitive profiling.

---

## 16. Product tags

Tags may describe:

- Romantic.
- Elegant.
- Fun.
- Useful.
- Premium.
- Minimal.
- Local.
- Personalized.
- Same day.
- Budget-friendly.

Tags must be controlled enough to avoid inconsistency.

---

## 17. Publication states

Official states:

```text
draft
submitted
under_review
changes_requested
approved
published
paused
rejected
archived
```

Rules:

- Only published listings are customer-visible.
- Paused items remain in history.
- Archived items remain linked to historical orders.
- Rejected items require a reason.

---

## 18. Product-review workflow

```text
Partner submits
→ MPHO reviews
→ data quality checked
→ images checked
→ pricing checked
→ category checked
→ capability checked
→ approved
→ published
```

Possible review outcomes:

- Approve.
- Request changes.
- Reject.
- Restrict to selected zones.
- Restrict from MPHORA.

---

## 19. Image requirements

Images should:

- Match the real product.
- Have authorized usage.
- Be sufficiently clear.
- Avoid misleading scale.
- Avoid unrelated backgrounds when possible.
- Show important details.
- Identify illustrative images.

Recommended image set:

- Main front view.
- Side or size context.
- Included-items view.
- Personalization example.
- Packaging example.

---

## 20. Description requirements

A listing description should explain:

- What it is.
- What is included.
- Approximate size.
- Available variants.
- Expected variation.
- Preparation time.
- Personalization.
- Important restrictions.
- Source type.

Do not use copied external descriptions without permission.

---

## 21. Availability modes

Official modes:

```text
tracked_stock
partner_confirmation
scheduled_capacity
external_by_order
unavailable
```

### Tracked stock

The system stores quantity.

### Partner confirmation

The partner confirms availability when an order is offered.

### Scheduled capacity

Availability depends on preparation slots.

### External by order

Requires acquisition from external provider.

### Unavailable

Not currently sellable.

---

## 22. Inventory quantities

For tracked stock:

```text
on_hand
reserved
available
damaged
safety_stock
incoming
```

Recommended formula:

```text
available = on_hand - reserved - damaged - safety_stock
```

Never calculate available stock only in the frontend.

---

## 23. Inventory ownership

Inventory may belong to:

- Partner.
- MPHO in future.
- External provider.

External provider availability is not MPHO inventory.

Do not place external products inside local on-hand stock before physical receipt.

---

## 24. Stock reservation

Reservation may occur after:

- Verified payment.
- Partner acceptance.
- Or a short quote lock when approved.

Reservation data:

- Order.
- Variant.
- Quantity.
- Reserved at.
- Expires at.
- Status.
- Released at.
- Fulfilled at.

Reservation operations must be idempotent.

---

## 25. Reservation states

Possible states:

```text
active
released
consumed
expired
cancelled
```

Rules:

- Active reservation reduces availability.
- Cancelled order releases reservation.
- Fulfilled order consumes reservation.
- Expired quote releases temporary reservation.

---

## 26. Inventory adjustment

Adjustment fields:

- Partner.
- Product.
- Variant.
- Quantity change.
- Reason.
- Actor.
- Timestamp.
- Related order.
- Evidence when required.

Reason codes:

```text
restock
external_sale
damage
correction
return
reservation_release
order_fulfillment
expired_product
other
```

---

## 27. Low stock

Each variant may define:

- Low-stock threshold.
- Out-of-stock threshold.
- Reorder note.
- Alert preference.

Low-stock alerts should not automatically purchase inventory.

---

## 28. Stale stock

Stock becomes stale when not confirmed within an approved period.

Possible behavior:

- Reduce confidence.
- Require partner confirmation.
- Pause MPHORA.
- Hide exact availability.
- Create partner task.

Stale stock must not appear as confirmed stock.

---

## 29. Partner confirmation

When availability uses partner confirmation:

- Offer must ask for confirmation.
- Confirmation has an expiration.
- Actor and time are recorded.
- Confirmation may reserve stock.
- False confirmation creates an incident.

---

## 30. External product records

An external product should include:

- Provider.
- Source URL.
- External listing ID when available.
- Observed price.
- Currency.
- Shipping estimate.
- Validation date.
- Expiration.
- Product image reference.
- Product description.
- Return conditions.
- Risk notes.
- Receiving requirements.
- Prohibited or restricted status.

---

## 31. External price expiration

External pricing must have a validity period.

When expired:

- Revalidate before checkout.
- Recalculate quote.
- Inform customer of changes.
- Require confirmation.
- Do not create purchase from stale price.

---

## 32. External purchase relation

Once purchased, store:

- MPHO order.
- External provider.
- External order reference.
- Purchase amount.
- Shipping amount.
- Purchase time.
- Tracking.
- Expected arrival.
- Assigned partner.
- Receipt status.
- Return status.

---

## 33. Product received from external provider

After physical receipt:

- Record package.
- Record condition.
- Record quantity.
- Record partner.
- Record photos.
- Link to order.
- Do not convert automatically into reusable partner stock.

The item belongs to the customer order unless another rule exists.

---

## 34. MPHORA eligibility

MPHORA eligibility requires:

- Published listing.
- Local source.
- Active partner.
- Confirmed stock.
- Valid zone.
- Partner open.
- Capacity.
- Preparation within limit.
- Delivery option.
- Cutoff not passed.
- No blocking incident.

Eligibility should be recalculated when any input changes.

---

## 35. MPHORA fields

Possible fields:

- Eligible.
- Eligibility reason.
- Eligible zones.
- Preparation minutes.
- Cutoff.
- Maximum active orders.
- Delivery window.
- Last calculated.
- Expires at.

Do not store only a permanent boolean.

---

## 36. Product compatibility

Compatibility rules may include:

- Add-on available from same partner.
- Bundle fits package size.
- Personalization supported.
- Delivery supports fragility.
- Product allowed in zone.
- Product allowed for selected date.
- Product compatible with MPHORA.

The cart must validate compatibility.

---

## 37. One-partner constraint

In the MVP:

- All local items and services in one order must be fulfillable by one responsible partner.
- External product must be received by that same responsible partner.
- Add-ons must come from the same partner or be part of the external package.

If not possible:

- Suggest separate orders.
- Suggest compatible alternatives.
- Block checkout.

---

## 38. Personalization data

A personalization definition should include:

- Type.
- Label.
- Required.
- Allowed values.
- Character limit.
- File requirements.
- Price.
- Preparation impact.
- Capability requirement.
- Irreversibility.
- Evidence requirement.

---

## 39. Product substitutions

A listing may define:

```text
no_substitution
customer_approval_required
preapproved_equivalent
partner_choice_with_limits
```

MVP recommendation:

Use customer approval for meaningful substitutions.

Substitution data:

- Original.
- Replacement.
- Reason.
- Price difference.
- Timing difference.
- Approval.
- Actor.
- Timestamp.

---

## 40. Pricing references

The catalog may store display prices, but trusted pricing should come from pricing rules.

A listing may include:

- Base product price.
- Starting price.
- Partner supply price.
- Customer price.
- Variant adjustment.
- Add-on price.
- Service price.

The checkout must recalculate server-side.

---

## 41. Product availability response

A product availability service should return:

```text
is_available
availability_type
partner_id
zone_id
quantity
preparation_time
delivery_estimate
mphora_eligible
quote_expires_at
blocking_reason
```

Do not return only `true` or `false`.

---

## 42. Search index

Search data may include:

- Name.
- Description.
- Category.
- Occasion.
- Recipient.
- Tags.
- Style.
- Partner area.
- Availability.
- Price range.
- Delivery type.

Search index must exclude:

- Unpublished listings.
- Restricted items.
- Stale external prices when policy requires.
- Suspended partners.

---

## 43. HADIA catalog contract

HADIA should receive structured product data.

Minimum fields:

- Product ID.
- Name.
- Occasion.
- Recipient tags.
- Price.
- Availability.
- Delivery type.
- Delivery estimate.
- Zone.
- Personalization.
- Reasonable recommendation attributes.
- Restrictions.

HADIA must not receive hidden or invalid listings.

---

## 44. Catalog quality checks

Automated checks may include:

- Missing image.
- Missing description.
- Missing price.
- Missing category.
- Missing source.
- Missing partner.
- Missing preparation time.
- Expired verification.
- Duplicate title.
- Unsupported category.
- External URL missing.
- MPHORA without eligibility.

---

## 45. Catalog governance

MPHO may:

- Standardize titles.
- Correct spelling.
- Improve descriptions.
- Categorize.
- Add tags.
- Pause inaccurate products.
- Request new images.
- Restrict delivery.
- Remove prohibited items.

Partner ownership of original product data must still be respected.

---

## 46. Historical integrity

When a product changes:

- Historical order item must retain original name.
- Original image reference or snapshot.
- Original price.
- Original options.
- Original personalization.
- Original partner.
- Original source.
- Original terms.

Do not rebuild historical orders from current listing data.

---

## 47. Product snapshots

At checkout, create an order-item snapshot containing:

- Product name.
- Description summary.
- Source.
- Partner.
- Variant.
- Options.
- Image.
- Price.
- Currency.
- Preparation.
- Personalization.
- Terms.

This protects historical accuracy.

---

## 48. Inventory concurrency

Inventory operations must handle concurrent orders.

Use:

- Database transaction.
- Row lock or atomic update.
- Unique reservation.
- Idempotency key.
- Conflict response.

Do not use read-then-write logic without protection.

---

## 49. Inventory reconciliation

Partners should periodically reconcile:

- On hand.
- Reserved.
- Available.
- Damaged.
- Recent adjustments.
- External sales.

Reconciliation should create an audit record.

---

## 50. Expiration and perishability

Perishable products may require:

- Expiration date.
- Preparation cutoff.
- Storage condition.
- Delivery limit.
- Same-day rule.
- Non-returnable condition.

Do not enable categories requiring strict handling without approved rules.

---

## 51. Restricted categories

Until documented, block or manually review:

- Alcohol.
- Prescription medicine.
- Weapons.
- Hazardous materials.
- Controlled substances.
- Live animals.
- High-risk perishables.
- Age-restricted products.
- Cold-chain products.
- Counterfeit products.
- Oversized items.
- Extremely high-value items.

---

## 52. Admin catalog tools

Admin must be able to:

- Search.
- Filter.
- Review.
- Approve.
- Reject.
- Request changes.
- Pause.
- Archive.
- View history.
- View partner.
- View stock.
- View pricing.
- View availability.
- View MPHORA eligibility.
- View external validation.

---

## 53. Partner catalog tools

Partner may:

- Submit product.
- Update stock.
- Update allowed fields.
- Pause.
- View review status.
- Respond to changes requested.
- View product performance.

Partner may not:

- Self-approve restricted product.
- Change global fees.
- Mark unverified product as MPHORA.
- Publish prohibited content.

---

## 54. Customer catalog behavior

Customer should see:

- Published products only.
- Clear source type.
- Clear availability.
- Clear timing.
- Clear price.
- Clear personalization.
- Clear conditions.

Customer should not see:

- Internal cost.
- Partner supply price.
- Internal review notes.
- Internal stock anomalies.
- Other partner data.

---

## 55. Analytics

Catalog analytics may include:

```text
listing_viewed
search_result_clicked
variant_selected
add_on_selected
added_to_cart
quote_created
out_of_stock
external_price_expired
mphora_eligible
mphora_ineligible
catalog_submission
catalog_approved
stock_adjusted
reservation_created
reservation_released
```

Analytics must not replace operational records.

---

## 56. MVP data requirements

The MVP must support:

- Product definitions.
- Listings.
- Partners.
- Variants.
- Services.
- Bundles.
- Add-ons.
- Images.
- Categories.
- Tags.
- Stock.
- Reservations.
- Availability.
- External products.
- Product snapshots.
- Publication workflow.
- Audit history.
- MPHORA eligibility inputs.

---

## 57. Future capabilities

Possible future additions:

- Supplier API sync.
- POS integration.
- Barcode scanning.
- Automated photography tools.
- Dynamic recommendations.
- Multi-partner order splitting.
- Warehouse inventory.
- Automated replenishment.
- AI-assisted listing creation.
- Advanced product similarity.
- City-specific catalog duplication.

---

## 58. Definition of done

A catalog or inventory feature is done when:

- Source type is explicit.
- Availability is truthful.
- Prices are server-validated.
- Historical orders are preserved.
- Reservations are atomic.
- Partner scope is enforced.
- MPHORA is recalculated correctly.
- External products are not treated as local stock.
- Errors are auditable.
- Tests cover concurrency and expiration.
- Lint, typecheck, tests, and build pass.
- Documentation is updated.

---

## 59. Summary

The MPHO catalog is not only a visual product list.

It is an operational model that must answer:

- What is being sold?
- Who can fulfill it?
- Where is it available?
- When can it be prepared?
- How is it personalized?
- What does it cost?
- Is it local, MPHORA, or by order?
- What happens if it is unavailable?

Inventory and availability must remain truthful from product discovery through order completion.
