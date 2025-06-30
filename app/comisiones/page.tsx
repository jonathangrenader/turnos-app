
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../components/NotificationContext';
import { Turno } from '../models/Turno';
import { Servicio } from '../models/Servicio';
import { Empleado } from '../models/Empleado';

const ComisionesPage = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const { showNotification } = useNotification();

  const fetchData = useCallback(async () => {
    try {
      const [turnosRes, serviciosRes, empleadosRes] = await Promise.all([
        fetch('/api/turnos'),
        fetch('/api/servicios'),
        fetch('/api/empleados'),
      ]);

      if (!turnosRes.ok) throw new Error('Failed to fetch turnos');
      if (!serviciosRes.ok) throw new Error('Failed to fetch servicios');
      if (!empleadosRes.ok) throw new Error('Failed to fetch empleados');

      setTurnos(await turnosRes.json());
      setServicios(await serviciosRes.json());
      setEmpleados(await empleadosRes.json());
    } catch (error: any) {
      showNotification(`Error al cargar datos: ${error.message}`, 'danger');
    }
  }, [showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calcularComisiones = () => {
    const comisionesPorEmpleado: { [key: number]: number } = {};

    turnos.forEach((turno) => {
      const servicio = servicios.find((s) => s.id === turno.servicioId);
      if (servicio) {
        const comisionRate = servicio.comisionPorcentaje !== undefined ? servicio.comisionPorcentaje : 0.10; // Default to 10% if not set
        if (comisionesPorEmpleado[turno.empleadoId]) {
          comisionesPorEmpleado[turno.empleadoId] += servicio.precio * comisionRate;
        } else {
          comisionesPorEmpleado[turno.empleadoId] = servicio.precio * comisionRate;
        }
      }
    });

    return comisionesPorEmpleado;
  };

  const comisiones = calcularComisiones();

  return (
    <div className="container py-4">
      <h1>Comisiones</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Comisión Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(comisiones).map(([empleadoId, comisionTotal]) => {
            const empleado = empleados.find((e) => e.id === parseInt(empleadoId));
            return (
              <tr key={empleadoId}>
                <td>{empleado?.nombre}</td>
                <td>${comisionTotal.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ComisionesPage;
