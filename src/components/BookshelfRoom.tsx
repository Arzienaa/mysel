import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, BookOpen, Music, Film, User, Star } from 'lucide-react';

interface FavoriteItem {
  id: string;
  name: string;
  type: 'music' | 'movie' | 'food_drink';
  details: string;
  illustration: string;
}

const FAVORITES: FavoriteItem[] = [
  // Music
  { id: 'alaina', name: 'Alaina Castillo', type: 'music', details: 'Sings with deep, sweet, angelic vocal tracks that wrap around your heart. Favorite song: "Pass You By".', illustration: '💿🌸' },
  { id: 'olivia', name: 'Olivia Rodrigo', type: 'music', details: 'Nostalgic, poetic, and completely raw. Captures that 2000s teenage drama vibe. Favorite song: "Stranger".', illustration: '💿💜' },
  { id: 'keshi', name: 'Keshi', type: 'music', details: 'Warm lo-fi guitar chords and delicate falsettos. Perfect for cozy rainy days.', illustration: '💿☁️' },
  { id: 'summer', name: 'Summer Walker', type: 'music', details: 'Rich, sensual, smooth R&B loops. Cozy candlelit evening companion.', illustration: '💿🕯️' },
  
  // Movies
  { id: 'meangirls', name: 'Mean Girls', type: 'movie', details: 'The ultimate pink high-school cinema masterclass. Crucial for Wednesday outfits.', illustration: '📼🎀' },
  { id: 'legallyblonde', name: 'Legally Blonde', type: 'movie', details: 'Feminine strength, sparkly pink notebooks, and pure positive motivation!', illustration: '📼💼' },
  { id: 'friends', name: 'Friends', type: 'movie', details: 'Comforting couch, warm mugs, and familiar jokes. Feels like a cozy blanket.', illustration: '📼☕' },

  // Foods / Treats
  { id: 'tiramisu', name: 'Tiramisu Cake', type: 'food_drink', details: 'Fragrant espresso, velvet mascarpone cream layers, and soft cocoa dust.', illustration: '🍰☕' },
  { id: 'matcha', name: 'Matcha Tea', type: 'food_drink', details: 'Earthy green tea whisked into warm, frothy sweet oat milk.', illustration: '🍵💚' },
  { id: 'strawberry', name: 'Strawberry Drinks', type: 'food_drink', details: 'Fresh sweet strawberries blended with ice and cold organic cream.', illustration: '🥛🍓' },
  { id: 'avocado', name: 'Avocado', type: 'food_drink', details: 'Creamy, rich, and delicious. My absolute favorite fruit.', illustration: '🥑' },
];

