import { BadgeDollarSign } from 'lucide-react'
import { OperationalUnavailable } from '@/components/operational-unavailable'

export default function GananciasPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold text-[color:var(--color-foreground)]">
          Ganancias
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
          Espacio reservado para registros financieros conciliados
        </p>
      </section>

      <OperationalUnavailable
        icon={BadgeDollarSign}
        title="Información financiera no disponible"
        description="Esta versión no consulta un ledger autorizado de ganancias o pagos. Por seguridad financiera, no mostramos saldos en cero, adeudos ni totales históricos sin registros conciliados."
      />
    </div>
  )
}
