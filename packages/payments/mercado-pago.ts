import { MercadoPagoConfig, Payment, Preference, WebhookSignatureValidator } from 'mercadopago'
import type { PaymentConfig } from './config'
import type { CheckoutRequest, PaymentProvider, ProviderPayment, NormalizedPaymentStatus, WebhookSignatureInput } from './types'

function exactMinorUnits(value: number | undefined): number | null {
  if (value == null || !Number.isFinite(value)) return null
  const minor = Math.round(value * 100)
  return Math.abs(value * 100 - minor) < Number.EPSILON * 100 ? minor : null
}

export class MercadoPagoPaymentProvider implements PaymentProvider {
  private readonly payment: Payment
  private readonly preference: Preference

  constructor(private readonly config: PaymentConfig) {
    const client = new MercadoPagoConfig({ accessToken: config.accessToken, options: { timeout: config.timeoutMs } })
    this.payment = new Payment(client)
    this.preference = new Preference(client)
  }

  async createCheckoutSession(request: CheckoutRequest) {
    const result = await this.preference.create({
      requestOptions: { idempotencyKey: request.externalReference },
      body: {
        items: [{ id: 'mpho-order', title: 'Pedido MPHO', quantity: 1, currency_id: 'MXN', unit_price: request.amountMinor / 100 }],
        external_reference: request.externalReference,
        notification_url: request.notificationUrl,
        back_urls: { success: request.backUrl, pending: request.backUrl, failure: request.backUrl },
        auto_return: 'approved',
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: request.expiresAt.toISOString(),
        payment_methods: {
          excluded_payment_types: [{ id: 'ticket' }, { id: 'atm' }, { id: 'bank_transfer' }],
          excluded_payment_methods: [{ id: 'oxxo' }, { id: 'paycash' }],
          installments: 1,
        },
        metadata: { integration: 'mpho_checkout_pro_v1' },
      },
    })
    const checkoutUrl = this.config.environment === 'production' ? result.init_point : result.sandbox_init_point
    if (!result.id || !checkoutUrl) throw new Error('Provider returned an incomplete checkout session.')
    return { preferenceId: result.id, checkoutUrl, expiresAt: request.expiresAt }
  }

  async getPayment(paymentId: string) {
    try { return this.toPayment(await this.payment.get({ id: paymentId })) } catch (error) {
      if (typeof error === 'object' && error && 'status' in error && error.status === 404) return null
      throw error
    }
  }

  async searchPaymentByExternalReference(externalReference: string) {
    const result = await this.payment.search({ options: { external_reference: externalReference, sort: 'date_created', criteria: 'desc', limit: 1 } })
    const id = result.results?.[0]?.id
    return id ? this.getPayment(String(id)) : null
  }

  async expireCheckoutSession(preferenceId: string) {
    try {
      const current = await this.preference.get({ preferenceId })
      if (!current.items?.length) return false
      const result = await this.preference.update({ id: preferenceId, updatePreferenceRequest: { items: current.items, expires: true, expiration_date_to: new Date().toISOString() } })
      return result.id === preferenceId
    } catch { return false }
  }

  verifyWebhookSignature(input: WebhookSignatureInput) {
    try {
      WebhookSignatureValidator.validate({ ...input, secret: this.config.webhookSecret })
      return true
    } catch { return false }
  }

  mapProviderStatus(status: string): NormalizedPaymentStatus {
    if (status === 'approved') return 'approved'
    if (status === 'pending' || status === 'in_process' || status === 'authorized') return 'pending'
    if (status === 'rejected') return 'rejected'
    if (status === 'cancelled' || status === 'refunded' || status === 'charged_back') return 'cancelled'
    return 'error'
  }

  private toPayment(value: Awaited<ReturnType<Payment['get']>>): ProviderPayment {
    return {
      id: String(value.id), status: value.status ?? 'unknown', statusDetail: value.status_detail ?? null,
      externalReference: value.external_reference ?? null,
      // The Payments API does not consistently expose the Checkout Pro preference ID;
      // `order.id` is a merchant-order identifier and must not be misclassified.
      preferenceId: typeof value.metadata?.preference_id === 'string' ? value.metadata.preference_id : null,
      amountMinor: exactMinorUnits(value.transaction_amount), currency: value.currency_id ?? null,
      liveMode: value.live_mode === true, applicationId: null,
      createdAt: value.date_created ? new Date(value.date_created) : null,
      approvedAt: value.date_approved ? new Date(value.date_approved) : null,
      refunded: (value.transaction_amount_refunded ?? 0) > 0,
    }
  }
}
