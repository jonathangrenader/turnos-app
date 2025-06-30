
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID de cliente requerido' });
  }

  if (req.method === 'GET') {
    try {
      const cliente = await prisma.cliente.findUnique({
        where: { id: Number(id) },
        include: { turnos: { include: { servicio: true, empleado: true } } },
      });
      if (cliente) {
        res.status(200).json(cliente);
      } else {
        res.status(404).json({ message: 'Cliente no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener cliente', error });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
