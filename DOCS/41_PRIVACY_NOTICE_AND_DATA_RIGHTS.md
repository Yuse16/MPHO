# 41_PRIVACY_NOTICE_AND_DATA_RIGHTS.md

## 1. Status

```text
INTERNAL PRIVACY REQUIREMENTS AND DRAFT SKELETON
NOT READY FOR PUBLICATION
PRIVACY AND LEGAL REVIEW REQUIRED
```

This document defines the required privacy program and a Spanish notice skeleton.

The final notice must reflect actual systems, vendors, purposes, retention periods, and legal entity.

---

## 2. Current framework

MPHO must verify the current versions of:

- Federal Law on Protection of Personal Data Held by Private Parties.
- Applicable regulation.
- Privacy Notice Guidelines.
- Rules and procedures of the current competent authority.
- Consumer and electronic-commerce obligations.
- Sector-specific rules.

As of the research date, private-sector data protection is governed by the federal law published in 2025, and the competent federal authority structure includes the Secretaría Anticorrupción y Buen Gobierno.

This must be reverified immediately before publication.

---

## 3. Required placeholders

```text
[LEGAL_NAME]
[TRADE_NAME]
[LEGAL_ADDRESS]
[PRIVACY_EMAIL]
[ARCO_PORTAL_OR_PROCESS]
[PRIVACY_PHONE]
[LAST_UPDATE_DATE]
[NOTICE_VERSION]
[VENDOR_LIST_URL]
[COOKIE_SETTINGS_URL]
[RETENTION_TABLE_URL_OR_REFERENCE]
```

---

## 4. Privacy governance

MPHO must maintain:

- Data inventory.
- Processing-purpose register.
- Vendor register.
- Transfer register.
- Consent records.
- Privacy notice versions.
- Retention schedule.
- ARCO request register.
- Incident register.
- Security controls.
- Privacy impact assessment for high-risk features.
- AI data-flow assessment.
- Recipient-data assessment.
- Children's-data position.
- Marketing suppression list.

---

## 5. Data subjects

```text
customers
recipients
potential customers
partner owners
partner employees
couriers
support contacts
website visitors
job applicants future
vendors
administrators
```

Each group may require a different or layered notice.

---

## 6. Data categories

### Identification and contact

- Name.
- Email.
- Phone.
- Account identifier.
- Authentication metadata.

### Transaction

- Cart.
- Order.
- Product.
- Price.
- Payment-provider reference.
- Refund.
- Invoice data.
- Support history.

### Recipient and delivery

- Recipient name.
- Relationship.
- Phone.
- Address.
- Map location.
- Instructions.
- Surprise preference.
- Delivery evidence.

### Personalization

- Gift message.
- Images.
- Audio.
- Video.
- QR content.
- Preferences.

### Partner

- Business.
- Representative.
- Staff.
- Address.
- Capabilities.
- Documents.
- Earnings.
- Payout account.
- Evidence.
- Performance.

### Technical and security

- Device.
- Session.
- IP or derived risk signal when appropriate.
- Request ID.
- Logs.
- Fraud signals.
- Authentication events.
- Audit events.

### AI interaction

- HADIA messages.
- Structured constraints.
- Recommendation.
- Feedback.
- Tool-call metadata.

---

## 7. Sensitive-data rule

MPHO should not request sensitive data unless a documented feature requires it and legal review approves it.

Avoid requesting:

- Health history.
- Religion.
- Political views.
- Sexual life.
- Biometric identification.
- Government ID beyond real operational need.
- Precise geolocation unrelated to delivery.

An allergy note may reveal health-related information.

If such information is accepted:

- Make it optional.
- Explain the purpose.
- Restrict access.
- Avoid analytics.
- Define retention.
- Do not promise medical safety.

---

## 8. Primary purposes

Potential primary purposes:

- Create and secure account.
- Generate gift recommendations.
- Create quote.
- Process order.
- Process payment through provider.
- Assign partner.
- Prepare gift.
- Coordinate delivery.
- Contact customer and recipient.
- Resolve incident.
- Process refund.
- Record partner earning and payout.
- Prevent fraud.
- Secure platform.
- Issue invoice.
- Meet legal obligations.
- Provide support.

The final notice must remove purposes not actually used.

---

## 9. Secondary purposes

Potential secondary purposes:

- Marketing.
- Promotions.
- Occasion reminders.
- Personalized advertising.
- Product research.
- Non-essential analytics.
- Customer surveys.

Secondary purposes should be separated.

The person must be able to refuse them without blocking an order.

---

## 10. Recipient data

The customer should be told:

- Provide accurate recipient information.
- Provide only data necessary for the gift and delivery.
- Do not use MPHO to harass, surveil, threaten, or expose another person.
- MPHO may contact the recipient for delivery.
- MPHO will not automatically enroll the recipient in marketing.

