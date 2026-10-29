-- =============================================
-- Estuda Platform - Database Schema
-- PostgreSQL
-- =============================================

-- Tabela de Flashcards
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
