'use client'

import { Home, Search, ShoppingBag, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HadiaSphere } from './hadia-sphere'
import { cn } from '@/lib/utils'

const ITEMS = [
  { id: 'inicio', label: 'Inicio', href: '/', icon: Home },
  { id: 'explorar', label: 'Explorar', href: '/explorar', icon: Search },
  { id: 'pedidos', label: 'Pedidos', href: '/pedidos', icon: ShoppingBag },
  { id: 'perfil', label: 'Perfil', href: '/perfil', icon: UserRound },
]

export function MobileBottomNavigation() {
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <nav
      aria-label="Navegación principal"
      className="glass fixed inset-x-0 bottom-0 z-40 rounded-none border-x-0 border-b-0 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="relative mx-auto flex h-[68px] max-w-md items-center justify-around px-2">
        {/* left group */}
        {ITEMS.slice(0, 2).map((item) => (
          <NavItem key={item.id} item={item} active={isActive(item.href)} />
        ))}

        {/* center HADIA */}
        <Link
          href="/hadia"
          aria-label="Abrir HADIA, la inteligencia de regalos"
          aria-current={isActive('/hadia') ? 'page' : undefined}
          className="relative -mt-8 flex flex-col items-center"
        >
          <HadiaSphere
            className={cn(
              'size-16 shadow-[0_10px_30px_-6px_rgba(22,217,255,0.6)]',
              isActive('/hadia') && 'ring-2 ring-cyan ring-offset-2 ring-offset-background',
            )}
            float
          />
        </Link>

        {/* right group */}
        {ITEMS.slice(2).map((item) => (
          <NavItem key={item.id} item={item} active={isActive(item.href)} />
        ))}
      </div>
    </nav>
  )
}

function NavItem({
  item,
  active,
}: {
  item: { id: string; label: string; href: string; icon: typeof Home }
  active: boolean
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className="flex min-h-11 w-16 flex-col items-center justify-center gap-1 transition-colors"
    >
      <Icon className={cn('size-5', active ? 'text-[color:var(--color-lime)]' : 'text-faint')} />
      <span className={cn('text-[11px] font-medium', active ? 'text-[color:var(--color-lime)]' : 'text-faint')}>
        {item.label}
      </span>
    </Link>
  )
}
