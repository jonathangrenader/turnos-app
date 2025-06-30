
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { sortBy, sortOrder, search } = req.query;
      const orderBy = sortBy ? { [sortBy as string]: sortOrder || 'asc' } : {};
      const where = search ? {
        OR: [
          { descripcion: { contains: search as string, mode: 'insensitive' } },
          { categoria: { contains: search as string, mode: 'insensitive' } },
        ],
      } : {};
      const gastos = await prisma.gasto.findMany({ where, orderBy });
      res.status(200).json(gastos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener gastos', error });
    }
  } else if (req.method === 'POST') {
    try {
      const { descripcion, monto, fecha, categoria } = req.body;
      const newGasto = await prisma.gasto.create({
        data: { descripcion, monto, fecha, categoria },
      });
      res.status(201).json(newGasto);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear gasto', error });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, descripcion, monto, fecha, categoria } = req.body;
      const updatedGasto = await prisma.gasto.update({
        where: { id: Number(id) },
        data: { descripcion, monto, fecha, categoria },
      });
      res.status(200).json(updatedGasto);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar gasto', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await prisma.gasto.delete({
        where: { id: Number(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar gasto', error });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
