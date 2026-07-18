import Link from 'next/link'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { PublicCatalogCategory } from '@mpho/types'

export function CatalogFilters({
  categories,
  search,
  category,
  categoriesLoaded,
}: {
  categories: PublicCatalogCategory[]
  search: string
  category: string
  categoriesLoaded: boolean
}) {
  const hasFilters = Boolean(search || category)
  const selectedCategoryIsMissing =
    Boolean(category) && !categories.some((item) => item.slug === category)

  return (
    <section
      aria-labelledby="catalog-filters-title"
      className="glass mb-8 rounded-[1.75rem] p-4 sm:p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-lime" aria-hidden="true" />
        <h2 id="catalog-filters-title" className="text-sm font-bold text-foreground">
          Busca en el catálogo
        </h2>
      </div>

      <form action="/explorar" method="get" className="grid gap-3 md:grid-cols-[1fr_16rem_auto]">
        <label className="relative block">
          <span className="sr-only">Buscar regalos</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint"
            aria-hidden="true"
          />
          <input
            type="search"
            name="q"
            defaultValue={search}
            maxLength={80}
            placeholder="Nombre, descripción o categoría"
            className="min-h-12 w-full rounded-2xl border border-border-soft bg-black/20 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-faint"
          />
        </label>

        <label className="block">
          <span className="sr-only">Categoría</span>
          <select
            name="categoria"
            defaultValue={category}
            className="min-h-12 w-full rounded-2xl border border-border-soft bg-[color:var(--color-background-2)] px-4 py-3 text-sm text-foreground"
          >
            <option value="">Todas las categorías</option>
            {selectedCategoryIsMissing && (
              <option value={category} disabled>
                {categoriesLoaded
                  ? 'La categoría seleccionada ya no está disponible'
                  : 'Categoría seleccionada'}
              </option>
            )}
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name} ({item.listingCount})
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="min-h-12 rounded-full bg-lime px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-lime-intense"
        >
          Buscar
        </button>
      </form>

      {hasFilters && (
        <div className="mt-4 flex justify-end">
          <Link
            href="/explorar"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
            Limpiar filtros
          </Link>
        </div>
      )}
    </section>
  )
}
