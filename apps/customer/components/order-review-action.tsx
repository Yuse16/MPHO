'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function OrderReviewAction({ orderId, version }: { orderId: string; version: number }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function submit() {
    setBusy(true); setError(null)
    try {
      const response = await fetch(`/api/orders/${orderId}/review`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() }, body: JSON.stringify({ expectedVersion: version }) })
      const payload = await response.json() as { error?: { message?: string } }
      if (!response.ok) throw new Error(payload.error?.message ?? 'No fue posible solicitar la revisión.')
      router.refresh()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No fue posible solicitar la revisión.') }
    finally { setBusy(false) }
  }
  return <div className="mt-7"><button disabled={busy} onClick={()=>void submit()} className="w-full rounded-full bg-lime px-5 py-3 font-bold text-primary-foreground disabled:opacity-50">{busy?'Enviando…':'Solicitar revisión'}</button>{error&&<p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}</div>
}
