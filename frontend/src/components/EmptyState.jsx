import '../styles/empty-state.css';

export default function EmptyState({ icon = '📂', title, description, action }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon" aria-hidden="true">{icon}</span>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}

