import { ShoppingBag } from 'lucide-react'
import { OperationalUnavailable } from '@/components/operational-unavailable'

export default function PedidosPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold text-[color:var(--color-foreground)]">
          Pedidos
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
          Espacio reservado para asignaciones verificadas
        </p>
      </section>

      <OperationalUnavailable
        icon={ShoppingBag}
        title="Pedidos no disponibles"
        description="La cola de pedidos y asignaciones todavía no está conectada a una fuente operativa autorizada. No podemos afirmar que esté vacía ni mostrar detalles hasta validar permisos y datos en el servidor."
      />
    </div>
  )
}
