# Gestor de Turnos

Esta es una aplicación web para la gestión de turnos, diseñada para negocios de servicios como barberías, salones de belleza, estudios de uñas, etc.

## Funcionalidades Clave:

-   **Gestión de Turnos:** Creación, edición, eliminación y visualización de turnos.
-   **Gestión de Clientes:** Administración de la base de datos de clientes.
-   **Gestión de Servicios:** Configuración de los servicios ofrecidos (nombre, duración, precio, comisión).
-   **Gestión de Empleados:** Registro y administración de empleados.
-   **Gestión de Gastos:** Registro y seguimiento de los gastos operativos.
-   **Cálculo de Comisiones:** Visualización de comisiones por empleado.
-   **Reportes:** Flujo de caja y otras estadísticas.
-   **Autenticación y Roles de Usuario:** Sistema de inicio de sesión con diferentes niveles de acceso (Usuario, Administrador, Superadministrador).
-   **Ordenamiento de Tablas:** Posibilidad de ordenar los datos en las tablas por diferentes columnas.

## Tecnologías Utilizadas:

-   Next.js
-   React
-   TypeScript
-   Prisma (ORM)
-   SQLite (Base de datos de desarrollo)
-   NextAuth.js (Autenticación)
-   Bootstrap (Estilos)

## Cómo Empezar:

1.  **Clonar el repositorio:**
    ```bash
    git clone [URL_DEL_REPOSITORIO]
    cd turnos-app
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    # o
    yarn install
    ```

3.  **Configurar la base de datos:**
    Asegúrate de tener un archivo `.env` en la raíz del proyecto con la variable `DATABASE_URL` configurada. Para desarrollo con SQLite, puedes usar:
    ```
    DATABASE_URL="file:./prisma/dev.db"
    NEXTAUTH_SECRET="TU_SECRETO_PARA_NEXTAUTH"
    ```
    Genera un secreto seguro para `NEXTAUTH_SECRET` (puedes usar `openssl rand -base64 32` en Linux/macOS o una herramienta online).

4.  **Generar el cliente Prisma y migrar la base de datos:**
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```

5.  **Ejecutar la semilla de datos (opcional, para crear un usuario superadministrador):**
    ```bash
    npx prisma db seed
    ```
    Esto creará un usuario `superadmin@example.com` con la contraseña `superadminpassword`.

6.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    # o
    yarn dev
    ```

    Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto:

-   `app/`: Componentes de la interfaz de usuario y páginas de Next.js.
-   `pages/api/`: Rutas de la API para interactuar con la base de datos.
-   `prisma/`: Esquema de la base de datos y archivos de migración.
-   `lib/`: Utilidades y configuraciones (ej. cliente Prisma).
-   `public/`: Archivos estáticos.
-   `types/`: Definiciones de tipos de TypeScript.

## Documentación Adicional:

-   `FUNCTIONAL_DOC.md`: Descripción detallada de las funcionalidades de la aplicación.
-   `ROADMAP.md`: Plan de desarrollo y futuras funcionalidades.
-   `TECHNICAL_DOC.md`: Documentación técnica del proyecto.