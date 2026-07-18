import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="glass rounded-[var(--radius-xl)] p-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[color:var(--color-lime)]/10">
        <ShieldCheck
          aria-hidden="true"
          className="size-6 text-[color:var(--color-lime)]"
        />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-[color:var(--color-foreground)]">
        Acceso por invitación
      </h1>
      <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted-foreground)]">
        Las cuentas de MPHO Aliados se habilitan después de que MPHO valida al
        Punto y asigna un rol autorizado. Esta pantalla no crea cuentas ni activa
        operaciones.
      </p>
      <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted-foreground)]">
        Si ya recibiste acceso, inicia sesión con el correo registrado.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-[color:var(--color-lime)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-primary-foreground)] transition-colors hover:bg-[color:var(--color-lime-intense)]"
      >
        Ir a iniciar sesión
      </Link>
    </div>
  )
}
