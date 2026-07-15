import { getDraftOrder } from '@/lib/cart'
import { privateJson, statusForError } from '@/lib/api-security'
export async function GET(_request:Request,context:{params:Promise<{id:string}>}){const{id}=await context.params;const result=await getDraftOrder(id);return result.ok?privateJson({order:result.value}):privateJson({error:result.error},{status:statusForError(result.error.code)})}
