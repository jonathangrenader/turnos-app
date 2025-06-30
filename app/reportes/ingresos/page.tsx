
'use client';

import React, { useState } from 'react';
import { useNotification } from '../../components/NotificationContext';

interface IngresosReporte {
  totalGeneralIngresos: number;
  ingresosPorServicio: {
    nombreServicio: string;
    totalIngresos: number;
    cantidadTurnos: number;
  }[];
  ingresosPorEmpleado: {
    nombreEmpleado: string;
    totalIngresos: number;
    cantidadTurnos: number;
  }[];
}

const IngresosReportPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reporte, setReporte] = useState<IngresosReporte | null>(null);
  const { showNotification } = useNotification();

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      showNotification('Por favor, seleccione una fecha de inicio y una fecha de fin.', 'danger');
      return;
    }

    try {
      const res = await fetch(`/api/reportes/ingresos?startDate=${startDate}&endDate=${endDate}`);
      if (!res.ok) throw new Error('Failed to generate report');
      const data = await res.json();
      setReporte(data);
    } catch (error: any) {
      showNotification(`Error al generar el reporte: ${error.message}`, 'danger');
    }
  };

  return (
    <div className="container py-4">
      <h1>Reporte de Ingresos</h1>

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

      {reporte && (
        <div className="card mb-4">
          <div className="card-header">
            <h2>Resumen General</h2>
            <h4>Total General de Ingresos: ${reporte.totalGeneralIngresos.toFixed(2)}</h4>
          </div>
          <div className="card-body">
            <h5 className="card-title">Ingresos por Servicio</h5>
            {reporte.ingresosPorServicio.length > 0 ? (
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Total Ingresos</th>
                    <th>Cantidad de Turnos</th>
                  </tr>
                </thead>
                <tbody>
                  {reporte.ingresosPorServicio.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombreServicio}</td>
                      <td>${item.totalIngresos.toFixed(2)}</td>
                      <td>{item.cantidadTurnos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay ingresos por servicio para el período seleccionado.</p>
            )}

            <h5 className="card-title mt-4">Ingresos por Empleado</h5>
            {reporte.ingresosPorEmpleado.length > 0 ? (
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Total Ingresos</th>
                    <th>Cantidad de Turnos</th>
                  </tr>
                </thead>
                <tbody>
                  {reporte.ingresosPorEmpleado.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombreEmpleado}</td>
                      <td>${item.totalIngresos.toFixed(2)}</td>
                      <td>{item.cantidadTurnos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay ingresos por empleado para el período seleccionado.</p>
            )}
          </div>
        </div>
      )}

      {reporte && reporte.totalGeneralIngresos === 0 && reporte.ingresosPorServicio.length === 0 && reporte.ingresosPorEmpleado.length === 0 && (
        <p>No se encontraron ingresos para el período seleccionado.</p>
      )}
    </div>
  );
};

export default IngresosReportPage;
