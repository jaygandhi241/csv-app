
import { prisma } from '../services/db.js';

export const getRecords =  async (req, res, next) => {
    try {
      const { q, email, page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      const params = [];
      const where = [];
  
      if (q) {
        params.push(`%${q}%`);
        where.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length})`);
      }
      if (email) {
        params.push(email);
        where.push(`email = $${params.length}`);
      }
  
      if (req.user.role !== 'admin') {
        params.push(req.user.id);
        where.push(`user_id = $${params.length}`);
      }
  
      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const whereObj = {
        ...(email ? { email } : {}),
        ...(req.user.role !== 'admin' ? { userId: req.user.id } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      };
  
      const [items, total] = await Promise.all([
        prisma.record.findMany({
          where: whereObj,
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: Number(limit),
        }),
        prisma.record.count({ where: whereObj }),
      ]);
      res.json({ items, total, page: Number(page), limit: Number(limit) });
    } catch (err) {
      next(err);
    }
}

export const downloadRecords = async (req, res, next) => {
    try {
      const { q, email } = req.query;
      const params = [];
      const where = [];
  
      if (q) {
        params.push(`%${q}%`);
        where.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length})`);
      }
      if (email) {
        params.push(email);
        where.push(`email = $${params.length}`);
      }
      if (req.user.role !== 'admin') {
        params.push(req.user.id);
        where.push(`user_id = $${params.length}`);
      }
      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const whereObj = {
        ...(email ? { email } : {}),
        ...(req.user.role !== 'admin' ? { userId: req.user.id } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      };
      const rows = await prisma.record.findMany({ where: whereObj, orderBy: { createdAt: 'desc' } });
  
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="records.csv"');
  
      const header = 'name,email,phone,amount,created_at\n';
      res.write(header);
      for (const r of rows) {
        const line = [r.name || '', r.email || '', r.phone || '', r.amount ?? '', new Date(r.createdAt).toISOString()]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',');
        res.write(line + '\n');
      }
      res.end();
    } catch (err) {
      next(err);
    }
  }