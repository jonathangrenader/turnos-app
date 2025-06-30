
'use client';

import React, { useState } from 'react';
import { useNotification } from '../../components/NotificationContext';

interface ComisionReporte {
  nombreEmpleado: string;
  totalComision: number;
  detalles: {
    turnoId: number;
    fecha: string;
    hora: string;
    servicio: string;
    precioServicio: number;
    porcentajeComision: number;
    montoComision: number;
  }[];
}

const ComisionesReportPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reporte, setReporte] = useState<ComisionReporte[] | null>(null);
  const { showNotification } = useNotification();

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      showNotification('Por favor, seleccione una fecha de inicio y una fecha de fin.', 'danger');
      return;
    }

    try {
      const res = await fetch(`/api/reportes/comisiones?startDate=${startDate}&endDate=${endDate}`);
      if (!res.ok) throw new Error('Failed to generate report');
      const data = await res.json();
      setReporte(data);
    } catch (error: any) {
      showNotification(`Error al generar el reporte: ${error.message}`, 'danger');
    }
  };

  return (
    <div className="container py-4">
      <h1>Reporte de Comisiones</h1>

      <div className="mb-3">
        <label htmlFor="startDate" className="form-label">Fecha de Inicio</label>
        <input
          type="date"
          className="form-control"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="endDate" className="form-label">Fecha de Fin</label>
        <input
          type="date"
          className="form-control"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mb-4" onClick={handleGenerateReport}>
        Generar Reporte
      </button>

      {reporte && reporte.length > 0 ? (
        <div>
          {reporte.map((empleadoReporte) => (
            <div key={empleadoReporte.nombreEmpleado} className="card mb-4">
              <div className="card-header">
                <h2>{empleadoReporte.nombreEmpleado}</h2>
                <h4>Total Comisión: ${empleadoReporte.totalComision.toFixed(2)}</h4>
              </div>
              <div className="card-body">
                <h5 className="card-title">Detalles de Comisiones</h5>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Turno ID</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Servicio</th>
                      <th>Precio Servicio</th>
                      <th>% Comisión</th>
                      <th>Monto Comisión</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleadoReporte.detalles.map((detalle) => (
                      <tr key={detalle.turnoId}>
                        <td>{detalle.turnoId}</td>
                        <td>{detalle.fecha}</td>
                        <td>{detalle.hora}</td>
                        <td>{detalle.servicio}</td>
                        <td>${detalle.precioServicio.toFixed(2)}</td>
                        <td>{(detalle.porcentajeComision * 100).toFixed(0)}%</td>
                        <td>${detalle.montoComision.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : reporte && reporte.length === 0 ? (
        <p>No se encontraron comisiones para el período seleccionado.</p>
      ) : null}
    </div>
  );
};

export default ComisionesReportPage;
