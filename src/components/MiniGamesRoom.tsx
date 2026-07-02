import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RefreshCw, Send, Check } from 'lucide-react';

type GameId = 'cake' | 'flowers' | 'bears' | 'bunny' | 'swan' | 'strawberries' | 'letter';

interface Topping {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

interface FlowerStem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
}

const BOUQUET_SLOTS = [
  // Row 1 (Lowest, closest to vase mouth, dense base)
  { x: 50, y: 35, rotation: 0 },
  { x: 41, y: 33, rotation: -12 },
  { x: 59, y: 33, rotation: 12 },
  { x: 32, y: 31, rotation: -22 },
  { x: 68, y: 31, rotation: 22 },

  // Row 2 (Middle crown, forming the body of the dome)
  { x: 50, y: 24, rotation: 0 },
  { x: 41, y: 22, rotation: -12 },
  { x: 59, y: 22, rotation: 12 },
  { x: 32, y: 20, rotation: -25 },
  { x: 68, y: 20, rotation: 25 },

  // Row 3 (Upper crown, high blossoms)
  { x: 50, y: 12, rotation: 0 },
  { x: 41, y: 10, rotation: -15 },
  { x: 59, y: 10, rotation: 15 },
  { x: 30, y: 11, rotation: -30 },
  { x: 70, y: 11, rotation: 30 },

  // Row 4 (Outer filler details and extra leaves)
  { x: 23, y: 23, rotation: -40 },
  { x: 77, y: 23, rotation: 40 },
  { x: 46, y: 16, rotation: -5 },
  { x: 54, y: 16, rotation: 5 },
  { x: 36, y: 27, rotation: -15 },
  { x: 64, y: 27, rotation: 15 }
];

