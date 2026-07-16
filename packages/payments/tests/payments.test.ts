import { describe, expect, it } from 'vitest'
import { createHmac } from 'node:crypto'
import { FakePaymentProvider, MercadoPagoPaymentProvider, readPaymentConfig } from '../index'

describe('payments package', () => {
  it('builds a deterministic, PII-free checkout request', async () => {
    const provider = new FakePaymentProvider()
    const request = { amountMinor: 12345, currency: 'MXN' as const, externalReference: 'opaque', expiresAt: new Date('2026-07-16T19:00:00Z'), backUrl: 'https://app.mpho.mx/pago/resultado?order=internal', notificationUrl: 'https://api.mpho.mx/api/webhooks/mercado-pago' }
    const result = await provider.createCheckoutSession(request)
    expect(result.checkoutUrl).toMatch(/^https:\/\/sandbox\.mercadopago\.com\.mx\//)
    expect(provider.requests).toEqual([request])
    expect(JSON.stringify(provider.requests)).not.toMatch(/recipient|partner|address|phone/i)
  })
  it('fails closed with missing or unsafe configuration', () => {
    expect(() => readPaymentConfig({})).toThrow(/incomplete/)
    expect(() => readPaymentConfig({ MERCADO_PAGO_ACCESS_TOKEN:'x', MERCADO_PAGO_WEBHOOK_SECRET:'x', MERCADO_PAGO_ENVIRONMENT:'production', MERCADO_PAGO_APPLICATION_ID:'x', MERCADO_PAGO_NOTIFICATION_URL:'http://bad', CUSTOMER_APP_BASE_URL:'https://app.mpho.mx', PAYMENT_CHECKOUT_MIN_REMAINING_SECONDS:'600', PAYMENT_PROVIDER_TIMEOUT_MS:'5000' })).toThrow(/HTTPS/)
  })
  it.each(['approved','pending','rejected','cancelled'] as const)('maps %s', (status) => {
    expect(new FakePaymentProvider().mapProviderStatus(status)).toBe(status)
  })
  it('uses the official SDK validator for valid, altered and invalid signature fixtures', () => {
    const secret='fixture-secret';const dataId='12345';const xRequestId='fixture-request';const ts='1721145600000'
    const hash=createHmac('sha256',secret).update(`id:${dataId};request-id:${xRequestId};ts:${ts};`).digest('hex')
    const provider=new MercadoPagoPaymentProvider({accessToken:'fixture-token',webhookSecret:secret,environment:'test',applicationId:'fixture-app',notificationUrl:'https://example.invalid/webhook',customerBaseUrl:'https://example.invalid',minimumRemainingSeconds:600,timeoutMs:1000})
    expect(provider.verifyWebhookSignature({dataId,xRequestId,xSignature:`ts=${ts},v1=${hash}`})).toBe(true)
    expect(provider.verifyWebhookSignature({dataId:'altered',xRequestId,xSignature:`ts=${ts},v1=${hash}`})).toBe(false)
    expect(provider.verifyWebhookSignature({dataId,xRequestId,xSignature:`ts=${ts},v1=${'0'.repeat(64)}`})).toBe(false)
  })
})
