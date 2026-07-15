import { mutateCart } from '@/lib/cart'
import { isExactObject, privateJson, readMutationJson, statusForError } from '@/lib/api-security'

const patchFields = ['expectedVersion', 'listingId', 'variantId', 'optionIds', 'quantity', 'personalization'] as const
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const body = await readMutationJson(request); if (!body.ok) return body.response
  if (!isExactObject(body.value, patchFields) || !Number.isInteger(body.value.expectedVersion)) return privateJson({ error: { code: 'INVALID_REQUEST', message: 'The item request is invalid.' } }, { status: 400 })
  const { expectedVersion, ...selection } = body.value; const { id } = await context.params
  const result = await mutateCart('update_item', { ...selection, itemId: id }, expectedVersion as number)
  return result.ok ? privateJson({ cart: result.value }) : privateJson({ error: result.error }, { status: statusForError(result.error.code) })
}
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const body = await readMutationJson(request); if (!body.ok) return body.response
  if (!isExactObject(body.value, ['expectedVersion']) || !Number.isInteger(body.value.expectedVersion)) return privateJson({ error: { code: 'INVALID_REQUEST', message: 'expectedVersion is required.' } }, { status: 400 })
  const { id } = await context.params
  const result = await mutateCart('delete_item', { itemId: id }, body.value.expectedVersion as number)
  return result.ok ? privateJson({ cart: result.value }) : privateJson({ error: result.error }, { status: statusForError(result.error.code) })
}
