import { NextResponse } from 'next/server'
import { getQuote } from '@/lib/quotes'

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const result = await getQuote(id)
  if (!result.ok) return NextResponse.json({ error: { code: result.error.code === 'UNAUTHORIZED' ? 'UNAUTHORIZED' : 'NOT_FOUND', message: result.error.code === 'UNAUTHORIZED' ? result.error.message : 'The quote was not found.' } }, { status: result.error.code === 'UNAUTHORIZED' ? 401 : 404 })
  return NextResponse.json({ quote: result.value })
}
