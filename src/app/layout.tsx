import Header from "@/components/Header";
import { Providers } from "./providers";
import "./page.module.css";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Família Peaky Blinders',
  description: 'Faça parte da familia',
  icons: {
    icon: '/favicon.ico', // Caminho para o seu favicon
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
