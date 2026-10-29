import { useState, useEffect, useCallback } from 'react';
import FlashcardForm from '../components/FlashcardForm';
import FlashcardItem from '../components/FlashcardItem';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import {
  getFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from '../services/api';
import '../styles/flashcards.css';

export default function FlashcardsPage() {
  const [cards, setCards] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Modos de edição e criação
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Estados de feedback de ação
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: string }
  const [deletingId, setDeletingId] = useState(null);

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedSubject) params.subject = selectedSubject;

      const res = await getFlashcards(params);
      const items = res.data || [];
      setCards(items);

      // Atualiza lista global de matérias disponíveis se não estiver filtrando
      if (!selectedSubject && !searchTerm) {
        const unique = [...new Set(items.map((c) => c.subject))].filter(Boolean).sort();
        setSubjects(unique);
      }
    } catch (err) {
      setError(err.message || 'Erro ao carregar flashcards do banco de dados.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedSubject]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  const handleCreate = async (formData) => {
    try {
      setFormLoading(true);
      await createFlashcard(formData);
      showFeedback('success', 'Flashcard criado e salvo no banco com sucesso!');
      setIsFormOpen(false);
      // Recarrega lista
      await fetchCards();
    } catch (err) {
      showFeedback('error', `Falha ao criar flashcard: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    if (!editingCard) return;
    try {
      setFormLoading(true);
      await updateFlashcard(editingCard.id, formData);
      showFeedback('success', 'Flashcard atualizado com sucesso no banco de dados!');
      setEditingCard(null);
      setIsFormOpen(false);
      await fetchCards();
    } catch (err) {
      showFeedback('error', `Falha ao atualizar flashcard: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteFlashcard(id);
      showFeedback('success', 'Flashcard excluído com sucesso.');
      await fetchCards();
    } catch (err) {
      showFeedback('error', `Falha ao excluir flashcard: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartEdit = (card) => {
    setEditingCard(card);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setEditingCard(null);
    setIsFormOpen(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="flashcards-page">
      <div className="flashcards-top-bar">
        <div>
          <h1>Flashcards</h1>
          <p className="page-desc">
            Pratique a recordação ativa criando e revisando cartões de estudos.
          </p>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingCard(null);
              setIsFormOpen(true);
            }}
          >
            + Criar Novo Flashcard
          </button>
        )}
      </div>

      {/* Banner de Feedback */}
      {feedback && (
        <div className={`feedback-alert feedback-alert--${feedback.type}`} role="alert">
          {feedback.type === 'success' ? '✅' : '❌'} {feedback.text}
        </div>
      )}

      {/* Formulário de Criação/Edição */}
      {isFormOpen && (
        <section className="flashcard-form-wrapper" aria-labelledby="form-heading">
          <div className="form-card-header">
            <h2 id="form-heading">
              {editingCard ? 'Editar Flashcard' : 'Novo Flashcard'}
            </h2>
            <button
              type="button"
              className="btn-icon"
              onClick={handleCancelForm}
              title="Fechar formulário"
              aria-label="Fechar formulário"
            >
              ✕
            </button>
          </div>

          <FlashcardForm
            onSubmit={editingCard ? handleUpdate : handleCreate}
            initialData={editingCard}
            onCancel={handleCancelForm}
            isLoading={formLoading}
          />
        </section>
      )}

      {/* Barra de Busca e Filtros */}
      <section className="flashcards-controls">
        <div className="search-control">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Pesquisar por pergunta, resposta ou matéria..."
            initialValue={searchTerm}
          />
        </div>

        <div className="filter-control">
          <label htmlFor="subject-filter-select">Matéria:</label>
          <select
            id="subject-filter-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Todas as matérias</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Listagem de Flashcards */}
      <section className="flashcards-content-area">
        {loading ? (
          <LoadingSpinner message="Carregando flashcards do Neon Database..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchCards} />
        ) : cards.length === 0 ? (
          <EmptyState
            icon="🃏"
            title="Nenhum flashcard encontrado"
            description={
              searchTerm || selectedSubject
                ? 'Nenhum flashcard corresponde aos filtros aplicados. Tente limpar os termos de busca.'
                : 'Ainda não há flashcards cadastrados no banco de dados. Crie o primeiro acima!'
            }
            action={
              (searchTerm || selectedSubject) && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSubject('');
                  }}
                >
                  Limpar Filtros
                </button>
              )
            }
          />
        ) : (
          <div>
            <div className="cards-meta-header">
              <span className="cards-counter">
                {cards.length} {cards.length === 1 ? 'flashcard encontrado' : 'flashcards encontrados'}
              </span>
            </div>

            <div className="flashcards-grid">
              {cards.map((card) => (
                <FlashcardItem
                  key={card.id}
                  flashcard={card}
                  onEdit={handleStartEdit}
                  onDelete={handleDelete}
                  isDeleting={deletingId === card.id}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

