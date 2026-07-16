import { NextResponse } from 'next/server'

const fields = ['action', 'expectedVersion', 'dimension', 'status', 'expiresAt', 'sourceReference', 'reasonCode', 'internalReason', 'amountMinor', 'sourceType', 'reason', 'pricingVersion', 'componentId']

export function privateJson(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init)
  response.headers.set('Cache-Control', 'private, no-store, max-age=0')
  response.headers.set('Pragma', 'no-cache')
  return response
}

export async function readBody(request: Request) {
  const type = request.headers.get('content-type') ?? ''
  if (!type.startsWith('application/json')) return { ok: false as const, response: privateJson({ error: { code: 'UNSUPPORTED_MEDIA_TYPE', message: 'JSON required.' } }, { status: 415 }) }
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  try {
    if (!origin || !host || new URL(origin).host !== host) throw new Error('origin mismatch')
  } catch {
    return { ok: false as const, response: privateJson({ error: { code: 'INVALID_ORIGIN', message: 'Same-origin request required.' } }, { status: 403 }) }
  }
  try {
    const raw = await request.text()
    if (new TextEncoder().encode(raw).byteLength > 16_384) return { ok: false as const, response: privateJson({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request too large.' } }, { status: 413 }) }
    const value = JSON.parse(raw) as Record<string, unknown>
    if (!value || Array.isArray(value) || Object.keys(value).some((key) => !fields.includes(key))) throw new Error('invalid fields')
    return { ok: true as const, value }
  } catch {
    return { ok: false as const, response: privateJson({ error: { code: 'INVALID_REQUEST', message: 'Invalid request.' } }, { status: 400 }) }
  }
}
