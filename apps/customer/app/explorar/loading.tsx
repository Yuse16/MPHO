import { CustomerShell } from '@/components/customer-shell'

export default function ExploreLoading() {
  return (
    <CustomerShell>
      <main
        aria-busy="true"
        aria-label="Cargando catálogo"
        className="mx-auto w-full max-w-7xl px-4 pb-28 pt-10 sm:px-8 lg:pb-16 lg:pt-14"
      >
        <div className="h-3 w-32 animate-pulse rounded-full bg-lime/20" />
        <div className="mt-4 h-12 max-w-md animate-pulse rounded-2xl bg-white/10" />
        <div className="mt-4 h-6 max-w-2xl animate-pulse rounded-xl bg-white/5" />
        <div className="glass mt-10 h-28 animate-pulse rounded-[1.75rem]" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="glass overflow-hidden rounded-2xl">
              <div className="aspect-[4/5] animate-pulse bg-white/5" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-full animate-pulse rounded bg-white/5" />
                <div className="h-5 w-1/3 animate-pulse rounded bg-lime/10" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </CustomerShell>
  )
}
