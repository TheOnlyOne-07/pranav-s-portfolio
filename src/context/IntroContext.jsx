import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useMotionValue } from 'framer-motion';

const IntroContext = createContext({
  revealed: true,
  reduced: false,
  active: false,
  progress: null
});

export const useIntro = () => useContext(IntroContext);

export function IntroProvider({ children }) {
  const [revealed, setRevealed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(true);
  const progress = useMotionValue(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      progress.set(100);
      setReduced(true);
      setRevealed(true);
      setActive(false);
    }
  }, [progress]);

  const handleReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const handleDone = useCallback(() => {
    setActive(false);
  }, []);

  return (
    <IntroContext.Provider value={{ revealed, reduced, active, progress, handleReveal, handleDone }}>
      {children}
    </IntroContext.Provider>
  );
}
