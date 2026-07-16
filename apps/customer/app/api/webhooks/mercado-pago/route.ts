import { MercadoPagoPaymentProvider, readPaymentConfig } from '@mpho/payments'
import { createPaymentAdminClient } from '@/lib/supabase/payment-admin'
import { paymentEvent, paymentVerification, rpcData } from '@/lib/payments'

const MAX_BYTES=32*1024
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','Content-Type':'application/json'}})

export async function POST(request:Request){
  if(!(request.headers.get('content-type')??'').toLowerCase().startsWith('application/json')) return response({error:'unsupported_media_type'},415)
  const length=Number(request.headers.get('content-length')??0); if(length>MAX_BYTES) return response({error:'payload_too_large'},413)
  const raw=await request.text(); if(new TextEncoder().encode(raw).byteLength>MAX_BYTES) return response({error:'payload_too_large'},413)
  let body:unknown; try{body=JSON.parse(raw)}catch{return response({error:'invalid_json'},400)}
  if(typeof body!=='object'||body===null) return response({error:'invalid_payload'},400)
  const value=body as Record<string,unknown>; const data=typeof value.data==='object'&&value.data?value.data as Record<string,unknown>:null
  const dataId=String(new URL(request.url).searchParams.get('data.id')??data?.id??''); const xSignature=request.headers.get('x-signature')??''; const xRequestId=request.headers.get('x-request-id')??''
  if(!dataId||!xSignature||!xRequestId) return response({error:'missing_signature_material'},400)
  let config; try{config=readPaymentConfig()}catch{return response({error:'temporarily_unavailable'},503)}
  const provider=new MercadoPagoPaymentProvider(config); const admin=createPaymentAdminClient(); const payloadHash=await hash(raw)
  const valid=provider.verifyWebhookSignature({xSignature,xRequestId,dataId})
  paymentEvent(valid?'webhook_received':'webhook_signature_invalid')
  const providerEventId=String(value.id??`${valid?'event':'invalid'}:${xRequestId}:${dataId}`)
  const registered=await admin.rpc('register_payment_provider_event',{p_environment:config.environment,p_event_id:providerEventId.slice(0,200),p_event_type:String(value.type??'unknown'),p_action:String(value.action??'unknown'),p_resource_id:dataId,p_signature_valid:valid,p_live_mode:typeof value.live_mode==='boolean'?value.live_mode:null,p_request_id:xRequestId,p_payload_hash:payloadHash,p_sanitized:{type:String(value.type??'unknown'),action:String(value.action??'unknown'),apiVersion:String(value.api_version??'unknown'),dateCreated:String(value.date_created??'unknown')}})
  const inbox=rpcData(registered.data,registered.error)
  if(!valid) return response({error:'invalid_signature'},401)
  if(!inbox.ok) return response({error:'temporarily_unavailable'},503)
  if(inbox.duplicate) return response({ok:true,duplicate:true})
  const payment=await provider.getPayment(dataId).catch(()=>null)
  if(!payment){paymentEvent('provider_fetch_failed');return response({error:'provider_unavailable'},503)}
  const processedCall=await admin.rpc('process_provider_payment',{p_event_id:inbox.eventId,p_payment:paymentVerification(payment,provider),p_expected_environment:config.environment,p_expected_application_id:config.applicationId})
  const processed=rpcData(processedCall.data,processedCall.error)
  if(!processed.ok&&processed.retry) return response({error:'retry'},503)
  return response({ok:true})
}
async function hash(value:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('')}
