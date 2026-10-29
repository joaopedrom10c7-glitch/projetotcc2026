import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MethodCard from '../components/MethodCard';
import StatsCard from '../components/StatsCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { getDashboard, getFlashcards, getStudySessions } from '../services/api';
import '../styles/home.css';

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [lastQuery, setLastQuery] = useState('');

  const loadDashboardData = useCallback(async () => {
    try {
      setLoadingStats(true);
      setStatsError(null);

      const [dashRes, sessionsRes] = await Promise.allSettled([
        getDashboard(),
        getStudySessions(),
      ]);

      if (dashRes.status === 'fulfilled') {
        setStats(dashRes.value.data);
      } else {
        setStatsError(dashRes.reason.message || 'Erro ao carregar dados do painel.');
      }

      if (sessionsRes.status === 'fulfilled') {
        const list = sessionsRes.value.data || [];
        setRecentSessions(list.slice(0, 5));
      }
    } catch (err) {
      setStatsError(err.message || 'Erro inesperado ao carregar dados.');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleSearch = async (query) => {
    setLastQuery(query);
    if (!query) {
      setSearchResults(null);
      setSearchError(null);
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);
      const res = await getFlashcards({ search: query });
      setSearchResults(res.data || []);
    } catch (err) {
      setSearchError(err.message || 'Erro ao buscar flashcards.');
    } finally {
      setSearching(false);
    }
  };

  const formatSessionDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="home-page">
      {/* Hero & Saudação */}
      <section className="home-hero">
        <h1 className="hero-title">O que você quer estudar hoje?</h1>
        <p className="hero-subtitle">
          Bem-vindo ao Estuda. Escolha uma técnica de estudo comprovada e otimize seu aprendizado.
        </p>
        <div className="hero-search-wrapper">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Pesquisar flashcards por matéria, pergunta ou resposta..."
          />
        </div>
      </section>

      {/* Resultados da Pesquisa Rápida */}
      {lastQuery && (
        <section className="search-results-section" aria-live="polite">
          <div className="section-header">
            <h2>Resultados para "{lastQuery}"</h2>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setSearchResults(null);
                setLastQuery('');
              }}
            >
              Fechar busca
            </button>
          </div>

          {searching ? (
            <LoadingSpinner message="Consultando flashcards..." />
          ) : searchError ? (
            <ErrorMessage message={searchError} onRetry={() => handleSearch(lastQuery)} />
          ) : searchResults && searchResults.length > 0 ? (
            <div className="results-list">
              {searchResults.map((card) => (
                <article key={card.id} className="search-result-card">
                  <span className="result-subject">{card.subject}</span>
                  <h3 className="result-question">{card.question}</h3>
                  <p className="result-answer-preview">
                    <strong>Resposta:</strong> {card.answer}
                  </p>
                  <Link to="/flashcards" className="result-link">
                    Gerenciar em Flashcards →
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🔍"
              title="Nenhum flashcard encontrado"
              description={`Nenhum conteúdo cadastrado corresponde a "${lastQuery}".`}
            />
          )}
        </section>
      )}

      {/* Métodos de Estudo */}
      <section className="methods-section">
        <div className="section-header">
          <h2>Métodos de Estudo</h2>
          <span className="section-caption">Técnicas disponíveis para sua rotina</span>
        </div>
        <div className="methods-grid">
          <MethodCard
            icon="🍅"
            title="Pomodoro"
            description="Ciclos estruturados de foco intenso intercalados com períodos de descanso mental para maximizar a retenção."
            to="/pomodoro"
          />
          <MethodCard
            icon="🃏"
            title="Flashcards"
            description="Prática de recordação ativa e memorização espaçada através de cartões de perguntas e respostas."
            to="/flashcards"
          />
          <MethodCard
            icon="🧠"
            title="Revisão Ativa"
            description="Técnica de auto-explicação e testes práticos para aprofundar a compreensão conceitual."
            disabled
          />
          <MethodCard
            icon="📋"
            title="Plano de Estudos"
            description="Cronograma personalizado com metas diárias, prioridades e acompanhamento sistemático de matérias."
            disabled
          />
        </div>
      </section>

      {/* Painel de Progresso */}
      <section className="stats-section">
        <div className="section-header">
          <h2>Seu Progresso de Estudo</h2>
          <span className="section-caption">Dados reais contabilizados a partir das sessões de foco</span>
        </div>

        {loadingStats ? (
          <LoadingSpinner message="Carregando indicadores da API..." />
        ) : statsError ? (
          <ErrorMessage message={statsError} onRetry={loadDashboardData} />
        ) : (
          <div className="stats-grid">
            <StatsCard
              icon="🎯"
              label="Sessões concluídas hoje"
              value={stats?.sessions_today ?? 0}
            />
            <StatsCard
              icon="⏱️"
              label="Minutos estudados hoje"
              value={stats?.minutes_today ?? 0}
              unit="min"
            />
            <StatsCard
              icon="📊"
              label="Total de sessões acumuladas"
              value={stats?.total_sessions ?? 0}
            />
            <StatsCard
              icon="🏆"
              label="Tempo total de estudo"
              value={stats?.total_minutes ?? 0}
              unit="min"
            />
          </div>
        )}
      </section>

      {/* Acesso rápido às últimas atividades */}
      <section className="recent-activity-section">
        <div className="section-header">
          <h2>Últimas Atividades</h2>
          <span className="section-caption">Histórico das sessões de estudo finalizadas</span>
        </div>

        {loadingStats ? (
          <LoadingSpinner message="Carregando histórico recente..." />
        ) : recentSessions.length > 0 ? (
          <div className="recent-sessions-list">
            {recentSessions.map((session) => (
              <div key={session.id} className="recent-session-item">
                <div className="session-icon">🍅</div>
                <div className="session-details">
                  <span className="session-type">
                    Sessão de {session.type === 'pomodoro' ? 'Pomodoro' : session.type}
                  </span>
                  <span className="session-date">{formatSessionDate(session.completed_at)}</span>
                </div>
                <div className="session-duration">
                  <strong>{session.duration_minutes}</strong> min
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🌱"
            title="Nenhuma atividade recente registrada"
            description="Conclua uma sessão no Pomodoro para ver suas atividades refletidas aqui."
            action={
              <Link to="/pomodoro" className="btn btn-primary btn-sm">
                Iniciar Pomodoro
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}

