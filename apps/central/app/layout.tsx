import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MPHO Central · Panel de administración',
  description:
    'MPHO Central es la plataforma de administración interna para gestionar socios, pedidos, operaciones y entregas.',
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
      <body className="bg-[#030706] text-[#f8faf9] antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
