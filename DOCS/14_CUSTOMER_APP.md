# 14_CUSTOMER_APP.md

## 1. Purpose

This document defines the customer-facing MPHO web application and PWA.

It describes:

- Navigation.
- Main screens.
- Customer workflows.
- Product discovery.
- HADIA integration.
- MPHORA integration.
- Cart and checkout.
- Recipient and delivery information.
- Payment.
- Order tracking.
- Support.
- Account features.
- Error states.
- Accessibility.
- MVP requirements.

This document must be read together with:

- `10_USER_ROLES.md`
- `11_CUSTOMER_JOURNEY.md`
- `13_ORDER_LIFECYCLE.md`
- `17_CATALOG_AND_INVENTORY.md`
- `18_HADIA_AI.md`
- `19_MPHORA_EXPRESS.md`
- `22_PAYMENTS_AND_PAYOUTS.md`
- `27_SECURITY_AND_PRIVACY.md`
- `28_DESIGN_SYSTEM.md`

---

## 2. Product objective

The customer application must make it possible to:

```text
discover
→ compare
→ personalize
→ provide recipient and address
→ validate timing and price
→ pay
→ track
→ resolve problems
→ confirm delivery
```

The customer should experience MPHO as one coordinated service.

The customer should not need to understand the internal complexity of:

- Partner assignment.
- External product sourcing.
- Package reception.
- Courier selection.
- Earnings distribution.
- Internal incident ownership.

---

## 3. Platform format

The MVP should be:

- Responsive web application.
- Mobile-first.
- Installable as a PWA when technically viable.
- Usable from Safari and Chrome.
- Accessible without installation.
- Optimized for low-friction checkout.

Native iOS and Android applications are not required for the MVP.

---

## 4. Main navigation

Recommended mobile navigation:

```text
Home
Explore
HADIA
Orders
Account
```

MPHORA may appear as:

- A primary home action.
- A filter.
- A dedicated collection.
- A highlighted section.

Recommended desktop navigation:

```text
MPHO logo
Explore gifts
HADIA
MPHORA
My orders
Account
Cart
```

Navigation must remain simple.

---

## 5. Public routes

Suggested public routes:

```text
/
 /explore
 /category/[slug]
 /occasion/[slug]
 /product/[slug]
 /hadia
 /mphora
 /coverage
 /cart
 /login
 /register
 /help
 /policies
```

Private routes:

```text
/checkout
/orders
/orders/[orderNumber]
/account
/account/addresses
/account/recipients
/account/reminders
/account/security
/support/[caseId]
```

The final route structure may change, but responsibilities must remain clear.

---

## 6. Home screen

The home screen should answer:

1. What is MPHO?
2. What can I send?
3. Can it arrive where I need?
4. How quickly can it arrive?
5. How do I start?

Recommended sections:

### Hero

Primary message:

> Find, personalize, and send a meaningful gift without coordinating every step yourself.

Primary actions:

- Find a gift.
- Ask HADIA.
- See MPHORA options.

### Occasion shortcuts

Examples:

- Birthday.
- Anniversary.
- Love.
- Thank you.
- Congratulations.
- Get well soon.
- Corporate.
- Just because.

### MPHORA section

Only visible when:

- Customer location or selected zone is supported.
- There are eligible items.
- Eligibility is current.

### Curated collections

Examples:

- Under a defined budget.
- Flowers and details.
- Personalized gifts.
- Gifts for today.
- Gifts by order.
- Local favorites.

### How MPHO works

```text
Choose
→ personalize
→ MPHO coordinates
→ partner prepares
→ gift is delivered
```

### Trust section

May include:

- Clear order tracking.
- Approved local partners.
- Secure payments.
- Preparation evidence.
- Support.

Do not display unsupported claims.

---

## 7. Coverage flow

The customer should be able to verify service area before investing time.

Inputs may include:

- City.
- Postal code.
- Neighborhood.
- Map selection.
- Delivery address.

Possible results:

### Supported

> MPHO is available in this area.

### Supported with limitations

> Scheduled delivery is available. MPHORA is not available right now.

### Not yet supported

> MPHO does not currently deliver to this area.

The system may offer:

- Waitlist.
- Notify me.
- Another nearby zone.
- By-order planning for a future date.

---

## 8. Explore screen

The explore screen should support:

- Search.
- Category filters.
- Occasion filters.
- Recipient filters.
- Budget.
- Delivery type.
- Delivery date.
- Personalization.
- Product source.
- Availability.
- Rating when available.
- Sort order.

Recommended sort options:

- Recommended.
- Delivery soonest.
- Price low to high.
- Price high to low.
- Most popular.
- New.

Sorting must not misrepresent availability.

---

## 9. Search

Search should consider:

- Product name.
- Category.
- Occasion.
- Recipient.
- Tags.
- Description.
- Partner product terms.
- Personalization.

Search results must clearly identify:

- Local.
- MPHORA.
- By order.
- Unavailable.
- Estimated delivery.

Search must not return unpublished or restricted items.

---

## 10. Product cards

A product card should show:

- Main image.
- Product name.
- Starting price or exact price.
- Availability type.
- Estimated preparation or delivery.
- Relevant badge.
- Rating when valid.
- Favorite action in future phases.

Approved badges:

```text
Local
MPHORA
By order
Customizable
New
Unavailable
```

Avoid badges such as:

```text
Guaranteed
Instant
Only one left
Best seller
```

unless based on verified data.

---

## 11. Product detail screen

Required sections:

### Product header

- Image gallery.
- Name.
- Price.
- Availability badge.
- Delivery estimate.
- Product source disclosure.

### Included items

A structured list of exactly what is included.

### Options

- Variant.
- Size.
- Color.
- Style.
- Quantity.

### Personalization

- Wrapping.
- Card.
- Message.
- QR content.
- Add-ons.

### Delivery information

- Zone.
- Estimated timing.
- MPHORA eligibility.
- By-order lead time.
- Cutoff time when relevant.

### Conditions

- Substitution policy.
- Cancellation limitations.
- Product variation.
- External-product disclosure.
- Handling restrictions.

### Actions

- Add to cart.
- Buy now.
- Ask HADIA.
- Check another date.
- Check another zone.

---

## 12. Product image behavior

The customer app should:

- Use responsive image sizes.
- Provide image alt text.
- Avoid layout shifting.
- Support zoom or full-screen view.
- Indicate when an image is illustrative.
- Show relevant variant image when available.

Do not reuse unrelated product images.

---

## 13. HADIA customer interface

HADIA may be presented as:

- Guided chat.
- Conversational wizard.
- Hybrid chat and filters.

The interface should show:

- HADIA identity.
- Progress.
- Current constraints.
- Suggested products.
- Reasons for suggestions.
- Ability to edit budget, date, zone, or recipient.
- Human support handoff.

The customer must be able to leave HADIA and browse normally.

HADIA must not trap the customer in a chat-only experience.

---

## 14. MPHORA customer interface

The MPHORA screen should show only currently eligible items.

Required context:

- Selected zone.
- Current time.
- Cutoff.
- Estimated delivery window.
- Number of eligible options.
- Terms affecting speed.

If no MPHORA options exist:

> There are no MPHORA gifts available for this zone and time. Scheduled delivery options are still available.

The screen must not show stale eligibility.

---

## 15. Cart

The cart should support:

- Product.
- Variant.
- Quantity.
- Add-ons.
- Personalization summary.
- Recipient association.
- Estimated delivery.
- Price breakdown.
- Remove.
- Edit.
- Save progress.

MVP rule:

One cart should create one order for one destination and one responsible partner.

Avoid combining products requiring multiple partners.

If items cannot be fulfilled by one partner:

- Block the combination.
- Suggest separate orders.
- Offer compatible alternatives.

---

## 16. Cart validation

Before checkout, validate:

- Product still published.
- Price still valid.
- External price still valid.
- Stock.
- Partner.
- Zone.
- Delivery date.
- Cutoff.
- Personalization.
- Product compatibility.
- One-partner rule.
- Quote expiration.

If anything changed, explain clearly.

Example:

> The delivery price changed because the selected address is in another zone. Review the new total before continuing.

---

## 17. Recipient form

Recommended fields:

- Recipient full name.
- Phone when required.
- Relationship.
- Surprise mode.
- Delivery contact preference.
- Optional note.

Privacy rules:

- Explain why phone is requested.
- Allow no-contact surprise when operationally possible.
- Do not use recipient data for marketing without consent.

---

## 18. Address form

Required fields may include:

- Street.
- Exterior number.
- Interior number.
- Neighborhood.
- Postal code.
- City.
- State.
- References.
- Map pin.
- Delivery instructions.

Validation should detect:

- Missing number.
- Unsupported city.
- Invalid postal code.
- Incomplete references.
- Address outside coverage.

---

## 19. Delivery scheduling

The customer may select:

- Earliest available.
- Specific date.
- Available time window.
- MPHORA when eligible.

The interface must distinguish:

- Requested date.
- Estimated date.
- Confirmed delivery window.
- Provider tracking estimate.

Do not present estimates as guarantees.

---

## 20. Surprise settings

Supported options may include:

### Full surprise

Recipient is not contacted unless delivery fails.

### Discreet coordination

Recipient is contacted without revealing gift details.

### Scheduled with recipient

Recipient may confirm availability.

The selected mode should appear in order summary.