const renderTopping = (emoji: string) => {
  switch (emoji) {
    case '🍓': // Strawberry
      return (
        <svg className="w-7 h-8 overflow-visible filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.18)] select-none pointer-events-none" viewBox="0 0 40 48">
          <defs>
            <radialGradient id="berryGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFA6B4" />
              <stop offset="25%" stopColor="#FF4D65" />
              <stop offset="70%" stopColor="#C70020" />
              <stop offset="100%" stopColor="#66000E" />
            </radialGradient>
            <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9BDD7C" />
              <stop offset="100%" stopColor="#25602E" />
            </linearGradient>
          </defs>
          {/* Leaves / Calyx */}
          <path d="M20 12 C18 5, 11 5, 9 9 C14 11, 18 13, 20 14 C22 13, 26 11, 31 9 C29 5, 22 5, 20 12 Z" fill="url(#leafGrad)" />
          <path d="M20 12 C20 4, 18 1, 18 1 C18 1, 19.5 5, 20 12 Z" stroke="#3F7A49" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M15 11 C10 6, 5 9, 4 14 C8 14, 12 13, 15 11 Z" fill="url(#leafGrad)" opacity="0.95" />
          <path d="M25 11 C30 6, 35 9, 36 14 C32 14, 28 13, 25 11 Z" fill="url(#leafGrad)" opacity="0.95" />
          {/* Strawberry Body */}
          <path d="M20 12 C10 12, 3 19, 4 30 C5 39, 13 47, 20 47 C27 47, 35 39, 36 30 C37 19, 30 12, 20 12 Z" fill="url(#berryGrad)" />
          {/* Glossy Specular Highlight */}
          <path d="M8 22 C5.5 25, 6 31, 8.5 33 C7.5 29, 7.5 24, 10 20 C9 20, 8.5 21, 8 22 Z" fill="#FFE5E9" opacity="0.65" />
          {/* High contrast golden seeds */}
          <ellipse cx="14" cy="20" rx="0.6" ry="1.2" fill="#FDE047" opacity="0.95" transform="rotate(-15, 14, 20)" />
          <ellipse cx="26" cy="20" rx="0.6" ry="1.2" fill="#FDE047" opacity="0.95" transform="rotate(15, 26, 20)" />
          <ellipse cx="20" cy="24" rx="0.6" ry="1.2" fill="#FDE047" opacity="0.95" />
          <ellipse cx="12" cy="28" rx="0.6" ry="1.2" fill="#FDE047" opacity="0.95" transform="rotate(-10, 12, 28)" />
          <ellipse cx="28" cy="28" rx="0.6" ry="1.2" fill="#FDE047" opacity="0.95" transform="rotate(10, 28, 28)" />
          <ellipse cx="18" cy="32" rx="0.6" ry="1.2" fill="#FDE047" opacity="0.95" transform="rotate(-5, 18, 32)" />
          <ellipse cx="22" cy="32" rx="0.6" ry="1.2" fill="#FDE047" opacity="0.95" transform="rotate(5, 22, 32)" />
          <ellipse cx="15" cy="37" rx="0.5" ry="1" fill="#FDE047" opacity="0.9" transform="rotate(-10, 15, 37)" />
          <ellipse cx="25" cy="37" rx="0.5" ry="1" fill="#FDE047" opacity="0.9" transform="rotate(10, 25, 37)" />
          <ellipse cx="20" cy="41" rx="0.5" ry="1" fill="#FDE047" opacity="0.8" />
        </svg>
      );
    case '🍒': // Cherry
      return (
        <svg className="w-7 h-7 overflow-visible filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.18)] select-none pointer-events-none" viewBox="0 0 48 48">
          <defs>
            <radialGradient id="cherryGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FF6685" />
              <stop offset="35%" stopColor="#C21230" />
              <stop offset="75%" stopColor="#700010" />
              <stop offset="100%" stopColor="#300004" />
            </radialGradient>
          </defs>
          {/* Detailed joint and leaf stems */}
          <path d="M25 4 C24 13, 14 18, 14 31" fill="none" stroke="#526F41" strokeWidth="2" strokeLinecap="round" />
          <path d="M25 4 C27 13, 32 18, 32 31" fill="none" stroke="#526F41" strokeWidth="2" strokeLinecap="round" />
          {/* Glossy green leaf */}
          <path d="M25 4 C21 0.5, 15 2.5, 15 2.5 C15 2.5, 19 6.5, 24 4.5 Z" fill="#60C16C" stroke="#46924F" strokeWidth="0.5" />
          {/* Joint bulb */}
          <circle cx="25" cy="4" r="1.5" fill="#3D5331" />
          {/* Left Cherry */}
          <circle cx="14" cy="31" r="7.5" fill="url(#cherryGrad)" />
          <ellipse cx="11.5" cy="28.5" rx="2" ry="1" fill="#FFFFFF" opacity="0.75" transform="rotate(-15, 11.5, 28.5)" />
          <path d="M14 23.5 Q14.5 24.5, 13 25" fill="none" stroke="#3A0005" strokeWidth="0.6" />
          {/* Right Cherry */}
          <circle cx="32" cy="31" r="7.5" fill="url(#cherryGrad)" />
          <ellipse cx="29.5" cy="28.5" rx="2" ry="1" fill="#FFFFFF" opacity="0.75" transform="rotate(-15, 29.5, 28.5)" />
          <path d="M32 23.5 Q32.5 24.5, 31 25" fill="none" stroke="#3A0005" strokeWidth="0.6" />
        </svg>
      );
    case '🍪': // Chocolate Cookie
      return (
        <svg className="w-7.5 h-7.5 overflow-visible filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.18)] select-none pointer-events-none" viewBox="0 0 32 32">
          <defs>
            <radialGradient id="cookieGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#E5B98A" />
              <stop offset="60%" stopColor="#C48C56" />
              <stop offset="100%" stopColor="#8C582B" />
            </radialGradient>
            <radialGradient id="chipGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#613D24" />
              <stop offset="100%" stopColor="#281408" />
            </radialGradient>
          </defs>
          <circle cx="16" cy="16" r="14" fill="url(#cookieGrad)" stroke="#7C4C24" strokeWidth="0.5" />
          {/* Shading/texture cracks */}
          <path d="M6 13 Q11 11, 16 13 T26 10" fill="none" stroke="#9A6133" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <path d="M10 22 Q16 19, 24 21" fill="none" stroke="#9A6133" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <path d="M14 7 Q17 10, 19 8" fill="none" stroke="#9A6133" strokeWidth="0.8" opacity="0.4" />
          {/* Textured cookie crumbs */}
          <circle cx="9" cy="16" r="0.4" fill="#6A3B18" opacity="0.6" />
          <circle cx="21" cy="17" r="0.5" fill="#6A3B18" opacity="0.6" />
          <circle cx="13" cy="24" r="0.4" fill="#6A3B18" opacity="0.6" />
          {/* Chocolate chips with beautiful realistic protrusion bevels */}
          <g>
            <circle cx="11" cy="11" r="2.8" fill="url(#chipGrad)" />
            <circle cx="20.5" cy="13.5" r="2.4" fill="url(#chipGrad)" />
            <circle cx="15.5" cy="19.5" r="3" fill="url(#chipGrad)" />
            <circle cx="22" cy="21" r="2" fill="url(#chipGrad)" />
            <circle cx="15" cy="9" r="1.8" fill="url(#chipGrad)" />
          </g>
        </svg>
      );
    case '🎀': // Coquette Satin Bow
      return (
        <svg className="w-8.5 h-7.5 overflow-visible filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.18)] select-none pointer-events-none" viewBox="0 0 44 32">
          <defs>
            <linearGradient id="bowGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF2F4" />
              <stop offset="35%" stopColor="#FFA1A8" />
              <stop offset="80%" stopColor="#FF6673" />
              <stop offset="100%" stopColor="#C92A36" />
            </linearGradient>
            <linearGradient id="knotGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFA3A9" />
              <stop offset="100%" stopColor="#C4303E" />
            </linearGradient>
          </defs>
          {/* Left Ribbon Loop */}
          <path d="M22 14 C16 4, 3 3, 2 13 C1 21, 12 21, 22 15 Z" fill="url(#bowGrad)" stroke="#FFA3A9" strokeWidth="0.5" />
          <path d="M22 14 C17 8, 8 7, 5 12" fill="none" stroke="#FFF2F4" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
          {/* Right Ribbon Loop */}
          <path d="M22 14 C28 4, 41 3, 42 13 C43 21, 32 21, 22 15 Z" fill="url(#bowGrad)" stroke="#FFA3A9" strokeWidth="0.5" />
          <path d="M22 14 C27 8, 36 7, 39 12" fill="none" stroke="#FFF2F4" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
          {/* Ribbon Tails */}
          <path d="M20 16 L11 29 C9 32, 5 31, 7 28 L18 16 Z" fill="#FF5E6C" stroke="#C4303E" strokeWidth="0.4" />
          <path d="M24 16 L33 29 C35 32, 39 31, 37 28 L26 16 Z" fill="#FF5E6C" stroke="#C4303E" strokeWidth="0.4" />
          {/* Knot */}
          <rect x="19" y="11" width="6" height="7.5" rx="3" fill="url(#knotGrad)" stroke="#C4303E" strokeWidth="0.5" />
          <path d="M20 12.5 Q22 14, 24 12.5" fill="none" stroke="#FFF2F4" strokeWidth="1" opacity="0.85" />
        </svg>
      );
    case '⭐': // Star sprinkle
      return (
        <svg className="w-5.5 h-5.5 overflow-visible filter drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.15)] animate-pulse select-none pointer-events-none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="starGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFBE6" />
              <stop offset="45%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" fill="url(#starGrad)" stroke="#B45309" strokeWidth="0.5" />
        </svg>
      );
    case '✨': // Sparkle
      return (
        <svg className="w-5.5 h-5.5 text-amber-300 animate-pulse filter drop-shadow-[0_1.5px_3px_rgba(252,211,77,0.5)] select-none pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0 C12 6.6, 18.4 12, 24 12 C18.4 12, 12 17.4, 12 24 C12 17.4, 5.6 12, 0 12 C5.6 12, 12 6.6, 12 0 Z" />
        </svg>
      );
    case '🕯️': // Real candle
      return (
        <div className="relative w-4 h-8 flex flex-col items-center select-none pointer-events-none filter drop-shadow-[0_1.8px_1.8px_rgba(0,0,0,0.18)]">
          {/* Flame with flickering motion */}
          <div className="w-2.5 h-3.5 bg-gradient-to-t from-[#EF4444] via-[#F59E0B] to-[#FEF08A] rounded-full animate-bounce blur-[0.2px] shadow-sm flex-shrink-0" />
          {/* Wick */}
          <div className="w-[1px] h-1 bg-stone-800 -mt-[1px]" />
          {/* Striped Candle Wax */}
          <div className="w-1.5 h-5 bg-gradient-to-b from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC] rounded-t-sm relative overflow-hidden border border-[#38BDF8]/40 shadow-inner">
            <div className="absolute inset-y-0 w-0.5 bg-[#0284C7]/40 rotate-12 left-[0px]" />
            <div className="absolute inset-y-0 w-0.5 bg-[#0284C7]/40 rotate-12 left-[2px]" />
            <div className="absolute inset-y-0 w-0.5 bg-[#0284C7]/40 rotate-12 left-[4px]" />
          </div>
        </div>
      );
    case '🌸': // Cherry Blossom
      return (
        <svg className="w-7 h-7 overflow-visible filter drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.15)] select-none pointer-events-none" viewBox="0 0 32 32">
          <defs>
            <radialGradient id="sakuraGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFA6B0" />
              <stop offset="65%" stopColor="#FFE1E5" />
              <stop offset="100%" stopColor="#FFFDFD" />
            </radialGradient>
          </defs>
          <g>
            <path d="M16 16 C12 8, 20 8, 16 16" fill="url(#sakuraGrad)" stroke="#FFA3A9" strokeWidth="0.4" transform="rotate(0, 16, 16)" />
            <path d="M16 16 C12 8, 20 8, 16 16" fill="url(#sakuraGrad)" stroke="#FFA3A9" strokeWidth="0.4" transform="rotate(72, 16, 16)" />
            <path d="M16 16 C12 8, 20 8, 16 16" fill="url(#sakuraGrad)" stroke="#FFA3A9" strokeWidth="0.4" transform="rotate(144, 16, 16)" />
            <path d="M16 16 C12 8, 20 8, 16 16" fill="url(#sakuraGrad)" stroke="#FFA3A9" strokeWidth="0.4" transform="rotate(216, 16, 16)" />
            <path d="M16 16 C12 8, 20 8, 16 16" fill="url(#sakuraGrad)" stroke="#FFA3A9" strokeWidth="0.4" transform="rotate(288, 16, 16)" />
          </g>
          {/* Realistic Pistils */}
          <circle cx="16" cy="16" r="2.2" fill="#FBBF24" stroke="#DC2626" strokeWidth="0.3" />
          <circle cx="16" cy="16" r="0.8" fill="#DC2626" />
        </svg>
      );
    case '🫐': // Blueberry
      return (
        <svg className="w-5.5 h-5.5 overflow-visible filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.18)] select-none pointer-events-none" viewBox="0 0 24 24">
          <defs>
            <radialGradient id="blueGrad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#8DA9FF" />
              <stop offset="35%" stopColor="#3F5EFB" />
              <stop offset="85%" stopColor="#1C2152" />
              <stop offset="100%" stopColor="#0A0C1F" />
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="9.5" fill="url(#blueGrad)" />
          {/* Blueberry crowns */}
          <path d="M9 5.2 L15 5.2 M12 3 L12 7 M9.5 4 L14.5 6.5" stroke="#0A0C1F" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
          <circle cx="12" cy="5" r="1.6" fill="#1C2152" opacity="0.7" />
          {/* Glaze highlight reflection */}
          <path d="M6.5 10 C5 12, 5.5 15.5, 6 16.5 C5 13, 5.5 10, 8 8.5 Z" fill="#FFFFFF" opacity="0.3" />
        </svg>
      );
    case '🧁': // Piped Cream
      return (
        <svg className="w-7.5 h-7.5 overflow-visible filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] select-none pointer-events-none" viewBox="0 0 32 32">
          <defs>
            <linearGradient id="creamGradNew" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#FFFDF5" />
              <stop offset="100%" stopColor="#EADEC9" />
            </linearGradient>
          </defs>
          <path d="M 16 2 C 12 10, 4 14, 4 21 C 4 27, 9 29, 16 29 C 23 29, 28 27, 28 21 C 28 14, 20 10, 16 2 Z" fill="url(#creamGradNew)" stroke="#D6C9B0" strokeWidth="0.4" />
          {/* Piped star ridgelines */}
          <path d="M 16 2 Q 13 13, 7 21" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 16 2 Q 15 13, 13 25" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 16 2 Q 17 13, 21 23" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 16 2 Q 20 12, 25 21" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 16 2 Q 11 14, 5 20" fill="none" stroke="#DDD1B8" strokeWidth="0.8" opacity="0.6" />
          <path d="M 16 2 Q 18 14, 23 20" fill="none" stroke="#DDD1B8" strokeWidth="0.8" opacity="0.6" />
        </svg>
      );
    case '💖': // Candy Heart
      return (
        <svg className="w-5.5 h-5.5 overflow-visible filter drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.15)] select-none pointer-events-none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFCCD1" />
              <stop offset="45%" stopColor="#FF6685" />
              <stop offset="100%" stopColor="#C9143D" />
            </linearGradient>
          </defs>
          <path d="M12 4.419C12 4.419 10.082 0 6.002 0 2.69 0 0 2.513 0 5.8 0 11.537 9.873 18.77 12 21c2.127-2.23 12-9.463 12-15.2 0-3.287-2.69-5.8-6.002-5.8-4.08 0-5.998 4.419-5.998 4.419z" fill="url(#heartGrad)" stroke="#9F0B2A" strokeWidth="0.5" />
          <path d="M6 3 C3.5 3, 2.5 5, 2.5 8 C2.5 10, 3 11, 3 11 C3 11, 3.5 7.5, 6.5 5.5 T 9 3 Z" fill="#FFFFFF" opacity="0.45" />
        </svg>
      );
    case '🍫': // Chocolate shaving curl
      return (
        <svg className="w-6 h-6 overflow-visible filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.18)] select-none pointer-events-none" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="chocCurl" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#663F28" />
              <stop offset="50%" stopColor="#4D2D1B" />
              <stop offset="100%" stopColor="#241106" />
            </linearGradient>
          </defs>
          <g transform="rotate(45, 12, 12)">
            <rect x="4" y="9" width="16" height="6.5" rx="2" fill="url(#chocCurl)" stroke="#1F0E05" strokeWidth="0.4" />
            <ellipse cx="4" cy="12.25" rx="1.5" ry="3.2" fill="#1F0E05" />
            <ellipse cx="20" cy="12.25" rx="1.5" ry="3.2" fill="#663F28" />
            <line x1="6" y1="10.5" x2="18" y2="10.5" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.35" strokeLinecap="round" />
          </g>
        </svg>
      );
    default:
      return <span className="text-xl select-none pointer-events-none">{emoji}</span>;
  }
};

export default function MiniGamesRoom() {
  const [activeGame, setActiveGame] = useState<GameId>('cake');

  // Game 1: Decorate Cake States
  const [cakeToppings, setCakeToppings] = useState<Topping[]>([]);
  const [cakeFlavor, setCakeFlavor] = useState<'pink' | 'vanilla'>('pink');
  const [selectedTopping, setSelectedTopping] = useState<string | null>(null);
  const [isCakeCandleLit, setIsCakeCandleLit] = useState(true);
  const canvasRef = React.useRef<HTMLDivElement>(null);

  // Game 2: Arrange Flowers States
  const [bouquetStems, setBouquetStems] = useState<FlowerStem[]>([]);

  // Game 3: Find Hidden Bears
  const [foundBears, setFoundBears] = useState<string[]>([]); // 'closet', 'blanket', 'desk'

  // Game 4: Feed the Bunny
  const [bunnyBites, setBunnyBites] = useState(0);
  const [isBunnyChewing, setIsBunnyChewing] = useState(false);
  const [flyingTreat, setFlyingTreat] = useState<string | null>(null);

  // Game 5: Help Swan to Lake
  const [swanPosition, setSwanPosition] = useState(10); // percentage along the path

  // Game 6: Catch Strawberries
  const [teacupX, setTeacupX] = useState(50); // percentage
  const [strawberryScore, setStrawberryScore] = useState(0);
  const [activeBerries, setActiveBerries] = useState<{ id: number; x: number; y: number; speed: number }[]>([
    { id: 1, x: 25, y: -10, speed: 2.2 },
    { id: 2, x: 55, y: -45, speed: 3.0 },
    { id: 3, x: 75, y: -75, speed: 2.5 },
  ]);

  // Game 7: Write yourself a letter
  const [letterText, setLetterText] = useState('');
  const [isLetterSent, setIsLetterSent] = useState(false);

  // --- Handlers for Game 1: Decorate Cake ---
  const playSprinkleSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.08); // D6
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      // Audio context may be blocked or unsupported
    }
  };

  const handleAddCakeTopping = (emoji: string) => {
    const nextTopping: Topping = {
      id: Date.now() + Math.random(),
      emoji,
      x: Math.random() * 40 + 30, // Centered on tiers
      y: Math.random() * 25 + 40, 
    };
    setCakeToppings((prev) => [...prev, nextTopping]);
    playSprinkleSound();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedTopping) return;
    
    // Prevent placement if clicking buttons or inputs
    const target = e.target as HTMLElement;
    if (target.closest('.interactive-obj') || target.closest('button')) {
      return;
    }

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const boundedX = Math.max(5, Math.min(95, clickX));
    const boundedY = Math.max(5, Math.min(95, clickY));

    const nextTopping: Topping = {
      id: Date.now() + Math.random(),
      emoji: selectedTopping,
      x: boundedX,
      y: boundedY,
    };
    setCakeToppings((prev) => [...prev, nextTopping]);
    playSprinkleSound();
  };

  const handleDragEnd = (id: number, info: any) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((info.point.x - rect.left) / rect.width) * 100;
    const y = ((info.point.y - rect.top) / rect.height) * 100;

    const boundedX = Math.max(4, Math.min(96, x));
    const boundedY = Math.max(4, Math.min(96, y));

    setCakeToppings((prev) =>
      prev.map((t) => (t.id === id ? { ...t, x: boundedX, y: boundedY } : t))
    );
  };

  const handleRemoveTopping = (id: number) => {
    setCakeToppings((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Handlers for Game 2: Arrange Flowers ---
  const handleAddFlowerStem = (emoji: string) => {
    const slotIdx = bouquetStems.length;
    const slot = BOUQUET_SLOTS[slotIdx % BOUQUET_SLOTS.length];
    
    // Add a tiny touch of organic randomized variation so they feel alive but perfectly symmetrical and neat
    const stem: FlowerStem = {
      id: Date.now() + Math.random(),
      emoji,
      x: slot.x - 7 + (Math.random() - 0.5) * 1.2,
      y: slot.y + (Math.random() - 0.5) * 1.2,
      rotation: slot.rotation + (Math.random() - 0.5) * 3,
    };
    setBouquetStems((prev) => [...prev, stem]);
  };

  // --- Handlers for Game 4: Feed Bunny ---
  const handleFeedBunny = (treat: 'carrot' | 'berry') => {
    setFlyingTreat(treat === 'carrot' ? '🥕' : '🍓');
    setIsBunnyChewing(true);
    setBunnyBites((b) => b + 1);
    setTimeout(() => {
      setIsBunnyChewing(false);
      setFlyingTreat(null);
    }, 800);
  };

  // --- Handlers for Game 6: Catch Strawberries ---
  const handleCatchBerry = (id: number) => {
    setStrawberryScore((s) => s + 1);
    setActiveBerries((prev) =>
      prev.map((b) =>
        b.id === id
          ? { id: b.id, x: Math.random() * 80 + 10, y: -10, speed: Math.random() * 1.5 + 2 }
          : b
      )
    );
  };

  const moveTeacup = (direction: 'left' | 'right') => {
    setTeacupX((prev) => {
      if (direction === 'left') return Math.max(5, prev - 10);
      return Math.min(95, prev + 10);
    });
  };

  // Game loop for falling strawberries
  React.useEffect(() => {
    if (activeGame !== 'strawberries') return;

    let active = true;
    const interval = setInterval(() => {
      if (!active) return;
      setActiveBerries((prev) =>
        prev.map((b) => {
          let newY = b.y + b.speed;
          
          // Collision check with teacup (at bottom, let's say y >= 80% and y <= 90%)
          // Teacup is at left: teacupX% (width of teacup is ~12%)
          const teacupLeft = teacupX - 8;
          const teacupRight = teacupX + 8;
          
          if (newY >= 80 && newY <= 90 && b.x >= teacupLeft && b.x <= teacupRight) {
            // Caught in teacup!
            setStrawberryScore((s) => s + 1);
            return {
              id: b.id,
              x: Math.random() * 80 + 10,
              y: -10,
              speed: Math.random() * 1.5 + 2,
            };
          }
          
          // If it falls off screen (y > 100)
          if (newY > 100) {
            return {
              id: b.id,
              x: Math.random() * 80 + 10,
              y: -10,
              speed: Math.random() * 1.5 + 2,
            };
          }
          
          return { ...b, y: newY };
        })
      );
    }, 45); // Smooth falling frame rate

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [activeGame, teacupX]);

  // Arrow key controls for teacup
  React.useEffect(() => {
    if (activeGame !== 'strawberries') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setTeacupX((prev) => Math.max(5, prev - 8));
      } else if (e.key === 'ArrowRight') {
        setTeacupX((prev) => Math.min(95, prev + 8));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeGame]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#FAF6F0] rounded-3xl p-6 md:p-8 border border-pink-100 relative shadow-sm">
      
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-8">
        <h1 className="font-serif text-3xl text-[#5E3A3A] tracking-wider">
          Cozy Cottage Playground
        </h1>
        <p className="font-garamond italic text-base text-[#8A7171] mt-1">
          "Relaxing micro-activities. No scores, no pressure, just simple warmth."
        </p>
      </div>

      {/* Selector ribbon buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: 'cake', label: '🎂 Decorate Cake' },
          { id: 'flowers', label: '💐 Arrange Bouquet' },
          { id: 'bears', label: '🧸 Hidden Bears' },
          { id: 'bunny', label: '🐰 Feed Bunny' },
          { id: 'swan', label: '🦢 Guide Swan' },
          { id: 'strawberries', label: '🍓 Catch Berries' },
          { id: 'letter', label: '✉️ Letter to Self' },
        ].map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id as GameId)}
            className={`px-4 py-2 rounded-full font-serif text-[11px] tracking-wider border cursor-pointer transition-all interactive-obj ${
              activeGame === game.id
                ? 'bg-[#ffb3b8] text-white border-[#ffb3b8] shadow-sm'
                : 'bg-white text-[#5E3A3A] border-[#ffd6d9] hover:bg-[#FFEBEB]'
            }`}
          >
            {game.label}
          </button>
        ))}
      </div>

      {/* Main Game Interface Frame */}
      <div className="bg-white rounded-3xl border border-[#ffb3b8]/30 min-h-[420px] shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
        
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-100 via-pink-200 to-amber-100 pointer-events-none" />

        <AnimatePresence mode="wait">
          
          {/* 1. DECORATE A CAKE */}
          {activeGame === 'cake' && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col md:grid md:grid-cols-12 gap-6 items-center"
            >
              {/* Left Side: Cake decorating area */}
              <div 
                ref={canvasRef}
                onClick={handleCanvasClick}
                className={`md:col-span-7 bg-[#FFF8F9] rounded-2xl border border-pink-100 min-h-[430px] md:h-[490px] w-full relative flex flex-col items-center justify-center p-4 overflow-hidden shadow-inner select-none transition-all duration-300 ${
                  selectedTopping ? 'cursor-crosshair ring-2 ring-pink-200 ring-offset-2' : 'cursor-default'
                }`}
              >
                {/* Dainty backdrop details */}
                <div className="absolute top-3 left-4 flex items-center gap-1.5 text-[#8A7171]/60 font-serif text-[10px] pointer-events-none">
                  <div className="w-1.5 h-1.5 bg-[#ffb3b8] rounded-full animate-pulse" />
                  <span>Interactive Baking Studio</span>
                </div>

                {/* Main Cake Assembly */}
                <div className="relative w-[320px] h-[250px] flex flex-col justify-end items-center pb-6 overflow-visible mt-4 pointer-events-none">
                  
                  {/* Scalloped Vintage Porcelain Cake Stand (3D Perspective) */}
                  <div className="absolute bottom-[2px] w-[340px] h-[55px] flex flex-col items-center overflow-visible z-[1]">
                    {/* Soft ambient table shadow under stand */}
                    <div className="absolute bottom-[-6px] w-[280px] h-3 bg-stone-900/10 blur-md rounded-full" />
                    
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 340 55">
                      <defs>
                        <linearGradient id="standPlateGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="60%" stopColor="#F5F3ED" />
                          <stop offset="100%" stopColor="#DDD8CD" />
                        </linearGradient>
                        <linearGradient id="pedestalGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#C4BFAF" />
                          <stop offset="30%" stopColor="#EBE7DE" />
                          <stop offset="70%" stopColor="#FFFFFF" />
                          <stop offset="100%" stopColor="#B5AFA0" />
                        </linearGradient>
                      </defs>
                      {/* Stand base pedestal with fluting */}
                      <path d="M140 18 L130 50 C130 53, 210 53, 210 50 L200 18 Z" fill="url(#pedestalGrad)" stroke="#C4BFAF" strokeWidth="0.5" />
                      <path d="M152 20 L146 48" stroke="#DDD8CD" strokeWidth="1" />
                      <path d="M170 18 L170 49" stroke="#DDD8CD" strokeWidth="1" />
                      <path d="M188 20 L194 48" stroke="#DDD8CD" strokeWidth="1" />
                      
                      {/* Pedestal bottom rim ellipse */}
                      <ellipse cx="170" cy="50" rx="40" ry="4" fill="#C4BFAF" opacity="0.4" />
                      
                      {/* Stand Plate Rim (3D Ellipse) */}
                      <ellipse cx="170" cy="18" rx="150" ry="14" fill="url(#standPlateGrad)" stroke="#C4BFAF" strokeWidth="0.8" />
                      <ellipse cx="170" cy="16" rx="146" ry="12" fill="#FAF9F6" />
                      
                      {/* Vintage Scalloped edge details underneath the rim */}
                      {Array.from({ length: 22 }).map((_, i) => {
                        const angle = (i / 21) * Math.PI; // Semicircle on front half
                        const cx = 170 - 146 * Math.cos(angle);
                        const cy = 18 + 12 * Math.sin(angle);
                        return (
                          <circle key={i} cx={cx} cy={cy} r="3.5" fill="#EAE7DE" stroke="#C4BFAF" strokeWidth="0.4" />
                        );
                      })}
                    </svg>
                  </div>

                  {/* BOTTOM TIER (The Larger Cylinder - Beautifully 3D) */}
                  <div className="absolute bottom-[22px] w-[240px] h-[95px] z-[2] overflow-visible flex items-end justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 240 95">
                      <defs>
                        {/* Shading gradients based on selected flavor */}
                        {cakeFlavor === 'pink' ? (
                          <>
                            <linearGradient id="bottomTierSide" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#C95F6F" />
                              <stop offset="15%" stopColor="#F98A9B" />
                              <stop offset="45%" stopColor="#FFE1E5" />
                              <stop offset="80%" stopColor="#FF9AA7" />
                              <stop offset="100%" stopColor="#C95F6F" />
                            </linearGradient>
                            <radialGradient id="bottomTierTop" cx="50%" cy="30%" r="50%">
                              <stop offset="0%" stopColor="#FFF4F6" />
                              <stop offset="70%" stopColor="#FFC2CC" />
                              <stop offset="100%" stopColor="#FFA6B6" />
                            </radialGradient>
                          </>
                        ) : (
                          <>
                            <linearGradient id="bottomTierSide" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#9C7B53" />
                              <stop offset="15%" stopColor="#CEB18C" />
                              <stop offset="45%" stopColor="#FDF8EE" />
                              <stop offset="80%" stopColor="#E4D3B6" />
                              <stop offset="100%" stopColor="#9C7B53" />
                            </linearGradient>
                            <radialGradient id="bottomTierTop" cx="50%" cy="30%" r="50%">
                              <stop offset="0%" stopColor="#FFFFFC" />
                              <stop offset="70%" stopColor="#EDE0C4" />
                              <stop offset="100%" stopColor="#DFCFA9" />
                            </radialGradient>
                          </>
                        )}
                        <linearGradient id="pipingShadow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
                          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                        </linearGradient>
                      </defs>

                      {/* Side Wall of Cylinder */}
                      <path d="M 10 24 L 10 74 C 10 90, 230 90, 230 74 L 230 24 Z" fill="url(#bottomTierSide)" />

                      {/* Top Face Ellipse of Cylinder */}
                      <ellipse cx="120" cy="24" rx="110" ry="18" fill="url(#bottomTierTop)" stroke={cakeFlavor === 'pink' ? '#FFA6B6' : '#DFCFA9'} strokeWidth="0.5" />

                      {/* Soft ambient shadow under top edge piping */}
                      <ellipse cx="120" cy="26" rx="108" ry="17" fill="none" stroke="url(#pipingShadow)" strokeWidth="4" />

                      {/* French Swag Piping (Cream ribbons looping around the front half cylinder wall) */}
                      {/* Left Swag */}
                      <path d="M 22 36 Q 65 64, 120 44" fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
                      <path d="M 22 36 Q 65 64, 120 44" fill="none" stroke={cakeFlavor === 'pink' ? '#FFD0D6' : '#EAE0C9'} strokeWidth="2" strokeLinecap="round" />
                      
                      {/* Right Swag */}
                      <path d="M 120 44 Q 175 64, 218 36" fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
                      <path d="M 120 44 Q 175 64, 218 36" fill="none" stroke={cakeFlavor === 'pink' ? '#FFD0D6' : '#EAE0C9'} strokeWidth="2" strokeLinecap="round" />

                      {/* Tiny royal icing drop loops below swags */}
                      <path d="M 35 44 Q 65 68, 95 50" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
                      <path d="M 145 50 Q 175 68, 205 44" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />

                      {/* Pearls at swag nodes */}
                      <circle cx="22" cy="36" r="4.5" fill="#FFFDF9" stroke="#E2DEC9" strokeWidth="0.5" />
                      <circle cx="120" cy="44" r="4.5" fill="#FFFDF9" stroke="#E2DEC9" strokeWidth="0.5" />
                      <circle cx="218" cy="36" r="4.5" fill="#FFFDF9" stroke="#E2DEC9" strokeWidth="0.5" />
                      
                      <circle cx="22" cy="35" r="1.5" fill="#FFFFFF" />
                      <circle cx="120" cy="43" r="1.5" fill="#FFFFFF" />
                      <circle cx="218" cy="35" r="1.5" fill="#FFFFFF" />

                      {/* Cream border piping star rosettes around the curved base of bottom tier */}
                      {Array.from({ length: 11 }).map((_, i) => {
                        const angle = (i / 10) * Math.PI; // Semicircle on front half
                        const cx = 120 - 110 * Math.cos(angle);
                        const cy = 74 + 14 * Math.sin(angle);
                        return (
                          <g key={i}>
                            {/* Shadow */}
                            <circle cx={cx} cy={cy + 1.5} r="7.5" fill="rgba(0,0,0,0.12)" />
                            {/* Piped star */}
                            <circle cx={cx} cy={cy} r="7" fill="#FFFFFF" stroke="#EFE9DD" strokeWidth="0.4" />
                            {/* Inner swirl details */}
                            <path d={`M ${cx-4} ${cy-1} Q ${cx} ${cy-5}, ${cx+2} ${cy-2} Q ${cx-1} ${cy+3}, ${cx+4} ${cy+1}`} fill="none" stroke="#F6F0E2" strokeWidth="1.2" />
                            <circle cx={cx} cy={cy} r="1.5" fill={cakeFlavor === 'pink' ? '#FFB3B8' : '#DFCFA9'} />
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* TOP TIER (The Smaller Cylinder - Beautifully 3D) */}
                  <div className="absolute bottom-[92px] w-[170px] h-[80px] z-[3] overflow-visible flex items-end justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 170 80">
                      <defs>
                        {cakeFlavor === 'pink' ? (
                          <>
                            <linearGradient id="topTierSide" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#D96677" />
                              <stop offset="15%" stopColor="#FFA1AF" />
                              <stop offset="45%" stopColor="#FFF0F2" />
                              <stop offset="80%" stopColor="#FFB3BD" />
                              <stop offset="100%" stopColor="#D96677" />
                            </linearGradient>
                            <radialGradient id="topTierTop" cx="50%" cy="30%" r="50%">
                              <stop offset="0%" stopColor="#FFF7F8" />
                              <stop offset="70%" stopColor="#FFD1D6" />
                              <stop offset="100%" stopColor="#FFB3BD" />
                            </radialGradient>
                            {/* Strawberry Glaze Drop */}
                            <linearGradient id="glazeGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#FF2E48" />
                              <stop offset="100%" stopColor="#B50017" />
                            </linearGradient>
                          </>
                        ) : (
                          <>
                            <linearGradient id="topTierSide" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#A8865D" />
                              <stop offset="15%" stopColor="#D3B896" />
                              <stop offset="45%" stopColor="#FFFFFC" />
                              <stop offset="80%" stopColor="#ECDDBF" />
                              <stop offset="100%" stopColor="#A8865D" />
                            </linearGradient>
                            <radialGradient id="topTierTop" cx="50%" cy="30%" r="50%">
                              <stop offset="0%" stopColor="#FFFFFF" />
                              <stop offset="70%" stopColor="#F2E6CD" />
                              <stop offset="100%" stopColor="#ECDDBF" />
                            </radialGradient>
                            {/* Translucent Honey/Cream glaze */}
                            <linearGradient id="glazeGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#F5B942" />
                              <stop offset="100%" stopColor="#D48A00" />
                            </linearGradient>
                          </>
                        )}
                        <linearGradient id="glazeHighlight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FFFFFF" opacity="0.8" />
                          <stop offset="100%" stopColor="#FFFFFF" opacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Side Wall of Cylinder */}
                      <path d="M 8 18 L 8 60 C 8 72, 162 72, 162 60 L 162 18 Z" fill="url(#topTierSide)" />

                      {/* Top Face Ellipse of Cylinder */}
                      <ellipse cx="85" cy="18" rx="77" ry="12" fill="url(#topTierTop)" stroke={cakeFlavor === 'pink' ? '#FFB3BD' : '#ECDDBF'} strokeWidth="0.5" />

                      {/* Beautiful dripping chocolate/strawberry/honey glaze over the top edge */}
                      <path d="M 8 18 
                               C 20 28, 25 18, 30 18 
                               C 35 29, 42 34, 46 22 
                               C 50 14, 55 18, 62 18 
                               C 70 32, 75 36, 80 20 
                               C 85 14, 92 18, 98 18 
                               C 105 32, 112 28, 116 20 
                               C 120 12, 126 18, 134 18 
                               C 140 28, 148 30, 154 20 
                               C 158 15, 160 18, 162 18 
                               C 162 30, 8 30, 8 18 Z" 
                            fill="url(#glazeGrad)" stroke={cakeFlavor === 'pink' ? '#9E0012' : '#AC7000'} strokeWidth="0.3" opacity="0.9" />
                      
                      {/* Gloss highlights on drip drops */}
                      <path d="M 12 20 Q 22 25, 23 20" stroke="url(#glazeHighlight)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                      <path d="M 38 23 Q 44 31, 45 24" stroke="url(#glazeHighlight)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                      <path d="M 72 24 Q 77 32, 78 22" stroke="url(#glazeHighlight)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                      <path d="M 106 23 Q 112 27, 114 22" stroke="url(#glazeHighlight)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                      <path d="M 142 24 Q 146 28, 147 22" stroke="url(#glazeHighlight)" strokeWidth="1.2" strokeLinecap="round" fill="none" />

                      {/* Piped cream stars lining the perimeter of the top tier top ellipse */}
                      {Array.from({ length: 8 }).map((_, i) => {
                        const angle = (i / 7) * Math.PI; // Semicircle on front half
                        const cx = 85 - 77 * Math.cos(angle);
                        const cy = 18 + 10 * Math.sin(angle);
                        return (
                          <g key={i}>
                            <circle cx={cx} cy={cy} r="4.5" fill="#FFFFFF" stroke="#EFE9DD" strokeWidth="0.3" />
                            <path d={`M ${cx-2} ${cy-0.5} Q ${cx} ${cy-3}, ${cx+1} ${cy-1}`} fill="none" stroke="#F6F0E2" strokeWidth="0.8" />
                            <circle cx={cx} cy={cy} r="1.2" fill="#FFA3A9" />
                          </g>
                        );
                      })}

                      {/* Silk Satin Bow on Front Wall of Top Tier */}
                      <g transform="translate(68, 38)">
                        {/* Shadow */}
                        <ellipse cx="17" cy="11" rx="14" ry="7" fill="rgba(0,0,0,0.15)" filter="blur(1px)" />
                        
                        {/* Loops */}
                        <path d="M17 8 C12 -1, 3 -1, 2 8 C1 14, 10 14, 17 9 Z" fill="#FF5E6C" stroke="#D0202F" strokeWidth="0.4" />
                        <path d="M17 8 C22 -1, 31 -1, 32 8 C33 14, 24 14, 17 9 Z" fill="#FF5E6C" stroke="#D0202F" strokeWidth="0.4" />
                        
                        {/* Left/right glossy highlight lines */}
                        <path d="M17 8 C14 3, 7 3, 5 7" fill="none" stroke="#FFEAEB" strokeWidth="1" opacity="0.8" />
                        <path d="M17 8 C20 3, 27 3, 29 7" fill="none" stroke="#FFEAEB" strokeWidth="1" opacity="0.8" />

                        {/* Hanging Ribbon Tails */}
                        <path d="M15 10 L8 21 C6 24, 3 23, 4 20 L13 10 Z" fill="#E03A4A" />
                        <path d="M19 10 L26 21 C28 24, 31 23, 30 20 L21 10 Z" fill="#E03A4A" />

                        {/* Knot center */}
                        <rect x="14.5" y="6" width="5" height="6.5" rx="2" fill="#FFA1A8" stroke="#D0202F" strokeWidth="0.5" />
                        <path d="M15 7 Q17 8.5, 19 7" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
                      </g>
                    </svg>
                  </div>

                  {/* CENTER BIRTHDAY CANDLE (Toggleable, with 3D Depth alignment) */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCakeCandleLit(!isCakeCandleLit);
                    }}
                    title="Tap to light/extinguish candle"
                    className="absolute bottom-[135px] left-1/2 -translate-x-1/2 flex flex-col items-center z-[4] overflow-visible cursor-pointer pointer-events-auto group interactive-obj"
                  >
                    {/* Flame Warm Glow Aura */}
                    <AnimatePresence>
                      {isCakeCandleLit && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: [0.35, 0.5, 0.35], scale: [1, 1.1, 1] }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ repeat: Infinity, duration: 1.2 }}
                          className="absolute bottom-[24px] w-24 h-24 bg-radial from-amber-300/40 via-amber-200/5 to-transparent rounded-full blur-md pointer-events-none z-[1]"
                        />
                      )}
                    </AnimatePresence>

                    {/* Flame vector with organic bounce */}
                    <AnimatePresence>
                      {isCakeCandleLit && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.12, 0.95, 1.05, 1], y: [0, -1.5, 0.5, -0.5, 0] }}
                          exit={{ scale: 0 }}
                          transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
                          className="w-4 h-6 bg-gradient-to-t from-[#EF4444] via-[#FBBF24] to-[#FEF08A] rounded-full blur-[0.4px] shadow-lg shadow-amber-300/50 flex-shrink-0 z-[2]"
                        />
                      )}
                    </AnimatePresence>

                    {/* Wick */}
                    <div className="w-[1.5px] h-2 bg-stone-800 z-[2] -mt-[1px]" />
                    
                    {/* Wax Stick with Gold Glitter spiral wrapping */}
                    <div className="w-3 h-11 bg-gradient-to-b from-[#FFF2F4] via-[#FCE7F3] to-[#F472B6] rounded-t-sm shadow-md relative flex justify-center overflow-hidden z-[2] border border-pink-300/30">
                      {/* Spiral stripes */}
                      <div className="absolute inset-y-0 w-1 bg-[#D946EF]/50 rotate-[24deg] left-[-2px]" />
                      <div className="absolute inset-y-0 w-1 bg-[#D946EF]/50 rotate-[24deg] left-[3px]" />
                      <div className="absolute inset-y-0 w-1 bg-[#FBBF24]/60 rotate-[24deg] left-[8px] animate-pulse" />
                      <div className="absolute inset-y-0 w-1 bg-[#D946EF]/50 rotate-[24deg] left-[13px]" />
                    </div>
                  </div>

                </div>

                {/* Drag-to-decorate instruction absolute label */}
                <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none select-none z-[10] flex justify-center">
                  {selectedTopping ? (
                    <div className="px-4 py-1.5 bg-[#FFF0F2] border border-[#FFA3A9]/60 rounded-full font-serif text-[11px] text-[#9A424D] shadow-sm animate-bounce">
                      ✨ Click anywhere on the cake to place <strong>{selectedTopping}</strong>!
                    </div>
                  ) : (
                    <div className="font-serif italic text-[11px] text-[#6E4E4E] leading-relaxed bg-white/80 px-4 py-1.5 rounded-full border border-pink-100/50 shadow-sm">
                      "Select a topping from the side panel to place it, then drag it freely. Double-click a topping to remove."
                    </div>
                  )}
                </div>

                {/* RENDERED PLACED TOPPINGS LAYER */}
                <div className="absolute inset-0 z-30 overflow-visible pointer-events-none">
                  {cakeToppings.map((top) => (
                    <motion.div
                      key={top.id}
                      drag
                      dragMomentum={false}
                      dragElastic={0}
                      onDragEnd={(e, info) => handleDragEnd(top.id, info)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTopping(top.id);
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      initial={{ scale: 0, y: -20, rotate: Math.random() * 20 - 10 }}
                      animate={{ scale: 1.2, y: 0 }}
                      className="absolute pointer-events-auto select-none cursor-grab active:cursor-grabbing hover:scale-125 transition-transform duration-100"
                      style={{ 
                        left: `${top.x}%`, 
                        top: `${top.y}%`, 
                        transform: 'translate(-50%, -50%)' 
                      }}
                    >
                      <div className="relative group/topping">
                        {renderTopping(top.emoji)}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTopping(top.id);
                          }}
                          className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-red-400 text-white text-[8px] font-sans rounded-full flex items-center justify-center opacity-0 group-hover/topping:opacity-100 transition-opacity shadow-sm interactive-obj cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Side controls */}
              <div className="md:col-span-5 flex flex-col gap-4 w-full">
                <div className="pb-2 border-b border-pink-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#5E3A3A]">Coquette Patisserie</h3>
                    <p className="text-[10px] text-[#8A7171] mt-0.5">Customize your cozy tier cake.</p>
                  </div>
                  <Sparkles className="w-4 h-4 text-[#ff808b] animate-pulse" />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#8A7171]">Flavor Base:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCakeFlavor('pink')}
                      className={`py-1.5 rounded-full text-[10px] font-serif cursor-pointer border transition-all interactive-obj ${
                        cakeFlavor === 'pink' 
                          ? 'bg-[#ffb3b8] text-white border-white shadow-sm font-medium' 
                          : 'bg-white text-[#5E3A3A] border-[#ffd6d9] hover:bg-[#FFEBEB]'
                      }`}
                    >
                      🍓 Strawberry Cream
                    </button>
                    <button
                      onClick={() => setCakeFlavor('vanilla')}
                      className={`py-1.5 rounded-full text-[10px] font-serif cursor-pointer border transition-all interactive-obj ${
                        cakeFlavor === 'vanilla' 
                          ? 'bg-[#ffb3b8] text-white border-white shadow-sm font-medium' 
                          : 'bg-white text-[#5E3A3A] border-[#ffd6d9] hover:bg-[#FFEBEB]'
                      }`}
                    >
                      🎂 Vanilla Honey
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#8A7171]">Select Decoration Topping:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { emoji: '🍓', name: 'Strawberry' },
                      { emoji: '🍒', name: 'Cherry' },
                      { emoji: '🍪', name: 'Cookie' },
                      { emoji: '🎀', name: 'Bow' },
                      { emoji: '⭐', name: 'Star' },
                      { emoji: '✨', name: 'Sparkle' },
                      { emoji: '🕯️', name: 'Candle' },
                      { emoji: '🌸', name: 'Sakura' },
                      { emoji: '🫐', name: 'Blueberry' },
                      { emoji: '🧁', name: 'Cream' },
                      { emoji: '💖', name: 'Heart' },
                      { emoji: '🍫', name: 'Chocolate' },
                    ].map((item) => {
                      const isSelected = selectedTopping === item.emoji;
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTopping(null);
                            } else {
                              setSelectedTopping(item.emoji);
                            }
                          }}
                          className={`relative py-1 rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all shadow-sm border interactive-obj hover:scale-105 active:scale-95 ${
                            isSelected 
                              ? 'bg-pink-100 border-[#ffb3b8] ring-2 ring-pink-300' 
                              : 'bg-pink-50/30 hover:bg-[#FFEBEB] border-pink-100/80'
                          }`}
                          title={item.name}
                        >
                          <div className="h-8 flex items-center justify-center">
                            {renderTopping(item.emoji)}
                          </div>
                          <span className="text-[8px] font-sans text-[#8A7171] mt-0.5">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-pink-100/50">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (selectedTopping) {
                          handleAddCakeTopping(selectedTopping);
                        } else {
                          handleAddCakeTopping('🍓');
                        }
                      }}
                      className="flex-1 py-1.5 bg-[#ff808b] hover:bg-[#ff6673] text-white text-[10px] font-serif rounded-full cursor-pointer transition-all interactive-obj flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Quick Drop
                    </button>
                    <button
                      onClick={() => {
                        setCakeToppings([]);
                        setSelectedTopping(null);
                      }}
                      className="px-4 py-1.5 bg-[#FFF5F6] hover:bg-[#FFEBEB] text-[10px] font-serif text-[#ff808b] border border-pink-100 rounded-full cursor-pointer transition-all interactive-obj"
                    >
                      Clear All
                    </button>
                  </div>
                  <button
                    onClick={() => setIsCakeCandleLit(!isCakeCandleLit)}
                    className="w-full py-1 bg-stone-50 hover:bg-stone-100 text-[10px] font-serif text-stone-600 border border-stone-200 rounded-full cursor-pointer transition-all interactive-obj"
                  >
                    {isCakeCandleLit ? '🕯️ Extinguish Candle' : '🔥 Light Birthday Candle'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. ARRANGE FLOWERS */}
          {activeGame === 'flowers' && (
            <motion.div
              key="flowers"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col md:grid md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-7 bg-[#FAFDFC] rounded-2xl border border-[#CCD9CC] aspect-[16/10] w-full relative flex items-center justify-center p-4 overflow-hidden shadow-inner">
                
                {/* Visual ceramic vase on table */}
                <div className="relative w-36 h-40 flex flex-col items-center justify-end overflow-visible">
                  
                  {/* SVG Green Stem Lines tucked behind the flower heads but ending inside the vase */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    {bouquetStems.map((stem) => (
                      <motion.line
                        key={`stem-${stem.id}`}
                        x1="50%"
                        y1="45%"
                        x2={`${stem.x}%`}
                        y2={`${stem.y}%`}
                        stroke="#3D6646" // Cozy earthy botanical green
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      />
                    ))}
                  </svg>

                  {/* Arranged stems absolute overlay */}
                  {bouquetStems.map((stem) => (
                    <motion.div
                      key={stem.id}
                      initial={{ scale: 0, y: -15, rotate: stem.rotation - 10 }}
                      animate={{ scale: 1.15, y: 0, rotate: stem.rotation }}
                      className="absolute text-4xl pointer-events-none select-none z-20"
                      style={{ 
                        left: `${stem.x}%`, 
                        top: `${stem.y}%`,
                        transform: `translate(-50%, -50%)`
                      }}
                    >
                      {stem.emoji}
                    </motion.div>
                  ))}

                  {/* Artisanal Pottery Ceramic Vase */}
                  <div className="w-24 h-28 relative z-10 flex flex-col items-center justify-end overflow-visible">
                    {/* Upper Rim / Neck of Vase */}
                    <div className="w-10 h-3 bg-[#EADCC9] border-x-2 border-t-2 border-[#D5C2B1] rounded-t-md shadow-sm z-10" />
                    <div className="w-8 h-4 bg-gradient-to-b from-[#EADCC9] to-[#F5ECE2] border-x-2 border-stone-200/50 z-10" />

                    {/* Bulbous Body of Vase */}
                    <div className="w-24 h-22 bg-gradient-to-br from-[#F5ECE2] via-[#FAF3EC] to-[#E3CEBA] border-2 border-[#D5C2B1] rounded-full shadow-lg relative flex items-center justify-center overflow-hidden z-0">
                      
                      {/* Gold Trim Neck Accent */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-[#D4AF37]/80 shadow-inner" />

                      {/* Aesthetic Hand-Painted Botanical Lines */}
                      <svg className="absolute inset-0 w-full h-full opacity-65 pointer-events-none" viewBox="0 0 96 88">
                        {/* Elegant plant leaves decoration */}
                        <path d="M 48 80 C 48 55, 38 45, 30 35" stroke="#4F6D54" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        <path d="M 48 80 C 48 55, 58 45, 66 35" stroke="#4F6D54" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        
                        {/* Leaf 1 */}
                        <path d="M 30 35 C 24 35, 22 30, 26 26 C 30 22, 34 26, 30 35" fill="#608066" />
                        {/* Leaf 2 */}
                        <path d="M 66 35 C 72 35, 74 30, 70 26 C 66 22, 62 26, 66 35" fill="#608066" />
                        
                        {/* Middle sprigs */}
                        <path d="M 48 80 C 48 40, 48 30, 48 20" stroke="#4F6D54" strokeWidth="1" fill="none" />
                        <circle cx="48" cy="18" r="2.5" fill="#D4AF37" />
                        <circle cx="36" cy="50" r="1.5" fill="#D4AF37" />
                        <circle cx="60" cy="50" r="1.5" fill="#D4AF37" />
                      </svg>

                      {/* Glossy Reflection Highlight */}
                      <div className="absolute left-3 top-2 w-3.5 h-16 bg-white/25 rounded-full blur-[1px] rotate-12 pointer-events-none" />
                      <div className="absolute right-3 bottom-2 w-2 h-10 bg-white/10 rounded-full blur-[2px] rotate-12 pointer-events-none" />
                    </div>

                    {/* Pedestal Bottom Rim Accent */}
                    <div className="w-14 h-2.5 bg-gradient-to-r from-[#D5C2B1] to-[#E3CEBA] border-x border-b border-[#D5C2B1] rounded-b-md shadow-sm z-10" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-4 font-garamond italic text-[10px] text-[#6E8A73]">
                  "Whimsical glass flower arranging jar"
                </div>
              </div>

              {/* Controls */}
              <div className="md:col-span-5 flex flex-col gap-4 w-full">
                <div className="pb-2 border-b border-stone-100">
                  <h3 className="font-serif text-base font-bold text-[#3A4E3D]">Cottage Florist</h3>
                  <p className="text-[10px] text-[#6E8A73] mt-0.5">Assemble flowers in a vase.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#8A7171]">Flower Stems:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { emoji: '🌹', name: 'Rose' },
                      { emoji: '🪷', name: 'Lily' },
                      { emoji: '🌼', name: 'Daisy' },
                      { emoji: '🪻', name: 'Lavender' },
                      { emoji: '🌿', name: 'Ivy Leaf' },
                      { emoji: '🌾', name: 'Wheat' },
                    ].map((f) => (
                      <button
                        key={f.name}
                        onClick={() => handleAddFlowerStem(f.emoji)}
                        className="px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-xs text-[#3A4E3D] cursor-pointer transition-all flex items-center gap-1 interactive-obj"
                      >
                        <span>{f.emoji}</span>
                        <span>{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setBouquetStems([])}
                  className="w-full py-1.5 bg-stone-50 hover:bg-stone-100 text-xs text-[#8A7171] border border-stone-200 rounded-full cursor-pointer transition-all interactive-obj"
                >
                  Clear Vase Bouquet ✕
                </button>
              </div>
            </motion.div>
          )}

          {/* 3. FIND HIDDEN BEARS */}
          {activeGame === 'bears' && (
            <motion.div
              key="bears"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col md:grid md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-7 bg-[#FFFBF7] rounded-2xl border border-pink-100 aspect-[16/10] w-full relative overflow-hidden shadow-inner p-4">
                
                {/* Sketch layout representation */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFEBEB]/20 to-[#E5ECE5]/10" />

                {/* Simulated bedroom drawing backdrop details */}
                <div className="absolute top-[30%] left-[10%] w-20 h-10 border border-stone-300 rounded text-[9px] text-stone-400 p-1">Bed frame</div>
                <div className="absolute top-[20%] right-[15%] w-14 h-16 border border-stone-300 rounded text-[9px] text-stone-400 p-1">Bookshelf</div>
                <div className="absolute bottom-[10%] left-[40%] w-16 h-12 border border-stone-300 rounded text-[9px] text-stone-400 p-1">Desk</div>

                {/* Hidden Bear 1: closet bookshelf */}
                <motion.button
                  onClick={() => {
                    if (!foundBears.includes('bookshelf')) setFoundBears((prev) => [...prev, 'bookshelf']);
                  }}
                  className={`absolute top-[28%] right-[18%] text-xl transition-all cursor-pointer ${
                    foundBears.includes('bookshelf') ? 'opacity-100 scale-125' : 'opacity-[0.08] hover:opacity-30 scale-90'
                  } interactive-obj`}
                  title="Under bookshelf stack"
                >
                  🧸
                </motion.button>

                {/* Hidden Bear 2: bed covers */}
                <motion.button
                  onClick={() => {
                    if (!foundBears.includes('closet')) setFoundBears((prev) => [...prev, 'closet']);
                  }}
                  className={`absolute top-[32%] left-[18%] text-xl transition-all cursor-pointer ${
                    foundBears.includes('closet') ? 'opacity-100 scale-125' : 'opacity-[0.08] hover:opacity-30 scale-90'
                  } interactive-obj`}
                  title="Beside bedroom closet doors"
                >
                  🧸
                </motion.button>

                {/* Hidden Bear 3: desk papers */}
                <motion.button
                  onClick={() => {
                    if (!foundBears.includes('desk')) setFoundBears((prev) => [...prev, 'desk']);
                  }}
                  className={`absolute bottom-[14%] left-[45%] text-xl transition-all cursor-pointer ${
                    foundBears.includes('desk') ? 'opacity-100 scale-125' : 'opacity-[0.08] hover:opacity-30 scale-90'
                  } interactive-obj`}
                  title="Under writing papers"
                >
                  🧸
                </motion.button>

                <div className="absolute bottom-3 left-4 font-garamond italic text-[10px] text-[#8A7171]">
                  "Hover/click around closet bed frame, desk, and bookshelf stack to find them!"
                </div>
              </div>

              {/* Side controls */}
              <div className="md:col-span-5 flex flex-col gap-4 w-full">
                <div className="pb-2 border-b border-stone-100">
                  <h3 className="font-serif text-base font-bold text-[#5E3A3A]">Hidden Teddy Bears</h3>
                  <p className="text-[10px] text-[#8A7171] mt-0.5">Three sweet bears are hiding in the bedroom sketch.</p>
                </div>

                <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100/40 flex flex-col gap-2">
                  <span className="text-[11px] font-serif uppercase tracking-wider text-[#8A7171]">Bears Found: {foundBears.length} / 3</span>
                  <div className="flex gap-2 justify-center">
                    {['Bookshelf stack 🧸', 'Closet bed 🧸', 'Desk papers 🧸'].map((b, i) => {
                      const tags = ['bookshelf', 'closet', 'desk'];
                      const isFound = foundBears.includes(tags[i]);
                      return (
                        <div key={i} className={`px-2 py-1 rounded text-[9px] font-sans border flex items-center gap-1 ${
                          isFound ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' : 'bg-stone-50 border-stone-200 text-stone-400'
                        }`}>
                          {isFound ? '✓ Found' : '🔒 Hidden'}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {foundBears.length >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-pink-50 text-pink-700 text-center rounded-xl text-xs font-serif"
                  >
                    💖 You found all 3 teddy bears! Ribbon and Clover thank you! 💖
                  </motion.div>
                )}

                <button
                  onClick={() => setFoundBears([])}
                  className="w-full py-1.5 bg-[#FFF5F6] hover:bg-[#FFEBEB] text-xs text-[#ff808b] border border-pink-100 rounded-full cursor-pointer transition-all interactive-obj"
                >
                  Reset Game ✕
                </button>
              </div>
            </motion.div>
          )}

          {/* 4. FEED THE BUNNY */}
          {activeGame === 'bunny' && (
            <motion.div
              key="bunny"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col md:grid md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-7 bg-[#FFFBF7] rounded-2xl border border-[#CCD9CC] aspect-[16/10] w-full relative flex flex-col justify-center items-center overflow-hidden shadow-inner p-4">
                
                {/* Bunny graphic */}
                <div className="relative flex flex-col items-center">
                  {flyingTreat && (
                    <motion.div
                      initial={{ y: 60, scale: 0.5, opacity: 1 }}
                      animate={{ y: -10, scale: 1.3, opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="absolute text-4xl z-20 pointer-events-none"
                    >
                      {flyingTreat}
                    </motion.div>
                  )}
                  {isBunnyChewing ? (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }}
                      transition={{ duration: 0.4, repeat: 2 }}
                      className="text-7xl select-none"
                    >
                      🐰🐹
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      className="text-7xl select-none"
                    >
                      🐰
                    </motion.div>
                  )}

                  {/* Munching bubbles */}
                  {isBunnyChewing && (
                    <span className="absolute top-[-15px] right-[-30px] text-xs font-serif bg-pink-100 px-2 py-0.5 rounded-full text-pink-700 shadow animate-pulse">
                      nom nom... 💖
                    </span>
                  )}
                </div>

                <p className="font-garamond italic text-xs text-[#8A7171] mt-4">
                  "Hop hop! Clover the bunny is waiting for a sweet snack."
                </p>
              </div>

              {/* Side controls */}
              <div className="md:col-span-5 flex flex-col gap-4 w-full">
                <div className="pb-2 border-b border-stone-100">
                  <h3 className="font-serif text-base font-bold text-[#5E3A3A]">Bunny Snack Time</h3>
                  <p className="text-[10px] text-[#8A7171] mt-0.5">Feed Clover treats to make them chew with delight.</p>
                </div>

                <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100/40 flex flex-col gap-2 items-center text-center">
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#8A7171]">Feeding Count: {bunnyBites} bites</span>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => handleFeedBunny('carrot')}
                      className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full text-xs font-serif cursor-pointer flex items-center gap-1 interactive-obj"
                    >
                      🥕 Crunchy Carrot
                    </button>
                    <button
                      onClick={() => handleFeedBunny('berry')}
                      className="px-4 py-2 bg-pink-50 hover:bg-[#FFEBEB] border border-pink-200 rounded-full text-xs font-serif cursor-pointer flex items-center gap-1 interactive-obj"
                    >
                      🍓 Strawberry Bit
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setBunnyBites(0)}
                  className="w-full py-1.5 bg-[#FFF5F6] hover:bg-[#FFEBEB] text-xs text-[#ff808b] border border-pink-100 rounded-full cursor-pointer transition-all interactive-obj"
                >
                  Reset Bites ✕
                </button>
              </div>
            </motion.div>
          )}

          {/* 5. HELP SWAN TO LAKE */}
          {activeGame === 'swan' && (
            <motion.div
              key="swan"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col md:grid md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-7 bg-[#FAFDFC] rounded-2xl border border-sky-100 aspect-[16/10] w-full relative flex flex-col justify-between overflow-hidden shadow-inner p-6">
                
                {/* Path line background */}
                <div className="absolute inset-x-12 top-[48%] h-2 bg-emerald-100 rounded-full" />
                
                {/* Lake graphic on right side */}
                <div className="absolute right-4 top-[35%] w-20 h-20 bg-sky-100 border-2 border-sky-300/40 rounded-full flex items-center justify-center">
                  <span className="text-xl animate-pulse">🌊🌱</span>
                </div>

                {/* Sliding Swan */}
                <div 
                  className="relative w-full h-32 mt-6 cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = Math.min(80, Math.max(10, ((e.clientX - rect.left) / rect.width) * 100));
                    setSwanPosition(Math.round(percent));
                  }}
                  title="Click anywhere along the path to swim the swan!"
                >
                  <motion.div
                    className="absolute text-4xl select-none cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                    style={{ left: `${swanPosition}%`, top: '25%', transform: 'translateX(-50%)' }}
                    animate={swanPosition >= 75 ? { y: [0, -4, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  >
                    🦢
                  </motion.div>
                </div>

                <div className="flex justify-between items-center z-10">
                  <span className="font-garamond italic text-[10px] text-emerald-700/80">Cottage garden path</span>
                  <span className="font-garamond italic text-[10px] text-sky-700/80">Tranquil blue lake</span>
                </div>
              </div>

              {/* Side controls */}
              <div className="md:col-span-5 flex flex-col gap-4 w-full">
                <div className="pb-2 border-b border-stone-100">
                  <h3 className="font-serif text-base font-bold text-[#3A4E3D]">Guide Swan to Water</h3>
                  <p className="text-[10px] text-[#6E8A73] mt-0.5">Drag/slide the swan along the garden path to the blue lake.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#8A7171]">Swan Path progress:</span>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={swanPosition}
                    onChange={(e) => setSwanPosition(parseInt(e.target.value))}
                    className="w-full accent-emerald-400 h-2 bg-[#E5ECE5] rounded-lg cursor-pointer"
                  />
                </div>

                {swanPosition >= 75 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-sky-50 text-sky-700 text-center rounded-xl text-xs font-serif"
                  >
                    🌊 Swan reached the tranquil lake! Water ripples with soft joy. 🌊
                  </motion.div>
                )}

                <button
                  onClick={() => setSwanPosition(10)}
                  className="w-full py-1.5 bg-stone-50 hover:bg-stone-100 text-xs text-[#8A7171] border border-stone-200 rounded-full cursor-pointer transition-all interactive-obj"
                >
                  Reset Swan ✕
                </button>
              </div>
            </motion.div>
          )}

          {/* 6. CATCH STRAWBERRIES */}
          {activeGame === 'strawberries' && (
            <motion.div
              key="strawberries"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col md:grid md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-7 bg-[#FFF8F9] rounded-2xl border border-pink-100 aspect-[16/10] w-full relative overflow-hidden shadow-inner p-4">
                
                {/* Catch teacup */}
                <div 
                  className="absolute bottom-4 w-16 h-12 bg-white border-2 border-pink-200 rounded-b-2xl rounded-t-sm shadow-md flex items-center justify-center font-bold text-[#ff808b] transition-all duration-100"
                  style={{ left: `${teacupX}%`, transform: 'translateX(-50%)' }}
                >
                  🥛🍵
                </div>

                {/* Render falling strawberries */}
                {activeBerries.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleCatchBerry(b.id)}
                    className="absolute text-2xl hover:scale-125 transition-transform cursor-pointer interactive-obj select-none"
                    style={{ left: `${b.x}%`, top: `${b.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    🍓
                  </button>
                ))}

                <div className="absolute bottom-3 left-4 font-garamond italic text-[10px] text-[#ff808b]">
                  "Use Left/Right buttons, Arrow Keys, or tap falling strawberries!"
                </div>
              </div>

              {/* Side controls */}
              <div className="md:col-span-5 flex flex-col gap-4 w-full">
                <div className="pb-2 border-b border-stone-100">
                  <h3 className="font-serif text-base font-bold text-[#5E3A3A]">Strawberry Teacup</h3>
                  <p className="text-[10px] text-[#8A7171] mt-0.5">Catch falling strawberries in the teacup or pop them with your tap.</p>
                </div>

                <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100/40 flex flex-col gap-2 items-center text-center">
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#8A7171]">Caught: {strawberryScore} berries</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveTeacup('left')}
                      className="px-3.5 py-1.5 bg-white hover:bg-[#FFEBEB] border border-pink-100 rounded-full text-xs font-serif cursor-pointer interactive-obj"
                    >
                      ← Left
                    </button>
                    <button
                      onClick={() => moveTeacup('right')}
                      className="px-3.5 py-1.5 bg-white hover:bg-[#FFEBEB] border border-pink-100 rounded-full text-xs font-serif cursor-pointer interactive-obj"
                    >
                      Right →
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setStrawberryScore(0);
                    setActiveBerries([
                      { id: 1, x: 25, y: -10, speed: 2.2 },
                      { id: 2, x: 55, y: -45, speed: 3.0 },
                      { id: 3, x: 75, y: -75, speed: 2.5 },
                    ]);
                  }}
                  className="w-full py-1.5 bg-[#FFF5F6] hover:bg-[#FFEBEB] text-xs text-[#ff808b] border border-pink-100 rounded-full cursor-pointer transition-all interactive-obj"
                >
                  Reset Strawberry Bowl ✕
                </button>
              </div>
            </motion.div>
          )}

          {/* 7. WRITE YOURSELF A LETTER */}
          {activeGame === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col md:grid md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-7 bg-[#FFFBF7] rounded-2xl border border-amber-100 aspect-[16/10] w-full relative overflow-hidden shadow-inner p-4 flex flex-col justify-center items-center text-center">
                
                <AnimatePresence mode="wait">
                  {isLetterSent ? (
                    <motion.div
                      key="sent"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <span className="text-5xl animate-bounce">✈️☁️</span>
                      <h4 className="font-serif text-sm font-semibold text-[#5E3A3A]">Letter Released to the Clouds!</h4>
                      <p className="text-[10px] text-[#8A7171] max-w-xs leading-relaxed">
                        Your sweet wishes have been folded into a paper plane and set adrift. The universe remembers, and so will you.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="w-full flex flex-col gap-2 p-2">
                      <span className="text-3xl animate-float-slow">✉️</span>
                      <h4 className="font-serif text-sm font-semibold text-[#5E3A3A]">Letter to Future Self</h4>
                      <textarea
                        maxLength={120}
                        rows={3}
                        value={letterText}
                        onChange={(e) => setLetterText(e.target.value)}
                        placeholder="e.g., I hope you are taking care of your skin, listening to good music, and smiling..."
                        className="w-full p-2 rounded-xl bg-white border border-[#ffd6d9] text-xs font-sans text-[#5E3A3A] resize-none focus:outline-none"
                      />
                    </div>
                  )}
                </AnimatePresence>

              </div>

              {/* Controls */}
              <div className="md:col-span-5 flex flex-col gap-4 w-full">
                <div className="pb-2 border-b border-stone-100">
                  <h3 className="font-serif text-base font-bold text-[#5E3A3A]">Wishes in the Wind</h3>
                  <p className="text-[10px] text-[#8A7171] mt-0.5">Write a future diary letter and launch it as a paper plane.</p>
                </div>

                {!isLetterSent ? (
                  <button
                    onClick={() => {
                      if (letterText.trim()) setIsLetterSent(true);
                    }}
                    disabled={!letterText.trim()}
                    className="w-full py-3 bg-[#ffb3b8] hover:bg-[#ff808b] disabled:opacity-50 text-white rounded-full font-serif text-xs tracking-wider cursor-pointer flex items-center justify-center gap-1.5 interactive-obj"
                  >
                    <Send className="w-4 h-4" />
                    Launch Paper Plane
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setLetterText('');
                      setIsLetterSent(false);
                    }}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-[#8A7171] rounded-full text-xs font-serif cursor-pointer interactive-obj"
                  >
                    Write another letter
                  </button>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <div className="border-t border-pink-100/40 pt-4 mt-6 text-center text-[10px] text-[#8A7171] font-serif">
          ✨ mysl's relaxing play cabinet • enjoy the serenity ✨
        </div>
      </div>
    </div>
  );
}
