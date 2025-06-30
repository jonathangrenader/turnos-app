
import Link from 'next/link';

export default function Home() {
  return (
    <main className="d-flex flex-column min-vh-100">
      <div className="container text-center my-auto">
        <h1 className="display-4">Bienvenido al Gestor de Turnos</h1>
        <p className="lead">Tu solución integral para la gestión de citas y reservas.</p>
        <div className="mt-4">
          <Link href="/turnos" className="btn btn-primary btn-lg me-3">Ver Turnos</Link>
          <Link href="/clientes" className="btn btn-outline-secondary btn-lg">Gestionar Clientes</Link>
        </div>
      </div>

      <footer className="bg-light text-center text-lg-start mt-auto py-3">
        <div className="container">
          <p className="text-center mb-0">&copy; 2025 Gestor de Turnos. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
