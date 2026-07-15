import { NextResponse } from 'next/server'
import { parseQuoteSelection, previewQuote } from '@/lib/quotes'

export async function POST(request: Request) {
  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: { code: 'INVALID_REQUEST', message: 'Invalid JSON body.' } }, { status: 400 }) }
  const parsed = parseQuoteSelection(body)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })
  const result = await previewQuote(parsed.value)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.error.code === 'DATABASE_ERROR' ? 503 : 422 })
  return NextResponse.json({ quote: result.value })
}
