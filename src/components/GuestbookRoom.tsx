import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Edit2, Check, RefreshCw, Feather } from 'lucide-react';
import { GuestbookEntry } from '../types';

const INITIAL_ENTRIES: GuestbookEntry[] = [
  {
    id: 'init-1',
    name: 'Chloe 🌸',
    message: 'Your cottage is absolutely magical! I sat here listening to the soft piano chords and sipping virtual matcha for an hour. Truly a beautiful sanctuary.',
    timestamp: '30 June 2026',
    paperColor: '#FFEBEB',
    waxSeal: '🌹'
  },
  {
    id: 'init-2',
    name: 'Sienna ✨',
    message: 'I love the coquette theme, the pink bows, and the virtual mirror reflections! I leave feeling so warm and peaceful. Thank you for welcoming us.',
    timestamp: '29 June 2026',
    paperColor: '#FAF6F0',
    waxSeal: '🦋'
  }
];

const WAX_SEALS = [
  { char: '🌹', name: 'Rose Seal' },
  { char: '💖', name: 'Heart Seal' },
  { char: '🦋', name: 'Butterfly' },
  { char: '🌟', name: 'Star Seal' },
];

const PARCHMENT_COLORS = [
  { code: '#FAF6F0', name: 'Warm Cream' },
  { code: '#FFEBEB', name: 'Blush Pink' },
  { code: '#E5ECE5', name: 'Sage Green' },
  { code: '#EBF7FF', name: 'Sky Blue' },
];

