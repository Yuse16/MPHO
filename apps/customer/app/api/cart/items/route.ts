import { mutateCart } from '@/lib/cart'
import { privateJson, readMutationJson, statusForError } from '@/lib/api-security'
import { parseCartItemRequest } from '@/lib/cart-item-selection'

export async function POST(request: Request) {
  const body = await readMutationJson(request)
  if (!body.ok) return body.response
  const parsed = parseCartItemRequest(body.value)
  if (!parsed) {
    return privateJson(
      { error: { code: 'INVALID_REQUEST', message: 'The item request is invalid.' } },
      { status: 400 },
    )
  }
  const result = await mutateCart('add_item', parsed.selection, parsed.expectedVersion)
  return result.ok ? privateJson({ cart: result.value }, { status: 201 }) : privateJson({ error: result.error }, { status: statusForError(result.error.code) })
}
