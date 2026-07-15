import { NextResponse } from 'next/server'

const MAX_JSON_BYTES = 16_384

export type ApiError = { code: string; message: string; currentVersion?: number }

export function privateJson(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init)
  response.headers.set('Cache-Control', 'private, no-store, max-age=0')
  response.headers.set('Pragma', 'no-cache')
  return response
}

export async function readMutationJson(request: Request): Promise<{ ok: true; value: unknown } | { ok: false; response: NextResponse }> {
  const contentType = request.headers.get('content-type')?.toLowerCase() ?? ''
  if (!contentType.startsWith('application/json')) {
    return { ok: false, response: privateJson({ error: { code: 'UNSUPPORTED_MEDIA_TYPE', message: 'Content-Type application/json is required.' } }, { status: 415 }) }
  }
  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (Number.isFinite(declaredLength) && declaredLength > MAX_JSON_BYTES) {
    return { ok: false, response: privateJson({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'The request body is too large.' } }, { status: 413 }) }
  }
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (!origin || !host) {
    return { ok: false, response: privateJson({ error: { code: 'INVALID_ORIGIN', message: 'A same-origin request is required.' } }, { status: 403 }) }
  }
  try {
    if (new URL(origin).host !== host) throw new Error('origin mismatch')
  } catch {
    return { ok: false, response: privateJson({ error: { code: 'INVALID_ORIGIN', message: 'A same-origin request is required.' } }, { status: 403 }) }
  }
  try {
    const raw = await request.text()
    if (new TextEncoder().encode(raw).byteLength > MAX_JSON_BYTES) {
      return { ok: false, response: privateJson({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'The request body is too large.' } }, { status: 413 }) }
    }
    return { ok: true, value: JSON.parse(raw) as unknown }
  } catch {
    return { ok: false, response: privateJson({ error: { code: 'INVALID_REQUEST', message: 'Invalid JSON body.' } }, { status: 400 }) }
  }
}

export function isExactObject(value: unknown, fields: readonly string[]): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value) && Object.keys(value as object).every((key) => fields.includes(key))
}

export function statusForError(code: string) {
  if (code === 'UNAUTHORIZED') return 401
  if (code === 'VERSION_CONFLICT' || code === 'IDEMPOTENCY_CONFLICT' || code === 'CART_NOT_ACTIVE') return 409
  if (code.endsWith('_NOT_FOUND') || code === 'CART_NOT_FOUND') return 404
  return 422
}
