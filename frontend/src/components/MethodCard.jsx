import { Link } from 'react-router-dom';
import '../styles/method-card.css';

export default function MethodCard({ icon, title, description, to, disabled }) {
  if (disabled) {
    return (
      <div className="method-card method-card--disabled" aria-disabled="true">
        <div className="method-header">
          <span className="method-icon" aria-hidden="true">{icon}</span>
          <span className="method-badge">Em breve</span>
        </div>
        <h3 className="method-title">{title}</h3>
        <p className="method-description">{description}</p>
        <span className="method-status-text">Funcionalidade futura</span>
      </div>
    );
  }

  return (
    <Link to={to} className="method-card method-card--active">
      <div className="method-header">
        <span className="method-icon" aria-hidden="true">{icon}</span>
        <span className="method-action-arrow" aria-hidden="true">→</span>
      </div>
      <h3 className="method-title">{title}</h3>
      <p className="method-description">{description}</p>
    </Link>
  );
}

