import { MphoLogo } from './mpho-logo'
import Link from 'next/link'

const COLUMNS = [
  { title: 'Regalos', links: [
    { label: 'Para pareja', href: '/explorar' },
    { label: 'Para mamá', href: '/explorar' },
    { label: 'Para papá', href: '/explorar' },
    { label: 'Amistad', href: '/explorar' },
    { label: 'Cumpleaños', href: '/#ocasiones' },
  ] },
  { title: 'MPHO', links: [
    { label: 'Cómo funciona', href: '/#como-funciona' },
    { label: 'MPHORA', href: '/hadia' },
    { label: 'HADIA', href: '/hadia' },
    { label: 'Ocasiones', href: '/#ocasiones' },
  ] },
  { title: 'Ayuda', links: [
    { label: 'Centro de ayuda', href: '/#ayuda' },
    { label: 'Seguimiento de pedido', href: '/pedidos' },
    { label: 'Contacto', href: '/#ayuda' },
    { label: 'Mi cuenta', href: '/perfil' },
  ] },
]

export function SiteFooter() {
  return (
    <footer id="ayuda" className="mt-4 scroll-mt-20 border-t border-[color:var(--color-border-soft)] px-4 pb-8 pt-10 lg:scroll-mt-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <MphoLogo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            México, Personas, Historias y Ocasiones. El regalo correcto, coordinado y preparado por MPHO.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-sm font-bold text-foreground">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-[color:var(--color-lime)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-2 border-t border-[color:var(--color-border-soft)] pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} MPHO. Todos los derechos reservados.</p>
        <p>Hecho en México · Entrega coordinada por MPHO</p>
      </div>
    </footer>
  )
}
