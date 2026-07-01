import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, BookOpen, Coffee } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  image: string;
  ingredients: string[];
  steps: string[];
}

const RECIPES: Recipe[] = [
  {
    id: 'matcha',
    name: 'Whisked Ceremonial Matcha 🍵',
    image: '🍵',
    ingredients: [
      '2g Organic Ceremonial Matcha powder',
      '70ml Hot spring water (80°C)',
      '120ml Warm creamy oat milk',
      '1 tsp Sweet liquid honey or maple syrup'
    ],
    steps: [
      'Sift the green matcha powder into a warm porcelain chawan bowl.',
      'Pour in hot water and whisk vigorously in a "W" motion with a bamboo chasen whisk.',
      'Froth until a thick jade green foam layer forms on top.',
      'Pour over warm oat milk, sweeten, and enjoy with soft breath.'
    ]
  },
  {
    id: 'strawberry',
    name: 'Strawberry Milk Cream 🍓🥛',
    image: '🍓',
    ingredients: [
      '5 Fresh organic strawberries (mashed)',
      '1 tbsp Cane sugar or honey',
      '200ml Fresh cold whole cream milk',
      '1 scoop Vanilla ice cream (optional)'
    ],
    steps: [
      'Mash fresh strawberries with sugar in the bottom of a tall glass.',
      'Let sit for 5 minutes until a sweet pink syrup forms.',
      'Pour in cold organic milk over ice cubes.',
      'Top with fresh sliced berries and a dollop of whipped cream.'
    ]
  },
  {
    id: 'tiramisu',
    name: 'Cozy House Tiramisu 🍰',
    image: '🍰',
    ingredients: [
      '12 Italian Ladyfinger biscuits (Savoiardi)',
      '200g Mascarpone cheese (room temp)',
      '2 Fresh organic egg yolks',
      '100ml Strong brewed sweet espresso',
      'Unsweetened dark cocoa powder for dusting'
    ],
    steps: [
      'Whisk mascarpone cheese with egg yolks and sugar until smooth and velvety.',
      'Dip Savoiardi ladyfingers quickly in warm brewed espresso.',
      'Layer dipped biscuits in a glass tray, spread thick mascarpone cream over.',
      'Repeat layer, dust generously with rich dark cocoa powder. Chill overnight.'
    ]
  }
];

