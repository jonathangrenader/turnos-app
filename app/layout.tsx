import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";
import BootstrapClient from "./components/BootstrapClient";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Gestor de Turnos",
  description: "Aplicación para gestionar turnos de belleza y barbería",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