The recipient should receive a layered notice or link at first practical contact when required and operationally appropriate.

---

## 11. Partners and couriers

Partner access must be limited to assigned work.

Partner may receive:

- Order reference.
- Product and preparation details.
- Recipient data necessary for preparation or delivery.
- Delivery instructions.
- Support contact.

Partner may not receive:

- Customer's unrelated order history.
- Payment instrument.
- Other partners' data.
- Fraud notes not required for action.
- Private messages unrelated to preparation.

Courier receives only the minimum needed for assigned delivery.

---

## 12. Vendors and transfers

The final notice and contracts must distinguish:

- Processor service.
- Remittance needed to provide service.
- Independent third-party transfer.
- Transfer requiring consent.
- Cross-border processing.
- Legal disclosure.

Potential vendors:

- Supabase.
- Vercel.
- Payment provider.
- WhatsApp/Meta.
- Email provider.
- AI provider.
- n8n host.
- Delivery provider.
- Maps provider.
- Error-monitoring provider.
- Analytics provider.
- External marketplace.

Do not list a vendor that is not actually used.

Do not omit a vendor receiving personal data.

---

## 13. AI-specific privacy requirements

HADIA must:

- Use the minimum context.
- Separate sessions.
- Avoid unnecessary full names and addresses.
- Avoid payment and payout data.
- Avoid private evidence.
- Define provider retention.
- Define whether provider uses content for training.
- Validate provider contract and settings.
- Allow human handoff.
- Provide deterministic non-AI route.
- Record prompt/model version when needed for audit.
- Avoid using customer conversations for marketing training without separate, valid authorization.

---

## 14. Cookies and trackers

The privacy notice should link to `46_COOKIES_ANALYTICS_AND_COMMUNICATION_CONSENT.md`.

Classify:

- Essential.
- Preference.
- Analytics.
- Marketing.

Non-essential trackers should not load before the selected consent standard permits them.

The exact legal consent requirement must be reviewed, but MPHO should adopt transparent user control as a baseline.

---

## 15. Retention

The final retention schedule must specify a purpose and duration or decision rule.

Example internal categories:

```text
account while active plus closure period
order and financial records for legal/accounting period
recipient delivery data for order and dispute period
private personalization media for short operational period
delivery proof for dispute and legal period
HADIA raw chat for limited support/security period
structured recommendation data for shorter or consented period
security logs based on risk
marketing suppression record while needed to honor opt-out
```

Do not promise a fixed period without operational and legal validation.

---

## 16. ARCO and privacy rights

The process should support applicable rights, including:

- Access.
- Rectification.
- Cancellation.
- Opposition.
- Revocation of consent.
- Limitation of use or disclosure.
- Other rights required by current law.

Process requirements:

- Identity verification proportional to risk.
- Request acknowledgment.
- Folio.
- Legal deadline tracking.
- Search across systems.
- Response.
- Secure delivery.
- Audit.
- Appeal or authority information where required.

Do not require unnecessary identity documents by default.

---

## 17. Data deletion limits

Deletion may not remove:

- Required financial records.
- Fraud evidence.
- Audit logs.
- Active legal holds.
- Records required to resolve an order or dispute.
- Data required by law.

When deletion is not possible:

- Explain.
- Restrict use.
- Anonymize where possible.
- Retain only necessary fields.

---

## 18. Security incidents

The law and contracts must be reviewed to determine notice obligations.

The internal process must:

- Determine affected data.
- Determine affected people.
- Contain.
- Preserve evidence.
- Assess harm.
- Notify when legally required.
- Explain recommended protective action.
- Record the decision.

Do not conceal a relevant breach merely because a provider caused it.

---

## 19. Children and adolescents

The safest MVP position is:

```text
No account or purchase by minors unless legal review approves a controlled model.
```

Gifts for minors may be purchased by adults, but MPHO should avoid collecting unnecessary data about the minor recipient.

Features specifically directed to children require separate legal and safety review.

---

## 20. Spanish integral notice skeleton

# Aviso de Privacidad Integral de MPHO

**Responsable:** `[LEGAL_NAME]`  
**Nombre comercial:** MPHO  
**Domicilio:** `[LEGAL_ADDRESS]`  
**Correo de privacidad:** `[PRIVACY_EMAIL]`  
**Versión:** `[NOTICE_VERSION]`  
**Última actualización:** `[LAST_UPDATE_DATE]`

## 20.1 Responsable

`[LEGAL_NAME]`, responsable de MPHO, es responsable del tratamiento de los datos personales descritos en este aviso, salvo cuando se indique que un tercero actúa como responsable independiente.

## 20.2 Datos tratados

Podemos tratar, según la relación y funcionalidad utilizada:

