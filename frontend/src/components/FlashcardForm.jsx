import { useState, useEffect } from 'react';
import '../styles/flashcard-form.css';

export default function FlashcardForm({ onSubmit, initialData = null, onCancel, isLoading = false }) {
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setSubject(initialData.subject || '');
      setQuestion(initialData.question || '');
      setAnswer(initialData.answer || '');
    } else {
      setSubject('');
      setQuestion('');
      setAnswer('');
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!subject.trim()) {
      errs.subject = 'O campo matéria é obrigatório.';
    } else if (subject.trim().length > 100) {
      errs.subject = 'A matéria deve ter no máximo 100 caracteres.';
    }

    if (!question.trim()) {
      errs.question = 'O campo pergunta é obrigatório.';
    }

    if (!answer.trim()) {
      errs.answer = 'O campo resposta é obrigatório.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      subject: subject.trim(),
      question: question.trim(),
      answer: answer.trim(),
    });
  };

  return (
    <form className="flashcard-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="card-subject">
          Matéria <span className="required-indicator">*</span>
        </label>
        <input
          id="card-subject"
          type="text"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            if (errors.subject) setErrors((prev) => ({ ...prev, subject: null }));
          }}
          placeholder="Ex: História, Matemática, Biologia..."
          className={errors.subject ? 'input-error' : ''}
          disabled={isLoading}
          maxLength={100}
        />
        {errors.subject && <span className="field-error" role="alert">{errors.subject}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="card-question">
          Pergunta <span className="required-indicator">*</span>
        </label>
        <textarea
          id="card-question"
          rows={3}
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            if (errors.question) setErrors((prev) => ({ ...prev, question: null }));
          }}
          placeholder="Digite a pergunta ou o conceito a ser testado..."
          className={errors.question ? 'input-error' : ''}
          disabled={isLoading}
        />
        {errors.question && <span className="field-error" role="alert">{errors.question}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="card-answer">
          Resposta <span className="required-indicator">*</span>
        </label>
        <textarea
          id="card-answer"
          rows={3}
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            if (errors.answer) setErrors((prev) => ({ ...prev, answer: null }));
          }}
          placeholder="Digite a resposta correta ou a explicação..."
          className={errors.answer ? 'input-error' : ''}
          disabled={isLoading}
        />
        {errors.answer && <span className="field-error" role="alert">{errors.answer}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Cadastrar Flashcard'}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

