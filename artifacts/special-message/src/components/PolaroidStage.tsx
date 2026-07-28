import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PolaroidCard, { PolaroidData } from './PolaroidCard';

const CARD_HEIGHT_DESKTOP = 14 + (280 - 28) + 64;
const CARD_HEIGHT_MOBILE  = 14 + (240 - 28) + 64;

const polaroids: PolaroidData[] = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/mem1/400/400',
    caption: 'Hari yang nggak akan kulupakan 🌸',
    message: 'Waktu itu cuacanya sempurna. Kamu juga sempurna.',
    rotation: -5,
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/mem2/400/400',
    caption: 'Senyum paling tulus ✨',
    message: 'Senyummu itu bisa bikin hari yang paling berat jadi ringan.',
    rotation: 4,
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/mem3/400/400',
    caption: 'Momen kecil yang berarti besar',
    message: 'Hal-hal kecil seperti ini yang selalu kuingat tentangmu.',
    rotation: -3,
  },
  {
    id: 4,
    image: 'https://picsum.photos/seed/mem4/400/400',
    caption: 'Tertawa sampai lupa waktu 😄',
    message: 'Tawa kita hari itu... nggak ada yang bisa menggantikannya.',
    rotation: 6,
  },
  {
    id: 5,
    image: 'https://picsum.photos/seed/mem5/400/400',
    caption: 'Sudut favorit kita 🌼',
    message: 'Tempat ini jadi spesial karena kamu ada di sana.',
    rotation: -2,
  },
  {
    id: 6,
    image: 'https://picsum.photos/seed/mem6/400/400',
    caption: 'Cahaya sore yang hangat',
    message: 'Foto ini bikin aku ingat betapa beruntungnya aku punya kamu.',
    rotation: 5,
  },
  {
    id: 7,
    image: 'https://picsum.photos/seed/mem7/400/400',
    caption: 'Kamu dan duniamu 🌙',
    message: 'Kamu selalu punya cara untuk membuat segalanya lebih indah.',
    rotation: -6,
  },
  {
    id: 8,
    image: 'https://picsum.photos/seed/mem8/400/400',
    caption: 'Ekspresi paling jujur',
    message: 'Di antara semua foto, ini yang paling kusuka — karena ini kamu yang sesungguhnya.',
    rotation: 3,
  },
  {
    id: 9,
    image: 'https://picsum.photos/seed/mem9/400/400',
    caption: 'Bersama, selalu cukup 💕',
    message: 'Nggak perlu ke mana-mana yang jauh — bersamamu saja sudah lebih dari cukup.',
    rotation: -4,
  },
  {
    id: 10,
    image: 'https://picsum.photos/seed/mem10/400/400',
    caption: 'Untuk Risna tersayang... 🌷',
    message: 'Ada satu hal yang selalu ingin aku bilang: kamu berarti banget. Lebih dari yang kamu tahu. 💕',
    rotation: 2,
  },
];

interface PolaroidStageProps {
  onComplete: () => void;
}

export default function PolaroidStage({ onComplete }: PolaroidStageProps) {
  const [cards, setCards] = useState<PolaroidData[]>(polaroids);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const cardHeight = isMobile ? CARD_HEIGHT_MOBILE : CARD_HEIGHT_DESKTOP;
  const total = polaroids.length;

  const petals = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: 5 + (i * 9) % 90,
    delay: (i * 0.7) % 5,
    duration: 8 + (i * 1.3) % 6,
  }));

  const removeCard = (id: number) => {
    const origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    for (let i = 0; i < 8; i++) {
      const el = document.createElement('div');
      el.textContent = i % 2 === 0 ? '♥' : '✦';
      Object.assign(el.style, {
        position: 'fixed',
        top: `${origin.y}px`,
        left: `${origin.x}px`,
        fontSize: '16px',
        color: i % 3 === 0 ? '#FFB7C5' : '#FADA5E',
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
            background: petal.id % 2 === 0 ? '#FFB7C5' : '#FADA5E',
            pointerEvents: 'none',
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ fontFamily: "'Caveat', cursive", fontSize: 26, color: '#70665b', marginBottom: 10 }}
      >
        Kenangan Kita 📸
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        style={{ fontFamily: "'Caveat', cursive", fontSize: 18, color: '#9a8d82', marginBottom: 14 }}
      >
        {remaining} / {total}
      </motion.div>

      <div
        style={{
          position: 'relative',
          width: isMobile ? 240 : 280,
          height: cardHeight + 20,
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

      {/* Dot indicators — small for 10 */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 14, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 200 }}>
        {Array.from({ length: total }, (_, i) => {
          const active = i < remaining;
          return (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.04 }}
              style={{
                width: active ? 8 : 6,
                height: active ? 8 : 6,
                borderRadius: '50%',
                background: active ? '#FFB7C5' : '#d4c4b8',
                opacity: active ? 1 : 0.4,
                transition: 'all 0.3s',
              }}
            />
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: '#9a8d82', textAlign: 'center', margin: 0 }}
      >
        Ketuk untuk membalik · Geser untuk lanjut →
      </motion.p>
    </motion.div>
  );
}
