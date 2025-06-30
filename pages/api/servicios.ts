
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id, sortBy, sortOrder, search } = req.query;
    if (id) {
      const servicio = await prisma.servicio.findUnique({
        where: { id: Number(id) },
        include: { comisiones: true },
      });
      if (servicio) {
        res.status(200).json(servicio);
      } else {
        res.status(404).json({ message: 'Servicio no encontrado' });
      }
    } else {
      const orderBy = sortBy ? { [sortBy as string]: sortOrder || 'asc' } : {};
      const where = search ? {
        OR: [
          { nombre: { contains: search as string, mode: 'insensitive' } },
        ],
      } : {};
      const servicios = await prisma.servicio.findMany({ where, orderBy, include: { comisiones: true } });
      res.status(200).json(servicios);
    }
  } else if (req.method === 'POST') {
    const { nombre, duracion, precio, comisionPorcentaje, comisiones } = req.body;
    const newServicio = await prisma.servicio.create({
      data: {
        nombre,
        duracion,
        precio,
        comisionPorcentaje,
        comisiones: {
          create: comisiones || [],
        },
      },
      include: { comisiones: true },
    });
    res.status(201).json(newServicio);
  } else if (req.method === 'PUT') {
    const { id, nombre, duracion, precio, comisionPorcentaje, comisiones } = req.body;
    const updatedServicio = await prisma.servicio.update({
      where: { id: Number(id) },
      data: {
        nombre,
        duracion,
        precio,
        comisionPorcentaje,
        comisiones: {
          deleteMany: {}, // Eliminar todas las comisiones existentes
          create: comisiones || [], // Crear las nuevas comisiones
        },
      },
      include: { comisiones: true },
    });
    res.status(200).json(updatedServicio);
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    await prisma.servicio.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
