# 28_DESIGN_SYSTEM.md

## 1. Purpose

This document defines the visual, interaction, and content design system for MPHO.

It explains:

- Brand direction.
- Color strategy.
- Typography.
- Layout.
- Components.
- Icons.
- Photography.
- Motion.
- Accessibility.
- Customer experience.
- Partner experience.
- Admin experience.
- HADIA.
- MPHORA.
- Responsive behavior.
- Design quality requirements.

This document is the source of truth for MPHO user-interface design.

---

## 2. Design objective

MPHO should look:

- Premium.
- Modern.
- Warm.
- Trustworthy.
- Intelligent.
- Local.
- Fast.
- Emotional without becoming childish.

The design should help customers feel:

- This gift is special.
- This process is easy.
- This platform is reliable.
- I understand what happens next.

Partners should feel:

- The work is clear.
- The deadline is visible.
- The earnings are understandable.
- The application is fast.

---

## 3. Brand personality

MPHO personality:

```text
premium
human
surprising
intelligent
precise
local
confident
warm
```

Avoid:

```text
cheap
cluttered
generic marketplace
overly romantic
childish
cold enterprise software
random neon
visual noise
```

---

## 4. Visual direction

Approved direction:

- Dark premium base.
- High-contrast content.
- Electric lime as primary action color.
- Cyan for AI and technology.
- Warm amber or orange for delivery and urgency.
- Deep blue for trust.
- Elegant gift photography.
- Controlled glow.
- Fine borders.
- Large typography.
- Real local-business photography.
- Clear product cards.

Neon should support hierarchy, not cover the entire interface.

---

## 5. Color tokens

Suggested initial palette:

```text
background-deep: #030712
background-surface: #07111F
background-elevated: #0B1626
border-subtle: rgba(255,255,255,0.12)
text-primary: #F7FAFC
text-secondary: #A9B4C4
text-muted: #728096
lime-primary: #B8FF00
lime-hover: #9DE000
cyan-ai: #10D9FF
blue-trust: #176BFF
amber-action: #FF9D00
red-danger: #FF4D5E
green-success: #20D47B
purple-premium: #9D5CFF
```

These values are an initial design direction and may be refined.

---

## 6. Color roles

### Lime

Use for:

- Main customer CTA.
- Active navigation.
- Positive discovery.
- Important availability.

Do not use lime for every icon.

### Cyan

Use for:

- HADIA.
- AI.
- Digital guidance.
- Informational highlights.

### Amber

Use for:

- Delivery.
- Urgency.
- Preparation deadline.
- Action warning.

### Blue

Use for:

- Trust.
- Security.
- Tracking.
- Information.

### Red

Use for:

- Destructive action.
- Payment failure.
- Blocking incident.
- Critical error.

### Green

Use for:

- Success.
- Paid.
- Delivered.
- Approved.

---

## 7. Contrast

All text and controls must meet accessible contrast.

Rules:

- Do not place lime body text on white.
- Do not use low-opacity gray for critical text.
- Status must not rely only on color.
- Disabled controls must remain readable.
- Focus indicators must be visible.
- Images with text overlay need strong gradient or solid background.

---

## 8. Typography

Recommended characteristics:

### Display

- Bold.
- Condensed or strong geometric.
- Used for hero headlines.
- High visual impact.

### UI and body

- Clean sans serif.
- High legibility.
- Good mobile rendering.
- Clear number shapes.
- Good Spanish accents.

Suggested hierarchy:

```text
Display XL
Display L
Heading 1
Heading 2
Heading 3
Body L
Body M
Body S
Label
Caption
```

Avoid using more than two primary font families.

---

## 9. Type scale

Suggested responsive scale:

```text
Display XL: 56–72 desktop / 40–48 mobile
Display L: 44–56 desktop / 34–40 mobile
H1: 36–44 desktop / 30–34 mobile
H2: 28–36 desktop / 24–30 mobile
H3: 22–28 desktop / 20–24 mobile
Body L: 18
Body M: 16
Body S: 14
Caption: 12
```

Use line height that preserves readability.

---

## 10. Spacing system

