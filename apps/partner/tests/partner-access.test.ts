// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { refreshSession } from '@/lib/supabase/proxy'

const createServerClient = vi.hoisted(() => vi.fn())

vi.mock('@supabase/ssr', () => ({ createServerClient }))

interface QueryResult {
  data: Record<string, unknown> | null
  error: Error | null
}

function query(result: QueryResult) {
  const builder = {
    select: vi.fn(),
    eq: vi.fn(),
    is: vi.fn(),
    in: vi.fn(),
    not: vi.fn(),
    limit: vi.fn(),
    maybeSingle: vi.fn().mockResolvedValue(result),
  }
  builder.select.mockReturnValue(builder)
  builder.eq.mockReturnValue(builder)
  builder.is.mockReturnValue(builder)
  builder.in.mockReturnValue(builder)
  builder.not.mockReturnValue(builder)
  builder.limit.mockReturnValue(builder)
  return builder
}

function installClient({
  profile,
  role,
  partner,
}: {
  profile: QueryResult
  role: QueryResult
  partner: QueryResult
}) {
  const queries = {
    profiles: query(profile),
    user_roles: query(role),
    partners: query(partner),
  }
  createServerClient.mockReturnValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'auth-user-id' } },
        error: null,
      }),
    },
    from: vi.fn((table: keyof typeof queries) => queries[table]),
  })
  return queries
}

describe('Partner authorization lookup', () => {
  beforeEach(() => {
    createServerClient.mockReset()
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://project.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'public-anon-key')
  })

  it('authorizes only an active Partner role assigned to an accessible Punto', async () => {
    const queries = installClient({
      profile: { data: { id: 'profile-id', status: 'active' }, error: null },
      role: {
        data: {
          role: 'partner_admin',
          partner_id: 'partner-id',
          status: 'active',
          revoked_at: null,
        },
        error: null,
      },
      partner: { data: { id: 'partner-id', status: 'paused' }, error: null },
    })

    const result = await refreshSession(
      new NextRequest('https://aliados.example/inicio'),
    )

    expect(result.partnerAccess).toEqual({
      status: 'authorized',
      partnerId: 'partner-id',
      role: 'partner_admin',
      partnerStatus: 'paused',
    })
    expect(queries.user_roles.in).toHaveBeenCalledWith('role', [
      'partner_operator',
      'partner_admin',
    ])
    expect(queries.user_roles.is).toHaveBeenCalledWith('revoked_at', null)
  })

  it('denies an account without a Partner role assignment', async () => {
    installClient({
      profile: { data: { id: 'profile-id', status: 'active' }, error: null },
      role: { data: null, error: null },
      partner: { data: { id: 'partner-id', status: 'active' }, error: null },
    })

    const result = await refreshSession(
      new NextRequest('https://aliados.example/inicio'),
    )

    expect(result.partnerAccess).toEqual({ status: 'unauthorized' })
  })

  it('fails closed when authorization data cannot be verified', async () => {
    installClient({
      profile: { data: null, error: new Error('database unavailable') },
      role: { data: null, error: null },
      partner: { data: null, error: null },
    })

    const result = await refreshSession(
      new NextRequest('https://aliados.example/inicio'),
    )

    expect(result.partnerAccess).toEqual({ status: 'unavailable' })
  })
})
