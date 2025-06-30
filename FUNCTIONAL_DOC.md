# Documentación Funcional - Aplicación de Gestión de Turnos

Este documento describe las funcionalidades de la aplicación de gestión de turnos desde la perspectiva del usuario final y del administrador del negocio. El objetivo es proporcionar una comprensión clara de lo que la aplicación puede hacer y cómo interactuar con ella.

## 1. Visión General de la Aplicación

La aplicación "Gestor de Turnos" es una herramienta web diseñada para facilitar la administración de citas y reservas en negocios de servicios como barberías, salones de belleza, estudios de uñas, etc. Permite a los administradores gestionar clientes, servicios, empleados y, fundamentalmente, los turnos, incluyendo un cálculo básico de comisiones para los empleados.

## 2. Módulos y Funcionalidades

La aplicación se estructura en los siguientes módulos principales, accesibles a través de la barra de navegación:

### 2.0. Autenticación y Roles de Usuario

*   **Propósito:** Proporcionar un sistema seguro de acceso a la aplicación, diferenciando los permisos según el rol del usuario.
*   **Funcionalidades:**
    *   **Inicio de Sesión:** Los usuarios pueden iniciar sesión con sus credenciales (email y contraseña).
    *   **Roles:** Los usuarios pueden tener diferentes roles (ej. `USER`, `ADMIN`, `SUPERADMIN`), que determinan las funcionalidades a las que tienen acceso.
    *   **Protección de Rutas:** Las rutas de la aplicación están protegidas, requiriendo autenticación para acceder a la mayoría de ellas. Algunas rutas están restringidas a roles específicos (ej. `SUPERADMIN` para la configuración).
    *   **Cerrar Sesión:** Opción para cerrar la sesión activa.

### 2.1. Inicio (Página Principal)

*   **Propósito:** Punto de entrada a la aplicación, ofreciendo una bienvenida y enlaces rápidos a las secciones principales.
*   **Funcionalidades:**
    *   Mensaje de bienvenida.
    *   Enlaces directos a "Turnos" y "Clientes".

### 2.2. Turnos

*   **Propósito:** Gestión centralizada de todas las citas programadas.
*   **Funcionalidades:**
    *   **Visualización de Turnos:** Los turnos se muestran en un calendario interactivo (vista semanal por defecto, con opciones para vista diaria y mensual).
    *   **Creación de Turnos:**
        *   Se puede agregar un nuevo turno haciendo clic en el botón "Agregar Turno" o seleccionando una fecha/hora directamente en el calendario.
        *   Formulario para ingresar:
            *   Fecha y Hora.
            *   Cliente (selección de una lista existente).
            *   Servicio (selección de una lista existente).
            *   Empleado (selección de una lista existente).
        *   **Validación de Disponibilidad:** El sistema verifica que el empleado seleccionado no tenga otro turno superpuesto y que el turno esté dentro de su horario de trabajo definido.
    *   **Edición de Turnos:** Hacer clic en un turno existente en el calendario abre el formulario de edición, permitiendo modificar sus detalles.
    *   **Eliminación de Turnos:** Opción para eliminar un turno existente desde el formulario de edición.
    *   **Búsqueda, Filtrado y Ordenamiento:**
        *   Campo de búsqueda general para encontrar turnos por nombre de cliente, servicio, empleado, fecha u hora.
        *   Filtro por empleado para ver los turnos de un empleado específico.
        *   Las tablas permiten ordenar los datos por columna (ascendente/descendente) haciendo clic en los encabezados de las columnas.

### 2.3. Clientes

*   **Propósito:** Gestión de la base de datos de clientes.
*   **Funcionalidades:**
    *   **Listado de Clientes:** Muestra una tabla con todos los clientes registrados (ID, Nombre, Teléfono, Email). Las columnas son ordenables y se puede buscar por nombre, teléfono o email.
    *   **Creación de Clientes:** Formulario para añadir nuevos clientes (Nombre, Teléfono, Email).
    *   **Edición de Clientes:** Permite modificar la información de un cliente existente.
    *   **Eliminación de Clientes:** Opción para eliminar un cliente de la lista.
    *   **Historial de Turnos:** Al editar un cliente, se muestra una sección con todos los turnos asociados a ese cliente, incluyendo fecha, hora, servicio y empleado.

