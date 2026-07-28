import { motion } from 'framer-motion';

interface PolaroidCardProps {
  card: {
    id: number;
    image: string;
    caption: string;
    rotation: number;
  };
  isTop: boolean;
  onRemove: () => void;
  zIndex: number;
  onPeek?: () => void;
}

export default function PolaroidCard({ card, isTop, onRemove, zIndex, onPeek }: PolaroidCardProps) {
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

  // Different decorations for each card
  const getCardDecoration = () => {
    switch (card.id) {
      case 1:
        return { stamp: true, heart: false, washiColor: '#FFD1DC' };
      case 2:
        return { stamp: true, heart: true, washiColor: '#B0E0E6' };
      case 3:
        return { stamp: true, heart: false, washiColor: '#E8D5F5' };
      default:
        return { stamp: true, heart: false, washiColor: '#FFD1DC' };
    }
  };

  const decoration = getCardDecoration();

  return (
    <motion.div
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      onDrag={onPeek}
      onTap={handleTap}
      initial={{ scale: 0.8, opacity: 0, rotate: card.rotation }}
      animate={{ 
        scale: isTop ? 1 : 0.96, 
        opacity: 1, 
        rotate: card.rotation,
      }}
      exit={{ 
        x: 300,
        y: -150,
        rotate: card.rotation + 40,
        opacity: 0,
        transition: { duration: 0.6, ease: 'easeOut' }
      }}
      className="absolute top-1/2 left-1/2 bg-white touch-none"
      style={{
        width: window.innerWidth < 768 ? '240px' : '280px',
        transform: `translate(-50%, -50%)`,
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.09), inset 0 1px 2px rgba(0, 0, 0, 0.05)',
        zIndex: zIndex,
        cursor: isTop ? 'grab' : 'default',
        padding: '14px 14px 52px 14px',
      }}
      whileHover={isTop ? { scale: 1.03, rotate: card.rotation } : {}}
      whileTap={isTop ? { scale: 0.98, cursor: 'grabbing' } : {}}
      data-testid={`polaroid-${card.id}`}
    >
      {/* Washi tape strip at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: '80px',
          height: '20px',
          background: decoration.washiColor,
          opacity: 0.6,
          transform: 'translateX(-50%) rotate(-2deg) translateY(-8px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      />

      {/* Photo area */}
      <div className="aspect-square w-full overflow-hidden bg-gray-100 relative">
        <img 
          src={card.image} 
          alt={card.caption}
          className="w-full h-full object-cover"
          draggable={false}
        />
        
        {/* Postage stamp decoration */}
        {decoration.stamp && (
          <div
            className="absolute top-2 right-2 bg-white"
            style={{
              width: '30px',
              height: '38px',
              border: '2px dashed rgba(139, 115, 85, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            ✿
          </div>
        )}
        
        {/* Heart sticker */}
        {decoration.heart && (
          <div
            className="absolute bottom-2 left-2"
            style={{
              fontSize: '20px',
              color: '#FF6B9D',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
            }}
          >
            ♥
          </div>
        )}
      </div>

      {/* Caption area with lined texture */}
      <div 
        className="lined-caption pt-3"
        style={{
          minHeight: '38px',
        }}
      >
        <p 
          className="font-caveat text-center text-lg md:text-xl"
          style={{ color: '#4a4a4a' }}
        >
          {card.caption}
        </p>
      </div>
    </motion.div>
  );
}
