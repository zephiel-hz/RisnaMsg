import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface SpawnedBubble {
  id: number;
  word: string;
  x: number; // percent from left
  size: number; // px
  duration: number; // seconds to travel
}

const wordsPool: string[] = [
  'kamu cantik ✨',
  'selalu ada untukmu 💕',
  'kamu spesial 🌸',
  'terima kasih sayang 🥰',
  'kamu luar biasa 🌟',
  'selalu kusayang ❤️',
  'kamu berharga 💎',
  'jangan pernah berubah 🌼',
  'kehadiranmu berarti 🌷',
  'aku bersyukur punya kamu 🍀',
  'hatiku milikmu ❤️',
  'senyummu penyemangatku 😊',
  'rinduku tak pernah berhenti 🌙',
  'kamu membuat hariku indah ☀️',
  'aku sayang kamu sekarang & selamanya 💞',
  'suaramu obat terbaik 🤗',
  'kamu tujuan hidupku ✨',
  'bersamamu terasa lengkap 🌹',
  'kamu cahaya di gelapku 🕯️',
  'terima kasih sudah pilih aku 💐',
  'selalu dukung mimpi-mimpimu ✨',
  'kau membuatku tersenyum tiap hari 😊',
  'hangat suaramu menenangkan 😙',
  'aku percaya padamu selalu 🌟',
];

interface BubbleGalleryProps {
  onClose: () => void;
}

export default function BubbleGallery({ onClose }: BubbleGalleryProps) {
  const [active, setActive] = useState<SpawnedBubble[]>([]);
  const idRef = useRef(1);
  const spawnIntervalRef = useRef<number | null>(null);
  

  useEffect(() => {
    // initial burst to fill scene
    for (let i = 0; i < 8; i++) {
      const word = wordsPool[Math.floor(Math.random() * wordsPool.length)];
      const b: SpawnedBubble = {
        id: idRef.current++,
        word,
        x: 5 + Math.random() * 90,
        size: 60 + Math.random() * 100,
        duration: 10 + Math.random() * 10, // 10-20s
      };
      setActive((prev) => [...prev, b]);
    }

    // spawn bubbles continuously (more frequent)
    spawnIntervalRef.current = window.setInterval(() => {
      const word = wordsPool[Math.floor(Math.random() * wordsPool.length)];
      const b: SpawnedBubble = {
        id: idRef.current++,
        word,
        x: 5 + Math.random() * 90,
        size: 60 + Math.random() * 100,
        duration: 10 + Math.random() * 10, // 10-20s
      };
      setActive((prev) => {
        const next = [...prev, b];
        // limit max active bubbles to avoid DOM overload
        if (next.length > 120) next.shift();
        return next;
      });
    }, 400);

    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    };
  }, []);

  const remove = (id: number) => setActive((prev) => prev.filter((p) => p.id !== id));

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
        background: 'rgba(255,240,245,0.92)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        overflow: 'hidden',
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

      {/* counter removed per user request */}

      {/* Bubbles (spawned from bottom -> top) */}
      <AnimatePresence>
        {active.map((b) => (
          <FloatingBubble key={b.id} bubble={b} onComplete={() => remove(b.id)} />
        ))}
      </AnimatePresence>

      {/* Global music player moved to a shared module */}
    </motion.div>
  );
}

function FloatingBubble({ bubble, onComplete }: { bubble: SpawnedBubble; onComplete: () => void }) {
  const [isPopping, setIsPopping] = useState(false);
  const popRotationRef = useRef((Math.random() - 0.5) * 60);

  const handleClick = () => {
    if (isPopping) return;
    setIsPopping(true);
    spawnPopParticles(bubble.x, 95); // approximate y near bottom
    setTimeout(onComplete, 380);
  };

  // travel distance (px)
  const travel = typeof window !== 'undefined' ? window.innerHeight + 300 : 1000;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClick}
      style={{
        position: 'absolute',
        left: `${bubble.x}%`,
        bottom: -Math.max(20, bubble.size / 2),
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        userSelect: 'none',
        zIndex: 100,
        pointerEvents: 'auto',
      }}
    >
      {/* Floating group: bubble circle + tag */}
      <motion.div
        initial={{ translateY: 0, opacity: 0 }}
        animate={isPopping ? { scale: [1, 1.4, 0], opacity: 0, rotate: popRotationRef.current } : { translateY: -travel, opacity: 1 }}
        transition={isPopping ? { times: [0, 0.45, 1], duration: 0.38, ease: 'easeOut' } : { duration: bubble.duration, ease: 'linear' }}
        onAnimationComplete={() => {
          if (!isPopping) onComplete();
        }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
      >
        {/* Sweet word tag (no bubble circle) */}
        <motion.div
          initial={{ opacity: 0.9, y: 8 }}
          animate={isPopping ? { scale: 0.7, opacity: 0, rotate: popRotationRef.current } : { opacity: 1, y: 0 }}
          transition={isPopping ? { duration: 0.28, ease: 'easeOut' } : { delay: 0 }}
          style={{
            background: 'rgba(255,255,255,0.98)',
            borderRadius: 22,
            padding: '8px 14px',
            fontFamily: "'Caveat', cursive",
            fontSize: Math.max(13, bubble.size * 0.13),
            color: '#b04b56',
            boxShadow: '0 6px 18px rgba(176,75,86,0.14)',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(176,75,86,0.12)',
            transformOrigin: 'center',
          }}
        >
          {bubble.word}
        </motion.div>
      </motion.div>
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

function formatTime(t: number) {
  if (!t || isNaN(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
