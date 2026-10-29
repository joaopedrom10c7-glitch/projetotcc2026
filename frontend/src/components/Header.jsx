import { Link, useLocation } from 'react-router-dom';
import '../styles/header.css';

export default function Header() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="logo-icon" aria-hidden="true">📖</span>
          <span className="logo-text">Estuda</span>
        </Link>
        <nav className="header-nav" aria-label="Navegação principal">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Início
          </Link>
          <Link to="/pomodoro" className={`nav-link ${isActive('/pomodoro') ? 'active' : ''}`}>
            Pomodoro
          </Link>
          <Link to="/flashcards" className={`nav-link ${isActive('/flashcards') ? 'active' : ''}`}>
            Flashcards
          </Link>
        </nav>
      </div>
    </header>
  );
}