export default function GuestbookRoom() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(INITIAL_ENTRIES);
  
  // Form states
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedSeal, setSelectedSeal] = useState('🌹');
  const [selectedColor, setSelectedColor] = useState('#FAF6F0');

  // Animation stamp state
  const [isStamping, setIsStamping] = useState(false);

  // Sync with Local Storage
  useEffect(() => {
    const stored = localStorage.getItem('mysl_guestbook_notes');
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing guestbook', e);
      }
    }
  }, []);

  const saveToLocalStorage = (newEntries: GuestbookEntry[]) => {
    localStorage.setItem('mysl_guestbook_notes', JSON.stringify(newEntries));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsStamping(true);

    // Simulate luxury stamping duration
    setTimeout(() => {
      const day = new Date();
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const dateString = `${day.getDate()} ${monthNames[day.getMonth()]} ${day.getFullYear()}`;

      const newEntry: GuestbookEntry = {
        id: Date.now().toString(),
        name: name.trim(),
        message: message.trim(),
        timestamp: dateString,
        paperColor: selectedColor,
        waxSeal: selectedSeal
      };

      const updated = [newEntry, ...entries];
      setEntries(updated);
      saveToLocalStorage(updated);

      // Reset form
      setName('');
      setMessage('');
      setIsStamping(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#FAF6F0] rounded-3xl p-6 md:p-8 border border-pink-100 relative shadow-sm">
      
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-10">
        <h1 className="font-serif text-3xl text-[#5E3A3A] tracking-wider flex items-center justify-center gap-2">
          <span>✍️</span> My Cottage Guestbook
        </h1>
        <p className="font-garamond italic text-base text-[#8A7171] mt-1">
          "Leave a sweet, anonymous letter in my ledger. Press it down with a gold wax seal."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Ink-Well Form Column (Left 5 Columns) */}
        <div className="lg:col-span-5 h-full">
          <form 
            onSubmit={handleSubmit} 
            className="p-6 bg-white rounded-3xl border border-[#ffb3b8]/40 shadow-sm flex flex-col gap-5 relative overflow-hidden"
          >
            {/* Ink dropper ribbon */}
            <div className="absolute top-0 right-6 w-12 h-2 bg-[#ffb3b8] rounded-b-md" />
            
            <div className="flex items-center gap-2 pb-2 border-b border-pink-100">
              <Feather className="w-4 h-4 text-[#ff808b]" />
              <h3 className="font-serif text-sm font-semibold text-[#5E3A3A]">Write your note</h3>
            </div>

            {/* Name Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-serif uppercase tracking-wider text-[#8A7171]">Your Name / Nickname:</label>
              <input
                type="text"
                maxLength={25}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sweet Dreamer 🌸"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-pink-50/10 border border-[#ffd6d9] focus:outline-none focus:border-[#ff808b] text-xs font-sans text-[#5E3A3A]"
              />
            </div>

            {/* Message Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-serif uppercase tracking-wider text-[#8A7171]">Your Message:</label>
              <textarea
                maxLength={150}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a sweet reminder or note..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/10 border border-[#ffd6d9] focus:outline-none focus:border-[#ff808b] text-xs font-sans text-[#5E3A3A] resize-none leading-relaxed"
              />
              <span className="text-[8px] text-right font-mono text-stone-400">
                {message.length} / 150 characters
              </span>
            </div>

            {/* Parchment Color Choice */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-serif uppercase tracking-wider text-[#8A7171]">Select Parchment Shade:</label>
              <div className="flex gap-2">
                {PARCHMENT_COLORS.map((col) => (
                  <button
                    key={col.code}
                    type="button"
                    onClick={() => setSelectedColor(col.code)}
                    className="w-6 h-6 rounded-full border cursor-pointer transition-transform duration-150 relative interactive-obj"
                    style={{ 
                      backgroundColor: col.code, 
                      borderColor: selectedColor === col.code ? '#ff808b' : '#ffd6d9',
                      transform: selectedColor === col.code ? 'scale(1.15)' : 'none'
                    }}
                    title={col.name}
                  >
                    {selectedColor === col.code && (
                      <Check className="w-3 h-3 text-[#ff808b] absolute inset-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Wax Seals choices */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-serif uppercase tracking-wider text-[#8A7171]">Select Wax Seal Stamp:</label>
              <div className="flex gap-3 justify-center">
                {WAX_SEALS.map((seal) => (
                  <button
                    key={seal.char}
                    type="button"
                    onClick={() => setSelectedSeal(seal.char)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl cursor-pointer transition-all border shadow-sm interactive-obj ${
                      selectedSeal === seal.char
                        ? 'bg-amber-100 border-amber-400 scale-110'
                        : 'bg-white hover:bg-amber-50 border-stone-200'
                    }`}
                    title={seal.name}
                  >
                    <span>{seal.char}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Stamp button */}
            <button
              type="submit"
              disabled={isStamping || !name.trim() || !message.trim()}
              className="w-full py-3 bg-[#ffb3b8] hover:bg-[#ff808b] disabled:opacity-50 text-white rounded-full font-serif text-sm tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md relative overflow-hidden interactive-obj"
            >
              <AnimatePresence mode="wait">
                {isStamping ? (
                  <motion.div
                    key="stamping"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Stamping golden wax...
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span>Press & Stamp Letter</span>
                    <span>{selectedSeal}</span>
                  </div>
                )}
              </AnimatePresence>
            </button>
          </form>
        </div>

        {/* Notes Board Column (Right 7 Columns) */}
        <div className="lg:col-span-7 h-full flex flex-col gap-4">
          <div className="flex items-center justify-between pb-1 border-b border-pink-100/40">
            <span className="font-serif text-xs uppercase tracking-wider text-[#8A7171]">Cottage Notes Board ({entries.length})</span>
          </div>

          <div className="max-h-[440px] overflow-y-auto pr-1 flex flex-col gap-4">
            <AnimatePresence>
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-5 rounded-2xl shadow-sm border border-stone-200/50 flex flex-col justify-between relative min-h-[110px]"
                  style={{ backgroundColor: entry.paperColor }}
                >
                  {/* Wax Stamp Graphic */}
                  <div className="absolute top-2 right-4 w-10 h-10 rounded-full bg-[#E6C687]/40 border-2 border-[#D4AF37] flex items-center justify-center text-xl shadow-inner select-none">
                    <span>{entry.waxSeal}</span>
                  </div>

                  <div className="flex flex-col gap-2 pr-10">
                    <p className="font-handwritten text-lg text-[#5E3A3A] leading-relaxed">
                      "{entry.message}"
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-stone-200/20 pt-2.5 mt-3">
                    <span className="font-serif font-bold text-xs text-[#5E3A3A]">
                      ✿ {entry.name}
                    </span>
                    <span className="text-[9px] text-stone-400 font-mono">
                      {entry.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
