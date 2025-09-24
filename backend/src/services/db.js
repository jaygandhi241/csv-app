import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function initDb() {
  await prisma.$connect();
  console.log('Database connected');
}

export default { prisma, initDb };


