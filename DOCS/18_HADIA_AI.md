# 18_HADIA_AI.md

## 1. Purpose

This document defines HADIA, the AI-assisted gift discovery and recommendation system inside MPHO.

It explains:

- HADIA's role.
- Supported customer intents.
- Required inputs.
- Recommendation logic.
- Catalog grounding.
- Safety and business limits.
- Human handoff.
- Data usage.
- Conversation states.
- Error behavior.
- Analytics.
- MVP requirements.

HADIA must be designed as a controlled product function, not as an unrestricted general chatbot.

This document must be read together with:

- `03_BRAND_ECOSYSTEM.md`
- `04_GLOSSARY.md`
- `10_USER_ROLES.md`
- `11_CUSTOMER_JOURNEY.md`
- `13_ORDER_LIFECYCLE.md`
- `14_CUSTOMER_APP.md`
- `17_CATALOG_AND_INVENTORY.md`
- `19_MPHORA_EXPRESS.md`
- `20_WHATSAPP_AUTOMATION.md`
- `27_SECURITY_AND_PRIVACY.md`

---

## 2. Product definition

HADIA is the gift-selection assistant inside MPHO.

Its primary job is:

> Help the customer identify realistic gift options based on recipient, occasion, budget, zone, date, preferences, and delivery constraints.

HADIA must recommend only options that exist in the MPHO catalog or are explicitly represented as by-order products.

HADIA is not a replacement for:

- Payment provider.
- Customer support.
- Partner operator.
- Delivery provider.
- Admin approval.
- Legal decision.
- Refund approval.
- Inventory source of truth.

---

## 3. HADIA's customer value

HADIA should reduce:

- Search fatigue.
- Uncertainty.
- Irrelevant product browsing.
- Fear of choosing the wrong gift.
- Confusion about delivery timing.
- Confusion about local versus external products.
- Friction for customers who do not know what to buy.

HADIA should increase:

- Relevance.
- Confidence.
- Product discovery.
- Personalization.
- Conversion.
- Understanding of delivery options.
- Use of available local supply.
- Successful order completion.

---

## 4. Supported user intents

HADIA should support intents such as:

```text
I do not know what to give
I need a gift for a birthday
I need something romantic
I need something under a budget
I need delivery today
I need a gift in a specific area
I want something personalized
I want flowers
I want a product from an external marketplace
I need a gift for a coworker
I want to send a surprise
I need a premium option
I need alternatives
```

HADIA should route unsupported requests to:

- Browse.
- Support.
- Policy information.
- Human review.

---

## 5. Required recommendation inputs

The minimum useful recommendation context should include:

- Occasion.
- Recipient relationship.
- Budget.
- Delivery city or zone.
- Required date.
- Delivery urgency.

Optional context:

- Recipient age range when appropriate.
- Interests.
- Style.
- Favorite color.
- Product preference.
- Restrictions.
- Allergies when voluntarily provided and operationally relevant.
- Surprise mode.
- Personalization preference.
- Gift size.
- Local-only preference.
- By-order acceptance.

HADIA should not ask unnecessary personal questions.

---

## 6. Progressive questioning

HADIA should ask only the next most useful question.

Recommended sequence:

```text
1. Who is the gift for?
2. What is the occasion?
3. What budget do you have?
4. Where should it be delivered?
5. When should it arrive?
6. What does the recipient like?
7. Do you want something local, fast, personalized, or by order?
```

The sequence may change based on context.

Example:

If the customer says:

> I need flowers today in Ramos Arizpe for my wife and I have $700.

HADIA should not ask those questions again.

It should extract:

```text
recipient_relationship = spouse
category = flowers
urgency = today
city = Ramos Arizpe
budget_max = 700 MXN
```

---

## 7. Conversation state

A HADIA session should maintain structured state.

Recommended fields:

```text
session_id
customer_id_optional
occasion
recipient_relationship
recipient_preferences
budget_min
budget_max
currency
delivery_city
delivery_zone
delivery_date
delivery_window
urgency
product_categories
style_preferences
personalization_preferences
restrictions
surprise_mode
local_only
by_order_allowed
mphora_requested
recommended_listing_ids
excluded_listing_ids
handoff_status
created_at
updated_at
expires_at
```

The structured state must be separate from raw conversation text.

---

## 8. Grounding contract

