import { Router } from 'express';
import { prisma } from '../services/db.js';
const router = Router();

const startTime = Date.now();

router.get('/', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      db: 'connected',
      uptimeSec: Math.round((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ status: 'error', db: 'error', message: e.message });
  }
});

export default router;


