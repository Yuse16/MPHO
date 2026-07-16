import { isExactObject, privateJson, readMutationJson } from '@/lib/api-security'
import { authoritativePayment, paymentContext, paymentVerification, rpcData } from '@/lib/payments'

export async function POST(request:Request) {
  const body=await readMutationJson(request); if(!body.ok) return body.response
  if(!isExactObject(body.value,['attemptId']) || typeof body.value.attemptId!=='string') return privateJson({error:{code:'INVALID_REQUEST'}},{status:400})
  let context; try{context=await paymentContext()}catch{return privateJson({error:{code:'PAYMENT_CONFIGURATION_ERROR'}},{status:503})}
  if(!context) return privateJson({error:{code:'UNAUTHORIZED'}},{status:401})
  const targetCall=await context.admin.rpc('payment_requery_target',{p_auth_user_id:context.user.id,p_attempt_id:body.value.attemptId,p_force:false})
  const target=rpcData(targetCall.data,targetCall.error)
  if(!target.ok) return privateJson({error:target.error},{status:target.error?.code==='COOLDOWN'?429:403})
  const payment=await authoritativePayment(context.provider,{providerPaymentId:target.providerPaymentId as string|null,externalReference:String(target.externalReference)}).catch(()=>null)
  if(!payment) return privateJson({status:'confirming'},{status:202})
  const eventId=`requery:${target.attemptId}:${crypto.randomUUID()}`
  const registered=await context.admin.rpc('register_payment_provider_event',{p_environment:context.config.environment,p_event_id:eventId,p_event_type:'internal_requery',p_action:'payment.requery',p_resource_id:payment.id,p_signature_valid:true,p_live_mode:payment.liveMode,p_request_id:crypto.randomUUID(),p_payload_hash:await hash(eventId),p_sanitized:{source:'customer_requery'}})
  const inbox=rpcData(registered.data,registered.error)
  await context.admin.rpc('process_provider_payment',{p_event_id:inbox.eventId,p_payment:paymentVerification(payment,context.provider),p_expected_environment:context.config.environment,p_expected_application_id:context.config.applicationId})
  return privateJson({status:'checked'})
}
async function hash(value:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('')}
