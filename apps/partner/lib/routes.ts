const publicExactRoutes = new Set(['/', '/login', '/signup', '/callback'])
const protectedExactRoutes = new Set([
  '/inicio',
  '/pedidos',
  '/ganancias',
  '/paquetes',
  '/configuracion',
  '/perfil',
  '/equipo',
])
const protectedRoutePrefixes = ['/pedidos/', '/paquetes/', '/equipo/']

export function isPublicRoute(pathname: string) {
  return publicExactRoutes.has(pathname)
}

export function isProtectedRoute(pathname: string) {
  return (
    protectedExactRoutes.has(pathname) ||
    protectedRoutePrefixes.some((prefix) => pathname.startsWith(prefix))
  )
}

export function getSafeRedirect(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/inicio'
  try {
    const parsed = new URL(value, 'https://aliados.mpho.invalid')
    return parsed.origin === 'https://aliados.mpho.invalid'
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : '/inicio'
  } catch {
    return '/inicio'
  }
}
