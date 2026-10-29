/*
CREATE TABLE IF NOT EXISTS flashcards (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Sessões de Estudo
CREATE TABLE IF NOT EXISTS study_sessions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL DEFAULT 'pomodoro',
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_flashcards_subject ON flashcards(subject);
CREATE INDEX IF NOT EXISTS idx_study_sessions_completed_at ON study_sessions(completed_at);

-- Função trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger na tabela flashcards
DROP TRIGGER IF EXISTS trg_flashcards_updated_at ON flashcards;
CREATE TRIGGER trg_flashcards_updated_at
    BEFORE UPDATE ON flashcards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
*/
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
    // $onUpdate cobre atualizações feitas via Drizzle;
    // o trigger do banco (drizzle/custom/updated_at_trigger.sql) cobre o resto.
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

