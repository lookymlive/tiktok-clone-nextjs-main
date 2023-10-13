import UserProvider from './context/user'; // Importa el componente UserProvider desde el archivo './context/user'.
import AllOverlays from "@/app/components/AllOverlays"; // Importa el componente AllOverlays desde '@/app/components/AllOverlays'.
import './globals.css'; // Importa estilos globales desde el archivo 'globals.css'.
import type { Metadata } from 'next'; // Importa el tipo Metadata del módulo 'next'.

// Define un objeto metadata con información de metadatos para la página.
export const metadata: Metadata = {
  title: 'TikTok Clone',
  description: 'TikTok Clone',
}
// Define el componente RootLayout, que recibe 'children' como prop.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <UserProvider>


        <body>
          <AllOverlays />
          {children}
        </body>

      </UserProvider>
    </html>
  )
}
