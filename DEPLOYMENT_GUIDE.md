# Guía de Despliegue para `turnos-app` (Next.js + Prisma)

Esta guía te ayudará a desplegar tu aplicación `turnos-app` (Next.js) en Vercel y a configurar tu base de datos (Prisma) utilizando un servicio gratuito.

## 1. Despliegue de la Aplicación Next.js en Vercel

Vercel es la plataforma recomendada para desplegar aplicaciones Next.js debido a su optimización y facilidad de uso.

### Prerrequisitos:

*   Tu proyecto `turnos-app` debe estar subido a un repositorio de Git (GitHub, GitLab o Bitbucket).

### Pasos:

1.  **Crea una cuenta o inicia sesión en Vercel:**
    *   Ve a [vercel.com](https://vercel.com/).
    *   Puedes registrarte o iniciar sesión usando tu cuenta de GitHub, GitLab o Bitbucket, lo cual simplificará la importación de tu repositorio.

2.  **Importa tu Repositorio Git:**
    *   Una vez que hayas iniciado sesión, haz clic en "Add New..." y luego en "Project".
    *   Selecciona "Import Git Repository".
    *   Busca y selecciona el repositorio de tu proyecto `turnos-app`.

3.  **Configura el Proyecto:**
    *   Vercel debería detectar automáticamente que es un proyecto Next.js.
    *   **Root Directory:** Asegúrate de que el "Root Directory" esté configurado correctamente. Si tu proyecto Next.js está en la raíz de tu repositorio, déjalo vacío. Si está dentro de una subcarpeta (como `turnos-app` en tu caso), asegúrate de que el campo "Root Directory" apunte a `turnos-app`.
    *   **Build and Output Settings:** Generalmente, no necesitas cambiar nada aquí, Vercel configurará los comandos de `build` y `start` por defecto para Next.js.

4.  **Configura las Variables de Entorno (Inicial):**
    *   Antes del primer despliegue, necesitarás configurar la variable de entorno `DATABASE_URL` para tu base de datos. Por ahora, puedes dejarla vacía o poner un valor temporal si no tienes la URL de tu base de datos lista. La configuraremos correctamente en la siguiente sección.
    *   Haz clic en "Deploy".

5.  **Primer Despliegue:**
    *   Vercel comenzará a construir y desplegar tu aplicación. Esto puede tardar unos minutos.
    *   Una vez completado, verás un mensaje de éxito y un enlace a tu aplicación desplegada.

## 2. Configuración de la Base de Datos (Prisma)

Tu aplicación Next.js utiliza Prisma, lo que significa que necesita una base de datos. Aquí te presento dos opciones populares y gratuitas para PostgreSQL, que es comúnmente usada con Prisma.

### Opción A: Supabase (Recomendado para empezar)

Supabase ofrece una base de datos PostgreSQL gratuita y muchas otras herramientas de backend.

1.  **Crea una cuenta o inicia sesión en Supabase:**
    *   Ve a [supabase.com](https://supabase.com/).
    *   Regístrate o inicia sesión.

2.  **Crea un nuevo proyecto:**
    *   Haz clic en "New project".
    *   Elige una organización, un nombre para tu proyecto, una contraseña segura para la base de datos y la región más cercana a tus usuarios.
    *   Haz clic en "Create new project".

3.  **Obtén la URL de Conexión de la Base de Datos:**
    *   Una vez que tu proyecto esté listo, ve a "Project Settings" (icono de engranaje) -> "Database" -> "Connection String".
    *   Copia la "Connection string" (normalmente la que empieza con `postgresql://`). Asegúrate de reemplazar `[YOUR_PASSWORD]` con la contraseña que estableciste al crear el proyecto.

### Opción B: Neon

Neon ofrece PostgreSQL serverless con una capa gratuita generosa.

1.  **Crea una cuenta o inicia sesión en Neon:**
    *   Ve a [neon.tech](https://neon.tech/).
    *   Regístrate o inicia sesión.

2.  **Crea un nuevo proyecto:**
    *   Sigue los pasos para crear un nuevo proyecto y una base de datos.

3.  **Obtén la URL de Conexión de la Base de Datos:**
    *   En el dashboard de tu proyecto, encontrarás la "Connection String" para tu base de datos.

### Configura `DATABASE_URL` en Vercel:

1.  **Ve a la configuración de tu proyecto en Vercel:**
    *   En tu dashboard de Vercel, selecciona tu proyecto `turnos-app`.
    *   Ve a "Settings" -> "Environment Variables".

2.  **Añade la variable `DATABASE_URL`:**
    *   Haz clic en "Add New".
    *   **Name:** `DATABASE_URL`
    *   **Value:** Pega la URL de conexión que obtuviste de Supabase o Neon.
    *   **Environments:** Selecciona "Production", "Preview" y "Development" (o los que necesites).
    *   Haz clic en "Add".

### Ejecuta las Migraciones de Prisma en Vercel:

Para que tu base de datos tenga el esquema correcto, necesitas ejecutar las migraciones de Prisma en el entorno de Vercel.

1.  **Modifica el "Build Command" en Vercel:**
    *   En la configuración de tu proyecto en Vercel, ve a "Settings" -> "General".
    *   Busca la sección "Build & Development Settings".
    *   En "Build Command", cambia el comando por defecto a:
        ```bash
        npx prisma migrate deploy && next build
        ```
        *Explicación:* `npx prisma migrate deploy` aplica todas las migraciones pendientes a tu base de datos. `&& next build` asegura que tu aplicación Next.js se construya después de que las migraciones se hayan aplicado.

2.  **Redespliega tu aplicación:**
    *   Después de guardar los cambios en el "Build Command", Vercel te pedirá que redespliegues tu aplicación. Haz clic en "Redeploy".
    *   Esto ejecutará las migraciones y luego construirá tu aplicación.

## 3. Pasos Adicionales y Solución de Problemas

*   **`DATABASE_URL` Local vs. Producción:** Recuerda que la `DATABASE_URL` en tu archivo `.env.local` es para tu entorno de desarrollo local. La variable de entorno en Vercel es para tu entorno de producción/despliegue.
*   **Errores de Despliegue:** Si el despliegue falla, revisa los logs de Vercel. Los errores comunes incluyen problemas con la `DATABASE_URL`, fallos en las migraciones de Prisma o errores de código en tu aplicación.
*   **Dominios Personalizados:** Una vez que tu aplicación esté funcionando, puedes configurar un dominio personalizado en Vercel en la sección "Settings" -> "Domains".

¡Listo! Con estos pasos, tu aplicación `turnos-app` debería estar desplegada y conectada a tu base de datos en un servidor real. Si tienes alguna duda en cualquiera de los pasos, no dudes en preguntar.