import { db } from '../db/index.js';
import { studySessions } from '../db/schema.js';
import { validateSession } from '../middleware/validateRequest.js';
import { sql, desc } from 'drizzle-orm';

function formatSession(session) {
  if (!session) return session;
  return {
    ...session,
    duration_minutes: session.durationMinutes,
    completed_at: session.completedAt,
  };
}

export async function listSessions(req, res, next) {
  try {
    const { date } = req.query;

    const query = db
      .select()
      .from(studySessions)
      .orderBy(desc(studySessions.completedAt));

    const results = date
      ? await query.where(
          sql`(completed_at AT TIME ZONE 'America/Sao_Paulo')::date = ${date}::date`
        )
      : await query;

    res.json({ data: results.map(formatSession) });
  } catch (error) {
    next(error);
  }
}

export async function createSession(req, res, next) {
  try {
    const { valid, errors } = validateSession(req.body);
    if (!valid) {
      return res.status(400).json({ error: 'Dados inválidos', details: errors });
    }

    const { type, duration_minutes } = req.body;

    const [newSession] = await db
      .insert(studySessions)
      .values({
        type: type.trim(),
        durationMinutes: duration_minutes,
      })
      .returning();

    res.status(201).json({ data: formatSession(newSession) });
  } catch (error) {
    next(error);
  }
}
