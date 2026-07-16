export type PaymentEnvironment = 'test' | 'production'
export type NormalizedPaymentStatus = 'approved' | 'pending' | 'rejected' | 'cancelled' | 'expired' | 'error'

export interface CheckoutRequest {
  amountMinor: number
  currency: 'MXN'
  externalReference: string
  expiresAt: Date
  backUrl: string
  notificationUrl: string
}

export interface CheckoutSession {
  preferenceId: string
  checkoutUrl: string
  expiresAt: Date
}

export interface ProviderPayment {
  id: string
  status: string
  statusDetail: string | null
  externalReference: string | null
  preferenceId: string | null
  amountMinor: number | null
  currency: string | null
  liveMode: boolean
  applicationId: string | null
  createdAt: Date | null
  approvedAt: Date | null
  refunded: boolean
}

export interface WebhookSignatureInput {
  xSignature: string
  xRequestId: string
  dataId: string
}

export interface PaymentProvider {
  createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession>
  getPayment(paymentId: string): Promise<ProviderPayment | null>
  searchPaymentByExternalReference(externalReference: string): Promise<ProviderPayment | null>
  expireCheckoutSession(preferenceId: string): Promise<boolean>
  verifyWebhookSignature(input: WebhookSignatureInput): boolean
  mapProviderStatus(status: string): NormalizedPaymentStatus
}
