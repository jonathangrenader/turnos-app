
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNotification } from '../../../app/components/NotificationContext';
import { Turno } from '../../../app/models/Turno';
import { Servicio } from '../../../app/models/Servicio';
import { Empleado } from '../../../app/models/Empleado';
import { Gasto } from '../../../app/models/Gasto';

const FlujoCajaReportPage = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { showNotification } = useNotification();

  const fetchData = useCallback(async () => {
    try {
      const [turnosRes, serviciosRes, empleadosRes, gastosRes] = await Promise.all([
        fetch('/api/turnos'),
        fetch('/api/servicios'),
        fetch('/api/empleados'),
        fetch('/api/gastos'),
      ]);

      if (!turnosRes.ok) throw new Error('Failed to fetch turnos');
      if (!serviciosRes.ok) throw new Error('Failed to fetch servicios');
      if (!empleadosRes.ok) throw new Error('Failed to fetch empleados');
      if (!gastosRes.ok) throw new Error('Failed to fetch gastos');

      setTurnos(await turnosRes.json());
      setServicios(await serviciosRes.json());
      setEmpleados(await empleadosRes.json());
      setGastos(await gastosRes.json());
    } catch (error: any) {
      showNotification(`Error al cargar datos: ${error.message}`, 'danger');
    }
  }, [showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTurnos = useMemo(() => {
    return turnos.filter(turno => {
      const turnoDate = new Date(turno.fecha);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && turnoDate < start) return false;
      if (end && turnoDate > end) return false;
      return true;
    });
  }, [turnos, startDate, endDate]);

  const filteredGastos = useMemo(() => {
    return gastos.filter(gasto => {
      const gastoDate = new Date(gasto.fecha);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && gastoDate < start) return false;
      if (end && gastoDate > end) return false;
      return true;
    });
  }, [gastos, startDate, endDate]);

  const calculateReports = useMemo(() => {
    let totalIngresos = 0;
    const ingresosPorServicio: { [key: string]: number } = {};
    const ingresosPorEmpleado: { [key: string]: number } = {};

    filteredTurnos.forEach(turno => {
      const servicio = servicios.find(s => s.id === turno.servicioId);
      const empleado = empleados.find(e => e.id === turno.empleadoId);

      if (servicio) {
        totalIngresos += servicio.precio;

        ingresosPorServicio[servicio.nombre] = (ingresosPorServicio[servicio.nombre] || 0) + servicio.precio;

        if (empleado) {
          ingresosPorEmpleado[empleado.nombre] = (ingresosPorEmpleado[empleado.nombre] || 0) + servicio.precio;
        }
      }
    });

    let totalGastos = 0;
    const gastosPorCategoria: { [key: string]: number } = {};

    filteredGastos.forEach(gasto => {
      totalGastos += gasto.monto;
      gastosPorCategoria[gasto.categoria] = (gastosPorCategoria[gasto.categoria] || 0) + gasto.monto;
    });

    const ingresoNeto = totalIngresos - totalGastos;

    return { totalIngresos, ingresosPorServicio, ingresosPorEmpleado, totalGastos, gastosPorCategoria, ingresoNeto };
  }, [filteredTurnos, servicios, empleados, filteredGastos]);

  const { totalIngresos, ingresosPorServicio, ingresosPorEmpleado, totalGastos, gastosPorCategoria, ingresoNeto } = calculateReports;

  return (
    <div className="container py-4">
      <h1>Reporte de Flujo de Caja</h1>

      <div className="mb-4 card p-3">
        <h4 className="card-title">Filtros</h4>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="startDate" className="form-label">Fecha Inicio</label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="endDate" className="form-label">Fecha Fin</label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-4">
          <div className="card p-3">
            <h4 className="card-title">Resumen del Flujo de Caja</h4>
            <p className="fs-5">Ingresos Totales: <span className="text-success">${totalIngresos.toFixed(2)}</span></p>
            <p className="fs-5">Gastos Totales: <span className="text-danger">-${totalGastos.toFixed(2)}</span></p>
            <p className="fs-4">Ingreso Neto: <span className={ingresoNeto >= 0 ? "text-primary" : "text-danger"}>${ingresoNeto.toFixed(2)}</span></p>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <h4 className="card-title">Ingresos por Servicio</h4>
            <ul className="list-group list-group-flush">
              {Object.entries(ingresosPorServicio).map(([nombre, ingresos]) => (
                <li key={nombre} className="list-group-item d-flex justify-content-between align-items-center">
                  {nombre}
                  <span className="badge bg-primary rounded-pill">${ingresos.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <h4 className="card-title">Ingresos por Empleado</h4>
            <ul className="list-group list-group-flush">
              {Object.entries(ingresosPorEmpleado).map(([nombre, ingresos]) => (
                <li key={nombre} className="list-group-item d-flex justify-content-between align-items-center">
                  {nombre}
                  <span className="badge bg-success rounded-pill">${ingresos.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-12 mb-4">
          <div className="card p-3">
            <h4 className="card-title">Gastos por Categoría</h4>
            <ul className="list-group list-group-flush">
              {Object.entries(gastosPorCategoria).map(([categoria, monto]) => (
                <li key={categoria} className="list-group-item d-flex justify-content-between align-items-center">
                  {categoria}
                  <span className="badge bg-danger rounded-pill">-${monto.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlujoCajaReportPage;
