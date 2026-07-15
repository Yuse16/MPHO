import { mutateCart } from '@/lib/cart'
import { isExactObject, privateJson, readMutationJson, statusForError } from '@/lib/api-security'
const fields = ['expectedVersion','sourceRecipientId','name','relationship','phone','surpriseMode','deliveryNote'] as const
export async function PUT(request: Request) {
  const body=await readMutationJson(request); if(!body.ok)return body.response
  if(!isExactObject(body.value,fields)||!Number.isInteger(body.value.expectedVersion))return privateJson({error:{code:'INVALID_REQUEST',message:'Recipient data is invalid.'}},{status:400})
  const {expectedVersion,...payload}=body.value; const result=await mutateCart('put_recipient',payload,expectedVersion as number)
  return result.ok?privateJson({cart:result.value}):privateJson({error:result.error},{status:statusForError(result.error.code)})
}
