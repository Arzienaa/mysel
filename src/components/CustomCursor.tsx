import React, { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  opacity: number;
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Only emit particles occasionally to avoid performance issues
      if (Math.random() < 0.25) {
        const colors = ['#ffd6d9', '#ffb3b8', '#fff5f6', '#fffbeb', '#e5ece5'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const newParticle: Particle = {
          id: particleIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 8 + 4,
          color: randomColor,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2 - 1, // slight upwards float
          opacity: 1,
        };

        setParticles((prev) => [...prev.slice(-30), newParticle]);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive-obj')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseClick = (e: MouseEvent) => {
      // Emit burst of sparkles on click
      const colors = ['#ffb3b8', '#ffd6d9', '#ffffff', '#e5ece5', '#fffbeb'];
      const burst: Particle[] = Array.from({ length: 8 }).map(() => ({
        id: particleIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 5,
        speedY: (Math.random() - 0.5) * 5,
        opacity: 1,
      }));
      setParticles((prev) => [...prev.slice(-30), ...burst]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('click', handleMouseClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('click', handleMouseClick);
    };
  }, []);

  // Update particles animation frame
  useEffect(() => {
    let animationFrameId: number;
    
    const updateParticles = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            opacity: p.opacity - 0.02,
          }))
          .filter((p) => p.opacity > 0)
      );
      animationFrameId = requestAnimationFrame(updateParticles);
    };

    animationFrameId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <>
      {/* Tiny Ribbon Sparkle Custom Cursor (hidden on touch devices) */}
      <div
        className="hidden md:block fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
        }}
      >
        {/* Visual elements representing coquette bow/ribbon or sparkle */}
        <div className="relative">
          {/* Sparkle center */}
          <div className="w-4 h-4 bg-[#ffb3b8]/90 rounded-full blur-[2px] flex items-center justify-center animate-pulse">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          {/* Tiny Ribbon Bow Wings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
            <div className="w-2 h-1.5 bg-[#ffd6d9] rounded-l-full rotate-[15deg] transform origin-right" />
            <div className="w-2 h-1.5 bg-[#ffd6d9] rounded-r-full -rotate-[15deg] transform origin-left" />
          </div>
        </div>
      </div>

      {/* Sparkle trail elements */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-[9998] flex items-center justify-center font-serif"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Sparkle character (star icon or dot) */}
          <span 
            style={{ 
              color: p.color, 
              fontSize: `${p.size}px`,
              textShadow: `0 0 4px ${p.color}`
            }}
          >
            ✦
          </span>
        </div>
      ))}
    </>
  );
}
