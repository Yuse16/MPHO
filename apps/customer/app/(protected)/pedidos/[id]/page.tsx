import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDraftOrder } from '@/lib/cart'
import { OrderReviewAction } from '@/components/order-review-action'
import { PaymentAction, PaymentRequery } from '@/components/payment-action'

const money=(amount:number)=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(amount/100)

export default async function OrderPage({params}:{params:Promise<{id:string}>}){
  const{id}=await params;const result=await getDraftOrder(id)
  if(!result.ok){if(result.error.code==='ORDER_NOT_FOUND')notFound();return <main className="flex min-h-screen items-center justify-center p-6"><p role="alert">No fue posible cargar el pedido.</p></main>}
  const order=result.value
  const title=order.state==='draft'?'Pedido borrador':order.state==='quote_pending'?'Revisión en curso':order.state==='quoted'?'Cotización lista':order.state==='pending_payment'?'Confirmando pago':'Pago confirmado'
  return <main className="min-h-screen px-4 py-10"><article className="glass mx-auto max-w-2xl rounded-[2rem] p-7 sm:p-10"><p className="text-xs font-bold uppercase tracking-[.22em] text-lime">{title}</p><h1 className="mt-3 text-3xl font-extrabold">{order.reference}</h1>
    {order.state==='draft'&&<p className="mt-4 text-sm leading-6 text-muted-foreground">Solicita la revisión para que MPHO valide disponibilidad, entrega y precio final.</p>}
    {order.state==='quote_pending'&&<p className="mt-4 text-sm leading-6 text-muted-foreground">MPHO está validando disponibilidad, entrega y precio final.</p>}
    {order.review?.status==='changes_required'&&<div className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4"><p>{order.review.publicExplanation}</p><p className="mt-2 text-sm text-muted-foreground">{order.review.nextAction}</p></div>}
    {order.state==='quoted'&&<><p className="mt-4 text-sm leading-6 text-muted-foreground">Tu cotización está lista para pago.</p>{order.priceExplanation&&<p className="mt-2 text-sm leading-6 text-muted-foreground">{order.priceExplanation}</p>}</>}
    {order.state==='pending_payment'&&<p className="mt-4 text-sm leading-6 text-muted-foreground">Estamos confirmando tu pago. No cierres ni repitas el pago si ya lo completaste.</p>}
    {order.state==='paid'&&<p className="mt-4 text-sm leading-6 text-muted-foreground">MPHO confirmó tu pago. Estamos preparando el siguiente paso de tu pedido.</p>}
    {order.payment?.status==='requires_review'&&<div role="alert" className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4">Necesitamos verificar tu pago. No intentes pagar nuevamente.</div>}
    <dl className="mt-7 space-y-3 text-sm"><div className="flex justify-between"><dt>Estado</dt><dd>{title}</dd></div>{order.previousSubtotal&&<div className="flex justify-between"><dt>Subtotal anterior</dt><dd>{money(order.previousSubtotal.amountMinor)}</dd></div>}<div className="flex justify-between"><dt>Subtotal recalculado</dt><dd>{money(order.subtotal.amountMinor)}</dd></div><div className="flex justify-between"><dt>Entrega</dt><dd>{order.delivery?money(order.delivery.amountMinor):'Pendiente'}</dd></div><div className="flex justify-between"><dt>Servicio</dt><dd>{order.service?money(order.service.amountMinor):'Pendiente'}</dd></div><div className="flex justify-between border-t border-white/10 pt-3 font-bold"><dt>Total final</dt><dd>{order.totalIsFinal?money(order.totalKnown.amountMinor):'Pendiente'}</dd></div>{order.difference&&<div className="flex justify-between"><dt>Diferencia</dt><dd>{money(order.difference.amountMinor)}</dd></div>}{order.quoteExpiresAt&&<div className="flex justify-between"><dt>Vigencia</dt><dd>{new Intl.DateTimeFormat('es-MX',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Monterrey'}).format(new Date(order.quoteExpiresAt))}</dd></div>}</dl>
    {order.state==='draft'&&order.review?.status!=='changes_required'&&<OrderReviewAction orderId={order.id} version={order.version}/>} {order.state==='quoted'&&<PaymentAction orderId={order.id} version={order.version} disabled={!order.canStartPayment}/>} {order.state==='pending_payment'&&order.payment?.checkoutUrl&&<a className="mt-5 block w-full rounded-full bg-[#c8ff35] px-5 py-3 text-center font-bold text-black" href={order.payment.checkoutUrl}>Abrir pago existente</a>} {order.state==='pending_payment'&&order.payment&&<PaymentRequery attemptId={order.payment.id} enabled={order.payment.canRequery}/>}<div className="mt-7 rounded-2xl border border-border-soft p-4 text-xs leading-5 text-muted-foreground">El pago confirmado no implica asignación, reserva, preparación ni solicitud logística.</div><Link href="/" className="mt-7 inline-flex rounded-full bg-white/10 px-5 py-3 font-bold">Volver al inicio</Link></article></main>
}
