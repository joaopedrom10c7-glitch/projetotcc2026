import '../styles/stats-card.css';

export default function StatsCard({ icon, label, value, unit }) {
  return (
    <div className="stats-card">
      <div className="stats-icon" aria-hidden="true">{icon}</div>
      <div className="stats-info">
        <div className="stats-value-wrapper">
          <span className="stats-value">{value ?? 0}</span>
          {unit && <span className="stats-unit">{unit}</span>}
        </div>
        <span className="stats-label">{label}</span>
      </div>
    </div>
  );
}