---

## 21. Personalization editor

The editor should support:

- Message text.
- Character limit.
- Name.
- Wrapping selection.
- Color.
- Card type.
- QR upload or URL when approved.
- Preview where possible.

Validation:

- Required fields.
- File type.
- File size.
- Restricted content.
- Spelling confirmation.
- Irreversible work acknowledgment.

---

## 22. Checkout

Recommended checkout sections:

```text
1. Contact
2. Recipient
3. Delivery address
4. Delivery timing
5. Personalization
6. Order summary
7. Payment
```

Mobile checkout should:

- Preserve data.
- Show progress.
- Allow back navigation.
- Avoid repeated input.
- Keep final total visible.
- Display quote expiration.

---

## 23. Order summary

Before payment, show:

- Product.
- Variant.
- Add-ons.
- Personalization.
- Delivery address.
- Recipient.
- Surprise mode.
- Estimated timing.
- Product source.
- Price lines.
- Discount.
- Final total.
- Cancellation notes.
- Required consent.

The customer must explicitly confirm.

---

## 24. Payment screen

Payment screen requirements:

- Approved payment methods.
- Secure provider flow.
- Final amount.
- Currency.
- Order summary.
- Error handling.
- Retry.
- Return handling.
- Duplicate-payment prevention.

Customer-visible states:

```text
Waiting for payment
Payment under review
Payment approved
Payment rejected
Payment cancelled
```

---

## 25. Payment success

After verified approval:

- Show order number.
- Show success state.
- Show next step.
- Provide tracking link.
- Send notification.
- Prevent duplicate order creation.
- Clear cart safely.

Preferred message:

> Your payment was approved. MPHO is now confirming the partner responsible for preparing your gift.

---

## 26. Payment failure

The customer should see:

- Clear failure state.
- Whether any charge was completed.
- Retry action.
- Alternative payment method.
- Support action.
- Preserved cart and quote when valid.

Avoid generic:

> Something went wrong.

---

## 27. Orders list

The orders screen should show:

- Order number.
- Main product image.
- Recipient.
- Delivery date.
- Current customer-facing status.
- Total.
- Support indicator.
- Action required badge.

Filters may include:

- Active.
- Delivered.
- Cancelled.
- Refunded.
- Needs action.

---

## 28. Order detail

Recommended sections:

### Header

- Order number.
- Current status.
- Estimated delivery.
- Recipient.

### Timeline

Customer-friendly state history.

### Gift

- Items.
- Personalization.
- Evidence when visible.

### Delivery

- Address.
- Surprise mode.
- Courier status.
- Tracking link.

### Payment

- Total.
- Payment state.
- Refund state.

### Support

- Report problem.
- View active case.
- Contact support.

### Actions

Depending on state:

- Approve substitution.
- Correct address.
- Request cancellation.
- Download summary.
- Rate order.
- Reorder.

---

## 29. Order timeline

Timeline events should use understandable language.

Example:

```text
Payment approved
Partner accepted
Product confirmed
Preparation started
Gift ready
Courier assigned
Out for delivery
Delivered
```

External product timeline:

```text
Payment approved
External purchase created
Product in transit to Punto MPHO
Product received
Preparation started
Gift ready
Delivered
```

---

## 30. Customer actions by state

### Before payment

- Edit everything.
- Remove items.
- Cancel draft.

### Paid, assignment pending

- View.
- Request cancellation.
- Contact support.

### Partner accepted

- Limited changes.
- Approve substitutions.
- Request support.

### Preparing

- Changes may be restricted.
- Cancellation may have cost.

### Ready or picked up

- Address changes may create a new fee.
- Normal cancellation may be blocked.

### Delivered

- Confirm.
- Rate.
- Report issue.
- Reorder.
- Save occasion.

---

## 31. Substitution approval screen

The customer should see:

- Original item.
- Replacement.
- Images.
- Reason.
- Price difference.
- Timing impact.
- Approve.
- Reject.
- Request support.

No substitution should be applied without recorded approval unless pre-authorized.

---

## 32. Cancellation screen

The screen should show:

- Current stage.
- Work already completed.
- Refund estimate.
- Non-refundable costs.
- External return conditions.
- Confirmation action.

Cancellation must not be represented as instant if review is required.

---

## 33. Refund screen

The customer should see:

- Refund amount.
- Reason.
- Status.
- Initiation date.
- Payment method.
- Provider reference when appropriate.
- Estimated processing time.

States:

```text
Requested
Under review
Approved
Sent to payment provider
Completed
Rejected
```

Do not show `Completed` without provider confirmation.

---

## 34. Support

Support entry points:

- Order detail.
- Help center.
- HADIA handoff.
- Payment screen.
- Delivery issue.
- Account screen.

