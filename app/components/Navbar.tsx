
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link href="/" className="navbar-brand">
          Gestor de Turnos
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/turnos" className="nav-link">
                Turnos
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/clientes" className="nav-link">
                Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/empleados" className="nav-link">
                Empleados
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/servicios" className="nav-link">
                Servicios
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/comisiones" className="nav-link">
                Comisiones
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/gastos" className="nav-link">
                Gastos
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownReports" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Reportes
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownReports">
                <li>
                  <Link href="/reportes/flujo-caja" className="dropdown-item">
                    Flujo de Caja
                  </Link>
                </li>
                <li>
                  <Link href="/reportes/comisiones" className="dropdown-item">
                    Comisiones
                  </Link>
                </li>
                <li>
                  <Link href="/reportes/ocupacion" className="dropdown-item">
                    Ocupación
                  </Link>
                </li>
              </ul>
            </li>
            {session?.user?.role === 'SUPERADMIN' && (
              <li className="nav-item">
                <Link href="/configuracion" className="nav-link">
                  Configuración
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {session ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-light">Hola, {session.user?.name || session.user?.email}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={() => signOut({
                    callbackUrl: '/auth/signin'
                  })}>
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link href="/auth/signin" className="btn btn-outline-light">
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
