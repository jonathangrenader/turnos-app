

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Servicio } from '../models/Servicio';
import ServicioForm from '../components/ServicioForm';
import { useNotification } from '../components/NotificationContext';

const ServiciosPage = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [editingServicio, setEditingServicio] = useState<Servicio | undefined>(undefined);
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

  const fetchServicios = useCallback(async () => {
    try {
      const res = await fetch(`/api/servicios?sortBy=${sortColumn}&sortOrder=${sortDirection}&search=${debouncedSearchTerm}`);
      if (!res.ok) throw new Error('Failed to fetch services');
      const data = await res.json();
      setServicios(data);
    } catch (error: any) {
      showNotification(`Error al cargar servicios: ${error.message}`, 'danger');
    }
  }, [sortColumn, sortDirection, debouncedSearchTerm, showNotification]);

  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

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

  const handleSaveServicio = async (servicio: Servicio) => {
    try {
      let res;
      if (servicio.id && servicios.some(s => s.id === servicio.id)) { // Check if service exists for PUT
        res = await fetch(`/api/servicios`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(servicio),
        });
      } else {
        res = await fetch('/api/servicios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(servicio),
        });
      }
      if (!res.ok) throw new Error('Failed to save service');
      showNotification('Servicio guardado exitosamente!', 'success');
      fetchServicios();
      setShowForm(false);
      setEditingServicio(undefined);
    } catch (error: any) {
      showNotification(`Error al guardar servicio: ${error.message}`, 'danger');
    }
  };

  const handleDeleteServicio = async (id: number) => {
    try {
      const res = await fetch(`/api/servicios?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete service');
      showNotification('Servicio eliminado exitosamente!', 'success');
      fetchServicios();
    } catch (error: any) {
      showNotification(`Error al eliminar servicio: ${error.message}`, 'danger');
    }
  };

  const handleEditServicio = async (servicio: Servicio) => {
    try {
      const res = await fetch(`/api/servicios?id=${servicio.id}`);
      if (!res.ok) throw new Error('Failed to fetch service details');
      const serviceWithCommissions = await res.json();
      setEditingServicio(serviceWithCommissions);
      setShowForm(true);
    } catch (error: any) {
      showNotification(`Error al cargar detalles del servicio: ${error.message}`, 'danger');
    }
  };

  const handleNewServicio = () => {
    setEditingServicio(undefined);
    setShowForm(true);
  };

  return (
    <div className="container py-4">
      <h1>Servicios</h1>

      {!showForm && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-primary" onClick={handleNewServicio}>
            Agregar Servicio
          </button>
          <input
            type="text"
            className="form-control w-25"
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      )}

      {showForm && (
        <ServicioForm
          servicio={editingServicio}
          onSave={handleSaveServicio}
          onCancel={() => setShowForm(false)}
        />
      )}

      {!showForm && (
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID</th>
              <th onClick={() => handleSort('nombre')}>Nombre</th>
              <th onClick={() => handleSort('duracion')}>Duración (min)</th>
              <th onClick={() => handleSort('precio')}>Precio</th>
              <th>Comisión Predeterminada</th>
              <th>Comisiones Personalizadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((servicio) => (
              <tr key={servicio.id}>
                <td>{servicio.id}</td>
                <td>{servicio.nombre}</td>
                <td>{servicio.duracion}</td>
                <td>{servicio.precio}</td>
                <td>{(servicio.comisionPorcentaje * 100).toFixed(0)}%</td>
                <td>
                  {servicio.comisiones && servicio.comisiones.length > 0 ? (
                    <ul>
                      {servicio.comisiones.map((comision, idx) => (
                        <li key={idx}>Empleado {comision.empleadoId}: {(comision.porcentajeComision * 100).toFixed(0)}%</li>
                      ))}
                    </ul>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditServicio(servicio)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteServicio(servicio.id)}
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

export default ServiciosPage;

