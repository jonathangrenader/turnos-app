import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const empleados = await prisma.empleado.findMany({
      include: {
        horarios: true,
      },
    });

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

    const ocupacionPorEmpleado: { [key: number]: { nombreEmpleado: string; totalHorasTrabajo: number; totalHorasOcupadas: number; porcentajeOcupacion: number } } = {};

    // Initialize occupancy for all employees
    empleados.forEach(empleado => {
      ocupacionPorEmpleado[empleado.id] = {
        nombreEmpleado: empleado.nombre,
        totalHorasTrabajo: 0,
        totalHorasOcupadas: 0,
        porcentajeOcupacion: 0,
      };
    });

    const getDayOfWeek = (dateString: string) => {
      const date = new Date(dateString + 'T00:00:00'); // Add T00:00:00 to avoid timezone issues
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return days[date.getDay()];
    };

    // Calculate total working hours for each employee within the date range
    let currentDate = new Date(startDate as string);
    const end = new Date(endDate as string);

    while (currentDate <= end) {
      const currentDayOfWeek = getDayOfWeek(currentDate.toISOString().slice(0, 10));
      empleados.forEach(empleado => {
        const horarioDelDia = empleado.horarios.find(h => h.diaSemana === currentDayOfWeek);
        if (horarioDelDia) {
          const [startHour, startMinute] = horarioDelDia.horaInicio.split(':').map(Number);
          const [endHour, endMinute] = horarioDelDia.horaFin.split(':').map(Number);
          const workDurationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
          ocupacionPorEmpleado[empleado.id].totalHorasTrabajo += workDurationMinutes / 60;
        }
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate occupied hours
    for (const turno of turnos) {
      const servicio = turno.servicio;
      const empleado = turno.empleado;

      if (!servicio || !empleado) continue;

      ocupacionPorEmpleado[empleado.id].totalHorasOcupadas += servicio.duracion / 60;
    }

    // Calculate percentage
    Object.values(ocupacionPorEmpleado).forEach(empleadoStats => {
      if (empleadoStats.totalHorasTrabajo > 0) {
        empleadoStats.porcentajeOcupacion = (empleadoStats.totalHorasOcupadas / empleadoStats.totalHorasTrabajo) * 100;
      }
    });

    res.status(200).json(Object.values(ocupacionPorEmpleado));
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}