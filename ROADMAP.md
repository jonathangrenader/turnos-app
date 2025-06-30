# Roadmap - Aplicación de Gestión de Turnos

Este documento describe las funcionalidades clave y el plan de desarrollo para la aplicación de gestión de turnos, diseñada para negocios de estética, barberías, etc.

## Fases del Desarrollo

### Fase 1: Funcionalidad Básica (MVP - Producto Mínimo Viable)

-   **Gestión de Turnos:**
    -   Visualización de turnos (calendario/lista).
    -   Creación, edición y eliminación de turnos.
    -   Asignación de turnos a clientes, servicios y empleados.
    -   Validación básica de disponibilidad (ej. no solapar turnos del mismo empleado).
-   **Gestión de Clientes:**
    -   Listado de clientes.
    -   Creación, edición y eliminación de clientes.
    -   Información básica del cliente (nombre, contacto).
-   **Gestión de Servicios:**
    -   Listado de servicios.
    -   Creación, edición y eliminación de servicios.
    -   Detalles del servicio (nombre, duración, precio).
-   **Gestión de Empleados/Asociados:**
    -   Listado de empleados.
    -   Creación, edición y eliminación de empleados.
    -   Información básica del empleado (nombre).
-   **Cálculo Básico de Comisiones:**
    -   Visualización de comisiones por empleado (basado en un porcentaje fijo del servicio).

### Fase 2: Mejoras y Funcionalidades Adicionales

-   **Interfaz de Usuario (UI/UX):**
    -   **[COMPLETADO]** Diseño responsivo y atractivo.
    -   **[COMPLETADO]** Mejora de formularios de creación/edición.
    -   **[COMPLETADO]** Componentes de calendario interactivos para la gestión de turnos.
-   **Búsqueda, Filtrado y Ordenamiento:**
    -   **[COMPLETADO]** Funcionalidad de búsqueda en listas (turnos, clientes, servicios).
    -   **[COMPLETADO]** Filtros por fecha, empleado, cliente, servicio en la vista de turnos.
    -   **[COMPLETADO]** Ordenamiento de listas.
-   **Notificaciones:**
    -   Recordatorios de turnos para clientes (ej. por email/SMS - requiere integración externa).
    -   **[COMPLETADO]** Notificaciones internas para empleados sobre nuevos turnos.
-   **Gestión de Disponibilidad:**
    -   **[COMPLETADO]** Definición de horarios de trabajo por empleado.
    -   **[COMPLETADO]** Bloqueo de horarios no disponibles.
-   **Comisiones Avanzadas:**
    -   **[COMPLETADO]** Configuración de diferentes porcentajes de comisión por servicio o por empleado.
    -   **[COMPLETADO]** Reportes detallados de comisiones por período.

### Fase 3: Escalabilidad y Funcionalidades Avanzadas

-   **[COMPLETADO]** **Autenticación y Roles de Usuario:**
    -   Registro e inicio de sesión para dueños y empleados.
    -   Roles de usuario (Administrador, Empleado) con diferentes permisos.
-   **[COMPLETADO]** **Reportes y Estadísticas:**
    -   **[COMPLETADO]** Reportes de ingresos por servicio, empleado, período.
    -   **[COMPLETADO]** Estadísticas de ocupación.
    -   **[COMPLETADO]** Historial de turnos por cliente.
-   **Integraciones:**
    -   Integración con sistemas de pago.
    -   Integración con calendarios externos (Google Calendar, Outlook).
-   **[COMPLETADO]** **Configuración del Negocio:**
    -   Gestión de la información del negocio (nombre, dirección, contacto).
    -   Configuración de horarios de apertura/cierre del negocio.
-   **[COMPLETADO]** **Base de Datos Real:**
    -   Migración de datos de ejemplo a una base de datos persistente (ej. PostgreSQL, MongoDB, Firebase).
    -   Implementación de una API RESTful para la gestión de datos.

## Próximos Pasos Sugeridos

### Integraciones Externas Pendientes

Las siguientes integraciones requieren configuración de servicios de terceros y manejo de credenciales sensibles. Se recomienda abordarlas en una fase posterior, con especial atención a la seguridad y la gestión de claves API.

1.  **Recordatorios de Turnos para Clientes (Email/SMS):**
    *   **Descripción:** Implementar el envío automático de recordatorios de turnos a los clientes a través de correo electrónico o SMS.
    *   **Consideraciones:**
        *   **Proveedor:** Elegir un proveedor de servicios de SMS (ej. Twilio) o Email (ej. SendGrid, Mailgun).
        *   **API:** Crear un endpoint API seguro para interactuar con el proveedor.
        *   **Programación:** Configurar un sistema de "cron job" o funciones serverless para enviar recordatorios en momentos específicos.
        *   **Seguridad:** Almacenar credenciales de forma segura (variables de entorno).
        *   **UX:** Permitir a los clientes optar por recibir o no recordatorios.

2.  **Integración con Sistemas de Pago:**
    *   **Descripción:** Permitir a los clientes realizar pagos por servicios directamente a través de la aplicación.
    *   **Consideraciones:**
        *   **Proveedor:** Elegir un proveedor de pagos (ej. Stripe, PayPal, Mercado Pago).
        *   **API:** Integrar las librerías del proveedor en el frontend y backend.
        *   **Seguridad:** Cumplir con PCI DSS, nunca almacenar información sensible de tarjetas.
        *   **Webhooks:** Configurar webhooks para recibir notificaciones de estado de pago.

3.  **Integración con Calendarios Externos (Google Calendar, Outlook):**
    *   **Descripción:** Sincronizar los turnos de la aplicación con los calendarios personales de empleados o clientes.
    *   **Consideraciones:**
        *   **Proveedor:** Utilizar Google Calendar API o Microsoft Graph API.
        *   **OAuth 2.0:** Implementar un flujo de autenticación seguro para que los usuarios autoricen el acceso a sus calendarios.
        *   **Sincronización:** Crear, actualizar y eliminar eventos en el calendario externo cuando los turnos cambien en la aplicación.
        *   **Manejo de Tokens:** Almacenar y refrescar tokens de acceso de forma segura.
        *   **Zonas Horarias:** Manejar correctamente las diferencias de zonas horarias.

---

**Estado Actual del Proyecto:**

Todas las funcionalidades de la Fase 1, Fase 2 y la mayoría de la Fase 3 (excluyendo las integraciones externas que requieren servicios de terceros) han sido implementadas. El proyecto cuenta con gestión de turnos, clientes, servicios, empleados, comisiones avanzadas, reportes, gestión de disponibilidad, notificaciones internas, autenticación y roles de usuario, y configuración del negocio. La persistencia de datos se maneja con Prisma y una base de datos SQLite (fácilmente adaptable a otras bases de datos relacionales).

---

¿Hay algo más en lo que pueda ayudarte?