import { useState } from 'react';
import '../styles/flashcard-item.css';

export default function FlashcardItem({ flashcard, onEdit, onDelete, isDeleting = false }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDeleteClick = () => {
    if (isConfirmingDelete) {
      onDelete(flashcard.id);
      setIsConfirmingDelete(false);
    } else {
      setIsConfirmingDelete(true);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  return (
    <article className="flashcard-item">
      <div className="flashcard-top">
        <span className="flashcard-subject-tag">{flashcard.subject}</span>
        <div className="flashcard-action-btns">
          <button
            type="button"
            className="btn-icon"
            onClick={() => onEdit(flashcard)}
            title="Editar flashcard"
            aria-label={`Editar flashcard de ${flashcard.subject}`}
          >
            ✏️
          </button>
          {!isConfirmingDelete ? (
            <button
              type="button"
              className="btn-icon btn-icon--danger"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              title="Excluir flashcard"
              aria-label={`Excluir flashcard de ${flashcard.subject}`}
            >
              🗑️
            </button>
          ) : (
            <div className="delete-confirmation-group">
              <span className="delete-confirm-label">Confirmar?</span>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Sim'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Não
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flashcard-body">
        <div className="flashcard-field">
          <span className="field-caption">Pergunta</span>
          <p className="card-question-text">{flashcard.question}</p>
        </div>

        {showAnswer && (
          <div className="flashcard-answer-box" aria-live="polite">
            <span className="field-caption">Resposta</span>
            <p className="card-answer-text">{flashcard.answer}</p>
          </div>
        )}
      </div>

      <div className="flashcard-footer">
        <button
          type="button"
          className="btn btn-outline btn-sm toggle-answer-btn"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {showAnswer ? '🙈 Ocultar resposta' : '👁️ Ver resposta'}
        </button>
      </div>
    </article>
  );
}

