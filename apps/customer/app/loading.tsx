export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-[rgba(255,255,255,0.12)] border-t-[#c8ff35]" />
        <p className="text-sm text-[#7d8982]">Cargando...</p>
      </div>
    </div>
  )
}
