import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PolaroidCard, { PolaroidData } from './PolaroidCard';

const CARD_HEIGHT_DESKTOP = 14 + (280 - 28) + 64; // 330px
const CARD_HEIGHT_MOBILE  = 14 + (240 - 28) + 64; // 262px

const polaroids: PolaroidData[] = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/abc1/400/400',
    caption: 'Pertama kali kita ke sini! 🌸',
    message: 'Hari itu terasa hangat banget.\nAku nggak mau melupakannya sama sekali. Terima kasih sudah ada di sana.',
    rotation: -5,
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/abc2/400/400',
    caption: 'Senyum paling manis sedunia ✨',
    message: 'Senyummu itu... entah kenapa selalu bisa bikin hari terasa lebih baik. Jangan pernah berhenti senyum ya.',
    rotation: 4,
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/abc3/400/400',
    caption: 'Untuk Risna tersayang...',
    message: 'Ada satu hal yang selalu ingin aku bilang: kamu berarti banget. Lebih dari yang kamu tahu. 💕',
    rotation: -2,
  },
];

interface PolaroidStageProps {
  onComplete: () => void;
}

export default function PolaroidStage({ onComplete }: PolaroidStageProps) {
  const [cards, setCards] = useState<PolaroidData[]>(polaroids);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const cardHeight = isMobile ? CARD_HEIGHT_MOBILE : CARD_HEIGHT_DESKTOP;

  // Floating petals
  const petals = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: 5 + (i * 9) % 90,
    delay: (i * 0.7) % 5,
    duration: 8 + (i * 1.3) % 6,
  }));

  const removeCard = (id: number) => {
    // Burst particles from card center
    const origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    for (let i = 0; i < 8; i++) {
      const el = document.createElement('div');
      el.textContent = i % 2 === 0 ? '♥' : '✦';
      Object.assign(el.style, {
        position: 'fixed',
        top: `${origin.y}px`,
        left: `${origin.x}px`,
        fontSize: '16px',
        color: i % 3 === 0 ? '#FFD1DC' : '#B0E0E6',
        pointerEvents: 'none',
        zIndex: '9999',
        transform: 'translate(-50%,-50%)',
      });
      document.body.appendChild(el);
      const angle = (i / 8) * 2 * Math.PI;
      const dist = 80 + Math.random() * 60;
      setTimeout(() => {
        el.style.transition = 'all 0.7s cubic-bezier(0.25,0.46,0.45,0.94)';
        el.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px))`;
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 800);
      }, 20);
    }

    setCards((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (next.length === 0) setTimeout(onComplete, 500);
      return next;
    });
  };

  const remaining = cards.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 relative"
    >
      {/* Floating petals */}
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ y: '-20vh', opacity: [0, 0.45, 0.45, 0], rotate: [0, 180, 360] }}
          transition={{ duration: petal.duration, delay: petal.delay, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: `${petal.x}%`,
            bottom: 0,
            width: 8,
            height: 14,
            borderRadius: '50%',
            background: petal.id % 2 === 0 ? '#FFD1DC' : '#B0E0E6',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 26,
          color: '#70665b',
          marginBottom: 10,
        }}
      >
        Kenangan Kita 📸
      </motion.div>

      {/* Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 18,
          color: '#9a8d82',
          marginBottom: 14,
        }}
      >
        {remaining} / {polaroids.length}
      </motion.div>

      {/* ── Stack container ──
          Height is fixed to the card height + some room for the washi tape overflow.
          Cards are absolutely positioned at top:50% left:50% inside this box,
          so the centering wrapper in PolaroidCard always works correctly. */}
      <div
        style={{
          position: 'relative',
          width: isMobile ? 240 : 280,
          height: cardHeight + 20, // +20 for washi tape overflow
          marginBottom: 20,
        }}
      >
        <AnimatePresence>
          {cards.map((card, index) => (
            <PolaroidCard
              key={card.id}
              card={card}
              isTop={index === cards.length - 1}
              onRemove={() => removeCard(card.id)}
              zIndex={index + 1}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {polaroids.map((_, i) => {
          const active = i < remaining;
          return (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              style={{
                width: active ? 10 : 8,
                height: active ? 10 : 8,
                borderRadius: '50%',
                background: active ? '#FFD1DC' : '#d4c4b8',
                opacity: active ? 1 : 0.45,
                transition: 'all 0.3s',
              }}
            />
          );
        })}
      </div>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 12,
          color: '#9a8d82',
          textAlign: 'center',
          margin: 0,
        }}
      >
        Ketuk untuk membalik · Geser untuk lanjut →
      </motion.p>
    </motion.div>
  );
}
