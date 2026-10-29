import { getDb } from '../db/connection.js';

export async function getDashboard(req, res, next) {
  try {
    const sql = getDb();

    const todayStats = await sql`
      SELECT
        COUNT(*)::int AS sessions_today,
        COALESCE(SUM(duration_minutes), 0)::int AS minutes_today
      FROM study_sessions
      WHERE (completed_at AT TIME ZONE 'America/Sao_Paulo')::date = (NOW() AT TIME ZONE 'America/Sao_Paulo')::date
    `;

    const totalStats = await sql`
      SELECT
        COUNT(*)::int AS total_sessions,
        COALESCE(SUM(duration_minutes), 0)::int AS total_minutes
      FROM study_sessions
    `;

    res.json({
      data: {
        sessions_today: todayStats[0].sessions_today,
        minutes_today: todayStats[0].minutes_today,
        total_sessions: totalStats[0].total_sessions,
        total_minutes: totalStats[0].total_minutes,
      },
    });
  } catch (error) {
    next(error);
  }
}

