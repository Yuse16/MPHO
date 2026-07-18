import { ShoppingBag, Package, DollarSign, Clock } from 'lucide-react'
import Link from 'next/link'

export default function InicioPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold text-[color:var(--color-foreground)]">
          Bienvenido
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
          Resumen de tu actividad de hoy
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <MetricCard
          icon={ShoppingBag}
          label="Pedidos hoy"
          value="0"
          emptyHint="Sin pedidos aun"
        />
        <MetricCard
          icon={Clock}
          label="Pendientes"
          value="0"
          emptyHint="Nada pendiente"
        />
        <MetricCard
          icon={Package}
          label="Entregados"
          value="0"
          emptyHint="Sin entregas hoy"
        />
        <MetricCard
          icon={DollarSign}
          label="Ganancias hoy"
          value="$0"
          emptyHint="Sin ganancias hoy"
        />
      </div>

      <section className="glass rounded-[var(--radius-xl)] p-5">
        <h3 className="text-sm font-semibold text-[color:var(--color-foreground)]">
          Tareas pendientes
        </h3>
        <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
          No hay tareas pendientes en este momento.
        </p>
      </section>

      <section className="glass rounded-[var(--radius-xl)] p-5">
        <h3 className="text-sm font-semibold text-[color:var(--color-foreground)]">
          Acciones rapidas
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/pedidos"
            className="rounded-[var(--radius-md)] bg-[color:var(--color-lime)]/10 px-4 py-2 text-sm font-medium text-[color:var(--color-lime)] transition-colors hover:bg-[color:var(--color-lime)]/20"
          >
            Ver pedidos
          </Link>
          <Link
            href="/paquetes"
            className="rounded-[var(--radius-md)] bg-white/5 px-4 py-2 text-sm font-medium text-[color:var(--color-muted-foreground)] transition-colors hover:bg-white/10"
          >
            Ver paquetes
          </Link>
          <Link
            href="/ganancias"
            className="rounded-[var(--radius-md)] bg-white/5 px-4 py-2 text-sm font-medium text-[color:var(--color-muted-foreground)] transition-colors hover:bg-white/10"
          >
            Ver ganancias
          </Link>
        </div>
      </section>

      <section className="glass rounded-[var(--radius-xl)] p-5">
        <h3 className="text-sm font-semibold text-[color:var(--color-foreground)]">
          Estado del punto
        </h3>
        <div className="mt-3 flex items-center gap-3">
          <span className="inline-block size-2.5 rounded-full bg-[color:var(--color-faint)]" />
          <span className="text-sm text-[color:var(--color-muted-foreground)]">
            Sin punto asignado. Contacta al administrador para activar tu punto.
          </span>
        </div>
      </section>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  emptyHint,
}: {
  icon: typeof ShoppingBag
  label: string
  value: string
  emptyHint: string
}) {
  return (
    <div className="glass rounded-[var(--radius-xl)] p-4">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-[color:var(--color-lime)]" />
        <span className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
          {label}
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-[color:var(--color-foreground)]">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-[color:var(--color-faint)]">{emptyHint}</p>
    </div>
  )
}
