import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { proxy } from '@/proxy'

const refreshSession = vi.hoisted(() => vi.fn())

vi.mock('@/lib/supabase/proxy', () => ({ refreshSession }))

const authorized = {
  status: 'authorized',
  partnerId: 'partner-id',
  role: 'partner_operator',
  partnerStatus: 'active',
}

function request(path: string) {
  return new NextRequest(`https://aliados.example${path}`)
}

describe('partner route proxy', () => {
  beforeEach(() => {
    refreshSession.mockReset()
  })

  it('preserves the protected path and query for unauthenticated users', async () => {
    refreshSession.mockResolvedValue({
      response: NextResponse.next(),
      user: null,
      partnerAccess: null,
    })

    const response = await proxy(request('/pedidos?estado=pendiente'))

    expect(response.headers.get('location')).toBe(
      'https://aliados.example/login?redirect=%2Fpedidos%3Festado%3Dpendiente',
    )
  })

  it('denies a signed-in account without Partner authorization', async () => {
    refreshSession.mockResolvedValue({
      response: NextResponse.next(),
      user: { id: 'customer-id' },
      partnerAccess: { status: 'unauthorized' },
    })

    const response = await proxy(request('/inicio'))

    expect(response.headers.get('location')).toBe('https://aliados.example/acceso')
  })

  it('allows a protected route for an authorized Partner account', async () => {
    const nextResponse = NextResponse.next()
    refreshSession.mockResolvedValue({
      response: nextResponse,
      user: { id: 'partner-user' },
      partnerAccess: authorized,
    })

    expect(await proxy(request('/pedidos/order-id'))).toBe(nextResponse)
  })

  it('redirects an authorized login to a safe destination', async () => {
    refreshSession.mockResolvedValue({
      response: NextResponse.next(),
      user: { id: 'partner-user' },
      partnerAccess: authorized,
    })

    const response = await proxy(request('/login?redirect=%2Fpedidos'))

    expect(response.headers.get('location')).toBe('https://aliados.example/pedidos')
  })

  it('prevents an authenticated redirect loop through login', async () => {
    refreshSession.mockResolvedValue({
      response: NextResponse.next(),
      user: { id: 'partner-user' },
      partnerAccess: authorized,
    })

    const response = await proxy(request('/login?redirect=%2Flogin'))

    expect(response.headers.get('location')).toBe('https://aliados.example/inicio')
  })

  it('fails closed on protected routes when session verification fails', async () => {
    refreshSession.mockRejectedValue(new Error('configuration detail'))

    const response = await proxy(request('/ganancias'))

    expect(response.headers.get('location')).toBe(
      'https://aliados.example/login?error=service_unavailable',
    )
  })
})
