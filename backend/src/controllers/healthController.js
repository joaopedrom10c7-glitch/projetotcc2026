import { db } from '../db/index.js';
import { sql } from 'drizzle-orm';

export async function checkHealth(req, res, next) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL não configurada');
    }
    await db.execute(sql`SELECT 1 AS connected`);
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Erro na verificação de saúde:', error.message);
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
}
