import { NextResponse } from 'next/server'
import { createQuote, parseQuoteSelection } from '@/lib/quotes'

export async function POST(request: Request) {
  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: { code: 'INVALID_REQUEST', message: 'Invalid JSON body.' } }, { status: 400 }) }
  const object = body && typeof body === 'object' && !Array.isArray(body) ? body as Record<string, unknown> : {}
  const parsed = parseQuoteSelection(object)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })
  const key = request.headers.get('idempotency-key')
  if (!key) return NextResponse.json({ error: { code: 'INVALID_REQUEST', message: 'Idempotency-Key is required.' } }, { status: 400 })
  const result = await createQuote(parsed.value, key)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.error.code === 'UNAUTHORIZED' ? 401 : 422 })
  return NextResponse.json({ quote: result.value }, { status: 201 })
}
