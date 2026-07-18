import { Settings } from 'lucide-react'
import { OperationalUnavailable } from '@/components/operational-unavailable'

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold text-[color:var(--color-foreground)]">
          Configuración
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
          Información operativa del Punto MPHO
        </p>
      </section>

      <OperationalUnavailable
        icon={Settings}
        title="Configuración no disponible"
        description="Los datos del Punto, horarios, capacidades y elegibilidad MPHORA todavía no se consultan en esta versión. No se presenta ningún valor como confirmado hasta validarlo con la fuente autorizada."
      />
    </div>
  )
}
