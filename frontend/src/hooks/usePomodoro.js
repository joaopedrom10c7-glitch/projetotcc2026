import { useState, useRef, useCallback, useEffect } from 'react';

export const PHASES = {
  FOCUS: 'focus',
  BREAK: 'break',
};

export default function usePomodoro(defaultFocus = 25, defaultBreak = 5) {
  const [focusMinutes, setFocusMinutes] = useState(defaultFocus);
  const [breakMinutes, setBreakMinutes] = useState(defaultBreak);
  const [phase, setPhase] = useState(PHASES.FOCUS);
  const [timeLeft, setTimeLeft] = useState(defaultFocus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);

  const intervalRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearTimer();
        setIsRunning(false);
        return 0;
      }
      return prev - 1;
    });
  }, [clearTimer]);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    if (timeLeft <= 0) return;
    setIsRunning(true);
    intervalRef.current = setInterval(tick, 1000);
  }, [tick, timeLeft]);

  const pause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setTimeLeft(phase === PHASES.FOCUS ? focusMinutes * 60 : breakMinutes * 60);
  }, [clearTimer, phase, focusMinutes, breakMinutes]);

  const switchToBreak = useCallback(() => {
    clearTimer();
    setPhase(PHASES.BREAK);
    setTimeLeft(breakMinutes * 60);
    setIsRunning(false);
  }, [clearTimer, breakMinutes]);

  const switchToFocus = useCallback(() => {
    clearTimer();
    setPhase(PHASES.FOCUS);
    setTimeLeft(focusMinutes * 60);
    setIsRunning(false);
  }, [clearTimer, focusMinutes]);

  const updateFocusMinutes = useCallback((minutes) => {
    const val = Math.max(1, Math.min(120, Number(minutes) || 1));
    setFocusMinutes(val);
    if (phase === PHASES.FOCUS && !isRunning) {
      setTimeLeft(val * 60);
    }
  }, [phase, isRunning]);

  const updateBreakMinutes = useCallback((minutes) => {
    const val = Math.max(1, Math.min(60, Number(minutes) || 1));
    setBreakMinutes(val);
    if (phase === PHASES.BREAK && !isRunning) {
      setTimeLeft(val * 60);
    }
  }, [phase, isRunning]);

  const incrementCompletedCount = useCallback(() => {
    setCompletedSessionsCount((c) => c + 1);
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
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
    PHASES,
  };
}

