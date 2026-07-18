export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold text-[color:var(--color-foreground)]">
          Configuracion
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
          Ajustes de tu punto y perfil de socio
        </p>
      </section>

      <div className="glass rounded-[var(--radius-xl)] p-5">
        <h3 className="text-sm font-semibold text-[color:var(--color-foreground)]">
          Informacion del punto
        </h3>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[color:var(--color-muted-foreground)]">Nombre</span>
            <span className="text-[color:var(--color-faint)]">Sin asignar</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[color:var(--color-muted-foreground)]">Direccion</span>
            <span className="text-[color:var(--color-faint)]">Sin asignar</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[color:var(--color-muted-foreground)]">Telefono</span>
            <span className="text-[color:var(--color-faint)]">Sin asignar</span>
          </div>
        </div>
      </div>

      <div className="glass rounded-[var(--radius-xl)] p-5">
        <h3 className="text-sm font-semibold text-[color:var(--color-foreground)]">
          Horario
        </h3>
        <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
          Sin horario configurado. Contacta al administrador para configurar tu
          horario de operacion.
        </p>
      </div>

      <div className="glass rounded-[var(--radius-xl)] p-5">
        <h3 className="text-sm font-semibold text-[color:var(--color-foreground)]">
          Capacidades
        </h3>
        <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
          Sin capacidades registradas. Tus capacidades determinan que tipos de
          servicios puedes ofrecer (recepcion, preparacion, entrega, etc.).
        </p>
      </div>

      <div className="glass rounded-[var(--radius-xl)] p-5">
        <h3 className="text-sm font-semibold text-[color:var(--color-foreground)]">
          MPHORA
        </h3>
        <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
          MPHORA no esta habilitado para tu punto. Contacta al administrador para
          activar la entrega rapida.
        </p>
      </div>
    </div>
  )
}
