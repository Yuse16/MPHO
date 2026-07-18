'use client'

import { usePathname } from 'next/navigation'
import {
  Home,
  Package,
  ShoppingBag,
  DollarSign,
  MoreHorizontal,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

const ITEMS = [
  { id: 'inicio', label: 'Inicio', href: '/inicio', icon: Home },
  { id: 'pedidos', label: 'Pedidos', href: '/pedidos', icon: ShoppingBag },
  { id: 'paquetes', label: 'Paquetes', href: '/paquetes', icon: Package },
  { id: 'ganancias', label: 'Ganancias', href: '/ganancias', icon: DollarSign },
  { id: 'mas', label: 'Mas', href: '/perfil', icon: MoreHorizontal },
]

export function PartnerBottomNav() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const isActive = (href: string) =>
    href === '/inicio'
      ? pathname === '/inicio'
      : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <nav
      aria-label="Navegacion principal"
      className="glass fixed inset-x-0 bottom-0 z-40 rounded-none border-x-0 border-b-0 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex h-[68px] max-w-md items-center justify-around px-2">
        {ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const isLogout = item.id === 'mas'

          if (isLogout) {
            return (
              <button
                key={item.id}
                onClick={signOut}
                className="flex min-h-11 w-16 flex-col items-center justify-center gap-1 transition-colors"
                aria-label="Cerrar sesion"
              >
                <Icon className="size-5 text-[color:var(--color-faint)]" />
                <span className="text-[11px] font-medium text-[color:var(--color-faint)]">
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className="flex min-h-11 w-16 flex-col items-center justify-center gap-1 transition-colors"
            >
              <Icon
                className={cn(
                  'size-5',
                  active
                    ? 'text-[color:var(--color-lime)]'
                    : 'text-[color:var(--color-faint)]',
                )}
              />
              <span
                className={cn(
                  'text-[11px] font-medium',
                  active
                    ? 'text-[color:var(--color-lime)]'
                    : 'text-[color:var(--color-faint)]',
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
