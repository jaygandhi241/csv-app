
import fs from 'fs';
import fsPromises from 'fs/promises';
import { parse } from 'csv-parse';
import { prisma } from '../services/db.js';



export const uplaodRecords =  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
      const rows = await new Promise((resolve, reject) => {
        const records = [];
        fs.createReadStream(req.file.path)
          .pipe(
            parse({
              columns: true,
              trim: true,
              skip_empty_lines: true,
            })
          )
          .on('data', (rec) => records.push(rec))
          .on('error', reject)
          .on('end', () => resolve(records));
      });
  
      // Basic validation and normalization
      const prepared = [];
      for (const r of rows) {
        const name = (r.name || r.Name || '').toString();
        const email = (r.email || r.Email || '').toString();
        const phone = (r.phone || r.Phone || '').toString();
        const amountStr = (r.amount || r.Amount || '').toString();
        const amount = amountStr ? Number(amountStr) : null;
        // Skip empty lines or invalid records
        if (!name && !email && !phone && amount === null) continue;
        prepared.push({ name, email, phone, amount });
      }
  
      if (prepared.length === 0) {
        await fsPromises.unlink(req.file.path).catch(() => {});
        return res.status(400).json({ error: 'CSV contained no valid rows' });
      }
  
      // Bulk insert via Prisma
      await prisma.record.createMany({ data: prepared.map((p) => ({ ...p, userId: req.user.id })) });
  
      await fsPromises.unlink(req.file.path).catch(() => {});
      res.status(201).json({ message: 'Uploaded and processed', inserted: prepared.length });
    } catch (err) {
      next(err);
    }
  }  