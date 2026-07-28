import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Hardcoded polaroid data
const polaroids = [
  { id: 1, image: "https://picsum.photos/seed/abc1/400/400", caption: "Pertama kali kita ke sini! 🌸", rotation: -5 },
  { id: 2, image: "https://picsum.photos/seed/abc2/400/400", caption: "Senyum paling manis sedunia ✨", rotation: 4 },
  { id: 3, image: "https://picsum.photos/seed/abc3/400/400", caption: "Untuk Risna tersayang...", rotation: -2 },
];

type Stage = 'welcome' | 'polaroids' | 'letter';

function App() {
  const [stage, setStage] = useState<Stage>('welcome');
  const [showButton, setShowButton] = useState(true);
  const [cards, setCards] = useState(polaroids);
  const [confetti, setConfetti] = useState<{ id: number; x: number; delay: number }[]>([]);

  const handleWelcomeClick = () => {
    setShowButton(false);
    setTimeout(() => setStage('polaroids'), 600);
  };

  const removeCard = (id: number) => {
    setCards(prev => {
      const newCards = prev.filter(card => card.id !== id);
      if (newCards.length === 0) {
        setTimeout(() => setStage('letter'), 300);
        // Trigger confetti
        const confettiPieces = Array.from({ length: 20 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 0.5,
        }));
        setConfetti(confettiPieces);
      }
      return newCards;
    });
  };

  return (
    <div className="min-h-[100dvh] w-full relative overflow-hidden" style={{ backgroundColor: '#FFFDD0' }}>
      {/* Accent blobs - fixed position, behind all content */}
      <div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          background: '#B0E0E6',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.5,
          transform: 'translate(-30%, -30%)',
        }}
      />
      <div
        className="fixed bottom-0 right-0 pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          background: '#FFD1DC',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.6,
          transform: 'translate(30%, 30%)',
        }}
      />

      {/* Stage content */}
      <AnimatePresence mode="wait">
        {stage === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[100dvh] w-full flex items-center justify-center"
          >
            <AnimatePresence>
              {showButton && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={handleWelcomeClick}
                  className="rounded-full w-44 h-44 flex items-center justify-center text-center cursor-pointer border-none outline-none focus:outline-none animate-pulse-gentle"
                  style={{
                    background: 'linear-gradient(135deg, #FFD1DC 0%, #B0E0E6 100%)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  }}
                  data-testid="button-welcome"
                >
                  <span className="text-lg font-medium px-6" style={{ color: '#3d3229' }}>
                    Ada sesuatu buat kamu...
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {stage === 'polaroids' && (
          <motion.div
            key="polaroids"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-4"
          >
            <div className="relative w-full max-w-sm h-96 mb-8">
              {cards.map((card, index) => (
                <PolaroidCard
                  key={card.id}
                  card={card}
                  isTop={index === cards.length - 1}
                  onRemove={() => removeCard(card.id)}
                  zIndex={index}
                />
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm"
              style={{ color: '#70665b' }}
            >
              Ketuk atau geser untuk melihat selanjutnya →
            </motion.p>
          </motion.div>
        )}

        {stage === 'letter' && (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[100dvh] w-full flex items-center justify-center px-4 py-12 relative"
          >
            {/* Floating confetti */}
            {confetti.map(piece => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: [0, 1, 1, 0], y: -100 }}
                transition={{
                  duration: 4,
                  delay: piece.delay,
                  ease: 'easeOut',
                }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${piece.x}%`,
                  bottom: '10%',
                  background: piece.id % 2 === 0 ? '#FFD1DC' : '#B0E0E6',
                }}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-full max-w-xl bg-white rounded-2xl p-10 md:p-12"
              style={{
                boxShadow: '0 8px 40px rgba(0, 0, 0, 0.06)',
              }}
            >
              <div className="space-y-5 text-base leading-relaxed" style={{ color: '#3d3229' }}>
                <p className="font-medium">Untuk kamu yang sedang membaca ini,</p>
                
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

                <div className="pt-6 mt-6 border-t" style={{ borderColor: '#f0e8e0' }}>
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-8 h-px" style={{ background: '#d4c4b8' }} />
                    <span className="mx-3 text-xl" style={{ color: '#d4c4b8' }}>✦</span>
                    <div className="w-8 h-px" style={{ background: '#d4c4b8' }} />
                  </div>
                  <p className="italic text-center">
                    Dengan sepenuh hati,<br />
                    Seseorang yang peduli 🌸
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface PolaroidCardProps {
  card: typeof polaroids[0];
  isTop: boolean;
  onRemove: () => void;
  zIndex: number;
}

function PolaroidCard({ card, isTop, onRemove, zIndex }: PolaroidCardProps) {
  const handleDragEnd = (_: any, info: any) => {
    const threshold = 100;
    const distance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
    
    if (distance > threshold) {
      onRemove();
    }
  };

  const handleTap = () => {
    if (isTop) {
      onRemove();
    }
  };

  return (
    <motion.div
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      initial={{ scale: 0.8, opacity: 0, rotate: card.rotation }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        rotate: card.rotation,
      }}
      exit={{ 
        x: 300,
        y: -100,
        rotate: card.rotation + 30,
        opacity: 0,
        transition: { duration: 0.5 }
      }}
      className="absolute top-1/2 left-1/2 bg-white p-4 pb-12 cursor-pointer touch-none"
      style={{
        width: '280px',
        transform: `translate(-50%, -50%)`,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        zIndex: zIndex,
      }}
      whileHover={isTop ? { scale: 1.02 } : {}}
      whileTap={isTop ? { scale: 0.98 } : {}}
      data-testid={`polaroid-${card.id}`}
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img 
          src={card.image} 
          alt={card.caption}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      <p 
        className="font-caveat text-center mt-3 text-lg"
        style={{ color: '#4a4a4a' }}
      >
        {card.caption}
      </p>
    </motion.div>
  );
}

export default App;
