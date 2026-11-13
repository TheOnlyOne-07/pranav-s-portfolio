import React, { useState, useEffect, useRef } from 'react';
import { motion, useTransform, useScroll, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Film, 
  Video, 
  Sparkles, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Copy, 
  Check, 
  ArrowUpRight, 
  ArrowUp, 
  Menu, 
  X, 
  Palette, 
  Layers, 
  MonitorPlay, 
  GraduationCap, 
  Briefcase
} from 'lucide-react';
import { useIntro } from './context/IntroContext';
import IntroLoader from './components/IntroLoader';
import InteractivePrinter from './components/InteractivePrinter';
import CinemaModal from './components/CinemaModal';
import { toggleSound, isSoundEnabled, playClickSound } from './utils/soundEffects';

// SVG Brutalist Glyphs with hard black drop-shadow
function GlyphDiamond({ color = "#f5009b", size = 52, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" className={className} aria-hidden="true" focusable="false">
      <g transform="translate(4 4)"><path d="M24 1 L47 24 L24 47 L1 24 Z" fill="#000" /></g>
      <g><path d="M24 1 L47 24 L24 47 L1 24 Z" fill={color} /></g>
    </svg>
  );
}

function GlyphShield({ color = "#fbea04", size = 52, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" className={className} aria-hidden="true" focusable="false">
      <g transform="translate(4 4)"><path d="M1 14 L24 1 L47 14 L47 30 L24 47 L1 30 Z" fill="#000" /></g>
      <g><path d="M1 14 L24 1 L47 14 L47 30 L24 47 L1 30 Z" fill={color} /></g>
    </svg>
  );
}

function GlyphClover({ color = "#fbea04", size = 52, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" className={className} aria-hidden="true" focusable="false">
      <g transform="translate(4 4)">
        <circle cx="24" cy="14" r="12" fill="#000" />
        <circle cx="13" cy="33" r="12" fill="#000" />
        <circle cx="35" cy="33" r="12" fill="#000" />
      </g>
      <g>
        <circle cx="24" cy="14" r="12" fill={color} />
        <circle cx="13" cy="33" r="12" fill={color} />
        <circle cx="35" cy="33" r="12" fill={color} />
      </g>
    </svg>
  );
}

function GlyphLeaves({ color = "#ff0808", size = 52, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" className={className} aria-hidden="true" focusable="false">
      <g transform="translate(4 4)">
        <path d="M2 8 C2 30 12 44 22 44 C22 22 14 8 2 8 Z" fill="#000" />
        <path d="M26 8 C38 8 46 22 46 44 C34 44 26 30 26 8 Z" fill="#000" />
      </g>
      <g>
        <path d="M2 8 C2 30 12 44 22 44 C22 22 14 8 2 8 Z" fill={color} />
        <path d="M26 8 C38 8 46 22 46 44 C34 44 26 30 26 8 Z" fill={color} />
      </g>
    </svg>
  );
}

function GlyphPlus({ color = "#fbea04", size = 48, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <g transform="translate(4 4)">
        <path d="M16 2 H32 V16 H46 V32 H32 V46 H16 V32 H2 V16 H16 Z" fill="#000" />
      </g>
      <g>
        <path d="M16 2 H32 V16 H46 V32 H32 V46 H16 V32 H2 V16 H16 Z" fill={color} stroke="#000" strokeWidth="3" />
      </g>
    </svg>
  );
}

// Section notch component
function SectionNotch({ color = "#e8e8e8" }) {
  return (
    <span className="notch-wrap" aria-hidden="true">
      <span className="notch" style={{ '--notch': color }}></span>
    </span>
  );
}