### 2.4. Servicios

*   **Propósito:** Gestión de los servicios ofrecidos por el negocio.
*   **Funcionalidades:**
    *   **Listado de Servicios:** Muestra una tabla con los servicios (ID, Nombre, Duración, Precio, Porcentaje de Comisión). Las columnas son ordenables y se puede buscar por nombre.
    *   **Creación de Servicios:** Formulario para añadir nuevos servicios (Nombre, Duración en minutos, Precio, Porcentaje de Comisión).
    *   **Edición de Servicios:** Permite modificar los detalles de un servicio existente.
    *   **Eliminación de Servicios:** Opción para eliminar un servicio de la lista.

### 2.5. Empleados

*   **Propósito:** Gestión de los empleados o asociados del negocio.
*   **Funcionalidades:**
    *   **Listado de Empleados:** Muestra una tabla con los empleados (ID, Nombre, Horario de Inicio, Horario de Fin). Las columnas son ordenables y se puede buscar por nombre.
    *   **Creación de Empleados:** Formulario para añadir nuevos empleados (Nombre, Horario de Inicio, Horario de Fin).
    *   **Edición de Empleados:** Permite modificar la información de un empleado existente, incluyendo sus horarios de trabajo.
    *   **Eliminación de Empleados:** Opción para eliminar un empleado de la lista.

### 2.6. Gastos

*   **Propósito:** Registro y gestión de los gastos operativos del negocio.
*   **Funcionalidades:**
    *   **Listado de Gastos:** Muestra una tabla con todos los gastos registrados (ID, Descripción, Monto, Fecha, Categoría). Las columnas son ordenables y se puede buscar por descripción o categoría.
    *   **Creación de Gastos:** Formulario para añadir nuevos gastos (Descripción, Monto, Fecha, Categoría).
    *   **Edición de Gastos:** Permite modificar los detalles de un gasto existente.
    *   **Eliminación de Gastos:** Opción para eliminar un gasto de la lista.

### 2.7. Comisiones

*   **Propósito:** Cálculo y visualización de las comisiones generadas por los empleados.
*   **Funcionalidades:**
    *   **Cálculo de Comisiones:** Calcula la comisión total para cada empleado basándose en los servicios que han realizado y el porcentaje de comisión configurado para cada servicio.
    *   **Visualización:** Muestra una tabla con el nombre del empleado y su comisión total calculada.

### 2.8. Reportes (Flujo de Caja)

*   **Propósito:** Proporcionar una visión general del rendimiento financiero del negocio.
*   **Funcionalidades:**
    *   **Filtro por Fecha:** Permite seleccionar un rango de fechas para el reporte.
    *   **Resumen del Flujo de Caja:** Muestra los ingresos totales, gastos totales y el ingreso neto (ingresos - gastos) para el período seleccionado.
    *   **Ingresos por Servicio:** Desglose de los ingresos generados por cada tipo de servicio.
    *   **Ingresos por Empleado:** Desglose de los ingresos generados por cada empleado.
    *   **Gastos por Categoría:** Desglose de los gastos por diferentes categorías (ej. alquiler, servicios, insumos, marketing, sueldos).

### 2.9. Configuración del Negocio

*   **Propósito:** Permitir al administrador configurar la información básica del negocio.
*   **Funcionalidades:**
    *   Formulario para editar el nombre del negocio, dirección, teléfono, email de contacto, horario de apertura y horario de cierre.

## 3. Notificaciones

*   **Propósito:** Informar al usuario sobre el éxito o fracaso de las operaciones realizadas.
*   **Funcionalidades:**
    *   Mensajes emergentes (toasts) que aparecen en la parte superior de la pantalla para confirmar acciones (ej. "Cliente guardado exitosamente!") o alertar sobre errores (ej. "Error al guardar turno: ...").
    *   Las notificaciones desaparecen automáticamente después de unos segundos o pueden ser cerradas manualmente.

## 4. Consideraciones Futuras (Roadmap)

Para funcionalidades más avanzadas como reportes detallados, integración con calendarios externos o sistemas de pago, se recomienda consultar el documento `ROADMAP.md`.
