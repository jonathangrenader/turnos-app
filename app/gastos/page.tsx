
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Gasto } from '../models/Gasto';
import GastoForm from '../components/GastoForm';
import { useNotification } from '../components/NotificationContext';

const GastosPage = () => {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [editingGasto, setEditingGasto] = useState<Gasto | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [sortColumn, setSortColumn] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const { showNotification } = useNotification();

  const fetchGastos = useCallback(async () => {
    try {
      const res = await fetch(`/api/gastos?sortBy=${sortColumn}&sortOrder=${sortDirection}&search=${searchTerm}`);
      if (!res.ok) throw new Error('Failed to fetch expenses');
      const data = await res.json();
      setGastos(data);
    } catch (error: any) {
      showNotification(`Error al cargar gastos: ${error.message}`, 'danger');
    }
  }, [sortColumn, sortDirection, searchTerm, showNotification]);

  useEffect(() => {
    fetchGastos();
  }, [fetchGastos]);

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

  const handleSaveGasto = async (gasto: Gasto) => {
    try {
      let res;
      if (gasto.id && gastos.some(g => g.id === gasto.id)) {
        res = await fetch(`/api/gastos`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gasto),
        });
      } else {
        res = await fetch('/api/gastos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gasto),
        });
      }
      if (!res.ok) throw new Error('Failed to save expense');
      showNotification('Gasto guardado exitosamente!', 'success');
      fetchGastos();
      setShowForm(false);
      setEditingGasto(undefined);
    } catch (error: any) {
      showNotification(`Error al guardar gasto: ${error.message}`, 'danger');
    }
  };

  const handleDeleteGasto = async (id: number) => {
    try {
      const res = await fetch(`/api/gastos?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete expense');
      showNotification('Gasto eliminado exitosamente!', 'success');
      fetchGastos();
    } catch (error: any) {
      showNotification(`Error al eliminar gasto: ${error.message}`, 'danger');
    }
  };

  const handleEditGasto = (gasto: Gasto) => {
    setEditingGasto(gasto);
    setShowForm(true);
  };

  const handleNewGasto = () => {
    setEditingGasto(undefined);
    setShowForm(true);
  };

  return (
    <div className="container py-4">
      <h1>Gestión de Gastos</h1>

      {!showForm && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-primary" onClick={handleNewGasto}>
            Agregar Gasto
          </button>
          <input
            type="text"
            className="form-control w-25"
            placeholder="Buscar gastos..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      )}

      {showForm && (
        <GastoForm
          gasto={editingGasto}
          onSave={handleSaveGasto}
          onCancel={() => setShowForm(false)}
        />
      )}

      {!showForm && (
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID</th>
              <th onClick={() => handleSort('descripcion')}>Descripción</th>
              <th onClick={() => handleSort('monto')}>Monto</th>
              <th onClick={() => handleSort('fecha')}>Fecha</th>
              <th onClick={() => handleSort('categoria')}>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((gasto) => (
              <tr key={gasto.id}>
                <td>{gasto.id}</td>
                <td>{gasto.descripcion}</td>
                <td>${gasto.monto.toFixed(2)}</td>
                <td>{gasto.fecha}</td>
                <td>{gasto.categoria}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditGasto(gasto)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteGasto(gasto.id)}
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

export default GastosPage;
