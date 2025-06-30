import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const settings = await prisma.businessSettings.findUnique({
      where: { id: 1 },
    });
    res.status(200).json(settings);
  } else if (req.method === 'PUT') {
    const { nombreNegocio, direccion, telefono, emailContacto, horarioApertura, horarioCierre } = req.body;
    const updatedSettings = await prisma.businessSettings.upsert({
      where: { id: 1 },
      update: { nombreNegocio, direccion, telefono, emailContacto, horarioApertura, horarioCierre },
      create: { id: 1, nombreNegocio, direccion, telefono, emailContacto, horarioApertura, horarioCierre },
    });
    res.status(200).json(updatedSettings);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}