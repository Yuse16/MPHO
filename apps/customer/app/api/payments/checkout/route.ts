import { privateJson, readMutationJson, isExactObject, statusForError } from '@/lib/api-security'
import { paymentContext, paymentEvent, rpcData } from '@/lib/payments'

const safeCheckoutHosts = new Set(['www.mercadopago.com.mx','mercadopago.com.mx','sandbox.mercadopago.com.mx','www.mercadopago.com','mercadopago.com','sandbox.mercadopago.com'])

export async function POST(request: Request) {
  const body = await readMutationJson(request)
  if (!body.ok) return body.response
  if (!isExactObject(body.value,['orderId','expectedVersion']) || typeof body.value.orderId!=='string' || !Number.isInteger(body.value.expectedVersion)) return privateJson({ error:{ code:'INVALID_REQUEST',message:'orderId and expectedVersion are required.' } },{ status:400 })
  const key=request.headers.get('idempotency-key')
  if (!key || key.length<8 || key.length>200) return privateJson({ error:{ code:'INVALID_REQUEST',message:'A valid Idempotency-Key is required.' } },{ status:400 })
  let context
  try { context=await paymentContext() } catch { return privateJson({ error:{ code:'PAYMENT_CONFIGURATION_ERROR',message:'Payment is temporarily unavailable.' } },{ status:503 }) }
  if (!context) return privateJson({ error:{ code:'UNAUTHORIZED',message:'Authentication is required.' } },{ status:401 })
  const requestId=crypto.randomUUID()
  const started=Date.now()
  paymentEvent('payment_session_requested')
  const beginCall=await context.admin.rpc('begin_payment_checkout',{ p_auth_user_id:context.user.id,p_order_id:body.value.orderId,p_expected_version:body.value.expectedVersion,p_idempotency_key:key,p_request_id:requestId,p_environment:context.config.environment,p_minimum_seconds:context.config.minimumRemainingSeconds })
  const begin=rpcData(beginCall.data,beginCall.error)
  if (!begin.ok) return privateJson({ error:begin.error },{ status:statusForError(begin.error?.code ?? 'PAYMENT_BACKEND_ERROR') })
  if (begin.state==='checkout_ready' || begin.state==='pending') {
    const session=await context.admin.rpc('complete_payment_checkout',{p_attempt_id:begin.attemptId,p_preference_id:'replay',p_checkout_url:'https://mercadopago.com/',p_provider_expires_at:begin.expiresAt,p_request_id:requestId})
    const replay=rpcData(session.data,session.error)
    return privateJson(replay.ok?{order:replay.order}:{error:replay.error},{status:replay.ok?200:409})
  }
  try {
    const expiresAt=new Date(String(begin.expiresAt))
    let session
    try {
      session=await context.provider.createCheckoutSession({ amountMinor:Number(begin.amountMinor),currency:'MXN',externalReference:String(begin.externalReference),expiresAt,backUrl:new URL(`/pago/resultado?order=${encodeURIComponent(String(begin.orderId))}`,context.config.customerBaseUrl).toString(),notificationUrl:context.config.notificationUrl })
    } catch (error) {
      const recovered=await context.provider.searchPaymentByExternalReference(String(begin.externalReference)).catch(()=>null)
      if (recovered) {
        await context.admin.rpc('fail_payment_checkout',{p_attempt_id:begin.attemptId,p_error_code:'preference_creation_uncertain',p_requires_review:true})
        paymentEvent('payment_requires_review')
        return privateJson({error:{code:'PAYMENT_REQUIRES_REVIEW',message:'We need to verify this payment attempt.'}},{status:409})
      }
      await context.admin.rpc('fail_payment_checkout',{p_attempt_id:begin.attemptId,p_error_code:'preference_creation_failed',p_requires_review:false})
      paymentEvent('preference_creation_failed')
      throw error
    }
    const checkout=new URL(session.checkoutUrl)
    if (checkout.protocol!=='https:' || !safeCheckoutHosts.has(checkout.hostname)) throw new Error('Unsafe provider checkout URL.')
    if (session.expiresAt>expiresAt) throw new Error('Provider expiry exceeds the quote expiry.')
    const completeCall=await context.admin.rpc('complete_payment_checkout',{p_attempt_id:begin.attemptId,p_preference_id:session.preferenceId,p_checkout_url:session.checkoutUrl,p_provider_expires_at:session.expiresAt.toISOString(),p_request_id:requestId})
    const complete=rpcData(completeCall.data,completeCall.error)
    if (!complete.ok) {
      const expired=await context.provider.expireCheckoutSession(session.preferenceId)
      if (!expired) await context.admin.rpc('fail_payment_checkout',{p_attempt_id:begin.attemptId,p_error_code:'preference_expiration_unconfirmed',p_requires_review:true})
      return privateJson({error:complete.error},{status:409})
    }
    paymentEvent('payment_session_created',{latencyMs:Date.now()-started})
    return privateJson({order:complete.order},{status:201})
  } catch {
    return privateJson({error:{code:'PAYMENT_PROVIDER_UNAVAILABLE',message:'Payment is temporarily unavailable. Try again safely with the same request.'}},{status:503})
  }
}
