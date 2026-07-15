# 68_PROTOTYPE_ACCEPTANCE_AND_HANDOFF_TO_OPENCODE.md

## 1. Purpose

This document defines the exact process for turning Pack 12 into an approved interactive prototype and then into production implementation.

OpenCode must not begin full production UI from isolated screenshots.

---

## 2. Required prototype sequence

```text
information architecture
→ low-fidelity wireframes
→ customer visual direction
→ partner operational prototype
→ central dashboard prototype
→ responsive states
→ usability test
→ accessibility review
→ approved design tokens
→ implementation
```

---

## 3. Prototype scope

### Customer

Required prototype:

- Home.
- Explore.
- product.
- HADIA.
- cart.
- checkout.
- order confirmation.
- tracking.
- support.
- installation.
- reminders.

### Partner

- Login/MFA.
- install onboarding.
- home.
- offer.
- stock.
- package receipt.
- preparation.
- evidence.
- ready.
- handoff.
- incident.
- earnings.

### Central

- Login/MFA.
- summary.
- operations queue.
- order detail.
- partner review.
- catalog preview.
- refund.
- payout.
- incident.
- security.
- MPHORA control.

---

## 4. Prototype content rules

Use realistic but fictional:

- Products.
- prices.
- orders.
- addresses.
- partner internal names.
- delivery windows.
- incidents.
- financial values.

Do not use:

- Real customer data.
- unapproved real local-store identity.
- fake public partnership.
- fake rating.
- placeholder lorem ipsum.
- impossible delivery promises.

---

## 5. Customer prototype acceptance

The prototype passes when a new test participant can:

1. Explain what MPHO does.
2. choose Saltillo coverage.
3. find a gift.
4. use HADIA.
5. understand MPHORA.
6. personalize.
7. understand total.
8. complete checkout prototype.
9. interpret order status.
10. find support.

The participant should perceive MPHO as the only customer-facing store and service.

---

## 6. Partner prototype acceptance

The partner prototype passes when a test user can:

1. Identify urgent task.
2. understand earning.
3. accept or reject.
4. confirm stock.
5. receive package.
6. report damage.
7. follow preparation checklist.
8. upload evidence.
9. mark ready only after requirements.
10. handoff.
11. find earnings.
12. report incident.

---

## 7. Central prototype acceptance

The central prototype passes when an internal test user can:

1. Find orders at risk.
2. identify owner and deadline.
3. inspect full order context.
4. reassign safely.
5. review partner.
6. view catalog customer preview.
7. review refund.
8. approve or reject according to role.
9. find audit.
10. pause MPHORA.
11. open incident runbook.
12. identify a security alert.

---

## 8. Usability testing

Recommended initial test groups:

```text
5 customer participants
3 potential partner users
2 internal operations users
```

This is an initial qualitative round, not statistical proof.

Record:

- Task success.
- hesitation.
- wrong path.
- unclear copy.
- trust concern.
- privacy concern.
- install understanding.
- mobile issue.
- accessibility issue.

---

## 9. Accessibility acceptance

Before handoff:

- Keyboard path.
- focus order.
- screen-reader labels.
- contrast.
- zoom.
- reduced motion.
- error handling.
- touch size.
- live updates.
- dialog behavior.

Critical workflows must not require color, animation, drag, or vision alone.

---

## 10. Responsive acceptance

Approve at:

```text
360 × 800
390 × 844
430 × 932
768 × 1024
1024 × 768
1280 × 800
1440 × 900
```

Also test fluid intermediate sizes.

---

## 11. Design deliverables

The approved design package should contain:

- Figma or equivalent source.
- page map.
- component library.
- tokens.
- icons.
- image guidance.
- all states.
- responsive variants.
- prototype links.
- copy.
- accessibility notes.
- implementation annotations.
- assets with license/source.

---

## 12. Handoff story format

For every screen:

```text
Screen:
App:
Route:
User:
Goal:
Preconditions:
Data:
Permissions:
Primary action:
Secondary actions:
States:
Errors:
Offline:
Notifications:
Analytics:
Accessibility:
Acceptance criteria:
Tests:
```

---

## 13. OpenCode implementation order

```text
1. Monorepo and app shells
2. Shared tokens and primitives
3. Customer public home and navigation
4. Customer catalog and product
5. Customer HADIA shell
6. Customer cart and checkout
7. Customer tracking
8. Partner shell and navigation
9. Partner offers and task detail
10. Partner package and evidence
11. Partner earnings and incidents
12. Central shell and security
13. Central operations
14. Central finance
15. PWA manifests/icons
16. Service workers and cache
17. Push
18. installation education
19. responsive/accessibility QA
20. E2E
```

---

## 14. OpenCode constraints

OpenCode must not:

- Add a customer store directory.
- expose partner identity.
- invent a fourth PWA.
- combine all roles in one navigation.
- cache private API responses.
- add automatic AI financial action.
- use fake production metrics.
- use real store photos without approval.
- skip mobile states.
- treat installability as a manifest-only task.
- mark a PWA complete without device tests.

---

## 15. Pull request evidence

Each UI pull request should include:

- Screens changed.
- routes.
- before/after.
- responsive screenshots.
- accessibility result.
- tests.
- cache impact.
- permissions.
- analytics.
- unresolved differences from design.

---

## 16. Prototype-to-code traceability

Every implemented screen should reference:

- Pack document.
- design frame.
- story.
- acceptance criteria.
- test.

A visual change that modifies business behavior requires documentation review.

---

## 17. Pack 12 definition of done

Pack 12 is implemented when:

- Three independently installable apps exist.
- MPHO is the sole normal customer-facing brand.
- Customer journeys are complete.
- Partner workflows are operational.
- Central controls are role-safe.
- all manifests and icons exist.
- private cache tests pass.
- notification consent is contextual.
- installation works on target devices.
- responsive and accessibility tests pass.
- prototype acceptance is documented.
