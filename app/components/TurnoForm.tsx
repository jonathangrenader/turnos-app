
import React, { useState, useEffect } from 'react';
import { Turno } from '../models/Turno';
import { Cliente } from '../models/Cliente';
import { Servicio } from '../models/Servicio';
import { Empleado } from '../models/Empleado';
import { useNotification } from './NotificationContext';

interface TurnoFormProps {
  turno?: Turno;
  clientes: Cliente[];
  servicios: Servicio[];
  empleados: Empleado[];
  existingTurnos: Turno[]; // Add this prop
  onSave: (turno: Turno) => void;
  onCancel: () => void;
}

const TurnoForm: React.FC<TurnoFormProps> = ({ turno, clientes, servicios, empleados, existingTurnos, onSave, onCancel }) => {
  const [fecha, setFecha] = useState(turno?.fecha || '');
  const [hora, setHora] = useState(turno?.hora || '');
  const [clienteId, setClienteId] = useState(turno?.clienteId || '');
  const [servicioId, setServicioId] = useState(turno?.servicioId || '');
  const [empleadoId, setEmpleadoId] = useState(turno?.empleadoId || '');
  const { showNotification } = useNotification();

  useEffect(() => {
    if (turno) {
      setFecha(turno.fecha);
      setHora(turno.hora);
      setClienteId(turno.clienteId);
      setServicioId(turno.servicioId);
      setEmpleadoId(turno.empleadoId);
    } else {
      setFecha('');
      setHora('');
      setClienteId('');
      setServicioId('');
      setEmpleadoId('');
    }
  }, [turno]);

  const validateTurno = (newTurno: Turno): boolean => {
    const selectedServicio = servicios.find(s => s.id === newTurno.servicioId);
    if (!selectedServicio) {
      showNotification('Servicio no encontrado.', 'danger');
      return false;
    }

    const newTurnoStart = new Date(`${newTurno.fecha}T${newTurno.hora}:00`);
    const newTurnoEnd = new Date(newTurnoStart.getTime() + selectedServicio.duracion * 60 * 1000);

    const selectedEmpleado = empleados.find(e => e.id === newTurno.empleadoId);
    if (selectedEmpleado && selectedEmpleado.horarios) {
      const dayOfWeek = new Date(newTurno.fecha).toLocaleDateString('es-ES', { weekday: 'long' });
      const horarioDelDia = selectedEmpleado.horarios.find(h => h.diaSemana.toLowerCase() === dayOfWeek.toLowerCase());

      if (!horarioDelDia) {
        showNotification(`El empleado no tiene horario de trabajo definido para el día ${dayOfWeek}.`, 'danger');
        return false;
      }

      const [startHour, startMinute] = horarioDelDia.horaInicio.split(':').map(Number);
      const [endHour, endMinute] = horarioDelDia.horaFin.split(':').map(Number);

      const employeeWorkStart = new Date(newTurnoStart);
      employeeWorkStart.setHours(startHour, startMinute, 0, 0);

      const employeeWorkEnd = new Date(newTurnoStart);
      employeeWorkEnd.setHours(endHour, endMinute, 0, 0);

      if (newTurnoStart < employeeWorkStart || newTurnoEnd > employeeWorkEnd) {
        showNotification(`El turno está fuera del horario de trabajo del empleado (${horarioDelDia.horaInicio} - ${horarioDelDia.horaFin}) para el día ${dayOfWeek}.`, 'danger');
        return false;
      }
    }

    for (const existingTurno of existingTurnos) {
      // Skip validation for the current turno being edited
      if (turno && existingTurno.id === turno.id) {
        continue;
      }

      if (existingTurno.empleadoId === newTurno.empleadoId) {
        const existingServicio = servicios.find(s => s.id === existingTurno.servicioId);
        if (!existingServicio) continue; // Should not happen if data is consistent

        const existingTurnoStart = new Date(`${existingTurno.fecha}T${existingTurno.hora}:00`);
        const existingTurnoEnd = new Date(existingTurnoStart.getTime() + existingServicio.duracion * 60 * 1000);

        // Check for overlap
        if (
          (newTurnoStart < existingTurnoEnd && newTurnoEnd > existingTurnoStart)
        ) {
          showNotification(`El empleado ya tiene un turno programado que se superpone con este horario (${existingTurno.fecha} ${existingTurno.hora}).`, 'danger');
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTurno: Turno = {
      id: turno?.id || Date.now(),
      fecha,
      hora,
      clienteId: Number(clienteId),
      servicioId: Number(servicioId),
      empleadoId: Number(empleadoId),
    };

    if (!validateTurno(newTurno)) {
      return;
    }

    onSave(newTurno);
    showNotification('Turno guardado exitosamente!', 'success');

    // Send notification to employee
    const selectedCliente = clientes.find(c => c.id === Number(clienteId));
    const selectedServicio = servicios.find(s => s.id === Number(servicioId));
    const selectedEmpleado = empleados.find(e => e.id === Number(empleadoId));

    if (selectedEmpleado && selectedCliente && selectedServicio) {
      const notificationMessage = `Nuevo turno asignado: ${selectedCliente.nombre} - ${selectedServicio.nombre} el ${fecha} a las ${hora}.`;
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: selectedEmpleado.id,
            message: notificationMessage,
          }),
        });
      } catch (error) {
        console.error('Error sending notification:', error);
        showNotification('Error al enviar notificación al empleado.', 'warning');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label htmlFor="fecha" className="form-label">Fecha</label>
        <input
          type="date"
          className="form-control"
          id="fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="hora" className="form-label">Hora</label>
        <input
          type="time"
          className="form-control"
          id="hora"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="cliente" className="form-label">Cliente</label>
        <select
          className="form-select"
          id="cliente"
          value={clienteId}
          onChange={(e) => setClienteId(Number(e.target.value))}
          required
        >
          <option value="">Seleccione un cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="servicio" className="form-label">Servicio</label>
        <select
          className="form-select"
          id="servicio"
          value={servicioId}
          onChange={(e) => setServicioId(Number(e.target.value))}
          required
        >
          <option value="">Seleccione un servicio</option>
          {servicios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="empleado" className="form-label">Empleado</label>
        <select
          className="form-select"
          id="empleado"
          value={empleadoId}
          onChange={(e) => setEmpleadoId(Number(e.target.value))}
          required
        >
          <option value="">Seleccione un empleado</option>
          {empleados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary me-2">Guardar</button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default TurnoForm;
