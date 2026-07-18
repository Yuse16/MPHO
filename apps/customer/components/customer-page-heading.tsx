export function CustomerPageHeading({
  eyebrow,
  title,
  description,
  accent = 'lime',
}: {
  eyebrow: string
  title: string
  description: string
  accent?: 'lime' | 'cyan'
}) {
  return (
    <header className="mb-8 max-w-3xl sm:mb-10">
      <p
        className={
          accent === 'cyan'
            ? 'text-xs font-bold uppercase tracking-[0.22em] text-cyan'
            : 'text-xs font-bold uppercase tracking-[0.22em] text-lime'
        }
      >
        {eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
    </header>
  )
}
