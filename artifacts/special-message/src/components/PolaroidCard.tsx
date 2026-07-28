import { useState } from 'react';
import { motion } from 'framer-motion';

export interface PolaroidData {
  id: number;
  image: string;
  caption: string;
  message: string;
  rotation: number;
}

interface PolaroidCardProps {
  card: PolaroidData;
  isTop: boolean;
  onRemove: () => void;
  zIndex: number;
}

const CARD_WIDTH_DESKTOP = 280;
const CARD_WIDTH_MOBILE = 240;
const PHOTO_PADDING = 14;
const CAPTION_HEIGHT = 64;

const washibyId: Record<number, string> = {
  1: '#FFD1DC',
  2: '#B0E0E6',
  3: '#E8D5F5',
};

export default function PolaroidCard({ card, isTop, onRemove, zIndex }: PolaroidCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const cardWidth = isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP;
  const photoSize = cardWidth - PHOTO_PADDING * 2;
  const cardHeight = PHOTO_PADDING + photoSize + CAPTION_HEIGHT;
  const washiColor = washibyId[card.id] ?? '#FFD1DC';

  const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number } }) => {
    const distance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
    if (distance > 100) {
      onRemove();
    }
  };

  const handleTap = () => {
    if (!isTop) return;
    setIsFlipped((f) => !f);
  };

  return (
    // Static wrapper: handles centering — framer-motion won't touch this
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex,
        width: cardWidth,
        height: cardHeight,
      }}
    >
      {/* Drag + tilt wrapper */}
      <motion.div
        drag={isTop}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.65}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        initial={{ scale: 0.85, opacity: 0, rotate: card.rotation }}
        animate={{ scale: isTop ? 1 : 0.96, opacity: 1, rotate: card.rotation }}
        exit={{ x: 320, y: -160, rotate: card.rotation + 45, opacity: 0, transition: { duration: 0.55, ease: 'easeOut' } }}
        whileHover={isTop ? { scale: 1.025, rotate: card.rotation } : {}}
        style={{
          width: cardWidth,
          height: cardHeight,
          cursor: isTop ? 'grab' : 'default',
          touchAction: 'none',
          userSelect: 'none',
          // perspective lives here so the child's rotateY is visible
          perspective: '1200px',
        }}
      >
        {/* 3-D flip inner container */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            position: 'relative',
          }}
        >
          {/* ── FRONT FACE ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              backgroundColor: '#ffffff',
              padding: `${PHOTO_PADDING}px ${PHOTO_PADDING}px 0 ${PHOTO_PADDING}px`,
              boxShadow: '0 12px 35px rgba(0,0,0,0.09), inset 0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            {/* Washi tape */}
            <div
              style={{
                position: 'absolute',
                top: -9,
                left: '50%',
                transform: 'translateX(-50%) rotate(-2deg)',
                width: 80,
                height: 20,
                background: washiColor,
                opacity: 0.65,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderRadius: 2,
              }}
            />

            {/* Photo */}
            <div
              style={{
                width: photoSize,
                height: photoSize,
                overflow: 'hidden',
                backgroundColor: '#f0ebe6',
                position: 'relative',
              }}
            >
              <img
                src={card.image}
                alt={card.caption}
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {/* Postage stamp */}
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 30,
                  height: 38,
                  background: 'white',
                  border: '2px dashed rgba(139,115,85,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}
              >
                ✿
              </div>

              {card.id === 2 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    fontSize: 20,
                    color: '#FF6B9D',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
                  }}
                >
                  ♥
                </div>
              )}
            </div>

            {/* Caption */}
            <div
              style={{
                height: CAPTION_HEIGHT,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <p
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: 18,
                  color: '#4a4a4a',
                  textAlign: 'center',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {card.caption}
              </p>
              {isTop && (
                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 10,
                    color: '#b0a499',
                    margin: 0,
                    letterSpacing: '0.04em',
                  }}
                >
                  ketuk untuk membalik
                </p>
              )}
            </div>
          </div>

          {/* ── BACK FACE ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              backgroundColor: '#FEFAF6',
              backgroundImage:
                'repeating-linear-gradient(transparent, transparent 27px, rgba(176,161,148,0.15) 27px, rgba(176,161,148,0.15) 28px)',
              boxShadow: '0 12px 35px rgba(0,0,0,0.09), inset 0 1px 2px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 22px',
              gap: 12,
            }}
          >
            {/* Top label */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 28,
                background: washiColor,
                opacity: 0.45,
                borderBottom: `1px solid ${washiColor}`,
              }}
            />
            <p
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: 15,
                color: '#9a8072',
                margin: 0,
                position: 'absolute',
                top: 6,
                letterSpacing: '0.05em',
              }}
            >
              catatan kecil ✉
            </p>

            {/* Message */}
            <p
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: 20,
                color: '#3d3229',
                textAlign: 'center',
                lineHeight: 1.5,
                margin: 0,
                marginTop: 16,
              }}
            >
              {card.message}
            </p>

            {/* Bottom hint */}
            <p
              style={{
                position: 'absolute',
                bottom: 10,
                fontFamily: "'Poppins', sans-serif",
                fontSize: 10,
                color: '#b0a499',
                margin: 0,
                letterSpacing: '0.04em',
              }}
            >
              geser untuk melanjutkan →
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
