import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Heart, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Song } from '../types';

interface MusicPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  hasInteracted: boolean;
}

// Playlist Starring Alaina Castillo as requested by user
const PLAYLIST: Song[] = [
  { 
    id: '1', 
    title: 'Pass You By', 
    artist: 'Alaina Castillo', 
    url: '/music/passyouby.mp3',
    source: 'pop', 
    type: 'song' 
  },
  { 
    id: '2', 
    title: 'Wish You Were Here', 
    artist: 'Alaina Castillo', 
    url: '/music/wishyou.mp3',
    source: 'pop', 
    type: 'song' 
  },
  { 
    id: '3', 
    title: 'Just a Boy', 
    artist: 'Alaina Castillo', 
    url: '/music/justaboy.mp3',
    source: 'pop', 
    type: 'song' 
  }
];

export default function MusicPlayer({ isPlaying, setIsPlaying, hasInteracted }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const currentTrack = PLAYLIST[currentTrackIndex];

  // Initialize and maintain a single audio element
  useEffect(() => {
    const audio = new Audio();
    audio.loop = false;
    audioRef.current = audio;

    // Audio Event Listeners
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Sync track URL change
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    
    // Smooth transition between track loadings
    const wasPlaying = isPlaying;
    audio.src = currentTrack.url;
    audio.load();
    
    if (wasPlaying && hasInteracted) {
      audio.play().catch((err) => console.log('Autoplay blocked or interruped:', err));
    } else {
      setCurrentTime(0);
    }
  }, [currentTrackIndex]);

  // Sync play/pause commands from app
  useEffect(() => {
    if (!audioRef.current || !hasInteracted) return;
    const audio = audioRef.current;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.log('Playback error:', err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, hasInteracted]);

  // Sync volume & mute state
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Click/Seek on progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current || duration === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    audioRef.current.currentTime = percentage * duration;
    setCurrentTime(percentage * duration);
  };

  // Format time (seconds -> mm:ss)
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Interactive Spotify visual cover
  const renderCoverArt = () => {
    return (
      <div className="w-14 h-14 rounded-xl border border-pink-200 bg-[#FFF5F6] flex items-center justify-center relative shadow-sm overflow-hidden select-none group/cover">
        {/* Real vinyl disk peeking out */}
        <motion.div
          animate={isPlaying ? { rotate: 360 } : {}}
          transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
          className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center absolute shadow-inner"
        >
          <div className="w-4 h-4 bg-pink-100 rounded-full border border-pink-200 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-stone-800 rounded-full" />
          </div>
        </motion.div>

        {/* Floating pink bows coquette decorative sticker */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/40 via-transparent to-pink-200/5 pointer-events-none" />
        
        {/* Heart/Music Overlay */}
        <div className="absolute inset-0 bg-pink-900/10 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity z-10">
          <Music className="w-4 h-4 text-white" />
        </div>
      </div>
    );
  };

  return (
    <div id="coquette-music-widget" className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end gap-2">
      {/* Spotify Premium Floating Widget card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="w-80 bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-xl flex flex-col gap-4 text-[#5E3A3A] border border-[#ffb3b8]/40 relative"
          >
            {/* Top decorative ribbon */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF808B] text-white text-[9px] px-3 py-0.5 rounded-full shadow-sm font-serif font-semibold tracking-wider flex items-center gap-1">
              <span>🎀</span> <span>Now Playing</span>
            </div>

            {/* Album details section */}
            <div className="flex items-center gap-3.5 mt-1">
              {renderCoverArt()}

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-1">
                  <span className="font-serif text-[13px] font-bold text-[#5E3A3A] truncate">
                    {currentTrack.title}
                  </span>
                  <a 
                    href="https://open.spotify.com/track/6idG4unPt6ROA9BSusQ9Me" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-pink-400 hover:text-pink-600 transition-colors pointer-events-auto"
                    title="Open on Spotify"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="font-sans text-xs text-[#8A7171] font-medium">
                  {currentTrack.artist}
                </p>
              </div>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-1 rounded-full transition-all active:scale-95 ${isLiked ? 'text-red-400 scale-110' : 'text-stone-300 hover:text-red-300'}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-400 text-red-400' : ''}`} />
              </button>
            </div>

            {/* Real-time Custom Spotify Progress Bar */}
            <div className="flex flex-col gap-1.5 px-0.5">
              <div 
                ref={progressRef}
                onClick={handleProgressClick}
                className="w-full h-1.5 bg-[#FFF0F2] rounded-full cursor-pointer relative overflow-visible group/bar"
              >
                {/* Active progress color bar */}
                <div 
                  className="h-full bg-gradient-to-r from-[#FF808B] to-[#FFA3A9] rounded-full relative"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                >
                  {/* Slider round knob */}
                  <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-3 h-3 bg-pink-500 rounded-full border border-white shadow-sm opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-[#8A7171]/80 px-0.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Interactive Music Controls bar */}
            <div className="flex items-center justify-between mt-0.5 bg-pink-50/20 p-2 rounded-2xl border border-pink-100/30">
              {/* Mute/Volume controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  className="p-1 text-pink-400 hover:text-pink-600 rounded-full transition-colors active:scale-90"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-14 accent-pink-400 h-1 bg-pink-100 rounded-lg cursor-pointer transition-all"
                />
              </div>

              {/* Playback action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-1 text-pink-400 hover:text-pink-600 hover:bg-pink-100/20 rounded-full transition-all active:scale-90"
                  title="Previous"
                >
                  <SkipBack className="w-4.5 h-4.5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-2.5 bg-[#FF808B] hover:bg-[#ff6673] text-white rounded-full shadow-md transition-all transform active:scale-95 border border-pink-200/50 flex items-center justify-center"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white text-white" /> : <Play className="w-4 h-4 fill-white text-white" />}
                </button>

                <button
                  onClick={handleNext}
                  className="p-1 text-pink-400 hover:text-pink-600 hover:bg-pink-100/20 rounded-full transition-all active:scale-90"
                  title="Next"
                >
                  <SkipForward className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Launcher Widget Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-12 h-12 rounded-full glass-panel-pink flex items-center justify-center shadow-lg text-[#ff808b] border border-[#ffb3b8]/60 cursor-pointer relative"
      >
        <Music className="w-5 h-5 animate-pulse" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-400"></span>
        </span>
      </motion.button>
    </div>
  );
}
