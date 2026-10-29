import '../styles/loading.css';

export default function LoadingSpinner({ message = 'Carregando...' }) {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