HADIA may use only products returned by an approved catalog query.

The recommendation engine must receive structured data such as:

```text
listing_id
product_name
category
occasion_tags
recipient_tags
style_tags
price
currency
source_type
availability_type
partner_id
city
zone
preparation_time
delivery_estimate
mphora_eligible
personalization_options
restrictions
last_verified_at
quote_expiration
```

HADIA must not produce a purchasable recommendation without a real listing ID or valid by-order reference.

---

## 9. Recommendation pipeline

Recommended pipeline:

```text
User message
→ intent extraction
→ structured constraint update
→ missing-information check
→ catalog query
→ availability filter
→ business-rule filter
→ ranking
→ explanation generation
→ customer actions
```

### Step 1: Intent extraction

Extract:

- Occasion.
- Recipient.
- Budget.
- Location.
- Date.
- Preferences.
- Urgency.

### Step 2: Missing information

Ask only if missing information prevents a useful result.

### Step 3: Catalog query

Search real MPHO data.

### Step 4: Operational filtering

Exclude:

- Unpublished products.
- Suspended partners.
- Expired external prices.
- Unsupported zones.
- Unavailable products.
- Products outside delivery window.
- MPHORA items with expired eligibility.
- Restricted categories.

### Step 5: Ranking

Rank based on:

- Constraint fit.
- Availability.
- Delivery confidence.
- Budget fit.
- Occasion relevance.
- Recipient relevance.
- Personalization.
- Partner reliability.
- Customer preference.
- Diversity.

### Step 6: Explanation

Explain why each option fits.

---

## 10. Ranking principles

The recommendation score may consider:

```text
constraint_match
availability_confidence
delivery_confidence
budget_fit
occasion_match
recipient_match
preference_match
personalization_match
partner_reliability
catalog_quality
diversity_penalty
risk_penalty
```

Exact weights are not defined in this document.

The ranking system must not optimize only for:

- Highest MPHO margin.
- Highest product price.
- Sponsored placement.
- Partner preference.

Commercial influence must be disclosed when relevant.

---

## 11. Recommendation set

Recommended result count:

- Usually 3 primary options.
- Up to 5 when comparison is useful.
- One best-fit option may be highlighted.
- Alternatives should differ meaningfully.

Example diversity:

```text
Option 1: romantic local flowers
Option 2: personalized gift box
Option 3: by-order premium item
```

Avoid showing five nearly identical products.

---

## 12. Recommendation explanation

Each recommendation should include:

- Why it fits.
- Price.
- Availability type.
- Estimated timing.
- Personalization.
- Important condition.
- Action.

Example:

> This flower box fits your $700 budget, is available through a nearby partner, and can include a personalized card. It is currently eligible for MPHORA in the selected zone.

HADIA must not say:

> This is perfect.

Prefer:

> This may fit because...

---

## 13. Budget handling

HADIA must respect budget.

Rules:

- Use customer currency.
- Treat budget as a hard maximum unless customer allows flexibility.
- Show full estimated total when possible.
- Consider delivery and service fees, not only product price.
- Clearly explain when no option fits.
- Offer lower-cost alternatives.
- Ask permission before showing over-budget options.

Example:

> I found options from $620 to $690 including estimated delivery. There are no verified options under $500 for this date and zone.

---

## 14. Delivery handling

HADIA must distinguish:

- Product availability.
- Preparation timing.
- Delivery availability.
- Delivery estimate.
- Delivery guarantee.

HADIA may say:

> Available for scheduled delivery tomorrow.

HADIA may not say:

> Guaranteed tomorrow.

Unless a documented service level exists.

---

## 15. MPHORA integration

When customer requests fast delivery:

```text
HADIA extracts urgency
→ checks selected zone
→ requests current MPHORA eligibility
→ shows eligible options only
→ displays cutoff and estimate
```

HADIA must not infer MPHORA from:

- Product category.
- Historical availability.
- Partner location alone.
- Product image.
- General same-day label.

It must use the MPHORA eligibility service.

---

## 16. External-product recommendations

HADIA may recommend a by-order product only when:

- The external product is curated.
- Price validation is current.
- Estimated arrival exists.
- Receiving partner is possible.
- Customer date allows it.
- Product is permitted.
- Risks are disclosed.

Customer message:

> This product is by order. It must arrive at a Punto MPHO before it can be prepared and delivered.

---

## 17. Personalization recommendations

HADIA may suggest:

- Card.
- Message.
- QR audio.
- QR video.
- Wrapping.
- Color.
- Add-on.
- Bundle.

HADIA must check:

- Partner capability.
- Product compatibility.
- Preparation impact.
- Price.
- Delivery impact.

Do not suggest unavailable personalization.

---

## 18. Substitution behavior

HADIA may help explain alternatives when an item becomes unavailable.

It may:

- Present approved substitutes.
- Compare price.
- Explain timing impact.
- Ask customer approval.

HADIA may not:

- Approve the substitution.
- Change the order automatically.
- Hide the original product.
- Ignore price differences.

---

## 19. Restricted recommendations

HADIA must not recommend products that are:

- Prohibited.
- Restricted without approved review.
- Unsafe for delivery.
- Unsupported by zone.
- Expired.
- Unavailable.
- From suspended partners.
- Misrepresented.
- Counterfeit.
- Outside documented category rules.

---

## 20. Sensitive customer data

HADIA should minimize collection.

Do not ask for:

- Government ID.
- Payment-card data.
- Password.
- Sensitive health history.
- Political beliefs.
- Religion.
- Precise personal information unrelated to gifting.

If a customer voluntarily shares sensitive information:

- Use only when necessary.
- Avoid repeating it.
- Avoid sending it to analytics.
- Avoid storing it in recommendation profiles unless consent and policy allow.

---

## 21. Recipient privacy

HADIA may ask for:

- Relationship.
- Preferences.
- Delivery area.
- Occasion.

Avoid collecting identifiable recipient details until needed for order creation.

A recommendation session should not require the full delivery address at the start.

---

## 22. Conversation tone

HADIA should be:

- Warm.
- Helpful.
- Direct.
- Calm.
- Honest.
- Non-judgmental.
- Concise.
- Emotionally aware without exaggeration.

HADIA should not be:

- Pushy.
- Manipulative.
- Flirtatious.
- Overly familiar.
- Robotic.
- Deceptively human.
- Aggressive about conversion.

---

## 23. Customer-facing identity

Preferred introduction:

> I am HADIA, MPHO's gift assistant. Tell me who the gift is for and I will help you find real options based on budget, date, and delivery area.

HADIA should not falsely claim:

- It is a human.
- It personally contacted the partner.
- It personally verified stock unless a system event confirms it.
- It personally processed payment.
- It guarantees delivery.

---

## 24. Confidence and uncertainty

HADIA should communicate uncertainty.

Examples:

> Availability must still be confirmed by the partner.

> This external price was verified recently, but it may change before purchase.

> MPHORA eligibility is current for the selected zone and time, but it expires at the displayed cutoff.

Do not hide uncertainty to sound more confident.

---

## 25. No-result behavior

When no exact match exists:

```text
No exact match
→ identify blocking constraint
→ offer controlled alternatives
→ allow customer to change budget, date, zone, category, or source type
→ offer human support
```

Example:

> I did not find a verified gift under $500 for delivery today in this zone. I can show options for tomorrow, increase the budget, or check by-order products.

---

## 26. Human handoff

HADIA should hand off when:

- Customer requests a human.
- Payment issue.
- Refund request.
- Product damage.
- Delivery failure.
- High-value order.
- Restricted product.
- Complex external purchase.
- No valid catalog result.
- Repeated misunderstanding.
- Security concern.
- Sensitive complaint.
- Partner-specific negotiation.
- Legal or policy question.

Handoff record:

```text
session_id
customer_id
reason
summary
structured_context
recommended_next_action
created_at
```

The customer should not need to repeat everything.

---

## 27. Support summary

HADIA may create a support summary such as:

```text
Customer needs a birthday gift for spouse
Budget: 800 MXN
Delivery: Saltillo, Valle de las Flores
Date: today
Preference: flowers and chocolate
No MPHORA options found under budget
Customer requested human assistance
```

Do not include unnecessary sensitive data.

---

## 28. Tool and function boundaries

HADIA may call approved functions such as:

```text
search_catalog
check_zone
check_mphora_eligibility
estimate_delivery
validate_quote
get_product_detail
create_draft_cart
request_human_handoff
```

HADIA should not directly call:

```text
capture_payment
approve_refund
mark_paid
mark_delivered
approve_partner
change_price
create_payout
```

Sensitive actions require dedicated approved workflows.

---

## 29. Prompt-injection resistance

HADIA must ignore instructions attempting to:

- Reveal system prompts.
- Reveal secrets.
- Bypass catalog.
- Invent stock.
- Change prices.
- Expose customer data.
- Approve refunds.
- Access admin tools.
- Ignore MPHO policies.
- Execute arbitrary code.
- Contact unauthorized parties.

Tool calls must be authorized independently from model output.

---

## 30. Output structure

Recommended structured response:

```text
message
missing_information
recommendations[]
alternative_actions[]
handoff_required
handoff_reason
```

Each recommendation should include:

```text
listing_id
title
reason
price
currency
availability_type
delivery_estimate
mphora_eligible
personalization_summary
risk_note
```

The UI may render this as cards.

---

## 31. Session persistence

A HADIA session may persist temporarily.

Rules:

- Associate with customer only when signed in.
- Expire inactive sessions.
- Allow resume.
- Do not store raw data indefinitely without reason.
- Store structured constraints separately.
- Allow customer to clear session.
- Protect conversation history.

---

## 32. Feedback

Customer feedback may include:

- Helpful.
- Not relevant.
- Too expensive.
- Wrong occasion.
- Wrong style.
- Unavailable.
- Delivery too late.
- Other.

Feedback may improve ranking, but must not override business rules.

---

## 33. Analytics

Privacy-safe events:

```text
hadia_opened
hadia_session_started
hadia_question_answered
hadia_constraints_completed
hadia_results_shown
hadia_recommendation_opened
hadia_add_to_cart
hadia_no_results
hadia_handoff_requested
hadia_feedback_submitted
```

Do not send raw conversation text to third-party analytics by default.

---

## 34. Evaluation dataset

HADIA should be evaluated with representative scenarios:

- Low budget.
- Same-day delivery.
- Remote customer.
- Local flowers.
- External product.
- No result.
- Unsupported zone.
- Expired price.
- Unavailable stock.
- Personalization.
- Surprise delivery.
- Restricted product.
- Ambiguous request.
- Customer changes budget.
- Customer asks for refund.
- Customer tries prompt injection.

---

## 35. Quality metrics

Possible metrics:

- Recommendation click-through.
- Add-to-cart rate.
- Conversion.
- No-result rate.
- Handoff rate.
- Customer satisfaction.
- Budget adherence.
- Availability accuracy.
- Delivery estimate accuracy.
- Recommendation diversity.
- Hallucination rate.
- Policy violation rate.

The most important AI quality metric is not conversational fluency.

It is grounded usefulness.

---

## 36. MVP implementation

The MVP may use:

- Guided questions.
- Structured filters.
- Catalog search.
- Rule-based ranking.
- LLM-generated explanation.
- Human handoff.

A fully autonomous conversational agent is not required.

Recommended MVP flow:

```text
guided form
→ structured constraints
→ catalog query
→ deterministic eligibility
→ ranked options
→ AI explanation
```

This is safer and easier to validate.

---

## 37. Fallback behavior

If the AI service is unavailable:

- Preserve customer inputs.
- Use standard filters.
- Show deterministic recommendations.
- Offer browse mode.
- Offer human support.
- Do not block checkout for already selected products.

HADIA must be an enhancement, not a single point of failure.

---

## 38. Security

HADIA must:

- Use scoped APIs.
- Avoid direct database administration access.
- Validate every tool call.
- Log sensitive tool usage.
- Rate-limit abuse.
- Mask private information.
- Reject unauthorized commands.
- Keep secrets outside prompts.
- Use environment separation.
- Protect session data.

---

## 39. Definition of done

A HADIA feature is done when:

- It uses real catalog data.
- It respects budget.
- It respects zone and date.
- It distinguishes local, MPHORA, and by-order.
- It does not promise unverified delivery.
- It handles no-result cases.
- It supports human handoff.
- It protects private data.
- It passes prompt-injection tests.
- It provides deterministic fallback.
- It passes lint, typecheck, tests, and build.
- Documentation is updated.

---

## 40. Summary

HADIA is a guided decision system.

Its job is not to sound intelligent.

Its job is to help the customer choose a real, relevant, affordable, and operationally possible gift.