export default function BookshelfRoom() {
  const [activeTab, setActiveTab] = useState<'scrapbook' | 'shelves'>('scrapbook');
  const [activeFav, setActiveFav] = useState<FavoriteItem | null>(null);
  
  // Scrapbook spread index (0 = Pages 1 & 2, 1 = Pages 3 & 4)
  const [currentSpread, setCurrentSpread] = useState(0);

  const scrapbookPages = [
    {
      title: "My Identity",
      items: [
        { label: "Birthday", val: "08 May 2008" },
        { label: "Country", val: "Indonesia 🇮🇩" },
        { label: "Aesthetics", val: "Calm, Dreamy, Pink 🌸" },
        { label: "Life Motto", val: "Become the best version of yourself." }
      ]
    },
    {
      title: "My Hobbies",
      items: [
        { label: "Self Care", val: "Skincare, Body Care, Hair Care" },
        { label: "Entertainment", val: "Watching 2000s girl movies, Gaming" },
        { label: "Listening", val: "R&B, Lo-Fi, Cozy pop music" }
      ],
      quote: "The earth laughs in flowers."
    },
    {
      title: "Things That Make Me Happy",
      bullets: [
        "🌦️ Rain tapping softly on the window",
        "💐 Fresh white lilies, roses, and daisies",
        "🧴 Soft, fragrant sweet floral perfume sprays",
        "🛌 A cozy warm bed with pink gingham sheets",
        "☀️ Bright, peaceful morning sunlight"
      ]
    },
    {
      title: "My Favorite Treats & Animals",
      items: [
        { label: "Favorites Desserts", val: "Tiramisu Cake 🍰" },
        { label: "Cozy Drinks", val: "Warm Matcha, Strawberry Cream Milk" },
        { label: "Favorite Food", val: "Sizzling Grilled Meat 🥩" },
        { label: "Sweet Creatures", val: "Bunnies 🐰, Cats 🐱, and elegant Swans 🦢" }
      ]
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#FAF6F2] rounded-3xl p-6 md:p-8 border border-pink-100 relative shadow-sm">
      
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-8">
        <h1 className="font-serif text-3xl text-[#5E3A3A] tracking-wider">
          Scrapbook & Favorites Shelf
        </h1>
        <p className="font-garamond italic text-base text-[#8A7171] mt-1">
          "Flip through my handmade diary pages, or browse my illustrated favorite things."
        </p>
      </div>

      {/* Mode Switches */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => setActiveTab('scrapbook')}
          className={`px-5 py-2 rounded-full font-serif text-xs tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border interactive-obj ${
            activeTab === 'scrapbook'
              ? 'bg-[#ffb3b8] text-white border-[#ffb3b8] shadow-sm'
              : 'bg-white text-[#5E3A3A] border-[#ffd6d9] hover:bg-[#FFEBEB]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Handmade Scrapbook Diary
        </button>
        <button
          onClick={() => setActiveTab('shelves')}
          className={`px-5 py-2 rounded-full font-serif text-xs tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border interactive-obj ${
            activeTab === 'shelves'
              ? 'bg-[#ffb3b8] text-white border-[#ffb3b8] shadow-sm'
              : 'bg-white text-[#5E3A3A] border-[#ffd6d9] hover:bg-[#FFEBEB]'
          }`}
        >
          <Star className="w-4 h-4" />
          Illustrated Favorites Shelves
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[460px]">
        
        {/* Left Side: Interactive Area */}
        <div className="lg:col-span-8 h-full">
          <AnimatePresence mode="wait">
            {activeTab === 'scrapbook' ? (
              /* Scrapbook view - Open Book Double Page Spread */
              <motion.div
                key="scrapbook-spread"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#FDFBF7] rounded-3xl p-6 md:p-8 shadow-lg border border-[#e8d5cc] min-h-[500px] flex flex-col justify-between relative"
              >
                {/* Book spine line styling for dual-page effect on desktop */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-stone-300/60 shadow-[0_0_8px_rgba(0,0,0,0.1)] z-10">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-stone-400/80 border border-stone-300" />
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-stone-400/80 border border-stone-300" />
                  <div className="absolute top-2/4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-stone-400/80 border border-stone-300" />
                  <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-stone-400/80 border border-stone-300" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-stone-400/80 border border-stone-300" />
                </div>

                {/* Quick-Jump Spread Tabs */}
                <div className="flex justify-center gap-4 mb-4 border-b border-stone-100 pb-2">
                  <button
                    onClick={() => setCurrentSpread(0)}
                    className={`px-3 py-1 text-xs font-serif rounded-full border cursor-pointer transition-all ${
                      currentSpread === 0
                        ? 'bg-pink-100 text-[#ff808b] border-pink-200 font-bold'
                        : 'bg-white text-stone-500 border-stone-100 hover:bg-stone-50'
                    }`}
                  >
                    📖 Page 1 & 2: Bio & Hobbies
                  </button>
                  <button
                    onClick={() => setCurrentSpread(1)}
                    className={`px-3 py-1 text-xs font-serif rounded-full border cursor-pointer transition-all ${
                      currentSpread === 1
                        ? 'bg-pink-100 text-[#ff808b] border-pink-200 font-bold'
                        : 'bg-white text-stone-500 border-stone-100 hover:bg-stone-50'
                    }`}
                  >
                    📖 Page 3 & 4: Happiness & Treats
                  </button>
                </div>

                {/* Dual Pages Wrapper */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 flex-1 items-stretch">
                  
                  {/* Left Page (Page 1 or Page 3) */}
                  <div className="flex flex-col justify-between pr-0 md:pr-4">
                    {currentSpread === 0 ? (
                      /* Page 1: My Identity */
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center pb-2 border-b border-pink-100">
                          <span className="font-serif text-[#ff808b] text-sm md:text-base font-bold tracking-wider uppercase">
                            📝 {scrapbookPages[0].title}
                          </span>
                          <span className="font-handwritten text-[#9C7F5F] text-sm font-bold">page 01</span>
                        </div>
                        
                        <div className="flex flex-col gap-3.5 mt-2">
                          {scrapbookPages[0].items?.map((it, i) => (
                            <div key={i} className="p-3.5 bg-[#FFF9F9] hover:bg-[#FFF5F6] rounded-xl border border-[#ffb3b8]/20 flex flex-col gap-1 transition-all shadow-sm">
                              <span className="text-[11px] font-sans uppercase text-pink-500 font-bold tracking-widest">{it.label}</span>
                              <span className="text-sm md:text-base font-medium text-[#5E3A3A] font-serif">{it.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Page 3: Things That Make Me Happy */
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center pb-2 border-b border-pink-100">
                          <span className="font-serif text-[#ff808b] text-sm md:text-base font-bold tracking-wider uppercase">
                            🌦️ {scrapbookPages[2].title}
                          </span>
                          <span className="font-handwritten text-[#9C7F5F] text-sm font-bold">page 03</span>
                        </div>
                        
                        <div className="flex flex-col gap-3 mt-2">
                          {scrapbookPages[2].bullets?.map((b, i) => (
                            <div key={i} className="p-3 bg-white/80 hover:bg-[#FFFDFC] rounded-xl border border-stone-100 text-xs md:text-sm text-[#5E3A3A] font-serif leading-relaxed shadow-sm flex items-start gap-2">
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Page (Page 2 or Page 4) */}
                  <div className="flex flex-col justify-between pl-0 md:pl-4 border-t md:border-t-0 border-dashed border-stone-200/60 pt-6 md:pt-0">
                    {currentSpread === 0 ? (
                      /* Page 2: My Hobbies */
                      <div className="flex flex-col gap-4 h-full justify-between">
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-center pb-2 border-b border-pink-100">
                            <span className="font-serif text-[#ff808b] text-sm md:text-base font-bold tracking-wider uppercase">
                              🧸 {scrapbookPages[1].title}
                            </span>
                            <span className="font-handwritten text-[#9C7F5F] text-sm font-bold">page 02</span>
                          </div>
                          
                          <div className="flex flex-col gap-3 mt-2">
                            {scrapbookPages[1].items?.map((it, i) => (
                              <div key={i} className="p-3.5 bg-[#FFF9F9] hover:bg-[#FFF5F6] rounded-xl border border-[#ffb3b8]/20 flex flex-col gap-1 transition-all shadow-sm">
                                <span className="text-[11px] font-sans uppercase text-pink-500 font-bold tracking-widest">{it.label}</span>
                                <span className="text-sm md:text-base font-medium text-[#5E3A3A] font-serif">{it.val}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {scrapbookPages[1].quote && (
                          <div className="text-center mt-4 p-3 bg-pink-50/40 rounded-xl border border-pink-100/30">
                            <p className="font-handwritten text-lg text-[#ff808b] italic">
                              “{scrapbookPages[1].quote}”
                            </p>
                            <p className="text-[10px] font-serif text-[#8A7171] uppercase tracking-wider mt-1">
                              — Ralph Waldo Emerson
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Page 4: My Favorite Treats & Animals */
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center pb-2 border-b border-pink-100">
                          <span className="font-serif text-[#ff808b] text-sm md:text-base font-bold tracking-wider uppercase">
                            🍰 {scrapbookPages[3].title}
                          </span>
                          <span className="font-handwritten text-[#9C7F5F] text-sm font-bold">page 04</span>
                        </div>
                        
                        <div className="flex flex-col gap-3 mt-2">
                          {scrapbookPages[3].items?.map((it, i) => (
                            <div key={i} className="p-3.5 bg-[#FFF9F9] hover:bg-[#FFF5F6] rounded-xl border border-[#ffb3b8]/20 flex flex-col gap-1 transition-all shadow-sm">
                              <span className="text-[11px] font-sans uppercase text-pink-500 font-bold tracking-widest">{it.label}</span>
                              <span className="text-sm md:text-base font-medium text-[#5E3A3A] font-serif">{it.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Flip Book Bottom Navigation */}
                <div className="flex justify-between items-center mt-8 pt-4 border-t border-stone-100">
                  <button
                    disabled={currentSpread === 0}
                    onClick={() => setCurrentSpread(0)}
                    className="px-4 py-2 bg-white hover:bg-[#FFEBEB] border border-pink-200 rounded-full text-xs md:text-sm font-serif text-[#ff808b] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-sm flex items-center gap-1.5 interactive-obj"
                  >
                    ← Previous Pages (1 & 2)
                  </button>
                  <span className="text-xs text-[#8A7171] font-serif font-medium bg-[#FFF9F9] px-3 py-1 rounded-full border border-pink-100/40 shadow-sm">
                    Spread {currentSpread + 1} / 2
                  </span>
                  <button
                    disabled={currentSpread === 1}
                    onClick={() => setCurrentSpread(1)}
                    className="px-4 py-2 bg-white hover:bg-[#FFEBEB] border border-pink-200 rounded-full text-xs md:text-sm font-serif text-[#ff808b] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-sm flex items-center gap-1.5 interactive-obj"
                  >
                    Next Pages (3 & 4) →
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Favorites Shelves view */
              <motion.div
                key="shelves"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-[#FAF2E8] rounded-3xl p-6 shadow-md border border-[#E1D4C3] aspect-[4/3] flex flex-col justify-between relative"
              >
                {/* Visual shelves */}
                <div className="flex-1 flex flex-col justify-around py-4">
                  
                  {/* Top Shelf: Music */}
                  <div className="flex flex-col">
                    <div className="flex gap-4 justify-around px-4 mb-1">
                      {FAVORITES.filter((f) => f.type === 'music').map((fav) => (
                        <motion.button
                          key={fav.id}
                          whileHover={{ y: -6, scale: 1.1 }}
                          onClick={() => setActiveFav(fav)}
                          className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center text-xl cursor-pointer shadow border border-stone-800 relative group interactive-obj"
                          title={fav.name}
                        >
                          <span className="group-hover:animate-spin">{fav.illustration}</span>
                        </motion.button>
                      ))}
                    </div>
                    {/* Wooden Shelf Line */}
                    <div className="h-2.5 bg-amber-800 rounded-full shadow-inner border-t border-amber-900" />
                    <span className="text-[9px] text-[#A68F7B] font-serif text-center mt-1 uppercase tracking-wider">Shelf 1: Favorite Artists</span>
                  </div>

                  {/* Middle Shelf: Movies */}
                  <div className="flex flex-col">
                    <div className="flex gap-4 justify-around px-4 mb-1">
                      {FAVORITES.filter((f) => f.type === 'movie').map((fav) => (
                        <motion.button
                          key={fav.id}
                          whileHover={{ y: -6, scale: 1.1 }}
                          onClick={() => setActiveFav(fav)}
                          className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-xl cursor-pointer shadow border border-pink-200 relative group interactive-obj"
                          title={fav.name}
                        >
                          <span>{fav.illustration}</span>
                        </motion.button>
                      ))}
                    </div>
                    {/* Wooden Shelf Line */}
                    <div className="h-2.5 bg-amber-800 rounded-full shadow-inner border-t border-amber-900" />
                    <span className="text-[9px] text-[#A68F7B] font-serif text-center mt-1 uppercase tracking-wider">Shelf 2: Cinema Universes</span>
                  </div>

                  {/* Bottom Shelf: Foods / Treats */}
                  <div className="flex flex-col">
                    <div className="flex gap-4 justify-around px-4 mb-1">
                      {FAVORITES.filter((f) => f.type === 'food_drink').map((fav) => (
                        <motion.button
                          key={fav.id}
                          whileHover={{ y: -6, scale: 1.1 }}
                          onClick={() => setActiveFav(fav)}
                          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl cursor-pointer shadow border border-stone-200 relative group interactive-obj"
                          title={fav.name}
                        >
                          <span>{fav.illustration}</span>
                        </motion.button>
                      ))}
                    </div>
                    {/* Wooden Shelf Line */}
                    <div className="h-2.5 bg-amber-800 rounded-full shadow-inner border-t border-amber-900" />
                    <span className="text-[9px] text-[#A68F7B] font-serif text-center mt-1 uppercase tracking-wider">Shelf 3: Cozy Patisserie & Drinks</span>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Active Favorites Display Panel */}
        <div className="lg:col-span-4 h-full min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeFav ? (
              <motion.div
                key={activeFav.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-6 bg-[#FAF6F0] rounded-2xl border border-[#ffb3b8]/40 shadow-md flex flex-col justify-between aspect-[3/4] relative"
              >
                {/* Stamp visual on corner */}
                <div className="absolute top-2 right-2 w-10 h-10 border-2 border-dashed border-[#ffb3b8] rounded-full flex items-center justify-center text-[10px] font-serif text-[#ffb3b8] rotate-[15deg]">
                  FAV
                </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center mt-6">
                  <span className="text-4xl mb-4 animate-bounce">{activeFav.illustration}</span>
                  <h3 className="font-serif text-lg font-bold text-[#5E3A3A] mb-2">{activeFav.name}</h3>
                  <p className="font-sans text-xs text-[#7A6060] leading-relaxed max-w-[200px]">
                    {activeFav.details}
                  </p>
                </div>

                <button
                  onClick={() => setActiveFav(null)}
                  className="w-full py-1.5 bg-[#FFF5F6] hover:bg-[#FFEBEB] border border-pink-200 text-xs text-[#ff808b] font-serif rounded-full transition-all cursor-pointer interactive-obj"
                >
                  Close Shelf Item ✕
                </button>
              </motion.div>
            ) : (
              <div className="glass-panel p-6 rounded-2xl border border-pink-100 h-full flex flex-col justify-center items-center text-center text-[#8A7171] aspect-[3/4]">
                <span className="text-3xl animate-pulse">📚</span>
                <h3 className="font-serif text-base font-medium text-[#5E3A3A] mt-3">
                  Aesthetic Library
                </h3>
                <p className="text-xs max-w-xs leading-relaxed mt-2">
                  {activeTab === 'shelves'
                    ? "Tap on any illustrated record vinyl, cassette tape, or sweet treats on my rustic shelves to inspect its cozy details."
                    : "Leaf through my scrapbook to find my birthday, hobbies, mottos, and secret happy triggers."}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
