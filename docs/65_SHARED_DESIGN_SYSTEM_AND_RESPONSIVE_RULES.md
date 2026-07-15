# 65_SHARED_DESIGN_SYSTEM_AND_RESPONSIVE_RULES.md

## 1. Purpose

This document extends `28_DESIGN_SYSTEM.md` into a concrete visual system for the three MPHO PWAs.

The system must preserve one family identity while making each application immediately recognizable.

---

## 2. Shared brand foundation

Shared across all PWAs:

- MPHO logo system.
- Core typography.
- Dark premium base.
- high contrast.
- lime primary action.
- cyan intelligence/system accent.
- amber urgency/delivery accent.
- green confirmed success.
- red blocking risk.
- consistent icon family.
- consistent spacing.
- accessible interaction patterns.

---

## 3. Application personalities

### MPHO Customer

```text
emotional
premium
visual
inspiring
spacious
warm
```

### MPHO Aliados

```text
operational
fast
direct
deadline-aware
camera-first
action-heavy
```

### MPHO Central

```text
professional
dense
analytical
controlled
risk-aware
auditable
```

---

## 4. Initial token palette

```text
--bg-deep: #030712
--bg-surface: #07111F
--bg-elevated: #0B1626
--bg-soft: #101D2F

--text-primary: #F8FAFC
--text-secondary: #B5C0CF
--text-muted: #748197

--border-subtle: rgba(255,255,255,0.12)
--border-strong: rgba(255,255,255,0.22)

--lime: #B8FF00
--lime-hover: #9FE000
--lime-pressed: #89C800

--cyan: #12D8FF
--blue: #176BFF
--amber: #FFA000
--green: #20D47B
--red: #FF4D5E
--purple: #9D5CFF
```

Final values should be tested for accessibility and real devices.

---

## 5. App-specific emphasis

### Customer

- Lime for primary CTA.
- cyan for HADIA.
- amber for MPHORA.
- more photography.
- larger radius.
- more whitespace.
- subtle glow.

### Partner

- Lime for current required action.
- amber for deadline.
- red for blocking incident.
- green only for server-confirmed completion.
- less photography.
- high-density task cards.

### Central

- Blue/cyan for information.
- amber/red for risk.
- lime used sparingly for safe primary actions.
- tables, filters, charts, side panels.
- minimal glow.

---

## 6. Typography

Recommended family characteristics:

- Display: strong geometric or refined grotesk.
- UI: highly legible sans serif.
- Numeric data: tabular numerals where supported.

Use no more than two primary families.

Suggested scale:

```text
Display XL: clamp(2.5rem, 5vw, 4.5rem)
Display L: clamp(2rem, 4vw, 3.5rem)
H1: clamp(1.875rem, 3vw, 2.75rem)
H2: clamp(1.5rem, 2.4vw, 2.25rem)
H3: 1.25rem–1.5rem
Body L: 1.125rem
Body M: 1rem
Body S: 0.875rem
Caption: 0.75rem
```

---

## 7. Spacing

Use a shared scale:

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

Rules:

- Customer pages may use larger section spacing.
- Partner cards prioritize compact vertical rhythm.
- Central tables use dense or comfortable modes.
- No arbitrary one-off spacing without design-token review.

---

## 8. Radius

```text
small: 8
medium: 12
large: 18
xl: 24
pill: 999
```

Customer uses medium to XL.

Partner uses small to medium.

Central uses small to medium for density.

---

## 9. Elevation

Levels:

```text
0 flat
1 subtle card
2 floating action
3 dialog/drawer
4 critical overlay
```

Avoid stacking excessive shadows and glow.

---

## 10. Buttons

Variants:

- Primary.
- secondary.
- tertiary.
- danger.
- ghost.
- icon.
- split action only when justified.

Minimum touch target:

```text
44 × 44 CSS pixels
```

Partner urgent actions may use larger targets.

Every button needs:

- default.
- hover.
- pressed.
- focus.
- loading.
- disabled.
- success/failure when action is asynchronous.

---

## 11. Status design

Every status uses:

- Icon.
- label.
- optional description.
- timestamp.
- next action when relevant.

Color alone is insufficient.

Customer statuses use plain language.

