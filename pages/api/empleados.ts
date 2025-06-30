
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id, sortBy, sortOrder, search } = req.query;
    if (id) {
      const empleado = await prisma.empleado.findUnique({
        where: { id: Number(id) },
        include: { horarios: true, turnos: true },
      });
      if (empleado) {
        res.status(200).json(empleado);
      } else {
        res.status(404).json({ message: 'Empleado no encontrado' });
      }
    } else {
      const orderBy = sortBy ? { [sortBy as string]: sortOrder || 'asc' } : {};
      const where = search ? {
        OR: [
          { nombre: { contains: search as string, mode: 'insensitive' } },
        ],
      } : {};
      const empleados = await prisma.empleado.findMany({ where, orderBy, include: { horarios: true } });
      res.status(200).json(empleados);
    }
  } else if (req.method === 'POST') {
    const { nombre, horarios } = req.body;
    const newEmpleado = await prisma.empleado.create({
      data: {
        nombre,
        horarios: {
          create: horarios || [],
        },
      },
      include: { horarios: true },
    });
    res.status(201).json(newEmpleado);
  } else if (req.method === 'PUT') {
    const { id, nombre, horarios } = req.body;
    const updatedEmpleado = await prisma.empleado.update({
      where: { id: Number(id) },
      data: {
        nombre,
        horarios: {
          deleteMany: {}, // Eliminar todos los horarios existentes
          create: horarios || [], // Crear los nuevos horarios
        },
      },
      include: { horarios: true },
    });
    res.status(200).json(updatedEmpleado);
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    await prisma.empleado.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
