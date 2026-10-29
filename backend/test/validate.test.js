import assert from 'node:assert';
import { validateFlashcard, validateSession } from '../src/middleware/validateRequest.js';

console.log('--- Testando Validações de Entrada (validateRequest) ---');

// Testes de Flashcard
{
  const resEmpty = validateFlashcard({});
  assert.strictEqual(resEmpty.valid, false, 'Deveria falhar com objeto vazio');
  assert.strictEqual(resEmpty.errors.length, 3, 'Deveria ter 3 erros para campos ausentes');
  console.log('✓ Rejeita flashcard com campos ausentes');

  const resWhitespace = validateFlashcard({ subject: '   ', question: ' ', answer: '   ' });
  assert.strictEqual(resWhitespace.valid, false, 'Deveria falhar com strings apenas de espaços');
  console.log('✓ Rejeita flashcard com campos em branco');

  const resTooLongSubject = validateFlashcard({ subject: 'a'.repeat(101), question: 'q', answer: 'a' });
  assert.strictEqual(resTooLongSubject.valid, false, 'Deveria falhar com subject > 100 caracteres');
  console.log('✓ Rejeita flashcard com matéria maior que 100 caracteres');

  const resValid = validateFlashcard({ subject: 'Matemática', question: 'Quanto é 2 + 2?', answer: '4' });
  assert.strictEqual(resValid.valid, true, 'Deveria aprovar flashcard válido');
  assert.strictEqual(resValid.errors.length, 0);
  console.log('✓ Aceita flashcard válido com sucesso');
}

// Testes de Sessão de Estudo
{
  const resEmpty = validateSession({});
  assert.strictEqual(resEmpty.valid, false, 'Deveria falhar com sessão vazia');
  console.log('✓ Rejeita sessão vazia');

  const resInvalidDuration = validateSession({ type: 'pomodoro', duration_minutes: 0 });
  assert.strictEqual(resInvalidDuration.valid, false, 'Deveria falhar com duration <= 0');
  console.log('✓ Rejeita sessão com duração menor ou igual a zero');

  const resNegativeDuration = validateSession({ type: 'pomodoro', duration_minutes: -10 });
  assert.strictEqual(resNegativeDuration.valid, false, 'Deveria falhar com duração negativa');
  console.log('✓ Rejeita sessão com duração negativa');

  const resTooLongDuration = validateSession({ type: 'pomodoro', duration_minutes: 150 });
  assert.strictEqual(resTooLongDuration.valid, false, 'Deveria falhar com duração > 120');
  console.log('✓ Rejeita sessão com duração superior ao limite');

  const resValidSession = validateSession({ type: 'pomodoro', duration_minutes: 25 });
  assert.strictEqual(resValidSession.valid, true, 'Deveria aceitar sessão de 25 minutos');
  console.log('✓ Aceita sessão válida de 25 minutos');
}

console.log('\nTodos os testes de validação unitários passaram com sucesso!');

