"use client";
import Header from "@/components/Header";
import { Providers } from "./providers";
import { usePathname } from "next/navigation"; // Importando usePathname para obter a rota atual
import"./page.module.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Obtendo a rota atual

  // Verificando se a rota atual é uma rota de admin
  const isAdminRoute = pathname?.includes("/login");

  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          {/* Renderiza o Header apenas se não estiver em uma rota de admin */}
          {!isAdminRoute && <Header />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