Support categories:

- Payment.
- Product.
- Personalization.
- Partner.
- Delivery.
- Cancellation.
- Refund.
- Account.
- Security.

A support case should automatically include order context.

---

## 35. Account

Account sections:

- Profile.
- Contact information.
- Addresses.
- Saved recipients.
- Orders.
- Payment preferences when supported.
- Reminders.
- Notification settings.
- Privacy.
- Security.
- Sign out.
- Delete-account request.

Deleting an account must not remove required order, financial, or audit records.

---

## 36. Saved addresses

The customer may:

- Add.
- Edit.
- Delete.
- Set default.
- Label as home, office, family, or custom.

Before using a saved address, the system should revalidate coverage.

---

## 37. Saved recipients

Future or optional MVP feature.

A saved recipient may include:

- Name.
- Relationship.
- Preferred address.
- Phone.
- Surprise preference.
- Occasion dates.
- Gift notes.

Use only with customer consent.

Do not build sensitive profiling without privacy review.

---

## 38. Notifications

Transactional notification preferences may include:

- In-app.
- Email.
- WhatsApp.
- Push.

Marketing preferences must remain separate.

The customer should not be allowed to disable critical transactional communication when it is required to complete delivery.

---

## 39. PWA behavior

The PWA may support:

- Install prompt.
- Home-screen icon.
- Cached public catalog shell.
- Offline fallback.
- Push notifications in supported environments.
- Saved session.
- Deep links to orders.

Do not cache:

- Sensitive customer data.
- Payment details.
- Private evidence.
- Recipient address without secure controls.

---

## 40. Loading states

Every data screen should define:

- Initial loading.
- Background refresh.
- Empty state.
- Error.
- Partial data.
- Offline.

Use skeletons only when useful.

Do not leave blank white screens.

---

## 41. Error states

Required error handling:

- Network unavailable.
- Product unavailable.
- Quote expired.
- Payment failed.
- Address unsupported.
- Partner unavailable.
- Delivery unavailable.
- Upload failed.
- Session expired.
- Order already updated.
- Duplicate action.

Every error should provide a next action.

---

## 42. Accessibility

Minimum requirements:

- Semantic HTML.
- Keyboard navigation.
- Screen-reader labels.
- Sufficient contrast.
- Visible focus.
- Large touch targets.
- Error summary.
- Field-level errors.
- Non-color-only status.
- Image alt text.
- Reduced motion support.

---

## 43. Performance

The customer app should:

- Load primary content quickly.
- Optimize images.
- Avoid unnecessary client-side JavaScript.
- Use server rendering where useful.
- Cache public content safely.
- Lazy-load secondary content.
- Preserve checkout state.
- Avoid blocking on optional integrations.

---

## 44. Analytics

Track privacy-respecting events such as:

```text
home_viewed
coverage_checked
hadia_started
hadia_completed
product_viewed
product_added_to_cart
checkout_started
quote_failed
payment_started
payment_approved
payment_failed
order_viewed
substitution_responded
support_opened
order_delivered
order_rated
reorder_started
```

Do not send sensitive recipient data to analytics platforms.

---

## 45. Security

The customer app must:

- Use authenticated private routes.
- Validate ownership on the server.
- Protect evidence URLs.
- Avoid exposing partner internal data.
- Avoid trusting client totals.
- Use secure session handling.
- Prevent CSRF where applicable.
- Rate-limit sensitive actions.
- Validate uploads.
- Log security-sensitive actions.

---

## 46. MVP screen list

Required MVP screens:

```text
Home
Explore
Search results
Product detail
HADIA guided flow
MPHORA collection
Cart
Coverage
Recipient
Address
Personalization
Checkout
Payment return
Order success
Orders list
Order detail
Substitution decision
Cancellation request
Refund status
Support
Login
Register
Account
Addresses
Privacy and policies
```

---

## 47. Future screens

Future possibilities:

- Reminders.
- Saved recipients.
- Gift history.
- Loyalty.
- Corporate gifting.
- Group gifting.
- Gift registry.
- Subscription.
- Recipient preference profile.
- Live courier map.
- Advanced recommendations.

---

## 48. Definition of done

A customer-app feature is done when:

- It follows documented business rules.
- It works on mobile.
- It handles loading and error.
- It is accessible.
- It uses customer-safe wording.
- It validates on server.
- It does not expose sensitive data.
- It maps correctly to order states.
- It passes lint, typecheck, tests, and build.
- It includes analytics only when privacy-safe.
- Documentation is updated.

---

## 49. Summary

The MPHO customer app must make gifting feel simple while remaining operationally truthful.

The customer should always understand:

- What they are buying.
- When it may arrive.
- What it costs.
- What is happening.
- Whether action is required.
- How to get help.
