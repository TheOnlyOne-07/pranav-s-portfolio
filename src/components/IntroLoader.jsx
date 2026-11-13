import React, { useState, useEffect, useCallback } from 'react';
import { motion, useAnimationControls, animate } from 'framer-motion';
import { useIntro } from '../context/IntroContext';

const easeExit = [0.3, 0, 0.1, 1];
const easeShoot = [0.55, 0, 0.85, 0.4];
const colorPink = "#f5009b";
const colorYellow = "#fbea04";

// Coordinates extracted directly from reference site bundle
const STICKERS = [
  { text: "PREMIERE", bg: colorPink, ink: "#fff", at: 8, x: 16, y: 19, mx: 24, my: 17, r: -8 },
  { text: "DAVINCI", bg: "#63c636", ink: "#000", at: 28, x: 83, y: 18, mx: 73, my: 22, r: 6 },
  { text: "AFTER FX", bg: "#b200ff", ink: "#fff", at: 48, x: 36, y: 71, mx: 30, my: 69, r: -4 },
  { text: "PHOTOSHOP", bg: "#fff", ink: "#000", at: 68, x: 67, y: 68, mx: 71, my: 72, r: 8 },
  { text: "MOTION", bg: "#000", ink: colorYellow, at: 88, x: 86, y: 80, mx: 68, my: 85, r: -10 }
];

function Curtain({ color, exiting, baseDelay, flip = false }) {
  return (
    <div className="absolute inset-0 flex" aria-hidden="true">
      {Array.from({ length: 6 }, (_, s) => {
        const isUp = (s % 2 === 0) !== flip;
        return (
          <motion.div
            key={s}
            className="h-full"
            style={{
              flex: "0 0 calc(100% / 6 + 1px)",
              marginRight: -1,
              background: color,
              boxShadow: isUp ? "0 10px 0 #000" : "0 -10px 0 #000"
            }}
            initial={false}
            animate={exiting ? { y: isUp ? "-112%" : "112%" } : { y: 0 }}
            transition={{
              duration: 0.55,
              ease: easeExit,
              delay: exiting ? baseDelay + 0.04 * s : 0
            }}
          />
        );
      })}
    </div>
  );
}

