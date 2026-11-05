import { db } from '../db/index.js';
import { studySessions } from '../db/schema.js';
import { sql } from 'drizzle-orm';

export async function getDashboard(req, res, next) {
  try {
    const [todayStats] = await db
      .select({
        sessions_today: sql`COUNT(*)::int`,
        minutes_today: sql`COALESCE(SUM(${studySessions.durationMinutes}), 0)::int`,
      })
      .from(studySessions)
      .where(
        sql`(${studySessions.completedAt} AT TIME ZONE 'America/Sao_Paulo')::date = (NOW() AT TIME ZONE 'America/Sao_Paulo')::date`
      );

    const [totalStats] = await db
      .select({
        total_sessions: sql`COUNT(*)::int`,
        total_minutes: sql`COALESCE(SUM(${studySessions.durationMinutes}), 0)::int`,
      })
      .from(studySessions);

    res.json({
      data: {
        sessions_today: todayStats?.sessions_today ?? 0,
        minutes_today: todayStats?.minutes_today ?? 0,
        total_sessions: totalStats?.total_sessions ?? 0,
        total_minutes: totalStats?.total_minutes ?? 0,
      },
    });
  } catch (error) {
    next(error);
  }
}
