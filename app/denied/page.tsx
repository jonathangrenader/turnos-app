
import Link from 'next/link';

export default function Denied() {
  return (
    <div className="container py-4 text-center">
      <h1 className="display-4">Acceso Denegado</h1>
      <p className="lead">No tienes permiso para acceder a esta página.</p>
      <Link href="/" className="btn btn-primary">Volver al Inicio</Link>
    </div>
  );
}
