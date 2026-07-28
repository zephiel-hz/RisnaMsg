import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LetterStageProps {
  onReplay: () => void;
}

export default function LetterStage({ onReplay }: LetterStageProps) {
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [showLetter, setShowLetter] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; rotation: number; delay: number }>>([]);
  const [petals, setPetals] = useState<Array<{ id: number; x: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Envelope opens after 0.5s
    const envelopeTimer = setTimeout(() => {
      setShowEnvelope(false);
      
      // Generate confetti burst
      const confettiPieces = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 30,
        y: 50,
        size: 4 + Math.random() * 8,
        color: ['#FFD1DC', '#B0E0E6', '#E8D5F5', '#FFDAB9'][Math.floor(Math.random() * 4)],
        rotation: Math.random() * 360,
        delay: Math.random() * 0.2,
      }));
      setConfetti(confettiPieces);

      // Show letter after envelope fades
      setTimeout(() => setShowLetter(true), 300);

      // Generate ambient petals
      const petalPieces = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 10 + Math.random() * 8,
      }));
      setPetals(petalPieces);
    }, 500);

    return () => clearTimeout(envelopeTimer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[100dvh] w-full flex items-center justify-center px-4 py-12 relative"
    >
      {/* Confetti burst */}
      <AnimatePresence>
        {confetti.map(piece => (
          <motion.div
            key={piece.id}
            initial={{ 
              x: `${piece.x}vw`, 
              y: `${piece.y}vh`,
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              x: `${piece.x + (Math.random() - 0.5) * 60}vw`,
              y: `${piece.y + (Math.random() - 0.5) * 50}vh`,
              opacity: [0, 1, 1, 0],
              rotate: piece.rotation + 720,
            }}
            transition={{
              duration: 2.5,
              delay: piece.delay,
              ease: 'easeOut',
            }}
            className="absolute rounded-sm"
            style={{
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              background: piece.color,
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Ambient floating petals */}
      {petals.map(petal => (
        <motion.div
          key={petal.id}
          initial={{ y: '100vh', opacity: 0, x: `${petal.x}vw` }}
          animate={{ 
            y: '-20vh',
            opacity: [0, 0.5, 0.5, 0],
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
            width: '10px',
            height: '16px',
            background: petal.id % 2 === 0 ? '#FFD1DC' : '#B0E0E6',
            bottom: 0,
            left: 0,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Envelope animation */}
      <AnimatePresence>
        {showEnvelope && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute"
            style={{ zIndex: 10 }}
          >
            <div className="relative" style={{ width: '200px', height: '140px' }}>
              {/* Envelope body */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  background: '#F5E6D3',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                }}
              />
              
              {/* Envelope flap - animates upward */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -180 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute top-0 left-0 right-0 origin-top"
                style={{
                  borderLeft: '100px solid transparent',
                  borderRight: '100px solid transparent',
                  borderTop: '70px solid #E8D5C4',
                  transformStyle: 'preserve-3d',
                }}
              />
              
              {/* Envelope label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-dancing text-xl" style={{ color: '#8B7355' }}>
                  Untuk Kamu ✉
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter card */}
      <AnimatePresence>
        {showLetter && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-xl paper-texture rounded-2xl relative overflow-hidden"
            style={{
              boxShadow: '0 12px 50px rgba(0, 0, 0, 0.08)',
            }}
          >
            {/* Bookmark/tab on left edge */}
            <div
              className="absolute top-0 left-0 bottom-0"
              style={{
                width: '8px',
                background: '#FFD1DC',
              }}
            />

            {/* Main content */}
            <div className="p-8 md:p-12 relative">
              {/* Decorative header banner */}
              <div className="flex items-center justify-center mb-8">
                <div
                  className="px-6 py-2 rounded-full font-dancing text-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 209, 220, 0.3) 0%, rgba(176, 224, 230, 0.3) 100%)',
                    color: '#70665b',
                  }}
                >
                  ✉ Surat Untukmu
                </div>
              </div>

              {/* Pressed flowers in corners */}
              <div className="absolute top-4 right-4 text-2xl opacity-20">🌸</div>
              <div className="absolute top-6 left-12 text-xl opacity-15">🌼</div>

              {/* Letter content */}
              <div className="space-y-5 text-base leading-relaxed" style={{ color: '#3d3229' }}>
                <p className="font-medium">
                  <span className="text-4xl font-semibold float-left mr-2 leading-none" style={{ color: '#8B7355' }}>U</span>
                  ntuk kamu yang sedang membaca ini,
                </p>
                
                <p>
                  Terima kasih sudah ada. Terima kasih sudah menjadi bagian dari hari-hari yang terasa lebih ringan ketika kamu ada di dalamnya.
                </p>
                
                <p>
                  Ada banyak hal yang ingin kuucapkan, tapi kadang kata-kata terasa terlalu kecil untuk isi hati yang terlalu penuh.
                </p>
                
                <p>
                  Jadi biarkan foto-foto itu yang berbicara — setiap momen adalah bukti bahwa waktu bersamamu adalah hadiah.
                </p>
                
                <p>
                  Semoga kamu tahu, betapapun jauhnya jarak atau sibuknya hari, kamu selalu ada di pikiran.
                </p>

                {/* Signature area */}
                <div className="pt-8 mt-8 border-t" style={{ borderColor: '#e8ddd0' }}>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-px" style={{ background: '#d4c4b8' }} />
                    <span className="mx-4 text-2xl" style={{ color: '#d4c4b8' }}>✦</span>
                    <div className="w-12 h-px" style={{ background: '#d4c4b8' }} />
                  </div>
                  <p className="font-caveat text-center text-xl md:text-2xl">
                    Dengan sepenuh hati,<br />
                    Seseorang yang peduli 
                    <span className="ml-2" style={{ color: '#FF6B9D' }}>♥</span>
                  </p>
                </div>
              </div>

              {/* Wax seal at bottom */}
              <div className="flex justify-center mt-8">
                <div
                  className="rounded-full flex items-center justify-center text-2xl"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: '#C97D7D',
                    color: '#FDFAF6',
                    boxShadow: '0 4px 12px rgba(201, 125, 125, 0.4)',
                  }}
                >
                  🌸
                </div>
              </div>

              {/* Decorative flower row */}
              <div className="flex items-center justify-center gap-3 mt-6 text-lg" style={{ color: '#FFD1DC', opacity: 0.6 }}>
                🌸 <span style={{ color: '#E8D5F5' }}>✿</span> 🌸 <span style={{ color: '#B0E0E6' }}>✿</span> 🌸
              </div>

              {/* Replay button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={onReplay}
                  className="text-xs font-light hover:opacity-70 transition-opacity"
                  style={{ color: '#9a8d82' }}
                  data-testid="button-replay"
                >
                  ↺ Ulangi dari awal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
