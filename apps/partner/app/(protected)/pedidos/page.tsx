import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function PedidosPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold text-[color:var(--color-foreground)]">
          Pedidos
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
          Lista de pedidos asignados a tu punto
        </p>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Todos', 'Pendiente', 'En preparacion', 'Listo', 'Entregado'].map(
          (filter) => (
            <button
              key={filter}
              data-active={filter === 'Todos'}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors bg-white/5 text-[color:var(--color-muted-foreground)] hover:bg-white/10 data-[active=true]:bg-[color:var(--color-lime)]/10 data-[active=true]:text-[color:var(--color-lime)]"
            >
              {filter}
            </button>
          ),
        )}
      </div>

      <div className="glass rounded-[var(--radius-xl)] p-8 text-center">
        <ShoppingBag className="mx-auto mb-3 size-10 text-[color:var(--color-faint)]" />
        <h3 className="text-sm font-semibold text-[color:var(--color-foreground)]">
          Sin pedidos
        </h3>
        <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
          No tienes pedidos asignados en este momento. Los pedidos apareceran aqui
          cuando un cliente compre un producto de tu catalogo.
        </p>
        <Link
          href="/inicio"
          className="mt-4 inline-block rounded-[var(--radius-md)] bg-[color:var(--color-lime)]/10 px-4 py-2 text-sm font-medium text-[color:var(--color-lime)] transition-colors hover:bg-[color:var(--color-lime)]/20"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
