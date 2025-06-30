import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const turnos = await prisma.turno.findMany({
      where: {
        fecha: {
          gte: startDate as string,
          lte: endDate as string,
        },
      },
      include: {
        servicio: true,
        empleado: true,
      },
    });

    const ingresosPorServicio: { [key: number]: { nombreServicio: string; totalIngresos: number; cantidadTurnos: number } } = {};
    const ingresosPorEmpleado: { [key: number]: { nombreEmpleado: string; totalIngresos: number; cantidadTurnos: number } } = {};
    let totalGeneralIngresos = 0;

    for (const turno of turnos) {
      const servicio = turno.servicio;
      const empleado = turno.empleado;

      if (!servicio || !empleado) continue;

      const ingresoTurno = servicio.precio;
      totalGeneralIngresos += ingresoTurno;

      // Ingresos por Servicio
      if (!ingresosPorServicio[servicio.id]) {
        ingresosPorServicio[servicio.id] = {
          nombreServicio: servicio.nombre,
          totalIngresos: 0,
          cantidadTurnos: 0,
        };
      }
      ingresosPorServicio[servicio.id].totalIngresos += ingresoTurno;
      ingresosPorServicio[servicio.id].cantidadTurnos += 1;

      // Ingresos por Empleado
      if (!ingresosPorEmpleado[empleado.id]) {
        ingresosPorEmpleado[empleado.id] = {
          nombreEmpleado: empleado.nombre,
          totalIngresos: 0,
          cantidadTurnos: 0,
        };
      }
      ingresosPorEmpleado[empleado.id].totalIngresos += ingresoTurno;
      ingresosPorEmpleado[empleado.id].cantidadTurnos += 1;
    }

    res.status(200).json({
      totalGeneralIngresos,
      ingresosPorServicio: Object.values(ingresosPorServicio),
      ingresosPorEmpleado: Object.values(ingresosPorEmpleado),
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}