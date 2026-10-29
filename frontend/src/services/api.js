const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.error || (data.details ? data.details.join(', ') : `Erro HTTP: ${response.status}`);
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está em execução.');
    }
    throw error;
  }
}

// Saúde
export const checkHealth = () => request('/health');

// Flashcards
export const getFlashcards = (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.subject) query.set('subject', params.subject);
  const qs = query.toString();
  return request(`/flashcards${qs ? `?${qs}` : ''}`);
};

export const getFlashcard = (id) => request(`/flashcards/${id}`);

export const createFlashcard = (flashcard) =>
  request('/flashcards', {
    method: 'POST',
    body: JSON.stringify(flashcard),
  });

export const updateFlashcard = (id, flashcard) =>
  request(`/flashcards/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(flashcard),
  });

export const deleteFlashcard = (id) =>
  request(`/flashcards/${id}`, {
    method: 'DELETE',
  });

// Sessões de Estudo
export const getStudySessions = (params = {}) => {
  const query = new URLSearchParams();
  if (params.date) query.set('date', params.date);
  const qs = query.toString();
  return request(`/study-sessions${qs ? `?${qs}` : ''}`);
};

export const createStudySession = (session) =>
  request('/study-sessions', {
    method: 'POST',
    body: JSON.stringify(session),
  });

// Painel / Dashboard
export const getDashboard = () => request('/dashboard');

