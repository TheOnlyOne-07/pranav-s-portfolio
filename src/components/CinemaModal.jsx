import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickSound, playClapperSound } from '../utils/soundEffects';

export default function CinemaModal({ project, isOpen, onClose }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!isOpen || !project) return;
    playClapperSound();
    setAspectRatio(project.aspect === '9:16' ? '9:16' : '16:9');
    setIsPlaying(true);
    setCurrentTime(0);
  }, [isOpen, project]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {
        // Autoplay policy might require mute
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, project]);

  if (!isOpen || !project) return null;

  const togglePlay = () => {
    playClickSound();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    playClickSound();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newTime = (pos / rect.width) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const f = Math.floor((secs % 1) * 24);
    return `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 sm:p-6 backdrop-blur-md bg-black/85">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-5xl overflow-hidden border-4 border-black bg-white hs-xl"
        >
          {/* Modal Titlebar */}
          <div className="flex items-center justify-between border-b-3 border-black bg-yellow px-4 py-2 select-none">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-black">
              <span className="h-3 w-3 rounded-full bg-red animate-pulse" />
              <span>CINEAURA MASTER REEL • {project.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline font-mono text-xs font-semibold text-black/70">
                PRODUCER: {project.client || 'CineAura Studios'}
              </span>
              <button
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
                className="flex h-7 w-7 items-center justify-center border-2 border-black bg-white text-sm font-black transition-colors hover:bg-red hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Main Cinema Screen Area */}
          <div className="relative bg-black flex items-center justify-center min-h-[360px] sm:min-h-[500px] overflow-hidden">
            {/* The Video Display Frame */}
            <div
              className={`relative transition-all duration-300 overflow-hidden border-2 border-white/20 bg-black ${
                aspectRatio === '16:9'
                  ? 'w-full aspect-[16/9]'
                  : 'w-[280px] sm:w-[320px] aspect-[9/16] my-3'
              }`}
            >
              {/* Actual HTML5 Video streaming from Pranav's Canva Assets */}
              {project.videoUrl ? (
                <video
                  ref={videoRef}
                  src={project.videoUrl}
                  poster={project.image}
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={(e) => setDuration(e.target.duration)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              )}

              {/* CRT Scanline effect */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px]" />

              {/* Broadcast Timecode overlay */}
              <div className="absolute top-3 left-4 font-mono text-xs text-yellow bg-black/80 px-2.5 py-0.5 border border-white/20 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-red animate-pulse" />
                <span>TC: {formatTime(currentTime)}</span>
                <span className="text-white/60">• 24 FPS</span>
              </div>

              {/* Resolution badge */}
              <div className="absolute top-3 right-4 font-mono text-[10px] text-[#7fd391] bg-black/80 px-2 py-0.5 border border-white/20">
                {aspectRatio === '16:9' ? '4K DCI • 16:9 CINEMA' : '1080x1920 • 9:16 VERTICAL REEL'}
              </div>

              {/* Click to Play/Pause on video */}
              <div
                onClick={togglePlay}
                className="absolute inset-0 cursor-pointer flex items-center justify-center group"
              >
                {!isPlaying && (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-3 border-black bg-yellow text-black text-2xl font-bold hs-md group-hover:scale-110 transition-transform">
                    ▶
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scrubber Timeline Bar */}
          <div
            onClick={handleSeek}
            className="relative h-3 bg-black cursor-pointer border-t border-b border-black group"
          >
            <div
              className="absolute top-0 bottom-0 left-0 bg-yellow"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -ml-2 h-4 w-4 rounded-full bg-pink border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Transport Controls Bar */}
          <div className="flex flex-wrap items-center justify-between border-t-2 border-black bg-[#f4f4f4] p-3 sm:p-4 gap-3">
            {/* Play/Pause, Mute & Time */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="border-2 border-black bg-yellow px-3 py-1 font-display text-sm uppercase text-black hs-sm active:translate-y-0.5"
              >
                {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
              </button>

              <button
                onClick={toggleMute}
                className="border-2 border-black bg-white px-2.5 py-1 font-mono text-xs font-bold uppercase hs-sm hover:bg-yellow"
                title="Toggle Mute"
              >
                {isMuted ? '🔇 UNMUTE' : '🔊 MUTE'}
              </button>

              <span className="font-mono text-xs font-bold text-black hidden sm:inline">
                {formatTime(currentTime)} / {formatTime(duration || 60)}
              </span>
            </div>

            {/* Aspect Ratio Switcher */}
            <div className="flex items-center gap-2 font-mono text-xs font-bold">
              <span className="text-black/60 hidden sm:inline">VIEWPORT:</span>
              <button
                onClick={() => {
                  playClickSound();
                  setAspectRatio('16:9');
                }}
                className={`border-2 border-black px-2.5 py-1 ${
                  aspectRatio === '16:9' ? 'bg-pink text-white hs-sm font-bold' : 'bg-white text-black'
                }`}
              >
                16:9 YOUTUBE
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setAspectRatio('9:16');
                }}
                className={`border-2 border-black px-2.5 py-1 ${
                  aspectRatio === '9:16' ? 'bg-pink text-white hs-sm font-bold' : 'bg-white text-black'
                }`}
              >
                9:16 REELS
              </button>
            </div>

            {/* Direct Hire CTA */}
            <a
              href="#contact"
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="border-2 border-black bg-black px-3.5 py-1 font-display text-sm uppercase text-yellow hover:bg-yellow hover:text-black transition-colors"
            >
              COMMISSION AN EDIT LIKE THIS ➔
            </a>
          </div>

          {/* Project Details Footer */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t-2 border-black/20 bg-white p-3 font-mono text-xs">
            <div>
              <span className="block text-black/50 text-[10px] uppercase">SOFTWARE SUITE</span>
              <span className="font-bold text-black">{project.tags ? project.tags.join(', ') : 'Premiere • DaVinci'}</span>
            </div>
            <div>
              <span className="block text-black/50 text-[10px] uppercase">PROJECT STYLE</span>
              <span className="font-bold text-black">{project.role || 'High-Retention Video'}</span>
            </div>
            <div>
              <span className="block text-black/50 text-[10px] uppercase">ENGAGEMENT SLA</span>
              <span className="font-bold text-green">+78% Average Retention</span>
            </div>
            <div>
              <span className="block text-black/50 text-[10px] uppercase">SOURCE ASSET</span>
              <a
                href={project.videoUrl || project.link}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-pink hover:underline flex items-center gap-1"
              >
                Canva Raw MP4 ↗
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
