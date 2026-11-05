import { db } from '../db/index.js';
import { flashcards } from '../db/schema.js';
import { validateFlashcard } from '../middleware/validateRequest.js';
import { and, or, eq, ilike, desc } from 'drizzle-orm';

function formatFlashcard(card) {
  if (!card) return card;
  return {
    ...card,
    created_at: card.createdAt,
    updated_at: card.updatedAt,
  };
}

export async function listFlashcards(req, res, next) {
  try {
    const { search, subject } = req.query;
    let whereCondition;

    if (search && subject) {
      const searchPattern = `%${search}%`;
      whereCondition = and(
        eq(flashcards.subject, subject),
        or(
          ilike(flashcards.question, searchPattern),
          ilike(flashcards.answer, searchPattern),
          ilike(flashcards.subject, searchPattern)
        )
      );
    } else if (search) {
      const searchPattern = `%${search}%`;
      whereCondition = or(
        ilike(flashcards.question, searchPattern),
        ilike(flashcards.answer, searchPattern),
        ilike(flashcards.subject, searchPattern)
      );
    } else if (subject) {
      whereCondition = eq(flashcards.subject, subject);
    }

    const query = db
      .select()
      .from(flashcards)
      .orderBy(desc(flashcards.createdAt));

    const results = whereCondition ? await query.where(whereCondition) : await query;

    res.json({ data: results.map(formatFlashcard) });
  } catch (error) {
    next(error);
  }
}

export async function getFlashcard(req, res, next) {
  try {
    const { id } = req.params;
    const cardId = Number(id);

    if (isNaN(cardId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const [card] = await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.id, cardId));

    if (!card) {
      return res.status(404).json({ error: 'Flashcard não encontrado' });
    }

    res.json({ data: formatFlashcard(card) });
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

    const { subject, question, answer } = req.body;

    const [newCard] = await db
      .insert(flashcards)
      .values({
        subject: subject.trim(),
        question: question.trim(),
        answer: answer.trim(),
      })
      .returning();

    res.status(201).json({ data: formatFlashcard(newCard) });
  } catch (error) {
    next(error);
  }
}

export async function updateFlashcard(req, res, next) {
  try {
    const { id } = req.params;
    const cardId = Number(id);

    if (isNaN(cardId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const { subject, question, answer } = req.body;

    if (!subject && !question && !answer) {
      return res.status(400).json({ error: 'É necessário fornecer pelo menos um campo para atualizar' });
    }

    const [existing] = await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.id, cardId));

    if (!existing) {
      return res.status(404).json({ error: 'Flashcard não encontrado' });
    }

    const updateData = {
      updatedAt: new Date(),
    };

    if (subject !== undefined) updateData.subject = subject.trim();
    if (question !== undefined) updateData.question = question.trim();
    if (answer !== undefined) updateData.answer = answer.trim();

    const [updatedCard] = await db
      .update(flashcards)
      .set(updateData)
      .where(eq(flashcards.id, cardId))
      .returning();

    res.json({ data: formatFlashcard(updatedCard) });
  } catch (error) {
    next(error);
  }
}

export async function deleteFlashcard(req, res, next) {
  try {
    const { id } = req.params;
    const cardId = Number(id);

    if (isNaN(cardId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const [existing] = await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.id, cardId));

    if (!existing) {
      return res.status(404).json({ error: 'Flashcard não encontrado' });
    }

    await db.delete(flashcards).where(eq(flashcards.id, cardId));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
