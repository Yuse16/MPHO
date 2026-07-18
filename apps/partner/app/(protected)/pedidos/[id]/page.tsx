import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PedidoDetailPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/pedidos"
        className="inline-flex items-center gap-2 text-sm text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] transition-colors"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Volver a pedidos
      </Link>

      <div className="glass rounded-[var(--radius-xl)] p-6">
        <h2 className="text-lg font-bold text-[color:var(--color-foreground)]">
          Detalle de pedido
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
          El detalle operativo todavía no está disponible. Esta versión no
          consulta el identificador ni muestra datos de pedidos sin una fuente
          autorizada y permisos verificados en el servidor.
        </p>
      </div>
    </div>
  )
}
