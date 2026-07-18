import { Package } from 'lucide-react'
import { OperationalUnavailable } from '@/components/operational-unavailable'

export default function PaquetesPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold text-[color:var(--color-foreground)]">
          Paquetes
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
          Espacio reservado para custodia y recepción verificadas
        </p>
      </section>

      <OperationalUnavailable
        icon={Package}
        title="Paquetes no disponibles"
        description="El registro de recepción, condición y custodia todavía no está conectado a una fuente operativa autorizada. No mostramos una lista vacía porque no se han consultado datos reales."
      />
    </div>
  )
}
