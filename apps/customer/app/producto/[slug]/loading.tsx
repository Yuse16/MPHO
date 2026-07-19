import { CustomerShell } from '@/components/customer-shell'

export default function ProductLoading() {
  return (
    <CustomerShell>
      <main
        aria-busy="true"
        aria-label="Cargando regalo"
        className="mx-auto w-full max-w-7xl px-4 pb-28 pt-8 sm:px-8 lg:pb-16 lg:pt-10"
      >
        <div className="h-11 w-44 animate-pulse rounded-full bg-white/5" />
        <div className="mt-5 grid gap-8 lg:grid-cols-2">
          <div className="glass min-h-[360px] animate-pulse rounded-[2rem] sm:min-h-[560px]" />
          <div className="glass min-h-[480px] animate-pulse rounded-[2rem]" />
        </div>
      </main>
    </CustomerShell>
  )
}
