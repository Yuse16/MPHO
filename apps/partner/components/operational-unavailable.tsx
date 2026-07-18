import type { LucideIcon } from 'lucide-react'

interface OperationalUnavailableProps {
  icon: LucideIcon
  title: string
  description: string
}

export function OperationalUnavailable({
  icon: Icon,
  title,
  description,
}: OperationalUnavailableProps) {
  return (
    <section
      role="status"
      className="glass rounded-[var(--radius-xl)] p-8 text-center"
    >
      <Icon
        aria-hidden="true"
        className="mx-auto mb-3 size-10 text-[color:var(--color-faint)]"
      />
      <h3 className="text-sm font-semibold text-[color:var(--color-foreground)]">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[color:var(--color-muted-foreground)]">
        {description}
      </p>
    </section>
  )
}
