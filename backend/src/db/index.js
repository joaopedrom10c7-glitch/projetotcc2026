import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

const sql = neon(process.env.DATABASE_URL="postgresql://neondb_owner:npg_ItzyVY8cfrp9@ep-young-bar-b6s5ztq0-pooler.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

export const db = drizzle(sql, { schema });