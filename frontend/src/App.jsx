import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import PomodoroPage from './pages/PomodoroPage';
import FlashcardsPage from './pages/FlashcardsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pomodoro" element={<PomodoroPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

