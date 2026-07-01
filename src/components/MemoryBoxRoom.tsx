import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Gift, Eye } from 'lucide-react';
import { PolaroidMemory } from '../types';

const POLAROIDS: PolaroidMemory[] = [
  {
    id: '1',
    title: 'First Flower Bouquet 💐',
    date: '14 April 2024',
    image: '💐',
    description: 'Handpicked fresh white lilies and pink roses wrapped in crinkled parchment paper. Smelled like morning rain.'
  },
  {
    id: '2',
    title: 'Rainy Cafe Afternoon ☕',
    date: '18 October 2025',
    image: '🍵',
    description: 'Sat by the window with frothy hot lavender matcha and an old vintage chick-flick novel. Complete, comforting peace.'
  },
  {
    id: '3',
    title: 'A Sweet Swan Pond 🦢',
    date: '02 June 2026',
    image: '🦢',
    description: 'Watched three beautiful, elegant white swans swim gracefully in the morning mist. They looked so tranquil.'
  },
  {
    id: '4',
    title: 'Homemade Tiramisu Success 🍰',
    date: '08 May 2026',
    image: '🍰',
    description: 'Whipped the velvet mascarpone layers myself, drenched ladyfingers in deep espresso, and dusted sweet dark chocolate.'
  },
  {
    id: '5',
    title: 'My Dream Room Setup 🌸',
    date: '12 January 2026',
    image: '🛏️',
    description: 'Hung up pink bow ribbons, lit my rose candles, and arranged my teddy bears. Fits the coquette mood completely.'
  }
];

export default function MemoryBoxRoom() {
  const [selectedPolaroid, setSelectedPolaroid] = useState<PolaroidMemory | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#FAF7F2] rounded-3xl p-6 md:p-8 border border-pink-100 relative shadow-sm">
      
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-10">
        <h1 className="font-serif text-3xl text-[#5E3A3A] tracking-wider">
          My Vintage Memory Box
        </h1>
        <p className="font-garamond italic text-base text-[#8A7171] mt-1">
          "Reach into my wooden jewelry chest and draw out Polaroid snapshots of happy little moments."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Memory Box Tray (Left 7 Columns) */}
        <div className="md:col-span-7 bg-[#E6D5C3] rounded-3xl border-4 border-double border-[#A08870] aspect-[4/3] relative flex items-center justify-center overflow-hidden shadow-inner p-6">
          
          {/* Inner velvet lining lining */}
          <div className="absolute inset-2 bg-[#FFF9F2] rounded-2xl border border-[#CBB8A4] flex items-center justify-center flex-wrap gap-4 p-4">
            
            {/* Box lock graphic */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-6 bg-yellow-500/20 rounded-b-md border-x border-b border-yellow-600/30 flex items-center justify-center font-bold text-yellow-700 text-xs">
              🔒
            </div>

            {/* Scatter Polaroids in a cute layout */}
            {POLAROIDS.map((p, idx) => {
              // Create some random-looking offsets/rotations for scrapbook feel
              const rotations = ['rotate-[-6deg]', 'rotate-[4deg]', 'rotate-[-3deg]', 'rotate-[5deg]', 'rotate-[-1deg]'];
              const rot = rotations[idx % rotations.length];

              return (
                <motion.button
                  key={p.id}
                  whileHover={{ y: -8, scale: 1.05, zIndex: 10 }}
                  onClick={() => setSelectedPolaroid(p)}
                  className={`bg-white p-2.5 pb-6 w-28 md:w-32 shadow-md border border-stone-200/60 flex flex-col gap-2 cursor-pointer transition-all ${rot} group hover:rotate-0 interactive-obj`}
                >
                  {/* Photo area */}
                  <div className="aspect-square bg-pink-50/50 rounded-lg border border-stone-100 flex items-center justify-center text-4xl shadow-inner relative overflow-hidden group-hover:bg-pink-100/30 transition-colors">
                    <span>{p.image}</span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-400/5 to-white/10" />
                  </div>
                  {/* Title / Label */}
                  <div className="text-center">
                    <p className="font-handwritten text-xs text-[#5E3A3A] truncate">{p.title}</p>
                    <p className="text-[7px] text-[#8A7171] font-mono mt-0.5">{p.date}</p>
                  </div>
                </motion.button>
              );
            })}

          </div>

          {/* Wooden Chest bottom tag */}
          <div className="absolute bottom-4 font-garamond italic text-xs text-stone-700/80 tracking-wider">
            "happy little memories, pressed in wood"
          </div>
        </div>

        {/* Polaroid Inspector Frame (Right 5 Columns) */}
        <div className="md:col-span-5 h-full min-h-[380px]">
          <AnimatePresence mode="wait">
            {selectedPolaroid ? (
              <motion.div
                key={selectedPolaroid.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-5 pb-8 rounded-xl shadow-xl border border-stone-200 flex flex-col gap-4 relative"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedPolaroid(null)}
                  className="absolute top-3 right-3 text-[#ff808b] text-xs font-serif hover:underline cursor-pointer interactive-obj"
                >
                  Put back ✕
                </button>

                {/* Big Photo Space */}
                <div className="aspect-video bg-[#FFF5F6] rounded-lg border border-stone-100 flex items-center justify-center text-5xl shadow-inner relative overflow-hidden">
                  <span className="animate-float-slow">{selectedPolaroid.image}</span>
                  {/* Stamp */}
                  <div className="absolute top-2 left-2 bg-[#ffb3b8]/20 px-2 py-0.5 rounded text-[8px] font-serif text-[#ff808b] uppercase tracking-widest">
                    ✿ MEMORY
                  </div>
                </div>

                {/* Written journal entry details */}
                <div className="flex flex-col gap-1">
                  <h3 className="font-serif text-base font-bold text-[#5E3A3A]">
                    {selectedPolaroid.title}
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Captured on {selectedPolaroid.date} • Indonesia
                  </span>
                </div>

                <div className="p-3 bg-pink-50/20 rounded-xl border border-pink-100/30">
                  <p className="font-handwritten text-[#5E3A3A] text-lg leading-relaxed">
                    "{selectedPolaroid.description}"
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-center text-[10px] text-pink-400 font-serif">
                  <Heart className="w-3.5 h-3.5 fill-pink-300" />
                  <span>Cherished Moment</span>
                </div>
              </motion.div>
            ) : (
              <div className="glass-panel p-6 rounded-2xl border border-[#ffb3b8]/20 h-full flex flex-col justify-center items-center text-center text-[#8A7171]">
                <Gift className="w-8 h-8 text-[#ffb3b8] animate-bounce mb-3" />
                <h3 className="font-serif text-base font-medium text-[#5E3A3A]">
                  Memory Inspector
                </h3>
                <p className="text-xs max-w-xs leading-relaxed mt-1">
                  Tap any small Polaroid snapshot resting inside the velvet chest tray to expand it, revealing custom handwritten dairy notes, dates, and full captions.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
