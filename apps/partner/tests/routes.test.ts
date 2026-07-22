import { describe, expect, it } from 'vitest'
import {
  getSafeRedirect,
  isProtectedRoute,
  isPublicRoute,
  shouldBypassProxy,
} from '@/lib/routes'

describe('partner routes', () => {
  it.each(['/login', '/callback', '/acceso'])('keeps %s public', (pathname) => {
    expect(isPublicRoute(pathname)).toBe(true)
    expect(isProtectedRoute(pathname)).toBe(false)
  })

  it.each(['/inicio', '/pedidos', '/pedidos/order-id', '/ruta-nueva-no-clasificada'])(
    'protects %s',
    (pathname) => {
      expect(isPublicRoute(pathname)).toBe(false)
      expect(isProtectedRoute(pathname)).toBe(true)
    },
  )

  it('bypasses Next.js internals without classifying them as public pages', () => {
    expect(shouldBypassProxy('/_next/static/chunks/app.js')).toBe(true)
    expect(isPublicRoute('/_next/static/chunks/app.js')).toBe(false)
    expect(isProtectedRoute('/_next/static/chunks/app.js')).toBe(false)
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
