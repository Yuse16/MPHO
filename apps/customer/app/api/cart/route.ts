import { getCart } from '@/lib/cart'
import { privateJson, statusForError } from '@/lib/api-security'

export async function GET() {
  const result = await getCart()
  return result.ok ? privateJson({ cart: result.value }) : privateJson({ error: result.error }, { status: statusForError(result.error.code) })
}
