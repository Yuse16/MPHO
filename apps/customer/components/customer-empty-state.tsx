import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

export function CustomerEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: { href: string; label: string }
}) {
  return (
    <section className="glass flex min-h-72 flex-col items-center justify-center rounded-[2rem] px-6 py-12 text-center">
      <span className="flex size-16 items-center justify-center rounded-full border border-border-lime bg-lime/5 text-lime shadow-[0_0_50px_-18px_rgba(200,255,53,0.65)]">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
      <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-lime-intense"
        >
          {action.label}
        </Link>
      )}
    </section>
  )
}
