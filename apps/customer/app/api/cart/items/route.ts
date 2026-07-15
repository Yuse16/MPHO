import { mutateCart } from '@/lib/cart'
import { isExactObject, privateJson, readMutationJson, statusForError } from '@/lib/api-security'

const fields = ['expectedVersion', 'listingId', 'variantId', 'optionIds', 'quantity', 'personalization'] as const
export async function POST(request: Request) {
  const body = await readMutationJson(request); if (!body.ok) return body.response
  if (!isExactObject(body.value, fields) || !Number.isInteger(body.value.expectedVersion)) return privateJson({ error: { code: 'INVALID_REQUEST', message: 'The item request is invalid.' } }, { status: 400 })
  const { expectedVersion, ...payload } = body.value
  const result = await mutateCart('add_item', payload, expectedVersion as number)
  return result.ok ? privateJson({ cart: result.value }, { status: 201 }) : privateJson({ error: result.error }, { status: statusForError(result.error.code) })
}
