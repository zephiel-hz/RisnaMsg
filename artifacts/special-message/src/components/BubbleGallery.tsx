import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Bubble {
  id: number;
  image: string;
  word: string;
  x: number; // percent from left
  y: number; // percent from top
  size: number; // px diameter
  floatDelay: number;
  floatDuration: number;
  enterDelay: number;
}

const bubbleData: Bubble[] = [
  { id: 1,  image: 'https://picsum.photos/seed/b1/200/200',  word: 'kamu cantik ✨',         x: 10, y: 12, size: 110, floatDelay: 0,    floatDuration: 3.8, enterDelay: 0.05 },
  { id: 2,  image: 'https://picsum.photos/seed/b2/200/200',  word: 'selalu ada untukmu 💕',  x: 35, y: 6,  size: 95,  floatDelay: 0.4,  floatDuration: 4.2, enterDelay: 0.15 },
  { id: 3,  image: 'https://picsum.photos/seed/b3/200/200',  word: 'kamu spesial 🌸',         x: 62, y: 10, size: 120, floatDelay: 0.8,  floatDuration: 3.5, enterDelay: 0.1  },
  { id: 4,  image: 'https://picsum.photos/seed/b4/200/200',  word: 'terima kasih 🙏',         x: 82, y: 18, size: 90,  floatDelay: 1.1,  floatDuration: 4.6, enterDelay: 0.2  },
  { id: 5,  image: 'https://picsum.photos/seed/b5/200/200',  word: 'kamu luar biasa 🌟',      x: 6,  y: 42, size: 100, floatDelay: 0.6,  floatDuration: 4.0, enterDelay: 0.25 },
  { id: 6,  image: 'https://picsum.photos/seed/b6/200/200',  word: 'selalu kusayang ♡',       x: 28, y: 50, size: 115, floatDelay: 1.4,  floatDuration: 3.7, enterDelay: 0.3  },
  { id: 7,  image: 'https://picsum.photos/seed/b7/200/200',  word: 'kamu berharga 💎',        x: 55, y: 44, size: 95,  floatDelay: 0.2,  floatDuration: 4.3, enterDelay: 0.18 },
  { id: 8,  image: 'https://picsum.photos/seed/b8/200/200',  word: 'jangan pernah berubah 🌼', x: 78, y: 50, size: 105, floatDelay: 0.9,  floatDuration: 3.9, enterDelay: 0.35 },
  { id: 9,  image: 'https://picsum.photos/seed/b9/200/200',  word: 'kehadiranmu berarti 🌷',  x: 18, y: 75, size: 90,  floatDelay: 1.6,  floatDuration: 4.5, enterDelay: 0.4  },
  { id: 10, image: 'https://picsum.photos/seed/b10/200/200', word: 'aku bersyukur 🍀',        x: 45, y: 72, size: 120, floatDelay: 0.5,  floatDuration: 3.6, enterDelay: 0.22 },
];

interface BubbleGalleryProps {
  onClose: () => void;
}

