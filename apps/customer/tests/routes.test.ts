import { describe, expect, it } from 'vitest'
import { getSafeRedirect, isProtectedRoute, isPublicRoute } from '@/lib/routes'

describe('customer route classification', () => {
  it.each(['/', '/regalos', '/explorar', '/hadia', '/pedidos', '/perfil', '/categoria/flores', '/producto/rosas', '/ocasiones/cumpleanos', '/mphora', '/login', '/signup', '/callback', '/callback/email'])('%s is public', (route) => {
    expect(isPublicRoute(route)).toBe(true)
    expect(isProtectedRoute(route)).toBe(false)
  })

  it.each(['/profile', '/pedidos/MPHO-1', '/carrito', '/direcciones', '/personas', '/ocasiones-guardadas'])('%s is protected', (route) => {
    expect(isProtectedRoute(route)).toBe(true)
  })

  it('keeps safe local redirects and blocks open redirects', () => {
    expect(getSafeRedirect('/pedidos/MPHO-1?tab=estado')).toBe('/pedidos/MPHO-1?tab=estado')
    expect(getSafeRedirect('https://evil.example')).toBe('/')
    expect(getSafeRedirect('//evil.example/path')).toBe('/')
    expect(getSafeRedirect('javascript:alert(1)')).toBe('/')
  })
})
