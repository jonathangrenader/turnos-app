
'use client';

import React, { useState, useEffect } from 'react';
import { Gasto } from '../models/Gasto';
import { useNotification } from './NotificationContext';

interface GastoFormProps {
  gasto?: Gasto;
  onSave: (gasto: Gasto) => void;
  onCancel: () => void;
}

const GastoForm: React.FC<GastoFormProps> = ({ gasto, onSave, onCancel }) => {
  const [descripcion, setDescripcion] = useState(gasto?.descripcion || '');
  const [monto, setMonto] = useState(gasto?.monto || 0);
  const [fecha, setFecha] = useState(gasto?.fecha || '');
  const [categoria, setCategoria] = useState(gasto?.categoria || '');
  const { showNotification } = useNotification();

  useEffect(() => {
    if (gasto) {
      setDescripcion(gasto.descripcion);
      setMonto(gasto.monto);
      setFecha(gasto.fecha);
      setCategoria(gasto.categoria);
    } else {
      setDescripcion('');
      setMonto(0);
      setFecha('');
      setCategoria('');
    }
  }, [gasto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion || monto <= 0 || !fecha || !categoria) {
      showNotification('Por favor, complete todos los campos y asegúrese de que el monto sea mayor que cero.', 'danger');
      return;
    }

    const newGasto: Gasto = {
      id: gasto?.id || Date.now(),
      descripcion,
      monto: Number(monto),
      fecha,
      categoria,
    };
    onSave(newGasto);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label">Descripción</label>
        <input
          type="text"
          className="form-control"
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="monto" className="form-label">Monto</label>
        <input
          type="number"
          className="form-control"
          id="monto"
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
          required
          step="0.01"
        />
      </div>
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
        <label htmlFor="categoria" className="form-label">Categoría</label>
        <input
          type="text"
          className="form-control"
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary me-2">Guardar</button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default GastoForm;
