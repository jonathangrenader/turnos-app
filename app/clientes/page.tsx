
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Cliente } from '../models/Cliente';
import ClienteForm from '../components/ClienteForm';
import { useNotification } from '../components/NotificationContext';

const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>(undefined);
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

  const fetchClientes = useCallback(async () => {
    try {
      const res = await fetch(`/api/clientes?sortBy=${sortColumn}&sortOrder=${sortDirection}&search=${debouncedSearchTerm}`);
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      setClientes(data);
    } catch (error: any) {
      showNotification(`Error al cargar clientes: ${error.message}`, 'danger');
    }
  }, [sortColumn, sortDirection, debouncedSearchTerm, showNotification]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

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

  const handleSaveCliente = async (cliente: Cliente) => {
    try {
      const method = editingCliente ? 'PUT' : 'POST';
      const res = await fetch('/api/clientes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });

      if (!res.ok) throw new Error('Failed to save client');
      showNotification('Cliente guardado exitosamente!', 'success');
      fetchClientes();
      setShowForm(false);
      setEditingCliente(undefined);
    } catch (error: any) {
      showNotification(`Error al guardar cliente: ${error.message}`, 'danger');
    }
  };

  const handleDeleteCliente = async (id: number) => {
    try {
      const res = await fetch(`/api/clientes?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete client');
      showNotification('Cliente eliminado exitosamente!', 'success');
      fetchClientes();
    } catch (error: any) {
      showNotification(`Error al eliminar cliente: ${error.message}`, 'danger');
    }
  };

  const handleEditCliente = async (cliente: Cliente) => {
    try {
      const res = await fetch(`/api/clientes?id=${cliente.id}`);
      if (!res.ok) throw new Error('Failed to fetch client details');
      const clientWithTurns = await res.json();
      setEditingCliente(clientWithTurns);
      setShowForm(true);
    } catch (error: any) {
      showNotification(`Error al cargar detalles del cliente: ${error.message}`, 'danger');
    }
  };

  const handleNewCliente = () => {
    setEditingCliente(undefined);
    setShowForm(true);
  };

  return (
    <div className="container py-4">
      <h1>Clientes</h1>

      {!showForm && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-primary" onClick={handleNewCliente}>
            Agregar Cliente
          </button>
          <input
            type="text"
            className="form-control w-25"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      )}

      {showForm && (
        <ClienteForm
          cliente={editingCliente}
          onSave={handleSaveCliente}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingCliente && showForm && (
        <div className="mt-4 card p-3">
          <h4 className="card-title">Historial de Turnos</h4>
          {editingCliente.turnos && editingCliente.turnos.length > 0 ? (
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Servicio</th>
                  <th>Empleado</th>
                </tr>
              </thead>
              <tbody>
                {editingCliente.turnos.map(turno => (
                  <tr key={turno.id}>
                    <td>{turno.fecha}</td>
                    <td>{turno.hora}</td>
                    <td>{turno.servicio?.nombre}</td>
                    <td>{turno.empleado?.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay turnos registrados para este cliente.</p>
          )}
        </div>
      )}

      {!showForm && (
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID</th>
              <th onClick={() => handleSort('nombre')}>Nombre</th>
              <th onClick={() => handleSort('telefono')}>Teléfono</th>
              <th onClick={() => handleSort('email')}>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.email}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditCliente(cliente)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteCliente(cliente.id)}
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

export default ClientesPage;
