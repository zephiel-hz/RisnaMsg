import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PolaroidCard, { PolaroidData } from './PolaroidCard';
import polaroid1 from '../assets/polaroid1.jpeg';
import polaroid2 from '../assets/polaroid2.jpeg';
import polaroid3 from '../assets/polaroid3.jpeg';
import polaroid4 from '../assets/polaroid4.jpeg';
import polaroid5 from '../assets/polaroid5.jpeg';
import polaroid6 from '../assets/polaroid6.jpeg';
import polaroid7 from '../assets/polaroid7.jpeg';
import polaroid8 from '../assets/polaroid8.jpeg';
import polaroid9 from '../assets/polaroid9.jpeg';
import polaroid10 from '../assets/polaroid10.jpeg';

const CARD_HEIGHT_DESKTOP = 14 + (280 - 28) + 64;
const CARD_HEIGHT_MOBILE  = 14 + (240 - 28) + 64;

const polaroids: PolaroidData[] = [
  {
    id: 1,
    image: polaroid1,
    caption: 'Kamu selalu bikin aku semangat 🌸',
    message: 'Entah kenapa, kamu tuh selalu bisa bikin hari jadi lebih asik dan enggak ngebosenin.',
    rotation: -5,
  },
  {
    id: 2,
    image: polaroid2,
    caption: 'Senyummu tuh juara ✨',
    message: 'Kalo liat kamu senyum, rasanya semua hal jadi lebih ringan.',
    rotation: 4,
  },
  {
    id: 3,
    image: polaroid3,
    caption: 'Sikapmu tuh bikin nyaman',
    message: 'Kamu itu hangat, ramah, dan bener-bener bikin aku ngerasa selalu ditemenin.',
    rotation: -3,
  },
  {
    id: 4,
    image: polaroid4,
    caption: 'Gayamu keren banget 😄',
    message: 'Cara kamu tampil dan bertindak, itu serius banget bikin aku impressed.',
    rotation: 6,
  },
  {
    id: 5,
    image: polaroid5,
    caption: 'Kamu itu care banget',
    message: 'Aku suka banget sama perhatian yang kamu kasih ke aku, itu bikin aku ngerasa dihargai.',
    rotation: -2,
  },
  {
    id: 6,
    image: polaroid6,
    caption: 'Kuat tapi tetap lembut',
    message: 'Dua hal ini jarang banget bisa nyatu, tapi ternyata kedua hal itu ada di kamu.',
    rotation: 5,
  },
  {
    id: 7,
    image: polaroid7,
    caption: 'Kamu bikin suasana cerah 🌙',
    message: 'Kalau ada kamu, suasana langsung berasa lebih baik.',
    rotation: -6,
  },
  {
    id: 8,
    image: polaroid8,
    caption: 'Kamu itu luar biasa, serius deh',
    message: 'Jujur dan simpel, kamu itu bikin segalanya terasa nyata.',
    rotation: 3,
  },
  {
    id: 9,
    image: polaroid9,
    caption: 'Kamu udah cukup banget 💕',
    message: 'Nggak usah repot-repot berubah, kamu udah oke apa adanya.',
    rotation: -4,
  },
  {
    id: 10,
    image: polaroid10,
    caption: 'Nah, ini buat kamu 🌷',
    message: 'Makasih ya, Sayang. Udah selalu ngerawat bunga yang aku kasih.',
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
        Untuk Sayangku, Risna 💝
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
