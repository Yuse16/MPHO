const publicExactRoutes = new Set(['/', '/regalos', '/mphora', '/login', '/signup', '/callback'])
const publicRoutePrefixes = ['/categoria/', '/producto/', '/ocasiones/', '/ocasion/', '/callback/']
const protectedExactRoutes = new Set([
  '/profile',
  '/perfil',
  '/pedidos',
  '/direcciones',
  '/personas',
  '/ocasiones-guardadas',
])
const protectedRoutePrefixes = ['/pedidos/']

export function isPublicRoute(pathname: string) {
  return publicExactRoutes.has(pathname) || publicRoutePrefixes.some((prefix) => pathname.startsWith(prefix))
}

export function isProtectedRoute(pathname: string) {
  return protectedExactRoutes.has(pathname) || protectedRoutePrefixes.some((prefix) => pathname.startsWith(prefix))
}

export function getSafeRedirect(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/'
  try {
    const parsed = new URL(value, 'https://mpho.invalid')
    return parsed.origin === 'https://mpho.invalid' ? `${parsed.pathname}${parsed.search}${parsed.hash}` : '/'
  } catch {
    return '/'
  }
}
