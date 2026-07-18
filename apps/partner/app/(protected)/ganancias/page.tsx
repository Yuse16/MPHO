import { DollarSign } from 'lucide-react'

export default function GananciasPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold text-[color:var(--color-foreground)]">
          Ganancias
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
          Resumen de tus ganancias como socio
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass rounded-[var(--radius-xl)] p-5">
          <span className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
            Este mes
          </span>
          <p className="mt-2 text-3xl font-bold text-[color:var(--color-foreground)]">
            $0
          </p>
          <p className="mt-1 text-xs text-[color:var(--color-faint)]">
            Sin ganancias registradas
          </p>
        </div>
        <div className="glass rounded-[var(--radius-xl)] p-5">
          <span className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
            Pendiente de pago
          </span>
          <p className="mt-2 text-3xl font-bold text-[color:var(--color-foreground)]">
            $0
          </p>
          <p className="mt-1 text-xs text-[color:var(--color-faint)]">
            Sin pagos pendientes
          </p>
        </div>
        <div className="glass rounded-[var(--radius-xl)] p-5">
          <span className="text-xs font-medium text-[color:var(--color-muted-foreground)]">
            Total historico
          </span>
          <p className="mt-2 text-3xl font-bold text-[color:var(--color-foreground)]">
            $0
          </p>
          <p className="mt-1 text-xs text-[color:var(--color-faint)]">
            Sin historial
          </p>
        </div>
      </div>

      <div className="glass rounded-[var(--radius-xl)] p-8 text-center">
        <DollarSign className="mx-auto mb-3 size-10 text-[color:var(--color-faint)]" />
        <h3 className="text-sm font-semibold text-[color:var(--color-foreground)]">
          Sin actividad financiera
        </h3>
        <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
          Tus ganancias apareceran aqui cuando completes pedidos. Cada pedido
          completado generara un registro en tu historial de ganancias.
        </p>
      </div>
    </div>
  )
}
