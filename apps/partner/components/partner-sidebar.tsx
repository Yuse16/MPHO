'use client'

import { usePathname } from 'next/navigation'
import {
  Home,
  Package,
  ShoppingBag,
  DollarSign,
  Settings,
  UserRound,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio', href: '/inicio', icon: Home },
  { id: 'pedidos', label: 'Pedidos', href: '/pedidos', icon: ShoppingBag },
  { id: 'paquetes', label: 'Paquetes', href: '/paquetes', icon: Package },
  { id: 'ganancias', label: 'Ganancias', href: '/ganancias', icon: DollarSign },
  { id: 'configuracion', label: 'Configuracion', href: '/configuracion', icon: Settings },
  { id: 'perfil', label: 'Perfil', href: '/perfil', icon: UserRound },
]

export function PartnerSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const isActive = (href: string) =>
    href === '/inicio'
      ? pathname === '/inicio'
      : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <aside className="glass fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r-0 border-y-0 lg:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/inicio" className="text-lg font-bold text-[color:var(--color-foreground)]">
          MPHO <span className="text-[color:var(--color-lime)]">Aliados</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Navegacion lateral">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-[color:var(--color-lime)]/10 text-[color:var(--color-lime)]'
                  : 'text-[color:var(--color-muted-foreground)] hover:bg-white/5 hover:text-[color:var(--color-foreground)]',
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[color:var(--color-border-soft)] p-3">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium text-[color:var(--color-muted-foreground)] transition-colors hover:bg-white/5 hover:text-[color:var(--color-foreground)]"
        >
          <LogOut className="size-5" />
          Cerrar sesion
        </button>
      </div>
    </aside>
  )
}
