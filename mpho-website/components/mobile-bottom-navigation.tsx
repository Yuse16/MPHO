'use client'

import { useState } from 'react'
import { Home, Search, ShoppingBag, UserRound } from 'lucide-react'
import { HadiaSphere } from './hadia-sphere'
import { cn } from '@/lib/utils'

const ITEMS = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'explorar', label: 'Explorar', icon: Search },
  { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
  { id: 'perfil', label: 'Perfil', icon: UserRound },
]

export function MobileBottomNavigation() {
  const [active, setActive] = useState('inicio')

  return (
    <nav
      aria-label="Navegación principal"
      className="glass fixed inset-x-0 bottom-0 z-40 rounded-none border-x-0 border-b-0 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="relative mx-auto flex h-[68px] max-w-md items-center justify-around px-2">
        {/* left group */}
        {ITEMS.slice(0, 2).map((item) => (
          <NavItem key={item.id} item={item} active={active === item.id} onClick={() => setActive(item.id)} />
        ))}

        {/* center HADIA */}
        <button
          type="button"
          aria-label="Abrir HADIA, la inteligencia de regalos"
          onClick={() => {
            console.log('[v0] Navegando a /hadia')
          }}
          className="relative -mt-8 flex flex-col items-center"
        >
          <HadiaSphere className="size-16 shadow-[0_10px_30px_-6px_rgba(22,217,255,0.6)]" float />
        </button>

        {/* right group */}
        {ITEMS.slice(2).map((item) => (
          <NavItem key={item.id} item={item} active={active === item.id} onClick={() => setActive(item.id)} />
        ))}
      </div>
    </nav>
  )
}

function NavItem({
  item,
  active,
  onClick,
}: {
  item: { id: string; label: string; icon: typeof Home }
  active: boolean
  onClick: () => void
}) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className="flex min-h-11 w-16 flex-col items-center justify-center gap-1 transition-colors"
    >
      <Icon className={cn('size-5', active ? 'text-[color:var(--color-lime)]' : 'text-faint')} />
      <span className={cn('text-[11px] font-medium', active ? 'text-[color:var(--color-lime)]' : 'text-faint')}>
        {item.label}
      </span>
    </button>
  )
}
