import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PolaroidCard from './PolaroidCard';

const polaroids = [
  { id: 1, image: "https://picsum.photos/seed/abc1/400/400", caption: "Pertama kali kita ke sini! 🌸", rotation: -5 },
  { id: 2, image: "https://picsum.photos/seed/abc2/400/400", caption: "Senyum paling manis sedunia ✨", rotation: 4 },
  { id: 3, image: "https://picsum.photos/seed/abc3/400/400", caption: "Untuk Risna tersayang...", rotation: -2 },
];

interface PolaroidStageProps {
  onComplete: () => void;
}

export default function PolaroidStage({ onComplete }: PolaroidStageProps) {
  const [cards, setCards] = useState(polaroids);
  const [isPeeking, setIsPeeking] = useState(false);

  const removeCard = (id: number) => {
    // Burst particles
    const particles = Array.from({ length: 8 }, (_, i) => ({
      id: `burst-${id}-${i}`,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      delay: Math.random() * 0.1,
    }));

    // Show burst effect (using state would be cleaner but keeping it simple)
    particles.forEach(particle => {
      const el = document.createElement('div');
      el.style.position = 'fixed';
      el.style.top = '50%';
      el.style.left = '50%';
      el.style.fontSize = '16px';
      el.style.color = '#FFD1DC';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '9999';
      el.textContent = Math.random() > 0.5 ? '♥' : '✦';
      document.body.appendChild(el);

      setTimeout(() => {
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 800);
      }, particle.delay * 100);
    });

    setCards(prev => {
      const newCards = prev.filter(card => card.id !== id);
      if (newCards.length === 0) {
        setTimeout(onComplete, 600);
      }
      return newCards;
    });
  };

  // Floating petals specific to this stage
  const petals = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 6,
  }));

  const currentCardNumber = cards.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 relative"
    >
      {/* Floating petals */}
      {petals.map(petal => (
        <motion.div
          key={petal.id}
          initial={{ y: '100vh', opacity: 0, x: `${petal.x}vw` }}
          animate={{ 
            y: '-20vh',
            opacity: [0, 0.4, 0.4, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute rounded-full"
          style={{
            width: '8px',
            height: '14px',
            background: petal.id % 2 === 0 ? '#FFD1DC' : '#B0E0E6',
            bottom: 0,
            left: 0,
          }}
        />
      ))}

      {/* Decorative header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-caveat text-2xl md:text-3xl mb-8"
        style={{ color: '#70665b' }}
      >
        Kenangan Kita 📸
      </motion.div>

      {/* Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-caveat text-lg mb-4"
        style={{ color: '#9a8d82' }}
      >
        {currentCardNumber} / 3
      </motion.div>

      {/* Polaroid stack */}
      <div className="relative w-full max-w-sm h-96 mb-6">
        <AnimatePresence>
          {cards.map((card, index) => (
            <PolaroidCard
              key={card.id}
              card={card}
              isTop={index === cards.length - 1}
              onRemove={() => removeCard(card.id)}
              onPeek={() => setIsPeeking(true)}
              zIndex={index}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((num) => (
          <motion.div
            key={num}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + num * 0.1 }}
            className="rounded-full transition-all duration-300"
            style={{
              width: currentCardNumber >= num ? '10px' : '8px',
              height: currentCardNumber >= num ? '10px' : '8px',
              background: currentCardNumber >= num ? '#FFD1DC' : '#d4c4b8',
              opacity: currentCardNumber >= num ? 1 : 0.4,
            }}
          />
        ))}
      </div>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-sm"
        style={{ color: '#9a8d82' }}
      >
        Ketuk atau geser untuk melihat selanjutnya →
      </motion.p>
    </motion.div>
  );
}
