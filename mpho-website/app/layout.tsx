import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MPHO · El regalo correcto, sin perder horas buscándolo',
  description:
    'MPHO es la plataforma mexicana de regalos premium. HADIA encuentra el regalo ideal según la persona, la ocasión, tu presupuesto y el tiempo que tienes. Entrega rápida con MPHORA.',
  generator: 'v0.app',
  applicationName: 'MPHO',
  keywords: ['regalos', 'MPHO', 'HADIA', 'MPHORA', 'regalos premium', 'México', 'Saltillo'],
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
    <html lang="es-MX" className={`dark ${manrope.variable}`}>
      <body className="mpho-bg antialiased font-sans">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
