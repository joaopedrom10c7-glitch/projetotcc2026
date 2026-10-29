export function validateFlashcard(body) {
  const errors = [];

  if (!body.subject || typeof body.subject !== 'string' || body.subject.trim() === '') {
    errors.push('O campo "subject" é obrigatório e deve ser um texto não vazio');
  } else if (body.subject.trim().length > 100) {
    errors.push('O campo "subject" deve ter no máximo 100 caracteres');
  }

  if (!body.question || typeof body.question !== 'string' || body.question.trim() === '') {
    errors.push('O campo "question" é obrigatório e deve ser um texto não vazio');
  }

  if (!body.answer || typeof body.answer !== 'string' || body.answer.trim() === '') {
    errors.push('O campo "answer" é obrigatório e deve ser um texto não vazio');
  }

  return { valid: errors.length === 0, errors };
}

export function validateSession(body) {
  const errors = [];

  if (!body.type || typeof body.type !== 'string' || body.type.trim() === '') {
    errors.push('O campo "type" é obrigatório e deve ser um texto não vazio');
  }

  if (body.duration_minutes === undefined || body.duration_minutes === null) {
    errors.push('O campo "duration_minutes" é obrigatório');
  } else if (!Number.isInteger(body.duration_minutes) || body.duration_minutes <= 0) {
    errors.push('O campo "duration_minutes" deve ser um número inteiro positivo');
  } else if (body.duration_minutes > 120) {
    errors.push('O campo "duration_minutes" não pode exceder 120 minutos');
  }

  return { valid: errors.length === 0, errors };
}

