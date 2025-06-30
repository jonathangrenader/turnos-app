
'use client';

import React, { useState } from 'react';
import { useNotification } from '../../components/NotificationContext';

interface OcupacionReporte {
  nombreEmpleado: string;
  totalHorasTrabajo: number;
  totalHorasOcupadas: number;
  porcentajeOcupacion: number;
}

const OcupacionReportPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reporte, setReporte] = useState<OcupacionReporte[] | null>(null);
  const { showNotification } = useNotification();

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      showNotification('Por favor, seleccione una fecha de inicio y una fecha de fin.', 'danger');
      return;
    }

    try {
      const res = await fetch(`/api/reportes/ocupacion?startDate=${startDate}&endDate=${endDate}`);
      if (!res.ok) throw new Error('Failed to generate report');
      const data = await res.json();
      setReporte(data);
    } catch (error: any) {
      showNotification(`Error al generar el reporte: ${error.message}`, 'danger');
    }
  };

  return (
    <div className="container py-4">
      <h1>Reporte de Ocupación</h1>

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
        <div className="card mb-4">
          <div className="card-header">
            <h2>Estadísticas de Ocupación por Empleado</h2>
          </div>
          <div className="card-body">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Empleado</th>
                  <th>Horas de Trabajo</th>
                  <th>Horas Ocupadas</th>
                  <th>% Ocupación</th>
                </tr>
              </thead>
              <tbody>
                {reporte.map((empleadoStats, index) => (
                  <tr key={index}>
                    <td>{empleadoStats.nombreEmpleado}</td>
                    <td>{empleadoStats.totalHorasTrabajo.toFixed(2)}</td>
                    <td>{empleadoStats.totalHorasOcupadas.toFixed(2)}</td>
                    <td>{empleadoStats.porcentajeOcupacion.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : reporte && reporte.length === 0 ? (
        <p>No se encontraron datos de ocupación para el período seleccionado.</p>
      ) : null}
    </div>
  );
};

export default OcupacionReportPage;
