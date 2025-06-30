
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Empleado } from '../models/Empleado';
import EmpleadoForm from '../components/EmpleadoForm';
import { useNotification } from '../components/NotificationContext';

const EmpleadosPage = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { showNotification } = useNotification();

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const fetchEmpleados = useCallback(async () => {
    try {
      const res = await fetch(`/api/empleados?sortBy=${sortColumn}&sortOrder=${sortDirection}&search=${debouncedSearchTerm}`);
      if (!res.ok) throw new Error('Failed to fetch employees');
      const data = await res.json();
      setEmpleados(data);
    } catch (error: any) {
      showNotification(`Error al cargar empleados: ${error.message}`, 'danger');
    }
  }, [sortColumn, sortDirection, debouncedSearchTerm, showNotification]);

  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveEmpleado = async (empleado: Empleado) => {
    try {
      let res;
      if (empleado.id && empleados.some(e => e.id === empleado.id)) { // Check if employee exists for PUT
        res = await fetch(`/api/empleados`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(empleado),
        });
      } else {
        res = await fetch('/api/empleados', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(empleado),
        });
      }
      if (!res.ok) throw new Error('Failed to save employee');
      showNotification('Empleado guardado exitosamente!', 'success');
      fetchEmpleados();
      setShowForm(false);
      setEditingEmpleado(undefined);
    } catch (error: any) {
      showNotification(`Error al guardar empleado: ${error.message}`, 'danger');
    }
  };

  const handleDeleteEmpleado = async (id: number) => {
    try {
      const res = await fetch(`/api/empleados?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete employee');
      showNotification('Empleado eliminado exitosamente!', 'success');
      fetchEmpleados();
    } catch (error: any) {
      showNotification(`Error al eliminar empleado: ${error.message}`, 'danger');
    }
  };

  const handleEditEmpleado = async (empleado: Empleado) => {
    try {
      const res = await fetch(`/api/empleados?id=${empleado.id}`);
      if (!res.ok) throw new Error('Failed to fetch employee details');
      const employeeWithHorarios = await res.json();
      setEditingEmpleado(employeeWithHorarios);
      setShowForm(true);
    } catch (error: any) {
      showNotification(`Error al cargar detalles del empleado: ${error.message}`, 'danger');
    }
  };

  const handleNewEmpleado = () => {
    setEditingEmpleado(undefined);
    setShowForm(true);
  };

  return (
    <div className="container py-4">
      <h1>Empleados</h1>

      {!showForm && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-primary" onClick={handleNewEmpleado}>
            Agregar Empleado
          </button>
          <input
            type="text"
            className="form-control w-25"
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      )}

      {showForm && (
        <EmpleadoForm
          empleado={editingEmpleado}
          onSave={handleSaveEmpleado}
          onCancel={() => setShowForm(false)}
        />
      )}

      {!showForm && (
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID</th>
              <th onClick={() => handleSort('nombre')}>Nombre</th>
              <th>Horarios</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.id}>
                <td>{empleado.id}</td>
                <td>{empleado.nombre}</td>
                <td>
                  {empleado.horarios && empleado.horarios.length > 0 ? (
                    <ul>
                      {empleado.horarios.map((horario, idx) => (
                        <li key={idx}>{horario.diaSemana}: {horario.horaInicio} - {horario.horaFin}</li>
                      ))}
                    </ul>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditEmpleado(empleado)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteEmpleado(empleado.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmpleadosPage;
