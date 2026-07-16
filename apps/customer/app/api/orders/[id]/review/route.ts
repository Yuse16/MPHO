import { privateJson, readMutationJson, isExactObject, statusForError } from '@/lib/api-security'
import { submitOrderReview } from '@/lib/cart'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = await readMutationJson(request)
  if (!body.ok) return body.response
  if (!isExactObject(body.value, ['expectedVersion']) || !Number.isInteger(body.value.expectedVersion)) {
    return privateJson({ error: { code: 'INVALID_REQUEST', message: 'expectedVersion is required.' } }, { status: 400 })
  }
  const key = request.headers.get('idempotency-key')
  if (!key) return privateJson({ error: { code: 'INVALID_REQUEST', message: 'Idempotency-Key is required.' } }, { status: 400 })
  const { id } = await params
  const result = await submitOrderReview(id, body.value.expectedVersion as number, key, crypto.randomUUID())
  return result.ok ? privateJson({ order: result.value }) : privateJson({ error: result.error }, { status: statusForError(result.error.code) })
}
