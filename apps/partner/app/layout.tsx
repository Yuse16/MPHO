import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/lib/providers'

export const metadata: Metadata = {
  title: 'MPHO Aliados · Acceso operativo',
  description:
    'Acceso seguro a la aplicación operativa de MPHO Aliados.',
}

export const viewport: Viewport = {
  themeColor: '#030706',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-MX" className="dark">
      <body className="bg-[color:var(--color-background)] text-[color:var(--color-foreground)] antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
