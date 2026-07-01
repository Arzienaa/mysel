import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { FlowerNote } from '../types';

interface GardenRoomProps {
  onTriggerPetals: () => void;
}

const SECRET_MESSAGES = [
  "You are enough.",
  "Pretty things take time.",
  "Take your time.",
  "Flowers bloom differently.",
  "Small joys matter.",
  "Don't forget to rest.",
  "You deserve beautiful days.",
  "Keep growing in your own soft light.",
  "Your warmth changes the world."
];

export default function GardenRoom({ onTriggerPetals }: GardenRoomProps) {
  // Local flower meadow state
  const [flowers, setFlowers] = useState<FlowerNote[]>([
    { id: '1', flowerType: 'lily', message: SECRET_MESSAGES[0], position: { x: 20, y: 35 }, hasBloomed: false },
    { id: '2', flowerType: 'rose', message: SECRET_MESSAGES[1], position: { x: 45, y: 20 }, hasBloomed: false },
    { id: '3', flowerType: 'daisy', message: SECRET_MESSAGES[2], position: { x: 75, y: 30 }, hasBloomed: false },
    { id: '4', flowerType: 'lily', message: SECRET_MESSAGES[3], position: { x: 15, y: 65 }, hasBloomed: false },
    { id: '5', flowerType: 'rose', message: SECRET_MESSAGES[4], position: { x: 50, y: 55 }, hasBloomed: false },
    { id: '6', flowerType: 'daisy', message: SECRET_MESSAGES[5], position: { x: 80, y: 70 }, hasBloomed: false },
    { id: '7', flowerType: 'lily', message: SECRET_MESSAGES[6], position: { x: 30, y: 75 }, hasBloomed: false },
    { id: '8', flowerType: 'rose', message: SECRET_MESSAGES[7], position: { x: 65, y: 45 }, hasBloomed: false },
  ]);

  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const handleFlowerClick = (id: string, message: string) => {
    // Set bloomed state
    setFlowers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, hasBloomed: true } : f))
    );
    setSelectedNote(message);
    onTriggerPetals(); // emit floating petals!
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#FAF7F2] rounded-3xl p-6 md:p-8 border border-emerald-100/40 relative shadow-sm overflow-hidden">
      
      {/* Sun rays overlay */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-100/20 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-10 relative z-10">
        <h1 className="font-serif text-3xl text-[#3A4E3D] tracking-wider flex items-center justify-center gap-2">
          <span>🌿</span> My Magical Flower Garden
        </h1>
        <p className="font-garamond italic text-base text-[#6E8A73] mt-1">
          "Tap on the flower buds to help them bloom and uncover tiny handwritten notes."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Garden Meadow Interactive Area (Left 8 columns) */}
        <div className="lg:col-span-8 bg-[#FAFDFC] rounded-3xl border border-emerald-100/40 aspect-[16/10] relative overflow-hidden shadow-inner p-4">
          
          {/* Aesthetic background sky and lake */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50/20 via-transparent to-transparent" />
          
          {/* A cute swimming swan lake at the bottom right */}
          <div className="absolute bottom-0 right-0 w-[45%] h-[35%] bg-sky-100/40 border-l border-t border-sky-200/50 rounded-tl-[100px] overflow-hidden flex items-center justify-center">
            {/* Water ripples */}
            <div className="absolute inset-3 border border-sky-300/20 rounded-tl-[80px] animate-pulse" />
            <div className="absolute inset-8 border border-sky-300/10 rounded-tl-[60px] animate-pulse" />
            
            {/* Swan swimming slowly */}
            <motion.div
              animate={{
                x: [0, 40, 10, -20, 0],
                y: [0, -5, 5, 2, 0],
                rotate: [0, 2, -1, 3, 0],
              }}
              transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
              className="text-3xl select-none filter drop-shadow-sm cursor-help relative"
              title="A sweet swan swimming peacefully"
            >
              🦢
            </motion.div>
          </div>

          {/* Sleeping kitty nestled on lavender */}
          <div className="absolute bottom-[8%] left-[20%] flex items-center gap-1">
            <div className="text-xs text-purple-400 font-serif animate-sway">🪻🪻</div>
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="text-2xl cursor-help"
              title="A cute cat sleeping on lavender"
            >
              🐱💤
            </motion.div>
          </div>

          {/* Hopping bunny */}
          <motion.div
            animate={{
              x: [-10, 50, 110, 60, -10],
              y: [0, -20, 0, -15, 0],
            }}
            transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
            className="absolute bottom-[20%] left-[45%] text-2xl select-none"
          >
            🐰
          </motion.div>

          {/* Fluttering butterflies */}
          <motion.div
            animate={{
              x: [50, 80, 110, 50],
              y: [50, 20, 60, 50],
              rotate: [15, -15, 10, 15],
            }}
            transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
            className="absolute text-pink-300 text-lg pointer-events-none"
          >
            🦋
          </motion.div>
          <motion.div
            animate={{
              x: [250, 220, 280, 250],
              y: [120, 150, 100, 120],
              rotate: [-10, 10, -5, -10],
            }}
            transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
            className="absolute text-[#ff808b] text-base pointer-events-none"
          >
            🦋
          </motion.div>

          {/* Flower meadow stems and buds */}
          {flowers.map((f) => (
            <div
              key={f.id}
              className="absolute"
              style={{ left: `${f.position.x}%`, top: `${f.position.y}%` }}
            >
              <div className="relative flex flex-col items-center">
                {/* Stem and Leaf */}
                <div className="w-1 h-14 bg-emerald-400/80 rounded-full flex justify-center items-center">
                  {/* Leaves */}
                  <div className="absolute left-[-6px] top-6 w-3.5 h-2 bg-emerald-500/60 rounded-l-full rotate-[-25deg]" />
                  <div className="absolute right-[-6px] top-4 w-3.5 h-2 bg-emerald-500/60 rounded-r-full rotate-[25deg]" />
                </div>

                {/* Main Flower Bud / Bloom Head */}
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFlowerClick(f.id, f.message)}
                  className="absolute -top-3 cursor-pointer select-none focus:outline-none interactive-obj"
                >
                  <AnimatePresence mode="wait">
                    {f.hasBloomed ? (
                      <motion.div
                        key="bloomed"
                        initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                        animate={{ scale: 1.15, rotate: 0, opacity: 1 }}
                        className="text-3xl filter drop-shadow-sm flex flex-col items-center"
                      >
                        <span>
                          {f.flowerType === 'lily' ? '🪷' : f.flowerType === 'rose' ? '🌹' : '🌼'}
                        </span>
                        <div className="absolute top-0 right-0 w-2 h-2 bg-pink-100 rounded-full animate-ping pointer-events-none" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="bud"
                        className="w-5 h-5 bg-pink-200 border border-pink-300 rounded-t-full flex items-center justify-center shadow-sm"
                        title={`Unbloomed ${f.flowerType}`}
                      >
                        <div className="w-1.5 h-1.5 bg-yellow-200 rounded-full" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          ))}

        </div>

        {/* Secret Note Container (Right 4 columns) */}
        <div className="lg:col-span-4 h-full min-h-[300px]">
          <AnimatePresence mode="wait">
            {selectedNote ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-6 bg-[#FAF6F0] rounded-2xl border border-[#ffb3b8]/40 shadow-md flex flex-col justify-between aspect-[3/4] relative"
              >
                {/* Vintage Wax Seal or Bookmark pin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-pink-100 border border-[#ffb3b8] flex items-center justify-center text-xs font-serif text-white shadow z-10 font-bold">
                  🌹
                </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center mt-4">
                  <span className="text-2xl text-pink-300 mb-4 animate-pulse">✦</span>
                  <p className="font-handwritten text-2xl text-[#5E3A3A] leading-relaxed px-2">
                    {selectedNote}
                  </p>
                  <span className="text-2xl text-pink-300 mt-4 animate-pulse">✦</span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="border-t border-[#ffb3b8]/30 pt-3 text-center">
                    <p className="font-garamond italic text-xs text-[#8A7171]">
                      "Written with love on parchment paper"
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedNote(null)}
                    className="w-full py-1.5 bg-[#FFF5F6] hover:bg-[#FFEBEB] border border-pink-200 text-xs text-[#ff808b] font-serif rounded-full transition-all cursor-pointer interactive-obj"
                  >
                    Fold Note back ✕
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="glass-panel p-6 rounded-2xl border border-emerald-100 h-full flex flex-col justify-center items-center text-center text-[#6E8A73] aspect-[3/4]">
                <span className="text-3xl animate-bounce">🌻</span>
                <h3 className="font-serif text-base font-medium text-[#3A4E3D] mt-3">
                  Parchment Notes
                </h3>
                <p className="text-xs max-w-xs leading-relaxed mt-2">
                  Tap any bud in the garden meadow. Help it bloom with sweet pink sunlight and unlock deep comforting letters.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
