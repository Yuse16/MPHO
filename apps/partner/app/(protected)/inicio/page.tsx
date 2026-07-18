import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import { OperationalUnavailable } from '@/components/operational-unavailable'

export default function InicioPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold text-[color:var(--color-foreground)]">
          Bienvenido
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
          Acceso seguro a MPHO Aliados
        </p>
      </section>

      <OperationalUnavailable
        icon={ShieldAlert}
        title="Resumen operativo no disponible"
        description="Esta versión todavía no consulta una fuente operativa autorizada para pedidos, tareas, entregas o ganancias. Por seguridad, no mostramos conteos ni estados supuestos."
      />

      <section className="glass rounded-[var(--radius-xl)] p-5">
        <h3 className="text-sm font-semibold text-[color:var(--color-foreground)]">
          Secciones disponibles
        </h3>
        <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
          Puedes revisar la estructura inicial de los módulos. Ninguna pantalla
          confirma actividad operativa hasta contar con datos verificados.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <QuickLink href="/pedidos">Pedidos</QuickLink>
          <QuickLink href="/paquetes">Paquetes</QuickLink>
          <QuickLink href="/ganancias">Ganancias</QuickLink>
        </div>
      </section>
    </div>
  )
}

function QuickLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-white/5 px-4 py-2 text-sm font-medium text-[color:var(--color-muted-foreground)] transition-colors hover:bg-white/10 hover:text-[color:var(--color-foreground)]"
    >
      {children}
    </Link>
  )
}
