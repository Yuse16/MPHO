import { createServerSupabaseClient } from '@/lib/supabase/server'
import { CartDraftFlow } from '@/components/cart-draft-flow'

export default async function CartPage(){
  const supabase=await createServerSupabaseClient()
  const [{data:cities},{data:zones}]=await Promise.all([
    supabase.from('cities').select('id,name,state').eq('status','active').order('name'),
    supabase.from('zones').select('id,city_id,name').eq('status','active').order('name'),
  ])
  return <CartDraftFlow cities={cities??[]} zones={(zones??[]).map(zone=>({id:zone.id,cityId:zone.city_id,name:zone.name}))}/>
}
