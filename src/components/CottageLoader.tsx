import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

interface CottageLoaderProps {
  onEnter: () => void;
  pinkCottageImage: string;
}

export default function CottageLoader({ onEnter, pinkCottageImage }: CottageLoaderProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#FAF6F0] flex flex-col items-center justify-center overflow-hidden p-4">
      {/* Sunbeam ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FFEEDD] rounded-full blur-[100px] opacity-60 pointer-events-none animate-pulse-soft" />

      {/* Magical floating flowers & butterflies in the background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200/40 text-xl font-serif"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: -100,
              x: `calc(10% + ${Math.sin(i) * 100}px)`,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 2,
            }}
          >
            ✦
          </motion.div>
        ))}
        {/* Cute fluttering butterflies */}
        <motion.div
          animate={{
            x: [100, 150, 120, 100],
            y: [200, 160, 240, 200],
            rotate: [15, -15, 15],
          }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute text-[#ffb3b8] text-sm pointer-events-none"
        >
          🦋
        </motion.div>
        <motion.div
          animate={{
            x: [window.innerWidth - 150, window.innerWidth - 180, window.innerWidth - 120, window.innerWidth - 150],
            y: [300, 340, 280, 300],
            rotate: [-10, 20, -10],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="absolute text-[#ffb3b8] text-xs pointer-events-none"
        >
          🦋
        </motion.div>
      </div>

      {/* Main Cottage Showcase Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl glass-panel-deep rounded-3xl p-6 md:p-8 flex flex-col items-center text-center shadow-2xl relative border border-[#ffb3b8]/30"
      >
        {/* Ribbon Bow Decoration */}
        <div className="absolute -top-4 flex justify-center w-full">
          <div className="bg-[#ffb3b8] px-4 py-1.5 rounded-full text-white text-xs font-serif tracking-widest uppercase flex items-center gap-1 shadow-md">
            <Heart className="w-3 h-3 fill-white" />
            mysl.
            <Heart className="w-3 h-3 fill-white" />
          </div>
        </div>

        {/* Cottage Illustration with Morning Glow */}
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-inner border border-white/60 mb-8 mt-2 group">
          <img
            src={pinkCottageImage}
            alt="Whimsical Pink Cottage in Flower Field"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8s] ease-out"
            referrerPolicy="no-referrer"
          />
          {/* Sunny overlay filter */}
          <div className="absolute inset-0 bg-gradient-to-t from-pink-100/30 via-transparent to-amber-100/20 mix-blend-soft-light" />
          {/* Subtle floating particle overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25)_0%,transparent_60%)]" />
        </div>

        {/* Text Area */}
        <div className="flex flex-col gap-2 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-serif text-3xl md:text-4xl text-[#5E3A3A] tracking-wide"
          >
            Welcome to <span className="text-[#ff808b]">mysl.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex flex-col items-center"
          >
            <p className="font-garamond italic text-lg md:text-xl text-[#7A5A5A] leading-relaxed">
              Take your time.
            </p>
            <p className="font-garamond italic text-lg md:text-xl text-[#7A5A5A] leading-relaxed">
              Stay as long as you like.
            </p>
          </motion.div>
        </div>

        {/* Open Door Button */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(250,85,101,0.15)' }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          onClick={onEnter}
          className="px-8 py-3.5 bg-gradient-to-r from-[#ffd6d9] to-[#ffb3b8] hover:from-[#ffb3b8] hover:to-[#ff808b] text-white rounded-full font-serif tracking-widest text-sm shadow-md hover:shadow-lg transition-all border border-white/40 cursor-pointer flex items-center gap-2 group interactive-obj"
        >
          <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          Open the Door
        </motion.button>
      </motion.div>

      {/* Aesthetic bottom footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 font-garamond italic text-sm text-[#8A7171] tracking-wider"
      >
        Indonesia • Est. 2008 • Coquette Vintage
      </motion.p>
    </div>
  );
}
