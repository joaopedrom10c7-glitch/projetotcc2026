import { getDb } from '../db/connection.js';
import { validateFlashcard } from '../middleware/validateRequest.js';

export async function listFlashcards(req, res, next) {
  try {
    const sql = getDb();
    const { search, subject } = req.query;

    let results;

    if (search && subject) {
      const searchPattern = `%${search}%`;
      results = await sql`
        SELECT * FROM flashcards
        WHERE subject = ${subject}
          AND (question ILIKE ${searchPattern} OR answer ILIKE ${searchPattern} OR subject ILIKE ${searchPattern})
        ORDER BY created_at DESC
      `;
    } else if (search) {
      const searchPattern = `%${search}%`;
      results = await sql`
        SELECT * FROM flashcards
        WHERE question ILIKE ${searchPattern} OR answer ILIKE ${searchPattern} OR subject ILIKE ${searchPattern}
        ORDER BY created_at DESC
      `;
    } else if (subject) {
      results = await sql`
        SELECT * FROM flashcards
        WHERE subject = ${subject}
        ORDER BY created_at DESC
      `;
    } else {
      results = await sql`
        SELECT * FROM flashcards
        ORDER BY created_at DESC
      `;
    }

    res.json({ data: results });
  } catch (error) {
    next(error);
  }
}

export async function getFlashcard(req, res, next) {
  try {
    const sql = getDb();
    const { id } = req.params;

    const results = await sql`SELECT * FROM flashcards WHERE id = ${id}`;

    if (results.length === 0) {
      return res.status(404).json({ error: 'Flashcard não encontrado' });
    }

    res.json({ data: results[0] });
  } catch (error) {
    next(error);
  }
}

export async function createFlashcard(req, res, next) {
  try {
    const { valid, errors } = validateFlashcard(req.body);
    if (!valid) {
      return res.status(400).json({ error: 'Dados inválidos', details: errors });
    }

    const sql = getDb();
    const { subject, question, answer } = req.body;

    const results = await sql`
      INSERT INTO flashcards (subject, question, answer)
      VALUES (${subject.trim()}, ${question.trim()}, ${answer.trim()})
      RETURNING *
    `;

    res.status(201).json({ data: results[0] });
  } catch (error) {
    next(error);
  }
}

export async function updateFlashcard(req, res, next) {
  try {
    const { id } = req.params;
    const { subject, question, answer } = req.body;

    if (!subject && !question && !answer) {
      return res.status(400).json({ error: 'É necessário fornecer pelo menos um campo para atualizar' });
    }

    const sql = getDb();

    const existing = await sql`SELECT * FROM flashcards WHERE id = ${id}`;
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Flashcard não encontrado' });
    }

    const updated = {
      subject: subject !== undefined ? subject.trim() : existing[0].subject,
      question: question !== undefined ? question.trim() : existing[0].question,
      answer: answer !== undefined ? answer.trim() : existing[0].answer,
    };

    const results = await sql`
      UPDATE flashcards
      SET subject = ${updated.subject},
          question = ${updated.question},
          answer = ${updated.answer},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    res.json({ data: results[0] });
  } catch (error) {
    next(error);
  }
}

export async function deleteFlashcard(req, res, next) {
  try {
    const sql = getDb();
    const { id } = req.params;

    const existing = await sql`SELECT * FROM flashcards WHERE id = ${id}`;
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Flashcard não encontrado' });
    }

    await sql`DELETE FROM flashcards WHERE id = ${id}`;

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

