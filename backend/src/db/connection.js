import { neon } from '@neondatabase/serverless';

let sql;

export function getDb() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL não está definida nas variáveis de ambiente');
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

export async function testConnection() {
  const sql = getDb();
  const result = await sql`SELECT 1 AS connected`;
  return result;
}

