import './globals.css'

export const metadata = {
  title: 'Lluvia y Leyes de Newton',
  description: 'Simulación interactiva de lluvia con inercia y F=ma (Next.js + Tailwind)'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-background text-white antialiased">
        {children}
      </body>
    </html>
  )
}
