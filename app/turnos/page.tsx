
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Turno } from '../models/Turno';
import { Cliente } from '../models/Cliente';
import { Servicio } from '../models/Servicio';
import { Empleado } from '../models/Empleado';
import TurnoForm from '../components/TurnoForm';
import Calendar from '../components/Calendar';
import { useNotification } from '../components/NotificationContext';

const TurnosPage = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [editingTurno, setEditingTurno] = useState<Turno | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmpleadoId, setFilterEmpleadoId] = useState<number | ''>('');
  const [filterClienteId, setFilterClienteId] = useState<number | ''>('');
  const [filterServicioId, setFilterServicioId] = useState<number | ''>('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const { showNotification } = useNotification();

  const fetchData = useCallback(async () => {
    try {
      const [turnosRes, clientesRes, serviciosRes, empleadosRes] = await Promise.all([
        fetch('/api/turnos'),
        fetch('/api/clientes'),
        fetch('/api/servicios'),
        fetch('/api/empleados'),
      ]);

      if (!turnosRes.ok) throw new Error('Failed to fetch turnos');
      if (!clientesRes.ok) throw new Error('Failed to fetch clientes');
      if (!serviciosRes.ok) throw new Error('Failed to fetch servicios');
      if (!empleadosRes.ok) throw new Error('Failed to fetch empleados');

      setTurnos(await turnosRes.json());
      setClientes(await clientesRes.json());
      setServicios(await serviciosRes.json());
      setEmpleados(await empleadosRes.json());
    } catch (error: any) {
      showNotification(`Error al cargar datos: ${error.message}`, 'danger');
    }
  }, [showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveTurno = async (turno: Turno) => {
    try {
      let res;
      if (turno.id && turnos.some(t => t.id === turno.id)) { // Check if turno exists for PUT
        res = await fetch(`/api/turnos`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(turno),
        });
      } else {
        res = await fetch('/api/turnos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(turno),
        });
      }
      if (!res.ok) throw new Error('Failed to save turno');
      showNotification('Turno guardado exitosamente!', 'success');
      fetchData();
      setShowForm(false);
      setEditingTurno(undefined);
    } catch (error: any) {
      showNotification(`Error al guardar turno: ${error.message}`, 'danger');
    }
  };

  const handleDeleteTurno = async (id: number) => {
    try {
      const res = await fetch(`/api/turnos?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete turno');
      showNotification('Turno eliminado exitosamente!', 'success');
      fetchData();
    } catch (error: any) {
      showNotification(`Error al eliminar turno: ${error.message}`, 'danger');
    }
  };

  const handleEditTurno = (turno: Turno) => {
    setEditingTurno(turno);
    setShowForm(true);
  };

  const handleNewTurno = (dateStr?: string, timeStr?: string) => {
    setEditingTurno(dateStr && timeStr ? { id: Date.now(), fecha: dateStr, hora: timeStr, clienteId: 0, servicioId: 0, empleadoId: 0 } : undefined);
    setShowForm(true);
  };

  const filteredTurnos = useMemo(() => {
    let filtered = turnos;

    if (filterEmpleadoId) {
      filtered = filtered.filter(turno => turno.empleadoId === filterEmpleadoId);
    }

    if (filterClienteId) {
      filtered = filtered.filter(turno => turno.clienteId === filterClienteId);
    }

    if (filterServicioId) {
      filtered = filtered.filter(turno => turno.servicioId === filterServicioId);
    }

    if (filterStartDate) {
      filtered = filtered.filter(turno => turno.fecha >= filterStartDate);
    }

    if (filterEndDate) {
      filtered = filtered.filter(turno => turno.fecha <= filterEndDate);
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(turno => {
        const cliente = clientes.find(c => c.id === turno.clienteId);
        const servicio = servicios.find(s => s.id === turno.servicioId);
        const empleado = empleados.find(e => e.id === turno.empleadoId);

        return (
          cliente?.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
          servicio?.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
          empleado?.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
          turno.fecha.includes(lowerCaseSearchTerm) ||
          turno.hora.includes(lowerCaseSearchTerm)
        );
      });
    }

    return filtered;
  }, [turnos, filterEmpleadoId, searchTerm, clientes, servicios, empleados]);

  const handleEventDrop = async (updatedTurno: Turno, oldDate: string, newDate: string) => {
    try {
      const res = await fetch(`/api/turnos`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTurno),
      });
      if (!res.ok) throw new Error('Failed to update turno');
      showNotification('Turno actualizado exitosamente!', 'success');
      fetchData();
    } catch (error: any) {
      showNotification(`Error al actualizar turno: ${error.message}`, 'danger');
      fetchData(); // Revert changes on error
    }
  };

  return (
    <div className="container py-4">
      <h1>Turnos</h1>

      {!showForm && (
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <button className="btn btn-primary" onClick={() => handleNewTurno()}>
            Agregar Turno
          </button>
          <div className="d-flex flex-wrap align-items-center">
            <input
              type="text"
              className="form-control me-2 mb-2"
              placeholder="Buscar turnos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: '1 1 auto' }}
            />
            <select
              className="form-select me-2 mb-2"
              value={filterEmpleadoId}
              onChange={(e) => setFilterEmpleadoId(Number(e.target.value))}
              style={{ flex: '1 1 auto' }}
            >
              <option value="">Todos los Empleados</option>
              {empleados.map(empleado => (
                <option key={empleado.id!} value={empleado.id!}>
                  {empleado.nombre}
                </option>
              ))}
            </select>
            <select
              className="form-select me-2 mb-2"
              value={filterClienteId}
              onChange={(e) => setFilterClienteId(Number(e.target.value))}
              style={{ flex: '1 1 auto' }}
            >
              <option value="">Todos los Clientes</option>
              {clientes.map(cliente => (
                <option key={cliente.id!} value={cliente.id!}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
            <select
              className="form-select me-2 mb-2"
              value={filterServicioId}
              onChange={(e) => setFilterServicioId(Number(e.target.value))}
              style={{ flex: '1 1 auto' }}
            >
              <option value="">Todos los Servicios</option>
              {servicios.map(servicio => (
                <option key={servicio.id!} value={servicio.id!}>
                  {servicio.nombre}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="form-control me-2 mb-2"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              style={{ flex: '1 1 auto' }}
            />
            <input
              type="date"
              className="form-control mb-2"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              style={{ flex: '1 1 auto' }}
            />
          </div>
        </div>
      )}

      {showForm && (
        <TurnoForm
          turno={editingTurno}
          clientes={clientes}
          servicios={servicios}
          empleados={empleados}
          existingTurnos={turnos}
          onSave={handleSaveTurno}
          onCancel={() => setShowForm(false)}
        />
      )}

      {!showForm && (
        <Calendar
          turnos={filteredTurnos}
          clientes={clientes}
          servicios={servicios}
          empleados={empleados}
          onDateClick={(dateStr, timeStr) => handleNewTurno(dateStr, timeStr)}
          onEventClick={(turno) => handleEditTurno(turno)}
          onEventDrop={handleEventDrop}
        />
      )}
    </div>
  );
};

export default TurnosPage;
