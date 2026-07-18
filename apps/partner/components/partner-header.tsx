'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

const TITLES: Record<string, string> = {
  '/inicio': 'Inicio',
  '/pedidos': 'Pedidos',
  '/ganancias': 'Ganancias',
  '/paquetes': 'Paquetes',
  '/configuracion': 'Configuracion',
  '/perfil': 'Perfil',
}

export function PartnerHeader() {
  const pathname = usePathname()
  const { user } = useAuth()

  const title =
    TITLES[pathname] ??
    (pathname.startsWith('/pedidos/') ? 'Detalle de pedido' : 'MPHO Aliados')

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between px-4 lg:hidden">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/inicio"
          aria-label="Ir al inicio de MPHO Aliados"
          className="shrink-0 text-sm font-bold text-[color:var(--color-foreground)]"
        >
          MPHO <span className="text-[color:var(--color-lime)]">Aliados</span>
        </Link>
        <h1 className="text-base font-semibold text-[color:var(--color-foreground)]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/perfil"
          className="flex size-9 items-center justify-center rounded-full bg-[color:var(--color-lime)]/10 text-[color:var(--color-lime)] text-sm font-bold"
          aria-label="Mi perfil"
        >
          {user?.email?.charAt(0).toUpperCase() ?? 'A'}
        </Link>
      </div>
    </header>
  )
}
