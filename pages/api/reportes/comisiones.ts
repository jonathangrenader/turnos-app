import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    // Fetch turns within the date range, including related service and employee data
    const turnos = await prisma.turno.findMany({
      where: {
        fecha: {
          gte: startDate as string,
          lte: endDate as string,
        },
      },
      include: {
        servicio: {
          include: {
            comisiones: true, // Include custom commissions for the service
          },
        },
        empleado: true,
      },
    });

    const comisionesPorEmpleado: { [key: number]: { nombreEmpleado: string; totalComision: number; detalles: any[] } } = {};

    for (const turno of turnos) {
      const servicio = turno.servicio;
      const empleado = turno.empleado;

      if (!servicio || !empleado) continue; // Should not happen if data is consistent

      let comisionAplicable = servicio.comisionPorcentaje || 0; // Default to service's commission

      // Check for custom commission for this employee and service
      const customComision = servicio.comisiones.find(
        (c) => c.empleadoId === empleado.id
      );

      if (customComision) {
        comisionAplicable = customComision.porcentajeComision;
      }

      const montoComision = servicio.precio * comisionAplicable;

      if (!comisionesPorEmpleado[empleado.id]) {
        comisionesPorEmpleado[empleado.id] = {
          nombreEmpleado: empleado.nombre,
          totalComision: 0,
          detalles: [],
        };
      }

      comisionesPorEmpleado[empleado.id].totalComision += montoComision;
      comisionesPorEmpleado[empleado.id].detalles.push({
        turnoId: turno.id,
        fecha: turno.fecha,
        hora: turno.hora,
        servicio: servicio.nombre,
        precioServicio: servicio.precio,
        porcentajeComision: comisionAplicable,
        montoComision: montoComision,
      });
    }

    res.status(200).json(Object.values(comisionesPorEmpleado));
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}