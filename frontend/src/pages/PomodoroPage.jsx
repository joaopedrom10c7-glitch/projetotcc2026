import { useState, useEffect, useCallback, useRef } from 'react';
import usePomodoro, { PHASES } from '../hooks/usePomodoro';
import { createStudySession } from '../services/api';
import '../styles/pomodoro.css';

export default function PomodoroPage() {
  const {
    phase,
    timeLeft,
    isRunning,
    focusMinutes,
    breakMinutes,
    completedSessionsCount,
    start,
    pause,
    reset,
    switchToBreak,
    switchToFocus,
    updateFocusMinutes,
    updateBreakMinutes,
    incrementCompletedCount,
  } = usePomodoro(25, 5);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [savingSession, setSavingSession] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error' | 'info', text: string }

  // Evitar chamadas duplicadas ao atingir 0
  const completionHandledRef = useRef(false);

  // Som suave usando Web Audio API sem depender de arquivos de áudio externos
  const playAlertSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // AudioContext bloqueado ou indisponível
    }
  }, [soundEnabled]);

  const handleFocusCompleted = useCallback(async (duration) => {
    setSavingSession(true);
    setNotification(null);

    try {
      await createStudySession({
        type: 'pomodoro',
        duration_minutes: duration,
      });

      incrementCompletedCount();
      setNotification({
        type: 'success',
        text: `Parabéns! Sessão de foco de ${duration} minutos salva com sucesso no banco de dados.`,
      });
    } catch (err) {
      setNotification({
        type: 'error',
        text: `Atenção: A sessão não pôde ser salva na API (${err.message}). Ela não foi contabilizada no histórico.`,
      });
    } finally {
      setSavingSession(false);
    }
  }, [incrementCompletedCount]);

  useEffect(() => {
    if (timeLeft === 0 && !completionHandledRef.current) {
      completionHandledRef.current = true;
      playAlertSound();

      if (phase === PHASES.FOCUS) {
        handleFocusCompleted(focusMinutes);
      } else {
        setNotification({
          type: 'info',
          text: 'Pausa finalizada! Pronto para o próximo ciclo de foco?',
        });
      }
    } else if (timeLeft > 0) {
      completionHandledRef.current = false;
    }
  }, [timeLeft, phase, focusMinutes, playAlertSound, handleFocusCompleted]);

  // Formatação do tempo
  const displayMinutes = Math.floor(timeLeft / 60);
  const displaySeconds = timeLeft % 60;
  const formattedTime = `${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;

  const currentTotalSeconds = (phase === PHASES.FOCUS ? focusMinutes : breakMinutes) * 60;
  const progressRatio = currentTotalSeconds > 0 ? (currentTotalSeconds - timeLeft) / currentTotalSeconds : 0;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const handleStartNextPhase = () => {
    setNotification(null);
    if (phase === PHASES.FOCUS) {
      switchToBreak();
    } else {
      switchToFocus();
    }
  };

  return (
    <div className="pomodoro-page">
      <div className="pomodoro-header">
        <h1>Cronômetro Pomodoro</h1>
        <p className="pomodoro-intro">
          Alterne períodos de foco pleno com pausas estratégicas para manter o rendimento cognitivo.
        </p>
      </div>

      <div className={`pomodoro-card ${phase === PHASES.BREAK ? 'pomodoro-card--break' : 'pomodoro-card--focus'}`}>
        <div className="phase-indicator">
          <span className="phase-badge">
            {phase === PHASES.FOCUS ? '🎯 Fase de Foco' : '☕ Intervalo de Descanso'}
          </span>
          <p className="phase-guidance">
            {phase === PHASES.FOCUS
              ? 'Elimine distrações e concentre-se na sua matéria.'
              : 'Levante-se, hidrate-se e descanse a mente.'}
          </p>
        </div>

        {/* Círculo do cronômetro */}
        <div className="timer-circle-wrapper">
          <svg className="timer-svg" viewBox="0 0 200 200">
            <circle
              className="timer-track"
              cx="100"
              cy="100"
              r={radius}
            />
            <circle
              className="timer-progress"
              cx="100"
              cy="100"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="timer-inner-content">
            <span className="timer-digits">{formattedTime}</span>
            <span className="timer-mode-subtext">
              {phase === PHASES.FOCUS ? 'Foco' : 'Pausa'}
            </span>
          </div>
        </div>

        {/* Notificações / Status */}
        {savingSession && (
          <div className="session-status session-status--saving" role="status">
            💾 Registrando sessão no banco de dados...
          </div>
        )}

        {notification && (
          <div
            className={`session-status session-status--${notification.type}`}
            role="alert"
          >
            {notification.text}
          </div>
        )}

        {/* Controles do cronômetro */}
        <div className="timer-controls">
          {timeLeft === 0 ? (
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleStartNextPhase}
              disabled={savingSession}
            >
              {phase === PHASES.FOCUS ? '☕ Iniciar Pausa' : '🎯 Iniciar Foco'}
            </button>
          ) : isRunning ? (
            <button
              type="button"
              className="btn btn-warning btn-lg"
              onClick={pause}
            >
              ⏸ Pausar
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={start}
            >
              ▶ {timeLeft < currentTotalSeconds ? 'Retomar' : 'Iniciar Foco'}
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={reset}
            disabled={savingSession}
            title="Reiniciar tempo atual"
          >
            🔄 Reiniciar
          </button>
        </div>

        {/* Resumo de sessões da rodada */}
        <div className="pomodoro-stats-strip">
          <div className="stat-item">
            <span className="stat-label">Ciclos de foco salvos nesta tela</span>
            <span className="stat-num">{completedSessionsCount}</span>
          </div>
        </div>
      </div>

      {/* Botão para configurações de tempo */}
      <div className="settings-section">
        <button
          type="button"
          className="btn btn-outline btn-sm settings-toggle-btn"
          onClick={() => setShowConfig(!showConfig)}
        >
          ⚙️ {showConfig ? 'Ocultar configurações de tempo' : 'Ajustar tempos de foco e pausa'}
        </button>

        {showConfig && (
          <div className="settings-panel">
            <h3>Configuração de Intervalos</h3>
            <div className="settings-form">
              <div className="setting-field">
                <label htmlFor="input-focus">Duração do foco (minutos)</label>
                <input
                  id="input-focus"
                  type="number"
                  min="1"
                  max="120"
                  value={focusMinutes}
                  onChange={(e) => updateFocusMinutes(e.target.value)}
                  disabled={isRunning}
                />
                <span className="field-hint">Padrão: 25 minutos (mínimo 1, máximo 120)</span>
              </div>

              <div className="setting-field">
                <label htmlFor="input-break">Duração da pausa (minutos)</label>
                <input
                  id="input-break"
                  type="number"
                  min="1"
                  max="60"
                  value={breakMinutes}
                  onChange={(e) => updateBreakMinutes(e.target.value)}
                  disabled={isRunning}
                />
                <span className="field-hint">Padrão: 5 minutos (mínimo 1, máximo 60)</span>
              </div>

              <div className="setting-field setting-field--checkbox">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                  />
                  <span>Aviso sonoro ao finalizar ciclos</span>
                </label>
              </div>
            </div>
            {isRunning && (
              <p className="config-locked-notice">
                * Para alterar os minutos, pause ou reinicie o cronômetro primeiro.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

