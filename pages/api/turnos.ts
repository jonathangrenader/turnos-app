
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const turnos = await prisma.turno.findMany({
      include: { cliente: true, servicio: true, empleado: true },
    });
    res.status(200).json(turnos);
  } else if (req.method === 'POST') {
    const { fecha, hora, clienteId, servicioId, empleadoId } = req.body;
    const newTurno = await prisma.turno.create({
      data: { fecha, hora, clienteId, servicioId, empleadoId },
    });
    res.status(201).json(newTurno);
  } else if (req.method === 'PUT') {
    const { id, fecha, hora, clienteId, servicioId, empleadoId } = req.body;
    const updatedTurno = await prisma.turno.update({
      where: { id: Number(id) },
      data: { fecha, hora, clienteId, servicioId, empleadoId },
    });
    res.status(200).json(updatedTurno);
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    await prisma.turno.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