export default function IntroLoader() {
  const { progress, handleReveal, handleDone } = useIntro();
  const [displayValue, setDisplayValue] = useState(0);
  const [showHello, setShowHello] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const shakeControls = useAnimationControls();
  const visibleCount = STICKERS.filter(s => displayValue >= s.at).length;

  const triggerShake = useCallback((big = false) => {
    if (big) {
      shakeControls.start({
        x: [0, -9, 8, -5, 3, 0],
        y: [0, 6, -5, 3, 0, 0],
        transition: { duration: 0.3 }
      });
    } else {
      shakeControls.start({
        x: [0, -3, 3, -1, 0],
        y: [0, 2, -2, 0, 0],
        transition: { duration: 0.16 }
      });
    }
  }, [shakeControls]);

  useEffect(() => {
    if (visibleCount > 0) {
      triggerShake(false);
    }
  }, [visibleCount, triggerShake]);

  useEffect(() => {
    let cancelled = false;
    const timers = [];
    const schedule = (time, fn) => {
      timers.push(window.setTimeout(() => {
        if (!cancelled) fn();
      }, time));
    };

    const docEl = document.documentElement;
    const origOverflow = docEl.style.overflow;
    docEl.style.overflow = "hidden";
    if (!window.location.hash) window.scrollTo(0, 0);

    progress.set(0);
    setDisplayValue(0);
    setShowHello(false);
    setExiting(false);

    // Ease curve matching reference [0.6, 0, 0.3, 1] over 850ms
    const anim = animate(0, 99, {
      duration: 0.85,
      ease: [0.6, 0, 0.3, 1],
      onUpdate: (v) => {
        progress.set(v);
        setDisplayValue(Math.round(v));
      }
    });

    const finishIntro = async () => {
      await anim;
      await new Promise(r => setTimeout(r, 80));

      if (cancelled) return;
      progress.set(100);
      setDisplayValue(100);
      setShowHello(true);
      triggerShake(true);

      await new Promise(r => setTimeout(r, 220));
      if (cancelled) return;

      setExiting(true);
      schedule(170, handleReveal);
      schedule(900, () => {
        docEl.style.overflow = origOverflow;
        handleDone();
      });
    };

    finishIntro();

    return () => {
      cancelled = true;
      timers.forEach(t => clearTimeout(t));
      anim.stop();
      docEl.style.overflow = origOverflow;
    };
  }, [progress, handleReveal, handleDone, triggerShake]);

  const digits = String(displayValue).padStart(3, "0").split("");
  const winHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  const springPop = (rot, stiffness, damping, mass) => ({
    scale: 1,
    rotate: rot,
    opacity: 1,
    transition: {
      opacity: { duration: 0.05 },
      default: { type: "spring", stiffness, damping, mass }
    }
  });

  return (
    <div
      id="loader"
      className="intro-root fixed inset-0 z-[200] w-screen h-screen overflow-hidden pointer-events-none"
      role="status"
      aria-label="Loading"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
    >
      <span className="sr-only">Loading portfolio</span>

      {/* Layer 1: Pink curtain */}
      <Curtain color={colorPink} exiting={exiting} baseDelay={0.08} flip={true} />

      {/* Layer 2: Yellow curtain */}
      <Curtain color={colorYellow} exiting={exiting} baseDelay={0} flip={false} />

      {/* Main shaker container */}
      <motion.div
        animate={shakeControls}
        className="grid-frame on-light absolute inset-0 w-full h-full"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: 230 }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-0 w-full h-full z-[230]"
          animate={exiting ? { y: -(0.6 * winHeight), opacity: 0, transition: { duration: 0.3, ease: easeShoot } } : { y: 0, opacity: 1 }}
        >
          {/* Top Bar */}
          <div className="font-display absolute inset-x-0 top-0 z-10 flex items-start justify-between px-[6%] pt-7 text-lg text-black md:pt-9 md:text-2xl">
            <span>PRANAV BHANDARE</span>
            <span>VIDEO &amp; MOTION CREATIVE</span>
          </div>

          {/* Bottom Left Counter */}
          <div
            className="font-display absolute bottom-[3%] left-[4%] flex origin-bottom-left items-start text-black select-none"
            style={{
              fontSize: "clamp(4.5rem, 13vw, 11rem)",
              lineHeight: 0.85,
              textShadow: `0.035em 0.035em 0 ${colorPink}`,
              transform: "skewX(-9deg)"
            }}
          >
            {digits.map((d, i) => (
              <span key={i} className="inline-block w-[0.54em] text-center">
                {d}
              </span>
            ))}
            <span className="mt-[0.12em] ml-[0.08em] text-[0.24em] leading-none">
              %
            </span>
          </div>
        </motion.div>

        {/* Slamming Stickers positioned across the full viewport */}
        {STICKERS.map((s, idx) => {
          if (idx >= visibleCount) return null;
          const posX = isMobile ? s.mx : s.x;
          const posY = isMobile ? s.my : s.y;

          return (
            <div
              key={s.text}
              className="absolute"
              style={{
                position: 'absolute',
                top: `${posY}%`,
                left: `${posX}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 240 + idx
              }}
            >
              <motion.div
                className="font-display whitespace-nowrap"
                style={{
                  background: s.bg,
                  color: s.ink,
                  fontSize: "clamp(1.7rem, 6.4vw, 5.5rem)",
                  padding: "0.12em 0.3em 0.04em",
                  boxShadow: "0.1em 0.1em 0 #000",
                  lineHeight: 1
                }}
                initial={{ scale: 2.4, rotate: s.r - 18, opacity: 0 }}
                animate={exiting ? {
                  y: -(1.35 * winHeight),
                  rotate: s.r + 24,
                  transition: { duration: 0.55, ease: easeShoot, delay: 0.04 + 0.025 * idx }
                } : springPop(s.r, 700, 26, 0.7)}
              >
                {s.text}
              </motion.div>
            </div>
          );
        })}

        {/* HELLO! Sticker at 100% in upper-center */}
        {showHello && (
          <div
            className="absolute"
            style={{
              position: 'absolute',
              top: isMobile ? '12%' : '16%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 260
            }}
          >
            <motion.div
              className="font-display whitespace-nowrap"
              style={{
                background: "#fff",
                color: "#000",
                fontSize: "clamp(2.6rem, 9vw, 8rem)",
                padding: "0.1em 0.26em 0.03em",
                boxShadow: "0.08em 0.08em 0 #000",
                lineHeight: 1
              }}
              initial={{ scale: 3, rotate: -16, opacity: 0 }}
              animate={exiting ? {
                y: -(1.35 * winHeight),
                rotate: 18,
                transition: { duration: 0.55, ease: easeShoot, delay: 0.04 }
              } : springPop(-4, 800, 24, 0.8)}
            >
              HELLO!
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
