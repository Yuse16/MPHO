import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@mpho/database/types'

function config() {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if(!url||!anonKey) throw new Error('Public Supabase configuration is missing.')
  return {url,anonKey}
}

export async function createCentralSupabaseClient(){const cookieStore=await cookies();const{url,anonKey}=config();return createServerClient<Database>(url,anonKey,{cookies:{getAll:()=>cookieStore.getAll(),setAll(values){try{values.forEach(({name,value,options})=>cookieStore.set(name,value,options))}catch{}}}})}