Partner and Central may show operational labels plus customer-safe preview.

---

## 12. Cards

Shared card anatomy:

```text
eyebrow/status
title
supporting information
key value
primary action
secondary metadata
```

Variants:

- Product card.
- HADIA recommendation.
- MPHORA card.
- customer order.
- partner task.
- package.
- earning.
- central exception.
- metric.
- incident.

---

## 13. Responsive breakpoints

Use one shared set, subject to implementation framework:

```text
xs: 360
sm: 480
md: 768
lg: 1024
xl: 1280
2xl: 1536
```

Design must also work between breakpoints.

---

## 14. Mobile rules

- One primary action per screen.
- bottom navigation respects safe area.
- sticky CTA must not cover content.
- forms use correct keyboard type.
- camera action near thumb zone.
- dialogs become sheets when appropriate.
- tables become prioritized cards.
- no horizontal page scrolling.
- critical status visible without scrolling.

---

## 15. Tablet rules

Partner tablet may use:

- Side navigation.
- two-column task and detail.
- camera and evidence panel.
- larger package workflow.

Central tablet may use:

- Collapsible navigation.
- card/table hybrid.
- limited charts.
- side sheet.

---

## 16. Desktop rules

Customer:

- Max content width.
- 12-column grid.
- large imagery.
- contextual side cart.

Partner:

- Side navigation.
- queue + task detail.
- scanner/camera modal.

Central:

- persistent filters.
- table density.
- side detail panel.
- multi-column dashboards.

---

## 17. Forms

Rules:

- Visible labels.
- help text.
- inline and summary error.
- retain entered data.
- mark optional clearly.
- confirm destructive changes.
- use server error messages safely.
- do not use placeholder as label.
- allow copy/paste where security is not harmed.

---

## 18. Data tables

Central tables require:

- Sticky header.
- keyboard access.
- sorting.
- controlled filters.
- pagination.
- column visibility.
- empty state.
- loading state.
- export permission.
- row action menu.
- timestamps.
- no hidden total mismatch.

---

## 19. Motion

Use motion for:

- Navigation continuity.
- drawer.
- confirmation.
- state update.
- loading.
- HADIA response.
- progress.

Rules:

- 150–300 ms for most UI.
- no endless decorative movement.
- respect reduced motion.
- never delay urgent operation.
- do not use celebratory animation for financial or security action.

---

## 20. Photography system

Customer photography:

- premium.
- realistic.
- product-centered.
- emotional.
- dark controlled background.
- no identifiable partner by default.

Partner photography:

- instructional.
- evidence guidance.
- package condition examples.
- preparation reference.

Central:

- little or no decorative photography.

---

## 21. Icons

One icon system.

Required semantic icons:

- Gift.
- HADIA spark.
- clock.
- location.
- delivery.
- store/network.
- shield.
- payment.
- package.
- camera.
- scan.
- warning.
- earnings.
- refund.
- incident.
- security.
- filter.
- audit.

Do not mix filled and outline styles arbitrarily.

---

## 22. Accessibility

Required:

- Contrast.
- keyboard.
- visible focus.
- semantic landmarks.
- skip links.
- screen-reader names.
- live-region discipline.
- 200% zoom.
- reduced motion.
- touch target.
- error identification.
- non-color status.
- accessible charts.
- accessible dialogs.

---

## 23. Localization

Primary customer and partner language:

```text
Spanish for Mexico
```

Rules:

- Natural copy.
- MXN.
- Saltillo/Coahuila address structure.
- correct accents.
- clear date.
- consistent 12-hour or 24-hour time.
- no random English.

Technical admin terms may remain only when operationally necessary.

---

## 24. Design QA

For every screen test:

- 360 px width.
- 390–430 px modern phones.
- tablet.
- 1024 laptop.
- 1440 desktop.
- dark appearance.
- text zoom.
- reduced motion.
- slow network.
- empty state.
- error state.
- long Spanish text.
- large currency value.

---

## 25. Acceptance criteria

- The three apps feel related but not identical.
- Customer experience remains emotional and premium.
- Partner workflow remains fast.
- Central remains dense and traceable.
- Tokens are centralized.
- Responsive behavior is documented.
- Accessibility is included in definition of done.