Use a consistent spacing scale.

Suggested:

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

Avoid arbitrary spacing unless required.

---

## 11. Radius system

Suggested:

```text
small: 8
medium: 12
large: 18
xl: 24
pill: 999
```

Use:

- Small for input.
- Medium for cards.
- Large for hero panels.
- Pill for badges and filters.

---

## 12. Shadow and glow

Use subtle depth.

Suggested patterns:

- Soft surface shadow.
- Lime CTA glow.
- Cyan HADIA glow.
- Amber delivery glow.
- No strong glow around every component.
- No unreadable blurred text.

Glow should communicate emphasis.

---

## 13. Grid

Desktop:

- 12-column grid.
- Max content width.
- Consistent gutters.
- Hero may use 5/7 or 6/6 split.

Tablet:

- 8-column grid.

Mobile:

- 4-column grid.
- Edge padding of at least 16.
- Vertical stacking.
- Sticky bottom action when useful.

---

## 14. Responsive breakpoints

Use project-standard breakpoints.

The design must work at:

- Small mobile.
- Large mobile.
- Tablet.
- Laptop.
- Desktop.
- Wide desktop.

Do not design only for one screenshot width.

---

## 15. Customer home page

Recommended hierarchy:

```text
Header
Hero
Primary search or HADIA
Trust indicators
Local partners
How it works
Gift categories
Recommended products
MPHORA section
Customer reassurance
Final CTA
Footer
```

The hero should include:

- Strong emotional headline.
- One clear primary CTA.
- One secondary HADIA CTA.
- Delivery-area selector.
- Premium gift visual.
- Clear value proposition.

---

## 16. Hero content

Recommended message structure:

### Headline

Emotion + convenience.

Example:

> Surprise someone today with gifts ready to send.

### Supporting message

> HADIA helps you choose, personalize, and coordinate the right gift through trusted local partners.

### Primary action

> Find my gift.

### Secondary action

> Ask HADIA.

### Supporting trust

- Secure payment.
- Local partners.
- Order tracking.
- Scheduled delivery.

---

## 17. Real local partner section

The home page may show approved local partner cards.

Each card may include:

- Real business photo with permission.
- Public business name.
- Neighborhood or area.
- Categories.
- Availability summary.
- Rating only when source and policy allow.
- View products.

Do not invent stores, ratings, or partnerships in production.

During prototype design, label fictional content clearly.

---

## 18. Product cards

Product card should include:

- Real image.
- Name.
- Price.
- Availability badge.
- Delivery estimate.
- Favorite action in future.
- Clear tap area.
- Partner-neutral or partner-attributed presentation according to product strategy.

Card states:

- Default.
- Hover.
- Focus.
- Loading.
- Unavailable.
- MPHORA.
- By order.

---

## 19. Availability badges

Official badges:

```text
Local
MPHORA
By order
Customizable
Unavailable
```

Badge design must combine:

- Icon.
- Text.
- Color.
- Accessible label.

Do not use ambiguous labels such as:

- Fast.
- Hot.
- Trending.
- Last chance.

Unless rules define them.

---

## 20. Buttons

Button variants:

```text
primary
secondary
tertiary
danger
ghost
icon
```

### Primary

- Lime background.
- Dark text.
- Used once or twice per view.

### Secondary

- Dark surface.
- Cyan or white border.
- Used for HADIA or alternate path.

### Danger

- Red.
- Requires confirmation for destructive actions.

Button requirements:

- Minimum touch target.
- Loading state.
- Disabled state.
- Focus state.
- Icon alignment.
- No vague label like `Continue` when action can be specific.

---

## 21. Inputs

Inputs should include:

- Visible label.
- Placeholder only as example.
- Help text.
- Error text.
- Success state when useful.
- Required indicator.
- Large touch target.
- Autofill support.
- Mobile keyboard type.

Do not use placeholder as the only label.

---

## 22. Forms

Forms should:

- Group related fields.
- Preserve progress.
- Validate after reasonable interaction.
- Show form-level error.
- Show field-level error.
- Use progress indicator for checkout.
- Allow safe back navigation.
- Avoid unnecessary fields.