- Identificación y contacto.
- Cuenta y autenticación.
- Pedido, producto, personalización y soporte.
- Datos de destinatario y entrega.
- Referencias de pago y reembolso.
- Facturación.
- Evidencias de preparación y entrega.
- Información de aliados.
- Datos técnicos, seguridad y prevención de fraude.
- Interacciones con HADIA.
- Preferencias y consentimientos.

MPHO no solicita datos completos de tarjeta por sus propios formularios, WhatsApp o chat; el pago se realiza mediante el proveedor indicado.

## 20.3 Finalidades primarias

Usamos los datos para:

- Crear y proteger la cuenta.
- Recomendar regalos.
- Cotizar y procesar pedidos.
- Coordinar aliados y entrega.
- Procesar pagos y reembolsos.
- Atender solicitudes.
- Prevenir fraude y ataques.
- Emitir comprobantes cuando corresponda.
- Cumplir obligaciones legales.
- Resolver incidentes y disputas.

## 20.4 Finalidades secundarias

Con consentimiento y cuando corresponda, podemos usar datos para:

- Promociones.
- Recordatorios de ocasiones.
- Encuestas.
- Analítica no esencial.
- Personalización comercial.

La negativa a estas finalidades no impide realizar un pedido.

Mecanismo de negativa o retiro:

```text
[COOKIE_SETTINGS_URL]
[PRIVACY_EMAIL]
```

## 20.5 Datos de destinatarios

Cuando una persona compra un regalo para alguien más, trataremos los datos del destinatario únicamente para preparar, coordinar, entregar y resolver el pedido, así como para seguridad y obligaciones legales.

El destinatario no será agregado automáticamente a marketing.

## 20.6 Compartición y proveedores

Podemos proporcionar los datos necesarios a:

- Punto MPHO asignado.
- Proveedor de pago.
- Proveedor de entrega.
- WhatsApp y mensajería.
- Correo.
- Hosting, base de datos y almacenamiento.
- Inteligencia artificial.
- Mapas.
- Seguridad, monitoreo y soporte.
- Autoridades cuando exista obligación.

La lista actualizada y las finalidades se encontrarán en `[VENDOR_LIST_URL]`.

## 20.7 HADIA

HADIA utiliza la información proporcionada para recomendar opciones reales.

HADIA no debe recibir datos financieros sensibles ni tiene autoridad para aprobar pagos, reembolsos o cambios administrativos.

## 20.8 Derechos y solicitudes

La persona titular puede presentar las solicitudes aplicables enviando:

```text
Correo: [PRIVACY_EMAIL]
Portal: [ARCO_PORTAL_OR_PROCESS]
```

La solicitud deberá contener la información razonable para identificar a la persona, localizar los datos y describir el derecho solicitado.

MPHO informará el procedimiento, plazos y medios de respuesta conforme a la ley aplicable.

## 20.9 Revocación y limitación

La persona puede solicitar revocar consentimientos o limitar usos secundarios.

Conservaremos una lista mínima de supresión cuando sea necesaria para respetar la baja.

## 20.10 Seguridad

MPHO aplica medidas administrativas, técnicas y físicas proporcionales al riesgo.

Ningún sistema puede garantizar seguridad absoluta.

Cuando ocurra un incidente relevante, se aplicará el procedimiento legal y de seguridad correspondiente.

## 20.11 Conservación

Conservaremos la información durante el tiempo necesario para la operación, atención, seguridad, contabilidad, obligaciones legales y defensa de derechos.

Los periodos se definirán en la tabla vigente de conservación.

## 20.12 Cambios

Los cambios materiales se comunicarán por un medio apropiado.

La versión vigente estará disponible en la aplicación.

## 20.13 Autoridad

La persona podrá acudir ante la autoridad competente en materia de protección de datos personales conforme al marco vigente en México.

---

## 21. Layered notices

Create short notices for:

- Account.
- Checkout.
- Recipient.
- HADIA.
- Partner application.
- Partner payout account.
- Evidence upload.
- WhatsApp.
- Cookie banner.
- Support.

Each layered notice links to the integral notice.

---

## 22. Product requirements

- Privacy notice available without login.
- Version stored.
- Consent separated by purpose.
- Marketing unchecked by default.
- Cookie settings retained.
- ARCO channel works.
- Vendor list maintained.
- Recipient notice available.
- Private media retention enforced.
- AI provider settings documented.
- Consent withdrawal propagates.
- Suppression list prevents future marketing.
- Export and deletion workflows tested.

---

## 23. Official references

- Federal Law on Protection of Personal Data Held by Private Parties  
  https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf
- Regulation  
  https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LFPDPPP.pdf
- Privacy Notice Guidelines  
  https://www.dof.gob.mx/nota_detalle.php?codigo=5284966
- Secretaría Anticorrupción y Buen Gobierno  
  https://www.gob.mx/buengobierno
