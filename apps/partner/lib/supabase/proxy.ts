import { createServerClient } from '@supabase/ssr'
import type { Database } from '@mpho/database/types'
import { type NextRequest, NextResponse } from 'next/server'
import { getPublicSupabaseConfig } from './config'

export type PartnerAccess =
  | {
      status: 'authorized'
      partnerId: string
      role: 'partner_operator' | 'partner_admin'
      partnerStatus: 'active' | 'paused'
    }
  | { status: 'unauthorized' | 'unavailable' }

export async function refreshSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })
  const { url, anonKey } = getPublicSupabaseConfig()

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        )
        response = NextResponse.next({ request: { headers: request.headers } })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const { data, error } = await supabase.auth.getUser()
  const user = error ? null : data.user
  if (!user) return { response, user: null, partnerAccess: null }

  const partnerAccess = await getPartnerAccess(supabase, user.id)
  return { response, user, partnerAccess }
}

async function getPartnerAccess(
  supabase: ReturnType<typeof createServerClient<Database>>,
  authUserId: string,
): Promise<PartnerAccess> {
  const profileResult = await supabase
    .from('profiles')
    .select('id, status')
    .eq('auth_user_id', authUserId)
    .maybeSingle()

  if (profileResult.error) return { status: 'unavailable' }
  if (!profileResult.data || profileResult.data.status !== 'active') {
    return { status: 'unauthorized' }
  }

  const roleResult = await supabase
    .from('user_roles')
    .select('role, partner_id, status, revoked_at')
    .eq('profile_id', profileResult.data.id)
    .eq('status', 'active')
    .is('revoked_at', null)
    .in('role', ['partner_operator', 'partner_admin'])
    .not('partner_id', 'is', null)
    .limit(1)
    .maybeSingle()

  if (roleResult.error) return { status: 'unavailable' }
  if (!roleResult.data?.partner_id || !isPartnerRole(roleResult.data.role)) {
    return { status: 'unauthorized' }
  }

  const partnerResult = await supabase
    .from('partners')
    .select('id, status')
    .eq('id', roleResult.data.partner_id)
    .maybeSingle()

  if (partnerResult.error) return { status: 'unavailable' }
  if (!partnerResult.data || !isAccessiblePartnerStatus(partnerResult.data.status)) {
    return { status: 'unauthorized' }
  }

  return {
    status: 'authorized',
    partnerId: partnerResult.data.id,
    role: roleResult.data.role,
    partnerStatus: partnerResult.data.status,
  }
}

function isPartnerRole(role: string): role is 'partner_operator' | 'partner_admin' {
  return role === 'partner_operator' || role === 'partner_admin'
}

function isAccessiblePartnerStatus(status: string): status is 'active' | 'paused' {
  return status === 'active' || status === 'paused'
}
