import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Moon, Monitor, Paintbrush, Flame, Flower2, HelpCircle } from 'lucide-react';

interface BedroomRoomProps {
  onTriggerPetals: () => void;
  weather?: 'sunshine' | 'rain';
}

interface InteractiveObject {
  id: string;
  name: string;
  icon: string;
  position: string; // Tailwinds positioning relative to room container
  description: string;
}

const BEDROOM_OBJECTS: InteractiveObject[] = [
  { id: 'bed', name: 'Pink Bed 🛏️', icon: '🌸', position: 'top-[50%] left-[14%]', description: 'Cozy mattress with custom gingham covers.' },
  { id: 'teddy', name: 'Teddy Bears & Bunnies 🧸', icon: '🐰', position: 'top-[54%] left-[28%]', description: 'Cute snuggly friends with ribbon bows.' },
  { id: 'candle', name: 'Flickering Candle 🕯️', icon: '🕯️', position: 'top-[60%] left-[44%]', description: 'Warm vanilla glow.' },
  { id: 'flowers', name: 'White Lilies 💐', icon: '💐', position: 'top-[50%] left-[52%]', description: 'Fresh, fragrant lilies.' },
  { id: 'mirror', name: 'Large Mirror 🪞', icon: '✨', position: 'top-[22%] left-[61%]', description: 'Reflects cozy words and custom vintage stickers.' },
  { id: 'laptop', name: 'Laptop 💻', icon: '💻', position: 'top-[55%] left-[64%]', description: 'Simulated lo-fi bedroom scene.' },
  { id: 'tablet', name: 'Drawing Tablet ✏️', icon: '🎨', position: 'top-[66%] left-[72%]', description: 'Draw a tiny flower doodle on the screen.' },
  { id: 'perfume', name: 'Perfume 🧪', icon: '🎀', position: 'top-[58%] left-[80%]', description: 'Vintage scent bottle. Dispenses floating petals.' },
  { id: 'skincare', name: 'Skincare Shelf 🧴', icon: '🧴', position: 'top-[22%] left-[84%]', description: 'My routine: Cleanse, Tone, Glow.' },
];

const MIRROR_QUOTES = [
  "You look incredibly beautiful today.",
  "You are a work of art.",
  "Your soft heart is a superpower.",
  "Beautiful things take time to bloom.",
  "You deserve all the sweetness in the world.",
  "Always keep shining.",
];

