const publicExactRoutes = new Set(['/', '/login', '/signup', '/callback', '/acceso'])
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
    if (
      parsed.origin !== 'https://aliados.mpho.invalid' ||
      !isProtectedRoute(parsed.pathname)
    ) {
      return '/inicio'
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return '/inicio'
  }
}
