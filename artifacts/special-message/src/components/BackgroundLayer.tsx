import { motion } from 'framer-motion';

// Small notebook-margin doodles — hearts, stars, tiny flowers scattered in the margin
const marginDoodles = [
  { id: 0, symbol: '♡', y: '8%',  size: 13, color: '#FFB7C5', rotate: -12 },
  { id: 1, symbol: '✦', y: '18%', size: 9,  color: '#FADA5E', rotate: 8 },
  { id: 2, symbol: '✿', y: '31%', size: 11, color: '#FFB7C5', rotate: -5 },
  { id: 3, symbol: '◇', y: '44%', size: 8,  color: '#FADA5E', rotate: 15 },
  { id: 4, symbol: '♡', y: '57%', size: 10, color: '#FFB7C5', rotate: 6 },
  { id: 5, symbol: '✦', y: '69%', size: 7,  color: '#FADA5E', rotate: -20 },
  { id: 6, symbol: '✿', y: '80%', size: 12, color: '#FFB7C5', rotate: 10 },
  { id: 7, symbol: '◇', y: '91%', size: 8,  color: '#FADA5E', rotate: -8 },
];

// Spiral holes down the left spine
const holeCount = 16;
const holes = Array.from({ length: holeCount }, (_, i) => ({
  id: i,
  top: `${4 + (i / (holeCount - 1)) * 92}%`,
}));

// Pastel sticky-note / washi-tape accent blocks
const accents = [
  // Top-right sticky note corner
  {
    id: 'sticky-tr',
    style: {
      position: 'absolute' as const,
      top: 0,
      right: 60,
      width: 120,
      height: 110,
      background: '#FFF9C4',
      boxShadow: '2px 3px 8px rgba(0,0,0,0.07)',
      transform: 'rotate(2deg)',
      transformOrigin: 'top right',
      borderBottom: '1px solid rgba(0,0,0,0.04)',
    },
  },
  // Bottom-left sticky note
  {
    id: 'sticky-bl',
    style: {
      position: 'absolute' as const,
      bottom: 40,
      left: 90,
      width: 90,
      height: 80,
      background: '#FFE4EC',
      boxShadow: '2px 3px 8px rgba(0,0,0,0.06)',
      transform: 'rotate(-3deg)',
      transformOrigin: 'bottom left',
    },
  },
  // Pink washi tape strip top-left
  {
    id: 'washi-tl',
    style: {
      position: 'absolute' as const,
      top: 30,
      left: 100,
      width: 160,
      height: 22,
      background: 'repeating-linear-gradient(90deg, #FFB7C5 0px, #FFB7C5 12px, #FFCDD7 12px, #FFCDD7 24px)',
      opacity: 0.55,
      transform: 'rotate(-1.5deg)',
      borderRadius: 2,
    },
  },
  // Yellow washi tape strip bottom-right
  {
    id: 'washi-br',
    style: {
      position: 'absolute' as const,
      bottom: 60,
      right: 80,
      width: 140,
      height: 20,
      background: 'repeating-linear-gradient(90deg, #FADA5E 0px, #FADA5E 10px, #FFE97A 10px, #FFE97A 20px)',
      opacity: 0.5,
      transform: 'rotate(1.5deg)',
      borderRadius: 2,
    },
  },
  // Small pink tape strip mid-right
  {
    id: 'washi-mr',
    style: {
      position: 'absolute' as const,
      top: '45%',
      right: 30,
      width: 100,
      height: 18,
      background: 'repeating-linear-gradient(90deg, #FFD6E8 0px, #FFD6E8 8px, #FFBDD4 8px, #FFBDD4 16px)',
      opacity: 0.45,
      transform: 'rotate(-2deg)',
      borderRadius: 2,
    },
  },
];

export default function BackgroundLayer() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0, backgroundColor: '#FFFFFF' }}
    >
      {/* ── Ruled lines ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            transparent,
            transparent 31px,
            #FFE0E8 31px,
            #FFE0E8 32px
          )`,
          backgroundSize: '100% 32px',
          backgroundPositionY: '24px',
          opacity: 0.55,
        }}
      />

      {/* ── Left margin strip (light pink tint) ── */}
      <div
        className="absolute top-0 bottom-0 left-0"
        style={{ width: 68, background: '#FFF0F4' }}
      />

      {/* ── Margin rule line (pink vertical) ── */}
      <div
        className="absolute top-0 bottom-0"
        style={{ left: 68, width: 2, background: '#FFAABB', opacity: 0.45 }}
      />

      {/* ── Spiral holes ── */}
      {holes.map((hole) => (
        <div
          key={hole.id}
          style={{
            position: 'absolute',
            top: hole.top,
            left: 12,
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '2px solid #F0C0CC',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
          }}
        />
      ))}

      {/* ── Spiral wire between holes (decorative dashes) ── */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: 19,
          width: 2,
          backgroundImage: 'repeating-linear-gradient(to bottom, #F0C0CC 0px, #F0C0CC 18px, transparent 18px, transparent 22px)',
          opacity: 0.4,
        }}
      />

      {/* ── Margin doodles ── */}
      {marginDoodles.map((d) => (
        <motion.div
          key={d.id}
          animate={{ y: [0, -4, 0], rotate: [d.rotate, d.rotate + 4, d.rotate] }}
          transition={{ duration: 4 + d.id * 0.7, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: d.y,
            left: 20,
            fontSize: d.size,
            color: d.color,
            transform: `rotate(${d.rotate}deg)`,
            opacity: 0.7,
          }}
        >
          {d.symbol}
        </motion.div>
      ))}

      {/* ── Sticky notes & washi tape ── */}
      {accents.map((a) => (
        <div key={a.id} style={a.style} />
      ))}

      {/* ── Sticky note lines (on the yellow top-right sticky note) ── */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          right: 64,
          width: 88,
          height: 60,
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 13px, rgba(180,160,0,0.15) 13px, rgba(180,160,0,0.15) 14px)',
          transform: 'rotate(2deg)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Corner dog-ears ── */}
      {/* Top-right page fold */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: '0 36px 36px 0',
          borderColor: 'transparent #FFE0E8 transparent transparent',
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: '36px 36px 0 0',
          borderColor: '#F5F5F5 transparent transparent transparent',
          filter: 'drop-shadow(-1px 1px 2px rgba(0,0,0,0.08))',
        }}
      />
    </div>
  );
}
