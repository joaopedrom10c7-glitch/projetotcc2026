import { useState, useEffect } from 'react';
import '../styles/search-bar.css';

export default function SearchBar({ onSearch, placeholder = 'Pesquisar...', initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <span className="search-icon" aria-hidden="true">🔍</span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        aria-label="Campo de busca"
      />
      {query && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Limpar busca"
          title="Limpar"
        >
          ✕
        </button>
      )}
      <button type="submit" className="btn btn-primary btn-sm search-submit">
        Buscar
      </button>
    </form>
  );
}