export default function BubbleGallery({ onClose }: BubbleGalleryProps) {
  const [popped, setPopped] = useState<Set<number>>(new Set());

  const pop = (id: number) => {
    setPopped((prev) => {
      const next = new Set(prev);
      next.add(id);
      // If all popped, close after a short delay
      if (next.size === bubbleData.length) {
        setTimeout(onClose, 800);
      }
      return next;
    });
  };

  const remaining = bubbleData.length - popped.size;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(255,240,245,0.82)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        overflow: 'hidden',
      }}
      onClick={(e) => {
        // Close if clicking the backdrop itself
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: '#FFB7C5',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Poppins', sans-serif",
          fontSize: 16,
          color: '#fff',
          boxShadow: '0 2px 8px rgba(255,100,130,0.3)',
          zIndex: 101,
        }}
      >
        ×
      </motion.button>

      {/* Counter */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          position: 'absolute',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Caveat', cursive",
          fontSize: 18,
          color: '#C97D7D',
          zIndex: 101,
          pointerEvents: 'none',
        }}
      >
        {remaining > 0
          ? `${remaining} kenangan tersisa... ketuk untuk membuka ✨`
          : 'semua kenangan telah terbuka 🌸'}
      </motion.div>

      {/* Bubbles */}
      <AnimatePresence>
        {bubbleData.map((bubble) =>
          popped.has(bubble.id) ? null : (
            <FloatingBubble
              key={bubble.id}
              bubble={bubble}
              onPop={() => pop(bubble.id)}
            />
          )
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FloatingBubble({ bubble, onPop }: { bubble: Bubble; onPop: () => void }) {
  const [isPopping, setIsPopping] = useState(false);

  const handleClick = () => {
    if (isPopping) return;
    setIsPopping(true);
    // Spawn pop particles
    spawnPopParticles(bubble.x, bubble.y);
    setTimeout(onPop, 280);
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={
        isPopping
          ? { scale: 1.4, opacity: 0 }
          : {
              scale: 1,
              opacity: 1,
              y: [0, -10, 0],
            }
      }
      exit={{ scale: 1.4, opacity: 0 }}
      transition={
        isPopping
          ? { duration: 0.28, ease: 'easeOut' }
          : {
              scale: { duration: 0.5, delay: bubble.enterDelay, ease: [0.175, 0.885, 0.32, 1.275] },
              opacity: { duration: 0.4, delay: bubble.enterDelay },
              y: {
                duration: bubble.floatDuration,
                delay: bubble.floatDelay,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }
      }
      onClick={handleClick}
      style={{
        position: 'absolute',
        left: `${bubble.x}%`,
        top: `${bubble.y}%`,
        width: bubble.size,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        userSelect: 'none',
      }}
    >
      {/* Sweet word tag above */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: bubble.enterDelay + 0.2 }}
        style={{
          background: '#fff',
          borderRadius: 20,
          padding: '3px 10px',
          fontFamily: "'Caveat', cursive",
          fontSize: 13,
          color: '#C97D7D',
          boxShadow: '0 2px 8px rgba(201,125,125,0.2)',
          whiteSpace: 'nowrap',
          border: '1px solid rgba(255,183,197,0.4)',
        }}
      >
        {bubble.word}
      </motion.div>

      {/* Circular photo bubble */}
      <div
        style={{
          width: bubble.size,
          height: bubble.size,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '4px solid #fff',
          boxShadow: '0 6px 24px rgba(201,125,125,0.22), 0 1px 4px rgba(0,0,0,0.08)',
          background: '#f5e6ea',
          position: 'relative',
        }}
      >
        <img
          src={bubble.image}
          alt={bubble.word}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Subtle highlight gloss */}
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: 8,
            width: '40%',
            height: '30%',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            filter: 'blur(4px)',
            transform: 'rotate(-20deg)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </motion.div>
  );
}

function spawnPopParticles(xPct: number, yPct: number) {
  const originX = (xPct / 100) * window.innerWidth;
  const originY = (yPct / 100) * window.innerHeight;
  const symbols = ['♥', '✦', '✿', '·', '°'];
  const colors = ['#FFB7C5', '#FADA5E', '#FFD1DC', '#B0E0E6', '#E8D5F5'];

  for (let i = 0; i < 10; i++) {
    const el = document.createElement('div');
    el.textContent = symbols[i % symbols.length];
    Object.assign(el.style, {
      position: 'fixed',
      top: `${originY}px`,
      left: `${originX}px`,
      fontSize: `${10 + Math.random() * 8}px`,
      color: colors[i % colors.length],
      pointerEvents: 'none',
      zIndex: '9999',
      transform: 'translate(-50%,-50%)',
      transition: 'none',
    });
    document.body.appendChild(el);

    const angle = (i / 10) * 2 * Math.PI + Math.random() * 0.4;
    const dist = 40 + Math.random() * 50;
    setTimeout(() => {
      el.style.transition = 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
      el.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px))`;
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 700);
    }, 10);
  }
}
