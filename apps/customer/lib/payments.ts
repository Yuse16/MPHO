import 'server-only'
import { MercadoPagoPaymentProvider, readPaymentConfig, type PaymentProvider, type ProviderPayment } from '@mpho/payments'
import { createServerSupabaseClient } from './supabase/server'
import { createPaymentAdminClient } from './supabase/payment-admin'

type RpcResult = { ok: boolean; [key: string]: unknown; error?: { code: string; message?: string; currentVersion?: number } }

export async function paymentContext() {
  const sessionClient = await createServerSupabaseClient()
  const { data: { user } } = await sessionClient.auth.getUser()
  if (!user) return null
  const config = readPaymentConfig()
  return { user, config, admin: createPaymentAdminClient(), provider: new MercadoPagoPaymentProvider(config) as PaymentProvider }
}

export function rpcData(data: unknown, error: { message: string } | null): RpcResult {
  if (error) return { ok: false, error: { code: 'PAYMENT_BACKEND_ERROR', message: 'Payment processing is temporarily unavailable.' } }
  return data as RpcResult
}

export async function authoritativePayment(provider: PaymentProvider, target: { providerPaymentId?: string | null; externalReference: string }) {
  return target.providerPaymentId ? provider.getPayment(target.providerPaymentId) : provider.searchPaymentByExternalReference(target.externalReference)
}

export function paymentVerification(payment: ProviderPayment, provider: PaymentProvider) {
  return {
    id: payment.id, status: payment.status, statusDetail: payment.statusDetail,
    normalizedStatus: provider.mapProviderStatus(payment.status), externalReference: payment.externalReference,
    preferenceId: payment.preferenceId, amountMinor: payment.amountMinor, currency: payment.currency,
    liveMode: payment.liveMode, applicationId: payment.applicationId,
    createdAt: payment.createdAt?.toISOString() ?? null, approvedAt: payment.approvedAt?.toISOString() ?? null,
    refunded: payment.refunded,
  }
}

export function paymentEvent(name: string, fields: Record<string, string | number | boolean | null> = {}) {
  console.info(JSON.stringify({ event: name, at: new Date().toISOString(), ...fields }))
}
