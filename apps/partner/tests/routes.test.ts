import { describe, expect, it } from 'vitest'
import { getSafeRedirect, isProtectedRoute, isPublicRoute } from '@/lib/routes'

describe('partner routes', () => {
  it('recognizes public and protected routes', () => {
    expect(isPublicRoute('/login')).toBe(true)
    expect(isPublicRoute('/acceso')).toBe(true)
    expect(isProtectedRoute('/inicio')).toBe(true)
    expect(isProtectedRoute('/pedidos/order-id')).toBe(true)
    expect(isProtectedRoute('/login')).toBe(false)
  })

  it.each([
    ['/pedidos?estado=pendiente', '/pedidos?estado=pendiente'],
    ['/pedidos/order-id#detalle', '/pedidos/order-id#detalle'],
    ['/perfil', '/perfil'],
  ])('keeps safe protected redirects', (value, expected) => {
    expect(getSafeRedirect(value)).toBe(expected)
  })

  it.each([
    null,
    '',
    '//evil.example/path',
    'https://evil.example/path',
    '/login',
    '/signup',
    '/acceso',
    '/desconocida',
    '/pedidos/../login',
  ])('rejects unsafe or loop-producing redirect %s', (value) => {
    expect(getSafeRedirect(value)).toBe('/inicio')
  })
})
