import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId, read } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const notifications = await prisma.notification.findMany({
      where: {
        userId: Number(userId),
        read: read ? (read === 'true') : undefined,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(notifications);
  } else if (req.method === 'PUT') {
    const { id, read } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'Notification ID is required' });
    }
    const updatedNotification = await prisma.notification.update({
      where: { id: Number(id) },
      data: { read: read === true },
    });
    res.status(200).json(updatedNotification);
  } else if (req.method === 'POST') {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ message: 'User ID and message are required' });
    }
    const newNotification = await prisma.notification.create({
      data: { userId: Number(userId), message },
    });
    res.status(201).json(newNotification);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}