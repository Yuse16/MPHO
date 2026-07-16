import type { CheckoutRequest, PaymentProvider, ProviderPayment, NormalizedPaymentStatus, WebhookSignatureInput } from './types'

export type FakeScenario = 'approved' | 'pending' | 'rejected' | 'cancelled' | 'timeout' | 'provider_500' | 'not_found' | 'duplicate_event' | 'out_of_order' | 'wrong_amount' | 'wrong_currency' | 'wrong_environment' | 'late_payment' | 'second_approved'

export class FakePaymentProvider implements PaymentProvider {
  readonly requests: CheckoutRequest[] = []
  constructor(public scenario: FakeScenario = 'approved', private now = new Date('2026-07-16T18:00:00Z')) {}
  async createCheckoutSession(request: CheckoutRequest) {
    this.requests.push(request)
    if (this.scenario === 'timeout') throw new Error('FAKE_TIMEOUT')
    if (this.scenario === 'provider_500') throw new Error('FAKE_PROVIDER_500')
    return { preferenceId: `fake-pref-${request.externalReference}`, checkoutUrl: `https://sandbox.mercadopago.com.mx/checkout/v1/redirect?pref_id=fake`, expiresAt: request.expiresAt }
  }
  async getPayment(id: string) { return this.scenario === 'not_found' ? null : this.payment(id) }
  async searchPaymentByExternalReference(reference: string) { return this.scenario === 'not_found' ? null : this.payment('fake-payment', reference) }
  async expireCheckoutSession() { return this.scenario !== 'provider_500' }
  verifyWebhookSignature(input: WebhookSignatureInput) { return input.xSignature === 'fake-valid-signature' && input.xRequestId.length > 0 && input.dataId.length > 0 }
  mapProviderStatus(status: string): NormalizedPaymentStatus {
    return status === 'approved' ? 'approved' : status === 'pending' ? 'pending' : status === 'rejected' ? 'rejected' : status === 'cancelled' ? 'cancelled' : 'error'
  }
  private payment(id: string, reference = 'fake-reference'): ProviderPayment {
    const status = ['pending', 'rejected', 'cancelled'].includes(this.scenario) ? this.scenario : 'approved'
    return { id, status, statusDetail: `fake_${this.scenario}`, externalReference: reference, preferenceId: 'fake-preference',
      amountMinor: this.scenario === 'wrong_amount' ? 999 : 10000, currency: this.scenario === 'wrong_currency' ? 'USD' : 'MXN',
      liveMode: this.scenario === 'wrong_environment', applicationId: 'fake-app', createdAt: this.now,
      approvedAt: this.scenario === 'late_payment' ? new Date(this.now.getTime() + 3_600_000) : this.now, refunded: false }
  }
}
