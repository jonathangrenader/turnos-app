
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/configuracion") && req.nextauth.token?.role !== "SUPERADMIN") {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = { 
  matcher: [
    "/clientes", 
    "/comisiones", 
    "/configuracion", 
    "/empleados", 
    "/gastos", 
    "/servicios", 
    "/turnos"
  ]
};
