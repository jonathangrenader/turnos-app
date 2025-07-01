import { Providers } from './providers';
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";

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
        <Providers>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
