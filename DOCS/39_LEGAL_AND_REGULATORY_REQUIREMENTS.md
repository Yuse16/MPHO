# 39_LEGAL_AND_REGULATORY_REQUIREMENTS.md

## 1. Status and purpose

Status:

```text
INTERNAL LEGAL-OPERATIONS REQUIREMENTS
NOT READY FOR PUBLICATION
REQUIRES REVIEW BY QUALIFIED MEXICAN LEGAL AND TAX COUNSEL
```

This document identifies the legal and regulatory decisions MPHO must resolve before handling real customers, recipient addresses, partner payouts, external purchases, or production payments.

It is not a legal opinion and must not be treated as one.

This document must be read together with:

- `06_BUSINESS_MODEL.md`
- `07_MARKETPLACE_RULES.md`
- `08_PARTNER_PROGRAM.md`
- `09_PRICING_AND_COMMISSIONS.md`
- `22_PAYMENTS_AND_PAYOUTS.md`
- `27_SECURITY_AND_PRIVACY.md`
- `31_THREAT_MODEL_AND_ABUSE_CASES.md`
- `37_FRAUD_RISK_AND_FINANCIAL_CONTROLS.md`
- `38_PRODUCTION_READINESS_AND_LAUNCH_CHECKLIST.md`
- `40_CUSTOMER_TERMS_AND_CONDITIONS.md`
- `41_PRIVACY_NOTICE_AND_DATA_RIGHTS.md`
- `42_CANCELLATIONS_REFUNDS_AND_DISPUTES_POLICY.md`
- `43_PARTNER_AGREEMENT_REQUIREMENTS.md`

---

## 2. Legal launch principle

MPHO must not publish generic documents copied from another platform.

The legal documents must match the actual operation:

```text
who sells
who receives payment
who invoices
who owns inventory
who buys external products
who prepares the gift
who contracts delivery
who bears each risk
who handles returns
who processes personal data
who pays partners
```

A mismatch between legal text and real operation is a launch blocker.

---

## 3. Required operating-model decision

Before drafting final terms, counsel must classify each transaction.

Potential models:

### Model A — MPHO as direct seller

MPHO sells the product or service to the customer and separately contracts partners and couriers.

Possible implications:

- MPHO may be the principal consumer-facing supplier.
- MPHO may be responsible for the complete offer.
- MPHO may invoice the complete transaction.
- MPHO may bear broader product, delivery, and refund obligations.

### Model B — MPHO as marketplace or intermediary

A partner sells the product, while MPHO provides technology, coordination, payment, preparation, or delivery services.

Possible implications:

- The actual seller must be clearly identified.
- Responsibilities cannot be hidden from the customer.
- Payment, invoicing, commissions, and consumer liability must be defined.
- MPHO may still have direct obligations for its own services and representations.

### Model C — Mixed model

Different products or services may have different responsible suppliers.

Example:

```text
partner sells product
MPHO sells coordination service
courier provides delivery
external marketplace seller supplies by-order product
partner performs preparation
```

This model is operationally possible but legally and fiscally more complex.

### Required decision

For every order type, document:

```text
transaction_type
seller_of_record
service_provider
payment_recipient
invoice_issuer
delivery_contracting_party
external_purchase_agent
return_responsibility
warranty_responsibility
data_controller
data_processor
```

---

## 4. Entity and authority

Before production, MPHO must define:

- Legal person or individual conducting business.
- Legal name.
- Trade name.
- RFC.
- Tax address.
- Contact address.
- Authorized representative.
- Customer-support contact.
- Privacy contact.
- Bank and payment-provider account owner.
- Authority to enter partner agreements.
- Ownership or license for MPHO, HADIA, and MPHORA brands.

Public documents must not use placeholders after launch.

---

## 5. Consumer-protection requirements

The customer experience must be reviewed against the current Mexican Federal Consumer Protection Law and its regulations.

At minimum, the application should clearly provide before payment:

- Identity and contact of the responsible supplier.
- Accurate product or service description.
- Total price in Mexican pesos.
- Taxes and additional charges when applicable.
- Delivery cost.
- Payment method.
- Availability.
- Delivery date or estimated window.
- Restrictions.
- Cancellation terms.
- Refund terms.
- Warranty or quality conditions.
- Complaint and support channels.
- Seller identity where MPHO is not the seller.

Do not use:

- Misleading availability.
- False urgency.
- Hidden fees.
- Preselected paid extras.
- Inaccessible cancellation.
- Clauses that remove non-waivable consumer rights.
- Terms that contradict the marketing page.
- A blanket “MPHO is never responsible” statement.

---

## 6. Electronic-commerce requirements

The system must preserve evidence of:

- Version of terms accepted.
- Version of privacy notice presented.
- Quote and total shown.
- Product and option snapshot.
- Delivery conditions.
- Customer affirmative action.
- Payment-provider reference.
- Order confirmation.
- Communications.
- Cancellation and refund actions.
- Partner acceptance.
- Delivery evidence.

The legal team must determine whether specific records should use a qualified conservation process under the Code of Commerce and NOM-151-SCFI-2016.