export default function LittleCafeRoom() {
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(RECIPES[0]);
  
  // Whisk matcha state
  const [matchaWhiskCount, setMatchaWhiskCount] = useState(0);
  const [matchaSteam, setMatchaSteam] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isMatchaReady, setIsMatchaReady] = useState(false);

  // Stir strawberry state
  const [strawberryStir, setStrawberryStir] = useState(0); // 0 = unmixed, 5 = fully mixed pink!

  // Whisk matcha handler
  const handleWhiskMatcha = () => {
    if (isMatchaReady) return;
    
    setMatchaWhiskCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setIsMatchaReady(true);
      }
      return next;
    });

    // Create rising steam particles
    const id = Date.now();
    const newSteam = {
      id,
      x: Math.random() * 60 + 20, // keep centered in bowl
      y: 0
    };
    setMatchaSteam((prev) => [...prev, newSteam]);
  };

  // Animate steam particles upwards
  useEffect(() => {
    const interval = setInterval(() => {
      setMatchaSteam((prev) =>
        prev
          .map((s) => ({ ...s, y: s.y + 3 }))
          .filter((s) => s.y < 80)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleResetMatcha = () => {
    setMatchaWhiskCount(0);
    setIsMatchaReady(false);
    setMatchaSteam([]);
  };

  const handleStirStrawberry = () => {
    setStrawberryStir((prev) => (prev < 5 ? prev + 1 : 0));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 bg-[#FAF6F0] rounded-3xl p-6 md:p-8 border border-amber-100/40 relative shadow-sm">
      
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-10">
        <h1 className="font-serif text-3xl text-[#5E473E] tracking-wider flex items-center justify-center gap-1.5">
          <span>🍵</span> mysl's Little Café
        </h1>
        <p className="font-garamond italic text-base text-[#8C7164] mt-1">
          "Pull up a rustic wooden stool. Whisk green matcha, stir strawberry cream, and read my secret recipes."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Café Counter Kitchen (Left 7 Columns) */}
        <div className="lg:col-span-7 bg-[#FFFDFB] rounded-3xl border border-amber-100/40 p-6 shadow-inner flex flex-col gap-6">
          <div className="flex justify-between items-center pb-2 border-b border-amber-100/20">
            <span className="font-serif text-xs uppercase tracking-wider text-[#8C7164]">Interactive Counter</span>
            <span className="font-handwritten text-sm text-pink-400">freshly brewed ✿</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Matcha Whisking Station */}
            <div className="p-4 rounded-2xl bg-[#F4F7F4] border border-emerald-100 flex flex-col items-center text-center gap-3">
              <h3 className="font-serif text-sm font-semibold text-[#3D523E]">Matcha Whisk Station</h3>
              
              {/* Virtual Matcha Bowl */}
              <div className="w-32 h-20 bg-emerald-50 rounded-b-[40px] rounded-t-lg border-2 border-emerald-200/80 relative shadow-inner flex items-center justify-center overflow-hidden mt-2">
                
                {/* Matcha Liquid level */}
                <div 
                  className="absolute bottom-0 inset-x-0 bg-emerald-700/80 transition-all duration-500"
                  style={{ height: `${20 + matchaWhiskCount * 12}%` }}
                />

                {/* Foam overlay when fully whisked */}
                {isMatchaReady && (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-x-0 bottom-0 h-4/5 bg-emerald-500/90 flex flex-col justify-center items-center font-bold text-emerald-100 text-[9px] font-serif"
                  >
                    🍃 CEREMONIAL FOAM 🍃
                  </motion.div>
                )}

                {/* Steam particles rising */}
                {matchaSteam.map((s) => (
                  <div
                    key={s.id}
                    className="absolute w-3 h-3 bg-emerald-300/40 rounded-full blur-[2px] pointer-events-none"
                    style={{ left: `${s.x}%`, bottom: `${20 + s.y}%` }}
                  />
                ))}

                <span className="text-3xl z-10 select-none">🥣</span>
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-1 w-full mt-1">
                <button
                  onClick={handleWhiskMatcha}
                  className="px-4 py-1.5 bg-[#4A634D] hover:bg-[#3D523E] text-white text-xs font-serif rounded-full cursor-pointer interactive-obj"
                >
                  {isMatchaReady ? 'Matcha Frothy & Hot! 🍵' : `Whisk Chasen (${matchaWhiskCount}/5)`}
                </button>
                {isMatchaReady && (
                  <button
                    onClick={handleResetMatcha}
                    className="text-[9px] font-serif text-[#3D523E] hover:underline cursor-pointer mt-1 interactive-obj"
                  >
                    Drink & Brew another cup
                  </button>
                )}
              </div>
            </div>

            {/* Strawberry Cream Mixing Station */}
            <div className="p-4 rounded-2xl bg-[#FFF5F6] border border-pink-100 flex flex-col items-center text-center gap-3">
              <h3 className="font-serif text-sm font-semibold text-[#5E3A3A]">Strawberry Cream Mixer</h3>

              {/* Glass Bottle */}
              <div className="w-20 h-28 bg-white/60 rounded-xl border-2 border-pink-100 relative shadow-inner flex flex-col justify-end overflow-hidden mt-1">
                
                {/* White milk base */}
                <div className="absolute inset-x-0 bottom-0 h-4/5 bg-slate-50" />

                {/* Strawberry mash syrup level */}
                <div 
                  className="absolute bottom-0 inset-x-0 bg-red-400/80 transition-all duration-700"
                  style={{ height: `${10 + strawberryStir * 14}%` }}
                />

                {/* Swirled mixed milk effect */}
                {strawberryStir >= 5 && (
                  <div className="absolute inset-0 bg-[#FFD1D5] flex items-center justify-center font-bold text-white text-[9px] font-serif">
                    🍓 SWEET PINK SHAKE
                  </div>
                )}

                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl z-10 select-none animate-float-lateral">🍓</div>
              </div>

              {/* Controls */}
              <button
                onClick={handleStirStrawberry}
                className="w-full px-4 py-1.5 bg-[#ff808b] hover:bg-[#fa5565] text-white text-xs font-serif rounded-full cursor-pointer interactive-obj"
              >
                {strawberryStir >= 5 ? 'Fully Mixed! Tap to Reset' : `Stir Strawberry Milk (${strawberryStir}/5)`}
              </button>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-[#FFFBF7] border border-amber-100/30 flex items-center gap-4 text-left">
            <span className="text-3xl">🥑🥩</span>
            <div className="flex-1">
              <h4 className="font-serif text-xs font-bold text-[#5E473E]">Also on my Café Menu:</h4>
              <p className="text-[10px] text-[#8C7164] leading-relaxed">
                Crispy charred **Grilled Meat** (my ultimate savory treat) and sliced fresh buttery **Avocado** (my absolute favorite creamy fruit). Enjoy a sweet slice of Tiramisu on the side!
              </p>
            </div>
          </div>
        </div>

        {/* Recipe Cards Display (Right 5 Columns) */}
        <div className="lg:col-span-5 h-full min-h-[420px]">
          <div className="flex flex-col gap-4">
            
            {/* Recipes selectors */}
            <div className="flex gap-1.5">
              {RECIPES.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => setActiveRecipe(recipe)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-serif cursor-pointer border transition-all interactive-obj ${
                    activeRecipe?.id === recipe.id
                      ? 'bg-amber-100 border-amber-300 text-[#5E473E]'
                      : 'bg-white border-stone-200 text-[#8C7164]'
                  }`}
                >
                  {recipe.image} {recipe.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Recipe Content Area */}
            <AnimatePresence mode="wait">
              {activeRecipe && (
                <motion.div
                  key={activeRecipe.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="bg-white p-6 rounded-2xl shadow-md border border-amber-100/50 relative flex flex-col gap-4"
                >
                  {/* Decorative tape on top */}
                  <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-24 h-4 bg-yellow-500/10 border-x border-yellow-200" />
                  
                  <div className="pb-2 border-b border-amber-100/20">
                    <h3 className="font-serif text-base font-bold text-[#5E473E]">
                      {activeRecipe.name}
                    </h3>
                    <p className="text-[9px] font-mono text-stone-400 mt-0.5">
                      mysl's kitchen recipe card
                    </p>
                  </div>

                  {/* Ingredients Checklist */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-serif uppercase tracking-wider text-[#8C7164] font-bold">Ingredients:</span>
                    <div className="flex flex-col gap-1">
                      {activeRecipe.ingredients.map((ing, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#5E473E] font-sans">
                          <Check className="w-3.5 h-3.5 text-[#ff808b]" />
                          <span>{ing}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step By Step Instructions */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-serif uppercase tracking-wider text-[#8C7164] font-bold">Steps to Brew:</span>
                    <div className="flex flex-col gap-2">
                      {activeRecipe.steps.map((step, i) => (
                        <div key={i} className="flex gap-2 text-[10px] text-[#8C7164] leading-relaxed">
                          <span className="font-serif font-bold text-[#ff808b]">{i + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center text-[9px] text-[#8C7164] font-serif border-t border-amber-100/10 pt-3">
                    🥛 Sweetened with love and positive energy 🥛
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
