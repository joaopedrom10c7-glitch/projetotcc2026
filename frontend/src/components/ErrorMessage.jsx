import '../styles/error.css';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container" role="alert">
      <span className="error-icon" aria-hidden="true">⚠️</span>
      <div className="error-content">
        <h4 className="error-title">Ocorreu um erro</h4>
        <p className="error-message">{message || 'Não foi possível carregar as informações.'}</p>
      </div>
      {onRetry && (
        <button className="btn btn-outline btn-sm error-retry-btn" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}

