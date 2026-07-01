import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, RefreshCw } from 'lucide-react';

interface VanityRoomProps {
  onTriggerPetals: () => void;
}

const VANITY_REFLECTIONS = [
  "You carry a soft light inside you.",
  "Your smile is a bloom of pure joy.",
  "You are enough, exactly as you are.",
  "In a world of rush, you are a gentle note.",
  "Every layer of you is beautifully crafted.",
  "Your presence is a warm hug."
];

export default function VanityRoom({ onTriggerPetals }: VanityRoomProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [reflectionIdx, setReflectionIdx] = useState(0);
  const [isCandleBurning, setIsCandleBurning] = useState(false);
  const [makeupBlushColor, setMakeupBlushColor] = useState<'blush' | 'peach' | 'rose'>('blush');
  const [isSkincareOpened, setIsSkincareOpened] = useState(false);

  // Perfume local spritz visual particles
  const [perfumeSprays, setPerfumeSprays] = useState<{ id: number; x: number; y: number }[]>([]);
  const audioCtxRef = React.useRef<AudioContext | null>(null);

  const initAudioCtx = (): AudioContext | null => {
    if (!audioCtxRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser", e);
        return null;
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Synthesize realistic cozy perfume spray sound (shhh-puff!)
  const playPerfumeSpraySound = () => {
    const ctx = initAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    // White noise buffer
    const bufferSize = ctx.sampleRate * 0.45; // 0.45 seconds spray
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to make it soft, airy and misty
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1900, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + 0.35);
    filter.Q.setValueAtTime(1.8, now);

    // Gain envelope for "shhh-puff"
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.16, now + 0.03); // Fast attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.42); // Soft decay

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noise.start(now);
  };

  const triggerPerfumeSpray = () => {
    playPerfumeSpraySound();
    onTriggerPetals();

    // Spawn 8 local sparkling mist spray particles
    const newSprays = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60, // random horizontal spread
      y: -30 - Math.random() * 40,    // random vertical lift
    }));
    setPerfumeSprays((prev) => [...prev, ...newSprays]);

    // Clean up local sprays after animation
    setTimeout(() => {
      setPerfumeSprays((prev) => prev.filter((s) => Date.now() - s.id < 1200));
    }, 1500);
  };

  // Clean up audio context on unmount
  React.useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleMirrorClick = () => {
    setReflectionIdx((prev) => (prev + 1) % VANITY_REFLECTIONS.length);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#FFF8F8] rounded-3xl p-6 md:p-8 border border-pink-100 relative shadow-sm">
      
      {/* Table backdrop glow */}
      {isCandleBurning && (
        <div className="absolute inset-0 bg-amber-500/5 mix-blend-color-burn pointer-events-none rounded-3xl transition-opacity duration-1000" />
      )}

      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-10">
        <h1 className="font-serif text-3xl text-[#5E3A3A] tracking-wider">
          My Illustrated Vanity Table
        </h1>
        <p className="font-garamond italic text-base text-[#8A7171] mt-1">
          "Uncover my favorite vanity essentials. Click any object to interact."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Illustrated Table Tray (Left 7 Columns) */}
        <div className="md:col-span-7 bg-[#FAF2F2] rounded-3xl border-2 border-dashed border-[#ffb3b8]/40 aspect-[4/3] relative flex items-center justify-center overflow-hidden shadow-inner p-4">
          
          {/* Vanity Table Rim shadow */}
          <div className="absolute inset-4 rounded-3xl border border-white/50 bg-[#FFFBFB]/60 flex flex-col justify-end p-4 text-center">
            <span className="font-handwritten text-lg text-pink-300 pointer-events-none">mysl's vanity tray ✿</span>
          </div>

          {/* Perfume Bottle */}
          <motion.button
            whileHover={{ y: -5, scale: 1.05 }}
            onClick={() => {
              setActiveItem('perfume');
              triggerPerfumeSpray();
            }}
            className="absolute top-[20%] left-[15%] flex flex-col items-center cursor-pointer interactive-obj group"
          >
            <div className="w-14 h-16 bg-pink-100 rounded-xl border border-pink-200 relative shadow-sm flex items-center justify-center">
              <span className="text-xl">🌸</span>
              <div className="absolute -top-3 w-6 h-3 bg-yellow-400 rounded-full" />
              <div className="absolute right-[-10px] top-[15px] w-4 h-4 bg-red-400 rounded-full animate-pulse" /> {/* Atomizer */}
              
              {/* Animated local spray particles right over the tray bottle */}
              <AnimatePresence>
                {activeItem === 'perfume' && perfumeSprays.map((spray) => (
                  <motion.div
                    key={`vanity-tray-spray-${spray.id}`}
                    initial={{ opacity: 1, scale: 0.2, x: 0, y: -10 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0.2, 1.3, 0.5], 
                      x: spray.x * 0.4, 
                      y: spray.y * 0.6 
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute text-pink-300 pointer-events-none select-none text-base z-50"
                  >
                    ✨💨
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <span className="text-[10px] font-serif text-[#8A7171] mt-2 group-hover:text-[#ff808b] transition-colors">Perfume Spray</span>
          </motion.button>

          {/* Skincare Hydrating Cream */}
          <motion.button
            whileHover={{ y: -5, scale: 1.05 }}
            onClick={() => setActiveItem('skincare')}
            className="absolute top-[22%] right-[15%] flex flex-col items-center cursor-pointer interactive-obj group"
          >
            <div className="w-16 h-12 bg-white rounded-lg border border-pink-100 relative shadow-sm flex items-center justify-center">
              <div className="absolute inset-x-0 top-0 h-3.5 bg-yellow-400/40 border-b border-pink-100 rounded-t-lg" />
              <span className="text-lg z-10">🧴</span>
            </div>
            <span className="text-[10px] font-serif text-[#8A7171] mt-2 group-hover:text-[#ff808b] transition-colors">Hydrating Jars</span>
          </motion.button>

          {/* Makeup Palette */}
          <motion.button
            whileHover={{ y: -5, scale: 1.05 }}
            onClick={() => setActiveItem('makeup')}
            className="absolute bottom-[20%] left-[25%] flex flex-col items-center cursor-pointer interactive-obj group"
          >
            <div className="w-16 h-14 bg-[#FFF5F6] border border-pink-200 rounded-lg shadow-sm flex flex-wrap gap-1 p-1">
              <div className="w-6 h-5 bg-[#ffb3b8] rounded-sm" />
              <div className="w-6 h-5 bg-[#ffd6d9] rounded-sm" />
              <div className="w-6 h-5 bg-amber-100 rounded-sm" />
              <div className="w-6 h-5 bg-[#ffebeb] rounded-sm" />
            </div>
            <span className="text-[10px] font-serif text-[#8A7171] mt-2 group-hover:text-[#ff808b] transition-colors">Compact Blush</span>
          </motion.button>

          {/* Wooden Hand Mirror */}
          <motion.button
            whileHover={{ y: -5, scale: 1.05 }}
            onClick={() => setActiveItem('mirror')}
            className="absolute top-[45%] left-[45%] flex flex-col items-center cursor-pointer interactive-obj group"
          >
            <div className="w-14 h-14 bg-amber-50 border-2 border-yellow-700/20 rounded-full relative shadow-sm flex items-center justify-center">
              <div className="absolute inset-1 rounded-full bg-[#EBF7FF]/50 border border-white" />
              <span className="text-sm z-10">✨</span>
              <div className="absolute bottom-[-15px] w-2.5 h-6 bg-amber-100 rounded-sm border border-yellow-700/10" /> {/* handle */}
            </div>
            <span className="text-[10px] font-serif text-[#8A7171] mt-[22px] group-hover:text-[#ff808b] transition-colors">Cosmetic Mirror</span>
          </motion.button>

          {/* Rose Scented Candles */}
          <motion.button
            whileHover={{ y: -5, scale: 1.05 }}
            onClick={() => {
              setActiveItem('candles');
              setIsCandleBurning(!isCandleBurning);
            }}
            className="absolute bottom-[20%] right-[25%] flex flex-col items-center cursor-pointer interactive-obj group"
          >
            <div className="relative">
              {isCandleBurning && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="w-4 h-5 bg-amber-400 rounded-full blur-[1px] absolute -top-5 left-1/2 -translate-x-1/2"
                />
              )}
              <div className="w-8 h-10 bg-pink-100 border border-pink-200 rounded-md" />
            </div>
            <span className="text-[10px] font-serif text-[#8A7171] mt-2 group-hover:text-[#ff808b] transition-colors">Soy Candles</span>
          </motion.button>

        </div>

        {/* Dynamic Overlay Detail Panel (Right 5 Columns) */}
        <div className="md:col-span-5 h-full min-h-[320px]">
          <AnimatePresence mode="wait">
            {activeItem ? (
              <motion.div
                key={activeItem}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="glass-panel-deep p-6 rounded-3xl border border-[#ffb3b8]/40 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-pink-100">
                    <h3 className="font-serif text-lg font-bold text-[#5E3A3A]">
                      {activeItem === 'perfume' && '🌸 Parisian Perfume'}
                      {activeItem === 'skincare' && '🧴 Hydrating Serum Jars'}
                      {activeItem === 'makeup' && '💄 Coquette Blush Palette'}
                      {activeItem === 'mirror' && '🪞 Hand-Carved Mirror'}
                      {activeItem === 'candles' && '🕯️ Scented Soy Candle'}
                    </h3>
                    <button
                      onClick={() => setActiveItem(null)}
                      className="text-xs font-serif text-[#ff808b] hover:underline cursor-pointer interactive-obj"
                    >
                      Close ✕
                    </button>
                  </div>

                  {/* Perfume dialog */}
                  {activeItem === 'perfume' && (
                    <div className="flex flex-col gap-3">
                      <p className="text-xs text-[#7A6060] leading-relaxed">
                        A customized fragrance blending sweet lily, baby roses, strawberries, and soft powdery notes.
                      </p>
                      <div className="p-4 rounded-2xl bg-[#FFF5F6] border border-[#ffb3b8]/20 flex flex-col gap-2 items-center text-center relative overflow-hidden">
                        <div className="relative z-10">
                          <span className="text-3xl inline-block animate-bounce">💨🧴</span>
                        </div>
                        <p className="text-[11px] text-[#8A7171] z-10">You sprayed the perfume! Magical pink rose petals have been released in the room.</p>
                        
                        {/* Spritz particles within the info card container */}
                        <AnimatePresence>
                          {perfumeSprays.map((spray) => (
                            <motion.div
                              key={`vanity-card-spray-${spray.id}`}
                              initial={{ opacity: 1, scale: 0.3, y: 15 }}
                              animate={{ 
                                opacity: [0, 1, 0], 
                                scale: [0.3, 1.4, 0.6], 
                                x: spray.x, 
                                y: spray.y 
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.9, ease: 'easeOut' }}
                              className="absolute text-pink-300 pointer-events-none select-none text-xl"
                            >
                              ✨💨
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      <button
                        onClick={triggerPerfumeSpray}
                        className="w-full py-2 bg-[#ffb3b8] hover:bg-[#ff808b] text-white text-xs font-serif rounded-full cursor-pointer interactive-obj shadow-sm transition-all"
                      >
                        Spray Again! 🌸
                      </button>
                    </div>
                  )}

                  {/* Skincare dialog */}
                  {activeItem === 'skincare' && (
                    <div className="flex flex-col gap-3">
                      <p className="text-xs text-[#7A6060] leading-relaxed">
                        Luxury glass pots filled with a whipped pink moisturizer. Locks in morning hydration.
                      </p>
                      <div className="p-4 rounded-2xl bg-[#FFF5F6] border border-[#ffb3b8]/20 flex flex-col gap-2 items-center text-center">
                        <span className="text-3xl">{isSkincareOpened ? '🌸💧' : '🧴🔒'}</span>
                        <p className="text-[11px] text-[#8A7171]">
                          {isSkincareOpened
                            ? 'The whipped cream smells like baby lilies!'
                            : 'Unscrew the gold lid to inspect the hydrating cream.'}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSkincareOpened(!isSkincareOpened)}
                        className="w-full py-2 bg-[#ffb3b8] hover:bg-[#ff808b] text-white text-xs font-serif rounded-full cursor-pointer interactive-obj"
                      >
                        {isSkincareOpened ? 'Close Jar Lid' : 'Open Hydrating Jar ✨'}
                      </button>
                    </div>
                  )}

                  {/* Makeup Dialog */}
                  {activeItem === 'makeup' && (
                    <div className="flex flex-col gap-3">
                      <p className="text-xs text-[#7A6060] leading-relaxed">
                        A beautiful coquette compact powder with baby pink and gold embossing.
                      </p>
                      
                      <div className="flex flex-col gap-2">
                        <span className="text-[11px] font-serif uppercase tracking-wider text-[#8A7171]">Blush Shade:</span>
                        <div className="flex gap-2 justify-center">
                          {(['blush', 'peach', 'rose'] as const).map((shade) => (
                            <button
                              key={shade}
                              onClick={() => setMakeupBlushColor(shade)}
                              className={`px-3 py-1 rounded-full text-[10px] font-serif cursor-pointer interactive-obj ${
                                makeupBlushColor === shade
                                  ? 'bg-[#ffb3b8] text-white border-white shadow-sm'
                                  : 'bg-white text-[#5E3A3A] border-[#ffd6d9] hover:bg-[#FFEBEB]'
                              }`}
                            >
                              {shade === 'blush' ? '🎀 Baby Pink' : shade === 'peach' ? '🍑 Apricot' : '🌹 Wild Rose'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={`p-4 rounded-2xl border text-center transition-all ${
                        makeupBlushColor === 'blush' ? 'bg-pink-50 border-pink-200 text-pink-700' : makeupBlushColor === 'peach' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-700'
                      }`}>
                        <span className="text-lg">🖌️🌸</span>
                        <p className="text-[10px] mt-1 font-serif">Applying {makeupBlushColor === 'blush' ? 'Baby Pink' : makeupBlushColor === 'peach' ? 'Apricot Peach' : 'Wild Rose'} pigment onto your virtual cheeks.</p>
                      </div>
                    </div>
                  )}

                  {/* Mirror Dialog */}
                  {activeItem === 'mirror' && (
                    <div className="flex flex-col gap-3 text-center">
                      <p className="text-xs text-[#7A6060] leading-relaxed">
                        Peer into the hand-carved cosmetic mirror. Click below to reveal your daily sweet quote reflection.
                      </p>

                      <div className="p-5 rounded-2xl bg-white border border-[#ffb3b8]/30 min-h-[100px] flex items-center justify-center shadow-inner relative">
                        <span className="absolute top-2 right-2 text-pink-300">✦</span>
                        <p className="font-garamond italic text-sm text-[#5E3A3A] font-medium">
                          “{VANITY_REFLECTIONS[reflectionIdx]}”
                        </p>
                      </div>

                      <button
                        onClick={handleMirrorClick}
                        className="w-full py-1.5 bg-[#FFEBEB] hover:bg-[#ffd6d9] text-[#ff808b] text-xs font-serif rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer interactive-obj"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Next reflection
                      </button>
                    </div>
                  )}

                  {/* Candles Dialog */}
                  {activeItem === 'candles' && (
                    <div className="flex flex-col gap-3 items-center text-center">
                      <p className="text-xs text-[#7A6060] leading-relaxed">
                        Handcrafted soy candle infused with sweet oil of roses and dry sandalwood notes.
                      </p>

                      <div className={`p-4 rounded-2xl w-full border ${
                        isCandleBurning ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-pink-50 border-pink-200 text-pink-700'
                      }`}>
                        <span className="text-2xl">{isCandleBurning ? '🔥🕯️' : '🕯️'}</span>
                        <p className="text-[10px] mt-1 font-serif">
                          {isCandleBurning
                            ? 'Vanilla rose warmth fills the air.'
                            : 'The candle is currently cold. Let us light it up.'}
                        </p>
                      </div>

                      <button
                        onClick={() => setIsCandleBurning(!isCandleBurning)}
                        className={`w-full py-2 rounded-full text-xs font-serif cursor-pointer interactive-obj ${
                          isCandleBurning ? 'bg-amber-400 text-white hover:bg-amber-500' : 'bg-[#ffb3b8] text-white hover:bg-[#ff808b]'
                        }`}
                      >
                        {isCandleBurning ? 'Extinguish Candle ✕' : 'Light Scented Candle ✨'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-center text-[10px] text-[#8A7171] font-serif border-t border-pink-100/40 pt-4 mt-6">
                  “Become the best version of yourself.”
                </div>
              </motion.div>
            ) : (
              <div className="glass-panel p-6 rounded-3xl border border-[#ffb3b8]/20 h-full flex flex-col justify-center items-center text-center text-[#8A7171]">
                <span className="text-3xl animate-pulse">💄</span>
                <h3 className="font-serif text-lg font-medium text-[#5E3A3A] mt-2 mb-1">
                  Vanity Desk
                </h3>
                <p className="text-xs max-w-xs leading-relaxed">
                  Every cosmetic container, soy candle, and hand mirror tells a story. Click on any item around the vanity to explore details.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