---

## 23. Cards

Card types:

- Product.
- Partner.
- Order.
- Task.
- Earning.
- Delivery.
- Incident.
- Recommendation.
- Metric.

Every card should have:

- Clear title.
- Key metadata.
- Primary state.
- Primary action.
- Optional secondary action.
- Accessible focus.

---

## 24. Status components

Order status should use:

- Icon.
- Label.
- Description.
- Timestamp.
- Next step.

Timeline should not show internal enum values.

Example:

> Product received at Punto MPHO  
> Today, 2:14 p.m.  
> Next: preparation begins.

---

## 25. HADIA design

HADIA should have a distinct but integrated identity.

Use:

- Cyan.
- Spark or intelligence icon.
- Clean conversation.
- Structured choice chips.
- Recommendation cards.
- Visible constraints.
- Human handoff.

Avoid:

- Human-like avatar that implies a real person.
- Excessively robotic language.
- Chat bubbles without product actions.
- Full-screen chat with no navigation.

---

## 26. HADIA recommendation card

Should show:

- Product image.
- Name.
- Reason.
- Price.
- Delivery type.
- Timing.
- Personalization.
- Primary action.
- Alternative action.

Reason example:

> Fits your budget, can include a personalized card, and is available near the recipient.

---

## 27. MPHORA design

MPHORA should visually communicate speed and eligibility.

Use:

- Lime or amber accent.
- Lightning or motion icon.
- Cutoff.
- Delivery window.
- Zone.
- Expiration.

Avoid using MPHORA badge without current eligibility.

---

## 28. Partner app design

MPHO Aliados should be operational.

Priorities:

- Today’s work.
- Deadlines.
- Required action.
- Earnings.
- Evidence.
- Incidents.

Use:

- Large action buttons.
- Clear task cards.
- Deadline color.
- Minimal typing.
- Camera-first upload.
- Strong offline status.

Avoid:

- Decorative hero sections.
- Marketing banners.
- Excessive animation.
- Hidden earnings.

---

## 29. Admin design

Admin should prioritize density and clarity.

Use:

- Tables.
- Filters.
- Queues.
- Severity.
- Financial summary.
- Sticky actions.
- Audit context.
- Side panels.
- Confirmation dialogs.

Avoid:

- Oversized marketing visuals.
- Hidden filters.
- Color-only severity.
- Editable financial values without context.

---

## 30. Icons

Use one consistent icon family.

Icons should be:

- Simple.
- Recognizable.
- Similar stroke.
- Accessible with labels.
- Used consistently.

Recommended concepts:

- Gift.
- Spark.
- Location.
- Calendar.
- Truck.
- Shield.
- Payment.
- Camera.
- Check.
- Warning.
- Store.
- Earnings.

---

## 31. Photography

Photography should show:

- Real gifts.
- Real hands preparing.
- Real local storefronts.
- Packaging details.
- Delivery moments.
- Recipient emotion without staged exaggeration.
- Saltillo context when appropriate.

Image style:

- Premium lighting.
- Strong dark background.
- Controlled lime, cyan, and amber highlights.
- High detail.
- Clean composition.
- Realistic scale.

---

## 32. Photography ethics

Do not:

- Use a real store name without authorization in production.
- Fake a partnership.
- Use customer photos without consent.
- Show addresses unnecessarily.
- Use misleading AI-generated product images as the exact product.
- Show people in vulnerable situations.

Prototype visuals should be labeled as concept when necessary.

---

## 33. Empty states

Empty states should:

- Explain why.
- Offer next action.
- Avoid blame.
- Use small illustration only when helpful.

Examples:

### No MPHORA

> No MPHORA options are available for this area and time. Scheduled delivery is still available.

### No partner orders

> You have no new orders. Keep your availability and catalog updated.

### No admin exceptions

> There are no active exceptions. Healthy orders continue automatically.

---

## 34. Loading states

Use:

- Skeleton.
- Progress.
- Upload percentage.
- Action-specific spinner.
- Last-updated indicator.

Avoid blank white or black screens.

---

## 35. Error states

Error design should include:

