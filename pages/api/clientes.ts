
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id, sortBy, sortOrder } = req.query;
    if (id) {
      const cliente = await prisma.cliente.findUnique({
        where: { id: Number(id) },
        include: { turnos: true },
      });
      if (cliente) {
        res.status(200).json(cliente);
      } else {
        res.status(404).json({ message: 'Cliente no encontrado' });
      }
    } else {
      const orderBy = sortBy ? { [sortBy as string]: sortOrder || 'asc' } : {};
      const search = req.query.search as string;
      const where = search ? {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { telefono: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      } : {};
      const clientes = await prisma.cliente.findMany({ where, orderBy });
      res.status(200).json(clientes);
    }
  } else if (req.method === 'POST') {
    const { nombre, telefono, email } = req.body;
    const newCliente = await prisma.cliente.create({
      data: { nombre, telefono, email },
    });
    res.status(201).json(newCliente);
  } else if (req.method === 'PUT') {
    const { id, nombre, telefono, email } = req.body;
    const updatedCliente = await prisma.cliente.update({
      where: { id: Number(id) },
      data: { nombre, telefono, email },
    });
    res.status(200).json(updatedCliente);
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    await prisma.cliente.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
