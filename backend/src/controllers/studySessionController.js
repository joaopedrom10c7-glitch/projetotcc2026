import { getDb } from '../db/connection.js';
import { validateSession } from '../middleware/validateRequest.js';

export async function listSessions(req, res, next) {
  try {
    const sql = getDb();
    const { date } = req.query;

    let results;

    if (date) {
      results = await sql`
        SELECT * FROM study_sessions
        WHERE (completed_at AT TIME ZONE 'America/Sao_Paulo')::date = ${date}::date
        ORDER BY completed_at DESC
      `;
    } else {
      results = await sql`
        SELECT * FROM study_sessions
        ORDER BY completed_at DESC
      `;
    }

    res.json({ data: results });
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

    const sql = getDb();
    const { type, duration_minutes } = req.body;

    const results = await sql`
      INSERT INTO study_sessions (type, duration_minutes)
      VALUES (${type.trim()}, ${duration_minutes})
      RETURNING *
    `;

    res.status(201).json({ data: results[0] });
  } catch (error) {
    next(error);
  }
}

