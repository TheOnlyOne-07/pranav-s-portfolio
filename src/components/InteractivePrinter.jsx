import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickSound, playClapperSound } from '../utils/soundEffects';

// Pixel heart / badge glyph for computer keyboard
function PixelKey({ x, y, fill, active, onClick }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(2.2)`}
      className="cursor-pointer hover:opacity-80 transition-opacity"
      onClick={onClick}
    >
      <polygon
        points="1,0 4,0 4,1 5,1 5,0 8,0 8,1 9,1 9,4 8,4 8,5 7,5 7,6 6,6 6,7 5,7 5,8 4,8 4,7 3,7 3,6 2,6 2,5 1,5 1,4 0,4 0,1 1,1"
        fill={fill}
      />
      {active && (
        <circle cx="4.5" cy="4" r="2" fill="#fff" opacity="0.9" />
      )}
    </g>
  );
}

// Bouncing Audio VU Meter Component
function AudioMeters() {
  const [levels, setLevels] = useState([12, 18, 14, 22, 16, 20]);

  useEffect(() => {
    const id = setInterval(() => {
      setLevels([
        8 + Math.floor(Math.random() * 16),
        10 + Math.floor(Math.random() * 18),
        6 + Math.floor(Math.random() * 20),
        12 + Math.floor(Math.random() * 16),
        9 + Math.floor(Math.random() * 19),
        14 + Math.floor(Math.random() * 14),
      ]);
    }, 120);
    return () => clearInterval(id);
  }, []);

  return (
    <g transform="translate(310, 80)">
      {levels.map((lvl, idx) => {
        const h = Math.max(4, lvl);
        const color = lvl > 22 ? '#ff0808' : lvl > 17 ? '#fbea04' : '#63c636';
        return (
          <rect
            key={idx}
            x={idx * 4}
            y={24 - h}
            width="2.5"
            height={h}
            fill={color}
            rx="0.5"
          />
        );
      })}
    </g>
  );
}

// Retro Video Editing Console / Production Monitor SVG
function ComputerSVG({ mode, setMode, timecode }) {
  return (
    <svg viewBox="0 0 420 316" className="block h-auto w-full select-none" aria-hidden="true" focusable="false">
      {/* Base stand & shadow */}
      <path d="M10 262 H410 L398 306 H22 Z" fill="#3c584c" />
      <path d="M26 236 H394 L410 262 H10 Z" fill="#7fd391" />

      {/* Main CRT Monitor Housing */}
      <path d="M56 24 H364 Q382 24 382 42 V236 H38 V42 Q38 24 56 24 Z" fill="#3cb55a" />
      <path d="M358 24 H364 Q382 24 382 42 V236 H358 Z" fill="#2f9c4d" />
      <rect x="56" y="24" width="308" height="6" rx="3" fill="#7fd391" />

      {/* Brand logo top right */}
      <text
        x="350"
        y="45"
        textAnchor="end"
        fontSize="20"
        fontStyle="italic"
        fill="#fff"
        style={{ fontFamily: "var(--font-display)" }}
      >
        PB • STUDIO
      </text>

      {/* Mode pill indicators on top bezel */}
      <g transform="translate(68, 32)" fontSize="9" fontWeight="bold" style={{ fontFamily: "monospace" }}>
        <rect x="0" y="0" width="46" height="13" rx="2" fill={mode === 'nle' ? '#fbea04' : '#2a8c45'} />
        <text x="23" y="10" textAnchor="middle" fill={mode === 'nle' ? '#000' : '#d1f4c7'}>PREMIERE</text>

        <rect x="52" y="0" width="44" height="13" rx="2" fill={mode === 'grade' ? '#f5009b' : '#2a8c45'} />
        <text x="74" y="10" textAnchor="middle" fill={mode === 'grade' ? '#fff' : '#d1f4c7'}>DAVINCI</text>

        <rect x="102" y="0" width="40" height="13" rx="2" fill={mode === 'vfx' ? '#b200ff' : '#2a8c45'} />
        <text x="122" y="10" textAnchor="middle" fill={mode === 'vfx' ? '#fff' : '#d1f4c7'}>AFTERFX</text>
      </g>

      {/* CRT Bezel & Screen */}
      <rect x="66" y="52" width="288" height="142" rx="14" fill="#2a8c45" />
      <rect x="74" y="60" width="272" height="126" rx="8" fill="#0b0b0b" />

      {/* CRT Screen Scanlines overlay */}
      <g opacity="0.08" stroke="#ffffff" strokeWidth="1">
        {[68, 76, 84, 92, 100, 108, 116, 124, 132, 140, 148, 156, 164, 172].map((y) => (
          <line key={y} x1="74" x2="346" y1={y} y2={y} />
        ))}
      </g>

      {/* Screen Content by Mode */}
      {mode === 'nle' && (
        <g fontSize="11" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          {/* Status bar */}
          <circle cx="92" cy="78" r="4.5" fill="#ff0808" className="animate-pulse" />
          <text x="103" y="82" fill="#ff0808" fontWeight="bold">REC</text>
          <text x="135" y="82" fill="#63c636" fontWeight="bold">{timecode}</text>
          <text x="246" y="82" fill="#7fd391">24.00 fps</text>

          {/* Mini NLE Timeline tracks visualization */}
          <g transform="translate(86, 94)">
            {/* V2 track (Overlay / B-roll) */}
            <rect x="0" y="0" width="16" height="10" fill="#3c584c" rx="1" />
            <text x="4" y="8" fill="#7fd391" fontSize="8">V2</text>
            <rect x="20" y="0" width="70" height="10" fill="#f5009b" rx="2" />
            <rect x="94" y="0" width="55" height="10" fill="#fbea04" rx="2" />
            <rect x="153" y="0" width="80" height="10" fill="#f5009b" rx="2" />

            {/* V1 track (A-roll main cut) */}
            <rect x="0" y="14" width="16" height="10" fill="#3c584c" rx="1" />
            <text x="4" y="22" fill="#7fd391" fontSize="8">V1</text>
            <rect x="20" y="14" width="110" height="10" fill="#3cb55a" rx="2" />
            <rect x="134" y="14" width="99" height="10" fill="#7fd391" rx="2" />

            {/* A1 track (Sound design / Foley) */}
            <rect x="0" y="28" width="16" height="10" fill="#3c584c" rx="1" />
            <text x="4" y="36" fill="#7fd391" fontSize="8">A1</text>
            <rect x="20" y="28" width="60" height="10" fill="#38bdf8" rx="2" />
            <rect x="84" y="28" width="85" height="10" fill="#38bdf8" rx="2" />
            <rect x="173" y="28" width="60" height="10" fill="#818cf8" rx="2" />

            {/* Playhead needle */}
            <line x1="108" x2="108" y1="-2" y2="40" stroke="#ff0808" strokeWidth="2" />
            <polygon points="104,-3 112,-3 108,2" fill="#ff0808" />
          </g>

          {/* Prompt line */}
          <text x="86" y="160" fill="#d1f4c7" fontSize="10">
            SEQUENCE: <tspan fill="#fbea04">PUNE_REEL_FINAL_v4.prproj</tspan>
          </text>
          <text x="86" y="174" fill="#63c636" fontSize="10">
            &gt; ready_for_export<tspan className="animate-pulse">_</tspan>
          </text>
        </g>
      )}

      {mode === 'grade' && (
        <g fontSize="11" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          <text x="88" y="78" fill="#f5009b" fontWeight="bold">DAVINCI RESOLVE COLOR</text>
          <text x="250" y="78" fill="#63c636">LOG &gt; REC.709</text>

          {/* Color lift/gamma/gain simulated circles */}
          <g transform="translate(90, 88)">
            {/* Lift Wheel */}
            <circle cx="30" cy="30" r="22" stroke="#4b5563" strokeWidth="2" fill="#18181b" />
            <circle cx="28" cy="32" r="3" fill="#38bdf8" />
            <text x="30" y="60" textAnchor="middle" fill="#9ca3af" fontSize="8">LIFT</text>

            {/* Gamma Wheel */}
            <circle cx="85" cy="30" r="22" stroke="#4b5563" strokeWidth="2" fill="#18181b" />
            <circle cx="86" cy="27" r="3" fill="#fbea04" />
            <text x="85" y="60" textAnchor="middle" fill="#9ca3af" fontSize="8">GAMMA</text>

            {/* Gain Wheel */}
            <circle cx="140" cy="30" r="22" stroke="#4b5563" strokeWidth="2" fill="#18181b" />
            <circle cx="142" cy="26" r="3" fill="#f5009b" />
            <text x="140" y="60" textAnchor="middle" fill="#9ca3af" fontSize="8">GAIN</text>

            {/* Mini RGB parade waveform */}
            <g transform="translate(175, 8)">
              <rect x="0" y="0" width="60" height="44" fill="#000" stroke="#374151" strokeWidth="1" />
              <path d="M 5 35 Q 12 10 20 28 T 35 15 T 55 30" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.8" />
              <path d="M 5 33 Q 14 14 24 22 T 40 20 T 55 28" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.8" />
              <path d="M 5 30 Q 16 18 26 26 T 45 18 T 55 25" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.8" />
            </g>
          </g>

          <text x="88" y="172" fill="#7fd391" fontSize="10">
            LUT: <tspan fill="#fbea04">FilmPrint_2383_D65.cube [ON]</tspan>
          </text>
        </g>
      )}

      {mode === 'vfx' && (
        <g fontSize="11" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          <text x="88" y="78" fill="#b200ff" fontWeight="bold">AFTER EFFECTS COMP</text>
          <text x="240" y="78" fill="#fbea04">1080x1920 (9:16)</text>

          {/* Keyframe bezier graph simulation */}
          <g transform="translate(88, 88)">
            <rect x="0" y="0" width="244" height="54" fill="#131316" stroke="#2e1065" strokeWidth="1" />
            <line x1="0" x2="244" y1="27" y2="27" stroke="#374151" strokeDasharray="3 3" />
            {/* Bezier speed curve */}
            <path
              d="M 10 50 C 60 50, 90 6, 130 6 C 170 6, 200 48, 234 48"
              fill="none"
              stroke="#b200ff"
              strokeWidth="2.5"
            />
            {/* Keyframe diamonds */}
            <polygon points="10,50 14,46 18,50 14,54" fill="#fbea04" />
            <polygon points="130,6 134,2 138,6 134,10" fill="#fbea04" />
            <polygon points="230,48 234,44 238,48 234,52" fill="#fbea04" />
          </g>

          <text x="88" y="166" fill="#d1f4c7" fontSize="10">
            EASING: <tspan fill="#b200ff">Overshoot Spring + Motion Blur</tspan>
          </text>
          <text x="88" y="178" fill="#63c636" fontSize="10">
            RENDER QUEUE: <tspan fill="#fff">Ready to Print</tspan>
          </text>
        </g>
      )}

      {/* Audio VU meter */}
      <AudioMeters />

      {/* Glass screen reflection glare */}
      <path d="M84 64 H160 L112 124 H84 Z" fill="#fff" opacity="0.06" />

      {/* Speaker vents on left */}
      {[202, 210, 218, 226].map((y) => (
        <line key={y} x1="66" x2="104" y1={y} y2={y} stroke="#000" strokeWidth="3" />
      ))}

      {/* Interactive Mode Switching Keys (Yellow = Premiere, Pink = DaVinci, Purple = AfterFX) */}
      <PixelKey x={122} y={205} fill="#fbea04" active={mode === 'nle'} onClick={() => setMode('nle')} />
      <PixelKey x={152} y={205} fill="#f5009b" active={mode === 'grade'} onClick={() => setMode('grade')} />
      <PixelKey x={182} y={205} fill="#b200ff" active={mode === 'vfx'} onClick={() => setMode('vfx')} />

      {/* Jog Shuttle / Scrub wheel */}
      <g transform="translate(230, 216)">
        <circle cx="0" cy="0" r="14" fill="#1e293b" stroke="#7fd391" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="11" fill="#0f172a" />
        <circle cx="6" cy="-4" r="2.5" fill="#fbea04" />
      </g>

      {/* Color Grading Calibration Bars (Pink, Yellow, Purple) */}
      <rect x="262" y="204" width="132" height="8" fill="#f5009b" />
      <rect x="262" y="213" width="132" height="8" fill="#fbea04" />
      <rect x="262" y="222" width="132" height="8" fill="#b200ff" />

      {/* Bottom Printer Slot where Polaroid card prints out */}
      <rect x="70" y="274" width="280" height="16" rx="6" fill="#0b0b0b" />
      <rect x="70" y="290" width="280" height="3" fill="#2d4538" />
    </svg>
  );
}

// The Polaroid / Clapperboard Printout Card
function PrintedCard({ mode }) {
  const modeData = {
    nle: {
      tag: "THE TIMELINE CUTTER",
      scene: "01",
      take: "FINAL",
      tool: "ADOBE PREMIERE PRO",
      bg: "bg-[#f5009b]",
      textColor: "#fbea04",
      highlight: "PACING & RETENTION",
    },
    grade: {
      tag: "THE COLORIST",
      scene: "02",
      take: "REC.709",
      tool: "DAVINCI RESOLVE STUDIO",
      bg: "bg-[#b200ff]",
      textColor: "#63c636",
      highlight: "CINEMATIC TONES",
    },
    vfx: {
      tag: "MOTION DESIGNER",
      scene: "03",
      take: "4K DCI",
      tool: "AFTER EFFECTS + BLENDER",
      bg: "bg-[#3cb55a]",
      textColor: "#fbea04",
      highlight: "3D & DYNAMIC TITLES",
    },
  }[mode] || {
    tag: "VIDEO & MOTION CREATIVE",
    scene: "PB",
    take: "2026",
    tool: "CINEAURA STUDIOS",
    bg: "bg-[#f5009b]",
    textColor: "#fbea04",
    highlight: "VISUAL STORYTELLER",
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-[#141416] p-4 text-white relative overflow-hidden select-none">
      {/* 35mm film perforation sprocket holes on sides */}
      <div className="absolute left-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="w-2 h-2.5 bg-white/20 rounded-xs border border-black/40" />
        ))}
      </div>
      <div className="absolute right-1.5 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="w-2 h-2.5 bg-white/20 rounded-xs border border-black/40" />
        ))}
      </div>

      {/* Film Slate / Clapperboard Header */}
      <div className="mx-2 bg-yellow text-black px-2 py-1 flex items-center justify-between font-mono text-[10px] font-bold border-2 border-black">
        <span>SCENE: {modeData.scene}</span>
        <span>TAKE: {modeData.take}</span>
        <span>FPS: 24</span>
      </div>

      {/* Main Avatar / Monogram Box */}
      <div className="my-auto text-center px-4">
        <div className="inline-block relative">
          <span
            className="font-display -skew-x-[8deg] text-[5rem] sm:text-[5.5rem] leading-none text-white block"
            style={{ textShadow: "0.05em 0.05em 0 #f5009b, 0.08em 0.08em 0 #fbea04" }}
          >
            PB
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#7fd391] block mt-1">
            PRANAV BHANDARE
          </span>
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5">
          <span className="font-mono text-[11px] bg-[#2a8c45] text-white px-2 py-0.5 font-bold uppercase rounded-xs">
            {modeData.tool}
          </span>
        </div>
      </div>

      {/* Bottom badge */}
      <div className="mx-2">
        <div className="bg-[#fbea04] text-black font-display text-center py-1 text-sm tracking-wide border-2 border-black -rotate-1 shadow-[2px_2px_0_#000]">
          {modeData.tag}
        </div>
      </div>
    </div>
  );
}

export default function InteractivePrinter() {
  const [printCount, setPrintCount] = useState(1);
  const [mode, setMode] = useState('nle'); // 'nle' | 'grade' | 'vfx'
  const [timecode, setTimecode] = useState('01:24:16:08');

  // Live running 24fps timecode ticker
  useEffect(() => {
    let frame = 8;
    let sec = 16;
    let min = 24;
    const hour = 1;

    const interval = setInterval(() => {
      frame += 1;
      if (frame >= 24) {
        frame = 0;
        sec += 1;
        if (sec >= 60) {
          sec = 0;
          min += 1;
        }
      }
      const pad = (n) => String(n).padStart(2, '0');
      setTimecode(`${pad(hour)}:${pad(min)}:${pad(sec)}:${pad(frame)}`);
    }, 1000 / 24);

    return () => clearInterval(interval);
  }, []);

  const handlePrintAgain = (newMode) => {
    playClapperSound();
    if (newMode && typeof newMode === 'string') {
      setMode(newMode);
    }
    setPrintCount((prev) => prev + 1);
  };

  return (
    <figure className="mx-auto w-[min(90vw,400px)] select-none">
      {/* The Computer button */}
      <div className="relative z-10 block w-full">
        <button
          type="button"
          onClick={() => handlePrintAgain()}
          className="block w-full cursor-pointer outline-offset-4 transition-transform duration-150 active:translate-y-1 hover:scale-[1.01]"
          title="Click to switch cut and print slate!"
        >
          <ComputerSVG mode={mode} setMode={setMode} timecode={timecode} />
          <span className="sr-only">Switch mode or print slate</span>
        </button>
      </div>

      {/* The Printed Polaroid/Slate Card coming out of the slot */}
      <div className="relative z-0 -mt-[5.7%] overflow-hidden px-4 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${printCount}-${mode}`}
            initial={{ y: "-102%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            drag
            dragConstraints={{ top: -10, bottom: 60, left: -40, right: 40 }}
            dragElastic={0.2}
            whileHover={{ scale: 1.02, cursor: 'grab' }}
            whileDrag={{ scale: 1.05, cursor: 'grabbing', zIndex: 30 }}
            className="mx-auto w-[84%] bg-[#b200ff] p-[4.5%] pb-0 hs-lg border-3 border-black select-none"
            style={{ rotate: -2 }}
          >
            {/* Polaroid photo box */}
            <div className="relative aspect-[4/5] w-full overflow-hidden border-3 border-black">
              <PrintedCard mode={mode} />
            </div>

            {/* Bottom Card Title */}
            <p className="font-display -skew-x-6 py-2.5 text-center text-[1.8rem] leading-none text-white [text-shadow:2px_2px_0_#000] select-none">
              AND, IT'S ME…
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Interactive Controls Bar underneath */}
      <figcaption className="mt-3 text-center flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
          <span className="text-black/60">SWITCH NLE:</span>
          <button
            onClick={() => handlePrintAgain('nle')}
            className={`px-2 py-0.5 border-2 border-black text-[11px] font-bold transition-transform active:translate-y-0.5 ${
              mode === 'nle' ? 'bg-yellow text-black shadow-[2px_2px_0_#000]' : 'bg-white hover:bg-yellow/40'
            }`}
          >
            ✂️ PREMIERE
          </button>
          <button
            onClick={() => handlePrintAgain('grade')}
            className={`px-2 py-0.5 border-2 border-black text-[11px] font-bold transition-transform active:translate-y-0.5 ${
              mode === 'grade' ? 'bg-pink text-white shadow-[2px_2px_0_#000]' : 'bg-white hover:bg-pink/40'
            }`}
          >
            🎨 DAVINCI
          </button>
          <button
            onClick={() => handlePrintAgain('vfx')}
            className={`px-2 py-0.5 border-2 border-black text-[11px] font-bold transition-transform active:translate-y-0.5 ${
              mode === 'vfx' ? 'bg-purple text-white shadow-[2px_2px_0_#000]' : 'bg-white hover:bg-purple/40'
            }`}
          >
            ⚡ AFTER FX
          </button>
        </div>

        <p className="text-[12px] font-mono text-black/70 flex items-center justify-center gap-1">
          <span>🎬</span>
          <span>Click the monitor or buttons to re-render &amp; print slate</span>
        </p>
      </figcaption>
    </figure>
  );
}