export default function App() {
  const { revealed, active, progress } = useIntro();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [cinemaProject, setCinemaProject] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState(null);

  // Liquid Fill Gradient for Hero Wordmark synced with Loader Progress
  const fillGradient = useTransform(progress, (v) => {
    if (v >= 100) return "linear-gradient(#000, #000)";
    if (v <= 0) return "linear-gradient(transparent, transparent)";
    return `linear-gradient(to top, #000 0%, #000 ${v}%, #f5009b ${v}%, #f5009b ${Math.min(100, v + 2.5)}%, transparent ${Math.min(100, v + 2.5)}%, transparent 100%)`;
  });

  const textColor = useTransform(progress, (v) => (v >= 100 ? "#000" : "transparent"));

  // Rotating roles in the hero badge
  const roles = [
    "Video Editor",
    "Motion Designer",
    "DaVinci Colorist",
    "Visual Story",
    "Post-Production"
  ];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex(prev => (prev + 1) % roles.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [roles.length]);

  const copyEmail = () => {
    navigator.clipboard.writeText('beyondgreatest33@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Horizontal Scroll Setup for Selected Works
  const workContainerRef = useRef(null);
  const workTrackRef = useRef(null);
  const [trackDistance, setTrackDistance] = useState(0);

  useEffect(() => {
    const calculateDistance = () => {
      if (workTrackRef.current) {
        const fullWidth = workTrackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        setTrackDistance(Math.max(0, fullWidth - viewportWidth + 80));
      }
    };
    calculateDistance();
    window.addEventListener('resize', calculateDistance);
    return () => window.removeEventListener('resize', calculateDistance);
  }, []);

  const { scrollYProgress } = useScroll({
    target: workContainerRef,
    offset: ["start start", "end end"]
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], [0, -trackDistance]);

  // Selected Works - All 8 Real Video Productions by Pranav Bhandare from his Canva Portfolio
  const projects = [
    {
      slug: "editorial-pop-culture-cut",
      id: "01",
      title: "Editorial Pop-Culture Cut",
      role: "High-Retention Vertical Cut & Audio Sync",
      year: "2024",
      tint: "#f5009b",
      aspect: "9:16",
      videoUrl: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/439f72617ffd811f2ce5b3fb0b932b9e.mp4",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/dc6d12970a15a6922e67cf22d1987434.jpg",
      client: "Editorial Pop Culture Feature",
      description: "High-energy 9:16 vertical edit featuring dynamic multi-panel grid framing, kinetic typography, and rhythmic beat-synced cuts tailored for maximum engagement.",
      tags: ["Vertical Reel", "Premiere Pro", "Sound Design", "Beat Sync"],
      link: "https://cineaurastudios.my.canva.site/portfolio",
      icon: Video,
      previewNote: "9:16 Vertical Reel • Editorial Fashion & Beat Sync"
    },
    {
      slug: "showreel-2026",
      id: "02",
      title: "Showreel 2026 (Continuous Widescreen Cut)",
      role: "Showreel Assembly & Pacing",
      year: "2026",
      tint: "#fbea04",
      aspect: "16:9",
      videoUrl: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/e56f8daeb5275b180fa7baef05b09a80.mp4",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/51ff359b5333d69e0b50db4593902b37.jpg",
      client: "CineAura Studios Master Cut",
      description: "Editor showreel demonstrating precision colour grading, dynamic narrative pacing, and visual storytelling assembled as a high-octane 16:9 widescreen master cut.",
      tags: ["DaVinci Resolve", "Continuous Cut", "Colour Grading", "Master Reel"],
      link: "https://cineaurastudios.my.canva.site/portfolio",
      icon: Film,
      previewNote: "16:9 Cinema • 4K Mastered Continuous Cut"
    },
    {
      slug: "commercial-brand",
      id: "03",
      title: "CineAura Studios Commercial Brand Cut",
      role: "Commercial Video Production",
      year: "2025",
      tint: "#63c636",
      aspect: "16:9",
      videoUrl: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/fa7c0f20b690be14dcaf2cb04cb9fe81.mp4",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/9971b30ca4e6ab6af3d5742ba58ec187.jpg",
      client: "CineAura Studios",
      description: "Atmospheric brand commercial narrative blending precision sound design, lighting corrections, and rhythmic cutting engineered for broadcast and digital campaigns.",
      tags: ["Commercial Edit", "Sound Design", "Visual Storytelling", "Brand Films"],
      link: "https://cineaurastudios.my.canva.site/portfolio",
      icon: Sparkles,
      previewNote: "16:9 Widescreen • Commercial Narrative"
    },
    {
      slug: "kinetic-motion",
      id: "04",
      title: "Kinetic Motion & 2D Typography",
      role: "Motion Graphics & After Effects",
      year: "2024",
      tint: "#b200ff",
      aspect: "9:16",
      videoUrl: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/f22e06e833a55db5d80612e2da631e85.mp4",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/50b03ff52e89a1ff546d7184269f71bf.jpg",
      client: "Brand Motion Identity",
      description: "Custom keyframed typography animations, kinetic title cards, vector tracking, and energetic title animations crafted inside Adobe After Effects.",
      tags: ["After Effects", "Kinetic Type", "2D Animation", "Motion Design"],
      link: "https://cineaurastudios.my.canva.site/portfolio",
      icon: MonitorPlay,
      previewNote: "Dynamic Keyframing & Kinetic Titles"
    },
    {
      slug: "speed-ramps-action",
      id: "05",
      title: "Dynamic Speed Ramps & Transitions",
      role: "Pacing & Visual Energy",
      year: "2024",
      tint: "#afe4bb",
      aspect: "9:16",
      videoUrl: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/80796cca1b0b7cd1dba36fab75e81113.mp4",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/cb87ada30fbb69d2ebf88d4165d7b385.jpg",
      client: "Gaming & Action Series",
      description: "High-intensity velocity remapping, whip pans, zoom transitions, and impact sound effects synchronized to beats for maximum visual impact.",
      tags: ["Speed Ramps", "Velocity Mapping", "Sound FX", "Action Pacing"],
      link: "https://cineaurastudios.my.canva.site/portfolio",
      icon: Layers,
      previewNote: "9:16 Vertical • Beat-Synced Transitions"
    },
    {
      slug: "color-series",
      id: "06",
      title: "DaVinci Resolve Cinematic Color Series",
      role: "Colour Grading & Film Tone",
      year: "2023",
      tint: "#ff0808",
      aspect: "9:16",
      videoUrl: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/227b8d84f099dd5e9acc66fc0c23db0c.mp4",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/6a680025406c972c7a13689023a65bf4.jpg",
      client: "Post-Production Lab",
      description: "Log-to-Rec.709 color balance, 35mm film emulation LUTs, split-toning, and skin-tone preservation built with node-based color science in DaVinci Resolve.",
      tags: ["DaVinci Resolve", "Colour Grading", "LUTs", "Film Emulation"],
      link: "https://cineaurastudios.my.canva.site/portfolio",
      icon: Palette,
      previewNote: "35mm Film Grain & Kodak 2383 Grade"
    },
    {
      slug: "pacing-audio-sync",
      id: "07",
      title: "Pacing & Multicam Audio Synchronization",
      role: "Audio Sync & Narrative Cut",
      year: "2024",
      tint: "#fbea04",
      aspect: "9:16",
      videoUrl: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/b4073336eaa4ae1e40cf13b434c01cd9.mp4",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/c4fa935d1163a2e5fd41ad1f5e86125e.jpg",
      client: "Digital Content Series",
      description: "Tight rhythmic dialogue trimming, multicam synchronization, background score swelling, and sound effects layering for crisp digital delivery.",
      tags: ["Multicam", "Audio Sync", "Dialogue Edit", "Pacing"],
      link: "https://cineaurastudios.my.canva.site/portfolio",
      icon: Film,
      previewNote: "9:16 Vertical • Clean Audio Sync"
    },
    {
      slug: "dynamic-motion-reel",
      id: "08",
      title: "Dynamic Motion & VFX Reel",
      role: "Motion Design & Visual FX",
      year: "2024",
      tint: "#b200ff",
      aspect: "9:16",
      videoUrl: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/439f72617ffd811f2ce5b3fb0b932b9e.mp4",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/video/dc6d12970a15a6922e67cf22d1987434.jpg",
      client: "Visual Creative Portfolio",
      description: "Composite visual effects, animated graphic overlays, speed ramp sequences, and dynamic transitions showcasing advanced editing craft.",
      tags: ["After Effects", "Compositing", "VFX Overlays", "Transitions"],
      link: "https://cineaurastudios.my.canva.site/portfolio",
      icon: Sparkles,
      previewNote: "9:16 Vertical • Composite VFX"
    }
  ];

  // Creative Lab Posters - All 7 Real Unique Artworks by Pranav Bhandare from his Canva Portfolio
  const posters = [
    { 
      id: "1", 
      title: "Loki: God of Mischief", 
      category: "Vector Illustration", 
      color: "#63c636",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/media/0592cf47a44b99e1b8e3cff19094ed2b.jpg"
    },
    { 
      id: "2", 
      title: "Mathematics of Creativity", 
      category: "Editorial & Typography", 
      color: "#fbea04",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/media/c39398b4ff528530ab02aa67598ead82.jpg"
    },
    { 
      id: "3", 
      title: "Neeraj Chopra: Olympic Gold", 
      category: "Digital Character Art", 
      color: "#f5009b",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/media/a6ef6f1b6b7abdcf8ab81d49bb2b3678.jpg"
    },
    { 
      id: "4", 
      title: "Timeline Mind (NLE Concept)", 
      category: "Post-Production FX", 
      color: "#b200ff",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/media/59a6af8b7c5fb75ae1605e8ec2149e76.jpg"
    },
    { 
      id: "5", 
      title: "Game. Set. Match: Tennis", 
      category: "Sports Poster Design", 
      color: "#afe4bb",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/media/3433abcf5046ddcd8b64c5f4e51bc9fd.jpg"
    },
    { 
      id: "6", 
      title: "Rule 2: Expect Uneven Results", 
      category: "Brand Editorial Layout", 
      color: "#ff0808",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/media/a30095747d5d925a8415e978ffb441a0.jpg"
    },
    { 
      id: "7", 
      title: "Joker: Arthur Fleck", 
      category: "Vector Portrait Art", 
      color: "#3cb55a",
      image: "https://cineaurastudios.my.canva.site/portfolio/_assets/media/0509a10307f3857de82f616036c686dd.jpg"
    }
  ];

  // Toolbox Categories for About Section
  const toolbox = [
    {
      title: "Video & Post-Production",
      items: ["Adobe Premiere Pro", "DaVinci Resolve", "Colour Grading & LUTs", "Audio Synchronization", "Chroma Keying", "Compositing", "Asset Organization"],
      colors: ["#f5009b", "#fff"]
    },
    {
      title: "Motion & Animation",
      items: ["Adobe After Effects", "Motion Graphics", "2D Animation", "Kinetic Typography", "Visual Storytelling", "Showreel Assembly", "Campaign Video Edits"],
      colors: ["#fbea04", "#000"]
    },
    {
      title: "Graphic Design & Typography",
      items: ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Digital Design", "Vector Art", "Poster Layout", "Social Media Content"],
      colors: ["#63c636", "#000"]
    },
    {
      title: "Core Deliverables",
      items: ["Promotional Cuts", "Commercials", "Instagram Reels", "YouTube Edits", "Brand Guidelines", "Editorial Layout"],
      colors: ["#b200ff", "#fff"]
    }
  ];

  const pillRotations = [-2.5, 1.5, -1, 2.5, -1.8, 1];

  return (
    <div id="main" className="min-h-screen bg-paper text-black selection:bg-yellow selection:text-black">
      
      {/* INTRO LOADER ANIMATION */}
      {active && <IntroLoader />}

      {/* Skip to Content for Accessibility */}
      <a 
        href="#content" 
        className="sticker-btn !fixed top-3 left-3 z-[400] -translate-y-[250%] focus:translate-y-0"
      >
        Skip to content
      </a>

      {/* HEADER / NAVIGATION (Placed only at top of the page) */}
      <motion.header
        initial={{ opacity: 0, y: -90 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -90 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="absolute inset-x-0 top-0 z-50 pointer-events-none"
      >
        <nav aria-label="Primary" className="pointer-events-auto relative z-50 mx-auto grid h-[92px] max-w-[1300px] grid-cols-[1fr_auto_1fr] items-center px-6 md:px-12">
          
          {/* Left links (Desktop) */}
          <div className="hidden h-full items-center justify-end gap-12 pr-12 md:flex">
            <a 
              href="#work" 
              className="font-display text-[1.65rem] tracking-wider text-white hover:text-yellow transition-colors duration-150 cursor-pointer"
              style={{ textShadow: "2px 2px 0 #000" }}
            >
              WORK
            </a>
            <a 
              href="#stack" 
              className="font-display text-[1.65rem] tracking-wider text-white hover:text-yellow transition-colors duration-150 cursor-pointer"
              style={{ textShadow: "2px 2px 0 #000" }}
            >
              STACK
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex h-[92px] items-center md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="border-3 border-black bg-yellow p-2 hs-sm font-display text-xl uppercase tracking-wider flex items-center gap-1.5"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              <span>Menu</span>
            </button>
          </div>

          {/* Center Brand Stamp - Only PB, matching Reference */}
          <div className="flex justify-center items-center">
            <a 
              href="#hero" 
              aria-label="Pranav Bhandare, home" 
              className="relative z-10 flex h-[88px] w-[84px] items-center justify-center bg-red border-4 border-black hs transition-transform duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#000]"
            >
              <span className="font-display text-5xl text-white font-bold leading-none tracking-tight">PB</span>
            </a>
          </div>

          {/* Right links (Desktop) */}
          <div className="hidden h-full items-center justify-start gap-10 pl-12 md:flex">
            <a 
              href="#experience" 
              className="font-display text-[1.65rem] tracking-wider text-white hover:text-yellow transition-colors duration-150 cursor-pointer"
              style={{ textShadow: "2px 2px 0 #000" }}
            >
              EXPERIENCE
            </a>
            <a 
              href="#about" 
              className="font-display text-[1.65rem] tracking-wider text-white hover:text-yellow transition-colors duration-150 cursor-pointer"
              style={{ textShadow: "2px 2px 0 #000" }}
            >
              ABOUT
            </a>
            <a 
              href="#contact" 
              className="sticker-btn !text-base !py-1.5 !px-4 !bg-yellow ml-2"
            >
              LET'S TALK
            </a>
          </div>

          {/* Mobile Right Spacer */}
          <div className="flex h-[92px] items-center justify-end md:hidden">
            <a 
              href="#contact" 
              className="border-2 border-black bg-yellow px-2.5 py-1 text-sm font-display uppercase hs-sm"
            >
              Contact
            </a>
          </div>
        </nav>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto mx-4 mt-2 border-4 border-black bg-white p-6 hs-lg md:hidden">
            <div className="flex flex-col gap-4 font-display text-2xl uppercase">
              <a 
                href="#work" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-pink transition-colors flex items-center justify-between border-b-2 border-black/10 pb-2"
              >
                <span>Selected Work</span>
                <span className="text-sm font-mono bg-yellow px-2 py-0.5 border border-black">08</span>
              </a>
              <a 
                href="#stack" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-pink transition-colors flex items-center justify-between border-b-2 border-black/10 pb-2"
              >
                <span>Software &amp; Stack</span>
                <span className="text-sm font-mono bg-mint px-2 py-0.5 border border-black">Pro</span>
              </a>
              <a 
                href="#playground" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-pink transition-colors flex items-center justify-between border-b-2 border-black/10 pb-2"
              >
                <span>Creative Lab</span>
                <span className="text-sm font-mono bg-lime px-2 py-0.5 border border-black">FX</span>
              </a>
              <a 
                href="#experience" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-pink transition-colors flex items-center justify-between border-b-2 border-black/10 pb-2"
              >
                <span>Experience &amp; Edu</span>
                <span className="text-sm font-mono bg-purple text-white px-2 py-0.5 border border-black">B.Sc</span>
              </a>
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-pink transition-colors flex items-center justify-between border-b-2 border-black/10 pb-2"
              >
                <span>About Pranav</span>
                <span className="text-sm font-mono bg-red text-white px-2 py-0.5 border border-black">Bio</span>
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="sticker-btn text-center justify-center !mt-2"
              >
                Let's Meet! 🤝
              </a>
            </div>
          </div>
        )}
      </motion.header>

      {/* MAIN CONTENT */}
      <main id="content" tabIndex={-1} className="outline-none">
        
        {/* ========================================================
            HERO SECTION (Electric Purple)
        ======================================================== */}
        <section 
          id="hero" 
          className="grid-frame relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-purple pt-[92px] text-white"
        >
          {/* Dashed horizontal divider matching reference */}
          <div className="dashed-h absolute inset-x-0 top-[calc(92px+8vh)] hidden md:block" />

          {/* Floating Brutalist Geometric Glyphs with spring animations */}
          <motion.div 
            className="pointer-events-none absolute z-10 left-[7%] top-[14%] md:top-[27%]"
            initial={{ scale: 0, rotate: -70, opacity: 0 }}
            animate={revealed ? { scale: 1, rotate: -12, opacity: 1 } : { scale: 0, rotate: -70, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 12, delay: 0.4 }}
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}>
              <GlyphDiamond color="#f5009b" size={54} />
            </motion.div>
          </motion.div>

          <motion.div 
            className="pointer-events-none absolute z-10 right-[7%] top-[13%] md:top-[25%]"
            initial={{ scale: 0, rotate: -70, opacity: 0 }}
            animate={revealed ? { scale: 1, rotate: 10, opacity: 1 } : { scale: 0, rotate: -70, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 12, delay: 0.5 }}
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4.1, repeat: Infinity, ease: "easeInOut" }}>
              <GlyphShield color="#fbea04" size={60} />
            </motion.div>
          </motion.div>

          <motion.div 
            className="pointer-events-none absolute z-10 left-[8%] bottom-[8%] md:left-[9%] md:bottom-[13%]"
            initial={{ scale: 0, rotate: -70, opacity: 0 }}
            animate={revealed ? { scale: 1, rotate: 8, opacity: 1 } : { scale: 0, rotate: -70, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 12, delay: 0.6 }}
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}>
              <GlyphClover color="#fbea04" size={58} />
            </motion.div>
          </motion.div>

          <motion.div 
            className="pointer-events-none absolute z-10 right-[9%] bottom-[10%] md:right-[10%] md:bottom-[16%]"
            initial={{ scale: 0, rotate: -70, opacity: 0 }}
            animate={revealed ? { scale: 1, rotate: -8, opacity: 1 } : { scale: 0, rotate: -70, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 12, delay: 0.7 }}
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}>
              <GlyphLeaves color="#ff0808" size={50} />
            </motion.div>
          </motion.div>

          <div 
            className={`relative flex flex-1 flex-col items-center justify-center px-4 pt-10 pb-24 text-center max-w-5xl ${active ? "z-[250]" : "z-10"}`}
          >
            {/* Greeting badge */}
            <motion.p 
              initial={{ opacity: 0, y: 14 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ delay: 0.05, duration: 0.5 }}
              className="mb-4 text-lg font-semibold text-white md:mb-8 md:text-xl"
            >
              Hello, I'm
            </motion.p>

            {/* Giant display wordmark: PRANAV. with Liquid Fill & Spring Stretch */}
            <motion.div 
              className="relative"
              animate={revealed ? { x: [0, -8, 7, -4, 2, 0], y: [0, 5, -4, 2, 0, 0] } : { x: 0, y: 0 }}
              transition={{ delay: 0.22, duration: 0.32, ease: "easeOut" }}
            >
              <motion.h1 
                id="hero-wordmark"
                aria-label="Pranav Bhandare"
                className="font-display flex -skew-x-[9deg] justify-center text-[18vw] leading-[0.95] text-black select-none md:text-[clamp(4.2rem,17.5vw,17rem)]"
                animate={revealed ? {
                  textShadow: "0.02em 0.02em 0 #fbea04, 0.04em 0.04em 0 #cfc200"
                } : {
                  textShadow: "0em 0em 0 rgba(251,234,4,0), 0em 0em 0 rgba(207,194,0,0)"
                }}
                transition={{ delay: 0.22, duration: 0.18, ease: "easeOut" }}
              >
                {"PRANAV.".split("").map((letter, idx) => (
                  <span 
                    key={idx} 
                    className="inline-block overflow-hidden px-[0.01em] pb-[0.06em]"
                  >
                    <motion.span 
                      aria-hidden="true" 
                      className="wm-letter inline-block origin-bottom"
                      style={{
                        backgroundImage: fillGradient,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: textColor,
                        WebkitTextStroke: "0.012em #000"
                      }}
                      animate={revealed ? { scaleY: [1, 0.9, 1.05, 1] } : { scaleY: 1 }}
                      transition={{ delay: 0.22 + 0.03 * idx, duration: 0.4, ease: "easeOut" }}
                    >
                      {letter}
                    </motion.span>
                  </span>
                ))}
              </motion.h1>

              {/* Rotating Role Badge pinned to bottom-right of wordmark */}
              <motion.div
                className="absolute -bottom-6 right-[2%] md:-bottom-7 md:right-[5%] z-10 whitespace-nowrap"
                aria-live="off"
                initial={{ scale: 0, rotate: -24, opacity: 0 }}
                animate={revealed ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: -24, opacity: 0 }}
                transition={{ type: "spring", stiffness: 520, damping: 14, delay: 0.4 }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIndex}
                    initial={{ y: 16, opacity: 0, rotate: -3 }}
                    animate={{ y: 0, opacity: 1, rotate: -3 }}
                    exit={{ y: -16, opacity: 0, rotate: -3 }}
                    transition={{ duration: 0.28 }}
                    className="font-display inline-flex items-center justify-center bg-yellow px-4 py-1.5 md:px-5 md:py-2 text-xl leading-none text-black hs-sm md:text-3xl border-3 border-black shadow-[3px_3px_0px_#000]"
                  >
                    {roles[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Elevator pitch */}
            <motion.p 
              initial={{ opacity: 0, y: 16 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ delay: 0.47, duration: 0.6 }}
              className="mx-auto mt-14 max-w-[44rem] text-base font-medium leading-relaxed text-white/95 md:mt-14 md:text-xl"
            >
              Video editor and visual creative specialising in <strong className="font-bold text-yellow">motion graphics</strong>, <strong className="font-bold text-yellow">video editing</strong>, and <strong className="font-bold text-yellow">colour grading</strong>. Proficient in Adobe Creative Suite &amp; DaVinci Resolve, combining post-production craft with a B.Sc. in Media Graphics &amp; Animation.
            </motion.p>

            {/* CTA Sticker Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ delay: 0.62, duration: 0.6 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <a href="#work" className="sticker-btn">
                <span>See My Work</span>
                <ArrowUpRight size={22} className="stroke-[3]" />
              </a>
              <a 
                href="https://cineaurastudios.my.canva.site/portfolio" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="sticker-btn !bg-white hover:!bg-pink hover:!text-white"
              >
                <Play size={20} className="fill-current" />
                <span>2026 Showreel</span>
              </a>
              <a 
                href="#contact" 
                className="sticker-btn !bg-mint hover:!bg-yellow"
              >
                <span>Get In Touch</span>
              </a>
            </motion.div>
          </div>
        </section>


        {/* ========================================================
            TECH STACK SECTION (Vivid Hot Pink)
        ======================================================== */}
        <section 
          id="stack" 
          className="grid-frame relative overflow-hidden bg-pink pt-20 pb-16 text-white md:pt-28 md:pb-24 border-t-4 border-b-4 border-black"
        >
          {/* Section Notch */}
          <SectionNotch color="#f5009b" />

          <div className="relative z-10 px-4 text-center">
            <h2 className="font-display flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-[clamp(2.4rem,6.2vw,5.2rem)] leading-none">
              <span className="shrink-0 -mt-1 hidden sm:block">
                <GlyphDiamond color="#fbea04" size={48} />
              </span>
              <span className="text-black [text-shadow:0.04em_0.04em_0_#fff]">TECH I</span>
              <span className="label-hl !bg-yellow !text-black">CREATE WITH</span>
              <span className="shrink-0 -mt-1 hidden sm:block">
                <GlyphDiamond color="#fbea04" size={48} />
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base font-medium text-white/90 md:text-lg">
              High-performance tools for editing, grading, compositing, visual storytelling, and digital graphic design.
            </p>
          </div>

          {/* Marquee Track 1 (Going Left) */}
          <div className="marquee mt-14 py-3 bg-black border-y-3 border-yellow">
            <div className="marquee-track flex gap-6 text-yellow font-display text-2xl uppercase tracking-wider items-center">
              {[
                "Adobe Premiere Pro", "✦", "DaVinci Resolve", "✦", "Adobe After Effects", "✦", 
                "Adobe Photoshop", "✦", "Adobe Illustrator", "✦", "Adobe InDesign", "✦", 
                "Colour Grading & LUTs", "✦", "Chroma Key Compositing", "✦", "Motion Graphics", "✦",
                "Adobe Premiere Pro", "✦", "DaVinci Resolve", "✦", "Adobe After Effects", "✦", 
                "Adobe Photoshop", "✦", "Adobe Illustrator", "✦", "Adobe InDesign", "✦", 
                "Colour Grading & LUTs", "✦", "Chroma Key Compositing", "✦", "Motion Graphics", "✦"
              ].map((item, idx) => (
                <span key={idx} className={item === "✦" ? "text-pink text-base" : "hover:text-white transition-colors"}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Marquee Track 2 (Going Right / Pedestal Cards) */}
          <div className="marquee mt-4 py-2">
            <div className="marquee-track flex gap-4 text-black items-center" style={{ animationDirection: "reverse", animationDuration: "36s" }}>
              {[
                { name: "Timeline Assembly", cat: "Editing", bg: "bg-yellow" },
                { name: "Audio Synchronization", cat: "Sound", bg: "bg-mint" },
                { name: "Colour Correction", cat: "Grading", bg: "bg-paper" },
                { name: "2D Character Animation", cat: "Motion", bg: "bg-lime" },
                { name: "Typography & Layout", cat: "Design", bg: "bg-yellow" },
                { name: "Visual Storytelling", cat: "Directing", bg: "bg-mint" },
                { name: "Post-Production Workflows", cat: "Pipeline", bg: "bg-paper" },
                { name: "Social Media Reels", cat: "Formats", bg: "bg-lime" },
                // loop
                { name: "Timeline Assembly", cat: "Editing", bg: "bg-yellow" },
                { name: "Audio Synchronization", cat: "Sound", bg: "bg-mint" },
                { name: "Colour Correction", cat: "Grading", bg: "bg-paper" },
                { name: "2D Character Animation", cat: "Motion", bg: "bg-lime" },
                { name: "Typography & Layout", cat: "Design", bg: "bg-yellow" },
                { name: "Visual Storytelling", cat: "Directing", bg: "bg-mint" },
                { name: "Post-Production Workflows", cat: "Pipeline", bg: "bg-paper" },
                { name: "Social Media Reels", cat: "Formats", bg: "bg-lime" }
              ].map((card, idx) => (
                <div 
                  key={idx} 
                  className={`border-3 border-black ${card.bg} px-4 py-2 font-display text-lg uppercase hs-sm flex items-center gap-2`}
                >
                  <span className="font-mono text-xs bg-black text-white px-1.5 py-0.5">{card.cat}</span>
                  <span>{card.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Detailed Competency Cards */}
          <div className="mx-auto mt-16 max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-4 border-black bg-white p-6 hs-lg text-black hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between border-b-3 border-black pb-3">
                <span className="font-mono text-xs font-bold bg-yellow px-2 py-0.5 border border-black">01 // CORE</span>
                <Film size={24} className="text-pink" />
              </div>
              <h3 className="font-display text-2xl uppercase mt-4">Video &amp; Post</h3>
              <p className="mt-2 text-sm text-black/70 font-medium leading-relaxed">
                Video editing, colour grading &amp; correction, chroma key, compositing, audio sync, and digital asset organization.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-xs">
                <span className="bg-paper px-2 py-0.5 border border-black">Premiere Pro</span>
                <span className="bg-paper px-2 py-0.5 border border-black">DaVinci</span>
              </div>
            </div>

            <div className="border-4 border-black bg-white p-6 hs-lg text-black hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between border-b-3 border-black pb-3">
                <span className="font-mono text-xs font-bold bg-mint px-2 py-0.5 border border-black">02 // MOTION</span>
                <Sparkles size={24} className="text-purple" />
              </div>
              <h3 className="font-display text-2xl uppercase mt-4">Motion &amp; Anim</h3>
              <p className="mt-2 text-sm text-black/70 font-medium leading-relaxed">
                Motion graphics, 2D animation, visual storytelling, promotional video cuts, and showreel assembly.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-xs">
                <span className="bg-paper px-2 py-0.5 border border-black">After Effects</span>
                <span className="bg-paper px-2 py-0.5 border border-black">Keyframes</span>
              </div>
            </div>

            <div className="border-4 border-black bg-white p-6 hs-lg text-black hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between border-b-3 border-black pb-3">
                <span className="font-mono text-xs font-bold bg-lime px-2 py-0.5 border border-black">03 // DESIGN</span>
                <Palette size={24} className="text-red" />
              </div>
              <h3 className="font-display text-2xl uppercase mt-4">Design &amp; Layout</h3>
              <p className="mt-2 text-sm text-black/70 font-medium leading-relaxed">
                Digital design for web &amp; social media, typography, layout hierarchy, vector artwork, and poster design.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-xs">
                <span className="bg-paper px-2 py-0.5 border border-black">Photoshop</span>
                <span className="bg-paper px-2 py-0.5 border border-black">Illustrator</span>
              </div>
            </div>

            <div className="border-4 border-black bg-white p-6 hs-lg text-black hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between border-b-3 border-black pb-3">
                <span className="font-mono text-xs font-bold bg-paper px-2 py-0.5 border border-black">04 // PRINT</span>
                <Layers size={24} className="text-pink" />
              </div>
              <h3 className="font-display text-2xl uppercase mt-4">Print &amp; Editorial</h3>
              <p className="mt-2 text-sm text-black/70 font-medium leading-relaxed">
                Typography and layout fundamentals for print and social formats, multi-page documents, and promotional collateral.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-xs">
                <span className="bg-paper px-2 py-0.5 border border-black">InDesign</span>
                <span className="bg-paper px-2 py-0.5 border border-black">Pre-Press</span>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================
            SELECTED WORKS SECTION (Pinned Horizontal Scroll on Desktop)
        ======================================================== */}
        <section id="work" className="relative bg-paper">
          {/* Section Notch */}
          <SectionNotch color="#e6e6e6" />

          {/* Section Heading element */}
          {(() => {
            const heading = (
              <h2 className="font-display flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-[clamp(2.4rem,6.2vw,5.2rem)] leading-none text-center">
                <GlyphDiamond color="#f5009b" size={48} className="shrink-0 -mt-1 hidden sm:block" />
                <span className="text-black [text-shadow:0.04em_0.04em_0_#fff]">SOME</span>
                <span className="label-hl !bg-yellow !text-black">SELECTED WORKS</span>
                <GlyphDiamond color="#b200ff" size={48} className="shrink-0 -mt-1 hidden sm:block" />
              </h2>
            );

            return (
              <>
                {/* Mobile: Vertical list */}
                <div className="px-5 pt-20 pb-20 md:hidden">
                  {heading}
                  <div className="mt-14 space-y-16">
                    {projects.map((p, idx) => (
                      <motion.article 
                        key={p.slug}
                        initial={{ opacity: 0, y: 36 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                      >
                        <div 
                          onClick={() => {
                            playClickSound();
                            setCinemaProject(p);
                          }}
                          className="relative block aspect-[16/10] overflow-hidden border-[3px] bg-black hs cursor-pointer group"
                          style={{ borderColor: p.tint, transform: `rotate(${idx % 2 ? "0.8deg" : "-0.8deg"})` }}
                        >
                          {p.videoUrl ? (
                            <video 
                              src={p.videoUrl} 
                              poster={p.image}
                              muted
                              loop
                              playsInline
                              autoPlay
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                            />
                          ) : (
                            <img 
                              src={p.image} 
                              alt={p.title} 
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col items-center justify-center p-6 text-center text-white pointer-events-none">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full border-3 border-black bg-yellow text-black text-xl font-bold hs-md group-hover:scale-110 transition-transform pointer-events-auto">
                              ▶
                            </div>
                            <span className="font-display text-2xl uppercase mt-3 [text-shadow:2px_2px_0_#000]">{p.title}</span>
                            <span className="font-mono text-xs uppercase bg-black text-yellow px-2 py-0.5 border border-yellow/60 font-bold mt-1">{p.previewNote}</span>
                          </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between gap-4">
                          <p className="text-sm font-medium text-black/70">{p.role} / {p.year}</p>
                          <span className="font-display text-lg leading-none text-black/60">{p.id}</span>
                        </div>

                        <h3 className="font-display mt-2 text-4xl leading-none">{p.title}</h3>
                        <p className="mt-3 text-[0.98rem] leading-snug font-medium text-black/80">{p.description}</p>

                        <div className="mt-5 flex flex-wrap gap-4 pb-1">
                          <button 
                            onClick={() => {
                              playClickSound();
                              setCinemaProject(p);
                            }}
                            className="sticker-btn !text-[1.1rem]"
                          >
                            <span>▶ Watch Cut</span>
                            <ArrowUpRight size={18} className="stroke-[3]" />
                          </button>
                          <button 
                            onClick={() => setActiveModalProject(p)}
                            className="sticker-btn !bg-white !text-[1.1rem]"
                          >
                            Details
                          </button>
                        </div>
                      </motion.article>
                    ))}

                    <p className="font-display text-center text-3xl leading-none">
                      <span className="inline-block -rotate-2 bg-yellow px-4 pt-2.5 pb-2 text-black hs">
                        MORE SOON...
                      </span>
                    </p>
                  </div>
                </div>

                {/* Desktop: Pinned Horizontal Scroll with useTransform */}
                <div className="hidden md:block">
                  <div 
                    ref={workContainerRef} 
                    style={{ height: trackDistance ? `calc(100vh + ${trackDistance}px)` : "auto" }}
                  >
                    <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-12">
                      <div className="px-4">{heading}</div>

                      <motion.div 
                        ref={workTrackRef}
                        style={{ x: xTransform }}
                        className="mt-10 flex w-max items-start gap-12 px-[8vw] md:mt-14 md:gap-24"
                      >
                        {projects.map((p, idx) => (
                          <article 
                            key={p.slug}
                            className="relative shrink-0 border border-dashed border-black/35 p-4 md:p-6"
                            style={{ width: "min(84vw, 560px)", marginTop: idx % 2 ? 56 : 0 }}
                          >
                            <motion.div 
                              whileHover={{ rotate: idx % 2 ? 1.2 : -1.2, y: -6 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              <div 
                                onClick={() => {
                                  playClickSound();
                                  setCinemaProject(p);
                                }}
                                className="relative block aspect-[16/10] overflow-hidden border-[3px] bg-black hs cursor-pointer group"
                                style={{ borderColor: p.tint }}
                              >
                                {p.videoUrl ? (
                                  <video 
                                    src={p.videoUrl} 
                                    poster={p.image}
                                    muted
                                    loop
                                    playsInline
                                    autoPlay
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                                  />
                                ) : (
                                  <img 
                                    src={p.image} 
                                    alt={p.title} 
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
                                  />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col items-center justify-center p-6 text-center text-white pointer-events-none">
                                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-3 border-black bg-yellow text-black text-2xl font-bold hs-md group-hover:scale-110 transition-transform pointer-events-auto">
                                    ▶
                                  </div>
                                  <span className="font-display text-3xl uppercase mt-3 [text-shadow:2px_2px_0_#000]">{p.title}</span>
                                  <span className="font-mono text-xs uppercase bg-black text-yellow px-2 py-0.5 border border-yellow/60 font-bold mt-1">{p.previewNote}</span>
                                </div>
                              </div>
                            </motion.div>

                            <div className="mt-8 flex items-center justify-between gap-4">
                              <p className="text-sm font-medium text-black/70">{p.role} / {p.year}</p>
                              <span className="font-display text-lg leading-none text-black/60">{p.id}</span>
                            </div>

                            <h3 className="font-display mt-2 text-4xl leading-none md:text-5xl">{p.title}</h3>
                            <p className="mt-3 max-w-[30rem] text-[0.98rem] leading-snug font-medium text-black/80">{p.description}</p>

                            <div className="mt-5 flex flex-wrap gap-4 pb-1">
                              <button 
                                onClick={() => {
                                  playClickSound();
                                  setCinemaProject(p);
                                }} 
                                className="sticker-btn !text-[1.1rem]"
                              >
                                <span>▶ Watch Cut</span>
                                <ArrowUpRight size={18} className="stroke-[3]" />
                              </button>
                              <button 
                                onClick={() => setActiveModalProject(p)}
                                className="sticker-btn !bg-white !text-[1.1rem]"
                              >
                                Details
                              </button>
                            </div>
                          </article>
                        ))}

                        <div className="flex shrink-0 items-center self-center pr-[6vw] pl-4">
                          <span className="font-display -rotate-2 bg-yellow px-5 pt-3 pb-2 text-4xl text-black hs md:text-5xl">
                            MORE SOON...
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </section>


        {/* ========================================================
            CREATIVE LAB / PLAYGROUND (Interactive Poster Box & Gallery)
        ======================================================== */}
        <section 
          id="playground" 
          className="grid-frame bricks relative overflow-clip bg-forest pt-24 pb-28 text-white md:pt-32 border-t-4 border-b-4 border-black"
        >
          {/* Section Notch */}
          <SectionNotch color="#e8e8e8" />

          <div className="relative z-10 px-4 text-center">
            <h2 className="font-display flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-[clamp(2.4rem,6.2vw,5.2rem)] leading-none">
              <GlyphClover color="#fbea04" size={52} className="shrink-0 -mt-1 hidden sm:block" />
              <span className="text-white [text-shadow:3px_3px_0_#000,5px_5px_0_#000]">MY</span>
              <span className="bg-[#e6e6e6] text-black border-4 border-black px-4 py-1.5 shadow-[5px_5px_0px_#000]">CREATIVE LAB</span>
              <GlyphLeaves color="#ff0808" size={52} className="shrink-0 -mt-1 hidden sm:block" />
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-white/80 md:text-xl">
              Pixels at Play: explorations, experiments, and escapades.
            </p>
          </div>

          {/* Interactive Stack Fan-out Purple Chest ("TAP ON ME!") */}
          <div className="relative z-10 mx-auto mt-12 w-[min(90vw,640px)] translate-y-[6%] md:mt-20 pb-16">
            <button 
              type="button" 
              onClick={() => setGalleryOpen(true)}
              aria-haspopup="dialog"
              className="group relative isolate block aspect-[420/340] w-full cursor-pointer outline-offset-4 transition-transform duration-150 active:translate-y-1"
            >
              {/* Back of chest SVG (z-0) with pixel pluses */}
              <svg viewBox="0 0 420 340" className="absolute inset-0 z-0 h-full w-full" aria-hidden="true" focusable="false">
                <rect x="78" y="30" width="264" height="96" rx="18" fill="#8a00bf" />
                <rect x="96" y="52" width="228" height="64" rx="10" fill="#6a0094" />
                <polygon points="52,170 368,170 346,112 74,112" fill="#4b0070" />
                <path transform="translate(22 16) scale(2.4)" d="M4 0h4v4h4v4H8v4H4V8H0V4h4z" fill="#fbea04" />
                <path transform="translate(376 14) scale(2)" d="M4 0h4v4h4v4H8v4H4V8H0V4h4z" fill="#f5009b" />
                <path transform="translate(4 138) scale(1.6)" d="M4 0h4v4h4v4H8v4H4V8H0V4h4z" fill="#f5009b" />
                <path transform="translate(394 130) scale(1.6)" d="M4 0h4v4h4v4H8v4H4V8H0V4h4z" fill="#fbea04" />
              </svg>

              {/* 5 Spring-animated Posters emerging from chest with stagger motion */}
              {posters.slice(0, 5).map((p, idx) => {
                const conf = [
                  { left: 6, top: 17, rotate: -22, z: 11 },
                  { left: 20, top: 8, rotate: -11, z: 12 },
                  { left: 36.5, top: 3, rotate: 0, z: 13 },
                  { left: 53, top: 8, rotate: 11, z: 12 },
                  { left: 67, top: 17, rotate: 22, z: 11 }
                ][idx];
                return (
                  <motion.span
                    key={p.id}
                    className="absolute block pointer-events-none"
                    style={{ 
                      left: `${conf.left}%`, 
                      top: `${conf.top}%`, 
                      width: "27%", 
                      zIndex: conf.z, 
                      rotate: conf.rotate 
                    }}
                    initial={{ y: "55%", opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ type: "spring", stiffness: 150, damping: 14, delay: 0.12 * idx }}
                  >
                    <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-4 group-focus-visible:-translate-y-4">
                      <span 
                        className="relative block aspect-[3/4] overflow-hidden border-4 border-black bg-paper"
                        style={{ boxShadow: "4px 4px 0 #000" }}
                      >
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          className="object-cover object-top w-full h-full" 
                        />
                      </span>
                    </span>
                  </motion.span>
                );
              })}

              {/* Front of chest SVG (z-30) */}
              <svg viewBox="0 0 420 340" className="absolute inset-0 z-30 h-full w-full pointer-events-none" aria-hidden="true" focusable="false">
                <rect x="36" y="164" width="348" height="176" rx="12" fill="#b200ff" />
                <path d="M36 296 H384 V328 Q384 340 372 340 H48 Q36 340 36 328 Z" fill="#8f00cc" />
                <rect x="30" y="156" width="360" height="30" rx="8" fill="#d36bff" />
                <rect x="96" y="156" width="26" height="184" fill="#fbea04" />
                <rect x="298" y="156" width="26" height="184" fill="#fbea04" />
                {[[109, 176], [109, 326], [311, 176], [311, 326]].map(([cx, cy]) => (
                  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" fill="#000" opacity="0.5" />
                ))}
                <rect x="190" y="172" width="48" height="52" rx="8" fill="#000" />
                <rect x="186" y="168" width="48" height="52" rx="8" fill="#fbea04" />
                <circle cx="210" cy="190" r="7" fill="#000" />
                <rect x="207" y="192" width="6" height="15" fill="#000" />
                <g fontSize="46" fontStyle="italic" textAnchor="middle" className="font-display">
                  <text x="213" y="265" fill="#000">TAP</text>
                  <text x="210" y="262" fill="#fbea04">TAP</text>
                  <text x="213" y="311" fill="#000">ON ME!</text>
                  <text x="210" y="308" fill="#fbea04">ON ME!</text>
                </g>
              </svg>
              <span className="sr-only">Tap on me! Open the poster gallery</span>
            </button>
          </div>

          {/* Full-screen Poster Dump Gallery Modal */}
          {galleryOpen && (
            <motion.div 
              role="dialog"
              aria-modal="true"
              aria-label="Poster gallery"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bricks fixed inset-0 z-[600] overflow-y-auto bg-forest text-white"
            >
              <button 
                type="button" 
                onClick={() => setGalleryOpen(false)}
                className="sticker-btn fixed top-4 right-4 z-[115] !px-4 !py-2.5 !text-xl"
              >
                Close <X className="h-5 w-5 inline" />
              </button>

              <div className="mx-auto max-w-[1200px] px-5 pt-24 pb-24 text-center">
                <h2 className="font-display flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-[clamp(2.4rem,6vw,5rem)] leading-none">
                  <span className="text-black [text-shadow:0.05em_0.05em_0_#fff]">THE</span>
                  <span className="label-hl !bg-[#e6e6e6] !text-black">POSTER DUMP</span>
                </h2>
                <p className="mx-auto mt-6 text-center text-lg font-medium text-white/80">
                  Tap any poster to see it up close.
                </p>

                <ul className="mt-16 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
                  {posters.map((p, idx) => (
                    <li key={p.id}>
                      <button 
                        type="button"
                        onClick={() => setSelectedPoster(p)}
                        className="group mx-auto block w-full max-w-[340px] text-left outline-offset-8"
                      >
                        <span 
                          className="relative block aspect-[3/4] w-full overflow-hidden border-[5px] border-black bg-paper transition-transform duration-300 group-hover:!rotate-0 group-hover:-translate-y-2 flex flex-col items-center justify-center text-center hs-lg"
                          style={{
                            transform: `rotate(${idx % 2 ? 2 : -2}deg)`,
                            backgroundColor: p.color
                          }}
                        >
                          {p.image ? (
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-display text-4xl text-black leading-none p-6">{p.title}</span>
                          )}
                        </span>
                        <span className="mt-6 flex items-center gap-3">
                          <span className="font-display bg-yellow px-2 pt-1 pb-0.5 text-base leading-none text-black hs-sm">
                            {p.category}
                          </span>
                          <span className="font-display text-2xl leading-none text-white">
                            {p.title}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Zoom Modal for Single Poster */}
          {selectedPoster && (
            <div 
              className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-4"
              onClick={() => setSelectedPoster(null)}
            >
              <div 
                className="relative max-w-md w-full border-4 border-black bg-white p-8 hs-lg text-black"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedPoster(null)}
                  className="absolute top-4 right-4 sticker-btn !p-1.5 !text-sm"
                >
                  <X size={20} />
                </button>
                <span className="font-mono text-xs font-bold uppercase bg-yellow px-2 py-0.5 border border-black">
                  {selectedPoster.category}
                </span>
                <h3 className="font-display text-4xl uppercase mt-4">{selectedPoster.title}</h3>
                <div 
                  className="mt-6 aspect-[3/4] border-3 border-black overflow-hidden flex items-center justify-center text-center hs-sm bg-black"
                >
                  {selectedPoster.image ? (
                    <img src={selectedPoster.image} alt={selectedPoster.title} className="w-full h-full object-contain" />
                  ) : (
                    <span className="font-display text-5xl text-black">{selectedPoster.title}</span>
                  )}
                </div>
              </div>
            </div>
          )}

        </section>


        {/* ========================================================
            EDUCATION & CREDENTIALS (Electric Purple with dashed timeline)
        ======================================================== */}
        <section 
          id="education" 
          className="grid-frame relative overflow-hidden bg-purple pt-20 pb-20 text-white md:pt-28 md:pb-24 border-b-4 border-black"
        >
          {/* Section Notch */}
          <SectionNotch color="#e8e8e8" />

          <div className="relative z-10 px-4 text-center">
            <h2 className="font-display flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-[clamp(2.4rem,6.2vw,5.2rem)] leading-none">
              <GlyphClover color="#fbea04" size={52} className="shrink-0 -mt-1 hidden sm:block" />
              <span className="text-black [text-shadow:0.05em_0.05em_0_#fff]">MY</span>
              <span className="label-hl !bg-[#e6e6e6] !text-black">EDUCATION</span>
              <GlyphLeaves color="#ff0808" size={52} className="shrink-0 -mt-1 hidden sm:block" />
            </h2>
          </div>

          <div className="relative z-10 mx-auto mt-10 max-w-[1440px] md:mt-16">
            <div className="dashed-h mx-[4.5%]" />

            {[
              {
                institution: "Srajan College of Design, Pune",
                degree: "Bachelor of Science in Media Graphics and Animation",
                year: "2019 - 2022",
                grade: "Score: 75%",
                bg: "#fbea04"
              },
              {
                institution: "Nowrosjee Wadia College, Pune",
                degree: "Higher Secondary Certificate (HSC)",
                year: "2017 - 2019",
                grade: "Score: 64%",
                bg: "#afe4bb"
              }
            ].map((edu, idx) => (
              <React.Fragment key={edu.institution}>
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: 0.05 * idx, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-[4.5%] flex flex-col items-start gap-4 px-3 py-6 md:flex-row md:items-center md:gap-14 md:px-[8%] md:py-9"
                >
                  <div 
                    className="font-display flex h-[54px] w-[150px] shrink-0 items-center justify-center text-[1.5rem] leading-none text-black md:h-[120px] md:w-[240px] md:text-[2.1rem]"
                    style={{ background: edu.bg, boxShadow: "7px 7px 0 #000" }}
                  >
                    {edu.year}
                  </div>
                  <div>
                    <h3 className="font-display text-[1.5rem] leading-[1.05] text-white md:text-[2.5rem]">
                      {edu.institution}
                    </h3>
                    <p className="mt-2 text-lg font-medium text-white">{edu.degree}</p>
                    <p className="mt-0.5 text-base text-white/80">{edu.grade}</p>
                  </div>
                </motion.div>
                <div className="dashed-h mx-[4.5%]" />
              </React.Fragment>
            ))}
          </div>

          {/* Experience Timeline */}
          <div id="experience" className="relative z-10 px-4 text-center mt-20">
            <h2 className="font-display flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-[clamp(2.4rem,6.2vw,5.2rem)] leading-none">
              <span className="text-black [text-shadow:0.05em_0.05em_0_#fff]">AGENCY</span>
              <span className="label-hl !bg-yellow !text-black">EXPERIENCE</span>
            </h2>
          </div>

          <div className="relative z-10 mx-auto mt-10 max-w-[1440px] md:mt-16">
            <div className="dashed-h mx-[4.5%]" />

            {[
              {
                company: "Ample Technologies",
                role: "Graphic Designer / Video Editor",
                year: "Feb 2024 - Jul 2024",
                desc: "Assisted in editing raw video footage, applying colour grading, audio synchronization, and basic motion graphics to enhance production value of digital content.",
                bg: "#f5009b",
                ink: "#fff"
              },
              {
                company: "Webasha Technologies",
                role: "Graphic Designer / Video Editor",
                year: "Apr 2023 - Sep 2023",
                desc: "Spearheaded creation of engaging multimedia content: video edits, motion graphics, and digital design assets for diverse campaigns delivered within established deadlines.",
                bg: "#63c636",
                ink: "#000"
              }
            ].map((exp, idx) => (
              <React.Fragment key={exp.company}>
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: 0.05 * idx, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-[4.5%] flex flex-col items-start gap-4 px-3 py-6 md:flex-row md:items-center md:gap-14 md:px-[8%] md:py-9"
                >
                  <div 
                    className="font-display flex h-[54px] w-[180px] shrink-0 items-center justify-center text-[1.2rem] leading-none md:h-[120px] md:w-[240px] md:text-[1.8rem]"
                    style={{ background: exp.bg, color: exp.ink, boxShadow: "7px 7px 0 #000" }}
                  >
                    {exp.year}
                  </div>
                  <div>
                    <h3 className="font-display text-[1.5rem] leading-[1.05] text-white md:text-[2.5rem]">
                      {exp.company}
                    </h3>
                    <p className="mt-1 font-mono text-sm font-bold text-yellow">{exp.role}</p>
                    <p className="mt-2 text-base text-white/90 max-w-3xl leading-relaxed">{exp.desc}</p>
                  </div>
                </motion.div>
                <div className="dashed-h mx-[4.5%]" />
              </React.Fragment>
            ))}
          </div>

        </section>


        {/* ========================================================
            ABOUT ME & MY TOOLBOX SECTION (Paper Background)
        ======================================================== */}
        <section id="about" className="relative overflow-x-clip bg-paper pt-20 pb-20 md:pt-28 md:pb-28">
          <div className="mx-auto grid max-w-[1200px] items-start gap-x-16 gap-y-14 px-6 md:grid-cols-[1.1fr_0.9fr] md:gap-y-0 md:px-10">
            
            {/* Story */}
            <div className="md:col-start-1">
              <h2 className="font-display flex flex-wrap items-center gap-x-5 gap-y-3 text-[clamp(2.2rem,4.4vw,4.2rem)] leading-none">
                <GlyphDiamond color="#f5009b" size={56} className="shrink-0" />
                <span className="whitespace-nowrap">I AM</span>
                <span className="label-hl !bg-pink !text-white">PRANAV BHANDARE</span>
              </h2>

              <div className="mt-10 space-y-6 text-[1.05rem] leading-relaxed font-medium text-black/70 md:text-lg">
                <p>
                  I'm a <strong className="font-bold text-black">Video Editor and Visual Creative</strong> with hands-on experience across two agency-side roles, specialising in <strong className="font-bold text-black">motion graphics, video editing, and colour grading</strong>.
                </p>
                <p>
                  I'm highly proficient in the <strong className="font-bold text-black">Adobe Creative Suite</strong> (Premiere Pro, After Effects, Photoshop, Illustrator, InDesign) and <strong className="font-bold text-black">DaVinci Resolve</strong>, with work spanning campaign video edits, motion graphics, and digital design assets.
                </p>
                <p>
                  I combine technical post-production craft with typography and layout fundamentals built through my <strong className="font-bold text-black">B.Sc. in Media Graphics and Animation</strong>.
                </p>
              </div>

              {/* Toolbox with Tilted Colorful Badge Pills */}
              <div className="mt-12">
                <h3 className="font-display mb-2 text-3xl leading-none text-black md:text-4xl">
                  My toolbox
                </h3>
                <div className="space-y-8 pt-4">
                  {toolbox.map((box) => (
                    <div key={box.title}>
                      <p className="mb-3 text-sm font-bold tracking-[0.18em] text-black/65 uppercase">
                        {box.title}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-4">
                        {box.items.map((item, iIdx) => (
                          <motion.span 
                            key={item}
                            whileHover={{ scale: 1.06, rotate: 0 }}
                            style={{
                              transform: `rotate(${pillRotations[iIdx % pillRotations.length]}deg)`,
                              backgroundColor: box.colors[0],
                              color: box.colors[1],
                              boxShadow: "3px 3px 0 #000",
                              border: "2px solid #000"
                            }}
                            className="font-display inline-block px-3.5 pt-1.5 pb-1 text-base md:text-lg leading-none cursor-default select-none"
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Interactive Video Console & Printer (Matching Reference Widget!) */}
            <div className="md:sticky md:top-24 md:col-start-2 md:row-span-2 md:row-start-1">
              <InteractivePrinter />

              {/* Video Suite Production Specs & Status (Replaces generic resume card!) */}
              <div className="mx-auto mt-6 w-[min(90vw,400px)] border-4 border-black bg-white p-5 hs-lg space-y-3">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-black">
                    <span className="h-2.5 w-2.5 rounded-full bg-green animate-pulse" />
                    <span>SUITE STATUS: OPEN</span>
                  </div>
                  <span className="font-mono text-[10px] bg-yellow text-black border border-black px-1.5 py-0.5 font-bold uppercase">
                    PUNE • INDIA
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="border-2 border-black bg-[#f4f4f4] p-2.5">
                    <span className="block text-[9px] uppercase tracking-wider text-black/60 font-bold">PRIMARY NLE</span>
                    <span className="font-bold text-black text-xs">Premiere + Resolve</span>
                  </div>
                  <div className="border-2 border-black bg-[#f4f4f4] p-2.5">
                    <span className="block text-[9px] uppercase tracking-wider text-black/60 font-bold">SPEED / SLA</span>
                    <span className="font-bold text-pink text-xs">24-48h Fast Turnaround</span>
                  </div>
                  <div className="border-2 border-black bg-[#f4f4f4] p-2.5">
                    <span className="block text-[9px] uppercase tracking-wider text-black/60 font-bold">MASTER PIPELINE</span>
                    <span className="font-bold text-black text-xs">4K UHD / ProRes 422</span>
                  </div>
                  <div className="border-2 border-black bg-[#f4f4f4] p-2.5">
                    <span className="block text-[9px] uppercase tracking-wider text-black/60 font-bold">PORTFOLIO</span>
                    <a 
                      href="https://cineaurastudios.my.canva.site/portfolio" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-bold text-purple hover:underline text-xs flex items-center gap-1"
                    >
                      cineaurastudios ↗
                    </a>
                  </div>
                </div>

                <a 
                  href="#contact" 
                  className="sticker-btn !w-full justify-center !mt-3 !bg-yellow !text-black !py-2.5 !text-lg"
                >
                  ⚡ BOOK AN EDITING SESSION
                </a>
              </div>
            </div>

          </div>
        </section>


        {/* ========================================================
            CONTACT SECTION / FOOTER (Matching First Section Purple)
        ======================================================== */}
        <section id="contact" className="relative bg-purple pt-16 pb-24 border-t-4 border-black text-white">
          <div className="mx-auto max-w-5xl px-6">
            
            {/* The Famous "LET'S MEET!" Card */}
            <div className="border-4 border-black bg-white p-8 md:p-14 hs-lg relative overflow-hidden text-black">
              <div className="relative z-10">
                <span className="border-2 border-black bg-mint px-3 py-1 font-mono text-xs uppercase font-bold tracking-widest hs-sm">
                  THAT'S A WRAP? MAYBE NOT.
                </span>

                <h2 className="font-display text-[clamp(2.8rem,7vw,6rem)] leading-none mt-4">
                  LET'S <span className="label-hl !bg-yellow !text-black">MEET!</span>
                </h2>

                <p className="mt-4 max-w-2xl text-base md:text-xl font-medium text-black/80 leading-relaxed">
                  Open to 👁️ conversations, 🤝 collabs, 🧠 creative challenges, 🎬 video editing, motion design, or discussing your next big visual campaign.
                </p>

                {/* Direct Contact Details */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Email Box with 1-Click Copy */}
                  <div className="border-3 border-black bg-paper p-4 hs-sm flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-yellow border-2 border-black p-2 shrink-0">
                        <Mail size={20} />
                      </div>
                      <div className="truncate">
                        <span className="font-mono text-[10px] text-black/60 uppercase block">Email Address</span>
                        <span className="font-mono text-sm font-bold truncate block">beyondgreatest33@gmail.com</span>
                      </div>
                    </div>
                    <button 
                      onClick={copyEmail}
                      className="border-2 border-black bg-white px-3 py-1.5 font-display text-xs uppercase hs-sm hover:bg-yellow transition-colors shrink-0 flex items-center gap-1"
                    >
                      {copied ? (
                        <>
                          <Check size={14} className="text-green-600 stroke-[3]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Phone Box */}
                  <div className="border-3 border-black bg-paper p-4 hs-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-mint border-2 border-black p-2 shrink-0">
                        <Phone size={20} />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-black/60 uppercase block">Phone / Mobile</span>
                        <a href="tel:+918766569752" className="font-mono text-sm font-bold hover:text-pink">
                          +91 8766569752
                        </a>
                      </div>
                    </div>
                    <a 
                      href="tel:+918766569752"
                      className="border-2 border-black bg-white px-3 py-1.5 font-display text-xs uppercase hs-sm hover:bg-mint transition-colors shrink-0"
                    >
                      Call
                    </a>
                  </div>

                </div>

                {/* Bottom Action Row */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a 
                    href="mailto:beyondgreatest33@gmail.com" 
                    className="sticker-btn !bg-yellow"
                  >
                    <Mail size={18} />
                    <span>Send Email</span>
                  </a>
                  <a 
                    href="https://wa.me/918766569752?text=Hi%20Pranav,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project!" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => playClickSound()}
                    className="sticker-btn !bg-[#25D366] !text-black hover:!bg-[#20bd5a] flex items-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.336 11.893-11.893a11.821 11.821 0 00-3.48-8.414z"/>
                    </svg>
                    <span>WhatsApp Chat</span>
                  </a>
                  <a 
                    href="https://cineaurastudios.my.canva.site/portfolio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="sticker-btn !bg-pink !text-white hover:!bg-black"
                  >
                    <span>Canva Portfolio</span>
                    <ArrowUpRight size={18} className="stroke-[3]" />
                  </a>
                </div>

              </div>
            </div>

            {/* Footer Bottom Bar */}
            <footer className="mt-16 border-t-3 border-black/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left text-white">
              <div>
                <span className="font-display text-2xl tracking-wider uppercase block text-white">
                  PRANAV BHANDARE
                </span>
                <p className="font-mono text-xs text-white/80 mt-1 max-w-md">
                  © {new Date().getFullYear()} • Created with 🤯 curiosity, ☕️ coffee, ❤️ craft, and 💻 way too many timeline keyframes.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <a href="#hero" className="font-display text-sm uppercase text-white hover:text-yellow transition-colors">Home</a>
                <a href="#work" className="font-display text-sm uppercase text-white hover:text-yellow transition-colors">Work</a>
                <a href="#about" className="font-display text-sm uppercase text-white hover:text-yellow transition-colors">About</a>
                <button 
                  onClick={scrollToTop} 
                  className="sticker-btn !text-xs !py-1.5 !px-3 !bg-yellow !text-black hover:!bg-white flex items-center gap-1"
                >
                  <span>Back to top</span>
                  <ArrowUp size={14} className="stroke-[3]" />
                </button>
              </div>
            </footer>

          </div>
        </section>

      </main>

      {/* QUICK VIEW MODAL FOR PROJECTS */}
      {activeModalProject && (
        <div 
          className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setActiveModalProject(null)}
        >
          <div 
            className="border-4 border-black bg-white max-w-lg w-full p-6 md:p-8 hs-lg relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveModalProject(null)}
              className="absolute top-4 right-4 border-2 border-black bg-yellow p-1.5 hs-sm hover:bg-red hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <span className="border-2 border-black bg-yellow px-3 py-1 font-mono text-xs uppercase font-bold hs-sm inline-block">
              {activeModalProject.role} • {activeModalProject.year}
            </span>

            <h3 className="font-display text-3xl uppercase mt-4">
              {activeModalProject.title}
            </h3>

            <p className="mt-4 text-base text-black/80 font-medium leading-relaxed">
              {activeModalProject.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {activeModalProject.tags.map((tag, i) => (
                <span key={i} className="border border-black bg-paper px-2.5 py-1 font-mono text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t-2 border-black/10 flex justify-between items-center">
              <a 
                href={activeModalProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="sticker-btn !text-sm !py-2 !px-4"
              >
                <span>Open Project Link</span>
                <ExternalLink size={16} />
              </a>
              <button 
                onClick={() => setActiveModalProject(null)}
                className="font-display text-sm uppercase hover:text-pink"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CINEMA SHOWREEL VIDEO MODAL */}
      <CinemaModal 
        project={cinemaProject} 
        isOpen={!!cinemaProject} 
        onClose={() => setCinemaProject(null)} 
      />

      {/* FLOATING AUDIO TOGGLE (BOTTOM-LEFT) */}
      <motion.button
        onClick={() => {
          const newState = toggleSound();
          setSoundOn(newState);
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-5 left-5 z-[300] border-3 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase hs-sm hover:bg-yellow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all flex items-center gap-1.5 cursor-pointer select-none"
        title="Toggle audio effects"
        aria-label="Toggle audio effects"
      >
        <span>{soundOn ? '🔊' : '🔇'}</span>
        <span className="hidden sm:inline">{soundOn ? 'SFX ON' : 'SFX MUTED'}</span>
      </motion.button>

      {/* PRODUCTION-READY FLOATING WHATSAPP BUTTON (BOTTOM-RIGHT) */}
      <motion.a
        href="https://wa.me/918766569752?text=Hi%20Pranav,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project!"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => playClickSound()}
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
        className="group fixed bottom-5 right-5 z-[300] flex items-center gap-2.5 border-[3.5px] border-black bg-[#25D366] px-3.5 py-2.5 md:px-4 md:py-3 text-black shadow-[4px_4px_0_#000] transition-all duration-150 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[7px_7px_0_#000] hover:bg-[#20bd5a] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_#000] cursor-pointer select-none"
        aria-label="Chat with Pranav on WhatsApp"
        title="Chat directly with Pranav on WhatsApp (+91 8766569752)"
      >
        {/* Pulsing online status indicator */}
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-35"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-black"></span>
        </span>

        {/* Official WhatsApp Vector Icon */}
        <svg 
          viewBox="0 0 24 24" 
          className="h-5 w-5 md:h-6 md:w-6 fill-black shrink-0 transition-transform duration-200 group-hover:scale-110" 
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.336 11.893-11.893a11.821 11.821 0 00-3.48-8.414z"/>
        </svg>

        {/* Text Label */}
        <span className="font-display text-sm md:text-base font-bold tracking-wide uppercase">
          <span className="hidden sm:inline">Chat on </span>WhatsApp
        </span>
      </motion.a>

    </div>
  );
}
