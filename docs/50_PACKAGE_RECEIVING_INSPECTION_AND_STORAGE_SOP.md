# 50_PACKAGE_RECEIVING_INSPECTION_AND_STORAGE_SOP.md

## 1. Purpose

This standard operating procedure defines how a Punto MPHO receives, identifies, inspects, records, stores, transfers, returns, and resolves external packages.

The objective is to maintain a clear chain of custody and prevent loss, substitution, cross-order confusion, damage concealment, and privacy exposure.

---

## 2. Scope

Applies to:

- External marketplace purchases.
- Supplier packages.
- Customer-authorized by-order products.
- Returns sent back to a Punto MPHO.
- Reattempted deliveries returned to the partner.

It does not authorize the partner to open or inspect beyond the approved scope.

---

## 3. Required receiving setup

The partner must have:

- Defined receiving area.
- Restricted storage area.
- Order-label process.
- Camera-capable device.
- MPHO Aliados access.
- Clean surface.
- Basic tamper-evident materials.
- Incident contact.
- Separate area for damaged or disputed packages.

---

## 4. Expected-package list

Before receiving, the partner checks:

```text
order number
external purchase reference
carrier
tracking number
expected date
recipient partner location
expected package count
expected product
special handling
```

A package not on the expected list is not silently accepted into normal storage.

---

## 5. Carrier handoff

At arrival:

1. Confirm delivery location.
2. Confirm package reference.
3. Count packages.
4. Check visible condition before signing when possible.
5. Record carrier or provider event.
6. Refuse only when policy and safety require it.
7. Do not expose customer information to the carrier beyond need.

---

## 6. Package identification

Immediately after receipt:

- Scan or enter tracking reference.
- Match one order.
- Generate internal package ID.
- Apply MPHO label.
- Record receipt time.
- Record receiving staff member.
- Record package count.
- Record visible condition.

If no order matches:

```text
quarantine
→ open unknown_package incident
→ do not open
→ notify operations
```

---

## 7. Exterior inspection

Inspect:

- Seal.
- Tears.
- Water.
- Crushing.
- Puncture.
- Unusual odor.
- Leakage.
- Wrong label.
- Multiple labels.
- Signs of opening.

Condition values:

```text
intact
minor_damage
major_damage
tamper_suspected
wet
leaking
unsafe
unknown
```

---

## 8. Evidence capture

Required evidence may include:

- All package sides.
- Shipping label with sensitive parts minimized.
- Damage close-up.
- Seal.
- Internal MPHO label.
- Timestamp through system record.

Do not upload full unrelated personal data when avoidable.

Evidence must be linked to the correct order.

---

## 9. Opening authorization

Open only when:

- Order requires inspection.
- Customer terms permit it.
- Partner capability permits it.
- Package is linked to the order.
- There is no safety concern.

Do not open:

- Unknown package.
- Restricted or suspicious package.
- Package under legal hold.
- Package with leakage or hazard.
- Package whose instructions prohibit opening.

---

## 10. Internal inspection

When authorized, verify:

- Product identity.
- Variant.
- Color.
- Size.
- Quantity.
- Visible damage.
- Obvious mismatch.
- Included accessories visible without destructive testing.

Do not claim:

- Authenticity certification.
- Electrical safety certification.
- Hidden-defect detection.
- Full functional testing unless separately approved.

---

## 11. Inspection result

```text
accepted
accepted_with_note
wrong_product
wrong_variant
quantity_mismatch
visible_damage
missing_component
counterfeit_suspected
unsafe_product
unknown_product
```

A blocking result pauses preparation.

---

## 12. Damaged or incorrect package

1. Stop preparation.
2. Preserve package and contents.
3. Capture evidence.
4. Open incident.
5. Notify operations.
6. Do not contact external seller from a personal account unless approved.
7. Do not discard packaging.
8. Wait for return, replacement, or customer decision.

---

## 13. Storage

Store by:

- Internal package ID.
- Order ID.
- Shelf or zone.
- Handling requirement.
- Received date.
- Decision deadline.

Rules:

- Separate orders.
- Restrict access.
- Avoid floor storage when inappropriate.
- Protect from water, heat, dust, pets, theft, and customer access.
- Do not stack fragile items unsafely.
- Do not use or display the product.
- Do not photograph for marketing.

---

## 14. Perishable or sensitive packages

Only approved partners may receive them.

Record:

- Arrival temperature when required.
- Expiration or safe-use information.
- Storage requirement.
- Condition.
- Maximum decision time.

If safe handling cannot be maintained, open incident immediately.

---

## 15. Daily custody count

At least once per operating day:

- Compare expected packages.
- Compare received packages.
- Count stored packages.
- Review packages awaiting decision.
- Review overdue preparation.
- Review returns.

Any discrepancy creates an incident.

---

## 16. Transfer to preparation

Before moving:

- Correct order confirmed.
- Inspection passed.
- Product condition recorded.
- Preparation task active.
- Staff member assigned.
- Storage location updated.

Chain of custody event is recorded.

---

## 17. Return preparation

For return:

- Preserve original packaging when required.
- Follow seller instructions.
- Include only correct item.
- Capture condition.
- Apply return label.
- Record carrier.
- Record tracking.
- Record handoff.
- Monitor refund destination.

---

## 18. Missing package

If expected package does not appear:

- Verify tracking.
- Verify carrier event.
- Verify address.
- Search receiving area.
- Search storage.
- Review staff receipt.
- Contact provider through approved process.
- Open incident.
- Inform customer only with verified facts.

---

## 19. Unknown package

Unknown package procedure:

```text
quarantine
→ no opening
→ photograph exterior
→ record carrier and tracking
→ notify operations
→ identify owner
→ return or assign through approved decision
```

Never use or dispose of it informally.

---

## 20. Security incident

Escalate immediately for:

- Suspected explosive or dangerous material.
- Weapon.
- illegal substance.
- threat message.
- data exposure.
- package tampering.
- repeated unknown packages.
- courier impersonation.

Safety takes priority over normal workflow.

---

## 21. Required records

```text
package_id
order_id
tracking
carrier
received_at
received_by
condition
photos
inspection_scope
inspection_result
storage_location
custody_events
incident
return_tracking
final_disposition
```

---

## 22. Quality checks

- [ ] Package matched one order.
- [ ] Condition recorded.
- [ ] Evidence complete.
- [ ] Inspection within approved scope.
- [ ] Storage location recorded.
- [ ] No privacy exposure.
- [ ] No blocking issue ignored.
- [ ] Custody event complete.

---

## 23. Definition of done

A package is safely received when:

- It is matched to one order.
- Condition is documented.
- Inspection result is clear.
- Storage location is known.
- Chain of custody is intact.
- Any issue has an owner and next action.
