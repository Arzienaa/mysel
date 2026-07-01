import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Quote, ArrowRight, Calendar, Compass, Star } from 'lucide-react';
import { RoomId } from '../types';

interface HomeRoomProps {
  onNavigate: (room: RoomId) => void;
  girlIllustration: string;
}

const MOOD_QUOTES = [
  'Pink is a feeling.',
  'Take your time.',
  'You are growing beautifully.',
  'Small joys matter.',
  'Soft hearts bloom slowly.',
  'Flowers always know when to bloom.',
  'Pretty things take time.',
  'Choose comfort and warmth today.',
  'Step gently into your own garden.',
];

export default function HomeRoom({ onNavigate, girlIllustration }: HomeRoomProps) {
  const [dailyQuote, setDailyQuote] = useState('');

  useEffect(() => {
    // Generate a consistent seeded quote for the day
    const day = new Date().getDate();
    const index = day % MOOD_QUOTES.length;
    setDailyQuote(MOOD_QUOTES[index]);
  }, []);

  return (
    <div className="flex flex-col gap-12 w-full max-w-6xl mx-auto px-4 py-8">
      {/* Hero Collage Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Hand: Scrapbook Text Area */}
        <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1 text-center lg:text-left">
          {/* Daily Mood Quote Banner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex self-center lg:self-start items-center gap-2 px-4 py-1.5 bg-[#FFEBEB] rounded-full text-[#ff808b] text-xs font-serif tracking-wider border border-[#ffd6d9]"
          >
            <Star className="w-3.5 h-3.5 fill-pink-300 stroke-none" />
            <span>Daily Mood: {dailyQuote}</span>
          </motion.div>

          <div className="flex flex-col gap-3">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#5E3A3A] tracking-wide leading-[1.15]">
              Hello, I'm <span className="font-handwritten text-[#ff808b] text-5xl md:text-6xl block lg:inline">mysl.</span>
            </h1>
            <p className="font-garamond italic text-xl md:text-2xl text-[#8A7171] mt-2">
              “People say pink reminds them of me.”
            </p>
          </div>

          <p className="font-sans text-sm md:text-base text-[#7A6060] leading-relaxed max-w-md mx-auto lg:mx-0">
            Welcome to my little digital sanctuary. Stay as long as you like, click on objects around the rooms, play slow games, or write in my guestbook.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-2">
            <button
              onClick={() => onNavigate('bedroom')}
              className="px-6 py-3 bg-[#ffb3b8] hover:bg-[#ff808b] text-white rounded-full font-serif text-sm tracking-widest shadow-md transition-all flex items-center gap-2 group cursor-pointer interactive-obj"
            >
              Come inside
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('games')}
              className="px-6 py-3 bg-white/80 hover:bg-[#ffebeb] text-[#ff808b] border border-[#ffb3b8]/40 rounded-full font-serif text-sm tracking-widest transition-all cursor-pointer interactive-obj"
            >
              Play Relaxing Games
            </button>
          </div>

          {/* Aesthetic Stamp Card */}
          <div className="hidden lg:flex items-center gap-4 mt-4 p-4 rounded-2xl bg-white/40 border border-white/60 w-fit">
            <div className="w-12 h-12 rounded-full bg-[#FAF6F0] border-2 border-dashed border-[#ffb3b8] flex items-center justify-center font-handwritten text-xl text-[#ffb3b8]">
              m
            </div>
            <div className="text-xs font-serif text-[#8A7171] tracking-wider leading-relaxed">
              <p>📍 Indonesia</p>
              <p>🎂 08 May 2008</p>
              <p>🦢 Cozy World</p>
            </div>
          </div>
        </div>

        {/* Right Hand: Gorgeous Custom-Generated Aesthetic Illustration */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative p-3 bg-white rounded-3xl shadow-xl border border-pink-100 max-w-lg mx-auto"
          >
            {/* Scrapbook pin decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center border border-white shadow-sm z-10">
              <div className="w-4 h-4 bg-pink-300 rounded-full" />
            </div>

            {/* Main Picture Frame */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-inner border border-stone-100">
              <img
                src={girlIllustration}
                alt="Me in pink cardigan standing near pink cottage garden"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-100/10 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Tape/Labels overlays */}
            <div className="absolute bottom-6 right-6 bg-[#FAF6F0]/90 px-3 py-1 rounded-md text-[10px] font-serif tracking-widest text-[#8A7171] border border-white shadow-sm">
              @mysl.cmrell
            </div>
            <div className="absolute top-6 left-6 rotate-[-5deg] bg-yellow-50/90 px-3 py-1 rounded-sm text-[10px] font-handwritten text-[#9C7F5F] border border-yellow-100 shadow-sm">
              holding white lilies ✿
            </div>
          </motion.div>
        </div>
      </div>

      {/* Room Selection Grid / Map */}
      <div className="flex flex-col gap-6 mt-8">
        <div className="text-center max-w-md mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-[#5E3A3A] tracking-wider">
            Explore My Little Cottage
          </h2>
          <p className="font-garamond italic text-base text-[#8A7171] mt-1">
            "Every door leads to a different memory, a cozy corner, or a sweet game."
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { id: 'bedroom', name: '🌸 Bedroom', desc: 'A dreamy room filled with books and teddy bears.' },
            { id: 'garden', name: '🌿 Flower Garden', desc: 'Click lilies and roses to uncover magical secret notes.' },
            { id: 'vanity', name: '💄 Vanity Table', desc: 'Interact with perfume bottles and look in the mirror.' },
            { id: 'bookshelf', name: '📚 Bookshelf', desc: 'Browse through my favorite reads, reviews, and genres.' },
            { id: 'memory-box', name: '📦 Memory Box', desc: 'Cute Polaroid memories and happy little moments.' },
            { id: 'little-cafe', name: '🍵 Little Café', desc: 'Enjoy warm matcha steam and sweet recipe cards.' },
            { id: 'guestbook', name: '✍️ Guestbook', desc: 'Leave a cozy handwritten note on parchment paper.' },
            { id: 'games', name: '🧸 Mini Games', desc: 'Bake cakes, catch berries, or feed my bunny.' },
          ].map((room, idx) => (
            <motion.button
              key={room.id}
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              onClick={() => onNavigate(room.id as RoomId)}
              className="glass-panel hover:glass-panel-pink p-5 rounded-2xl flex flex-col items-center text-center gap-2 cursor-pointer transition-all border border-[#ffb3b8]/20 group interactive-obj"
            >
              <div className="font-serif font-medium text-[#5E3A3A] group-hover:text-[#ff808b] text-base transition-colors">
                {room.name}
              </div>
              <div className="font-sans text-[11px] text-[#8A7171] leading-relaxed">
                {room.desc}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
