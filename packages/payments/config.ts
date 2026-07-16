import type { PaymentEnvironment } from './types'

export interface PaymentConfig {
  accessToken: string
  webhookSecret: string
  environment: PaymentEnvironment
  applicationId: string
  notificationUrl: string
  customerBaseUrl: string
  minimumRemainingSeconds: number
  timeoutMs: number
}

function required(env: NodeJS.ProcessEnv, key: string): string {
  const value = env[key]?.trim()
  if (!value) throw new Error(`Payment configuration is incomplete (${key}).`)
  return value
}

function positiveInteger(value: string, key: string): number {
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new Error(`Payment configuration is invalid (${key}).`)
  return parsed
}

export function readPaymentConfig(env: NodeJS.ProcessEnv = process.env): PaymentConfig {
  const environment = required(env, 'MERCADO_PAGO_ENVIRONMENT')
  if (environment !== 'test' && environment !== 'production') throw new Error('Payment configuration has an invalid environment.')
  const notificationUrl = new URL(required(env, 'MERCADO_PAGO_NOTIFICATION_URL'))
  const customerBaseUrl = new URL(required(env, 'CUSTOMER_APP_BASE_URL'))
  if (notificationUrl.protocol !== 'https:' || customerBaseUrl.protocol !== 'https:') throw new Error('Payment URLs must use HTTPS.')
  const minimumRemainingSeconds = positiveInteger(required(env, 'PAYMENT_CHECKOUT_MIN_REMAINING_SECONDS'), 'PAYMENT_CHECKOUT_MIN_REMAINING_SECONDS')
  if (minimumRemainingSeconds < 600) throw new Error('Payment checkout safety margin must be at least 600 seconds.')
  return {
    accessToken: required(env, 'MERCADO_PAGO_ACCESS_TOKEN'),
    webhookSecret: required(env, 'MERCADO_PAGO_WEBHOOK_SECRET'),
    environment,
    applicationId: required(env, 'MERCADO_PAGO_APPLICATION_ID'),
    notificationUrl: notificationUrl.toString(),
    customerBaseUrl: customerBaseUrl.toString(),
    minimumRemainingSeconds,
    timeoutMs: positiveInteger(required(env, 'PAYMENT_PROVIDER_TIMEOUT_MS'), 'PAYMENT_PROVIDER_TIMEOUT_MS'),
  }
}