The application should preserve:

```text
document_version
content_hash
accepted_at
actor
order_id
request_id
IP or risk metadata when legally appropriate
provider_reference
```

Do not treat a checkbox alone as sufficient evidence if the surrounding record cannot be reconstructed.

---

## 7. Contracts of adhesion

Counsel must determine whether any MPHO customer or partner contract:

- Is a contract of adhesion.
- Requires mandatory registration before PROFECO.
- May be voluntarily registered.
- Must use a particular mandatory model.
- Needs a registration number displayed.

Do not claim PROFECO registration unless the exact current contract has been registered and remains valid.

The legal review should use the current PROFECO Public Registry of Contracts of Adhesion.

---

## 8. Advertising and promotional claims

Every claim must be provable.

Examples requiring evidence:

```text
same day
fast delivery
verified partner
secure payment
best price
local product
available now
guaranteed
authentic
premium
official
insured
```

Rules:

- “MPHORA” must reflect real eligibility.
- “Local” must use the documented source definition.
- “Verified partner” must match a real verification process.
- Ratings must have a valid source and permission.
- Store photos must not imply an unauthorized partnership.
- Sponsored placement must be disclosed.
- AI-generated images must not misrepresent the exact product.
- Comparative claims need substantiation.

---

## 9. Data-protection framework

MPHO must comply with the current Federal Law on Protection of Personal Data Held by Private Parties, its applicable regulations, privacy-notice rules, and current competent authority requirements.

The privacy program must cover:

- Customer data.
- Recipient data.
- Partner personnel.
- Couriers.
- Support conversations.
- Gift messages.
- Media.
- Addresses.
- Payment references.
- Fraud signals.
- HADIA sessions.
- WhatsApp.
- Analytics.
- Security logs.

The current law and authority must be reverified immediately before launch because the Mexican institutional framework changed in 2025.

---

## 10. Data roles

For each data flow, counsel and security must define:

```text
responsible/controller
processor
subprocessor
independent controller
recipient of transfer
purpose
legal basis or consent
retention
security requirements
deletion or return
```

Examples:

- Payment provider.
- WhatsApp provider.
- Email provider.
- AI provider.
- Delivery provider.
- Supabase.
- Vercel.
- n8n hosting provider.
- Partner.
- External marketplace.

A partner must not receive recipient data merely because it has a partner account.

---

## 11. Recipient-data problem

The recipient may not be the customer and may never create an account.

The legal design must address:

- Why MPHO receives the recipient's data.
- Which customer representation is required.
- Which notice can be provided to the recipient.
- What information may be sent to the recipient.
- How surprise delivery works.
- How long recipient data remains stored.
- Whether the recipient may exercise data rights.
- Why the recipient may not be enrolled in marketing automatically.

---

## 12. Tax and invoicing decision

Before launch, a Mexican accountant and tax counsel must define:

- MPHO tax regime.
- Whether MPHO invoices the whole order or only its service.
- Whether the partner invoices the product.
- Whether the courier invoices delivery.
- How commissions are documented.
- How partner earnings are documented.
- How refunds and partial refunds affect invoices.
- How external purchases are booked.
- How payment-provider fees are booked.
- Whether withholding or platform-specific rules apply.
- Which CFDI and complements apply.
- Required accounting records.
- How taxes appear in customer price.

The software must not hardcode an invoicing model before this decision.

---

## 13. Payment and financial regulation review

The MVP should use an authorized payment provider and avoid holding customer funds longer than operationally necessary.

Counsel must determine whether the selected flow could trigger additional obligations related to:

- Payment aggregation.
- Stored value.
- Wallets.
- Money transmission.
- Split payments.
- Escrow-like holding.
- Credit.
- Financing.
- Recurring charges.
- Cash handling.

MVP exclusions unless specifically reviewed:

```text
MPHO wallet
customer balance
partner stored balance usable as money
credit
loans
crypto
cash collection by courier
automatic autonomous payouts
```

---

## 14. Partner legal relationship

The partner agreement must reflect reality.

Counsel must review:

- Independent-business relationship.
- Whether actual control could create labor risk.
- Payment method.
- Service standards.
- confidentiality.
- data processing.
- use of brand.
- inventory.
- package custody.
- liability.
- insurance.
- subcontractors and staff.
- taxes.
- termination.
- audit.
- non-circumvention.
- dispute process.

A contract label alone does not determine the true legal relationship.

---

## 15. Courier and delivery relationship

Counsel must determine:

- Who contracts the courier.
- Whether courier is provider, subcontractor, partner employee, or independent service.
- Who pays.
- Who invoices.
- Who carries custody.
- Who bears failed-delivery costs.
- What proof is valid.
- What insurance is needed.
- What happens after theft, loss, injury, or vehicle incident.
- Which recipient data is necessary.
- Whether additional platform or labor rules apply.

---

## 16. Product-category legal matrix

No product category may launch without a category review.

Required fields:

```text
category
allowed
age_restricted
permit_required
labeling_requirements
health_requirements
transport_restrictions
return_rules
partner_capability
delivery_rules
legal_owner
review_date
```

Initial safe MVP categories should favor ordinary non-regulated gifts.

Categories requiring specific review before activation:

- Alcohol.
- Tobacco and nicotine.
- Medicines.
- Supplements.
- Cosmetics.
- Food and beverages.
- Perishables.
- Live plants.
- Animals.
- Weapons.
- Chemicals.
- Adult products.
- Gambling products.
- Financial products.
- High-value jewelry.
- Cultural or indigenous designs.
- Copyrighted character merchandise.
- Imported products.
- Products intended for children.

A category being available on another marketplace does not make it lawful or appropriate for MPHO.

---

## 17. Food and perishable products

If MPHO includes food, flowers, fruit, cakes, or temperature-sensitive items, document:

- Responsible producer or seller.
- Ingredient and allergen information when applicable.
- Expiration or consumption conditions.
- Temperature and transport.
- Tamper protection.
- Preparation location.
- hygiene.
- substitution.
- recipient availability.
- failed delivery.
- refund conditions.
- local permits and health rules.

HADIA must not promise allergy safety without verified product data.

---

## 18. Intellectual property

Before launch:

- Search availability of MPHO, HADIA, and MPHORA marks.
- File or plan appropriate trademark applications.
- Secure domains and social handles.
- Confirm ownership of logo and design.
- Confirm code and contractor assignments.
- Obtain partner image and catalog licenses.
- Define customer-content license.
- Avoid counterfeit goods.
- Create takedown process.
- Review AI-generated assets before commercial use.

A domain registration is not trademark protection.

---

## 19. Third-party marketplace relationship

MPHO must not imply official affiliation with Mercado Libre or another marketplace unless a written relationship exists.

Public language should identify:

- The external seller or source when appropriate.
- That availability and price may change.
- That external terms may affect the purchase.
- Who performs the purchase.
- Who handles a return.
- What happens when the external seller cancels.
- What inspection does and does not prove.

---

## 20. Required public documents

Before launch:

- Customer Terms and Conditions.
- Integral Privacy Notice.
- Simplified or layered notice at collection points.
- Cancellation and Refund Policy.
- Delivery Policy.
- External Product Policy.
- Cookie and Tracking Notice.
- Marketing and WhatsApp consent language.
- Contact and complaint information.
- Applicable warranty information.
- Partner-facing terms or agreement.
- Category-specific disclosures.
- Invoice request instructions.

---

## 21. Required internal documents

- Legal decision register.
- Data inventory.
- Vendor register.
- Partner agreement.
- Courier agreement or provider terms review.
- Product-category matrix.
- Contract version register.
- Consent version register.
- Retention schedule.
- Legal-hold procedure.
- Consumer complaint procedure.
- Regulatory request procedure.
- Evidence preservation procedure.
- Tax and invoice mapping.
- Insurance register.

---

## 22. Legal decision register

Every unresolved issue should use:

```text
decision_id
topic
question
current assumption
business impact
technical impact
customer impact
counsel owner
accounting owner
status
decision
effective_date
documents_changed
review_date
```

OpenCode must not invent answers to unresolved legal decisions.

---

## 23. Launch blockers

Production is blocked until:

- Legal entity is identified.
- Responsible customer-facing supplier model is defined.
- Tax and invoicing model is defined.
- Terms are reviewed.
- Privacy notice is reviewed.
- Partner agreement is reviewed.
- Refund rules are reviewed.
- External-purchase role is defined.
- Delivery responsibility is defined.
- Data processors and transfers are documented.
- Restricted categories are disabled.
- Consumer pricing is transparent.
- Complaint contact works.
- Contract registration requirement is resolved.
- Brand usage is cleared.
- Payment-provider agreement is approved.

---

## 24. Normative and official references

Research date: 2026-07-12.

- Federal Consumer Protection Law, current text  
  https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPC.pdf
- Regulation of the Federal Consumer Protection Law  
  https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LFPC_191219.pdf
- PROFECO Virtual Store Monitoring  
  https://www.profeco.gob.mx/tiendasvirtuales/
- PROFECO Public Registry of Contracts of Adhesion  
  https://rpca.profeco.gob.mx/
- Code of Commerce, current text  
  https://www.diputados.gob.mx/LeyesBiblio/pdf/CCom.pdf
- NOM-151-SCFI-2016  
  https://www.dof.gob.mx/normasOficiales/6499/seeco11_C/seeco11_C.html
- Federal Law on Protection of Personal Data Held by Private Parties  
  https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf
- Regulation of the private-sector data law  
  https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LFPDPPP.pdf
- Secretaría Anticorrupción y Buen Gobierno  
  https://www.gob.mx/buengobierno
- Federal Copyright Law  
  https://www.diputados.gob.mx/LeyesBiblio/pdf/LFDA.pdf
- Federal Law for Protection of Industrial Property  
  https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPPI.pdf
- SAT invoice requirements  
  https://www.sat.gob.mx/minisitio/Factura/solicita_requisitos.htm