export default function BedroomRoom({ onTriggerPetals, weather = 'sunshine' }: BedroomRoomProps) {
  const [activeObj, setActiveObj] = useState<string | null>(null);
  
  // Bed customization state
  const [bedStyle, setBedStyle] = useState<'pink' | 'gingham' | 'lace'>('pink');
  const [isBunnyTucked, setIsBunnyTucked] = useState(false);

  // Mirror state
  const [mirrorQuoteIdx, setMirrorQuoteIdx] = useState(0);

  // Candle state
  const [isCandleLit, setIsCandleLit] = useState(true);

  // Skincare states
  const [skincareStep, setSkincareStep] = useState(0);

  // Tablet sketch state (stored as high-performance lists of lines)
  const [lines, setLines] = useState<{ x: number; y: number }[][]>([]);
  const [currentLine, setCurrentLine] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [traceGuide, setTraceGuide] = useState<'none' | 'bow' | 'bear'>('none');
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Laptop state
  const [laptopScreen, setLaptopScreen] = useState<'fireplace' | 'playlist'>('playlist');
  const [isLaptopMuted, setIsLaptopMuted] = useState(false);

  // Perfume local spritz visual particles
  const [perfumeSprays, setPerfumeSprays] = useState<{ id: number; x: number; y: number }[]>([]);

  // Audio Refs for high performance synthesis
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const activeLaptopIntervalRef = React.useRef<any>(null);
  const fireplaceNoiseRef = React.useRef<AudioBufferSourceNode | null>(null);
  const fireplaceLfoRef = React.useRef<OscillatorNode | null>(null);
  const fireplaceCrackleIntervalRef = React.useRef<any>(null);
  const activeNodesRef = React.useRef<AudioNode[]>([]);

  // Stop all active laptop sounds
  const stopAllLaptopSounds = () => {
    if (activeLaptopIntervalRef.current) {
      clearInterval(activeLaptopIntervalRef.current);
      activeLaptopIntervalRef.current = null;
    }
    if (fireplaceCrackleIntervalRef.current) {
      clearInterval(fireplaceCrackleIntervalRef.current);
      fireplaceCrackleIntervalRef.current = null;
    }

    if (fireplaceNoiseRef.current) {
      try {
        fireplaceNoiseRef.current.stop();
        fireplaceNoiseRef.current.disconnect();
      } catch (e) {}
      fireplaceNoiseRef.current = null;
    }

    if (fireplaceLfoRef.current) {
      try {
        fireplaceLfoRef.current.stop();
        fireplaceLfoRef.current.disconnect();
      } catch (e) {}
      fireplaceLfoRef.current = null;
    }

    activeNodesRef.current.forEach((node) => {
      try {
        node.disconnect();
      } catch (e) {}
    });
    activeNodesRef.current = [];
  };

  // Safe initialize AudioContext
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

  // Synthesize Cozy Crackling Fireplace
  const playFireplaceSynth = (ctx: AudioContext) => {
    stopAllLaptopSounds();

    // Generate Pink/Brownish rumble buffer for warm embers sound
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      data[i] = pink * 0.045; // Subtle background roar
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Filter to make it warm, thick, and bassy
    const lpFilter = ctx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.setValueAtTime(140, ctx.currentTime);

    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.18, ctx.currentTime);

    // Dynamic fire wave rumble modulation (LFO)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.05, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(rumbleGain.gain);

    noiseSource.connect(lpFilter);
    lpFilter.connect(rumbleGain);
    rumbleGain.connect(ctx.destination);

    noiseSource.start();
    lfo.start();

    fireplaceNoiseRef.current = noiseSource;
    fireplaceLfoRef.current = lfo;
    activeNodesRef.current.push(lpFilter, rumbleGain, lfoGain);

    // Random wood snap and flame crackles generator
    const triggerWoodSnap = () => {
      if (ctx.state === 'suspended') return;

      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      const snapFilter = ctx.createBiquadFilter();

      snapFilter.type = 'bandpass';
      snapFilter.frequency.setValueAtTime(850 + Math.random() * 1100, ctx.currentTime);
      snapFilter.Q.setValueAtTime(3.5, ctx.currentTime);

      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(350 + Math.random() * 450, ctx.currentTime);
      snapOsc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.025);

      snapGain.gain.setValueAtTime(0, ctx.currentTime);
      snapGain.gain.linearRampToValueAtTime(0.14 + Math.random() * 0.16, ctx.currentTime + 0.001);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015 + Math.random() * 0.02);

      snapOsc.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(ctx.destination);

      snapOsc.start();
      snapOsc.stop(ctx.currentTime + 0.055);
    };

    const crackleInterval = setInterval(() => {
      if (Math.random() > 0.45) {
        triggerWoodSnap();
        if (Math.random() > 0.75) {
          setTimeout(triggerWoodSnap, 50 + Math.random() * 100);
        }
      }
    }, 280);

    fireplaceCrackleIntervalRef.current = crackleInterval;
  };

  // Synthesize Cozy Lo-fi Beats
  const playLofiMusicSynth = (ctx: AudioContext) => {
    stopAllLaptopSounds();

    // Rhythmic, cute lo-fi chord progression (Rhodes-like feel)
    const lofiChords = [
      [146.83, 220.00, 261.63, 329.63, 392.00], // Dmin9 (D3, A3, C4, E4, G4)
      [196.00, 246.94, 293.66, 349.23, 440.00], // G9 (G3, B3, D4, F4, A4)
      [130.81, 196.00, 246.94, 329.63, 392.00], // Cmaj9 (C3, G3, B3, E4, G4)
      [110.00, 164.81, 220.00, 261.63, 329.63], // Amin9 (A2, E3, A3, C4, E4)
    ];

    let step = 0;
    let chordIndex = 0;

    const playLofiStep = () => {
      if (ctx.state === 'suspended') return;
      const now = ctx.currentTime;
      const beatSub = step % 8;

      // Soft lofi bass drum on beat 1 & 5
      if (beatSub === 0 || beatSub === 4) {
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        
        kickOsc.frequency.setValueAtTime(105, now);
        kickOsc.frequency.exponentialRampToValueAtTime(42, now + 0.13);
        
        kickGain.gain.setValueAtTime(0.16, now);
        kickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
        
        kickOsc.connect(kickGain);
        kickGain.connect(ctx.destination);
        kickOsc.start(now);
        kickOsc.stop(now + 0.18);
      }

      // Cozy filtered snare rimshot on beat 3 & 7
      if (beatSub === 2 || beatSub === 6) {
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const bpFilter = ctx.createBiquadFilter();
        bpFilter.type = 'bandpass';
        bpFilter.frequency.setValueAtTime(1050, now);
        bpFilter.Q.setValueAtTime(1.6, now);

        const snareGain = ctx.createGain();
        snareGain.gain.setValueAtTime(0.045, now);
        snareGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

        noise.connect(bpFilter);
        bpFilter.connect(snareGain);
        snareGain.connect(ctx.destination);
        noise.start(now);
      }

      // Warm retro Rhodes keyboard chords trigger
      if (beatSub === 0) {
        const chord = lofiChords[chordIndex];
        chordIndex = (chordIndex + 1) % lofiChords.length;

        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.045); // Delicate strum roll

          const lpFilter = ctx.createBiquadFilter();
          lpFilter.type = 'lowpass';
          lpFilter.frequency.setValueAtTime(600, now);

          gainNode.gain.setValueAtTime(0, now + idx * 0.045);
          gainNode.gain.linearRampToValueAtTime(0.05, now + idx * 0.045 + 0.16);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.045 + 2.7);

          osc.connect(lpFilter);
          lpFilter.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(now + idx * 0.045);
          osc.stop(now + 3.0);
        });
      }

      step++;
    };

    // Run lo-fi drum-and-chord pattern (75 BPM -> 400ms per step)
    playLofiStep();
    const lofiInterval = setInterval(playLofiStep, 400);
    activeLaptopIntervalRef.current = lofiInterval;
  };

  // Play toy squeaks with cute frequency sweeps
  const playToySqueak = (toy: 'ribbon' | 'clover') => {
    const ctx = initAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (toy === 'ribbon') {
      // 🧸 Ribbon (Teddy Bear): Sweet, bouncy double toy squeak ("peep-squeak!")
      const playSqueakPart = (delay: number, baseFreq: number) => {
        const osc = ctx.createOscillator();
        const mod = ctx.createOscillator();
        const modGain = ctx.createGain();
        const gainNode = ctx.createGain();

        osc.type = 'triangle';
        mod.type = 'sine';
        
        const t = now + delay;
        
        // Cute FM synthesis for sweet toy sound
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, t + 0.06);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.1, t + 0.16);

        mod.frequency.setValueAtTime(65, t);
        modGain.gain.setValueAtTime(120, t);
        modGain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(0.22, t + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

        mod.connect(modGain);
        modGain.connect(osc.frequency);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(t);
        mod.start(t);
        osc.stop(t + 0.2);
        mod.stop(t + 0.2);
      };

      playSqueakPart(0, 380);
      playSqueakPart(0.09, 460);
    } else {
      // 🐰 Clover (Bunny): Adorable triple high-pitched fast squeaks ("pi-pi-pi-chu!")
      const playSingleSqueak = (delay: number, basePitch: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';

        const t = now + delay;
        osc.frequency.setValueAtTime(basePitch, t);
        osc.frequency.exponentialRampToValueAtTime(basePitch * 2.3, t + 0.04);
        osc.frequency.exponentialRampToValueAtTime(basePitch * 1.3, t + 0.11);

        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(0.18, t + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.15);
      };

      playSingleSqueak(0, 650);
      playSingleSqueak(0.07, 780);
      playSingleSqueak(0.14, 950);
    }
  };

  // Synchronize audio based on active object selections
  React.useEffect(() => {
    if (activeObj === 'laptop' && !isLaptopMuted) {
      const ctx = initAudioCtx();
      if (ctx) {
        if (laptopScreen === 'fireplace') {
          playFireplaceSynth(ctx);
        } else {
          playLofiMusicSynth(ctx);
        }
      }
    } else {
      stopAllLaptopSounds();
    }
  }, [activeObj, laptopScreen, isLaptopMuted]);

  // Clean up audio on unmount
  React.useEffect(() => {
    return () => {
      stopAllLaptopSounds();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

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

  const handleMirrorClick = () => {
    setMirrorQuoteIdx((prev) => (prev + 1) % MIRROR_QUOTES.length);
  };

  const handlePerfumeClick = () => {
    playPerfumeSpraySound();
    onTriggerPetals();

    // Spawn 8 local sparkling mist spray particles
    const newSprays = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 65, // random horizontal spread
      y: -25 - Math.random() * 45,    // random vertical lift
    }));
    setPerfumeSprays((prev) => [...prev, ...newSprays]);

    // Clean up local sprays after animation
    setTimeout(() => {
      setPerfumeSprays((prev) => prev.filter((s) => Date.now() - s.id < 1200));
    }, 1500);
  };

  // High performance Canvas coordinates and handlers (prevent react lag on move)
  const getCanvasCoords = (clientX: number, clientY: number, currentTarget: HTMLCanvasElement) => {
    const rect = currentTarget.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * currentTarget.width;
    const y = ((clientY - rect.top) / rect.height) * currentTarget.height;
    return { x, y };
  };

  const startDrawing = (clientX: number, clientY: number, currentTarget: HTMLCanvasElement) => {
    setIsDrawing(true);
    const pos = getCanvasCoords(clientX, clientY, currentTarget);
    setCurrentLine([pos]);

    const ctx = currentTarget.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#ff808b';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 1.5;
      ctx.shadowColor = 'rgba(255, 128, 139, 0.4)';
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ff808b';
      ctx.fill();
    }
  };

  const drawMove = (clientX: number, clientY: number, currentTarget: HTMLCanvasElement) => {
    if (!isDrawing) return;
    const pos = getCanvasCoords(clientX, clientY, currentTarget);
    setCurrentLine((prev) => [...prev, pos]);

    const ctx = currentTarget.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#ff808b';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 1.5;
      ctx.shadowColor = 'rgba(255, 128, 139, 0.4)';
      ctx.globalAlpha = 0.85;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentLine.length > 0) {
      setLines((prev) => [...prev, currentLine]);
    }
    setCurrentLine([]);
  };

  // Keep drawing persistent on canvas mount
  React.useEffect(() => {
    if (activeObj === 'tablet' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#ff808b';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 1.5;
        ctx.shadowColor = 'rgba(255, 128, 139, 0.4)';
        ctx.globalAlpha = 0.85;
        
        lines.forEach(line => {
          if (line.length === 0) return;
          ctx.beginPath();
          ctx.moveTo(line[0].x, line[0].y);
          for (let i = 1; i < line.length; i++) {
            ctx.lineTo(line[i].x, line[i].y);
          }
          ctx.stroke();
        });
      }
    }
  }, [activeObj, lines]);

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 py-8 transition-colors duration-1000 ${isCandleLit ? 'bg-[#FAF6F0]' : 'bg-[#EADECE]/80'} rounded-3xl p-6 md:p-8 border border-pink-100/40 relative shadow-sm`}>
      
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-10">
        <h1 className="font-serif text-3xl text-[#5E3A3A] tracking-wider">
          My Cozy Pinterest Bedroom
        </h1>
        <p className="font-garamond italic text-base text-[#8A7171] mt-1">
          "Step in, look around, and click on objects to explore or play with them."
        </p>
      </div>

      {/* Main room display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Interactive Room Canvas/Map (Left Side) */}
        <div className="lg:col-span-7 bg-[#FFFDF9] rounded-3xl border border-[#ffb3b8]/30 aspect-[4/3] relative overflow-hidden shadow-inner flex items-center justify-center p-4">
          
          {/* Aesthetic room backdrop illustration details */}
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-100/10 via-transparent to-amber-100/5" />
          
          {/* Floor with realistic warm wooden floorboards */}
          <div className="absolute bottom-0 inset-x-0 h-[35%] bg-[#F3E5D8] border-t-2 border-[#E5CCA9] overflow-hidden">
            {/* Wood slats */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_50%,#BFA081_50%)] bg-[size:42px_100%]" />
            
            {/* Fluffy cloud/heart-shaped rug */}
            <div className="absolute bottom-[8%] left-[16%] w-[68%] h-[72%] bg-gradient-to-br from-[#FFF0F2] to-[#FFE3E8] rounded-[50px] blur-[0.5px] border border-pink-200/40 shadow-inner flex flex-col items-center justify-center z-[1]">
              <span className="text-[10px] font-serif font-bold text-[#e18b95] tracking-widest uppercase">My Cozy Haven</span>
              <span className="text-[8px] font-mono text-[#A78A8D]/80">click things to explore • relax ♪</span>
            </div>
          </div>

          {/* Realistic Window with dynamic sunlight or rain backdrop */}
          <div className="absolute top-[6%] left-[26%] w-[26%] h-[38%] rounded-t-full border-4 border-stone-100 bg-[#E8F3FA] overflow-hidden shadow-md flex items-center justify-center z-[2]">
            {/* Window Pane Divider Grid */}
            <div className="absolute inset-0 border-r-2 border-stone-100/60 left-1/2 -translate-x-1/2 pointer-events-none z-20" />
            <div className="absolute inset-x-0 border-b-2 border-stone-100/60 top-1/3 pointer-events-none z-20" />
            <div className="absolute inset-x-0 border-b-2 border-stone-100/60 top-2/3 pointer-events-none z-20" />
            
            {weather === 'sunshine' ? (
              // Sunlight weather backdrop
              <div className="absolute inset-0 bg-gradient-to-b from-[#FAD6A5] to-[#FFECD2] flex items-center justify-center relative">
                {/* Glowing Sun */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-[#FFE8BC] rounded-full blur-[2px] animate-pulse" />
                {/* Soft fluffy clouds */}
                <div className="absolute top-[40%] left-[15%] w-10 h-3 bg-white/70 rounded-full blur-[0.5px]" />
                <div className="absolute top-[55%] right-[10%] w-12 h-3.5 bg-white/60 rounded-full blur-[0.5px]" />
                {/* Sunlight rays */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_60%)] pointer-events-none z-10" />
              </div>
            ) : (
              // Rainy weather backdrop with dynamic falling raindrops
              <div className="absolute inset-0 bg-gradient-to-b from-[#6A7B8C] via-[#8599A8] to-[#9CB0C2] flex items-center justify-center overflow-hidden">
                {/* Dark clouds */}
                <div className="absolute top-2 inset-x-0 h-6 bg-slate-500/30 blur-[2px]" />
                {/* Rain glass droplets */}
                <svg className="absolute inset-0 w-full h-full opacity-60 z-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <motion.line x1="15" y1="0" x2="10" y2="100" stroke="#E3EEF5" strokeWidth="0.8" strokeDasharray="1, 8" animate={{ y: [0, 100] }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} />
                  <motion.line x1="45" y1="0" x2="40" y2="100" stroke="#E3EEF5" strokeWidth="0.8" strokeDasharray="1, 8" animate={{ y: [-50, 100] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                  <motion.line x1="75" y1="0" x2="70" y2="100" stroke="#E3EEF5" strokeWidth="0.8" strokeDasharray="1, 8" animate={{ y: [-20, 100] }} transition={{ repeat: Infinity, duration: 1.0, ease: "linear" }} />
                  <motion.line x1="90" y1="0" x2="85" y2="100" stroke="#E3EEF5" strokeWidth="0.8" strokeDasharray="1, 8" animate={{ y: [-80, 100] }} transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }} />
                </svg>
                {/* Mist window sheen */}
                <div className="absolute inset-0 bg-white/5 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Floor plants - Beautiful Vector potted houseplant (Monstera / Ficus style) */}
          <div className="absolute bottom-[10%] left-[2%] w-[10%] h-[22%] z-[3] flex flex-col items-center select-none pointer-events-none">
            {/* Glossy green tropical leaves */}
            <svg className="w-12 h-14 overflow-visible -mb-1" viewBox="0 0 40 40">
              {/* Stem lines */}
              <path d="M 20 40 Q 12 25, 6 18" stroke="#4F6D54" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M 20 40 Q 20 20, 20 6" stroke="#4F6D54" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M 20 40 Q 28 25, 34 16" stroke="#4F6D54" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M 20 40 Q 10 32, 4 30" stroke="#4F6D54" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M 20 40 Q 30 32, 36 30" stroke="#4F6D54" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              {/* Detailed green leaf vectors */}
              <path d="M 6 18 C 0 12, 4 4, 10 12 C 16 20, 12 24, 6 18 Z" fill="#587A5F" stroke="#3D5A46" strokeWidth="0.8" />
              <path d="M 20 6 C 14 -2, 26 -2, 20 6 Z" fill="#668D6E" stroke="#3D5A46" strokeWidth="0.8" />
              <path d="M 34 16 C 40 10, 36 2, 30 10 C 24 18, 28 22, 34 16 Z" fill="#587A5F" stroke="#3D5A46" strokeWidth="0.8" />
              <path d="M 4 30 C -2 26, 0 18, 6 24 C 12 30, 10 32, 4 30 Z" fill="#4B6851" stroke="#3D5A46" strokeWidth="0.8" />
              <path d="M 36 30 C 42 26, 40 18, 34 24 C 28 30, 30 32, 36 30 Z" fill="#4B6851" stroke="#3D5A46" strokeWidth="0.8" />
            </svg>
            {/* Pastel terracotta flowerpot */}
            <div className="w-6 h-7 bg-gradient-to-br from-[#E2C7B1] via-[#D5B89F] to-[#BF9F84] border border-[#A5846B] rounded-b-md rounded-t-sm shadow-sm" />
          </div>

          {/* Large White Fluffy Bed (Clickable to trigger 'bed' / 'teddy') */}
          <div 
            onClick={() => setActiveObj('bed')}
            className={`absolute bottom-[10%] left-[13%] w-[42%] h-[42%] flex flex-col justify-end overflow-visible cursor-pointer select-none transition-all duration-300 z-[3] group/bed ${
              activeObj === 'bed' ? 'brightness-105 scale-[1.01]' : 'hover:scale-[1.01]'
            }`}
            title="Aesthetic Fluffy Bed"
          >
            {/* Wooden cream Headboard */}
            <div className="absolute top-0 inset-x-1.5 h-[24%] bg-gradient-to-b from-[#F9F6F0] to-[#EBE4D5] border-t border-x border-[#D1C2A5] rounded-t-3xl shadow-sm flex items-center justify-center">
              <div className="w-5/6 h-[2px] bg-[#D1C2A5]/40" />
            </div>

            {/* Standard stacked fluffy white pillows */}
            <div className="absolute top-[12%] inset-x-2.5 h-[18%] flex justify-between z-[4] pointer-events-none">
              {/* Left Pillow */}
              <div className="w-[45%] h-full bg-gradient-to-b from-white to-stone-50 rounded-xl border border-stone-200/60 shadow-sm flex items-center justify-center rotate-[-4deg]">
                <div className="w-[90%] h-[90%] border border-dashed border-pink-200/50 rounded-lg" />
              </div>
              {/* Right Pillow */}
              <div className="w-[45%] h-full bg-gradient-to-b from-white to-stone-50 rounded-xl border border-stone-200/60 shadow-sm flex items-center justify-center rotate-[4deg]">
                <div className="w-[90%] h-[90%] border border-dashed border-pink-200/50 rounded-lg" />
              </div>
            </div>

            {/* Mattress Core Body */}
            <div className="w-full h-[76%] bg-white rounded-2xl border-x border-b border-stone-200/50 shadow-md relative overflow-hidden flex flex-col justify-end z-[3]">
              {/* Gingham / Pink / Lace Blanket Overlay */}
              <div className="absolute bottom-0 inset-x-0 h-[68%] border-t border-pink-100/30 shadow-inner overflow-hidden transition-all duration-500">
                {bedStyle === 'pink' ? (
                  // Solid soft pink
                  <div className="absolute inset-0 bg-gradient-to-b from-[#FFF0F2] to-[#FFD6D9] flex justify-center pt-2">
                    <div className="w-full h-1 bg-[#FFAFB5]/40" />
                  </div>
                ) : bedStyle === 'gingham' ? (
                  // Beautiful pink gingham SVG pattern
                  <div className="absolute inset-0 bg-[#FFF0F2]">
                    <svg className="absolute inset-0 w-full h-full opacity-65" xmlns="http://www.w3.org/2000/svg">
                      <pattern id="ginghamPattern" width="16" height="16" patternUnits="userSpaceOnUse">
                        <rect width="16" height="16" fill="#FFF0F2" />
                        <rect width="8" height="16" fill="#FFE2E6" opacity="0.8" />
                        <rect width="16" height="8" fill="#FFE2E6" opacity="0.8" />
                        <rect width="8" height="8" fill="#FFC9D0" opacity="0.9" />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#ginghamPattern)" />
                    </svg>
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-pink-300/45" />
                  </div>
                ) : (
                  // White lace coverlet
                  <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFE] to-[#F5EFE4]">
                    {/* Lace scallops */}
                    <div className="absolute top-0 inset-x-0 h-3 flex justify-between px-1 pointer-events-none">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-[#FFFFFE] rounded-full border-b border-[#E1D3C0] flex-shrink-0" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tucked in Bunny or Bed friends sitting elegantly at the head (Clover & Ribbon) */}
            <div className="absolute top-[20%] inset-x-4 h-[35%] flex justify-around items-end z-[5] overflow-visible">
              
              {/* 🐰 Clover (Bunny Plush) - Fully drawn SVG vector art, bounces when hovered/clicked */}
              <motion.div 
                whileHover={{ scale: 1.1, rotate: [-1, 2, -2, 0] }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveObj('teddy');
                  // Trigger direct audio squeak
                  const audioCtx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
                  if (!audioCtxRef.current) audioCtxRef.current = audioCtx;
                  const now = audioCtx.currentTime;
                  const playSingleSqueak = (delay: number, basePitch: number) => {
                    const osc = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();
                    osc.type = 'sine';
                    const t = now + delay;
                    osc.frequency.setValueAtTime(basePitch, t);
                    osc.frequency.exponentialRampToValueAtTime(basePitch * 2.3, t + 0.04);
                    osc.frequency.exponentialRampToValueAtTime(basePitch * 1.3, t + 0.11);
                    gainNode.gain.setValueAtTime(0, t);
                    gainNode.gain.linearRampToValueAtTime(0.18, t + 0.02);
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
                    osc.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    osc.start(t);
                    osc.stop(t + 0.15);
                  };
                  playSingleSqueak(0, 680);
                  playSingleSqueak(0.06, 820);
                }}
                className={`w-12 h-14 relative cursor-pointer flex flex-col justify-end items-center overflow-visible transition-transform duration-300 ${
                  isBunnyTucked ? 'translate-y-4' : ''
                }`}
                title="Clover Bunny (Tap me!)"
              >
                <svg className="w-12 h-14 overflow-visible" viewBox="0 0 36 36">
                  {/* Fluffy Drop Shadow under bunny */}
                  <ellipse cx="18" cy="33" rx="10" ry="2" fill="#000000" opacity="0.08" className="blur-[1px]" />
                  
                  {/* Left Ear */}
                  <path d="M 12 12 C 9 -1, 15 -2, 16 12 Z" fill="#FBF9F6" stroke="#E6DFD5" strokeWidth="0.8" />
                  <path d="M 13 11 C 11 2, 14 1, 15 11 Z" fill="#FFE2E6" opacity="0.9" />
                  {/* Stitched seam on left ear */}
                  <path d="M 12.8 11.5 C 10.8 2.5, 13.8 1.5, 14.8 11.5" stroke="#E5838B" strokeWidth="0.5" strokeDasharray="1.5,1.5" fill="none" />
                  
                  {/* Right Ear */}
                  <path d="M 24 12 C 27 -1, 21 -2, 20 12 Z" fill="#FBF9F6" stroke="#E6DFD5" strokeWidth="0.8" />
                  <path d="M 23 11 C 25 2, 22 1, 21 11 Z" fill="#FFE2E6" opacity="0.9" />
                  {/* Stitched seam on right ear */}
                  <path d="M 23.2 11.5 C 25.2 2.5, 22.2 1.5, 21.2 11.5" stroke="#E5838B" strokeWidth="0.5" strokeDasharray="1.5,1.5" fill="none" />

                  {/* Stubby Feet */}
                  <circle cx="11" cy="31" r="3.5" fill="#FBF9F6" stroke="#E6DFD5" strokeWidth="0.8" />
                  <circle cx="11" cy="31" r="2" fill="#FFF0F2" />
                  <circle cx="25" cy="31" r="3.5" fill="#FBF9F6" stroke="#E6DFD5" strokeWidth="0.8" />
                  <circle cx="25" cy="31" r="2" fill="#FFF0F2" />

                  {/* Chubby Body */}
                  <ellipse cx="18" cy="27" rx="11" ry="9" fill="#FFFDFB" stroke="#E6DFD5" strokeWidth="0.8" />
                  <ellipse cx="18" cy="27" rx="7" ry="5.5" fill="#FFF5F7" />
                  {/* Center vertical belly seam stitch */}
                  <line x1="18" y1="19.5" x2="18" y2="35" stroke="#D1C2B1" strokeWidth="0.6" strokeDasharray="2,2" />

                  {/* Stubby Arms */}
                  <ellipse cx="7" cy="24" rx="3.5" ry="2.5" fill="#FBF9F6" stroke="#E6DFD5" strokeWidth="0.8" transform="rotate(-15 7 24)" />
                  <ellipse cx="29" cy="24" rx="3.5" ry="2.5" fill="#FBF9F6" stroke="#E6DFD5" strokeWidth="0.8" transform="rotate(15 29 24)" />

                  {/* Round Fluffy Head */}
                  <ellipse cx="18" cy="18" rx="9.5" ry="8.2" fill="#FFFDFB" stroke="#E6DFD5" strokeWidth="0.8" />
                  
                  {/* Center vertical head seam stitch */}
                  <path d="M 18 10 C 18 10, 18 18, 18 26.2" stroke="#D1C2B1" strokeWidth="0.6" strokeDasharray="2,2" fill="none" />

                  {/* Fluffy Cheeks pink glow */}
                  <circle cx="12.5" cy="20.5" r="2" fill="#FFAAA6" opacity="0.6" className="blur-[0.5px]" />
                  <circle cx="23.5" cy="20.5" r="2" fill="#FFAAA6" opacity="0.6" className="blur-[0.5px]" />

                  {/* Glass Safety Eyes (realistic double reflection highlights) */}
                  <circle cx="13" cy="17" r="1.5" fill="#1C1816" />
                  <circle cx="12.6" cy="16.6" r="0.5" fill="#FFFFFF" />
                  <circle cx="13.2" cy="17.4" r="0.25" fill="#FFFFFF" />

                  <circle cx="23" cy="17" r="1.5" fill="#1C1816" />
                  <circle cx="22.6" cy="16.6" r="0.5" fill="#FFFFFF" />
                  <circle cx="23.2" cy="17.4" r="0.25" fill="#FFFFFF" />

                  {/* Snout felt pad */}
                  <ellipse cx="18" cy="20.8" rx="2.5" ry="1.8" fill="#FFF6F8" />
                  {/* Pink heart nose */}
                  <path d="M 17.5 19.8 Q 18 19.3, 18.5 19.8 L 18 20.6 Z" fill="#FF808B" />
                  {/* Mouth embroidery */}
                  <path d="M 16.8 21.3 Q 18 22.3, 18 21.3 Q 18 22.3, 19.2 21.3" stroke="#5E4E49" strokeWidth="0.7" fill="none" strokeLinecap="round" />

                  {/* Premium Satin Bow Tie with hanging tails */}
                  <g className="origin-center" transform="translate(18, 25.5)">
                    {/* Left Loop */}
                    <path d="M 0 0 C -4.5 -4.5, -6 -2, -3.5 1.5 Z" fill="#FF808B" stroke="#E5727C" strokeWidth="0.5" />
                    {/* Right Loop */}
                    <path d="M 0 0 C 4.5 -4.5, 6 -2, 3.5 1.5 Z" fill="#FF808B" stroke="#E5727C" strokeWidth="0.5" />
                    {/* Center gold/pink bead */}
                    <circle cx="0" cy="0.2" r="1.2" fill="#FFA3A9" stroke="#E5727C" strokeWidth="0.4" />
                    {/* Hanging Ribbon Tails */}
                    <path d="M -0.5 0.5 C -1.5 2.5, -2.5 4.5, -2 6" stroke="#FF808B" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                    <path d="M 0.5 0.5 C 1.5 2.5, 2.5 4.5, 2 6" stroke="#FF808B" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                  </g>
                </svg>
              </motion.div>

              {/* 🧸 Ribbon (Teddy Bear Plush) - Fully drawn SVG vector art, bounces on click */}
              {!isBunnyTucked && (
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: [1, -2, 2, 0] }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveObj('teddy');
                    // Trigger direct audio squeak
                    const audioCtx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
                    if (!audioCtxRef.current) audioCtxRef.current = audioCtx;
                    const now = audioCtx.currentTime;
                    const playSqueakPart = (delay: number, baseFreq: number) => {
                      const osc = audioCtx.createOscillator();
                      const gainNode = audioCtx.createGain();
                      osc.type = 'triangle';
                      const t = now + delay;
                      osc.frequency.setValueAtTime(baseFreq, t);
                      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.0, t + 0.05);
                      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.0, t + 0.15);
                      gainNode.gain.setValueAtTime(0, t);
                      gainNode.gain.linearRampToValueAtTime(0.20, t + 0.02);
                      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
                      osc.connect(gainNode);
                      gainNode.connect(audioCtx.destination);
                      osc.start(t);
                      osc.stop(t + 0.18);
                    };
                    playSqueakPart(0, 350);
                    playSqueakPart(0.08, 430);
                  }}
                  className="w-12 h-13 relative cursor-pointer flex flex-col justify-end items-center overflow-visible transition-transform"
                  title="Ribbon Teddy (Tap me!)"
                >
                  <svg className="w-12 h-13 overflow-visible" viewBox="0 0 36 36">
                    {/* Fuzzy drop shadow */}
                    <ellipse cx="18" cy="32" rx="9" ry="1.8" fill="#000000" opacity="0.08" className="blur-[1px]" />
                    
                    {/* Left Ear */}
                    <circle cx="10" cy="11.5" r="4.2" fill="#C5936B" stroke="#9A6B46" strokeWidth="0.8" />
                    <circle cx="10" cy="11.5" r="2.2" fill="#FFEFE2" />
                    <circle cx="10" cy="11.5" r="3.2" fill="none" stroke="#9A6B46" strokeWidth="0.5" strokeDasharray="1,1" />

                    {/* Right Ear */}
                    <circle cx="26" cy="11.5" r="4.2" fill="#C5936B" stroke="#9A6B46" strokeWidth="0.8" />
                    <circle cx="26" cy="11.5" r="2.2" fill="#FFEFE2" />
                    <circle cx="26" cy="11.5" r="3.2" fill="none" stroke="#9A6B46" strokeWidth="0.5" strokeDasharray="1,1" />

                    {/* Stubby Legs */}
                    <circle cx="11" cy="30" r="3.2" fill="#C5936B" stroke="#9A6B46" strokeWidth="0.8" />
                    <circle cx="11" cy="30" r="1.8" fill="#FFEFE2" />
                    <circle cx="25" cy="30" r="3.2" fill="#C5936B" stroke="#9A6B46" strokeWidth="0.8" />
                    <circle cx="25" cy="30" r="1.8" fill="#FFEFE2" />

                    {/* Chubby Tummy */}
                    <ellipse cx="18" cy="26" rx="10" ry="8" fill="#C5936B" stroke="#9A6B46" strokeWidth="0.8" />
                    <ellipse cx="18" cy="26" rx="5.5" ry="4.5" fill="#FFEFE2" />
                    {/* Center vertical stitch seam */}
                    <line x1="18" y1="18.5" x2="18" y2="33.8" stroke="#875A38" strokeWidth="0.6" strokeDasharray="2,2" />

                    {/* Stubby Arms */}
                    <ellipse cx="7.2" cy="22" rx="3" ry="2.2" fill="#C5936B" stroke="#9A6B46" strokeWidth="0.8" transform="rotate(-15 7.2 22)" />
                    <ellipse cx="28.8" cy="22" rx="3" ry="2.2" fill="#C5936B" stroke="#9A6B46" strokeWidth="0.8" transform="rotate(15 28.8 22)" />

                    {/* Chubby Round Head */}
                    <ellipse cx="18" cy="18" rx="9" ry="8" fill="#C5936B" stroke="#9A6B46" strokeWidth="0.8" />
                    <path d="M 18 10 C 18 10, 18 18, 18 25.8" stroke="#875A38" strokeWidth="0.6" strokeDasharray="2,2" fill="none" />

                    {/* Snout Velvet Oval */}
                    <ellipse cx="18" cy="20.5" rx="3" ry="2.2" fill="#FFEFE2" stroke="#9A6B46" strokeWidth="0.5" />
                    <ellipse cx="18" cy="19.5" rx="1.2" ry="0.8" fill="#3D281D" />
                    {/* Embroidered mouth */}
                    <path d="M 17.2 21 Q 18 21.8, 18 21 Q 18 21.8, 18.8 21" stroke="#3D281D" strokeWidth="0.7" fill="none" strokeLinecap="round" />

                    {/* Glass Safety Eyes (realistic catchlights) */}
                    <circle cx="14" cy="16.5" r="1.2" fill="#1C1816" />
                    <circle cx="13.7" cy="16.2" r="0.4" fill="#FFFFFF" />
                    <circle cx="14.1" cy="16.8" r="0.2" fill="#FFFFFF" />

                    <circle cx="22" cy="16.5" r="1.2" fill="#1C1816" />
                    <circle cx="22.3" cy="16.2" r="0.4" fill="#FFFFFF" />
                    <circle cx="21.7" cy="16.8" r="0.2" fill="#FFFFFF" />

                    {/* Cheek blush */}
                    <circle cx="11" cy="18.5" r="1.5" fill="#FFAAA6" opacity="0.6" className="blur-[0.5px]" />
                    <circle cx="25" cy="18.5" r="1.5" fill="#FFAAA6" opacity="0.6" className="blur-[0.5px]" />

                    {/* Pretty Gingham Bow Collar */}
                    <g className="origin-center" transform="translate(18, 24.5)">
                      {/* Left bow leaf */}
                      <path d="M 0 0 C -4 -4, -5.5 -1.5, -3 1 Z" fill="#FFA3A9" stroke="#E5727C" strokeWidth="0.4" />
                      {/* Right bow leaf */}
                      <path d="M 0 0 C 4 -4, 5.5 -1.5, 3 1 Z" fill="#FFA3A9" stroke="#E5727C" strokeWidth="0.4" />
                      {/* Center knot */}
                      <circle cx="0" cy="0" r="1" fill="#FF808B" />
                    </g>
                  </svg>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bedside Nightstand (Nakast) */}
          <div 
            className={`absolute bottom-[10%] left-[54%] w-[14%] h-[20%] flex flex-col justify-between p-1 z-[4] select-none transition-all duration-300 group/stand ${
              activeObj === 'flowers' || activeObj === 'candle' ? 'scale-[1.01]' : 'hover:scale-[1.01]'
            }`}
            title="Bedside Nightstand"
          >
            {/* Realist vector vase of White Lilies standing on the cabinet (Left aligned for spacing) */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setActiveObj('flowers');
              }}
              className="absolute top-[-30px] left-[5%] w-[45%] h-[30px] flex justify-center items-end overflow-visible z-10 hover:scale-105 active:scale-95 transition-transform"
              title="White Lilies"
            >
              {/* Fully hand-drawn SVG lilies in glass bottle vase - no emojis! */}
              <svg className="w-12 h-[38px] overflow-visible" viewBox="0 0 32 32">
                {/* Green stems */}
                <path d="M 16 28 L 12 14" stroke="#4F6D54" strokeWidth="1" fill="none" />
                <path d="M 16 28 L 16 10" stroke="#4F6D54" strokeWidth="1" fill="none" />
                <path d="M 16 28 L 20 12" stroke="#4F6D54" strokeWidth="1" fill="none" />
                
                {/* Mini Leaves */}
                <path d="M 13.5 20 C 11 19, 10 16, 13 18" stroke="#4F6D54" strokeWidth="0.8" fill="#587A5F" />
                <path d="M 18.5 19 C 21 18, 22 15, 19 17" stroke="#4F6D54" strokeWidth="0.8" fill="#587A5F" />

                {/* White Lily petals - Left Blossom */}
                <g transform="translate(11, 13)">
                  <path d="M 0 0 C -4 -4, -6 -1, -2 1 C 2 3, 3 1, 0 0" fill="#FFFFFC" stroke="#E5DEC9" strokeWidth="0.4" />
                  <path d="M 0 0 C 4 -4, 6 -1, 2 1 C -2 3, -3 1, 0 0" fill="#FFFFFC" stroke="#E5DEC9" strokeWidth="0.4" />
                  <path d="M 0 0 C -1 -5, 1 -5, 0 0" fill="#FFFFFC" stroke="#E5DEC9" strokeWidth="0.4" />
                  <circle cx="0" cy="-4" r="0.4" fill="#D4AF37" />
                </g>

                {/* Center Blossom (High) */}
                <g transform="translate(16, 9)">
                  <path d="M 0 0 C -4 -4, -6 -1, -2 1 C 2 3, 3 1, 0 0" fill="#FFFFFF" stroke="#E5DEC9" strokeWidth="0.4" />
                  <path d="M 0 0 C 4 -4, 6 -1, 2 1 C -2 3, -3 1, 0 0" fill="#FFFFFF" stroke="#E5DEC9" strokeWidth="0.4" />
                  <path d="M 0 0 C -1 -5, 1 -5, 0 0" fill="#FFFFFF" stroke="#E5DEC9" strokeWidth="0.4" />
                  <circle cx="0" cy="-4" r="0.4" fill="#D4AF37" />
                </g>

                {/* Right Blossom */}
                <g transform="translate(21, 11)">
                  <path d="M 0 0 C -4 -4, -6 -1, -2 1 C 2 3, 3 1, 0 0" fill="#FFFFFC" stroke="#E5DEC9" strokeWidth="0.4" />
                  <path d="M 0 0 C 4 -4, 6 -1, 2 1 C -2 3, -3 1, 0 0" fill="#FFFFFC" stroke="#E5DEC9" strokeWidth="0.4" />
                  <path d="M 0 0 C -1 -5, 1 -5, 0 0" fill="#FFFFFC" stroke="#E5DEC9" strokeWidth="0.4" />
                  <circle cx="0" cy="-4" r="0.4" fill="#D4AF37" />
                </g>

                {/* Glass Vase */}
                <path d="M 12 20 L 20 20 L 22 30 L 10 30 Z" fill="rgba(240, 248, 255, 0.4)" stroke="#A9C2D2" strokeWidth="0.8" />
                {/* Water Line */}
                <path d="M 11.2 25 L 20.8 25" stroke="#87B1D0" strokeWidth="0.5" />
                {/* Reflection Highlight */}
                <path d="M 13 21 L 14 29" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="0.6" />
              </svg>
            </div>

            {/* Glowing Scented Candle sitting on the nightstand (Right aligned for spacing) */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setIsCandleLit(!isCandleLit);
                setActiveObj('candle');
              }}
              className="absolute top-[-18px] right-[10%] w-[35%] h-[24px] flex flex-col items-center justify-end overflow-visible z-10 hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Soy Candle (Tap to light!)"
            >
              {/* Flickering flame with CSS animation */}
              {isCandleLit && (
                <div className="relative w-2 h-2.5 -mb-0.5 flex items-center justify-center overflow-visible">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 0.9, 1.1, 1], y: [0, -1, 0, -0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="w-1.5 h-2.5 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 rounded-full shadow-[0_0_8px_#FFA500]"
                  />
                  <div className="absolute top-[1px] w-[0.5px] h-1.5 bg-stone-800" />
                </div>
              )}
              {/* Wax Cup container */}
              <div className="w-3.5 h-4 bg-gradient-to-br from-[#FCFBF7] to-[#EAE5DA] border border-[#C5BCAE] rounded-sm relative overflow-hidden flex flex-col justify-end">
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-[#D7747E]/30" />
                {/* Golden label stripe */}
                <div className="w-full h-1 bg-amber-400/50" />
              </div>
            </div>

            {/* Cabinet structure (Clickable to select Flowers description modal) */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setActiveObj('flowers');
              }}
              className={`w-full h-full bg-[#EBDBC9] border rounded-lg shadow-sm flex flex-col justify-between p-1 cursor-pointer transition-all ${
                activeObj === 'flowers' ? 'border-[#ff808b] ring-1 ring-[#ff808b]/50' : 'border-[#C6A283] hover:border-[#b48d6c]'
              }`}
            >
              {/* Drawer 1 */}
              <div className="w-full h-[40%] bg-[#DFCDBC] border border-stone-200/20 rounded flex items-center justify-center shadow-inner relative">
                <div className="w-1.5 h-1.5 bg-[#8C6D58] rounded-full shadow-sm" />
              </div>
              {/* Drawer 2 */}
              <div className="w-full h-[40%] bg-[#DFCDBC] border border-stone-200/20 rounded flex items-center justify-center shadow-inner relative">
                <div className="w-1.5 h-1.5 bg-[#8C6D58] rounded-full shadow-sm" />
              </div>
            </div>
          </div>

          {/* Large Vintage Mirror (Clickable to trigger 'mirror' and cycle quotes) */}
          <div 
            onClick={() => {
              setActiveObj('mirror');
              setMirrorQuoteIdx((prev) => (prev + 1) % MIRROR_QUOTES.length);
            }}
            className={`absolute top-[10%] left-[68%] w-[13%] h-[42%] flex flex-col justify-end cursor-pointer select-none transition-all duration-300 z-[2] group/mirror ${
              activeObj === 'mirror' ? 'scale-[1.01]' : 'hover:scale-[1.01]'
            }`}
            title="Vintage Parisian Wall Mirror"
          >
            {/* Hanging Wall Attachment (Chain & Brass Peg) to make it attached to the wall */}
            <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 w-10 h-6 flex flex-col items-center pointer-events-none overflow-visible">
              {/* Antique brass wall peg */}
              <div className="w-2.5 h-2.5 bg-[#8C6D58] border border-[#6A4E3B] rounded-full shadow-sm z-20 relative" />
              {/* Hanging cords/chains forming a triangle to the mirror peak */}
              <svg className="w-10 h-5 overflow-visible z-10" viewBox="0 0 40 20">
                <line x1="20" y1="2" x2="6" y2="20" stroke="#9A7B66" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="20" y1="2" x2="34" y2="20" stroke="#9A7B66" strokeWidth="1.2" strokeLinecap="round" />
                {/* Tiny decorative bow at peg */}
                <path d="M 18 3 Q 20 0, 22 3" stroke="#FF808B" strokeWidth="1" fill="none" />
              </svg>
            </div>

            {/* Elegant Vintage Gilded Arched Frame */}
            <div className="absolute inset-0 border-[5px] border-amber-500/95 rounded-t-full bg-slate-100 shadow-lg relative overflow-hidden flex flex-col items-center justify-end p-2 ring-1 ring-amber-700/40">
              
              {/* Inner gold beading detail */}
              <div className="absolute inset-0.5 border border-amber-300/40 rounded-t-full pointer-events-none" />

              {/* Gold Filigree/Baroque Carved Crown on top peak */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-amber-400/90 rounded-t-full flex items-center justify-center border-t border-amber-200 z-10 pointer-events-none shadow-sm">
                {/* Mini crown fleur-de-lis motif */}
                <svg className="w-6 h-3 fill-amber-600/80" viewBox="0 0 24 12">
                  <path d="M 12 0 C 14 3, 16 3, 18 5 C 15 5, 13 4, 12 7 C 11 4, 9 5, 6 5 C 8 3, 10 3, 12 0 Z" />
                </svg>
              </div>

              {/* Subtle glass reflection of coquette bedroom elements */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-200/40 via-pink-100/30 to-amber-100/30 z-0 pointer-events-none" />

              {/* Fuzzy pink bed curtain and headboard reflection in background */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none z-0" viewBox="0 0 60 180" preserveAspectRatio="none">
                {/* Reflected soft pink curtains on the sides */}
                <path d="M 0 0 Q 15 60, 5 180 L 0 180 Z" fill="#FFA3A9" className="blur-[1px]" />
                <path d="M 60 0 Q 45 60, 55 180 L 60 180 Z" fill="#FFA3A9" className="blur-[1px]" />
                {/* Reflected fairy lights glowing */}
                <circle cx="15" cy="30" r="3" fill="#FFF2BD" opacity="0.9" className="blur-[0.5px]" />
                <circle cx="28" cy="45" r="3.5" fill="#FFF2BD" opacity="0.8" className="blur-[0.5px]" />
                <circle cx="45" cy="35" r="3" fill="#FFF2BD" opacity="0.9" className="blur-[0.5px]" />
                <circle cx="20" cy="75" r="4" fill="#FFF0F2" opacity="0.75" className="blur-[1px]" />
                <circle cx="40" cy="95" r="3.5" fill="#FFF0F2" opacity="0.8" className="blur-[1px]" />
              </svg>

              {/* Bright realistic high-gloss diagonal shine lines */}
              <div className="absolute -inset-x-12 top-0 h-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-[35deg] pointer-events-none z-10" />
              <div className="absolute -inset-x-12 top-10 h-[150%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[35deg] pointer-events-none z-10" />
              
              {/* Gentle glowing overlay of selected outline */}
              {activeObj === 'mirror' && (
                <div className="absolute inset-0 bg-[#FF808B]/5 pointer-events-none border border-[#FF808B]/30 rounded-t-full animate-pulse z-10" />
              )}

              {/* Mirror quote text label overlay */}
              <div className="z-10 text-center tracking-wider px-1 mb-2 select-none pointer-events-none">
                <span className="block text-[6px] font-sans font-semibold text-[#8C6D58] uppercase opacity-75 mb-0.5">
                  Reflexion
                </span>
                <span className="text-[7px] font-serif font-bold text-[#E5828D] animate-pulse leading-normal italic">
                  sweet soul
                </span>
              </div>
            </div>
          </div>

          {/* Skincare Shelf & Perfume (Above Vanity Desk) */}
          <div 
            onClick={() => setActiveObj('skincare')}
            className={`absolute top-[14%] right-[3%] w-[16%] h-[20%] flex flex-col justify-end items-center cursor-pointer select-none transition-all duration-300 z-[2] group/shelf ${
              activeObj === 'skincare' ? 'scale-[1.02]' : 'hover:scale-[1.02]'
            }`}
            title="Floating Wall Shelf"
          >
            {/* Hanging suspension ropes/chains */}
            <div className="absolute inset-y-0 w-full flex justify-between px-3.5 pointer-events-none z-0">
              <div className="w-[1px] h-full bg-[#8C6D58]/40" />
              <div className="w-[1px] h-full bg-[#8C6D58]/40" />
            </div>

            {/* Cozy Cosmetics & Vintage Perfume Bottle on Shelf */}
            <div className="absolute bottom-[6px] inset-x-2 flex justify-around items-end z-10 px-1">
              {/* Skincare Bottle 1 */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveObj('skincare');
                }}
                className="w-5 h-8 bg-gradient-to-b from-pink-50 to-pink-100 rounded-t border border-pink-200 shadow-sm flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-transform p-0.5"
                title="Hydrating Rose Serum"
              >
                <div className="w-2.5 h-[3px] bg-[#A5846B] rounded-t-sm" />
                <div className="w-1.5 h-full border-t border-dashed border-pink-300/30" />
              </div>

              {/* Skincare Jar 2 */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveObj('skincare');
                }}
                className="w-6 h-5 bg-gradient-to-tr from-sky-100 to-white rounded-md border border-sky-200 shadow-sm cursor-pointer hover:scale-110 transition-transform flex flex-col justify-between items-center p-[1px]"
                title="Overnight Glow Mask"
              >
                <div className="w-full h-1 bg-sky-200 rounded-t-[3px]" />
                <span className="text-[3px] text-sky-400 font-serif leading-none scale-[0.8]">🧴</span>
              </div>
              
              {/* Elegant Crystal Perfume Spray Bottle (Clickable to trigger 'perfume') */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveObj('perfume');
                  onTriggerPetals();
                  // Trigger local spritz particles
                  const id = Date.now();
                  setPerfumeSprays(prev => [...prev, { id, x: 25, y: -5 }]);
                  setTimeout(() => {
                    setPerfumeSprays(prev => prev.filter(p => p.id !== id));
                  }, 1200);
                  playPerfumeSpraySound();
                }}
                className="w-7 h-10 relative cursor-pointer hover:scale-110 active:scale-95 transition-transform flex flex-col items-center justify-end"
                title="Scented Perfume Atomizer"
              >
                {/* Gold atomiser spray bulb */}
                <div className="absolute -left-[6px] top-[10px] w-3.5 h-3.5 bg-yellow-500 rounded-full shadow-sm z-20 hover:scale-115 active:scale-90" />
                {/* Spray pump neck */}
                <div className="w-1.5 h-2 bg-yellow-400 rounded-t z-10 relative" />
                {/* Elegant crystal bottle body */}
                <div className="w-5 h-6 bg-gradient-to-b from-[#FFA3A9] to-[#FF808B] border border-pink-300 rounded-md shadow-sm relative overflow-hidden flex items-center justify-center">
                  <div className="absolute -inset-x-2 top-0 h-3 bg-white/20 rotate-12" />
                  <span className="text-[6px] text-white font-serif">✨</span>
                </div>
              </div>
            </div>

            {/* Polished shelf wood bar */}
            <div className="w-full h-1.5 bg-[#A8846A] rounded shadow-sm z-10" />
            <div className="text-[7px] font-serif text-[#8A7171] mt-0.5 z-10 uppercase tracking-widest">Self</div>
          </div>

          {/* Vanity Table / Desk (Clickable to trigger 'laptop' / 'tablet') */}
          <div 
            onClick={() => setActiveObj('laptop')}
            className={`absolute bottom-[10%] right-[3%] w-[33%] h-[26%] bg-[#EBDBC9] border border-[#CFA27C] rounded-xl shadow-md flex flex-col justify-between p-1.5 z-[3] overflow-visible transition-all duration-300 cursor-pointer select-none ${
              activeObj === 'laptop' || activeObj === 'tablet' ? 'ring-1 ring-[#ff808b]' : 'hover:scale-[1.01]'
            }`}
            title="Vanity Desk"
          >
            {/* Drawers layout */}
            <div className="flex justify-between px-1">
              <div className="w-[46%] h-3 bg-[#DFCDBC] border border-stone-200/20 rounded flex items-center justify-center relative">
                <div className="w-1 h-1 bg-pink-400/70 rounded-full" />
              </div>
              <div className="w-[46%] h-3 bg-[#DFCDBC] border border-stone-200/20 rounded flex items-center justify-center relative">
                <div className="w-1 h-1 bg-pink-400/70 rounded-full" />
              </div>
            </div>

            {/* Visual props sitting next to tablet/laptop */}
            <div className="flex justify-between items-end w-full px-1 mb-1 pointer-events-none z-10 overflow-visible">
              {/* Cozy tea mug with steam */}
              <div className="flex flex-col items-center">
                <div className="w-[2px] h-2 bg-stone-400/40 rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-gradient-to-tr from-pink-100 to-white border border-pink-200 rounded-full relative flex items-center justify-center">
                  <div className="absolute top-1/2 -translate-y-1/2 right-[-2.5px] w-1 h-1.5 border border-pink-200 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-[#CBB89D] rounded-full" />
                </div>
              </div>

              {/* Stack of colorful vintage poetry journals */}
              <div className="flex flex-col items-center gap-[0.5px]">
                <div className="w-5 h-1 bg-sky-200/90 rounded shadow-sm" />
                <div className="w-6 h-1 bg-amber-100/90 rounded shadow-sm" />
                <div className="w-5.5 h-1 bg-pink-200/95 rounded shadow-sm" />
              </div>
            </div>

            {/* Laptop - Clicking triggers activeObj = 'laptop' */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setActiveObj('laptop');
              }}
              className={`absolute left-[8%] bottom-[8px] w-14 h-11 flex flex-col items-center justify-end cursor-pointer hover:scale-105 active:scale-95 transition-transform z-20 group/laptop p-0.5 rounded ${
                activeObj === 'laptop' ? 'ring-1 ring-pink-400' : ''
              }`}
              title="Laptop Device"
            >
              {/* Open Screen display */}
              <div className="w-11 h-[28px] bg-stone-800 border-t border-x border-stone-700 rounded-t-md relative flex items-center justify-center overflow-hidden shadow-inner">
                <div className="absolute inset-[1px] bg-[#222] rounded-t-[3px] flex flex-col items-center justify-center p-0.5 relative">
                  {laptopScreen === 'playlist' ? (
                    // Spotify Beranda (Home) style screen
                    <div className="absolute inset-0 bg-[#121212] flex flex-col justify-between p-[1px] z-10">
                      <div className="w-full flex items-center justify-between px-[1px] border-b border-white/5 pb-[1px]">
                        <span className="text-[3px] text-green-400 font-bold scale-[0.8]">Spotify ♪</span>
                        <div className="w-0.5 h-0.5 bg-green-400 rounded-full animate-pulse" />
                      </div>
                      <div className="flex flex-col gap-[0.5px] items-center justify-center">
                        <div className="w-7 h-[2px] bg-green-500/80 rounded" />
                        <div className="w-5 h-[1.5px] bg-white/40 rounded mt-[0.5px]" />
                      </div>
                      <div className="w-full flex items-center justify-between px-[2px] scale-[0.7] origin-bottom mb-[0.5px]">
                        <div className="w-[2px] h-[2px] bg-white/70 rounded-full" />
                        <div className="w-4 h-[1px] bg-white/20 rounded" />
                        <div className="w-[2px] h-[2px] bg-white/70 rounded-full" />
                      </div>
                    </div>
                  ) : (
                    // Fireplace scene style screen
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-400/80 via-purple-300/60 to-sky-200/40">
                      <span className="text-[4px] text-white font-mono scale-[0.8] animate-pulse absolute bottom-1">lo-fi fireplace</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Laptop base structure */}
              <div className="w-13 h-1 bg-stone-400 border-b border-stone-500 rounded-b-sm shadow-md" />
            </div>

            {/* Drawing Tablet - Clicking triggers activeObj = 'tablet' */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setActiveObj('tablet');
              }}
              className={`absolute right-[8%] bottom-[8px] w-10 h-8 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform z-20 group/tablet p-0.5 rounded ${
                activeObj === 'tablet' ? 'ring-1 ring-pink-400' : ''
              }`}
              title="Artist Drawing Tablet"
            >
              <div className="w-8.5 h-6.5 bg-stone-700 border border-stone-600 rounded shadow-sm relative flex items-center justify-center">
                {/* Active drawing workspace */}
                <div className="absolute inset-[0.8px] bg-[#1A1A1A] rounded flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full opacity-85" viewBox="0 0 24 20">
                    <path d="M 5 10 Q 12 4, 19 10 Q 12 16, 5 10" stroke="#FFC5C8" strokeWidth="0.8" fill="none" />
                    <circle cx="12" cy="10" r="1.5" fill="#FFE3E5" />
                  </svg>
                </div>
                {/* Magnetic Stylus sitting adjacent */}
                <div className="absolute top-[2px] right-[-1.5px] w-[1px] h-5 bg-stone-400 rotate-[45deg] rounded-sm" />
              </div>
            </div>

            {/* Desk legs extending below */}
            <div className="absolute bottom-[-18px] left-3 w-1.5 h-[18px] bg-[#CFA27C]" />
            <div className="absolute bottom-[-18px] right-3 w-1.5 h-[18px] bg-[#CFA27C]" />
          </div>

          {/* Scent mist particles if sprayed */}
          {perfumeSprays.map((spray) => (
            <motion.div
              key={spray.id}
              initial={{ scale: 0.1, opacity: 0.8, y: 0 }}
              animate={{ scale: 2.2, opacity: 0, y: -25, x: [-10, 10, -5] }}
              className="absolute top-[22%] right-[11%] text-pink-300 font-serif text-xs pointer-events-none z-30"
            >
              ❀
            </motion.div>
          ))}

          {/* Floating particle candle glow */}
          {isCandleLit && (
            <div className="absolute bottom-[28%] left-[58%] w-8 h-8 bg-amber-200/35 rounded-full blur-[8px] animate-pulse pointer-events-none" />
          )}

          {/* Interactive Tutorial helper tag */}
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[10px] font-serif text-[#8A7171]">
            <HelpCircle className="w-3.5 h-3.5 text-[#ff808b]" />
            <span>Click objects directly in the room to interact ✨</span>
          </div>
        </div>

        {/* Dynamic Detail Card / Interactive Area (Right Side) */}
        <div className="lg:col-span-5 h-full min-h-[380px]">
          <AnimatePresence mode="wait">
            {activeObj ? (
              <motion.div
                key={activeObj}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-panel-deep p-6 rounded-3xl border border-[#ffb3b8]/40 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-pink-100">
                    <h3 className="font-serif text-lg font-semibold text-[#5E3A3A]">
                      {BEDROOM_OBJECTS.find(o => o.id === activeObj)?.name}
                    </h3>
                    <button
                      onClick={() => setActiveObj(null)}
                      className="text-xs font-serif text-[#ff808b] hover:underline cursor-pointer interactive-obj"
                    >
                      Close ✕
                    </button>
                  </div>

                  {/* Bed Interactions */}
                  {activeObj === 'bed' && (
                    <div className="flex flex-col gap-4">
                      <p className="text-xs text-[#7A6060] leading-relaxed">
                        A cozy bed makes a whole room peaceful. Select your favorite cover pattern and tuck my bunny in!
                      </p>
                      
                      <div className="flex flex-col gap-2">
                        <span className="text-[11px] font-serif uppercase tracking-wider text-[#8A7171]">Choose Cover Style:</span>
                        <div className="flex gap-2">
                          {(['pink', 'gingham', 'lace'] as const).map((style) => (
                            <button
                              key={style}
                              onClick={() => setBedStyle(style)}
                              className={`px-3 py-1.5 rounded-full text-xs font-serif transition-all border cursor-pointer interactive-obj ${
                                bedStyle === style
                                  ? 'bg-[#ffb3b8] text-white border-white shadow-sm'
                                  : 'bg-white text-[#5E3A3A] border-[#ffd6d9] hover:bg-[#FFEBEB]'
                              }`}
                            >
                              {style === 'pink' ? '🌸 Soft Pink' : style === 'gingham' ? '🎀 Pink Gingham' : '🦢 White Lace'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-serif text-[#5E3A3A]">Snuggle bunny friend?</span>
                          <span className="text-[10px] text-[#8A7171]">Tuck the bunny under the covers.</span>
                        </div>
                        <button
                          onClick={() => setIsBunnyTucked(!isBunnyTucked)}
                          className={`px-3 py-1.5 rounded-full text-xs font-serif cursor-pointer interactive-obj ${
                            isBunnyTucked ? 'bg-pink-400 text-white' : 'bg-white text-pink-400 border border-pink-200'
                          }`}
                        >
                          {isBunnyTucked ? 'Tucked In 🐰💤' : 'Tuck Bunny 🐰'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mirror Interactions */}
                  {activeObj === 'mirror' && (
                    <div className="flex flex-col gap-5 items-center text-center">
                      <p className="text-xs text-[#7A6060] leading-relaxed">
                        Look into the vintage wooden mirror. Tap the glass to reveal a secret beautiful reminder just for you.
                      </p>

                      <motion.div
                        key={mirrorQuoteIdx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-2xl bg-gradient-to-tr from-[#FFF5F6] to-white border border-[#ffb3b8]/30 w-full min-h-[110px] flex items-center justify-center shadow-inner relative"
                      >
                        <div className="absolute top-2 right-3 text-pink-300">✦</div>
                        <p className="font-garamond italic text-base md:text-lg text-[#5E3A3A] font-medium leading-relaxed">
                          “{MIRROR_QUOTES[mirrorQuoteIdx]}”
                        </p>
                      </motion.div>

                      <button
                        onClick={handleMirrorClick}
                        className="px-4 py-2 bg-[#FFEBEB] hover:bg-[#ffd6d9] text-[#ff808b] font-serif text-xs tracking-wider rounded-full transition-all border border-pink-100 cursor-pointer interactive-obj"
                      >
                        Tap the glass ✨
                      </button>
                    </div>
                  )}

                  {/* Laptop Interactions */}
                  {activeObj === 'laptop' && (
                    <div className="flex flex-col gap-4">
                      <p className="text-xs text-[#7A6060] leading-relaxed">
                        My laptop. Toggle between playing a dreamy pixel-art bedroom Suara Api Reflexing, or inspecting my current Spotify loop.
                      </p>

                      <div className="flex gap-2 items-center justify-between">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setLaptopScreen('fireplace')}
                            className={`px-3 py-1.5 text-xs rounded-full border cursor-pointer interactive-obj transition-all ${
                              laptopScreen === 'fireplace' ? 'bg-amber-100 border-amber-300 text-[#5E3A3A] font-semibold' : 'bg-white text-[#8A7171] border-stone-200 hover:bg-stone-50'
                            }`}
                          >
                            🔥 Suara Api Reflexing
                          </button>
                          <button
                            onClick={() => setLaptopScreen('playlist')}
                            className={`px-3 py-1.5 text-xs rounded-full border cursor-pointer interactive-obj transition-all ${
                              laptopScreen === 'playlist' ? 'bg-[#1DB954]/25 border-[#1DB954]/50 text-[#1DB954] font-semibold' : 'bg-white text-[#8A7171] border-stone-200 hover:bg-stone-50'
                            }`}
                          >
                            🟢 Spotify Home
                          </button>
                        </div>

                        <button
                          onClick={() => setIsLaptopMuted(!isLaptopMuted)}
                          className={`px-3 py-1.5 text-xs rounded-full border flex items-center gap-1 cursor-pointer interactive-obj transition-all ${
                            isLaptopMuted
                              ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                              : 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'
                          }`}
                          title={isLaptopMuted ? 'Click to play real sound' : 'Click to mute sound'}
                        >
                          <span>{isLaptopMuted ? '🔇 Muted' : '🔊 Playing Sound'}</span>
                        </button>
                      </div>

                      <div className="aspect-[16/10] bg-[#121212] rounded-xl text-stone-200 text-xs border border-zinc-800 shadow-lg flex flex-col justify-between relative overflow-hidden">
                        {laptopScreen === 'fireplace' ? (
                          <div className="flex flex-col h-full justify-between items-center text-center p-4 font-mono">
                            <span className="text-3xl animate-bounce">🔥🪵</span>
                            <div>
                              <p className="text-[11px] text-amber-100/90 font-serif mb-1 font-medium">Suara Api Reflexing</p>
                              <p className="text-[9px] text-stone-400">Synthesizing relaxing live flames...</p>
                            </div>
                            
                            {!isLaptopMuted ? (
                              <div className="flex gap-1 items-end h-4 justify-center">
                                <motion.div animate={{ height: [4, 14, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-amber-400 rounded-full" />
                                <motion.div animate={{ height: [12, 6, 12] }} transition={{ repeat: Infinity, duration: 0.35 }} className="w-0.5 bg-amber-500 rounded-full" />
                                <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-orange-400 rounded-full" />
                                <motion.div animate={{ height: [14, 4, 14] }} transition={{ repeat: Infinity, duration: 0.45 }} className="w-0.5 bg-amber-500 rounded-full" />
                              </div>
                            ) : (
                              <span className="text-[8px] text-stone-500">fireplace_audio.sh • muted</span>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col h-full bg-[#121212] rounded-lg text-white font-sans overflow-hidden select-none p-2 w-full justify-between">
                            {/* Header row */}
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.98-.336.075-.668-.135-.744-.47-.077-.336.135-.668.47-.743 3.856-.88 7.15-.5 9.822 1.13.295.178.387.563.205.856zm1.225-2.72c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.077-1.182-.413.125-.847-.107-.972-.52-.125-.413.108-.847.52-.972 3.668-1.112 8.237-.57 11.343 1.343.366.226.486.707.26 1.073zm.107-2.82c-3.26-1.937-8.652-2.115-11.75-1.174-.5.15-1.025-.13-1.176-.63-.15-.5.13-1.024.63-1.174 3.6-1.09 9.54-.887 13.3 1.343.45.267.6.84.33 1.29-.26.45-.838.6-1.29.33-.017-.01-.017-.01 0 0z"/>
                                </svg>
                                <span className="text-[9px] font-bold text-white tracking-wide">Spotify</span>
                              </div>
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                              </div>
                            </div>

                            <div className="flex flex-1 gap-1.5 overflow-hidden min-h-0 mb-1">
                              {/* Sidebar */}
                              <div className="w-[30%] bg-black/40 rounded p-1 flex flex-col gap-1 text-[7px] text-zinc-400 font-medium">
                                <div className="flex items-center gap-1 text-white bg-zinc-800/80 px-1 py-0.5 rounded">
                                  <span>🏠</span> <span>Home</span>
                                </div>
                                <div className="flex items-center gap-1 px-1 py-0.5 hover:text-white transition-colors">
                                  <span>🔍</span> <span>Search</span>
                                </div>
                                <div className="flex items-center gap-1 px-1 py-0.5 hover:text-white transition-colors">
                                  <span>📚</span> <span>Library</span>
                                </div>
                                <div className="mt-auto pt-1 border-t border-zinc-800 flex items-center gap-1 text-pink-300">
                                  <span>🎀</span> <span className="truncate">Liked</span>
                                </div>
                              </div>

                              {/* Playlists grid */}
                              <div className="flex-1 bg-gradient-to-b from-zinc-900 to-[#121212] rounded p-1.5 overflow-y-auto">
                                <p className="text-[8px] font-bold text-white mb-1">Good Morning, Sweet Soul ✿</p>
                                <div className="grid grid-cols-2 gap-1">
                                  {[
                                    { title: 'Coquette Loops', desc: 'pink lofi', color: 'from-pink-300 to-pink-500' },
                                    { title: 'Lofi Rain', desc: 'cozy ambient', color: 'from-sky-300 to-indigo-500' },
                                    { title: 'Cottage Folk', desc: 'woodland vibe', color: 'from-emerald-300 to-teal-600' },
                                    { title: 'Teatime Chill', desc: 'warm jazz', color: 'from-amber-200 to-amber-500' }
                                  ].map((pl, i) => (
                                    <div key={i} className="bg-zinc-800/40 hover:bg-zinc-800/80 p-1 rounded flex items-center gap-1 transition-colors cursor-pointer">
                                      <div className={`w-3.5 h-3.5 rounded bg-gradient-to-tr ${pl.color} flex items-center justify-center text-[5px] font-bold text-white shadow-sm flex-shrink-0`}>
                                        {pl.title[0]}
                                      </div>
                                      <div className="overflow-hidden">
                                        <p className="text-[6px] font-bold text-stone-100 truncate leading-none">{pl.title}</p>
                                        <p className="text-[4.5px] text-zinc-400 truncate mt-0.5 leading-none">{pl.desc}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* bottom active player controls */}
                            <div className="bg-[#181818] rounded p-1 flex items-center justify-between border-t border-zinc-800 text-[7px]">
                              {/* Left track info */}
                              <div className="flex items-center gap-1 w-[35%] overflow-hidden">
                                <div className="w-4 h-4 rounded bg-pink-300 flex-shrink-0 animate-spin-slow flex items-center justify-center text-[6px] border border-white/10 shadow-sm font-bold text-pink-700">✿</div>
                                <div className="overflow-hidden">
                                  <p className="text-stone-100 font-bold truncate leading-none">mysl. loop - lofi acoustic</p>
                                  <p className="text-[5px] text-zinc-400 truncate mt-0.5 leading-none">Antigravity</p>
                                </div>
                              </div>

                              {/* Center controls */}
                              <div className="flex flex-col items-center gap-0.5 w-[45%]">
                                <div className="flex items-center gap-2">
                                  <span className="text-[5px] text-zinc-400 hover:text-white cursor-pointer">🔀</span>
                                  <span className="text-[5px] text-zinc-400 hover:text-white cursor-pointer">⏮</span>
                                  <div className="w-3.5 h-3.5 bg-white text-black rounded-full flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 flex-shrink-0">
                                    <span className="text-[5px] translate-x-[0.5px]">▶</span>
                                  </div>
                                  <span className="text-[5px] text-zinc-400 hover:text-white cursor-pointer">⏭</span>
                                  <span className="text-[5px] text-zinc-400 hover:text-white cursor-pointer">🔁</span>
                                </div>
                                <div className="w-full flex items-center gap-1 text-[4.5px] text-zinc-400">
                                  <span>0:14</span>
                                  <div className="flex-1 bg-zinc-700 h-0.5 rounded-full overflow-hidden">
                                    <motion.div
                                      animate={{ width: ['0%', '100%'] }}
                                      transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                                      className="bg-green-500 h-full"
                                    />
                                  </div>
                                  <span>3:40</span>
                                </div>
                              </div>

                              {/* Right volume */}
                              <div className="flex items-center gap-1 w-[15%] text-[5px] text-zinc-400 justify-end">
                                <span>🔊</span>
                                <div className="w-6 bg-zinc-700 h-0.5 rounded-full">
                                  <div className="bg-zinc-300 h-full w-[70%]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Glass glossy screen shine */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {/* Tablet Interactions */}
                  {activeObj === 'tablet' && (
                    <div className="flex flex-col gap-4">
                      <p className="text-xs text-[#7A6060] leading-relaxed">
                        Draw a tiny doodle directly onto the digital tablet! Select a trace guide below and watch your smooth brush ink flow.
                      </p>

                      {/* Tracing guide selector */}
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-serif uppercase tracking-wider text-[#8A7171] mr-1">Trace Guide:</span>
                        {(['none', 'bow', 'bear'] as const).map((guide) => (
                          <button
                            key={guide}
                            onClick={() => setTraceGuide(guide)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-serif transition-all border cursor-pointer ${
                              traceGuide === guide
                                ? 'bg-[#ffb3b8] text-white border-white shadow-sm'
                                : 'bg-white text-[#5E3A3A] border-[#ffd6d9] hover:bg-[#FFEBEB]'
                            }`}
                          >
                            {guide === 'none' && 'None'}
                            {guide === 'bow' && '🎀 Bow'}
                            {guide === 'bear' && '🧸 Bear'}
                          </button>
                        ))}
                      </div>

                      <div className="relative border border-[#ffd6d9] rounded-2xl bg-white aspect-[16/10] overflow-hidden shadow-inner flex flex-col">
                        <canvas
                          ref={canvasRef}
                          width={600}
                          height={375}
                          onMouseDown={(e) => startDrawing(e.clientX, e.clientY, e.currentTarget)}
                          onMouseMove={(e) => drawMove(e.clientX, e.clientY, e.currentTarget)}
                          onMouseUp={endDrawing}
                          onMouseLeave={endDrawing}
                          onTouchStart={(e) => {
                            if (e.cancelable) e.preventDefault();
                            const touch = e.touches[0];
                            startDrawing(touch.clientX, touch.clientY, e.currentTarget);
                          }}
                          onTouchMove={(e) => {
                            if (e.cancelable) e.preventDefault();
                            const touch = e.touches[0];
                            drawMove(touch.clientX, touch.clientY, e.currentTarget);
                          }}
                          onTouchEnd={endDrawing}
                          className="w-full h-full cursor-crosshair bg-pink-50/5 block z-10"
                        />

                        {/* Tracing Guide SVG Overlay */}
                        {traceGuide !== 'none' && (
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 600 375">
                            {traceGuide === 'bow' && (
                              <>
                                <path d="M 150 180 C 100 110, 200 90, 300 180 C 400 90, 500 110, 450 180 C 400 250, 330 210, 300 180 C 270 210, 200 250, 150 180 Z" fill="none" stroke="#FF808B" strokeWidth="2" strokeDasharray="5,5" className="opacity-25" />
                                <path d="M 300 180 L 240 300 M 300 180 L 360 300" fill="none" stroke="#FF808B" strokeWidth="2" strokeDasharray="5,5" className="opacity-25" />
                                <circle cx="300" cy="180" r="15" fill="none" stroke="#FF808B" strokeWidth="2" strokeDasharray="5,5" className="opacity-25" />
                              </>
                            )}
                            {traceGuide === 'bear' && (
                              <>
                                <circle cx="300" cy="190" r="85" fill="none" stroke="#FF808B" strokeWidth="2" strokeDasharray="5,5" className="opacity-25" />
                                <circle cx="215" cy="115" r="28" fill="none" stroke="#FF808B" strokeWidth="2" strokeDasharray="5,5" className="opacity-25" />
                                <circle cx="385" cy="115" r="28" fill="none" stroke="#FF808B" strokeWidth="2" strokeDasharray="5,5" className="opacity-25" />
                                <ellipse cx="300" cy="220" rx="30" ry="22" fill="none" stroke="#FF808B" strokeWidth="2" strokeDasharray="5,5" className="opacity-25" />
                                <circle cx="265" cy="175" r="8" fill="none" stroke="#FF808B" strokeWidth="2" strokeDasharray="5,5" className="opacity-25" />
                                <circle cx="335" cy="175" r="8" fill="none" stroke="#FF808B" strokeWidth="2" strokeDasharray="5,5" className="opacity-25" />
                              </>
                            )}
                          </svg>
                        )}

                        {/* Reset & Undo Doodle Bar */}
                        <div className="absolute bottom-2 right-2 flex gap-1.5 z-20">
                          <button
                            onClick={() => {
                              setLines((prev) => prev.slice(0, -1));
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-pink-50 text-[#ff808b] border border-pink-200 rounded-full text-[10px] font-serif cursor-pointer shadow-sm transition-all active:scale-95"
                          >
                            Undo
                          </button>
                          <button
                            onClick={() => {
                              setLines([]);
                              if (canvasRef.current) {
                                const ctx = canvasRef.current.getContext('2d');
                                if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                              }
                            }}
                            className="px-2.5 py-1 bg-[#ffb3b8] hover:bg-[#ff808b] text-white rounded-full text-[10px] font-serif cursor-pointer shadow-sm transition-all active:scale-95"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Skincare shelf */}
                  {activeObj === 'skincare' && (
                    <div className="flex flex-col gap-4">
                      <p className="text-xs text-[#7A6060] leading-relaxed">
                        My daily skincare routine. Click through the steps to complete a virtual hydrating ritual.
                      </p>

                      <div className="p-4 rounded-2xl bg-[#FFF5F6] border border-[#ffb3b8]/30">
                        {skincareStep === 0 && (
                          <div className="flex flex-col items-center text-center gap-3">
                            <span className="text-3xl animate-bounce">🧼</span>
                            <h4 className="text-xs font-serif font-bold text-[#5E3A3A]">Step 1: Gentle Cleanser</h4>
                            <p className="text-[11px] text-[#8A7171]">Wash off all dust to prep the skin perfectly.</p>
                            <button
                              onClick={() => setSkincareStep(1)}
                              className="px-3 py-1.5 bg-[#ffb3b8] hover:bg-[#ff808b] text-white rounded-full text-xs font-serif interactive-obj"
                            >
                              Apply Cleanser ✨
                            </button>
                          </div>
                        )}
                        {skincareStep === 1 && (
                          <div className="flex flex-col items-center text-center gap-3">
                            <span className="text-3xl animate-bounce">💧</span>
                            <h4 className="text-xs font-serif font-bold text-[#5E3A3A]">Step 2: Hydrating Toner</h4>
                            <p className="text-[11px] text-[#8A7171]">Pat soft, soothing floral water onto skin cells.</p>
                            <button
                              onClick={() => setSkincareStep(2)}
                              className="px-3 py-1.5 bg-[#ffb3b8] hover:bg-[#ff808b] text-white rounded-full text-xs font-serif interactive-obj"
                            >
                              Pat Toner 🌿
                            </button>
                          </div>
                        )}
                        {skincareStep === 2 && (
                          <div className="flex flex-col items-center text-center gap-3">
                            <span className="text-3xl animate-bounce">✨</span>
                            <h4 className="text-xs font-serif font-bold text-[#5E3A3A]">Step 3: Strawberry Glow Moisturiser</h4>
                            <p className="text-[11px] text-[#8A7171]">Lock in water with an incredibly luxury glow.</p>
                            <button
                              onClick={() => setSkincareStep(3)}
                              className="px-3 py-1.5 bg-[#ffb3b8] hover:bg-[#ff808b] text-white rounded-full text-xs font-serif interactive-obj"
                            >
                              Smooth On Moisturizer 🍓
                            </button>
                          </div>
                        )}
                        {skincareStep === 3 && (
                          <div className="flex flex-col items-center text-center gap-3">
                            <span className="text-3xl">🌸🧖‍♀️✨</span>
                            <h4 className="text-xs font-serif font-bold text-[#5E3A3A]">All Done! Glow Radiant!</h4>
                            <p className="text-[11px] text-[#8A7171]">Your virtual face feels supple, soft, and smelling like lilies.</p>
                            <button
                              onClick={() => setSkincareStep(0)}
                              className="px-3 py-1.5 bg-[#ffebeb] hover:bg-[#ffd6d9] text-[#ff808b] rounded-full text-xs font-serif interactive-obj"
                            >
                              Do it again
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Perfume Interactions */}
                  {activeObj === 'perfume' && (
                    <div className="flex flex-col gap-4 text-center items-center">
                      <p className="text-xs text-[#7A6060] leading-relaxed">
                        A gorgeous Parisian vintage crystal bottle of perfume. Scent notes: lily, sweet rose, fresh strawberries, and warm vanilla.
                      </p>

                      <div className="relative w-24 h-32 flex items-center justify-center">
                        {/* Perfume Bottle */}
                        <div 
                          className="w-16 h-20 bg-[#FFF5F6] border-2 border-[#ffb3b8] rounded-2xl relative shadow-md flex items-center justify-center cursor-pointer interactive-obj hover:scale-105 transition-transform z-10" 
                          onClick={handlePerfumeClick}
                        >
                          <div className="absolute top-0 w-8 h-3 bg-yellow-400/60 border border-yellow-500/40 rounded-t-sm -translate-y-full" />
                          <span className="font-serif font-bold text-[#ff808b] text-xs">mysl.</span>
                          <div className="absolute -top-6 text-xl animate-bounce">🎀</div>
                        </div>

                        {/* Local animated mist/sparkle spray particles */}
                        <AnimatePresence>
                          {perfumeSprays.map((spray) => (
                            <motion.div
                              key={spray.id}
                              initial={{ opacity: 1, scale: 0.3, x: 0, y: -20 }}
                              animate={{ 
                                opacity: [0, 1, 0], 
                                scale: [0.3, 1.4, 0.6], 
                                x: spray.x, 
                                y: spray.y - 15 
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 1.0, ease: 'easeOut' }}
                              className="absolute text-pink-300 pointer-events-none select-none z-30 text-lg"
                            >
                              ✨💨
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      <button
                        onClick={handlePerfumeClick}
                        className="px-4 py-2 bg-[#ffb3b8] hover:bg-[#ff808b] text-white font-serif text-xs tracking-wider rounded-full transition-all border border-pink-100 cursor-pointer interactive-obj shadow-sm hover:shadow"
                      >
                        Squeeze atomiser 💨
                      </button>
                      <p className="text-[10px] text-[#8A7171] italic">Squeezing releases a flurry of soft pink petals across your screen!</p>
                    </div>
                  )}

                  {/* Candle Interactions */}
                  {activeObj === 'candle' && (
                    <div className="flex flex-col gap-4 text-center items-center">
                      <p className="text-xs text-[#7A6060] leading-relaxed">
                        A beautiful handmade pink soy candle. It releases a soothing sweet aroma.
                      </p>

                      <div className="flex flex-col items-center">
                        <div className="relative">
                          {isCandleLit ? (
                            <motion.div
                              animate={{ scale: [1, 1.15, 1], y: [0, -1, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                              className="w-5 h-7 bg-amber-400 rounded-full blur-[2px] absolute -top-8 left-1/2 -translate-x-1/2"
                            />
                          ) : null}
                          <div className="w-10 h-12 bg-pink-100 border border-pink-200 rounded-md" />
                        </div>
                      </div>

                      <button
                        onClick={() => setIsCandleLit(!isCandleLit)}
                        className={`px-4 py-2 font-serif text-xs tracking-wider rounded-full transition-all cursor-pointer interactive-obj ${
                          isCandleLit ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-pink-100 text-pink-700 border-pink-200'
                        }`}
                      >
                        {isCandleLit ? 'Extinguish Candle 🕯️' : 'Light Candle ✨'}
                      </button>
                    </div>
                  )}

                  {/* Teddy Bears */}
                  {activeObj === 'teddy' && (
                    <div className="flex flex-col gap-4 text-center items-center">
                      <p className="text-xs text-[#7A6060] leading-relaxed">
                        My adorable snuggly bedroom toys! Meet Clover the bunny and Ribbon the teddy bear.
                      </p>

                      <div className="flex gap-6 justify-center">
                        <motion.div
                          onClick={() => playToySqueak('ribbon')}
                          whileHover={{ scale: 1.08, y: -4 }}
                          whileTap={{ y: -18, scale: 1.15, rotate: -8 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 12 }}
                          className="w-24 h-28 bg-[#FAF2E8] border border-stone-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-sm relative group interactive-obj select-none p-2"
                        >
                          {/* Beautiful CSS/HTML vector Teddy Bear face */}
                          <div className="w-16 h-16 relative flex items-center justify-center mb-1">
                            <svg className="w-16 h-16 overflow-visible" viewBox="0 0 36 36">
                              {/* Left Ear */}
                              <circle cx="10" cy="11.5" r="4.2" fill="#C5936B" stroke="#9A6B46" strokeWidth="0.8" />
                              <circle cx="10" cy="11.5" r="2.2" fill="#FFEFE2" />
                              {/* Right Ear */}
                              <circle cx="26" cy="11.5" r="4.2" fill="#C5936B" stroke="#9A6B46" strokeWidth="0.8" />
                              <circle cx="26" cy="11.5" r="2.2" fill="#FFEFE2" />
                              {/* Chubby Round Head */}
                              <ellipse cx="18" cy="18" rx="10" ry="9" fill="#C5936B" stroke="#9A6B46" strokeWidth="0.8" />
                              <path d="M 18 10 C 18 10, 18 18, 18 25.8" stroke="#875A38" strokeWidth="0.6" strokeDasharray="1.5,1.5" fill="none" />
                              {/* Snout Velvet Oval */}
                              <ellipse cx="18" cy="21.5" rx="3.5" ry="2.5" fill="#FFEFE2" stroke="#9A6B46" strokeWidth="0.5" />
                              <ellipse cx="18" cy="20.5" rx="1.5" ry="1.0" fill="#3D281D" />
                              {/* Embroidered mouth */}
                              <path d="M 17 22 Q 18 22.8, 18 22 Q 18 22.8, 19 22" stroke="#3D281D" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                              {/* Glass Safety Eyes (realistic catchlights) */}
                              <circle cx="13" cy="16.5" r="1.4" fill="#1C1816" />
                              <circle cx="12.6" cy="16.1" r="0.5" fill="#FFFFFF" />
                              <circle cx="23" cy="16.5" r="1.4" fill="#1C1816" />
                              <circle cx="23.3" cy="16.1" r="0.5" fill="#FFFFFF" />
                              {/* Cheek blush */}
                              <circle cx="10.5" cy="19.5" r="1.5" fill="#FFAAA6" opacity="0.6" className="blur-[0.5px]" />
                              <circle cx="25.5" cy="19.5" r="1.5" fill="#FFAAA6" opacity="0.6" className="blur-[0.5px]" />
                              {/* Pretty Gingham Bow Collar */}
                              <g className="origin-center" transform="translate(18, 26.5)">
                                <path d="M 0 0 C -4 -4, -5.5 -1.5, -3 1 Z" fill="#FFA3A9" stroke="#E5727C" strokeWidth="0.4" />
                                <path d="M 0 0 C 4 -4, 5.5 -1.5, 3 1 Z" fill="#FFA3A9" stroke="#E5727C" strokeWidth="0.4" />
                                <circle cx="0" cy="0" r="1" fill="#FF808B" />
                              </g>
                            </svg>
                          </div>
                          <div className="text-[10px] text-stone-500 font-serif font-medium mt-1">Ribbon</div>
                        </motion.div>
                        
                        <motion.div
                          onClick={() => playToySqueak('clover')}
                          whileHover={{ scale: 1.08, y: -4 }}
                          whileTap={{ y: -18, scale: 1.15, rotate: 8 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 12 }}
                          className="w-24 h-28 bg-white border border-pink-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-sm relative group interactive-obj select-none p-2"
                        >
                          {/* Beautiful CSS/HTML vector Bunny face */}
                          <div className="w-16 h-16 relative flex items-center justify-center mb-1">
                            <svg className="w-16 h-16 overflow-visible" viewBox="0 0 36 36">
                              {/* Left Ear */}
                              <path d="M 12 12 C 9 -1, 15 -2, 16 12 Z" fill="#FBF9F6" stroke="#E6DFD5" strokeWidth="0.8" />
                              <path d="M 13 11 C 11 2, 14 1, 15 11 Z" fill="#FFE2E6" opacity="0.9" />
                              {/* Right Ear */}
                              <path d="M 24 12 C 27 -1, 21 -2, 20 12 Z" fill="#FBF9F6" stroke="#E6DFD5" strokeWidth="0.8" />
                              <path d="M 23 11 C 25 2, 22 1, 21 11 Z" fill="#FFE2E6" opacity="0.9" />
                              {/* Round Fluffy Head */}
                              <ellipse cx="18" cy="18" rx="10.5" ry="9" fill="#FFFDFB" stroke="#E6DFD5" strokeWidth="0.8" />
                              {/* Center vertical head seam stitch */}
                              <path d="M 18 10 C 18 10, 18 18, 18 26.2" stroke="#D1C2B1" strokeWidth="0.6" strokeDasharray="1.5,1.5" fill="none" />
                              {/* Fluffy Cheeks pink glow */}
                              <circle cx="12" cy="20.5" r="2" fill="#FFAAA6" opacity="0.6" className="blur-[0.5px]" />
                              <circle cx="24" cy="20.5" r="2" fill="#FFAAA6" opacity="0.6" className="blur-[0.5px]" />
                              {/* Glass Safety Eyes (realistic double reflection highlights) */}
                              <circle cx="12.5" cy="17" r="1.5" fill="#1C1816" />
                              <circle cx="12.1" cy="16.6" r="0.5" fill="#FFFFFF" />
                              <circle cx="23.5" cy="17" r="1.5" fill="#1C1816" />
                              <circle cx="23.1" cy="16.6" r="0.5" fill="#FFFFFF" />
                              {/* Snout felt pad */}
                              <ellipse cx="18" cy="20.8" rx="2.5" ry="1.8" fill="#FFF6F8" />
                              {/* Pink heart nose */}
                              <path d="M 17.5 19.8 Q 18 19.3, 18.5 19.8 L 18 20.6 Z" fill="#FF808B" />
                              {/* Mouth embroidery */}
                              <path d="M 16.8 21.3 Q 18 22.3, 18 21.3 Q 18 22.3, 19.2 21.3" stroke="#5E4E49" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                              {/* Premium Satin Bow Tie with hanging tails */}
                              <g className="origin-center" transform="translate(18, 26.5)">
                                <path d="M 0 0 C -4 -4, -5.5 -1.5, -3 1 Z" fill="#FF808B" stroke="#E5727C" strokeWidth="0.4" />
                                <path d="M 0 0 C 4 -4, 5.5 -1.5, 3 1 Z" fill="#FF808B" stroke="#E5727C" strokeWidth="0.4" />
                                <circle cx="0" cy="0" r="1" fill="#FFA3A9" />
                              </g>
                            </svg>
                          </div>
                          <div className="text-[10px] text-pink-400 font-serif font-medium mt-1">Clover</div>
                        </motion.div>
                      </div>

                      <p className="text-[10px] text-[#8A7171] italic leading-relaxed">
                        Tap Clover or Ribbon to make them bounce and squeak with joy! 🔈✨
                      </p>
                    </div>
                  )}

                  {/* Flowers */}
                  {activeObj === 'flowers' && (
                    <div className="flex flex-col gap-4 text-center items-center">
                      <p className="text-xs text-[#7A6060] leading-relaxed">
                        A gorgeous crystal vase of white lilies. They always fill my bedroom with sweet scent and serene energy.
                      </p>

                      <motion.div
                        animate={{ rotate: [-1, 1, -1] }}
                        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                        className="w-32 h-44 relative flex flex-col items-center justify-end overflow-visible my-1"
                      >
                        {/* Beautiful flower stems & blossoms extending up */}
                        <div className="absolute top-0 inset-x-0 h-28 overflow-visible flex justify-center z-0">
                          <svg className="w-40 h-32 overflow-visible" viewBox="0 0 160 128">
                            {/* Stems */}
                            <path d="M 80 120 Q 50 60, 30 30" stroke="#4F6D54" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            <path d="M 80 120 Q 80 50, 80 15" stroke="#4F6D54" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            <path d="M 80 120 Q 110 60, 130 35" stroke="#4F6D54" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            
                            {/* Detailed leaves along stems */}
                            <path d="M 60 85 C 45 80, 40 70, 52 75" stroke="#4F6D54" strokeWidth="2" fill="#608066" />
                            <path d="M 100 85 C 115 80, 120 70, 108 75" stroke="#4F6D54" strokeWidth="2" fill="#608066" />
                            <path d="M 70 55 C 55 50, 50 40, 62 45" stroke="#4F6D54" strokeWidth="2" fill="#608066" />
                            <path d="M 90 55 C 105 50, 110 40, 98 45" stroke="#4F6D54" strokeWidth="2" fill="#608066" />

                            {/* White Lily 1 (Left) */}
                            <g transform="translate(30, 30)">
                              <path d="M 0 0 C -15 -15, -20 -5, -8 4 C 4 13, 10 5, 0 0" fill="#FFFFF8" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 C 15 -15, 20 -5, 8 4 C -4 13, -10 5, 0 0" fill="#FFFFF8" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 C -18 5, -12 18, -2 10 C 8 2, 10 -4, 0 0" fill="#FFFFF8" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 C 18 5, 12 18, 2 10 C -8 2, -10 -4, 0 0" fill="#FFFFF8" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 C -5 -20, 5 -20, 0 0" fill="#FFFFF8" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 L -4 -6 M 0 0 L 0 -8 M 0 0 L 4 -6" stroke="#D4AF37" strokeWidth="1" />
                              <circle cx="-4" cy="-6" r="1" fill="#D4AF37" />
                              <circle cx="0" cy="-8" r="1" fill="#D4AF37" />
                              <circle cx="4" cy="-6" r="1" fill="#D4AF37" />
                            </g>

                            {/* White Lily 2 (Center High) */}
                            <g transform="translate(80, 15)">
                              <path d="M 0 0 C -15 -15, -20 -5, -8 4 C 4 13, 10 5, 0 0" fill="#FFFFFF" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 C 15 -15, 20 -5, 8 4 C -4 13, -10 5, 0 0" fill="#FFFFFF" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 C -18 5, -12 18, -2 10 C 8 2, 10 -4, 0 0" fill="#FFFFFF" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 C 18 5, 12 18, 2 10 C -8 2, -10 -4, 0 0" fill="#FFFFFF" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 C -5 -20, 5 -20, 0 0" fill="#FFFFFF" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 L -5 -7 M 0 0 L 0 -9 M 0 0 L 5 -7" stroke="#D4AF37" strokeWidth="1" />
                              <circle cx="-5" cy="-7" r="1" fill="#D4AF37" />
                              <circle cx="0" cy="-9" r="1" fill="#D4AF37" />
                              <circle cx="5" cy="-7" r="1" fill="#D4AF37" />
                            </g>

                            {/* White Lily 3 (Right) */}
                            <g transform="translate(130, 35)">
                              <path d="M 0 0 C -15 -15, -20 -5, -8 4 C 4 13, 10 5, 0 0" fill="#FFFFF8" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 C 15 -15, 20 -5, 8 4 C -4 13, -10 5, 0 0" fill="#FFFFF8" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 C -18 5, -12 18, -2 10 C 8 2, 10 -4, 0 0" fill="#FFFFF8" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 C 18 5, 12 18, 2 10 C -8 2, -10 -4, 0 0" fill="#FFFFF8" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 C -5 -20, 5 -20, 0 0" fill="#FFFFF8" stroke="#E3CEBA" strokeWidth="1" />
                              <path d="M 0 0 L -4 -6 M 0 0 L 0 -8 M 0 0 L 4 -6" stroke="#D4AF37" strokeWidth="1" />
                              <circle cx="-4" cy="-6" r="1" fill="#D4AF37" />
                              <circle cx="0" cy="-8" r="1" fill="#D4AF37" />
                              <circle cx="4" cy="-6" r="1" fill="#D4AF37" />
                            </g>
                          </svg>
                        </div>

                        {/* Ceramic Glazed Pot Base */}
                        <div className="w-16 h-18 bg-gradient-to-br from-[#FAF5EF] via-[#FFFFFF] to-[#E5DEC9] border-2 border-[#D5C6BA] rounded-b-2xl rounded-t-lg shadow-md relative overflow-hidden flex flex-col justify-between items-center p-1 z-10">
                          {/* Gold Trim band */}
                          <div className="w-full h-1 bg-amber-400/80" />
                          <span className="text-[6px] font-serif font-bold text-stone-400 tracking-widest uppercase">LILIUM</span>
                          {/* Foot stand */}
                          <div className="w-10 h-1 bg-[#D5C6BA]" />
                        </div>
                      </motion.div>

                      <p className="font-garamond italic text-sm text-[#8A7171] max-w-xs leading-relaxed">
                        “The earth laughs in flowers.”
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-center text-[10px] text-[#8A7171] font-serif border-t border-pink-100/40 pt-4 mt-6">
                  ✨ mysl's secret sanctuary room ✨
                </div>
              </motion.div>
            ) : (
              <div className="glass-panel p-6 rounded-3xl border border-[#ffb3b8]/20 h-full flex flex-col justify-center items-center text-center text-[#8A7171]">
                <Flower2 className="w-8 h-8 text-[#ffb3b8] animate-sway mb-3" />
                <h3 className="font-serif text-lg font-medium text-[#5E3A3A] mb-1">
                  Cozy Corner
                </h3>
                <p className="text-xs max-w-xs leading-relaxed">
                  Hover or tap any pin in my room diagram to customize furniture, draw sketches, lit soy candles, dispense perfume scent waves, or get secret motivators.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