- Clear title.
- Safe explanation.
- Next action.
- Retry.
- Support.
- Request ID for technical support when appropriate.

Example:

> We could not confirm delivery availability. Try again or choose scheduled delivery.

---

## 36. Destructive actions

Require confirmation for:

- Cancel order.
- Reject partner.
- Suspend partner.
- Refund.
- Remove payout account.
- Delete address.
- Disable user.

Confirmation should explain impact.

---

## 37. Motion

Use motion for:

- State transition.
- Success.
- Drawer.
- Card entry.
- Loading.
- HADIA response.
- Delivery progress.

Rules:

- Keep fast.
- Avoid blocking.
- Respect reduced motion.
- Avoid decorative constant animation.
- Do not animate sensitive status in a confusing way.

---

## 38. Sound and haptics

Optional future use:

- Partner urgent offer.
- Successful scan.
- Delivery completion.

Must be:

- Optional.
- Accessible.
- Not required for understanding.
- Respect device settings.

---

## 39. Accessibility

Minimum:

- WCAG-aware contrast.
- Keyboard support.
- Screen-reader labels.
- Semantic structure.
- Visible focus.
- Large touch target.
- Non-color-only information.
- Form error summary.
- Reduced motion.
- Zoom support.
- Alt text.
- Clear language.

---

## 40. Content style

Customer language should be:

- Short.
- Warm.
- Specific.
- Honest.
- Actionable.

Partner language should be:

- Operational.
- Direct.
- Deadline-oriented.
- Financially clear.

Admin language should be:

- Precise.
- Auditable.
- Risk-aware.

---

## 41. Spanish usage

Customer-facing language should use natural Spanish for Mexico.

Avoid:

- Random English labels.
- Literal machine translation.
- Excessive jargon.
- Technical enum names.
- Overly formal legal language in normal screens.

English may remain in technical documentation and code.

---

## 42. Formatting

Use:

- Currency: `$1,250 MXN`.
- Dates: localized.
- Time: 12-hour or 24-hour consistently.
- Phone: localized.
- Address: Mexican structure.
- Order number: `MPHO-1042`.

---

## 43. Design tokens

Tokens should include:

```text
color
spacing
radius
shadow
typography
z-index
motion
breakpoints
icon size
component height
```

Store tokens centrally.

Do not hardcode values across components.

---

## 44. Component documentation

Each reusable component should define:

- Purpose.
- Variants.
- States.
- Props.
- Accessibility.
- Mobile behavior.
- Examples.
- Do and don't.

---

## 45. Design review checklist

Before approval:

- Is primary action obvious?
- Is status clear?
- Is price clear?
- Is timing clear?
- Is source type clear?
- Is error recovery present?
- Is mobile layout correct?
- Is contrast sufficient?
- Is text realistic?
- Are real data and prototypes clearly separated?
- Does design match business rules?

---

## 46. MVP design system scope

Required MVP components:

```text
Button
Input
Select
Textarea
Checkbox
Radio
Switch
Badge
Card
ProductCard
PartnerCard
OrderCard
TaskCard
Timeline
Alert
Dialog
Drawer
Tabs
Table
Pagination
Toast
Skeleton
FileUploader
PriceBreakdown
StatusBadge
EmptyState
ErrorState
HADIARecommendation
MPHORAEligibility
```

---

## 47. Future design capabilities

Possible future work:

- Advanced personalization preview.
- Live map.
- Animated gift builder.
- Design themes.
- Partner white-label.
- 3D product preview.
- Augmented reality.
- Corporate campaign builder.

Not required for MVP.

---

## 48. Definition of done

A UI feature is done when:

- It follows tokens.
- It works on mobile.
- It is accessible.
- It handles all states.
- It uses real business language.
- It does not misrepresent availability.
- It does not hide price.
- It includes error recovery.
- It matches role permissions.
- It passes visual and functional review.
- Documentation is updated.

---

## 49. Summary

MPHO should feel premium because it is clear, trustworthy, and carefully coordinated.

Visual impact is important, but operational truth is more important.

Every design decision should help the user understand:

```text
what this is
what it costs
when it arrives
what happens next
```
