import { PackageSearch } from 'lucide-react'
import { CustomerEmptyState } from '@/components/customer-empty-state'
import { CustomerShell } from '@/components/customer-shell'

export default function ProductNotFound() {
  return (
    <CustomerShell>
      <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-12 sm:px-8">
        <div className="w-full">
          <CustomerEmptyState
            icon={PackageSearch}
            title="Este regalo no está disponible"
            description="Puede que ya no esté publicado o que el enlace no sea válido. Revisa las opciones disponibles en el catálogo."
            action={{ href: '/explorar', label: 'Explorar regalos' }}
          />
        </div>
      </main>
    </CustomerShell>
  )
}
