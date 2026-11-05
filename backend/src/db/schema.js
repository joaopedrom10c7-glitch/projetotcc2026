import { sql } from 'drizzle-orm';
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  index,
  check,
} from 'drizzle-orm/pg-core';

// Tabela de Flashcards
export const flashcards = pgTable(
  'flashcards',
  {
    id: serial('id').primaryKey(),
    subject: varchar('subject', { length: 100 }).notNull(),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('idx_flashcards_subject').on(table.subject)],
);

// Tabela de Sessões de Estudo
export const studySessions = pgTable(
  'study_sessions',
  {
    id: serial('id').primaryKey(),
    type: varchar('type', { length: 50 }).notNull().default('pomodoro'),
    durationMinutes: integer('duration_minutes').notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_study_sessions_completed_at').on(table.completedAt),
    check('study_sessions_duration_check', sql`${table.durationMinutes} > 0`),
  ],
);
